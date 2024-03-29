import { EditIcon } from '@chakra-ui/icons';
import {
  AspectRatio,
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  FormControl,
  FormErrorMessage,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Skeleton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FaCog,
  FaEnvelope,
  FaRegNewspaper,
  FaUser,
  FaUserAlt,
} from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import Posts from '../components/post/Posts';
import UserContext from '../contexts/UserContext';

function Cover({ user, setValue }) {
  const [jwt] = reactUseCookie('jwt');
  const toash = useToast({
    position: 'top-right',
    duration: 3000,
    isClosable: true,
  });
  const { post, response, loading } = useFetch(import.meta.env.VITE_API_URL, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
    cachePolicy: 'no-cache',
  });
  async function upload(file) {
    const body = new FormData();
    body.set('files', file);
    const res = await post('/upload', body);
    if (response.ok && res.length) {
      toash({
        title: 'Sukses',
        description: 'Berhasil mengganti cover',
        status: 'success',
      });
      setValue('cover', res[0]);
    } else {
      toash({
        title: 'Gagal',
        description: res ? res.error : 'Gagal mengunggah',
        status: 'error',
      });
    }
  }
  return (
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

      <input
        type={'file'}
        accept="image/*"
        onInput={(e) => upload(e.target.files[0])}
        name={'files'}
        id="upload-cover"
        hidden
      />
      <Button
        isLoading={loading}
        leftIcon={<EditIcon />}
        rounded={'full'}
        size={'xs'}
        pos={'absolute'}
        top={1}
        left={1}
        as={'label'}
        htmlFor="upload-cover"
      >
        Perbarui Sampul
      </Button>
    </Box>
  );
}

function Photo({ user, setValue }) {
  const [jwt] = reactUseCookie('jwt');
  const toash = useToast({
    position: 'top-right',
    duration: 3000,
    isClosable: true,
  });
  const { post, response, loading } = useFetch(import.meta.env.VITE_API_URL, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
    cachePolicy: 'no-cache',
  });
  async function upload(file) {
    const body = new FormData();
    body.set('files', file);
    const res = await post('/upload', body);
    if (response.ok && res.length) {
      toash({
        title: 'Sukses',
        description: 'Berhasil mengganti photo profil',
        status: 'success',
      });
      setValue('photo', res[0]);
    } else {
      toash({
        title: 'Gagal',
        description: res ? res.error : 'Gagal mengunggah',
        status: 'error',
      });
    }
  }
  return (
    <Center pos={'relative'}>
      <Avatar
        src={user.photo?.url}
        name={user.firstName}
        size={'lg'}
        pos={'absolute'}
        outline={'solid 4px Background'}
      />
      <IconButton
        isLoading={loading}
        icon={<EditIcon />}
        rounded={'full'}
        size={'xs'}
        pos={'absolute'}
        htmlFor={'upload-photo'}
        as={'label'}
        colorScheme={'blue'}
        bottom={'-10'}
      />
      <input
        type={'file'}
        accept="image/*"
        onInput={(e) => upload(e.target.files[0])}
        name={'files'}
        id="upload-photo"
        hidden
      />
    </Center>
  );
}

function Settings() {
  const [user, setUser] = useState(useContext(UserContext));
  const [jwt] = reactUseCookie('jwt');
  const toash = useToast({
    position: 'top-right',
    duration: 3000,
    isClosable: true,
  });
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: user,
  });
  const { put, response, loading } = useFetch(import.meta.env.VITE_API_URL, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
    cachePolicy: 'no-cache',
  });

  const onSubmit = async (values) => {
    const res = await put(`/users/${user.id}?populate=*`, values);
    response.ok
      ? toash({
          title: 'Berhasil',
          status: 'success',
          description: 'Profil anda sudah diperbarui',
          onCloseComplete: () => window.location.reload(),
        })
      : toash({
          title: res ? res.error.name : 'Connection Error',
          status: 'error',
          description: res
            ? 'Mungkin username atau email sudah digunakan'
            : 'Tidak dapat tersambung ke server',
        });
  };
  useEffect(() => {
    const subscription = watch((value) => setUser(value));
    return () => subscription.unsubscribe();
  }, [watch]);
  return (
    <VStack>
      <Card maxW="md" w={'full'} variant={'outline'}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Cover user={user} setValue={setValue} />
            <Photo user={user} setValue={setValue} />
          </Box>
          <CardBody>
            <Stack mt={6}>
              <Stack>
                <HStack>
                  <Box>
                    <FormControl isInvalid={errors.firstName}>
                      <InputGroup>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder={user.firstName}
                          {...register('firstName', {
                            minLength: {
                              value: 1,
                              message: 'Minimum length should be 1',
                            },
                          })}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.firstName && errors.firstName.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl isInvalid={errors.lastName}>
                      <InputGroup>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder={user.lastName}
                          {...register('lastName')}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.lastName && errors.lastName.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Box>
                </HStack>
                <FormControl isInvalid={errors.username}>
                  <InputGroup>
                    <InputLeftAddon children={<FaUser />} />
                    <Input
                      id="username"
                      type="text"
                      placeholder={user.username}
                      {...register('username', {
                        minLength: {
                          value: 4,
                          message: 'Minimum length should be 4',
                        },
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.username && errors.username.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.email}>
                  <InputGroup>
                    <InputLeftAddon children={<FaEnvelope />} />
                    <Input
                      id="email"
                      type="email"
                      placeholder={user.email}
                      {...register('email')}
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.email && errors.email.message}
                  </FormErrorMessage>
                </FormControl>
              </Stack>
            </Stack>
          </CardBody>
          <CardFooter gap={2} justify={'space-between'}>
            <Button as={Link} to={'/login'} replace={true} colorScheme={'red'}>
              Keluar
            </Button>
            <Button colorScheme={'twitter'} isLoading={loading} type="submit">
              Simpan
            </Button>
          </CardFooter>
        </form>
      </Card>
    </VStack>
  );
}

function UserDetails({ userId }) {
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
    <>
      <Card maxW="md" w={'full'} variant={'outline'}>
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
          <Center>
            <Avatar
              src={user.photo?.url}
              name={user.firstName}
              size={'lg'}
              pos={'absolute'}
              outline={'solid 4px Background'}
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
          <HStack></HStack>
        </CardBody>
      </Card>
    </>
  );
}

export default function Profile() {
  let { userId } = useParams();
  const user = useContext(UserContext);
  return (
    <VStack>
      <Tabs variant="soft-rounded" isFitted maxW={'md'} w={'full'} isLazy>
        <TabList>
          <Tab>
            <FaUserAlt size={20} />
          </Tab>
          <Tab>
            <FaRegNewspaper size={20} />
          </Tab>
          {user.id == userId && (
            <Tab>
              <FaCog size={20} />
            </Tab>
          )}
        </TabList>

        <TabPanels>
          <TabPanel px={'unset'}>
            <UserDetails userId={userId} />
          </TabPanel>
          <TabPanel px={'unset'}>
            <Posts filter={{ userId }} />
          </TabPanel>
          {user.id == userId && (
            <TabPanel px={'unset'}>
              <Settings />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </VStack>
  );
}
