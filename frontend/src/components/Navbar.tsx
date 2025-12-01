import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiSearch } from 'react-icons/fi';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-background-card border-b border-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold text-white">GameVerse</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-text-secondary hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/games" className="text-text-secondary hover:text-white transition-colors">
              Games
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/favorites" className="text-text-secondary hover:text-white transition-colors">
                  Favorites
                </Link>
                <Link to="/profile" className="text-text-secondary hover:text-white transition-colors">
                  Profile
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-background rounded-lg px-4 py-2">
              <FiSearch className="text-text-secondary mr-2" />
              <input
                type="text"
                placeholder="Search games..."
                className="bg-transparent border-none outline-none text-white placeholder-text-secondary w-48"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const query = (e.target as HTMLInputElement).value;
                    if (query) {
                      navigate(`/games?search=${encodeURIComponent(query)}`);
                    }
                  }
                }}
              />
            </div>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-text-secondary hidden md:block">{user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-text-secondary hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

