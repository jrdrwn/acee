import { Container, VStack } from '@chakra-ui/react';
import ResponsiveNavBar from '../components/layouts/ResponsiveNavbar';
import Posts from '../components/post/Posts';

function HomeBody() {
  return (
    <VStack ml={{ sm: '24', md: '36' }} mb={{ base: '16', sm: 'auto' }}>
      <Posts />
    </VStack>
  );
}

function Home() {
  return (
    <Container>
      <ResponsiveNavBar />
      <HomeBody />
    </Container>
  );
}

export default Home;
