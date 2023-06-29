/*
 * forgerock-sample-web-react
 *
 * router.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

// Import react libraries
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import views
import Home from './views/home.tsx';
import CentralLogin from './views/central-login.tsx';
// import EmbeddedLogin from './views/embedded-login.tsx';
import Register from './views/register.tsx';
import Todos from './views/todos.tsx';

// import layout components
import Header from './components/layout/header.tsx';
import Footer from './components/layout/footer.tsx';
import Logout from './views/logout.tsx';

export default function Router() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Header />
          <Home />
          <Footer />
        </>
      ),
    },
    { path: '/login', element: <CentralLogin /> },
    { path: '/logout', element: <Logout /> },
    { path: '/register', element: <Register /> },
    {
      path: '/todos',
      element: (
        <>
          <Header />
          <Todos />
          <Footer />
        </>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}
