export const showGuess = (word: string, guesses: string[]): string => {
  return word
    .split(' ')
    .join('/')
    .split('')
    .map(letter => (guesses.indexOf(letter.toLowerCase()) < 0 ? '_' : letter))
    .join(' ')
}

export const wrongGuess = (word: string, guess: string): boolean => {
  return (
    word
      .toLowerCase()
      .split(' ')
      .join('')
      .indexOf(guess) === -1
  )
}

export const isWinner = (word: string, guesses: string[]): boolean => {
  return (
    word
      .toLowerCase()
      .split('')
      .filter(char => char.match(/[a-z0-9]+/g))
      .filter(char => !guesses.includes(char)).length === 0
  )
}
