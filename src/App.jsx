import { theme as proTheme } from '@chakra-ui/pro-theme';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import '@fontsource/ubuntu';
import { withProse } from '@nikolovlazar/chakra-ui-prose';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CheckAuth from './auth/CheckAuth';
import Layout from './components/layouts/Layout';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Search from './pages/Search';
import Settings from './pages/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <CheckAuth />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            element: <Search />,
            path: '/search',
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
    ],
  },
  {
    element: <Layout navigation={false} maxW={'md'} />,
    path: '/',
    children: [
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
    ],
  },
]);

const theme = extendTheme(
  {
    components: {
      Modal: {
        baseStyle: {
          dialog: {
            position: ['fixed', 'relative'],
            margin: [0, 'auto'],
            width: ['full', 'md'],
            bottom: 0,
            insetX: 0,
            roundedBottom: ['unset', 'md'],
          },
        },
        sizes: {
          md: {
            dialog: {
              maxWidth: 'unset',
            },
          },
        },
      },
      Button: {
        baseStyle: {
          cursor: 'pointer',
        },
      },
    },
    colors: { ...proTheme.colors },
  },
  proTheme,
  withProse()
);

function App() {
  return (
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
