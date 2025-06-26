import "./globals.css";

export const metadata = {
  title: "Property Portal",
  description: "Find your dream property",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
} 