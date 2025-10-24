import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import csMessages from './locales/cs.json';
import enMessages from './locales/en.json';
import { IntlProvider } from 'react-intl';
import store from './store/store';
import { enableMocking } from './mswWorkerSetup/browser';
import { Auth0Provider } from '@auth0/auth0-react';
import { usePersistentFilters } from './hooks';
import initializeSentry from './sentry/sentry';

const messages: { [key: string]: Record<string, string> } = {
  cs: csMessages,
  en: enMessages,
};

const AppWithIntl: React.FC = () => {
  const [filter] = usePersistentFilters();
  const appMessages = messages[filter.language] || messages.cs;

  return (
    <IntlProvider locale={filter.language} messages={appMessages}>
      <App />
    </IntlProvider>
  );
};

initializeSentry();

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <Auth0Provider
      domain={import.meta.env.VITE_AUT0_DOMAIN}
      clientId={import.meta.env.VITE_AUT0_CLIENT_ID}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUT0_AUDIENCE,
        scope: 'openid profile email offline_access read:current_user',
      }}
    >
      <StrictMode>
        <Provider store={store}>
          <AppWithIntl />
        </Provider>
      </StrictMode>
    </Auth0Provider>,
  );
});
