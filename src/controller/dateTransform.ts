const transformDate = (date: Date | string): string => {
    if (typeof date === 'string') {
      date = new Date(date);
    }
  
    if (isNaN(date.getTime())) {
      return '';
    }
  
    const day: number = date.getDate();
    const month: string = date.toLocaleString('en-US', { month: 'short' });
    const year: number = date.getFullYear();
  
    const formattedDate: string = `${day} ${month} ${year}`;
  
    return formattedDate;
  };

  export default transformDate