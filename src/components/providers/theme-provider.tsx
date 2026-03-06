
"use client"

import * as React from "react"

type Theme = "dark" | "light" | "system"
export type ColorScheme = "default" | "latte" | "frappe" | "macchiato" | "mocha"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultColorScheme?: ColorScheme
  storageKey?: string
  colorStorageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  colorScheme: "default",
  setColorScheme: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorScheme = "default",
  storageKey = "devtools-theme",
  colorStorageKey = "devtools-color-scheme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme)
  const [colorScheme, setColorScheme] = React.useState<ColorScheme>(defaultColorScheme)

  // Load from localStorage only after mounting
  React.useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
    const savedColor = localStorage.getItem(colorStorageKey) as ColorScheme
    if (savedColor) {
      setColorScheme(savedColor)
    }
  }, [storageKey, colorStorageKey])

  React.useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")
    root.setAttribute("data-color-scheme", colorScheme)

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme, colorScheme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
    colorScheme,
    setColorScheme: (newScheme: ColorScheme) => {
      localStorage.setItem(colorStorageKey, newScheme)
      setColorScheme(newScheme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
