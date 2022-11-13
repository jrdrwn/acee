import { useEffect, useRef, useState } from 'react';
import { Button, Input } from 'react-daisyui';
import { useNavigate, useParams } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import Container from '../components/layouts/Container';
import CardPost from '../components/post/CardPost';
import CommentPost from '../components/post/CommentPost';

function ViewPost() {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [accessToken] = reactUseCookie('accessToken');
  const navigate = useNavigate();
  const commentInputRef = useRef(null);

  const handleComment = () => {
    fetch(`${import.meta.env.VITE_API_URL}/comments`, {
      method: 'post',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        text: commentInputRef.current.value,
        postId,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 'success') {
          fetch(
            `${import.meta.env.VITE_API_URL}/comments/${json.data.commentId}`,
            {
              method: 'get',
              headers: {
                authorization: `Bearer ${accessToken}`,
              },
            }
          )
            .then((res) => res.json())
            .then((json) => {
              setComments([json.data.comment, ...comments]);
              setPost({ ...post, comment_count: +post.comment_count + 1 });
              commentInputRef.current.value = '';
            });
        } else {
          navigate('/');
        }
      });
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}`, {
      method: 'get',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 'success') {
          setPost(json.data.post);
        } else {
          navigate('/');
        }
      });

    fetch(`${import.meta.env.VITE_API_URL}/posts/comment/${postId}`, {
      method: 'get',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 'success') {
          setComments(json.data.comments);
        } else {
          navigate('/');
        }
      });
  }, []);

  return (
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
  );
}

export default ViewPost;
