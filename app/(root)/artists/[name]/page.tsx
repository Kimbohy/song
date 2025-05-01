import ArtistDetails from "./ArtistDetails";
import { headers } from "next/headers";

async function getArtistData(name: string) {
  // Get protocol and host from headers for absolute URL
  const headersList = headers();
  const protocol = (await headersList).get("x-forwarded-proto") || "http";
  const host = (await headersList).get("host") || "localhost:3000";
  const url = `${protocol}://${host}/api/artists/${name}`;

  const res = await fetch(url, { cache: "no-cache" });

  if (!res.ok) {
    throw new Error("Failed to fetch artist data");
  }
  return res.json();
}

export default async function ArtistPage({
  params,
}: {
  params: { name: string };
}) {
  // Await params for Next.js compatibility
  const { name } = await Promise.resolve(params);
  const artistData = await getArtistData(name);
  return <ArtistDetails initialData={artistData} />;
}
