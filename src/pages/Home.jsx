import { useContext, useEffect, useState } from 'react';
import { Button, Modal } from 'react-daisyui';
import { BsXLg } from 'react-icons/bs';
import { FaPlus, FaSignOutAlt, FaTrashAlt, FaUserAlt } from 'react-icons/fa';
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
  const user = useContext(UserContext);
  const [visible, setVisible] = useState(false);
  const [accessToken, setAccessToken] = reactUseCookie('accessToken');
  const [refreshToken, setRefreshToken] = reactUseCookie('refreshToken');
  const { patch, del, loading, response } = useFetch(
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

  const handleDeleteAccount = async () => {
    await del('/users');
    if (response.ok) {
      setAccessToken('');
      setRefreshToken('');
      navigate('/signin');
    }
  };

  return (
    <>
      <div className="mb-4">
        <div className="flex gap-2">
          <Button
            startIcon={<FaPlus />}
            onClick={() => setVisibleCreatePost(true)}
          />
          <Button
            startIcon={<FaUserAlt />}
            children={user.username}
            onClick={() => setVisible(true)}
          />
        </div>
      </div>
      <Modal open={visible} responsive={true}>
        <Button
          size="sm"
          shape="circle"
          startIcon={<BsXLg />}
          className="absolute right-2 top-2"
          onClick={() => setVisible(false)}
        />
        <Modal.Header>
          {user.fullname}
          {user.fullname.endsWith('s') ? `'` : `'s`} Settings
        </Modal.Header>
        <Modal.Actions>
          <Loading loading={loading} fullWidth={false}>
            <Button
              startIcon={<FaSignOutAlt />}
              color="warning"
              onClick={handleSignOut}
              children={'Sign Out'}
              size={'sm'}
            />
            <Button
              startIcon={<FaTrashAlt />}
              color="error"
              onClick={handleDeleteAccount}
              children={'Delete Account'}
              size={'sm'}
            />
          </Loading>
        </Modal.Actions>
      </Modal>
    </>
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
      cachePolicy: 'no-cache',
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
