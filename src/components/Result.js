import { Link } from "react-router-dom";
import { useSaveHistory } from "../hooks/useSaveHistory";

export const Result = ({
  setHistory,
  questionsData,
  correct,
  history,
  setCorrect,
  setStep,
}) => {
  const saveHistory = useSaveHistory();

  const endGame = () => {
    saveHistory({ setHistory, questionsData, correct, history });
    setCorrect(0);
    setStep(0);
  };

  return (
    <div className="result-page">
      <h3>Количество правильных ответов {correct}</h3>
      <Link to="/" onClick={endGame}>
        <button>Начать заново</button>
      </Link>
    </div>
  );
};
