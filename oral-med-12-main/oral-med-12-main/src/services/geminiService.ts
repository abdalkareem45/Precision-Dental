import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  aiClient = new GoogleGenAI({ apiKey });
  return aiClient;
}

export const LECTURE_CONTEXT_SYSTEM_PROMPT = `
You are the expert Oral Medicine Faculty Professor for Oral Medicine Lecture 2: "Ulcerative, Vesicular, and Bullous Lesions".
You strictly teach and reference the content from Lecture 2:
1. Cytomegalovirus (CMV) Infection:
   - Etiology: HHV-5, dsDNA enveloped, 50-100% adult exposure worldwide. Latency in connective tissue cells, endothelial cells, monocytes, WBCs. Endothelial latency causes vasculopathy, thrombosis, end-organ necrosis.
   - Transmission: direct transfer of infected WBCs via intimate contact, blood products, donor organs.
   - Systemic: Mononucleosis-like syndrome (fever, marked lymphocytosis, but LITTLE lymphadenopathy/splenomegaly compared to EBV). Most common pneumonia within first 120 days of HSCT. 90% AIDS seroprevalence, CMV retinitis (blindness), enteritis. Guillain-Barré post renal transplant.
   - Oral: In immunocompromised, single large painful ulcer (weeks/months duration); 1/3 coinfected with HSV/VZV. Can cause mandibular osteomyelitis and tooth exfoliation. Classic ulcer on hairy leukoplakia in AIDS.
   - Management: Ganciclovir 5 mg/kg IV BID, Valganciclovir 900 mg PO BID (valine ester, ~10-fold oral bioavailability). Vaccine in 5-10 years.

2. Coxsackievirus:
   - RNA enterovirus (A, B, C, D); CVA and CVB most common. >90% asymptomatic/nonspecific febrile. Replicates lower GI > oropharynx. Fecal-oral route + respiratory.
   - Complications: aseptic meningitis, encephalitis, pleurodynia, myopericarditis. CVB1 in Type 1 diabetes.
   - 3 Oral entities: HFM Disease, Herpangina (CVA 1-10, 16, 22; soft palate, uvula, tonsillar pillars; 2-4 mm ulcers for 5-10 days), Lymphonodular pharyngitis (CVA10; diffuse nodules/lymphoid hyperplasia instead of ulcers).
   - Atypical HFM: CVA6 with onychomadesis (nail plate separation).
   - Rash in 75-100% on hands/feet (dorsa, palms, soles), 30% buttocks. Self-limiting, no antiviral, supportive care.

3. NUG & NUP:
   - AAP 2017 reclassified under Necrotizing Periodontal Disease. Formerly "trench mouth".
   - Polymicrobial fuso-spirochetal: Treponema sp., Prevotella intermedia, Fusobacterium nucleatum.
   - Endotoxins + immunologic activation. Reduced neutrophil chemotaxis and phagocytosis.
   - Noma (cancrum oris / orofacial gangrene): Fusobacterium necrophorum dermonecrotic toxin, hemolysin, leukotoxin, proteases. Cone-shaped (base inside oral cavity, apex at skin), skin perforation, bone sequestration, 70-90% mortality untreated.
   - Hallmarks: rapid acute onset, excessive salivation, metallic taste, punched-out cratered necrotic interdental papillae with pseudomembrane, bleeding, malodor. Pain prevents oral hygiene leading to plaque buildup. AIDS NUP 6%, predictive of CD4 <200.
   - Management: gentle debridement with topical anesthesia, chlorhexidine rinse (>90% resolution), β-lactams or metronidazole (effective against anaerobes despite little solo spirochete activity), scaling/root planing post-acute, periodontal surgery, HIV testing.

4. Erythema Multiforme (EM):
   - Acute self-limited hypersensitivity to infections (HSV in 65-70% recurrent; 1-3 weeks prior) or drugs (NSAIDs, anticonvulsants, benzoic acid food preservative). CD34+ Langerhans precursors carry HSV DNA fragments to skin. Cytotoxic T cells & NK cells destroy keratinocytes.
   - Target / iris lesion pathognomonic: concentric rings (dark dusky center, pale edematous ring, red halo). Begins on hands, centripetal spread to trunk, face, neck.
   - Oral: mild erythema to large ulcers, swollen bleeding lips with thick hemorrhagic crusts, drooling blood-tinged saliva. Lips 36%, buccal 31%, tongue 22%, labial 19%, genital 25%, ocular 17%.
   - Management: mild = analgesics; severe = systemic steroids. HSV recurrent: acyclovir 400 mg BID, valacyclovir 500 mg BID, famciclovir 250 mg BID. Non-HSV: azathioprine 100-150 mg/d.

5. Stevens-Johnson Syndrome (SJS) & Toxic Epidermal Necrolysis (TEN):
   - Rare severe necrolytic mucocutaneous drug hypersensitivity, clinically & etiopathogenetically distinct from EM.
   - Chest-favoring purpuric macules & atypical targets (not extremities).
   - Drugs: sulfonamides, penicillin, anticonvulsants, NSAIDs in children; allopurinol, oxicams, nevirapine in adults. Han Chinese HLA association with carbamazepine/phenytoin. Mycoplasma in children; rarely HSV.
   - BSA Detachment: SJS <10% (mortality 1-5%), SJS-TEN overlap 10-30%, TEN >30% (mortality 25-35%).
   - Histopathology: localized in epidermis where drug metabolite binds, less dermal inflammation.
   - Management: ICU/burn center, stop culprit drugs, IVIG, steroids, cyclosporine, plasmapheresis, TNF-α inhibitors.

6. Plasma Cell Stomatitis (PCS) & Oral Hypersensitivity Reactions:
   - 6 types: acute ulcers (EM), lichenoid, fixed drug, PCS, angioedema, oral allergy syndrome.
   - History: 1960s/70s chewing gum component, khat (Catha edulis), toothpaste flavorings (cinnamon), mints.
   - B-cell mediated with intense plasma cell infiltrate, T cells augmenting. Mucous membrane plasmacytosis.
   - Oral: brightly erythematous macular gingiva, attached gingiva & alveolar mucosa, desquamative gingivitis pattern, angular cheilitis, atrophic lips, single tooth <1 cm.
   - Biopsy: parakeratosis, epithelial hyperplasia, neutrophilic exocytosis, spongiotic pustules (Candida absent), dense sheets of polyclonal plasma cells in lamina propria, dilated superficial capillaries, eosinophils absent.
   - Management: allergen elimination (self-limiting), topical steroids, intralesional triamcinolone, systemic prednisone, gingivectomy for fibrotic tissue, 2% fusidic acid.

Respond in an encouraging, clinically rigorous, clear format. Cite the slide numbers where appropriate.
`;

export async function askOralMedicineTutor(userQuestion: string): Promise<string> {
  const client = getClient();
  if (!client) {
    // High-yield fallback response when API key is not configured in local environment
    return getLocalTutorResponse(userQuestion);
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuestion,
      config: {
        systemInstruction: LECTURE_CONTEXT_SYSTEM_PROMPT,
        temperature: 0.2,
      },
    });
    return response.text || 'Unable to generate response from lecture materials.';
  } catch (error) {
    console.error('Gemini API Error:', error);
    return getLocalTutorResponse(userQuestion);
  }
}

function getLocalTutorResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('cmv') || q.includes('cytomegalo')) {
    return `### Cytomegalovirus (CMV) High-Yield Summary (Slides 2–5):
- **Etiology & Latency**: HHV-5 (dsDNA enveloped). Establishes latency in endothelial cells of blood vessels, mononuclear cells, and WBCs.
- **Oral Presentation**: In immunocompromised patients (AIDS, organ transplants), presents characteristically as a **single large, painful ulcer** lasting weeks to months (often over hairy leukoplakia).
- **Coinfection Alert**: Up to **one-third (33%)** of oral CMV ulcers are coinfected with HSV or VZV!
- **Systemic Findings**: Most common pneumonia in first 120 days post-HSCT. AIDS patients: CMV retinitis (risk of blindness) and enteritis. Associated with Guillain-Barré post-renal transplant.
- **Pharmacology**: IV Ganciclovir 5 mg/kg BID or oral Valganciclovir 900 mg BID (10-fold oral bioavailability).`;
  }
  if (q.includes('coxsackie') || q.includes('herpangina') || q.includes('hand foot')) {
    return `### Coxsackievirus Infections (Slides 6–10):
- **Etiology**: Single-stranded RNA enterovirus (Picornaviridae). Replicates primarily in lower GI tract, shed fecal-oral and respiratory.
- **Three Oral Entities**:
  1. **Hand, Foot and Mouth (HFM)**: Fever, oral vesicles/ulcers + skin rash on hands/feet (palms/soles 75-100%) and buttocks (30%).
  2. **Herpangina** (CVA 1–10, 16, 22): 2–4 mm ulcers strictly localized to **posterior oropharynx, soft palate, and tonsillar pillars** (anterior mouth spared).
  3. **Lymphonodular Pharyngitis** (CVA10): Diffuse small **nodules (lymphoid hyperplasia)** in oropharynx rather than vesicles/ulcers.
- **Atypical HFM**: Caused by CVA6 with **onychomadesis** (nail plate detachment).
- **Management**: Self-limiting (resolves in 5–10 days). No direct antiviral available; supportive hydration and pain relief.`;
  }
  if (q.includes('nug') || q.includes('nup') || q.includes('noma') || q.includes('trench')) {
    return `### NUG / NUP & Noma (Slides 11–16):
- **Classification**: Reclassified in 2017 under "Necrotizing Periodontal Disease".
- **Microbial Complex**: Polymicrobial fuso-spirochetal: *Treponema* species, *Prevotella intermedia*, *Fusobacterium nucleatum*.
- **Pathogenesis**: Bacterial endotoxins + host neutrophil chemotaxis and phagocytosis defect.
- **Oral Triad**:
  1. Punched-out, necrotic, ulcerated interdental papillae with grayish pseudomembrane.
  2. Spontaneous bleeding and excruciating pain.
  3. Fetid oral malodor, metallic taste, and sialorrhea.
- **Noma (Cancrum Oris)**: *Fusobacterium necrophorum* toxins cause cone-shaped facial gangrene (base inside mouth, apex perforating skin). 70–90% mortality untreated.
- **Management**: Gentle debridement with topical anesthesia + 0.12% Chlorhexidine mouthrinse (>90% resolution). Metronidazole or β-lactams for systemic disease. HIV testing.`;
  }
  if (q.includes('erythema multiforme') || q.includes('target') || q.includes('iris') || q.includes('em')) {
    return `### Erythema Multiforme (EM) (Slides 17–22):
- **Etiology**: Hypersensitivity reaction triggered by HSV in **65–70% of recurrent cases** (1–3 weeks before onset). Langerhans cell precursors (CD34+) transport HSV DNA fragments to epithelial sites.
- **Cutaneous Landmark**: Pathognomonic **concentric target / iris lesions** (dusky center, pale edematous ring, red halo). Symmetrically starts on hands and spreads centripetally to trunk/face.
- **Oral Hallmarks**: Swollen, bleeding lips with **thick dark hemorrhagic crusts**; drooling blood-tinged saliva. Lips involved in 36%.
- **Management**: Mild: supportive/analgesics. Severe: systemic steroids. HSV recurrence prevention: Continuous Acyclovir 400 mg BID, Valacyclovir 500 mg BID. Non-HSV responds to Azathioprine (100–150 mg/d).`;
  }
  if (q.includes('sjs') || q.includes('ten') || q.includes('lyell') || q.includes('stevens')) {
    return `### Stevens-Johnson Syndrome (SJS) & TEN (Slides 23–25):
- **Etiology**: Severe drug-induced hypersensitivity (sulfonamides, anticonvulsants, NSAIDs in children, allopurinol, oxicams, nevirapine in adults). Mycoplasma in children; rarely HSV.
- **BSA Classification**:
  - **SJS**: < 10% BSA detachment (1–5% mortality)
  - **SJS-TEN Overlap**: 10% – 30% BSA detachment
  - **TEN**: > 30% BSA detachment (25–35% mortality)
- **Clinical Distinction from EM**: SJS/TEN lesions arise on the **CHEST/trunk** rather than extremities as atypical flat purpuric macules with sheet-like detachment (Nikolsky +).
- **Management**: Urgent ICU/burn center care, immediate drug cessation, IVIG, steroids, cyclosporine. Pharmacogenetic HLA screening (carbamazepine in Han Chinese).`;
  }
  if (q.includes('plasma cell') || q.includes('pcs') || q.includes('chewing gum') || q.includes('gingivitis')) {
    return `### Plasma Cell Stomatitis (PCS) (Slides 26–31):
- **Etiology**: Contact hypersensitivity (chewing gum components, cinnamaldehyde toothpaste, khat, mints).
- **Mechanism**: B-cell mediated with intense polyclonal plasma cell infiltration.
- **Oral Manifestations**: Brightly erythematous, velvety, edematous marginal and attached gingiva (desquamative gingivitis pattern), angular cheilitis, and dry atrophic lips.
- **Biopsy Findings**: Parakeratosis, epithelial hyperplasia, spongiotic pustules (Candida absent), dense sheets of polyclonal plasma cells in lamina propria, dilated superficial capillaries. Eosinophils absent.
- **Management**: Allergen removal (leads to resolution), topical/intralesional steroids, 2% fusidic acid, gingivectomy for chronic fibrotic lesions.`;
  }
  return `### Oral Medicine Lecture 2 Core Summary:
Lecture 2 covers 6 essential ulcerative, vesicular, and bullous conditions:
1. **CMV Infection**: Solitary persistent ulcer in immunocompromised patients; latency in endothelial cells & WBCs; Valganciclovir 900 mg BID.
2. **Coxsackievirus**: Enterovirus causing HFM, Herpangina (soft palate/pillars), Lymphonodular pharyngitis; CVA6 onychomadesis.
3. **NUG / NUP & Noma**: Fuso-spirochetal complex (*Treponema*, *Prevotella*, *Fusobacterium*); punched-out necrotic papillae; Chlorhexidine >90% resolution.
4. **Erythema Multiforme**: HSV-triggered hypersensitivity; pathognomonic target/iris lesions; hemorrhagic crusted lips; Acyclovir prophylaxis.
5. **SJS / TEN**: Drug-induced epidermal necrolysis; chest purpuric macules; BSA-based (<10% vs >30%); ICU burn care.
6. **Plasma Cell Stomatitis**: Contactant hypersensitivity (chewing gum, toothpaste); fiery red attached gingiva; polyclonal plasma cell sheets.

Ask any specific question regarding pathogenesis, diagnostics, or treatment regimens!`;
}
