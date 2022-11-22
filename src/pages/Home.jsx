import { useContext, useEffect, useState } from 'react';
import { Button, Input } from 'react-daisyui';
import { FaPlus, FaSignOutAlt, FaUserAlt } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroller';
import { useNavigate, useSearchParams } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import CheckAuth from '../auth/CheckAuth';
import Container from '../components/layouts/Container';
import CardPost from '../components/post/CardPost';
import CreatePost from '../components/post/CreatePost';
import ViewPostModal from '../components/post/ViewPostModal';
import Loading from '../components/utils/Loading';
import UserContext from '../contexts/UserContext';

function HomeHeader({ setVisibleCreatePost }) {
  const [accessToken, setAccessToken] = reactUseCookie('accessToken');
  const [refreshToken, setRefreshToken] = reactUseCookie('refreshToken');

  const { patch, loading } = useFetch(import.meta.env.VITE_API_URL, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  const navigate = useNavigate();

  const handleSignOut = async () => {
    await patch(`/authentications`, { refreshToken });
    setAccessToken('');
    setRefreshToken('');
    navigate('/signin');
  };

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        <Button
          startIcon={<FaPlus />}
          onClick={() => setVisibleCreatePost(true)}
        />
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
        <Loading loading={loading}>
          <Button
            startIcon={<FaSignOutAlt />}
            color="warning"
            onClick={handleSignOut}
            shape="circle"
          />
        </Loading>
      </div>
    </div>
  );
}

function HomeBody({ visibleCreatePost, setVisibleCreatePost }) {
  const [posts, setPosts] = useState([]);
  const [accessToken] = reactUseCookie('accessToken');
  const [URLSearchParams] = useSearchParams();
  const { get, response, loading, data } = useFetch(
    import.meta.env.VITE_API_URL,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }
  );
  async function getPosts() {
    const res = await get(`/posts?limit=10&offset=${posts.length}`);
    if (response.ok) {
      setPosts([...posts, ...res]);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);
  return (
    <>
      <InfiniteScroll
        loadMore={() => !loading && getPosts()}
        hasMore={!!data?.length}
      >
        <div className="flex flex-col gap-4">
          {posts.map((post, i) => (
            <CardPost key={i} {...post} />
          ))}
          <Loading loading={URLSearchParams.get('postId') ? false : loading} />
        </div>
      </InfiniteScroll>
      <CreatePost
        visible={visibleCreatePost}
        setVisible={setVisibleCreatePost}
      />
      <ViewPostModal setPosts={setPosts} posts={posts} />
    </>
  );
}

function Home() {
  const user = useContext(UserContext);

  const [visibleCreatePost, setVisibleCreatePost] = useState(false);

  return (
    <CheckAuth>
      <Container>
        <HomeHeader setVisibleCreatePost={setVisibleCreatePost} />
        <HomeBody
          setVisibleCreatePost={setVisibleCreatePost}
          visibleCreatePost={visibleCreatePost}
        />
      </Container>
    </CheckAuth>
  );
}

export default Home;
