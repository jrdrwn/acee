import { useState } from 'react';
import { Button, Form, Input, InputGroup } from 'react-daisyui';
import { useForm } from 'react-hook-form';
import { FaKey, FaPlus, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useFetch } from 'use-http';
import SignUpIlustration from '../components/ilustrations/SignUpIlustration';
import Container from '../components/layouts/Container';
import Loading from '../components/utils/Loading';

function SignUpForm({ setNotification }) {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { post, response, loading } = useFetch(import.meta.env.VITE_API_URL, {
    cachePolicy: 'no-cache',
  });

  const onSubmit = async (data) => {
    const res = await post('/users', data);
    response.ok
      ? navigate('/signin')
      : setNotification({
          text: res ? res.message : 'Tidak dapat tersambung ke server',
        });
  };

  return (
    <Form className="mx-auto w-min" onSubmit={handleSubmit(onSubmit)}>
      <SignUpIlustration />
      <InputGroup className="mb-2 mt-2">
        <span>
          <FaUser />
        </span>
        <Input
          type="text"
          placeholder="Name"
          bordered
          required
          {...register('fullname')}
        />
      </InputGroup>
      <InputGroup className="mb-2">
        <span>
          <FaUser />
        </span>
        <Input
          type="text"
          placeholder="Username"
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
          bordered
          required
          {...register('password')}
        />
      </InputGroup>
      <div className="mt-4 flex justify-between">
        <div>
          <Loading loading={loading} size={'sm'}>
            <Button
              children="Create Account"
              size="sm"
              startIcon={<FaPlus />}
              type="submit"
            />
          </Loading>
        </div>
        <Link to={'/signin'}>
          <Button children="Sign In" variant="outline" size="sm" />
        </Link>
      </div>
    </Form>
  );
}

function SignUp() {
  const [notification, setNotification] = useState();

  return (
    <Container notification={notification}>
      <SignUpForm setNotification={setNotification} />
    </Container>
  );
}

export default SignUp;
