"use client";
import {
  Button,
  Card,
  ColorPicker,
  CopyButton,
  Flex,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Copy, RefreshCcw } from "lucide-react";
import React, { useCallback, useMemo, useRef, useState } from "react";

type FormattingType = "foreground" | "background" | "style";
type TextStyles = {
  bold: boolean;
  underline: boolean;
};

const ANSI_CODES = {
  styles: {
    bold: "1",
    underline: "4",
  },
  colors: {
    "30": "#4f545c",
    "31": "#dc322f",
    "32": "#859900",
    "33": "#b58900",
    "34": "#268bd2",
    "35": "#d33682",
    "36": "#2aa198",
    "37": "#ffffff",
  },
  backgrounds: {
    "40": "#002b36",
    "41": "#cb4b16",
    "42": "#586e75",
    "43": "#657b83",
    "44": "#839496",
    "45": "#6c71c4",
    "46": "#93a1a1",
    "47": "#fdf6e3",
  },
  colorMap: {
    "#4f545c": "30",
    "#dc322f": "31",
    "#859900": "32",
    "#b58900": "33",
    "#268bd2": "34",
    "#d33682": "35",
    "#2aa198": "36",
    "#ffffff": "37",
  },
  backgroundMap: {
    "#002b36": "40",
    "#cb4b16": "41",
    "#586e75": "42",
    "#657b83": "43",
    "#839496": "44",
    "#6c71c4": "45",
    "#93a1a1": "46",
    "#fdf6e3": "47",
  },
} as const;

const ColorPickerCard = ({
  title,
  colors,
  onChange,
}: {
  title: string;
  colors: string[];
  onChange: (color: string) => void;
}) => (
  <Card shadow="0" withBorder padding={15}>
    <Text>{title}</Text>
    <ColorPicker
      swatchesPerRow={8}
      size="lg"
      format="hex"
      swatches={colors}
      withPicker={false}
      onChange={onChange}
    />
  </Card>
);

const StyleButton = ({
  style,
  onClick,
  children,
}: {
  style: "bold" | "underline";
  onClick: (style: "bold" | "underline") => void;
  children: React.ReactNode;
}) => (
  <Button onClick={() => onClick(style)} variant="default">
    {children}
  </Button>
);

function Input() {
  // const isMobile = useMediaQuery("(max-width: 768px)");
  const editorRef = useRef<HTMLDivElement>(null);
  const [textStyles, setTextStyles] = useState<TextStyles>({
    bold: false,
    underline: false,
  });

  const colorSwatches = useMemo(() => Object.values(ANSI_CODES.colors), []);
  const backgroundSwatches = useMemo(
    () => Object.values(ANSI_CODES.backgrounds),
    []
  );

  const applyFormatting = useCallback(
    (ansiCode: string, type: FormattingType) => {
      const selection = window.getSelection();
      if (!selection?.rangeCount) return;

      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      if (!selectedText) return;

      const span = document.createElement("span");
      span.textContent = selectedText;
      span.classList.add(`ansi-${ansiCode}`);

      const styleMap = {
        foreground: () =>
          (span.style.color =
            ANSI_CODES.colors[ansiCode as keyof typeof ANSI_CODES.colors]),
        background: () =>
          (span.style.backgroundColor =
            ANSI_CODES.backgrounds[
              ansiCode as keyof typeof ANSI_CODES.backgrounds
            ]),
        style: () => {
          if (ansiCode === ANSI_CODES.styles.bold)
            span.style.fontWeight = "bold";
          if (ansiCode === ANSI_CODES.styles.underline)
            span.style.textDecoration = "underline";
        },
      };

      styleMap[type]();
      range.deleteContents();
      range.insertNode(span);
    },
    []
  );

  const handleStyleToggle = useCallback(
    (style: "bold" | "underline") => {
      setTextStyles((prev) => ({ ...prev, [style]: !prev[style] }));
      applyFormatting(ANSI_CODES.styles[style], "style");
    },
    [applyFormatting]
  );

  const generateAnsiText = useCallback(() => {
    if (!editorRef.current) return "";

    const serializeNode = (node: Node): string => {
      if (node.nodeType === 3) return node.textContent || "";
      if (node.nodeName === "SPAN") {
        const span = node as HTMLSpanElement;
        const ansiCode = span.className.split("-")[1];
        return `\u001b[${ansiCode}m${span.textContent}\u001b[0m`;
      }
      return Array.from(node.childNodes).map(serializeNode).join("");
    };

    return `\`\`\`ansi\n${Array.from(editorRef.current.childNodes)
      .map(serializeNode)
      .join("")}\n\`\`\``;
  }, []);

  return (
    <Card shadow="xs" withBorder padding={20} radius={10}>
      <Stack gap={15}>
        <Title order={3}>Message Editor</Title>
        <Card padding={0} shadow="0">
          <div
            ref={editorRef}
            contentEditable
            style={{
              borderRadius: "5px",
              minHeight: "100px",
              border: "1px solid #ccc",
              padding: "10px",
              whiteSpace: "pre-wrap",
            }}
            aria-label="Text editor for ANSI formatted text"
          />
        </Card>
        <Flex wrap="wrap" gap={15} direction={{ base: "column", sm: "row" }}>
          <ColorPickerCard
            title="Foreground"
            colors={colorSwatches}
            onChange={(color) =>
              applyFormatting(
                ANSI_CODES.colorMap[color as keyof typeof ANSI_CODES.colorMap],
                "foreground"
              )
            }
          />
          <ColorPickerCard
            title="Background"
            colors={backgroundSwatches}
            onChange={(color) =>
              applyFormatting(
                ANSI_CODES.backgroundMap[
                  color as keyof typeof ANSI_CODES.backgroundMap
                ],
                "background"
              )
            }
          />
        </Flex>

        <Group gap={10}>
          <Button
            leftSection={<RefreshCcw size={16} />}
            color="red"
            variant="light"
          >
            Reset
          </Button>
          <StyleButton style="bold" onClick={handleStyleToggle}>
            <Text size="sm" fw={700}>
              Bold
            </Text>
          </StyleButton>
          <StyleButton style="underline" onClick={handleStyleToggle}>
            <Text size="sm" td="underline">
              UnderLine
            </Text>
          </StyleButton>

          <CopyButton value={generateAnsiText()}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? "Copied!" : "Copy to clipboard"}>
                <Button
                  variant="light"
                  leftSection={<Copy size={16} />}
                  onClick={copy}
                  color={copied ? "green" : "blue"}
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
      </Stack>
    </Card>
  );
}

export default Input;
