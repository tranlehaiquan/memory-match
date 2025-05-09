import { useAuthStore } from '../store/authStore';

export const UserProfile = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!user) return null;

  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm text-gray-600">Welcome,</p>
          <p className="font-bold">{user.username}</p>
          <p className="text-sm text-gray-600">High Score: {user.highScore}</p>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}; 