'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function Drawer({onAddTask}) {
    const [open, setOpen] = useState(false)
    const [showNotif, setShowNotif] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const[formData, setFormData] = useState({
        name: '',
        description: '',
        due_date: '',
        is_complete: false,
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault(); // Prevent page reload
        try {
            setIsSubmitting(true);
            await onAddTask(formData);
            setFormData({ name: '', description: '', due_date: '', is_complete: false}); 
            setOpen(false);
            setShowNotif(true);
            setTimeout(() => setShowNotif(false), 3000);
        } catch (error) {
            console.error('Error submitting task:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = formData.name.trim() !== '' && formData.due_date !== '';

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="hover:cursor-pointer hover:bg-indigo-50 mt-2 bg-white/80 border border-indigo-100 shadow-sm rounded-lg w-10 h-10 flex items-center justify-center text-indigo-600 transition-all duration-200 hover:shadow-md"
                aria-label="Add new task"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
            </button>
            
            {showNotif && (
                <div className="fixed bottom-4 right-4 z-50 px-4 py-3 bg-green-50 border border-green-100 rounded-lg shadow-lg animate-fade-in">
                    <p className="flex items-center text-green-700 font-medium">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Task added successfully!
                    </p>
                </div>
            )}
            
            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
                />

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                            <DialogPanel
                                transition
                                className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
                            >
                                <TransitionChild>
                                    <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 duration-500 ease-in-out data-closed:opacity-0 sm:-ml-10 sm:pr-4">
                                        <button
                                            type="button"
                                            onClick={() => setOpen(false)}
                                            className="relative rounded-md text-gray-300 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden"
                                        >
                                            <span className="absolute -inset-2.5" />
                                            <span className="sr-only">Close panel</span>
                                            <XMarkIcon aria-hidden="true" className="size-6" />
                                        </button>
                                    </div>
                                </TransitionChild>
                                <div className="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
                                    <div className="px-4 sm:px-6">
                                        <DialogTitle className="text-xl font-bold text-gray-900 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Create New Task</DialogTitle>
                                    </div>
                                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                        <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-6">
                                            <div className="space-y-5">
                                                <div>
                                                    <label htmlFor="name"
                                                        className="block mb-2 text-sm font-medium text-gray-700">Task Name<span className="text-red-500">*</span></label>
                                                    <input 
                                                        type="text" 
                                                        id="name" 
                                                        name="name" 
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 transition-all duration-200"
                                                        required
                                                        placeholder="What needs to be done?"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="description"
                                                        className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                                                    <textarea 
                                                        id="description" 
                                                        name="description" 
                                                        value={formData.description}
                                                        onChange={handleInputChange}
                                                        rows="3"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 transition-all duration-200"
                                                        placeholder="Add more details about this task (optional)"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="due_date"
                                                        className="block mb-2 text-sm font-medium text-gray-700">Due Date<span className="text-red-500">*</span></label>
                                                    <input 
                                                        type="date" 
                                                        id="due_date" 
                                                        name="due_date" 
                                                        value={formData.due_date}
                                                        onChange={handleInputChange}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 transition-all duration-200"
                                                        required
                                                    />
                                                </div>

                                                <button 
                                                    type="submit"
                                                    disabled={!isFormValid || isSubmitting}
                                                    className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200 flex items-center justify-center ${
                                                        isFormValid && !isSubmitting 
                                                            ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300' 
                                                            : 'bg-gray-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Creating Task...
                                                        </>
                                                    ) : (
                                                        'Create Task'
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}
