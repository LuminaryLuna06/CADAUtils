import React, { useState, useRef } from "react";
import {
  Modal,
  TextInput,
  Button,
  Stack,
  Group,
  Text,
  ActionIcon,
  Paper,
  Select,
} from "@mantine/core";
import { Search, X, Trash2 } from "lucide-react";

interface JsonDocument {
  id: string;
  name: string;
  content: string;
  lastOpened: number;
  size: number;
}

interface DocumentPickerProps {
  opened: boolean;
  onClose: () => void;
  onSelect: (doc: JsonDocument) => void;
  currentSide: "left" | "right";
}

const STORAGE_KEY = "jsonbeautifier-documents";

export const getDocuments = (): JsonDocument[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveDocument = (doc: Omit<JsonDocument, "id" | "lastOpened" | "size">): JsonDocument => {
  const docs = getDocuments();
  const newDoc: JsonDocument = {
    ...doc,
    id: doc.name || `doc-${Date.now()}`,
    lastOpened: Date.now(),
    size: new Blob([doc.content]).size,
  };
  
  // Update existing or add new
  const index = docs.findIndex(d => d.id === newDoc.id);
  if (index >= 0) {
    docs[index] = newDoc;
  } else {
    docs.push(newDoc);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  return newDoc;
};

export const deleteDocument = (id: string): void => {
  const docs = getDocuments().filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
};

export const initializeDocuments = (): void => {
  const docs = getDocuments();
  if (docs.length === 0) {
    // Create 2 default documents
    saveDocument({ name: "New document 1", content: "" });
    saveDocument({ name: "New document 2", content: "" });
  }
};

const DocumentPicker: React.FC<DocumentPickerProps> = ({
  opened,
  onClose,
  onSelect,
  currentSide,
}) => {
  const [documents, setDocuments] = useState<JsonDocument[]>(getDocuments());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");

  const refreshDocuments = () => {
    setDocuments(getDocuments());
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this document?")) {
      deleteDocument(id);
      refreshDocuments();
    }
  };

  const handleSelect = (doc: JsonDocument) => {
    // Update last opened timestamp
    saveDocument({ name: doc.name, content: doc.content });
    onSelect(doc);
    onClose();
  };

  const filteredDocs = documents
    .filter(
      (doc) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return b.lastOpened - a.lastOpened;
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Open a file"
      size="lg"
      padding="lg"
    >
      <Stack gap="md">
        {/* Search and Sort */}
        <Group grow>
          <TextInput
            placeholder="Enter a document name or id..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftSection={<Search size={16} />}
          />
          <Select
            value={sortBy}
            onChange={(val) => setSortBy(val as "date" | "name")}
            data={[
              { value: "date", label: "Date" },
              { value: "name", label: "Name" },
            ]}
            leftSection={<Text size="sm">Sort by:</Text>}
          />
        </Group>

        <Text size="sm" c="dimmed" ta="right">
          Showing {filteredDocs.length} documents
        </Text>

        {/* Document List */}
        <Stack gap="xs" mah={400} style={{ overflow: "auto" }}>
          {filteredDocs.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              No documents found
            </Text>
          ) : (
            filteredDocs.map((doc) => (
              <Paper
                key={doc.id}
                p="md"
                withBorder
                className="hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                onClick={() => handleSelect(doc)}
              >
                <Group justify="space-between" wrap="nowrap">
                  <div className="flex-1 min-w-0">
                    <Text fw={500} size="sm" truncate>
                      {doc.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Size: {doc.size} B, last opened: {formatDate(doc.lastOpened)}
                    </Text>
                  </div>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={(e) => handleDelete(doc.id, e)}
                  >
                    <X size={16} />
                  </ActionIcon>
                </Group>
              </Paper>
            ))
          )}
        </Stack>

        {/* Footer */}
        <Group justify="flex-end">
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default DocumentPicker;
