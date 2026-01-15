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
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-black border-4 border-[#ccff00] p-8 max-w-2xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-3xl font-black text-[#ccff00] hover:text-[#ff00ff] transition-colors"
            >
              ✕
            </button>

            <div className="mb-6">
              {percentage >= 80 ? (
                <div className="text-6xl mb-4">🎉</div>
              ) : percentage >= 60 ? (
                <div className="text-6xl mb-4">👏</div>
              ) : (
                <div className="text-6xl mb-4">💪</div>
              )}
              <h2 className="text-4xl font-black uppercase text-[#ccff00] mb-2">
                Quiz Complete!
              </h2>
              <p className="text-lg text-white font-bold">
                You scored {score} out of {quiz.questions.length}
              </p>
              <div className="mt-6">
                <div className="text-6xl font-black text-[#ff00ff]">
                  {percentage}%
                </div>
              </div>
            </div>

            {/* Review answers */}
            <div className="text-left mt-8 space-y-3 max-h-96 overflow-y-auto">
              <h3 className="text-xl font-black uppercase text-[#00ffff] mb-4">Review:</h3>
              {quiz.questions.map((q, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === q.correct_answer;

                return (
                  <div
                    key={index}
                    className={`p-4 border-4 ${
                      isCorrect
                        ? 'border-[#ccff00] bg-black text-white'
                        : 'border-[#ff00ff] bg-black text-white'
                    }`}
                  >
                    <p className="font-black uppercase text-sm mb-2">
                      {index + 1}. {q.question}
                    </p>
                    <p className="text-sm mb-1 font-bold">
                      <span className="text-[#00ffff]">Your answer: </span>
                      <span className={isCorrect ? 'text-[#ccff00]' : 'text-[#ff00ff]'}>
                        {q.options[userAnswer]}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm mb-1 font-bold">
                        <span className="text-[#00ffff]">Correct answer: </span>
                        <span className="text-[#ccff00]">
                          {q.options[q.correct_answer]}
                        </span>
                      </p>
                    )}
                    <p className="text-sm text-[#ccff00] font-bold mt-2">
                      {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="mt-8 w-full bg-black border-4 border-[#ccff00] text-[#ccff00] py-3 px-6 font-black uppercase hover:bg-[#ccff00] hover:text-black transition-all"
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
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-black border-4 border-[#ccff00] p-8 max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-3xl font-black text-[#ccff00] hover:text-[#ff00ff] transition-colors"
        >
          ✕
        </button>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-black uppercase text-[#ccff00] mb-3">
            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-black border-2 border-[#ccff00] h-4">
            <div
              className="bg-[#ccff00] h-full transition-all"
              style={{
                width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <h2 className="text-2xl font-black uppercase text-white mb-6 leading-tight">
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
                className={`w-full text-left p-4 border-4 font-black uppercase transition-all ${
                  showCorrect
                    ? 'border-[#ccff00] bg-[#ccff00] text-black'
                    : showIncorrect
                    ? 'border-[#ff00ff] bg-[#ff00ff] text-black'
                    : isSelected
                    ? 'border-[#00ffff] bg-black text-[#00ffff]'
                    : 'border-[#ccff00] bg-black text-white hover:bg-[#ccff00] hover:text-black'
                } ${hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showCorrect && <span className="text-2xl">✓</span>}
                  {showIncorrect && <span className="text-2xl">✗</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation (shown after answer) */}
        {hasAnswered && (
          <div className="mb-6 p-4 border-4 border-[#00ffff] bg-black text-[#00ffff]">
            <p className="text-sm font-black uppercase mb-2">Explanation:</p>
            <p className="text-sm font-bold">{question.explanation}</p>
          </div>
        )}

        {/* Next button */}
        {hasAnswered && (
          <button
            onClick={handleNext}
            className="w-full bg-black border-4 border-[#ff00ff] text-[#ff00ff] py-3 px-6 font-black uppercase hover:bg-[#ff00ff] hover:text-black transition-all"
          >
            {isLastQuestion ? 'See Results' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}
