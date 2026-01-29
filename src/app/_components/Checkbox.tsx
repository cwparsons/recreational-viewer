import { memo } from 'react';

export const Checkbox = memo(({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) => (
  <label className="flex cursor-pointer items-center gap-2">
    <input
      checked={checked}
      className="h-5 w-5"
      onChange={(e) => onChange(e.target.checked)}
      type="checkbox"
    />
    <span>{label}</span>
  </label>
));

Checkbox.displayName = 'Checkbox';

