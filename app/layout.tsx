import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AccessibilityDevHelper – Screen Reader Simulation for Developers",
  description: "Simulate screen reader behavior, validate ARIA attributes, and test keyboard navigation without real screen reader software."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
