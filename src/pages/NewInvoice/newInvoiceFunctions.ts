const generateID = () =>{
    const randomLetters = Array.from({ length: 2 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26)));
    const randomNumbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
    
    return `${randomLetters.join('')}${randomNumbers.join('')}`;
  
}

export default generateID