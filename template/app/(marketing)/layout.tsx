import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getUser } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Marketing - SaaS Complete",
};

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  const isLoggedIn = !!user;

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
