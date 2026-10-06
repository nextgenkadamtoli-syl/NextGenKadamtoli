import "./globals.css";
import { Hind_Siliguri } from "next/font/google";
import Nav from "../components/Nav";
const font = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "600", "700"], variable: "--font" });
export const metadata = { title: "NextGen Kadamtoli", description: "একসাথে করি, একসাথে গড়ি।" };
export default function RootLayout({ children }) {
  return (
    <html lang="bn"><body className={font.variable}>
      <Nav /><main className="wrap">{children}</main>
    </body></html>
  );
}
