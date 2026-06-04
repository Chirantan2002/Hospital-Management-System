import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, useClerk, UserButton } from "@clerk/clerk-react";
import logo from "../assets/logo.png";
import { Menu, X, User, Lock } from "lucide-react";

const STORAGE_KEY = "docotorToken_v1";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navRef = useRef();
  const clerk = useClerk();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNavbar(currentScrollY <= lastScrollY || currentScrollY <= 80);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => setIsOpen(false), [location.pathname]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Doctors", href: "/doctors" },
    { label: "Services", href: "/services" },
    { label: "Appointments", href: "/appointments" },
    { label: "Contact", href: "/contact" },
  ];
  /*
  Taking design insperatiom from:
  https://dribbble.com/shots/22262189-AxisCare-Medical-Website-Landing-Page
*/
  return (
    <div className="sticky top-0 z-50">
      <nav
        ref={navRef}
        className={`
          w-full bg-[#ecfaf8] backdrop-blur-md
          border border-emerald-200 px-5 py-3
          transition-all duration-300 ease-in-out
          ${showNavbar ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
        `}
        style={{ boxShadow: "0 1px 12px 0 rgba(16,185,129,0.08)" }}
      >
        <div className="max-w-6xl w-full mx-auto">
          {/* Main row */}
          <div className="flex items-center justify-between h-14 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-10 h-10 md:w-15 md:h-15 rounded-xl bg-emerald-50 flex items-center justify-center">
                <img src={logo} alt="Care Sync" className="object-contain" />
              </div>
              <div className="">
                <p className="text-lg md:text-2xl mona-sans-900 text-gray-900 leading-none">
                  <span className="text-sky-600">Care</span>
                  <span className="text-slate-900">Sync</span>
                </p>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-3">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`
                    text-sm px-3 py-1.5 rounded-lg transition-all duration-150 nunito-600
                    ${
                      isActive
                        ? "bg-emerald-500 text-[#000814]/90 font-medium"
                        : "text-gray-500 hover:text-gray-900"
                    }
                  `}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 shrink-0">
              <SignedOut>
                {/* Doctor Admin — ghost */}
                <Link
                  to="/doctor-admin/login"
                  className="hidden sm:flex items-center gap-1.5 bg-blue-500 text-gray-50 px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors nunito-600"
                >
                  <User size={15} />
                  Doctor Admin
                </Link>

                <div className="w-px h-5 bg-gray-100" />

                {/* Login — primary */}
                <button
                  onClick={() => clerk.openSignIn()}
                  className="hidden sm:flex items-center gap-1.5 text-slate-800 google-sans-500 px-3 py-1.5 rounded-lg border border-emerald-400 hover:border-emerald-700 bg-emerald-50 hover:bg-emerald-400 transition-colors cursor-pointer"
                >
                  <Lock size={15} />
                  Login
                </button>
              </SignedOut>

              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div className="md:hidden border-t border-gray-500/40 py-2 flex flex-col gap-0.5">
              <div className="border-b border-slate-800/30 flex flex-col">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`
                    text-sm px-3 py-2.5 rounded-lg transition-colors google-sans-500
                    ${
                      isActive
                        ? "bg-emerald-50 text-emerald-800 font-medium"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <SignedOut>
                <div className="border-t border-gray-100 mt-1 pt-2 flex flex-col gap-2">
                  <Link
                    to="/doctor-admin/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 text-sm text-gray-600 py-2 rounded-lg google-sans-600 border border-slate-400/70 hover:bg-gray-50 transition-colors"
                  >
                    <User size={14} />
                    Doctor Admin
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      clerk.openSignIn();
                    }}
                    className="flex items-center justify-center gap-2 text-sm text-emerald-800 font-medium py-2 rounded-lg border border-emerald-400/70 bg-emerald-50 hover:bg-emerald-100 transition-colors google-sans-600"
                  >
                    <Lock size={14} />
                    Login
                  </button>
                </div>
              </SignedOut>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
