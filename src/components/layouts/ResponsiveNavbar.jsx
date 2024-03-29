import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  HStack,
  IconButton,
  Show,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { FaHome, FaPlus, FaSearch, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';

export default function ResponsiveNavBar() {
  const user = useContext(UserContext);
  const links = [
    {
      name: 'Beranda',
      to: '/',
      icon: <FaHome size={20} />,
      replace: true,
    },
    {
      name: 'Cari',
      to: '/search',
      icon: <FaSearch size={20} />,
    },
    {
      name: 'Profil',
      to: `/profile/${user.id}`,
      icon: <FaUser size={20} />,
      replace: true,
    },
    {
      name: 'Buat',
      to: '?action=create',
      icon: <FaPlus size={20} />,
      variant: 'solid',
    },
  ];
  return (
    <>
      <Show above={'sm'}>
        <Card
          position="fixed"
          left={0}
          w="min-content"
          top={0}
          variant={'outline'}
          overflowY={'auto'}
          m={2}
          sx={{
            h: 'calc(100% - var(--chakra-space-4))',
          }}
        >
          <CardHeader>
            <Center>
              <Avatar
                size={['sm', 'md', 'lg']}
                src={user.photo?.url}
                name={user.firstName}
              />
            </Center>
          </CardHeader>
          <CardBody>
            <VStack align={'stretch'} spacing={1}>
              {links.map((link, i) => (
                <Box key={i}>
                  <Show above="md">
                    <Button
                      as={NavLink}
                      to={link.to}
                      replace={link.replace}
                      variant={link.variant ? link.variant : 'ghost'}
                      colorScheme={'twitter'}
                      leftIcon={link.icon}
                      size={'lg'}
                      rounded={'full'}
                      fontSize={'lg'}
                      w="full"
                      mt={link.variant && 4}
                      justifyContent={link.variant ? 'center' : 'start'}
                    >
                      <Text>{link.name}</Text>
                    </Button>
                  </Show>
                  <Show below="md">
                    <IconButton
                      as={NavLink}
                      to={link.to}
                      replace={link.replace}
                      variant={link.variant ? link.variant : 'ghost'}
                      colorScheme={'twitter'}
                      icon={link.icon}
                      size={'lg'}
                      rounded={'full'}
                      fontSize={'lg'}
                    >
                      <Text>{link.name}</Text>
                    </IconButton>
                  </Show>
                </Box>
              ))}
            </VStack>
          </CardBody>
          <CardFooter>
            <Box w={'full'} as={NavLink} to={'/login'} replace={true}>
              <Show above="md">
                <Button
                  leftIcon={<FaSignOutAlt size={20} />}
                  colorScheme={'red'}
                  rounded={'full'}
                  size={'lg'}
                  fontSize={'lg'}
                  w={'full'}
                >
                  <Text>Keluar</Text>
                </Button>
              </Show>
              <Show below="md">
                <IconButton
                  icon={<FaSignOutAlt size={20} />}
                  colorScheme={'red'}
                  rounded={'full'}
                  size={'lg'}
                  fontSize={'lg'}
                />
              </Show>
            </Box>
          </CardFooter>
        </Card>
      </Show>
      <Show below="sm">
        <Card
          position={'fixed'}
          insetX={0}
          bottom={0}
          variant={'outline'}
          roundedBottom={'unset'}
          p={2}
          zIndex={'overlay'}
        >
          <HStack justify={'space-around'}>
            {links.map((link) => (
              <IconButton
                as={NavLink}
                to={link.to}
                replace={link.replace}
                key={link.to}
                variant={link.variant ? link.variant : 'ghost'}
                colorScheme={'twitter'}
                icon={link.icon}
                rounded={'full'}
              />
            ))}
          </HStack>
        </Card>
      </Show>
    </>
  );
}
