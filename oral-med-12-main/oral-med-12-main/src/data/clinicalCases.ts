import { ClinicalCase } from '../types';

export const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: 'case_cmv_hiv',
    title: 'Case 1: Persistent Solitary Lingual Ulcer in an Immunocompromised Patient',
    patientProfile: {
      age: 42,
      gender: 'Male',
      immuneStatus: 'AIDS (CD4 <200)',
      chiefComplaint: 'Painful non-healing ulcer on the left side of my tongue that has been getting larger over the last 6 weeks.',
      medicalHistory: 'HIV diagnosed 8 years ago; recent CD4 count 68 cells/mm³, viral load 140,000 copies/mL. Currently non-adherent to ART.',
      vitalSigns: 'BP 118/74, HR 82, Temp 37.6°C, Resp 16/min'
    },
    oralExam: 'Single large (2.2 cm), deep, indurated ulcer with rolled borders on the left lateral border of the tongue. The surrounding mucosa exhibits vertical corrugated white non-wipeable plaques consistent with oral hairy leukoplakia. Moderate submandibular lymphadenopathy noted.',
    cutaneousExam: 'No cutaneo-mucosal lesions on trunk or limbs. Dilated fundus exam reveals retinal hemorrhages and perivascular fluffy white exudates ("pizza-pie" retinopathy).',
    testOptions: [
      {
        id: 'biopsy_ihc',
        name: 'Incisional Biopsy with CMV & HSV Immunohistochemistry',
        category: 'Pathology',
        costTime: '48 hours',
        result: 'Swollen cytomegalic endothelial cells with classic "owl\'s eye" basophilic intranuclear inclusion bodies and cytoplasmic inclusions. IHC strongly positive for CMV immediate early antigen. HSV-1/2 IHC negative.'
      },
      {
        id: 'pcr_panel',
        name: 'Real-Time Quantitative Multiplex PCR (CMV, HSV-1/2, VZV)',
        category: 'PCR',
        costTime: '24 hours',
        result: 'CMV DNA: > 1,500,000 copies/mL. HSV-1/2: Negative. VZV: Negative.'
      },
      {
        id: 'fungal_culture',
        name: 'KOH Prep & Fungal Culture for Candida',
        category: 'Microbiology',
        costTime: '24 hours',
        result: 'Scant pseudohyphae compatible with secondary candidiasis, negative for deep fungal pathogens (Histoplasma, Cryptococcus).'
      },
      {
        id: 'serology_cmv',
        name: 'Serum CMV IgG and IgM Antibodies',
        category: 'Serology',
        costTime: '12 hours',
        result: 'CMV IgG: Positive (>90% in AIDS). CMV IgM: Positive (acute/reactivated disease).'
      }
    ],
    differentialOptions: ['cmv', 'em', 'nug', 'coxsackie'],
    correctDiagnosis: 'cmv',
    explanation: 'In severely immunocompromised individuals (AIDS with CD4 <100 cells/mm³), CMV characteristically manifests as a solitary large, excruciatingly painful, persistent ulcer lasting weeks to months. In this patient, it developed over a background of Epstein-Barr virus-driven oral hairy leukoplakia. Up to one-third of such CMV ulcers harbor co-infection with HSV or VZV. Endothelial tropism and thrombosis cause ischemic tissue necrosis.',
    treatmentChallenge: {
      question: 'What is the most definitive evidence-based pharmacologic regimen for this patient\'s oral and ocular condition?',
      options: [
        {
          text: 'Intravenous Ganciclovir 5 mg/kg IV twice daily or oral Valganciclovir 900 mg twice daily',
          isCorrect: true,
          rationale: 'Correct! Ganciclovir (5 mg/kg IV BID) or its oral prodrug Valganciclovir (900 mg BID, with 10-fold oral bioavailability) is the first-line systemic treatment for active CMV disease in immunocompromised hosts, also safeguarding against irreversible blindness from CMV retinitis.'
        },
        {
          text: 'Acyclovir 400 mg orally 5 times daily for 10 days',
          isCorrect: false,
          rationale: 'Incorrect. CMV lacks the viral thymidine kinase required to phosphorylate acyclovir; standard acyclovir is ineffective against CMV.'
        },
        {
          text: 'Systemic high-dose Prednisone 60 mg/day with topical Triamcinolone',
          isCorrect: false,
          rationale: 'Incorrect. Systemic corticosteroids would further suppress cellular immunity, accelerating CMV retinitis progression and systemic viral dissemination.'
        },
        {
          text: 'Amoxicillin-clavulanate 875/125 mg orally twice daily',
          isCorrect: false,
          rationale: 'Incorrect. CMV is a viral pathogen; antibacterial agents have zero efficacy.'
        }
      ]
    }
  },

  {
    id: 'case_coxsackie_herpangina',
    title: 'Case 2: Sudden High Fever, Dysphagia, and Palatal Ulcers in a 4-Year-Old',
    patientProfile: {
      age: 4,
      gender: 'Female',
      immuneStatus: 'Child',
      chiefComplaint: 'Refusing all food and liquids, high fever, and crying from throat pain for the past 2 days in mid-July.',
      medicalHistory: 'Previously healthy, attends daycare where three other toddlers developed febrile illnesses this week.',
      vitalSigns: 'BP 95/60, HR 125, Temp 39.4°C (102.9°F), Resp 24/min'
    },
    oralExam: 'Discrete 2–4 mm shallow circular ulcerations with vivid erythematous halos localized strictly to the soft palate, uvula, and anterior tonsillar pillars. The tongue, anterior hard palate, buccal mucosa, and attached gingiva are completely normal without erythema or lesions.',
    cutaneousExam: 'Careful inspection of palms, soles, buttocks, and torso shows no macules, vesicles, or rash.',
    testOptions: [
      {
        id: 'throat_pcr',
        name: 'Enterovirus Real-Time RT-PCR from Oropharyngeal Swab',
        category: 'PCR',
        costTime: '12 hours',
        result: 'Positive for Enterovirus Group A RNA, consistent with Coxsackievirus A serotype (CVA 1–10/16).'
      },
      {
        id: 'strep_rapid',
        name: 'Rapid Strep Antigen & Throat Culture',
        category: 'Microbiology',
        costTime: '15 minutes',
        result: 'Negative for Group A Streptococcus.'
      },
      {
        id: 'hsv_swab',
        name: 'HSV-1/2 Direct Fluorescent Antibody (DFA) / PCR',
        category: 'PCR',
        costTime: '24 hours',
        result: 'Negative for HSV-1 and HSV-2 DNA.'
      }
    ],
    differentialOptions: ['coxsackie', 'cmv', 'em', 'pcs'],
    correctDiagnosis: 'coxsackie',
    explanation: 'This presentation is classic for Herpangina caused by Coxsackievirus A (serotypes 1–10, 16, 22). It occurs primarily in children <10 years during summer epidemics. Key diagnostic landmark: 2–4 mm vesicles that rapidly break down into ulcers confined strictly to the posterior oropharynx, soft palate, and tonsillar pillars. Anterior gingiva and lips are completely spared (differentiating it from primary herpetic gingivostomatitis).',
    treatmentChallenge: {
      question: 'Which management strategy is most appropriate for this toddler?',
      options: [
        {
          text: 'Supportive care: antipyretics (acetaminophen/ibuprofen), cold fluids/popsicles, mouth pain relief, and daycare exclusion',
          isCorrect: true,
          rationale: 'Correct! Coxsackievirus infections are self-limiting and resolve within 5–10 days. No direct antivirals are approved. Primary goals are hydration, fever control, and preventing transmission.'
        },
        {
          text: 'Immediate IV Valganciclovir 900 mg twice daily',
          isCorrect: false,
          rationale: 'Incorrect. Valganciclovir is for CMV, not Coxsackievirus, and has bone marrow toxicity.'
        },
        {
          text: 'Amoxicillin suspension 50 mg/kg/day for 10 days',
          isCorrect: false,
          rationale: 'Incorrect. Enteroviruses are RNA viruses; antibiotics are contraindicated and ineffective.'
        },
        {
          text: 'High-dose systemic dexamethasone for 7 days',
          isCorrect: false,
          rationale: 'Incorrect. Steroids are unnecessary for uncomplicated viral herpangina and may prolong viral shedding.'
        }
      ]
    }
  },

  {
    id: 'case_nug_student',
    title: 'Case 3: Acute Excruciating Gum Pain, Sialorrhea, and Fetid Malodor',
    patientProfile: {
      age: 23,
      gender: 'Male',
      immuneStatus: 'Healthy Adult',
      chiefComplaint: 'My gums started bleeding and hurting terribly 2 days ago; I have a bad metallic taste and terrible breath.',
      medicalHistory: 'College senior during final exam week; sleeps 3 hours per night, smokes 1 pack of cigarettes/day, neglected tooth brushing due to extreme pain.',
      vitalSigns: 'BP 122/80, HR 88, Temp 37.8°C, Resp 15/min'
    },
    oralExam: 'Gingiva is intensely fiery red and swollen. Hallmark "punched-out", crater-like necrotic ulcerations of the interdental papillae covered by a grayish sloughing pseudomembrane across the mandibular anterior teeth. Spontaneous profuse bleeding upon light touch. Distinctive foul fetor oris and marked sialorrhea. Submandibular lymph nodes are tender and enlarged.',
    cutaneousExam: 'No skin lesions, rash, or mucosal ulcerations outside the gingiva.',
    testOptions: [
      {
        id: 'gram_smear',
        name: 'Gingival Sulcus Exudate Direct Gram Stain',
        category: 'Microbiology',
        costTime: '30 minutes',
        result: 'Overwhelming proliferation of Vincent\'s fuso-spirochetal complex: abundant Treponema spirochetes, Fusobacterium nucleatum rods, and Prevotella intermedia with dense necrotic debris and degenerate neutrophils.'
      },
      {
        id: 'hiv_screen',
        name: 'Rapid 4th Generation HIV-1/2 Antigen/Antibody Test',
        category: 'Serology',
        costTime: '20 minutes',
        result: 'Non-reactive (Negative). Important screening step since NUG/NUP has strong association with HIV.'
      },
      {
        id: 'cbcl',
        name: 'Complete Blood Count with Differential',
        category: 'Serology',
        costTime: '1 hour',
        result: 'WBC 11,200/μL with mild neutrophil leukocytosis. Platelets and hemoglobin normal.'
      }
    ],
    differentialOptions: ['nug', 'pcs', 'em', 'coxsackie'],
    correctDiagnosis: 'nug',
    explanation: 'The classic triad of Necrotizing Ulcerative Gingivitis (NUG / "trench mouth"): 1) Punched-out necrotic interdental papillae with pseudomembrane, 2) Spontaneous bleeding and intense pain, and 3) Metallic taste and fetid malodor. Caused by polymicrobial infection (Treponema species, Prevotella intermedia, Fusobacterium nucleatum) under severe risk factors (stress, sleep deprivation, tobacco, poor hygiene). If neglected in malnourished states, can advance to NUP or gangrenous noma.',
    treatmentChallenge: {
      question: 'What is the immediate primary clinical intervention for this acute visit?',
      options: [
        {
          text: 'Gentle debridement of pseudomembrane under topical anesthesia + 0.12% Chlorhexidine mouthrinse (+ Metronidazole if systemic)',
          isCorrect: true,
          rationale: 'Correct! Definitive initial therapy consists of gentle debridement of debris under topical local anesthesia, coupled with chlorhexidine mouthrinse (>90% resolution rate). Systemic antibiotics (metronidazole or β-lactams) are added if lymphadenopathy/fever are present.'
        },
        {
          text: 'Vigorous deep ultrasonic scaling and root planing immediately to the bone crest without anesthesia',
          isCorrect: false,
          rationale: 'Incorrect. Aggressive deep instrumentation during the acute agonizing phase is contraindicated; scaling and root planing is performed only after acute inflammation resolves.'
        },
        {
          text: 'Oral Valganciclovir 900 mg twice daily for 21 days',
          isCorrect: false,
          rationale: 'Incorrect. NUG is an anaerobic bacterial fuso-spirochetal infection, not CMV.'
        },
        {
          text: 'Topical Clobetasol ointment applied 4 times daily under occlusion',
          isCorrect: false,
          rationale: 'Incorrect. High-potency topical steroids are contraindicated in acute necrotizing bacterial infections and would risk rapid osteonecrosis.'
        }
      ]
    }
  },

  {
    id: 'case_em_recurrent',
    title: 'Case 4: Swollen Bleeding Crusted Lips and Target Lesions Post-Cold Sore',
    patientProfile: {
      age: 26,
      gender: 'Female',
      immuneStatus: 'Healthy Adult',
      chiefComplaint: 'My lips swelled up, cracked, and started bleeding; I cannot eat or swallow, and I have strange red target rings on my palms.',
      medicalHistory: 'Had an ordinary herpes simplex cold sore on her upper lip 12 days ago. History of 3 similar episodes over the past 2 years.',
      vitalSigns: 'BP 115/75, HR 78, Temp 37.7°C, Resp 16/min'
    },
    oralExam: 'Extensive lip involvement with severe edema, multiple erosions, and thick, confluent dark-brown hemorrhagic crusts. Intraorally, diffuse painful irregular ulcers with red borders on the buccal mucosa and ventral tongue. Saliva is thick and blood-tinged.',
    cutaneousExam: 'Symmetric erythematous macules and papules on the dorsal hands and palms displaying concentric zones: dark violaceous center, pale edematous ring, and outer erythematous margin (classic target / iris lesions). Trunk has minimal involvement (<5% BSA).',
    testOptions: [
      {
        id: 'hsv_pcr',
        name: 'HSV DNA Polymerase Chain Reaction from Lip Swab',
        category: 'PCR',
        costTime: '12 hours',
        result: 'Positive for HSV-1 DNA fragments (identified in 71–81% of recurrent EM cases via Langerhans CD34+ cell transport).'
      },
      {
        id: 'histopath_skin',
        name: 'Punch Biopsy of Early Target Lesion',
        category: 'Pathology',
        costTime: '48 hours',
        result: 'Subepithelial separation with basal cell hydropic degeneration, apoptotic keratinocytes, and dense perivascular lymphocytic infiltrate in superficial dermis.'
      },
      {
        id: 'mycoplasma_igm',
        name: 'Mycoplasma pneumoniae Serology (IgM/IgG)',
        category: 'Serology',
        costTime: '24 hours',
        result: 'Negative IgM, low IgG (past exposure).'
      }
    ],
    differentialOptions: ['em', 'sjs-ten', 'cmv', 'pcs'],
    correctDiagnosis: 'em',
    explanation: 'Classic presentation of Erythema Multiforme (EM) triggered by Herpes Simplex Virus (65–70% of recurrent cases, appearing 1–3 weeks after HSV episode). Hallmarks: pathognomonic target / iris lesions starting on hands with centripetal spread, accompanied by severe hemorrhagic crusted lips and drooling blood-tinged saliva. Langerhans cell precursors (CD34+) transport HSV DNA fragments to epithelial sites where cytotoxic T cells induce apoptosis.',
    treatmentChallenge: {
      question: 'Which pharmacologic intervention is recommended to prevent future recurrent outbreaks in this patient?',
      options: [
        {
          text: 'Continuous daily antiviral prophylaxis with Acyclovir 400 mg twice daily (or Valacyclovir 500 mg BID)',
          isCorrect: true,
          rationale: 'Correct! Continuous daily acyclovir (400 mg BID) or valacyclovir (500 mg BID) prevents recurrent HSV-associated EM in the vast majority of patients. Non-HSV recurrent cases respond to azathioprine (100–150 mg/d).'
        },
        {
          text: 'Lifelong continuous daily oral Prednisone 40 mg',
          isCorrect: false,
          rationale: 'Incorrect. Long-term systemic corticosteroids carry severe toxicities and do not address the viral HSV trigger.'
        },
        {
          text: 'Immediate IV Ganciclovir 5 mg/kg every 12 hours',
          isCorrect: false,
          rationale: 'Incorrect. Ganciclovir is indicated for CMV, not HSV-induced Erythema Multiforme.'
        },
        {
          text: 'Chlorhexidine mouthwash monotherapy',
          isCorrect: false,
          rationale: 'Incorrect. Chlorhexidine is antibacterial for NUG/gingivitis and does nothing to prevent immune-mediated EM recurrences.'
        }
      ]
    }
  },

  {
    id: 'case_sjs_allopurinol',
    title: 'Case 5: Extensive Epidermal Detachment and Mucosal Sloughing After Gout Drug',
    patientProfile: {
      age: 58,
      gender: 'Male',
      immuneStatus: 'Healthy Adult',
      chiefComplaint: 'Severe burning skin peeling off in sheets across my chest, mouth raw and bleeding, eyes stinging and glued shut.',
      medicalHistory: 'Started on Allopurinol 300 mg/day for chronic gout 3 weeks ago. Patient of Han Chinese descent.',
      vitalSigns: 'BP 102/65, HR 112, Temp 39.1°C, Resp 22/min'
    },
    oralExam: 'Extensive denudation and widespread mucosal necrosis of hard and soft palate, buccal mucosa, and tongue. Severe hemorrhagic crusting of the entire vermilion border. Severe dysphagia and refusal to swallow.',
    cutaneousExam: 'Widespread purpuric dusky macules and flaccid bullae covering the anterior chest, neck, and proximal limbs. Lateral shear pressure causes skin slippage (positive Nikolsky sign). Detachment estimated at approximately 22% of total body surface area (BSA). Ocular conjunctivae injected with pseudomembranes and photophobia.',
    testOptions: [
      {
        id: 'frozen_biopsy',
        name: 'Urgent Frozen Section Skin Biopsy',
        category: 'Pathology',
        costTime: '1 hour',
        result: 'Full-thickness epidermal necrosis and subepidermal cleavage with remarkably sparse inflammatory infiltrate in the dermis (classic for drug-induced necrolysis).'
      },
      {
        id: 'hla_screen',
        name: 'HLA-B*58:01 Allele Pharmacogenetic PCR',
        category: 'PCR',
        costTime: '6 hours',
        result: 'Positive for HLA-B*58:01 allele (strongly linked to allopurinol-induced SJS/TEN in Asian populations).'
      },
      {
        id: 'scorten_calc',
        name: 'SCORTEN Score Assessment (24-hour prognostic score)',
        category: 'Serology',
        costTime: '15 minutes',
        result: 'Age >40 (+1), HR >120 (-0), Detachment >10% (+1), Serum Urea >10 mmol/L (+1). Score = 3 (Mortality estimate ~35%).'
      }
    ],
    differentialOptions: ['sjs-ten', 'em', 'pcs', 'cmv'],
    correctDiagnosis: 'sjs-ten',
    explanation: 'This life-threatening condition is SJS-TEN Overlap Syndrome (10–30% BSA detachment) triggered by allopurinol in an HLA-susceptible patient. Distinct from EM: SJS/TEN is virtually always drug-induced (allopurinol, sulfonamides, anticonvulsants, oxicams, nevirapine), features atypical flat purpuric macules arising on the CHEST/trunk rather than extremities, and involves massive multi-mucosal necrolysis (mouth, eyes, genitalia) with high mortality.',
    treatmentChallenge: {
      question: 'What is the immediate life-saving priority for this patient?',
      options: [
        {
          text: 'Immediate discontinuation of Allopurinol + urgent transfer to a specialized Burn/ICU center for barrier care, fluid resuscitation, and IVIG/cyclosporine',
          isCorrect: true,
          rationale: 'Correct! Prompt removal of the culprit drug is the single most important survival determinant. Patients require specialized burn ICU management, barrier protection, fluid/electrolyte stabilization, ocular synechiae prevention, and immunomodulators like IVIG, cyclosporine, or TNF-α inhibitors.'
        },
        {
          text: 'Continue allopurinol at half dose and initiate topical miconazole gel',
          isCorrect: false,
          rationale: 'Incorrect. Continuing the offending drug is fatal in SJS/TEN.'
        },
        {
          text: 'Outpatient treatment with oral acyclovir 800 mg 5 times daily',
          isCorrect: false,
          rationale: 'Incorrect. SJS/TEN is a life-threatening drug hypersensitivity, not HSV, and has a 25–35% mortality rate if mismanaged.'
        },
        {
          text: 'Gingivectomy and oral scaling under local anesthesia',
          isCorrect: false,
          rationale: 'Incorrect. Dental surgical procedures are contraindicated during acute toxic epidermal necrolysis.'
        }
      ]
    }
  },

  {
    id: 'case_pcs_chewing_gum',
    title: 'Case 6: Fiery Red Desquamative Gingivitis and Angular Cheilitis from Cinnamon Gum',
    patientProfile: {
      age: 34,
      gender: 'Female',
      immuneStatus: 'Healthy Adult',
      chiefComplaint: 'My gums have become bright red, swollen, and bleed every time I brush for the last 2 weeks; corners of my mouth are cracked and dry.',
      medicalHistory: 'No systemic diseases. Began chewing a new strong cinnamon-flavored chewing gum and switched to an herbal whitening toothpaste 3 weeks ago.',
      vitalSigns: 'BP 118/76, HR 72, Temp 36.8°C, Resp 14/min'
    },
    oralExam: 'Maxillary and mandibular marginal and attached gingiva is brightly erythematous, velvety, granular, and markedly edematous (desquamative gingivitis pattern) extending to the alveolar mucosa. Bilateral angular cheilitis with painful fissures and atrophic lips. No punched-out interdental papillae, no pseudomembranes, and no fetid odor.',
    cutaneousExam: 'Skin examination reveals no target lesions, macules, or detachment on trunk or extremities.',
    testOptions: [
      {
        id: 'gingival_biopsy',
        name: 'Gingival Punch Biopsy with Routine H&E Histopathology',
        category: 'Pathology',
        costTime: '48 hours',
        result: 'Parakeratosis, epithelial hyperplasia, neutrophilic exocytosis with intraepithelial spongiotic pustules (Candida negative). Lamina propria is expanded by dense sheets of plasma cells and engorged dilated capillaries near the surface. Eosinophils absent.'
      },
      {
        id: 'immunoperoxidase_stain',
        name: 'Immunoperoxidase Light Chain Staining (Kappa & Lambda)',
        category: 'Pathology',
        costTime: '48 hours',
        result: 'Polyclonal light chain expression (normal 2:1 kappa-to-lambda ratio), confirming a benign reactive inflammatory process and definitively ruling out monoclonal plasmacytoma/myeloma.'
      },
      {
        id: 'patch_test',
        name: 'Comprehensive Dental Contact Allergen Patch Testing',
        category: 'Serology',
        costTime: '72 hours',
        result: 'Strong 3+ positive reaction to Cinnamaldehyde (cinnamon flavoring agent).'
      }
    ],
    differentialOptions: ['pcs', 'nug', 'em', 'cmv'],
    correctDiagnosis: 'pcs',
    explanation: 'Plasma Cell Stomatitis (PCS) / Plasma Cell Gingivitis is a contact hypersensitivity reaction first recognized in the 1960s/70s related to chewing gum components, toothpaste additives (cinnamaldehyde), khat, and mints. Key features: intense fiery red, edematous attached gingiva, epithelial desquamation, angular cheilitis, and biopsy demonstrating dense sheets of polyclonal plasma cells with dilated capillaries in the lamina propria (with scarce eosinophils).',
    treatmentChallenge: {
      question: 'What is the most definitive primary treatment for this condition?',
      options: [
        {
          text: 'Immediate identification and permanent cessation of the cinnamon chewing gum and herbal toothpaste contactants',
          isCorrect: true,
          rationale: 'Correct! PCS is a contact hypersensitivity disorder. Complete removal of the offending contactant allergen (cinnamon chewing gum) leads to spontaneous, self-limiting resolution. Topical corticosteroids or intralesional triamcinolone can be added if slow to resolve.'
        },
        {
          text: 'Intravenous Ganciclovir 5 mg/kg twice daily for 21 days',
          isCorrect: false,
          rationale: 'Incorrect. Ganciclovir is for viral CMV infections, not contact stomatitis.'
        },
        {
          text: 'Metronidazole 500 mg TID for anaerobic spirochetal infection',
          isCorrect: false,
          rationale: 'Incorrect. Metronidazole is for NUG/NUP fuso-spirochetal infection; PCS is not an infection.'
        },
        {
          text: 'Immediate multi-quadrant bone recontouring and gingivectomy during the acute inflammatory phase',
          isCorrect: false,
          rationale: 'Incorrect. Gingivectomy is reserved strictly for long-standing, fibrotic, non-resolving lesions after eliminating the allergen.'
        }
      ]
    }
  }
];
