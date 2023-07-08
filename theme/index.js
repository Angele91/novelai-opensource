import { extendTheme } from "@chakra-ui/react";
import { ColorModeSwitch } from "./components/ColorModeSwitch";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { Input } from "./components/Input";
import { Textarea } from "./components/Textarea";
import { Select } from "./components/Select";

export const theme = extendTheme({
  colors: {},
  components: {
    ColorModeSwitch,
    Button,
    Card,
    Input,
    Textarea,
    Select,
  }
});