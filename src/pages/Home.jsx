import { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Modal, Textarea } from 'react-daisyui';
import { useForm } from 'react-hook-form';
import {
  FaImage,
  FaPlus,
  FaSignOutAlt,
  FaTrash,
  FaUserAlt,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import Container from '../components/layouts/Container';
import CardPost from '../components/post/CardPost';
import Loading from '../components/utils/Loading';
import UserContext from '../contexts/UserContext';

function Home() {
  const user = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [imageUrl, setImageUrl] = useState('');

  const [visible, setVisible] = useState(false);
  const [accessToken, setAccessToken] = reactUseCookie('accessToken');
  const [refreshToken, setRefreshToken] = reactUseCookie('refreshToken');
  const { register, handleSubmit } = useForm();
  const { get, post, response, patch, loading } = useFetch(
    import.meta.env.VITE_API_URL,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const ref = useRef(null);

  const navigate = useNavigate();
  const onSubmit = (data) => {
    data.imageUrl = imageUrl;
    addPost(data);
  };
  const toggleVisible = () => {
    setVisible(!visible);
  };

  const handleSignOut = async () => {
    await patch(`/authentications`, { refreshToken });
    setAccessToken('');
    setRefreshToken('');
    navigate('/signin');
  };

  async function addPost(data) {
    await post('/posts', data);
    if (response.ok) {
      window.location.reload();
    }
  }

  async function getPosts() {
    const res = await get(`/posts?limit=5&offset=${posts.length}`);
    if (response.ok) {
      res.length && setPosts([...posts, ...res]);
    }
  }
  async function uploadImage(image) {
    const body = new FormData();
    body.set('image', image);
    const res = await fetch(
      'https://api.imgbb.com/1/upload?key=ee9f968f3cc04daecc174efd8c274d77',
      {
        method: 'post',
        body,
      }
    );
    if (res.ok) {
      setImageUrl((await res.json()).data.display_url);
    }
  }

  const handleDeleteImage = () => {
    setImageUrl('');
    ref.current.value = '';
  };
  useEffect(() => {
    getPosts();
  }, [posts]);

  return (
    <Container>
      <div className="mb-4">
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
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <CardPost key={post.id} {...post} />
        ))}
        {loading && <Loading loading={loading} />}
      </div>

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
              {imageUrl && (
                <div className="relative w-full">
                  <Button
                    startIcon={<FaTrash />}
                    shape="circle"
                    size="sm"
                    className="absolute -top-2 -left-2"
                    onClick={() => {
                      handleDeleteImage();
                    }}
                  />
                  <img
                    className="aspect-video w-full rounded-xl object-cover"
                    src={imageUrl}
                    loading="lazy"
                  />
                </div>
              )}
            </div>
            <Modal.Actions className="justify-between">
              <label>
                <div className="btn-circle btn">
                  <FaImage size={24} />
                </div>
                <input
                  type={'file'}
                  accept="image/*"
                  className="hidden"
                  onInput={(e) => uploadImage(e.target.files[0])}
                  ref={ref}
                />
              </label>
              <Button type="submit" children="Save" />
            </Modal.Actions>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Home;
