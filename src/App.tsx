import { GameBoard } from './components/GameBoard';
import { Login } from './components/Login';
import { UserProfile } from './components/UserProfile';
import { useAuthStore } from './store/authStore';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-5 relative">
      <h1 className="text-blue-700 mb-8 text-center font-black text-4xl shadow-text">
        Memory Match Game
      </h1>
      {!isAuthenticated ? (
        <Login />
      ) : (
        <>
          <UserProfile />
          <div className="w-full max-w-[800px] grid gap-4 p-4 bg-white/10 rounded-lg">
            <GameBoard />
          </div>
        </>
      )}
    </div>
  );
}

export default App; 