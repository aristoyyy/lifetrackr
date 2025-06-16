import React from 'react'
import Header from "./components/Header.jsx";
import { useState, useEffect } from 'react';
import NoteCard from './components/NoteCard.jsx';
import ToDoList from './components/ToDoList.jsx';
import CompletedList from './components/CompletedList';
import Drawer from "./components/Drawer.jsx";
import {addTask, getIncompleteTasks, getCompletedTasks} from "./firebase/taskService.js"

const App = () => {
  const[section, setSection] = useState('Mind');
  const[notes, setNotes] = useState([{ id: 1 }]);
  const[incompleteTasks, setIncompleteTasks] = useState([]);
  const[completedTasks, setCompletedTasks] = useState([]);

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

  const addNote = () => {
    setNotes([...notes, { id: notes.length + 1 }]);
  };

  const deleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };  

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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header setSection={setSection} />
      <main className="mt-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div key={section} className="animate-slide-in text-6xl font-semibold text-gray-900 pt-5 pb-2 leading-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {section}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/70backdrop-blur-xl p-6 rounded-2xl shadow-sm font-medium text-xl text-center border border-gray-100/50 hover:bg-white/80 transition-all duration-300">
              <div className='flex justify-between'>
                <p className="text-gray-800 text-2xl">Thoughts</p>
              </div>
              <div className="mt-4 max-h-[400px] overflow-y-auto px-4">
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div key={note.id}><NoteCard onDelete={() => deleteNote(note.id)} /></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-sm font-medium text-xl text-center border border-gray-100/50 hover:bg-white/80 transition-all duration-300">
              <div className="flex justify-between">
                <p className="text-gray-800 text-2xl">To-do</p>
                <Drawer onAddTask={handleAddTask}/>
              </div>
              <ToDoList tasks={incompleteTasks} onTaskUpdate={loadTasks} />
            </div>
          </div>
          <div className='bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-sm text-center font-medium text-xl border border-gray-100/50 hover:bg-white/80 transition-all duration-300'>
            <p className="text-gray-800 text-2xl">Completed</p>
            <CompletedList tasks={completedTasks} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App