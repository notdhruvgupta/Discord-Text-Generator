"use client"
import React from "react";
import { Card, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

function Navbar() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="text-center space-y-4">
      <Title order={isMobile ? 2 : 1}>Discord Color Generator</Title>
      <Text size="sm">
        Create colorful Discord messages using ANSI color codes. Select text and
        apply colors, then copy and paste into Discord!
      </Text>
    </div>
  );
}

export default Navbar;
