export interface LesionMorphology {
  id: string;
  name: string;
  definition: string;
  characteristics: string[];
  clinicalExample: string;
  slidesRef: number[];
  category: 'primary' | 'secondary' | 'vascular';
  iconType: 'macule' | 'papule' | 'plaque' | 'nodule' | 'vesicle' | 'bulla' | 'erosion' | 'pustule' | 'ulcer' | 'purpura';
  blanchesOnPressure?: boolean;
}

export interface UlcerCategory {
  id: string;
  title: string;
  definition: string;
  differentialDiagnoses: string[];
  lectureSlide: number;
}

export const LECTURE_1_MORPHOLOGY: LesionMorphology[] = [
  {
    id: 'macule',
    name: '1. Macule',
    definition: 'Lesions that are flush with the adjacent mucosa and noticeable because of their difference in color from normal skin or mucosa.',
    characteristics: [
      'Flush with mucosal surface (flat, non-palpable).',
      'Red color: due to increased vascularity or inflammation (erythema).',
      'Pigmented color: due to melanin, hemosiderin, foreign materials, or medication breakdown products.'
    ],
    clinicalExample: 'Oral melanotic macule on vermilion border or gingiva.',
    slidesRef: [2],
    category: 'primary',
    iconType: 'macule',
    blanchesOnPressure: true
  },
  {
    id: 'papule',
    name: '2. Papule',
    definition: 'Solid lesions raised above the skin or mucosal surface that are smaller than 1.0 cm in diameter (some criteria specify <0.5 cm for oral mucosal lesions).',
    characteristics: [
      'Elevated, palpable solid lesion.',
      'Size <1.0 cm (<0.5 cm in oral cavity).',
      'Surface may be slightly domed or flat-topped.'
    ],
    clinicalExample: 'Yellow-white papules of pseudomembranous candidiasis.',
    slidesRef: [2],
    category: 'primary',
    iconType: 'papule'
  },
  {
    id: 'plaque',
    name: '3. Plaque',
    definition: 'Raised, plateau-like lesions that are greater than 1 cm in diameter; essentially large, confluence papules.',
    characteristics: [
      'Elevated area of skin or mucosa >1 cm.',
      'Surface often broader than its height.',
      'May arise from coalescence of smaller papules.'
    ],
    clinicalExample: 'Leukoplakic plaque, oral lichen planus plaque.',
    slidesRef: [2],
    category: 'primary',
    iconType: 'plaque'
  },
  {
    id: 'nodule',
    name: '4. Nodule',
    definition: 'Solid lesions present within the dermis or submucosa that protrude above the skin or mucosa forming a characteristic dome-shaped structure.',
    characteristics: [
      'Deep-seated in connective tissue / dermis / submucosa.',
      'Forms rounded or dome-shaped mass.',
      'Can be palpated as a distinct mass.'
    ],
    clinicalExample: 'Irritation fibroma (traumatic reactive hyperplasia).',
    slidesRef: [2],
    category: 'primary',
    iconType: 'nodule'
  },
  {
    id: 'vesicle',
    name: '5. Vesicle',
    definition: 'Small, elevated blisters containing clear serous fluid that are less than 1 cm in diameter.',
    characteristics: [
      'Fluid-filled cavity <1.0 cm diameter.',
      'Contains clear lymph/serous fluid.',
      'Thin epithelial roof; breaks down rapidly in oral cavity.'
    ],
    clinicalExample: 'Primary herpetic vesicles, recurrent herpes labialis.',
    slidesRef: [3],
    category: 'primary',
    iconType: 'vesicle'
  },
  {
    id: 'bulla',
    name: '6. Bulla',
    definition: 'Elevated blisters containing clear serous fluid that are greater than 1 cm in diameter.',
    characteristics: [
      'Fluid-filled cavity >1.0 cm diameter.',
      'Subepithelial or intraepithelial blister.',
      'Tense or flaccid roof.'
    ],
    clinicalExample: 'Bullous pemphigoid, pemphigus vulgaris, burn blister.',
    slidesRef: [3],
    category: 'primary',
    iconType: 'bulla'
  },
  {
    id: 'erosion',
    name: '7. Erosion',
    definition: 'Shallow red lesions caused by the rupture of vesicles or bullae, trauma, or thinning/atrophy of the epithelium in inflammatory diseases.',
    characteristics: [
      'Partial epithelial loss (basal layer intact).',
      'Appears erythematous (red), glistening.',
      'Should NOT be mistaken for ulcers; does not have a thick yellow fibrin clot, though erosions may develop into ulcers.'
    ],
    clinicalExample: 'Erosive lichen planus, post-vesicular herpetic roof detachment.',
    slidesRef: [3],
    category: 'secondary',
    iconType: 'erosion'
  },
  {
    id: 'pustule',
    name: '8. Pustule',
    definition: 'Well-circumscribed blisters containing purulent, cloudy material and appearing yellow.',
    characteristics: [
      'Elevated collection of purulent exudate (neutrophils).',
      'Characteristic yellow or yellow-green color.',
      'May be sterile or infectious.'
    ],
    clinicalExample: 'Cutaneous pustular psoriasis, intraoral micro-abscess.',
    slidesRef: [3],
    category: 'primary',
    iconType: 'pustule'
  },
  {
    id: 'ulcer',
    name: '9. Ulcer',
    definition: 'Well-circumscribed, depressed lesions with a complete defect of the epithelium extending into connective tissue, covered by a fibrin clot resulting in a yellow-white appearance.',
    characteristics: [
      'Full-thickness epithelial breach exposing dermis/lamina propria.',
      'Depressed base covered with necrotic fibrin slough (yellow-white).',
      'Surrounded by a zone of inflammatory erythema (red halo).'
    ],
    clinicalExample: 'Aphthous ulcer, traumatic ulcer, deep viral ulcer.',
    slidesRef: [3],
    category: 'secondary',
    iconType: 'ulcer'
  },
  {
    id: 'purpura',
    name: '10. Purpura',
    definition: 'Reddish to purple discolorations caused by blood leaking from capillaries into the surrounding connective tissue (extravasation). DOES NOT BLANCH on pressure (diascopy negative).',
    characteristics: [
      'Extravasated RBCs in connective tissue.',
      'CRITICAL DIAGNOSTIC SIGN: DOES NOT BLANCH on glass slide pressure (diascopy negative)!',
      'Petechiae: pinpoint lesions <0.3 cm.',
      'Purpura: intermediate size 0.4–0.9 cm.',
      'Ecchymoses: larger bruise-like lesions >1.0 cm.'
    ],
    clinicalExample: 'Oral palatal petechiae, thrombocytopenic purpura, trauma.',
    slidesRef: [3],
    category: 'vascular',
    iconType: 'purpura',
    blanchesOnPressure: false
  }
];

export const LECTURE_1_ULCER_CLASSIFICATION: UlcerCategory[] = [
  {
    id: 'acute-multiple',
    title: '1. The Patient with Acute Multiple Ulcers',
    definition: 'Sudden onset of numerous oral ulcerations, frequently accompanied by viral prodrome, fever, pain, or allergic exposure.',
    differentialDiagnoses: [
      'Herpes Simplex Virus (HSV-1 & HSV-2)',
      'Varicella-Zoster Virus (VZV / Shingles)',
      'Cytomegalovirus (CMV in immunocompromised)',
      'Coxsackievirus (Hand-Foot-Mouth, Herpangina)',
      'Necrotizing Ulcerative Gingivitis & Periodontitis (NUG/NUP)',
      'Erythema Multiforme (EM Major & Minor)',
      'Stevens–Johnson Syndrome & Toxic Epidermal Necrolysis (SJS/TEN)',
      'Plasma Cell Stomatitis & Contact Hypersensitivity'
    ],
    lectureSlide: 4
  },
  {
    id: 'chronic-multiple',
    title: '2. The Patient with Chronic Multiple Ulcers',
    definition: 'Persistent, long-standing, or relapsing widespread ulcerations lasting weeks to months without acute resolution.',
    differentialDiagnoses: [
      'Pemphigus Vulgaris (suprabasilar acantholysis)',
      'Mucous Membrane Pemphigoid (subepithelial bullae)',
      'Erosive Lichen Planus (interface stomatitis)',
      'Systemic Lupus Erythematosus (autoimmune)',
      'Chronic Graft-versus-Host Disease (GVHD)'
    ],
    lectureSlide: 4
  },
  {
    id: 'recurring',
    title: '3. The Patient with Recurring Oral Ulcers',
    definition: 'Episodes of ulceration alternating with symptom-free periods of healing, following distinctive anatomical site predilections.',
    differentialDiagnoses: [
      'Recurrent Aphthous Stomatitis (Minor, Major, Herpetiform — strictly non-keratinized)',
      'Recrudescent Intraoral Herpes (RIH — strictly keratinized in immunocompetent)',
      'Behçet Syndrome (orogenital ulcers + uveitis)',
      'Crohn Disease (cobblestoning, linear vestibular ulcers)'
    ],
    lectureSlide: 4
  },
  {
    id: 'single',
    title: '4. The Patient with Single Ulcers',
    definition: 'Solitary ulcer of variable duration requiring critical differentiation between benign trauma and malignancy.',
    differentialDiagnoses: [
      'Traumatic Ulcerative Granuloma (TUGSE)',
      'Squamous Cell Carcinoma (indurated, rolled everted margins)',
      'Deep Fungal Infection (Histoplasmosis, Blastomycosis)',
      'Tuberculosis (undermined borders)',
      'Single CMV Ulcer in AIDS / Immunocompromised host'
    ],
    lectureSlide: 4
  }
];

export const LECTURE_1_QUIZ_QUESTIONS = [
  {
    id: 'l1-q1',
    question: 'How do purpura and petechiae fundamentally differentiate from inflammatory macular erythema on clinical examination?',
    options: [
      'Purpura are raised solid nodules, whereas macules are depressed.',
      'Purpura do not blanch when pressure is applied via a glass slide (diascopy negative).',
      'Purpura always produce yellow-white fibrin clots.',
      'Purpura only occur on keratinized mucosa.'
    ],
    correctAnswer: 1,
    explanation: 'Slide 3: Purpura and petechiae represent extravasated blood in connective tissue and do not blanch upon pressure. In contrast, vascular erythema blanches because blood is within intact capillaries.',
    slideRef: 3
  },
  {
    id: 'l1-q2',
    question: 'In an immunocompetent patient, recrudescent intraoral herpes (RIH) occurs CHIEFLY on which anatomical tissues?',
    options: [
      'Non-keratinized mucosa of the soft palate and buccal vestibule.',
      'Keratinized mucosa of the hard palate, attached gingiva, and tongue dorsum.',
      'Floor of the mouth and ventral tongue.',
      'Labial mucosa exclusively.'
    ],
    correctAnswer: 1,
    explanation: 'Slide 14: Recrudescent intraoral HSV in immunocompetent hosts occurs chiefly on keratinized mucosa (hard palate, attached gingiva, dorsum of tongue). This is a critical board distinction from recurrent aphthous stomatitis.',
    slideRef: 14
  },
  {
    id: 'l1-q3',
    question: 'A 6-year-old child presents with high fever and acute primary herpetic gingivostomatitis. Which analgesic medication is STRICTLY CONTRAINDICATED in children with viral illnesses?',
    options: [
      'Ibuprofen',
      'Acetaminophen',
      'Aspirin',
      'Viscous lidocaine'
    ],
    correctAnswer: 2,
    explanation: 'Slide 30: Aspirin use in children with VZV (or influenza) is associated with fatal Reye syndrome (acute fatty degeneration of the liver and encephalopathy). Ibuprofen is the preferred analgesic.',
    slideRef: 30
  },
  {
    id: 'l1-q4',
    question: 'What is the diagnostic definition of Postherpetic Neuralgia (PHN) following herpes zoster infection?',
    options: [
      'Pain that begins 48 hours before the appearance of cutaneous vesicles.',
      'Debilitating neuropathy that remains for 120 days or more after the onset of the acute rash.',
      'Facial palsy that develops without dermatomal rash (zoster sine herpete).',
      'Tooth exfoliation occurring within the first 2 weeks.'
    ],
    correctAnswer: 1,
    explanation: 'Slide 23: Postherpetic neuralgia is defined as neuropathic pain that remains for 120 days after the onset of the acute rash.',
    slideRef: 23
  },
  {
    id: 'l1-q5',
    question: 'Reactivation of Varicella-Zoster Virus in the second division of the trigeminal nerve (V2) characteristically manifests in the oral cavity as:',
    options: [
      'Bilateral diffuse sloughing of the entire buccal mucosa.',
      'Unilateral clustered ulcers on the hard palate and buccal gingiva with a sharp midline cutoff.',
      'Deposition of yellowish nodules on the posterior pharyngeal wall.',
      'Ulcers strictly limited to the anterior two-thirds of the tongue.'
    ],
    correctAnswer: 1,
    explanation: 'Slides 26-27: V2 involvement causes a unilateral prodrome followed by painful clustered 1–5 mm ulcers on the hard palatal mucosa in a distinctive unilateral distribution with a sharp midline cutoff.',
    slideRef: 26
  },
  {
    id: 'l1-q6',
    question: 'Why does acyclovir exhibit such high selective toxicity against virally infected cells with minimal harm to host cells?',
    options: [
      'It cannot enter human cells unless swallowed with high-fat meals.',
      'It is selectively monophosphorylated into active antiviral by virally produced thymidine kinase.',
      'It destroys host lipid envelopes directly by detergent action.',
      'It activates host ribosomal RNA translation.'
    ],
    correctAnswer: 1,
    explanation: 'Slide 18: Acyclovir is activated by virally produced thymidine kinase; non-virally infected cells lack this enzyme and cannot activate the drug, yielding exceptional safety.',
    slideRef: 18
  },
  {
    id: 'l1-q7',
    question: 'What constitutes the classic clinical triad of Ramsay Hunt syndrome?',
    options: [
      'Keratitis, tooth exfoliation, and high fever.',
      'Bell palsy (facial paralysis), external ear vesicles, and loss of taste on the anterior two-thirds of the tongue.',
      'Bilateral mandibular osteonecrosis, purpura, and alopecia.',
      'Erythema multiforme target lesions, genital ulcers, and uveitis.'
    ],
    correctAnswer: 1,
    explanation: 'Slide 28: Ramsay Hunt syndrome involves the geniculate ganglion, causing Bell palsy, vesicles of the external auditory canal/ear, and loss of taste on the anterior two-thirds of the tongue.',
    slideRef: 28
  },
  {
    id: 'l1-q8',
    question: 'What percentage of patients undergoing hematopoietic stem cell transplantation (HSCT) experience reactivation of HSV if they are seropositive?',
    options: [
      'Approximately 10%',
      'Approximately 30%',
      'Approximately 70%',
      'Virtually 100%'
    ],
    correctAnswer: 2,
    explanation: 'Slide 15 & 20: Reactivation of HSV occurs in approximately 70% of hematopoietic stem cell transplant recipients, mandating universal prophylactic antiviral suppression.',
    slideRef: 15
  },
  {
    id: 'l1-q9',
    question: 'Which vaccine against herpes zoster utilizes recombinant VZV antigen and is appropriate for immunocompromised hosts?',
    options: [
      'Zostavax (live, attenuated virus)',
      'Shingrix (recombinant VZV antigen)',
      'MMR vaccine',
      'Valganciclovir suspension'
    ],
    correctAnswer: 1,
    explanation: 'Slide 32: Shingrix uses a recombinant VZV glycoprotein antigen (non-live) and is preferred and appropriate for use in immunocompromised individuals, significantly reducing HZI and PHN.',
    slideRef: 32
  },
  {
    id: 'l1-q10',
    question: 'In immunocompromised patients, acyclovir-resistant HSV strains usually emerge due to mutations in which viral gene?',
    options: [
      'Glycoprotein D fusion peptide',
      'Virally derived thymidine kinase gene',
      'Major capsid protein MCP',
      'Reverse transcriptase'
    ],
    correctAnswer: 1,
    explanation: 'Slide 20: Acyclovir resistance is most frequently caused by mutations in the virally derived thymidine kinase enzyme that normally phosphorylates acyclovir. In such cases, foscarnet or cidofovir is effective.',
    slideRef: 20
  }
];
