import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ element}) => {
    const accessToken = localStorage.getItem('token');
  
    const isTokenValid = () => {
      if (!accessToken) {
        return false;
      }
  
      const tokenExpiration = decodeTokenExpiration(accessToken);
      if (tokenExpiration < Date.now()) {
        return false;
      }
  
      return true;
    };
  
    useEffect(() => {
      if (!isTokenValid()) {
        localStorage.removeItem('token');
      }
    }, []);
  
    return isTokenValid() ? element : <Navigate to="/signin" />;
  };
  
  const decodeTokenExpiration = (token) => {
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    return tokenPayload.exp * 1000; // Convert expiration time to milliseconds
  };
  

export default ProtectedRoute