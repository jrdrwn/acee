import { Input, InputGroup, InputLeftElement, VStack } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';

function SearchBox() {
  return (
    <InputGroup size={'lg'}>
      <InputLeftElement pointerEvents="none">
        <FaSearch size={18} />
      </InputLeftElement>
      <Input placeholder="Cari apapun yang anda inginkan..." size={'lg'} />
    </InputGroup>
  );
}

export default function Search() {
  return (
    <VStack>
      <SearchBox />
    </VStack>
  );
}
