import { Box, Spinner, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';

export default function useSignOut() {
  const navigate = useNavigate();
  const toash = useToast();
  const [accessToken, setAccessToken] = reactUseCookie('accessToken');
  const [refreshToken, setRefreshToken] = reactUseCookie('refreshToken');
  const { patch } = useFetch(import.meta.env.VITE_API_URL, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  const handleSignOut = async () => {
    toash({
      render: () => (
        <Box
          pos={'fixed'}
          inset={0}
          h={'full'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          bg={'Background'}
        >
          <Spinner />
        </Box>
      ),
    });
    await patch(`/authentications`, { refreshToken });
    setAccessToken('');
    setRefreshToken('');
    navigate('/signin');
    toash.closeAll();
  };
  return handleSignOut;
}
