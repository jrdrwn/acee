import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useFetch } from 'use-http';

export default function ForgotPassword() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const { post, loading, response } = useFetch(import.meta.env.VITE_API_URL, {
    cachePolicy: 'no-cache',
  });
  const toash = useToast();

  async function onSubmit(values) {
    await post('/auth/forgot-password', values);
    response.ok
      ? toash({
          icon: <CheckCircleIcon />,
          title: 'Berhasil',
          description: 'Mohon untuk mengecek email anda',
          isClosable: true,
          status: 'success',
          duration: 3000,
          position: 'top-right',
        })
      : toash({
          icon: <WarningIcon />,
          title: 'Error',
          description: 'Periksa kembali koneksi anda!',
          isClosable: true,
          status: 'error',
          duration: 3000,
          position: 'top-right',
        });
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex minH={'100vh'} align={'center'} justify={'center'}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          rounded={'md'}
          boxShadow={'md'}
          bg={'Background'}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            Anda lupa kata sandi?
          </Heading>
          <Text fontSize={{ base: 'sm', sm: 'md' }}>
            Masukkan email anda untuk mendapakan url setel ulang kata sandi
          </Text>
          <FormControl id="email" isInvalid={errors.email}>
            <Input
              placeholder="email-anda@contoh.com"
              type="email"
              {...register('email', { required: 'Email tidak boleh kosong!' })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <Stack spacing={6}>
            <Button colorScheme={'twitter'} type="submit" isLoading={loading}>
              Kirim
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
