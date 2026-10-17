export const site = {
  name: "Vellum Press",
  legalName: "Vellum Press",
  tagline: "Practical guides for a well-lived life.",
  description:
    "Digital PDF guides on health, home training, money, work, study, and calm. Pay once, download instantly, and keep the file.",
  email: "hello@vellumpress.example",
  supportEmail: "support@vellumpress.example",
  location: "Portland, Oregon",
  jurisdiction: "the State of Oregon, United States",
  refundDays: 30,
  downloadDays: 14,
  responseTime: "two business days",
} as const;

export const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
] as const;

export const legalNav = [
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/refunds", label: "Refunds" },
  { href: "/legal/delivery", label: "Delivery" },
] as const;
