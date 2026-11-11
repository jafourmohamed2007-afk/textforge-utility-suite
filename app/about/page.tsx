import { DocPage, sitePageMetadata } from "@/components/DocPage";

export const metadata = sitePageMetadata("about");

export default function Page() {
  return <DocPage slug="about" />;
}
