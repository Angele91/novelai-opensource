import { extendTheme } from "@chakra-ui/react";
import { ColorModeSwitch } from "@/theme/components/ColorModeSwitch";
import { Button } from "@/theme/components/Button";
import { Card } from "@/theme/components/Card";
import { Input } from "@/theme/components/Input";
import { Textarea } from "@/theme/components/Textarea";
import { Select } from "@/theme/components/Select";
import { Editable } from "@/theme/components/Editable";

export const theme = extendTheme({
  colors: {},
  components: {
    ColorModeSwitch,
    Button,
    Card,
    Input,
    Textarea,
    Select,
    Editable,
  }
});