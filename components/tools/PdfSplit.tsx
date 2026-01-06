import React, { useState } from 'react';
import { FileText, Download, RefreshCw } from 'lucide-react';
import { TextInput, Button, ActionIcon, Paper, Group, Text } from '@mantine/core';
import FileUpload from '../ui/FileUpload';
import { splitPdf, downloadBlob } from '../../services/pdfService';

const PdfSplit: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [range, setRange] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSplit = async () => {
    if (!file || !range) return;
    setProcessing(true);
    try {
      const result = await splitPdf(file, range);
      downloadBlob(result, `split-${file.name}`);
    } catch (err) {
      console.error(err);
      alert('Error splitting PDF. Please check your range format.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="prose dark:prose-invert">
        <h3 className="text-slate-900 dark:text-white">Split PDF</h3>
        <p className="text-slate-500 dark:text-slate-400">Extract specific pages from your PDF document.</p>
      </div>

      {!file ? (
        <FileUpload 
          accept=".pdf" 
          onFilesSelected={(files) => setFile(files[0])} 
          label="Upload PDF to split" 
        />
      ) : (
        <Paper p="lg" radius="md" withBorder className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <Group justify="space-between" mb="lg">
            <Group>
              <div className="p-3 bg-red-100 dark:bg-red-500/10 rounded-lg text-red-600 dark:text-red-400">
                <FileText size={24} />
              </div>
              <div>
                <Text fw={500}>{file.name}</Text>
                <Text size="sm" c="dimmed">{(file.size / 1024 / 1024).toFixed(2)} MB</Text>
              </div>
            </Group>
            <ActionIcon variant="subtle" color="gray" onClick={() => setFile(null)} size="lg">
              <RefreshCw size={18} />
            </ActionIcon>
          </Group>

          <TextInput
            label="Page Range"
            placeholder="e.g. 1-3, 5, 8-10"
            description="Enter page numbers or ranges separated by commas (1-based index)."
            value={range}
            onChange={(event) => setRange(event.currentTarget.value)}
            mb="lg"
          />

          <Button
            onClick={handleSplit}
            loading={processing}
            disabled={!range}
            fullWidth
            size="md"
            leftSection={!processing && <Download size={20} />}
          >
            Download Extracted Pages
          </Button>
        </Paper>
      )}
    </div>
  );
};

export default PdfSplit;