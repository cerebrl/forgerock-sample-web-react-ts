/*
 * forgerock-sample-web-react
 *
 * form.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import {
  CallbackType,
  type DeviceProfileCallback,
  type FRStep,
  FRWebAuthn,
} from '@forgerock/javascript-sdk';
import React, { Fragment, useEffect, useContext, useReducer } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Alert from '../../utilities/alert';
import Loading from '../../utilities/loading';
import treeReducer from './tree-reducer';
import useJourneyHandler from './journey-state';
import { AppContext } from '../../../global-state';
import Button from '../../utilities/button';
import DeviceProfile from './device-profile';
import { mapCallbacksToComponents } from './map-callbacks';

/**
 * @function Form - React component for managing the user authentication journey
 * @param {Object} props - props object from React
 * @param {Object} props.action - Action object for a "reducer" pattern
 * @param {string} props.action.type - Action type string that represents the action
 * @param {string} props.bottomMessage - Message to render at bottom of form
 * @param {Function} props.followUp - A function that should be run after successful authentication
 * @param {string} props.topMessage - Message to render at the top of the form
 * @returns {Object} - React component object
 */
export default function Form({
  action,
  bottomMessage,
  followUp,
  topMessage,
}: {
  action: { type: string };
  bottomMessage?: React.JSX.Element | string;
  followUp?: () => Promise<void>;
  topMessage?: React.JSX.Element | string;
}) {
  /**
   * Compose the state used in this view.
   * First, we will use the global state methods found in the App Context.
   * Then, we will create local state to manage the login journey.
   *
   * The destructing of the hook's array results in index 0 having the state value,
   * and index 1 having the "setter" method to set new state values.
   */
  // Used for setting global authentication state
  const [state, methods] = useContext(AppContext);
  // Map action to form metadata: title, button text and tree
  const [form] = useReducer(treeReducer, treeReducer(null, action));
  // Used for redirection after success
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // Get the code and state from the URL query parameters
  const codeParam = params.get('code');
  const stateParam = params.get('state');
  const formPostEntryParam = params.get('form_post_entry');

  let resumeUrl = '';
  if (codeParam && stateParam && formPostEntryParam) {
    resumeUrl = window.location.href;
  }

  /**
   * Custom "hook" for handling form orchestration
   */
  const [
    { formFailureMessage, renderStep, submittingForm, user },
    { setSubmissionStep, setSubmittingForm },
  ] = useJourneyHandler({ action, form, resumeUrl });

  /**
   * If the user successfully authenticates, let React complete
   * rendering, then complete setting the state and redirect to home.
   */
  useEffect(() => {
    async function finalizeAuthState() {
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

        // Run follow-up function if present
        followUp != null && (await followUp());

        // Redirect back to the home page
        navigate('/');
      }
    }

    finalizeAuthState();

    // Only `user` is a needed dependency, all others are "stable"
  }, [user]);

  function isDeviceProfileCallback(step: FRStep) {
    const isIt = step.getCallbacksOfType(CallbackType.DeviceProfileCallback);
    return isIt.length > 0;
  }

  /**
   * Render conditions for presenting appropriate views to user.
   * First, we need to handle no "step", which means we are waiting for
   * the initial response from AM for authentication.
   *
   * Once we have a step, we then need to ensure we don't already have a
   * success or failure. If we have a step but don't have a success or
   * failure, we will likely have callbacks that we will need to present'
   * to the user in their render component form.
   */
  if (!renderStep) {
    /**
     * Since there is no step information we need to call AM to retrieve the
     * instructions for rendering the login form.
     */
    return <Loading message="Checking your session ..." />;
  } else if (submittingForm) {
    /**
     * Since we are submitting the form, show a loading message to user.
     * Doing this helps us better manage the inputs values and avoid using
     * "controlled inputs".
     */
    return <Loading message="Submitting ..." />;
  } else if (renderStep.type === 'LoginSuccess') {
    /**
     * Since we have successfully authenticated, show a success message to
     * user while we complete the process and redirect to home page.
     */
    return <Loading message="Success! Redirecting ..." />;
  } else if (
    renderStep.type === 'Step' &&
    isDeviceProfileCallback(renderStep)
  ) {
    return (
      <Fragment>
        <form className="cstm_form">
          <DeviceProfile
            callback={
              renderStep.getCallbackOfType(
                CallbackType.DeviceProfileCallback,
              ) as DeviceProfileCallback
            }
            onComplete={() => {
              setSubmittingForm(true);
              setSubmissionStep(renderStep);
            }}
          />
        </form>
      </Fragment>
    );
  } else if (
    renderStep.type === 'Step' &&
    FRWebAuthn.getWebAuthnStepType(renderStep)
  ) {
    return (
      <Fragment>
        <form className="cstm_form"></form>
      </Fragment>
    );
  } else if (renderStep.type === 'Step') {
    /**
     * The step to render has callbacks, so we need to collect additional
     * data from user. Map callbacks to form inputs.
     */
    return (
      <Fragment>
        <h1 className={`text-center fs-2 mb-3 ${state.theme.textClass}`}>
          {form.titleText}
        </h1>
        {topMessage}
        <form
          className="cstm_form"
          onSubmit={(event) => {
            event.preventDefault();
            // Indicate form processing
            setSubmittingForm(true);
            // set currently rendered step as step to be submitted
            setSubmissionStep(renderStep);
          }}
        >
          {formFailureMessage ? (
            <Alert message={formFailureMessage} type="error" />
          ) : null}
          {
            /**
             * Map over the callbacks in renderStep and render the appropriate
             * component for each one.
             */
            renderStep.callbacks.map(mapCallbacksToComponents)
          }
          <Button
            buttonText={form.buttonText}
            submittingForm={submittingForm}
          />
        </form>
        {bottomMessage}
      </Fragment>
    );
  } else {
    /**
     * Just in case things blow up.
     */
    return (
      <Alert
        message={renderStep.payload.message || 'Unknown error occurred.'}
        type="error"
      />
    );
  }
}
