import { QuizQuestion, ClinicalCase, StageIVPhenotype, IraqiCompetency } from '../types/periodontics';

export const STAGE_IV_PHENOTYPES: StageIVPhenotype[] = [
  {
    caseType: 1,
    title: 'Case Type 1: Hypermobility due to Secondary Occlusal Trauma',
    shortDescription: 'Patient with tooth hypermobility due to secondary occlusal trauma that can be corrected without tooth replacement.',
    primaryFeatures: [
      'Tooth hypermobility (Miller Class 1–3) on reduced periodontium',
      'Fremitus on functional contact or swallowing',
      'No missing teeth requiring prosthetic replacement to stabilize arches',
      'Continuum of severity between severe Stage III and Stage IV Type 1'
    ],
    periodontalTherapySequence: [
      'Step 1: Supragingival biofilm control + PMPR + OHI',
      'Step 1 (Simultaneous): Temporary tooth splinting and initial occlusal adjustment (mostly relief of fremitus in combination with splinting)',
      'Step 2: Subgingival instrumentation with/without adjunctive antimicrobials',
      'Periodontal Re-evaluation (6–12 weeks): Evaluate pocket closure & mobility response',
      'Step 3 (if needed): Access flap or regenerative surgery for residual deep pockets (≥6mm)',
      'Re-assessment for longer-term or permanent splinting only after completion of Steps 2 and 3',
      'Step 4: Supportive Periodontal Care (SPC) at 3-month recall'
    ],
    rehabilitationSequence: [
      'Initial phase: Temporary composite/fiber-reinforced splint to stabilize teeth and improve chewing comfort',
      'Post-Step 3: Long-term semi-rigid or rigid splinting if mobility impairs chewing function or comfort'
    ],
    criticalRules: [
      'Temporary splinting can be performed during STEP 1 to eliminate mobility discomfort',
      'Definitive/long-term splinting must be re-evaluated ONLY AFTER Steps 2 & 3 are complete',
      'Never perform definitive occlusal rehabilitation while active pocket infection is present'
    ],
    carranzaReference: 'Carranza 13th Ed. / J. Clin. Periodontol. 2020 S3 Guidelines (Tonetti & Sanz)'
  },
  {
    caseType: 2,
    title: 'Case Type 2: Pathological Tooth Migration (Drifting, Elongation, Flaring)',
    shortDescription: 'Patient with pathological tooth migration amenable to orthodontic correction and realignment.',
    primaryFeatures: [
      'Severe interproximal attachment loss resulting in anterior tooth flaring, extrusion, and diastema formation',
      'Loss of labial/lingual bone support allowing tooth migration under lip/tongue pressure',
      'Esthetic disfigurement and masticatory compromise',
      'Intact or salvageable dentition requiring tooth movement'
    ],
    periodontalTherapySequence: [
      'Step 1: Biofilm control, PMPR, and strict risk factor cessation (smoking/glycemic)',
      'Step 2: Meticulous subgingival instrumentation to achieve pocket resolution',
      'Periodontal Re-evaluation: Ensure clinical endpoint (shallow maintainable pockets ≤4mm, no bleeding on probing)',
      'Step 3 (Crucial): Regenerative periodontal surgery for deep intrabony defects prior to orthodontic tooth movement',
      'Orthodontic Therapy Execution: Initiated ONLY after complete control of active periodontal inflammation!',
      'Step 4: Supportive Periodontal Care (SPC) ongoing every 2-3 months concurrently with orthodontic mechanics'
    ],
    rehabilitationSequence: [
      'Step 2/3: Orthodontic planning and multidisciplinary consultation',
      'Active Orthodontic Phase: Light continuous forces, intrusion and retraction of flared incisors',
      'Retention Phase: Permanent lingual bonded retainer + SPC'
    ],
    criticalRules: [
      'Orthodontic therapy CAN BE PLANNED during Step 2/3, BUT MUST NEVER BE IMPLEMENTED before achieving shallow maintainable pockets and inflammation control',
      'Moving teeth through active infected periodontal pockets accelerates bone destruction and causes rapid tooth loss',
      'Special regenerative surgical protocols must be evaluated for intrabony defects before tooth translation'
    ],
    carranzaReference: 'Carranza 13th Ed. / J. Clin. Periodontol. 2020 (Sanz, Herrera et al.)'
  },
  {
    caseType: 3,
    title: 'Case Type 3: Partially Edentulous (Restorable without Full-Arch Rehab)',
    shortDescription: 'Partially edentulous patient who can be prosthetically restored with tooth/implant-supported fixed or partial removable prostheses without full-arch reconstruction.',
    primaryFeatures: [
      'Loss of multiple teeth (often posterior support loss)',
      'Adequate stable abutment teeth remaining to avoid full-arch reconstruction',
      'May require localized single/short-span bridges, partial dentures, or implant crowns',
      'Need to protect remaining abutment teeth from excessive occlusal load'
    ],
    periodontalTherapySequence: [
      'Step 1: OHI, plaque elimination, extraction of teeth with hopeless prognosis',
      'Step 2: Subgingival instrumentation of all salvageable teeth',
      'Interim restorations: If needed for function or esthetics, carefully evaluated and placed, but dental implants deferred',
      'Periodontal Re-evaluation: Confirm shallow maintainable pockets and gingival health',
      'Step 3: Corrective flap/regenerative surgery on abutment teeth as indicated',
      'Definitive Restorative Phase / Dental Implants: Executed ONLY after successful completion of Step 2/3 therapy',
      'Step 4: Long-term Supportive Periodontal Care (SPC) with implant surveillance'
    ],
    rehabilitationSequence: [
      'Interim tooth-retained prosthesis placed after Step 2 if essential for function/aesthetics',
      'Implant fixture placement deferred until periodontal stability is confirmed (to prevent early peri-implantitis)',
      'Definitive fixed partial denture / implant crowns placed after complete healing'
    ],
    criticalRules: [
      'Dental implants should NOT be placed before completion of Step 2, and ideally deferred until full periodontal therapy endpoints are achieved',
      'A patient with active untreated periodontitis has a drastically higher risk of peri-implantitis and implant failure',
      'Teeth with hopeless prognosis should be extracted early to prevent adjacent bone loss'
    ],
    carranzaReference: 'Carranza 13th Ed. / J. Clin. Periodontol. 2020'
  },
  {
    caseType: 4,
    title: 'Case Type 4: Partially Edentulous Requiring Full-Arch Rehabilitation',
    shortDescription: 'Severe periodontal destruction with extensive tooth loss, severe bite collapse, and loss of vertical dimension requiring full-arch tooth- or implant-supported reconstruction.',
    primaryFeatures: [
      'Severe loss of vertical dimension of occlusion (VDO)',
      'Less than 20 remaining teeth (<10 opposing pairs)',
      'Severe ridge defects, posterior bite collapse, anterior flaring',
      'Complex decision tree: Salvageable tooth-supported vs. Terminal dentition implant-supported full arch'
    ],
    periodontalTherapySequence: [
      'Step 1: Biofilm control, PMPR, risk mitigation, and extractions of non-salvageable teeth',
      'Tooth-Supported Pathway: Intermediate restoration placed AFTER STEP 1. Step 2 subgingival debridement performed WITH intermediate restoration in place!',
      'Implant-Supported Pathway: Teeth extracted, and implants placed AFTER Step 1 if one arch still has natural teeth (or immediate transition)',
      'Step 2: Subgingival instrumentation of maintained abutments',
      'Step 3: Surgical access or bone augmentation as needed',
      'Definitive Full-Arch Restoration: Inserted only after tissue maturation and stable periodontal endpoints',
      'Step 4: Intensive Supportive Periodontal Care (every 3 months indefinitely)'
    ],
    rehabilitationSequence: [
      'Comprehensive VDO determination and diagnostic wax-up',
      'Immediate / Intermediate provisional prosthesis: re-establishes vertical dimension and protects healing tissues',
      'Definitive screw-retained implant bridge or cross-arch splinted fixed prosthesis'
    ],
    criticalRules: [
      'In tooth-supported cases: Intermediate restoration is placed following Step 1, and Step 2 is performed with intermediate restoration in place',
      'For implant-supported cases requiring extraction of terminal dentition: Implants placed after Step 1 if one arch still has natural teeth',
      'In Stage IV periodontitis, a "no treatment" option must be strongly discouraged due to high risk of total edentulism'
    ],
    carranzaReference: 'Carranza 13th Ed. / J. Clin. Periodontol. 2020 (Sanz et al.)'
  }
];

export const BOARD_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    topic: 'Anatomy & Probing',
    difficulty: 'Board Essential',
    question: 'How is Clinical Attachment Loss (CAL) clinically differentiated from Probing Pocket Depth (PD)?',
    scenario: 'A 5th-stage student is probing the mesial surface of tooth #16. The gingival margin has receded 2 mm apical to the CEJ, and the probe penetrates 4 mm to the base of the sulcus.',
    options: [
      'PD is measured from the CEJ; CAL is measured from the gingival margin.',
      'CAL is measured from the CEJ (hard tissue reference) to pocket base; PD is from gingival margin (soft tissue reference) to pocket base.',
      'PD and CAL are always identical in the absence of furcation involvement.',
      'CAL only accounts for horizontal bone loss, whereas PD measures vertical bone loss.'
    ],
    correctIndex: 1,
    explanation: 'CAL is defined as the distance from the cementoenamel junction (CEJ, hard tissue reference) to the base of the pocket. In contrast, PD is the distance from the gingival margin (soft tissue reference) to the base of the pocket. In this case, with 2 mm recession and 4 mm PD, CAL = 4 + 2 = 6 mm.',
    citation: 'Assist. Prof. Alaa Omran Notes / Diagnostics 2021 / Carranza 13th Ed.'
  },
  {
    id: 'q2',
    topic: 'Diagnosis & Classification',
    difficulty: 'Board Essential',
    question: 'According to the 2017 World Workshop / EFP standards, what is the standardized probing force required when examining Bleeding on Probing (BOP)?',
    scenario: 'During clinical examination in the Iraqi university dental teaching hospital, a student uses a UNC-15 periodontal probe.',
    options: [
      '0.05 – 0.10 N',
      '0.20 – 0.25 N',
      '0.50 – 0.75 N',
      '1.00 – 1.25 N'
    ],
    correctIndex: 1,
    explanation: 'The 2017 World Workshop standardized that bleeding on probing must be stimulated by a standardized probe with a controlled light force of 0.20 to 0.25 N (equivalent to the force needed to blanch a thumbnail without causing pain).',
    citation: 'Diagnostics 2021 / Carranza Clinical Periodontology 13th Ed.'
  },
  {
    id: 'q3',
    topic: 'Diagnosis & Classification',
    difficulty: 'Board Essential',
    question: 'Which threshold defines "Localized Gingivitis" versus "Generalized Gingivitis" based on Bleeding on Probing (BOP)?',
    options: [
      'Localized: <5% BOP; Generalized: ≥5% BOP',
      'Localized: 10% to 30% BOP sites; Generalized: >30% BOP sites',
      'Localized: <20% BOP; Generalized: ≥20% BOP',
      'Localized: Bleeding at anterior teeth only; Generalized: Bleeding on molars'
    ],
    correctIndex: 1,
    explanation: 'Clinical periodontal health is defined as BOP <10%. Gingivitis is defined as BOP ≥10% in the absence of attachment loss. Localized gingivitis = 10% to 30% bleeding sites; Generalized gingivitis = >30% bleeding sites.',
    citation: '2017 World Workshop (Chapple et al., 2018; Papapanou et al., 2018)'
  },
  {
    id: 'q4',
    topic: 'Diagnosis & Classification',
    difficulty: 'Board Essential',
    question: 'What is the diagnostic significance of the presence versus absence of Bleeding on Probing (BOP)?',
    options: [
      'Presence of BOP guarantees rapid bone loss within 3 months.',
      'Presence of BOP is a poor predictor of disease progression, but ABSENCE of BOP is an excellent indicator of periodontal stability.',
      'Absence of BOP has no clinical correlation with periodontal health.',
      'BOP is only meaningful when accompanied by Grade III tooth mobility.'
    ],
    correctIndex: 1,
    explanation: 'As emphasized in the clinical guidelines: While the presence of BOP has a relatively low positive predictive value for future disease progression (~30%), the ABSENCE of BOP is an excellent indicator of periodontal stability (negative predictive value ~98%).',
    citation: 'Diagnostics 2021 / Assist. Prof. Alaa Omran Notes / Lang et al.'
  },
  {
    id: 'q5',
    topic: 'Anatomy & Probing',
    difficulty: 'Board Essential',
    question: 'How does the Miller Mobility Index define Class 2 (Mobility No. 2)?',
    options: [
      'First distinguishable sign of movement greater than normal.',
      'Movement of the crown up to 1 mm in any direction (horizontal).',
      'Movement of the crown more than 1 mm in any direction or vertical depression/rotation.',
      'Spontaneous exfoliation of the tooth during mastication.'
    ],
    correctIndex: 1,
    explanation: 'Miller Index scoring: Mobility No. 1 = first distinguishable sign of movement greater than normal; Mobility No. 2 = crown movement up to 1 mm in any direction; Mobility No. 3 = crown movement exceeding 1 mm in any direction or vertical depression/rotation in its socket.',
    citation: 'Diagnostics 2021 / Carranza 13th Ed.'
  },
  {
    id: 'q6',
    topic: 'Anatomy & Probing',
    difficulty: 'Advanced Clinical',
    question: 'Which Glickman Classification grade represents a "through-and-through" furcation lesion that is clinically visible due to gingival recession?',
    options: [
      'Grade I',
      'Grade II',
      'Grade III',
      'Grade IV'
    ],
    correctIndex: 3,
    explanation: 'Glickman Grade I = pocket into the flute with intact interradicular bone. Grade II = interradicular bone loss entering furcation but not through. Grade III = through-and-through lesion under soft tissue. Grade IV = through-and-through lesion with gingival recession rendering the furcation clinically open and visible.',
    citation: 'Carranza Clinical Periodontology 13th Ed.'
  },
  {
    id: 'q7',
    topic: 'Staging & Grading',
    difficulty: 'Board Essential',
    question: 'A 50-year-old patient has interdental CAL of 5 mm at site of greatest loss, radiographic bone loss extending to the middle third of the root, and has lost 2 teeth due to periodontitis. Probing depths are 6 mm with vertical bone loss. What is the Stage?',
    options: [
      'Stage I',
      'Stage II',
      'Stage III',
      'Stage IV'
    ],
    correctIndex: 2,
    explanation: 'CAL ≥5 mm, RBL to middle third, tooth loss ≤4 teeth, and probing depths ≥6 mm with vertical bone loss places this case definitively in Stage III (Severe Periodontitis with potential for additional tooth loss). Stage IV requires ≥5 teeth lost to periodontitis or complex rehabilitation needs.',
    citation: 'Table 7: Tonetti, Greenwell, Kornman (2018) / J. Clin. Periodontol. 2020'
  },
  {
    id: 'q8',
    topic: 'Staging & Grading',
    difficulty: 'Advanced Clinical',
    question: 'When does a case transition from Stage III to Stage IV periodontitis?',
    options: [
      'Whenever the patient has more than 10 bleeding sites.',
      'When tooth loss due to periodontitis is ≥5 teeth, or there is masticatory dysfunction, bite collapse, secondary occlusal trauma (mobility ≥2), or <20 remaining teeth requiring complex rehabilitation.',
      'Whenever furcation Grade I is observed on maxillary molars.',
      'Whenever the patient is older than 60 years.'
    ],
    correctIndex: 1,
    explanation: 'Stage IV is distinguished by the need for complex multidisciplinary rehabilitation due to: ≥5 teeth lost to periodontitis, masticatory dysfunction, secondary occlusal trauma (mobility ≥2), bite collapse/drifting/flaring, or <20 remaining teeth (<10 opposing pairs).',
    citation: 'Tonetti, Greenwell, & Kornman 2018 / J. Clin. Periodontol. 2020'
  },
  {
    id: 'q9',
    topic: 'Staging & Grading',
    difficulty: 'Board Essential',
    question: 'A 30-year-old patient has 40% radiographic bone loss at the most affected tooth (#36). What is the indirect bone loss / age ratio, and what primary Grade does this indicate?',
    options: [
      'Ratio = 0.75; Grade B',
      'Ratio = 1.33; Grade C (Rapid rate of progression)',
      'Ratio = 0.20; Grade A (Slow rate of progression)',
      'Ratio = 2.50; Grade IV'
    ],
    correctIndex: 1,
    explanation: 'Bone loss / age ratio = 40 / 30 = 1.33. According to Table 8: <0.25 = Grade A; 0.25 to 1.0 = Grade B; >1.0 = Grade C. Since 1.33 > 1.0, this patient is assigned Grade C (Rapid rate of progression).',
    citation: 'Table 8: Tonetti et al. 2018 / Carranza 13th Ed.'
  },
  {
    id: 'q10',
    topic: 'Staging & Grading',
    difficulty: 'Board Essential',
    question: 'Which of the following risk factors automatically modifies a patient\'s grade directly to Grade C?',
    options: [
      'Controlled hypertension and occasional coffee consumption',
      'Smoking ≥10 cigarettes/day OR Diabetes with HbA1c ≥ 7.0%',
      'Smoking 2 cigarettes on weekends only',
      'Plaque index of 35% with normal blood glucose'
    ],
    correctIndex: 1,
    explanation: 'Grade modifiers: Smoking <10 cigs/day modifies to Grade B, while ≥10 cigs/day shifts to Grade C. In diabetes: HbA1c <7.0% corresponds to Grade B, while HbA1c ≥7.0% shifts directly to Grade C.',
    citation: 'Table 8 Grade Modifiers / Tonetti, Greenwell, Kornman (2018)'
  },
  {
    id: 'q11',
    topic: 'Treatment Steps',
    difficulty: 'Board Essential',
    question: 'What are the core interventions encompassed in Step 1 of the EFP S3 Level clinical practice guidelines?',
    options: [
      'Immediate access flap surgery and osseous recontouring',
      'Supragingival dental biofilm control, oral hygiene instructions (OHI), professional mechanical plaque removal (PMPR), and risk factor control (smoking cessation, metabolic control)',
      'Placement of 6 dental implants in the lower jaw',
      'Full-mouth tooth splinting with crown-lengthening surgery'
    ],
    correctIndex: 1,
    explanation: 'Step 1 is aimed at guiding behavior change and motivating the patient: supragingival biofilm control, OHI, adjunctive therapies for gingival inflammation, PMPR, and risk factor control (smoking cessation, glycemic control, lifestyle). Irrespective of stage, all periodontitis patients receive Step 1.',
    citation: 'EFP S3 Level CPG (Sanz, Herrera et al. 2020) / Assist. Prof. Alaa Omran Notes'
  },
  {
    id: 'q12',
    topic: 'Treatment Steps',
    difficulty: 'Advanced Clinical',
    question: 'What are the defining clinical endpoints of Step 2 therapy before a patient can be placed on Supportive Periodontal Care (SPC)?',
    options: [
      '100% bone height regeneration on panoramic radiograph',
      'No periodontal pockets >4 mm with bleeding on probing, and no deep pockets ≥6 mm',
      'Zero plaque on all tooth surfaces without tooth brushing',
      'Complete closure of all interdental diastemas'
    ],
    correctIndex: 1,
    explanation: 'The individual response to Step 2 therapy is assessed at periodontal re-evaluation. The clinical endpoints of therapy are: no periodontal pockets >4 mm with bleeding on probing (BOP) and no deep periodontal pockets (≥6 mm). If achieved, patient enters SPC; if not, Step 3 is indicated.',
    citation: 'J. Clin. Periodontol. 2020 / Sanz et al. 2020'
  },
  {
    id: 'q13',
    topic: 'Treatment Steps',
    difficulty: 'Advanced Clinical',
    question: 'What is the primary objective of Step 3 therapy in the periodontal management sequence?',
    options: [
      'To provide routine 6-month scale and polish in stable patients',
      'To treat non-responding areas (pockets ≥4 mm with BOP or deep pockets ≥6 mm) via repeated subgingival instrumentation, access flaps, resective surgery, or regenerative surgery',
      'To perform full-mouth tooth extractions immediately',
      'To whiten teeth before orthodontic bonding'
    ],
    correctIndex: 1,
    explanation: 'Step 3 therapy targets areas non-responding adequately to Step 2 (pockets ≥4 mm with BOP or ≥6 mm). It includes repeated subgingival debridement, access flap surgery, resective periodontal surgery, or regenerative surgery for intrabony/furcation lesions.',
    citation: 'J. Clin. Periodontol. 2020 S3 Guidelines'
  },
  {
    id: 'q14',
    topic: 'Treatment Steps',
    difficulty: 'Board Essential',
    question: 'What are the five recognized components contributing to Supportive Periodontal Care (SPC) interventions?',
    options: [
      'Anesthesia, Incision, Flap reflection, Suture, Dressing',
      '1. Interview, 2. Assessment, 3. Evaluation, 4. Practical Intervention, 5. Planning (recall interval)',
      'Scaling, Polishing, Fluoride, Radiograph, Extraction',
      'Inspection, Palpation, Percussion, Auscultation, Prescription'
    ],
    correctIndex: 1,
    explanation: 'Five components of SPC (Leow et al. 2021; Trombelli et al. 2015): 1. Interview (symptoms, medical/social history, risk factors), 2. Assessment (plaque, calculus, PPDs, BOP), 3. Evaluation (intervention needs, risk management), 4. Practical Intervention (coaching, debridement, re-treating residual sites), 5. Planning (interval before next SPC visit, typically 3-monthly).',
    citation: 'J. Clin. Periodontol. 2020 / Trombelli et al. 2015'
  },
  {
    id: 'q15',
    topic: 'Stage IV Phenotypes',
    difficulty: 'Viva Voce',
    question: 'In Stage IV Periodontitis Case Type 1 (Tooth Hypermobility due to secondary occlusal trauma), when should temporary splinting be implemented?',
    options: [
      'Only after 12 months of Supportive Periodontal Care',
      'During Step 1 of therapy (in combination with relief of fremitus) to manage hypermobility and comfort',
      'Never, because splints are strictly contraindicated in periodontitis',
      'Only after full-mouth orthodontic retraction'
    ],
    correctIndex: 1,
    explanation: 'In Stage IV Case Type 1: Temporary tooth splinting and initial occlusal adjustment (mostly relief of fremitus in combination with splinting) can be implemented during Step 1 of therapy to manage trauma and restore chewing comfort. The need for longer-term splinting is re-assessed after Steps 2 and 3.',
    citation: 'EFP S3 Level Guidelines / J. Clin. Periodontol. 2020 / Carranza 13th Ed.'
  },
  {
    id: 'q16',
    topic: 'Stage IV Phenotypes',
    difficulty: 'Viva Voce',
    question: 'For Stage IV Periodontitis Case Type 2 (Pathological Tooth Migration / Flaring), when is it clinically permissible to implement orthodontic movement?',
    options: [
      'Before starting Step 1 to improve access for scaling',
      'Simultaneously with Step 1 prior to oral hygiene instructions',
      'Orthodontics can be planned during Step 2/3, but MUST NOT be implemented until achieving shallow maintainable pockets and inflammation control',
      'Orthodontics is completely prohibited on any patient with Stage IV periodontitis'
    ],
    correctIndex: 2,
    explanation: 'As emphasized in the EFP S3 guidelines: Orthodontic therapy can be planned during Step 2 of care, but MUST NOT be implemented before achieving the periodontal treatment objectives of shallow maintainable pockets and control of periodontal inflammation.',
    citation: 'J. Clin. Periodontol. 2020 / Assist. Prof. Alaa Omran Notes'
  },
  {
    id: 'q17',
    topic: 'Stage IV Phenotypes',
    difficulty: 'Advanced Clinical',
    question: 'In Stage IV Case Type 4 (Tooth-Supported Full-Arch Rehabilitation), how is Step 2 subgingival instrumentation sequenced relative to intermediate restorations?',
    options: [
      'Intermediate restorations are never used; final zirconia bridges are cemented on day 1.',
      'An intermediate restoration is placed following Step 1; Step 2 (subgingival instrumentation) is performed WITH the intermediate restoration in place.',
      'All teeth are extracted and replaced with implants during Step 1.',
      'Step 2 must be completed 2 years before placing any provisional restoration.'
    ],
    correctIndex: 1,
    explanation: 'In tooth-supported full-arch cases: An intermediate restoration is frequently placed following successful completion of Step 1. Step 2 (scaling and root surface instrumentation of abutment teeth) is performed with the intermediate restoration in place. Definitive restoration follows successful periodontal therapy.',
    citation: 'J. Clin. Periodontol. 2020 Stage IV Guidelines'
  },
  {
    id: 'q18',
    topic: 'Prognosis',
    difficulty: 'Board Essential',
    question: 'According to Carranza 13th edition, what parameters define a tooth with a "Poor Prognosis"?',
    options: [
      'No bone loss and mild gingival redness',
      'Approximately 50% attachment loss, and/or Grade II furcation invasion where location and depth make maintenance possible but difficult',
      'Tooth is completely exfoliated in a container',
      'Over 90% bone loss with vertical mobility'
    ],
    correctIndex: 1,
    explanation: 'Carranza 13th Ed. prognosis classification: Good = adequate support, easy maintenance; Fair = ~25% attachment loss or Grade I furcation; Poor = ~50% attachment loss, Grade II furcation (maintenance possible but difficult); Questionable = >50% attachment loss, poor crown:root, Grade II/III furcation, Class 2-3 mobility; Hopeless = inadequate attachment to maintain health.',
    citation: 'Carranza Clinical Periodontology 13th Edit.'
  },
  {
    id: 'q19',
    topic: 'Diagnosis & Classification',
    difficulty: 'Advanced Clinical',
    question: 'After completing periodontal therapy, a patient presents with BOP = 6%, probing depths ≤4 mm, and zero 4 mm sites bleeding. How is this patient formally diagnosed?',
    options: [
      'Gingivitis on an intact periodontium',
      'Gingival health on a reduced periodontium in a stable periodontitis patient',
      'Recurrent active periodontitis requiring surgery',
      'Refractory necrotizing periodontitis'
    ],
    correctIndex: 1,
    explanation: 'Criteria for a stable periodontitis patient: Gingival health on a reduced periodontium is defined by BOP <10%, shallow probing depths ≤4 mm, and no 4 mm sites with BOP. However, because they had periodontitis, they remain at lifelong elevated risk of recurrent disease.',
    citation: '2017 World Workshop / J. Clin. Periodontol. 2020'
  },
  {
    id: 'q20',
    topic: 'Diagnosis & Classification',
    difficulty: 'Board Essential',
    question: 'How is the Plaque Index recorded according to the standardized clinical examination described in the lecture?',
    options: [
      'Subjective visual inspection of whole mouth score 1-10',
      'Binary assessment (Score 0 = no plaque, Score 1 = plaque present) on four surfaces per tooth: distal, mid, and mesial points on facial and lingual/palatal aspects',
      'Chewing disclosing tablets without recording surfaces',
      'Recording only on the occlusal surfaces of molars'
    ],
    correctIndex: 1,
    explanation: 'Clinicians binarily assess the presence or absence of plaque (Score 0 = no plaque, Score 1 = plaque present) on four surfaces per tooth: distal, mid, and mesial points on facial (buccal) and lingual (palatal) aspects.',
    citation: 'Diagnostics 2021 / Assist. Prof. Alaa Omran Notes'
  }
];

export const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: 'case-1',
    patientName: 'Ahmed K. Al-Saadi',
    age: 44,
    gender: 'Male',
    medicalHistory: 'Smoker: 18 cigarettes/day for 20 years. No systemic diseases, normal blood glucose.',
    smoking: '18 cigs/day (Heavy smoker ≥10/day)',
    dentalHistory: 'Irregular dental visits, last cleaning 6 years ago. Reports bleeding gums when brushing and loose upper front teeth.',
    clinicalFindings: {
      bopScore: 38,
      plaqueIndex: 68,
      maxCAL: 6,
      maxPD: 7,
      furcation: 'Grade II on #16 buccal and #46 lingual',
      mobility: 'Class 2 on #11 and #21; Class 1 on molars',
      missingTeethDueToPerio: 2,
      remainingTeeth: 28,
      occlusalFeatures: 'Pathological migration with 2.5 mm midline diastema and anterior flaring.',
      radiographicFindings: 'Panoramic X-ray shows interproximal bone loss extending to the middle third of the root (~45% RBL). Infrabony defect on mesial of #16.'
    },
    correctDiagnosis: {
      disease: 'Generalized Periodontitis',
      stage: 'IV',
      grade: 'C',
      extent: 'generalized',
      stageIVType: 2,
      prognosis: 'Questionable for anterior flared teeth (#11, #21) and molars with Grade II furcation; Fair for remaining dentition with strict compliance.'
    },
    treatmentPlanSummary: [
      'Step 1: Intensive OHI, smoking cessation counseling (critical modifier), PMPR, temporary stabilization.',
      'Step 2: Subgingival instrumentation under local anesthesia with ultrasonic & curettes.',
      'Re-evaluation at 8 weeks: Assess reduction of BOP and pocket closure.',
      'Step 3: Regenerative periodontal surgery for mesial infrabony defect on #16.',
      'Ortho Consultation: Plan orthodontic retraction and diastema closure ONLY after shallow maintainable pockets (≤4 mm) are established.',
      'Step 4: Supportive Periodontal Care every 3 months with permanent bonded retention.'
    ],
    learningTakeaways: [
      'Presence of pathological tooth migration (flaring/diastema) elevates this to Stage IV Case Type 2.',
      'Smoking ≥10 cigs/day shifts the grade automatically to Grade C.',
      'Orthodontic tooth movement must never begin until active periodontal inflammation is eliminated.'
    ]
  },
  {
    id: 'case-2',
    patientName: 'Fatima H. Al-Bayati',
    age: 26,
    gender: 'Female',
    medicalHistory: 'Non-smoker, healthy, not on any medication, no history of systemic illness.',
    smoking: 'Non-smoker',
    dentalHistory: 'Chief complaint of bright red, swollen gums that bleed upon gentle brushing. Halitosis for 6 months.',
    clinicalFindings: {
      bopScore: 42,
      plaqueIndex: 55,
      maxCAL: 0,
      maxPD: 3,
      furcation: 'None',
      mobility: 'Class 0 (physiological)',
      missingTeethDueToPerio: 0,
      remainingTeeth: 32,
      occlusalFeatures: 'Normal class I occlusion, no migration or fremitus.',
      radiographicFindings: 'Panoramic X-ray demonstrates intact alveolar bone crest at 1.0 to 1.5 mm apical to CEJ throughout all quadrants.'
    },
    correctDiagnosis: {
      disease: 'Dental Biofilm-Induced Generalized Gingivitis',
      stage: 'I', // Or not staged since gingivitis
      grade: 'A',
      extent: 'generalized',
      prognosis: 'Good across entire dentition.'
    },
    treatmentPlanSummary: [
      'Step 1: Patient education, customized oral hygiene instructions (modified Bass technique, interdental brushing), professional mechanical plaque removal (PMPR).',
      'Follow-up visit at 2-3 weeks to re-evaluate plaque index and gingival inflammation.',
      'Reinforce maintenance regimen; expected complete resolution without tissue loss.'
    ],
    learningTakeaways: [
      'BOP >30% with 0 mm CAL and intact alveolar bone establishes Generalized Gingivitis on an intact periodontium.',
      'Periodontal staging is not applicable to gingivitis cases; bone loss is absent.'
    ]
  },
  {
    id: 'case-3',
    patientName: 'Dr. Tariq M. Al-Rubaye',
    age: 58,
    gender: 'Male',
    medicalHistory: 'Type 2 Diabetes Mellitus diagnosed 12 years ago. Recent HbA1c = 8.6% (poorly controlled).',
    smoking: 'Non-smoker',
    dentalHistory: 'Lost 6 teeth due to severe looseness over the past 5 years. Extreme difficulty chewing food, drifting teeth.',
    clinicalFindings: {
      bopScore: 52,
      plaqueIndex: 72,
      maxCAL: 8,
      maxPD: 9,
      furcation: 'Grade III through-and-through on #47; Grade II on #26',
      mobility: 'Class 3 on #47 and #12; Class 2 on multiple premolars',
      missingTeethDueToPerio: 6,
      remainingTeeth: 18,
      occlusalFeatures: 'Severe posterior bite collapse, loss of vertical dimension of occlusion (VDO), secondary occlusal trauma.',
      radiographicFindings: 'Radiographic bone loss extending into the apical third (>60% RBL). Severe vertical defects.'
    },
    correctDiagnosis: {
      disease: 'Generalized Periodontitis',
      stage: 'IV',
      grade: 'C',
      extent: 'generalized',
      stageIVType: 4,
      prognosis: 'Hopeless for #47 and #12; Poor to Questionable for remaining premolars; Fair for anterior canines.'
    },
    treatmentPlanSummary: [
      'Liaise with physician for diabetes management (target HbA1c < 7.0%).',
      'Step 1: Biofilm control, PMPR, extract hopeless teeth (#47, #12), construct intermediate provisional prosthesis to restore VDO.',
      'Step 2: Subgingival debridement performed with intermediate prosthesis in place.',
      'Re-evaluation at 8-12 weeks: Evaluate systemic response and tissue firmness.',
      'Step 3: Surgical debridement/augmentation where necessary.',
      'Definitive Full-Arch Rehabilitation: Tooth/implant-supported fixed or removable prosthesis after stability is verified.',
      'Step 4: Supportive Periodontal Care every 2-3 months.'
    ],
    learningTakeaways: [
      'Loss of ≥5 teeth due to perio + severe bite collapse + <20 remaining teeth = classic Stage IV Case Type 4.',
      'HbA1c ≥ 7.0% automatically accelerates progression grade to Grade C.',
      'For tooth-supported full arch: Intermediate restoration placed after Step 1, with Step 2 instrumentation performed with intermediate in place!'
    ]
  },
  {
    id: 'case-4',
    patientName: 'Mona S. Al-Husseini',
    age: 39,
    gender: 'Female',
    medicalHistory: 'Non-smoker, healthy, completed active periodontal therapy (Steps 1 & 2) 4 months ago.',
    smoking: 'Non-smoker',
    dentalHistory: 'Attending recall maintenance appointment following non-surgical therapy for Stage II Grade B periodontitis.',
    clinicalFindings: {
      bopScore: 7,
      plaqueIndex: 12,
      maxCAL: 3,
      maxPD: 3,
      furcation: 'None',
      mobility: 'Class 0',
      missingTeethDueToPerio: 0,
      remainingTeeth: 32,
      occlusalFeatures: 'Stable occlusion, no fremitus or mobility.',
      radiographicFindings: 'Stable bone levels at coronal third, lamina dura intact, no active radiolucency.'
    },
    correctDiagnosis: {
      disease: 'Gingival Health on a Reduced Periodontium in a Stable Periodontitis Patient',
      stage: 'II',
      grade: 'B',
      extent: 'generalized',
      prognosis: 'Good with regular supportive periodontal care.'
    },
    treatmentPlanSummary: [
      'Patient meets all criteria for Periodontal Stability: BOP <10%, probing depths ≤4 mm, no 4 mm sites bleeding.',
      'Step 4: Reinforce excellent oral hygiene habits, perform selective PMPR to remove newly formed supragingival stains/calculus.',
      'Maintain 3-month Supportive Periodontal Care recall schedule.'
    ],
    learningTakeaways: [
      'Periodontal health on a reduced periodontium requires BOP <10% and shallow probing depths ≤4 mm with no bleeding at 4 mm sites.',
      'Once a periodontitis patient, always at risk of recurrence: lifelong SPC is mandatory.'
    ]
  }
];

export const IRAQI_5TH_STAGE_COMPETENCIES: IraqiCompetency[] = [
  {
    id: 'comp-1',
    title: 'Comprehensive Periodontal Examination & Charting',
    category: 'Diagnostic Competency',
    requiredCount: 15,
    completedCount: 12,
    description: 'Full-mouth 6-site probing depth, CAL, BOP %, plaque index, furcation, and mobility mapping.',
    verified: true
  },
  {
    id: 'comp-2',
    title: '2018 EFP Staging & Grading Formulation',
    category: 'Diagnostic Competency',
    requiredCount: 15,
    completedCount: 14,
    description: 'Accurate staging (I-IV), grading (A-C), extent descriptor, and prognosis determination based on clinical & panoramic findings.',
    verified: true
  },
  {
    id: 'comp-3',
    title: 'Supra- & Subgingival Ultrasonic & Hand Debridement (PMPR)',
    category: 'Therapeutic Competency',
    requiredCount: 20,
    completedCount: 18,
    description: 'Scaling and root surface debridement using Gracey curettes and ultrasonic scalers per quadrant.',
    verified: false
  },
  {
    id: 'comp-4',
    title: 'Oral Hygiene Instruction & Behavior Modification',
    category: 'Preventive Competency',
    requiredCount: 15,
    completedCount: 15,
    description: 'Personalized plaque score reduction, interdental brush sizing, and smoking cessation counseling.',
    verified: true
  },
  {
    id: 'comp-5',
    title: 'Periodontal Re-evaluation (Endpoints of Therapy Assessment)',
    category: 'Clinical Assessment',
    requiredCount: 10,
    completedCount: 8,
    description: '6-8 week post-instrumentation evaluation of pocket closure (no PD >4mm with BOP, no PD ≥6mm).',
    verified: false
  },
  {
    id: 'comp-6',
    title: 'Periodontal Surgery Assisting & Flap Observation',
    category: 'Surgical Competency',
    requiredCount: 4,
    completedCount: 3,
    description: 'Assisting in modified Widman flap, open flap debridement, or bone graft regenerative surgery.',
    verified: false
  },
  {
    id: 'comp-7',
    title: 'Stage IV Interdisciplinary Case Management Seminar',
    category: 'Academic Competency',
    requiredCount: 2,
    completedCount: 2,
    description: 'Presentation of a complex Stage IV case detailing ortho-perio-prosthodontic sequencing.',
    verified: true
  }
];

export const ALAA_OMRAN_CLINICAL_PEARLS = [
  {
    title: 'The Hard vs. Soft Tissue Reference Rule',
    pearl: 'Always remember: Pocket Depth (PD) uses a SOFT tissue reference (gingival margin), making it vulnerable to swelling or recession. Clinical Attachment Loss (CAL) uses a HARD tissue landmark (CEJ) that does not change over time. In interdental areas, CAL is the definitive metric for periodontitis staging!'
  },
  {
    title: 'BOP: The True Value Lies in its Absence',
    pearl: 'Presence of BOP tells you inflammation is active today, but absence of BOP tells you the site has a ~98% likelihood of remaining stable. Never dismiss bleeding, but celebrate zero bleeding as your treatment goal!'
  },
  {
    title: 'The 0.25 N Thumb Test',
    pearl: 'Probing force must be strictly controlled between 0.20 and 0.25 N. If you press the probe under your thumbnail until you see the vascular bed blanch without feeling pain, that is exactly 0.25 N. Any higher force penetrates the connective tissue attachment, creating an artificial false pocket!'
  },
  {
    title: 'The Golden Rule of Stage IV Case Type 2',
    pearl: 'Never, under any circumstances, allow orthodontic brackets to move teeth with active pocket inflammation (PD ≥ 5 mm with BOP). Moving teeth through infected granulation tissue causes catastrophic angular bone destruction.'
  },
  {
    title: 'The HbA1c and Smoking Shift Triggers',
    pearl: 'On the board exam, if the clinical vignette mentions smoking ≥10 cigarettes per day or HbA1c ≥ 7.0%, the grade CANNOT be Grade A or B. It must immediately jump to Grade C.'
  },
  {
    title: 'Miller Mobility Directional Technique',
    pearl: 'Never use fingers to test tooth mobility; finger pads compress and give a false positive. Use the rigid flat backs of two dental instrument handles (e.g., mouth mirror + probe handle) pressed against buccal and lingual surfaces.'
  }
];
