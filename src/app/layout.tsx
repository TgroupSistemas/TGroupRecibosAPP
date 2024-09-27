"use client"; // Add this line at the top

import "./globals.css";
import { AppContextProvider } from "@/contexts/AppContext"; // Import the AppContextProvider
import Head from 'next/head'; // Import Head from next/head

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="bg-white">
      <head>
        <title>Portal Sueldos</title>
      </head>
      <body className="">
        
        <AppContextProvider> {/* Wrap the children with AppContextProvider */}
          {children}
        </AppContextProvider>
      </body>
    </html>
  );
}