import { cn } from '@/utils/helpers';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-3',
  xl: 'h-14 w-14 border-4',
};

export const Spinner = ({ size = 'md', className }: SpinnerProps) => {
  return (
    <div
      role="status"
      className={cn(
        'animate-spin rounded-full border-current border-t-transparent',
        sizeClasses[size],
        'text-primary-600 dark:text-primary-400',
        className,
      )}
      aria-label="Loading"
    />
  );
};
