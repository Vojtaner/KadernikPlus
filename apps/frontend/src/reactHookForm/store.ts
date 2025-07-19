import { useForm, useFormContext } from 'react-hook-form'
import type { AppFormState, AppFieldPath } from './entity'

export const useAppForm = (options?: { defaultValues?: Partial<AppFormState> }) => {
  const methods = useForm<AppFormState>({
    defaultValues: options?.defaultValues,
  })

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
