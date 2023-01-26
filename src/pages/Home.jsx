import { IconButton, useColorMode, VStack } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import Posts from '../components/post/Posts';

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <VStack>
      <IconButton
        alignSelf={'end'}
        onClick={toggleColorMode}
        icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
        pos={'fixed'}
        bottom={'16'}
        zIndex={1}
        variant={'outline'}
      />
      <Posts />
    </VStack>
  );
}
