const transformDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    let transformedDate: Date;

    if (date.includes('/')) {
      const [day, month, year] = date.split('/').map(Number);
      transformedDate = new Date(year, month - 1, day);
    } else if (date.includes('-')) {
      transformedDate = new Date(date);
    } else {
      return '';
    }

    if (isNaN(transformedDate.getTime())) {
      return '';
    }

    date = transformedDate;
  }

  const day: number = date.getDate();
  const month: string = date.toLocaleString('en-US', { month: 'short' });
  const year: number = date.getFullYear();

  const formattedDate: string = `${day} ${month} ${year}`;
  return formattedDate;
};

export default transformDate;
