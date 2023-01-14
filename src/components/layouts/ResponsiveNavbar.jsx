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
  Heading,
  Hide,
  IconButton,
  Show,
  Text,
  VStack,
  Wrap,
  WrapItem,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { FaHome, FaPlus, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import useSignOut from '../../auth/useSignOut';
import UserContext from '../../contexts/UserContext';

export default function ResponsiveNavBar() {
  const user = useContext(UserContext);
  const SignOut = useSignOut();
  const links = [
    {
      name: 'Home',
      to: '/',
      icon: <FaHome size={24} />,
    },
    {
      name: 'Profile',
      to: `/profile/${user.id}`,
      icon: <FaUser size={24} />,
    },
    {
      name: 'Create',
      to: '?action=create',
      icon: <FaPlus size={24} />,
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
              <Avatar size={['sm', 'md', 'lg']} src={user.photo} />
            </Center>
          </CardHeader>
          <CardBody>
            {links.map((link) => (
              <NavLink to={link.to} key={link.to}>
                <Hide below="md">
                  <Button
                    variant={'ghost'}
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
                    variant={'ghost'}
                    icon={link.icon}
                    size={'lg'}
                    rounded={'full'}
                    fontSize={'lg'}
                  >
                    <Text>{link.name}</Text>
                  </IconButton>
                </Hide>
              </NavLink>
            ))}
          </CardBody>
          <CardFooter>
            <Show above="md">
              <Button
                leftIcon={<FaSignOutAlt size={24} />}
                colorScheme={'red'}
                rounded={'full'}
                size={'lg'}
                fontSize={'lg'}
                onClick={SignOut}
              >
                <Text>Sign out</Text>
              </Button>
            </Show>
            <Show below="md">
              <IconButton
                icon={<FaSignOutAlt size={24} />}
                colorScheme={'red'}
                rounded={'full'}
                size={'lg'}
                fontSize={'lg'}
                onClick={SignOut}
              ></IconButton>
            </Show>
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
              <NavLink to={link.to} relative={'path'} key={link.to}>
                <Button
                  variant={'ghost'}
                  leftIcon={link.icon}
                  size={'lg'}
                  borderRadius={'full'}
                  fontSize={'lg'}
                >
                  <Text hidden={useBreakpointValue({ base: true, md: false })}>
                    {link.name}
                  </Text>
                </Button>
              </NavLink>
            ))}
          </HStack>
        </Box>
      </Hide>
    </>
  );
}
