'use client'

import ColorModeSwitch from "@/components/ColorModeSwitch";
import { Flex } from "@chakra-ui/react";

export default function AuthLayout({ children }) {
  return (
    <Flex
      width="100vw"
      height="100vh"
      align="center"
      justify="center"
      bgColor="Background"
    >
      <ColorModeSwitch fixed />
      {children}
    </Flex>
  )
}
