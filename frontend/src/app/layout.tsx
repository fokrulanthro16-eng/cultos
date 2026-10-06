import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CultOS | Autonomous Cultural Intelligence Engine",
  description:
    "Empirical cross-domain cultural taste discovery grounding LLMs in Qloo's 250M+ entity Taste Graph for brand sponsorships and tour activations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070b14] text-slate-100 antialiased selection:bg-amber-400 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
