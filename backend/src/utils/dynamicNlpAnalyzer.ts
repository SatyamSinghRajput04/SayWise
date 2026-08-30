import { GrammarFeedbackItem, VocabularySuggestionItem, CEFRLevel } from '../types/index.js';

export function runRuleBasedGrammarScanner(transcript: string): GrammarFeedbackItem[] {
  const candidates: GrammarFeedbackItem[] = [];
  const text = transcript.trim();
  const lower = text.toLowerCase();

  // Helper to push candidate
  const addCandidate = (
    matchStr: string,
    betterStr: string,
    whyStr: string,
    category: GrammarFeedbackItem['category'],
    severity: GrammarFeedbackItem['severity'] = 'major',
    type: GrammarFeedbackItem['type'] = 'error'
  ) => {
    candidates.push({
      id: `rule_${category.toLowerCase().replace(/\s+/g, '_')}_${candidates.length + 1}`,
      original: matchStr,
      better: betterStr,
      why: whyStr,
      category,
      type,
      severity,
      confidence: 0.95,
      source: 'rule',
    });
  };

  // 1. PREPOSITIONS
  const discussAbout = lower.match(/\b(discuss(?:ed|ing)?)\s+about\b/);
  if (discussAbout) {
    addCandidate(discussAbout[0], discussAbout[1], '"Discuss" is a transitive verb that takes an object directly without "about".', 'Preposition', 'major');
  }

  const dependOf = lower.match(/\b(depend(?:s|ed|ing)?)\s+of\b/);
  if (dependOf) {
    addCandidate(dependOf[0], `${dependOf[1]} on`, 'The standard English preposition after "depend" is "on", not "of".', 'Preposition', 'major');
  }

  const goodIn = lower.match(/\bgood\s+in\s+(english|speaking|math|maths|programming|coding|music|sports|playing)\b/);
  if (goodIn) {
    addCandidate(goodIn[0], `good at ${goodIn[1]}`, 'Use "good at" when referring to proficiency in a skill, subject, or activity.', 'Preposition', 'minor');
  }

  const listenObject = lower.match(/\blisten\s+(the\s+[a-z]+|a\s+[a-z]+|my\s+[a-z]+|music|radio|podcasts?)\b/);
  if (listenObject) {
    addCandidate(listenObject[0], `listen to ${listenObject[1]}`, '"Listen" requires the preposition "to" before a direct object.', 'Preposition', 'major');
  }

  const marriedWith = lower.match(/\bmarried\s+with\b/);
  if (marriedWith) {
    addCandidate(marriedWith[0], 'married to', 'In English, a person is "married to" someone, not "with".', 'Preposition', 'minor');
  }

  // 2. COLLOCATIONS
  const doMistake = lower.match(/\b(did|do|doing|done|does)\s+(an?\s+)?mistakes?\b/);
  if (doMistake) {
    const verb = doMistake[1] === 'did' ? 'made' : doMistake[1] === 'doing' ? 'making' : 'make';
    addCandidate(doMistake[0], `${verb} a mistake`, 'The natural English collocation is "make a mistake", not "do a mistake".', 'Collocation', 'major');
  }

  const giveExam = lower.match(/\b(give|giving|gave|given)\s+(an?\s+)?(exam|examination|test)\b/);
  if (giveExam) {
    const verb = giveExam[1] === 'gave' ? 'took' : giveExam[1] === 'giving' ? 'taking' : 'take';
    addCandidate(giveExam[0], `${verb} an ${giveExam[3]}`, 'Students "take" or "sit" an exam; examiners "give" exams.', 'Collocation', 'major');
  }

  const makeResearch = lower.match(/\b(make|making|made)\s+(a\s+)?research\b/);
  if (makeResearch) {
    const verb = makeResearch[1] === 'made' ? 'conducted' : 'conduct';
    addCandidate(makeResearch[0], `${verb} research`, 'We "conduct", "carry out", or "do" research.', 'Collocation', 'major');
  }

  const payAttentionOn = lower.match(/\bpay\s+attention\s+on\b/);
  if (payAttentionOn) {
    addCandidate(payAttentionOn[0], 'pay attention to', 'The correct collocation is "pay attention to".', 'Collocation', 'minor');
  }

  // 3. TENSE & FINISHED TIME MARKERS
  const presPerfPastYear = text.match(/\b(have|has)\s+([a-z]+ed|been(?:\s+to)?|visited|seen|met|lived|gone)\s+(?:in|on)\s+(19\d\d|20\d\d)\b/i);
  if (presPerfPastYear) {
    const verb = presPerfPastYear[2].replace(/^been\s+to/, 'went to').replace(/^been/, 'was');
    addCandidate(presPerfPastYear[0], `${verb} in ${presPerfPastYear[3]}`, `"${presPerfPastYear[3]}" refers to a finished past time, so simple past is required instead of present perfect.`, 'Tense', 'major');
  }

  const sinceAgo = lower.match(/\b(since|for)\s+(\d+|two|three|four|five)\s+(years|months|days)\s+ago\b/);
  if (sinceAgo) {
    addCandidate(sinceAgo[0], `for ${sinceAgo[2]} ${sinceAgo[3]}`, 'Do not combine "since/for" with "ago" when describing duration.', 'Tense', 'minor');
  }

  // 4. COUNTABILITY & NON-COUNT NOUNS
  const advices = lower.match(/\b(an?\s+)?advices\b/);
  if (advices) {
    addCandidate(advices[0], 'advice / pieces of advice', '"Advice" is an uncountable noun and does not have a plural form.', 'Countability', 'major');
  }

  const informations = lower.match(/\b(an?\s+)?informations\b/);
  if (informations) {
    addCandidate(informations[0], 'information / pieces of information', '"Information" is uncountable in standard English.', 'Countability', 'major');
  }

  const feedbacks = lower.match(/\b(an?\s+)?feedbacks\b/);
  if (feedbacks) {
    addCandidate(feedbacks[0], 'feedback / pieces of feedback', '"Feedback" is uncountable and takes no plural form.', 'Countability', 'minor');
  }

  const equipments = lower.match(/\b(an?\s+)?equipments\b/);
  if (equipments) {
    addCandidate(equipments[0], 'equipment / pieces of equipment', '"Equipment" is an uncountable collective noun.', 'Countability', 'major');
  }

  // 5. SUBJECT-VERB & QUANTIFIER AGREEMENT
  const oneOfMySingular = lower.match(/\bone\s+of\s+my\s+(friend|colleague|teacher|student|problem|goal|brother|sister|reason)\b/);
  if (oneOfMySingular) {
    addCandidate(oneOfMySingular[0], `one of my ${oneOfMySingular[1]}s`, '"One of..." refers to a single item from a group, so the noun must be plural.', 'Subject-Verb', 'major');
  }

  const indefPronounPlural = lower.match(/\b(everybody|everyone|anyone|someone|nobody)\s+(were|are|have|do)\b/);
  if (indefPronounPlural) {
    const correct = indefPronounPlural[2] === 'were' ? 'was' : indefPronounPlural[2] === 'are' ? 'is' : indefPronounPlural[2] === 'have' ? 'has' : 'does';
    addCandidate(indefPronounPlural[0], `${indefPronounPlural[1]} ${correct}`, 'Singular indefinite pronouns take singular verb agreements.', 'Subject-Verb', 'major');
  }

  const pluralNounSingularVerb = lower.match(/\b(teachers|students|people|children|workers|colleagues)\s+(has|is|was)\b/);
  if (pluralNounSingularVerb) {
    const correct = pluralNounSingularVerb[2] === 'has' ? 'have' : pluralNounSingularVerb[2] === 'is' ? 'are' : 'were';
    addCandidate(pluralNounSingularVerb[0], `${pluralNounSingularVerb[1]} ${correct}`, 'Plural subjects require plural verbs in standard English.', 'Subject-Verb', 'major');
  }

  // 6. SENTENCE STRUCTURE & CONJUNCTIONS
  const becauseSo = text.match(/\bBecause\s+([^,]+),?\s+so\s+([^.!?]+)/i);
  if (becauseSo) {
    addCandidate(becauseSo[0], `Because ${becauseSo[1].trim()}, ${becauseSo[2].trim()}`, 'Avoid using "because" and "so" together in the same cause-and-effect sentence.', 'Sentence Structure', 'major', 'style');
  }

  const althoughBut = text.match(/\bAlthough\s+([^,]+),?\s+but\s+([^.!?]+)/i);
  if (althoughBut) {
    addCandidate(althoughBut[0], `Although ${althoughBut[1].trim()}, ${althoughBut[2].trim()}`, 'Do not use "although" and "but" in the same clause structure.', 'Sentence Structure', 'major', 'style');
  }

  // 7. REDUNDANCY & MODALS
  const canAble = lower.match(/\b(can|could)\s+(?:be\s+)?able\s+to\b/);
  if (canAble) {
    addCandidate(canAble[0], 'can / is able to', 'Do not combine "can" and "able to" together as they express the same modal concept.', 'Redundancy', 'minor');
  }

  const moreComparative = lower.match(/\bmore\s+(better|faster|easier|cheaper|stronger|smarter|harder)\b/);
  if (moreComparative) {
    addCandidate(moreComparative[0], moreComparative[1], 'Avoid double comparatives; the single comparative form is sufficient.', 'Redundancy', 'minor');
  }

  const returnBack = lower.match(/\breturn\s+back\b/);
  if (returnBack) {
    addCandidate(returnBack[0], 'return / go back', '"Return back" is redundant; use either "return" or "go back".', 'Redundancy', 'minor', 'style');
  }

  // 8. ARTICLES & PROFESSIONS
  const workAsNoArticle = lower.match(/\bwork(?:s|ed|ing)?\s+as\s+(doctor|teacher|engineer|developer|nurse|lawyer|manager|designer|driver)\b/);
  if (workAsNoArticle) {
    const article = /^[aeiou]/.test(workAsNoArticle[1]) ? 'an' : 'a';
    addCandidate(workAsNoArticle[0], `work as ${article} ${workAsNoArticle[1]}`, 'Singular profession titles require an indefinite article (a/an).', 'Article', 'minor');
  }

  return candidates;
}

export function analyzeTranscriptLinguistics(transcript: string, topicTitle: string): {
  scores: {
    overall: number;
    grammar: number;
    vocabulary: number;
    fluency: number;
    cefrLevel: CEFRLevel;
    ieltsBandEstimate: number;
  };
  grammarFeedback: GrammarFeedbackItem[];
  vocabularySuggestions: VocabularySuggestionItem[];
  whatYouDidWell: string[];
  areasToImprove: string[];
  actionPlan: string[];
} {
  const grammarCandidates = runRuleBasedGrammarScanner(transcript);

  // Dynamic Lexical Analyzer
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z]/g, ''))).size;
  const lexicalDiversity = wordCount > 0 ? uniqueWords / wordCount : 0.7;

  const vocabMap: Record<string, { better: string; why: string; cefrLevel: CEFRLevel }> = {
    very: { better: 'exceptionally', why: 'Strengthens emphasis without basic intensifiers.', cefrLevel: 'B2' },
    good: { better: 'exceptional', why: 'More precise and highlights high quality.', cefrLevel: 'C1' },
    bad: { better: 'adverse', why: 'Academic descriptor for negative conditions.', cefrLevel: 'C1' },
    important: { better: 'paramount', why: 'Elevates critical importance in spoken discourse.', cefrLevel: 'C2' },
    interesting: { better: 'engaging', why: 'More expressive and vivid.', cefrLevel: 'B2' },
    help: { better: 'facilitate', why: 'Formal word for enabling smooth progress.', cefrLevel: 'C1' },
    change: { better: 'transform', why: 'Indicates profound, structural evolution.', cefrLevel: 'B2' },
    problem: { better: 'obstacle', why: 'Framed constructively around challenges.', cefrLevel: 'B2' },
    think: { better: 'postulate', why: 'Formal terminology for presenting perspectives.', cefrLevel: 'C2' },
    many: { better: 'a multitude of', why: 'Demonstrates lexical breadth.', cefrLevel: 'C1' },
  };

  const vocabularySuggestions: VocabularySuggestionItem[] = [];
  const lowerWords = words.map((w) => w.toLowerCase().replace(/[^a-z]/g, ''));

  for (const [target, suggestion] of Object.entries(vocabMap)) {
    if (lowerWords.includes(target)) {
      vocabularySuggestions.push({
        id: `v_${target}`,
        original: target,
        better: suggestion.better,
        why: suggestion.why,
        cefrLevel: suggestion.cefrLevel,
      });
      if (vocabularySuggestions.length >= 3) break;
    }
  }

  // Calculate deterministic scores
  const errorCount = grammarCandidates.filter((g) => g.type === 'error').length;
  const grammarScore = Math.max(50, Math.min(98, 96 - errorCount * 7));
  const vocabScore = Math.min(95, Math.round(75 + lexicalDiversity * 25));
  const overallScore = Math.round((grammarScore + vocabScore + 75) / 3);

  const cefrLevel: CEFRLevel = overallScore >= 85 ? 'C1' : overallScore >= 75 ? 'B2' : overallScore >= 60 ? 'B1' : 'A2';
  const ieltsBandEstimate = overallScore >= 85 ? 8.0 : overallScore >= 75 ? 7.0 : overallScore >= 60 ? 6.0 : 5.0;

  return {
    scores: {
      overall: overallScore,
      grammar: grammarScore,
      vocabulary: vocabScore,
      fluency: 75,
      cefrLevel,
      ieltsBandEstimate,
    },
    grammarFeedback: grammarCandidates,
    vocabularySuggestions,
    whatYouDidWell: [
      `Spoke clearly with a vocabulary variety ratio of ${Math.round(lexicalDiversity * 100)}%.`,
      `Structured complete thoughts addressing the prompt: "${topicTitle}".`,
    ],
    areasToImprove: grammarCandidates.length > 0
      ? [grammarCandidates[0].why, 'Upgrade frequent basic terms with advanced academic synonyms.']
      : ['Incorporate more complex subordinating conjunctions.', 'Enhance lexical density with C1 descriptors.'],
    actionPlan: [
      'Practice 90-second response drills targeting correct prepositions and collocations.',
      'Replace basic adjectives with C1 academic synonyms.',
      'Maintain consistent speaking rhythm targeting 120–140 words per minute.',
    ],
  };
}
