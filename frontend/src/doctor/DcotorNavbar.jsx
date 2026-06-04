import { useState } from "react";
import { useMemo } from "react";
import logo from "../assets/logo.png";
import { useLocation, useParams, NavLink, useNavigate } from "react-router-dom";
import { Home, Edit, Calendar, Menu, X, LogOut } from "lucide-react";

const STORAGE_KEY = "doctorToken_v1";

const DoctorNavbar = () => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const doctorId = useMemo(() => {
    if (params?.id) return params.id;
    const m = location.pathname.match(/\/doctor-admin\/([^/]+)/);
    return m ? m[1] : null;
  }, [params, location.pathname]);

  const basePath = doctorId
    ? `/doctor-admin/${doctorId}`
    : `/doctor-admin/login`;

  const navItems = [
    { name: "Dashboard", to: `${basePath}`, Icon: Home },
    { name: "Appointments", to: `${basePath}/appointments`, Icon: Calendar },
    { name: "Edit Profile", to: `${basePath}/edit-profile`, Icon: Edit },
  ];

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setOpen(false);
    navigate("/doctor-admin/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full">
      {/* Glass bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-emerald-400/80 shadow-sm shadow-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden">
                <img
                  src={logo}
                  alt="logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl mona-sans-800 tracking-tight leading-none">
                <span className="text-sky-500">Care</span>
                <span className="text-slate-800">Sync</span>
              </span>
            </div>

            {/* Desktop nav + logout */}
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-200/80 rounded-2xl p-1 google-sans-500">
                {navItems.map(({ name, to, Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === basePath}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-white text-sky-600 shadow-sm shadow-sky-100 ring-1 ring-sky-100"
                          : "text-slate-500 hover:text-slate-800 hover:bg-green-500/60"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={15}
                          className={isActive ? "text-sky-500" : ""}
                        />
                        {name}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Logout — desktop */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
          {navItems.map(({ name, to, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === basePath}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-sky-50 text-sky-600 ring-1 ring-sky-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`p-1.5 rounded-lg ${isActive ? "bg-sky-100" : "bg-slate-100"}`}
                  >
                    <Icon
                      size={15}
                      className={isActive ? "text-sky-500" : "text-slate-500"}
                    />
                  </span>
                  {name}
                </>
              )}
            </NavLink>
          ))}

          {/* Logout — mobile */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
          >
            <span className="p-1.5 rounded-lg bg-red-50">
              <LogOut size={15} className="text-red-400" />
            </span>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar;
