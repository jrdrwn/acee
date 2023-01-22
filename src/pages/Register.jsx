import {
  Box,
  Button,
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
import { FaEnvelope, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useFetch } from 'use-http';
import { PasswordField } from '../components/utils/PasswordField';

function Register() {
  const navigate = useNavigate();
  const toash = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { post, response, loading } = useFetch(import.meta.env.VITE_API_URL, {
    cachePolicy: 'no-cache',
  });

  const onSubmit = async (data) => {
    const res = await post('/auth/local/register', data);
    response.ok
      ? navigate('/login')
      : toash({
          position: 'top-right',
          title: res ? res.error.name : 'Connection Error',
          status: 'error',
          description: res
            ? res.error.message
            : 'Tidak dapat tersambung ke server',
          duration: 3000,
          isClosable: true,
        });
  };
  return (
    <Container
      maxW="lg"
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
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
                Buat sebuah akun
              </Heading>
              <HStack spacing="1" justify="center">
                <Text color="muted">Sudah punya akun?</Text>
                <Button variant="link" colorScheme="blue">
                  <Link to={'/login'}>Masuk ke akun</Link>
                </Button>
              </HStack>
            </Stack>
          </Stack>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing="6">
              <Stack spacing="5">
                <HStack>
                  <Box>
                    <FormControl isInvalid={errors.firstName} isRequired>
                      <FormLabel htmlFor="firstName">First Name</FormLabel>
                      <InputGroup>
                        <Input
                          id="firstName"
                          type="text"
                          {...register('firstName', {
                            required: 'This is required',
                            minLength: {
                              value: 3,
                              message: 'Minimum length should be 4',
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
                      <FormLabel htmlFor="lastName">Last Name</FormLabel>
                      <InputGroup>
                        <Input
                          id="lastName"
                          type="text"
                          {...register('lastName')}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.lastName && errors.lastName.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Box>
                </HStack>
                <FormControl isInvalid={errors.username} isRequired>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children={<FaUser />} />
                    <Input
                      id="username"
                      type="text"
                      {...register('username', {
                        required: 'This is required',
                        minLength: {
                          value: 3,
                          message: 'Minimum length should be 4',
                        },
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.username && errors.username.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.email} isRequired>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children={<FaEnvelope />} />
                    <Input
                      id="email"
                      type="email"
                      {...register('email', {
                        required: 'This is required',
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.email && errors.email.message}
                  </FormErrorMessage>
                </FormControl>
                <PasswordField register={register} errors={errors} />
              </Stack>
              <Stack spacing="6">
                <Button
                  type="submit"
                  variant="solid"
                  isLoading={loading}
                  colorScheme={'blue'}
                >
                  Buat akun
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Container>
  );
}

export default Register;
