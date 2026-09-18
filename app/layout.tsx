import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClubSafe — Signalement des violences dans le sport",
  description:
    "Plateforme de signalement confidentiel et anonyme des violences, harcèlements et discriminations dans les clubs sportifs amateurs.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}