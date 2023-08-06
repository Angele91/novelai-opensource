import { useRouter } from "next/navigation"
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Button, Flex } from "@chakra-ui/react"
import usePlugins from "@/lib/plugins/hooks/usePlugins"
import { uniqueId } from "lodash"
import ConfigRenderer from "../ConfigRenderer"

const PluginsTab = () => {
  const router = useRouter()
  const { configs, onSignal } = usePlugins();

  return (
    <Flex
      flexDir="column"
    >
      <Button variant="outline" onClick={() => {
        router.push('/plugins')
      }}>
        Open Plugin Editor
      </Button>
      {configs?.map((config) => (
        <Accordion key={uniqueId('config-acc-')} allowToggle>
          <AccordionItem>
            <AccordionButton>
              {config.name}
            </AccordionButton>
            <AccordionPanel>
              <ConfigRenderer onSignal={onSignal} config={config.config} />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      ))}
    </Flex>
  )
}

export default PluginsTab