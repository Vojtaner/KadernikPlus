import { useForm, useFieldArray } from 'react-hook-form'
import { useImportClientMutation } from './client/queries'
import { Button, Grid, IconButton, Stack } from '@mui/material'
import TextField from '../app/components/TextField'
import InputFileUpload from './InputFileUpload'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

type Contact = {
  firstName: string
  lastName: string
  phone: string
}

type FormValues = {
  contacts: Contact[]
}

export const ImportAppleContacts = () => {
  const { control, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: { contacts: [] },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts',
  })
  const { mutate: importClients } = useImportClientMutation({
    onSuccess: () => {
      setValue('contacts', [])
    },
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      parseVcf(text)
    }
    reader.readAsText(file)
  }

  const parseVcf = (text: string) => {
    const cards = text.split(/END:VCARD/i)
    const parsedContacts: Contact[] = cards
      .map((card) => {
        const lines = card.split(/\r?\n/)
        let fullName = ''
        let phone = ''
        lines.forEach((line) => {
          if (line.startsWith('FN:')) {
            fullName = line.replace('FN:', '').trim()
          }
          if (line.startsWith('TEL')) {
            phone = line.split(':')[1]?.trim()
          }
        })
        if (!fullName && !phone) {
          return null
        }
        const [firstName, ...rest] = fullName.split(' ')
        const lastName = rest.join(' ')
        return { firstName, lastName, phone }
      })
      .filter(Boolean) as Contact[]

    parsedContacts.forEach((c) => append(c))
  }

  const onSubmit = (data: FormValues) => {
    importClients(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputFileUpload onChange={handleFileUpload} label="Nahrát soubor s kontakty (.vcf)" />
      {fields.map((field, index) => (
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
      ))}
      {fields.length ? <Button type="submit">Uložit</Button> : null}
    </form>
  )
}
