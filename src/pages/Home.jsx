import { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Textarea } from 'react-daisyui';
import { useForm } from 'react-hook-form';
import { FaPlus, FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import Container from '../components/layouts/Container';
import CardPost from '../components/post/CardPost';

function Home() {
  const [posts, setPosts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [accessToken, setAccessToken] = reactUseCookie('accessToken');
  const [refreshToken] = reactUseCookie('refreshToken');
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    fetch(`${import.meta.env.VITE_API_URL}/posts`, {
      method: 'post',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 'success') {
          window.location.reload();
        } else {
          fetch(`${import.meta.env.VITE_API_URL}/authentications`, {
            method: 'put',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          })
            .then((res) => res.json())
            .then((json) => {
              if (json.status === 'success') {
                setAccessToken(json.data.accessToken);
                setVisible(false);
                window.location.reload();
              } else {
                navigate('/signin');
              }
            });
        }
      });
  };
  const toggleVisible = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/posts`, {
      method: 'get',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 'success') {
          setPosts(json.data.posts);
        } else {
          fetch(`${import.meta.env.VITE_API_URL}/authentications`, {
            method: 'put',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          })
            .then((res) => res.json())
            .then((json) => {
              if (json.status === 'success') {
                setAccessToken(json.data.accessToken);
              } else {
                navigate('/signin');
              }
            });
        }
      });
  }, [accessToken]);

  return (
    <Container>
      <div className="my-4">
        <div className="flex gap-2">
          <Input
            placeholder="Cari postingan..."
            className="w-full"
            color="primary"
          />
          <Button
            children="Buat"
            startIcon={<FaPlus />}
            onClick={toggleVisible}
          />
          <Button
            startIcon={<FaUserAlt />}
            onClick={() => confirm('Fitur ini akan tersedia nanti :)')}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <CardPost key={post.id} {...post} />
        ))}
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
              <Button type="submit" children="Save" />
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Home;
