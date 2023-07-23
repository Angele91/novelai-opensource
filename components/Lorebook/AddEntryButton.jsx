import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";

export const AddEntryButton = ({
  as,
  children,
  onAddChild,
  ...rest
}) => (
  <Menu>
    <MenuButton
      as={as}
      aria-label="Add"
      size="xs"
      data-no-dnd="true"
      w="full"
      {...rest}
    >
      {children}
    </MenuButton>

    <MenuList>
      <MenuItem
        command="⌘C"
        onClick={onAddChild('category')}
      >
        Category
      </MenuItem>
      <MenuItem
        command="⌘I"
        onClick={onAddChild('item')}
      >
        Item
      </MenuItem>
    </MenuList>
  </Menu>
)