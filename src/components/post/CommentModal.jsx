import { useContext, useEffect, useRef, useState } from 'react';
import { Button, Input } from 'react-daisyui';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import UserContext from '../../contexts/UserContext';
import Loading from '../utils/Loading';
import CommentPost from './CommentPost';

function CommentModal({ postId, setPosts, posts }) {
  const user = useContext(UserContext);
  const commentInputRef = useRef(null);
  const [comments, setComments] = useState([]);
  const [accessToken] = reactUseCookie('accessToken');
  const navigate = useNavigate();
  const { get, post, response, loading, data } = useFetch(
    `${import.meta.env.VITE_API_URL}`,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      cachePolicy: 'no-cache',
    }
  );

  const handleComment = async () => {
    setComments([]);
    await post('/comments', {
      text: commentInputRef.current.value,
      postId,
    });
    await getComments(10, 0);
    await updatePostData();
  };

  async function getComments(limit = 10, offset = comments.length) {
    const res = await get(
      `/comments/post/${postId}?limit=${limit}&offset=${offset}`
    );
    if (response.ok) {
      res.length && setComments((comments) => [...comments, ...res]);
    } else {
      navigate('..');
    }
  }

  async function updatePostData() {
    const res = await get(`/posts/${postId}`);
    if (response.ok) {
      setPosts(posts.map((post) => (post.id === postId ? res : post)));
    }
  }

  useEffect(() => {
    getComments();
  }, []);

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
        <Button children={'Kirim'} size={'sm'} onClick={handleComment} />
      </div>

      <div className="mt-2 w-full space-y-2 rounded-xl bg-base-200 p-2 transition hover:shadow">
        {comments.length
          ? comments.map((comment) => (
              <CommentPost key={comment.id} {...comment} />
            ))
          : !loading && <p>Tidak ada komentar di postingan ini.</p>}
        <Loading loading={loading} size="sm">
          {data?.length ? (
            <div className="flex justify-center">
              <Button
                children={<FaPlus />}
                onClick={() => getComments()}
                size="sm"
                shape="circle"
              />
            </div>
          ) : (
            <></>
          )}
        </Loading>
      </div>
    </>
  );
}

export default CommentModal;
