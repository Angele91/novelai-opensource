import { Card, CardBody, IconButton, Tooltip } from "@chakra-ui/react";
import { usePositioner, useRemirrorContext } from "@remirror/react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { BsImage } from "react-icons/bs";


export const OptionsPanel = ({ onGenerateImage }) => {
  const { manager } = useRemirrorContext();
  const { data } = usePositioner('selection');

  const isOpen = Object.keys(data).length > 0;

  const { left, top } = useMemo(() => {
    const { view } = manager;
    const { to } = data;

    if (!view || !isOpen) return {};

    return {
      left: to.left,
      top: to.top,
    }
  }, [data, isOpen, manager]);

  if (!isOpen) return null;


  return (
    <Card
      as={motion.div}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: isOpen ? 1 : 0,
        scale: isOpen ? 1 : 0,
        top: top,
        left: left,
      }}
      position="fixed"
      top={top}
      left={left}
    >
      <CardBody p={2}>
        <Tooltip label="Generate an image from this text" placement="top">
          <IconButton
            aria-label="Generate Image"
            icon={<BsImage />}
            onClick={onGenerateImage}
          />
        </Tooltip>
      </CardBody>
    </Card>
  )
}
