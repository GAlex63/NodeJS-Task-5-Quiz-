import { Link } from "react-router-dom";
import { useQuestions } from "../hooks/useQuestions";

export const EditQuestions = ({
  newQuestion,
  newVariants,
  correctVariant,
  setNewQuestion,
  setNewVariants,
  questionsData,
  setCorrectVariant,
  setQuestionsData,
  questionData,
  setQuestionData,
}) => {
  const { addQuestion, removeQuestion, updateQuestion, updateVariant } =
    useQuestions({
      questionsData,
      newQuestion,
      newVariants,
      correctVariant,
      setNewQuestion,
      setNewVariants,
      setQuestionsData,
      setCorrectVariant,
      questionData,
      setQuestionData,
    });

  return (
    <div className="edit-questions">
      <h2>Редактирование вопросов</h2>
      {questionsData.map((question) => (
        <div key={question.id} className="question-item">
          <input
            type="text"
            value={question.title}
            onChange={(e) =>
              updateQuestion(question.id, "title", e.target.value)
            }
          />
          {question.variants.map((variant, variantId) => (
            <input
              key={variantId}
              type="text"
              value={variant}
              onChange={(e) =>
                updateVariant(question.id, variantId, e.target.value)
              }
            />
          ))}
          <select
            value={question.correct}
            onChange={(e) =>
              updateQuestion(question.id, "correct", Number(e.target.value))
            }
          >
            {question.variants.map((_, variantId) => (
              <option key={variantId} value={variantId}>
                Вариант {variantId + 1}
              </option>
            ))}
          </select>
          <button onClick={() => removeQuestion(question._id)}>
            Удалить вопрос
          </button>
        </div>
      ))}
      <h3>Добавить новый вопрос</h3>
      <input
        type="text"
        placeholder="Текст вопроса"
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
      />
      {newVariants.map((variant, id) => (
        <input
          key={id}
          type="text"
          // placeholder={`Вариант ${id + 1}`}
          value={variant}
          onChange={(e) => {
            const updatedVariants = [...newVariants];
            updatedVariants[id] = e.target.value;
            setNewVariants(updatedVariants);
          }}
        />
      ))}
      <button onClick={() => setNewVariants([...newVariants, ""])}>
        Добавить вариант
      </button>
      <select
        value={correctVariant}
        onChange={(e) => setCorrectVariant(Number(e.target.value))}
      >
        {newVariants.map((_, id) => (
          <option key={id} value={id}>
            Вариант {id + 1}
          </option>
        ))}
      </select>
      <Link to="/">
        <button onClick={addQuestion}>Сохранить изменения</button>
      </Link>
    </div>
  );
};
