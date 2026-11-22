import type { DomainWeight } from "./schema";

// Split `total` questions across domains in proportion to their weights
// (largest-remainder method), then raise any domain that falls below its
// minimum when the exam is large enough to honor every minimum.
export function allocateByWeight(domainWeights: DomainWeight[], total: number): Map<string, number> {
  const weightSum = domainWeights.reduce((s, d) => s + d.weight, 0) || 1;
  const exact = domainWeights.map((d) => (d.weight / weightSum) * total);
  const counts = exact.map((x) => Math.floor(x));
  let left = total - counts.reduce((s, c) => s + c, 0);

  const byRemainder = exact
    .map((x, i) => ({ i, frac: x - Math.floor(x) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i);
  for (let k = 0; left > 0 && k < byRemainder.length; k++, left--) {
    counts[byRemainder[k].i]++;
  }

  const minSum = domainWeights.reduce((s, d) => s + d.minQuestions, 0);
  if (total >= minSum) {
    for (let i = 0; i < counts.length; i++) {
      while (counts[i] < domainWeights[i].minQuestions) {
        // take one from the domain with the most room above its own minimum
        let donor = -1;
        let room = 0;
        for (let j = 0; j < counts.length; j++) {
          const r = counts[j] - domainWeights[j].minQuestions;
          if (j !== i && r > room) {
            donor = j;
            room = r;
          }
        }
        if (donor === -1) break;
        counts[donor]--;
        counts[i]++;
      }
    }
  }

  return new Map(domainWeights.map((d, i) => [d.domain, counts[i]]));
}
