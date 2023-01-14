import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import { PasswordField } from '../components/utils/PasswordField';

function SignIn() {
  const navigate = useNavigate();
  const toash = useToast();
  const [, setRefreshToken] = reactUseCookie('refreshToken');
  const [, setAccessToken] = reactUseCookie('accessToken');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { post, response, loading } = useFetch(import.meta.env.VITE_API_URL, {
    cachePolicy: 'no-cache',
  });

  const onSubmit = async (data) => {
    const res = await post('/authentications', data);
    if (response.ok) {
      setRefreshToken(res.refreshToken);
      setAccessToken(res.accessToken);
      navigate('/');
    } else {
      toash({
        position: 'top-right',
        title: 'Connection Error',
        status: 'error',
        description: res ? res.message : 'Tidak dapat tersambung ke server',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container
      maxW="lg"
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
      <Stack spacing="8">
        <Stack spacing="6">
          <Stack
            spacing={{
              base: '2',
              md: '3',
            }}
            textAlign="center"
          >
            <Heading
              size={useBreakpointValue({
                base: 'xs',
                md: 'sm',
              })}
            >
              Log in to your account
            </Heading>
            <HStack spacing="1" justify="center">
              <Text color="muted">Don't have an account?</Text>
              <Button variant="link" colorScheme="blue">
                <Link to={'/signup'}>Sign up</Link>
              </Button>
            </HStack>
          </Stack>
        </Stack>
        <Box
          py={{
            base: '0',
            sm: '8',
          }}
          px={{
            base: '4',
            sm: '10',
          }}
          bg={useBreakpointValue({
            base: 'transparent',
            sm: 'bg-surface',
          })}
          boxShadow={{
            base: 'none',
            sm: useColorModeValue('md', 'md-dark'),
          }}
          borderRadius={{
            base: 'none',
            sm: 'xl',
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl isInvalid={errors.username} isRequired>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children={<FaUser />} />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Username"
                      {...register('username', {
                        required: 'This is required',
                        minLength: {
                          value: 3,
                          message: 'Minimum length should be 3',
                        },
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.username && errors.username.message}
                  </FormErrorMessage>
                </FormControl>
                <PasswordField register={register} errors={errors} />
              </Stack>
              <HStack justify="space-between">
                <Checkbox defaultChecked>Remember me</Checkbox>
                <Button variant="link" colorScheme="blue" size="sm">
                  Forgot password?
                </Button>
              </HStack>
              <Stack spacing="6">
                <Button
                  type="submit"
                  variant="solid"
                  isLoading={loading}
                  colorScheme={'blue'}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
}
export default SignIn;
