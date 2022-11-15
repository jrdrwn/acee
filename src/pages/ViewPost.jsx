import { useEffect, useRef, useState } from 'react';
import { Button, Input } from 'react-daisyui';
import { useNavigate, useSearchParams } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import Container from '../components/layouts/Container';
import CardPost from '../components/post/CardPost';
import CommentPost from '../components/post/CommentPost';

function ViewPost() {
  const [searchParams] = useSearchParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [accessToken] = reactUseCookie('accessToken');
  const navigate = useNavigate();
  const commentInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const {
    get,
    post: postMethod,
    response,
  } = useFetch(import.meta.env.VITE_API_URL, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  const handleComment = async () => {
    const resPost = await postMethod('/comments', {
      text: commentInputRef.current.value,
      postId: searchParams.get('postId'),
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

  async function getComments() {
    const res = await get(`posts/comment/${searchParams.get('postId')}`);
    setLoading(false);
    if (response.ok) setComments(res.data.comments);
    else {
      navigate('/');
    }
  }

  async function getPost() {
    const res = await get(`/posts/${searchParams.get('postId')}`);

    if (response.ok) {
      setPost(res.data.post);
      getComments();
    } else {
      navigate('/');
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

          <div className="mt-2 w-full rounded-md bg-base-200 p-2 transition hover:shadow">
            {comments.length ? (
              comments.map((comment) => (
                <CommentPost key={comment.id} {...comment} />
              ))
            ) : (
              <p>Tidak ada komentar di postingan ini.</p>
            )}
          </div>
        </Container>
      )}
    </>
  );
}

export default ViewPost;
