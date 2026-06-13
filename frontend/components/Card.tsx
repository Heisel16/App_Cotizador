interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated';
}

export default function Card({
  children,
  className = '',
  variant = 'default',
}: CardProps) {
  const variants = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white border border-gray-200 shadow-sm',
  };

  return (
    <div
      className={`
        rounded-xl
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}