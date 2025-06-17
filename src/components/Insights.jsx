import React from 'react';

const Insights = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="mt-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="animate-slide-in text-6xl font-semibold text-gray-900 pt-5 pb-2 leading-tight bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
            Your Insights
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Section 1: Overview */}
            <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-sm font-medium text-xl text-center border border-gray-100/50 hover:bg-white/80 transition-all duration-300">
              <p className="text-2xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent font-bold mb-4">Overall Summary</p>
              <div className="text-gray-700 text-base leading-relaxed">
                <p>This is where you'll find a summary of your activities. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p className="mt-2">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
            </div>

            {/* Section 2: Key Metrics */}
            <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-sm font-medium text-xl text-center border border-gray-100/50 hover:bg-white/80 transition-all duration-300">
              <p className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent font-bold mb-4">Key Metrics</p>
              <ul className="text-gray-700 text-base space-y-2 text-left">
                <li className="flex justify-between items-center bg-gray-50/50 p-2 rounded-lg"><span className="font-medium">Thoughts Logged:</span> <span>150</span></li>
                <li className="flex justify-between items-center bg-gray-50/50 p-2 rounded-lg"><span className="font-medium">Tasks Completed:</span> <span>75</span></li>
                <li className="flex justify-between items-center bg-gray-50/50 p-2 rounded-lg"><span className="font-medium">Average Mood:</span> <span>Positive</span></li>
              </ul>
            </div>
          </div>

          {/* Section 3: Charts/Graphs (Placeholder) */}
          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-sm font-medium text-xl text-center border border-gray-100/50 hover:bg-white/80 transition-all duration-300">
            <p className="text-2xl bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent font-bold mb-4">Visual Data</p>
            <div className="h-64 flex items-center justify-center bg-gray-50/50 rounded-xl border border-gray-100">
              <p className="text-gray-500">Placeholder for charts or graphs</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Insights; 