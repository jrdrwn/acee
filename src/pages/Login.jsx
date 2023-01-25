import {
  Box,
  Button,
  Checkbox,
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

function Login() {
  const navigate = useNavigate();
  const toash = useToast();
  const [, setJwt] = reactUseCookie('jwt');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { post, response, loading } = useFetch(import.meta.env.VITE_API_URL, {
    cachePolicy: 'no-cache',
  });

  const onSubmit = async (data) => {
    const res = await post('/auth/local', data);
    if (response.ok) {
      setJwt(res.jwt);
      navigate('/');
    } else {
      toash({
        position: 'top-right',
        title: res ? res.error.name : 'Connection Error',
        status: 'error',
        description: res
          ? res.error.message
          : 'Tidak dapat tersambung ke server',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
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
            Masuk ke akun anda
          </Heading>
          <HStack spacing="1" justify="center">
            <Text color="muted">Belum punya akun?</Text>
            <Button variant="link" colorScheme="blue">
              <Link to={'/register'}>Daftar disini</Link>
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
              <FormControl isInvalid={errors.identifier} isRequired>
                <FormLabel htmlFor="identifier">Email atau Username</FormLabel>
                <InputGroup>
                  <InputLeftAddon children={<FaUser />} />
                  <Input
                    id="identifier"
                    type="text"
                    {...register('identifier', {
                      required: 'This is required',
                      minLength: {
                        value: 3,
                        message: 'Minimum length should be 3',
                      },
                    })}
                  />
                </InputGroup>
                <FormErrorMessage>
                  {errors.identifier && errors.identifier.message}
                </FormErrorMessage>
              </FormControl>
              <PasswordField register={register} errors={errors} />
            </Stack>
            <HStack justify="space-between">
              <Checkbox defaultChecked>Ingat saya</Checkbox>
              <Link to={'/forgot-password'}>
                <Button variant="link" colorScheme="blue" size="sm">
                  Lupa kata sandi?
                </Button>
              </Link>
            </HStack>
            <Stack spacing="6">
              <Button
                type="submit"
                variant="solid"
                isLoading={loading}
                colorScheme={'blue'}
              >
                Masuk
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Stack>
  );
}
export default Login;
