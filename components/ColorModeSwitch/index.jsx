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
    >
      <Switch
        isChecked={colorMode === 'dark'}
        colorScheme={colorMode === 'dark' ? 'blue' : 'yellow'}
        onChange={toggleColorMode}
      />
      {colorMode === 'dark' ? <BsFillMoonStarsFill fontSize="24px" color="white" /> : <BsFillSunFill fontSize="24px" color="black" />}
    </Flex>
  )
}

export default ColorModeSwitch;