import { Autocomplete, TextField, Typography } from '@mui/material'
import type { AppFieldPath } from '../../reactHookForm/entity'
import { Controller, type Control, type FieldPathValue, type FieldValues } from 'react-hook-form'
import { useTeamMembersQuery } from '../../queries'
import Loader from '../../pages/Loader'

type TeamMemberAutoCompleteProps<TFieldValues extends FieldValues> = {
  fieldPath: FieldPathValue<TFieldValues, AppFieldPath>
  control: Control<TFieldValues>
}

export default function TeamMemberAutoComplete<TFieldValues extends FieldValues>({
  fieldPath,
  control,
}: TeamMemberAutoCompleteProps<TFieldValues>) {
  const { data: teamMembers, isLoading, isError } = useTeamMembersQuery()

  if (isLoading) {
    return <Loader />
  }

  if (!teamMembers || isError) {
    return <Typography>Žádní členové týmu nebyli nalezeni.</Typography>
  }

  const teamMemberOptions = teamMembers.map((member) => ({
    id: member.userId,
    name: member.user.name,
  }))

  // const teamMembers = [{ id: 'google-oauth2|113238590142888685973', name: 'Vojtěch Laurin' }]

  return (
    <Controller
      name={fieldPath}
      control={control}
      render={({ field }) => {
        const selectedOption = teamMemberOptions.find((option) => option.id === field.value) || null

        return (
          <Autocomplete
            options={teamMemberOptions}
            getOptionLabel={(option) => option.name}
            value={selectedOption}
            onChange={(_, newValue) => field.onChange(newValue?.id ?? null)}
            isOptionEqualToValue={(option, value) => value != null && option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Vyberte člena týmu" />}
          />
        )
      }}
    />
  )
}
