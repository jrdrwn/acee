import { useState } from 'react';
import { Alert, Button, Form, Input, InputGroup } from 'react-daisyui';
import { useForm } from 'react-hook-form';
import { FaKey, FaPlus, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useFetch } from 'use-http';
import SignUpIlustration from '../components/ilustrations/SignUpIlustration';
import Container from '../components/layouts/Container';

function SignUp() {
  const { register, handleSubmit } = useForm();
  const [notif, setNotif] = useState({ status: false, text: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { post, response } = useFetch(import.meta.env.VITE_API_URL);
  const onSubmit = async (data) => {
    setNotif({});
    setLoading(true);
    const res = await post('/users', data);
    setLoading(false);
    if (response.ok) navigate('/signin');
    else setNotif({ status: 'error', text: res.message });
  };
  return (
    <Container>
      <Form className="mx-auto mt-8 w-min" onSubmit={handleSubmit(onSubmit)}>
        <SignUpIlustration />
        <InputGroup className="mb-2 mt-2">
          <span>
            <FaUser />
          </span>
          <Input
            type="text"
            placeholder="Name"
            bordered
            required={true}
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
            bordered
            required={true}
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
        {notif.status && (
          <Alert status={notif.status} className="mt-4">
            {notif.text}
          </Alert>
        )}
      </Form>
    </Container>
  );
}

export default SignUp;
