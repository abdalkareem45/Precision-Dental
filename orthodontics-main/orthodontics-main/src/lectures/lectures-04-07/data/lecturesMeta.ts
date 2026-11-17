import type { LectureMeta } from '../types/lecture';

export const LECTURES_META: LectureMeta[] = [
  {
    id: 'lecture-4',
    number: 4,
    shortTitle: 'Lec 4 · TMDs',
    title: 'Temporomandibular Disorders (TMDs)',
    subtitle:
      'Multifactorial etiology, orthopedic stability vs. occlusal interference, systematic palpation examination, and three-stage orthodontic management.',
    sourceLabel: 'Lecture 4 · 5th Year Orthodontics · Alfarabi University College of Dentistry',
    objectives: [
      'Differentiate Myogenic (muscle pain) from Arthrogenic (intra-capsular) TMD presentations and major contributing etiologies.',
      'Explain orthopedic stability of the TMJ versus acute occlusal interferences and protective muscle co-contraction.',
      'Perform the 30-day TMD screening history and bilateral palpation of temporalis, masseter, and TMJ static/dynamic zones.',
      'Apply the 3-stage orthodontic management protocol before, during, and after active treatment.',
    ],
    sandboxes: [
      { id: 'lec4-3d', label: '3D TMJ Biomechanics', kind: '3D Sandbox' },
      { id: 'lec4-2d-etiology', label: 'Etiology & Threshold', kind: '2D Sandbox' },
      { id: 'lec4-2d-palpation', label: 'Palpation Atlas', kind: '2D Sandbox' },
      { id: 'lec4-2d-sounds', label: 'Click vs. Crepitation', kind: '2D Sandbox' },
      { id: 'lec4-2d-protocol', label: 'Screening & Protocol', kind: '2D Sandbox' },
      { id: 'lec4-quiz', label: 'Knowledge Check', kind: 'Knowledge Check' },
    ],
    summaryPoints: [
      'Orthodontic therapy neither reliably causes nor cures TMDs; it routinely modifies only the occlusal factor.',
      'Orthopedic stability exists when stable occlusal biting position coincides with musculoskeletally stable condyle-disc-eminence seating.',
      'A click is a single short-duration sound; crepitation is a multiple gravel-like grating sound associated with osteoarthritic changes.',
      'Every orthodontic patient requires pre-treatment TMD screening; acute or severe pre-existing TMD postpones orthodontic commencement.',
    ],
    limitationsNote:
      'Educational models visualize conceptual biomechanics and screening workflows derived strictly from Lecture 4 course notes. They are not validated diagnostic tools and do not replace clinical examination by a qualified dentist or TMD specialist.',
    quiz: [
      {
        id: 'l4-q1',
        prompt: 'Which broad category accounts for the most common form of Temporomandibular Disorders (TMDs)?',
        options: [
          { id: 'a', text: 'Myogenic (muscle pain) disorders' },
          { id: 'b', text: 'Intra-capsular ankylosis' },
          { id: 'c', text: 'Acute macrotrauma fractures' },
          { id: 'd', text: 'Developmental condylar hyperplasia' },
        ],
        correctOptionId: 'a',
        explanation:
          'Most TMDs fall into two broad categories: muscle pain (Myogenic), which is the most common, or intra-capsular (Arthrogenic) disorders.',
      },
      {
        id: 'l4-q2',
        prompt: 'What characterizes "crepitation" during dynamic TMJ palpation?',
        options: [
          { id: 'a', text: 'A single, brief popping sound on opening only' },
          { id: 'b', text: 'A multiple, gravel-like grating sound linked to osteoarthritic changes' },
          { id: 'c', text: 'Silent hypermobility past the articular eminence' },
          { id: 'd', text: 'Protective muscle co-contraction without joint noise' },
        ],
        correctOptionId: 'b',
        explanation:
          'A click is a single sound of short duration, whereas crepitation is a multiple, gravel-like grating sound most commonly associated with osteoarthritic articular surface changes.',
      },
      {
        id: 'l4-q3',
        prompt: 'A patient reports waking up in the morning with painful jaw muscles. Which parafunctional pattern is most likely?',
        options: [
          { id: 'a', text: 'Late-afternoon daytime gum chewing' },
          { id: 'b', text: 'Sleep-related bruxism' },
          { id: 'c', text: 'Acute macrotrauma during sports' },
          { id: 'd', text: 'Post-orthodontic retention relapse' },
        ],
        correctOptionId: 'b',
        explanation:
          'Patients who wake up in the morning with painful muscles are likely experiencing sleep-related bruxism, whereas pain developing in late afternoons or evenings suggests daytime clenching or another etiology.',
      },
      {
        id: 'l4-q4',
        prompt: 'According to Table 1, how should an orthodontist respond if acute, severe TMD signs are present at initial presentation?',
        options: [
          { id: 'a', text: 'Begin heavy Class II elastics immediately to correct occlusion' },
          { id: 'b', text: 'Proceed normally because orthodontics cures TMD' },
          { id: 'c', text: 'Postpone orthodontic treatment until the TMD condition is resolved or stabilized' },
          { id: 'd', text: 'Extract premolars before recording TMD history' },
        ],
        correctOptionId: 'c',
        explanation:
          'At time of presentation, inform the patient that orthodontics will not resolve TMD, record full history/exam, and postpone orthodontic commencement if TMD is acute and severe until resolved or stabilized.',
      },
    ],
  },
  {
    id: 'lecture-5',
    number: 5,
    shortTitle: 'Lec 5 · Cephalometrics',
    title: 'Lateral Cephalometrics',
    subtitle:
      'Standardized radiographic apparatus, skeletal/dental landmarks and planes, Eastman sagittal & vertical analyses, soft-tissue lines, and growth superimposition.',
    sourceLabel: 'Lecture 5 · 5th Year Orthodontics · Alfarabi University College of Dentistry',
    objectives: [
      'Describe cephalostat standardization (5 ft source-to-midsagittal distance, ear rods, Natural Head Position) and why 7–8% magnification favors angular measurements.',
      'Locate core cephalometric points (S, N, Or, Po, A, B, ANS, PNS, Go, Me, Pog) and construct horizontal and vertical reference planes.',
      'Compare ANB angle against Wits’ appraisal and evaluate vertical proportions using MMPA, Anterior Facial Proportion, and Jarabak Ratio.',
      'Interpret soft-tissue balance (Nasolabial angle, E-line, S-line) and select stable anatomical structures for longitudinal superimposition.',
    ],
    sandboxes: [
      { id: 'lec5-3d', label: '3D Cephalostat Rig', kind: '3D Sandbox' },
      { id: 'lec5-2d-landmarks', label: 'Landmarks & Planes', kind: '2D Sandbox' },
      { id: 'lec5-2d-ap', label: 'ANB vs. Wits’ Lab', kind: '2D Sandbox' },
      { id: 'lec5-2d-vertical', label: 'Vertical & Incisors', kind: '2D Sandbox' },
      { id: 'lec5-2d-soft', label: 'Soft Tissue & Growth', kind: '2D Sandbox' },
      { id: 'lec5-quiz', label: 'Knowledge Check', kind: 'Knowledge Check' },
    ],
    summaryPoints: [
      'Cephalometric radiography uses a fixed 5 ft source-to-midsagittal distance; inevitable 7–8% magnification makes angular measurements preferable to linear ones.',
      'Eastman norms: SNA 81°±3°, SNB 78°±3°, ANB 3°±2°, U1/Max 109°±6°, L1/Mand 93°±6°, Inter-incisal 135°±10°, MMPA 27°±4°.',
      'Lower incisor compensation follows Lower incisor angle = 120° − MMPA; Jarabak ratio normal is 62–65%.',
      'Cephalometrics is an adjunct to clinical assessment: orthodontic aim is improving patient appearance and function, not chasing a numerical norm.',
    ],
    limitationsNote:
      'Cephalometric norms shown (Eastman standard, Wits’, Jarabak, Rickett’s E-line, Steiner’s S-line) represent textbook reference ranges for specific populations and require clinical correlation.',
    quiz: [
      {
        id: 'l5-q1',
        prompt: 'Why are angular measurements generally preferred over linear measurements in lateral cephalometrics?',
        options: [
          { id: 'a', text: 'Angular measurements eliminate the need for ear rods' },
          { id: 'b', text: 'Inevitable 7–8% radiographic magnification has less impact on angles than on linear distances' },
          { id: 'c', text: 'Linear measurements cannot be digitized on monitors' },
          { id: 'd', text: 'Angles are unaffected by landmark identification errors' },
        ],
        correctOptionId: 'b',
        explanation:
          'Because the film/sensor sits 0.5–1 ft from the midsagittal plane with a 5 ft source distance, ~7–8% magnification occurs; angular measurements remain largely unaffected by uniform magnification.',
      },
      {
        id: 'l5-q2',
        prompt: 'Using the Eastman compensation formula (Lower incisor angle = 120° − MMPA), what is the expected lower incisor angle if MMPA is 35°?',
        options: [
          { id: 'a', text: '93°' },
          { id: 'b', text: '85°' },
          { id: 'c', text: '101°' },
          { id: 'd', text: '75°' },
        ],
        correctOptionId: 'b',
        explanation:
          'As MMPA increases, lower incisors tend to retrocline: 120° − 35° = 85°.',
      },
      {
        id: 'l5-q3',
        prompt: 'What is the primary limitation of Wits’ analysis?',
        options: [
          { id: 'a', text: 'It depends on the position of Nasion along the cranial base' },
          { id: 'b', text: 'The Functional Occlusal Plane (FOP) is difficult to locate reproducibly, and slight angulation changes markedly shift AO and BO' },
          { id: 'c', text: 'It only works in Class III skeletal patterns' },
          { id: 'd', text: 'It requires barium paste down the midsagittal plane' },
        ],
        correctOptionId: 'b',
        explanation:
          'Wits’ analysis projects perpendiculars from A and B onto the FOP; because the FOP is hard to locate consistently, slight angulation differences significantly alter AO–BO measurements.',
      },
      {
        id: 'l5-q4',
        prompt: 'Which maxillary structure is preferred for longitudinal superimposition because it is least affected by periosteal remodeling?',
        options: [
          { id: 'a', text: 'Point A (subspinale)' },
          { id: 'b', text: 'Anterior contour of the zygomatic process' },
          { id: 'c', text: 'Labial alveolar crest of the central incisor' },
          { id: 'd', text: 'Tip of the anterior nasal spine' },
        ],
        correctOptionId: 'b',
        explanation:
          'The anterior contour of the zygomatic process is least affected by remodeling and is the preferred maxillary superimposition structure (though maxillary plane registered at PNS is often used for convenience).',
      },
    ],
  },
  {
    id: 'lecture-6',
    number: 6,
    shortTitle: 'Lec 6 · OPG',
    title: 'Orthopantomogram (OPG)',
    subtitle:
      'Panoramic radiography principles, exposure considerations, 7 clinical indications, 7-step systematic reading, 18 bony landmarks, and ghost artifacts.',
    sourceLabel: 'Lecture 6 · 5th Year Orthodontics · Alfarabi University College of Dentistry',
    objectives: [
      'Weigh the advantages (comfort, ≤1.5 min, broad coverage) and limitations (lower incisor distortion, poor periodontal detail) of OPG, recognizing that exposure varies by equipment and protocol.',
      'Select when supplementary intraoral radiographs (IOPA for root resorption/periodontal membrane; bitewing for caries) are required.',
      'Execute the 7-step systematic OPG reading sequence across mandible, maxilla, sinuses, symmetry, dentition, third molars, and soft tissues.',
      'Identify all 18 bony structures (Fig. 8) and recognize radiopaque contralateral "ghost" artifacts.',
    ],
    sandboxes: [
      { id: 'lec6-3d', label: '3D Panoramic Scanner', kind: '3D Sandbox' },
      { id: 'lec6-2d-anatomy', label: '18-Landmark Atlas', kind: '2D Sandbox' },
      { id: 'lec6-2d-steps', label: '7-Step Reading Lab', kind: '2D Sandbox' },
      { id: 'lec6-2d-cases', label: 'Cases & Modalities', kind: '2D Sandbox' },
      { id: 'lec6-2d-ghost', label: 'Ghost Artifact Lab', kind: '2D Sandbox' },
      { id: 'lec6-quiz', label: 'Knowledge Check', kind: 'Knowledge Check' },
    ],
    summaryPoints: [
      'OPG exposure varies by equipment and protocol. The supplied figure of 5.06 rad is an unverified source figure; its value and units require faculty verification and must not be used as a validated dose estimate.',
      'OPG is non-standardized and suffers from distortion, magnification, and overlap—most notably in the lower incisor region.',
      'Always read systematically from right condyle to left condyle, then maxilla/sinuses comparing right vs. left, then teeth, 3rd molars, and soft tissue.',
      'Ghost images are radiopaque artifacts projected onto the opposite side when the X-ray beam passes through dense structures such as the cervical spine.',
    ],
    limitationsNote:
      'Radiographic diagrams and simulated lesions are schematic educational representations based on Lecture 6 figures and do not replace calibrated diagnostic monitors or clinical correlation.',
    quiz: [
      {
        id: 'l6-q1',
        prompt: 'In which anatomical region are OPG distortion, magnification, and overlapping structures most problematic?',
        options: [
          { id: 'a', text: 'Mandibular condyles' },
          { id: 'b', text: 'Lower incisors region' },
          { id: 'c', text: 'Mandibular angle and ramus' },
          { id: 'd', text: 'Maxillary sinus floor' },
        ],
        correctOptionId: 'b',
        explanation:
          'Distortions, magnifications, and overlapping of structures on an OPG are especially problematic in the lower incisors region, where a periapical (IOPA) radiograph provides superior detail.',
      },
      {
        id: 'l6-q2',
        prompt: 'Why is evaluating the maxillary sinuses on an OPG clinically relevant to orthodontists?',
        options: [
          { id: 'a', text: 'Enlarged sinuses always cause mandibular prognathism' },
          { id: 'b', text: 'Reduced sinus size is associated with mouth breathing and collapse of maxillary segments' },
          { id: 'c', text: 'Sinuses determine the Tanaka-Johnson constant' },
          { id: 'd', text: 'Sinus outline replaces the Frankfort horizontal plane' },
        ],
        correctOptionId: 'b',
        explanation:
          'Lecture 6 highlights that reduced maxillary sinus size is related to mouth breathing and collapse of maxillary segments.',
      },
      {
        id: 'l6-q3',
        prompt: 'How is a "ghost" artifact produced on an orthopantomogram?',
        options: [
          { id: 'a', text: 'A radiolucent air gap between the tongue and hard palate' },
          { id: 'b', text: 'When the X-ray beam passes through a dense object (e.g., spinal cord/spine) and projects a radiopaque shadow onto the opposite side' },
          { id: 'c', text: 'Underexposure of the digital sensor for less than 1.5 minutes' },
          { id: 'd', text: 'Superimposition of the nasal septum over the mental triangle' },
        ],
        correctOptionId: 'b',
        explanation:
          'Ghost images are radiopaque shadows superimposed on normal anatomy when the X-ray beam projects through a dense object onto the opposite side of the radiograph.',
      },
      {
        id: 'l6-q4',
        prompt: 'Which radiograph is preferred over an OPG when precise details of upper incisor root resorption or periodontal membrane are needed?',
        options: [
          { id: 'a', text: 'Posteroanterior cephalogram' },
          { id: 'b', text: 'Intraoral periapical radiograph (IOPA)' },
          { id: 'c', text: 'Lateral skull cephalogram with aluminum wedge' },
          { id: 'd', text: 'TMJ tomography' },
        ],
        correctOptionId: 'b',
        explanation:
          'OPG cannot give precise information on the periodontal membrane or subtle root resorption; an intraoral periapical radiograph (IOPA) is preferred for greater detail.',
      },
    ],
  },
  {
    id: 'lecture-7',
    number: 7,
    shortTitle: 'Lec 7 · Study Models',
    title: 'Orthodontic Study Models & Analyses',
    subtitle:
      'Anatomic vs. artistic model proportions, Pont’s, Linder-Harth, Korkhaus, Ashley Howe’s, Bolton, Carey’s, mixed dentition analyses, and Kesling diagnostic set-up.',
    sourceLabel: 'Lecture 7 · 5th Year Orthodontics · Alfarabi University College of Dentistry',
    objectives: [
      'Distinguish the anatomic portion from the artistic base and apply ideal trimming requirements.',
      'Calculate and compare arch width requirements using Pont’s, Linder-Harth, and Korkhaus analyses.',
      'Evaluate inter-arch tooth material ratios (Bolton Overall 91.3%, Anterior 77.2%), Carey’s arch length discrepancy, and Ashley Howe’s basal arch percentages.',
      'Predict unerupted canine and premolar widths via Moyer’s and Tanaka-Johnson analyses and understand Kesling’s diagnostic set-up.',
    ],
    sandboxes: [
      { id: 'lec7-3d', label: '3D Study Model & Kesling', kind: '3D Sandbox' },
      { id: 'lec7-2d-pont', label: 'Pont, Harth & Korkhaus', kind: '2D Sandbox' },
      { id: 'lec7-2d-bolton', label: 'Bolton Ratio Lab', kind: '2D Sandbox' },
      { id: 'lec7-2d-carey', label: 'Carey & Ashley Howe', kind: '2D Sandbox' },
      { id: 'lec7-2d-mixed', label: 'Mixed Dentition Lab', kind: '2D Sandbox' },
      { id: 'lec7-quiz', label: 'Knowledge Check', kind: 'Knowledge Check' },
    ],
    summaryPoints: [
      'Study models are the only three-dimensional permanent record allowing lingual visualization of intercuspation, arch form, and space discrepancies.',
      'Pont’s CPV = SI×100/80 & CMV = SI×100/64 (Linder-Harth uses 85 for CPV); Korkhaus sets mandibular Lu − 2 mm = LL.',
      'Bolton normal ratios: Overall = 91.3% (Mand 12 / Max 12 × 100) and Anterior = 77.2% (Mand 6 / Max 6 × 100).',
      'Carey’s discrepancy thresholds: 0–2.5 mm proximal stripping; 2.5–5 mm extract 2nd premolar; >5 mm extract 1st premolar. Tanaka-Johnson uses (Sum of 4 lower incisors / 2) + 11 (max) or + 10.5 (mand).',
    ],
    limitationsNote:
      'Calculators and simulated Kesling set-ups illustrate mathematical formulas from Lecture 7. Remember that population-specific norms (Pont’s French sample, Bolton) and original arch form must always be weighed clinically.',
    quiz: [
      {
        id: 'l7-q1',
        prompt: 'In Pont’s analysis, what is the Calculated Premolar Value (CPV) if the Sum of 4 Maxillary Incisors (SI) is 32 mm?',
        options: [
          { id: 'a', text: '37.6 mm' },
          { id: 'b', text: '40.0 mm' },
          { id: 'c', text: '50.0 mm' },
          { id: 'd', text: '35.5 mm' },
        ],
        correctOptionId: 'b',
        explanation:
          'Pont’s CPV = (SI × 100) / 80 = (32 × 100) / 80 = 40.0 mm. (Linder-Harth uses 85 in the denominator: 3200 / 85 = 37.65 mm).',
      },
      {
        id: 'l7-q2',
        prompt: 'If a patient’s Bolton Anterior Ratio is 82.0% (normal = 77.2%), what does this indicate?',
        options: [
          { id: 'a', text: 'Maxillary anterior tooth material excess' },
          { id: 'b', text: 'Mandibular anterior tooth material excess' },
          { id: 'c', text: 'Ideal inter-arch anterior proportion' },
          { id: 'd', text: 'Bilateral posterior crossbite' },
        ],
        correctOptionId: 'b',
        explanation:
          'Anterior ratio = (Sum of Mandibular 6 × 100) / Sum of Maxillary 6. A value greater than 77.2% indicates excessive mandibular anterior tooth material.',
      },
      {
        id: 'l7-q3',
        prompt: 'During Carey’s analysis, if the lower anterior teeth are proclined, where should the soft brass wire be placed anteriorly?',
        options: [
          { id: 'a', text: 'Along the labial surface of the incisors' },
          { id: 'b', text: 'Along the cingulum of the anterior teeth' },
          { id: 'c', text: '8 mm below the interdental papilla' },
          { id: 'd', text: 'Along the lingual border of the artistic base' },
        ],
        correctOptionId: 'b',
        explanation:
          'The brass wire passes along the cingulum if anteriors are proclined, and along the labial surface if anteriors are retroclined.',
      },
      {
        id: 'l7-q4',
        prompt: 'Using Tanaka and Johnson analysis, if the sum of the four mandibular incisors is 22 mm, what is the predicted width of the maxillary canine and premolars in one quadrant?',
        options: [
          { id: 'a', text: '21.5 mm' },
          { id: 'b', text: '22.0 mm' },
          { id: 'c', text: '23.0 mm' },
          { id: 'd', text: '20.5 mm' },
        ],
        correctOptionId: 'b',
        explanation:
          'Tanaka & Johnson maxillary quadrant prediction = (Sum of 4 lower incisors / 2) + 11 = (22 / 2) + 11 = 22.0 mm (mandibular uses +10.5 = 21.5 mm).',
      },
    ],
  },
];
