import { Badge, Button } from '@chakra-ui/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import useFetch from 'use-http';
import QSS from '../components/utils/qss';
import UserContext from '../contexts/UserContext';

export default function FollowButton({ userId }) {
  const me = useContext(UserContext);
  const [jwt] = reactUseCookie('jwt');
  const loader = useRef(null);
  const navigate = useNavigate();
  const [isFollowed, setFollowed] = useState({});
  const { get, response, loading, post, del } = useFetch(
    import.meta.env.VITE_API_URL,
    {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
      cachePolicy: 'no-cache',
    }
  );

  async function followToggle() {
    if (isFollowed.id) await del(`/relations/${isFollowed.id}?populate=*`);
    else await post('/relations', { data: { to: userId } });
    await check();
  }
  async function check() {
    const res = await get(
      '/relations'.concat(
        QSS({
          filters: {
            to: { id: userId },
            owner: { id: me.id },
          },
        })
      )
    );
    setFollowed(res.data?.[0] || {});
  }
  useEffect(() => {
    check();
  }, []);
  return (
    <Button size={'sm'} onClick={followToggle}>
      {isFollowed.id ? 'Diikuti' : 'Ikuti'}
    </Button>
  );
}

export function FollowTag({ userId }) {
  const me = useContext(UserContext);
  const [jwt] = reactUseCookie('jwt');
  const [isFollowed, setFollowed] = useState({});
  const { get, loading } = useFetch(import.meta.env.VITE_API_URL, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
    cachePolicy: 'no-cache',
  });
  async function check() {
    const res = await get(
      '/relations'.concat(
        QSS({
          filters: {
            to: { id: userId },
            owner: { id: me.id },
          },
        })
      )
    );
    setFollowed(res.data?.[0] || {});
  }
  useEffect(() => {
    check();
  }, []);
  return (
    <Badge hidden={userId === me.id} ml="2" size={'xs'}>
      {isFollowed.id ? 'Diikuti' : 'Ikuti'}
    </Badge>
  );
}
