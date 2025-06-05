import EnglishQuiz from '@/components/EnglishQuiz'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-800 mb-4">
              English Conjunctions Quiz
            </h1>
            <p className="text-lg text-purple-600">
              Practice your English conjunctions with fun, themed texts!
            </p>
          </div>

          <EnglishQuiz />
        </div>
      </div>
    </div>
  )
}