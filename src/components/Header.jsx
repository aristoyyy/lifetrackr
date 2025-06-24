import React, { useState } from 'react';

export default function Header({ setSection, currentSection }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [notificationCount, setNotificationCount] = useState(2);

    const handleSectionChange = (section) => {
        setSection(section);
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        setShowProfileMenu(false);
    };

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
        setShowNotifications(false);
    };

    const clearNotifications = () => {
        setNotificationCount(0);
        setShowNotifications(false);
    };

    const navItems = [
        { name: 'Mind', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        )},
        { name: 'Insights', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        )},
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                LifeTracker
                            </span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleSectionChange(item.name)}
                                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 flex items-center space-x-1 group ${
                                    currentSection === item.name
                                        ? 'text-indigo-600'
                                        : 'text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                <span className="text-current">{item.icon}</span>
                                <span>{item.name}</span>
                                {currentSection === item.name && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></span>
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={toggleNotifications}
                                className={`p-2 rounded-full transition-colors duration-300 ${
                                    showNotifications ? 'bg-gray-100 text-indigo-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {notificationCount > 0 && (
                                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                                )}
                            </button>

                            {/* Notifications dropdown */}
                            {showNotifications && (
                                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                    <div className="py-1">
                                        <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                                            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                                            <button 
                                                onClick={clearNotifications}
                                                className="text-xs text-indigo-600 hover:text-indigo-800"
                                            >
                                                Clear all
                                            </button>
                                        </div>
                                        {notificationCount > 0 ? (
                                            <div>
                                                <a href="#" className="block px-4 py-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                                                            <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                        <div className="ml-3 w-0 flex-1">
                                                            <p className="text-sm font-medium text-gray-900">Task completed!</p>
                                                            <p className="mt-1 text-sm text-gray-500">You've completed "Finish project proposal".</p>
                                                            <p className="mt-1 text-xs text-gray-400">2 hours ago</p>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="#" className="block px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 bg-blue-100 rounded-full p-1">
                                                            <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                        <div className="ml-3 w-0 flex-1">
                                                            <p className="text-sm font-medium text-gray-900">Task reminder</p>
                                                            <p className="mt-1 text-sm text-gray-500">"Call mom" is due today.</p>
                                                            <p className="mt-1 text-xs text-gray-400">5 hours ago</p>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="px-4 py-6 text-center text-sm text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-6 w-6 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                </svg>
                                                <p>No new notifications</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile dropdown */}
                        <div className="relative">
                            <button
                                onClick={toggleProfileMenu}
                                className={`flex items-center transition-opacity duration-300 ${
                                    showProfileMenu ? 'opacity-80' : 'opacity-100'
                                }`}
                            >
                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white font-medium">
                                    AW
                                </div>
                            </button>

                            {/* Profile menu */}
                            {showProfileMenu && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                    <div className="py-1">
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                                            Your Profile
                                        </a>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                                            Settings
                                        </a>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                                            Sign out
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className="md:hidden py-2 border-t border-gray-100">
                    <div className="flex justify-around">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleSectionChange(item.name)}
                                className={`flex flex-col items-center px-3 py-2 text-xs font-medium ${
                                    currentSection === item.name
                                        ? 'text-indigo-600'
                                        : 'text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                <span className="text-current">{item.icon}</span>
                                <span className="mt-1">{item.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
} 