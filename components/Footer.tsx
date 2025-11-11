
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-cream dark:bg-light-charcoal shadow-inner transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-charcoal dark:text-cream">
                <p>&copy; {new Date().getFullYear()} FlavorVerse. All rights reserved.</p>
                <p className="text-sm mt-1">Discover, Create, Share.</p>
            </div>
        </footer>
    );
};

export default Footer;
