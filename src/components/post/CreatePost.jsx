import { CheckIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useBoolean,
  useToast,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import MediaUpload from './MediaUpload';
import PostCard from './PostCard';
import useAutosizeTextArea from './useAutoSizeTextArea';

export default function CreatePost({ isOpen }) {
  const navigate = useNavigate();
  const [jwt] = reactUseCookie('jwt');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const ref = useRef(null);
  const toash = useToast({
    position: 'top-right',
    duration: 3000,
    isClosable: true,
  });
  const { post, response, loading, data } = useFetch(
    import.meta.env.VITE_API_URL,
    {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    }
  );

  useAutosizeTextArea(ref.current, content);

  async function addPost(postData) {
    const res = await post('/posts', { data: postData });
    if (response.ok) {
      toash({
        title: 'Sukses',
        description: 'Berhasil membuat postingan',
        status: 'success',
      });
      navigate(-1);
    } else {
      toash({
        title: 'Gagal',
        description: res ? res.error : 'Gagal membuat postingan',
        status: 'error',
      });
    }
  }
  function handleSubmit() {
    addPost({ media, content });
  }
  const [preview, setPreview] = useBoolean();
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => navigate(-1)}
      onCloseComplete={() => data && window.location.reload()}
      scrollBehavior="inside"
      size={'full'}
    >
      <ModalOverlay />
      <ModalContent overflowY={'auto'}>
        <ModalCloseButton />
        <ModalHeader>Buat postingan</ModalHeader>
        <ModalBody>
          <PostCard
            post={{
              content,
              media,
            }}
            previewMode={true}
            hidden={!preview}
          />
          <Textarea
            hidden={preview}
            resize={'none'}
            overflow={'hidden'}
            placeholder={
              [
                'Sudahkan anda bersyukur hari ini???',
                'Apakah anda sedang malas?',
                'Sudahkan anda berdzikir hari ini?',
                'Anda sedang memikirkan apa??',
              ][Math.floor(Math.random() * 4)]
            }
            _placeholder={{
              fontSize: 'lg',
              fontWeight: 'medium',
              color: 'gray',
            }}
            ref={ref}
            onChange={(ev) => setContent(ev.currentTarget.value)}
          ></Textarea>
          <MediaUpload hidden={!preview} media={media} setMedia={setMedia} />
          <Card variant={'outline'} mt={2} hidden={preview}>
            <CardBody>
              <Text fontSize={'xs'} color={'HighlightText'}>
                Untuk membuat jarak antar paragraf bisa dengan menekan tombol
                ENTER sebanyak 2 kali. Dan jangan lupa untuk menekan tombol
                Pratinjau.
              </Text>
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter gap={2} justifyContent={'start'}>
          <Button
            leftIcon={preview ? <ViewOffIcon /> : <ViewIcon />}
            onClick={setPreview.toggle}
          >
            Pratinjau
          </Button>
          <Button
            isLoading={loading}
            onClick={handleSubmit}
            colorScheme={'twitter'}
            leftIcon={<CheckIcon />}
          >
            Kirim
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
