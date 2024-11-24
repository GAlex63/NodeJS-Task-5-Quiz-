import { useState, useEffect } from "react";
import { Router, Routes, Route, Link, useParams } from "react-router-dom";
import axios from "axios";
import "./App.css";

export const App = () => {
  const [step, setStep] = useState(0);
  const [questionsData, setQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [history, setHistory] = useState([]);

  // console.log(history);

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      fetch("http://localhost:3001/questions")
        .then((response) => response.json())
        .then((data) => {
          setQuestionsData(data);
          setLoading(false);
        });
    };

    fetchData();

    const savedHistory = JSON.parse(localStorage.getItem("history")) || [];
    setHistory(savedHistory);
    // console.log(savedHistory);
    // console.log(history);
    // console.log(localStorage);
  }, []);

  const saveHistory = () => {
    const newDate = new Date();
    const newEntry = {
      date: newDate.toLocaleString(),
      totalQuestions: questionsData.length,
      correctAnswers: correct,
    };
    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
  };

  const StartPage = () => {
    return (
      <div className="start-page">
        <h1>Добро пожаловать в игру!</h1>
        <Link to="/questions/0">
          <button>Начать игру</button>
        </Link>
        <Link to="/edit">
          <button>Редактировать тест</button>
        </Link>
        <HistoryList />
      </div>
    );
  };

  const Game = () => {
    const { id } = useParams();
    const step = parseInt(id, 10);
    const question = questionsData[step];

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
        <Link to={`/questions/${step - 1}`}>
          <button
            className="btn-prev-question"
            type="button"
            disabled={step <= 0}
          >
            Предыдущий вопрос
          </button>
        </Link>
        {step + 1 >= questionsData.length ? (
          <Link to="/result">
            <button>Завершить викторину</button>
          </Link>
        ) : (
          <Link to={`/questions/${step + 1}`}>
            <button
              className="btn-next-question"
              type="button"
              onClick={nextQuestionButton}
              disabled={
                selectedVariant === null || step >= questionsData.length - 1
              }
            >
              Следующий вопрос
            </button>
          </Link>
        )}
      </div>
    );
  };

  const Result = () => {
    const endGame = () => {
      saveHistory();
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

  const HistoryList = () => {
    console.log(history);
    return (
      <div className="history-list">
        <h3>История прохождений</h3>
        {!history ? (
          <div>Отсутствует история прохождения</div>
        ) : (
          <ul>
            {history.map((entry, id) => (
              <li key={id}>
                {entry.date}: вопросов - {entry.totalQuestions} , правильных
                ответов - {entry.correctAnswers}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const EditQuestions = () => {
    const [questionData, setQuestionData] = useState([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [newVariants, setNewVariants] = useState(["", ""]);
    const [correctVariant, setCorrectVariant] = useState(0);

    const addQuestion = async () => {
      if (newQuestion.trim() === "") return;

      const question = {
        title: newQuestion,
        variants: newVariants,
        correct: correctVariant,
      };

      const response = await axios.post(
        "http://localhost:3001/questions",
        question
      );
      setQuestionsData([...questionsData, response.data]);
      setNewQuestion("");
      setNewVariants(["", ""]);
      setCorrectVariant(0);
    };

    const removeQuestion = async (id) => {
      await axios.delete(`http://localhost:3001/questions/${id}`);
      setQuestionsData((questionsData) =>
        questionsData.filter((_, i) => i !== id)
      );
    };

    const updateQuestion = async (id, field, value) => {
      const updatedQuestions = [...questionsData];
      if (field === "title") {
        updatedQuestions[id].title = value;
      } else if (field === "correct") {
        updatedQuestions[id].correct = value;
      }

      await axios.put(
        `http://localhost:3001/questions/${updatedQuestions[id]._id}`,
        updatedQuestions[id]
      );
      setQuestionsData(updatedQuestions);
    };

    const updateVariant = async (questionId, variantId, value) => {
      const updatedQuestions = [...questionsData];
      updatedQuestions[questionId].variants[variantId] = value;

      await axios.put(
        `http://localhost:3001/questions/${updatedQuestions[questionId]._id}`,
        updatedQuestions[questionId]
      );
      setQuestionsData(updatedQuestions);
    };

    return (
      <div className="edit-questions">
        <h2>Редактирование вопросов</h2>
        {questionsData.map((question, questionId) => (
          <div key={questionId} className="question-item">
            <input
              type="text"
              value={question.title}
              onChange={(e) =>
                updateQuestion(questionId, "title", e.target.value)
              }
            />
            {question.variants.map((variant, variantId) => (
              <input
                key={variantId}
                type="text"
                value={variant}
                onChange={(e) =>
                  updateVariant(questionId, variantId, e.target.value)
                }
              />
            ))}
            <select
              value={question.correct}
              onChange={(e) =>
                updateQuestion(questionId, "correct", Number(e.target.value))
              }
            >
              {question.variants.map((_, variantId) => (
                <option key={variantId} value={variantId}>
                  Вариант {variantId + 1}
                </option>
              ))}
            </select>
            <button onClick={() => removeQuestion(questionId)}>
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

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/questions/:id" element={<Game />} />
        <Route path="/result" element={<Result />} />
        <Route path="/edit" element={<EditQuestions />} />
      </Routes>
    </div>
  );
};
