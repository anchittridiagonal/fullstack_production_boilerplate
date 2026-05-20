import { HTMLAttributes } from 'react';

import { cn } from '@/utils/helpers';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary:
    'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
  secondary:
    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  success:
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  danger:
    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  warning:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  info:
    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

export const Badge = ({
  variant = 'secondary',
  className,
  children,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
