import {
  Box,
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useContext, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaImage, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import UserContext from '../../contexts/UserContext';
import ResponsiveModalStyle from '../../sx/ResponsiveModalStyle';

export default function CreatePost({ isOpen }) {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');
  const ref = useRef(null);
  const [jwt] = reactUseCookie('jwt');
  const user = useContext(UserContext);
  const { handleSubmit } = useForm();
  const [content, setContent] = useState('');
  const { post, response, loading, data } = useFetch(
    import.meta.env.VITE_API_URL,
    {
      headers: {
        authorization: `Bearer ${jwt}`,
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
    const res = await post('/posts', { data: postData });
    if (response.ok) {
      navigate(-1);
    }
  }
  const onSubmit = (postData) => {
    postData.image = imageUrl;
    postData.content = content;
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
    <Modal
      isOpen={isOpen}
      onClose={() => navigate(-1)}
      onCloseComplete={() => data && window.location.reload()}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent {...ResponsiveModalStyle} overflowY={'auto'}>
        <ModalCloseButton />
        <ModalHeader>Buat postingan</ModalHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Box
              contentEditable
              role={'textbox'}
              border={'1px'}
              borderWidth={'thin'}
              borderRadius={'md'}
              borderColor={'inherit'}
              p={2}
              transitionProperty={'var(--chakra-transition-property-common)'}
              transitionDuration={'var(--chakra-transition-duration-normal)'}
              minH={'20'}
              _focusVisible={{
                outlineColor: 'var(--chakra-colors-brand-500)',
                boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
              }}
              onInput={(ev) => setContent(ev.currentTarget.innerText)}
            ></Box>
            {imageUrl && (
              <Box pos={'relative'} mt={4}>
                <IconButton
                  icon={<FaTrash />}
                  size="sm"
                  rounded={'full'}
                  pos={'absolute'}
                  top={-2}
                  left={-2}
                  onClick={() => {
                    handleDeleteImage();
                  }}
                />
                <Image
                  w={'full'}
                  rounded={'md'}
                  objectFit={'cover'}
                  src={imageUrl}
                  loading="lazy"
                  fallback={<Text>Test</Text>}
                />
              </Box>
            )}
          </ModalBody>
          <ModalFooter justifyContent={'space-between'}>
            <label>
              <IconButton
                icon={<FaImage size={24} />}
                as={Box}
                isLoading={reqUploadImage.loading}
              />
              <input
                type={'file'}
                accept="image/*"
                hidden
                onInput={(e) => uploadImage(e.target.files[0])}
                ref={ref}
              />
            </label>
            <Button isLoading={loading} type="submit">
              Kirim
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
