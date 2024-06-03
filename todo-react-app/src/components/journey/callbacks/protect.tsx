/*
 * forgerock-sample-web-react
 *
 * protect.tsx
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

// Import libraries
import {
  PingOneProtectEvaluationCallback,
  PingOneProtectInitializeCallback,
} from '@forgerock/javascript-sdk';
import { PIProtect } from '@forgerock/ping-protect';
import { useEffect } from 'react';
import Loading from '../../utilities/loading';

/**
 * @function Boolean - React component used for displaying checkboxes
 * @param {Object} props - React props object passed from parent
 * @param {Object} props.callback - The callback object from AM
 * @returns {Object} - React component object
 */
export default function Protect({
  callback,
  submit,
}: {
  callback: PingOneProtectInitializeCallback | PingOneProtectEvaluationCallback;
  submit: () => void;
}) {
  /** *************************************************************************
   * SDK INTEGRATION POINT
   * Summary: SDK callback methods for getting values
   * --------------------------------------------------------------------------
   * Details: Each callback is wrapped by the SDK to provide helper methods
   * for accessing values from the callbacks received from AM
   ************************************************************************* */

  useEffect(() => {
    async function callPingProtect() {
      if (callback instanceof PingOneProtectInitializeCallback) {
        const config = callback.getConfig();
        await PIProtect.start(config);
        submit();
      } else {
        const data = await PIProtect.getData();
        callback.setData(data);
        submit();
      }
    }
    callPingProtect();
  }, []);

  return <Loading message="Profiling ... " />;
}
