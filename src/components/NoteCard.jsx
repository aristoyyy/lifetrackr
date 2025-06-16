import React, {useEffect, useState} from 'react'
import {addThought, deleteThought, getThoughts} from "../firebase/thoughtService.js"

const pastelEmotionColors = {
  joy: "#FFF4A3",      // pastel yellow, a bit richer
  neutral: "#CCCCCC",  // soft mid gray
  surprise: "#A9D8FF", // brighter pastel blue
  sadness: "#8FAADC",  // medium pastel steel blue
  anger: "#F7BABA",    // warm pastel red/pink
  fear: "#CBA4FF",     // deeper pastel purple
  disgust: "#AED9A7"   // medium pastel green
};

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
    <div >
      <div className="flex items-center w-full border-b border-gray-100/50">
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
          className="px-4 py-3 bg-white/70 backdrop-blur-sm border-l border-gray-100/50 text-gray-600 hover:text-gray-900 text-sm font-medium hover:bg-white/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
      
      <div className="p-6">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading thoughts...</div>
        ) : (
          <div className="space-y-6">
            {thoughts.map((thought) => (
              <div
                key={thought.id}
                style={{ 
                  backgroundColor: pastelEmotionColors[thought.emotion],
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
                className="font-medium group relative backdrop-blur-sm border border-gray-100/50 p-6 rounded-[2rem] hover:scale-105 transition-all duration-300 hover:shadow-xl"
              >
                <p className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300 leading-relaxed">
                  {thought.thought}
                </p>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleDelete(thought.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NoteCard