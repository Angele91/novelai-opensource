import { defineStyleConfig } from "@chakra-ui/react";

export const Editable = defineStyleConfig({
  baseStyle: {
    input: {
      borderRadius: 0,
      _focusVisible: {
        boxShadow: "none",
      }
    },
    textarea: {
      borderRadius: 0,
    },
    preview: {
      borderRadius: 0,
    }
  },
  variants: {}
})