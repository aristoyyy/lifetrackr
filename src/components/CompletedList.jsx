import {useEffect, useState} from "react";
import {getCompletedTasks} from "../firebase/taskService.js";

export default function CompletedList({ tasks }) {
  return (
    <div className="mt-4 h-[400px] overflow-y-auto px-4">
      <ul role="list" className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="bg-white/70 backdrop-blur-sm border border-gray-100/50 rounded-xl p-4 group hover:bg-white/80 transition-all duration-300 shadow-sm hover:shadow-md">
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
                  <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                    {new Date(task.due_date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0 flex items-center gap-1 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">Completed</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}