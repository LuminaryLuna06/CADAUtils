import React, { useState } from "react";
import { ArrowRightLeft, AlertCircle, Copy, Check } from "lucide-react";
import {
  Select,
  Textarea,
  Button,
  ActionIcon,
  Paper,
  Alert,
  Group,
  Text,
} from "@mantine/core";
import { convertData, DataFormat } from "../../services/dataService";
import { useSettingsContext } from "../../contexts/SettingsContext";

const DataConverter: React.FC = () => {
  const { settings } = useSettingsContext();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [fromFormat, setFromFormat] = useState<string | null>("json");
  const [toFormat, setToFormat] = useState<string | null>("yaml");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const formatOptions = [
    { value: "json", label: "JSON" },
    { value: "yaml", label: "YAML" },
    { value: "csv", label: "CSV" },
  ];

  const handleConvert = () => {
    try {
      setError("");
      if (fromFormat && toFormat) {
        const result = convertData(
          input,
          fromFormat as DataFormat,
          toFormat as DataFormat
        );
        setOutput(result);
      }
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const swapFormats = () => {
    const temp = fromFormat;
    setFromFormat(toFormat);
    setToFormat(temp);
    setInput(output);
    setOutput(input);
    setError("");
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="prose dark:prose-invert">
        <h3 className="text-slate-900 dark:text-white">Data Converter</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Convert data between JSON, YAML, and CSV formats.
        </p>
      </div>

      <Paper
        p="md"
        radius="md"
        withBorder
        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
      >
        <Group justify="space-between" align="flex-end">
          <Select
            label="From"
            data={formatOptions}
            value={fromFormat}
            onChange={setFromFormat}
            allowDeselect={false}
            w={{ base: "100%", md: 150 }}
          />

          <ActionIcon
            variant="subtle"
            color={settings.primaryColor}
            onClick={swapFormats}
            size="lg"
            mb={4}
          >
            <ArrowRightLeft size={20} />
          </ActionIcon>

          <Select
            label="To"
            data={formatOptions}
            value={toFormat}
            onChange={setToFormat}
            allowDeselect={false}
            w={{ base: "100%", md: 150 }}
          />

          <Button onClick={handleConvert} w={{ base: "100%", md: "auto" }}>
            Convert
          </Button>
        </Group>
      </Paper>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
        <div className="flex flex-col gap-2">
          <Text size="sm" fw={500} c="dimmed">
            Input
          </Text>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            placeholder={`Paste your ${fromFormat?.toUpperCase()} here...`}
            styles={{
              input: {
                height: "100%",
                fontFamily: "monospace",
                fontSize: "12px",
              },
              wrapper: { height: "100%" },
            }}
            className="h-full"
          />
        </div>

        <div className="flex flex-col gap-2 relative">
          <Group justify="space-between">
            <Text size="sm" fw={500} c="dimmed">
              Output
            </Text>
            {output && (
              <Button
                variant="subtle"
                size="xs"
                onClick={copyToClipboard}
                leftSection={copied ? <Check size={14} /> : <Copy size={14} />}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            )}
          </Group>
          <div className="relative flex-1">
            <Textarea
              readOnly
              value={output}
              placeholder="Result..."
              styles={{
                input: {
                  height: "100%",
                  fontFamily: "monospace",
                  fontSize: "12px",
                  borderColor: error ? "#ef4444" : undefined,
                },
                wrapper: { height: "100%" },
              }}
              className="h-full"
            />
            {error && (
              <Alert
                variant="filled"
                color="red"
                title="Error"
                icon={<AlertCircle size={16} />}
                className="absolute bottom-0 left-0 right-0 m-2"
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

export default DataConverter;
