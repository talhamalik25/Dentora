import { clinicConfig } from "./clinic.config";

export const site = {
  name: clinicConfig.identity.name,
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
  demoContact: {
    email: clinicConfig.contact.email,
    address: clinicConfig.contact.address.fullDisplay,
  },
} as const;
