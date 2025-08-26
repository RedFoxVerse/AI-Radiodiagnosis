
import React, { useState, ReactNode } from 'react';
import { ChevronDownIcon } from './icons';

interface AccordionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

const Accordion = ({ title, icon, children, defaultOpen = false }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg mb-4 bg-white dark:bg-slate-800/50 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-800 dark:text-slate-200"
      >
        <div className="flex items-center">
            {icon}
            <span className="ml-3">{title}</span>
        </div>
        <ChevronDownIcon
          className={`w-5 h-5 text-slate-500 transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 prose prose-slate dark:prose-invert max-w-none">
            {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
