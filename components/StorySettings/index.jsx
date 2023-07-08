import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { PresetsTab } from "./PresetsTab";

export const StorySettings = ({ isSidebarOpen }) => {
  return (
    <Tabs>
    {isSidebarOpen && (<TabList>
      <Tab>Presets</Tab>
    </TabList>)}
  
    <TabPanels>
      <TabPanel>
        <PresetsTab isSidebarOpen={isSidebarOpen} />
      </TabPanel>
    </TabPanels>
  </Tabs>
  )
}