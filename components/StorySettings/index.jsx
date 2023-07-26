import { Button, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { PresetsTab } from "./PresetsTab";
import { MemoryTab } from "./MemoryTab";
import { useRouter } from "next/navigation";

export const StorySettings = ({ isSidebarOpen }) => {
  const router = useRouter()

  return (
    <Tabs>
      {isSidebarOpen && (
        <TabList>
          <Tab>Presets</Tab>
          <Tab>Memory</Tab>
          <Tab>Plugins</Tab>
        </TabList>
      )}

      <TabPanels>
        <TabPanel>
          <PresetsTab isSidebarOpen={isSidebarOpen} />
        </TabPanel>
        <TabPanel>
          <MemoryTab isSidebarOpen={isSidebarOpen} />
        </TabPanel>
        <TabPanel>
          <Button variant="outline" onClick={() => {
            router.push('/plugins')
          }}>
            Open Plugin Editor
          </Button>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}