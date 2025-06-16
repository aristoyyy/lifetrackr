import {completeTask, deleteIncompleteTask} from "../firebase/taskService";
import { useState } from "react";

export default function ToDoList({ tasks, onTaskUpdate }) {
  const [showCompletedNotifation, setShowCompletedNotifation] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState(null);

  const handleComplete = async (taskId) => {
    try {
      setCompletingTaskId(taskId);
      // Wait for animation to complete before updating the database
      setTimeout(async () => {
        await completeTask(taskId);
        onTaskUpdate();
        setCompletingTaskId(null);
        setShowCompletedNotifation(true);
        setTimeout(() => setShowCompletedNotifation(false), 2000);
      }, 500); // Match this with the CSS transition duration
    } catch (error) {
      console.error(error);
      setCompletingTaskId(null);
    }
  }

  const handleDelete = async (taskId) => {
    try {
      await deleteIncompleteTask(taskId);
      onTaskUpdate();
    }catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="mt-4 h-[400px] overflow-y-auto px-4">
      {showCompletedNotifation && (
        <div
          id="toast-success"
          className="fixed bottom-4 right-4 z-50 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800"
          role="alert"
        >
          <div className="ms-3 text-sm font-semibold text-green-700 bg-green-100 rounded-md px-4 py-2 shadow-sm select-none">
            🎉 Congratulations on finishing! 🎉
          </div>
        </div>
      )}
      <ul role="list" className="space-y-3">
        {tasks.map((task) => (
          <li 
            key={task.id} 
            className={`bg-white/70 backdrop-blur-sm border border-gray-100/50 rounded-xl p-4 group hover:bg-white/80 transition-all duration-300 shadow-sm hover:shadow-md ${
              completingTaskId === task.id 
                ? 'transform translate-x-full opacity-0 transition-all duration-500 ease-in-out' 
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
                <div className="mt-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                    <div className='flex justify-between items-center gap-3 w-full'>
                      {new Date(task.due_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}

                      {new Date(task.due_date).toDateString() === new Date().toDateString() ? (
                        <p className='font-bold text-orange-400'>Due Today</p>
                      ) : new Date(task.due_date) < new Date() ? (
                        <p className='font-bold text-red-600'>Overdue</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleComplete(task.id)} 
                className={`ml-4 flex-shrink-0 hover:cursor-pointer bg-white/70 backdrop-blur-sm border border-gray-100/50 shadow-sm rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white/80 transition-all duration-300 flex items-center gap-1 ${
                  completingTaskId === task.id ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Done
              </button>
              <button onClick={() => handleDelete(task.id)} className={`ml-4 flex-shrink-0 hover:cursor-pointer bg-white/70 backdrop-blur-sm border border-gray-100/50 shadow-sm rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white/80 transition-all duration-300 flex items-center gap-1`}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
  