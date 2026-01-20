import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-800 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Nexarion</h3>
                <p className="text-xs text-emerald-400">Global Exports</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              Your trusted partner in global import-export solutions. Connecting businesses worldwide.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-emerald-500 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-emerald-500 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-emerald-500 transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-emerald-500 transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-300 hover:text-emerald-400 transition-colors text-sm">Home</Link></li>
              <li><Link to="/products" className="text-slate-300 hover:text-emerald-400 transition-colors text-sm">Products</Link></li>
              <li><Link to="/categories" className="text-slate-300 hover:text-emerald-400 transition-colors text-sm">Categories</Link></li>
              <li><Link to="/about" className="text-slate-300 hover:text-emerald-400 transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-slate-300 hover:text-emerald-400 transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-4">Services</h4>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-slate-300 hover:text-emerald-400 transition-colors text-sm">Import Solutions</Link></li>
              <li><Link to="/services" className="text-slate-300 hover:text-emerald-400 transition-colors text-sm">Export Solutions</Link></li>
              <li><Link to="/services" className="text-slate-300 hover:text-emerald-400 transition-colors text-sm">Logistics</Link></li>
              <li><Link to="/services" className="text-slate-300 hover:text-emerald-400 transition-colors text-sm">Customs Clearance</Link></li>
              <li><Link to="/services" className="text-slate-300 hover:text-emerald-400 transition-colors text-sm">Documentation</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <MapPin size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>123 Business Avenue, Trade City, TC 12345</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300 text-sm">
                <Phone size={18} className="text-emerald-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300 text-sm">
                <Mail size={18} className="text-emerald-400" />
                <span>info@nexarion.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © {currentYear} Nexarion Global Exports. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
