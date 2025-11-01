export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const isSummerSeason = () => {
  const today = new Date();
  const year = today.getFullYear();
  
  const summerStart = new Date(year, 2, 20); // 20 March
  const summerEnd = new Date(year, 11, 21);  // 21 December

  return today >= summerStart && today < summerEnd;
};
