import {completeTask, deleteIncompleteTask} from "../firebase/taskService";
import { useState } from "react";

export default function ToDoList({ tasks, onTaskUpdate }) {
  const [showCompletedNotification, setShowCompletedNotification] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const handleComplete = async (taskId) => {
    try {
      setCompletingTaskId(taskId);
      // Wait for animation to complete before updating the database
      setTimeout(async () => {
        await completeTask(taskId);
        onTaskUpdate();
        setCompletingTaskId(null);
        setShowCompletedNotification(true);
        setTimeout(() => setShowCompletedNotification(false), 3000);
      }, 500); // Match this with the CSS transition duration
    } catch (error) {
      console.error(error);
      setCompletingTaskId(null);
    }
  }

  const handleDelete = async (taskId) => {
    try {
      setDeletingTaskId(taskId);
      // Wait for animation to complete before updating the database
      setTimeout(async () => {
        await deleteIncompleteTask(taskId);
        onTaskUpdate();
        setDeletingTaskId(null);
      }, 300);
    } catch (error) {
      console.error(error);
      setDeletingTaskId(null);
    }
  }

  const isPastDue = (dueDate) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const isDueToday = (dueDate) => {
    return new Date(dueDate).toDateString() === new Date().toDateString();
  };

  const getDueDateStatus = (dueDate) => {
    if (isDueToday(dueDate)) {
      return { text: 'Due Today', className: 'text-orange-500 bg-orange-50 border-orange-100' };
    } else if (isPastDue(dueDate)) {
      return { text: 'Overdue', className: 'text-red-600 bg-red-50 border-red-100' };
    } else {
      const daysUntilDue = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysUntilDue <= 2) {
        return { text: 'Due Soon', className: 'text-amber-600 bg-amber-50 border-amber-100' };
      }
    }
    return null;
  };

  const formatDueDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="mt-4 h-[400px] overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {showCompletedNotification && (
        <div
          className="fixed bottom-4 right-4 z-50 flex items-center p-4 bg-green-50 border border-green-100 rounded-lg shadow-lg animate-fade-in"
          role="alert"
        >
          <div className="flex items-center text-green-700 font-medium">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Task completed successfully!</span>
          </div>
        </div>
      )}
      
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-center">No tasks yet. Add a new task to get started!</p>
        </div>
      ) : (
        <ul role="list" className="space-y-4">
          {tasks.map((task) => {
            const dueDateStatus = getDueDateStatus(task.due_date);
            return (
              <li 
                key={task.id} 
                className={`bg-white/80 backdrop-blur-sm border border-gray-100/50 rounded-xl p-4 group hover:bg-white/90 transition-all duration-300 shadow-sm hover:shadow-md card-hover ${
                  completingTaskId === task.id 
                    ? 'transform translate-x-full opacity-0 transition-all duration-500 ease-in-out' 
                    : deletingTaskId === task.id
                    ? 'transform scale-95 opacity-0 transition-all duration-300 ease-in-out'
                    : 'transform translate-x-0 opacity-100 transition-all duration-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-gray-800 transition-colors duration-300 truncate">
                      {task.name}
                    </h3>
                    {task.description && (
                      <p className="mt-1 text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                        <div className='flex items-center gap-3'>
                          <span>{formatDueDate(task.due_date)}</span>
                          
                          {dueDateStatus && (
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${dueDateStatus.className}`}>
                              {dueDateStatus.text}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <button 
                      onClick={() => handleComplete(task.id)} 
                      className={`hover:cursor-pointer bg-white/80 backdrop-blur-sm border border-emerald-100 shadow-sm rounded-lg px-3 py-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-300 flex items-center gap-1 ${
                        completingTaskId === task.id ? 'opacity-0' : 'opacity-100'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Done
                    </button>
                    <button 
                      onClick={() => handleDelete(task.id)} 
                      className={`hover:cursor-pointer bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all duration-300 flex items-center gap-1`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  )
}
  