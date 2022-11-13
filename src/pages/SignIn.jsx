import { useState } from 'react';
import { Alert, Button, Form, Input, InputGroup } from 'react-daisyui';
import { useForm } from 'react-hook-form';
import { FaKey, FaSignInAlt, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import SignInIlustration from '../components/ilustrations/SignInIlustration';
import Container from '../components/layouts/Container';

function SignIn() {
  const navigate = useNavigate();
  const [notif, setNotif] = useState({ status: false, text: '' });
  const [, setRefreshToken] = reactUseCookie('refreshToken');
  const [, setAccessToken] = reactUseCookie('accessToken');
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    fetch(`${import.meta.env.VITE_API_URL}/authentications`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json?.status === 'success') {
          setRefreshToken(json.data.refreshToken);
          setAccessToken(json.data.accessToken);
          navigate('/');
        } else {
          setNotif({ status: 'error', text: json.message });
        }
      });
  };
  return (
    <Container>
      <Form className="mx-auto mt-8 w-min" onSubmit={handleSubmit(onSubmit)}>
        <SignInIlustration />
        <InputGroup className="mb-2 mt-2">
          <span>
            <FaUser />
          </span>
          <Input
            type="text"
            placeholder="Username"
            name="username"
            bordered
            required={true}
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
          <Button
            children="Sign In"
            size="sm"
            startIcon={<FaSignInAlt />}
            type="submit"
          />
          <Link to={'/signup'}>
            <Button children="Sign Up" variant="outline" size="sm" />
          </Link>
        </div>
        {notif.status && (
          <Alert className="mt-4" status={notif.status}>
            {notif.text}
          </Alert>
        )}
      </Form>
    </Container>
  );
}

export default SignIn;
