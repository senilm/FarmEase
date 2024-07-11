import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Booking from "./pages/Booking";
import Expense from "./pages/Expense";
import Home from "./pages/Home";
import { ProtectedRouteProps } from "./lib/interfaces";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuth = sessionStorage.getItem("token") ? true : false;
  return isAuth ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expense"
          element={
            <ProtectedRoute>
              <Expense />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
