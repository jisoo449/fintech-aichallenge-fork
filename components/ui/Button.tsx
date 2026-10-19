import React from 'react';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-[#35C884] hover:bg-[#2EB374] text-white font-bold shadow-[0_2px_6px_rgba(53,200,132,0.25)] active:scale-[0.99]',
    outline:
      'bg-white border border-[#D1D5DB] hover:border-gray-400 hover:bg-gray-50 text-[#374151] font-semibold active:scale-[0.99]',
    ghost:
      'bg-transparent hover:bg-emerald-50 text-[#0B654B] font-semibold active:scale-[0.99]',
    danger:
      'bg-[#FF5D5D] hover:bg-[#EE4949] text-white font-bold shadow-[0_2px_6px_rgba(255,93,93,0.25)] active:scale-[0.99]',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-3 text-sm transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        fullWidth ? 'w-full' : ''
      } ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
