export const dateToMonthYear = (date: Date) => {
  return date.toISOString().slice(0, 7);
};
