import React, { useState, useEffect, CSSProperties } from "react";
import {
  Menu,
  ActionIcon,
  Tooltip,
  Checkbox,
  useMantineColorScheme,
} from "@mantine/core";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Copy,
  Scissors,
  ClipboardPaste,
  Files,
  ArrowUpDown,
} from "lucide-react";
import { JsonDiff, findDiffByPath } from "../../services/diffService";

interface JsonNode {
  key: string;
  value: any;
  type: "object" | "array" | "string" | "number" | "boolean" | "null";
  path: string[];
  isExpanded?: boolean;
}

interface JsonTreeProps {
  data: any;
  expandAll?: boolean | null;
  onEdit?: (path: string[], newValue: any) => void;
  onDelete?: (path: string[]) => void;
  onAdd?: (path: string[], type: string, index?: number) => void;
  onCopy?: (path: string[]) => void;
  onCut?: (path: string[]) => void;
  onPaste?: (path: string[]) => void;
  onDuplicate?: (path: string[]) => void;
  onSort?: (path: string[]) => void;
  diffs?: JsonDiff[];
  activeDiffPath?: string;
  isLeft?: boolean;
}

interface InsertLineProps {
  path: string[];
  index: number;
  onInsert: (path: string[], type: string, index: number) => void;
}

const InsertLine: React.FC<InsertLineProps> = ({ path, index, onInsert }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const showTrigger = isHovered || isOpened;

  return (
    <div
      className="relative h-2 -my-1 cursor-pointer group/insert"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 transition-colors ${
          showTrigger ? "bg-blue-500" : "bg-transparent"
        }`}
      />
      
      <div 
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 transition-opacity ${
          showTrigger ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Menu 
          shadow="md" 
          position="right-start" 
          withinPortal
          onOpen={() => setIsOpened(true)}
          onClose={() => setIsOpened(false)}
        >
          <Menu.Target>
            <ActionIcon
              size="xs"
              color="blue"
              variant="filled"
              className="rounded-full shadow-sm"
            >
              <Plus size={12} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Insert at index {index}</Menu.Label>
            <Menu.Item onClick={() => onInsert(path, "object", index)}>
              + Object
            </Menu.Item>
            <Menu.Item onClick={() => onInsert(path, "array", index)}>
              + Array
            </Menu.Item>
            <Menu.Item onClick={() => onInsert(path, "value", index)}>
              + Value
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </div>
  );
};

const JsonTree: React.FC<JsonTreeProps> = ({
  data,
  expandAll,
  onEdit,
  onDelete,
  onAdd,
  onCopy,
  onCut,
  onPaste,
  onDuplicate,
  onSort,
  diffs,
  activeDiffPath,
  isLeft,
}) => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editingKeyPath, setEditingKeyPath] = useState<string | null>(null);
  const [editKeyValue, setEditKeyValue] = useState("");
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const pathToString = (path: string[]) => path.join(".");

  // Collect all paths in the JSON object
  const collectAllPaths = (value: any, currentPath: string[] = []): string[] => {
    const paths: string[] = [];
    const type = getValueType(value);
    
    if (type === "object" || type === "array") {
      paths.push(pathToString(currentPath));
      const entries = type === "array" ? value : Object.entries(value);
      
      if (type === "array") {
        value.forEach((item: any, idx: number) => {
          paths.push(...collectAllPaths(item, [...currentPath, String(idx)]));
        });
      } else {
        Object.entries(value).forEach(([key, val]) => {
          paths.push(...collectAllPaths(val, [...currentPath, key]));
        });
      }
    }
    
    return paths;
  };

  // Handle expand/collapse all
  useEffect(() => {
    if (expandAll === true) {
      const allPaths = collectAllPaths(data, []);
      setExpandedPaths(new Set(allPaths));
    } else if (expandAll === false) {
      setExpandedPaths(new Set());
    }
  }, [expandAll]);

  // Expand all by default on mount
  useEffect(() => {
    const allPaths = collectAllPaths(data, []);
    setExpandedPaths(new Set(allPaths));
  }, [data]);

  const toggleExpand = (path: string[]) => {
    const pathStr = pathToString(path);
    setExpandedPaths((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pathStr)) {
        newSet.delete(pathStr);
      } else {
        newSet.add(pathStr);
      }
      return newSet;
    });
  };

  const getValueType = (value: any): JsonNode["type"] => {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value as JsonNode["type"];
  };

  // Get path array from selectedPath string
  const getSelectedPathArray = (): string[] => {
    if (!selectedPath) return [];
    return selectedPath.split(".").filter(Boolean);
  };

  const renderValue = (value: any, path: string[]) => {
    const type = getValueType(value);
    const pathStr = pathToString(path);
    const isExpanded = expandedPaths.has(pathStr);
    const isEditing = editingPath === pathStr;

    const handleStartEdit = () => {
      setEditingPath(pathStr);
      setEditValue(
        type === "object" || type === "array"
          ? JSON.stringify(value, null, 2)
          : String(value)
      );
    };

    const handleSaveEdit = () => {
      try {
        let newValue;
        if (type === "object" || type === "array") {
          newValue = JSON.parse(editValue);
        } else if (type === "number") {
          newValue = Number(editValue);
        } else if (type === "boolean") {
          newValue = editValue === "true";
        } else {
          newValue = editValue;
        }
        onEdit?.(path, newValue);
        setEditingPath(null);
      } catch (err) {
        alert("Invalid value");
      }
    };

    const valueColor = isDark
      ? {
          string: "#98C379",
          number: "#D19A66",
          boolean: "#C678DD",
          null: "#E06C75",
        }
      : {
          string: "#22863a",
          number: "#005cc5",
          boolean: "#6f42c1",
          null: "#d73a49",
        };

    if (type === "object" || type === "array") {
      const entries = type === "array" ? value : Object.entries(value);
      const count = type === "array" ? value.length : Object.keys(value).length;
      const preview = type === "array" ? "[…]" : "{…}";
      const isHovered = hoveredPath === pathStr;
      const isSelected = selectedPath === pathStr;

      return (
        <div
          className={`rounded px-2 py-1 transition-colors ${
            isSelected
              ? "bg-blue-100 dark:bg-blue-900/30"
              : isHovered
              ? "bg-slate-100 dark:bg-slate-800"
              : ""
          } ${
            (() => {
              if (!diffs) return "";
              const diff = findDiffByPath(diffs, path);
              if (!diff) return "";
              
              if (isLeft) {
                if (diff.type === "deleted") return "bg-red-100 dark:bg-red-900/30 ring-1 ring-red-500/50";
                if (diff.type === "modified" || diff.type === "array") return "bg-yellow-100 dark:bg-yellow-900/30";
              } else {
                if (diff.type === "added") return "bg-green-100 dark:bg-green-900/30 ring-1 ring-green-500/50";
                if (diff.type === "modified" || diff.type === "array") return "bg-yellow-100 dark:bg-yellow-900/30";
              }
              return "";
             })()
          } ${activeDiffPath === pathStr ? "ring-2 ring-blue-500 shadow-lg shadow-blue-500/20 z-10" : ""}`}
          data-diff-path={pathStr}
          onMouseEnter={() => setHoveredPath(pathStr)}
          onMouseLeave={() => setHoveredPath(null)}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPath(pathStr);
          }}
        >
          <div className="flex items-center gap-2 group">
            <ActionIcon
              size="xs"
              variant="subtle"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(path);
              }}
            >
              {isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </ActionIcon>

            <span
              className="cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(path);
              }}
              style={{ color: isDark ? "#61AFEF" : "#005cc5" }}
            >
              {preview}
            </span>

            <span className="text-xs text-slate-400">
              {count} {count === 1 ? "item" : "items"}
            </span>

            <ContextMenu
              path={path}
              type={type}
              onEdit={handleStartEdit}
              onDelete={() => onDelete?.(path)}
              onAdd={onAdd}
              onCopy={() => onCopy?.(path)}
              onCut={() => onCut?.(path)}
              onPaste={() => onPaste?.(path)}
              onDuplicate={() => onDuplicate?.(path)}
              onSort={() => onSort?.(path)}
            />
          </div>

          {isExpanded && (
            <div className="ml-4 border-l border-slate-300 dark:border-slate-700 pl-3 mt-1">
              {type === "array" ? (
                <>
                  {value.map((item: any, idx: number) => (
                    <React.Fragment key={idx}>
                      <InsertLine
                        path={path}
                        index={idx}
                        onInsert={(p, t, i) => onAdd?.(p, t, i)}
                      />
                      <div className="py-1">
                        <span className="text-slate-500 dark:text-slate-400 mr-2">
                          {idx}:
                        </span>
                        {renderValue(item, [...path, String(idx)])}
                      </div>
                    </React.Fragment>
                  ))}
                  <InsertLine
                    path={path}
                    index={value.length}
                    onInsert={(p, t, i) => onAdd?.(p, t, i)}
                  />
                </>
              ) : (
                <>
                  {Object.entries(value).map(([key, val], idx) => {
                    const keyPath = pathToString([...path, key]);
                    const isEditingKey = editingKeyPath === keyPath;

                    const handleStartEditKey = () => {
                      setEditingKeyPath(keyPath);
                      setEditKeyValue(key);
                    };

                    const handleSaveKey = () => {
                      if (editKeyValue.trim() && editKeyValue !== key) {
                        const obj = JSON.parse(JSON.stringify(data));
                        let current = obj;
                        for (let i = 0; i < path.length; i++) {
                          current = current[path[i]];
                        }
                        current[editKeyValue.trim()] = current[key];
                        delete current[key];
                        onEdit?.([], obj);
                      }
                      setEditingKeyPath(null);
                    };

                    return (
                      <React.Fragment key={key}>
                        <div className="py-1">
                          {isEditingKey ? (
                            <input
                              type="text"
                              value={editKeyValue}
                              onChange={(e) => setEditKeyValue(e.target.value)}
                              onBlur={handleSaveKey}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveKey();
                                if (e.key === "Escape") {
                                  setEditKeyValue(key);
                                  setEditingKeyPath(null);
                                }
                              }}
                              autoFocus
                              className="font-semibold mr-2 px-2 py-0.5 text-sm border rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                              style={{
                                minWidth: "100px",
                                color: isDark ? "#E06C75" : "#d73a49",
                              }}
                            />
                          ) : (
                            <span
                              className="font-semibold mr-2 cursor-text hover:underline"
                              style={{ color: isDark ? "#E06C75" : "#d73a49" }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                handleStartEditKey();
                              }}
                            >
                              {key}:
                            </span>
                          )}
                          {renderValue(val, [...path, key])}
                        </div>
                      </React.Fragment>
                    );
                  })}

                </>
              )}
            </div>
          )}
        </div>
      );
    }

    // Primitive values
    const isHovered = hoveredPath === pathStr;
    const isSelected = selectedPath === pathStr;

    return (
      <div
        className={`inline-flex items-center gap-2 group rounded px-2 py-0.5 transition-colors ${
          isSelected
            ? "bg-blue-100 dark:bg-blue-900/30"
            : isHovered
            ? "bg-slate-100 dark:bg-slate-800"
            : ""
        } ${
          (() => {
            if (!diffs) return "";
            const diff = findDiffByPath(diffs, path);
            if (!diff) return "";
            
            if (isLeft) {
              if (diff.type === "deleted") return "bg-red-100 dark:bg-red-900/30 ring-1 ring-red-500/50";
              if (diff.type === "modified" || diff.type === "array") return "bg-yellow-100 dark:bg-yellow-900/30";
            } else {
              if (diff.type === "added") return "bg-green-100 dark:bg-green-900/30 ring-1 ring-green-500/50";
              if (diff.type === "modified" || diff.type === "array") return "bg-yellow-100 dark:bg-yellow-900/30";
            }
            return "";
           })()
        } ${activeDiffPath === pathStr ? "ring-2 ring-blue-500 shadow-lg shadow-blue-500/20 z-10" : ""}`}
        data-diff-path={pathStr}
        onMouseEnter={() => setHoveredPath(pathStr)}
        onMouseLeave={() => setHoveredPath(null)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedPath(pathStr);
        }}
      >
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveEdit();
              if (e.key === "Escape") setEditingPath(null);
            }}
            autoFocus
            className="px-2 py-1 text-sm border rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
            style={{ minWidth: "100px" }}
          />
        ) : (
          <>
            {type === "boolean" && (
              <Checkbox
                checked={value}
                onChange={(e) => {
                  e.stopPropagation();
                  onEdit?.(path, !value);
                }}
                size="xs"
                color="blue"
                styles={{
                  input: {
                    cursor: "pointer",
                  },
                }}
              />
            )}
            <span 
              style={{ color: valueColor[type] }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                handleStartEdit();
              }}
              className="cursor-text"
            >
              {type === "string" ? `"${value}"` : String(value)}
            </span>
            <ContextMenu
              path={path}
              type={type}
              onEdit={handleStartEdit}
              onDelete={() => onDelete?.(path)}
              onAdd={onAdd}
              onCopy={() => onCopy?.(path)}
              onCut={() => onCut?.(path)}
              onPaste={() => onPaste?.(path)}
              onDuplicate={() => onDuplicate?.(path)}
              onSort={() => onSort?.(path)}
            />
          </>
        )}
      </div>
    );
  };

  return (
    <div className="font-mono text-sm p-4">
      {/* Breadcrumb Path */}
      <div className="mb-4 flex items-center gap-2 text-sm pb-2 border-b border-slate-200 dark:border-slate-700">
        <span 
          className="text-slate-400 font-medium cursor-pointer hover:text-blue-500"
          onClick={() => setSelectedPath(null)}
        >
          root
        </span>
        {selectedPath && getSelectedPathArray().map((segment, i) => (
          <React.Fragment key={i}>
            <ChevronRight size={14} className="text-slate-400" />
            <span 
              className="text-blue-600 dark:text-blue-400 font-medium"
              style={{ color: isDark ? "#61AFEF" : "#005cc5" }}
            >
              {segment}
            </span>
          </React.Fragment>
        ))}
      </div>
      
      {renderValue(data, [])}
    </div>
  );
};

interface ContextMenuProps {
  path: string[];
  type: JsonNode["type"];
  onEdit: () => void;
  onDelete: () => void;
  onAdd?: (path: string[], type: string) => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDuplicate: () => void;
  onSort: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  path,
  type,
  onEdit,
  onDelete,
  onAdd,
  onCopy,
  onCut,
  onPaste,
  onDuplicate,
  onSort,
}) => {
  return (
    <Menu shadow="md" position="right-start" withinPortal>
      <Menu.Target>
        <ActionIcon
          size="xs"
          variant="subtle"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Plus size={12} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Edit</Menu.Label>
        <Menu.Item 
          leftSection={<Pencil size={14} />} 
          onClick={onEdit}
        >
          Edit {type === "object" || type === "array" ? "object" : "value"}
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Clipboard</Menu.Label>
        <Menu.Item leftSection={<Scissors size={14} />} onClick={onCut}>
          Cut
        </Menu.Item>
        <Menu.Item leftSection={<Copy size={14} />} onClick={onCopy}>
          Copy
        </Menu.Item>
        <Menu.Item leftSection={<ClipboardPaste size={14} />} onClick={onPaste}>
          Paste
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Manipulate</Menu.Label>
        <Menu.Item 
          leftSection={<Files size={14} />} 
          onClick={onDuplicate}
        >
          Duplicate
        </Menu.Item>
        <Menu.Item 
          leftSection={<ArrowUpDown size={14} />} 
          onClick={onSort}
          disabled={type !== "object" && type !== "array"}
        >
          Sort
        </Menu.Item>

        <Menu.Divider />

        {/* Insert Menu */}
        {onAdd && (type === "object" || type === "array") && (
          <>
            <Menu.Label>Insert</Menu.Label>
            <Menu.Item onClick={() => onAdd(path, "structure")}>
              + Structure
            </Menu.Item>
            <Menu.Item onClick={() => onAdd(path, "object")}>
              + Object
            </Menu.Item>
            <Menu.Item onClick={() => onAdd(path, "array")}>
              + Array
            </Menu.Item>
            <Menu.Item onClick={() => onAdd(path, "value")}>
              + Value
            </Menu.Item>
            <Menu.Divider />
          </>
        )}

        <Menu.Item
          color="red"
          leftSection={<Trash2 size={14} />}
          onClick={onDelete}
        >
          Remove
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default JsonTree;
