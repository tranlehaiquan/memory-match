import { Outlet, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login' });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="w-full py-4 flex-shrink-0">
        <h1 className="text-blue-700 text-center font-black text-3xl tracking-tight">
          Memory Match Game
        </h1>
      </header>

      <main className="w-full flex-1 overflow-hidden px-4 pb-4">
        <div className="w-full h-full max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;
