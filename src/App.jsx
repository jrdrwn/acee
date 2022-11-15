import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CheckAuth from './auth/CheckAuth';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ViewPost from './pages/ViewPost';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<CheckAuth children={<Home />} />} />
        <Route
          index
          path="/:postId"
          element={<CheckAuth children={<ViewPost />} />}
        />

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
