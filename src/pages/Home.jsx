import { useContext, useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Dropdown,
  Form,
  Input,
  Modal,
  useTheme,
} from 'react-daisyui';
import { useForm } from 'react-hook-form';
import { BsXLg } from 'react-icons/bs';
import {
  FaPalette,
  FaPlus,
  FaSignOutAlt,
  FaTrashAlt,
  FaUserAlt,
} from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroller';
import { useNavigate, useSearchParams } from 'react-router-dom';
import reactUseCookie from 'react-use-cookie';
import { useFetch } from 'use-http';
import CheckAuth from '../auth/CheckAuth';
import Container from '../components/layouts/Container';
import CardPost from '../components/post/CardPost';
import CreatePost from '../components/post/CreatePost';
import ViewPostModal from '../components/post/ViewPostModal';
import ConfirmModal from '../components/utils/ConfirmModal';
import Loading from '../components/utils/Loading';
import UserContext from '../contexts/UserContext';

const DEFAULT_THEMES = [
  'valentine',
  'dracula',
  'business',
  'night',
  'luxury',
  'black',
  'retro',
];

function ThemeItem({ dataTheme, onClick }) {
  return (
    <div
      onClick={onClick}
      role="button"
      aria-label="Theme select"
      aria-pressed="false"
      tabIndex="0"
      data-theme={dataTheme}
      className="overflow-hidden rounded-lg border border-base-content/20 outline-2 outline-offset-2 outline-base-content hover:border-base-content/40"
    >
      <div className="w-full cursor-pointer bg-base-100 font-sans text-base-content">
        <div className="grid grid-cols-5 grid-rows-3">
          <div className="col-start-1 row-span-2 row-start-1 bg-base-200"></div>
          <div className="col-start-1 row-start-3 bg-base-300"></div>
          <div className="col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 bg-base-100 p-2">
            <div className="font-bold">{dataTheme}</div>
            <div className="flex flex-wrap gap-1">
              <div className="flex aspect-square w-5 items-center justify-center rounded bg-primary lg:w-6">
                <div className="text-sm font-bold text-primary-content">A</div>
              </div>
              <div className="flex aspect-square w-5 items-center justify-center rounded bg-secondary lg:w-6">
                <div className="text-sm font-bold text-primary-content">A</div>
              </div>
              <div className="flex aspect-square w-5 items-center justify-center rounded bg-accent lg:w-6">
                <div className="text-sm font-bold text-primary-content">A</div>
              </div>
              <div className="flex aspect-square w-5 items-center justify-center rounded bg-neutral lg:w-6">
                <div className="text-sm font-bold text-primary-content">A</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeHeader({ setVisibleCreatePost }) {
  const user = useContext(UserContext);
  const { theme, setTheme } = useTheme();
  const [imageUrl, setImageUrl] = useState(user.photo);
  const { register, handleSubmit } = useForm();
  const [visibleSettings, setVisibleSettings] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [accessToken, setAccessToken] = reactUseCookie('accessToken');
  const [refreshToken, setRefreshToken] = reactUseCookie('refreshToken');
  const { patch, del, loading, put, response } = useFetch(
    import.meta.env.VITE_API_URL,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const reqUploadImage = useFetch(
    'https://api.imgbb.com/1/upload?key=ee9f968f3cc04daecc174efd8c274d77',
    {
      cachePolicy: 'no-cache',
    }
  );
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await patch(`/authentications`, { refreshToken });
    setAccessToken('');
    setRefreshToken('');
    navigate('/signin');
  };

  const handleDeleteAccount = async () => {
    await del('/users');
    if (response.ok) {
      setAccessToken('');
      setRefreshToken('');
      navigate('/signin');
    }
  };

  const updateUser = async (data) => {
    await put('/users', data);
    response.ok && window.location.reload();
  };

  const onSubmit = ({ username, fullname }) => {
    user.photo = imageUrl;
    user.username = username ? username : user.username;
    user.fullname = fullname ? fullname : user.fullname;
    updateUser(user);
  };

  async function uploadImage(image) {
    const body = new FormData();
    body.set('image', image);
    const res = await reqUploadImage.post(body);
    if (reqUploadImage.response.ok) {
      setImageUrl(res.data.display_url);
    }
  }
  useEffect(() => {
    setTheme(window.localStorage.getItem('sb-react-daisyui-preview-theme'));
    document.documentElement.dataset.theme = window.localStorage.getItem(
      'sb-react-daisyui-preview-theme'
    );
  }, []);
  return (
    <>
      <div className="mb-4">
        <div className="flex gap-2">
          <Button
            startIcon={<FaPlus />}
            onClick={() => setVisibleCreatePost(true)}
          />
          <Button
            startIcon={<FaUserAlt />}
            children={user.username}
            onClick={() => setVisibleSettings(true)}
          />
          <Dropdown hover={true} horizontal={'left'} vertical={'middle'}>
            <Dropdown.Toggle>
              <FaPalette />
            </Dropdown.Toggle>
            <Dropdown.Menu className="flex h-40 w-40 flex-row gap-2 overflow-scroll">
              {DEFAULT_THEMES.map((t, i) => (
                <ThemeItem
                  key={`theme_${t}_#${i}`}
                  dataTheme={t}
                  role="button"
                  aria-label="Theme select"
                  onClick={() => {
                    document.documentElement.dataset.theme = t;
                    window.localStorage.setItem(
                      'sb-react-daisyui-preview-theme',
                      t
                    );
                    setTheme(t);
                  }}
                />
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <Modal open={visibleSettings} responsive={true}>
        <Button
          size="sm"
          shape="circle"
          startIcon={<BsXLg />}
          className="absolute right-2 top-2"
          onClick={() => setVisibleSettings(false)}
        />
        <Modal.Header className="font-bold">
          {user.fullname}
          {user.fullname.endsWith('s') ? `'` : `'s`} Settings
        </Modal.Header>
        <Loading loading={loading} fullWidth={false}>
          <Modal.Body className="flex flex-col items-center gap-2">
            <label>
              <input
                type={'file'}
                accept="image/*"
                className="hidden"
                onInput={(e) => uploadImage(e.target.files[0])}
              />
              <Loading loading={reqUploadImage.loading}>
                <Avatar
                  src={imageUrl}
                  shape={'circle'}
                  border={true}
                  size={'md'}
                  className="rounded-full bg-secondary"
                />
              </Loading>
            </label>
            <Form className="gap-2" onSubmit={handleSubmit(onSubmit)}>
              <Input
                placeholder={'Username'}
                size={'sm'}
                className={'w-full'}
                {...register('username')}
              />
              <Input
                placeholder={'Nama'}
                size={'sm'}
                className={'w-full'}
                {...register('fullname')}
              />
              <Button children="simpan" size="sm" />
            </Form>
          </Modal.Body>
          <Modal.Actions className="flex-wrap">
            <Button
              startIcon={<FaSignOutAlt />}
              color="warning"
              onClick={handleSignOut}
              children={'Sign Out'}
              size={'sm'}
            />
            <Button
              startIcon={<FaTrashAlt />}
              color="error"
              onClick={() => setVisibleConfirm(true)}
              children={'Delete Account'}
              size={'sm'}
            />
          </Modal.Actions>
        </Loading>
      </Modal>
      <ConfirmModal
        open={visibleConfirm}
        handleVisible={() => setVisibleConfirm(false)}
        handleAction={handleDeleteAccount}
        data={{
          text: 'Semua postingan anda akan terhapus!',
          ok: 'hapus',
          no: 'tidak',
        }}
      />
    </>
  );
}

function HomeBody({ visibleCreatePost, setVisibleCreatePost }) {
  const [posts, setPosts] = useState([]);
  const [accessToken] = reactUseCookie('accessToken');
  const [URLSearchParams] = useSearchParams();
  const { get, response, loading, data } = useFetch(
    import.meta.env.VITE_API_URL,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      cachePolicy: 'no-cache',
    }
  );
  async function getPosts() {
    const res = await get(`/posts?limit=10&offset=${posts.length}`);
    if (response.ok) {
      setPosts([...posts, ...res]);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);
  return (
    <>
      <InfiniteScroll
        loadMore={() => !loading && getPosts()}
        hasMore={!!data?.length}
      >
        <div className="flex flex-col gap-4">
          {posts.map((post, i) => (
            <CardPost key={i} {...post} />
          ))}
          <Loading loading={URLSearchParams.get('postId') ? false : loading} />
        </div>
      </InfiniteScroll>
      <CreatePost
        visible={visibleCreatePost}
        setVisible={setVisibleCreatePost}
      />
      <ViewPostModal setPosts={setPosts} posts={posts} />
    </>
  );
}

function Home() {
  const [visibleCreatePost, setVisibleCreatePost] = useState(false);

  return (
    <CheckAuth>
      <Container>
        <HomeHeader setVisibleCreatePost={setVisibleCreatePost} />
        <HomeBody
          setVisibleCreatePost={setVisibleCreatePost}
          visibleCreatePost={visibleCreatePost}
        />
      </Container>
    </CheckAuth>
  );
}

export default Home;
