import React, { useState, useEffect } from "react";
import { Type, AlignLeft, Clock, FileText } from "lucide-react";
import { Textarea, Paper, Grid, Text, Group } from "@mantine/core";

const WordCounter: React.FC = () => {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    charsNoSpace: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  });

  useEffect(() => {
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.split(/\n+/).filter(Boolean).length;
    const readingTime = Math.ceil(words / 200); // 200 words per minute

    setStats({
      words,
      chars,
      charsNoSpace,
      sentences,
      paragraphs,
      readingTime,
    });
  }, [text]);

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="prose dark:prose-invert shrink-0">
        <h3 className="text-slate-900 dark:text-white">Word Counter</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Real-time statistics for your text content.
        </p>
      </div>

      <Grid className="shrink-0">
        {[
          { label: "Words", value: stats.words, icon: <AlignLeft size={16} /> },
          { label: "Characters", value: stats.chars, icon: <Type size={16} /> },
          {
            label: "No Spaces",
            value: stats.charsNoSpace,
            icon: <Type size={16} />,
          },
          {
            label: "Sentences",
            value: stats.sentences,
            icon: <FileText size={16} />,
          },
          {
            label: "Paragraphs",
            value: stats.paragraphs,
            icon: <AlignLeft size={16} />,
          },
          {
            label: "Read Time",
            value: `${stats.readingTime} min`,
            icon: <Clock size={16} />,
          },
        ].map((stat, idx) => (
          <Grid.Col key={idx} span={{ base: 6, md: 4, lg: 4 }}>
            <Paper
              p="md"
              radius="md"
              withBorder
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 min-h-[100px]"
            >
              <Group gap="xs" mb={4} c="dimmed">
                {stat.icon}
                <Text size="xs" fw={700} tt="uppercase">
                  {stat.label}
                </Text>
              </Group>
              <Text size="xl" fw={700}>
                {stat.value}
              </Text>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>

      <div className="flex-1 min-h-0">
        <Textarea
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          placeholder="Start typing or paste your text here..."
          styles={{
            input: { height: "100%", fontSize: "18px", lineHeight: "1.6" },
            wrapper: { height: "100%" },
          }}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default WordCounter;
