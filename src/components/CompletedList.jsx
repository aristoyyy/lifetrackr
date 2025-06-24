import {useEffect, useState} from "react";
import {getCompletedTasks, deleteCompletedTask} from "../firebase/taskService.js";

export default function CompletedList({ tasks, onTaskUpdate }) {
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [showDeleteNotification, setShowDeleteNotification] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const formatDueDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDelete = async (taskId) => {
    try {
      setDeletingTaskId(taskId);
      // Wait for animation to complete before updating the database
      setTimeout(async () => {
        await deleteCompletedTask(taskId);
        setDeletingTaskId(null);
        setShowDeleteNotification(true);
        setTimeout(() => setShowDeleteNotification(false), 3000);
        // Call the parent component's update function
        onTaskUpdate();
      }, 300);
    } catch (error) {
      console.error('Error deleting task:', error);
      setDeletingTaskId(null);
    }
  };

  const toggleExpandTask = (taskId) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(taskId);
    }
  };

  const getCompletionTimeAgo = (completedDate) => {
    if (!completedDate) return null;
    
    const completedTime = new Date(completedDate).getTime();
    const now = new Date().getTime();
    const diffInMs = now - completedTime;
    
    // Convert to appropriate time unit
    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="mt-4 h-[400px] overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {showDeleteNotification && (
        <div
          className="fixed bottom-4 right-4 z-50 flex items-center p-4 bg-blue-50 border border-blue-100 rounded-lg shadow-lg animate-fade-in"
          role="alert"
        >
          <div className="flex items-center text-blue-700 font-medium">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Task deleted successfully!</span>
          </div>
        </div>
      )}
      
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-center">No completed tasks yet. Complete a task to see it here!</p>
        </div>
      ) : (
        <ul role="list" className="space-y-3">
          {tasks.map((task) => {
            const completionTime = getCompletionTimeAgo(task.completed_date);
            
            return (
              <li 
                key={task.id} 
                className={`relative bg-white/90 backdrop-blur-sm border border-gray-100/50 rounded-xl p-4 group hover:bg-white/100 transition-all duration-300 shadow-sm hover:shadow-md card-hover ${
                  deletingTaskId === task.id 
                    ? 'transform scale-95 opacity-0 transition-all duration-300 ease-in-out'
                    : 'transform scale-100 opacity-100 transition-all duration-300'
                }`}
              >
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-lg"></span>
                
                <div className="flex justify-between items-start pl-2">
                  <div 
                    className="flex-1 min-w-0 cursor-pointer" 
                    onClick={() => toggleExpandTask(task.id)}
                  >
                    <div className="flex items-center">
                      <h3 className="text-base font-semibold text-gray-700 group-hover:text-gray-800 transition-colors duration-300 truncate">
                        {task.name}
                      </h3>
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-green-600 bg-green-50 border border-green-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Completed
                      </span>
                      {completionTime && (
                        <span className="ml-2 text-xs text-gray-500">
                          {completionTime}
                        </span>
                      )}
                    </div>
                    
                    {task.description && (
                      <div className={`mt-1 text-sm text-gray-500 group-hover:text-gray-600 transition-all duration-300 ${
                        expandedTaskId === task.id ? '' : 'line-clamp-1'
                      }`}>
                        {task.description}
                      </div>
                    )}
                    
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Due date: {formatDueDate(task.due_date)}</span>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-shrink-0">
                    <button 
                      onClick={() => handleDelete(task.id)}
                      className="hover:cursor-pointer bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all duration-300 flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
                
                {/* Expand/Collapse indicator */}
                <button 
                  onClick={() => toggleExpandTask(task.id)}
                  className="absolute bottom-2 right-2 text-gray-400 hover:text-gray-600"
                >
                  {expandedTaskId === task.id ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  )
}