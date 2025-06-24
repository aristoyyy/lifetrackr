import React from 'react'
import Header from "./components/Header.jsx";
import { useState, useEffect } from 'react';
import NoteCard from './components/NoteCard.jsx';
import ToDoList from './components/ToDoList.jsx';
import CompletedList from './components/CompletedList';
import Drawer from "./components/Drawer.jsx";
import {addTask, getIncompleteTasks, getCompletedTasks} from "./firebase/taskService.js"
import SuggestTask from './components/SuggestTask.jsx';
import Insights from './components/Insights.jsx';

const App = () => {
  const[section, setSection] = useState('Mind');
  const[incompleteTasks, setIncompleteTasks] = useState([]);
  const[completedTasks, setCompletedTasks] = useState([]);
  const [thoughts, setThoughts] = useState([]);


  const loadTasks = async () => {
    try {
      const incomplete = await getIncompleteTasks();
      const completed = await getCompletedTasks();
      setIncompleteTasks(incomplete);
      setCompletedTasks(completed);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async (taskData) => {
    try {
      const taskId = await addTask({
        name: taskData.name,
        description: taskData.description,
        due_date: taskData.due_date,
        is_complete: false
      });
      loadTasks(); // Reload all tasks after adding
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Calculate stats for the progress bar
  const totalTasks = incompleteTasks.length + completedTasks.length;
  const completionPercentage = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <Header setSection={setSection} currentSection={section} />
      
      <div className="transition-opacity duration-500 ease-in-out" key={section}>
        {section === 'Mind' && (
          <main className="mt-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 animate-fade-in">
            {/* Page Title with Progress Indicator */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 md:mb-0 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {section}
                </h1>
                
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-gray-500">
                    {completedTasks.length} of {totalTasks} tasks complete
                  </div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 mt-2 rounded-full"></div>
            </div>
            
            {/* Suggested Course of Action */}
            <div className="mb-8">
              <SuggestTask thoughts={thoughts} incompleteTasks={incompleteTasks}/>
            </div>
            
            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left Column - Thoughts */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-md font-medium text-xl border border-gray-100/50 hover:bg-white/90 transition-all duration-300 hover:shadow-lg">
                  <div className='flex justify-between items-center mb-4'>
                    <div className="flex items-center">
                      <span className="w-2 h-8 bg-blue-500 rounded-full mr-3"></span>
                      <h2 className="text-2xl font-bold text-gray-800">Thoughts</h2>
                    </div>
                    <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {thoughts.length} entries
                    </div>
                  </div>
                  <div className="mt-4 max-h-[500px] overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    <div className="space-y-4">
                      <NoteCard thoughts={thoughts} setThoughts={setThoughts} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Tasks */}
              <div className="lg:col-span-3 space-y-6">
                {/* To-Do Tasks */}
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-md font-medium text-xl border border-gray-100/50 hover:bg-white/90 transition-all duration-300 hover:shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <span className="w-2 h-8 bg-emerald-500 rounded-full mr-3"></span>
                      <h2 className="text-2xl font-bold text-gray-800">To-Do</h2>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        {incompleteTasks.length} tasks
                      </div>
                      <Drawer onAddTask={handleAddTask}/>
                    </div>
                  </div>
                  <ToDoList tasks={incompleteTasks} onTaskUpdate={loadTasks} />
                </div>
                
                {/* Completed Tasks */}
                <div className='bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-md font-medium text-xl border border-gray-100/50 hover:bg-white/90 transition-all duration-300 hover:shadow-lg'>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <span className="w-2 h-8 bg-amber-500 rounded-full mr-3"></span>
                      <h2 className="text-2xl font-bold text-gray-800">Completed</h2>
                    </div>
                    <div className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                      {completedTasks.length} tasks
                    </div>
                  </div>
                  <CompletedList tasks={completedTasks} onTaskUpdate={loadTasks} />
                </div>
              </div>
            </div>
            
            {/* Mobile Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 px-6 z-40">
              <button 
                className="flex flex-col items-center text-indigo-600"
                onClick={() => document.querySelector('.scrollbar-thin').scrollIntoView({ behavior: 'smooth' })}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-xs mt-1">Thoughts</span>
              </button>
              <button 
                className="flex flex-col items-center text-emerald-600"
                onClick={() => document.querySelectorAll('.scrollbar-thin')[1].scrollIntoView({ behavior: 'smooth' })}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-xs mt-1">To-Do</span>
              </button>
              <button 
                className="flex flex-col items-center text-amber-600"
                onClick={() => document.querySelectorAll('.scrollbar-thin')[2].scrollIntoView({ behavior: 'smooth' })}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs mt-1">Completed</span>
              </button>
            </div>
          </main>
        )}
        
        {section === 'Insights' && <Insights thoughts={thoughts} incompleteTasks={incompleteTasks} completedTasks={completedTasks}/>}
      </div>
    </div>
  )
}

export default App