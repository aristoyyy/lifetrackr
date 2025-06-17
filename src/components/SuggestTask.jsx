import React from 'react'

const SuggestTask = () => {
  return (
    <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-sm font-medium text-xl text-center border border-gray-100/50 hover:bg-white/80 transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent font-bold">Suggested Task</p>
      </div>
      <div className="flex items-center space-x-4">
        <div
          style={{
            background: `linear-gradient(to right, #B2EBF2, #80CBC4)`,
          }}
          className="font-medium p-4 rounded-full shadow-lg text-white flex-grow text-center"
        >
          <p className="leading-relaxed">Take a 15-minute walk</p>
        </div>
        <button className="px-5 py-3 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-sm font-medium rounded-full shadow-sm">
          Add Task
        </button>
      </div>
    </div>
  )
}

export default SuggestTask