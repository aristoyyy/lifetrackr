import React, {useEffect} from 'react'

const SuggestTask = ({thoughts, incompleteTasks}) => {
    const [suggestedTask, setSuggestedTask] = React.useState('');

    const getSuggestedTask = async () => {
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
        const data = await res.json();
        return data.suggestedTask;
    }

    const loadSuggestedTask = async () => {
        try {
            const fetchedTask = await getSuggestedTask();
            setSuggestedTask(fetchedTask);
        } catch (error) {
            console.error('Error loading suggested task:', error)
        }
    }

    useEffect(() => {
        loadSuggestedTask();
    }, [thoughts, incompleteTasks])

    return (
        <div>
            {(suggestedTask ?? '') !== '' &&
                <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-sm font-medium text-xl text-center border border-gray-100/50 hover:bg-white/80 transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent font-bold">Suggested Course of Action</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div
                            style={{
                                background: `linear-gradient(to right, #B2EBF2, #80CBC4)`,
                            }}
                            className="font-medium p-4 rounded-full shadow-lg text-white flex-grow text-center"
                        >
                            <p className="leading-relaxed">{suggestedTask}</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default SuggestTask