import { useAuthStore } from '../store/authStore';

export const UserProfile = () => {
  const username = useAuthStore((state) => state.username);
  const highScore = useAuthStore((state) => state.highScore);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="flex justify-between items-center mb-3 px-1 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold">
          {username.charAt(0).toUpperCase()}
        </div>
        <span className="font-medium text-gray-700">{username}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-blue-700">
          <span className="font-medium">High Score:</span>
          <span>{highScore}</span>
        </div>
        <button 
          onClick={logout}
          className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded text-xs font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}; 