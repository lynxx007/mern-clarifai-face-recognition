import ParticlesBg from 'particles-bg';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './utils/protectedRoute';
import ImageLinkForm from './pages/ImageLinkForm/ImageLinkForm';
import LoginForm from './pages/LoginForm/LoginForm'
import RegisterForm from './pages/RegisterForm/RegisterForm'
import { Layout } from './pages/Layout/Layout';
import Error from './pages/Error/Error';
import { Toaster } from './components/ui/toaster';


const App = () => {
  return (
    <BrowserRouter>
      <ParticlesBg type="fountain" bg={true} />
      <Routes>
        <Route path='/' element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<ImageLinkForm />} />
        </Route>
        <Route path='/login' element={<LoginForm />} />
        <Route path='/register' element={<RegisterForm />} />
        <Route path='*' element={<Error />} />
      </Routes>
      <Toaster />
    </BrowserRouter>

  );
}

export default App;
