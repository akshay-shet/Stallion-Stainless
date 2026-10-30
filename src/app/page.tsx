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
  const isAndroid =
    /Android/i.test(userAgent) ||
    /Mobile|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ||
    params?.android !== undefined ||
    params?.view === "android" ||
    params?.mobile !== undefined;

  // Always enable intro video so it runs cleanly on every visit
  return <HomePageClient isAndroid={isAndroid} initialShowIntro={true} />;
}


