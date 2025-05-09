import { Outlet, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login' });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-5 relative">
      <h1 className="text-blue-700 mb-8 text-center font-black text-4xl shadow-text">
        Memory Match Game
      </h1>
      <Outlet />
    </div>
  );
}

export default App; 