'use client';

import { useState } from 'react';
import { Quiz } from '@/types';

interface QuizModalProps {
  quiz: Quiz | null;
  onClose: () => void;
}

export default function QuizModal({ quiz, onClose }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) return null;

  const question = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const hasAnswered = selectedAnswers[currentQuestion] !== undefined;

  const handleAnswerSelect = (optionIndex: number) => {
    if (hasAnswered) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct_answer) {
        correct++;
      }
    });
    return correct;
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / quiz.questions.length) * 100);

    return (
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="mb-6">
              {percentage >= 80 ? (
                <div className="text-6xl mb-4">🎉</div>
              ) : percentage >= 60 ? (
                <div className="text-6xl mb-4">👏</div>
              ) : (
                <div className="text-6xl mb-4">💪</div>
              )}
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Quiz Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You scored {score} out of {quiz.questions.length}
              </p>
              <div className="mt-4">
                <div className="text-5xl font-bold text-purple-600">
                  {percentage}%
                </div>
              </div>
            </div>

            {/* Review answers */}
            <div className="text-left mt-8 space-y-4 max-h-96 overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Review:</h3>
              {quiz.questions.map((q, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === q.correct_answer;

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <p className="font-semibold text-gray-900 mb-2">
                      {index + 1}. {q.question}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Your answer: </span>
                      <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                        {q.options[userAnswer]}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm mb-1">
                        <span className="font-medium">Correct answer: </span>
                        <span className="text-green-700">
                          {q.options[q.correct_answer]}
                        </span>
                      </p>
                    )}
                    <p className="text-sm text-gray-600 italic mt-2">
                      {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="mt-8 w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Close Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div
        className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{
                width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion] === index;
            const isCorrect = index === question.correct_answer;
            const showCorrect = hasAnswered && isCorrect;
            const showIncorrect = hasAnswered && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={hasAnswered}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  showCorrect
                    ? 'border-green-500 bg-green-50'
                    : showIncorrect
                    ? 'border-red-500 bg-red-50'
                    : isSelected
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                } ${hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {showCorrect && <span className="text-green-600 text-xl">✓</span>}
                  {showIncorrect && <span className="text-red-600 text-xl">✗</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation (shown after answer) */}
        {hasAnswered && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 mb-1">Explanation:</p>
            <p className="text-sm text-blue-800">{question.explanation}</p>
          </div>
        )}

        {/* Next button */}
        {hasAnswered && (
          <button
            onClick={handleNext}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            {isLastQuestion ? 'See Results' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}
