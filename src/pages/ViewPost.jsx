import { useContext, useEffect, useRef, useState } from 'react';
import { Button, Input, Modal } from 'react-daisyui';
import { BsTrashFill } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import Container from '../components/layouts/Container';
import CardPost from '../components/post/CardPost';
import CommentPost from '../components/post/CommentPost';
import Loading from '../components/utils/Loading';
import UserContext from '../contexts/UserContext';

function Comments({ post }) {
  const user = useContext(UserContext);
  const commentInputRef = useRef(null);
  const [comments, setComments] = useState([]);
  const [accessToken] = reactUseCookie('accessToken');
  const navigate = useNavigate();
  const {
    get,
    post: reqPost,
    response,
    loading,
  } = useFetch(`${import.meta.env.VITE_API_URL}/comments`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  const handleComment = async () => {
    await reqPost({
      text: commentInputRef.current.value,
      postId,
    });
  };

  async function getComments(limit = 5, offset = comments.length) {
    const res = await get(`/post/${postId}?limit=${limit}&offset=${offset}`);
    if (response.ok) {
      res.length && setComments([...comments, ...res]);
      res.length && limit < 2 && setComments([...res, ...comments]);
    } else {
      navigate('/');
    }
  }

  useEffect(() => {
    getComments();
  }, [comments]);

  // useEffect(() => {
  //   // comments.length >   && getComments(1, 0);
  // }, [post]);

  return (
    <>
      <div className="mt-2 flex gap-2">
        <Input
          placeholder="Tambahkan komentar..."
          className="w-full"
          size="sm"
          color="primary"
          required={true}
          ref={commentInputRef}
        />
        <Loading
          loading={+post.comment_count === comments.length && loading}
          fullWidth={false}
          size="sm"
        >
          <Button children={'Kirim'} size={'sm'} onClick={handleComment} />
        </Loading>
      </div>

      <div className="mt-2 w-full space-y-2 rounded-xl bg-base-200 p-2 transition hover:shadow">
        {comments.length
          ? comments.map((comment) => (
              <CommentPost key={comment.id} {...comment} />
            ))
          : !loading && <p>Tidak ada komentar di postingan ini.</p>}
        <Loading loading={loading} size="sm" />
      </div>
    </>
  );
}

function ViewPost() {
  const user = useContext(UserContext);
  const { postId } = useParams();
  const [post, setPost] = useState('');
  const [visible, setVisible] = useState(false);
  const [accessToken] = reactUseCookie('accessToken');
  const navigate = useNavigate();

  const { get, del, response, loading } = useFetch(
    `${import.meta.env.VITE_API_URL}/posts`,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }
  );

  async function getPost(postId) {
    const res = await get(`/${postId}`);

    if (response.ok) {
      console.log(res.data.post);
      setPost(res.data.post);
    } else {
      navigate('/');
    }
  }

  async function deletePost() {
    await del(`/${postId}`);
    if (response.ok) {
      navigate('..');
    }
  }

  useEffect(() => {
    getPost(postId);
  }, []);

  return (
    <Container>
      <Loading loading={loading}>
        {user.id === post.owner && (
          <Button
            onClick={() => setVisible(true)}
            startIcon={<BsTrashFill />}
            children={'hapus'}
            size="sm"
          />
        )}
        <CardPost {...post} className="mt-2" />
      </Loading>
      {post && <Comments post={post} getPost={getPost} />}
      <Modal open={visible}>
        <Modal.Body>Apakah yakin untuk menghapus postingan ini?</Modal.Body>
        <Modal.Actions>
          <Button
            size="sm"
            onClick={() => setVisible(false)}
            children="tidak"
          ></Button>
          <Button
            size="sm"
            onClick={() => deletePost()}
            children="hapus"
            color="error"
          ></Button>
        </Modal.Actions>
      </Modal>
    </Container>
  );
}

export default ViewPost;
