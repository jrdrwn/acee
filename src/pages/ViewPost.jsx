import { useContext, useEffect, useRef, useState } from 'react';
import { Button, Input, Modal } from 'react-daisyui';
import { BsTrashFill } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import Container from '../components/layouts/Container';
import CardPost from '../components/post/CardPost';
import CommentPost from '../components/post/CommentPost';
import UserContext from '../contexts/UserContext';

function ViewPost() {
  const user = useContext(UserContext);
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [accessToken] = reactUseCookie('accessToken');
  const navigate = useNavigate();
  const commentInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const {
    get,
    post: postMethod,
    response,
    del,
  } = useFetch(import.meta.env.VITE_API_URL, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  const handleComment = async () => {
    const resPost = await postMethod('/comments', {
      text: commentInputRef.current.value,
      postId,
    });
    if (response.ok) {
      const resGet = await get(`/comments/${resPost.data.commentId}`);
      if (response.ok) {
        setComments([resGet.data.comment, ...comments]);
        setPost({
          ...post,
          comment_count: +post.comment_count + 1,
        });
        commentInputRef.current.value = '';
      }
    } else {
      navigate('/');
    }
  };
  const handleDelete = () => {
    deletePost();
  };
  const toggleVisible = () => {
    setVisible(!visible);
  };
  async function getComments() {
    const res = await get(`posts/comment/${postId}`);
    setLoading(false);
    if (response.ok) setComments(res.data.comments);
    else {
      navigate('/');
    }
  }

  async function getPost() {
    const res = await get(`/posts/${postId}`);

    if (response.ok) {
      setPost(res.data.post);
      getComments();
    } else {
      navigate('/');
    }
  }

  async function deletePost() {
    setLoading(true);
    await del(`/posts/${postId}`);
    if (response.ok) {
      navigate('/', { replace: true });
      window.location.reload();
    } else {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPost();
    getComments();
  }, []);

  return (
    <>
      {loading ? (
        <Container>
          <Button loading="true" color="ghost" children={'Loading...'} />
        </Container>
      ) : (
        <Container>
          {user.id === post.owner && (
            <Button
              onClick={toggleVisible}
              startIcon={<BsTrashFill />}
              children={'hapus'}
              size="sm"
            />
          )}
          <CardPost {...post} className="my-2" />

          <div className="flex gap-2">
            <Input
              placeholder="Tambahkan komentar..."
              className="w-full"
              size="sm"
              color="primary"
              required={true}
              ref={commentInputRef}
            />
            <Button children={'Kirim'} size={'sm'} onClick={handleComment} />
          </div>

          <div className="mt-2 w-full space-y-2 rounded-xl bg-base-200 p-2 transition hover:shadow">
            {comments.length ? (
              comments.map((comment) => (
                <CommentPost key={comment.id} {...comment} />
              ))
            ) : (
              <p>Tidak ada komentar di postingan ini.</p>
            )}
          </div>
          <Modal open={visible}>
            <Modal.Body>Apakah yakin untuk menghapus postingan ini?</Modal.Body>
            <Modal.Actions>
              <Button
                size="sm"
                onClick={toggleVisible}
                children="tidak"
              ></Button>
              <Button
                size="sm"
                onClick={handleDelete}
                children="hapus"
                color="error"
              ></Button>
            </Modal.Actions>
          </Modal>
        </Container>
      )}
    </>
  );
}

export default ViewPost;
