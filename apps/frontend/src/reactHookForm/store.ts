import { useForm, useFormContext } from 'react-hook-form'
import type { AppFormState, AppFieldPath, ClientForm } from './entity'

export const useAppForm = () => {
  const methods = useForm<AppFormState>()

  return methods
}

export const useAppFormContext = () => {
  const methods = useFormContext<ClientForm>()

  return methods
}

export const useAppCurrentWatch = (fieldPath: AppFieldPath) => {
  const { watch, getValues } = useAppForm()

  watch(fieldPath)

  return getValues(fieldPath)
}
