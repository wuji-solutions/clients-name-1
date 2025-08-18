export const getPercentage = (count: number, total: number) =>
  total > 0 ? (count / total) * 100 : 0;
