import { useState } from 'react';
import { Button, Form, Input, InputGroup } from 'react-daisyui';
import { useForm } from 'react-hook-form';
import { FaKey, FaSignInAlt, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import SignInIlustration from '../components/ilustrations/SignInIlustration';
import Container from '../components/layouts/Container';
import Loading from '../components/utils/Loading';

function SignInForm({ setNotification }) {
  const navigate = useNavigate();
  const [, setRefreshToken] = reactUseCookie('refreshToken');
  const [, setAccessToken] = reactUseCookie('accessToken');
  const { register, handleSubmit } = useForm();
  const { post, response, loading } = useFetch(import.meta.env.VITE_API_URL, {
    cachePolicy: 'no-cache',
  });

  const onSubmit = async (data) => {
    const res = await post('/authentications', data);
    if (response.ok) {
      setRefreshToken(res.refreshToken);
      setAccessToken(res.accessToken);
      navigate('/');
    } else {
      setNotification({
        text: res ? res.message : 'Tidak dapat tersambung ke server',
      });
    }
  };

  return (
    <Form className="mx-auto w-min" onSubmit={handleSubmit(onSubmit)}>
      <SignInIlustration />
      <InputGroup className="mb-2 mt-2 ">
        <span>
          <FaUser />
        </span>
        <Input
          type="text"
          placeholder="Username"
          name="username"
          bordered
          required
          {...register('username')}
        />
      </InputGroup>
      <InputGroup className="mb-2">
        <span>
          <FaKey />
        </span>
        <Input
          type="password"
          placeholder="Password"
          name="password"
          bordered
          required={true}
          {...register('password')}
        />
      </InputGroup>
      <div className="mt-4 flex justify-between">
        <div>
          <Loading loading={loading} size={'sm'}>
            <Button
              children={'Sign In'}
              size="sm"
              startIcon={<FaSignInAlt />}
              type="submit"
            />
          </Loading>
        </div>
        <Link to={'/signup'}>
          <Button children="Sign Up" variant="outline" size="sm" />
        </Link>
      </div>
    </Form>
  );
}

function SignIn() {
  const [notification, setNotification] = useState();

  return (
    <Container notification={notification}>
      <SignInForm setNotification={setNotification} />
    </Container>
  );
}

export default SignIn;
