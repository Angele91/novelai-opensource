import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { PresetsTab } from "./PresetsTab";
import { MemoryTab } from "./MemoryTab";

export const StorySettings = ({ isSidebarOpen }) => {
  return (
    <Tabs>
      {isSidebarOpen && (
        <TabList>
          <Tab>Presets</Tab>
          <Tab>Memory</Tab>
        </TabList>
      )}

      <TabPanels>
        <TabPanel>
          <PresetsTab isSidebarOpen={isSidebarOpen} />
        </TabPanel>
        <TabPanel>
          <MemoryTab isSidebarOpen={isSidebarOpen} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}