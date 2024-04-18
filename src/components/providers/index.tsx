import React from 'react'
import { ThemeProvider } from './ThemeProvider'
import { AuthProvider } from './AuthProvider'

type Props = {
    children: React.ReactNode
}

export default function Providers({ children }: Props) {
    return (
        <div>
            <ThemeProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </ThemeProvider>

        </div>
    )
}