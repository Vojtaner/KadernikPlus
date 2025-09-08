import { type Control, type FieldValues, type Path } from 'react-hook-form'
import { useTeamMembersQuery } from '../../queries'
import Loader from '../../pages/Loader'
import { FormattedMessage } from 'react-intl'
import AutoComplete from '../../app/components/AutoComplete'

type TeamMemberAutoCompleteProps<TFieldValues extends FieldValues> = {
  fieldPath: Path<TFieldValues>
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
    return <FormattedMessage defaultMessage={'Žádní členové týmu nebyli nalezeni.'} id="teamMembers.notFound" />
  }

  if (teamMembers.length === 0) {
    return null
  }

  const teamMemberOptions = teamMembers.map((member) => ({
    id: member.userId,
    name: member.user.name,
  }))

  return <AutoComplete options={teamMemberOptions} control={control} fieldPath={fieldPath} label="Vyberte člena týmu" />
}
