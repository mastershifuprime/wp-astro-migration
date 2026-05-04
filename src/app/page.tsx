import { getListPage } from "@/lib/contentParser";
import HomeClient from "@/layouts/components/HomeClient";

export default function Home() {
  const { frontmatter } = getListPage("homepage/_index.md");
  return (
    <HomeClient
      title={frontmatter.title as string}
      tagline={frontmatter.tagline as string}
      ctaPrimary={frontmatter.cta_primary as string}
      ctaSecondary={frontmatter.cta_secondary as string}
    />
  );
}
