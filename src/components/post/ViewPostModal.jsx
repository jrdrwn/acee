import { useContext, useState } from 'react';
import { Button, Modal } from 'react-daisyui';
import { BsTrash, BsXLg } from 'react-icons/bs';
import { useSearchParams } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import UserContext from '../../contexts/UserContext';
import ConfirmModal from '../utils/ConfirmModal';
import Loading from '../utils/Loading';
import CommentModal from './CommentModal';

function ViewPostModal({ setPosts, posts }) {
  const user = useContext(UserContext);
  const [visible, setVisible] = useState(false);
  const [URLSearchParams, SetURLSearchParams] = useSearchParams();
  const [accessToken] = reactUseCookie('accessToken');
  const { response, loading, del } = useFetch(import.meta.env.VITE_API_URL, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  async function deletePost(postId) {
    setVisible(false);
    await del(`/posts/${postId}`);
    if (response.ok) {
      setPosts((posts) => posts.filter((post) => post.id !== postId));
    }
    SetURLSearchParams();
  }
  return (
    <>
      <Modal open={!!URLSearchParams.get('postId')} responsive={true}>
        <Loading loading={loading}>
          {posts.filter((post) => post.id === URLSearchParams.get('postId'))[0]
            ?.owner === user.id && (
            <Button
              children={<BsTrash />}
              size="sm"
              className="absolute top-2"
              shape="circle"
              onClick={() => setVisible(true)}
            />
          )}

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
      <ConfirmModal
        open={visible}
        handleVisible={() => setVisible(false)}
        handleAction={() => deletePost(URLSearchParams.get('postId'))}
        data={{
          text: 'Apakah yakin untuk menghapus postingan ini?',
          no: 'tidak',
          ok: 'hapus',
        }}
      />
    </>
  );
}

export default ViewPostModal;
