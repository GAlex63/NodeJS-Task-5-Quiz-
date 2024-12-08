import { Link } from "react-router-dom";

export const Game = ({
  useParams,
  questionsData,
  setSelectedVariant,
  selectedVariant,
  setCorrect,
  correct,
}) => {
  const { id } = useParams();
  const currentStep = parseInt(id, 10);
  const question = questionsData[currentStep];

  const onClickVariant = (id) => setSelectedVariant(id);

  const nextQuestionButton = () => {
    if (selectedVariant === question.correct) {
      setCorrect(correct + 1);
    }
    setSelectedVariant(null);
  };

  return (
    <div className="game-page">
      <h3>{question.title}</h3>
      <ul className="answer-list">
        {question.variants.map((variant, id) => (
          <li key={id} className="answer-item">
            <label>
              <input
                type="radio"
                name="answer"
                checked={selectedVariant === id}
                onChange={() => onClickVariant(id)}
              />
              {variant}
            </label>
          </li>
        ))}
      </ul>
      <Link to={`/questions/${currentStep - 1}`}>
        <button
          className="btn-prev-question"
          type="button"
          disabled={currentStep <= 0}
        >
          Предыдущий вопрос
        </button>
      </Link>
      {currentStep + 1 >= questionsData.length ? (
        <Link to="/result">
          <button>Завершить викторину</button>
        </Link>
      ) : (
        <Link to={`/questions/${currentStep + 1}`}>
          <button
            className="btn-next-question"
            type="button"
            onClick={nextQuestionButton}
            disabled={
              selectedVariant === null ||
              currentStep >= questionsData.length - 1
            }
          >
            Следующий вопрос
          </button>
        </Link>
      )}
    </div>
  );
};
