"use client";

import CheckboxItem from "./CheckboxItem";
import { TreeViewNodeData } from "./TreeViewCheckbox";

export type TreeViewNodeProps = {
  data: TreeViewNodeData[];
  level: number;
  selectedValues: Set<string | number>;
  onSelect: (value: string | number) => void;
};

const TreeViewNode = ({
  data,
  level,
  selectedValues,
  onSelect,
}: TreeViewNodeProps) => {
  return (
    <div>
      {data.map((item) => (
        <div key={item.value}>
          <CheckboxItem
            item={item}
            level={level}
            isSelected={selectedValues.has(item.value)}
            onSelect={() => onSelect(item.value)}
          />

          {item.children && item.children.length > 0 && (
            <TreeViewNode
              data={item.children}
              level={level + 1}
              selectedValues={selectedValues}
              onSelect={onSelect}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TreeViewNode;
