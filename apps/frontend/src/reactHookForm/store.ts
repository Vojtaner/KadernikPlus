import { useForm, useFormContext, useWatch, type Mode } from 'react-hook-form'
import type { AppFormState, AppFieldPath } from './entity'

export const useAppForm = (options?: { defaultValues?: Partial<AppFormState>; mode?: Mode }) => {
  const methods = useForm<AppFormState>({
    defaultValues: options?.defaultValues,
    mode: options?.mode,
  })

  return methods
}

export const useAppFormContext = () => {
  const methods = useFormContext<AppFormState>()

  return methods
}

export const useAppCurrentWatch = (fieldPath: AppFieldPath) => {
  const { getValues, control } = useAppFormContext()

  useWatch({ control, name: fieldPath })

  return getValues(fieldPath)
}
