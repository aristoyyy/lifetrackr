import React, {useEffect, useState} from 'react'

const SuggestTask = ({thoughts, incompleteTasks}) => {
    const [suggestedTask, setSuggestedTask] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getSuggestedTask = async () => {
        try {
            // Extract just the text content from thoughts and tasks
            const thoughtTexts = thoughts.map(t => t.thought || '');
            const taskTexts = incompleteTasks.map(t => t.name || '');
            
            const res = await fetch('http://localhost:8000/suggest-task', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    thoughts: thoughtTexts,
                    tasks: taskTexts
                })
            });
            
            if (!res.ok) {
                throw new Error('Failed to fetch suggestion');
            }
            
            const data = await res.json();
            return data.suggestedTask;
        } catch (error) {
            setError(error.message);
            return '';
        }
    }

    const loadSuggestedTask = async () => {
        try {
            setIsLoading(true);
            const fetchedTask = await getSuggestedTask();
            setSuggestedTask(fetchedTask);
        } catch (error) {
            console.error('Error loading suggested task:', error);
            setError('Failed to load suggestion');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadSuggestedTask();
    }, [thoughts, incompleteTasks])

    if (error) {
        return null; // Don't show anything if there's an error
    }

    if (!suggestedTask && !isLoading) {
        return null; // Don't show anything if there's no suggestion
    }

    return (
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-md font-medium text-xl text-center border border-gray-100/50 hover:bg-white/90 transition-all duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <p className="text-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent font-bold">Suggested Course of Action</p>
                <button 
                    onClick={loadSuggestedTask} 
                    className="p-2 rounded-full hover:bg-indigo-50 text-indigo-600 transition-colors duration-200"
                    title="Refresh suggestion"
                    disabled={isLoading}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className="flex items-center space-x-4">
                {isLoading ? (
                    <div className="flex-grow flex justify-center items-center py-8">
                        <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-indigo-500"></div>
                    </div>
                ) : (
                    <div
                        className="font-medium p-5 rounded-xl shadow-lg text-gray-800 flex-grow text-center bg-gradient-to-r from-cyan-50 to-blue-50 border border-blue-100 card-hover"
                    >
                        <p className="leading-relaxed">{suggestedTask}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SuggestTask