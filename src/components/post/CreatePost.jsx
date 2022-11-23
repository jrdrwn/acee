import { useRef, useState } from 'react';
import { Button, Collapse, Form, Input, Modal, Textarea } from 'react-daisyui';
import { useForm } from 'react-hook-form';
import { FaImage, FaTrash } from 'react-icons/fa';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import Loading from '../utils/Loading';

function CreatePost({ visible, setVisible }) {
  const [imageUrl, setImageUrl] = useState('');
  const ref = useRef(null);
  const [accessToken] = reactUseCookie('accessToken');
  const { register, handleSubmit } = useForm();
  const { post, response, loading, data } = useFetch(
    import.meta.env.VITE_API_URL,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const reqUploadImage = useFetch(
    'https://api.imgbb.com/1/upload?key=ee9f968f3cc04daecc174efd8c274d77',
    {
      cachePolicy: 'no-cache',
    }
  );

  async function addPost(postData) {
    console.log(postData);
    const res = await post('/posts', postData);
    if (response.ok) {
      window.location.reload();
    }
  }
  const onSubmit = (postData) => {
    postData.imageUrl = imageUrl;
    addPost(postData);
  };
  async function uploadImage(image) {
    const body = new FormData();
    body.set('image', image);
    const res = await reqUploadImage.post(body);
    if (reqUploadImage.response.ok) {
      setImageUrl(res.data.display_url);
    }
  }

  const handleDeleteImage = () => {
    setImageUrl('');
    ref.current.value = '';
  };
  return (
    <Modal open={visible} responsive={true}>
      <Button
        size="sm"
        shape="circle"
        className="absolute right-2 top-2"
        onClick={() => setVisible(false)}
      >
        ✕
      </Button>
      <Modal.Header className="font-bold">Membuat postingan baru!</Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap gap-2">
            <Collapse checkbox={true} icon={'arrow'}>
              <Collapse.Title className="ml-0">
                <Button size="xs" children={'click me to add title/status'} />
              </Collapse.Title>
              <Collapse.Content className="p-1">
                <div className="mt-1 flex gap-2">
                  <Input
                    size="sm"
                    className="w-1/2"
                    placeholder="title..."
                    {...register('title')}
                  />
                  <Input
                    size="sm"
                    className="w-1/2"
                    placeholder="status..."
                    {...register('status')}
                  />
                </div>
              </Collapse.Content>
            </Collapse>
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
                  className="aspect-video w-full rounded-xl bg-secondary object-cover"
                  src={imageUrl}
                  loading="lazy"
                />
              </div>
            )}
          </div>
          <Modal.Actions className="justify-between">
            <Loading loading={reqUploadImage.loading} fullWidth={false}>
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
            </Loading>

            <Loading loading={loading} fullWidth={false}>
              <Button type="submit" children="Save" />
            </Loading>
          </Modal.Actions>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreatePost;
