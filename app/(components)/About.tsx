import { Card, Title, List, ListItem } from "@mantine/core";
import React from "react";

function About() {
  return (
    <Card shadow="xs" withBorder padding={20} radius={10}>
      <Title order={3} mb="md">
        Instructions
      </Title>
      <List type="ordered" spacing="xs" size="md">
        <ListItem>1. Type or paste your message in the editor above</ListItem>
        <ListItem>2. Select the text you want to color</ListItem>
        <ListItem>3. Select the Foreground or Background color and add styles</ListItem>
        <ListItem>4. Click &quot;Copy&quot; when you&apos;re done</ListItem>
        <ListItem>5. Paste the text into Discord</ListItem>
      </List>
    </Card>
  );
}

export default About;
