import { HTMLAttributes } from 'react';

import { cn } from '@/utils/helpers';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card = ({ hoverable = false, className, children, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'card',
        hoverable && 'hover:shadow-md transition-shadow duration-200 cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('px-6 py-4 border-b border-gray-200 dark:border-gray-700', className)}
    {...props}
  >
    {children}
  </div>
);

export const CardBody = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-6 py-4', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
