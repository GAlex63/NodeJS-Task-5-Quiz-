import { useState, useEffect } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { StartPage } from "./components/Start-page";
import { Game } from "./components/Game";
import { Result } from "./components/Result";
import { EditQuestions } from "./components/Edit-questions";
import "./App.css";

export const App = () => {
  const [step, setStep] = useState(0);
  const [questionsData, setQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [history, setHistory] = useState([]);
  const [questionData, setQuestionData] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newVariants, setNewVariants] = useState(["", ""]);
  const [correctVariant, setCorrectVariant] = useState(0);

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
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const gameProps = {
    useParams,
    questionsData,
    setSelectedVariant,
    selectedVariant,
    setCorrect,
    correct,
  };

  const resultProps = {
    setHistory,
    questionsData,
    correct,
    history,
    setCorrect,
    setStep,
  };

  const editProps = {
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
  };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<StartPage history={history} />} />
        <Route path="/questions/:id" element={<Game {...gameProps} />} />
        <Route path="/result" element={<Result {...resultProps} />} />
        <Route path="/edit" element={<EditQuestions {...editProps} />} />
      </Routes>
    </div>
  );
};
