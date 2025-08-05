import AppTheme from './AppTheme'

export type AppPalette = typeof AppTheme.palette
export type AppPaletteColor = keyof AppPalette
export type AppPaletteShade<C extends AppPaletteColor> = keyof AppPalette[C]

export type AppPaletteColorString = `${AppPaletteColor}.${string}`

export const formatNameShort = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/)
  const firstInitial = parts[1] || ''
  const lastName = parts[0]?.charAt(0).toUpperCase() || ''
  return firstInitial ? `${lastName}. ${firstInitial}` : lastName
}
