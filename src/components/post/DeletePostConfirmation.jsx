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
import ResponsiveModalStyle from '../../sx/ResponsiveModalStyle';

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
        <AlertDialogContent {...ResponsiveModalStyle}>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Post
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={() => navigate(-1)}>Cancel</Button>
            <Button
              colorScheme="red"
              onClick={() => deletePost(postId)}
              ml={3}
              isLoading={loading}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
