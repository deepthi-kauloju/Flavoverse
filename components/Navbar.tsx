import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Home, BookOpen, PlusSquare } from 'lucide-react';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const NavItem: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
    const navLinkClasses = "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeClass = "bg-coral text-white";
    const inactiveClass = "text-charcoal dark:text-cream hover:bg-mint dark:hover:bg-charcoal";
    
    return (
         <NavLink
            to={to}
            className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
        >
            {children}
        </NavLink>
    )
}

const Navbar: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/recipes?query=${searchQuery}`);
            setSearchQuery('');
        }
    };

    return (
        <nav className="bg-cream dark:bg-light-charcoal shadow-md sticky top-0 z-40 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-2xl font-bold font-display text-coral flex-shrink-0">FlavorVerse</Link>
                         {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-2">
                             <NavItem to="/"><Home className="h-5 w-5" /> <span>Home</span></NavItem>
                             <NavItem to="/recipes"><BookOpen className="h-5 w-5" /> <span>Recipes</span></NavItem>
                             {isAuthenticated && (
                                <NavItem to="/create-recipe"><PlusSquare className="h-5 w-5" /> <span>Add Recipe</span></NavItem>
                             )}
                        </div>
                    </div>
                   
                    <div className="flex items-center space-x-3">
                         <div className="hidden md:block">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search recipes..."
                                    className="px-3 py-1.5 rounded-full bg-mint dark:bg-charcoal border border-transparent focus:outline-none focus:ring-2 focus:ring-coral w-40 lg:w-48 transition"
                                />
                            </form>
                        </div>
                        <button onClick={toggleTheme} className="p-2 rounded-full text-charcoal dark:text-cream hover:bg-mint dark:hover:bg-charcoal transition">
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>
                        {/* Desktop User Menu */}
                        <div className="hidden md:block">
                            {isAuthenticated ? (
                                <div className="relative group">
                                    <Link to="/dashboard">
                                        <img src={user?.profilePhoto || `https://i.pravatar.cc/150?u=${user?.email}`} alt={user?.name} className="h-9 w-9 rounded-full cursor-pointer" />
                                    </Link>
                                    <div className="absolute right-0 mt-2 w-48 bg-cream dark:bg-light-charcoal rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{user?.name}</div>
                                        <Link to="/dashboard" className="block px-4 py-2 text-sm text-charcoal dark:text-cream hover:bg-mint dark:hover:bg-charcoal">My Profile</Link>
                                        <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-charcoal dark:text-cream hover:bg-mint dark:hover:bg-charcoal">Logout</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link to="/login" className="px-4 py-2 rounded-md text-sm font-medium text-charcoal dark:text-cream hover:bg-mint dark:hover:bg-charcoal transition">Login</Link>
                                    <Link to="/register" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-coral hover:bg-opacity-80 transition">Register</Link>
                                </div>
                            )}
                        </div>
                         {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-charcoal dark:text-cream hover:bg-mint dark:hover:bg-charcoal">
                                {isMenuOpen ? <XIcon /> : <MenuIcon />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
             {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-cream dark:bg-light-charcoal pb-4 px-4 space-y-4">
                     <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search recipes..."
                            className="w-full px-3 py-2 rounded-full bg-mint dark:bg-charcoal border border-transparent focus:outline-none focus:ring-2 focus:ring-coral transition"
                        />
                    </form>
                    <Link to="/" className="flex items-center space-x-2 text-charcoal dark:text-cream hover:text-coral dark:hover:text-coral transition"><Home className="h-5 w-5" /><span>Home</span></Link>
                    <Link to="/recipes" className="flex items-center space-x-2 text-charcoal dark:text-cream hover:text-coral dark:hover:text-coral transition"><BookOpen className="h-5 w-5" /><span>Recipes</span></Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/create-recipe" className="flex items-center space-x-2 text-charcoal dark:text-cream hover:text-coral dark:hover:text-coral transition"><PlusSquare className="h-5 w-5" /><span>Add Recipe</span></Link>
                            <hr className="border-gray-200 dark:border-gray-600" />
                            <Link to="/dashboard" className="block text-charcoal dark:text-cream hover:text-coral dark:hover:text-coral transition">My Profile</Link>
                            <button onClick={logout} className="block w-full text-left text-charcoal dark:text-cream hover:text-coral dark:hover:text-coral transition">Logout</button>
                        </>
                    ) : (
                        <>
                           <hr className="border-gray-200 dark:border-gray-600" />
                            <Link to="/login" className="block px-4 py-2 rounded-md text-center font-medium text-charcoal dark:text-cream hover:bg-mint dark:hover:bg-charcoal transition">Login</Link>
                            <Link to="/register" className="block px-4 py-2 rounded-md text-center font-medium text-white bg-coral hover:bg-opacity-80 transition">Register</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;