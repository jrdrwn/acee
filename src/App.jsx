import { theme as proTheme } from '@chakra-ui/pro-theme';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import '@fontsource/inter/variable.css';
import { withProse } from '@nikolovlazar/chakra-ui-prose';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

const router = createBrowserRouter([
  {
    element: <SignIn />,
    path: '/signin',
  },
  {
    element: <SignUp />,
    path: '/signup',
  },
  {
    element: <Home />,
    path: '/',
  },
  {
    element: <Profile />,
    path: '/profile/:userId',
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
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
