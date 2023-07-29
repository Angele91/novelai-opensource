const { IconButton, Button, Tooltip } = require("@chakra-ui/react")

const CollapsableButton = ({
  label,
  icon,
  isOpen,
  onClick,
}) => {
  const renderContent = () => {
    if (isOpen) {
      return (
        <Button
          leftIcon={icon}
          aria-label={label}
          onClick={onClick}
          variant="outline"
          data-testid="collapsable-button"
        >
          {label}
        </Button>
      )
    }

    if (!icon) {
      const children = !icon ? label.length > 3 ? label.substring(0, 3).toUpperCase() : label.toUpperCase() : label

      return (
        <Button
          aria-label={label}
          onClick={onClick}
          variant="outline"
          data-testid="collapsable-button"
        >
          {children}
        </Button>
      )
    }

    return (
      <IconButton
        aria-label={label}
        icon={icon}
        onClick={onClick}
        variant="outline"
        data-testid="collapsable-button"
      />
    )
  }

  return (
    <Tooltip
      label={isOpen ? undefined : label}
      data-testid="collapsable-button-tooltip"
    >
      {renderContent()}
    </Tooltip>
  )
}

export default CollapsableButton;