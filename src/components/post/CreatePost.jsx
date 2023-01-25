import { CheckIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Card,
  CardBody,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  Textarea,
  useBoolean,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { FaTrash, FaUpload } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import PostCard from './PostCard';

function MediaUpload({ hidden, media, setMedia }) {
  const [jwt] = reactUseCookie('jwt');
  const toash = useToast({
    position: 'top-right',
    duration: 3000,
    isClosable: true,
  });
  const { post, response, loading } = useFetch(import.meta.env.VITE_API_URL, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
    cachePolicy: 'no-cache',
  });
  async function upload(file) {
    const body = new FormData();
    body.set('files', file);
    const res = await post('/upload', body);
    if (response.ok && res.length) {
      toash({
        title: 'Sukses',
        description: 'Berhasil mengunggah media',
        status: 'success',
      });
      setMedia(res[0]);
    } else {
      toash({
        title: 'Gagal',
        description: res ? res.error : 'Gagal mengunggah',
        status: 'error',
      });
    }
  }

  function handleDeleteMedia() {
    setMedia(null);
  }
  return (
    <>
      {media?.provider_metadata?.resource_type === 'video' && hidden && (
        <Box overflow={'hidden'} pos={'relative'} rounded={'md'} mt={4}>
          <IconButton
            icon={<FaTrash />}
            size="sm"
            rounded={'md'}
            pos={'absolute'}
            top={1}
            left={1}
            onClick={handleDeleteMedia}
            zIndex={2}
          />

          <ReactPlayer
            width="100%"
            height="100%"
            controls={true}
            fallback={<Skeleton w={'full'} rounded={'md'} />}
            url={media.url}
          />
        </Box>
      )}
      {media?.provider_metadata?.resource_type === 'image' && hidden && (
        <Box pos={'relative'} mt={4}>
          <IconButton
            icon={<FaTrash />}
            size="sm"
            rounded={'full'}
            pos={'absolute'}
            top={-2}
            left={-2}
            onClick={handleDeleteMedia}
          />
          <Image
            w={'full'}
            rounded={'md'}
            objectFit={'cover'}
            src={media.url}
            mt={2}
            fallback={<Skeleton w={'full'} rounded={'md'} />}
          />
        </Box>
      )}
      {!media && hidden && (
        <>
          <Button
            leftIcon={<FaUpload />}
            px={2}
            py={6}
            mt={2}
            gap={2}
            display={'flex'}
            h={'max-content'}
            textAlign={'center'}
            as={'label'}
            htmlFor="media-upload"
            variant={'outline'}
            cursor={'pointer'}
            flexDirection={'column'}
            w={'full'}
            isLoading={loading}
            loadingText="Tunggu sebentar..."
          >
            <Text fontWeight={'semibold'} fontSize={'sm'}>
              Unggah foto atau video
            </Text>
          </Button>
          <input
            id="media-upload"
            type={'file'}
            accept="image/*,video/*"
            hidden
            onInput={(e) => upload(e.target.files[0])}
          />
        </>
      )}
    </>
  );
}

const useAutosizeTextArea = (textAreaRef, value) => {
  useEffect(() => {
    if (textAreaRef) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.style.height = '0px';
      const scrollHeight = textAreaRef.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.style.height = scrollHeight + 'px';
    }
  }, [textAreaRef, value]);
};

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
          <Card variant={'filled'} mt={2} hidden={preview}>
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
