/*
 * forgerock-sample-web-react
 *
 * button.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

export default function Button({
  buttonText = 'Submit',
  submittingForm,
}: {
  buttonText: string;
  submittingForm: boolean;
}) {
  return (
    <button
      type="submit"
      className="btn btn-primary w-100"
      disabled={submittingForm}
    >
      {
        /**
         * Render a small spinner during submission calls
         */
        submittingForm ? (
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
        ) : null
      }
      <span> {buttonText}</span>
    </button>
  );
}
