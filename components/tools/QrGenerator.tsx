import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Download, QrCode } from "lucide-react";
import {
  Textarea,
  Select,
  ColorInput,
  Button,
  Paper,
  Grid,
} from "@mantine/core";
import { downloadBlob } from "../../services/pdfService";

const QrGenerator: React.FC = () => {
  const [text, setText] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [errorLevel, setErrorLevel] = useState<string | null>("M");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  useEffect(() => {
    generateQr();
  }, [text, errorLevel, color, bgColor]);

  const generateQr = async () => {
    if (!text) {
      setQrUrl("");
      return;
    }
    try {
      const url = await QRCode.toDataURL(text, {
        errorCorrectionLevel: errorLevel as any,
        margin: 1,
        color: {
          dark: color,
          light: bgColor,
        },
        width: 300,
      });
      setQrUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async () => {
    if (!qrUrl) return;
    const res = await fetch(qrUrl);
    const blob = await res.blob();
    downloadBlob(blob, "qrcode.png");
  };

  return (
    <div className="space-y-6">
      <div className="prose dark:prose-invert">
        <h3 className="text-slate-900 dark:text-white">QR Code Generator</h3>
        <p className="text-slate-500 dark:text-slate-400">
          Create QR codes for URLs, text, or data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Textarea
            label="Content"
            placeholder="https://example.com or plain text"
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
            minRows={5}
            autosize
          />

          <Grid>
            <Grid.Col span={12}>
              <Select
                label="Error Correction"
                data={[
                  { value: "L", label: "Low (7%)" },
                  { value: "M", label: "Medium (15%)" },
                  { value: "Q", label: "Quartile (25%)" },
                  { value: "H", label: "High (30%)" },
                ]}
                value={errorLevel}
                onChange={setErrorLevel}
                allowDeselect={false}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <ColorInput
                label="Foreground Color"
                value={color}
                onChange={setColor}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <ColorInput
                label="Background Color"
                value={bgColor}
                onChange={setBgColor}
              />
            </Grid.Col>
          </Grid>
        </div>

        <Paper
          p="xl"
          radius="md"
          withBorder
          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center min-h-[300px]"
        >
          {qrUrl ? (
            <div className="space-y-6 text-center w-full max-w-xs">
              <div className="p-4 bg-white rounded-lg shadow-lg inline-block border border-slate-200">
                <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
              </div>
              <Button
                onClick={handleDownload}
                fullWidth
                leftSection={<Download size={20} />}
              >
                Download PNG
              </Button>
            </div>
          ) : (
            <div className="text-center text-slate-400 dark:text-slate-500">
              <QrCode size={48} className="mx-auto mb-3 opacity-20" />
              <p>Enter text to generate QR code</p>
            </div>
          )}
        </Paper>
      </div>
    </div>
  );
};

export default QrGenerator;
