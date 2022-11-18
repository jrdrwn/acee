import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import LoadingOverlay from '../components/utils/LoadingOverlay';
import UserContext from '../contexts/UserContext';

function CheckAuth() {
  const [accessToken, setAccessToken] = reactUseCookie('accessToken');
  const [refreshToken] = reactUseCookie('refreshToken');
  const [user, setUser] = useState({});
  const { get, put, response, loading } = useFetch(
    import.meta.env.VITE_API_URL,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const navigate = useNavigate();

  async function getMe() {
    const res = await get('/users/me');
    if (response.ok) setUser(res.data.user);
    else updateToken();
  }

  async function updateToken() {
    const res = await put('/authentications', { refreshToken });
    if (response.ok) setAccessToken(res.data.accessToken);
    else navigate('/signin');
  }

  useEffect(() => {
    getMe();
  }, [accessToken]);

  return (
    <>
      {loading ? (
        <LoadingOverlay loading={loading} />
      ) : (
        <UserContext.Provider value={user}>
          <Outlet />
        </UserContext.Provider>
      )}
    </>
  );
}

export default CheckAuth;
