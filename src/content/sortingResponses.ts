export const sortingCorrectResponses = [
  "Hmm... yes...",
  "The Hat remembers...",
  "Exactly as it happened...",
  "Quite right...",
  "Memory serves you well...",
] as const;

export const sortingIncorrectResponses = [
  "Not quite...",
  "Memory is a curious thing...",
  "Even witches forget...",
  "Close... but not this time...",
  "Almost...",
] as const;

export function pickSortingResponse(responses: readonly string[]): string {
  return responses[Math.floor(Math.random() * responses.length)]!;
}
