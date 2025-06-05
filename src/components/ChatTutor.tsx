'use client'

import { useState } from 'react'

interface ChatTutorProps {
  question: string
  selectedAnswer: string
  correctAnswer: string
  explanation: string
  themeContext: string
}

export default function ChatTutor({ 
  question, 
  selectedAnswer, 
  correctAnswer, 
  explanation,
  themeContext
}: ChatTutorProps) {
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage = newMessage
    setMessages(prev => [...prev, { text: userMessage, isUser: true }])
    setNewMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `You are a helpful English teacher. The student is learning about conjunctions.
          
          Context:
          - Theme: ${themeContext}
          - Question: ${question}
          - Student's answer: ${selectedAnswer}
          - Correct answer: ${correctAnswer}
          - Explanation: ${explanation}

          Student's question: ${userMessage}

          Please provide a helpful, encouraging response that:
          1. Addresses their specific question
          2. Explains why their answer was incorrect (if relevant)
          3. Helps them understand the correct usage of the conjunction
          4. Provides an additional example if helpful
          
          Keep your response friendly and suitable for a HAVO 4 (age 15-16) student.`
        }),
      })

      const data = await response.json()
      setMessages(prev => [...prev, { text: data.response, isUser: false }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        text: "Sorry, I couldn't get a response. Please try again!", 
        isUser: false 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="mt-4 border border-purple-200 rounded-lg p-4">
      <h4 className="text-lg font-medium text-purple-800 mb-3 flex items-center">
        <span className="mr-2">🤝</span>
        Need help? Chat with your AI tutor!
      </h4>

      <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              message.isUser
                ? 'bg-purple-100 ml-8'
                : 'bg-gray-100 mr-8'
            }`}
          >
            <div className="flex items-start">
              <span className="mr-2 mt-1">
                {message.isUser ? '👤' : '👩‍🏫'}
              </span>
              <p className="text-gray-800 whitespace-pre-wrap">{message.text}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center space-x-2 text-purple-600 p-3">
            <div className="animate-bounce">•</div>
            <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>•</div>
            <div className="animate-bounce" style={{ animationDelay: '0.4s' }}>•</div>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question about this answer..."
          className="flex-1 p-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !newMessage.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '...' : 'Ask'}
        </button>
      </div>
    </div>
  )
}