import { db } from "@/app/db";
import { changeSizeProportionally } from "@/lib/images/changeSizeProportionally";
import getImageDimensions from "@/lib/images/getImageDimensions";
import { Card, CardBody } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";


export const ImagePanel = ({ imageId, position }) => {
  const image = useLiveQuery(async () => {
    if (!imageId) return null;
    const image = await db.blocks.get(Number(imageId));
    
    if (!image) return null;

    try {
      return JSON.parse(image.content);
    } catch {
      return null;
    }
  }, [imageId]);

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const getDimensions = async () => {
      const { width, height } = await getImageDimensions(image.rawDataUrl);
      const [reducedWidth, reducedHeight] = changeSizeProportionally(width, height, 0.5)
      setDimensions({ width: reducedWidth, height: reducedHeight });
    }

    if (image) {
      getDimensions();
    } else {
      setDimensions({ width: 0, height: 0 });
    }
  }, [image])

  const isOpen = image && position;
  if (!isOpen) return null;

  return (
    <Card
      as={motion.div}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: isOpen ? 1 : 0,
        scale: isOpen ? 1 : 0,
        top: position.top,
        left: position.left,
      }}
      position="fixed"
      top={position.top}
      left={position.left}
      zIndex="1"
    >
      <CardBody p={2}>
        <Image
          alt={imageId}
          src={image.rawDataUrl}
          width={dimensions.width} 
          height={dimensions.height}
        />
      </CardBody>
    </Card>
  )
}
