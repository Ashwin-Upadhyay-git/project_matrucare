import { Link } from 'react-router-dom';
import { Mail, Globe, ArrowUpRight } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
      <div>
        <h3 className="text-lg font-semibold text-white">MatruCare AI</h3>
        <p className="mt-4 text-sm text-slate-300">Building accessible AI-driven innovation for meaningful real-world impact.</p>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">Quick links</h4>
        <ul className="mt-4 space-y-2 text-sm">
          <li><Link to="/" className="hover:text-white">Home</Link></li>
          <li><Link to="/about" className="hover:text-white">About</Link></li>
          <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">Contact</h4>
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <a href="mailto:matrucareai@gmail.com" className="flex items-center gap-2 hover:text-white"><Mail className="h-4 w-4" /> matrucareai@gmail.com</a>
          <div className="flex items-center gap-3">
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-full border border-slate-700 p-2 hover:border-indigo-400 hover:text-white"><Globe className="h-4 w-4" /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-full border border-slate-700 p-2 hover:border-indigo-400 hover:text-white"><ArrowUpRight className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </div>
    <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-400">© 2025 MatruCare AI. All rights reserved.</div>
  </footer>
);

export default Footer;
