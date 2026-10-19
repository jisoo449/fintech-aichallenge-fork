import React from 'react';

type BadgeVariant =
  | 'primary' // solid dark green
  | 'success' // solid bright green
  | 'green-pill' // green outline & light green bg
  | 'danger-pill' // red outline & light pink bg
  | 'blue-pill' // light blue badge for '수입'
  | 'gray-pill' // light gray badge for '지출'
  | 'purple-pill'; // light purple/indigo badge for '저축 이동'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export default function Badge({
  variant = 'green-pill',
  className = '',
  children,
  ...props
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    primary: 'bg-[#075F46] text-white',
    success: 'bg-[#35C884] text-white',
    'green-pill': 'border border-[#35C884] text-[#0B654B] bg-[#E8F8F0]',
    'danger-pill': 'border border-[#FFA4A4] text-[#FF5D5D] bg-[#FFE5E5]',
    'blue-pill': 'bg-[#E0F2FE] text-[#0284C7]',
    'gray-pill': 'bg-[#F1F5F9] text-[#64748B]',
    'purple-pill': 'bg-[#EDE9FE] text-[#7C3AED]',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-tight transition-colors ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
