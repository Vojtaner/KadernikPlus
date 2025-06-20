import AppTheme from './AppTheme'

export type AppPalette = typeof AppTheme.palette
export type AppPaletteColor = keyof AppPalette
export type AppPaletteShade<C extends AppPaletteColor> = keyof AppPalette[C]

export type AppPaletteColorString = `${AppPaletteColor}.${string}`
