import { useContext, useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Textarea } from 'react-daisyui';
import { useForm } from 'react-hook-form';
import { FaPlus, FaSignOutAlt, FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import Container from '../components/layouts/Container';
import CardPost from '../components/post/CardPost';
import UserContext from '../contexts/UserContext';

function Home() {
  const user = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [accessToken, setAccessToken] = reactUseCookie('accessToken');
  const [refreshToken, setRefreshToken] = reactUseCookie('refreshToken');
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState({});
  const { get, post, response, patch } = useFetch(
    import.meta.env.VITE_API_URL,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const navigate = useNavigate();
  const onSubmit = (data) => {
    addPost(data);
  };
  const toggleVisible = () => {
    setVisible(!visible);
  };

  const handleSignOut = async () => {
    setLoading({ status: true, data: 'user:signout' });
    await patch(`/authentications`, { refreshToken });
    setAccessToken('');
    setRefreshToken('');
    navigate('/signin');
    setLoading({});
  };

  async function addPost(data) {
    setLoading({ status: true, data: 'posts:add' });
    await post('/posts', data);
    setLoading({});
    if (response.ok) {
      window.location.reload();
    }
  }

  async function getPosts() {
    setLoading({ status: true, data: 'posts:init' });
    const res = await get('/posts');
    setLoading({});
    if (response.ok) {
      setPosts(res.data.posts);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <Container>
      <div className="my-4">
        <div className="flex gap-2">
          <Button startIcon={<FaPlus />} onClick={toggleVisible} />
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
      {loading.status && loading.data === 'posts:init' ? (
        <div>
          <Button loading={true} children={'Load data from database'} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <CardPost key={post.id} {...post} />
          ))}
        </div>
      )}

      <Modal open={visible}>
        <Button
          size="sm"
          shape="circle"
          className="absolute right-2 top-2"
          onClick={toggleVisible}
        >
          ✕
        </Button>
        <Modal.Header className="font-bold">
          Membuat postingan baru!
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2">
                <Input
                  size="sm"
                  className="w-1/2"
                  placeholder="title..."
                  {...register('title')}
                  required
                />
                <Input
                  size="sm"
                  className="w-1/2"
                  placeholder="status..."
                  {...register('status')}
                  required
                />
              </div>
              <Textarea
                className="w-full"
                placeholder="Your caption..."
                {...register('caption')}
                required
              />
              <Button
                type="submit"
                children="Save"
                loading={loading.status && loading.data === 'posts:add'}
              />
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Home;
