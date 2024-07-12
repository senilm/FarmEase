import { Link,  useLocation } from "react-router-dom";
import { Button } from "./ui/button";

// import Logo from "../../public/no-bg-logo.png"

const Navbar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const logOut  = () => {
    sessionStorage.clear();
    window.location.reload();
  }
  
  return (
    <nav className="flex justify-between gap-4 px-5 items-center py-2 ">
      <Link className=" font-bold text-3xl text-[#6b4226] hover:text-[#4d2e1b]" to={"/home"}>
        JK Farm
      </Link>
      <div className=" flex gap-3 transition-colors">
        <Link
          to="/home"
          className={`border rounded-lg  ${
            pathname === "/home" ? "bg-gray-200 dark:bg-gray-800 " : ""
          } `}
        >
          <Button disabled={pathname === "/home"} variant={"ghost"}>
            Home
          </Button>
        </Link>
        <Link
          to="/booking"
          className={`border rounded-lg ${
            pathname === "/booking" ? "bg-gray-200 dark:bg-gray-800 " : ""
          } `}
        >
          <Button disabled={pathname === "/booking"} variant={"ghost"}>
            Booking
          </Button>
        </Link>
        <Link
          to="/expense"
          className={`border rounded-lg ${
            pathname === "/expense" ? "bg-gray-200 dark:bg-gray-800 " : ""
          } `}
        >
          <Button disabled={pathname === "/expense"} variant={"ghost"}>
            Expense
          </Button>
        </Link>
        <Link
          to="/dashboard"
          className={`border rounded-lg ${
            pathname === "/dashboard" ? "bg-gray-200 dark:bg-gray-800 " : ""
          } `}
        >
          <Button disabled={pathname === "/dashboard"} variant={"ghost"}>
            Dashboard
          </Button>
        </Link>
        <div className="border rounded-lg" >
          <Button className="bg-[#6b4226] hover:bg-[#4d2e1b]" onClick={logOut}>Logout</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
