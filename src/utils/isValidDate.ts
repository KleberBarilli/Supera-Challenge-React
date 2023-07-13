export const isValidDate = (date: Date) => {
  try {
    if (!isNaN(date.getTime())) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
