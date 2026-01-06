import React, { useState, useMemo } from "react";
import {
  AlignLeft,
  Minimize,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  Code,
  FileJson,
} from "lucide-react";
import {
  JsonInput,
  Button,
  Group,
  Alert,
  Textarea,
  ActionIcon,
  SegmentedControl,
  useMantineColorScheme,
  Text,
} from "@mantine/core";
import ReactJson from "react-json-view";
import { beautifyJson, minifyJson } from "../../services/dataService";

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

const JsonBeautifier: React.FC = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"tree" | "raw">("tree");

  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  // Parse output for Tree View safely
  const jsonObject = useMemo(() => {
    if (!output) return null;
    try {
      return JSON.parse(output);
    } catch {
      return null;
    }
  }, [output]);

  const handleExample = () => {
    const exampleStr = JSON.stringify(SAMPLE_JSON, null, 2);
    setInput(exampleStr);
    setOutput(exampleStr);
    setError("");
  };

  const handleBeautify = () => {
    try {
      setError("");
      setOutput(beautifyJson(input));
      setViewMode("tree"); // Switch to tree view on beautify for better reading
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const handleMinify = () => {
    try {
      setError("");
      setOutput(minifyJson(input));
      setViewMode("raw"); // Switch to raw view on minify to see the compact string
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-160px)] flex flex-col min-h-[600px]">
      <div className="flex justify-between items-center shrink-0 flex-wrap gap-4">
        <div className="prose dark:prose-invert">
          <h3 className="text-slate-900 dark:text-white">JSON Formatter</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Validate, beautify, and minify JSON data.
          </p>
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
          <Button
            onClick={handleBeautify}
            leftSection={<AlignLeft size={16} />}
          >
            Beautify
          </Button>
          <Button
            onClick={handleMinify}
            variant="light"
            color="gray"
            leftSection={<Minimize size={16} />}
          >
            Minify
          </Button>
        </Group>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* INPUT COLUMN */}
        <div className="flex flex-col gap-2 min-h-0">
          <Text size="sm" fw={500} c="dimmed">
            Input JSON
          </Text>
          <JsonInput
            placeholder="Paste your JSON here..."
            validationError={error}
            formatOnBlur
            autosize={false}
            value={input}
            onChange={setInput}
            styles={{
              input: {
                height: "100%",
                fontFamily: "monospace",
                fontSize: "13px",
              },
              wrapper: { height: "100%" },
            }}
            className="h-full flex-1"
          />
        </div>

        {/* OUTPUT COLUMN */}
        <div className="flex flex-col gap-2 min-h-0 relative">
          <Group justify="space-between" align="center">
            <Text size="sm" fw={500} c="dimmed">
              Output
            </Text>

            <Group gap="xs">
              <SegmentedControl
                size="xs"
                w={180}
                value={viewMode}
                onChange={(val) => setViewMode(val as "tree" | "raw")}
                data={[
                  {
                    value: "tree",
                    label: (
                      <Group gap={4} justify="center">
                        <FileJson size={12} /> Tree
                      </Group>
                    ),
                  },
                  {
                    value: "raw",
                    label: (
                      <Group gap={4} justify="center">
                        <Code size={12} /> Raw
                      </Group>
                    ),
                  },
                ]}
              />
              {output && (
                <Button
                  variant="subtle"
                  size="xs"
                  onClick={copyToClipboard}
                  leftSection={
                    copied ? <Check size={14} /> : <Copy size={14} />
                  }
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              )}
            </Group>
          </Group>

          <div className="relative flex-1 min-h-0 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-[#151b28] overflow-hidden flex flex-col">
            {output ? (
              viewMode === "tree" && jsonObject ? (
                <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                  <ReactJson
                    src={jsonObject}
                    theme={isDark ? "ocean" : "rjv-default"}
                    displayDataTypes={false}
                    displayObjectSize={true}
                    enableClipboard={false}
                    style={{
                      backgroundColor: "transparent",
                      fontSize: "13px",
                      fontFamily: "monospace",
                    }}
                  />
                </div>
              ) : (
                <Textarea
                  readOnly
                  value={output}
                  placeholder="Result..."
                  styles={{
                    input: {
                      height: "100%",
                      fontFamily: "monospace",
                      fontSize: "13px",
                      border: "none",
                      backgroundColor: "transparent",
                      padding: "1rem",
                    },
                    wrapper: { height: "100%" },
                  }}
                  className="h-full"
                />
              )
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic">
                Result will appear here...
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
      </div>
    </div>
  );
};

export default JsonBeautifier;
