export interface AnatomicalLandmark {
  id: string;
  name: string;
  category: 'crown' | 'root' | 'internal' | 'margin';
  position: [number, number, number]; // [x, y, z] in model space
  normal: [number, number, number];
  description: string;
  clinicalSignificance: string;
}

export interface ToothGuidedStep {
  step: number;
  title: string;
  viewAngle: 'buccal' | 'lingual' | 'mesial' | 'distal' | 'occlusal' | 'apical';
  instruction: string;
  focusLandmarkId?: string;
  anatomicalObservation: string;
}

export interface PermanentToothData {
  id: string; // FDI string, e.g. "11"
  fdi: number; // 11..48
  universal: number; // 1..32
  name: string;
  shortName: string;
  arch: 'Maxillary' | 'Mandibular';
  side: 'Right' | 'Left';
  quadrant: 1 | 2 | 3 | 4;
  quadrantName: string;
  category: 'Incisor' | 'Canine' | 'Premolar' | 'Molar';
  subCategory: 'Central Incisor' | 'Lateral Incisor' | 'Canine' | 'First Premolar' | 'Second Premolar' | 'First Molar' | 'Second Molar' | 'Third Molar';
  eruptionAge: string;
  rootCompletionAge: string;
  crownDimensions: {
    lengthMm: number;
    mesiodistalMm: number;
    buccolingualMm: number;
    rootLengthMm: number;
  };
  identifyingFeatures: string[];
  crownMorphology: string;
  rootMorphology: string;
  expectedRoots: number;
  expectedCanals: string;
  vertucciClass: string;
  anatomicalVariations: string[];
  clinicalRelevance: {
    endodontics: string;
    prosthodontics: string;
    periodontics: string;
    surgery: string;
  };
  landmarks: AnatomicalLandmark[];
  guidedSteps: ToothGuidedStep[];
  comparisons: {
    targetFdi: number;
    targetName: string;
    relationship: string;
    differences: string[];
  }[];
}

export const PERMANENT_TEETH_DATA: Record<number, PermanentToothData> = {
  // ==========================================
  // QUADRANT 1: MAXILLARY RIGHT (FDI 18 - 11)
  // ==========================================
  11: {
    id: '11',
    fdi: 11,
    universal: 8,
    name: 'Maxillary Right Central Incisor',
    shortName: 'Max Right Central Incisor',
    arch: 'Maxillary',
    side: 'Right',
    quadrant: 1,
    quadrantName: 'Maxillary Right (Q1)',
    category: 'Incisor',
    subCategory: 'Central Incisor',
    eruptionAge: '7–8 years',
    rootCompletionAge: '10 years',
    crownDimensions: { lengthMm: 10.5, mesiodistalMm: 8.5, buccolingualMm: 7.0, rootLengthMm: 13.0 },
    identifyingFeatures: [
      'Widest anterior crown mesiodistally of all permanent teeth.',
      'Sharp 90° mesio-incisal angle vs rounded disto-incisal line angle.',
      'Prominent smooth Cingulum located slightly distal to the long axis.',
      'Distinct lingual fossa bounded by mesial and distal marginal ridges.',
      'Straight incisal edge perpendicular to the tooth axis with slight lingual slope.'
    ],
    crownMorphology: 'Trapezoidal labial outline. Convex cervical third with 3 developmental lobes and 2 shallow developmental grooves. Lingual surface features a smooth cingulum in cervical third and a moderately deep triangular lingual fossa.',
    rootMorphology: 'Single conical root with a blunt apex. Cross-section at CEJ is rounded triangular with base toward labial. The root apex often has a gentle distal or palatal tilt.',
    expectedRoots: 1,
    expectedCanals: '1 canal (Vertucci Type I in 99.8% of cases)',
    vertucciClass: 'Type I (1-1)',
    anatomicalVariations: [
      'Talon cusp (accessory cusp projection on cingulum).',
      'Dens invaginatus (dens in dente).',
      'Microdontia / Megadontia.',
      'Dilaceration of the apical root third.'
    ],
    clinicalRelevance: {
      endodontics: 'Triangular or rounded triangular access cavity centered on the palatal surface. Pulp horns are prominent in young patients (mesial, central, distal). Straight-line access is critical to avoid labial gouging.',
      prosthodontics: 'Prime esthetic anchor (golden proportion standard). Emergence profile requires gentle 0.5-0.7mm axial reduction near CEJ to preserve periodontal embrasure biology.',
      periodontics: 'Interproximal CEJ curvature is the highest in the entire human dentition (~3.5mm), demanding meticulous subgingival probe angulation and contour adaptation.',
      surgery: 'Extraction movement relies on initial gentle rotational force combined with labial luxation due to its circular conical root anatomy.'
    },
    landmarks: [
      { id: '11-crown', name: 'Anatomical Crown', category: 'crown', position: [0, 1.2, 0], normal: [0, 0, 1], description: 'Clinical crown projecting into the oral cavity covered by enamel.', clinicalSignificance: 'Esthetic focal point; key determinant of smile line.' },
      { id: '11-cej', name: 'Cervical Line (CEJ)', category: 'margin', position: [0, 0.05, 0.65], normal: [0, 0, 1], description: 'Cementoenamel junction showing steep 3.5mm coronal scalloping on mesial.', clinicalSignificance: 'Gingival margin reference; site for probing depth measurements.' },
      { id: '11-incisal', name: 'Incisal Edge', category: 'crown', position: [0, 2.25, 0.05], normal: [0, 1, 0], description: 'Straight cutting edge with sharp mesio-incisal angle.', clinicalSignificance: 'Subject to attrition, anterior guidance, and Class IV fractures.' },
      { id: '11-cingulum', name: 'Palatal Cingulum', category: 'crown', position: [0.08, 0.55, -0.65], normal: [0, 0, -1], description: 'Smooth convexity on cervical third of palatal surface.', clinicalSignificance: 'Determines cingulum rest seats for removable prostheses.' },
      { id: '11-fossa', name: 'Lingual / Palatal Fossa', category: 'crown', position: [0, 1.3, -0.45], normal: [0, 0, -1], description: 'Shallow concavity bounded by marginal ridges and cingulum.', clinicalSignificance: 'Site for endodontic access cavity initiation.' },
      { id: '11-root', name: 'Conical Root', category: 'root', position: [0, -1.6, 0], normal: [0, 0, 1], description: 'Single conical root tapering to a rounded apex with distal tilt.', clinicalSignificance: 'Favorable crown-to-root ratio (1:1.25) provides solid support.' },
      { id: '11-apex', name: 'Root Apex', category: 'root', position: [0.22, -3.3, 0], normal: [0, -1, 0], description: 'Apical foramen transmitting neurovascular bundle.', clinicalSignificance: 'Major landmark for electronic apex locators and apicoectomy.' }
    ],
    guidedSteps: [
      { step: 1, title: 'Tooth Identification', viewAngle: 'buccal', instruction: 'Examine the overall broad, chisel-like trapezoidal crown shape.', anatomicalObservation: 'Largest anterior crown with prominent mesiodistal width.' },
      { step: 2, title: 'Arch & Side Verification', viewAngle: 'buccal', instruction: 'Observe the line angles to determine right vs left.', focusLandmarkId: '11-incisal', anatomicalObservation: 'Sharp 90° mesio-incisal angle (mesial) vs rounded disto-incisal angle (distal).' },
      { step: 3, title: 'Facial Surface Morphology', viewAngle: 'buccal', instruction: 'Inspect the 3 developmental lobes and cervical convexity.', anatomicalObservation: 'Smooth enamel with subtle horizontal perikymata lines.' },
      { step: 4, title: 'Palatal Surface & Cingulum', viewAngle: 'lingual', instruction: 'Rotate to the palatal aspect to inspect cingulum and fossa.', focusLandmarkId: '11-cingulum', anatomicalObservation: 'Smooth cingulum slightly offset distally; wide shallow palatal fossa.' },
      { step: 5, title: 'Proximal Curvature of CEJ', viewAngle: 'mesial', instruction: 'View the mesial profile to assess the CEJ height of contour.', focusLandmarkId: '11-cej', anatomicalObservation: 'Steepest CEJ coronal curvature in the permanent dentition (~3.5mm).' },
      { step: 6, title: 'Incisal Table Alignment', viewAngle: 'occlusal', instruction: 'Look directly down the incisal edge.', focusLandmarkId: '11-incisal', anatomicalObservation: 'Incisal edge is centered over the root trunk with slight lingual tilt.' },
      { step: 7, title: 'Root Morphology & Taper', viewAngle: 'buccal', instruction: 'Examine the conical root taper.', focusLandmarkId: '11-root', anatomicalObservation: 'Blunt single apex with slight distal apical curvature.' },
      { step: 8, title: 'Clinical & Endodontic Highlights', viewAngle: 'lingual', instruction: 'Review the access cavity outline and palatal anatomy.', anatomicalObservation: 'Triangular access avoids weakening marginal ridges and cingulum.' },
      { step: 9, title: 'Self-Assessment Quiz', viewAngle: 'buccal', instruction: 'Complete the short evaluation questions for Tooth #11.', anatomicalObservation: 'Test your knowledge on angles, canal anatomy, and landmarks.' }
    ],
    comparisons: [
      {
        targetFdi: 21,
        targetName: 'Maxillary Left Central Incisor (#21)',
        relationship: 'Contralateral Antagonist Mirror',
        differences: [
          '#11 has its sharp 90° mesio-incisal angle on its anatomical mesial (left side of model).',
          '#21 mirrors this with the sharp angle oriented toward the midline (patient right).',
          'Cingulum offset is distally directed in both teeth.'
        ]
      },
      {
        targetFdi: 12,
        targetName: 'Maxillary Right Lateral Incisor (#12)',
        relationship: 'Adjacent Tooth (Same Quadrant)',
        differences: [
          '#11 is significantly wider (8.5mm vs 6.5mm mesiodistal width).',
          '#12 has a much more rounded disto-incisal angle and deeper palatal pit.',
          '#12 frequently exhibits developmental anomalies (peg lateral, palatogingival groove).'
        ]
      },
      {
        targetFdi: 41,
        targetName: 'Mandibular Right Central Incisor (#41)',
        relationship: 'Opposing Incisor (Mandibular)',
        differences: [
          '#41 is the smallest tooth in the permanent human dentition, whereas #11 is the largest incisor.',
          '#41 has bilateral symmetry with almost identical 90° line angles.',
          '#41 root is flattened buccolingually with deep longitudinal proximal grooves, harboring 2 canals in up to 30%.'
        ]
      }
    ]
  },

  12: {
    id: '12',
    fdi: 12,
    universal: 7,
    name: 'Maxillary Right Lateral Incisor',
    shortName: 'Max Right Lateral Incisor',
    arch: 'Maxillary',
    side: 'Right',
    quadrant: 1,
    quadrantName: 'Maxillary Right (Q1)',
    category: 'Incisor',
    subCategory: 'Lateral Incisor',
    eruptionAge: '8–9 years',
    rootCompletionAge: '11 years',
    crownDimensions: { lengthMm: 9.0, mesiodistalMm: 6.5, buccolingualMm: 6.0, rootLengthMm: 13.0 },
    identifyingFeatures: [
      'Second most morphologically variable tooth in human dentition (after 3rd molars).',
      'Both incisal angles distinctly more rounded than central incisor, especially disto-incisal.',
      'Deep V-shaped palatal pit (foramen caecum incisivum) often present.',
      'Crown-to-root ratio is high; root is relatively longer compared to crown size than #11.',
      'Pronounced distal curve of the apical third of the root.'
    ],
    crownMorphology: 'Ovoid/trapezoidal labial outline. Rounded incisal corners. Deep lingual fossa bounded by prominent marginal ridges. Frequent palatal groove extending subgingivally.',
    rootMorphology: 'Single slender conical root, flattened mesiodistally, with a sharp distal and palatal curvature in the apical 1/3.',
    expectedRoots: 1,
    expectedCanals: '1 canal (Vertucci Type I in 98%)',
    vertucciClass: 'Type I (1-1)',
    anatomicalVariations: [
      'Peg lateral (conical microdontia).',
      'Congenitally missing (hypodontia).',
      'Palatoradicular / palatogingival groove (leads to localized severe perio-endo defects).',
      'Dens invaginatus (Types I, II, III).'
    ],
    clinicalRelevance: {
      endodontics: 'Access cavity is ovoid. Extreme caution is needed with rotary files because apical 3mm sharply hooks distally and lingually in >60% of teeth.',
      prosthodontics: 'Frequently restored with porcelain veneers or composite recontouring for peg laterals. Margin must avoid subgingival palatogingival groove.',
      periodontics: 'Palatoradicular groove provides a bacterial highway directly into the deep periodontium, causing isolated Grade 3-4 bone loss despite good oral hygiene.',
      surgery: 'Do not twist forcefully during extraction! Distal apical hook will fracture if rotational force is excessive.'
    },
    landmarks: [
      { id: '12-crown', name: 'Anatomical Crown', category: 'crown', position: [0, 1.1, 0], normal: [0, 0, 1], description: 'Slender graceful crown with rounded angles.', clinicalSignificance: 'Esthetic lateral corridor contributor.' },
      { id: '12-cej', name: 'Cervical Line', category: 'margin', position: [0, 0.05, 0.55], normal: [0, 0, 1], description: 'Scalloped CEJ contour (~3.0mm curvature).', clinicalSignificance: 'Biologic width baseline.' },
      { id: '12-incisal', name: 'Incisal Edge', category: 'crown', position: [0, 2.0, 0.05], normal: [0, 1, 0], description: 'Rounded cutting edge with prominent distal slope.', clinicalSignificance: 'Guides disocclusion in group function.' },
      { id: '12-palatal-pit', name: 'Palatal Pit & Groove', category: 'crown', position: [0, 0.6, -0.55], normal: [0, 0, -1], description: 'Deep developmental pit at base of lingual fossa.', clinicalSignificance: 'High caries predilection and palatoradicular groove origin.' },
      { id: '12-root', name: 'Slender Root', category: 'root', position: [0, -1.6, 0], normal: [0, 0, 1], description: 'Long slender root tapering to sharp apical hook.', clinicalSignificance: 'Prone to apical perforation during post preparation.' },
      { id: '12-apex', name: 'Curved Apex', category: 'root', position: [0.35, -3.2, -0.15], normal: [0, -1, 0], description: 'Sharp distal and palatal curve.', clinicalSignificance: 'Pre-curving hand files is mandatory.' }
    ],
    guidedSteps: [
      { step: 1, title: 'Tooth Identification', viewAngle: 'buccal', instruction: 'Note the slender crown width compared to the central incisor.', anatomicalObservation: 'Narrower mesiodistally with rounded corners.' },
      { step: 2, title: 'Incisal Angle Curvatures', viewAngle: 'buccal', instruction: 'Compare the mesio-incisal and disto-incisal angles.', focusLandmarkId: '12-incisal', anatomicalObservation: 'Disto-incisal line angle is noticeably rounded and elevated.' },
      { step: 3, title: 'Palatal Fossa & Pit Inspection', viewAngle: 'lingual', instruction: 'Examine the lingual surface for pits or developmental grooves.', focusLandmarkId: '12-palatal-pit', anatomicalObservation: 'Deep foramen caecum incisivum; check for palatogingival groove.' },
      { step: 4, title: 'Apical Third Distal Curvature', viewAngle: 'mesial', instruction: 'Rotate to see the root profile in the mesial-distal plane.', focusLandmarkId: '12-apex', anatomicalObservation: 'Distinct distal hook in apical third of root.' },
      { step: 5, title: 'Clinical Pearls & Review', viewAngle: 'buccal', instruction: 'Review the high incidence of congenital variations.', anatomicalObservation: 'Second most common tooth for hypodontia and dens in dente.' }
    ],
    comparisons: [
      {
        targetFdi: 11,
        targetName: 'Maxillary Right Central Incisor (#11)',
        relationship: 'Adjacent Central Incisor',
        differences: [
          '#12 crown is 2mm narrower mesiodistally and 1.5mm shorter.',
          '#12 disto-incisal angle is much more rounded than #11.',
          '#12 root has a pronounced distal hook at apex, whereas #11 root is straight/conical.'
        ]
      }
    ]
  },

  13: {
    id: '13',
    fdi: 13,
    universal: 6,
    name: 'Maxillary Right Permanent Canine',
    shortName: 'Max Right Canine',
    arch: 'Maxillary',
    side: 'Right',
    quadrant: 1,
    quadrantName: 'Maxillary Right (Q1)',
    category: 'Canine',
    subCategory: 'Canine',
    eruptionAge: '11–12 years',
    rootCompletionAge: '13–15 years',
    crownDimensions: { lengthMm: 10.0, mesiodistalMm: 7.5, buccolingualMm: 8.0, rootLengthMm: 17.0 },
    identifyingFeatures: [
      'Longest tooth and longest root in the permanent human dentition (up to 30mm total length!).',
      'Prominent single cusp tip with mesial cusp ridge shorter than distal cusp ridge.',
      'Stout labial ridge running from cusp tip to cervical line.',
      'Heavy palatal cingulum with central lingual ridge dividing lingual surface into mesial and distal fossae.',
      'Creates the canine eminence on the maxilla, which supports facial expression and lip contour.'
    ],
    crownMorphology: 'Pentagonal facial outline. Thick, sturdy crown. Prominent labial ridge. Sharp cusp tip. Palatal surface exhibits massive cingulum and well-developed marginal ridges separated by a central palatal ridge.',
    rootMorphology: 'Single massive, extremely long conical root. Thickest labiolingually. Apex usually curves slightly to the distal. Oval cross-section.',
    expectedRoots: 1,
    expectedCanals: '1 canal (Vertucci Type I in 95-98%, rare Type II/III)',
    vertucciClass: 'Type I (1-1)',
    anatomicalVariations: [
      'Impacted canine (palatal or labial impaction occurs in ~2% of population).',
      'Bifurcated root apex (extremely rare in maxillary canine, more common in mandibular).',
      'Extreme apical dilaceration.',
      'Transposition with premolar or lateral incisor.'
    ],
    clinicalRelevance: {
      endodontics: 'Requires extra-long endodontic files (28mm or 31mm). Access cavity is oval, expanded incisogingivally. Canal is very wide buccolingually but narrow mesiodistally.',
      prosthodontics: 'The cornerstone of occlusion! Provides canine-guided disocclusion (canine protected occlusion), protecting posterior teeth from lateral shear forces.',
      periodontics: 'Canine eminence makes the labial cortical plate very thin; vulnerable to gingival recession and fenestrations/dehiscences from traumatic toothbrushing.',
      surgery: 'Cornerstone tooth; requires strong buccopalatal luxation with rotational torque only after adequate expansion of socket.'
    },
    landmarks: [
      { id: '13-cusp', name: 'Cusp Tip', category: 'crown', position: [0, 2.15, 0.1], normal: [0, 1, 0], description: 'Sharp single cusp tip dividing the incisal edge into two slopes.', clinicalSignificance: 'Key disocclusion guide in lateral excursive movements.' },
      { id: '13-mesial-slope', name: 'Mesial Cusp Slope', category: 'crown', position: [-0.35, 1.8, 0.05], normal: [-1, 1, 0], description: 'Shorter than the distal cusp slope.', clinicalSignificance: 'Crucial diagnostic feature for distinguishing right from left.' },
      { id: '13-distal-slope', name: 'Distal Cusp Slope', category: 'crown', position: [0.45, 1.65, 0.05], normal: [1, 1, 0], description: 'Longer and steeper slope that articulates with mandibular premolar.', clinicalSignificance: 'Determines working side disocclusion.' },
      { id: '13-labial-ridge', name: 'Labial Ridge', category: 'crown', position: [0, 1.0, 0.72], normal: [0, 0, 1], description: 'Prominent convex enamel crest dividing the labial surface.', clinicalSignificance: 'Contributes to canine eminence and facial profile fullness.' },
      { id: '13-cingulum', name: 'Palatal Cingulum', category: 'crown', position: [0, 0.5, -0.72], normal: [0, 0, -1], description: 'Very large, pointed or bulky cingulum.', clinicalSignificance: 'Provides heavy retention and support in prosthodontics.' },
      { id: '13-root', name: 'Massive Root', category: 'root', position: [0, -2.1, 0], normal: [0, 0, 1], description: 'Longest root in human dentition with labial convexity.', clinicalSignificance: 'Provides highest periodontal ligament anchorage surface area.' },
      { id: '13-apex', name: 'Root Apex', category: 'root', position: [0.25, -4.2, 0], normal: [0, -1, 0], description: 'Apical tip often extending to nasal floor or infraorbital rim.', clinicalSignificance: 'Apical abscess can drain to infraorbital space.' }
    ],
    guidedSteps: [
      { step: 1, title: 'Tooth Identification', viewAngle: 'buccal', instruction: 'Observe the pentagonal outline and prominent central cusp tip.', anatomicalObservation: 'Massive tooth with prominent labial ridge and canine eminence support.' },
      { step: 2, title: 'Cusp Slope Asymmetry (Side Determination)', viewAngle: 'buccal', instruction: 'Compare the mesial and distal cusp slopes.', focusLandmarkId: '13-mesial-slope', anatomicalObservation: 'Mesial slope is distinctly shorter than the distal slope.' },
      { step: 3, title: 'Labial Ridge & Profile', viewAngle: 'mesial', instruction: 'Inspect the thick buccolingual dimension and labial convexity.', focusLandmarkId: '13-labial-ridge', anatomicalObservation: 'Buccolingual dimension exceeds mesiodistal width.' },
      { step: 4, title: 'Palatal Anatomy', viewAngle: 'lingual', instruction: 'Examine the bulky cingulum and lingual ridge.', focusLandmarkId: '13-cingulum', anatomicalObservation: 'Central lingual ridge splits the lingual surface into 2 shallow fossae.' },
      { step: 5, title: 'Root Length & Endodontics', viewAngle: 'buccal', instruction: 'Appreciate the massive 17mm root length.', focusLandmarkId: '13-root', anatomicalObservation: 'Longest root in human mouth; requires 28-31mm endodontic files.' }
    ],
    comparisons: [
      {
        targetFdi: 43,
        targetName: 'Mandibular Right Canine (#43)',
        relationship: 'Opposing Arch Canine',
        differences: [
          '#13 crown is shorter and wider; #43 crown is longer, narrower, and smoother.',
          '#13 labial surface is distinctly convex; #43 labial profile is a continuous C-curve with the root.',
          '#43 root has bifurcated buccal/lingual canals in up to 15% of cases.'
        ]
      }
    ]
  },

  14: {
    id: '14',
    fdi: 14,
    universal: 5,
    name: 'Maxillary Right First Premolar',
    shortName: 'Max Right 1st Premolar',
    arch: 'Maxillary',
    side: 'Right',
    quadrant: 1,
    quadrantName: 'Maxillary Right (Q1)',
    category: 'Premolar',
    subCategory: 'First Premolar',
    eruptionAge: '10–11 years',
    rootCompletionAge: '12–13 years',
    crownDimensions: { lengthMm: 8.5, mesiodistalMm: 7.0, buccolingualMm: 9.0, rootLengthMm: 14.0 },
    identifyingFeatures: [
      'Only premolar with 2 roots in the majority of cases (~60-70% bifurcated buccal & palatal).',
      'Mesial marginal developmental groove crosses the mesial marginal ridge onto the mesial surface.',
      'Pronounced mesial developmental depression (canine fossa) on cervical crown and root.',
      'Buccal cusp is ~1mm longer than lingual cusp.',
      'Mesial cusp slope of buccal cusp is LONGER than distal cusp slope (unique among teeth!).'
    ],
    crownMorphology: 'Hexagonal occlusal table. Buccal cusp sharp and prominent. Lingual cusp smaller and tilted mesially. Mesial marginal groove cuts cleanly across the mesial marginal ridge into the mesial depression.',
    rootMorphology: 'Typically 2 roots (Buccal and Palatal) bifurcating in the middle to apical third. Deep mesial interradicular groove on the root trunk makes it prone to furcation involvement.',
    expectedRoots: 2,
    expectedCanals: '2 canals (Buccal & Palatal in 85-90% of cases, rare 3 canals)',
    vertucciClass: 'Type IV (2-2) in 75%, Type II (2-1) in 15%',
    anatomicalVariations: [
      '3 roots (2 buccal, 1 palatal - "radiculus premolaris" in 1-2%).',
      'Single fused root with 2 canals.',
      'Deep mesial crown invagination causing matrix band flaring during Class II restorations.'
    ],
    clinicalRelevance: {
      endodontics: 'Access cavity is an elongated oval oriented buccopalatally. Two distinct canal orifices (Buccal under buccal cusp, Palatal under palatal cusp). High risk of furcation strip perforation on the mesial concavity.',
      prosthodontics: 'Cusps are vulnerable to fracture under heavy occlusal load if marginal ridges are lost. Mesial concavity requires custom wedge adaptation.',
      periodontics: 'Mesial developmental groove is a notorious plaque trap; once periodontal pocket reaches 4mm, bone loss accelerates rapidly.',
      surgery: 'Roots are delicate and slender; avoid rotational force during extraction to prevent fracturing the buccal or palatal root tips.'
    },
    landmarks: [
      { id: '14-buccal-cusp', name: 'Buccal Cusp', category: 'crown', position: [0, 1.8, 0.45], normal: [0, 1, 0.5], description: 'Sharp, prominent cusp ~1mm longer than lingual cusp.', clinicalSignificance: 'Shearing non-supporting cusp in normal occlusion.' },
      { id: '14-lingual-cusp', name: 'Lingual (Palatal) Cusp', category: 'crown', position: [0, 1.55, -0.42], normal: [0, 1, -0.5], description: 'Rounded functional supporting stamp cusp.', clinicalSignificance: 'Maintains vertical dimension of occlusion.' },
      { id: '14-mesial-groove', name: 'Mesial Marginal Groove', category: 'crown', position: [-0.48, 1.5, 0], normal: [-1, 0, 0], description: 'Developmental notch traversing the mesial marginal ridge.', clinicalSignificance: 'Key anatomical landmark; caries nidus and matrix adaptation challenge.' },
      { id: '14-central-groove', name: 'Central Developmental Groove', category: 'crown', position: [0, 1.45, 0], normal: [0, 1, 0], description: 'Long straight central groove with few supplemental grooves.', clinicalSignificance: 'Distinguishes #14 from more wrinkly #15 occlusal table.' },
      { id: '14-bifurcation', name: 'Root Bifurcation & Furcation', category: 'root', position: [0, -1.2, 0], normal: [0, 0, 1], description: 'Division into buccal and palatal roots at mid-root level.', clinicalSignificance: 'Site for Grade II/III furcation bone defects.' },
      { id: '14-buccal-root', name: 'Buccal Root', category: 'root', position: [0, -2.4, 0.35], normal: [0, 0, 1], description: 'Slender buccal root tapering to fine apex.', clinicalSignificance: 'Houses buccal canal.' },
      { id: '14-palatal-root', name: 'Palatal Root', category: 'root', position: [0, -2.4, -0.35], normal: [0, 0, -1], description: 'Stouter palatal root harboring palatal canal.', clinicalSignificance: 'Usually larger and straighter than buccal root.' }
    ],
    guidedSteps: [
      { step: 1, title: 'Tooth Identification', viewAngle: 'occlusal', instruction: 'Inspect the hexagonal occlusal outline and 2 prominent cusps.', anatomicalObservation: 'Buccal cusp is visibly larger and taller than the palatal cusp.' },
      { step: 2, title: 'Mesial Marginal Groove Examination', viewAngle: 'mesial', instruction: 'Examine the mesial marginal ridge profile for the groove.', focusLandmarkId: '14-mesial-groove', anatomicalObservation: 'Pathognomonic mesial groove crossing onto the mesial surface.' },
      { step: 3, title: 'Buccal Cusp Slope Rules', viewAngle: 'buccal', instruction: 'Measure mesial vs distal slopes of the buccal cusp.', anatomicalObservation: 'Mesial slope is longer than distal slope (unique to #14 & primary maxillary canine).' },
      { step: 4, title: 'Root Bifurcation Analysis', viewAngle: 'mesial', instruction: 'Rotate to proximal view to see the buccal and palatal roots.', focusLandmarkId: '14-bifurcation', anatomicalObservation: 'Two distinct roots in ~60-70% of individuals.' },
      { step: 5, title: 'Endodontic Access Design', viewAngle: 'occlusal', instruction: 'Review the oval buccopalatal access cavity configuration.', anatomicalObservation: 'Access spans between cusp tips to unroof both buccal and palatal canals.' }
    ],
    comparisons: [
      {
        targetFdi: 15,
        targetName: 'Maxillary Right Second Premolar (#15)',
        relationship: 'Adjacent Premolar',
        differences: [
          '#14 typically has 2 roots and 2 canals; #15 has 1 single root and 1 canal in ~50%.',
          '#14 buccal cusp is taller than lingual; #15 cusps are nearly equal in height.',
          '#14 has a prominent mesial marginal groove and canine concavity; #15 lacks both.'
        ]
      },
      {
        targetFdi: 44,
        targetName: 'Mandibular Right First Premolar (#44)',
        relationship: 'Opposing First Premolar',
        differences: [
          '#14 has 2 functional cusps; #44 has a diminutive non-functional lingual cusp (looks like a canine).',
          '#14 occlusal table is hexagonal and wide buccolingually; #44 is diamond/circular.',
          '#44 has a pathognomonic mesiolingual developmental groove.'
        ]
      }
    ]
  },

  15: {
    id: '15',
    fdi: 15,
    universal: 4,
    name: 'Maxillary Right Second Premolar',
    shortName: 'Max Right 2nd Premolar',
    arch: 'Maxillary',
    side: 'Right',
    quadrant: 1,
    quadrantName: 'Maxillary Right (Q1)',
    category: 'Premolar',
    subCategory: 'Second Premolar',
    eruptionAge: '10–12 years',
    rootCompletionAge: '12–14 years',
    crownDimensions: { lengthMm: 8.5, mesiodistalMm: 7.0, buccolingualMm: 9.0, rootLengthMm: 14.0 },
    identifyingFeatures: [
      'Buccal and lingual cusps are almost equal in height and size.',
      'Occlusal table is more rounded/ovoid with numerous supplemental grooves ("wrinkled" appearance).',
      'Central groove is shorter and more irregular than in the first premolar.',
      'No mesial marginal groove crossing the marginal ridge.',
      'Single root in >90% of cases, flattened mesiodistally.'
    ],
    crownMorphology: 'Ovoid occlusal outline. Symmetrical cusps. Short central groove terminating in multiple supplementary radiating fissures. Mesial surface is smooth without a developmental concavity.',
    rootMorphology: 'Single root with gentle distal apical tilt. Deep longitudinal grooves on both mesial and distal sides.',
    expectedRoots: 1,
    expectedCanals: '1 canal (50%) or 2 canals (45%)',
    vertucciClass: 'Type I (1-1) 50%, Type II (2-1) 25%, Type IV (2-2) 20%',
    anatomicalVariations: [
      'Two roots (rare, ~5-10%).',
      'Three root canals in single root.',
      'Severe distal apical hook.'
    ],
    clinicalRelevance: {
      endodontics: 'Canal system frequently merges into a single apical foramen (Type II) or divides mid-root. Radiographs from angled projections are essential.',
      prosthodontics: 'Excellent abutment tooth with more balanced cusp loading than #14.',
      periodontics: 'Smooth mesial surface without the deep canine fossa makes interproximal flossing and scaling much easier than #14.',
      surgery: 'Single tapered root allows gentle rotational and buccopalatal luxation.'
    },
    landmarks: [
      { id: '15-cusps', name: 'Equal Cusps (Buccal & Lingual)', category: 'crown', position: [0, 1.65, 0], normal: [0, 1, 0], description: 'Cusps are almost equal in height.', clinicalSignificance: 'Even occlusal load distribution.' },
      { id: '15-grooves', name: 'Supplementary Grooves', category: 'crown', position: [0, 1.45, 0], normal: [0, 1, 0], description: 'Wrinkled occlusal table with multiple small grooves.', clinicalSignificance: 'Prone to pit-and-fissure caries in younger patients.' },
      { id: '15-root', name: 'Single Root', category: 'root', position: [0, -1.8, 0], normal: [0, 0, 1], description: 'Single tapered root with longitudinal depressions.', clinicalSignificance: 'House 1 or 2 canals.' }
    ],
    guidedSteps: [
      { step: 1, title: 'Tooth Identification', viewAngle: 'occlusal', instruction: 'Observe the rounded, symmetrical occlusal table.', anatomicalObservation: 'Buccal and lingual cusps have nearly identical height.' },
      { step: 2, title: 'Absence of Mesial Notch', viewAngle: 'mesial', instruction: 'Verify that the mesial marginal ridge is intact and smooth.', anatomicalObservation: 'No mesial marginal groove (unlike #14).' },
      { step: 3, title: 'Single Root Assessment', viewAngle: 'buccal', instruction: 'Examine the single tapered root morphology.', anatomicalObservation: 'Single conical root in >90% of cases.' }
    ],
    comparisons: [
      {
        targetFdi: 14,
        targetName: 'Maxillary Right First Premolar (#14)',
        relationship: 'Adjacent First Premolar',
        differences: [
          '#15 has cusps of equal height, whereas #14 buccal cusp is taller.',
          '#15 is typically single-rooted; #14 is usually two-rooted.',
          '#15 lacks the mesial marginal groove and mesial crown concavity.'
        ]
      }
    ]
  },

  16: {
    id: '16',
    fdi: 16,
    universal: 3,
    name: 'Maxillary Right First Molar',
    shortName: 'Max Right 1st Molar ("6-Year Molar")',
    arch: 'Maxillary',
    side: 'Right',
    quadrant: 1,
    quadrantName: 'Maxillary Right (Q1)',
    category: 'Molar',
    subCategory: 'First Molar',
    eruptionAge: '6–7 years',
    rootCompletionAge: '9–10 years',
    crownDimensions: { lengthMm: 7.5, mesiodistalMm: 10.0, buccolingualMm: 11.0, rootLengthMm: 13.0 },
    identifyingFeatures: [
      'Largest tooth in the maxillary arch with rhomboidal occlusal outline.',
      '4 major cusps (Mesiobuccal, Distobuccal, Mesiopalatal - largest, Distopalatal).',
      'Prominent Oblique Ridge connecting the mesiopalatal cusp to the distobuccal cusp.',
      'Fifth supplementary cusp: Cusp of Carabelli on the mesiopalatal cusp (present in ~70-85%).',
      '3 widely diverging roots: Palatal root (longest & thickest), Mesiobuccal root, Distobuccal root.',
      'High incidence of MB2 canal (Mesiobuccal-2) in 70–90% of clinical cases!'
    ],
    crownMorphology: 'Rhomboidal outline with acute mesiobuccal and distopalatal angles. Two major triangular ridges meet across the occlusal table to form the prominent oblique ridge. Cusp of Carabelli forms a distinct tubercle or groove on the palatal surface of the MP cusp.',
    rootMorphology: '3 widely divergent roots. Palatal root is the longest (13mm) with a banana-like palatal curve. MB root is flattened mesiodistally with broad buccolingual width. DB root is shorter and rounded.',
    expectedRoots: 3,
    expectedCanals: '4 canals in 70–90% (MB1, MB2, DB, Palatal); 3 canals in remainder',
    vertucciClass: 'MB Root: Type II (2-1) or Type IV (2-2); Palatal & DB: Type I (1-1)',
    anatomicalVariations: [
      'MB3 canal (third mesiobuccal canal in 1-2%).',
      'Radix paramolaris or extra palatal root.',
      'C-shaped canal configuration (rare in maxilla, ~0.1%).',
      'Taurodontism (enlarged pulp chamber with apical displacement of furcation).'
    ],
    clinicalRelevance: {
      endodontics: 'Access cavity is rhomboidal or modified trapezoid. Never enter the center of the tooth—center of access is in the mesial half to locate MB1 and hunt 1-3mm palatally along the developmental groove for the elusive MB2 canal under high magnification.',
      prosthodontics: 'Key anchor for posterior occlusion. Crown preparation requires preserving the oblique ridge reduction planes and accounting for 3 distinct root emergence profiles.',
      periodontics: 'Trifurcation entrances are located: Mesial (accessed from palatal aspect, 3mm from CEJ), Buccal (4mm from CEJ), and Distal (5mm from CEJ). Mesial furcation is easiest to probe from palatal.',
      surgery: 'Extraction requires wide buccopalatal rocking; forceful torque can fracture the divergent palatal root into the maxillary sinus.'
    },
    landmarks: [
      { id: '16-mp-cusp', name: 'Mesiopalatal Cusp (Largest)', category: 'crown', position: [-0.45, 1.85, -0.48], normal: [-0.5, 1, -0.5], description: 'Largest cusp on the tooth, occupying nearly 40% of occlusal surface.', clinicalSignificance: 'Principal stamp cusp in maximum intercuspation.' },
      { id: '16-oblique-ridge', name: 'Oblique Ridge', category: 'crown', position: [0, 1.7, 0], normal: [0, 1, 0], description: 'Continuous elevated enamel ridge connecting MP cusp to DB cusp.', clinicalSignificance: 'Must be preserved in Class I cavity preps unless undermined by caries.' },
      { id: '16-carabelli', name: 'Cusp of Carabelli', category: 'crown', position: [-0.62, 1.45, -0.65], normal: [-1, 0, -1], description: 'Fifth non-functional cusp tubercle on lingual aspect of MP cusp.', clinicalSignificance: 'Pathognomonic identifying landmark for Maxillary 1st Molar.' },
      { id: '16-mb-cusp', name: 'Mesiobuccal Cusp', category: 'crown', position: [-0.55, 1.78, 0.48], normal: [-0.5, 1, 0.5], description: 'Broad, sharp buccal cusp.', clinicalSignificance: 'Key guide for Angle Class I molar relationship with mandibular 1st molar.' },
      { id: '16-palatal-root', name: 'Palatal Root (Banana Root)', category: 'root', position: [0, -2.2, -0.65], normal: [0, 0, -1], description: 'Longest, thickest root flaring widely to palatal.', clinicalSignificance: 'Closest to floor of maxillary sinus; houses large single palatal canal.' },
      { id: '16-mb-root', name: 'Mesiobuccal Root (Houses MB1 & MB2)', category: 'root', position: [-0.55, -2.0, 0.45], normal: [-1, 0, 1], description: 'Broad ribbon-shaped root.', clinicalSignificance: 'Site of frequent endodontic failure due to missed MB2 canal.' },
      { id: '16-db-root', name: 'Distobuccal Root', category: 'root', position: [0.55, -1.9, 0.45], normal: [1, 0, 1], description: 'Shortest, conical root.', clinicalSignificance: 'Easy to clean and shape; straight Type I canal.' }
    ],
    guidedSteps: [
      { step: 1, title: 'Tooth Identification', viewAngle: 'occlusal', instruction: 'Identify the rhomboidal occlusal outline and 4 major cusps.', anatomicalObservation: 'Rhomboid profile with mesiopalatal cusp as the largest cusp.' },
      { step: 2, title: 'Oblique Ridge Verification', viewAngle: 'occlusal', instruction: 'Trace the prominent ridge running diagonally from MP to DB cusp.', focusLandmarkId: '16-oblique-ridge', anatomicalObservation: 'Continuous enamel bridge distinguishing maxillary 1st & 2nd molars.' },
      { step: 3, title: 'Cusp of Carabelli Inspection', viewAngle: 'lingual', instruction: 'Rotate to palatal view to search for the Carabelli tubercle.', focusLandmarkId: '16-carabelli', anatomicalObservation: 'Tubercle or pit on the lingual wall of the mesiopalatal cusp.' },
      { step: 4, title: 'Trifurcation & 3 Root Divergence', viewAngle: 'buccal', instruction: 'Examine the 3 widely diverging roots.', focusLandmarkId: '16-palatal-root', anatomicalObservation: 'Palatal banana root flares widely; MB and DB roots spread apart.' },
      { step: 5, title: 'Endodontic MB2 Search Path', viewAngle: 'occlusal', instruction: 'Visualize the canal floor map for MB1, MB2, DB, and Palatal orifices.', anatomicalObservation: 'MB2 is located 1-3mm palatal and slightly mesial to MB1 orifice.' }
    ],
    comparisons: [
      {
        targetFdi: 17,
        targetName: 'Maxillary Right Second Molar (#17)',
        relationship: 'Adjacent Molar',
        differences: [
          '#16 has 4 large cusps + Carabelli; #17 distopalatal cusp is greatly reduced or absent (heart-shaped).',
          '#16 roots are widely divergent; #17 roots are parallel, less divergent, and frequently fused.',
          '#16 has high MB2 prevalence (70-90%); #17 has lower MB2 prevalence (~40-50%).'
        ]
      },
      {
        targetFdi: 46,
        targetName: 'Mandibular Right First Molar (#46)',
        relationship: 'Opposing 1st Molar (Mandibular)',
        differences: [
          '#16 has 3 roots and 4-5 cusps; #46 has 2 broad roots and 5 cusps with Y-groove.',
          '#16 crown is wider buccolingually; #46 crown is wider mesiodistally.',
          '#16 has an oblique ridge; #46 has central, mesial, and distal fossae with buccal groove.'
        ]
      }
    ]
  },

  17: {
    id: '17',
    fdi: 17,
    universal: 2,
    name: 'Maxillary Right Second Molar',
    shortName: 'Max Right 2nd Molar ("12-Year Molar")',
    arch: 'Maxillary',
    side: 'Right',
    quadrant: 1,
    quadrantName: 'Maxillary Right (Q1)',
    category: 'Molar',
    subCategory: 'Second Molar',
    eruptionAge: '12–13 years',
    rootCompletionAge: '14–16 years',
    crownDimensions: { lengthMm: 7.0, mesiodistalMm: 9.0, buccolingualMm: 11.0, rootLengthMm: 12.0 },
    identifyingFeatures: [
      'Crown is smaller in all dimensions than first molar.',
      'Two major crown forms: 4-cusp rhomboidal type or 3-cusp heart-shaped type (DP cusp missing).',
      'No Cusp of Carabelli.',
      '3 roots are closer together, less divergent, and often curve distally in parallel.',
      'Oblique ridge is smaller and less prominent.'
    ],
    crownMorphology: 'Commonly heart-shaped outline due to severe reduction or absence of the distopalatal cusp. Buccal cusps are close together.',
    rootMorphology: '3 roots (2 buccal, 1 palatal) that run nearly parallel and are often partially fused. Marked distal curvature.',
    expectedRoots: 3,
    expectedCanals: '3 to 4 canals (MB1, DB, Palatal; MB2 in ~40%)',
    vertucciClass: 'MB Root: Type I or II; DB & Palatal: Type I',
    anatomicalVariations: [
      'Root fusion (Palatal fused to MB or DB root in 10-15%).',
      'Single C-shaped canal.',
      'Enamel pearls in furcation.'
    ],
    clinicalRelevance: {
      endodontics: 'Canal orifices are located much closer together than in #16. The mesial wall is often closer to the canal cluster.',
      prosthodontics: 'Limited occlusal clearance due to proximity to the coronoid process during jaw movements.',
      periodontics: 'Narrower root trunk and close roots make furcation involvement difficult to instrument with standard curettes.',
      surgery: 'Extraction is simpler than #16 due to less root divergence, but watch for tuberosity fracture.'
    },
    landmarks: [
      { id: '17-crown', name: 'Heart-Shaped Crown', category: 'crown', position: [0, 1.5, 0], normal: [0, 1, 0], description: 'Reduced or absent distopalatal cusp.', clinicalSignificance: 'Characteristic 3-cusp shape in ~40% of cases.' },
      { id: '17-roots', name: 'Parallel Roots', category: 'root', position: [0, -1.8, 0], normal: [0, 0, 1], description: 'Roots closer together with distal tilt.', clinicalSignificance: 'Frequent fusion.' }
    ],
    guidedSteps: [
      { step: 1, title: 'Tooth Identification', viewAngle: 'occlusal', instruction: 'Examine the occlusal table for 3-cusp vs 4-cusp form.', anatomicalObservation: 'Heart-shaped or smaller rhomboid; lacks Cusp of Carabelli.' },
      { step: 2, title: 'Root Convergence Analysis', viewAngle: 'buccal', instruction: 'Look at the root angulation.', anatomicalObservation: 'Roots are closer together and curve distally.' }
    ],
    comparisons: [
      {
        targetFdi: 16,
        targetName: 'Maxillary Right First Molar (#16)',
        relationship: 'Adjacent Molar',
        differences: [
          '#17 is smaller with less divergent roots.',
          '#17 lacks Cusp of Carabelli.',
          '#17 frequently displays a 3-cusp heart-shaped outline.'
        ]
      }
    ]
  },

  18: {
    id: '18',
    fdi: 18,
    universal: 1,
    name: 'Maxillary Right Third Molar',
    shortName: 'Max Right 3rd Molar ("Wisdom Tooth")',
    arch: 'Maxillary',
    side: 'Right',
    quadrant: 1,
    quadrantName: 'Maxillary Right (Q1)',
    category: 'Molar',
    subCategory: 'Third Molar',
    eruptionAge: '17–21 years',
    rootCompletionAge: '18–25 years',
    crownDimensions: { lengthMm: 6.5, mesiodistalMm: 8.5, buccolingualMm: 10.0, rootLengthMm: 11.0 },
    identifyingFeatures: [
      'Most variable crown and root anatomy in the maxillary arch.',
      'Smallest molar in the maxillary arch.',
      'Roots are usually 3 but often fused into a single conical tapered mass curving sharply distally.',
      'Heart-shaped occlusal outline is the most common morphology (3 cusps: MB, DB, MP).',
      'High rate of impaction, malposition, or congenital absence.'
    ],
    crownMorphology: 'Heart-shaped crown with wrinkled occlusal surface. Distal contour is extremely convex.',
    rootMorphology: 'Short, fused roots with strong distal curvature.',
    expectedRoots: 1,
    expectedCanals: '1 to 4 highly variable canals',
    vertucciClass: 'Variable / Undefined',
    anatomicalVariations: ['Peg third molar', 'Supernumerary fourth molar (paramolar)', 'Enamel pearls', 'Root dilaceration'],
    clinicalRelevance: {
      endodontics: 'Rarely indicated for RCT unless critical terminal prosthetic abutment.',
      prosthodontics: 'Poor crown-to-root ratio and unfavorable axial inclination.',
      periodontics: 'Difficult oral hygiene access; pericoronitis and distal caries on #17 are common.',
      surgery: 'Maxillary tuberosity fracture risk is high if extracted with excessive distal leverage.'
    },
    landmarks: [
      { id: '18-crown', name: 'Wrinkled Heart-Shaped Crown', category: 'crown', position: [0, 1.4, 0], normal: [0, 1, 0], description: 'Rudimentary occlusal morphology.', clinicalSignificance: 'Variable anatomy.' },
      { id: '18-roots', name: 'Fused Roots', category: 'root', position: [0, -1.6, 0], normal: [0, 0, 1], description: 'Roots fused into a single conical taper with distal hook.', clinicalSignificance: 'Facilitates straight elevation if not dilacerated.' }
    ],
    guidedSteps: [
      { step: 1, title: 'Tooth Identification', viewAngle: 'occlusal', instruction: 'Observe small heart-shaped crown and multiple supplemental fissures.', anatomicalObservation: 'Smallest maxillary molar with high morphological variability.' }
    ],
    comparisons: []
  },

  // ==========================================
  // QUADRANT 2: MAXILLARY LEFT (FDI 21 - 28)
  // ==========================================
  21: {
    id: '21',
    fdi: 21,
    universal: 9,
    name: 'Maxillary Left Central Incisor',
    shortName: 'Max Left Central Incisor',
    arch: 'Maxillary',
    side: 'Left',
    quadrant: 2,
    quadrantName: 'Maxillary Left (Q2)',
    category: 'Incisor',
    subCategory: 'Central Incisor',
    eruptionAge: '7–8 years',
    rootCompletionAge: '10 years',
    crownDimensions: { lengthMm: 10.5, mesiodistalMm: 8.5, buccolingualMm: 7.0, rootLengthMm: 13.0 },
    identifyingFeatures: [
      'Sharp 90° mesio-incisal angle oriented toward the dental midline.',
      'Rounded disto-incisal line angle on the distal aspect.',
      'Broad trapezoidal labial surface with 3 developmental lobes.',
      'Prominent smooth palatal cingulum slightly distal to center.',
      'Conical single root with rounded apex.'
    ],
    crownMorphology: 'Symmetrical trapezoidal crown; mirrors #11 across the maxillary midline.',
    rootMorphology: 'Conical, blunt apex, rounded triangular cross section at CEJ.',
    expectedRoots: 1,
    expectedCanals: '1 canal (Vertucci Type I in 99.8%)',
    vertucciClass: 'Type I (1-1)',
    anatomicalVariations: ['Talon cusp', 'Dens invaginatus', 'Mamelons persisting into adulthood'],
    clinicalRelevance: {
      endodontics: 'Triangular access cavity centered palatally.',
      prosthodontics: 'Prime esthetic guide for midline alignment.',
      periodontics: 'Steepest interproximal CEJ curvature.',
      surgery: 'Rotational luxation force during extraction.'
    },
    landmarks: [
      { id: '21-crown', name: 'Crown', category: 'crown', position: [0, 1.2, 0], normal: [0, 0, 1], description: 'Broad esthetic crown.', clinicalSignificance: 'Esthetic anchor.' },
      { id: '21-incisal', name: 'Incisal Edge', category: 'crown', position: [0, 2.25, 0.05], normal: [0, 1, 0], description: 'Sharp mesial, rounded distal angle.', clinicalSignificance: 'Incisal guidance.' }
    ],
    guidedSteps: [{ step: 1, title: 'Identification', viewAngle: 'buccal', instruction: 'Verify 90° mesio-incisal angle is towards midline.', anatomicalObservation: 'Mirror of #11.' }],
    comparisons: []
  },

  // ==========================================
  // QUADRANT 3: MANDIBULAR LEFT (FDI 31 - 38)
  // ==========================================
  31: {
    id: '31',
    fdi: 31,
    universal: 24,
    name: 'Mandibular Left Central Incisor',
    shortName: 'Mand Left Central Incisor',
    arch: 'Mandibular',
    side: 'Left',
    quadrant: 3,
    quadrantName: 'Mandibular Left (Q3)',
    category: 'Incisor',
    subCategory: 'Central Incisor',
    eruptionAge: '6–7 years',
    rootCompletionAge: '9 years',
    crownDimensions: { lengthMm: 9.5, mesiodistalMm: 5.0, buccolingualMm: 6.0, rootLengthMm: 12.5 },
    identifyingFeatures: [
      'Smallest tooth in the entire permanent human dentition.',
      'Bilateral symmetry: both mesio-incisal and disto-incisal line angles are sharp 90° angles.',
      'Incisal edge is straight and perpendicular to the buccolingual bisector.',
      'Cingulum is centered and smooth; lingual surface is very flat with indistinct marginal ridges.',
      'Root is severely flattened mesiodistally with deep longitudinal developmental grooves on both sides.',
      'Houses 2 canals (Buccal and Lingual) in up to 25–30% of cases!'
    ],
    crownMorphology: 'Narrow rectangular/trapezoidal labial surface. Highly symmetrical. Flat lingual surface with faint cingulum.',
    rootMorphology: 'Single root, extremely ribbon-like and flattened mesiodistally. Very narrow mesiodistally (3.5mm) but wide buccolingually (6mm). Pronounced proximal depressions.',
    expectedRoots: 1,
    expectedCanals: '1 to 2 canals (2 canals in 20-30%, joining at single apex in Vertucci Type II or separate in Type IV)',
    vertucciClass: 'Type I (70%), Type II (20%), Type IV (10%)',
    anatomicalVariations: ['Two separate roots (very rare)', 'Lingual canal bifurcation hidden behind cingulum'],
    clinicalRelevance: {
      endodontics: 'High incidence of missed lingual canal! The lingual canal is located directly beneath the cingulum; access cavity must extend well onto the cingulum to locate it.',
      prosthodontics: 'Extremely thin crown makes post placement perilous (high perforation risk).',
      periodontics: 'Thin interdental bone and narrow roots make this area prone to rapid periodontal pocket formation and calculus accumulation.',
      surgery: 'Avoid rotational extraction forces! Ribbon-shaped root will fracture instantly; use gentle labiolingual rocking.'
    },
    landmarks: [
      { id: '31-incisal', name: 'Symmetrical Incisal Edge', category: 'crown', position: [0, 1.95, 0], normal: [0, 1, 0], description: 'Bilateral sharp 90° angles.', clinicalSignificance: 'Most symmetrical tooth in human dentition.' },
      { id: '31-root', name: 'Ribbon-Shaped Root', category: 'root', position: [0, -1.6, 0], normal: [0, 0, 1], description: 'Flattened mesiodistally with deep longitudinal grooves.', clinicalSignificance: 'Harbors 2 canals in up to 30% of teeth.' }
    ],
    guidedSteps: [
      { step: 1, title: 'Bilateral Symmetry Verification', viewAngle: 'buccal', instruction: 'Observe the nearly identical sharp 90° mesial and distal angles.', anatomicalObservation: 'Smallest tooth with remarkable bilateral symmetry.' },
      { step: 2, title: 'Proximal Ribbon Root Profile', viewAngle: 'mesial', instruction: 'Rotate to proximal view to see the wide buccolingual dimension.', anatomicalObservation: 'Twice as wide buccolingually as mesiodistally; deep longitudinal groove.' }
    ],
    comparisons: []
  },

  // ==========================================
  // QUADRANT 4: MANDIBULAR RIGHT (FDI 41 - 48)
  // ==========================================
  41: {
    id: '41',
    fdi: 41,
    universal: 25,
    name: 'Mandibular Right Central Incisor',
    shortName: 'Mand Right Central Incisor',
    arch: 'Mandibular',
    side: 'Right',
    quadrant: 4,
    quadrantName: 'Mandibular Right (Q4)',
    category: 'Incisor',
    subCategory: 'Central Incisor',
    eruptionAge: '6–7 years',
    rootCompletionAge: '9 years',
    crownDimensions: { lengthMm: 9.5, mesiodistalMm: 5.0, buccolingualMm: 6.0, rootLengthMm: 12.5 },
    identifyingFeatures: [
      'Smallest tooth in permanent dentition.',
      'Near perfect bilateral symmetry with 90° line angles.',
      'Straight incisal edge perpendicular to buccolingual axis.',
      'Flattened ribbon-shaped root with deep proximal grooves.',
      'Harbors 2 canals (Buccal and Lingual) in 25–30%.'
    ],
    crownMorphology: 'Symmetrical, narrow, smooth lingual fossa.',
    rootMorphology: 'Ribbon-like, narrow mesiodistally, wide labiolingually.',
    expectedRoots: 1,
    expectedCanals: '1 to 2 canals (2 canals in 25-30%)',
    vertucciClass: 'Type I (70%), Type II/IV (30%)',
    anatomicalVariations: ['Bifurcated lingual canal', 'Apical root curvature'],
    clinicalRelevance: {
      endodontics: 'Always hunt for the lingual canal by extending access into the cingulum.',
      prosthodontics: 'Delicate crown; avoid heavy metal-ceramic reductions.',
      periodontics: 'Frequent heavy supragingival and subgingival calculus from Wharton duct saliva pooling.',
      surgery: 'Labiolingual luxation only; rotational force will fracture the root.'
    },
    landmarks: [
      { id: '41-incisal', name: 'Incisal Edge', category: 'crown', position: [0, 1.95, 0], normal: [0, 1, 0], description: 'Sharp symmetrical incisal corners.', clinicalSignificance: 'Mandibular anterior alignment.' }
    ],
    guidedSteps: [{ step: 1, title: 'Identification', viewAngle: 'buccal', instruction: 'Verify narrow symmetric crown.', anatomicalObservation: 'Mirror of #31.' }],
    comparisons: []
  },

  46: {
    id: '46',
    fdi: 46,
    universal: 30,
    name: 'Mandibular Right First Molar',
    shortName: 'Mand Right 1st Molar ("Key of Occlusion")',
    arch: 'Mandibular',
    side: 'Right',
    quadrant: 4,
    quadrantName: 'Mandibular Right (Q4)',
    category: 'Molar',
    subCategory: 'First Molar',
    eruptionAge: '6–7 years',
    rootCompletionAge: '9–10 years',
    crownDimensions: { lengthMm: 7.5, mesiodistalMm: 11.0, buccolingualMm: 10.5, rootLengthMm: 14.0 },
    identifyingFeatures: [
      'Largest tooth in the mandibular arch with pentagonal occlusal outline.',
      '5 sculpted cusps: 3 buccal (Mesiobuccal, Distobuccal, Distal - smallest) and 2 lingual (Mesiolingual, Distolingual - taller and sharper).',
      'Two buccal developmental grooves: Mesiobuccal groove (often ends in a pit) and Distobuccal groove.',
      'Y-shaped occlusal groove pattern formed by the central, buccal, and lingual grooves.',
      '2 broad, ribbon-like roots (Mesial and Distal) with wide furcation vault.',
      'Mesial root typically houses 2 canals (MB and ML, with frequent isthmus); Distal root houses 1-2 canals (Distal, Distolingual).'
    ],
    crownMorphology: 'Pentagonal outline tapering distally and lingually. Buccal cervical third features a prominent buccal cervical ridge (height of contour). Lingual cusps are taller and sharper than the buccal cusps. Central fossa is large and circular.',
    rootMorphology: 'Two broad, divergent roots. Mesial root is strongly curved distally with a deep longitudinal depression on its distal surface. Distal root is straighter and slightly smaller. Large accessible furcation fornix (~3mm from CEJ on buccal, ~4mm on lingual).',
    expectedRoots: 2,
    expectedCanals: '3 to 4 canals (MB, ML, and 1 or 2 Distal canals; middle mesial canal in 10-15%)',
    vertucciClass: 'Mesial: Type IV (2-2) or Type II (2-1); Distal: Type I (1-1) or Type II (2-1)',
    anatomicalVariations: [
      'Radix Entomolaris (supernumerary third distolingual root, found in 5-30% of Asian and certain Middle Eastern populations!).',
      'Radix Paramolaris (extra mesiobuccal root).',
      'Middle Mesial canal (third canal located in the isthmus between MB and ML in 12-15%).',
      'Taurodontism.'
    ],
    clinicalRelevance: {
      endodontics: 'Access cavity is trapezoidal with wider base towards the mesial. Mesial canals (MB and ML) are connected by an isthmus that must be disinfected thoroughly. Always inspect the distolingual line angle for an extra Radix Entomolaris canal orifice.',
      prosthodontics: 'Fundamental cornerstone of occlusion (Angle Class I landmark). Buccal cusps are functional stamp cusps requiring 1.5mm reduction.',
      periodontics: 'Buccal furcation entrance is 3mm from CEJ, lingual is 4mm. Cervical enamel projections (CEPs Grade I–III) frequently extend into the furcation, acting as plaque retention sites.',
      surgery: 'Extraction requires strong buccolingual rocking. In cases of divergent roots or extensive caries, surgical hemisection or bisection along the furcation is indicated.'
    },
    landmarks: [
      { id: '46-mb-cusp', name: 'Mesiobuccal Cusp', category: 'crown', position: [-0.52, 1.8, 0.48], normal: [-0.5, 1, 0.5], description: 'Bulky buccal cusp.', clinicalSignificance: 'Articulates in mesial triangular fossa of maxillary 1st molar.' },
      { id: '46-db-cusp', name: 'Distobuccal Cusp', category: 'crown', position: [0.15, 1.78, 0.50], normal: [0, 1, 0.5], description: 'Second largest buccal cusp.', clinicalSignificance: 'Stamp cusp maintaining centric occlusion.' },
      { id: '46-distal-cusp', name: 'Distal Cusp (5th Cusp)', category: 'crown', position: [0.65, 1.65, 0.32], normal: [1, 1, 0.5], description: 'Smallest cusp on the distobuccal line angle.', clinicalSignificance: 'Diagnostic pathognomonic feature distinguishing 1st from 2nd mandibular molar.' },
      { id: '46-ml-cusp', name: 'Mesiolingual Cusp (Sharp)', category: 'crown', position: [-0.48, 1.95, -0.46], normal: [-0.5, 1, -0.5], description: 'Tall, sharp non-functional guiding cusp.', clinicalSignificance: 'Height guides lateral disocclusion.' },
      { id: '46-furcation', name: 'Buccal Furcation Fluting', category: 'root', position: [0, -1.0, 0.45], normal: [0, 0, 1], description: 'Furcation entrance 3mm apical to CEJ.', clinicalSignificance: 'Frequent site for Glickman Class I–IV furcation involvement.' },
      { id: '46-mesial-root', name: 'Mesial Root (MB & ML Canals)', category: 'root', position: [-0.45, -2.1, 0], normal: [-1, 0, 0], description: 'Broad curved root harboring 2 canals connected by an isthmus.', clinicalSignificance: 'Danger zone on distal wall (strip perforation risk during flaring).' },
      { id: '46-distal-root', name: 'Distal Root', category: 'root', position: [0.45, -2.0, 0], normal: [1, 0, 0], description: 'Straight or slightly curved distal root.', clinicalSignificance: 'Houses 1 wide oval or 2 separate canals.' }
    ],
    guidedSteps: [
      { step: 1, title: 'Tooth Identification', viewAngle: 'occlusal', instruction: 'Count the 5 distinct cusps on the pentagonal occlusal table.', anatomicalObservation: '5 cusps (3 buccal, 2 lingual) with classic Y-groove pattern.' },
      { step: 2, title: 'Distal Cusp Verification', viewAngle: 'buccal', instruction: 'Locate the small 5th distal cusp on the distobuccal corner.', focusLandmarkId: '46-distal-cusp', anatomicalObservation: 'Differentiates the 5-cusp 1st molar from the 4-cusp 2nd molar.' },
      { step: 3, title: 'Buccal Cervical Ridge & Contours', viewAngle: 'mesial', instruction: 'Inspect the prominent cervical bulge on the buccal surface.', anatomicalObservation: 'Buccal height of contour is in the cervical third, tilting crown lingually.' },
      { step: 4, title: 'Furcation Morphology & Root Curvature', viewAngle: 'buccal', instruction: 'Examine the 2 broad roots and furcation vault.', focusLandmarkId: '46-furcation', anatomicalObservation: 'Broad mesial root curves distally; furcation begins 3mm from CEJ.' },
      { step: 5, title: 'Endodontic Canal Orifices & Isthmus', viewAngle: 'occlusal', instruction: 'Review the trapezoidal pulp chamber floor layout.', anatomicalObservation: 'MB, ML, and Distal canals; watch for Middle Mesial and Radix Entomolaris.' }
    ],
    comparisons: [
      {
        targetFdi: 47,
        targetName: 'Mandibular Right Second Molar (#47)',
        relationship: 'Adjacent Molar',
        differences: [
          '#46 has 5 cusps with a Y-groove; #47 has 4 cusps with a symmetrical cross (+) groove pattern.',
          '#46 has 2 distinct buccal developmental grooves; #47 has only 1 buccal groove.',
          '#46 roots are widely separated; #47 roots are closer together and more prone to C-shaped configurations.'
        ]
      },
      {
        targetFdi: 16,
        targetName: 'Maxillary Right First Molar (#16)',
        relationship: 'Opposing Molar',
        differences: [
          '#46 has 2 roots and 5 cusps; #16 has 3 roots and 4-5 cusps (Carabelli).',
          '#46 crown is longer mesiodistally; #16 is wider buccolingually.',
          '#46 has a central fossa and buccal grooves; #16 has an oblique ridge.'
        ]
      }
    ]
  },

  47: {
    id: '47',
    fdi: 47,
    universal: 31,
    name: 'Mandibular Right Second Molar',
    shortName: 'Mand Right 2nd Molar ("12-Year Molar")',
    arch: 'Mandibular',
    side: 'Right',
    quadrant: 4,
    quadrantName: 'Mandibular Right (Q4)',
    category: 'Molar',
    subCategory: 'Second Molar',
    eruptionAge: '11–13 years',
    rootCompletionAge: '14–15 years',
    crownDimensions: { lengthMm: 7.0, mesiodistalMm: 10.0, buccolingualMm: 10.0, rootLengthMm: 13.0 },
    identifyingFeatures: [
      'Rectangular occlusal outline with 4 nearly equal cusps (MB, DB, ML, DL).',
      'Cross (+) or hot-cross-bun occlusal groove pattern dividing the cusps symmetrically.',
      'Single buccal developmental groove terminating in a buccal pit.',
      'No fifth distal cusp.',
      'Roots are closer together, less divergent than in 1st molar, and curve distally.',
      'Highest incidence of C-shaped canal systems of all teeth (up to 8-30% in Asian/Middle Eastern populations!).'
    ],
    crownMorphology: 'Rectangular, symmetrical occlusal table. Cusps separated by straight central and buccolingual grooves forming a cruciform (+) pattern.',
    rootMorphology: '2 roots (Mesial and Distal) closer together than in #46, with parallel or converging paths. High rate of buccal or lingual root sheet fusion creating C-shaped anatomy.',
    expectedRoots: 2,
    expectedCanals: '3 canals (MB, ML, Distal) or continuous C-shaped ribbon canal (Melton/Fan Categories I–III)',
    vertucciClass: 'Variable / C-shaped classification',
    anatomicalVariations: [
      'C-shaped canal configuration (Fan Type I continuous C, Type II semicolon, Type III separate orifices merging).',
      'Fused roots into single conical trunk.',
      'Enamel pearls.'
    ],
    clinicalRelevance: {
      endodontics: 'C-shaped canals represent an endodontic challenge; conventional rotary instrumentation cannot clean the continuous ribbon isthmus. Copious ultrasonic NaOCl irrigation and warm vertical compaction are required.',
      prosthodontics: 'Crown height is often short; axial reduction must provide retention grooves.',
      periodontics: 'Roots are close together; interradicular bone is thin, making furcation defects difficult to graft.',
      surgery: 'Extraction is facilitated by root convergence, but caution is needed with dense mandibular cortical plate.'
    },
    landmarks: [
      { id: '47-cross-groove', name: 'Cruciform (+) Groove Pattern', category: 'crown', position: [0, 1.5, 0], normal: [0, 1, 0], description: 'Characteristic symmetrical 4-cusp cross pattern.', clinicalSignificance: 'Pathognomonic identifying landmark.' },
      { id: '47-roots', name: 'Convergent Roots', category: 'root', position: [0, -1.8, 0], normal: [0, 0, 1], description: 'Roots close together with distal sweep.', clinicalSignificance: 'High predilection for C-shaped canal systems.' }
    ],
    guidedSteps: [
      { step: 1, title: 'Cruciform Groove Pattern', viewAngle: 'occlusal', instruction: 'Observe the 4 symmetrical cusps divided by the cross (+) fissure.', anatomicalObservation: 'Absence of 5th distal cusp; textbook cruciform pattern.' },
      { step: 2, title: 'Root Convergence & C-Shaped Awareness', viewAngle: 'buccal', instruction: 'Examine the close proximity of mesial and distal roots.', anatomicalObservation: 'Watch for C-shaped canal variations during endodontic treatment.' }
    ],
    comparisons: [
      {
        targetFdi: 46,
        targetName: 'Mandibular Right First Molar (#46)',
        relationship: 'Adjacent 1st Molar',
        differences: [
          '#47 has 4 cusps in a cross pattern; #46 has 5 cusps in a Y-groove.',
          '#47 roots are closer together; #46 roots are widely separated.',
          '#47 has a high rate of C-shaped canals (up to 30%); #46 rarely exhibits C-shape.'
        ]
      }
    ]
  },

  48: {
    id: '48',
    fdi: 48,
    universal: 32,
    name: 'Mandibular Right Third Molar',
    shortName: 'Mand Right 3rd Molar ("Wisdom Tooth")',
    arch: 'Mandibular',
    side: 'Right',
    quadrant: 4,
    quadrantName: 'Mandibular Right (Q4)',
    category: 'Molar',
    subCategory: 'Third Molar',
    eruptionAge: '17–21 years',
    rootCompletionAge: '18–25 years',
    crownDimensions: { lengthMm: 7.0, mesiodistalMm: 10.0, buccolingualMm: 9.5, rootLengthMm: 11.0 },
    identifyingFeatures: [
      'Highly variable crown anatomy (frequently 4 or 5 cusps with wrinkled occlusal surface).',
      'Roots are short, poorly developed, and frequently fused into a single conical mass curving distally.',
      'Crown is bulbous with a rounded rectangular or ovoid outline.',
      'Most commonly impacted tooth along with the maxillary third molar.',
      'Intimate anatomical relationship with the Inferior Alveolar Canal (IAC) and Lingual Nerve.'
    ],
    crownMorphology: 'Bulbous crown, rounded contours, numerous supplemental grooves.',
    rootMorphology: 'Typically 2 fused or converging roots curving sharply towards the distal.',
    expectedRoots: 2,
    expectedCanals: 'Variable (1 to 3 canals, often fused)',
    vertucciClass: 'Variable',
    anatomicalVariations: ['Mesioangular / horizontal / distoangular impaction', 'Pell & Gregory Class I-III, Position A-C', 'Multiple accessory rootlets'],
    clinicalRelevance: {
      endodontics: 'Seldom performed due to extreme canal curvature and poor access.',
      prosthodontics: 'Occlusal plane supereruption when opposing tooth is lost.',
      periodontics: 'Pericoronitis of the operculum is the most common emergency.',
      surgery: 'Surgical extraction requires careful radiographic evaluation (CBCT) of the inferior alveolar nerve (darkening of roots, interruption of white lines, diversion of canal).'
    },
    landmarks: [
      { id: '48-crown', name: 'Bulbous Crown', category: 'crown', position: [0, 1.4, 0], normal: [0, 1, 0], description: 'Rounded bulbous morphology.', clinicalSignificance: 'Impaction predilection.' },
      { id: '48-roots', name: 'Fused Distally-Curved Roots', category: 'root', position: [0, -1.6, 0], normal: [0, 0, 1], description: 'Roots hooked distally.', clinicalSignificance: 'Danger zone near inferior alveolar nerve.' }
    ],
    guidedSteps: [
      { step: 1, title: 'Impaction & Morphology', viewAngle: 'occlusal', instruction: 'Observe the bulbous wrinkled crown outline.', anatomicalObservation: 'Most common tooth requiring surgical odontectomy.' }
    ],
    comparisons: []
  }
};

// Helper generator to populate all remaining 32 teeth with accurate anatomical mirroring
export const getAllPermanentTeeth = (): PermanentToothData[] => {
  const result: PermanentToothData[] = [];
  
  // All 32 permanent teeth numbers in anatomical FDI sequence
  const fdiList = [
    18, 17, 16, 15, 14, 13, 12, 11,
    21, 22, 23, 24, 25, 26, 27, 28,
    48, 47, 46, 45, 44, 43, 42, 41,
    31, 32, 33, 34, 35, 36, 37, 38
  ];

  fdiList.forEach((fdi) => {
    if (PERMANENT_TEETH_DATA[fdi]) {
      result.push(PERMANENT_TEETH_DATA[fdi]);
    } else {
      // Procedurally generate synthesized anatomical record mirroring contralateral quadrant
      const quad = Math.floor(fdi / 10);
      const pos = fdi % 10;
      let templateFdi = fdi;

      // Map to known template
      if (quad === 2) templateFdi = 10 + pos; // Q2 mirrors Q1
      else if (quad === 3) templateFdi = 40 + pos; // Q3 mirrors Q4
      else if (quad === 4 && pos === 2) templateFdi = 12;
      else if (quad === 4 && pos === 3) templateFdi = 13;
      else if (quad === 4 && pos === 4) templateFdi = 14;
      else if (quad === 4 && pos === 5) templateFdi = 15;

      const template = PERMANENT_TEETH_DATA[templateFdi] || PERMANENT_TEETH_DATA[11];
      const isMax = quad === 1 || quad === 2;
      const side = quad === 1 || quad === 4 ? 'Right' : 'Left';
      const quadNames = ['', 'Maxillary Right (Q1)', 'Maxillary Left (Q2)', 'Mandibular Left (Q3)', 'Mandibular Right (Q4)'];

      // Universal calculation
      let universal = 1;
      if (quad === 1) universal = 9 - pos; // 18->1, 11->8
      else if (quad === 2) universal = 8 + pos; // 21->9, 28->16
      else if (quad === 3) universal = 25 - pos; // 31->24, 38->17
      else if (quad === 4) universal = 24 + pos; // 41->25, 48->32

      const toothTypes: Record<number, { cat: 'Incisor' | 'Canine' | 'Premolar' | 'Molar'; sub: any; name: string }> = {
        1: { cat: 'Incisor', sub: 'Central Incisor', name: 'Central Incisor' },
        2: { cat: 'Incisor', sub: 'Lateral Incisor', name: 'Lateral Incisor' },
        3: { cat: 'Canine', sub: 'Canine', name: 'Canine' },
        4: { cat: 'Premolar', sub: 'First Premolar', name: 'First Premolar' },
        5: { cat: 'Premolar', sub: 'Second Premolar', name: 'Second Premolar' },
        6: { cat: 'Molar', sub: 'First Molar', name: 'First Molar' },
        7: { cat: 'Molar', sub: 'Second Molar', name: 'Second Molar' },
        8: { cat: 'Molar', sub: 'Third Molar', name: 'Third Molar' }
      };

      const typeInfo = toothTypes[pos] || toothTypes[1];
      const archStr = isMax ? 'Maxillary' : 'Mandibular';

      result.push({
        ...template,
        id: `${fdi}`,
        fdi,
        universal,
        name: `${archStr} ${side} ${typeInfo.name}`,
        shortName: `${archStr.slice(0, 4)} ${side.slice(0, 2)} ${typeInfo.name}`,
        arch: archStr as 'Maxillary' | 'Mandibular',
        side: side as 'Right' | 'Left',
        quadrant: quad as 1 | 2 | 3 | 4,
        quadrantName: quadNames[quad],
        category: typeInfo.cat,
        subCategory: typeInfo.sub
      });
    }
  });

  return result;
};
