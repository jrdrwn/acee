import {
  Box,
  Button,
  IconButton,
  Image,
  Skeleton,
  Text,
  useToast,
} from '@chakra-ui/react';
import { FaTrash, FaUpload } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';

export default function MediaUpload({ hidden, media, setMedia }) {
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
