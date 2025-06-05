'use client'

import { useState } from 'react'

interface Question {
  text: string
  options: string[]
  correctAnswer: string
  explanation: string
}

export default function EnglishQuiz() {
  const [difficulty, setDifficulty] = useState('')
  const [theme, setTheme] = useState('')
  const [isThemeSelected, setIsThemeSelected] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [generatedText, setGeneratedText] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const difficulties = [
    { id: 'easy', name: 'Easy', emoji: '😊' },
    { id: 'medium', name: 'Medium', emoji: '🤔' },
    { id: 'hard', name: 'Hard', emoji: '🧐' }
  ]

  const themes = [
    "Sports",
    "Music",
    "Technology",
    "Food",
    "Travel",
    "Movies",
    "Animals",
    "Gaming"
  ]

  const handleDifficultySelect = (selectedDifficulty: string) => {
    setDifficulty(selectedDifficulty)
  }

  const handleThemeSelect = async (selectedTheme: string) => {
    setIsLoading(true)
    setTheme(selectedTheme)

    const difficultyLevels = {
      easy: "simple conjunctions like 'and', 'but', 'or', 'so'",
      medium: "intermediate conjunctions like 'although', 'unless', 'since', 'while'",
      hard: "advanced conjunctions like 'nevertheless', 'whereas', 'moreover', 'consequently'"
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Create an engaging ${difficulty} level text about ${selectedTheme} for HAVO 4 students (age 15-16). 
          The text should be 5 paragraphs long and specifically use ${difficultyLevels[difficulty as keyof typeof difficultyLevels]}.
          Then create 5 multiple choice questions about conjunctions used in the text.
          Format the response as JSON with this structure:
          {
            "text": "the text content",
            "questions": [
              {
                "text": "question text",
                "options": ["option1", "option2", "option3", "option4"],
                "correctAnswer": "correct option",
                "explanation": "why this is correct"
              }
            ]
          }`
        }),
      })

      const data = await response.json()
      const cleanJson = data.response.replace(/^```json\n|\n```$/g, '')
      const parsedData = JSON.parse(cleanJson)
      
      setGeneratedText(parsedData.text)
      setQuestions(parsedData.questions)
      setIsThemeSelected(true)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
    setShowFeedback(true)
    
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    setSelectedAnswer('')
    setShowFeedback(false)
    setCurrentQuestionIndex(currentQuestionIndex + 1)
  }

  const resetQuiz = () => {
    setDifficulty('')
    setIsThemeSelected(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswer('')
    setShowFeedback(false)
    setScore(0)
    setGeneratedText('')
    setQuestions([])
  }

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-purple-600">Creating your quiz...</p>
        </div>
      </div>
    )
  }

  if (!difficulty) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-purple-800 mb-6">Choose Your Difficulty! 🎯</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {difficulties.map((d) => (
            <button
              key={d.id}
              onClick={() => handleDifficultySelect(d.id)}
              className="p-6 text-center rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200 hover:border-purple-300"
            >
              <div className="text-3xl mb-2">{d.emoji}</div>
              <span className="text-lg font-medium text-purple-700">{d.name}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (!isThemeSelected) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-800">Choose Your Theme! 🎯</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-purple-600">Difficulty:</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {difficulties.find(d => d.id === difficulty)?.name}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => handleThemeSelect(t)}
              className="p-4 text-left rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200 hover:border-purple-300"
            >
              <span className="text-lg font-medium text-purple-700">{t}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Quiz Complete! 🎉</h2>
        <p className="text-lg mb-4">
          You scored <span className="font-bold text-purple-600">{score}</span> out of {questions.length}!
        </p>
        <button
          onClick={resetQuiz}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Another Quiz
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-purple-600">Theme:</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            {theme}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-purple-600">Difficulty:</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            {difficulties.find(d => d.id === difficulty)?.name}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          {theme} Text
        </h2>
        <div className="prose max-w-none">
          {generatedText.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="border-t border-purple-100 pt-6">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-purple-800">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h3>
          <span className="text-purple-600 font-medium">
            Score: {score}
          </span>
        </div>

        <div className="mb-6">
          <p className="text-lg text-gray-800 mb-4">
            {questions[currentQuestionIndex].text}
          </p>
          <div className="space-y-3">
            {questions[currentQuestionIndex].options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={showFeedback}
                className={`w-full p-3 text-left rounded-lg transition-colors ${
                  showFeedback
                    ? option === questions[currentQuestionIndex].correctAnswer
                      ? 'bg-green-100 border-green-500'
                      : option === selectedAnswer
                      ? 'bg-red-100 border-red-500'
                      : 'bg-gray-50 border-gray-200'
                    : 'bg-purple-50 hover:bg-purple-100 border-purple-200'
                } border`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {showFeedback && (
          <div className={`p-4 rounded-lg mb-6 ${
            selectedAnswer === questions[currentQuestionIndex].correctAnswer
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`font-medium ${
              selectedAnswer === questions[currentQuestionIndex].correctAnswer
                ? 'text-green-800'
                : 'text-red-800'
            }`}>
              {selectedAnswer === questions[currentQuestionIndex].correctAnswer
                ? '✅ Correct!'
                : '❌ Not quite right.'}
            </p>
            <p className="mt-2 text-gray-700">
              {questions[currentQuestionIndex].explanation}
            </p>
          </div>
        )}

        {showFeedback && (
          <button
            onClick={handleNextQuestion}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  )
}