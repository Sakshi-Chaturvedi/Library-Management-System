exports.calculateFine = (borrowDate, returnDate) => {
  const days = Math.ceil(
    (returnDate - borrowDate) / (1000 * 60 * 60 * 24)
  );

  const allowedDays = 7;
  const finePerDay = 10;

  if (days > allowedDays) {
    return (days - allowedDays) * finePerDay;
  }

  return 0;
};