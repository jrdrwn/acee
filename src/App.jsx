import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
