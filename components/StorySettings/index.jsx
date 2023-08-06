import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { PresetsTab } from "./PresetsTab";
import { MemoryTab } from "./MemoryTab";
import PluginsTab from "./PluginsTab";

export const StorySettings = ({ isSidebarOpen }) => {
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
         <PluginsTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}