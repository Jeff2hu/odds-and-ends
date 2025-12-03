import { cn } from "@/lib/utils";
import React from "react";

export type CheckboxItem<T extends string | number> = {
  value: T;
  label: string;
};

interface CheckboxItemProps<T extends string | number> {
  item: CheckboxItem<T>;
  level: number;
  isSelected: boolean;
  onSelect: (item: T) => void;
}

const CheckboxItem = <T extends string | number>({
  item,
  level,
  isSelected,
  onSelect,
}: CheckboxItemProps<T>) => {
  return (
    <div className="flex gap-2" style={{ paddingLeft: `${level * 24 + 8}px` }}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(item.value)}
      />
      <span>{item.label}</span>
    </div>
  );
};

export default CheckboxItem;
