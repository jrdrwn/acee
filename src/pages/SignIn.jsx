import { useState } from 'react';
import { Button, Form, Input, InputGroup } from 'react-daisyui';
import { useForm } from 'react-hook-form';
import { FaKey, FaSignInAlt, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import SignInIlustration from '../components/ilustrations/SignInIlustration';
import Container from '../components/layouts/Container';

function SignIn() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState();
  const [, setRefreshToken] = reactUseCookie('refreshToken');
  const [, setAccessToken] = reactUseCookie('accessToken');
  const { register, handleSubmit } = useForm();
  const { post, response, loading } = useFetch(import.meta.env.VITE_API_URL);

  const onSubmit = async (data) => {
    const res = await post('/authentications', data);
    if (response.ok) {
      setRefreshToken(res.data.refreshToken);
      setAccessToken(res.data.accessToken);
      navigate('/');
    } else {
      setNotification({
        text: res ? res.message : 'Tidak dapat tersambung ke server',
      });
    }
  };

  return (
    <Container notification={notification}>
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
            <Button
              children={'Sign In'}
              size="sm"
              startIcon={<FaSignInAlt />}
              type="submit"
            />
            {loading && (
              <Button color="ghost" loading={true} size="sm" shape="circle" />
            )}
          </div>
          <Link to={'/signup'}>
            <Button children="Sign Up" variant="outline" size="sm" />
          </Link>
        </div>
      </Form>
    </Container>
  );
}

export default SignIn;
