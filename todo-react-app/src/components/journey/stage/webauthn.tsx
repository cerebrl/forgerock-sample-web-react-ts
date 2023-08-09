/*
 * forgerock-sample-web-react
 *
 * webauthn.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { useEffect } from 'react';

import {
  type FRStep,
  FRWebAuthn,
  WebAuthnStepType,
} from '@forgerock/javascript-sdk';
import Loading from '../../utilities/loading';

/**
 * @function Choice - React component used for displaying choices
 * @param {Object} props - React props object passed from parent
 * @param {Object} props.callback - The callback object from AM
 * @returns {Object} - React component object
 */
export default function WebAuthn({
  step,
  onComplete,
}: {
  step: FRStep;
  onComplete: () => void;
}) {
  /** *************************************************************************
   * SDK INTEGRATION POINT
   * Summary: SDK callback methods for getting values
   * --------------------------------------------------------------------------
   * Details: Each callback is wrapped by the SDK to provide helper methods
   * for accessing values from the callbacks received from AM
   ************************************************************************* */
  const webAuthnStep = FRWebAuthn.getWebAuthnStepType(step);

  useEffect(() => {
    async function performWebAuthn() {
      if (webAuthnStep === WebAuthnStepType.Registration) {
        FRWebAuthn.register(step);
      } else {
        FRWebAuthn.authenticate(step);
      }
      onComplete();
    }
    performWebAuthn();
  }, []);

  return <Loading message={'Please verify with your device.'} />;
}
