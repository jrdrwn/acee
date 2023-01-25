import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function DeletePostConfirmation({
  isOpen,
  deletePost,
  postId,
  loading,
}) {
  const navigate = useNavigate();
  return (
    <AlertDialog isOpen={isOpen}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Hapus postingan
          </AlertDialogHeader>

          <AlertDialogBody>Serius menghapus postingan ini?</AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={() => navigate(-1)}>Batal</Button>
            <Button
              colorScheme="red"
              onClick={() => deletePost(postId)}
              ml={3}
              isLoading={loading}
            >
              Hapus
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
