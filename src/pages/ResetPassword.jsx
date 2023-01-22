import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Heading,
  Stack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFetch } from 'use-http';
import { PasswordField } from '../components/utils/PasswordField';
export default function ResetPassword() {
  const [query] = useSearchParams();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const { post, loading, response } = useFetch(import.meta.env.VITE_API_URL, {
    cachePolicy: 'no-cache',
  });
  const toash = useToast();
  const navigate = useNavigate();
  async function onSubmit(values) {
    values.code = query.get('code');
    values.passwordConfirmation = values.password;
    const res = await post('/auth/reset-password', values);
    if (response.ok) {
      toash({
        icon: <CheckCircleIcon />,
        title: 'Berhasil',
        description: 'Kata sandi berhasil diubah',
        isClosable: true,
        status: 'success',
        duration: 3000,
        position: 'top-right',
      });
      navigate('/login');
    } else {
      if (res.error) {
        toash({
          icon: <WarningIcon />,
          title: 'Gagal',
          description: 'Mohon untuk mengirim email kembali!',
          isClosable: true,
          status: 'warning',
          duration: 3000,
          position: 'top-right',
        });
        navigate('/forgot-password');
      } else {
        toash({
          icon: <WarningIcon />,
          title: 'Error',
          description: 'Periksa kembali koneksi anda!',
          isClosable: true,
          status: 'error',
          duration: 3000,
          position: 'top-right',
        });
      }
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            Masukkan kata sandi baru
          </Heading>
          <PasswordField register={register} errors={errors} hideLabel={true} />
          <Stack spacing={6}>
            <Button colorScheme={'twitter'} type="submit" isLoading={loading}>
              Kirim
            </Button>
          </Stack>
        </Stack>
      </Flex>{' '}
    </form>
  );
}
