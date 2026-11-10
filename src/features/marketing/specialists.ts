/** Public presentation data, independent of future persistence/booking models. */
export interface SpecialistProfile {
  id: string;
  name: string;
  focus: string;
  summary: string;
  portrait: string;
  portraitAlt: string;
  crop: { scale: number; origin: string };
  isDemo: boolean;
}

/** Fictional display names and example areas of care, NOT verified credentials.
 * Stock models do not represent Dentora staff or endorse the clinic.
 * Replace with verified public data and consented staff portraits before launch.
 */
export const demoSpecialists: SpecialistProfile[] = [
  {
    id: "demo-maya", name: "Maya Bennett", focus: "General dentistry",
    summary: "Example profile exploring everyday oral health and preventive care.",
    portrait: "/images/specialists/portrait-01.jpg",
    portraitAlt: "Illustrative stock portrait of a woman in a white clinical uniform",
    crop: { scale: 1.5, origin: "40% 25%" }, isDemo: true,
  },
  {
    id: "demo-daniel", name: "Daniel Reed", focus: "Cosmetic dentistry",
    summary: "Example profile exploring personal smile goals and treatment planning.",
    portrait: "/images/specialists/portrait-02.jpg",
    portraitAlt: "Illustrative stock portrait of a man in a white clinical uniform",
    crop: { scale: 1, origin: "50% 50%" }, isDemo: true,
  },
  {
    id: "demo-alex", name: "Alex Morgan", focus: "Restorative care",
    summary: "Example profile exploring comfort, function and restorative options.",
    portrait: "/images/specialists/portrait-03.jpg",
    portraitAlt: "Illustrative stock portrait of a man wearing glasses and clinical scrubs",
    crop: { scale: 1.45, origin: "53% 67%" }, isDemo: true,
  },
];
