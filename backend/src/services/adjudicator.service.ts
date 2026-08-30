import { GrammarFeedbackItem, GrammarSummary, LinguisticCategory } from '../types/index.js';

export class AdjudicatorService {
  adjudicateGrammar(
    ruleCandidates: GrammarFeedbackItem[],
    llmCandidates: GrammarFeedbackItem[],
    transcript: string
  ): {
    finalItems: GrammarFeedbackItem[];
    grammarSummary: GrammarSummary;
    deterministicGrammarScore: number;
  } {
    const merged: GrammarFeedbackItem[] = [];
    const usedLlmIndices = new Set<number>();
    const usedRuleIndices = new Set<number>();

    // 1. Fuzzy Token Span Matching & Deduplication
    ruleCandidates.forEach((r, rIdx) => {
      const rTokens = new Set(r.original.toLowerCase().split(/\s+/).filter(Boolean));

      llmCandidates.forEach((l, lIdx) => {
        if (usedLlmIndices.has(lIdx)) return;

        const lTokens = new Set(l.original.toLowerCase().split(/\s+/).filter(Boolean));
        let common = 0;
        rTokens.forEach((tok) => {
          if (lTokens.has(tok)) common++;
        });

        const overlap = common / Math.min(rTokens.size, lTokens.size);
        const isSubstring =
          r.original.toLowerCase().includes(l.original.toLowerCase()) ||
          l.original.toLowerCase().includes(r.original.toLowerCase());

        if (overlap >= 0.5 || isSubstring) {
          // Consensus reached: elevate to source 'both'
          usedRuleIndices.add(rIdx);
          usedLlmIndices.add(lIdx);

          merged.push({
            id: `adj_both_${merged.length + 1}`,
            original: l.original.length >= r.original.length ? l.original : r.original,
            better: l.better || r.better,
            why: l.why || r.why,
            category: r.category || l.category,
            type: r.type === 'error' || l.type === 'error' ? 'error' : 'style',
            severity:
              r.severity === 'critical' || l.severity === 'critical'
                ? 'critical'
                : r.severity === 'major' || l.severity === 'major'
                ? 'major'
                : 'minor',
            confidence: Math.max(r.confidence, l.confidence, 0.96),
            source: 'both',
          });
        }
      });
    });

    // Add remaining unmerged rule candidates
    ruleCandidates.forEach((r, rIdx) => {
      if (!usedRuleIndices.has(rIdx)) {
        merged.push({ ...r, id: `adj_rule_${merged.length + 1}` });
      }
    });

    // Add remaining unmerged LLM candidates
    llmCandidates.forEach((l, lIdx) => {
      if (!usedLlmIndices.has(lIdx)) {
        merged.push({ ...l, id: `adj_llm_${merged.length + 1}` });
      }
    });

    // 2. Product Confidence Gating & Thresholding
    const CONFIDENCE_THRESHOLD = 0.70;
    const finalItems = merged.filter((item) => {
      // Must meet confidence threshold
      if (item.confidence < CONFIDENCE_THRESHOLD) return false;
      // Filter out self-contradictory items (where original === better)
      if (item.original.trim().toLowerCase() === item.better.trim().toLowerCase()) return false;
      return true;
    });

    // Sort by severity (critical > major > minor) and confidence
    const severityWeight = { critical: 3, major: 2, minor: 1 };
    finalItems.sort((a, b) => {
      const diff = severityWeight[b.severity] - severityWeight[a.severity];
      if (diff !== 0) return diff;
      return b.confidence - a.confidence;
    });

    // 3. Deterministic Grammar Score Calculation
    let criticalCount = 0;
    let majorCount = 0;
    let minorCount = 0;

    finalItems.forEach((item) => {
      if (item.type === 'error') {
        if (item.severity === 'critical') criticalCount++;
        else if (item.severity === 'major') majorCount++;
        else if (item.severity === 'minor') minorCount++;
      }
    });

    const penalty = criticalCount * 12 + majorCount * 7 + minorCount * 3;
    const deterministicGrammarScore = Math.max(50, Math.min(98, 98 - penalty));

    // 4. Construct Positive Reinforcements (What You Did Well)
    const categoryErrors: Record<string, number> = {};
    finalItems.forEach((item) => {
      categoryErrors[item.category] = (categoryErrors[item.category] || 0) + (item.type === 'error' ? 2 : 1);
    });

    const whatYouDidWell: string[] = [];
    if (!categoryErrors['Subject-Verb']) {
      whatYouDidWell.push('✓ Strong subject-verb consistency throughout your response.');
    }
    if (!categoryErrors['Tense']) {
      whatYouDidWell.push('✓ Stable verb tense usage across narrative clauses.');
    }
    if (!categoryErrors['Sentence Structure']) {
      whatYouDidWell.push('✓ Clear clause connections without fragmented run-on sentences.');
    }
    if (whatYouDidWell.length < 2) {
      whatYouDidWell.push('✓ Spoke clearly addressing the prompt with natural momentum.');
    }

    // 5. Biggest Improvement Focus
    let topCategory: LinguisticCategory = 'Preposition';
    let maxErrors = 0;
    for (const [cat, count] of Object.entries(categoryErrors)) {
      if (count > maxErrors) {
        maxErrors = count;
        topCategory = cat as LinguisticCategory;
      }
    }

    const focusMap: Record<LinguisticCategory, string> = {
      Preposition: 'Focus on dependent prepositions (e.g. "discuss something", "good at").',
      Collocation: 'Practice natural verb-noun collocations (e.g. "make a mistake", "take an exam").',
      Tense: 'Ensure simple past is used for finished past time references.',
      'Subject-Verb': 'Pay attention to quantifier and indefinite pronoun agreement.',
      Article: 'Practice indefinite article usage (a/an) before singular professions.',
      Countability: 'Review non-count nouns (e.g. "advice", "information", "feedback").',
      Redundancy: 'Eliminate double comparatives and redundant modal verbs.',
      'Sentence Structure': 'Avoid combining coordinating conjunctions (e.g. "because... so...").',
    };

    const biggestImprovementFocus = maxErrors > 0
      ? focusMap[topCategory] || 'Refine preposition accuracy and spoken collocations.'
      : 'Maintain high grammatical accuracy and incorporate advanced C1 connectors.';

    const grammarSummary: GrammarSummary = {
      totalIssues: finalItems.length,
      errorsCount: finalItems.filter((i) => i.type === 'error').length,
      styleCount: finalItems.filter((i) => i.type === 'style').length,
      severityBreakdown: {
        critical: criticalCount,
        major: majorCount,
        minor: minorCount,
      },
      whatYouDidWell,
      biggestImprovementFocus,
    };

    return {
      finalItems,
      grammarSummary,
      deterministicGrammarScore,
    };
  }
}

export const adjudicatorService = new AdjudicatorService();
