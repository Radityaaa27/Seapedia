import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Shield, Truck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold text-white">
              SEA<span className="text-orange-500">PEDIA</span>
            </span>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
              Indonesia's trusted marketplace. Buy, sell, and deliver with ease.
            </p>
            <div className="flex gap-3 mt-4">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-orange-500" />
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-orange-500" />
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <Truck className="w-4 h-4 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Marketplace</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Info</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>COMPFEST 18</li>
              <li>SE Academy</li>
              <li>Universitas Indonesia</li>
            </ul>
          </div>

        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} SEAPEDIA. Built for COMPFEST 18 Software Engineering Academy.
        </div>
      </div>
    </footer>
  );
};

export default Footer;