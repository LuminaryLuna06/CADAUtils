import React, { useState, useEffect } from "react";
import { Download, RefreshCw, Lock, Unlock } from "lucide-react";
import {
  NumberInput,
  Button,
  ActionIcon,
  Paper,
  Group,
  Text,
  Grid,
} from "@mantine/core";
import FileUpload from "../ui/FileUpload";
import { resizeImage } from "../../services/imageService";
import { downloadBlob } from "../../services/pdfService";

const ImageResize: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState<number | string>(0);
  const [height, setHeight] = useState<number | string>(0);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [lockAspect, setLockAspect] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (file) {
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setAspectRatio(img.width / img.height);
      };
      img.src = URL.createObjectURL(file);
    }
  }, [file]);

  const handleWidthChange = (val: number | string) => {
    const numVal = typeof val === "string" ? parseFloat(val) : val;
    setWidth(val);
    if (lockAspect && !isNaN(numVal)) {
      setHeight(Math.round(numVal / aspectRatio));
    }
  };

  const handleHeightChange = (val: number | string) => {
    const numVal = typeof val === "string" ? parseFloat(val) : val;
    setHeight(val);
    if (lockAspect && !isNaN(numVal)) {
      setWidth(Math.round(numVal * aspectRatio));
    }
  };

  const handleResize = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const w = Number(width);
      const h = Number(height);
      const blob = await resizeImage(file, w, h);
      downloadBlob(blob, `resized-${w}x${h}-${file.name}`);
    } catch (err) {
      console.error(err);
      alert("Resize failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="prose dark:prose-invert">
        <h3 className="text-slate-900 dark:text-white">Resize Image</h3>
        <p className="text-slate-500 dark:text-slate-400">
          Change image dimensions without uploading to a server.
        </p>
      </div>

      {!file ? (
        <FileUpload
          accept="image/*"
          onFilesSelected={(files) => setFile(files[0])}
          label="Upload Image to Resize"
        />
      ) : (
        <Paper
          p="xl"
          radius="md"
          withBorder
          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 max-w-2xl mx-auto"
        >
          <Group justify="space-between" mb="lg">
            <Group>
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                <img
                  src={URL.createObjectURL(file)}
                  className="w-full h-full object-cover"
                  alt="preview"
                />
              </div>
              <div>
                <Text fw={500}>{file.name}</Text>
                <Text size="xs" c="dimmed">
                  Original: {Math.round(file.size / 1024)} KB
                </Text>
              </div>
            </Group>
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => setFile(null)}
            >
              <RefreshCw size={18} />
            </ActionIcon>
          </Group>

          <Grid align="flex-end" mb="xl">
            <Grid.Col span={5}>
              <NumberInput
                label="Width (px)"
                value={width}
                onChange={handleWidthChange}
                allowNegative={false}
                hideControls
              />
            </Grid.Col>
            <Grid.Col span={2} className="flex justify-center pb-1">
              <ActionIcon
                variant={lockAspect ? "light" : "subtle"}
                color={lockAspect ? "pink" : "gray"}
                onClick={() => {
                  setLockAspect(!lockAspect);
                  if (!lockAspect)
                    setAspectRatio(Number(width) / Number(height));
                }}
                size="lg"
              >
                {lockAspect ? <Lock size={18} /> : <Unlock size={18} />}
              </ActionIcon>
            </Grid.Col>
            <Grid.Col span={5}>
              <NumberInput
                label="Height (px)"
                value={height}
                onChange={handleHeightChange}
                allowNegative={false}
                hideControls
              />
            </Grid.Col>
          </Grid>

          <Button
            onClick={handleResize}
            loading={processing}
            fullWidth
            size="md"
            leftSection={!processing && <Download size={20} />}
          >
            Download Resized Image
          </Button>
        </Paper>
      )}
    </div>
  );
};

export default ImageResize;
