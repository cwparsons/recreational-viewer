import { memo } from 'react';

interface HeartIconProps {
  filled?: boolean;
  className?: string;
  onClick?: () => void;
}

export const HeartIcon = memo(({ filled = false, className = '', onClick }: HeartIconProps) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${className}`}
      aria-label={filled ? 'Remove from favourites' : 'Add to favourites'}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        className={`transition-colors ${filled ? 'text-red-500' : 'text-gray-400 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400'}`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  );
});

HeartIcon.displayName = 'HeartIcon';
