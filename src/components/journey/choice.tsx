/*
 * forgerock-sample-web-react
 *
 * choice.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { ChangeEvent, useContext } from 'react';

import { AppContext } from '../../global-state';
import { ChoiceCallback } from '@forgerock/javascript-sdk';

/**
 * @function Choice - React component used for displaying choices
 * @param {Object} props - React props object passed from parent
 * @param {Object} props.callback - The callback object from AM
 * @returns {Object} - React component object
 */
export default function Choice({
  callback,
  inputName = 'ChoiceCallbackInput',
}: {
  callback: ChoiceCallback;
  inputName?: string;
}) {
  const [state] = useContext(AppContext);

  /** *************************************************************************
   * SDK INTEGRATION POINT
   * Summary: SDK callback methods for getting values
   * --------------------------------------------------------------------------
   * Details: Each callback is wrapped by the SDK to provide helper methods
   * for accessing values from the callbacks received from AM
   ************************************************************************* */
  const prompt = callback.getPrompt();
  const choiceOptions = callback.getChoices();
  const defaultChoice = callback.getDefaultChoice();

  /**
   * @function setValue - Sets the value on the callback on element blur (lose focus)
   * @param {Object} event
   */
  function setValue(event: ChangeEvent<HTMLSelectElement>) {
    /** ***********************************************************************
     * SDK INTEGRATION POINT
     * Summary: SDK callback methods for setting values
     * ------------------------------------------------------------------------
     * Details: Each callback is wrapped by the SDK to provide helper methods
     * for writing values to the callbacks received from AM
     *********************************************************************** */
    callback.setChoiceIndex(Number((event.target as HTMLSelectElement).value));
  }

  return (
    <div className='cstm_form-floating form-floating mb-3'>
      <select
        onChange={setValue}
        id={inputName}
        name='selected'
        className={`cstm_form-select form-select bg-transparent ${state.theme.textClass} ${state.theme.borderClass}`}>
        {choiceOptions.map(function (option: string, idx: number) {
          return (
            <option key={idx} value={idx} selected={idx === defaultChoice}>
              {option}
            </option>
          );
        })}
      </select>
      <label htmlFor={inputName}>{prompt}</label>
    </div>
  );
}
