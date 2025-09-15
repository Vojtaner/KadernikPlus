import React, { useCallback, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import TextField from '../app/components/TextField'
import { Button, Grid, IconButton, Stack, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

type Contact = {
  firstName?: string
  lastName?: string
  phone?: string
}
type ContactList = {
  contacts: Contact[]
}

export const ContactPicker: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const { control, setValue } = useForm<ContactList>({ defaultValues: { contacts: [] } })
  const { fields, insert, remove } = useFieldArray({ control, name: 'contacts' })

  const isSupported = 'contacts' in navigator && 'ContactsManager' in window

  const pickContacts = async () => {
    setError(null)

    if (isSupported) {
      try {
        const selectedContacts: ContactPicker[] = await navigator.contacts.select(['name', 'tel'], {
          multiple: true,
        })
        setContactsToForm(selectedContacts)
      } catch (error) {
        setError('Výběr kontaktů byl zrušen nebo selhal.')
        console.error(error)
      }
    } else {
      setError('Tento prohlížeč nepodporuje Contacts Picker API použijte Google Chrome v mobilu.')
    }
  }

  const setContactsToForm = useCallback(
    (selectedContacts: ContactPicker[]) => {
      {
        selectedContacts.map((contact, index) => {
          const name = contact.name?.[0].split(' ')
          const phone = contact.tel?.[0]
          const firstName = name?.[0]
          const lastName = name?.[1]
          insert(index, { firstName, lastName, phone })
        })
      }
    },
    [setValue]
  )

  return (
    <Stack style={{ padding: '1rem' }} direction="row">
      <Button onClick={pickContacts}>Vybrat kontakty</Button>

      {error && <Typography style={{ color: 'red' }}>{error}</Typography>}

      {fields.map((field, index) => {
        return (
          <Stack key={field.id} spacing={0.5}>
            <Button onClick={() => remove(index)}>Smazat</Button>
            <Grid container spacing={2} alignItems="center">
              <Grid size={3}>
                <TextField fieldPath={`contacts.${index}.firstName`} control={control} />
              </Grid>
              <Grid size={3}>
                <TextField fieldPath={`contacts.${index}.lastName`} control={control} />
              </Grid>
              <Grid size={4}>
                <TextField fieldPath={`contacts.${index}.phone`} control={control} />
              </Grid>
              <Grid size={2}>
                <IconButton onClick={() => remove(index)} color="error">
                  <DeleteOutlineIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Button onClick={() => alert('Kontakty uloženy')}>Uložit kontakty</Button>
          </Stack>
        )
      })}
    </Stack>
  )
}
