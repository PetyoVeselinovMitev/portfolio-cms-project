'use client'

import GlobalSpinner from "./components/GlobalSpinner/GlobalSpinner"
import InfoModal from "./components/InfoModal/InfoModal"
import { InfoModalProvider } from "./context/InfoModalContext"
import LoadingContext from "./context/LoadingContext"
import "./globals.css"

export default function AdminLayout({ children }) {
    return (
        <html>
            <head>
                <meta name="robots" content="noindex, nofollow"/>
            </head>
            <body>
                <InfoModalProvider>
                    <LoadingContext>
                        <GlobalSpinner />
                        {children}
                    </LoadingContext>
                    <InfoModal />
                </InfoModalProvider>
            </body>
        </html>
    )
}