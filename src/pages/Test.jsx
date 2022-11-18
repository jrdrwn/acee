import { useEffect, useState } from 'react';
import reactUseCookie from 'react-use-cookie';
import useFetch from 'use-http';

function Todos() {
  const [todos, setTodos] = useState([]);
  const [accessToken] = reactUseCookie('accessToken');
  const { get, post, response, loading, error } = useFetch(
    import.meta.env.VITE_API_URL,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }
  );

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    const res = await get('/posts');
  };

  return (
    <>
      {loading ? 'loading...' : 'ok'} {error && error.stack}
    </>
  );
}

function Test() {
  return (
    <>
      <Todos />
    </>
  );
}

export default Test;
