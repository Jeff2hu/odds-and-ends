"use client";

import React, { useMemo, useState } from "react";
import CheckboxItem from "./CheckboxItem";
import TreeViewNode from "./TreeViewNode";

export type TreeViewNodeData = {
  value: string | number;
  label: string;
  children?: TreeViewNodeData[];
};

type TreeViewNodeDataQueue = {
  item: TreeViewNodeData;
  parentId: null | string | number;
};

export type TreeViewNodeProps = {
  data: TreeViewNodeData[];
  level: number;
};

const TreeViewCheckbox = ({ data, level }: TreeViewNodeProps) => {
  const [selectedValues, setSelectedValues] = useState<Set<string | number>>(
    new Set()
  );

  const memoizedData = useMemo(() => {
    const mapData = new Map<string | number, TreeViewNodeData>();
    const parentMapData = new Map<string | number, string | number>();

    const queue: TreeViewNodeDataQueue[] = data.map((item) => ({
      item,
      parentId: null,
    }));

    while (queue.length > 0) {
      const currentData = queue.shift();

      if (currentData) {
        mapData.set(currentData.item.value, currentData.item);

        if (currentData.parentId !== null) {
          parentMapData.set(currentData.item.value, currentData.parentId);
        }

        if (currentData.item.children && currentData.item.children.length > 0) {
          queue.push(
            ...currentData.item.children.map((_item) => {
              return {
                item: _item,
                parentId: currentData.item.value,
              };
            })
          );
        }
      }
    }

    return { mapData, parentMapData };
  }, [data]);

  const onSelect = (value: string | number) => {
    setSelectedValues((prev) => {
      const newSelectedValues = new Set(prev);
      const { mapData, parentMapData } = memoizedData;
      const node = mapData.get(value);

      if (!node) return prev;

      if (newSelectedValues.has(value)) {
        const removeChildren = (item: TreeViewNodeData) => {
          newSelectedValues.delete(item.value);
          if (item.children && item.children.length > 0) {
            item.children.forEach(removeChildren);
          }
        };

        removeChildren(node);

        let currentId = value;
        while (currentId != null) {
          const parentId = parentMapData.get(currentId);

          if (parentId) {
            newSelectedValues.delete(parentId);
            currentId = parentId;
          } else {
            break;
          }
        }
      } else {
        const addChildren = (item: TreeViewNodeData) => {
          newSelectedValues.add(item.value);

          if (item?.children && item.children.length > 0) {
            item.children.forEach(addChildren);
          }
        };

        addChildren(node);

        let currentId = value;
        while (currentId != null) {
          const parentId = parentMapData.get(currentId);

          if (parentId) {
            const parentNode = mapData.get(parentId);
            const isAllSelected = parentNode?.children?.every((item) =>
              newSelectedValues.has(item.value)
            );
            if (isAllSelected) {
              newSelectedValues.add(parentId);
              currentId = parentId;
            } else {
              break;
            }
          } else {
            break;
          }
        }
      }
      return newSelectedValues;
    });
  };

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

export default TreeViewCheckbox;
