import type { LectureId } from './types/lecture';
export type { LectureId } from './types/lecture';

// Metadata only: importing navigation does not load the lab, store, or Three.js.
export const VIRTUAL_LAB_LECTURES = [
  {
    "id": "lec-04",
    "title": "Biomechanical Considerations of Fixed Partial Denture",
    "numberLabel": "Lecture 04",
    "summary": "Analyze destructive occlusal and dislodging forces (torque, flexure, tension) across FPD spans, arch curvature lever arms, pier abutments, tilted molars, and canine replacements."
  },
  {
    "id": "lec-05",
    "title": "Components of Bridge: Bridge Retainers & Tooth Preparation",
    "numberLabel": "Lecture 05",
    "summary": "Master major vs. minor retainers, 5 principles of tooth preparation, convergence taper (5–6°), finish line geometry, and selection criteria from full metal crowns to post crowns and resin-bonded bridges."
  },
  {
    "id": "lec-06",
    "title": "Components of Bridge: Pontic Design, Ridge Assessment & Connectors",
    "numberLabel": "Lecture 06",
    "summary": "Master aesthetic, biologic, and mechanical pontic requirements, all pontic cross-sectional geometries (from contraindicated Saddle to Modified Ovate & Archway), Siebert ridge defects, alveolar preservation, and connector principles."
  },
  {
    "id": "lec-07a",
    "title": "Fluid Control & Soft Tissue Management (Gingival Retraction)",
    "numberLabel": "Lecture 07A",
    "summary": "Control oral moisture mechanically and chemically, respect the 2.04 mm Biological Width (3 mm margin-to-bone rule), and master single/double knitted cord packing, cordless hemostatic pastes, and surgical soft-tissue techniques."
  },
  {
    "id": "lec-07b",
    "title": "Final Impression in Fixed Prosthodontics & Disinfection",
    "numberLabel": "Lecture 07B",
    "summary": "Compare elastomeric impression materials (Polysulfide, Polyether, Condensation & Addition Silicone, VPES), one-step vs. two-step putty-wash techniques, post-space reinforcement, digital CAD/CAM scanning, and impression disinfection."
  },
  {
    "id": "lec-10a",
    "title": "Provisional (Temporary) Restorations & Fabrication Techniques",
    "numberLabel": "Lecture 10A",
    "summary": "Protect pulp vitality, maintain occlusal contacts and periodontal contours during the interim phase using preformed or custom PMMA, Bis-Acryl, vacuum-formed, post-wire, or CAD/CAM provisional restorations and eugenol/non-eugenol cements."
  },
  {
    "id": "lec-10b",
    "title": "Interocclusal Record (Bite Registration), Occlusion & Articulators",
    "numberLabel": "Lecture 10B",
    "summary": "Master Dawson accuracy criteria, bite registration materials (from inaccurate waxes to addition-silicone Luxabite), 3 planes/axes of mandibular motion, CR vs. CO vs. MIP, Dawson bimanual manipulation, anterior jig deprogramming, and facebow/articulator mounting."
  },
  {
    "id": "lec-11",
    "title": "Shade Selection in Fixed Prosthodontics & Color Science",
    "numberLabel": "Lecture 11",
    "summary": "Master light physics (380–750 nm), Munsell Hue/Chroma/Value, enamel opalescence, metamerism, retinal color perception, VITA Classic vs. Value-Oriented vs. 3D-Master/Linearguide workflows, and spectrophotometer analysis."
  },
  {
    "id": "lec-12",
    "title": "Clinical Try-in, Marginal Evaluation & Definitive Cementation",
    "numberLabel": "Lecture 12",
    "summary": "Master the 5-step crown try-in sequence, explorer & PIP margin inspection, proximal contact calibration, luting mechanisms, conventional vs. adhesive resin cements, and ceramic-specific bonding protocols (5% HF + Silane vs. Al2O3 + 10-MDP)."
  }
] as const satisfies readonly { id: LectureId; title: string; numberLabel: string; summary: string }[];
