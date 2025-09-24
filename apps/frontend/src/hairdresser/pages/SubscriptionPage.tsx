import { Button, Stack, Typography } from '@mui/material'
import PricingCard from '../../app/components/PricingCard'
import { useSubscriptionMutation, useSubscriptionQuery } from '../../queries'
import { getSubscriptionText } from '../../entity'
import { useAuth0 } from '@auth0/auth0-react'
import { isWoman, vocative } from 'czech-vocative'
import { capitalizeFirstLetter } from '../SmsTabs'
import AppTheme from '../../AppTheme'
import LogoutIcon from '@mui/icons-material/Logout'
import { useIntl } from 'react-intl'

export const SubscriptionPage = () => {
  const { mutate, error } = useSubscriptionMutation()
  const { data: subscription } = useSubscriptionQuery()
  const { user, logout } = useAuth0()
  const intl = useIntl()

  return (
    <Stack height="100vh" spacing={2} alignItems="center" justifyContent="center">
      <Typography variant="h3" fontWeight="bold">
        Vítejte v aplikaci!
      </Typography>
      <Typography variant="h4" fontWeight="bold" color="primary">
        Kadeřník+
      </Typography>

      <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth={500} width="95vw">
        <strong
          style={{
            color: AppTheme.palette.primary.main,
          }}>{`Dobrý den, ${isWoman(user?.family_name ?? '') ? 'paní' : 'pane'} ${capitalizeFirstLetter(vocative(user?.family_name ?? ''))}, `}</strong>
        děkujeme za Váš zájem – naše služba funguje na bázi <strong>měsíčního předplatného</strong>, které se
        <strong> automaticky obnovuje</strong>. Předplatné můžete kdykoliv zrušit v záložce <strong>MŮJ PROFIL</strong>.
        Peníze za započatý měsíc jsou však nevratné.
      </Typography>
      {error && error.code === 410 && (
        <>
          <Typography color="info" align="center">
            Mrzí nás to, Váš účet musel být před časem vymazán a nelze ho již znovu použít. Pro další postup nás
            kontaktujte na <u style={{ fontWeight: 'bold' }}>podpora@kadernikplus.cz</u>
          </Typography>
          <Button variant="contained" onClick={() => logout()} startIcon={<LogoutIcon />}>
            {intl.formatMessage({ id: 'logOut', defaultMessage: 'Odhlásit se' })}
          </Button>
        </>
      )}
      {subscription && (
        <>
          <Typography variant="body1" color="info" textAlign="center" maxWidth={500}>
            Vaše předplatné <strong>{getSubscriptionText(new Date(subscription.endDate), subscription.status)}</strong>
          </Typography>
          {subscription.status === 'ACTIVE' && <Button href={window.location.origin}>Přejít do aplikace</Button>}
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
