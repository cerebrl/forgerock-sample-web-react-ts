/*
 * forgerock-sample-web-react
 *
 * router
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

// Import react libraries
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import views
import Home from './views/home';
import CentralLogin from './views/central-login';
import EmbeddedLogin from './views/embedded-login';
import CentralRegister from './views/central-register';
import EmbeddedRegister from './views/embedded-register';
import Todos from './views/todos';
import WidgetRegistration from './views/widget-register';

// import layout components
import Header from './components/layout/header';
import Footer from './components/layout/footer';
import Logout from './views/logout';
import { USE_EMBEDDED_LOGIN, USE_LOGIN_WIDGET } from './constants';

let Login = CentralLogin;
let Register = CentralRegister;

// If embedded login is set, switch to the embedded views
if (USE_EMBEDDED_LOGIN) {
  Login = EmbeddedLogin;
  Register = EmbeddedRegister;
} else if (USE_LOGIN_WIDGET) {
  // Login uses the Login Widget's modal, so this component is not used
  Login = () => <></>;
  // Registration uses Login Widget's inline within view
  Register = WidgetRegistration;
}

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
    { path: '/login', element: <Login /> },
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
