import "./globals.css";
import { Hind_Siliguri } from "next/font/google";
import Nav from "../components/Nav";
import PWA from "../components/PWA";
const font = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "600", "700"], variable: "--font" });
export const metadata = {
  title: "NextGen Kadamtoli",
  description: "একসাথে করি, একসাথে গড়ি।",
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "Kadamtoli", statusBarStyle: "default" },
};
export const viewport = { themeColor: "#0E5A3C", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }) {
  return (
    <html lang="bn"><body className={font.variable}>
      <Nav /><PWA /><main className="wrap">{children}</main>
    </body></html>
  );
}
