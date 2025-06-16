'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function Drawer({onAddTask}) {
    const [open, setOpen] = useState(false)
    const [showNotif, setShowNotif] = useState(false);

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
            await onAddTask(formData);
            setFormData({ name: '', description: '', due_date: '', is_complete: false}); 
            setOpen(false);
            setShowNotif(true);
            setTimeout(() => setShowNotif(false), 1000);
        } catch (error) {
            console.error('Error submitting task:', error);
        }
    };

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="hover:cursor-pointer hover:bg-gray-100 mt-2 bg-white/70 border border-gray-100/50 shadow-sm rounded-lg w-10 h-10"
            >
                +
            </button>
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
                                        <DialogTitle className="text-base font-semibold text-gray-900">Create New Task</DialogTitle>
                                    </div>
                                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                        <h1 className='mt-10 text-3xl font-medium'>Create To-Do List Item</h1>
                                        <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                                            <div className="mb-5">
                                                <label htmlFor="name"
                                                       className="mt-5 block mb-2 text-med font-medium text-gray-900 dark:text-white">Task</label>
                                                <input 
                                                    type="text" 
                                                    id="name" 
                                                    name="name" 
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    required
                                                />

                                                <label htmlFor="description"
                                                       className="mt-5 block mb-2 text-med font-medium text-gray-900 dark:text-white">Description</label>
                                                <input 
                                                    type="text" 
                                                    id="description" 
                                                    name="description" 
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                />

                                                <label htmlFor="due_date"
                                                       className="mt-5 block mb-2 text-med font-medium text-gray-900 dark:text-white">Due Date</label>
                                                <input 
                                                    type="date" 
                                                    id="due_date" 
                                                    name="due_date" 
                                                    value={formData.due_date}
                                                    onChange={handleInputChange}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                />

                                                <button type="submit"
                                                        className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit
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
