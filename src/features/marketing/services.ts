import type { Service } from "@/types/clinic";
export const demoServices = [
  { id: "general", name: "General dentistry", description: "A thoughtful foundation for oral health, from routine check-ups to preventive care.", durationMinutes: 30, active: true },
  { id: "cosmetic", name: "Cosmetic dentistry", description: "Explore possibilities for your smile, with an approach shaped around you.", durationMinutes: 45, active: true },
  { id: "restorative", name: "Restorative care", description: "Considered treatment options to help restore everyday comfort and function.", durationMinutes: 60, active: true },
] satisfies Service[];
