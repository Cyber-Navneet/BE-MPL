import { evaluateAnswer } from './answerEvaluator.js'

const percent = (earned, possible) => (possible === 0 ? 0 : Math.round((earned / possible) * 100))

// Builds the full result from the questions, the saved answers and the timing.
// The denominator is the sum of each question's points, not the question count.
export function computeResult({ questions, answers, startedAt, submittedAt, passingScore }) {
  const items = questions.map((question) => ({ questionId: question.id, answer: answers[question.id] ?? '', ...evaluateAnswer(question, answers[question.id]) }))

  const pointsEarned = items.reduce((sum, item) => sum + item.scoreAwarded, 0)
  const pointsPossible = items.reduce((sum, item) => sum + item.maxPoints, 0)
  const percentage = percent(pointsEarned, pointsPossible)
  const mcqItems = items.filter((_, index) => questions[index].type === 'mcq')
  const shortItems = items.filter((_, index) => questions[index].type === 'short_answer')
  const needsReviewCount = items.filter((item) => item.needsReview).length

  const bySkill = new Map()
  questions.forEach((question, index) => {
    const entry = bySkill.get(question.skill) ?? { skill: question.skill, earned: 0, possible: 0, questions: 0 }
    entry.earned += items[index].scoreAwarded
    entry.possible += items[index].maxPoints
    entry.questions += 1
    bySkill.set(question.skill, entry)
  })

  return {
    totalQuestions: questions.length,
    answered: items.filter((item) => item.answered).length,
    unanswered: items.filter((item) => !item.answered).length,
    mcqCorrect: mcqItems.filter((item) => item.isCorrect).length,
    mcqIncorrect: mcqItems.filter((item) => item.answered && !item.isCorrect).length,
    shortAnswerEvaluated: shortItems.filter((item) => item.answered).length,
    shortAnswerTotal: shortItems.length,
    needsReviewCount,
    provisional: needsReviewCount > 0,
    pointsEarned,
    pointsPossible,
    percentage,
    passingScore,
    passed: percentage >= passingScore,
    timeTakenSeconds: Math.max(0, Math.round((submittedAt - startedAt) / 1000)),
    skills: [...bySkill.values()].map((entry) => ({ ...entry, percentage: percent(entry.earned, entry.possible) })),
    items,
  }
}
