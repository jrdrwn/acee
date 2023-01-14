import { Box, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import UserContext from '../contexts/UserContext';

function CheckAuth({ children }) {
  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = reactUseCookie('accessToken');
  const [refreshToken] = reactUseCookie('refreshToken');
  const navigate = useNavigate();
  const { get, put, response, loading } = useFetch(
    import.meta.env.VITE_API_URL,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      loading: true,
      cachePolicy: 'no-cache',
    }
  );

  async function getMe() {
    const res = await get('/users/me');
    response.ok ? setUser(res) : updateToken();
  }

  async function updateToken() {
    const res = await put('/authentications', { refreshToken });
    response.ok ? setAccessToken(res.accessToken) : navigate('/signin');
  }

  useEffect(() => {
    getMe();
  }, [accessToken]);

  return (
    <>
      {loading ? (
        <Box
          pos={'fixed'}
          inset={0}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Spinner />
        </Box>
      ) : (
        <UserContext.Provider value={user}>{children}</UserContext.Provider>
      )}
    </>
  );
}

export default CheckAuth;
