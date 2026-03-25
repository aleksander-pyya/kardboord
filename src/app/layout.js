import { Montserrat } from "next/font/google";
import "./globals.css";

// Seadistame Montserrati
const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["400", "600", "900"], // 600 on SemiBold, 900 on see ülipaks Black efekt
  variable: '--font-montserrat',
});

export const metadata = {
  title: "Kardboord | Digital Vault",
  description: "Sinu lauamängude digitaalne hoidla",
};

export default function RootLayout({ children }) {
  return (
    <html lang="et">
      {/* Rakendame fondi siin body külge */}
      <body className={`${montserrat.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}