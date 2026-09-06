import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
          <ShoppingBag className="w-6 h-6" />
          <span>BNV Store</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
