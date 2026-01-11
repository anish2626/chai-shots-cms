import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Login from './pages/Login';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';

function Protected({ children }) {
  const { token } = useAuth();
  if (!token) return <Login />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Protected><Programs /></Protected>} />
          <Route path="/programs/:id" element={<Protected><ProgramDetail /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
