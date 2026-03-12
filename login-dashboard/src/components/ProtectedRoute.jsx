import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function ProtectedRoute({ children, requiredRoles }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const location = useLocation();
  
  useEffect(() => {
    // Small delay untuk memastikan localStorage sudah terupdate
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token");
      const userJson = localStorage.getItem("user");
      
      if (!token) {
        setIsAuthorized(false);
        return;
      }
      
      try {
        const user = JSON.parse(userJson || "{}");
        
        if (requiredRoles && !requiredRoles.includes(user.role)) {
          console.warn("User role tidak authorized untuk route ini");
          setIsAuthorized(false);
          return;
        }
        
        setIsAuthorized(true);
      } catch (err) {
        console.error("Error parsing user data:", err);
        setIsAuthorized(false);
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [location, requiredRoles]);
  
  // Jika masih checking, tampilkan loading
  if (isAuthorized === null) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div>Loading...</div>
      </div>
    );
  }
  
  if (isAuthorized === false) {
    return <Navigate to="/" />;
  }
  
  return children;
}

export default ProtectedRoute;
