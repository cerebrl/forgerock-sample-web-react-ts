# React JS Todo Sample App

## Disclaimers

This sample code is provided "as is" and is not a supported product of ForgeRock. It's purpose is solely to demonstrate how the ForgeRock JavaScript Tooling can be implemented within a React application. Also, this is not a demonstration of React itself or instructional for _how_ to build a React app. There are many aspects to routing, state management, tooling and other aspects to building a React app that are outside of the scope of this project. For information about creating a React app, [visit React's official documentation](https://reactjs.org/docs/create-a-new-react-app.html).

## Requirements

1. An instance of ForgeRock's Access Manager (AM), either within a ForgeRock's Identity Cloud tenant, your own private installation or locally installed on your computer
2. Node >= 14.2.0 (recommended: install via [official package installer](https://nodejs.org/en/))
3. Knowledge of using the Terminal/Command Line
4. This project "cloned" to your computer

## Setup

Once you have the requirements above met, we can build the project.

### Setup Your AM Instance

#### Configure CORS

1. Allowed origins: `http://localhost:5173`, `http://localhost:5174`, `http://localhost:5175`
2. Allowed methods: `GET` `POST`
3. Allowed headers: `Content-Type` `X-Requested-With` `Accept-API-Version` `Authorization`
4. Allow credentials: enabled

#### Create Your OAuth Clients

1. Create a public (SPA) OAuth client for the web app: name of `WebOAuthClient`, withOUT a secret, scopes of `openid email`, implicit consent _enabled_, and `none` "token authentication endpoint method".
2. Create a confidential (Node.js) OAuth client for the API server: name of `RestOAuthClient`, WITH a secret, default scope of `am-introspect-all-tokens`, and `client_secret_basic` as the "token authentication endpoint method".

#### Use Default Journeys/Trees

1. Login
2. Register

Note: The sample app currently supports the following callbacks only:

- NameCallback
- PasswordCallback
- ChoiceCallback
- ValidatedCreateUsernameCallback
- ValidatedCreatePasswordCallback
- StringAttributeInputCallback
- BooleanAttributeInputCallback
- KbaCreateCallback
- TermsAndConditionsCallback
- DeviceProfileCallback

### Configure Your `.env` File

Change the name of `.env.example` to `.env` and replace the bracketed values (e.g. `<<<helper-text>>>`) with your values.

Example with annotations:

```text
# System settings
VITE_AM_URL=<<<YOUR AM INSTANCE>>>
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:5174

# AM settings
VITE_AM_JOURNEY_LOGIN=Login
VITE_AM_JOURNEY_REGISTER=Registration
VITE_AM_TIMEOUT=5000
VITE_AM_REALM_PATH=alpha
VITE_AM_WEB_OAUTH_CLIENT=WebOAuthClient
VITE_AM_WEB_OAUTH_SCOPE=openid email
VITE_AM_WEB_OAUTH_REDIRECT_URI=http://localhost:5173/login

# Client settings
VITE_DEBUGGER_OFF=true
VITE_DEVELOPMENT=true

# Server settings
AM_REST_OAUTH_CLIENT=RestOAuthClient
AM_REST_OAUTH_SECRET=<<<YOUR SECRET>>>
API_PORT=5174

# Token Vault settings
VITE_TOKEN_VAULT_APP_ORIGIN=http://localhost:5173
VITE_TOKEN_VAULT_INTERCEPTOR_FILE=workers/interceptor.ts
VITE_TOKEN_VAULT_INTERCEPTOR_SCOPE=/
VITE_TOKEN_VAULT_PROXY_ORIGIN=http://localhost:5174

# UX settings
VITE_EMBEDDED_LOGIN=true
VITE_USE_LOGIN_WIDGET=false
VITE_USE_TOKEN_VAULT=false
```

### Installing Dependencies and Run Build

**Run from root of repo**: since this sample app uses npm's workspaces, we recommend running the npm commands from the root of the repo.

```sh
# Install all dependencies
npm install
```

### Run the Servers

Now, run the below commands to start the processes needed for building the application and running the servers for both client and API server:

```sh
# In one terminal window, run the following app command
npm run dev:app
```

```sh
# In a separate terminal window, run the server command
npm run dev:server
```

```sh
# If Token Vault is enabled, a third, separate terminal window, run the proxy command
npm run dev:proxy
```

Now, you should be able to visit `http://localhost:5173`, which is your web app or client (the Relying Party in OAuth terms). This client will make requests to your AM instance, (the Authorization Server in OAuth terms), which will be your Identity Cloud tenant, and `http://localhost:5174` as the REST API for your todos (the Resource Server). Finally, your proxy, if you have Token Vault enabled, will be running on `http://localhost:5175`.

## Learn About Integration Touchpoints

This project has a debugging statements that can be activated which causes the app to pause execution at each SDK integration point. It will have a comment above the `debugger` statement explaining the purpose of the integration.

If you'd like to use this feature as a learning tool, [open the live app](https://fr-react-todos.crbrl.io/) and then open the developer tools of your browser. Rerun the app with the developer tools open, and it will automatically pause at these points of integration.

For local development, if you want to turn these debuggers off, you can set the environment variable of `DEBUGGER_OFF` to true.

## Modifying This Project

### React Client

To modify the client portion of this project, you'll need to be familiar with the following React patterns:

1. [Functional components and composition](https://reactjs.org/docs/components-and-props.html)
2. [Hooks (including custom hooks)](https://reactjs.org/docs/hooks-intro.html)
3. [Context API](https://reactjs.org/docs/hooks-reference.html#usecontext)
4. [React Router](https://reactrouter.com/)

You'll also want a [basic understanding of Vite](https://vitejs.dev/guide/) and [TypeScript](https://www.typescriptlang.org/docs/).

#### Styling and CSS

We heavily leveraged [Twitter Bootstrap](https://getbootstrap.com/) and [it's utility classes](https://getbootstrap.com/docs/5.0/utilities/api/), but you will see classes with the prefix `cstm_`. These are custom classes, hence the `cstm` shorthand, and they are explicitly used to denote an additional style application on top of Bootstrap's styling.

### REST API Server

To modify the API server, you'll need a [basic understanding of Node](https://nodejs.org/en/about/) as well as the following things:

1. [Express](https://expressjs.com/)
2. [PouchDB](https://pouchdb.com/)
3. [Superagent](https://www.npmjs.com/package/superagent)
4. [TypeScript](https://www.typescriptlang.org/docs/)

### Token Vault

If Token Vault is enabled, you'll want to familiarize yourself with the following as it is fundamental to how the Token Vault Plugin works:

1. [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
2. [iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)
3. [Post messaging with the `MessageChannel` interface](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel)

#### Configuring, Registering the Token Vault Client

When the Token Vault feature is enabled, a block of code in this file will be activated: `todo-react-app/src/index.tsx`. This is where the Token Vault client is configured and the associated Interceptor and Proxy is registered.

#### Configuring the Interceptor (Service Worker)

The Interceptor can be found here: `todo-react-app/src/workers/interceptor.ts`. The essential configuration is the array of URLs you want the Interceptor to catch and forward to the proxy, and your ForgeRock configuration.

#### Configuring the Proxy (iframe)

The Proxy can be found here: `token-vault-proxy/src/index.ts`. The essential configuration is the main, React app's origin and the ForgeRock configuration.
