/*
 * forgerock-sample-web-react
 *
 * register.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { USE_LOGIN_WIDGET } from '../constants';

import BackHome from '../components/utilities/back-home';
import Card from '../components/layout/card';
import { AppContext } from '../global-state';
import LoginWidget from '../components/journey/widget/inline';
import apiRequest from '../utilities/request';
import NewUserIcon from '../components/icons/new-user-icon';
import Form from '../components/journey/stage/form';

/**
 * @function Register - React view for Register
 * @returns {Object} - React component object
 */
export default function Register() {
  const [state] = useContext(AppContext);
  const topMessage = (
    <p className={`text-center text-secondary pb-2 ${state.theme.textClass}`}>
      Already have an account? <Link to="/login">Sign in here!</Link>
    </p>
  );

  async function initUserInDb() {
    await apiRequest('users', 'POST');
  }

  return (
    <div className="cstm_container_v-centered container-fluid d-flex align-items-center">
      <div className="w-100">
        <BackHome />
        <Card>
          <div className="cstm_form-icon align-self-center mb-3">
            <NewUserIcon size="72px" />
          </div>
          {USE_LOGIN_WIDGET ? (
            <LoginWidget />
          ) : (
            <Form
              action={{ type: 'register' }}
              followUp={initUserInDb}
              topMessage={topMessage}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
