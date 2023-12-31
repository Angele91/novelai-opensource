'use client'

import { theme } from '@/theme'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { RecoilRoot } from 'recoil'
import 'core-js/features/reflect';

export const Providers = ({ children }) => {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <RecoilRoot>
          {children}
        </RecoilRoot>
      </ChakraProvider>
    </CacheProvider>
  )
}