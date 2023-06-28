import { defineStyleConfig } from "@chakra-ui/react";

export const ColorModeSwitch = defineStyleConfig({
  variants: {
    fixed: {
      position: 'fixed',
      top: 0,
      left: 0,
      marginTop: 2,
      marginLeft: 2, 
    },
  },
})