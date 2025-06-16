import React from 'react';
import { Navigate } from 'react-router-dom';
import { fetchTokenKeys } from './token';
import { showError, showSuccess } from './';


import { history } from './history';

export function authHeader() {
  // return authorization header with jwt token
  let user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
}

export const TokenAuthRedirect = ({ children }) => {
  const user = localStorage.getItem('user');

  if (user) {
    const loadAllData = async () => {
      const fetchedKeys = await fetchTokenKeys();
      if (fetchedKeys.length === 0) {
        showError('当前没有可用的启用令牌，请确认是否有令牌处于启用状态！');
        return;
      }
      showSuccess('Token keys fetched successfully!');
      window.opener.postMessage({
        type: 'newapi-keys',
        data: fetchedKeys,
      }, '*');
      // setKeys(fetchedKeys);
      // setIsLoading(false);

      // const address = getServerAddress();
      // setServerAddress(address);
    };

    loadAllData();

    return <Navigate to="/console" replace />;
  }
  return <Navigate to="/login?redirect=/oauth/client" replace />
  // return children;
};

export const AuthRedirect = ({ children }) => {
  const user = localStorage.getItem('user');

  if (user) {
    return <Navigate to="/console" replace />;
  }

  return children;
};

function PrivateRoute({ children }) {
  if (!localStorage.getItem('user')) {
    return <Navigate to='/login' state={{ from: history.location }} />;
  }
  return children;
}

export { PrivateRoute };
