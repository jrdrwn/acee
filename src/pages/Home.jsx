import { useContext, useEffect, useState } from 'react';
import { Button, Input } from 'react-daisyui';
import { FaPlus, FaSignOutAlt, FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import Container from '../components/layouts/Container';
import CardPost from '../components/post/CardPost';
import CreatePost from '../components/post/CreatePost';
import Loading from '../components/utils/Loading';
import UserContext from '../contexts/UserContext';

function Home() {
  const user = useContext(UserContext);
  const [posts, setPosts] = useState([]);

  const [visible, setVisible] = useState(false);
  const [accessToken, setAccessToken] = reactUseCookie('accessToken');
  const [refreshToken, setRefreshToken] = reactUseCookie('refreshToken');

  const { get, response, patch, loading } = useFetch(
    import.meta.env.VITE_API_URL,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const navigate = useNavigate();

  const handleSignOut = async () => {
    await patch(`/authentications`, { refreshToken });
    setAccessToken('');
    setRefreshToken('');
    navigate('/signin');
  };

  async function getPosts() {
    const res = await get(`/posts?limit=5&offset=${posts.length}`);
    if (response.ok) {
      res.length && setPosts([...posts, ...res]);
    }
  }

  useEffect(() => {
    getPosts();
  }, [posts]);

  return (
    <Container>
      <div className="mb-4">
        <div className="flex gap-2">
          <Button startIcon={<FaPlus />} onClick={() => setVisible(true)} />
          <Button
            startIcon={<FaUserAlt />}
            onClick={() => confirm('Fitur ini akan tersedia nanti :)')}
            shape="circle"
          />
          <Input
            placeholder="Cari postingan..."
            className="w-full"
            color="primary"
          />
          <Button
            startIcon={<FaSignOutAlt />}
            color="warning"
            onClick={handleSignOut}
            loading={loading.data === 'user:signout' && loading.status}
            shape="circle"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <CardPost key={post.id} {...post} />
        ))}
        {loading && <Loading loading={loading} />}
      </div>
      <CreatePost visible={visible} setVisible={setVisible} />
    </Container>
  );
}

export default Home;
