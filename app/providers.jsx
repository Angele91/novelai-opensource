'use client'

import { theme } from '@/theme'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { RecoilRoot } from 'recoil'
import 'core-js/features/reflect';
import { PluginsProvider } from '@/components/PluginsEditor/PluginsProvider'

export const Providers = ({ children }) => {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <RecoilRoot>
          <PluginsProvider>
            {children}
          </PluginsProvider>
        </RecoilRoot>
      </ChakraProvider>
    </CacheProvider>
  )
}