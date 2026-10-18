import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    diseaseId: 'cmv',
    question: 'Where does Cytomegalovirus (CMV) establish lifelong latency following primary infection?',
    options: [
      'Trigeminal sensory ganglia exclusively',
      'Connective tissue cells, blood vessel endothelium, and mononuclear WBCs',
      'Salivary gland ductal acini only',
      'Basal keratinocytes of the oral epithelium'
    ],
    correctAnswer: 1,
    explanation: 'Slide 2: Once exposed, CMV establishes lifelong latency within connective tissue cells, such as the endothelium of blood vessels, mononuclear cells, and white blood cells (WBCs). Endothelial latency contributes to vascular inflammation and occlusion.',
    slideRef: 2
  },
  {
    id: 'q2',
    diseaseId: 'cmv',
    question: 'In an immunocompromised AIDS patient, what is the most typical oral manifestation of CMV infection?',
    options: [
      'Multiple widespread 1 mm vesicular crops on the hard palate',
      'A single large, painful ulcer present for weeks or months',
      'Desquamative gingivitis across all anterior teeth',
      'White reticulated bilateral Wickham striae'
    ],
    correctAnswer: 1,
    explanation: 'Slide 4: CMV infection in the mouth of the immunocompromised patient tends to present as a single large ulcer and less often as multiple ulcers. They are usually painful and may have been present for weeks or months.',
    slideRef: 4
  },
  {
    id: 'q3',
    diseaseId: 'cmv',
    question: 'Approximately what percentage of CMV oral ulcers in immunocompromised patients are coinfected with other herpes family viruses (HSV or VZV)?',
    options: [
      'Less than 5%',
      'Approximately 10%',
      'Up to one-third (33%)',
      'Greater than 90%'
    ],
    correctAnswer: 2,
    explanation: 'Slide 4: Up to one-third of such CMV ulcers are coinfected with other viruses of the herpes family, especially HSV and VZV.',
    slideRef: 4
  },
  {
    id: 'q4',
    diseaseId: 'cmv',
    question: 'Why is Valganciclovir preferred over oral Ganciclovir for outpatient management of CMV infection?',
    options: [
      'It has approximately 10-fold higher oral bioavailability as a valine ester prodrug',
      'It does not require renal dose adjustment',
      'It completely avoids bone marrow suppression',
      'It is active against Coxsackievirus as well'
    ],
    correctAnswer: 0,
    explanation: 'Slide 5: Valganciclovir is a valine ester and oral prodrug of ganciclovir with approximately 10-fold bioavailability compared to ganciclovir, given at 900 mg twice daily.',
    slideRef: 5
  },
  {
    id: 'q5',
    diseaseId: 'coxsackie',
    question: 'Which Coxsackievirus serotype is characteristically linked to atypical Hand-Foot-and-Mouth disease featuring onychomadesis (nail shedding)?',
    options: [
      'Coxsackievirus B1',
      'Coxsackievirus A6 (CVA6)',
      'Coxsackievirus A10',
      'Coxsackievirus A16'
    ],
    correctAnswer: 1,
    explanation: 'Slide 7: Atypical HFM disease exhibits widespread oral and skin involvement and onychomadesis (separation of the nail plate from the nail bed) and is caused by CVA6.',
    slideRef: 7
  },
  {
    id: 'q6',
    diseaseId: 'coxsackie',
    question: 'In Herpangina, where are the 2–4 mm vesicular eruptions and ulcers strictly anatomically localized?',
    options: [
      'Anterior attached gingiva and lips',
      'Dorsal tongue and floor of the mouth',
      'Posterior oropharynx, soft palate, and tonsillar pillars',
      'Lower labial sulcus exclusively'
    ],
    correctAnswer: 2,
    explanation: 'Slide 9: In Herpangina, lesions (2–4 mm ulcers persisting 5–10 days) characteristically erupt on the oropharynx, soft palate, and tonsillar pillars.',
    slideRef: 9
  },
  {
    id: 'q7',
    diseaseId: 'coxsackie',
    question: 'What distinguishes Lymphonodular Pharyngitis (CVA10) clinically from typical Herpangina?',
    options: [
      'Presence of large bullae that peel off in sheets',
      'Diffuse small nodules (lymphoid hyperplasia) in the oropharynx rather than vesicles that break down to ulcers',
      'Severe desquamative gingivitis and bone sequestration',
      'Hemorrhagic crusted lips with target skin lesions'
    ],
    correctAnswer: 1,
    explanation: 'Slide 9: In Lymphonodular pharyngitis (CVA-10), rather than presenting with vesicles that break down to ulcers, patients develop diffuse small nodules in the oropharynx (likely lymphoid hyperplasia).',
    slideRef: 9
  },
  {
    id: 'q8',
    diseaseId: 'nug',
    question: 'Which triad of bacterial microorganisms is most prominently associated with NUG/NUP fuso-spirochetal infection?',
    options: [
      'Streptococcus mutans, Lactobacillus, and Actinomyces',
      'Treponema species, Prevotella intermedia, and Fusobacterium nucleatum',
      'Porphyromonas gingivalis, Aggregatibacter, and Tannerella',
      'Staphylococcus aureus, Pseudomonas, and Candida albicans'
    ],
    correctAnswer: 1,
    explanation: 'Slide 12: The polymicrobial etiology is dominated by Treponema species, Prevotella intermedia, and Fusobacterium nucleatum.',
    slideRef: 12
  },
  {
    id: 'q9',
    diseaseId: 'nug',
    question: 'In malnourished or immunocompromised children, NUG/NUP may progress to cancrum oris (noma). What is the anatomical geometry of these destructive lesions?',
    options: [
      'Linear track along the inferior alveolar nerve canal',
      'Cone-shaped, with the base within the oral cavity and the tip at the facial skin aspect',
      'Superficial circular macules confined strictly to the epidermis',
      'Doughnut-shaped lesions with central sparing'
    ],
    correctAnswer: 1,
    explanation: 'Slide 14: The orofacial noma lesions are cone shaped, with the base of the cone within the oral cavity and the tip at the skin aspect, leading to skin perforation and bone sequestration with 70–90% untreated mortality.',
    slideRef: 14
  },
  {
    id: 'q10',
    diseaseId: 'nug',
    question: 'In the conservative management of NUG, which antimicrobial mouthrinse has been shown to produce resolution in >90% of cases?',
    options: [
      '0.12% Chlorhexidine gluconate mouthrinse',
      'Hydrogen peroxide 3% sole rinse',
      'Povidone-iodine gargle',
      'Sodium hypochlorite 0.5%'
    ],
    correctAnswer: 0,
    explanation: 'Slide 16: The use of chlorhexidine mouthrinse led to resolution in >90% of cases, combined with gentle mechanical debridement under topical anesthesia.',
    slideRef: 16
  },
  {
    id: 'q11',
    diseaseId: 'em',
    question: 'What is the most common inciting factor for recurrent Erythema Multiforme (EM), and how long before EM onset does it typically appear?',
    options: [
      'Penicillin allergy, 2 days before onset',
      'Herpes Simplex Virus (HSV) infection, 1–3 weeks before onset',
      'Cytomegalovirus infection, 6 months before onset',
      'Toothpaste contactant, within 24 hours'
    ],
    correctAnswer: 1,
    explanation: 'Slide 18: Recurrent EM is associated with HSV infection in 65–70% of cases, both by history of HSV infection 1–3 weeks before onset of EM, and HSV PCR positive in 71–81% of recurrent cases.',
    slideRef: 18
  },
  {
    id: 'q12',
    diseaseId: 'em',
    question: 'What is the most frequently affected oral site in patients presenting with Erythema Multiforme?',
    options: [
      'Hard palate (55%)',
      'Floor of mouth (45%)',
      'Lips (36%), often with severe inflammation, ulceration, and hemorrhagic crusting',
      'Retromolar trigone (30%)'
    ],
    correctAnswer: 2,
    explanation: 'Slide 20: The most commonly affected sites are the lips (36%), buccal mucosa (31%), tongue (22%), and labial mucosa (19%). Crusting and bleeding of the lips are hallmark features.',
    slideRef: 20
  },
  {
    id: 'q13',
    diseaseId: 'sjs-ten',
    question: 'How is Stevens-Johnson Syndrome (SJS) formally categorized from SJS-TEN overlap and Toxic Epidermal Necrolysis (TEN)?',
    options: [
      'SJS is <10% BSA detachment, SJS-TEN overlap is 10–30% BSA, TEN is >30% BSA',
      'SJS is solely oral, SJS-TEN is oral + ocular, TEN involves internal organs',
      'SJS is HSV-driven, whereas TEN is always caused by Treponema',
      'SJS is in children only, TEN is in elderly only'
    ],
    correctAnswer: 0,
    explanation: 'Slide 24: Diagnosis: SJS if <10% of body surface involvement, SJS-TEN overlap syndrome if 10–30% of body surface is involved, and TEN if >30% is involved. SJS mortality is 1–5%, TEN is 25–35%.',
    slideRef: 24
  },
  {
    id: 'q14',
    diseaseId: 'sjs-ten',
    question: 'In Han Chinese populations, which class of drugs has a strong genetic HLA association for triggering SJS/TEN?',
    options: [
      'Aromatic anticonvulsants (carbamazepine, phenytoin)',
      'Topical chlorhexidine mouthrinses',
      'Ganciclovir and valganciclovir',
      'Amoxicillin suspension'
    ],
    correctAnswer: 0,
    explanation: 'Slide 23 & 24: In Han Chinese, development of SJS/TEN is strongly associated with aromatic anticonvulsants (carbamazepine, phenytoin). Pharmacogenetic HLA screening substantially prevents these reactions.',
    slideRef: 23
  },
  {
    id: 'q15',
    diseaseId: 'pcs',
    question: 'What is the characteristic microscopic hallmark seen on biopsy of the gingiva in Plasma Cell Stomatitis?',
    options: [
      'Acantholysis with Tzanck cells and eosinophilic inclusions',
      'Dense sheets of plasma cells in the lamina propria and dilated superficial capillaries, with polyclonal immunoperoxidase staining',
      'Epithelial dysplasia with monoclonal IgG kappa light chain restriction',
      'Abundant spirochetes penetrating into the alveolar bone trabeculae'
    ],
    correctAnswer: 1,
    explanation: 'Slide 30: The most significant finding is dense sheets of plasma cells in the lamina propria; many dilated capillaries lie close to the surface (accounting for the marked erythema). Immunoperoxidase stains invariably show the plasma cell infiltrate to be polyclonal.',
    slideRef: 30
  }
];
