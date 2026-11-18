import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("sellerToken");

  if (!token) {
    return <Navigate to="/vendedor/login" replace />;
  }

  return children;
}

export default ProtectedRoute;