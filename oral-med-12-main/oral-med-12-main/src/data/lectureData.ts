import { DiseaseInfo, DiseaseId } from '../types';

export const DISEASES_DATA: Record<DiseaseId, DiseaseInfo> = {
  cmv: {
    id: 'cmv',
    title: 'Cytomegalovirus (CMV) Infection',
    shortTitle: 'CMV Infection',
    category: 'Viral Infections',
    color: '#0284c7', // Sky Blue
    badgeId: 'badge_cmv_master',
    slidesReferenced: [2, 3, 4, 5],
    etiology: 'Human herpesvirus 5 (HHV-5), a double-stranded enveloped DNA virus with worldwide adult seroprevalence of 50–100%. Exposure risk escalates with age, low socio-economic status, and crowding.',
    pathogenesis: 'Establishes lifelong latency in connective tissue cells, endothelial cells of blood vessels, mononuclear cells, and white blood cells (WBCs). Infected endothelial cells induce vasculopathy, vascular thrombosis, and end-organ necrosis. Transmission occurs through direct transfer of infected WBCs via intimate contact, blood products, or donor organ transplantation.',
    oralManifestations: [
      'Presents predominantly in immunocompromised hosts as a single large, painful, persistent ulcer (weeks to months duration).',
      'Less frequently manifests as multiple oral ulcers across any mucosal surface.',
      'Up to one-third (33%) of CMV oral ulcers are coinfected with other herpesviruses, especially HSV and VZV.',
      'Can cause mandibular osteomyelitis and spontaneous tooth exfoliation secondary to severe vasculopathy and microvascular thrombosis.',
      'Classic clinical presentation is an ulcer on a background of oral hairy leukoplakia (EBV-driven) in patients with AIDS.'
    ],
    systemicFindings: [
      'Primary infection: mononucleosis-like syndrome with marked lymphocytosis and fever, but characteristically LITTLE lymphadenopathy or splenomegaly (unlike EBV).',
      'Most common cause of pneumonitis within the first 120 days post-hematopoietic stem cell transplantation (HSCT).',
      'AIDS patients (90% seroprevalence): high risk for CMV retinitis (causing irreversible blindness if untreated) and CMV enteritis/gastroenteritis.',
      'Documented link to Guillain-Barré syndrome (post-infectious polyradiculoneuropathy), especially following renal transplantation.',
      'Serious complications: meningoencephalitis, myocarditis, and severe thrombocytopenia.'
    ],
    keyDiagnostics: [
      'Biopsy with histopathology demonstrating cytomegalic endothelial cells with classic "owl\'s eye" basophilic intranuclear inclusion bodies.',
      'Real-time PCR for CMV DNA quantification in tissue or blood.',
      'Immunohistochemistry (IHC) using monoclonal antibodies against CMV immediate early antigen.',
      'Screening for viral co-infections (HSV-1, HSV-2, VZV) in persistent ulcers.'
    ],
    management: [
      'Systemic Antiviral: Intravenous Ganciclovir 5 mg/kg IV twice daily (BID).',
      'Oral Prodrug: Valganciclovir 900 mg PO twice daily (valine ester with ~10-fold oral bioavailability compared to oral ganciclovir).',
      'Palliative: Topical anesthetics (viscous lidocaine), systemic analgesics, dietary modifications, and aggressive hydration.',
      'Vaccine Pipeline: Preventative CMV vaccine actively in clinical development (estimated availability within 5 to 10 years).'
    ],
    clinicalPearl: 'A persistent, non-healing single oral ulcer in an HIV/AIDS patient that fails standard acyclovir therapy must immediately raise suspicion for CMV, and biopsy/PCR must evaluate for HSV coinfection.'
  },

  coxsackie: {
    id: 'coxsackie',
    title: 'Coxsackievirus Infection',
    shortTitle: 'Coxsackievirus',
    category: 'Viral Infections',
    color: '#0d9488', // Teal
    badgeId: 'badge_coxsackie_expert',
    slidesReferenced: [6, 7, 8, 9, 10],
    etiology: 'Single-stranded RNA enterovirus (Picornaviridae family) classified into enterovirus species A, B, C, and D. Coxsackievirus A (CVA) and B (CVB) are the most prevalent clinical isolates.',
    pathogenesis: 'Replicates extensively in the lower gastrointestinal tract lymphoid tissue and to a lesser extent in the oropharynx from where it sheds. Transmission is primarily fecal-oral, with secondary respiratory droplet shedding. Highly contagious in summer epidemic clusters.',
    oralManifestations: [
      'Causes 3 distinct oral entities: Hand-Foot-and-Mouth Disease (HFM), Herpangina, and Lymphonodular Pharyngitis.',
      'HFM Disease: Begins as erythematous macules that rapidly form small vesicles, then ulcerate (2–4 mm). Found on tongue, hard/soft palate, and buccal mucosa.',
      'Herpangina (CVA 1–10, 16, 22): Sudden sore throat, dysphagia, and eruption of 2–4 mm vesicles that ulcerate strictly localized to posterior oropharynx, soft palate, uvula, and anterior tonsillar pillars (persisting 5–10 days).',
      'Lymphonodular Pharyngitis (CVA-10): Distinct variant presenting with diffuse small yellowish-white nodules (lymphoid hyperplasia) on the posterior oropharynx rather than vesicles/ulcers.',
      'Atypical HFM Disease (CVA6 strain): Widespread severe perioral and cutaneous eruptions with onychomadesis (complete nail plate detachment from the nail bed weeks later).'
    ],
    systemicFindings: [
      'Over 90% of non-polio enterovirus infections are asymptomatic or present as non-specific febrile illness.',
      'Pediatric predilection: children younger than 10 years most afflicted in summer epidemics.',
      'Prodrome: 1–3 days of fever, malaise, myalgia, headache, and emesis.',
      'Cutaneous: Skin rash in 75–100% of HFM patients, prominently on hands and feet (palms, soles, and dorsal aspects) and 30% on buttocks.',
      'Severe systemic complications: aseptic meningitis, acute encephalitis, acute flaccid paralysis, pleurodynia (Bornholm disease), myopericarditis.',
      'Enterovirus B1 specifically implicated in the autoimmune pathogenesis of Type 1 insulin-dependent diabetes mellitus.'
    ],
    keyDiagnostics: [
      'Primarily diagnosed clinically based on classic anatomical distribution (hands, feet, mouth or posterior pillars).',
      'Viral culture (from throat swab or stool) is historically definitive.',
      'Real-time RT-PCR is currently the gold standard for rapid enterovirus identification and serotyping (e.g., CVA6 vs CVA16).',
      'Biopsy is rarely necessary.'
    ],
    management: [
      'Disease is self-limiting with complete spontaneous resolution within 7–10 days.',
      'No effective direct antiviral agents are currently approved.',
      'Supportive management: Antipyretics (acetaminophen, ibuprofen), cold liquids/ice chips, topical barrier gels or anesthetics for painful oral ulcers.',
      'Infection control: strict hand hygiene, droplet precautions, and temporary exclusion from daycare/school to break transmission chains.',
      'Vaccines against enterovirus serotypes remain under development.'
    ],
    clinicalPearl: 'Herpangina lesions are strictly confined to the posterior mouth (soft palate, tonsillar pillars), differentiating it from Primary Herpetic Gingivostomatitis which diffuses anteriorly to the attached gingiva and lips.'
  },

  nug: {
    id: 'nug',
    title: 'Necrotizing Ulcerative Gingivitis & Periodontitis (NUG / NUP)',
    shortTitle: 'NUG & NUP',
    category: 'Periodontal Ulcerations',
    color: '#d97706', // Amber
    badgeId: 'badge_perio_guardian',
    slidesReferenced: [11, 12, 13, 14, 15, 16],
    etiology: 'Acute necrotizing ulcerative inflammatory condition caused by an invasive polymicrobial complex dominated by Treponema species (oral spirochetes), Prevotella intermedia, and Fusobacterium nucleatum. Reclassified by AAP (2017) under "Necrotizing Periodontal Diseases". Historically termed "trench mouth".',
    pathogenesis: 'Bacterial endotoxins combined with host immunologic hyper-activation drive rapid tissue destruction. Affected patients show impaired host defenses: marked reduction in neutrophil chemotaxis and phagocytosis. In severe malnutrition or HIV, infection rapidly invades deep tissues, progressing to noma (cancrum oris) driven by Fusobacterium necrophorum releasing dermonecrotic toxin, hemolysin, leukotoxin, and proteolytic enzymes.',
    oralManifestations: [
      'Rapid, acute onset of excruciatingly painful, bleeding gingiva with a metallic taste, sialorrhea (excessive salivation), and intense gingival sensitivity.',
      'Hallmark: Pathognomonic "punched-out", crater-like necrotic ulcerations of the interdental papillae covered by a grayish pseudomembrane.',
      'Pronounced fetor oris (distinctive foul oral malodor) and spontaneous gingival hemorrhage on minimal contact.',
      'Progression to NUP: Rapid periodontal attachment loss, exposed necrotic alveolar bone, and rapid pocket destruction.',
      'Severe immunosuppression / Noma (Cancrum Oris): Spreads from gingiva to cheeks and facial bones, producing a cone-shaped gangrenous lesion (base in oral cavity, apex perforating external facial skin) with massive bone sequestration and 70–90% mortality if untreated.'
    ],
    systemicFindings: [
      'Submandibular lymphadenopathy, low-grade fever, malaise, and fatigue.',
      'Noma presentation includes fluctuating fever, severe anemia, leukocytosis, and debilitation following systemic illness (like measles in malnourished children in developing regions).',
      'Strongly tied to major predisposing factors: HIV/AIDS (CD4 < 200 cells/mm³ is strongly predictive), severe physical exhaustion/stress, tobacco smoking, malnutrition, local trauma, and diabetes mellitus.'
    ],
    keyDiagnostics: [
      'Gingival sulcus smear demonstrating classic Vincent\'s fuso-spirochetal complex (spirochetes + fusiform rods) on Gram or silver stain.',
      'Bacterial culture and real-time PCR for Treponema, Prevotella intermedia, and Fusobacterium species.',
      'Mandatory HIV serology screening and CD4 count evaluation in any non-responding or rapidly spreading case (NUP has a 6% prevalence in AIDS and heralds CD4 <200).'
    ],
    management: [
      'Acute phase debridement: Gentle mechanical debridement under topical local anesthesia during initial visits to remove necrotic pseudomembrane and plaque.',
      'Antimicrobial lavage: 0.12% Chlorhexidine gluconate mouthrinse achieves >90% clinical resolution rate.',
      'Systemic Antibiotics: Indicated when systemic symptoms or lymphadenopathy are present. First line: β-lactams (penicillin derivatives, cephalosporins) or Metronidazole (which is highly effective against anaerobic components despite weak solo spirochete activity).',
      'Post-acute corrective phase: Ultrasonic and manual scaling and root planing (SRP) once pain subsides; subsequent periodontal surgery to correct cratered gingival architectural defects.',
      'Noma intervention: Immediate intensive nutritional rehabilitation, high-dose IV antibiotics, and surgical resection of necrotic tissue followed by reconstructive surgery.'
    ],
    clinicalPearl: 'The classic triad of NUG is: 1) Punched-out interdental papillae, 2) Spontaneous gingival bleeding, and 3) Fetid metallic malodor. Always check HIV status in young patients with spontaneous NUG.'
  },

  em: {
    id: 'em',
    title: 'Erythema Multiforme (EM)',
    shortTitle: 'Erythema Multiforme',
    category: 'Hypersensitivity Reactions',
    color: '#e11d48', // Rose Red
    badgeId: 'badge_target_master',
    slidesReferenced: [17, 18, 19, 20, 21, 22],
    etiology: 'Acute, self-limiting, immune-mediated mucocutaneous hypersensitivity reaction. Most frequently triggered by Herpes Simplex Virus (HSV-1 / HSV-2) infection (65–70% of recurrent cases). Less common triggers include medications (NSAIDs, anticonvulsants) and food preservatives like benzoic acid.',
    pathogenesis: 'CD34+ Langerhans cell precursors transport HSV DNA fragments from mucosa to distal skin sites. HSV gene expression incites a recruit of cytotoxic CD8+ T lymphocytes, Natural Killer (NK) cells, and pro-inflammatory cytokines (IFN-γ, TNF-α) that mediate apoptotic destruction of basal keratinocytes. PCR detects HSV DNA in 71–81% of recurrent EM cases (and 27% of non-recurrent cases).',
    oralManifestations: [
      'Oral involvement seen in 23–70% of patients with recurrent EM; an oral-only subset exists without cutaneous targets.',
      'Oral lesions begin as mild erythematous macules/erosions progressing to extensive, irregular, extraordinarily painful ulcerations.',
      'Hallmark: Swollen, ulcerated, bleeding lips covered with thick, blackish-brown hemorrhagic crusts.',
      'Patients experience severe dysphagia, inability to eat or drink, and constant drooling of blood-tinged saliva.',
      'Top anatomical sites: Lips (36%), buccal mucosa (31%), tongue (22%), and labial mucosa (19%). Genital (25%) and ocular (17%) mucous membranes may also be affected.'
    ],
    systemicFindings: [
      'Typically strikes young adults aged 20–40 years (20% pediatric cases).',
      'Recurrent EM: Average of 6 episodes per year with a mean total course of 9.5 years; complete spontaneous remission occurs in ~20% of patients.',
      'Prodrome 1–3 weeks after HSV outbreak: mild fever, malaise, headache, cough, rhinorrhea, and sore throat.',
      'Cutaneous target / iris lesions (pathognomonic): Concentric rings with a central dark dusky/necrotic zone, a pale edematous ring, and a peripheral red erythematous halo.',
      'Skin eruption starts symmetrically on dorsum of hands and forearms, spreading centripetally to trunk, neck, and face. Causes itching and burning sensation; resolves with post-inflammatory hyperpigmentation.'
    ],
    keyDiagnostics: [
      'Clinical diagnosis based on pathognomonic target lesions and hemorrhagic crusted lips.',
      'Biopsy of perilesional mucosa: subepithelial or intraepithelial blister, necrotic keratinocytes, basal cell vacuolization, and dense dermal lymphocytic infiltrate.',
      'HSV PCR analysis from ulcer base or peripheral blood.',
      'Rule out SJS/TEN by assessing BSA detachment and primary drug history.'
    ],
    management: [
      'Mild cases: Palliative topical anesthetics, systemic analgesics, soft diet, and fluid rehydration.',
      'Severe cases: Short-course systemic corticosteroids (prednisone 40–60 mg/day with rapid taper) and potent topical corticosteroids.',
      'HSV-associated prophylaxis: Early episodic acyclovir controls ~50% of attacks. For frequent recurrences: continuous prophylactic acyclovir 400 mg BID, valacyclovir 500 mg BID, or famciclovir 250 mg BID effectively halts recurrences.',
      'Non-HSV recurrent cases: Respond exceptionally well to Azathioprine (100–150 mg/day).',
      'Refractory options: Dapsone (100–150 mg/day), antimalarials (hydroxychloroquine), mycophenolate mofetil, colchicine, methotrexate, and IVIG.'
    ],
    clinicalPearl: 'Hemorrhagic crusting of the vermilion border of the lips paired with target lesions on the palms is the textbook signature of Erythema Multiforme, almost always preceded 1–3 weeks earlier by an HSV cold sore.'
  },

  'sjs-ten': {
    id: 'sjs-ten',
    title: 'Stevens-Johnson Syndrome & Toxic Epidermal Necrolysis (SJS / TEN)',
    shortTitle: 'SJS & TEN',
    category: 'Hypersensitivity Reactions',
    color: '#9333ea', // Purple
    badgeId: 'badge_pharmacogenomics_pro',
    slidesReferenced: [23, 24, 25],
    etiology: 'Rare, life-threatening, severe necrolytic mucocutaneous adverse drug reactions. Inciting drugs: antibacterial sulfonamides, penicillins, anticonvulsants (carbamazepine, phenytoin, phenobarbital), NSAIDs (particularly in children), allopurinol, oxicams, and nevirapine (in adults). Strongly linked to Mycoplasma pneumoniae in pediatric cases; rarely associated with HSV.',
    pathogenesis: 'Severe immune-mediated keratinocyte apoptosis primarily localized to the epidermis, where the drug or its reactive metabolite covalently binds or interacts with HLA molecules. Granulysin and Fas-FasL trigger full-thickness epidermal necrolysis with minimal dermal inflammation. Strongly linked to specific genetic HLA alleles (e.g., HLA-B*15:02 in Han Chinese receiving carbamazepine).',
    oralManifestations: [
      'Severe, widespread mucosal sloughing, deep ulcerations, and thick, confluent hemorrhagic crusts over the vermilion border and all intraoral surfaces.',
      'Severe pain causing total refusal of oral intake and inability to swallow saliva.',
      'Triple-mucosa involvement: oral, ocular (cicatrizing conjunctivitis, corneal ulceration, risk of blindness), and urogenital mucous membranes are almost always severely devastated.'
    ],
    systemicFindings: [
      'Disease severity and classification defined by Body Surface Area (BSA) of epidermal detachment:',
      '• SJS: Less than 10% BSA detachment (Mortality rate: 1–5%).',
      '• SJS-TEN Overlap: 10% to 30% BSA detachment.',
      '• TEN (Lyell\'s Disease): Greater than 30% BSA detachment (Mortality rate: 25–35%).',
      'Cutaneous lesions: Arise predominantly on the CHEST and trunk (unlike EM which begins on distal extremities). Characterized by coalescing dusky erythematous and purpuric macules, atypical flat targets, and flaccid bullae with positive Nikolsky sign.',
      'Profound systemic compromise: high fever, massive fluid and electrolyte loss, severe hypoalbuminemia, and extreme susceptibility to sepsis.'
    ],
    keyDiagnostics: [
      'Frozen section biopsy showing full-thickness epidermal necrosis and separation at the dermo-epidermal junction with remarkably little dermal infiltrate.',
      'Assessment of percentage BSA detachment (Lund-Browder or rule of nines).',
      'SCORTEN prognostic scoring system calculated within first 24 hours.',
      'Pharmacogenetic HLA screening (e.g., HLA-B*15:02, HLA-B*58:01) prior to drug administration dramatically reduces incident cases.'
    ],
    management: [
      'IMMEDIATE cessation of all culprit medications (the single most critical predictor of survival).',
      'Transfer to specialized Intensive Care Unit (ICU) or specialized Burn Care Center.',
      'Aggressive supportive therapy: strict aseptic barrier management, fluid/electrolyte resuscitation, temperature control, and nutritional support.',
      'Targeted immunomodulators: High-dose Intravenous Immunoglobulin (IVIG) to block Fas-mediated apoptosis, systemic corticosteroids, Cyclosporine, Plasmapheresis, Cyclophosphamide, and TNF-α inhibitors (infliximab/etanercept).',
      'Daily multidisciplinary ophthalmology and dental care to prevent synechiae and symblepharon formation.'
    ],
    clinicalPearl: 'SJS/TEN skin lesions favor the chest and trunk with atypical flat purpuric macules, whereas classic EM target lesions favor the distal extremities (hands/feet). SJS/TEN is virtually always drug-triggered, not HSV-driven.'
  },

  pcs: {
    id: 'pcs',
    title: 'Plasma Cell Stomatitis (PCS) & Oral Hypersensitivity Reactions',
    shortTitle: 'Plasma Cell Stomatitis',
    category: 'Hypersensitivity Reactions',
    color: '#059669', // Emerald Green
    badgeId: 'badge_allergy_detective',
    slidesReferenced: [26, 27, 28, 29, 30, 31],
    etiology: 'Hypersensitivity contact reaction first recognized in the late 1960s/early 1970s linked to chewing gum flavoring additives. Key contactants include khat (Catha edulis), toothpaste flavorings (cinnamon, cinnamaldehyde), mint candies, foods, and household cleaners. Six distinct oral hypersensitivity forms exist: acute ulcers (EM), lichenoid reactions, fixed drug eruptions, PCS, angioedema, and oral allergy syndrome.',
    pathogenesis: 'B-cell mediated delayed hypersensitivity disorder characterized by an overwhelming polyclonal infiltration of mature plasma cells throughout the lamina propria, augmented by T-helper cells. Termed "mucous membrane plasmacytosis" or "plasma cell orificial mucositis" when extending into the upper aerodigestive tract. An alternative hypothesis implicates cross-reactive components of dental plaque bacteria.',
    oralManifestations: [
      'Manifests within a few days of contactant exposure as brilliantly erythematous, velvety macular patches.',
      'Classic presentation: Desquamative gingivitis with fiery red, intensely edematous marginal and attached gingiva, and alveolar mucosa.',
      'Soft tissue extension: Maxillary and mandibular sulcus, buccal mucosa, palate, and tongue (glossitis with loss of filiform papillae).',
      'Epithelial sloughing, desquamation, superficial erosion, and extreme tenderness/bleeding upon routine tooth brushing.',
      'Angular cheilitis with painful commissural fissuring and dry, scaling, atrophic lips.',
      'Localized PCS variant: Can present restricted to a single tooth as an erythematous gingival collar < 1 cm in diameter.'
    ],
    systemicFindings: [
      'Signs and symptoms predominantly restricted to the oral cavity and periorificial tissues.',
      'Upper aerodigestive involvement: can extend into the oropharynx, larynx, and epiglottis, causing hoarseness, dysphagia, and mild upper airway obstruction.',
      'Endoscopy reveals beefy red, thickened cobblestone-patterned mucosa secondary to submucosal edema.'
    ],
    keyDiagnostics: [
      'Biopsy is the single most definitive diagnostic procedure: demonstrates parakeratosis, marked epithelial hyperplasia, neutrophilic exocytosis, and spongiotic intraepithelial microabscesses (in the proven absence of Candida).',
      'Lamina propria reveals massive, dense sheets of polyclonal plasma cells and prominent dilated capillaries positioned close to the surface (causing the fiery erythema).',
      'Immunoperoxidase light chain staining (kappa and lambda) confirms polyclonal infiltrate, definitively ruling out monoclonal plasma cell neoplasia (multiple myeloma / plasmacytoma).',
      'Eosinophils are characteristically absent or scarce in PCS.',
      'Followed by comprehensive patch testing to isolate the culprit contactant allergen.'
    ],
    management: [
      'Identification and strict avoidance/elimination of the offending contactant allergen (leads to complete self-limiting regression).',
      'Symptomatic pain control and anti-inflammatory therapy during the resolution phase.',
      'Topical corticosteroids (clobetasol propionate, fluocinonide gel) accelerate mucosal healing.',
      'Intralesional triamcinolone acetonide injections for stubborn or recalcitrant localized gingival lesions (though anatomically challenging).',
      'Systemic corticosteroids (oral Prednisone) for widespread or airway-compromising disease.',
      'Surgical gingivectomy to recontour chronic, fibrotic, hyperplastic tissue once the acute immune infiltrate subsides.',
      'Topical 2% Fusidic acid has demonstrated clinical improvement in selected cases.'
    ],
    clinicalPearl: 'Fiery red, intensely swollen attached gingiva (plasma cell gingivitis) with angular cheilitis that fails ordinary plaque control should immediately prompt a detailed investigation of cinnamon chewing gum, herbal toothpastes, or mint candy habits.'
  },

  hsv: {
    id: 'hsv',
    title: 'Herpes Simplex Virus (HSV-1 & HSV-2) Infection',
    shortTitle: 'Herpes Simplex (HSV)',
    category: 'Viral Infections',
    color: '#ef4444', // Red
    badgeId: 'badge_hsv_master',
    slidesReferenced: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    etiology: 'Alphaherpesvirus (HSV-1 and HSV-2), double-stranded enveloped DNA virus with worldwide seroprevalence. Inoculation of mucosa, skin, or eye followed by sensory axonal transport to trigeminal ganglion.',
    pathogenesis: 'Establishes lifelong latency in sensory trigeminal ganglion as well as extraneuronal latency in lip epithelium. Reactivation by fever, UV radiation, trauma, stress, or menses triggers centripetal axonal migration to epithelial cells causing cytopathic destruction, vesicles, ulcers, and salivary shedding.',
    oralManifestations: [
      'Primary Herpetic Gingivostomatitis: widespread 1–5 mm vesicles rupturing into scalloped ulcers across BOTH keratinized AND non-keratinized mucosa with fiery red marginal gingivitis.',
      'Recurrent Herpes Labialis (RHL): vermilion border lesions with 50% prodromal tingling/burning progressing from papules to vesicles, ulcers, and scabs.',
      'Recrudescent Intraoral Herpes (RIH) in immunocompetent: CHIEFLY on KERATINIZED mucosa (hard palate, attached gingiva, tongue dorsum) often 1–2 days post scaling.',
      'HSV in Immunocompromised: large persistent ulcers (>cm) at any site (often non-keratinized mimicking aphthae) with satellite vesicles.'
    ],
    systemicFindings: [
      'Keratitis: primary cause of corneal blindness worldwide.',
      'Herpetic Whitlow: inoculation of fingers (dental occupational hazard).',
      'Herpes Gladiatorum: skin spread in contact wrestlers.',
      'Herpes Encephalitis & Pneumonitis (HSV-1 primary pathogen).',
      'Important etiologic agent triggering Erythema Multiforme (EM).',
      'Implicated in Bell Palsy (HHV-6 60%, HSV 13%, VZV).'
    ],
    keyDiagnostics: [
      'Viral isolation cell culture (gold standard).',
      'Polymerase chain reaction (PCR) from swabs (3 to 4 times more sensitive).',
      'Serology: primary infection shows IgM within days followed by permanent IgG; serology not advised for recurrent infection diagnosis.',
      'Biopsy is generally not required due to characteristic clinical history.'
    ],
    management: [
      'Primary Gingivostomatitis: Acyclovir 15 mg/kg 5 times a day in children; supportive hydration.',
      'Recurrent RHL: Topical 5% acyclovir, 1% penciclovir, or 10% docosanol 5–8x/day at prodrome; Systemic Valacyclovir 2 g q12h x 1 day or Famciclovir 1500 mg single dose.',
      'Intraoral HSV: Valacyclovir 500–1000 mg TID or Acyclovir 400–800 mg for 7–10 days.',
      'Acyclovir-Resistant HSV (TK mutant in immunocompromised): Foscarnet or Cidofovir IV with renal dose adjustments.'
    ],
    clinicalPearl: 'In immunocompetent patients, recurrent intraoral HSV is strictly localized to keratinized mucosa (hard palate, attached gingiva), providing a definitive clinical distinction from recurrent aphthous ulcers which occur on non-keratinized tissue.'
  },

  vzv: {
    id: 'vzv',
    title: 'Varicella-Zoster Virus (VZV / Shingles) Infection',
    shortTitle: 'Varicella-Zoster (VZV)',
    category: 'Viral Infections',
    color: '#f59e0b', // Amber
    badgeId: 'badge_vzv_master',
    slidesReferenced: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
    etiology: 'Human alphaherpesvirus 3 (VZV), transmitted via respiratory droplets with 2–3 week incubation period. Primary infection causes varicella (chickenpox); reactivation produces herpes zoster (shingles).',
    pathogenesis: 'Latent in dorsal root ganglia and cranial nerve ganglia. Reactivation incidence escalates with age (>75yo: 10/1000) and immunosuppression. Causes dermatomal crops of vesicles. Postherpetic neuralgia stems from peripheral nerve injury, demyelination, and Wallerian degeneration.',
    oralManifestations: [
      'Trigeminal V2 involvement: unilateral prodrome of burning palatal pain followed by clustered 1–5 mm ulcers on the hard palate with strict anatomical midline cutoff!',
      'Trigeminal V3 involvement: blisters and ulcers on mandibular gingiva, lower lip, and lateral tongue.',
      'Ramsay Hunt Syndrome (geniculate ganglion): Bell palsy, external ear vesicles, and loss of taste on anterior 2/3 of tongue.',
      'Tooth exfoliation and jawbone osteonecrosis in HIV/AIDS patients.'
    ],
    systemicFindings: [
      'Varicella: intensely pruritic centrifugal "dewdrop-like" vesicles; encephalitis, ataxia, pneumonia complications.',
      'Herpes Zoster: unilateral dermatomal zosteriform crops healing with scarring and hypopigmentation.',
      'Postherpetic Neuralgia (PHN): debilitating neuropathic pain persisting ≥120 days post rash.',
      'Zoster Sine Herpete: dermatomal neuropathy or facial palsy without cutaneous rash.',
      'Herpes Zoster Ophthalmicus (V1): dendritic keratitis and risk of blindness.',
      'Anterior horn cell motor involvement causing motor paralysis.'
    ],
    keyDiagnostics: [
      'Direct fluorescent antibody (DFA) testing from lesion scraping smear.',
      'Viral isolation cell culture.',
      'Real-time PCR for VZV DNA.',
      'Nerve biopsy shows demyelination, Wallerian degeneration, and dorsal horn degeneration.'
    ],
    management: [
      'CRITICAL: Aspirin strictly contraindicated in children with VZV (fatal Reye syndrome: fatty liver & encephalopathy); Ibuprofen preferred!',
      'Primary Chickenpox: Acyclovir 800 mg 5x/day.',
      'Acute Shingles (HZI): Valacyclovir 1000 mg TID or Famciclovir 500 mg TID x 7 days (must start within 72 hours of onset to reduce PHN).',
      'PHN 1st-Line: Gabapentin, 5% Lidocaine patch, topical Capsaicin 0.025–0.8%.',
      'PHN 2nd-Line: Tricyclic antidepressants, corticosteroids, Botulinum toxin.',
      'Vaccination: Shingrix recombinant VZV antigen vaccine is preferred in older adults and immunocompromised hosts.'
    ],
    clinicalPearl: 'Unilateral hard palate ulcerations that terminate abruptly at the midline are pathognomonic for VZV reactivation in the maxillary division (V2) of the trigeminal nerve. Aspirin is strictly contraindicated in children due to fatal Reye syndrome risk.'
  }
};
