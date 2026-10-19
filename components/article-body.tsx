import type { PostBlock } from "@/data/blog";
import Link from "next/link";

export function ArticleBody({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div className="mt-8 space-y-4 text-[1.05rem] leading-relaxed">
      {blocks.map((block, index) => {
        if (block.type === "h2") {
          return (
            <h2 key={index} className="pt-6 font-serif text-3xl">
              {block.text}
            </h2>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={index} className="list-disc space-y-2 ps-5">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "tip" || block.type === "note") {
          return (
            <p key={index} className="border-s-2 border-copper ps-4 text-base">
              {block.text}
            </p>
          );
        }
        if (block.type === "links") {
          return (
            <ul key={index} className="space-y-2 pt-2">
              {block.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="underline underline-offset-4">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{block.text}</p>;
      })}
    </div>
  );
}
