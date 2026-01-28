import React, { useState, useEffect } from "react";
import {
  Modal,
  Textarea,
  Button,
  Group,
  Text,
  Alert,
  Paper,
  Stack,
  Code,
  Accordion,
} from "@mantine/core";
import { AlertCircle, Sparkles, Info } from "lucide-react";
import {
  executeTransform,
  getExampleQueries,
  TransformResult,
} from "../../services/transformService";
import JsonTree from "./JsonTree";

interface TransformModalProps {
  opened: boolean;
  onClose: () => void;
  originalData: any;
  onTransform: (transformedData: any) => void;
}

const TransformModal: React.FC<TransformModalProps> = ({
  opened,
  onClose,
  originalData,
  onTransform,
}) => {
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<TransformResult | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);

  // Auto-preview when query changes
  useEffect(() => {
    if (query.trim() === "") {
      setPreview(null);
      return;
    }

    const timer = setTimeout(() => {
      const result = executeTransform(originalData, query);
      setPreview(result);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, originalData]);

  const handleTransform = () => {
    if (!preview || !preview.success) return;

    setIsTransforming(true);
    // Apply transformation
    onTransform(preview.data);
    
    setTimeout(() => {
      setIsTransforming(false);
      onClose();
    }, 100);
  };

  const insertExample = (example: string) => {
    setQuery(example);
  };

  const examples = getExampleQueries();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="95%"
      title={
        <Group gap="xs">
          <Sparkles size={20} />
          <Text fw={600}>Transform JSON</Text>
        </Group>
      }
      classNames={{
        body: "max-h-[80vh] overflow-auto",
        content: "bg-white dark:bg-slate-800",
        header: "bg-white dark:bg-slate-800 border-b dark:border-slate-700",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Side: Original + Query */}
        <Stack gap="md">
          {/* Original Data */}
          <Paper
            p="md"
            withBorder
            className="overflow-hidden flex flex-col dark:bg-slate-900 dark:border-slate-700"
          >
            <Text size="sm" fw={600} mb="xs" c="dimmed">
              Original
            </Text>
            <div className="h-[400px] overflow-auto custom-scrollbar">
              {originalData && (
                <JsonTree
                  data={originalData}
                  // Read-only, no edit handlers
                />
              )}
            </div>
          </Paper>

          {/* Query Input */}
          <Paper
            p="md"
            withBorder
            className="dark:bg-slate-900 dark:border-slate-700"
          >
            <Text size="sm" fw={600} mb="xs" c="dimmed">
              Query
            </Text>
            
            <Alert
              icon={<Info size={16} />}
              color="blue"
              variant="light"
              mb="sm"
              title="How to use"
            >
              <Text size="xs" mb="xs">
                Use lodash functions like <Code>filter</Code>, <Code>map</Code>,{" "}
                <Code>pick</Code>, or direct property access like{" "}
                <Code>data.features</Code>
              </Text>
            </Alert>

            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your query, e.g., filter(data.users, user => user.role === 'admin')"
              minRows={3}
              maxRows={6}
              className="font-mono text-sm"
              styles={{
                input: {
                  fontFamily: "monospace",
                  fontSize: "13px",
                },
              }}
            />

            {/* Examples */}
            <Accordion mt="sm" variant="contained">
              <Accordion.Item value="examples">
                <Accordion.Control>
                  <Text size="sm" fw={500}>
                    Example Queries
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="xs">
                    {examples.map((example, idx) => (
                      <Code
                        key={idx}
                        block
                        className="cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700"
                        onClick={() => insertExample(example)}
                      >
                        {example}
                      </Code>
                    ))}
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Paper>
        </Stack>

        {/* Right Side: Preview */}
        <Paper
          p="md"
          withBorder
          className="overflow-hidden flex flex-col dark:bg-slate-900 dark:border-slate-700"
        >
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={600} c="dimmed">
              Preview
            </Text>
            {preview && preview.success && (
              <Button
                size="xs"
                variant="filled"
                color="violet"
                leftSection={<Sparkles size={14} />}
                onClick={handleTransform}
                loading={isTransforming}
              >
                Transform
              </Button>
            )}
          </Group>

          <div className="h-[70vh] overflow-auto custom-scrollbar">
            {!query && (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm italic">
                Enter a query to see preview...
              </div>
            )}

            {preview && !preview.success && (
              <Alert
                icon={<AlertCircle size={16} />}
                color="red"
                variant="filled"
                title="Query Error"
              >
                {preview.error}
              </Alert>
            )}

            {preview && preview.success && (
              <JsonTree
                data={preview.data}
                expandAll={true}
                // Read-only preview
              />
            )}
          </div>
        </Paper>
      </div>
    </Modal>
  );
};

export default TransformModal;
