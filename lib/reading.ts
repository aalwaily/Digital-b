import type { Post } from "@/data/blog";

export function postPlainText(post: Post) {
  const parts: string[] = [];
  for (const block of post.blocks) {
    if (block.type === "ul") parts.push(block.items.join(" "));
    else if (block.type === "links") parts.push(block.items.map((item) => item.label).join(" "));
    else parts.push(block.text);
  }
  return parts.join(" ");
}

export function postWordCount(post: Post) {
  return postPlainText(post)
    .split(/\s+/)
    .filter(Boolean).length;
}

export function readingMinutes(post: Post) {
  return Math.max(1, Math.round(postWordCount(post) / 220));
}
