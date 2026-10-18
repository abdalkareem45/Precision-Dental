export interface TooltipMnemonicData {
  title: string;
  badge?: string;
  badgeColor?: string;
  mnemonic: string;
  clinicalContext: string;
  keyRule: string;
  nerveType?: 'a_delta' | 'c_fibers' | 'a_beta' | 'mixed';
}

export const PARAMETER_MNEMONICS: Record<string, TooltipMnemonicData> = {
  Location: {
    title: 'Parameter: Location of Pain',
    badge: 'Spatial Localization',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
    mnemonic: 'Pulp = Puzzle (Diffuse) | PDL = Pinpoint (Bullseye)',
    clinicalContext:
      'Dental pulp lacks proprioceptive mechanoreceptors; sensory signals refer diffusely across the quadrant. In contrast, the Periodontal Ligament (PDL) contains fast A-beta fibers that pinpoint the culprit tooth with 100% precision.',
    keyRule: 'If the patient can point with one finger to an exact tooth, apical PDL inflammation is present. If diffuse, pulpal inflammation is active.',
  },
  Duration: {
    title: 'Parameter: Duration of Pain',
    badge: 'Reversibility Threshold',
    badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    mnemonic: 'Momentary = Mild/Reversible | Lingering = Lethal/Irreversible',
    clinicalContext:
      'Momentary pain stops strictly when the thermal stimulus is removed (<2-3s). Lingering pain (>15s) indicates deep tissue acidosis, capillary dilatation, and microvascular congestion in the pulp core.',
    keyRule: 'Cold test stopwatch rule: Pain vanishing instantly = Reversible pulpitis. Pain lingering >15s = Irreversible pulpitis (RCT needed).',
  },
  Nature: {
    title: 'Parameter: Nature / Quality of Pain',
    badge: 'Fiber Differentiation',
    badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
    mnemonic: 'Sharp Shock = Aδ Fluid Shear | Dull Throb = C-Fiber Pressure Pulse',
    clinicalContext:
      'Sharp, lancinating, piercing pain is mediated by myelinated Aδ fibers shearing in dentinal tubules. Deep, dull, throbbing, rhythmic pain is mediated by slow unmyelinated C-fibers pulsing synchronously with arterial blood pressure.',
    keyRule: 'Sharp shooting pain on RELEASING a bite (not on biting down) is pathognomonic for Cracked Tooth Syndrome (Tooth Slooth test).',
  },
  Stimulus: {
    title: 'Parameter: Initiating Stimulus',
    badge: 'Diagnostic Trigger',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    mnemonic: 'Cold = Contraction (Aδ) | Heat = Expansion (C) | Sugar = Osmosis',
    clinicalContext:
      'Cold thermal shock contracts tubule fluid outward at 2-3 mm/s. Heat expands blood volume in rigid dentin walls. Hypertonic sugar/acid draws tubule water outward via osmotic gradient.',
    keyRule: 'Severe pain provoked by heat and dramatically RELIEVED by ice water indicates late irreversible pulpitis with liquefactive gas necrosis.',
  },
};

export const NERVE_MNEMONICS: Record<string, TooltipMnemonicData> = {
  a_delta: {
    title: 'A-delta (Aδ) Sensory Nerve Fibers',
    badge: 'Myelinated • 12–30 m/s',
    badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    mnemonic: 'Aδ = Arrow / Acute / Air / Awake (Fast, Sharp & Pricking)',
    clinicalContext:
      'Located at the pulp-dentin junction and coronal pulp horns. Low activation threshold. Stimulated by hydrodynamic tubular fluid displacement (cold Endo-Ice, air blast, osmotic sweets). Primary indicator of vital pulp.',
    keyRule: 'Sharp momentary sensation without lingering indicates intact vital odontoblasts (Reversible Pulpitis or Dentin Hypersensitivity).',
    nerveType: 'a_delta',
  },
  c_fibers: {
    title: 'C-Fibers (Deep Pulpal Core)',
    badge: 'Unmyelinated • 0.5–2 m/s',
    badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
    mnemonic: 'C = Chronic / Constant / Core / Continuous (Deep Dull Ache)',
    clinicalContext:
      'Located deep in central pulp parenchyma and microvasculature. High activation threshold. Resistant to hypoxia; fires during severe inflammatory tissue pressure (>35 mmHg), heat, and ischemia.',
    keyRule: 'Dull, throbbing, spontaneous, or night pain signals advanced irreversible pulp tissue damage or necrosis requiring root canal therapy.',
    nerveType: 'c_fibers',
  },
  a_beta: {
    title: 'A-beta (Aβ) Proprioceptive Mechanoreceptors',
    badge: 'Heavily Myelinated • 30–70 m/s',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
    mnemonic: 'Aβ = Anchor / Bone / Bite / Bullseye (Pinpoint Location)',
    clinicalContext:
      'Located in the Periodontal Ligament (PDL) and alveolar bone socket. ZERO proprioceptors exist in dental pulp. Activated by mechanical pressure, biting, and vertical/horizontal percussion.',
    keyRule: 'Tender to vertical percussion confirms periapical inflammation spreading through the apical foramen into the PDL space.',
    nerveType: 'a_beta',
  },
  mixed: {
    title: 'Mixed Aδ + C-Fibers (Transitional Phase)',
    badge: 'Dual Afferent Firing',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    mnemonic: 'Mixed = Moving from Reversible to Irreversible',
    clinicalContext:
      'Superficial Aδ fibers trigger acute sensitivity to cold, while deeper core C-fibers react with lingering throbbing to heat and tissue acidosis. Marks advancing microbial ingress.',
    keyRule: 'Response to both cold and heat signifies the clinical boundary where conservative pulp capping is no longer viable.',
    nerveType: 'mixed',
  },
};

export const DIAGNOSIS_MNEMONICS: Record<string, TooltipMnemonicData> = {
  reversible: {
    title: 'Provisional Diagnosis: Reversible Pulpitis',
    badge: 'Conservative Pulp Preservation',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    mnemonic: 'Reverse the Cause, Retain the Pulp',
    clinicalContext:
      'Localized pulpal hypervascularity with intact cellular architecture. The pulp is biologically capable of complete recovery once caries, microleakage, or open dentinal tubules are sealed.',
    keyRule: 'Cold test stops instantly (<2s). NO spontaneous pain. Percussion test is strictly negative.',
  },
  irreversible: {
    title: 'Provisional Diagnosis: Irreversible Pulpitis',
    badge: 'Pulpectomy / RCT Required',
    badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
    mnemonic: 'Irreversible = Instrumentation (RCT Required)',
    clinicalContext:
      'Microabscesses, widespread tissue necrosis, and severe ischemia inside an unyielding rigid dentin shell. The pulp cannot biologically heal; untreated cases progress to complete apical periodontitis.',
    keyRule: 'Lingering thermal pain (>15s), spontaneous pain without stimulus, or nocturnal pain waking patient from sleep.',
  },
  periodontal: {
    title: 'Provisional Diagnosis: Apical Periodontitis / Periodontal Pain',
    badge: 'PDL Space Involved',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
    mnemonic: 'Apex Breached, Tap Tells All',
    clinicalContext:
      'Inflammatory exudate has breached the apical foramen into the periodontal ligament space, mechanically compressing Aβ mechanoreceptors against alveolar bone.',
    keyRule: 'Exquisite tenderness to vertical percussion. Tooth often feels high in occlusion. Check vitality to rule out necrotic pulp.',
  },
  cracked_tooth: {
    title: 'Provisional Diagnosis: Cracked Tooth Syndrome',
    badge: 'Incomplete Crown Fracture',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    mnemonic: 'Bite Down = Fine; LET GO = Sharp Spine! (Tooth Slooth Rebound)',
    clinicalContext:
      'Incomplete structural fracture through enamel and dentin into pulp. Masticatory load flexes fractured cusps; sudden release causes violent dentinal fluid turbulence.',
    keyRule: 'Sharp pain upon releasing bite pressure on a Tooth Slooth. Transilluminate CEJ with fiberoptic light to visualize fracture plane.',
  },
  dentin_hypersensitivity: {
    title: 'Provisional Diagnosis: Dentin Hypersensitivity',
    badge: 'Open Tubules • Healthy Pulp',
    badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    mnemonic: 'Open Tubules, Intact Pulp',
    clinicalContext:
      'Cervical enamel loss (erosion, abrasion, abfraction) exposing patent dentinal tubules directly to the oral environment without active pulpal inflammation.',
    keyRule: 'Instant momentary twinge to cold air blast or explorer tip that resolves immediately (<1s). Treat with desensitizing bonding agents.',
  },
  partial_necrosis: {
    title: 'Provisional Diagnosis: Partial Necrosis / Late Irreversible',
    badge: 'Gangrenous Gas Expansion',
    badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800',
    mnemonic: 'Heat Blows Up, Ice Calms Down',
    clinicalContext:
      'Coronal pulp is necrotic with anaerobic bacterial gas formation, while apical radicular pulp remains partially vital with hypoxic C-fibers. Heat expands gases; cold contracts them.',
    keyRule: 'Patient reports severe throbbing relieved by holding ice water in the mouth. Urgent pulpal access cavity debridement required.',
  },
};

export function getNerveTooltip(nerveName: string): TooltipMnemonicData {
  const lower = nerveName.toLowerCase();
  if (lower.includes('delta') || lower.includes('aδ') || lower.includes('a-delta')) {
    if (lower.includes('c-fiber') || lower.includes('c-fibers')) {
      return NERVE_MNEMONICS.mixed;
    }
    return NERVE_MNEMONICS.a_delta;
  }
  if (lower.includes('beta') || lower.includes('aβ') || lower.includes('pdl') || lower.includes('a-beta')) {
    return NERVE_MNEMONICS.a_beta;
  }
  if (lower.includes('c-fiber') || lower.includes('c-fibers') || lower.includes('hypoxic')) {
    return NERVE_MNEMONICS.c_fibers;
  }
  return NERVE_MNEMONICS.a_delta;
}

export function getParameterTooltip(param: string): TooltipMnemonicData {
  return PARAMETER_MNEMONICS[param] || PARAMETER_MNEMONICS.Location;
}

export function getDiagnosisTooltip(diagnosis: string): TooltipMnemonicData {
  const lower = diagnosis.toLowerCase();
  if (lower.includes('fracture') || lower.includes('crack')) {
    return DIAGNOSIS_MNEMONICS.cracked_tooth;
  }
  if (lower.includes('periodont') || lower.includes('apical')) {
    return DIAGNOSIS_MNEMONICS.periodontal;
  }
  if (lower.includes('partial necrosis') || lower.includes('relieved by cold') || lower.includes('late stage')) {
    return DIAGNOSIS_MNEMONICS.partial_necrosis;
  }
  if (lower.includes('dentin hypersensitivity')) {
    return DIAGNOSIS_MNEMONICS.dentin_hypersensitivity;
  }
  if (lower.includes('irreversible')) {
    return DIAGNOSIS_MNEMONICS.irreversible;
  }
  return DIAGNOSIS_MNEMONICS.reversible;
}
