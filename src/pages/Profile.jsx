import { SettingsIcon } from '@chakra-ui/icons';
import {
  AspectRatio,
  Avatar,
  Box,
  Card,
  CardBody,
  Center,
  Container,
  HStack,
  IconButton,
  Image,
  Show,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import ResponsiveNavBar from '../components/layouts/ResponsiveNavbar';
import Posts from '../components/post/Posts';
import UserContext from '../contexts/UserContext';

export default function Profile() {
  let { userId } = useParams();
  const me = useContext(UserContext);
  const [user, setUser] = useState({});
  const [jwt] = reactUseCookie('jwt');
  const { get } = useFetch(import.meta.env.VITE_API_URL, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
    cachePolicy: 'no-cache',
  });
  async function getUserById(userId) {
    const res = await get(`/users/${userId}?populate=*`);
    setUser(res);
  }
  useEffect(() => {
    getUserById(userId);
  }, []);
  return (
    <Container mt={'4'}>
      <ResponsiveNavBar />
      <VStack ml={{ sm: '24', md: '36' }} mb={{ base: '20', sm: 'auto' }}>
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

            <Link to={'/login'} replace={true}>
              <IconButton icon={<FaSignOutAlt />} colorScheme={'red'} />
            </Link>
          </Box>
        </Show>
        <Card maxW="md" w={'full'} bg={'Background'}>
          <Box>
            <AspectRatio ratio={16 / 4} w={'full'}>
              <Image
                src={user.cover?.url}
                fallback={
                  <Skeleton roundedTop={'md'} w={'full'} h={'full'}></Skeleton>
                }
                objectFit="cover"
                roundedTop={'md'}
              />
            </AspectRatio>
            <Center pr={'4'}>
              <Avatar
                src={user.photo?.url}
                name={user.firstName}
                size={'lg'}
                mb={'4'}
                pos={'absolute'}
                outline={'solid 6px Background'}
              />
            </Center>
          </Box>
          <CardBody
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'flex-end'}
            pos={'relative'}
            pt={'unset'}
            mt={'8'}
          >
            <VStack align={'start'} spacing={'unset'}>
              <Text fontSize={'lg'} fontWeight={'semibold'}>
                {user.firstName} {user.lastName}
              </Text>
              <Text fontSize={'md'} fontWeight={'medium'} color={'GrayText'}>
                @{user.username}
              </Text>
            </VStack>
            <HStack>
              <Link to={'/settings'}>
                <IconButton
                  icon={<SettingsIcon />}
                  rounded={'full'}
                  colorScheme={'twitter'}
                />
              </Link>
            </HStack>
          </CardBody>
        </Card>
        <Posts filter={{ userId }} />
      </VStack>
    </Container>
  );
}
