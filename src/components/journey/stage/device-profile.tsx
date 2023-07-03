/*
 * forgerock-sample-web-react
 *
 * device-profile.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { useContext, useEffect } from 'react';

import { AppContext } from '../../../global-state';
import { DeviceProfileCallback, FRDevice } from '@forgerock/javascript-sdk';
import Loading from '../../utilities/loading';

/**
 * @function Choice - React component used for displaying choices
 * @param {Object} props - React props object passed from parent
 * @param {Object} props.callback - The callback object from AM
 * @returns {Object} - React component object
 */
export default function DeviceProfile({
  callback,
	onComplete,
}: {
  callback: DeviceProfileCallback;
	onComplete: () => void;
}) {
  const [state] = useContext(AppContext);

  /** *************************************************************************
   * SDK INTEGRATION POINT
   * Summary: SDK callback methods for getting values
   * --------------------------------------------------------------------------
   * Details: Each callback is wrapped by the SDK to provide helper methods
   * for accessing values from the callbacks received from AM
   ************************************************************************* */
  const message = callback.getMessage();

  useEffect(() => {
    const device = new FRDevice();

    async function getDeviceProfile() {
      // Collect user profile data
      const location = callback.isLocationRequired();
      const metadata = callback.isMetadataRequired();
      const profile = await device.getProfile({ location, metadata });

      // Set the profile on the callback
      callback.setProfile(profile);
			onComplete();
    }
    getDeviceProfile();
  }, []);

  return <Loading message={message} />;
}
