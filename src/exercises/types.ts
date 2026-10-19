export type Result = {
  correct: boolean
  bonus?: boolean
  detail: string
  // Places the learner has now seen on the map, for the home map.
  places?: string[]
}

export type Evaluate = () => Result

export type ExerciseProps<E> = {
  exercise: E
  checked: boolean
  // Called with an evaluator once the learner has given an answer, or null to clear it.
  setAnswer: (evaluate: Evaluate | null) => void
}
