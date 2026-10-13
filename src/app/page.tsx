import { Home } from "@/screens/Home/Home";
import { getApprovedPhotos } from "@/services/server/photos";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const photos = await getApprovedPhotos();
  return <Home initialPhotos={photos} />;
}
