import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import CheckAuth from './auth/CheckAuth';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Test from './pages/Test';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<CheckAuth />}>
        <Route index element={<Home />} />
        <Route path="test" element={<Test />} />
      </Route>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </>
  )
);
function App() {
  return (
    <RouterProvider router={router} />
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<CheckAuth />}>
    //       <Route index element={<Home />} />
    //       <Route path=":postId" element={<ViewPost />} />
    //       <Route path="test" element={<Test />} />
    //     </Route>
    //     <Route path="/signin" element={<SignIn />} />
    //     <Route path="/signup" element={<SignUp />} />
    //   </Routes>
    // </BrowserRouter>
  );
}

export default App;
