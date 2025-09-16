import React, { useCallback, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import TextField from '../app/components/TextField'
import { Button, Grid, IconButton, Stack, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useImportClientMutation } from './client/queries'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'

export type Contact = {
  firstName?: string
  lastName?: string
  phone?: string
}

export const ContactPicker: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const { control, setValue } = useForm<{
    contacts: Contact[]
  }>({
    defaultValues: {
      contacts: [],
    },
  })
  const { fields, insert, remove } = useFieldArray({ control, name: 'contacts' })
  const { mutate: importClients } = useImportClientMutation({
    onSuccess: () => {
      setValue('contacts', [])
    },
  })

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
      setError('Tento prohlížeč nebo Apple iOS nepodporují Contacts Picker API použijte Google Chrome v androidu.')
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
    <>
      {error && <Typography style={{ color: 'red' }}>{error}</Typography>}
      <Button onClick={pickContacts} startIcon={<PersonSearchIcon />}>
        Vybrat kontakty
      </Button>
      <Stack spacing={2}>
        {fields.map((field, index) => {
          return (
            <Stack key={field.id} spacing={0.1} padding={1}>
              <Grid container spacing={1} alignItems="center">
                <Grid size={3}>
                  <TextField fieldPath={`contacts.${index}.firstName`} control={control} />
                </Grid>
                <Grid size={3}>
                  <TextField fieldPath={`contacts.${index}.lastName`} control={control} />
                </Grid>
                <Grid size={5}>
                  <TextField fieldPath={`contacts.${index}.phone`} control={control} />
                </Grid>
                <Grid size={1}>
                  <IconButton onClick={() => remove(index)} color="error">
                    <DeleteOutlineIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Stack>
          )
        })}
      </Stack>
      {fields.length ? (
        <Button
          startIcon={<CloudUploadIcon />}
          onClick={() => {
            importClients({ contacts: fields })
          }}>
          Uložit kontakty
        </Button>
      ) : null}
    </>
  )
}
