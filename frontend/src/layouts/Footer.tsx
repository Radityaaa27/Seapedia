import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Shield, Truck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-slate-950 text-slate-400 mt-auto border-t border-slate-900 overflow-hidden">
      {/* Wave Decorative Overlay */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[200%] h-[12px] text-orange-500/20 animate-wave">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">

          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-black text-white tracking-tight">
              SEA<span className="text-orange-500">PEDIA</span>
            </span>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-sm">
              Indonesia's premium marine and seafood marketplace. Supporting local fishermen, trusted quality, secure wallet transactions, and fast deliveries.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { icon: ShoppingBag, label: "Shop" },
                { icon: Shield, label: "Secure" },
                { icon: Truck, label: "Fast" },
              ].map((social, idx) => (
                <div 
                  key={idx} 
                  className="w-10 h-10 bg-slate-900 hover:bg-orange-500/10 border border-slate-800 hover:border-orange-500/30 rounded-full flex items-center justify-center transition-all duration-300 group cursor-pointer"
                  title={social.label}
                >
                  <social.icon className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Links Column */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Marketplace</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-orange-500 transition-colors duration-200">
                  Home Catalog
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-orange-500 transition-colors duration-200">
                  Premium Products
                </Link>
              </li>
              <li>
                <Link to="/vouchers" className="hover:text-orange-500 transition-colors duration-200">
                  Vouchers & Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Column */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Your Space</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login" className="hover:text-orange-500 transition-colors duration-200">
                  Customer Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-orange-500 transition-colors duration-200">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-orange-500 transition-colors duration-200">
                  User Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Newsletter</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Get weekly updates on fresh catches and exclusive promos.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Enter your email..."
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all"
              />
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg text-xs transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        <Separator className="my-10 bg-slate-900" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} SEAPEDIA. Built for COMPFEST 18 Software Engineering Academy.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;