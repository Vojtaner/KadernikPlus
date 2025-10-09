import { Button, Stack, Typography } from '@mui/material'
import PricingCard from '../../app/components/PricingCard'
import { useSubscriptionMutation, useSubscriptionQuery } from '../../queries'
import { getSubscriptionText } from '../../entity'
import { useAuth0 } from '@auth0/auth0-react'
import AppTheme from '../../AppTheme'
import LogoutIcon from '@mui/icons-material/Logout'
import { FormattedMessage, useIntl } from 'react-intl'
import { getGreeting } from '../entity'

export const SubscriptionPage = () => {
  const { mutate, error } = useSubscriptionMutation()
  const { data: subscription } = useSubscriptionQuery()
  const { user, logout } = useAuth0()
  const intl = useIntl()

  return (
    <Stack spacing={2} alignItems="center" justifyContent="center">
      <Typography variant="h4" fontWeight="bold" align="center">
        <FormattedMessage id="subscriptionPage.welcome" defaultMessage="Vítejte v aplikaci!" />
      </Typography>
      <Typography variant="h4" fontWeight="bold" color="primary">
        <FormattedMessage id="subscriptionPage.headline" defaultMessage="Kadeřník+" />
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth={500} width="95vw">
        <strong style={{ color: AppTheme.palette.primary.main }}>
          {user
            ? `${intl.formatMessage({ id: 'subscriptionPage.greeting', defaultMessage: 'Dobrý den,' })} ${getGreeting(user)} `
            : ''}
        </strong>
        {intl.formatMessage({
          id: 'subscriptionPage.introduction.1',
          defaultMessage: ' děkujeme za Váš zájem – naše služba funguje na bázi',
        })}
        <strong>
          {intl.formatMessage({
            id: 'subscriptionPage.introduction.2',
            defaultMessage: ' měsíčního předplatného',
          })}
        </strong>
        {intl.formatMessage({
          id: 'subscriptionPage.introduction.3',
          defaultMessage: ', které se',
        })}
        <strong>
          {intl.formatMessage({
            id: 'subscriptionPage.introduction.4',
            defaultMessage: 'automaticky obnovuje',
          })}
        </strong>
        {intl.formatMessage({
          id: 'subscriptionPage.introduction.5',
          defaultMessage: '. Předplatné můžete kdykoliv zrušit v záložce ',
        })}
        <strong>
          {intl.formatMessage({
            id: 'subscriptionPage.introduction.6',
            defaultMessage: 'MŮJ PROFIL',
          })}
        </strong>
        {intl.formatMessage({
          id: 'subscriptionPage.introduction.7',
          defaultMessage: '. Peníze za započatý měsíc jsou však nevratné.',
        })}
      </Typography>
      {error && error.code === 410 && (
        <>
          <Typography color="info" align="center">
            <FormattedMessage
              id="subscriptionPage.deletedAccount"
              defaultMessage=" Mrzí nás to, Váš účet musel být před časem vymazán a nelze ho již znovu použít. Pro další postup nás
            kontaktujte na"
            />
            <u style={{ fontWeight: 'bold' }}>podpora@kadernikplus.cz</u>
          </Typography>
        </>
      )}
      <Button variant="contained" onClick={() => logout()} startIcon={<LogoutIcon />}>
        {intl.formatMessage({ id: 'logOut', defaultMessage: 'Odhlásit se' })}
      </Button>
      {subscription && (
        <>
          <Typography variant="body1" color="info" textAlign="center" maxWidth={500}>
            <FormattedMessage id="subscriptionPage.yourSubscription" defaultMessage="Vaše předplatné " />
            <strong>{getSubscriptionText(new Date(subscription.endDate), subscription.status)}</strong>
          </Typography>
          {subscription.status === 'ACTIVE' && (
            <Button href={window.location.origin}>
              <FormattedMessage id="subscriptionPage.enterApp" defaultMessage="Přejít do aplikace" />
            </Button>
          )}
        </>
      )}
      {!(error && error.code === 410) && (
        <PricingCard
          title="Cena"
          price="Kč 139"
          period="/měsíc"
          description="Co všechno je v ceně:"
          features={[
            'Osobní diář návštěv',
            'Správa procedur všech návštěv',
            'Chytré vyskladňování skladu',
            'Automatický nákupní seznam',
            'Hlídací pes zásob',
            'Přehled tržeb a nákladů',
            'Sdílený skladu a vyúčtování',
            'a další...',
          ]}
          ctaText="Zaplatit"
          onClick={() => mutate({ currency: 'CZK', plan: 'pro', price: 13900, status: 'PENDING' })}
          active
        />
      )}
    </Stack>
  )
}
