import { VStack } from '@chakra-ui/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import UserContext from '../../contexts/UserContext';
import QSS from '../utils/qss';
import CreatePost from './CreatePost';
import DeletePostConfirmation from './DeletePostConfirmation';
import PostCard from './PostCard';
import PostCardSkeleton from './PostCardSkeleton';
import ViewComments from './ViewComments';

export default function Posts({ filter }) {
  const user = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [jwt] = reactUseCookie('jwt');
  const [query] = useSearchParams();
  const loader = useRef(null);
  const navigate = useNavigate();
  const { get, del, response, loading, data } = useFetch(
    import.meta.env.VITE_API_URL.concat('/posts'),
    {
      headers: {
        authorization: `Bearer ${jwt}`,
      },

      cachePolicy: 'no-cache',
      data: { meta: { pagination: { total: 0 } } },
    }
  );
  async function deletePost(postId) {
    await del(`/${postId}`.concat(QSS({ populate: 'owner.*' })));

    if (response.ok) {
      setPosts((posts) => posts.filter((post) => post.id != postId));
      navigate(-1);
    }
  }

  async function getPosts() {
    const res = await get(
      QSS({
        populate: 'owner,comments,owner.photo,media',
        pagination: {
          start: posts.length,
          limit: 3,
        },
        filters: { owner: { id: filter?.userId } },
        sort: 'createdAt:desc',
      })
    );
    response.ok && setPosts([...posts, ...res.data]);
  }

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];

      if (target.isIntersecting) {
        !loading && getPosts();
      }
    }, options);

    if (loader && loader.current) {
      observer.observe(loader.current);
    }
    return () => observer.disconnect();
  }, [loader, getPosts]);

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <VStack spacing={4} my={4} maxW={'full'} w={'full'}>
        {posts.map((post, i) => (
          <PostCard post={post} key={i} />
        ))}
        <PostCardSkeleton
          loader={loader}
          posts={posts}
          loading={loading}
          data={data}
        />
      </VStack>

      <ViewComments
        isOpen={query.get('action') === 'comment'}
        postId={query.get('postId')}
        posts={posts}
        setPosts={setPosts}
      />

      <CreatePost isOpen={query.get('action') === 'create'} />

      <DeletePostConfirmation
        isOpen={query.get('action') === 'delete' && query.get('postId')}
        postId={query.get('postId')}
        deletePost={deletePost}
        loading={loading}
      />
    </>
  );
}
