import { IconButton, Tooltip } from "@chakra-ui/react";
import { forwardRef } from "react";

export const IconButtonWithTooltip = forwardRef(({ icon, tooltip, onClick, ...rest }, ref) => (
  <Tooltip label={tooltip}>
    <IconButton
      ref={ref}
      icon={icon}
      aria-label={tooltip}
      onClick={onClick}
      {...rest}
    />
  </Tooltip>
))

IconButtonWithTooltip.displayName = 'IconButtonWithTooltip'