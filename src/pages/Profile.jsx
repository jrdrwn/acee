import {
  AspectRatio,
  Avatar,
  Box,
  Card,
  CardBody,
  Center,
  Container,
  Heading,
  IconButton,
  Image,
  Show,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import CheckAuth from '../auth/CheckAuth';
import useSignOut from '../auth/useSignOut';
import ResponsiveNavBar from '../components/layouts/ResponsiveNavbar';
import Posts from '../components/post/Posts';

export default function Profile() {
  let { userId } = useParams();
  const [user, setUser] = useState({});
  const SignOut = useSignOut();
  const [accessToken] = reactUseCookie('accessToken');
  const { get, response } = useFetch(import.meta.env.VITE_API_URL, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    cachePolicy: 'no-cache',
  });
  async function getUserById(userId) {
    const res = await get(`/users/${userId}`);
    response.ok ? setUser(res) : console.log('error');
  }
  useEffect(() => {
    getUserById(userId);
  }, []);
  return (
    <CheckAuth>
      <Container mt={'4'}>
        <ResponsiveNavBar />
        <VStack ml={{ sm: '24', md: '36' }} mb={{ base: '16', sm: 'auto' }}>
          <Show below="sm">
            <Box
              maxW={'md'}
              w={'full'}
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Link to={-1}>
                <IconButton icon={<FaArrowLeft />} variant={'ghost'} />
              </Link>
              <IconButton
                icon={<FaSignOutAlt />}
                colorScheme={'red'}
                onClick={SignOut}
              ></IconButton>
            </Box>
          </Show>
          <Card maxW="md" w={'full'} bg={'Background'}>
            <Box>
              <AspectRatio ratio={16 / 6} w={'full'}>
                <Image
                  fallbackSrc={user.photo}
                  objectFit="cover"
                  roundedTop={'md'}
                />
              </AspectRatio>
              <Center>
                <Avatar
                  src={user.photo}
                  size={['xl', '2xl']}
                  mb={4}
                  pos={'absolute'}
                  outline={'solid 4px'}
                  top={'xs'}
                />
              </Center>
            </Box>
            <CardBody
              justifyContent={'center'}
              display={'flex'}
              flexDirection={'column'}
              alignItems={'center'}
              pos={'relative'}
              pt={'unset'}
            >
              <Heading size={'md'} mt={'24'}>
                {user.fullname}
              </Heading>
              <Text fontSize={'md'}>@{user.username}</Text>
            </CardBody>
          </Card>
          <Posts filter={{ userId }} />
        </VStack>
      </Container>
    </CheckAuth>
  );
}
