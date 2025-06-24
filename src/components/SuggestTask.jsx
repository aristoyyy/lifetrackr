import React, { useEffect, useState } from 'react';

export default function SuggestTask({ thoughts, incompleteTasks }) {
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Generate suggestion based on thoughts and incomplete tasks
    const generateSuggestion = () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if there are any thoughts or tasks
        if (thoughts.length === 0 && incompleteTasks.length === 0) {
          setSuggestion({
            title: "Start by adding a thought or task",
            description: "Your personalized suggestions will appear here once you've added some thoughts or tasks.",
            priority: "low",
            icon: "lightbulb"
          });
          return;
        }
        
        // Check for overdue tasks
        const today = new Date();
        const overdueTasks = incompleteTasks.filter(task => {
          const dueDate = new Date(task.due_date);
          return dueDate < today && dueDate.toDateString() !== today.toDateString();
        });
        
        if (overdueTasks.length > 0) {
          setSuggestion({
            title: `You have ${overdueTasks.length} overdue ${overdueTasks.length === 1 ? 'task' : 'tasks'}`,
            description: "Consider completing your overdue tasks before taking on new ones.",
            priority: "high",
            icon: "clock"
          });
          return;
        }
        
        // Check for tasks due today
        const todayTasks = incompleteTasks.filter(task => {
          const dueDate = new Date(task.due_date);
          return dueDate.toDateString() === today.toDateString();
        });
        
        if (todayTasks.length > 0) {
          setSuggestion({
            title: `You have ${todayTasks.length} ${todayTasks.length === 1 ? 'task' : 'tasks'} due today`,
            description: "Focus on completing today's tasks to stay on track.",
            priority: "medium",
            icon: "calendar"
          });
          return;
        }
        
        // Check if there are many incomplete tasks
        if (incompleteTasks.length > 5) {
          setSuggestion({
            title: "You have many tasks in progress",
            description: "Consider prioritizing and focusing on completing a few tasks at a time.",
            priority: "medium",
            icon: "list"
          });
          return;
        }
        
        // Default suggestion
        const suggestions = [
          {
            title: "Take a moment to reflect",
            description: "Consider adding any new thoughts or ideas that come to mind.",
            priority: "low",
            icon: "brain"
          },
          {
            title: "Plan your week ahead",
            description: "Add tasks with due dates to stay organized and on track.",
            priority: "low",
            icon: "calendar"
          },
          {
            title: "Review your progress",
            description: "Check your completed tasks to see what you've accomplished.",
            priority: "low",
            icon: "chart"
          }
        ];
        
        const randomIndex = Math.floor(Math.random() * suggestions.length);
        setSuggestion(suggestions[randomIndex]);
        
      } catch (err) {
        console.error("Error generating suggestion:", err);
        setError("Couldn't generate suggestion. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    generateSuggestion();
  }, [thoughts, incompleteTasks]);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'lightbulb':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'clock':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'calendar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'list':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'brain':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'chart':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-100',
          text: 'text-red-700',
          icon: 'text-red-500',
          indicator: 'bg-red-500'
        };
      case 'medium':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-100',
          text: 'text-amber-700',
          icon: 'text-amber-500',
          indicator: 'bg-amber-500'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-100',
          text: 'text-blue-700',
          icon: 'text-blue-500',
          indicator: 'bg-blue-500'
        };
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 shadow-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-gray-100/50 rounded-xl p-6 shadow-md animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const styles = getPriorityStyles(suggestion.priority);

  return (
    <div className={`relative ${styles.bg} border ${styles.border} rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300`}>
      <span className={`absolute left-0 top-0 bottom-0 w-1 ${styles.indicator} rounded-l-lg`}></span>
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 ${styles.icon} p-2 rounded-full bg-white/80 shadow-sm`}>
          {getIcon(suggestion.icon)}
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${styles.text}`}>{suggestion.title}</h3>
          <p className={`mt-1 text-sm ${styles.text} opacity-90`}>{suggestion.description}</p>
        </div>
      </div>
    </div>
  );
}