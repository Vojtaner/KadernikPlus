import type { FieldValues, Path, Control } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import AutoComplete from '../../../app/components/AutoComplete'
import Loader from '../../../components/Loader'
import { useTeamMembersQuery } from '../queries'

type TeamMemberAutoCompleteProps<TFieldValues extends FieldValues> = {
  fieldPath: Path<TFieldValues>
  control: Control<TFieldValues>
}

export default function TeamMemberAutoComplete<TFieldValues extends FieldValues>({
  fieldPath,
  control,
}: TeamMemberAutoCompleteProps<TFieldValues>) {
  const { data: teamMembers, isLoading, isError } = useTeamMembersQuery()
  const intl = useIntl()

  if (isLoading) {
    return <Loader />
  }

  if (!teamMembers || isError) {
    return <FormattedMessage defaultMessage="Žádní členové týmu nebyli nalezeni." id="teamMembers.notFound" />
  }

  if (teamMembers.length === 0) {
    return null
  }

  const teamMemberOptions = teamMembers.map((member) => ({
    id: member.userId,
    name: member.user.name,
  }))

  return (
    <AutoComplete
      placeholder={intl.formatMessage({
        id: 'teamAutoComplete.search',
        defaultMessage: 'Hledejte...',
      })}
      options={teamMemberOptions}
      getOptionLabel={(o) => o.name}
      getOptionValue={(o) => o.id}
      control={control}
      fieldPath={fieldPath}
      label={intl.formatMessage({
        id: 'teamAutoComplete.chooseMember',
        defaultMessage: 'Vyberte člena týmu',
      })}
    />
  )
}
