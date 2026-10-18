import { Flashcard } from '../types';

export const FLASHCARDS_DATA: Flashcard[] = [
  // CMV
  {
    id: 'fc_cmv_1',
    diseaseId: 'cmv',
    category: 'Etiology',
    front: 'Where does Cytomegalovirus (CMV) establish latency after initial exposure?',
    back: 'Connective tissue cells, particularly the endothelium of blood vessels, mononuclear cells, and white blood cells (WBCs).',
    pearl: 'CMV persistence in endothelial cells drives local vasculopathy, thrombosis, and tissue infarction.'
  },
  {
    id: 'fc_cmv_2',
    diseaseId: 'cmv',
    category: 'Oral Findings',
    front: 'How does oral CMV infection characteristically present in immunocompromised patients?',
    back: 'As a single, large, painful ulcer present for weeks or months; less often as multiple ulcers. Any mucosal site may be involved.',
    pearl: 'Frequently presents over a pre-existing background of oral hairy leukoplakia in AIDS patients.'
  },
  {
    id: 'fc_cmv_3',
    diseaseId: 'cmv',
    category: 'Diagnostics',
    front: 'What important viral co-infection occurs in up to one-third of CMV oral ulcers?',
    back: 'Co-infection with other herpes family viruses, especially HSV (Herpes Simplex Virus) and VZV (Varicella-Zoster Virus).',
    pearl: 'Both CMV and VZV induce microvascular thrombosis and have even been associated with mandibular osteomyelitis and tooth exfoliation.'
  },
  {
    id: 'fc_cmv_4',
    diseaseId: 'cmv',
    category: 'Pharmacology',
    front: 'What are the first-line antiviral regimens for CMV infection, and what is the key pharmacokinetic difference?',
    back: 'Intravenous Ganciclovir (5 mg/kg IV twice daily) and oral Valganciclovir (900 mg twice daily). Valganciclovir is a valine ester prodrug with approximately 10-fold higher oral bioavailability.',
    pearl: 'A prophylactic CMV vaccine is under active development with expected availability within 5 to 10 years.'
  },
  {
    id: 'fc_cmv_5',
    diseaseId: 'cmv',
    category: 'Pathogenesis',
    front: 'What are the main systemic manifestations of CMV in hematopoietic stem cell transplant (HSCT) and renal transplant patients?',
    back: 'In HSCT: Most common cause of pneumonia within the first 120 days. In renal transplant: growing evidence of an association with Guillain-Barré syndrome (immune nerve demyelination causing paralysis).',
    pearl: 'In AIDS, ~90% have circulating antibodies, and CMV causes blindness via CMV retinitis and enteritis.'
  },

  // Coxsackievirus
  {
    id: 'fc_cox_1',
    diseaseId: 'coxsackie',
    category: 'Etiology',
    front: 'What family and viral structure does Coxsackievirus belong to, and where does it primarily replicate?',
    back: 'Single-stranded RNA enteroviruses (Enterovirus A, B, C, D). Replicates extensively in the lower gastrointestinal tract, and to a lesser extent in the oropharynx from where it sheds.',
    pearl: 'Transmission is primarily fecal-oral, with secondary respiratory droplet spread.'
  },
  {
    id: 'fc_cox_2',
    diseaseId: 'coxsackie',
    category: 'Oral Findings',
    front: 'Which three clinical disease entities are caused by Coxsackievirus in the oral cavity?',
    back: '1. Hand, Foot and Mouth disease (HFM), 2. Herpangina, and 3. Lymphonodular pharyngitis.',
    pearl: 'Atypical HFM disease caused by CVA6 causes widespread cutaneous eruptions and onychomadesis (nail shedding).'
  },
  {
    id: 'fc_cox_3',
    diseaseId: 'coxsackie',
    category: 'Oral Findings',
    front: 'How is Herpangina anatomically distinguished from Primary Herpetic Gingivostomatitis?',
    back: 'Herpangina lesions (2–4 mm ulcers) are strictly localized to the posterior oropharynx, soft palate, uvula, and tonsillar pillars. Primary herpetic gingivostomatitis involves anterior tissues (attached gingiva, lips, anterior tongue).',
    pearl: 'Herpangina is caused by CVA serotypes 1–10, 16, and 22.'
  },
  {
    id: 'fc_cox_4',
    diseaseId: 'coxsackie',
    category: 'Oral Findings',
    front: 'What is the characteristic oral finding in Lymphonodular Pharyngitis, and which serotype causes it?',
    back: 'Associated with CVA serotype 10. Rather than vesicles and ulcers, patients develop diffuse small yellowish-white nodules in the oropharynx (representing lymphoid hyperplasia).',
    pearl: 'Presents with sore throat without mucosal breakdown or frank ulceration.'
  },
  {
    id: 'fc_cox_5',
    diseaseId: 'coxsackie',
    category: 'Pharmacology',
    front: 'What specific antiviral therapy is indicated for Coxsackievirus infection?',
    back: 'None. Effective antiviral agents are NOT available. Disease is self-limiting (resolves in 5–10 days); management is strictly supportive (fever/pain control, hydration, isolation).',
    pearl: 'Vaccines against enterovirus strains are currently under development.'
  },

  // NUG & NUP
  {
    id: 'fc_nug_1',
    diseaseId: 'nug',
    category: 'Etiology',
    front: 'What is the classic microbial complex responsible for NUG and NUP?',
    back: 'Polymicrobial fuso-spirochetal complex: Treponema species (oral spirochetes), Prevotella intermedia, and Fusobacterium nucleatum.',
    pearl: 'Previously called acute necrotizing ulcerative gingivitis (ANUG) or "trench mouth"; reclassified in 2017 under Necrotizing Periodontal Disease.'
  },
  {
    id: 'fc_nug_2',
    diseaseId: 'nug',
    category: 'Pathogenesis',
    front: 'What host immune dysfunction is characteristic of patients who develop NUG/NUP?',
    back: 'Reduced neutrophil chemotaxis and phagocytosis, resulting in impaired control of opportunistic bacterial invasion.',
    pearl: 'Strong risk factors: severe stress, sleep deprivation, tobacco smoking, poor hygiene, malnutrition, and HIV/AIDS.'
  },
  {
    id: 'fc_nug_3',
    diseaseId: 'nug',
    category: 'Oral Findings',
    front: 'What is the pathognomonic clinical feature of NUG on the gingiva?',
    back: 'Punched-out, necrotic, ulcerated crater-like interdental papillae covered with a grayish pseudomembrane, accompanied by intense pain, bleeding, metallic taste, and fetid malodor.',
    pearl: 'Severe pain prevents tooth brushing, which leads to rapid, copious dental plaque accumulation.'
  },
  {
    id: 'fc_nug_4',
    diseaseId: 'nug',
    category: 'Pathogenesis',
    front: 'How does NUP progress to Noma (cancrum oris / orofacial gangrene), and what is the mortality?',
    back: 'In malnourished or immunocompromised children, Fusobacterium necrophorum produces dermonecrotic toxin, hemolysin, leukotoxin, and proteolytic enzymes. Forms cone-shaped facial gangrene (base inside mouth, apex perforating skin). Mortality is 70–90% without treatment.',
    pearl: 'Causes massive sequestration of exposed necrotic facial bones and teeth.'
  },
  {
    id: 'fc_nug_5',
    diseaseId: 'nug',
    category: 'Pharmacology',
    front: 'What is the definitive initial management for NUG, and which mouthrinse achieves >90% resolution?',
    back: 'Gentle mechanical debridement under topical anesthesia during first visits, followed by 0.12% Chlorhexidine mouthrinse (>90% resolution rate). Systemic metronidazole or β-lactams (penicillins/cephalosporins) for systemic symptoms.',
    pearl: 'Metronidazole is highly effective against gram-negative anaerobes in NUG despite having little direct action against spirochetes alone.'
  },

  // Erythema Multiforme
  {
    id: 'fc_em_1',
    diseaseId: 'em',
    category: 'Pathogenesis',
    front: 'What is the most common inciting trigger for recurrent Erythema Multiforme (EM), and what cellular vehicle transports the antigen?',
    back: 'Herpes Simplex Virus (HSV) in 65–70% of recurrent cases (1–3 weeks before onset). CD34+ Langerhans cell precursors carry HSV DNA fragments to the skin/mucosa.',
    pearl: 'PCR detects HSV gene products in 71–81% of recurrent EM cases (vs. 27% in non-recurrent cases). Cytotoxic T cells & NK cells destroy keratinocytes.'
  },
  {
    id: 'fc_em_2',
    diseaseId: 'em',
    category: 'Diagnostics',
    front: 'What is the pathognomonic cutaneous lesion of Erythema Multiforme, and what is its anatomic distribution pattern?',
    back: 'Classic "target" or "iris" lesions (concentric rings: dark dusky center, pale edematous ring, erythematous outer ring). Begins symmetrically on hands/upper extremities and spreads centripetally toward trunk, neck, and face.',
    pearl: 'The skin may feel itchy and burnt; resolves with post-inflammatory hyperpigmentation, exacerbated by sun exposure.'
  },
  {
    id: 'fc_em_3',
    diseaseId: 'em',
    category: 'Oral Findings',
    front: 'What are the classic oral findings in Erythema Multiforme, and which oral site is most frequently involved?',
    back: 'Severe, extensive oral ulcerations, marked lip swelling with thick hemorrhagic crusting and bleeding, and drooling blood-tinged saliva. The lips are the most common site (36%), followed by buccal mucosa (31%), tongue (22%), labial mucosa (19%).',
    pearl: 'Genital (25%) and ocular (17%) mucosal surfaces may also be involved.'
  },
  {
    id: 'fc_em_4',
    diseaseId: 'em',
    category: 'Pharmacology',
    front: 'What continuous antiviral therapy prevents recurrent outbreaks in HSV-associated EM?',
    back: 'Continuous daily Acyclovir 400 mg twice daily, Valacyclovir 500 mg twice daily, or Famciclovir 250 mg twice daily.',
    pearl: 'Recurrent EM not related to HSV responds well to Azathioprine (100–150 mg/day).'
  },

  // SJS & TEN
  {
    id: 'fc_sjs_1',
    diseaseId: 'sjs-ten',
    category: 'Diagnostics',
    front: 'What criteria differentiate Stevens-Johnson Syndrome (SJS), SJS-TEN Overlap, and Toxic Epidermal Necrolysis (TEN)?',
    back: 'Percentage of Body Surface Area (BSA) with epidermal detachment: SJS: < 10% BSA (1–5% mortality); SJS-TEN Overlap: 10%–30% BSA; TEN: > 30% BSA (25–35% mortality).',
    pearl: 'Histopathologically, necrosis is localized in the epidermis where drug metabolites bind, with minimal inflammation in the dermis.'
  },
  {
    id: 'fc_sjs_2',
    diseaseId: 'sjs-ten',
    category: 'Etiology',
    front: 'What are the key differences in cutaneous presentation and trigger between SJS/TEN and classic EM?',
    back: 'Skin lesions in SJS/TEN arise on the CHEST/trunk rather than extremities as flat purpuric macules and "atypical targets". SJS/TEN is triggered by medications (sulfonamides, anticonvulsants, NSAIDs in children, allopurinol, oxicams, nevirapine) or Mycoplasma pneumoniae, rarely HSV.',
    pearl: 'In Han Chinese populations, strong genetic HLA association links aromatic anticonvulsants (carbamazepine, phenytoin) to SJS/TEN.'
  },
  {
    id: 'fc_sjs_3',
    diseaseId: 'sjs-ten',
    category: 'Pharmacology',
    front: 'What is the cornerstone management of SJS and TEN?',
    back: 'Immediate withdrawal of all suspect medications, admission to a specialized ICU or burn center for barrier and fluid care, and immunomodulators (IVIG, systemic corticosteroids, cyclosporine, plasmapheresis, TNF-α inhibitors).',
    pearl: 'Pharmacogenetic HLA screening before prescribing high-risk drugs substantially prevents SJS/TEN cases.'
  },

  // Plasma Cell Stomatitis
  {
    id: 'fc_pcs_1',
    diseaseId: 'pcs',
    category: 'Etiology',
    front: 'What is the primary etiology of Plasma Cell Stomatitis (PCS), and when was it first described?',
    back: 'Contact hypersensitivity reaction first described in the late 1960s/early 1970s linked to chewing gum additives. Common triggers include khat (Catha edulis), toothpaste ingredients (cinnamon flavorings), mint candies, and household cleaners.',
    pearl: 'One of 6 forms of oral hypersensitivity reactions (alongside acute ulcers/EM, lichenoid reactions, fixed drug eruptions, angioedema, and oral allergy syndrome).'
  },
  {
    id: 'fc_pcs_2',
    diseaseId: 'pcs',
    category: 'Oral Findings',
    front: 'What are the classic oral manifestations of Plasma Cell Stomatitis / Gingivitis?',
    back: 'Brightly erythematous, velvety, edematous marginal and attached gingiva (desquamative gingivitis pattern) extending to alveolar mucosa and sulcus, epithelial sloughing/desquamation, gingival pain on brushing, and bilateral angular cheilitis with dry atrophic lips.',
    pearl: 'Can present localized to a single tooth (< 1 cm diameter).'
  },
  {
    id: 'fc_pcs_3',
    diseaseId: 'pcs',
    category: 'Diagnostics',
    front: 'What are the key biopsy and immunohistochemical findings in Plasma Cell Stomatitis?',
    back: 'Parakeratosis, epithelial hyperplasia, spongiotic pustules (Candida negative), and dense sheets of plasma cells in the lamina propria with dilated superficial capillaries. Immunoperoxidase demonstrates a polyclonal infiltrate (ruling out myeloma/plasmacytoma). Eosinophils are usually absent.',
    pearl: 'A biopsy is the most useful diagnostic test, followed by contact patch testing.'
  },
  {
    id: 'fc_pcs_4',
    diseaseId: 'pcs',
    category: 'Pharmacology',
    front: 'What is the management approach for Plasma Cell Stomatitis?',
    back: 'Definitive: Identify and eliminate the offending contactant (self-limiting regression). Symptomatic: Topical steroids, intralesional triamcinolone injections, systemic prednisone, topical 2% fusidic acid, and gingivectomy for chronic fibrotic lesions.',
    pearl: 'Lesions generally regress once the sensitizing chewing gum, toothpaste, or mint is completely removed.'
  }
];
