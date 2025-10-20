// Calculate AI credits for a price
export function calculateAICredits(priceInCents: number, profitMargin: number = 12): number {
  const priceInDollars = priceInCents / 100;
  return Math.max(0, priceInDollars - profitMargin);
}
