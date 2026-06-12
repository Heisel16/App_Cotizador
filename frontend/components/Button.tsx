'use client';

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const baseStyles =
    'font-medium rounded-md transition-all duration-200 inline-flex items-center justify-center gap-2 whitespace-nowrap';

  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 disabled:bg-gray-400',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-300',
    outline: 'border border-gray-300 text-gray-900 bg-white hover:bg-gray-50 active:bg-gray-100 disabled:text-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}
