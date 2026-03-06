import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "VibeShop AI | The Future of Commerce",
  description: "Generate a high-conversion digital storefront in 60 seconds with AI.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "rgba(8, 4, 8, 0.8)",
              color: "#fff",
              border: "1px solid rgba(0, 229, 255, 0.3)",
              boxShadow: "0 0 20px rgba(0, 229, 255, 0.15)",
              borderRadius: "100px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "0.05em",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            },
            success: {
              iconTheme: {
                primary: "#00E5FF",
                secondary: "#080408",
              },
            },
            error: {
              style: {
                border: "1px solid rgba(192, 21, 42, 0.3)",
                boxShadow: "0 0 20px rgba(192, 21, 42, 0.15)",
              },
              iconTheme: {
                primary: "#C0152A",
                secondary: "#080408",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
