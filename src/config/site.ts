export const site = {
  name: "Dentora",
  navigation: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Specialists", href: "/specialists" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Booking Policies", href: "/booking-policies" },
    { label: "FAQ", href: "/faq" },
  ],
  demoContact: { email: "hello@dentora.example", address: "123 Example Avenue, Demo City" },
} as const;
