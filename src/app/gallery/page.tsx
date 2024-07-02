import Gallery from "../_components/gallery/gallery";

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const location = searchParams?.location as "executive" | "saran" | "visvesvaraya"
  return (
    <Gallery location={location}></Gallery>
  )
};


