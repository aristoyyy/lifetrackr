import React, { useEffect, useState } from 'react';

const Insights = ({ thoughts, incompleteTasks, completedTasks }) => {
  const [summary, setSummary] = useState("");
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


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <main className="mt-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-10">
          <div className="text-center">
            <h1 key={Date.now()} className="animate-slide-in text-6xl font-bold text-gray-900 leading-tight bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent pb-2">
              Your Mental Dashboard
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">An overview of your thoughts, tasks, and emotional landscape.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Key Metrics */}
            <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border-gray-100/50 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Key Metrics</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex justify-between items-center text-lg"><span className="font-medium">Thoughts Logged:</span> <span className="font-bold text-indigo-500">{thoughts.length}</span></li>
                <li className="flex justify-between items-center text-lg"><span className="font-medium">Active Tasks:</span> <span className="font-bold text-indigo-500">{incompleteTasks.length}</span></li>
                <li className="flex justify-between items-center text-lg"><span className="font-medium">Completed Tasks:</span> <span className="font-bold text-indigo-500">{completedTasks.length}</span></li>
              </ul>
            </div>
            
            {/* Average Mood */}
            <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border-gray-100/50 flex flex-col items-center justify-center text-center hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-700 mb-3">Average Mood</h2>
              <p className="text-6xl">{moodEmojis[averageMood]}</p>
              <p className="mt-3 text-2xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">{averageMood}</p>
            </div>

            {/* Task Breakdown */}
            <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border-gray-100/50 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Task Breakdown</h2>
              <TaskPieChart />
            </div>
          </div>
          
          {/* AI Summary */}
          <div className="bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-lg border-gray-100/50 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4">AI-Powered Summary</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{summary}</p>
          </div>

          {/* Emotion Distribution */}
          <div className="bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-lg border-gray-100/50 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent mb-4">Emotion Distribution</h2>
            <EmotionBarChart />
          </div>

        </div>
      </main>
    </div>
  );
};

export default Insights; 