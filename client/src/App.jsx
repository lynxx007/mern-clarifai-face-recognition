
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './utils/protectedRoute';
import ImageLinkForm from './pages/ImageLinkForm/ImageLinkForm';
import LoginForm from './pages/LoginForm/LoginForm'
import RegisterForm from './pages/RegisterForm/RegisterForm'
import { Layout } from './pages/Layout/Layout';



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<ImageLinkForm />} />
        </Route>
        <Route path='/login' element={<LoginForm />} />
        <Route path='/register' element={<RegisterForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
