import { useEditorEffect, useEditorState } from "@nytimes/react-prosemirror";
import { useState } from "react";
import { Card, CardBody, IconButton, Tooltip } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { BsImage } from "react-icons/bs";
import { db } from "@/app/db";
import { useLiveQuery } from "dexie-react-hooks";
import Image from "next/image";
import { DEFAULT_IMAGE_GENERATION_PARAMS } from "@/lib/novelai/constants";

export const ImageWidget = () => {
  const [position, setPosition] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  const images = useLiveQuery(async () => {
    return await db.blocks.where('type').equals('image').toArray();
  }, []);

  const isOpen = !!position;

  const { selection } = useEditorState();

  useEditorEffect((view) => {
    if (!view) return;

    const { from, to } = selection;

    if (from !== to) {
      setPosition(null);
      return;
    }

    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);

    const selectionWidth = end.left - start.left;
    const selectionHeight = end.top - end.bottom;

    const newPos = {
      x: end.left - selectionWidth,
      y: end.top - selectionHeight,
    }

    const node = view.state.doc.nodeAt(from);
    const [mark] = node?.marks.filter((mark) => mark.type.name === 'dataImg') ?? [];
    const fileId = mark?.attrs.dataImg;

    const image = images?.find((image) => image.id === fileId);
    const imgContent = JSON.parse(image?.content ?? '{}');

    if (isOpen) {
      setPosition(null);
    } else if (image) {
      setPosition(newPos);
      setImageURL(imgContent.rawDataUrl);
    }
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
      zIndex={1}
    >
      <CardBody display="flex" p="1">
        <Image
          src={imageURL}
          alt="image"
          width={DEFAULT_IMAGE_GENERATION_PARAMS.width / 2}
          height={DEFAULT_IMAGE_GENERATION_PARAMS.height / 2}
        />
      </CardBody>
    </Card>
  );
}