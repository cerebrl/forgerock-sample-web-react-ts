/*
 * forgerock-sample-web-react
 *
 * state.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import {
  FRAuth,
  FRLoginFailure,
  FRLoginSuccess,
  FRStep,
  TokenManager,
  UserManager,
} from '@forgerock/javascript-sdk';
import { Dispatch, useEffect, useState } from 'react';

import { htmlDecode } from '../../../utilities/decode';

type JourneyState = [
  {
    formFailureMessage: string | null;
    renderStep: FRStep | FRLoginFailure | FRLoginSuccess | undefined;
    submittingForm: boolean;
    user: { name: string, email: string } | undefined;
  },
  {
    setSubmissionStep: Dispatch<React.SetStateAction<FRStep | undefined>>;
    setSubmittingForm: Dispatch<React.SetStateAction<boolean>>;
  }
];

/**
 *
 * @param {Object} props - React props object
 * @param {Object} props.action - Action object for a "reducer" pattern
 * @param {string} props.action.type - Action type string that represents the action
 * @param {Object} props.form - The form metadata object
 * @returns {Object} - React component object
 */
export default function useJourneyHandler({
  action,
  form,
  resumeUrl,
}: {
  action: { type: string };
  form: any;
  resumeUrl?: string | null;
}): JourneyState {
  /**
   * Compose the state used in this view.
   * First, we will use the global state methods found in the App Context.
   * Then, we will create local state to manage the login journey. The
   * underscore is an unused variable, since we don't need the current global state.
   *
   * The destructing of the hook's array results in index 0 having the state value,
   * and index 1 having the "setter" method to set new state values.
   */
  // Form level errors
  const [formFailureMessage, setFormFailureMessage] = useState<string | null>(
    null
  );
  // Step to render
  const [renderStep, setRenderStep] = useState<
    FRStep | FRLoginFailure | FRLoginSuccess | undefined
  >(undefined);
  // Step to submit
  const [submissionStep, setSubmissionStep] = useState<FRStep | undefined>(
    undefined
  );
  // Processing submission
  const [submittingForm, setSubmittingForm] = useState(false);
  // User state
  const [user, setUser] = useState<{ name: string, email: string} | undefined>(
    undefined
  );

  /**
   * Since we have API calls to AM, we need to handle these requests as side-effects.
   * This will allow the view to render, but update/re-render after the request completes.
   */
  useEffect(() => {
    /**
     * @function getOAuth - The function to call when we get a LoginSuccess
     * @returns {undefined}
     */
    async function getOAuth() {
      /** *********************************************************************
       * SDK INTEGRATION POINT
       * Summary: Get OAuth/OIDC tokens with Authorization Code Flow w/PKCE.
       * ----------------------------------------------------------------------
       * Details: Since we have successfully authenticated the user, we can now
       * get the OAuth2/OIDC tokens. We are passing the `forceRenew` option to
       * ensure we get fresh tokens, regardless of existing tokens.
       ************************************************************************* */
      try {
        await TokenManager.getTokens({ forceRenew: true });
      } catch (err) {
        console.info(`Error: get tokens; ${err}`);
      }

      /** *********************************************************************
       * SDK INTEGRATION POINT
       * Summary: Call the user info endpoint for some basic user data.
       * ----------------------------------------------------------------------
       * Details: This is an OAuth2 call that returns user information with a
       * valid access token. This is optional and only used for displaying
       * user info in the UI.
       ********************************************************************* */
      try {
        const user = (await UserManager.getCurrentUser()) as { name: string, email: string };
        setUser(user);
      } catch (err) {
        console.error(`Error: get current user; ${err}`);

        setUser(undefined);
      }
    }

    /**
     * @function getStep - The function for calling AM with a previous step to get a new step
     * @param {Object} prev - This is the previous step that should contain the input for AM
     * @returns {undefined}
     */
    async function getStep(prev: FRStep | undefined) {
      /** *********************************************************************
       * SDK INTEGRATION POINT
       * Summary: Call the SDK's next method to submit the current step.
       * ----------------------------------------------------------------------
       * Details: This calls the next method with the previous step, expecting
       * the next step to be returned, or a success or failure.
       ********************************************************************* */
      let nextStep;
      try {
        if (resumeUrl) {
          nextStep = await FRAuth.resume(resumeUrl);
        } else {
          nextStep = await FRAuth.next(prev, { tree: form.tree });
        }
      } catch (err) {
        console.error(`Error: failure in next step request; ${err}`);

        /**
         * Setup an object to display failure message
         */
        nextStep = {
          type: 'LoginFailure',
          payload: {
            message: 'Unknown request failure',
          },
        };
      }

      /**
       * Condition for handling start, error handling and completion
       * of login journey.
       */
      if (nextStep.type === 'LoginSuccess') {
        // User is authenticated, now call for OAuth tokens
        getOAuth();
      } else if (nextStep.type === 'LoginFailure') {
        /**
         * Handle basic form error
         */
        if (nextStep.payload.message) {
          setFormFailureMessage(htmlDecode(nextStep.payload.message));
        }

        /** *******************************************************************
         * SDK INTEGRATION POINT
         * Summary: Call next without previous step to get new authId.
         * --------------------------------------------------------------------
         * Details: Since this is within the failure block, let's call the next
         * function again but with no step (null) to get a fresh authId.
         ******************************************************************* */
        let newStep: FRStep | FRLoginSuccess | FRLoginFailure | undefined;
        try {
          newStep = await FRAuth.next(undefined, { tree: form.tree });
        } catch (err) {
          console.error(`Error: failure in new step request; ${err}`);

          /**
           * Setup an object to display failure message
           */
          newStep = new FRLoginFailure({
            message: 'Unknown request failure',
          });
        }

        setRenderStep(newStep);
        setSubmittingForm(false);
      } else {
        /**
         * If we got here, then the form submission was both successful
         * and requires additional step rendering.
         */
        setRenderStep(nextStep as FRStep);
        setSubmittingForm(false);
      }
    }

    /**
     * Kickstart the authentication journey!
     * submissionStep will initially be `null`, and that's intended.
     */
    getStep(submissionStep);
  }, [action.type, form.tree, submissionStep]);

  return [
    {
      formFailureMessage,
      renderStep,
      submittingForm,
      user,
    },
    {
      setSubmissionStep,
      setSubmittingForm,
    },
  ];
}
