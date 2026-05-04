import { getPage } from "@/lib/content";
import HomeClient from "@/components/HomeClient";

export default function Home() {
  const { data } = getPage("home");
  return (
    <HomeClient
      title={data.title}
      tagline={data.tagline}
      ctaPrimary={data.cta_primary}
      ctaSecondary={data.cta_secondary}
    />
  );
}
