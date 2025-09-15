import React, { useCallback, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import TextField from '../app/components/TextField'
import { Button, Stack } from '@mui/material'

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
  const isSupported = 'contacts' in navigator && 'ContactsManager' in window
  const { control, setValue } = useForm<ContactList>({ defaultValues: { contacts: [] } })
  const { fields, insert, remove } = useFieldArray({ control, name: 'contacts' })

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
      setError('Tento prohlížeč nepodporuje Contacts Picker API.')
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
      <button onClick={pickContacts}>📱 Vybrat kontakty</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {fields.map((field, index) => {
        return (
          <Stack direction="column" key={field.id}>
            <TextField fieldPath={`contacts.${index}.firstName`} control={control} />
            <TextField fieldPath={`contacts.${index}.lastName`} control={control} />
            <TextField fieldPath={`contacts.${index}.phone`} control={control} />
            <Button onClick={() => remove(index)}>Smazat</Button>
          </Stack>
        )
      })}
    </Stack>
  )
}
