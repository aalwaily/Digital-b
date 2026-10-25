export const site = {
  name: "Vellum Press",
  // TODO(owner): Confirm the legal business identity before relying on these pages.
  // The owner must confirm all of the following with the Ministry of Commerce / a Saudi lawyer or accountant:
  // - the registered legal name (legalName stays "Vellum Press" until the owner provides another)
  // - the commercial registration (CR) number, or the approved alternative for selling online in Saudi Arabia
  // - VAT / zakat status with ZATCA
  // - a street address, if the store is required to show one
  // This file is not a commercial registration and it is not legal advice.
  legalName: "Vellum Press",
  tagline: "Practical guides for a well-lived life.",
  description:
    "Practical PDF guides on health, training, money, work, study, and calm. Free samples are available now. Online payment opens soon.",
  email: "glarz.com@gmail.com",
  supportEmail: "glarz.com@gmail.com",
  location: "Dammam, Saudi Arabia",
  jurisdiction: "the Kingdom of Saudi Arabia",
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
  { href: "/legal/refunds", label: "All sales final" },
  { href: "/legal/delivery", label: "Delivery" },
] as const;
