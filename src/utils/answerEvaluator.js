// Deterministic, rule-based answer evaluation. Candidate answers are only compared as text:
// nothing is ever executed (no eval/new Function). This is a transparent rubric, not a
// secure code-execution sandbox or an AI grader; it can be swapped for a backend evaluator.

// Lower-case, collapse whitespace, and drop harmless wrapping (quotes, backticks, trailing ; or .).
export function normalizeAnswer(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[`'"]+|[`'"]+$/g, '')
    .replace(/[;.]+$/, '')
    .trim()
}

export function evaluateMcq(question, answer) {
  const answered = typeof answer === 'string' && answer !== ''
  const isCorrect = answered && answer === question.correctAnswer
  return {
    scoreAwarded: isCorrect ? question.points : 0,
    maxPoints: question.points,
    answered,
    isCorrect,
    needsReview: false,
    feedback: !answered ? 'Not answered.' : isCorrect ? 'Correct.' : `Incorrect. The correct answer is "${question.correctAnswer}".`,
  }
}

export function evaluateShortAnswer(question, answer) {
  const normalized = normalizeAnswer(answer)
  const maxPoints = question.points
  const base = { maxPoints, answered: normalized !== '', criteria: [] }

  if (!normalized) {
    return { ...base, scoreAwarded: 0, isCorrect: false, needsReview: false, feedback: 'Not answered.' }
  }

  if (question.acceptedAnswers.some((accepted) => normalizeAnswer(accepted) === normalized)) {
    return {
      ...base,
      criteria: question.evaluationCriteria.map((label) => ({ label, met: true })),
      scoreAwarded: maxPoints,
      isCorrect: true,
      needsReview: false,
      feedback: 'Matches an accepted answer.',
    }
  }

  const criteria = question.rubric.map((rule) => ({ label: rule.label, points: rule.points, met: rule.pattern.test(normalized) }))
  const allMet = criteria.length > 0 && criteria.every((criterion) => criterion.met)
  const earned = criteria.filter((criterion) => criterion.met).reduce((sum, criterion) => sum + criterion.points, 0)
  const scoreAwarded = allMet ? maxPoints : question.partialCredit ? Math.min(earned, maxPoints) : 0
  const needsReview = scoreAwarded === 0 && question.reviewIfUnmatched

  let feedback
  if (allMet) feedback = 'All evaluation criteria were met.'
  else if (needsReview) feedback = 'Could not be verified automatically against the rubric; flagged for manual review.'
  else if (scoreAwarded > 0) {
    const missed = criteria.filter((criterion) => !criterion.met).map((criterion) => criterion.label.toLowerCase())
    feedback = `Partially correct. Missing: ${missed.join('; ')}.`
  } else feedback = 'Does not match the expected answer.'

  return { ...base, criteria, scoreAwarded, isCorrect: allMet, needsReview, feedback }
}

export function evaluateAnswer(question, answer) {
  return question.type === 'mcq' ? evaluateMcq(question, answer) : evaluateShortAnswer(question, answer)
}
