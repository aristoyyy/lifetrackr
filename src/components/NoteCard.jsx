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
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState('success') // 'success' or 'error' or 'info'
  const [deletingThoughtId, setDeletingThoughtId] = useState(null)
  const [expandedThoughtId, setExpandedThoughtId] = useState(null)

  const loadThoughts = async () => {
    try {
      const fetchedThoughts = await getThoughts()
      setThoughts(fetchedThoughts)
    } catch (error) {
      console.error('Error loading thoughts:', error)
      showNotificationAlert('Failed to load thoughts', 'error')
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

  const showNotificationAlert = (message, type) => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const handleSubmit = async () => {
    if (!currentThought.trim()) return
    
    try {
      setIsSubmitting(true)
      const emotion = await findTopEmotionFromText(currentThought.trim())
      await addThought(currentThought.trim(), emotion['emotion'][0]['label'])
      setCurrentThought('')
      showNotificationAlert('Thought added successfully!', 'success')
      loadThoughts() // Reload thoughts after adding
    } catch (error) {
      console.error('Error adding thought:', error)
      showNotificationAlert('Failed to add thought', 'error')
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
    setDeletingThoughtId(thoughtId)
    try {
      setTimeout(async () => {
        await deleteThought(thoughtId)
        await loadThoughts()
        setDeletingThoughtId(null)
        showNotificationAlert('Thought deleted successfully!', 'info')
      }, 300)
    } catch (error) {
      console.error('Error deleting thought:', error)
      setDeletingThoughtId(null)
      showNotificationAlert('Failed to delete thought', 'error')
    }
  }

  const toggleExpandThought = (thoughtId) => {
    if (expandedThoughtId === thoughtId) {
      setExpandedThoughtId(null)
    } else {
      setExpandedThoughtId(thoughtId)
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''
    
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const getNotificationStyles = () => {
    switch (notificationType) {
      case 'success':
        return 'bg-green-50 border-green-100 text-green-700'
      case 'error':
        return 'bg-red-50 border-red-100 text-red-700'
      case 'info':
        return 'bg-blue-50 border-blue-100 text-blue-700'
      default:
        return 'bg-gray-50 border-gray-100 text-gray-700'
    }
  }

  useEffect(() => {
    loadThoughts()
  }, [])

  return (
    <>
      {showNotification && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex items-center p-4 border rounded-lg shadow-lg animate-fade-in ${getNotificationStyles()}`}
          role="alert"
        >
          <div className="flex items-center font-medium">
            {notificationType === 'success' && (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {notificationType === 'error' && (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {notificationType === 'info' && (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
              </svg>
            )}
            <span>{notificationMessage}</span>
          </div>
        </div>
      )}

      <div className="w-full">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="mb-6">
          <div className="relative">
            <textarea
              value={currentThought}
              onChange={(e) => setCurrentThought(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none placeholder:text-gray-400 text-gray-700"
              placeholder="What's on your mind?"
              rows={3}
            />
            <button
              type="submit"
              disabled={isLoading || isSubmitting || !currentThought.trim()}
              className={`absolute bottom-3 right-3 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-1 transition-all duration-300 ${
                isSubmitting || !currentThought.trim()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add
                </>
              )}
            </button>
          </div>
        </form>
        
        <div className="p-2">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-indigo-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {thoughts.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No thoughts yet. Add a new thought to get started!</p>
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
                      className={`relative bg-white/90 backdrop-blur-sm border border-gray-100/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 ${
                        deletingThoughtId === thought.id
                          ? 'transform scale-95 opacity-0 transition-all duration-300 ease-in-out'
                          : 'transform scale-100 opacity-100 transition-all duration-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => toggleExpandThought(thought.id)}
                        >
                          <p className={`text-gray-700 ${expandedThoughtId === thought.id ? '' : 'line-clamp-3'}`}>
                            {thought.thought}
                          </p>
                          <div className="mt-2 text-xs text-gray-500 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatTimestamp(thought.timestamp)}
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(thought.id); }}
                          className="ml-3 p-1 text-gray-400 hover:text-red-500 transition-colors duration-300 rounded-full hover:bg-red-50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Expand/Collapse indicator */}
                      {thought.thought.length > 150 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleExpandThought(thought.id); }}
                          className="absolute bottom-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                          {expandedThoughtId === thought.id ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default NoteCard