'use client';

import { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  children: ReactNode;
}

export default function Select({
  label,
  error,
  helperText,
  className = '',
  children,
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        {...props}
        className={`
          px-3 py-2 border border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-colors duration-200
          disabled:bg-gray-100 disabled:cursor-not-allowed
          bg-white cursor-pointer
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
      >
        {children}
      </select>
      {error && <span className="text-sm text-red-600">{error}</span>}
      {helperText && <span className="text-xs text-gray-500">{helperText}</span>}
    </div>
  );
}
