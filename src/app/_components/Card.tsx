import { ComponentProps, memo } from 'react';

type CardProps = ComponentProps<'div'> & {
  title: string;
};

export const Card = memo(({ title, children, ...props }: CardProps) => {
  return (
    <div
      className="flex flex-col gap-4 rounded-lg border bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800"
      {...props}
    >
      <h2 className="text-xl font-semibold md:text-2xl">{title}</h2>

      {children}
    </div>
  );
});

Card.displayName = 'Card';
