import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { navbarStyles as ns } from "../assets/dummyStyles";
import logoImg from "../assets/logo.png";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Grid,
  Home,
  List,
  Menu,
  PlusSquare,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useAuth, useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navInnerRef = useRef(null);
  const indicatorRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // clerk
  const clerk = useClerk?.();
  const { getToken, isLoaded, authLoaded } = useAuth();
  const { isSignedIn, user, userLoaded } = useUser();

  // sliding indicator
  const moveIndicator = useCallback(() => {
    const container = navInnerRef.current;
    const ind = indicatorRef.current;
    if (!container || !ind) return;

    const active = container.querySelector(".nav-item.active");
    if (!active) {
      ind.style.opacity = "0";
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();

    const left = activeRect.left - containerRect.left + container.scrollLeft;
    const width = activeRect.width;

    ind.style.transform = `translateX(${left}px)`;
    ind.style.width = `${width}px`;
    ind.style.opacity = "1";
  }, []);

  useLayoutEffect(() => {
    moveIndicator();
    const t = setTimeout(() => {
      moveIndicator();
    }, 120);
    return () => clearTimeout(t);
  }, [location.pathname, moveIndicator]);

  useEffect(() => {
    const container = navInnerRef.current;
    if (!container) return;

    const onScroll = () => {
      moveIndicator();
    };
    container.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => {
      moveIndicator();
    });
    ro.observe(container);
    if (container.parentElement) ro.observe(container.parentElement);

    window.addEventListener("resize", moveIndicator);

    moveIndicator();

    return () => {
      container.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.removeEventListener("resize", moveIndicator);
    };
  }, [moveIndicator]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // When user signed in, fetch a token & save it in the local storage
  useEffect(() => {
    let mounted = true;
    const storeToken = async () => {
      if (!authLoaded || !userLoaded) {
        return;
      }
      if (!isSignedIn) {
        try {
          localStorage.removeItem("clerk_token");
        } catch (err) {
          // ignore any error
          console.warn("Failed to remove clerk token from localStorage", err);
        }
        return;
      }

      try {
        if (getToken) {
          const token = await getToken();
          if (!mounted) return;
          if (token) {
            try {
              localStorage.setItem("clerk_token", token);
            } catch (err) {
              console.warn("Failed to write clerk token in localStorage", err);
            }
          }
        }
      } catch (err) {
        console.warn("Failed to get Clerk token", err);
      }
    };
    storeToken();
    return () => {
      mounted = false;
    };
  }, [isSignedIn, getToken, authLoaded, userLoaded]);

  // TO OPEN THE CLERK LOGIN BOX
  const handleOpenSignIn = () => {
    if (!clerk || !clerk.openSignIn) {
      console.warn("Clerk is not initialized");
      return;
    }

    clerk.openSignIn();
    navigate("/");
  };

  // TO SIGNOUT
  const handleSignOut = async () => {
    if (!clerk) {
      console.warn("Clerk is not initialized");
      return;
    }

    try {
      await clerk.signOut({ redirectUrl: "/" });
    } catch (err) {
      console.error("Failed to signout", err);
    } finally {
      try {
        localStorage.removeItem("clerk_token");
      } catch (err) {
        console.warn("Failed to remove clerk token from localStorage", err);
      }
    }
  };

  return (
    <header className={`mona-sans-400 pt-2 ${ns.header} border-b border-gray-900/30`}>
      <nav
        className={`transition-all ease-in-out ${ns.navContainer} mona-sans-400`}
      >
        <div className={ns.flexContainer}>
          <div className={ns.logoContainer}>
            <img src={logoImg} alt="logo" className={ns.logoImage} />

            <Link to="/">
              <div className={ns.logoLink}>
                CareSync
                <div className={`${ns.logoSubtext} hidden lg:block`}>Healthcare Solutions</div>
              </div>
            </Link>
          </div>

          {/* Central navigation */}
          <div className={`${ns.centerNavContainer}`}>
            <div className={``}>
              <div className={`${ns.centerNavInner}`}>
                <div
                  ref={navInnerRef}
                  tabIndex={0}
                  className={`${ns.centerNavScrollContainer}`}
                  style={{
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  <CenterNavItem
                    to="/h"
                    label="Dashboard"
                    icon={<Home size={16} />}
                  />
                  <CenterNavItem
                    to="/add"
                    label="Add Doctor"
                    icon={<UserPlus size={16} />}
                  />
                  <CenterNavItem
                    to="/list"
                    label="List Doctors"
                    icon={<Users size={16} />}
                  />
                  <CenterNavItem
                    to="/appointments"
                    label="Appointments"
                    icon={<Calendar size={16} />}
                  />
                  <CenterNavItem
                    to="/service-dashboard"
                    label="Service Dashboard"
                    icon={<Grid size={16} />}
                  />
                  <CenterNavItem
                    to="/add-service"
                    label="Add Service"
                    icon={<PlusSquare size={16} />}
                  />
                  <CenterNavItem
                    to="/list-service"
                    label="List Services"
                    icon={<List size={16} />}
                  />
                  <CenterNavItem
                    to="/service-appointments"
                    label="Service Appointments"
                    icon={<Calendar size={16} />}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Part */}
          <div className={ns.rightContainer}>
            {/* Auth */}
            {isSignedIn ? (
              <div className={`flex items-center gap-2`}>
                <div
                  className={`border-2 border-gray-300 rounded-full p-0.5 flex items-center justify-center hover:border-gray-400`}
                >
                  <UserButton />
                </div>
                <button
                  onClick={handleSignOut}
                  className={`font-semibold cursor-pointer text-gray-700 ${ns.signOutButton}`}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className={`hidden lg:flex items-center gap-2`}>
                <button
                  onClick={handleOpenSignIn}
                  className={`${ns.loginButton} ${ns.cursorPointer}`}
                >
                  Log in
                </button>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setOpen((v) => !v)}
              className={`${ns.mobileMenuButton}`}
            >
              {open ? (
                <X
                  className={`border rounded-full bg-red-500 text-white`}
                  size={22}
                />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {open && (
          <div onClick={() => setOpen(false)} className={ns.mobileOverlay} />
        )}

        {open && (
          <div className={ns.mobileMenuContainer} id="mobile-menu">
            <div className={ns.mobileMenuInner}>
              <MobileItem
                to="/h"
                label="Dashboard"
                icon={<Home size={16} />}
                onClick={() => setOpen(false)}
              />

              <MobileItem
                to="/add"
                label="Add Doctor"
                icon={<UserPlus size={16} />}
                onClick={() => setOpen(false)}
              />
              <MobileItem
                to="/list"
                label="List Doctors"
                icon={<Users size={16} />}
                onClick={() => setOpen(false)}
              />
              <MobileItem
                to="/appointments"
                label="Appointments"
                icon={<Calendar size={16} />}
                onClick={() => setOpen(false)}
              />

              <MobileItem
                to="/service-dashboard"
                label="Service Dashboard"
                icon={<Grid size={16} />}
                onClick={() => setOpen(false)}
              />
              <MobileItem
                to="/add-service"
                label="Add Service"
                icon={<PlusSquare size={16} />}
                onClick={() => setOpen(false)}
              />
              <MobileItem
                to="/list-service"
                label="List Services"
                icon={<List size={16} />}
                onClick={() => setOpen(false)}
              />
              <MobileItem
                to="/service-appointments"
                label="Service Appointments"
                icon={<Calendar size={16} />}
                onClick={() => setOpen(false)}
              />
              <div className={`mt-3 -mb-1 ${ns.mobileAuthContainer}`}>
                {isSignedIn ? (
                  <button
                    onClick={() => {
                      handleSignOut();
                      setOpen(false);
                    }}
                    className={`${ns.mobileSignOutButton} mt-2`}
                  >
                    Sign Out
                  </button>
                ) : (
                  <div className={`space-y=2`}>
                    <button
                      onClick={() => {
                        handleOpenSignIn();
                        setOpen(false);
                      }}
                      className={`${ns.mobileLoginButton} mt-2 cursor-pointer`}
                    >
                      Login
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

export const CenterNavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `nav-item ${isActive ? "active" : ""} ${ns.centerNavItemBase} ${
          isActive ? "text-[#00a896]" : ns.centerNavItemInactive
        }`
      }
    >
      <span>{icon}</span>
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

export const MobileItem = ({ to, icon, label, onClick }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-2 text-lg nav-item ${isActive ? "active" : ""} ${ns.mobileItemBase} ${
          isActive ? ns.mobileItemActive : ns.mobileItemInactive
        }`
      }
      onClick={onClick}
    >
      <span>{icon}</span>
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};
