import { LinkButton } from "@/components/link-button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-xs tracking-[0.18em] text-copper uppercase">404</p>
      <h1 className="mt-3 font-serif text-5xl">That page is not on the shelf.</h1>
      <p className="mt-4 text-muted-foreground">
        The link may be old, or the guide may have moved. The library is still where you left it.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <LinkButton href="/" className="h-11 px-5">
          Home
        </LinkButton>
        <LinkButton href="/shop" variant="outline" className="h-11 px-5">
          Shop
        </LinkButton>
      </div>
    </div>
  );
}
