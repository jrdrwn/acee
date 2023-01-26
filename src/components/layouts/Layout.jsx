import { Box, Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import ResponsiveNavBar from './ResponsiveNavbar';

export default function Layout({
  navigation = true,
  darkModeToggle = true,
  ...props
}) {
  return (
    <Container {...props} px={2}>
      {navigation && <ResponsiveNavBar />}
      {navigation ? (
        <Box mt={2} ml={{ sm: '24', md: '52' }} mb={{ base: '16', sm: 'auto' }}>
          <Outlet />
        </Box>
      ) : (
        <Outlet />
      )}
    </Container>
  );
}
