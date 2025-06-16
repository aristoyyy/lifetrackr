import { useState, useEffect } from 'react';

export default function Header({setSection}) {

    const handleClick = (section) => { 
        setSection(section);
    }

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-white/70 backdrop-blur-xl shadow-sm' : 'bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <h1 className="text-3xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            LifeTrackr
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-8 ">
                        <button onClick={() => handleClick('Mind')} className="hover:bg-gray-100 hover:cursor-pointer min-w-[120px] min-h-[50px] bg-white/70 backdrop-blur-xl text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border border-gray-100/50 shadow-sm">
                            Mind
                        </button>
                        <button onClick={() => handleClick('Body')} className="hover:bg-gray-100 hover:cursor-pointer min-w-[120px] bg-white/70 backdrop-blur-xl  text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border border-gray-100/50 shadow-sm">
                            Body
                        </button>
                        <button onClick={() => handleClick('Connection')} className="hover:bg-gray-100 hover:cursor-pointer min-w-[120px] bg-white/70 backdrop-blur-xl text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border border-gray-100/50 shadow-sm">
                            Connection
                        </button>
                    </nav>

                    {/* Profile/User Section */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                            <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                        <div className="relative">
                            <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                                    A
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
} 