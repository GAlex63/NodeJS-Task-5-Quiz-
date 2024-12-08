import { useState } from "react";
import axios from "axios";

export const useQuestions = ({
  questionsData,
  newQuestion,
  newVariants,
  correctVariant,
  setNewQuestion,
  setNewVariants,
  setQuestionsData,
  setCorrectVariant,
  questionData,
  setQuestionData

}) => {


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
      setQuestionsData(
        (questionsData) =>
          questionsData.filter((question) => question._id !== id),
      );

    };

    const updateQuestion = async (id, field, value) => {
      const updatedQuestions = questionsData.map((question) => {
        if (question._id === id) {
          return { ...question, [field]: value };
        }
        return question;
      });


      await axios.put(
        `http://localhost:3001/questions/${id}`,
        updatedQuestions.find((question) => question._id === id)
      );
      setQuestionsData(updatedQuestions);
    };

    const updateVariant = async (id, variantId, value) => {
      const updatedQuestions = questionsData.map((question) => {
        if (question._id === id) {
          const updatedVariants = [...question.variants];
          updatedVariants[variantId] = value;
          return { ...question, variants: updatedVariants };
        }
        return question;
      });

      await axios.put(
        `http://localhost:3001/questions/${id}`,
        updatedQuestions.find((question) => question._id === id)
      );
      setQuestionsData(updatedQuestions);
    };

    return ({ addQuestion, removeQuestion, updateQuestion, updateVariant, 
        questionData, newQuestion, setNewQuestion, newVariants, 
        setNewVariants, correctVariant, setCorrectVariant, setQuestionsData,
    questionsData})
}