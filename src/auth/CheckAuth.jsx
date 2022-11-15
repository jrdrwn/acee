import { useEffect, useState } from 'react';
import { Button } from 'react-daisyui';
import { Outlet, useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import Container from '../components/layouts/Container';

function CheckAuth() {
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = reactUseCookie('accessToken');
  const [refreshToken] = reactUseCookie('refreshToken');
  const [profile, setProfile] = reactUseCookie('profile');
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
    if (response.ok) setProfile(JSON.stringify(res.data.user));
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
        <Outlet />
      )}
    </>
  );
}

export default CheckAuth;
