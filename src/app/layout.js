import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "VibeShop AI | The Future of Commerce",
  description: "Generate a high-conversion digital storefront in 60 seconds with AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster position="bottom-center" toastOptions={{ style: { background: "#080408", color: "#fff", border: "1px solid #ffffff1a", borderRadius: "1rem", backdropFilter: "blur(24px)" } }} />
      </body>
    </html>
  );
}
