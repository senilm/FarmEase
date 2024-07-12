import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Booking from "./pages/Booking";
import Expense from "./pages/Expense";
import Home from "./pages/Home";
import { ProtectedRouteProps } from "./lib/interfaces";
import Dashboard from "./pages/Dashboard";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuth = sessionStorage.getItem("token") ? true : false;
  return isAuth ? children : <Navigate to="/" />;
};

const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAdmin = sessionStorage.getItem('type') == "ADMIN";
  return isAdmin ? children : <Navigate to="/home" />;
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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminRoute>
              <Dashboard />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
