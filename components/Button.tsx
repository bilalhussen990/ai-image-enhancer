
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-base-100 font-bold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:bg-brand-secondary hover:scale-105 disabled:bg-base-300 disabled:text-content-200 disabled:cursor-not-allowed disabled:scale-100"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
