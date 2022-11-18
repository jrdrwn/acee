import { useState } from 'react';
import { Button, Form, Input, InputGroup } from 'react-daisyui';
import { useForm } from 'react-hook-form';
import { FaKey, FaPlus, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useFetch } from 'use-http';
import SignUpIlustration from '../components/ilustrations/SignUpIlustration';
import Container from '../components/layouts/Container';

function SignUp() {
  const { register, handleSubmit } = useForm();
  const [notification, setNotification] = useState();
  const navigate = useNavigate();
  const { post, response, loading } = useFetch(import.meta.env.VITE_API_URL);
  const onSubmit = async (data) => {
    const res = await post('/users', data);
    setNotification({
      text: res ? res.message : 'Tidak dapat tersambung ke server',
    });
    if (response.ok) navigate('/signin');
  };
  return (
    <Container notification={notification}>
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
            <Button
              children="Create Account"
              size="sm"
              startIcon={<FaPlus />}
              type="submit"
            />
            {loading && (
              <Button color="ghost" loading={true} size="sm" shape="circle" />
            )}
          </div>
          <Link to={'/signin'}>
            <Button children="Sign In" variant="outline" size="sm" />
          </Link>
        </div>
      </Form>
    </Container>
  );
}

export default SignUp;
