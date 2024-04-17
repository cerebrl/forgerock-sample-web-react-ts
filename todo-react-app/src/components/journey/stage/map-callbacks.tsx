import {
  AttributeInputCallback,
  ChoiceCallback,
  FRCallback,
  KbaCreateCallback,
  PasswordCallback,
  PingOneProtectEvaluationCallback,
  PingOneProtectInitializeCallback,
  TermsAndConditionsCallback,
  ValidatedCreatePasswordCallback,
} from '@forgerock/javascript-sdk';

import Boolean from '../callbacks/boolean';
import Choice from '../callbacks/choice';
import Kba from '../callbacks/kba';
import Password from '../callbacks/password';
import TermsConditions from '../callbacks/terms-conditions';
import Text from '../callbacks/text';
import Unknown from '../callbacks/unknown';
import ValidatedCreatePassword from '../callbacks/validate-create-password';
import Protect from '../callbacks/protect';

/**
 * Iterate through callbacks received from AM and map the callback to the
 * appropriate callback component, pushing that component
 * the StepComponent's array.
 */
export function mapCallbacksToComponents(cb: FRCallback, idx: number) {
  const name = cb?.payload?.input?.[0].name;
  /** *********************************************************************
   * SDK INTEGRATION POINT
   * Summary:SDK callback method for getting the callback type
   * ----------------------------------------------------------------------
   * Details: This method is helpful in quickly identifying the callback
   * when iterating through an unknown list of AM callbacks
   ********************************************************************* */
  switch (cb.getType()) {
    case 'ChoiceCallback':
      return (
        <Choice callback={cb as ChoiceCallback} inputName={name} key={name} />
      );
    case 'DeviceProfileCallback':
      return (
        <p>
          This sample app doesn't support DeviceProfileCallback combined with
          other callbacks.
        </p>
      );
    case 'NameCallback':
    case 'ValidatedCreateUsernameCallback':
    case 'StringAttributeInputCallback':
      return (
        <Text
          callback={cb as AttributeInputCallback<string>}
          inputName={name}
          key={name}
        />
      );
    case 'PasswordCallback':
      return (
        <Password
          callback={cb as PasswordCallback}
          inputName={name}
          key={name}
        />
      );
    case 'ValidatedCreatePasswordCallback':
      return (
        <ValidatedCreatePassword
          callback={cb as ValidatedCreatePasswordCallback}
          inputName={name}
          key={name}
        />
      );
    case 'BooleanAttributeInputCallback':
      return (
        <Boolean
          callback={cb as AttributeInputCallback<boolean>}
          inputName={name}
          key={name}
        />
      );
    case 'TermsAndConditionsCallback':
      return (
        <TermsConditions
          callback={cb as TermsAndConditionsCallback}
          inputName={name}
          key={name}
        />
      );
    case 'KbaCreateCallback':
      return (
        <Kba callback={cb as KbaCreateCallback} inputName={name} key={name} />
      );
    case 'PingOneProtectInitializeCallback':
      return <Protect callback={cb as PingOneProtectInitializeCallback} />;
    case 'PingOneProtectEvaluationCallback':
      return <Protect callback={cb as PingOneProtectEvaluationCallback} />;
    default:
      // If current callback is not supported, render a warning message
      return <Unknown callback={cb} key={`unknown-${idx}`} />;
  }
}
