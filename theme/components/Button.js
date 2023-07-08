import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

export const Button = defineStyleConfig({
  baseStyle: {
    borderRadius: 0,
  },
  variants: {
    outline: defineStyle(() => ({
      border: '1px solid white',
    })),
  }
})