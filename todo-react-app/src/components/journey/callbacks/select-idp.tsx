/*
 * forgerock-sample-web-react
 *
 * select-idp.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { useContext } from 'react';

import GithubIcon from '../../icons/github-icon';
import GoogleIcon from '../../icons/google-icon';
import LinkedInIcon from '../../icons/linkedin-icon';
import { AppContext } from '../../../global-state';
import { type SelectIdPCallback } from '@forgerock/javascript-sdk';
import FacebookIcon from '../../icons/facebook-icon';

export default function SelectIdp({
  callback,
  submitForm,
}: {
  callback: SelectIdPCallback;
  submitForm: () => void;
}) {
  const [state] = useContext(AppContext);

  const providers = callback.getProviders();

  function getProviderIcon(provider: string) {
    if (provider.includes('facebook')) {
      return <FacebookIcon />;
    } else if (provider.includes('github')) {
      return <GithubIcon />;
    } else if (provider.includes('google')) {
      return <GoogleIcon />;
    } else if (provider.includes('linkedin')) {
      return <LinkedInIcon />;
    } else {
      return null;
    }
  }

  function selectProvider(provider: string, submit?: boolean) {
    callback.setProvider(provider);
    // console.log(callback);
    submit && submitForm();
  }

  return (
    <div className="mt-4 mb-1">
      {providers.map((provider, idx) => {
        if (provider.provider === 'localAuthentication') {
          // don't render anything
          return null;
        }
        return (
          <button
            onClick={(e) => {
              e.preventDefault();
              selectProvider(provider.provider, true);
            }}
            className={`btn ${
              state.theme.mode === 'light'
                ? 'btn-outline-secondary'
                : 'btn-outline-dark'
            } w-100 my-2`}
            key={idx}
          >
            {getProviderIcon(provider.provider)}
            <span
              className={`${state.theme.textClass} ${state.theme.borderClass}`}
            >
              {provider.uiConfig?.buttonDisplayName}
            </span>
          </button>
        );
      })}
      <hr
        className={`${state.theme.borderClass}`}
        style={{ position: 'relative', zIndex: 0 }}
      />
      <div className="text-center pb-4" style={{ marginTop: '-30px' }}>
        <span
          className={`px-2 ${
            state.theme.cardBgClass ? state.theme.cardBgClass : 'bg-white'
          }`}
          style={{ position: 'relative', zIndex: 1 }}
        >
          or
        </span>
      </div>
    </div>
  );
}
