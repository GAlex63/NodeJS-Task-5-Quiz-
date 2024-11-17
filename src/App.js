import { useState, useEffect } from "react";
import { Router, Routes, Route, Link } from "react-router-dom";
// import styled from "styled-components";
import "./App.css";

export const App = () => {
  const [step, setStep] = useState(0);
  const [questionsData, setQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      fetch("http://localhost:3001/questions")
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          setQuestionsData(data);
          setLoading(false);
        });
    };

    fetchData();

    const savedHistory = JSON.parse(localStorage.getItem("history")) || [];
    setHistory(savedHistory);
  }, []);

  const saveHistory = () => {
    const newDate = new Date();
    const newEntry = {
      date: newDate().toLocalString(),
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
        <Link to="/questions/">
          <button>Начать игру</button>
        </Link>
        <Link to="/edit">
          <button>Редактировать тест</button>
        </Link>
        <HistoryList />
      </div>
    );
  };

  const Game = ({ step }) => {
    const question = questionsData[step];
    console.log(questionsData);
    console.log(step);

    const onClickVariant = (id) => setSelectedVariant(id);

    const nextQuestionButton = () => {
      if (selectedVariant === question.correct) {
        setCorrect(correct + 1);
        // setStep(step + 1);
      }
      setSelectedVariant(null);
    };

    const endGame = () => {
      saveHistory();
      setCorrect(0);
      setStep(0);
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
        {step === questionsData.length - 1 && (
          <Link to="/result" onClick={endGame}>
            <button>Завершить викторину</button>
          </Link>
        )}
      </div>
    );
  };

  const Result = ({ correct }) => {
    return (
      <div className="result-page">
        <h3>Количество правильных ответов {correct}</h3>
        <Link to="/">
          <button>Начать заново</button>
        </Link>
      </div>
    );
  };

  const HistoryList = () => {
    return (
      <div className="history-list">
        <h3>История прохождений</h3>
        <ul>
          {history.map((entry, id) => (
            <li key={id}>
              {entry.date}: {entry.totalQuestions} вопросов,{" "}
              {entry.correctAnswers} правильных ответов
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const EditQuestions = () => {
    const [newQuestion, setNewQuestion] = useState("");
    const [newVariants, setNewVariants] = useState(["", ""]);
    const [correctVariant, setCorrectVariant] = useState(0);

    const addQuestion = () => {
      if (newQuestion.trim() === "") return;

      const question = {
        title: newQuestion,
        variants: newVariants,
        correct: correctVariant,
      };

      setQuestionsData([...questionsData, question]);
      setNewQuestion("");
      setNewVariants(["", ""]);
      setCorrectVariant(0);
    };

    const removeQuestion = (id) => {
      setQuestionsData((questionsData) =>
        questionsData.filter((_, i) => i !== id)
      );
    };

    const updateQuestion = (id, field, value) => {
      const updatedQuestions = [...questionsData];
      if (field === "title") {
        updatedQuestions[id].title = value;
      } else if (field === "correct") {
        updatedQuestions[id].correct = value;
      }
      setQuestionsData(updatedQuestions);
    };

    const updateVariant = (questionId, variantId, value) => {
      const updatedQuestions = [...questionsData];
      updatedQuestions[questionId].variants[variantId] = value;
      setQuestionsData(updatedQuestions);
    };

    return (
      <div className="edit-questions">
        <h2>Редактирование вопросов</h2>
        {questionsData.map((question, id) => (
          <div key={id} className="question-item">
            <input
              type="text"
              value={question.title}
              onChange={(e) => updateQuestion(id, "title", e.target.value)}
            />
            {question.variants.map((variant, id) => (
              <input
                key={id}
                type="text"
                value={variant}
                onChange={(e) => updateVariant(id, e.target.value)}
              />
            ))}
            <select
              value={question.correct}
              onChange={(e) =>
                updateQuestion(id, "correct", Number(e.target.value))
              }
            >
              {question.variants.map((_, vid) => (
                <option key={vid} value={vid}>
                  Вариант {vid + 1}
                </option>
              ))}
            </select>
            <button onClick={() => removeQuestion(id)}>Удалить вопрос</button>
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
        <button onClick={addQuestion}>Добавить вопрос</button>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  // if (step === questionsData.length) {
  //   return <Result correct={correct} />;
  // }

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/questions/" element={<Game step={step} />} />
        <Route path="/result" element={<Result correct={correct} />} />
        <Route path="/edit" element={<EditQuestions />} />
      </Routes>
    </div>
  );
};
