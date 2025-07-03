import React from "react";

const Footer = () => (
  <footer className="w-full bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 border-t border-blue-200 py-6 mt-8">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-blue-700 font-semibold text-lg flex items-center gap-2">
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17v-2a4 4 0 018 0v2M5 10a7 7 0 0114 0v2a7 7 0 01-14 0v-2z"
          />
        </svg>
        Tasky
      </div>
      <div className="flex flex-wrap gap-6 text-blue-600 text-sm font-medium">
        <a href="/dashboard" className="hover:underline">
          Dashboard
        </a>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          GitHub
        </a>
        <a href="mailto:support@tasky.com" className="hover:underline">
          Contact
        </a>
        <a href="/privacy" className="hover:underline">
          Privacy Policy
        </a>
      </div>
      <div className="text-xs text-blue-400 text-center md:text-right">
        &copy; {new Date().getFullYear()} Tasky. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
