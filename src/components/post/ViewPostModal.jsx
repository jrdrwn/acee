import { Button, Modal } from 'react-daisyui';
import { BsTrash, BsXLg } from 'react-icons/bs';
import { useSearchParams } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import Loading from '../utils/Loading';
import CommentModal from './CommentModal';

function ViewPostModal({ setPosts, posts }) {
  const [URLSearchParams, SetURLSearchParams] = useSearchParams();
  const [accessToken] = reactUseCookie('accessToken');
  const { response, loading, del } = useFetch(import.meta.env.VITE_API_URL, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  async function deletePost(postId) {
    await del(`/posts/${postId}`);
    if (response.ok) {
      setPosts((posts) => posts.filter((post) => post.id !== postId));
    }
    SetURLSearchParams();
  }
  return (
    <Modal open={!!URLSearchParams.get('postId')}>
      <Loading loading={loading}>
        <Button
          children={<BsTrash />}
          size="sm"
          className="absolute top-2"
          shape="circle"
          onClick={() => deletePost(URLSearchParams.get('postId'))}
        />
        <Button
          children={<BsXLg />}
          size="sm"
          className="absolute right-2 top-2"
          shape="circle"
          onClick={() => SetURLSearchParams()}
        />
        <Modal.Header></Modal.Header>
        <Modal.Body>
          {URLSearchParams.get('postId') && (
            <CommentModal
              setPosts={setPosts}
              posts={posts}
              postId={URLSearchParams.get('postId')}
            />
          )}
        </Modal.Body>
      </Loading>
    </Modal>
  );
}

export default ViewPostModal;
