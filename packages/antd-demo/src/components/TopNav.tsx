import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThunderboltOutlined } from '@ant-design/icons';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Features', path: '/features' },
  { name: 'How it works', path: '/how-it-works' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Contact', path: '/contact' },
];

const TopNav: React.FC = () => {
  const location = useLocation();

  return (
    <div className="bg-white shadow-sm py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <ThunderboltOutlined className="text-blue-500 text-2xl" />
          <span>TECH</span>
        </Link>

        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-2 py-1 ${
                location.pathname === item.path
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-700 hover:text-blue-500'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="md:hidden">
          <button className="p-2 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
