export const getAge = (birth: string) => {
  const birthYear: number = parseInt(birth.substring(0, 4), 10);

  const today: Date = new Date();
  const currentYear: number = today.getFullYear();

  return currentYear - birthYear + 1;
};

export const isBefore = (date: string) => {
  const inputDate = new Date(date);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate < today;
};
