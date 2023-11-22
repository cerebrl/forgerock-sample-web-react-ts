import Widget, { journey } from '@forgerock/login-widget';
import { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { JOURNEY_REGISTER } from '../../../constants';

import { AppContext } from '../../../global-state';
import apiRequest from '../../../utilities/request';

type WidgetProps = { journeyName: string; topMessage: JSX.Element };

function LoginWidget({ journeyName = 'Login', topMessage }: WidgetProps) {
  const [_, methods] = useContext(AppContext);
  const navigate = useNavigate();
  const widgetElement = useRef<HTMLDivElement>(null);

  async function initUserInDb() {
    await apiRequest('users', 'POST');
  }

  useEffect(() => {
    const journeyEvents = journey();
    const journeyEventsUnsub = journeyEvents.subscribe((event) => {
      console.log(event);

      if (journeyName === JOURNEY_REGISTER && event?.journey?.successful) {
        initUserInDb();
      }

      if (event?.user?.successful) {
        if (event?.user?.response) {
          const user = event.user.response as { name: string; email: string };
          /**
           * Set user state/info on "global state"
           */
          methods.setUser(user.name);
          methods.setEmail(user.email);
          methods.setAuthentication(true);
        }
        navigate('/');
      }
    });
    journeyEvents.start({ journey: journeyName });

    // Unsubscribe when component is unmounted
    return () => {
      journeyEventsUnsub();
    };
  }, []);

  useEffect(() => {
    // Instantiate the Widget and assign it to a variable
    const widget = new Widget({
      // Target needs to be an actual DOM element, so ref is needed with inline type
      target: widgetElement.current as HTMLDivElement,
      props: { type: 'inline' },
    });

    // Ensure you return a function that destroys the Widget on unmount
    return () => {
      widget.$destroy();
    };
  }, []);

  return (
    <>
      {topMessage}
      <div ref={widgetElement}></div>
    </>
  );
}

export default LoginWidget;
