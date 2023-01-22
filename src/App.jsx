import { theme as proTheme } from '@chakra-ui/pro-theme';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import '@fontsource/inter/variable.css';
import { withProse } from '@nikolovlazar/chakra-ui-prose';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import CheckAuth from './auth/CheckAuth';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Settings from './pages/Settings';
const router = createBrowserRouter([
  {
    path: '/',
    element: <CheckAuth />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        element: <Profile />,
        path: '/profile/:userId',
      },
      {
        element: <Settings />,
        path: '/settings',
      },
    ],
  },
  {
    element: <Register />,
    path: '/register',
  },
  {
    element: <Login />,
    path: '/login',
  },
  {
    element: <ForgotPassword />,
    path: '/forgot-password',
  },
  {
    element: <ResetPassword />,
    path: '/reset-password',
  },
]);

const theme = extendTheme(
  {
    colors: { ...proTheme.colors },
  },
  proTheme,
  withProse()
);

function App() {
  return (
    <ChakraProvider
      theme={theme}
      toastOptions={{
        defaultOptions: {
          isClosable: true,
          duration: 3000,
          position: 'top-right',
        },
      }}
    >
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
