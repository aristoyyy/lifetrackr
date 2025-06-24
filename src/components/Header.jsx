import { useState, useEffect, useRef } from 'react';

export default function Header({ setSection, currentSection }) {
    const handleClick = (section) => { 
        setSection(section);
    }

    const [scrolled, setScrolled] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    
    const notificationsRef = useRef(null);
    const profileMenuRef = useRef(null);

    // Sample notifications data
    const notifications = [
        { id: 1, text: "You have 3 tasks due today", time: "Just now", isNew: true },
        { id: 2, text: "Welcome to LifeTrackr!", time: "2 days ago", isNew: false },
        { id: 3, text: "Try adding a new thought", time: "3 days ago", isNew: false },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [scrolled]);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-white/80 backdrop-blur-xl shadow-md' : 'bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent">
                            LifeTrackr
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-6">
                        <button 
                            onClick={() => handleClick('Mind')} 
                            className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                                currentSection === 'Mind' 
                                ? 'bg-white shadow-md text-indigo-600 border border-indigo-100' 
                                : 'hover:bg-white/60 text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                                Mind
                            </span>
                            {currentSection === 'Mind' && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 transform animate-pulse-slow"></span>
                            )}
                        </button>
                        <button 
                            onClick={() => handleClick('Insights')} 
                            className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                                currentSection === 'Insights' 
                                ? 'bg-white shadow-md text-indigo-600 border border-indigo-100' 
                                : 'hover:bg-white/60 text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Insights
                            </span>
                            {currentSection === 'Insights' && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 transform animate-pulse-slow"></span>
                            )}
                        </button>
                    </nav>

                    {/* Profile/User Section */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <div className="relative" ref={notificationsRef}>
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 rounded-full hover:bg-white/60 transition-colors duration-200 relative group"
                            >
                                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                                <span className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-hover:opacity-25 transition-opacity duration-200"></span>
                            </button>
                            
                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200 animate-fade-in">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="px-4 py-6 text-center text-gray-500">
                                                <p>No notifications yet</p>
                                            </div>
                                        ) : (
                                            notifications.map(notification => (
                                                <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${notification.isNew ? 'bg-blue-50' : ''}`}>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="text-sm text-gray-800">{notification.text}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                                        </div>
                                                        {notification.isNew && (
                                                            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="px-4 py-2 border-t border-gray-100">
                                        <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                                            Mark all as read
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Profile Menu */}
                        <div className="relative" ref={profileMenuRef}>
                            <button 
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-white/60 transition-colors duration-200 group"
                            >
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-md group-hover:shadow-lg transition-all duration-200">
                                    A
                                </div>
                                <span className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-hover:opacity-25 transition-opacity duration-200"></span>
                            </button>
                            
                            {/* Profile Dropdown */}
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200 animate-fade-in">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">Aristo Wang</p>
                                        <p className="text-xs text-gray-500 truncate">user@example.com</p>
                                    </div>
                                    <div className="py-1">
                                        <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                            </svg>
                                            Settings
                                        </button>
                                        <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                            </svg>
                                            Help
                                        </button>
                                        <button className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                                            </svg>
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
} 