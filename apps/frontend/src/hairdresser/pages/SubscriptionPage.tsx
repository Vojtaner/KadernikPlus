import { Stack, Typography } from '@mui/material'
import PricingCard from '../../app/components/PricingCard'
import { useSubscriptionMutation } from '../../queries'

export const SubscriptionPage = () => {
  const { mutation: createPayment } = useSubscriptionMutation()
  return (
    <Stack height="100vh" spacing={4} alignItems="center" justifyContent="center">
      <Typography variant="h3" fontWeight="bold">
        Vítejte v aplikaci!
      </Typography>
      <Typography variant="h4" fontWeight="bold" color="primary">
        Kadeřník+
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth={500}>
        Děkujeme za Váš zájem – naše služba funguje na bázi <strong>měsíčního předplatného</strong>, které se
        <strong> automaticky obnovuje</strong>. Předplatné můžeš kdykoli zrušit v záložce <strong>můj profil</strong>.
        Peníze za započatý měsíc jsou však nevratné.
      </Typography>
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
          'Možnost sdílení sklad v týmu a jeho vyúčtování',
          'a další...',
        ]}
        ctaText="Zaplatit"
        onClick={() => createPayment.mutate({ currency: 'CZK', plan: 'pro', price: 13900, status: 'PENDING' })}
        active
      />
    </Stack>
  )
}
