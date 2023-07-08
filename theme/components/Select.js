import { defineStyleConfig } from "@chakra-ui/react";

export const Select = defineStyleConfig({
  baseStyle: {
    field: {
      borderRadius: 0,
    }
  },
  variants: {
    outline: {
      field: {
        borderRadius: 0,
      }
    }
  }
})