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
  Hide,
  IconButton,
  Show,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { FaHome, FaPlus, FaSignOutAlt, FaUser } from 'react-icons/fa';
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
          bg={'Background'}
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
            <VStack align={'start'}>
              {links.map((link, i) => (
                <Box key={i}>
                  <Hide below="md">
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
                    >
                      <Text>{link.name}</Text>
                    </Button>
                  </Hide>
                  <Hide above="md">
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
                  </Hide>
                </Box>
              ))}
            </VStack>
          </CardBody>
          <CardFooter>
            <NavLink to={'/login'} replace={true}>
              <Show above="md">
                <Button
                  leftIcon={<FaSignOutAlt size={24} />}
                  colorScheme={'red'}
                  rounded={'full'}
                  size={'lg'}
                  fontSize={'lg'}
                >
                  <Text>Keluar</Text>
                </Button>
              </Show>
              <Show below="md">
                <IconButton
                  icon={<FaSignOutAlt size={24} />}
                  colorScheme={'red'}
                  rounded={'full'}
                  size={'lg'}
                  fontSize={'lg'}
                />
              </Show>
            </NavLink>
          </CardFooter>
        </Card>
      </Show>
      <Hide above="sm">
        <Box
          position={'fixed'}
          insetX={0}
          bottom={0}
          bg={'bg-surface'}
          p={2}
          zIndex={999}
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
        </Box>
      </Hide>
    </>
  );
}
