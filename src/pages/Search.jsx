import {
  Avatar,
  Box,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import useFetch from 'use-http';
import FollowButton from '../components/FollowButton';
import Posts from '../components/post/Posts';
import QSS from '../components/utils/qss';
import UserContext from '../contexts/UserContext';

function SearchBox({ setContent, content }) {
  return (
    <InputGroup size={'lg'} maxW={'md'} w={'full'}>
      <InputLeftElement pointerEvents="none">
        <FaSearch size={18} />
      </InputLeftElement>
      <Input
        placeholder="Cari apapun yang anda inginkan..."
        size={'lg'}
        value={content}
        onChange={(ev) => setContent(ev.target.value)}
      />
    </InputGroup>
  );
}

function Users({ content, setContent }) {
  const me = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [jwt] = reactUseCookie('jwt');
  const loader = useRef(null);
  const navigate = useNavigate();
  const { get, response, loading } = useFetch(import.meta.env.VITE_API_URL, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
    cachePolicy: 'no-cache',
  });

  async function getUsers() {
    const res = await get(
      '/users'.concat(
        QSS({
          populate: '*',
          _q: content,
        })
      )
    );
    response.ok && setUsers(res);
  }

  useEffect(() => {
    getUsers();
  }, [content]);
  return (
    <>
      <VStack align={'start'} spacing={3}>
        {users.map((user) => (
          <Flex
            key={user.id}
            gap="4"
            align="center"
            w={'full'}
            justify={'space-between'}
            hidden={user.id === me.id}
          >
            <Box>
              <HStack>
                <Avatar name={user.firstName} src={user.photo?.url} />
                <Box>
                  <Text fontWeight={'semibold'}>
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text color={'GrayText'} fontWeight={'medium'}>
                    @{user.username}
                  </Text>
                </Box>
              </HStack>
            </Box>
            <FollowButton userId={user.id} />
          </Flex>
        ))}
      </VStack>
    </>
  );
}

export default function Search() {
  const [content, setContent] = useState('');
  return (
    <VStack>
      <SearchBox setContent={setContent} content={content} />
      <Tabs variant="soft-rounded" isFitted maxW={'md'} w={'full'}>
        <TabList>
          <Tab>Pengguna</Tab>
          <Tab>Postingan</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>{content && <Users content={content} />}</TabPanel>
          <TabPanel>{content && <Posts filter={{ content }} />}</TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}
