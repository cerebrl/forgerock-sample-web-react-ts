import { Config } from '@forgerock/javascript-sdk';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AppContext, useGlobalStateMgmt } from './global-state.ts';

import Home from './views/home.tsx';
import Login from './views/login.tsx';
import Register from './views/register.tsx';
import Todos from './views/todos.tsx';
import Header from './components/layout/header.tsx';

const router = createBrowserRouter([
  { path: '/', element: (
    <>
      <Header />
      <Home />
    </>
  ) },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/todos', element: <Todos /> },
]);

Config.set({
  clientId: 'WebOAuthClient',
  redirectUri: 'http://localhost:5173/login',
  scope: 'openid profile email',
  serverConfig: {
    baseUrl: 'https://forgerock.crbrl.io/am/',
    timeout: 3000,
  },
  realmPath: 'alpha',
});

(async () => {

  function Init() {
    const stateMgmt = useGlobalStateMgmt({
      email: '',
      isAuthenticated: false,
      username: '',
      prefersDarkTheme: false,
    });

    return (
      <React.StrictMode>
        <AppContext.Provider value={stateMgmt}>
          <RouterProvider router={router} />
        </AppContext.Provider>
      </React.StrictMode>
    );
  }

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Init />);
})();