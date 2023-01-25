import { Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import ResponsiveNavBar from './ResponsiveNavbar';

export default function Layout({ navigation = true, ...props }) {
  return (
    <Container {...props}>
      {navigation && <ResponsiveNavBar />}
      <Outlet />
    </Container>
  );
}
