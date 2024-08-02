import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const logOut = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="flex justify-between items-center py-2 px-5">
      <Link className="font-bold text-3xl text-[#6b4226] hover:text-[#4d2e1b]" to="/home">
      FarmEase
      </Link>
      <button className="md:hidden" onClick={toggleMenu}>
        {isOpen ? (
          <X className="w-6 h-6 text-[#6b4226]" />
        ) : (
          <Menu className="w-6 h-6 text-[#6b4226]" />
        )}
      </button>
      <div className="hidden md:flex gap-3 transition-colors">
        <Link
          to="/home"
          className={`border rounded-lg ${pathname === "/home" ? "bg-gray-200 dark:bg-gray-800" : ""}`}
        >
          <Button disabled={pathname === "/home"} variant="ghost">
            Home
          </Button>
        </Link>
        <Link
          to="/booking"
          className={`border rounded-lg ${pathname === "/booking" ? "bg-gray-200 dark:bg-gray-800" : ""}`}
        >
          <Button disabled={pathname === "/booking"} variant="ghost">
            Booking
          </Button>
        </Link>
        <Link
          to="/expense"
          className={`border rounded-lg ${pathname === "/expense" ? "bg-gray-200 dark:bg-gray-800" : ""}`}
        >
          <Button disabled={pathname === "/expense"} variant="ghost">
            Expense
          </Button>
        </Link>
        <Link
          to="/dashboard"
          className={`border rounded-lg ${pathname === "/dashboard" ? "bg-gray-200 dark:bg-gray-800" : ""}`}
        >
          <Button disabled={pathname === "/dashboard"} variant="ghost">
            Dashboard
          </Button>
        </Link>
        <div className="border rounded-lg">
          <Button className="bg-[#6b4226] hover:bg-[#4d2e1b]" onClick={logOut}>
            Logout
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="bg-white w-full h-full shadow-lg px-5 py-2 transform transition-transform duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-4">
              <Link className="font-bold text-3xl text-[#6b4226] hover:text-[#4d2e1b]" to="/home">
              FarmEase
              </Link>
              <button onClick={toggleMenu}>
                <X className="w-6 h-6 text-[#6b4226]" />
              </button>
            </div>
            <div className="flex flex-col gap-3 p-10 text-center">
              <Link
                to="/home"
                className={`border rounded-lg ${pathname === "/home" ? "bg-gray-200 dark:bg-gray-800" : ""}`}
                onClick={toggleMenu}
              >
                <Button disabled={pathname === "/home"} variant="ghost">
                  Home
                </Button>
              </Link>
              <Link
                to="/booking"
                className={`border rounded-lg ${pathname === "/booking" ? "bg-gray-200 dark:bg-gray-800" : ""}`}
                onClick={toggleMenu}
              >
                <Button disabled={pathname === "/booking"} variant="ghost">
                  Booking
                </Button>
              </Link>
              <Link
                to="/expense"
                className={`border rounded-lg ${pathname === "/expense" ? "bg-gray-200 dark:bg-gray-800" : ""}`}
                onClick={toggleMenu}
              >
                <Button disabled={pathname === "/expense"} variant="ghost">
                  Expense
                </Button>
              </Link>
              <Link
                to="/dashboard"
                className={`border rounded-lg ${pathname === "/dashboard" ? "bg-gray-200 dark:bg-gray-800" : ""}`}
                onClick={toggleMenu}
              >
                <Button disabled={pathname === "/dashboard"} variant="ghost">
                  Dashboard
                </Button>
              </Link>
              <div className="border rounded-lg">
                <Button className="bg-[#6b4226] hover:bg-[#4d2e1b] w-full" onClick={() => { logOut(); toggleMenu(); }}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-black opacity-50" onClick={toggleMenu}></div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
