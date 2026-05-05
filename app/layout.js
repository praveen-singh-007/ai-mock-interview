import {  Mona_Sans } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Prep-Wise",
  description: "An AI powered platform for Mock Interviews.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="dark"
    >
      <body className={`${monaSans.variable} antialiased pattern`}>{children}
        <Toaster/>
      </body>
    </html>
  );
}
