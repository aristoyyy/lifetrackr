import React, {useEffect, useState} from 'react'
import {addThought, deleteThought, getThoughts} from "../firebase/thoughtService.js"

const pastelEmotionColors = {
  joy: "#FFF9C4",      // Very light, soft yellow for joy start
  neutral: "#E0E0E0",  // Light Gray - for gray-like gradient start
  surprise: "#BBDEFB", // Light Blue - for blue-like gradient start
  sadness: "#BBDEFB",  // Default to blue gradient if no emotion
  anger: "#FFCDD2",    // Light Red
  fear: "#B39DDB",     // Light Purple
  disgust: "#C8E6C9"   // Light Green
};

const gradientEndColors = {
  joy: "#FFECB3",      // Slightly deeper, but still soft yellow for joy end
  neutral: "#9E9E9E",  // Medium Gray
  surprise: "#64B5F6", // Medium Blue
  sadness: "#64B5F6",
  anger: "#E57373",
  fear: "#7986CB",
  disgust: "#A5D6A7"
}

// Emotion icons mapping
const emotionIcons = {
  joy: "😊",
  neutral: "😐",
  surprise: "😲",
  sadness: "😢",
  anger: "😠",
  fear: "😨",
  disgust: "😖"
};

const NoteCard = ({thoughts, setThoughts}) => {
  const [currentThought, setCurrentThought] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState('success') // 'success' or 'error'

  const loadThoughts = async () => {
    try {
      const fetchedThoughts = await getThoughts()
      setThoughts(fetchedThoughts)
    } catch (error) {
      console.error('Error loading thoughts:', error)
      showFeedbackMessage('Failed to load thoughts', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const findTopEmotionFromText = async(input) =>{
    try {
      const res = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({text: input})
      });
      return await res.json();
    } catch (error) {
      console.error('Error analyzing text:', error)
      return { emotion: [{ label: 'neutral' }] }
    }
  }

  const showFeedbackMessage = (message, type = 'success') => {
    setFeedbackMessage(message)
    setFeedbackType(type)
    setShowFeedback(true)
    setTimeout(() => setShowFeedback(false), 3000)
  }

  const handleSubmit = async () => {
    if (!currentThought.trim()) return
    
    try {
      setIsSubmitting(true)
      const emotion = await findTopEmotionFromText(currentThought.trim())
      await addThought(currentThought.trim(), emotion['emotion'][0]['label'])
      setCurrentThought('')
      showFeedbackMessage('Thought added successfully!')
      loadThoughts() // Reload thoughts after adding
    } catch (error) {
      console.error('Error adding thought:', error)
      showFeedbackMessage('Failed to add thought', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleDelete = async (thoughtId) => {
    try {
      await deleteThought(thoughtId)
      showFeedbackMessage('Thought deleted successfully!')
      loadThoughts() // Reload thoughts after deleting
    } catch (error) {
      console.error('Error deleting thought:', error)
      showFeedbackMessage('Failed to delete thought', 'error')
    }
  }

  useEffect(() => {
    loadThoughts()
  }, [])

  return (
    <div className="w-full">
      {/* Feedback toast */}
      {showFeedback && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg animate-fade-in ${
          feedbackType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <p className="flex items-center font-medium">
            {feedbackType === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {feedbackMessage}
          </p>
        </div>
      )}

      <div className="flex items-center w-full bg-white rounded-full border border-gray-200 shadow-md overflow-hidden mb-4 focus-within:ring-2 focus-within:ring-indigo-300 focus-within:border-indigo-300 transition-all duration-200">
        <input
          type="text"
          value={currentThought}
          onChange={(e) => setCurrentThought(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your thoughts here..."
          className="w-full px-4 py-3 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400"
          disabled={isLoading || isSubmitting}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || isSubmitting || !currentThought.trim()}
          className={`px-5 py-3 ${
            isSubmitting ? 'bg-indigo-100 text-indigo-400' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
          } transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing
            </>
          ) : (
            'Add'
          )}
        </button>
      </div>
      
      <div className="p-2">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-indigo-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {thoughts.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No thoughts yet. Add your first thought above!</p>
              </div>
            ) : (
              thoughts.map((thought) => {
                const startColor = pastelEmotionColors[thought.emotion] || pastelEmotionColors.sadness;
                const endColor = gradientEndColors[thought.emotion] || gradientEndColors.sadness;
                const emotionIcon = emotionIcons[thought.emotion] || '🤔';
                return (
                  <div
                    key={thought.id}
                    style={{ 
                      background: `linear-gradient(to right, ${startColor}, ${endColor})`,
                    }}
                    className="card-hover group relative p-4 rounded-full shadow-lg transition-all duration-300 flex justify-between items-center cursor-pointer text-gray-900"
                  >
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center mr-2 bg-white/50 rounded-full">
                      <span className="text-lg">{emotionIcon}</span>
                    </div>
                    <p className="leading-relaxed text-center flex-grow">
                      {thought.thought}
                    </p>
                    <button
                      onClick={() => handleDelete(thought.id)}
                      className="ml-2 w-8 h-8 flex-shrink-0 bg-white/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/80"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default NoteCard