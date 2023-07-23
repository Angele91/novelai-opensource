import { Flex, IconButton, useBreakpoint, useDisclosure } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

export default function Sidebar({
  side = 'left',
  children,
}) {
  const breakpoint = useBreakpoint();

  const {
    isOpen: isSidebarOpen,
    getButtonProps,
    onOpen,
    onClose,
  } = useDisclosure({
    defaultIsOpen: true
  });

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    const onTouchStart = (event) => {
      touchStartX = event.touches[0].clientX;
    };

    const onTouchEnd = (event) => {
      touchEndX = event.changedTouches[0].clientX;
      const otherSide = side === 'left' ? 'right' : 'left';
      const otherSidebar = document.getElementById(`sidebar-${otherSide}`);
      const otherSidebarWidth = otherSidebar.getBoundingClientRect().width;

      if (side === 'left' && touchStartX - touchEndX > 150) {
        onClose();
      } else if (side === 'right' && touchEndX - touchStartX > 150) {
        onClose();
      } else if (
        side === 'left' 
        && touchEndX - touchStartX > 150
        && otherSidebarWidth === 0
      ) {
        onOpen();
      } else if (
        side === 'right' 
        && touchStartX - touchEndX > 150
        && otherSidebarWidth === 0
      ) {
        onOpen();
      }

    }

    window.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchend', onTouchEnd)
    
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [onClose, onOpen, side]);

  const showPadding = isSidebarOpen || breakpoint !== 'base'

  return (
    <Flex
      as={motion.div}
      height={{
        base: '100vh',
        md: 'auto'
      }}
      position={{
        base: 'fixed',
        md: 'relative'
      }}
      zIndex={{
        base: 1000,
        md: 0
      }}
      top={{
        base: 0,
        md: 'auto'
      }}
      left={{
        base: side === 'left' ? 0 : 'auto',
        md: 'auto'
      }}
      right={{
        base: side === 'left' ? 'auto' : 0,
        md: 'auto'
      }}
      background="chakra-body-bg"
      animate={{ width: isSidebarOpen ? '300px' : breakpoint === 'base' ? 0 : '60px' }}
      overflow="hidden"
      transition="0.5 linear"
      boxShadow="dark-lg"
      flexDir="column"
      pt={showPadding ? 2 : 0}
      pb={showPadding ? 2 : 0}
      px={showPadding ? 2 : 0}
      alignItems={isSidebarOpen ? undefined : 'center'}
      gap={2}
      id={`sidebar-${side}`}
    >
      <Flex
        justify={side === 'left' ? "flex-end" : 'flex-start'}
      >
        <IconButton
          icon={
            isSidebarOpen ? (
              side === 'left' ? <BsChevronLeft /> : <BsChevronRight />
            ) : (
              side === 'left' ? <BsChevronRight /> : <BsChevronLeft />
            )}
          {...getButtonProps()}
        />
      </Flex>
      {typeof children === 'function' ? children({ isSidebarOpen }) : children}
    </Flex>
  )
}