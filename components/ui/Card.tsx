import React from 'react';

type CardVariant = 'default' | 'green-gradient' | 'soft-green' | 'outline';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: React.ReactNode;
}

export default function Card({
  variant = 'default',
  className = '',
  children,
  ...props
}: CardProps) {
  const variantStyles: Record<CardVariant, string> = {
    default:
      'bg-white border border-gray-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.04)]',
    'green-gradient':
      'bg-hero-card text-white shadow-[0_4px_16px_rgba(52,195,125,0.2)]',
    'soft-green':
      'bg-[#E8F8F0]/50 border border-[#35C884]/30',
    outline:
      'bg-white border border-gray-200',
  };

  return (
    <div
      className={`rounded-2xl p-6 transition-all ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
