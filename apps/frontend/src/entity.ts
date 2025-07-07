import AppTheme from './AppTheme'

export type AppPalette = typeof AppTheme.palette
export type AppPaletteColor = keyof AppPalette
export type AppPaletteShade<C extends AppPaletteColor> = keyof AppPalette[C]

export type AppPaletteColorString = `${AppPaletteColor}.${string}`

export const formatNameShort = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/) // Split by whitespace
  const firstName = parts[0] || ''
  const lastInitial = parts[1]?.charAt(0).toUpperCase() || ''
  return lastInitial ? `${firstName} ${lastInitial}.` : firstName
}
