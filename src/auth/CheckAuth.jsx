import { useEffect, useState } from 'react';
import { Button } from 'react-daisyui';
import { Outlet, useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import Container from '../components/layouts/Container';
import UserContext from '../contexts/UserContext';

function CheckAuth() {
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = reactUseCookie('accessToken');
  const [refreshToken] = reactUseCookie('refreshToken');
  const [user, setUser] = useState({});
  const { get, put, response } = useFetch(import.meta.env.VITE_API_URL, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  const navigate = useNavigate();

  async function getMe() {
    setLoading(true);
    const res = await get('/users/me');
    setLoading(false);
    if (response.ok) setUser(res.data.user);
    else updateToken();
  }

  async function updateToken() {
    setLoading(true);
    const res = await put('/authentications', { refreshToken });
    setLoading(false);
    if (response.ok) setAccessToken(res.data.accessToken);
    else navigate('/signin');
  }

  useEffect(() => {
    getMe();
  }, [accessToken]);

  return (
    <>
      {loading ? (
        <Container>
          <Button loading="true" color="ghost" children={'Checking user...'} />
        </Container>
      ) : (
        <UserContext.Provider value={user}>
          <Outlet />
        </UserContext.Provider>
      )}
    </>
  );
}

export default CheckAuth;
