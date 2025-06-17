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

const NoteCard = () => {
  const [thoughts, setThoughts] = useState([])
  const [currentThought, setCurrentThought] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadThoughts = async () => {
    try {
      const fetchedThoughts = await getThoughts()
      setThoughts(fetchedThoughts)
    } catch (error) {
      console.error('Error loading thoughts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const findTopEmotionFromText = async(input) =>{
    const res = await fetch('http://localhost:8000/analyze', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({text: input})
    });
    return await res.json();
  }

  const handleSubmit = async () => {
    if (!currentThought.trim()) return
    
    try {
      const emotion = await findTopEmotionFromText(currentThought.trim())
      console.log(emotion['emotion'][0]['label'])
      await addThought(currentThought.trim(), emotion['emotion'][0]['label'])
      setCurrentThought('')
      loadThoughts() // Reload thoughts after adding
    } catch (error) {
      console.error('Error adding thought:', error)
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
      loadThoughts() // Reload thoughts after deleting
    } catch (error) {
      console.error('Error deleting thought:', error)
    }
  }

  useEffect(() => {
    loadThoughts()
  }, [])

  return (
    <div className="w-full">
      <div className="flex items-center w-full bg-white rounded-full border border-gray-200 shadow-sm overflow-hidden mb-4">
        <input
          type="text"
          value={currentThought}
          onChange={(e) => setCurrentThought(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your thoughts here..."
          className="w-full px-4 py-3 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400"
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !currentThought.trim()}
          className="px-5 py-3 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
      
      <div className="p-2">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading thoughts...</div>
        ) : (
          <div className="space-y-4">
            {thoughts.map((thought) => {
              const startColor = pastelEmotionColors[thought.emotion] || pastelEmotionColors.sadness;
              const endColor = gradientEndColors[thought.emotion] || gradientEndColors.sadness;
              return (
                <div
                  key={thought.id}
                  style={{ 
                    background: `linear-gradient(to right, ${startColor}, ${endColor})`,
                  }}
                  className="font-medium group relative p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex justify-center items-center cursor-pointer text-gray-900"
                >
                  <p className="leading-relaxed text-center">
                    {thought.thought}
                  </p>
                  <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleDelete(thought.id)}
                      className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default NoteCard