import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  AlignLeft,
  Copy,
  AlertCircle,
  Sparkles,
  Code,
  FileJson,
  FileUp,
  Download,
  Type,
  ArrowLeft,
  ArrowRight,
  GitCompare,
  Maximize,
  FilePlus,
  HardDrive,
  Check,
  ChevronsDownUp,
  ChevronsUpDown,
  Undo,
  Redo,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  Button,
  Group,
  Alert,
  Textarea,
  SegmentedControl,
  useMantineColorScheme,
  Text,
  Menu,
  Paper,
  Stack,
  Modal,
  Divider,
  Badge,
  Checkbox,
  ActionIcon,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  beautifyJson,
  minifyJson,
  sortJsonKeys,
  escapeJson,
  smartFormatJson,
  compareJson,
  downloadJson,
  readJsonFile,
} from "../../services/dataService";
import JsonTree from "../ui/JsonTree";
import DocumentPicker, {
  initializeDocuments,
  getDocuments,
  saveDocument,
} from "../ui/DocumentPicker";
import TransformModal from "../ui/TransformModal";
import { useSettingsContext } from "../../contexts/SettingsContext";
import { useHistory } from "../../hooks/useHistory";
import { calculateDiff, JsonDiff, findDiffByPath, getDiffColorClass } from "../../services/diffService";

const SAMPLE_JSON = {
  project: "CadaUtils",
  version: "1.0.0",
  features: ["PDF Merge", "Image Tools", "Data Conversion"],
  settings: {
    darkMode: true,
    offline: true,
    maxFileSize: 50,
  },
  users: [
    { id: 1, role: "admin", active: true },
    { id: 2, role: "editor", active: false },
  ],
};

type ViewMode = "text" | "tree" | "code";

// Editable Document Name Component
const EditableDocName: React.FC<{
  value: string;
  onChange: (newName: string) => void;
  showSaved?: boolean;
}> = ({ value, onChange, showSaved = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    if (editValue.trim()) {
      onChange(editValue.trim());
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") {
            setEditValue(value);
            setIsEditing(false);
          }
        }}
        autoFocus
        className="text-sm font-medium px-2 py-1 border rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
        style={{ minWidth: "150px" }}
      />
    );
  }

  return (
    <Group gap="xs" align="center" mb="xs">
      <Text
        size="sm"
        fw={500}
        c="dimmed"
        className="cursor-pointer hover:underline"
        onClick={() => {
          setEditValue(value);
          setIsEditing(true);
        }}
      >
        {value}
      </Text>
      {showSaved && (
        <Badge
          size="xs"
          color="green"
          variant="light"
          className="animate-fade-in"
        >
          Saved
        </Badge>
      )}
    </Group>
  );
};

// Separate component for textarea with line numbers
const TextareaWithLineNumbers: React.FC<{
  content: string;
  setContent: (val: string) => void;
}> = ({ content, setContent }) => {
  const lines = content.split("\n");
  const lineCount = lines.length;
  const lineNumberRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumberRef.current) {
      lineNumberRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleTextareaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = content.substring(0, cursorPosition);
    const lineNumber = textBeforeCursor.split("\n").length;
    setSelectedLine(lineNumber);
  };

  const handleLineNumberClick = (lineNum: number) => {
    setSelectedLine(lineNum);
    if (textareaRef.current) {
      const lines = content.split("\n");
      const positionStart = lines.slice(0, lineNum - 1).join("\n").length + (lineNum > 1 ? 1 : 0);
      const positionEnd = positionStart + lines[lineNum - 1].length;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(positionStart, positionEnd);
    }
  };

  return (
      <div className="flex h-full font-mono text-sm overflow-hidden">
      {/* Line Numbers */}
      <div
        ref={lineNumberRef}
        className="select-none bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-500 px-3 py-4 text-right border-r border-slate-200 dark:border-slate-700 overflow-hidden"
        style={{ minWidth: "3rem" }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div
            key={i}
            onClick={() => handleLineNumberClick(i + 1)}
            className={`cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 ${
              selectedLine === i + 1
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                : ""
            }`}
            style={{ lineHeight: "1.5rem" }}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Editor */}
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onScroll={handleScroll}
        onClick={handleTextareaClick}
        placeholder="Paste your JSON here..."
        styles={{
          input: {
            height: "100%",
            fontFamily: "monospace",
            fontSize: "13px",
            border: "none",
            backgroundColor: "transparent",
            padding: "1rem",
            lineHeight: "1.5rem",
          },
          wrapper: { height: "100%", flex: 1 },
        }}
        className="h-full flex-1"
      />
    </div>
  );
};

const JsonBeautifier: React.FC = () => {
  const { settings } = useSettingsContext();
  
  // Use history hook for undo/redo
  const {
    state: leftInput,
    setState: setLeftInput,
    undo: undoLeft,
    redo: redoLeft,
    canUndo: canUndoLeft,
    canRedo: canRedoLeft,
    reset: resetLeftHistory,
  } = useHistory("");
  
  const {
    state: rightInput,
    setState: setRightInput,
    undo: undoRight,
    redo: redoRight,
    canUndo: canUndoRight,
    canRedo: canRedoRight,
    reset: resetRightHistory,
  } = useHistory("");
  
  const [leftDocName, setLeftDocName] = useState("New document 1");
  const [rightDocName, setRightDocName] = useState("New document 2");
  const [leftError, setLeftError] = useState("");
  const [rightError, setRightError] = useState("");
  const [leftViewMode, setLeftViewMode] = useState<ViewMode>("text");
  const [rightViewMode, setRightViewMode] = useState<ViewMode>("text");
  const [comparison, setComparison] = useState<{
    areEqual: boolean;
    differences: string[];
  } | null>(null);
  const [fullscreenSide, setFullscreenSide] = useState<"left" | "right" | null>(
    null
  );
  const [pickerOpened, setPickerOpened] = useState(false);
  const [pickerSide, setPickerSide] = useState<"left" | "right">("left");
  const [leftExpandAll, setLeftExpandAll] = useState<boolean | null>(null);
  const [rightExpandAll, setRightExpandAll] = useState<boolean | null>(null);
  const [transformOpened, setTransformOpened] = useState(false);
  const [showLeftSaved, setShowLeftSaved] = useState(false);
  const [showRightSaved, setShowRightSaved] = useState(false);
  const [activeEditor, setActiveEditor] = useState<"left" | "right">("left");
  
  // Compare mode state
  const [compareMode, setCompareMode] = useState(false);
  const [diffs, setDiffs] = useState<JsonDiff[]>([]);
  const [currentDiffIndex, setCurrentDiffIndex] = useState(0);

  const leftFileRef = useRef<HTMLInputElement>(null);
  const rightFileRef = useRef<HTMLInputElement>(null);

  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  // Initialize documents on mount
  useEffect(() => {
    initializeDocuments();
    const docs = getDocuments();
    if (docs.length >= 2) {
      // Use reset instead of setState to set initial state and clear history
      resetLeftHistory(docs[0].content);
      setLeftDocName(docs[0].name);
      resetRightHistory(docs[1].content);
      setRightDocName(docs[1].name);
    }
  }, [resetLeftHistory, resetRightHistory]);

  // Auto-save when content changes
  useEffect(() => {
    if (leftInput !== undefined && leftInput !== "") {
      const timer = setTimeout(() => {
        saveDocument({ name: leftDocName, content: leftInput });
        // Show "Saved" indicator
        setShowLeftSaved(true);
        setTimeout(() => setShowLeftSaved(false), 1000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [leftInput, leftDocName]);

  useEffect(() => {
    if (rightInput !== undefined && rightInput !== "") {
      const timer = setTimeout(() => {
        saveDocument({ name: rightDocName, content: rightInput });
        // Show "Saved" indicator
        setShowRightSaved(true);
        setTimeout(() => setShowRightSaved(false), 1000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [rightInput, rightDocName]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Ctrl (Windows/Linux) or Cmd (Mac) is pressed
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      
      if (isCtrlOrCmd && e.shiftKey && e.key === 'z') {
        // Ctrl+Shift+Z or Cmd+Shift+Z = Redo
        e.preventDefault();
        if (activeEditor === "left") {
          redoLeft();
        } else {
          redoRight();
        }
      } else if (isCtrlOrCmd && e.key === 'z') {
        // Ctrl+Z or Cmd+Z = Undo
        e.preventDefault();
        if (activeEditor === "left") {
          undoLeft();
        } else {
          undoRight();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoLeft, redoLeft, undoRight, redoRight, activeEditor]);

  // Parse for tree view
  const leftObject = useMemo(() => {
    if (!leftInput) return null;
    try {
      return JSON.parse(leftInput);
    } catch {
      return null;
    }
  }, [leftInput]);

  const rightObject = useMemo(() => {
    if (!rightInput) return null;
    try {
      return JSON.parse(rightInput);
    } catch {
      return null;
    }
  }, [rightInput]);

  const handleExample = () => {
    const exampleStr = JSON.stringify(SAMPLE_JSON, null, 2);
    setLeftInput(exampleStr);
    setRightInput("");
    setLeftError("");
    setRightError("");
    setComparison(null);
  };

  const handleOpenFromPicker = (side: "left" | "right") => {
    setPickerSide(side);
    setPickerOpened(true);
  };

  const handleDocumentSelected = (doc: any) => {
    if (pickerSide === "left") {
      setLeftInput(doc.content);
      setLeftDocName(doc.name);
      setLeftError("");
    } else {
      setRightInput(doc.content);
      setRightDocName(doc.name);
      setRightError("");
    }
  };

  const handleOpenFromDisk = async (
    side: "left" | "right",
    file: File | null
  ) => {
    if (!file) return;
    try {
      const content = await readJsonFile(file);
      if (side === "left") {
        setLeftInput(content);
        setLeftDocName(file.name.replace(".json", ""));
        setLeftError("");
      } else {
        setRightInput(content);
        setRightDocName(file.name.replace(".json", ""));
        setRightError("");
      }
    } catch (err: any) {
      if (side === "left") {
        setLeftError(err.message);
      } else {
        setRightError(err.message);
      }
    }
  };

  const handleSave = (side: "left" | "right") => {
    const content = side === "left" ? leftInput : rightInput;
    const name = side === "left" ? leftDocName : rightDocName;
    if (!content) return;
    downloadJson(content, name);
  };

  const handleCopy = (side: "left" | "right", format: string) => {
    const content = side === "left" ? leftInput : rightInput;
    if (!content) return;

    try {
      let toCopy = content;

      switch (format) {
        case "formatted":
          toCopy = beautifyJson(content);
          break;
        case "smart":
          toCopy = smartFormatJson(content);
          break;
        case "compacted":
          toCopy = minifyJson(content);
          break;
        case "escaped":
          toCopy = escapeJson(beautifyJson(content));
          break;
        case "as-is":
          toCopy = content;
          break;
      }

      navigator.clipboard.writeText(toCopy);
      notifications.show({
        title: "Success",
        message: "Copied to clipboard!",
        color: "green",
        // icon: <Check size={16} />,
      });
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to copy",
        color: "red",
        // icon: <AlertCircle size={16} />,
      });
    }
  };

  const handleCopyLeftToRight = () => {
    setRightInput(leftInput);
    setRightError("");
  };

  const handleCopyRightToLeft = () => {
    setLeftInput(rightInput);
    setLeftError("");
  };

  const handleCompare = () => {
    if (!leftInput || !rightInput) {
      notifications.show({
        title: "Warning",
        message: "Both editors must have content to compare",
        color: "yellow",
        icon: <AlertCircle size={16} />,
      });
      return;
    }

    try {
      const result = compareJson(leftInput, rightInput);
      setComparison(result);
      setLeftError("");
      setRightError("");
    } catch (err: any) {
      setLeftError("");
      setRightError(err.message);
    }
  };

  const handleBeautify = (side: "left" | "right") => {
    const input = side === "left" ? leftInput : rightInput;
    try {
      const beautified = beautifyJson(input);
      if (side === "left") {
        setLeftInput(beautified);
        setLeftError("");
      } else {
        setRightInput(beautified);
        setRightError("");
      }
    } catch (err: any) {
      if (side === "left") {
        setLeftError(err.message);
      } else {
        setRightError(err.message);
      }
    }
  };

  const handleOpenTransform = () => {
    if (!leftObject) {
      notifications.show({
        title: "Invalid JSON",
        message: "Left editor must contain valid JSON to transform",
        color: "red",
        icon: <AlertCircle size={16} />,
      });
      return;
    }
    setTransformOpened(true);
  };

  const handleTransformApply = (transformedData: any) => {
    setRightInput(JSON.stringify(transformedData, null, 2));
    setRightError("");
    setRightViewMode("tree");
  };

  // Compare mode handlers
  const handleToggleCompare = () => {
    if (!compareMode) {
      // Enabling compare mode - calculate diffs
      if (leftObject && rightObject) {
        const differences = calculateDiff(leftObject, rightObject);
        setDiffs(differences);
        setCurrentDiffIndex(0);
        setCompareMode(true);
        
        // Ensure both sides are in tree view for highlighting
        if (leftViewMode !== "tree") setLeftViewMode("tree");
        if (rightViewMode !== "tree") setRightViewMode("tree");
      } else {
        notifications.show({
          title: "Cannot Compare",
          message: "Both editors must contain valid JSON to compare",
          color: "red",
          icon: <AlertCircle size={16} />,
        });
      }
    } else {
      // Disabling compare mode
      setCompareMode(false);
      setDiffs([]);
      setCurrentDiffIndex(0);
    }
  };

  const navigateToDiff = (index: number) => {
    setCurrentDiffIndex(index);
    
    // Scroll to the diff element in both panels
    setTimeout(() => {
      const diff = diffs[index];
      if (diff) {
        // Find all elements with this diff path (left and right panels)
        const elements = document.querySelectorAll(`[data-diff-path="${diff.pathStr}"]`);
        elements.forEach((element) => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
    }, 100);
  };

  const handlePrevDiff = () => {
    if (currentDiffIndex > 0) {
      navigateToDiff(currentDiffIndex - 1);
    }
  };

  const handleNextDiff = () => {
    if (currentDiffIndex < diffs.length - 1) {
      navigateToDiff(currentDiffIndex + 1);
    }
  };

const renderEditor = (
    side: "left" | "right",
    content: string,
    setContent: (val: string) => void,
    error: string,
    viewMode: ViewMode,
    setViewMode: (mode: ViewMode) => void,
    jsonObject: any,
    fileRef: React.RefObject<HTMLInputElement>
  ) => {
    return (
      <div className="flex flex-col h-[90%] lg:h-[96%] gap-2">
        {/* Toolbar */}
        <Group gap="xs" wrap="nowrap">
          <Button
            size="xs"
            variant="subtle"
            leftSection={<FilePlus size={14} />}
            onClick={() => {
              setContent("{}");
              setViewMode("text");
              if (side === "left") setLeftError("");
              else setRightError("");
            }}
          >
            New
          </Button>

          {/* Open Menu */}
          <Menu shadow="md" withinPortal>
            <Menu.Target>
              <Button
                size="xs"
                variant="filled"
                leftSection={<FileUp size={14} />}
              >
                Open
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<FileUp size={14} />}
                onClick={() => handleOpenFromPicker(side)}
              >
                Open file
              </Menu.Item>
              <Menu.Item
                leftSection={<HardDrive size={14} />}
                onClick={() => fileRef.current?.click()}
              >
                Open from disk
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={(e) => handleOpenFromDisk(side, e.target.files?.[0] || null)}
          />

          {/* Save Menu */}
          <Menu shadow="md" withinPortal>
            <Menu.Target>
              <Button
                size="xs"
                variant="filled"
                leftSection={<Download size={14} />}
              >
                Save
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<Download size={14} />}
                onClick={() => handleSave(side)}
              >
                Save to disk
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          {/* Copy Menu */}
          <Menu shadow="md" withinPortal>
            <Menu.Target>
              <Button
                size="xs"
                variant="filled"
                leftSection={<Copy size={14} />}
              >
                Copy
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => handleCopy(side, "formatted")}>
                Copy formatted
              </Menu.Item>
              <Menu.Item onClick={() => handleCopy(side, "smart")}>
                Copy smart formatted
              </Menu.Item>
              <Menu.Item onClick={() => handleCopy(side, "compacted")}>
                Copy compacted
              </Menu.Item>
              <Menu.Item onClick={() => handleCopy(side, "escaped")}>
                Copy escaped
              </Menu.Item>
              <Menu.Item onClick={() => handleCopy(side, "as-is")}>
                Copy as-is
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Button
            size="xs"
            variant="subtle"
            leftSection={<Maximize size={14} />}
            onClick={() => setFullscreenSide(side)}
          >
            Full screen
          </Button>

          {side === "left" && (
            <Button
              size="xs"
              variant="filled"
              color="violet"
              leftSection={<Sparkles size={14} />}
              onClick={handleOpenTransform}
              disabled={!jsonObject}
            >
              Transform
            </Button>
          )}
        </Group>

        {/* View Mode Selector */}
        <Group gap="xs" wrap="nowrap">
          <SegmentedControl
            size="xs"
            value={viewMode}
            onChange={(val) => setViewMode(val as ViewMode)}
            data={[
              {
                value: "text",
                label: (
                  <Group gap={4} justify="center">
                    <Type size={12} /> Text
                  </Group>
                ),
              },
              {
                value: "tree",
                label: (
                  <Group gap={4} justify="center">
                    <FileJson size={12} /> Tree
                  </Group>
                ),
              },
            ]}
            className="!w-50"
          />
          {viewMode === "tree" && (
            <>
              <Button
                size="xs"
                variant="subtle"
                onClick={() => {
                  if (side === "left") setLeftExpandAll(true);
                  else setRightExpandAll(true);
                }}
                title="Expand all"
              >
                <ChevronsUpDown size={14} />
              </Button>
              <Button
                size="xs"
                variant="subtle"
                onClick={() => {
                  if (side === "left") setLeftExpandAll(false);
                  else setRightExpandAll(false);
                }}
                title="Collapse all"
              >
                <ChevronsDownUp size={14} />
              </Button>
              <Button
                size="xs"
                variant="subtle"
                onClick={() => {
                  if (side === "left") undoLeft();
                  else undoRight();
                }}
                disabled={side === "left" ? !canUndoLeft : !canUndoRight}
                title="Undo (Ctrl+Z)"
              >
                <Undo size={14} />
              </Button>
              <Button
                size="xs"
                variant="subtle"
                onClick={() => {
                  if (side === "left") redoLeft();
                  else redoRight();
                }}
                disabled={side === "left" ? !canRedoLeft : !canRedoRight}
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo size={14} />
              </Button>
            </>
          )}
        </Group>

        {/* Editor Area */}
        <div className="flex-1 relative border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-[#151b28] overflow-hidden">
          {content ? (
            <>
              {viewMode === "text" && <TextareaWithLineNumbers content={content} setContent={setContent} />}

              {viewMode === "tree" && jsonObject && (
                <div className="h-full overflow-auto custom-scrollbar">
                  <JsonTree
                    data={jsonObject}
                    expandAll={side === "left" ? leftExpandAll : rightExpandAll}
                    onEdit={(path, newValue) => {
                      // Handle root-level update (for key renaming)
                      if (path.length === 0) {
                        setContent(JSON.stringify(newValue, null, 2));
                        return;
                      }
                      
                      const obj = JSON.parse(content);
                      let current = obj;
                      for (let i = 0; i < path.length - 1; i++) {
                        current = current[path[i]];
                      }
                      current[path[path.length - 1]] = newValue;
                      setContent(JSON.stringify(obj, null, 2));
                    }}
                    onDelete={(path) => {
                      const obj = JSON.parse(content);
                      let current = obj;
                      for (let i = 0; i < path.length - 1; i++) {
                        current = current[path[i]];
                      }
                      if (Array.isArray(current)) {
                        current.splice(Number(path[path.length - 1]), 1);
                      } else {
                        delete current[path[path.length - 1]];
                      }
                      setContent(JSON.stringify(obj, null, 2));
                    }}
                    onCopy={(path) => {
                      const obj = JSON.parse(content);
                      let current = obj;
                      for (const key of path) {
                        current = current[key];
                      }
                      navigator.clipboard.writeText(
                        JSON.stringify(current, null, 2)
                      );
                    }}
                    onSort={(path) => {
                      const sorted = sortJsonKeys(content);
                      setContent(sorted);
                    }}
                    onAdd={(path, type, index) => {
                      const obj = JSON.parse(content);
                      let current = obj;
                      // Navigate to the target container
                      for (let i = 0; i < path.length; i++) {
                        current = current[path[i]];
                      }

                      if (Array.isArray(current)) {
                        // Insert into array at specific index
                        let defaultValue: any;
                        if (type === "object") defaultValue = {};
                        else if (type === "array") defaultValue = [];
                        else if (type === "value") defaultValue = "new value";
                        else if (type === "boolean") defaultValue = false;
                        else if (type === "number") defaultValue = 0;
                        else if (type === "null") defaultValue = null;
                        else defaultValue = "";
                        
                        if (typeof index === 'number') {
                          current.splice(index, 0, defaultValue);
                        } else {
                          current.push(defaultValue);
                        }
                      } else {
                        // Add to object
                        let defaultValue: any;
                        if (type === "object") defaultValue = {};
                        else if (type === "array") defaultValue = [];
                        else if (type === "value") defaultValue = "new value";
                        else if (type === "boolean") defaultValue = false;
                        else if (type === "number") defaultValue = 0;
                        else if (type === "null") defaultValue = null;
                        else defaultValue = "";
                        const newKey = `newKey_${Date.now()}`; 
                        current[newKey] = defaultValue;
                      }
                      setContent(JSON.stringify(obj, null, 2));
                    }}
                    diffs={compareMode ? diffs : undefined}
                    activeDiffPath={compareMode && diffs[currentDiffIndex] ? diffs[currentDiffIndex].pathStr : undefined}
                    isLeft={side === "left"}
                    onCut={(path) => {
                      const obj = JSON.parse(content);
                      let current = obj;
                      for (let i = 0; i < path.length - 1; i++) {
                        current = current[path[i]];
                      }
                      const lastKey = path[path.length - 1];
                      const cutData = current[lastKey];
                      navigator.clipboard.writeText(JSON.stringify(cutData, null, 2));
                      
                      // Remove after copying
                      if (Array.isArray(current)) {
                        current.splice(Number(lastKey), 1);
                      } else {
                        delete current[lastKey];
                      }
                      setContent(JSON.stringify(obj, null, 2));
                    }}
                    onPaste={(path) => {
                      navigator.clipboard.readText().then((text) => {
                        try {
                          const pasteData = JSON.parse(text);
                          const obj = JSON.parse(content);
                          let current = obj;
                          for (const key of path) {
                            current = current[key];
                          }
                          
                          if (Array.isArray(current)) {
                            current.push(pasteData);
                          } else if (typeof current === "object") {
                            const newKey = `pasted_${Object.keys(current).length}`;
                            current[newKey] = pasteData;
                          }
                          
                          setContent(JSON.stringify(obj, null, 2));
                        } catch (err) {
                          console.error("Failed to paste:", err);
                        }
                      });
                    }}
                    onDuplicate={(path) => {
                      const obj = JSON.parse(content);
                      let current = obj;
                      let parent = null;
                      let lastKey = null;
                      
                      for (let i = 0; i < path.length; i++) {
                        parent = current;
                        lastKey = path[i];
                        current = current[path[i]];
                      }
                      
                      if (parent && lastKey !== null) {
                        const duplicate = JSON.parse(JSON.stringify(current));
                        if (Array.isArray(parent)) {
                          parent.splice(Number(lastKey) + 1, 0, duplicate);
                        } else {
                          parent[`${lastKey}_copy`] = duplicate;
                        }
                        setContent(JSON.stringify(obj, null, 2));
                      }
                    }}
                  />
                </div>
              )}

              {viewMode === "code" && (
                <pre className="h-full overflow-auto p-4 m-0 text-sm font-mono custom-scrollbar">
                  {content}
                </pre>
              )}



              {!jsonObject && viewMode !== "text" && (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm italic">
                  Invalid JSON
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm italic">
              Paste or load JSON here...
            </div>
          )}

          {error && (
            <Alert
              variant="filled"
              color="red"
              title="Error"
              icon={<AlertCircle size={16} />}
              className="absolute bottom-0 left-0 right-0 m-2 z-10"
            >
              {error}
            </Alert>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center shrink-0 flex-wrap gap-4">
        <div className="prose dark:prose-invert">
          <h3 className="text-slate-900 dark:text-white m-0">JSON Editor</h3>
          {/* <p className="text-slate-500 dark:text-slate-400 text-sm m-0">
            Validate, beautify, compare, and edit JSON data
          </p> */}
        </div>
        <Group>
          <Button
            onClick={handleExample}
            variant="light"
            color="violet"
            leftSection={<Sparkles size={16} />}
          >
            Example
          </Button>
        </Group>
      </div>

      {/* Main Editor Grid - Full Width */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_auto_1fr] gap-4 min-h-0">
        {/* Left Editor */}
        <Paper 
          p="sm" 
          withBorder 
          className="min-h-0 flex flex-col dark:bg-slate-800! dark:border-slate-700!" 
          data-editor="left"
          onClick={() => setActiveEditor("left")}
        >
          <EditableDocName value={leftDocName} onChange={setLeftDocName} showSaved={showLeftSaved} />
          {renderEditor(
            "left",
            leftInput,
            setLeftInput,
            leftError,
            leftViewMode,
            setLeftViewMode,
            leftObject,
            leftFileRef
          )}
        </Paper>

        {/* Middle Transformation Panel */}
        <div className="hidden xl:flex flex-col justify-center gap-2">
          <Button
            size="xs"
            variant="light"
            onClick={handleCopyLeftToRight}
            rightSection={<ArrowRight size={14} />}
            disabled={!leftInput}
          >
            Copy
          </Button>
          <Button
            size="xs"
            variant="light"
            onClick={handleCopyRightToLeft}
            leftSection={<ArrowLeft size={14} />}
            disabled={!rightInput}
          >
            Copy
          </Button>
          <Divider />
          <Button
            size="xs"
            variant="outline"
            onClick={() => handleBeautify("left")}
            leftSection={<AlignLeft size={14} />}
            disabled={!leftInput}
          >
            Format
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={handleToggleCompare}
            leftSection={<GitCompare size={14} />}
            disabled={!leftInput || !rightInput}
          >
            {compareMode ? "Exit Compare" : "Compare"}
          </Button>

          {compareMode && (
            <Paper p="xs" withBorder className="flex flex-col gap-2 items-center bg-slate-50 dark:bg-slate-900 w-full mt-2">
              <Group gap={4}>
                <Badge size="sm" variant="filled" color={diffs.length > 0 ? "orange" : "gray"}>
                  {diffs.length} diffs
                </Badge>
              </Group>
              
              <Group gap={4}>
                <ActionIcon 
                  size="sm" 
                  variant="default" 
                  onClick={handlePrevDiff}
                  disabled={diffs.length === 0 || currentDiffIndex <= 0}
                  title="Previous difference"
                >
                  <ChevronUp size={14} />
                </ActionIcon>
                <Text size="xs" c="dimmed" w={40} ta="center">
                  {diffs.length > 0 ? `${currentDiffIndex + 1}/${diffs.length}` : "0/0"}
                </Text>
                <ActionIcon 
                  size="sm" 
                  variant="default" 
                  onClick={handleNextDiff}
                  disabled={diffs.length === 0 || currentDiffIndex >= diffs.length - 1}
                  title="Next difference"
                >
                  <ChevronDown size={14} />
                </ActionIcon>
              </Group>
            </Paper>
          )}
        </div>

        {/* Right Editor */}
        <Paper 
          p="sm" 
          withBorder 
          className="min-h-0 flex flex-col dark:bg-slate-800! dark:border-slate-700!" 
          data-editor="right"
          onClick={() => setActiveEditor("right")}
        >
          <EditableDocName value={rightDocName} onChange={setRightDocName} showSaved={showRightSaved} />
          {renderEditor(
            "right",
            rightInput,
            setRightInput,
            rightError,
            rightViewMode,
            setRightViewMode,
            rightObject,
            rightFileRef
          )}
        </Paper>
      </div>

      {/* Comparison Results */}
      {comparison && (
        <Alert
          color={comparison.areEqual ? "green" : "orange"}
          title={
            comparison.areEqual ? "JSON structures match!" : "Differences found"
          }
          icon={
            comparison.areEqual ? (
              <Check size={16} />
            ) : (
              <AlertCircle size={16} />
            )
          }
          withCloseButton
          onClose={() => setComparison(null)}
        >
          {comparison.areEqual ? (
            "Both JSON documents are structurally identical."
          ) : (
            <Stack gap="xs">
              <Text size="sm">
                Found {comparison.differences.length} differences:
              </Text>
              <ul className="text-xs m-0 pl-4">
                {comparison.differences.slice(0, 10).map((diff, idx) => (
                  <li key={idx}>{diff}</li>
                ))}
                {comparison.differences.length > 10 && (
                  <li>... and {comparison.differences.length - 10} more</li>
                )}
              </ul>
            </Stack>
          )}
        </Alert>
      )}

      {/* Document Picker Modal */}
      <DocumentPicker
        opened={pickerOpened}
        onClose={() => setPickerOpened(false)}
        onSelect={handleDocumentSelected}
        currentSide={pickerSide}
      />

      {/* Fullscreen Modal */}
      <Modal
        opened={fullscreenSide !== null}
        onClose={() => setFullscreenSide(null)}
        size="100%"
        padding="lg"
        title={`${fullscreenSide === "left" ? leftDocName : rightDocName} - Fullscreen`} 
        classNames={{
        body: 'bg-white dark:bg-slate-800',
        content: 'bg-white dark:bg-slate-800',
        header: 'bg-white dark:bg-slate-800!',
        }}
      >
        <div className="h-[80vh]">
          {fullscreenSide === "left" &&
            renderEditor(
              "left",
              leftInput,
              setLeftInput,
              leftError,
              leftViewMode,
              setLeftViewMode,
              leftObject,
              leftFileRef
            )}
          {fullscreenSide === "right" &&
            renderEditor(
              "right",
              rightInput,
              setRightInput,
              rightError,
              rightViewMode,
              setRightViewMode,
              rightObject,
              rightFileRef
            )}
        </div>
      </Modal>

      {/* Transform Modal */}
      <TransformModal
        opened={transformOpened}
        onClose={() => setTransformOpened(false)}
        originalData={leftObject}
        onTransform={handleTransformApply}
      />
    </div>
  );
};

export default JsonBeautifier;
