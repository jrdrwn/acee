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
  Skeleton,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { FaTrash, FaUpload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import ResponsiveModalStyle from '../../sx/ResponsiveModalStyle';

function MediaUpload({ media, setMedia }) {
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
      {media ? (
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
            fallback={<Skeleton w={'full'} rounded={'md'}></Skeleton>}
          />
        </Box>
      ) : (
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
          >
            <Text fontWeight={'semibold'} fontSize={'sm'}>
              Unggah foto atau video
            </Text>
          </Button>
          <input
            id="media-upload"
            type={'file'}
            accept="image/*"
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
      navigate(-1);
    }
  }
  function handleSubmit() {
    addPost({ media, content });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => navigate(-1)}
      onCloseComplete={() => data && window.location.reload()}
      scrollBehavior="inside"
      size={'full'}
    >
      <ModalOverlay />
      <ModalContent {...ResponsiveModalStyle} overflowY={'auto'}>
        <ModalCloseButton />
        <ModalHeader>Buat postingan</ModalHeader>
        <ModalBody>
          <Textarea
            resize={'none'}
            overflow={'hidden'}
            placeholder="Anda sedang memikirkan apa???"
            _placeholder={{
              fontSize: 'lg',
              fontWeight: 'medium',
              color: 'gray',
            }}
            rows={1}
            ref={ref}
            onChange={(ev) => setContent(ev.currentTarget.value)}
          ></Textarea>
          <MediaUpload media={media} setMedia={setMedia} />
        </ModalBody>
        <ModalFooter justifyContent={'space-between'}>
          <Button isLoading={loading} onClick={handleSubmit}>
            Kirim
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
