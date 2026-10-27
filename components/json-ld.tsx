import { jsonLdScript } from "@/lib/schema";

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(data) }} />
  );
}

export function JsonLdList({ data }: { data: unknown[] }) {
  return (
    <>
      {data.map((entry, index) => (
        <JsonLd key={index} data={entry} />
      ))}
    </>
  );
}
