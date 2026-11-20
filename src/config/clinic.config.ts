export interface ClinicConfig {
  identity: {
    name: string;
    legalName: string;
    tagline: string;
    subTagline?: string;
    logo: {
      navbarSrc: string;
      navbarWidth: number;
      navbarHeight: number;
      markSvg?: string;
    };
    favicon: string;
  };
  theme: {
    brandColor: string; // e.g. #2563EB
    brandHoverColor: string; // e.g. #1d4ed8
    iceColor: string; // e.g. #EAF2FF
    surfaceColor: string;
    inkColor: string;
    mutedColor: string;
    fontSans: string;
  };
  contact: {
    email: string;
    phone: string;
    emergencyPhone?: string;
    address: {
      street: string;
      city: string;
      state?: string;
      postalCode?: string;
      country: string;
      fullDisplay: string;
    };
  };
  scheduling: {
    timezone: string; // IANA timezone, e.g. "Asia/Karachi", "America/New_York"
    slotIntervalMinutes: number;
    bookingMinNoticeHours: number;
    bookingMaxDaysAhead: number;
    cancellationCutoffHours: number;
    maxPatientReschedules: number;
    instantConfirmation: boolean;
    regularHours: {
      dayOfWeek: number; // 0=Sunday, 1=Monday...
      label: string;
      hours: string;
    }[];
  };
  features: {
    enable3DToothExperience: boolean;
    enableSpecialistProfiles: boolean;
    enableOnlineBooking: boolean; // Currently false for demo/preview mode
    enablePricingDisplay: boolean;
  };
  seo: {
    siteUrl: string;
    defaultTitle: string;
    titleTemplate: string;
    description: string;
    ogImage: string;
  };
}

export const clinicConfig: ClinicConfig = {
  identity: {
    name: "Dentora",
    legalName: "Dentora Dental Care Concept",
    tagline: "Modern dentistry with a gentle touch.",
    subTagline: "Care, thoughtfully considered",
    logo: {
      navbarSrc: "/images/dentora-navbar-logo.png",
      navbarWidth: 900,
      navbarHeight: 240,
    },
    favicon: "/favicon.ico",
  },
  theme: {
    brandColor: "#2563EB",
    brandHoverColor: "#1d4ed8",
    iceColor: "#EAF2FF",
    surfaceColor: "#FFFFFF",
    inkColor: "#171717",
    mutedColor: "#525252",
    fontSans: "Arial, Helvetica, sans-serif",
  },
  contact: {
    email: "hello@dentora.example",
    phone: "+1 (555) 019-2834",
    address: {
      street: "123 Example Avenue",
      city: "Demo City",
      country: "Global",
      fullDisplay: "123 Example Avenue, Demo City",
    },
  },
  scheduling: {
    timezone: "UTC",
    slotIntervalMinutes: 15,
    bookingMinNoticeHours: 2,
    bookingMaxDaysAhead: 60,
    cancellationCutoffHours: 12,
    maxPatientReschedules: 2,
    instantConfirmation: true,
    regularHours: [
      { dayOfWeek: 1, label: "Mon – Thu", hours: "08:30 – 18:00" },
      { dayOfWeek: 5, label: "Friday", hours: "08:30 – 16:30" },
      { dayOfWeek: 6, label: "Sat – Sun", hours: "Closed" },
    ],
  },
  features: {
    enable3DToothExperience: true,
    enableSpecialistProfiles: true,
    enableOnlineBooking: false, // In demonstration mode until backend booking engine phase
    enablePricingDisplay: false,
  },
  seo: {
    siteUrl: "https://dentora-dusky.vercel.app",
    defaultTitle: "Dentora — Thoughtfully designed dental care",
    titleTemplate: "%s | Dentora",
    description: "Discover a patient-focused dental care concept, designed around comfort, confidence, and long-term oral health. Demonstration website.",
    ogImage: "/images/heroimage.png",
  },
};
