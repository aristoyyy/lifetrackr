import React, { useEffect, useState } from 'react';

const Insights = ({ thoughts, incompleteTasks, completedTasks }) => {
  const [summary, setSummary] = useState("");
  const [summaryPoints, setSummaryPoints] = useState([]);
  const [summaryTitle, setSummaryTitle] = useState("");
  const [summaryTags, setSummaryTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageMood, setAverageMood] = useState("N/A");
  const [emotionDistribution, setEmotionDistribution] = useState({ Positive: 0, Negative: 0, Neutral: 0 });

  const getEmotionCategory = (emotion) => {
    const positive = ['joy', 'love', 'surprise'];
    const negative = ['sadness', 'anger', 'fear', 'disgust'];
    if (positive.includes(emotion)) return 'Positive';
    if (negative.includes(emotion)) return 'Negative';
    return 'Neutral';
  };

  useEffect(() => {
    const analyzeThoughts = async () => {
      if (thoughts.length === 0) {
        setAverageMood("N/A");
        setEmotionDistribution({ Positive: 0, Negative: 0, Neutral: 0 });
        return;
      }

      const emotionCounts = { Positive: 0, Negative: 0, Neutral: 0 };
      await Promise.all(thoughts.map(async (thought) => {
        if (!thought.thought.trim()) return;
        try {
          const res = await fetch('http://localhost:8000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: thought.thought })
          });
          if (!res.ok) return;
          const data = await res.json();
          if (data.emotion && data.emotion.label) {
            const category = getEmotionCategory(data.emotion.label);
            emotionCounts[category]++;
          }
        } catch (error) {
          console.error('Error analyzing thought:', error);
        }
      }));
      setEmotionDistribution(emotionCounts);

      const dominantMood = Object.keys(emotionCounts).reduce((a, b) => emotionCounts[a] > emotionCounts[b] ? a : b);
      setAverageMood(dominantMood);
    };

    const loadSummary = async () => {
      try {
        const thoughtTexts = thoughts.map(t => t.thought || '');
        const taskTexts = incompleteTasks.map(t => t.name || '');
        const res = await fetch('http://localhost:8000/insight-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ thoughts: thoughtTexts, tasks: taskTexts })
        });
        const fetchedSummary = await res.json();
        setSummary(fetchedSummary);
        
        // Process summary into structured format
        // This is a simplified approach - in a real app, you might want to use the API to return structured data
        const summaryText = fetchedSummary || "";
        
        // Extract a title from the first sentence
        const firstSentence = summaryText.split('.')[0];
        setSummaryTitle(firstSentence || "Your Weekly Insights");
        
        // Create bullet points from the rest of the text
        const points = summaryText
          .replace(firstSentence, '')
          .split('.')
          .filter(sentence => sentence.trim().length > 10)
          .map(sentence => sentence.trim())
          .slice(0, 3);
        setSummaryPoints(points);
        
        // Generate tags based on content keywords
        const tags = [];
        if (summaryText.match(/progress|improve|grow|learn|develop/i)) tags.push({ emoji: '🧠', text: 'Growth' });
        if (summaryText.match(/happy|joy|enjoy|fun|play|relax/i)) tags.push({ emoji: '🎉', text: 'Fun' });
        if (summaryText.match(/friend|talk|connect|social|people|relationship/i)) tags.push({ emoji: '💬', text: 'Social' });
        if (summaryText.match(/focus|concentrate|productivity|efficient|effective/i)) tags.push({ emoji: '🎯', text: 'Focus' });
        if (summaryText.match(/health|exercise|sleep|rest|wellness|balance/i)) tags.push({ emoji: '🌱', text: 'Wellness' });
        setSummaryTags(tags.slice(0, 3)); // Limit to 3 tags
        
      } catch (error) {
        console.error('Error loading summary:', error);
        setSummary("Could not load summary.");
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([loadSummary(), analyzeThoughts()]);
      setLoading(false);
    };

    fetchData();
  }, [thoughts, incompleteTasks]);

  const TaskPieChart = () => {
    const total = incompleteTasks.length + completedTasks.length;
    if (total === 0) {
      return <div className="flex items-center justify-center h-full"><p className="text-gray-500">No tasks to display.</p></div>;
    }
    const incompletePercentage = (incompleteTasks.length / total) * 100;
    const completedPercentage = 100 - incompletePercentage;
    const gradient = `conic-gradient(#34D399 ${completedPercentage}%, #F87171 ${completedPercentage}%)`;

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-32 h-32 rounded-full transform transition-transform duration-500 hover:scale-110" style={{ background: gradient }}></div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-emerald-400 mr-2"></div><span>Completed ({completedTasks.length})</span></div>
          <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div><span>Incomplete ({incompleteTasks.length})</span></div>
        </div>
      </div>
    );
  };

  const EmotionBarChart = () => {
    const total = Object.values(emotionDistribution).reduce((a, b) => a + b, 0);
    if (total === 0) {
      return <div className="flex items-center justify-center h-full"><p className="text-gray-500">Not enough data to display chart.</p></div>;
    }
    const colors = { Positive: 'bg-green-400', Negative: 'bg-red-400', Neutral: 'bg-indigo-400' };

    return (
      <div className="flex justify-around items-end h-48 p-4 bg-gray-50/50 rounded-xl">
        {Object.keys(emotionDistribution).map(key => {
          const percentage = (emotionDistribution[key] / total) * 100;
          return (
            <div key={key} className="flex flex-col items-center w-1/3">
              <div className="flex items-end h-full w-full justify-center">
                <div className={`${colors[key]} w-12 rounded-t-lg transition-all duration-300 hover:opacity-80`} style={{ height: `${percentage}%` }}></div>
              </div>
              <span className="mt-2 text-sm text-gray-700 font-medium">{key}</span>
              <span className="text-xs text-gray-500">{emotionDistribution[key]} thoughts</span>
            </div>
          );
        })}
      </div>
    );
  };
  
  const moodEmojis = {
    Positive: '😊',
    Negative: '😢',
    Neutral: '😐',
    'N/A': '🤔'
  };

  const NextActions = () => {
    if (incompleteTasks.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No upcoming tasks.</p>
        </div>
      );
    }

    // Sort tasks by due date
    const sortedTasks = [...incompleteTasks].sort((a, b) => 
      new Date(a.due_date) - new Date(b.due_date)
    ).slice(0, 3); // Show only top 3

    return (
      <div className="space-y-4">
        {sortedTasks.map(task => (
          <div key={task.id} className="bg-white/80 p-3 rounded-lg shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300">
            <h4 className="font-medium text-gray-800">{task.name}</h4>
            <div className="flex items-center mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-gray-500">
                {new Date(task.due_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <main className="mt-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-8">
          <div className="text-center">
            <h1 key={Date.now()} className="animate-slide-in text-6xl font-bold text-gray-900 leading-tight bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent pb-2">
              Your Mental Dashboard
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">An overview of your thoughts, tasks, and emotional landscape.</p>
          </div>

          {/* Top Section with Mood in Center */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Key Metrics */}
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-100/50 hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Key Metrics</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex justify-between items-center text-lg"><span className="font-medium">Thoughts Logged:</span> <span className="font-bold text-indigo-500">{thoughts.length}</span></li>
                <li className="flex justify-between items-center text-lg"><span className="font-medium">Active Tasks:</span> <span className="font-bold text-indigo-500">{incompleteTasks.length}</span></li>
                <li className="flex justify-between items-center text-lg"><span className="font-medium">Completed Tasks:</span> <span className="font-bold text-indigo-500">{completedTasks.length}</span></li>
              </ul>
              
              {/* Task Pie Chart moved below metrics */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h3 className="text-lg font-medium text-gray-700 mb-3 text-center">Task Completion</h3>
                <TaskPieChart />
              </div>
            </div>
            
            {/* Average Mood - Now Larger and Centered */}
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-100/50 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300 md:row-span-1 md:col-span-1">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Average Mood</h2>
              <div className="animate-pulse-slow">
                <p className="text-7xl mb-3">{moodEmojis[averageMood]}</p>
              </div>
              <p className="mt-2 text-2xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">{averageMood}</p>
              
              <div className="mt-6 w-full pt-4 border-t border-gray-100">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Emotion Breakdown</h3>
                <div className="h-24">
                  <EmotionBarChart />
                </div>
              </div>
            </div>

            {/* Next Actions - Replacing Task Breakdown */}
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-100/50 hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-700 mb-4">What's Next</h2>
              <NextActions />
            </div>
          </div>
          
          {/* AI Summary - Restructured with visual hierarchy */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-md border border-gray-100/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">AI-Powered Insights</h2>
            </div>
            
            <div className="pl-4 border-l-4 border-indigo-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{summaryTitle}</h3>
              
              <ul className="space-y-3 mb-6">
                {summaryPoints.length > 0 ? (
                  summaryPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{point}.</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-700 text-lg leading-relaxed">{summary}</li>
                )}
              </ul>
              
              {summaryTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {summaryTags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700">
                      <span className="mr-1">{tag.emoji}</span> {tag.text}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Insights; 