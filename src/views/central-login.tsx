/*
 * forgerock-sample-web-react
 *
 * central-login.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

// Import libraries
import { TokenManager, UserManager } from '@forgerock/javascript-sdk';
import { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { AppContext } from '../global-state';
import Loading from '../components/utilities/loading';
import BackHome from '../components/utilities/back-home';
import Card from '../components/layout/card';

/**
 * @function Login - React view for Login
 * @returns {Object} - React component object
 */
export default function CentralLogin() {
  // Used for setting global authentication state
  const [_, methods] = useContext(AppContext);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // Get the code and state from the URL query parameters
  const codeParam = params.get('code');
  const stateParam = params.get('state');

  useEffect(() => {
    async function getTokens() {
      if (codeParam && stateParam) {
        await TokenManager.getTokens({ query: { codeParam, stateParam } });
      } else {
        await TokenManager.getTokens({ login: 'redirect' });
      }
			// Get the current user
			const user = await UserManager.getCurrentUser() as { name: string; email: string };
			/**
			 * First, let's see if we get a user back from useJourneyHandler.
			 * If we do, let's set the user data and redirect back to home.
			 */
			if (user) {
				/**
				 * Set user state/info on "global state"
				 */
				methods.setUser(user?.name);
				methods.setEmail(user.email);
				methods.setAuthentication(true);
			}
			navigate('/');
    }

    getTokens();
  }, []);

  return (
    <div className='cstm_container_v-centered container-fluid d-flex align-items-center'>
      <div className='w-100'>
        <BackHome />
        <Card>
          <Loading message='Checking your session ...' />
        </Card>
      </div>
    </div>
  );
}
