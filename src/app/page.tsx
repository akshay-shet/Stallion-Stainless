import { headers } from "next/headers";
import HomePageClient from "@/components/HomePageClient";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = searchParams ? await searchParams : {};
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isAndroid = /Android/i.test(userAgent) || params?.android !== undefined || params?.view === "android";

  return <HomePageClient isAndroid={isAndroid} />;
}
