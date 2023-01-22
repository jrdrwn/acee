import { Box, Spinner } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import UserContext from '../contexts/UserContext';

function CheckAuth() {
  const [user, setUser] = useState({});
  const [jwt] = reactUseCookie('jwt');
  const navigate = useNavigate();
  const {
    get,
    response,
    loading,
    data = {},
  } = useFetch(import.meta.env.VITE_API_URL, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
    loading: true,
    cachePolicy: 'no-cache',
  });

  const getMe = useCallback(async () => {
    const res = await get('/users/me?populate=*');
    response.ok ? setUser(res) : navigate('/login');
  }, []);

  useEffect(() => {
    getMe();
  }, [getMe]);

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
        <UserContext.Provider value={user}>
          <Outlet />
        </UserContext.Provider>
      )}
    </>
  );
}

export default CheckAuth;
