// export const useSaveHistory = ({ setHistory, questionsData, correct, history }) => {
//     const newDate = new Date();
//     const newEntry = {
//       date: newDate.toLocaleString(),
//       totalQuestions: questionsData.length,
//       correctAnswers: correct,
//     };
//     const updatedHistory = [...history, newEntry];
//     setHistory(updatedHistory);
//     localStorage.setItem("history", JSON.stringify(updatedHistory));

//     return ({ updatedHistory})
//   };


  import { useCallback } from 'react';

export const useSaveHistory = () => {
  const saveHistory = useCallback(({ setHistory, questionsData, correct, history }) => {
    const newDate = new Date();
    const newEntry = {
      date: newDate.toLocaleString(),
      totalQuestions: questionsData.length,
      correctAnswers: correct,
    };

    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
  }, []);

  return saveHistory;
};