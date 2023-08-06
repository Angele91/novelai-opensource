import { Flex, Switch, useColorMode, useStyleConfig } from "@chakra-ui/react";
import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs';

const ColorModeSwitch = ({ fixed }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const styles = useStyleConfig('ColorModeSwitch', { variant: fixed ? 'fixed' : undefined });

  return (
    <Flex 
      gap={2}
      sx={styles}
      padding={2}
      borderRadius="md"
      boxShadow="lg"
      align="center"
      data-testid="color-mode-switch-container"
    >
      <Switch
        isChecked={colorMode === 'dark'}
        colorScheme={colorMode === 'dark' ? 'blue' : 'yellow'}
        onChange={toggleColorMode}
        data-testid="color-mode-switch"
      />
      {colorMode === 'dark' ? <BsFillMoonStarsFill fontSize="24px" color="white" data-testid="moon-icon" /> : <BsFillSunFill fontSize="24px" color="black" data-testid="sun-icon" />}
    </Flex>
  )
}

export default ColorModeSwitch;