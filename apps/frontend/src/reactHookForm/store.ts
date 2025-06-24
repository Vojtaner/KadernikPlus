import { useForm, useFormContext, type FieldPath } from 'react-hook-form'

export type AppFormState = {
  searchBar: string
}

export type AppFieldPath = FieldPath<AppFormState>

export const useAppForm = () => {
  const methods = useForm<AppFormState>()

  return methods
}

export const useAppFormContext = () => {
  const methods = useFormContext<AppFormState>()

  return methods
}

export const useAppCurrentWatch = (fieldPath: AppFieldPath) => {
  const { watch, getValues } = useAppForm()

  watch(fieldPath)

  return getValues(fieldPath)
}
