import { useEditorEffect, useEditorState } from "@nytimes/react-prosemirror";
import { useState } from "react";
import { Card, CardBody, IconButton, Tooltip } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { BsImage } from "react-icons/bs";

export const OptionsWidget = ({ onGenerateImage }) => {
  const [position, setPosition] = useState(null);
  const isOpen = !!position;

  const { selection } = useEditorState();

  useEditorEffect((view) => {
    if (!view) return;

    const { from, to } = selection;

    if (from === to) {
      setPosition(null);
      return;
    }

    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);

    const selectionWidth = end.left - start.left;
    const selectionHeight = end.top - end.bottom;

    setPosition({
      x: end.left - selectionWidth,
      y: end.top + (selectionHeight * 4),
    });
  }, [selection]);

  if (!isOpen) return null;

  return (
    <Card
      as={motion.div}
      animate={{
        opacity: isOpen ? 1 : 0,
        scale: isOpen ? 1 : 0,
      }}
      initial={{
        opacity: 0,
        scale: 0,
      }}
      position="fixed"
      variant="outline"
      top={position?.y}
      left={position?.x}
    >
      <CardBody display="flex" p="1">
        <Tooltip label="Generate an image from this text" placement="top">
          <IconButton 
            aria-label="Generate Image"
            icon={<BsImage />}
            onClick={onGenerateImage}
          />
        </Tooltip>
      </CardBody>
    </Card>
  );
}