import "./globals.css";

export const metadata = {
    title: 'portfolio',
    description: 'portfolio app',
    icons: {
      icon: '/favicon.webp',
    },
  };

export default async function RootLayout({ children }) {

    return (
            <html lang="bg">
                <body>
                    {children}
                </body>
            </html>
    );
}
