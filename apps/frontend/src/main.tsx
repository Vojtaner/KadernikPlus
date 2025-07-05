import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider, useSelector } from 'react-redux'
import type { RootState } from './store/index.ts'
import csMessages from './locales/cs.json'
import enMessages from './locales/en.json'
import { IntlProvider } from 'react-intl'
import store from './store/index.ts'
import { enableMocking } from './mswWorkerSetup/browser.ts'

const messages: { [key: string]: Record<string, string> } = {
  cs: csMessages,
  en: enMessages,
}

const AppWithIntl: React.FC = () => {
  const currentLanguage = useSelector((state: RootState) => state.appUi.language)
  const appMessages = messages[currentLanguage] || messages.cs

  return (
    <IntlProvider locale={currentLanguage} messages={appMessages}>
      <App />
    </IntlProvider>
  )
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <AppWithIntl />
      </Provider>
    </StrictMode>
  )
})
