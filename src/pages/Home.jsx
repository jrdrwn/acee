import { Container, VStack } from '@chakra-ui/react';
import CheckAuth from '../auth/CheckAuth';
import ResponsiveNavBar from '../components/layouts/ResponsiveNavbar';
import Posts from '../components/post/Posts';

// function HomeHeader({ setVisibleCreatePost }) {
//   const user = useContext(UserContext);
//   const [imageUrl, setImageUrl] = useState(user.photo);
//   const { register, handleSubmit } = useForm();
//   const [visibleSettings, setVisibleSettings] = useState(false);
//   const [visibleConfirm, setVisibleConfirm] = useState(false);
//   const [accessToken, setAccessToken] = reactUseCookie('accessToken');
//   const [refreshToken, setRefreshToken] = reactUseCookie('refreshToken');
//   const { patch, del, loaading, put, response } = useFetch(
//     import.meta.env.VITE_API_URL,
//     {
//       headers: {
//         authorization: `Bearer ${accessToken}`,
//       },
//     }
//   );
//   const reqUploadImage = useFetch(
//     'https://api.imgbb.com/1/upload?key=ee9f968f3cc04daecc174efd8c274d77',
//     {
//       cachePolicy: 'no-cache',
//     }
//   );
//   const navigate = useNavigate();

//   const handleSignOut = async () => {
//     await patch(`/authentications`, { refreshToken });
//     setAccessToken('');
//     setRefreshToken('');
//     navigate('/signin');
//   };

//   const handleDeleteAccount = async () => {
//     await del('/users');
//     if (response.ok) {
//       setAccessToken('');
//       setRefreshToken('');
//       navigate('/signin');
//     }
//   };

//   const updateUser = async (data) => {
//     await put('/users', data);
//     response.ok && window.location.reload();
//   };

//   const onSubmit = ({ username, fullname }) => {
//     user.photo = imageUrl;
//     user.username = username ? username : user.username;
//     user.fullname = fullname ? fullname : user.fullname;
//     updateUser(user);
//   };

//   async function uploadImage(image) {
//     const body = new FormData();
//     body.set('image', image);
//     const res = await reqUploadImage.post(body);
//     if (reqUploadImage.response.ok) {
//       setImageUrl(res.data.display_url);
//     }
//   }
//   return (
//     <>
//       <div className="mb-4">
//         <div className="flex gap-2">
//           <Button
//             startIcon={<FaPlus />}
//             onClick={() => setVisibleCreatePost(true)}
//           />
//           <Button
//             startIcon={<FaUserAlt />}
//             children={user.username}
//             onClick={() => setVisibleSettings(true)}
//           />
//         </div>
//       </div>
//       <Modal open={visibleSettings} responsive={true}>
//         <Button
//           size="sm"
//           shape="circle"
//           startIcon={<BsXLg />}
//           className="absolute right-2 top-2"
//           onClick={() => setVisibleSettings(false)}
//         />
//         <Modal.Header className="font-bold">
//           {user.fullname}
//           {user.fullname.endsWith('s') ? `'` : `'s`} Settings
//         </Modal.Header>
//         <Loading loading={loading} fullWidth={false}>
//           <Modal.Body className="flex flex-col items-center gap-2">
//             <label>
//               <input
//                 type={'file'}
//                 accept="image/*"
//                 className="hidden"
//                 onInput={(e) => uploadImage(e.target.files[0])}
//               />
//               <Loading loading={reqUploadImage.loading}>
//                 <Avatar
//                   src={imageUrl}
//                   shape={'circle'}
//                   border={true}
//                   size={'md'}
//                   className="rounded-full bg-secondary"
//                 />
//               </Loading>
//             </label>
//             <Form className="gap-2" onSubmit={handleSubmit(onSubmit)}>
//               <Input
//                 placeholder={'Username'}
//                 size={'sm'}
//                 className={'w-full'}
//                 {...register('username')}
//               />
//               <Input
//                 placeholder={'Nama'}
//                 size={'sm'}
//                 className={'w-full'}
//                 {...register('fullname')}
//               />
//               <Button children="simpan" size="sm" />
//             </Form>
//           </Modal.Body>
//           <Modal.Actions className="flex-wrap">
//             <Button
//               startIcon={<FaSignOutAlt />}
//               color="warning"
//               onClick={handleSignOut}
//               children={'Sign Out'}
//               size={'sm'}
//             />
//             <Button
//               startIcon={<FaTrashAlt />}
//               color="error"
//               onClick={() => setVisibleConfirm(true)}
//               children={'Delete Account'}
//               size={'sm'}
//             />
//           </Modal.Actions>
//         </Loading>
//       </Modal>
//       <ConfirmModal
//         open={visibleConfirm}
//         handleVisible={() => setVisibleConfirm(false)}
//         handleAction={handleDeleteAccount}
//         data={{
//           text: 'Semua postingan anda akan terhapus!',
//           ok: 'hapus',
//           no: 'tidak',
//         }}
//       />
//     </>
//   );
// }

function HomeBody() {
  return (
    <>
      <VStack ml={{ sm: '24', md: '36' }} mb={{ base: '16', sm: 'auto' }}>
        <Posts />
      </VStack>
    </>
  );
}

function Home() {
  return (
    <CheckAuth>
      <Container>
        <ResponsiveNavBar />
        <HomeBody />
      </Container>
    </CheckAuth>
  );
}

export default Home;
