import "./globals.css";
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@/components/ToastProvider";
import { DarkModeProvider } from "@/components/DarkModeProvider";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata = {
  title: "FoodSave | Smart Food Waste Management",
  description: "Reduce food waste, manage meals and track donations intelligently."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-slate-900 transition-colors">
        <DarkModeProvider>
          <AuthProvider>
            <ToastProvider>
              <Navbar />
              {children}
            </ToastProvider>
          </AuthProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}