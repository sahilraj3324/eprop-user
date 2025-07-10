import "./globals.css";
import Footer from "@/components/Footer";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  title: "Property Portal",
  description: "Find your dream property",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">
            <ClientLayout>
              {children}
            </ClientLayout>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
} 