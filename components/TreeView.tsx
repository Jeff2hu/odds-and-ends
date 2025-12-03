"use client";

import { useState } from "react";

// ============================================
// 型別定義
// ============================================

type TreeItem<T extends string | number> = {
  value: T;
  label: string;
  children?: TreeItem<T>[];
};

interface TreeViewProps<T extends string | number> {
  items: TreeItem<T>[];
  selectedValue?: T | null;
  onSelect?: (value: T) => void;
}

// ============================================
// 遞迴元件：單一項目（純展開/收合）
// ============================================

interface TreeNodeProps<T extends string | number> {
  item: TreeItem<T>;
  selectedValue?: T | null;
  onSelect?: (value: T) => void;
  level: number;
}

const TreeNode = <T extends string | number>({
  item,
  selectedValue,
  onSelect,
  level,
}: TreeNodeProps<T>) => {
  const [isExpanded, setIsExpanded] = useState(true); // 預設展開

  const hasChildren = item.children && item.children.length > 0;
  const isSelected = selectedValue === item.value;

  return (
    <div>
      {/* 項目本身 */}
      <div
        style={{
          paddingLeft: `${level * 24 + 8}px`,
        }}
        className={`
          flex items-center gap-2 px-4 py-2 cursor-pointer
          hover:bg-gray-100 transition-colors
          ${isSelected ? "bg-blue-50 border-l-4 border-blue-500" : ""}
        `}
        onClick={() => {
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          }
          onSelect?.(item.value);
        }}
      >
        {/* 展開/收合按鈕 */}
        {hasChildren ? (
          <span className="text-gray-500 w-4 flex-shrink-0">
            {isExpanded ? "▼" : "▶"}
          </span>
        ) : (
          <span className="w-4 flex-shrink-0" />
        )}

        {/* 項目標籤 */}
        <span
          className={`flex-1 ${
            isSelected ? "font-semibold text-blue-600" : ""
          }`}
        >
          {item.label}
          {hasChildren && (
            <span className="text-xs text-gray-500 ml-2">
              ({item.children!.length})
            </span>
          )}
        </span>
      </div>

      {/* 🔥 遞迴：子項目（只在展開時顯示）*/}
      {isExpanded && hasChildren && (
        <div>
          {item.children!.map((child) => (
            <TreeNode
              key={child.value}
              item={child}
              selectedValue={selectedValue}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// 主元件：TreeView
// ============================================

const TreeView = <T extends string | number>({
  items,
  selectedValue,
  onSelect,
}: TreeViewProps<T>) => {
  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      {items.map((item) => (
        <TreeNode
          key={item.value}
          item={item}
          selectedValue={selectedValue}
          onSelect={onSelect}
          level={0}
        />
      ))}
    </div>
  );
};

// ============================================
// 使用範例
// ============================================

export default function App() {
  const [selectedValue, setSelectedValue] = useState<string | null>("iphone15");

  const treeData: TreeItem<string>[] = [
    {
      value: "electronics",
      label: "💻 電子產品",
      children: [
        {
          value: "phones",
          label: "📱 手機",
          children: [
            { value: "iphone15", label: "iPhone 15 Pro Max" },
            { value: "iphone14", label: "iPhone 14" },
            {
              value: "samsung-s24",
              label: "Samsung S24",
              children: [
                { value: "samsung-s24-pro", label: "Samsung S24 Pro" },
                { value: "samsung-s24-ultra", label: "Samsung S24 Ultra" },
              ],
            },
          ],
        },
        {
          value: "laptops",
          label: "💻 筆電",
          children: [
            { value: "macbook-pro", label: "MacBook Pro" },
            { value: "surface", label: "Surface Laptop" },
          ],
        },
      ],
    },
    {
      value: "furniture",
      label: "🪑 家具",
      children: [
        { value: "sofa", label: "🛋️ 沙發" },
        { value: "desk", label: "🪑 書桌" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📁 TreeView 選單</h1>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <TreeView
            items={treeData}
            selectedValue={selectedValue}
            onSelect={setSelectedValue}
          />
        </div>
      </div>
    </div>
  );
}
