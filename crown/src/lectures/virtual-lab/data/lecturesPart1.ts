import { LectureData } from '../types/lecture';

export const LECTURES_PART_1: LectureData[] = [
  {
    id: 'lec-04',
    numberLabel: 'Lecture 04',
    shortTitle: 'FPD Biomechanics',
    title: 'Biomechanical Considerations of Fixed Partial Denture',
    lecturer: 'Dr. Lamis A. Al-Taee',
    sourcePdf: 'Lect_4_12e19f3e.pdf',
    summary:
      'Analyze destructive occlusal and dislodging forces (torque, flexure, tension) across FPD spans, arch curvature lever arms, pier abutments, tilted molars, and canine replacements.',
    objectives: [
      {
        id: 'lec04-obj-1',
        text: 'Apply the Law of Beam to predict FPD deflection as a function of span length cubed and occlusogingival thickness cubed.',
        bloomLevel: 'Apply',
      },
      {
        id: 'lec04-obj-2',
        text: 'Design double-abutment and non-rigid connector strategies to counter arch-curvature torque and pier-abutment fulcrum stress.',
        bloomLevel: 'Analyze',
      },
      {
        id: 'lec04-obj-3',
        text: 'Select management options for mesially tilted mandibular second molars and high-stress canine replacement FPDs.',
        bloomLevel: 'Evaluate',
      },
    ],
    threeD: {
      title: '3D FPD Span Deflection & Biomechanical Stress Sandbox',
      subtitle: 'Law of Beam, Pier Fulcrum & Arch Curvature Force Simulator',
      educationalNote:
        'Educational model illustrating directional beam flexure and connector placement principles; not a validated patient FEA solver.',
      defaultCamera: [0, 3.2, 7.6],
      defaultTarget: [0, 0.4, 0],
      primaryModes: [
        { id: '1-pontic', label: '1 Pontic (1x Flexure)' },
        { id: '2-pontic', label: '2 Pontics (8x Flexure)' },
        { id: '3-pontic', label: '3 Pontics (27x Flexure)' },
        { id: 'pier', label: 'Pier + Non-Rigid' },
      ],
      secondaryModes: [
        { id: 'normal-og', label: 'Full Connector Height' },
        { id: 'half-og', label: 'Half OG Height (8x)' },
      ],
      sliderLabel: 'Occlusal Bite Load',
      sliderUnit: 'N',
      sliderMin: 50,
      sliderMax: 600,
      sliderStep: 25,
      sliderDefault: 250,
      toggleLabel: 'Anterior Arch Lever Arm',
      structureLayers: [
        { id: 'restoration', label: 'Bridge Prosthesis' },
        { id: 'abutments', label: 'Abutment Roots' },
        { id: 'periodontium', label: 'Alveolar Bone & PDL' },
        { id: 'stress', label: 'Stress Vectors' },
      ],
      guidedTour: [
        {
          id: 'tour-04-1',
          title: 'Span Length & Cubed Flexure',
          description:
            'Increasing pontic span from 1 to 2 teeth multiplies bending 8x; a 3-pontic span bends 27x more under identical occlusal force.',
          cameraPosition: [0, 2.2, 6.8],
          cameraTarget: [0, 0.6, 0],
          highlightPart: 'restoration',
        },
        {
          id: 'tour-04-2',
          title: 'Pier Abutment & Distal Keyway',
          description:
            'In a 5-unit pier bridge, placing the dovetail keyway on the distal of the pier abutment lets mesial physiologic tilt seat the T-key solidly.',
          cameraPosition: [1.8, 2.5, 5.4],
          cameraTarget: [0, 0.7, 0],
          highlightPart: 'stress',
        },
        {
          id: 'tour-04-3',
          title: 'Anterior Arch Fulcrum Lever',
          description:
            'Four maxillary incisor pontics sit labial to the canine interabutment axis, requiring first premolars as secondary counter-balancing abutments.',
          cameraPosition: [0, 5.6, 3.8],
          cameraTarget: [0, 0.4, 0],
          highlightPart: 'abutments',
        },
      ],
      accessibleSummary:
        'Interactive 3D fixed partial denture model demonstrating how span length (1, 2, or 3 pontics), occlusogingival connector thickness, pier abutment non-rigid connectors, and anterior arch curvature affect structural deflection and abutment stress.',
    },
    procedureFlow: {
      id: 'lec04-flow',
      title: 'Clinical Workflow: Managing a Mesially Tilted Mandibular 2nd Molar',
      clinicalContext:
        'Early loss of the mandibular 1st molar caused mesial tilting of the 2nd molar. Order the clinical evaluation and management sequence.',
      steps: [
        {
          id: 's1',
          title: 'Assess Degree of Mesial & Lingual Tilt + 3rd Molar Presence',
          detail: 'Evaluate path of insertion parallelism and check whether an erupted 3rd molar blocks distal uprighting.',
          hint: 'Always diagnose positional relationship and 3rd molar status before choosing a retainer design.',
        },
        {
          id: 's2',
          title: 'Consider Orthodontic Uprighting (~3 Months) if Tilting is Severe',
          detail: 'Extract 3rd molar if present to allow distal uprighting, normalizing occlusal force distribution and mesial bony defects.',
          hint: 'Orthodontic uprighting is the first-line conservative option for severe tilting.',
        },
        {
          id: 's3',
          title: 'Evaluate Non-Ortho Restorative Alternatives if Ortho Declined',
          detail: 'Compare proximal half-crown (strict caries-free distal requirement), telescope crown & coping, or non-rigid connector.',
          hint: 'Choice depends on existing restorations (DO amalgam/dowel on premolar vs extensive facial/lingual decay on molar).',
        },
        {
          id: 's4',
          title: 'Place Non-Rigid Keyway on Distal of Premolar (Never Mesial of Molar)',
          detail: 'A box form on the premolar distal accommodates the keyway; placing it on the tipped molar mesial worsens tipping.',
          hint: 'Placing the keyway on the mesial of a tilted molar allows further mesial tipping.',
        },
        {
          id: 's5',
          title: 'Verify Path of Insertion with Parallelometer-Mirror Prior to Impression',
          detail: 'Confirm abutment positional relationship optically before capturing the final impression.',
          hint: 'Final verification ensures draw without undercuts before impression taking.',
        },
      ],
    },
    clinicalCase: {
      id: 'lec04-case',
      title: 'Case Decision: Pier Abutment & Maxillary Canine Replacement',
      patientProfile: {
        ageSex: '46-year-old male',
        chiefComplaint: 'Missing maxillary right 1st premolar (#14) and 1st molar (#16); #15 present as isolated pier.',
        history: 'Teeth extracted 4 years ago due to caries; patient requests fixed restoration.',
        toothCondition: 'Canine (#13), 2nd premolar (#15), and 2nd molar (#17) have intact crowns and normal bone support.',
        radiographicFinding: 'Favorable crown-root ratios (1:1.5) and parallel root alignment on #13, #15, #17.',
        occlusalFactor: 'Moderate posterior chewing forces; physiological mesial drifting tendency of posterior teeth.',
      },
      stages: [
        {
          id: 'st-1',
          prompt: 'How should the 5-unit span (#13–#17) with intermediate pier abutment (#15) be connected?',
          options: [
            {
              id: 'opt-rigid',
              label: '5-Unit Fully Rigid Cast Bridge',
              isRecommended: false,
              outcomeTitle: 'High Fulcrum Risk on Terminal Retainer',
              outcomeStatus: 'contraindicated',
              rationale:
                'The pier abutment (#15) acts as a fulcrum under occlusal load, generating leverage that loosens the weaker canine retainer and causes marginal leakage.',
              biomechanicalEffect: 'Extrusive tensile force at #13 retainer → cement failure & secondary caries.',
            },
            {
              id: 'opt-distal-nrc',
              label: 'Non-Rigid Connector with Keyway on Distal of Pier (#15)',
              isRecommended: true,
              outcomeTitle: 'Stress-Broken Biomechanical Equilibrium',
              outcomeStatus: 'optimal',
              rationale:
                'Dovetail keyway in distal contour of #15 + T-key on mesial of distal pontic (#16) breaks mesiodistal torque while physiological mesial tilt seats the key deeper.',
              biomechanicalEffect: 'Shear stress transferred to supporting bone; independent abutment movement preserved.',
            },
            {
              id: 'opt-mesial-nrc',
              label: 'Non-Rigid Connector with Keyway on Mesial of Pier (#15)',
              isRecommended: false,
              outcomeTitle: 'Key Unseating During Function',
              outcomeStatus: 'contraindicated',
              rationale:
                'Posterior teeth tilt mesially under occlusal force; a mesially placed keyway on the pier unseats the key and induces canine mobility.',
              biomechanicalEffect: 'Unseating vector on key → pathologic mobility of #13.',
            },
          ],
        },
        {
          id: 'st-2',
          prompt: 'If this patient instead lost all 4 maxillary incisors in a pointed tapered arch, what abutment plan offsets the labial lever arm?',
          options: [
            {
              id: 'opt-canines-only',
              label: 'Canines Alone as Terminal Abutments',
              isRecommended: false,
              outcomeTitle: 'Unopposed Labial Torque',
              outcomeStatus: 'contraindicated',
              rationale:
                'Incisor pontics sit far labial to the interabutment axis in a tapered arch, creating an uncompensated lever arm.',
              biomechanicalEffect: 'Tipping torque exceeds single-abutment retention.',
            },
            {
              id: 'opt-double-premolars',
              label: 'Canines + First Premolars as Secondary Double Abutments',
              isRecommended: true,
              outcomeTitle: 'Counter-Balanced Lever Resistance',
              outcomeStatus: 'optimal',
              rationale:
                'Adding first premolars provides counter-balancing retention posterior to the fulcrum line equal to the labial lever distance.',
              biomechanicalEffect: 'Opposing retention neutralizes anterior tipping moment.',
            },
          ],
        },
      ],
      educationalDisclaimer:
        'Simulated clinical case based on Lecture 4 principles. Real treatment planning requires comprehensive clinical, periodontal, and radiographic assessment.',
    },
    materialComparison: {
      id: 'lec04-compare',
      title: 'Tilted Molar Abutment Management Matrix',
      subtitle: 'Compare the 4 Lecture 4 solutions by tooth conservation, occlusal alignment, and clinical constraints.',
      items: [
        {
          id: 'ortho-upright',
          name: 'Orthodontic Uprighting',
          category: 'Pre-Prosthetic Alignment',
          metrics: [
            { label: 'Tooth Conservation', value: 95, max: 100, unit: '%' },
            { label: 'Axial Force Alignment', value: 95, max: 100, unit: '%' },
            { label: 'Treatment Duration', value: 3, max: 12, unit: 'mo' },
          ],
          indications: [
            'Severe mesial tilting of mandibular 2nd molar',
            'Mesial periodontal bony defect correction',
          ],
          contraindications: [
            'Retained 3rd molar blocking distal movement (extract 3rd molar first)',
          ],
          clinicalNote: 'Average treatment time is ~3 months; normalizes mesial bony contour.',
        },
        {
          id: 'prox-half',
          name: 'Proximal Half-Crown',
          category: 'Conservative Retainer',
          metrics: [
            { label: 'Tooth Conservation', value: 85, max: 100, unit: '%' },
            { label: 'Caries Risk Tolerance', value: 20, max: 100, unit: '%' },
            { label: 'Path Tolerance', value: 45, max: 100, unit: '%' },
          ],
          indications: [
            'Mild-moderate mesial tilt with caries-free distal surface',
            'Exceptionally clean oral hygiene & low proximal caries incidence',
          ],
          contraindications: [
            'Severe marginal ridge height discrepancy between 2nd & 3rd molar',
            'Distal decalcification or caries',
          ],
          clinicalNote: 'Essentially a 3/4 crown rotated 90° so the distal surface remains uncovered.',
        },
        {
          id: 'telescope',
          name: 'Telescope Crown & Coping',
          category: 'Dual-Coping Retainer',
          metrics: [
            { label: 'Tooth Conservation', value: 30, max: 100, unit: '%' },
            { label: 'Path Compensation', value: 95, max: 100, unit: '%' },
            { label: 'Total Coverage', value: 100, max: 100, unit: '%' },
          ],
          indications: [
            'Marked discrepancy in path of insertion',
            'Extensive facial and/or lingual restorations on tilted molar',
          ],
          contraindications: [
            'Large pulp chamber / insufficient tooth bulk for heavy reduction',
          ],
          clinicalNote: 'Inner coping follows tilted long axis; outer FPD retainer aligns with bridge draw.',
        },
        {
          id: 'nrc-molar',
          name: 'Non-Rigid Connector',
          category: 'Segmented Seating',
          metrics: [
            { label: 'Tooth Conservation', value: 55, max: 100, unit: '%' },
            { label: 'Path Compensation', value: 90, max: 100, unit: '%' },
            { label: 'Independent Seating', value: 100, max: 100, unit: '%' },
          ],
          indications: [
            'Marked lingual + mesial inclination preventing single path',
            'Existing DO amalgam or dowel core on anterior premolar (keyway site)',
          ],
          contraindications: [
            'Never place keyway on mesial of tipped molar (increases tipping)',
          ],
          clinicalNote: 'Keyway placed in distal box of premolar allows molar segment to seat along its own axis.',
        },
      ],
    },
    diagnosticPlanner: {
      id: 'lec04-planner',
      title: 'Law of Beam & Span Prognosis Calculator',
      subtitle: 'Configure span length, connector height, and abutment design to compute relative deflection.',
      scenario: 'Evaluate how span geometry multiplies bridge flexure and determines abutment prognosis.',
      diagramType: 'beam-deflection',
      variables: [
        {
          id: 'spanCount',
          label: 'Number of Missing Adjacent Pontics (L)',
          options: [
            { id: '1', label: '1 Pontic (Ideal)', scoreDelta: 1, note: 'Baseline 1x deflection' },
            { id: '2', label: '2 Pontics (L = 2x)', scoreDelta: 8, note: '2^3 = 8x deflection' },
            { id: '3', label: '3 Pontics (L = 3x)', scoreDelta: 27, note: '3^3 = 27x deflection (guarded/poor)' },
          ],
        },
        {
          id: 'ogHeight',
          label: 'Occlusogingival Pontic/Connector Thickness (t)',
          options: [
            { id: 'full', label: 'Full Thickness (1.0t)', scoreDelta: 1, note: '1x baseline stiffness' },
            { id: 'half', label: 'Halved Thickness (0.5t)', scoreDelta: 8, note: '(1/0.5)^3 = 8x deflection increase' },
          ],
        },
        {
          id: 'archZone',
          label: 'Arch Location & Abutment Support',
          options: [
            { id: 'max-double', label: 'Double Abutment + Bulk Connector', scoreDelta: 1, note: 'Increases PDL support & retention' },
            { id: 'mand-short', label: 'Short Mandibular Posterior Single Abutment', scoreDelta: 2, note: 'High risk of porcelain fracture or debonding' },
          ],
        },
      ],
    },
    visualComponents: [
      {
        id: 'v04-1',
        kind: 'formula-card',
        title: 'Law of Beam Deflection Equation',
        subtitle: 'Cubed sensitivity to span length and occlusogingival height',
        formula: {
          expression: 'Deflection ∝ L³ / t³',
          variables: [
            { symbol: 'L', meaning: 'Mesiodistal span length (1 pontic = 1x, 2 = 8x, 3 = 27x)' },
            { symbol: 't', meaning: 'Occlusogingival thickness (halving t produces 8x flexure)' },
          ],
          takeaway:
            'Replacing 3 posterior teeth with an FPD rarely has favorable prognosis, especially in the mandibular arch; prefer RPDs or implants.',
        },
      },
      {
        id: 'v04-2',
        kind: 'hotspot-diagram',
        title: 'Interactive Biomechanical Anatomy Map',
        subtitle: 'Click clinical landmarks on the 5-unit pier & anterior arch schematic',
        diagramKey: 'pier-biomechanics',
        hotspots: [
          {
            id: 'h1',
            x: 22,
            y: 45,
            label: 'Anterior Terminal Retainer',
            detail: 'Experiences extrusive tensile lifting forces when the pier acts as a fulcrum under distal load.',
          },
          {
            id: 'h2',
            x: 50,
            y: 38,
            label: 'Pier Abutment + Distal Keyway',
            detail: 'Dovetail keyway sits within the distal contour of the pier abutment so mesial physiologic tilt seats the key.',
          },
          {
            id: 'h3',
            x: 78,
            y: 45,
            label: 'Distal Pontic + Mesial T-Key',
            detail: 'T-shaped key attaches to the mesial aspect of the distal pontic, breaking mesiodistal torque.',
          },
        ],
      },
      {
        id: 'v04-3',
        kind: 'metric-grid',
        title: 'Span Flexure Multipliers',
        subtitle: 'Direct quantitative comparison from Lecture 4 beam mechanics',
        items: [
          { title: '1-Pontic Span', value: '1x', note: 'Ideal rigid span', status: 'safe' },
          { title: '2-Pontic Span', value: '8x', note: 'Requires rigid bulk & good C:R', status: 'warn' },
          { title: '3-Pontic Span', value: '27x', note: 'Rarely favorable prognosis', status: 'danger' },
          { title: 'Half OG Height', value: '8x', note: 'Short mandibular teeth risk failure', status: 'danger' },
        ],
      },
      {
        id: 'v04-4',
        kind: 'checklist',
        title: 'Double Abutment Criteria',
        subtitle: 'Requirements when adding secondary abutments',
        items: [
          { title: 'Root Surface Area', value: '≥ Primary', note: 'Secondary abutment must match primary root area', status: 'safe' },
          { title: 'Crown-Root Ratio', value: 'Favorable', note: 'Must support combined occlusal load', status: 'safe' },
          { title: 'Retainer Retention', value: '≥ Primary', note: 'Resists tensile forces when pontic flexes', status: 'warn' },
        ],
      },
      {
        id: 'v04-5',
        kind: 'timeline',
        title: 'Sequelae of Excessive FPD Flexure',
        subtitle: 'Mechanical and biological failure cascade',
        steps: [
          { label: '01. Load Application', detail: 'Long span or thin connector bends under mastication', metric: '8x–27x' },
          { label: '02. Tensile Stress at Retainer', detail: 'Cement lute stressed at terminal/secondary abutment' },
          { label: '03. Mechanical Failure', detail: 'Porcelain veneer fracture, connector breakage, or retainer loosening' },
          { label: '04. Biological Sequelae', detail: 'Marginal leakage, recurrent caries, and unfavorable PDL response' },
        ],
      },
      {
        id: 'v04-6',
        kind: 'comparison-table',
        title: 'Maxillary vs. Mandibular Canine FPD Stress',
        subtitle: 'Why maxillary canine bridges experience higher stress',
        headers: ['Parameter', 'Maxillary Canine FPD', 'Mandibular Canine FPD'],
        rows: [
          ['Force Direction', 'Outward (labially)', 'Inward (lingually)'],
          ['Curve Resistance', 'Inside of curve (weakest point)', 'Outside of curve (strongest point)'],
          ['Offset from Axis', 'Farther outside interabutment axis', 'Closer to interabutment axis'],
          ['Abutments', 'Lateral incisor (weakest overall) & 1st premolar (weakest posterior)', 'Lower lateral & 1st premolar'],
        ],
      },
      {
        id: 'v04-7',
        kind: 'safety-alert',
        title: 'Canine Replacement Limit Rule',
        subtitle: 'Clinical contraindication for extended canine spans',
        items: [
          {
            title: 'Maximum Additional Teeth',
            value: '≤ 1 tooth',
            note: 'No FPD replacing a canine should replace more than one additional tooth.',
            status: 'warn',
          },
          {
            title: 'Canine + 2 Contiguous Teeth',
            value: 'Implants / RPD',
            note: 'Edentulous space with missing canine + any 2 contiguous teeth is best restored with implants or an RPD.',
            status: 'danger',
          },
        ],
      },
      {
        id: 'v04-8',
        kind: 'flowchart',
        title: 'Pier Abutment 3-Option Decision Tree',
        subtitle: 'Preventing fulcrum-induced retainer debonding',
        steps: [
          { label: 'Option 1: Extremely Retentive Retainers', detail: 'Maximizes mechanical resistance if rigid bridge selected' },
          { label: 'Option 2: Cantilever Segment', detail: 'Simpler option when periodontal support around pier is adequate' },
          { label: 'Option 3: Non-Rigid Connector', detail: 'Distal keyway in pier + mesial T-key on distal pontic (preferred stress-breaker)' },
        ],
      },
      {
        id: 'v04-9',
        kind: 'checklist',
        title: 'Minimizing Bridge Flexing',
        subtitle: 'Design principles to preserve rigidity',
        items: [
          { title: 'Pontic OG Dimension', value: 'Maximize', note: 'Greater occlusogingival height cubes rigidity', status: 'safe' },
          { title: 'Connector Bulk', value: 'Optimal', note: 'As bulky as possible without impinging gingival embrasure', status: 'safe' },
          { title: 'Double Abutments', value: 'When Indicated', note: 'Use for long span or unfavorable crown-root ratio', status: 'safe' },
        ],
      },
      {
        id: 'v04-10',
        kind: 'metric-grid',
        title: 'Path of Insertion Verification',
        subtitle: 'Pre-impression intraoral check',
        items: [
          { title: 'Inspection Tool', value: 'Parallelometer-Mirror', note: 'Spots abutment positional relationship', status: 'safe' },
          { title: 'Timing', value: 'Before Impression', note: 'Confirm draw prior to final imprint', status: 'safe' },
        ],
      },
    ],
    quiz: [
      {
        id: 'q04-1',
        type: 'clinical-mcq',
        prompt: 'According to the Law of Beam, how much more will a three-tooth pontic FPD flex compared to a single-tooth pontic FPD under the same load?',
        options: [
          { id: 'a', text: '3 times as much', explanation: 'Deflection varies with the cube of span length, not linearly.' },
          { id: 'b', text: '8 times as much', explanation: '8x flexure applies to a two-tooth pontic span (2³) or halving connector height.' },
          { id: 'c', text: '27 times as much', explanation: 'Correct: 3³ = 27 times greater deflection, making 3-pontic posterior FPDs rarely favorable.' },
          { id: 'd', text: '9 times as much', explanation: 'Beam deflection scales to the third power (cubed), not squared.' },
        ],
        correctOptionId: 'c',
      },
      {
        id: 'q04-2',
        type: 'model-3d',
        prompt: 'In the 3D Pier + Non-Rigid mode, where must the dovetail keyway be positioned to prevent unseating during physiologic mesial tooth movement?',
        visualHint: 'Inspect the 3D Pier + Non-Rigid configuration and stress vector tour step.',
        options: [
          { id: 'a', text: 'On the mesial contour of the pier abutment', explanation: 'Mesial placement on the pier causes mesial tilt to unseat the key and stress the canine.' },
          { id: 'b', text: 'Within the distal contour of the pier abutment', explanation: 'Correct: mesial occlusal forces seat the T-key solidly into a distally placed keyway on the pier.' },
          { id: 'c', text: 'On the mesial aspect of the tipped molar retainer', explanation: 'Placing a non-rigid connector on the mesial of a tipped molar induces greater tipping.' },
          { id: 'd', text: 'Mid-pontic between two pontic units', explanation: 'The key-keyway connects the retainer keyway and mesial side of the distal pontic.' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q04-3',
        type: 'clinical-mcq',
        prompt: 'When replacing all four maxillary incisors in a pointed tapered arch, which teeth are required as secondary abutments to offset the labial lever arm?',
        options: [
          { id: 'a', text: 'Maxillary central incisors', explanation: 'The four maxillary incisors are the missing teeth being replaced.' },
          { id: 'b', text: 'First premolars', explanation: 'Correct: first premolars provide counter-balancing retention posterior to the canine fulcrum line.' },
          { id: 'c', text: 'Second molars', explanation: 'Second molars are unnecessarily distant for an anterior incisor FPD.' },
          { id: 'd', text: 'No secondary abutments are needed', explanation: 'Pointed tapered arches create a long labial lever arm requiring double abutments.' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q04-4',
        type: 'visual-id',
        prompt: 'Which condition CONTRAINDICATES a proximal half-crown retainer on a mesially tilted mandibular second molar?',
        options: [
          { id: 'a', text: 'Caries-free distal surface', explanation: 'A caries-free distal surface is a requirement, not a contraindication.' },
          { id: 'b', text: 'Severe marginal ridge height discrepancy between 2nd and 3rd molar', explanation: 'Correct: severe marginal ridge discrepancy between 2nd and 3rd molars contraindicates proximal half-crowns.' },
          { id: 'c', text: 'Low incidence of proximal caries', explanation: 'Low proximal caries risk favors conservative partial coverage.' },
          { id: 'd', text: 'Exceptional patient oral hygiene', explanation: 'Good hygiene is required for proximal half-crowns.' },
        ],
        correctOptionId: 'b',
      },
    ],
    referencesAndLimitations: {
      sources: [
        'Dr. Lamis A. Al-Taee — Crown & Bridge Prosthodontics Lecture 4: Biomechanical Considerations of Fixed Partial Denture (Lect_4_12e19f3e.pdf).',
      ],
      clinicalReviewFlags: [
        '3D stress colors and bending curves illustrate directional Law of Beam concepts and are not patient-specific finite element predictions.',
        'Quiz completion measures conceptual recall and does not certify clinical competence.',
      ],
    },
  },
  {
    id: 'lec-05',
    numberLabel: 'Lecture 05',
    shortTitle: 'Bridge Retainers',
    title: 'Components of Bridge: Bridge Retainers & Tooth Preparation',
    lecturer: 'Dr. Lamis A. Al-Taee',
    sourcePdf: 'Lect_5_4a645c29.pdf',
    summary:
      'Master major vs. minor retainers, 5 principles of tooth preparation, convergence taper (5–6°), finish line geometry, and selection criteria from full metal crowns to post crowns and resin-bonded bridges.',
    objectives: [
      {
        id: 'lec05-obj-1',
        text: 'Distinguish major and minor retainers across fixed-fixed and fixed-mobile bridge designs.',
        bloomLevel: 'Understand',
      },
      {
        id: 'lec05-obj-2',
        text: 'Evaluate the 8 assessment factors and 5 principles of tooth preparation including 5–6° convergence angle and finish line placement.',
        bloomLevel: 'Analyze',
      },
      {
        id: 'lec05-obj-3',
        text: 'Select appropriate extracoronal, partial veneer (3/4), post-core, telescopic, or resin-bonded retainers based on tooth conservation and biomechanical demand.',
        bloomLevel: 'Evaluate',
      },
    ],
    threeD: {
      title: '3D Crown Preparation, Taper & Finish Line Sandbox',
      subtitle: 'Convergence Angle, Reduction Depth & Margin Configuration Lab',
      educationalNote:
        'Educational tooth preparation geometry model demonstrating convergence taper and margin shapes; verify actual bur dimensions clinically.',
      defaultCamera: [3.2, 2.5, 4.4],
      defaultTarget: [0, 0.9, 0],
      primaryModes: [
        { id: 'chamfer', label: 'Chamfer' },
        { id: 'heavy-chamfer', label: 'Heavy Chamfer' },
        { id: 'shoulder', label: 'Shoulder (90°)' },
        { id: 'beveled-shoulder', label: 'Beveled Shoulder' },
        { id: 'knife-edge', label: 'Knife Edge' },
      ],
      secondaryModes: [
        { id: 'full-metal', label: 'Full Metal' },
        { id: 'pfm', label: 'PFM Crown' },
        { id: 'all-ceramic', label: 'All-Ceramic' },
        { id: 'three-quarter', label: '3/4 Partial' },
      ],
      sliderLabel: 'Convergence Taper Angle',
      sliderUnit: '°',
      sliderMin: 2,
      sliderMax: 24,
      sliderStep: 1,
      sliderDefault: 6,
      toggleLabel: 'Cut-Section View',
      structureLayers: [
        { id: 'crown', label: 'Retainer Crown' },
        { id: 'prep', label: 'Prepared Dentin' },
        { id: 'pulp', label: 'Pulp Chamber' },
        { id: 'gingiva', label: 'Gingival Collar' },
      ],
      guidedTour: [
        {
          id: 'tour-05-1',
          title: '5–6° Convergence Taper',
          description:
            'Opposing axial walls tapered 5–6° maximize mechanical retention while avoiding undercuts and seating failure.',
          cameraPosition: [3.5, 1.8, 3.8],
          cameraTarget: [0, 1.0, 0],
          highlightPart: 'prep',
        },
        {
          id: 'tour-05-2',
          title: 'Finish Line Configuration',
          description:
            'Finish line geometry (chamfer, heavy chamfer, shoulder, beveled shoulder, knife edge) dictates restorative bulk and marginal seal.',
          cameraPosition: [2.2, 0.9, 2.8],
          cameraTarget: [0, 0.45, 0],
          highlightPart: 'gingiva',
        },
        {
          id: 'tour-05-3',
          title: 'Supragingival Periodontal Preservation',
          description:
            'Whenever esthetics, retention, and caries permit, supragingival margins on hard enamel allow easy finishing and hygiene.',
          cameraPosition: [2.8, 1.5, 3.4],
          cameraTarget: [0, 0.6, 0],
          highlightPart: 'crown',
        },
      ],
      accessibleSummary:
        'Interactive 3D abutment preparation and crown retainer simulator allowing adjustment of convergence taper angle (2 to 24 degrees), finish line profiles (chamfer, heavy chamfer, shoulder, beveled shoulder, knife edge), retainer materials, and cut-section inspection.',
    },
    procedureFlow: {
      id: 'lec05-flow',
      title: 'Retainer Selection & Preparation Principle Workflow',
      clinicalContext: 'Sequence the clinical assessment and preparation priorities when planning a bridge retainer.',
      steps: [
        {
          id: 'r1',
          title: 'Evaluate Abutment Alignment & Path of Insertion',
          detail: 'Assess parallelism between abutments; non-parallel teeth make complete crowns less conservative.',
          hint: 'Alignment determines whether partial or telescopic coverage is needed.',
        },
        {
          id: 'r2',
          title: 'Assess Tooth Condition, Caries Susceptibility & Esthetic Demand',
          detail: 'Extensive buccal caries or poor oral hygiene mandates complete coverage; intact buccal enamel allows 3/4 partial veneer.',
          hint: 'Conservation hierarchy: Inlays/Onlays > partial coverage > complete coverage.',
        },
        {
          id: 'r3',
          title: 'Determine Required Retention (Span, Bridge Type, Bite & Habits)',
          detail: 'Long spans, fixed-fixed bridges, heavy bite, or bruxism demand full occlusal coverage and thicker rigid retainers.',
          hint: 'Fixed-fixed bridges require stronger major retainers than fixed-mobile minor retainers.',
        },
        {
          id: 'r4',
          title: 'Prepare Axial Walls to 5–6° Convergence & Sufficient Occlusal Reduction',
          detail: 'Preserve tooth structure while achieving structural durability (1–1.5 mm occlusal clearance) and avoiding over-taper.',
          hint: 'Retention drops steeply as taper exceeds 6–10°.',
        },
        {
          id: 'r5',
          title: 'Refine Smooth, Continuous Finish Line (Prefer Supragingival)',
          detail: 'Keep margins clear, smooth, continuous, and on sound tooth structure; place subgingivally only for esthetics, retention, or caries.',
          hint: 'Supragingival enamel margins best preserve the periodontium.',
        },
      ],
    },
    clinicalCase: {
      id: 'lec05-case',
      title: 'Case Decision: Endodontically Treated Molar & Anterior Retainer Choice',
      patientProfile: {
        ageSex: '38-year-old female',
        chiefComplaint: 'Missing maxillary 1st premolar (#24); intact canine (#23) and endodontically treated 2nd premolar (#25).',
        history: '#25 has short clinical crown after RCT; well-condensed apical root filling.',
        toothCondition: '#23 has intact labial enamel and dentin; #25 has minimal coronal structure.',
        radiographicFinding: '#25 root has straight morphology, adequate length and width, no resorption.',
        occlusalFactor: 'Moderate occlusal load; high anterior smile esthetics.',
      },
      stages: [
        {
          id: 'c5-1',
          prompt: 'If using a fixed-mobile bridge for #24, how should #23 (minor) and #25 (major) be restored?',
          options: [
            {
              id: 'opt-fm-combo',
              label: 'Class III Inlay on Distal of #23 (Minor) + Full-Coverage Post Crown on #25 (Major)',
              isRecommended: true,
              outcomeTitle: 'Conservative Esthetic Fixed-Mobile Design',
              outcomeStatus: 'optimal',
              rationale:
                'Preserves intact labial surface of #23 while post-core full coverage on #25 provides rigidity and coronal reinforcement.',
              biomechanicalEffect: 'Intact labial enamel on canine; rigid major retainer resists occlusal stress.',
            },
            {
              id: 'opt-34-endo',
              label: '3/4 Partial Veneer Crown on #25',
              isRecommended: false,
              outcomeTitle: 'Contraindicated on Short Endodontic Tooth',
              outcomeStatus: 'contraindicated',
              rationale:
                'Partial veneer 3/4 crowns are contraindicated on short clinical crowns and endodontically treated teeth.',
              biomechanicalEffect: 'Inadequate retention and high risk of cusp fracture.',
            },
          ],
        },
        {
          id: 'c5-2',
          prompt: 'Which post dimensions follow Lecture 5 guidelines for #25 or a multi-rooted tooth?',
          options: [
            {
              id: 'opt-post-spec',
              label: 'Parallel-sided post, 2/3 root length (4–5 mm from apex), 1/3 CEJ root diameter',
              isRecommended: true,
              outcomeTitle: 'Optimal Post Retention Without Root Perforation',
              outcomeStatus: 'optimal',
              rationale:
                'Parallel-sided posts are more retentive than tapered ones; leaving 4–5 mm apical gutta-percha preserves seal and 1/3 diameter protects root walls.',
              biomechanicalEffect: 'In multi-rooted teeth: palatal canal (max molar), distal canal (mand molar), buccal canal (max premolar).',
            },
            {
              id: 'opt-post-short',
              label: 'Wide tapered post 3 mm deep from CEJ',
              isRecommended: false,
              outcomeTitle: 'High Fracture & Dislodgement Risk',
              outcomeStatus: 'contraindicated',
              rationale:
                'Excessive diameter weakens root walls while insufficient length (<8 mm from CEJ or < crown length) fails to retain the post crown.',
              biomechanicalEffect: 'Inadequate lever resistance → post debonding or vertical root fracture.',
            },
          ],
        },
      ],
      educationalDisclaimer:
        'Educational case modeled directly on Lecture 5 retainer criteria. Verify canal anatomy radiographically before post space preparation.',
    },
    materialComparison: {
      id: 'lec05-compare',
      title: 'Bridge Retainer Type Comparison Matrix',
      subtitle: 'Compare Full Metal, PFM, All-Ceramic, 3/4 Partial, and Resin-Bonded retainers across clinical parameters.',
      items: [
        {
          id: 'full-metal',
          name: 'Complete Cast (Full Metal)',
          category: 'Extracoronal Rigid',
          metrics: [
            { label: 'Retention & Resistance', value: 98, max: 100, unit: '%' },
            { label: 'Tooth Conservation', value: 78, max: 100, unit: '%' },
            { label: 'Esthetics', value: 20, max: 100, unit: '%' },
          ],
          indications: [
            'Posterior teeth where esthetics is not critical',
            'Extensive destruction, endodontic teeth, clasp reception, high caries index',
          ],
          contraindications: [
            'High anterior/buccal esthetic zones',
            'Need for easy electric pulp vitality testing',
          ],
          clinicalNote: 'Most conservative full-coverage crown; strong even in thin sections (0.5–1.5 mm reduction).',
        },
        {
          id: 'pfm',
          name: 'Porcelain Fused to Metal (PFM)',
          category: 'Metal-Ceramic',
          metrics: [
            { label: 'Retention & Resistance', value: 92, max: 100, unit: '%' },
            { label: 'Tooth Conservation', value: 45, max: 100, unit: '%' },
            { label: 'Esthetics', value: 80, max: 100, unit: '%' },
          ],
          indications: [
            'Esthetic bridges requiring high retention and strength',
            'Long-span posterior or anterior bridges',
          ],
          contraindications: [
            'Large pulp chamber',
            'Intact buccal wall where conservative retainer suffices',
          ],
          clinicalNote: 'Requires substantial buccal/facial reduction (1.2–1.7 mm) to house metal + porcelain.',
        },
        {
          id: 'all-ceramic',
          name: 'All-Ceramic Retainer',
          category: 'Metal-Free Esthetic',
          metrics: [
            { label: 'Retention & Resistance', value: 75, max: 100, unit: '%' },
            { label: 'Tooth Conservation', value: 40, max: 100, unit: '%' },
            { label: 'Esthetics', value: 98, max: 100, unit: '%' },
          ],
          indications: [
            'Maximum anterior esthetics (natural translucency)',
            'Endo teeth with post & core + favorable occlusal load',
          ],
          contraindications: [
            'Bruxism or unfavorable occlusal load',
            'Thin teeth faciolingually or insufficient coronal structure',
          ],
          clinicalNote: 'Recommended reduction: 1.0 mm axial, 1.5 mm occlusal/incisal.',
        },
        {
          id: 'partial-34',
          name: 'Partial Veneer (3/4 Crown)',
          category: 'Partial Extracoronal',
          metrics: [
            { label: 'Retention & Resistance', value: 68, max: 100, unit: '%' },
            { label: 'Tooth Conservation', value: 88, max: 100, unit: '%' },
            { label: 'Esthetics', value: 82, max: 100, unit: '%' },
          ],
          indications: [
            'Short-span bridge, long thick clinical crown',
            'Intact buccal/labial surface, good hygiene, low caries index',
          ],
          contraindications: [
            'Short teeth, poor oral hygiene, grossly carious or endo-treated teeth',
            'Long-span bridges or poorly aligned abutments',
          ],
          clinicalNote: 'Supragingival margins allow vitality testing on unprepared buccal surface.',
        },
        {
          id: 'maryland',
          name: 'Resin-Bonded (Maryland)',
          category: 'Ultra-Conservative',
          metrics: [
            { label: 'Retention & Resistance', value: 50, max: 100, unit: '%' },
            { label: 'Tooth Conservation', value: 98, max: 100, unit: '%' },
            { label: 'Esthetics', value: 88, max: 100, unit: '%' },
          ],
          indications: [
            'Sufficient sound enamel for acid etching',
            'Post-orthodontic stabilization',
          ],
          contraindications: [
            'Base metal alloy sensitivity, thin translucent incisors',
            'Inadequate enamel (caries, attrition, existing restorations)',
          ],
          clinicalNote: 'Most conservative retainer with minimal preparation and no soft tissue irritation.',
        },
      ],
    },
    diagnosticPlanner: {
      id: 'lec05-planner',
      title: 'Abutment Taper & Reduction Planner',
      subtitle: 'Model how convergence angle, finish line location, and coverage affect retention & pulp health.',
      scenario: 'Determine mechanical retention efficiency and pulpal/periodontal safety for a prepared bridge abutment.',
      diagramType: 'margin-taper',
      variables: [
        {
          id: 'taper',
          label: 'Total Occlusal Convergence Angle',
          options: [
            { id: '5-6', label: '5°–6° Ideal Taper', scoreDelta: 100, note: 'Optimal retention without undercuts' },
            { id: '15', label: '15° Moderate Over-Taper', scoreDelta: 55, note: 'Markedly reduced retention (curve drops steeply)' },
            { id: '30', label: '30° Severe Over-Taper', scoreDelta: 25, note: 'High risk of crown dislodgement' },
          ],
        },
        {
          id: 'marginPos',
          label: 'Finish Line Placement Relative to Gingiva',
          options: [
            { id: 'supra', label: 'Supragingival (On Enamel)', scoreDelta: 100, note: 'Most conservative, visible, easily cleaned' },
            { id: 'equi', label: 'Equigingival', scoreDelta: 80, note: 'Moderate hygiene access' },
            { id: 'sub', label: 'Subgingival', scoreDelta: 65, note: 'Reserved for esthetics, extra retention, or cervical caries' },
          ],
        },
        {
          id: 'prepPrinciple',
          label: 'Occlusal Reduction Geometry',
          options: [
            { id: 'anatomic', label: 'Anatomic Two-Plane (1–1.5 mm)', scoreDelta: 100, note: 'Preserves pulp while ensuring rigidity' },
            { id: 'flat', label: 'Excessive Single-Plane Flat Reduction', scoreDelta: 40, note: 'Unnecessary tooth removal & pulp proximity' },
          ],
        },
      ],
    },
    visualComponents: [
      {
        id: 'v05-1',
        kind: 'metric-grid',
        title: '5 Principles of Tooth Preparation',
        subtitle: 'Foundational limits for every abutment retainer',
        items: [
          { title: '01. Tooth Structure', value: 'Preservation', note: 'Avoid unnecessary dentin removal', status: 'safe' },
          { title: '02. Retention & Resistance', value: '5–6° Taper', note: 'Opposing walls nearly parallel', status: 'safe' },
          { title: '03. Structural Durability', value: '1.0–1.5 mm', note: 'Prevents flexing or perforation', status: 'safe' },
          { title: '04. Periodontium & Margin', value: 'Supragingival', note: 'Smooth, continuous on sound tooth', status: 'safe' },
        ],
      },
      {
        id: 'v05-2',
        kind: 'hotspot-diagram',
        title: 'Post Crown Canal & Dimension Map',
        subtitle: 'Click landmarks for Lecture 5 post-crown rules',
        diagramKey: 'post-crown',
        hotspots: [
          {
            id: 'p1',
            x: 50,
            y: 25,
            label: 'Coronal Replacement & Ferrule',
            detail: 'Post crown replaces coronal portion completely and distributes forces to supporting tissue.',
          },
          {
            id: 'p2',
            x: 50,
            y: 52,
            label: 'Post Diameter (1/3 at CEJ)',
            detail: 'Post width equals 1/3 root diameter at CEJ and at least 2 mm less than root diameter at mid-root.',
          },
          {
            id: 'p3',
            x: 50,
            y: 78,
            label: 'Post Length (2/3 Root / 4–5 mm Apical Seal)',
            detail: '2/3 root length, ≥ clinical crown length, 8 mm deep from CEJ, preserving 4–5 mm gutta-percha apically.',
          },
        ],
      },
      {
        id: 'v05-3',
        kind: 'flowchart',
        title: 'Conservation & Cost Hierarchy',
        subtitle: 'Ascending tooth removal and financial cost order',
        steps: [
          { label: 'Conservation Order', detail: 'Inlays / Onlays > Partial Coverage > Complete Coverage' },
          { label: 'Full-Coverage Conservation', detail: 'Full Metal > PFM > All-Ceramic Crown' },
          { label: 'Cost Escalation', detail: 'Full Metal (lowest) < Partial/Complete < PFM < All-Ceramic / Zirconia' },
        ],
      },
      {
        id: 'v05-4',
        kind: 'comparison-table',
        title: 'Recommended Preparation Reductions',
        subtitle: 'Surface clearances from Lecture 5 reduction diagram',
        headers: ['Retainer Type', 'Facial / Buccal', 'Lingual', 'Occlusal / Incisal'],
        rows: [
          ['Full Metal Crown', '≥ 0.5 mm margin / 1 mm axial', '≥ 0.5–1.0 mm', '1.0–1.5 mm (non-func / func)'],
          ['Posterior PFM', '1.2–1.7 mm', '≥ 0.6 mm (metal) / 1.3–1.7 mm', '1.3–1.7 mm (porcelain)'],
          ['Anterior PFM', '1.2–1.5 mm', '0.5–1.0 mm', '≥ 1.5 mm incisal'],
          ['All-Ceramic Crown', '1.0 mm', '1.0 mm', '1.5 mm'],
        ],
      },
      {
        id: 'v05-5',
        kind: 'metric-grid',
        title: 'Multi-Rooted Post Canal Selection',
        subtitle: 'Largest, straightest canal per tooth type',
        items: [
          { title: 'Maxillary Molar', value: 'Palatal Canal', note: 'Largest & straightest root', status: 'safe' },
          { title: 'Mandibular Molar', value: 'Distal Canal', note: 'Widest canal for dowel', status: 'safe' },
          { title: 'Maxillary Premolar', value: 'Buccal Canal', note: 'Preferred over palatal/thin root', status: 'safe' },
        ],
      },
      {
        id: 'v05-6',
        kind: 'timeline',
        title: 'Taper vs. Retention Curve',
        subtitle: 'Retention (gm/mm²) falls nonlinearly with convergence angle',
        steps: [
          { label: '5°–6° Optimal', detail: 'Maximum practical retention (~95–100 gm/mm²) without seating undercuts', metric: 'Ideal' },
          { label: '15°–20° Moderate Taper', detail: 'Retention drops by nearly half (~40–50 gm/mm²)', metric: 'Guarded' },
          { label: '35°–45° Severe Over-Taper', detail: 'Retention falls below 20 gm/mm²; requires grooves/boxes', metric: 'Failure Risk' },
        ],
      },
      {
        id: 'v05-7',
        kind: 'checklist',
        title: '6 Factors Determining Required Retention',
        subtitle: 'Clinical multipliers of retainer stress',
        items: [
          { title: 'Length of Span & Rigidity', value: 'Longer = More Stress', status: 'warn' },
          { title: 'Type of Bridge', value: 'Fixed-Fixed > Fixed-Mobile', status: 'safe' },
          { title: 'Strength of Bite & Habits', value: 'Bruxism / Pipe Smoking', status: 'danger' },
          { title: 'Tooth Replaced & Coverage', value: 'Molar > Lower Incisor', status: 'warn' },
        ],
      },
      {
        id: 'v05-8',
        kind: 'comparison-table',
        title: 'Major vs. Minor Retainer Roles',
        subtitle: 'Fixed-fixed vs. fixed-mobile connections',
        headers: ['Feature', 'Major Retainer', 'Minor Retainer'],
        rows: [
          ['Bridge Type', 'Fixed-fixed, spring, cantilever, fixed-mobile', 'Fixed-mobile bridge only'],
          ['Occlusal Coverage', 'Must cover whole occluding surface', 'Does NOT require full occlusal coverage'],
          ['Connection', 'Rigid connection to pontic', 'Movable / flexible connector seated inside'],
          ['Example', 'Full crown on 2nd premolar', 'Class III inlay on distal of canine'],
        ],
      },
      {
        id: 'v05-9',
        kind: 'safety-alert',
        title: 'When Full Occlusal Coverage is Mandatory',
        subtitle: 'Preventing cusp fracture and cement lute failure',
        items: [
          {
            title: 'Fixed-Fixed Bridges',
            value: 'Always Indicated',
            note: 'Protects cusps from fracture in MOD restorations and endodontically treated teeth so cement lute does not fail.',
            status: 'warn',
          },
        ],
      },
      {
        id: 'v05-10',
        kind: 'checklist',
        title: 'Intracoronal Retainer Limits (Inlay / Onlay)',
        subtitle: 'Contraindications in high-risk mouths',
        items: [
          { title: 'High Caries Index / Poor Hygiene', value: 'Contraindicated', status: 'danger' },
          { title: 'Short Crown / Extruded / Bruxism', value: 'Contraindicated for Onlay', status: 'danger' },
          { title: 'Pinledge Indication', value: 'Undamaged Anterior', note: 'High esthetics when proximal grooves impossible', status: 'safe' },
        ],
      },
    ],
    quiz: [
      {
        id: 'q05-1',
        type: 'model-3d',
        prompt: 'What total convergence angle between opposing axial walls provides optimal crown retention without undercuts?',
        visualHint: 'Check the 3D Taper slider in the Preparation Sandbox.',
        options: [
          { id: 'a', text: '0° (strictly parallel)', explanation: '0° walls risk undercuts and incomplete hydraulic seating of cement.' },
          { id: 'b', text: '5°–6°', explanation: 'Correct: 5–6° convergence balances maximum retention with clean seating.' },
          { id: 'c', text: '20°–25°', explanation: '20–25° causes severe loss of retention and resistance form.' },
          { id: 'd', text: '45°', explanation: '45° offers virtually no mechanical retention.' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q05-2',
        type: 'clinical-mcq',
        prompt: 'For a multi-rooted mandibular molar requiring a post crown retainer, in which root canal should the post be placed?',
        options: [
          { id: 'a', text: 'Mesiobuccal canal', explanation: 'Mesial canals in mandibular molars are narrower and curved.' },
          { id: 'b', text: 'Mesiolingual canal', explanation: 'Mesiolingual canals are thin and prone to strip perforation.' },
          { id: 'c', text: 'Distal canal', explanation: 'Correct: the distal canal is the largest canal in mandibular molars.' },
          { id: 'd', text: 'Palatal canal', explanation: 'The palatal canal applies to maxillary molars.' },
        ],
        correctOptionId: 'c',
      },
      {
        id: 'q05-3',
        type: 'visual-id',
        prompt: 'Which conservation hierarchy accurately ranks restoration types from MOST conservative to LEAST conservative of tooth structure?',
        options: [
          { id: 'a', text: 'All-ceramic > PFM > Full metal > Partial coverage', explanation: 'All-ceramic and PFM require greater facial reduction than full metal or partial coverage.' },
          { id: 'b', text: 'Inlays/Onlays > Partial coverage > Complete coverage', explanation: 'Correct: intracoronal inlays/onlays conserve more tooth structure than partial, which conserves more than complete coverage.' },
          { id: 'c', text: 'PFM > Full metal > Onlays', explanation: 'PFM removes more tooth structure than both full metal and onlays.' },
          { id: 'd', text: 'Complete coverage > Inlays > Partial coverage', explanation: 'Complete coverage removes the most axial tooth structure.' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q05-4',
        type: 'clinical-mcq',
        prompt: 'What minimum apical root canal filling must remain untouched when preparing a post space?',
        options: [
          { id: 'a', text: '1–2 mm from apex', explanation: '1–2 mm risks compromising the apical seal.' },
          { id: 'b', text: '4–5 mm from apex', explanation: 'Correct: leave 4–5 mm of well-condensed apical gutta-percha (with post length ~2/3 root or ≥8 mm from CEJ).' },
          { id: 'c', text: '10 mm from apex', explanation: 'Leaving 10 mm leaves insufficient post length for retention.' },
          { id: 'd', text: '0 mm (to apex)', explanation: 'Removing all gutta-percha destroys the apical seal.' },
        ],
        correctOptionId: 'b',
      },
    ],
    referencesAndLimitations: {
      sources: [
        'Dr. Lamis A. Al-Taee — Crown & Bridge Prosthodontics Lecture 5: Components of Bridge: Bridge Retainers (Lect_5_4a645c29.pdf).',
      ],
      clinicalReviewFlags: [
        'Preparation depth values represent textbook/lecture guidelines; actual bur reduction must be verified against pulpal anatomy and manufacturer material minimums.',
      ],
    },
  },
  {
    id: 'lec-06',
    numberLabel: 'Lecture 06',
    shortTitle: 'Pontics & Connectors',
    title: 'Components of Bridge: Pontic Design, Ridge Assessment & Connectors',
    lecturer: 'Dr. Lamis A. Al-Taee',
    sourcePdf: 'Lect_6_pontic_7e6e6710.pdf',
    summary:
      'Master aesthetic, biologic, and mechanical pontic requirements, all pontic cross-sectional geometries (from contraindicated Saddle to Modified Ovate & Archway), Siebert ridge defects, alveolar preservation, and connector principles.',
    objectives: [
      {
        id: 'lec06-obj-1',
        text: 'Evaluate pontic designs (Saddle, Modified Ridge Lap, Conical, Ovate, Modified Ovate, Hygienic/Archway) for esthetics and cleansability.',
        bloomLevel: 'Evaluate',
      },
      {
        id: 'lec06-obj-2',
        text: 'Classify residual ridge deformities using Siebert Class I, II, and III and select preservation techniques (2.5 mm ovate provisional / Alvelac PLGA scaffold).',
        bloomLevel: 'Apply',
      },
      {
        id: 'lec06-obj-3',
        text: 'Design rigid (cast, soldered, welded, loop) and non-rigid connectors obeying size, curved shape, and lingual/occlusal-third position rules.',
        bloomLevel: 'Analyze',
      },
    ],
    threeD: {
      title: '3D Pontic Cross-Section, Tissue Contact & Ridge Defect Sandbox',
      subtitle: 'Emergence Profile, Floss Access & Connector Geometry Viewer',
      educationalNote:
        '3D cross-sectional geometry illustrates mucosal contact vs. cleansability; clinical tissue adaptation requires passive saliva-film contact without blanching.',
      defaultCamera: [3.4, 2.0, 4.2],
      defaultTarget: [0, 0.7, 0],
      primaryModes: [
        { id: 'modified-ridge-lap', label: 'Modified Ridge Lap' },
        { id: 'ovate', label: 'Ovate' },
        { id: 'modified-ovate', label: 'Modified Ovate' },
        { id: 'conical', label: 'Conical (Bullet)' },
        { id: 'hygienic', label: 'Hygienic / Archway' },
        { id: 'saddle', label: 'Saddle (Avoid)' },
      ],
      secondaryModes: [
        { id: 'normal-ridge', label: 'Normal Ridge' },
        { id: 'siebert-1', label: 'Siebert Class I' },
        { id: 'siebert-2', label: 'Siebert Class II' },
        { id: 'siebert-3', label: 'Siebert Class III' },
      ],
      sliderLabel: 'Occlusal Table Width',
      sliderUnit: '%',
      sliderMin: 70,
      sliderMax: 100,
      sliderStep: 5,
      sliderDefault: 80,
      toggleLabel: 'Show Pink Gingival Porcelain',
      structureLayers: [
        { id: 'pontic', label: 'Pontic & Connectors' },
        { id: 'abutments', label: 'Adjacent Retainers' },
        { id: 'ridge', label: 'Residual Ridge Mucosa' },
        { id: 'floss', label: 'Floss & Embrasure Path' },
      ],
      guidedTour: [
        {
          id: 'tour-06-1',
          title: 'Convex Passive Tissue Contact',
          description:
            'A convex glazed porcelain tissue surface avoids food trapping and ulceration while allowing superfloss passage beneath the pontic.',
          cameraPosition: [3.2, 1.2, 3.0],
          cameraTarget: [0, 0.5, 0],
          highlightPart: 'pontic',
        },
        {
          id: 'tour-06-2',
          title: 'Modified Ovate vs. Saddle',
          description:
            'Modified Ovate shifts the contour height 1–1.5 mm apical & palatal to the gingival margin for esthetics without surgery; Saddle wraps both ridge sides and must NEVER be used.',
          cameraPosition: [3.8, 1.8, 2.2],
          cameraTarget: [0, 0.6, 0],
          highlightPart: 'ridge',
        },
        {
          id: 'tour-06-3',
          title: 'Connector Position & Wide Embrasures',
          description:
            'Connectors are placed lingually in anterior teeth and in the occlusal-third/lingually in posterior teeth with wide mesial, distal, and lingual embrasures.',
          cameraPosition: [0, 3.2, 4.4],
          cameraTarget: [0, 0.9, 0],
          highlightPart: 'floss',
        },
      ],
      accessibleSummary:
        'Interactive 3D pontic and residual ridge cross-section simulator comparing Modified Ridge Lap, Ovate, Modified Ovate, Conical, Hygienic/Archway, and contraindicated Saddle designs against normal and Siebert Class I–III ridges.',
    },
    procedureFlow: {
      id: 'lec06-flow',
      title: 'Immediate Alveolar Architecture Preservation at Extraction',
      clinicalContext: 'Order the steps to preserve pre-extraction gingival papillae and socket contour using an immediate ovate provisional FPD.',
      steps: [
        {
          id: 'p1',
          title: 'Prepare Abutment Teeth Prior to Extraction',
          detail: 'Complete abutment preparations and fabricate an indirect provisional FPD before removing the hopeless tooth.',
          hint: 'Pre-extraction preparation ensures immediate delivery upon tooth removal.',
        },
        {
          id: 'p2',
          title: 'Perform Atraumatic Tooth Extraction',
          detail: 'Preserve facial and interproximal alveolar bone walls without flap reflection or wall fracture.',
          hint: 'Soft tissues collapse immediately after extraction unless supported.',
        },
        {
          id: 'p3',
          title: 'Shape Ovate Provisional Pontic 2.5 mm Apical to Facial Free Gingival Margin',
          detail: 'According to Spear, extend the ovate tissue side ~2.5 mm apical to the facial FGM and within 1 mm of interproximal/facial bone.',
          hint: 'The provisional acts as a healing template for the papillae.',
        },
        {
          id: 'p4',
          title: 'Seat Provisional FPD & Confirm Mild Tissue Support (Blanching)',
          detail: 'Immediate seating supports papillae and facial/palatal gingiva as the clot organizes.',
          hint: 'Passive template support prevents soft tissue collapse.',
        },
        {
          id: 'p5',
          title: 'Optional: Condition Socket with Alvelac (PLGA/PVA) Scaffold',
          detail: 'Place porous osteoconductive scaffold flush with socket crest (resorbs in 2–6 months) to maintain height & width.',
          hint: 'Scaffold leaves space for blood fill and natural bone formation.',
        },
      ],
    },
    clinicalCase: {
      id: 'lec06-case',
      title: 'Case Decision: Anterior High Smile Line vs. Posterior Mandibular Molar',
      patientProfile: {
        ageSex: '32-year-old female',
        chiefComplaint: 'Missing maxillary central incisor (#11) with high lip line exposing gingival band.',
        history: 'Tooth extracted 6 months ago; residual ridge shows horizontal faciolingual collapse with normal vertical height.',
        toothCondition: 'Adjacent #21 and #12 are vital with intact roots; good oral hygiene.',
        radiographicFinding: 'No periapical pathology; preserved vertical crest height.',
        occlusalFactor: 'Normal anterior guidance; no parafunction.',
      },
      stages: [
        {
          id: 'c6-1',
          prompt: 'How do you classify this residual ridge defect according to Siebert?',
          options: [
            {
              id: 's-1',
              label: 'Siebert Class I Defect',
              isRecommended: true,
              outcomeTitle: 'Correct Classification: Faciolingual Width Loss',
              outcomeStatus: 'optimal',
              rationale: 'Class I represents faciolingual loss of tissue width with normal vertical ridge height.',
              biomechanicalEffect: 'Standard ovate pontic would lack horizontal ridge thickness unless augmented or modified.',
            },
            {
              id: 's-2',
              label: 'Siebert Class II Defect',
              isRecommended: false,
              outcomeTitle: 'Incorrect: Class II is Vertical Height Loss',
              outcomeStatus: 'caution',
              rationale: 'Class II involves loss of ridge height with normal ridge width.',
              biomechanicalEffect: 'Would misguide surgical augmentation planning.',
            },
            {
              id: 's-3',
              label: 'Siebert Class III Defect',
              isRecommended: false,
              outcomeTitle: 'Incorrect: Class III is Combined Loss',
              outcomeStatus: 'caution',
              rationale: 'Class III involves combined loss in both faciolingual width and vertical height.',
              biomechanicalEffect: 'Overstates defect severity.',
            },
          ],
        },
        {
          id: 'c6-2',
          prompt: 'The patient declines ridge augmentation surgery. Which pontic design best delivers esthetics and cleansability in this limited horizontal width?',
          options: [
            {
              id: 'p-saddle',
              label: 'Ridge-Lap (Saddle) Pontic',
              isRecommended: false,
              outcomeTitle: 'Biologically Unacceptable — Never Use',
              outcomeStatus: 'contraindicated',
              rationale: 'Concave tissue surface overlaps both sides of the ridge, trapping plaque and impossible to floss.',
              biomechanicalEffect: 'Severe mucosal inflammation and ulceration.',
            },
            {
              id: 'p-mod-ovate',
              label: 'Modified Ovate Pontic',
              isRecommended: true,
              outcomeTitle: 'Ideal Emergence Without Surgical Augmentation',
              outcomeStatus: 'optimal',
              rationale:
                'Moves height of contour 1–1.5 mm apical & palatal to the gingival margin, requiring less faciolingual width and improving cleansability over standard ovate.',
              biomechanicalEffect: 'Natural emergence profile + superior superfloss access.',
            },
            {
              id: 'p-hygienic',
              label: 'Hygienic (Sanitary) All-Metal Pontic',
              isRecommended: false,
              outcomeTitle: 'Unacceptable Anterior Esthetics',
              outcomeStatus: 'contraindicated',
              rationale: 'Hygienic pontics have a 3 mm gingival gap and are strictly for non-appearance posterior mandibular zones.',
              biomechanicalEffect: 'Air escape affects phonetics and destroys high smile line esthetics.',
            },
          ],
        },
      ],
      educationalDisclaimer:
        'Case modeled from Lecture 6 clinical tables; surgical vs. restorative choices require clinical ridge mapping.',
    },
    materialComparison: {
      id: 'lec06-compare',
      title: 'Pontic Design Comparative Matrix',
      subtitle: 'Compare mucosal contact geometry, esthetics, cleansability, and clinical indications.',
      items: [
        {
          id: 'saddle',
          name: 'Ridge-Lap (Saddle)',
          category: 'Concave Overlap (Avoid)',
          metrics: [
            { label: 'Esthetics', value: 90, max: 100, unit: '%' },
            { label: 'Cleansability', value: 5, max: 100, unit: '%' },
            { label: 'Biologic Safety', value: 5, max: 100, unit: '%' },
          ],
          indications: ['NOT RECOMMENDED — SHOULD NEVER BE USED'],
          contraindications: ['All clinical cases due to concave plaque-trapping undersurface'],
          clinicalNote: 'Concave buccolingual surface prevents floss contact with mucosa.',
        },
        {
          id: 'mod-ridge-lap',
          name: 'Modified Ridge-Lap',
          category: 'Convex Lingual / Facial Contact',
          metrics: [
            { label: 'Esthetics', value: 85, max: 100, unit: '%' },
            { label: 'Cleansability', value: 78, max: 100, unit: '%' },
            { label: 'Biologic Safety', value: 82, max: 100, unit: '%' },
          ],
          indications: [
            'Most maxillary and mandibular teeth in the appearance zone',
            '2B variant contacts most facial surface only for easiest cleaning',
          ],
          contraindications: ['Severe ridge defects requiring pink porcelain or surgery'],
          clinicalNote: 'Combines saddle-like facial illusion with convex lingual cleansability.',
        },
        {
          id: 'conical',
          name: 'Conical (Bullet / Spheroid)',
          category: 'One-Point Convex Contact',
          metrics: [
            { label: 'Esthetics', value: 40, max: 100, unit: '%' },
            { label: 'Cleansability', value: 95, max: 100, unit: '%' },
            { label: 'Biologic Safety', value: 92, max: 100, unit: '%' },
          ],
          indications: [
            'Posterior teeth where esthetics is minimal concern',
            'Knife-edge thin residual ridges',
          ],
          contraindications: [
            'Broad flat ridges (creates debris-trapping triangular embrasures)',
            'Poor oral hygiene',
          ],
          clinicalNote: 'One-point convex contact makes it the easiest tissue-contacting pontic to clean.',
        },
        {
          id: 'ovate',
          name: 'Ovate & Modified Ovate',
          category: 'Emergence Profile',
          metrics: [
            { label: 'Esthetics', value: 98, max: 100, unit: '%' },
            { label: 'Cleansability', value: 72, max: 100, unit: '%' },
            { label: 'Biologic Safety', value: 80, max: 100, unit: '%' },
          ],
          indications: [
            'High smile line maxillary incisors, canines, and premolars',
            'Modified Ovate when horizontal ridge width is insufficient for conventional ovate',
          ],
          contraindications: ['Patient unwilling to undergo surgical site prep (standard ovate)'],
          clinicalNote: 'Modified Ovate places contour height 1–1.5 mm apical & palatal to gingival margin.',
        },
        {
          id: 'hygienic',
          name: 'Hygienic / Archway',
          category: 'No Mucosal Contact',
          metrics: [
            { label: 'Esthetics', value: 10, max: 100, unit: '%' },
            { label: 'Cleansability', value: 100, max: 100, unit: '%' },
            { label: 'Connector Strength', value: 95, max: 100, unit: '%' },
          ],
          indications: [
            'Non-appearance mandibular posterior region',
            'Archway (Modified Sanitary) when OG height is limited',
          ],
          contraindications: ['Any esthetic zone', 'Patients intolerant of tongue-palpable space'],
          clinicalNote: 'Standard Hygienic needs 3 mm gingival space & 3 mm thickness; Archway adds connector bulk.',
        },
      ],
    },
    diagnosticPlanner: {
      id: 'lec06-planner',
      title: 'Pontic & Connector Prescription Builder',
      subtitle: 'Match smile line, ridge condition, and occlusal width to an ideal pontic-connector prescription.',
      scenario: 'Evaluate tissue health, torque reduction, and connector geometry for a fixed partial denture.',
      diagramType: 'pontic-ridge',
      variables: [
        {
          id: 'smileLine',
          label: 'Smile Line Exposure',
          options: [
            { id: 'high', label: 'High Smile (100% + Gingiva)', scoreDelta: 95, note: 'Demands Ovate / Modified Ovate + pink porcelain if bone lost' },
            { id: 'avg', label: 'Average Smile (75–100%)', scoreDelta: 85, note: 'Modified Ridge-Lap or Modified Ovate' },
            { id: 'low', label: 'Posterior Non-Esthetic', scoreDelta: 90, note: 'Conical, Hygienic, or Archway' },
          ],
        },
        {
          id: 'tissueSurface',
          label: 'Tissue-Contacting Material & Pressure',
          options: [
            { id: 'glazed-passive', label: 'Convex Glazed Porcelain (Passive Contact)', scoreDelta: 100, note: 'Saliva-film passive contact prevents ulceration' },
            { id: 'acrylic-pressure', label: 'Resin / Pressure Contact', scoreDelta: 20, note: 'Porous acrylic irritates mucosa; pressure causes ulceration' },
          ],
        },
        {
          id: 'occlusalWidth',
          label: 'Pontic Occlusal Table & Connector Position',
          options: [
            { id: 'reduced-20', label: '20% Narrowed Occlusal + Lingual/Occlusal-3rd Connector', scoreDelta: 100, note: 'Reduces abutment torque and opens cleanable embrasures' },
            { id: 'wide-buccal', label: 'Full Width + Gingival Connector', scoreDelta: 35, note: 'Increases torque and blocks gingival embrasure hygiene' },
          ],
        },
      ],
    },
    visualComponents: [
      {
        id: 'v06-1',
        kind: 'metric-grid',
        title: 'Smile Line Classification',
        subtitle: 'Determines appearance zone for maxillary pontics',
        items: [
          { title: 'Low Smile (Small)', value: '< 75%', note: 'Displays less than 75% of maxillary anterior crowns', status: 'safe' },
          { title: 'Average Smile (Optimal)', value: '75–100%', note: 'Upper lip reaches gingival margin + interproximal papillae', status: 'safe' },
          { title: 'High Smile', value: '100% + Gingiva', note: 'Exposes contiguous band of gingival tissue', status: 'warn' },
        ],
      },
      {
        id: 'v06-2',
        kind: 'hotspot-diagram',
        title: 'Siebert Residual Ridge Defect Map',
        subtitle: 'Inspect Class I, II, and III defect dimensions',
        diagramKey: 'siebert-ridge',
        hotspots: [
          { id: 'sb1', x: 20, y: 50, label: 'Siebert Class I', detail: 'Faciolingual loss of tissue width with normal vertical height.' },
          { id: 'sb2', x: 50, y: 50, label: 'Siebert Class II', detail: 'Loss of vertical ridge height with normal faciolingual width.' },
          { id: 'sb3', x: 80, y: 50, label: 'Siebert Class III', detail: 'Combined loss in both faciolingual width and vertical height.' },
        ],
      },
      {
        id: 'v06-3',
        kind: 'checklist',
        title: '4 Primary Functions of a Pontic',
        subtitle: 'Beyond esthetics alone',
        items: [
          { title: 'Mastication', value: 'Restores Chewing', status: 'safe' },
          { title: 'Phonetics (Speech)', value: 'Restricts Air Escape', note: 'Re-establishes normal anterior sounds', status: 'safe' },
          { title: 'Esthetics', value: 'Lip & Cheek Support', status: 'safe' },
          { title: 'Arch Integrity', value: 'Prevents Drifting', note: 'Stops tilting and opposing supra-eruption', status: 'safe' },
        ],
      },
      {
        id: 'v06-4',
        kind: 'safety-alert',
        title: 'Biologic Tissue Contact Rules',
        subtitle: 'Preventing ulceration and plaque accumulation',
        items: [
          { title: 'Passive Contact', value: 'Saliva Film Thickness', note: 'Pressure-free contact on convex glazed porcelain or polished gold.', status: 'safe' },
          { title: 'Resin Near Tissue', value: 'Contraindicated', note: 'Porous resins cannot be highly polished and irritate soft tissue.', status: 'danger' },
          { title: 'Saddle Pontic', value: 'Never Use', note: 'Overlaps ridge buccolingually; impossible to clean.', status: 'danger' },
        ],
      },
      {
        id: 'v06-5',
        kind: 'metric-grid',
        title: 'Connector Design Principles',
        subtitle: 'Size, Shape, and Anatomical Position',
        items: [
          { title: 'Anterior Position', value: 'Lingually', note: 'Preserves facial embrasure esthetics', status: 'safe' },
          { title: 'Posterior Position', value: 'Occlusal 3rd & Lingual', note: 'Maximizes gingival hygiene embrasure', status: 'safe' },
          { title: 'Tissue Surface', value: 'Curved & Polished', note: 'Curved faciolingually for floss passage', status: 'safe' },
          { title: 'Occlusal Narrowing', value: '-20% Width', note: 'Reduces torque on retainers & abutments', status: 'safe' },
        ],
      },
      {
        id: 'v06-6',
        kind: 'comparison-table',
        title: 'Rigid Connector Fabrication Methods',
        subtitle: '4 metal connector techniques from Lecture 6',
        headers: ['Type', 'Fabrication', 'Key Advantage / Indication'],
        rows: [
          ['Cast Connector', 'Multi-unit bridge cast in single piece', 'Stronger than soldered; easy anatomical carving'],
          ['Soldered Connector', 'Separate castings joined by lower-melting alloy', 'Compensates for long-span casting distortion'],
          ['Welded Connector', 'Melting adjacent surfaces via heat/pressure', 'Direct metal fusion without intermediate solder'],
          ['Loop Connector', 'Curved palatal/lingual bar loop', 'Maintains an existing diastema in fixed prosthesis'],
        ],
      },
      {
        id: 'v06-7',
        kind: 'timeline',
        title: 'Alvelac Socket Conditioning Timeline',
        subtitle: 'PLGA + Polyvinyl Alcohol osteoconductive scaffold',
        steps: [
          { label: 'Extraction Placement', detail: 'Rigid porous scaffold placed flush with socket crest to raise blood clot' },
          { label: 'Width & Height Maintenance', detail: 'Prevents buccal/lingual wall collapse while allowing blood fill' },
          { label: '2–6 Months Resorption', detail: 'Gradually resorbs as patient’s own bone fills the preserved socket', metric: '2–6 mo' },
        ],
      },
      {
        id: 'v06-8',
        kind: 'flowchart',
        title: 'Pre-Existing Ridge Modification Options',
        subtitle: 'Surgical correction before definitive FPD',
        steps: [
          { label: 'Ridge Reduction', detail: 'For excessive/irregular soft tissue causing inadequate pontic space or poor cleansability' },
          { label: 'Ridge Augmentation', detail: 'Fibrous, osseous, or synthetic grafts to treat bone resorption & avoid overly long pontics' },
          { label: 'Pink Porcelain Camouflage', detail: 'Added apically when excessive bone loss cannot be surgically corrected' },
        ],
      },
      {
        id: 'v06-9',
        kind: 'metric-grid',
        title: 'Hygienic vs. Modified Hygienic Dimensions',
        subtitle: 'Non-contact mandibular posterior metrics',
        items: [
          { title: 'Hygienic Clearance', value: '3 mm Space', note: '3 mm pontic thickness + 3 mm gingival clearance', status: 'safe' },
          { title: 'Archway Geometry', value: 'Arch-Shaped', note: 'Adds bulk at connectors to reduce stress in limited OG height', status: 'safe' },
        ],
      },
      {
        id: 'v06-10',
        kind: 'checklist',
        title: 'Pretreatment Pontic Space Assessment',
        subtitle: '3 mandatory diagnostic checks',
        items: [
          { title: '1. Mesiodistal Space', value: 'Check Drifting', note: 'Overly small pontics trap food; ortho uprighting if reduced', status: 'warn' },
          { title: '2. Residual Ridge Contour', value: 'Avoid Black Triangles', note: 'Prevents saliva percolation and food entrapment', status: 'safe' },
          { title: '3. Occlusion', value: 'Balanced Contacts', note: 'Prevent premature eccentric interference on pontic', status: 'safe' },
        ],
      },
    ],
    quiz: [
      {
        id: 'q06-1',
        type: 'visual-id',
        prompt: 'A patient presents with loss of vertical ridge height but normal faciolingual width in the edentulous area. Which Siebert classification is this?',
        options: [
          { id: 'a', text: 'Siebert Class I', explanation: 'Class I is loss of faciolingual width with normal height.' },
          { id: 'b', text: 'Siebert Class II', explanation: 'Correct: Class II is loss of vertical ridge height with normal ridge width.' },
          { id: 'c', text: 'Siebert Class III', explanation: 'Class III is combined loss of both width and height.' },
          { id: 'd', text: 'Siebert Class IV', explanation: 'Siebert classification comprises Classes I, II, and III.' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q06-2',
        type: 'model-3d',
        prompt: 'In the 3D Pontic Simulator, which connector is specifically indicated when an existing maxillary midline diastema must be preserved?',
        options: [
          { id: 'a', text: 'Cast rigid embrasure connector', explanation: 'A standard cast connector closes the interproximal space.' },
          { id: 'b', text: 'Loop connector', explanation: 'Correct: a palatal/lingual loop connector maintains an existing diastema.' },
          { id: 'c', text: 'Saddle ridge-lap', explanation: 'Saddle is a pontic design that should never be used.' },
          { id: 'd', text: 'Archway sanitary connector', explanation: 'Archway is a posterior mandibular hygienic pontic shape.' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q06-3',
        type: 'clinical-mcq',
        prompt: 'According to Spear’s alveolar architecture preservation technique, how far apical to the facial free gingival margin should the immediate ovate provisional pontic extend?',
        options: [
          { id: 'a', text: '0.5 mm', explanation: '0.5 mm is insufficient to support the collapsing extraction socket walls.' },
          { id: 'b', text: '2.5 mm', explanation: 'Correct: ~2.5 mm apical to the facial free gingival margin (and within 1 mm of bone contour).' },
          { id: 'c', text: '6.0 mm', explanation: '6.0 mm would impinge directly on bone and biologic healing.' },
          { id: 'd', text: 'Flush with occlusal plane', explanation: 'Subgingival ovate shaping is needed to support papillae.' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q06-4',
        type: 'clinical-mcq',
        prompt: 'What is the main advantage of a Modified Ovate pontic over a conventional Ovate pontic?',
        options: [
          { id: 'a', text: 'It eliminates all tissue contact by 3 mm', explanation: 'That describes a hygienic/sanitary pontic.' },
          { id: 'b', text: 'Little or no need for surgical ridge augmentation and easier cleaning', explanation: 'Correct: shifting contour height 1–1.5 mm apical/palatal reduces faciolingual thickness demand.' },
          { id: 'c', text: 'It is made entirely of porous acrylic resin', explanation: 'Resin is contraindicated near soft tissue.' },
          { id: 'd', text: 'It wraps both buccal and lingual ridge surfaces', explanation: 'That describes a contraindicated saddle pontic.' },
        ],
        correctOptionId: 'b',
      },
    ],
    referencesAndLimitations: {
      sources: [
        'Dr. Lamis A. Al-Taee — Crown & Bridge Prosthodontics Lecture 6: Components of Bridge: Pontic & Connectors (Lect_6_pontic_7e6e6710.pdf).',
      ],
      clinicalReviewFlags: [
        'Alvelac scaffold resorption timeframe (2–6 months) and Spear 2.5 mm ovate provisional depth reflect supplied lecture notes; surgical protocols require clinical verification.',
      ],
    },
  },
  {
    id: 'lec-07a',
    numberLabel: 'Lecture 07A',
    shortTitle: 'Tissue Management',
    title: 'Fluid Control & Soft Tissue Management (Gingival Retraction)',
    lecturer: 'Asst. Prof. Dr. Manhal Abdul-Rahman',
    sourcePdf: 'Lecture_7__Tissue_Management__-_manhal.abdulrahman_a3308e24.pdf',
    summary:
      'Control oral moisture mechanically and chemically, respect the 2.04 mm Biological Width (3 mm margin-to-bone rule), and master single/double knitted cord packing, cordless hemostatic pastes, and surgical soft-tissue techniques.',
    objectives: [
      {
        id: 'lec07a-obj-1',
        text: 'Select mechanical and pharmacologic moisture control methods while recognizing contraindications for anticholinergics and electrosurgery.',
        bloomLevel: 'Evaluate',
      },
      {
        id: 'lec07a-obj-2',
        text: 'Calculate Biological Width dimensions (0.97 mm JE + 1.07 mm CT = 2.04 mm) to prevent finish-line impingement.',
        bloomLevel: 'Apply',
      },
      {
        id: 'lec07a-obj-3',
        text: 'Execute single-cord, double-cord (#000/#0 primary + #1 secondary), cordless paste (Expasyl / Magic Foam), and rotary curettage protocols safely.',
        bloomLevel: 'Apply',
      },
    ],
    threeD: {
      title: '3D Biological Width & Gingival Sulcus Retraction Sandbox',
      subtitle: 'Single/Double Cord Packing, Cordless Foam & Periodontal Clearance',
      educationalNote:
        'Cross-sectional anatomical model based on Gargiulo mean dimensions (0.97 mm JE, 1.07 mm CT, 0.69 mm sulcus); clinical probing depth varies by patient.',
      defaultCamera: [2.8, 1.8, 3.8],
      defaultTarget: [0, 0.9, 0],
      primaryModes: [
        { id: 'baseline', label: 'Unretracted Sulcus' },
        { id: 'single-cord', label: 'Single Cord (10 min)' },
        { id: 'double-cord', label: 'Double Cord (#0 + #1)' },
        { id: 'cordless-paste', label: 'Cordless Foam (4x)' },
      ],
      secondaryModes: [
        { id: 'knitted', label: 'Knitted Ultrapak' },
        { id: 'braided', label: 'Braided / Twisted' },
      ],
      sliderLabel: 'Subgingival Margin Depth',
      sliderUnit: 'mm',
      sliderMin: 0,
      sliderMax: 2.0,
      sliderStep: 0.25,
      sliderDefault: 0.5,
      toggleLabel: 'Simulate Secondary Cord Removal',
      structureLayers: [
        { id: 'tooth', label: 'Prepared Tooth & Margin' },
        { id: 'gingiva', label: 'Free Gingiva & JE' },
        { id: 'bone', label: 'Alveolar Bone & CT' },
        { id: 'cords', label: 'Retraction Cords / Paste' },
      ],
      guidedTour: [
        {
          id: 'tour-07a-1',
          title: 'Biological Width Barrier (2.04 mm)',
          description:
            'Junctional epithelium (0.97 mm) + supracrestal connective tissue (1.07 mm) = 2.04 mm. Maintain ≥ 3.0 mm from finish line to alveolar bone crest.',
          cameraPosition: [2.5, 1.4, 3.2],
          cameraTarget: [0, 0.85, 0],
          highlightPart: 'bone',
        },
        {
          id: 'tour-07a-2',
          title: 'Double-Cord Technique',
          description:
            'Thin #000/#0 primary cord stays at the sulcus base to control seepage (leaving 1 mm intact tooth below margin), while thicker #1 cord is removed just before impression.',
          cameraPosition: [2.0, 1.6, 2.8],
          cameraTarget: [0, 1.05, 0],
          highlightPart: 'cords',
        },
        {
          id: 'tour-07a-3',
          title: 'Lateral & Vertical Impression Ingress',
          description:
            'Proper displacement exposes the finish line laterally and vertically so elastomer flows cleanly without tearing.',
          cameraPosition: [2.6, 2.4, 2.8],
          cameraTarget: [0, 1.1, 0],
          highlightPart: 'tooth',
        },
      ],
      accessibleSummary:
        '3D periodontal cross-section showing prepared tooth margin, gingival sulcus, junctional epithelium (0.97 mm), connective tissue attachment (1.07 mm), alveolar crest, and dynamic lateral/vertical displacement using single cord, double cord, or cordless expanding paste.',
    },
    procedureFlow: {
      id: 'lec07a-flow',
      title: 'Chemo-Mechanical Cord Retraction Protocol',
      clinicalContext: 'Arrange the clinical steps for atraumatic chemo-mechanical gingival retraction prior to final impression.',
      steps: [
        {
          id: 't1',
          title: 'Isolate Prepared Tooth & Dry Gently (Do Not Desiccate)',
          detail: 'Place cotton rolls and saliva evacuator; avoid excessive air desiccation to prevent postoperative sensitivity.',
          hint: 'Excessive drying damages odontoblastic processes.',
        },
        {
          id: 't2',
          title: 'Cut Cord Length to Encircle Tooth & Soak in Hemostatic Agent',
          detail: 'Dip plain cord in AlCl3 (5–10%) or Al2(SO4)3 and blot excess with gauze; NEVER pack a dry cord.',
          hint: 'Dry cord adheres to sulcular epithelium and tears it upon removal.',
        },
        {
          id: 't3',
          title: 'Begin Packing Interproximally Using Fischer or Ash No. 6 Packer',
          detail: 'Start interproximally where sulcular depth is greatest; angle instrument slightly toward tooth and previously packed cord.',
          hint: 'Angling toward tooth prevents cord rebound and attachment tearing.',
        },
        {
          id: 't4',
          title: 'Leave Cord in Dry Sulcus for 10 Minutes',
          detail: 'Combined mechanical pressure and transient chemical ischemia shrink tissue and arrest sulcular fluid seepage.',
          hint: 'Keep field dry during the 10-minute displacement window.',
        },
        {
          id: 't5',
          title: 'Moisten Cord Slightly Before Gentle Removal & Inject Light Body',
          detail: 'Apply water between dental forceps tips so dry epithelium does not tear during removal, then immediately syringe impression material.',
          hint: 'Moistening in situ protects fragile sulcular epithelium.',
        },
      ],
    },
    clinicalCase: {
      id: 'lec07a-case',
      title: 'Case Decision: Medically Complex Patient Requiring Subgingival Retraction',
      patientProfile: {
        ageSex: '64-year-old male',
        chiefComplaint: 'Subgingival chamfer margins on 3 posterior crowns (#45, #46, #47) with profuse saliva and mild gingival bleeding.',
        history: 'Diagnosed with narrow-angle glaucoma and wears an implanted cardiac pacemaker.',
        toothCondition: 'Multiple prepared teeth with 0.5 mm subgingival margins; 3.5 mm bone-to-margin clearance.',
        radiographicFinding: 'Intact alveolar bone crest; no furcation involvement.',
        occlusalFactor: 'Mandibular arch saliva pools rapidly around lingual margins.',
      },
      stages: [
        {
          id: 'c7a-1',
          prompt: 'Which moisture control medication is SAFE vs. CONTRAINDICATED for this patient?',
          options: [
            {
              id: 'med-atropine',
              label: 'Prescribe Atropine 0.4 mg or Propantheline 15 mg',
              isRecommended: false,
              outcomeTitle: 'DANGEROUS: Contraindicated in Glaucoma & Cardiac Disease',
              outcomeStatus: 'contraindicated',
              rationale:
                'Anticholinergics are contraindicated in glaucoma (risk of permanent blindness) and heart disease, and require caution in older adults.',
              biomechanicalEffect: 'Severe systemic ocular/cardiac adverse event.',
            },
            {
              id: 'med-mech',
              label: 'Mechanical Isolation (Svedopter/Cotton Rolls + LA) or Caution with Clonidine 0.2 mg',
              isRecommended: true,
              outcomeTitle: 'Safe Moisture Control Strategy',
              outcomeStatus: 'optimal',
              rationale:
                'Flange saliva evacuator (Svedopter with cotton roll guard on mylohyoid ridge) + local anesthesia reduces PDL-mediated salivary flow without anticholinergic risk.',
              biomechanicalEffect: 'Dry mandibular field achieved safely.',
            },
          ],
        },
        {
          id: 'c7a-2',
          prompt: 'Which soft-tissue retraction method is SAFE vs. CONTRAINDICATED given his cardiac pacemaker and bleeding?',
          options: [
            {
              id: 'ret-electro',
              label: 'Electrosurgery Troughing',
              isRecommended: false,
              outcomeTitle: 'CONTRAINDICATED: Pacemaker & Gingival Inflammation',
              outcomeStatus: 'contraindicated',
              rationale:
                'Electrosurgery is strictly contraindicated in patients with electronic cardiac pacemakers and in inflamed gingival tissue.',
              biomechanicalEffect: 'Pacemaker interference hazard + tissue recession.',
            },
            {
              id: 'ret-dual-cord',
              label: 'Double-Cord Technique (#000/#0 Primary + #1 Secondary) or AlCl3 Cordless Paste',
              isRecommended: true,
              outcomeTitle: 'Controlled Hemostasis for Multiple Subgingival Preps',
              outcomeStatus: 'optimal',
              rationale:
                'Double-cord is specifically indicated for multiple prepared teeth, compromised tissue health, and excess exudate; primary thin cord stays in situ.',
              biomechanicalEffect: 'Controls hemorrhage and prevents sulcular collapse during syringing.',
            },
          ],
        },
      ],
      educationalDisclaimer:
        'Medication doses and contraindications reflect Lecture 7A material; always verify medical history and physician clearance before prescribing.',
    },
    materialComparison: {
      id: 'lec07a-compare',
      title: 'Gingival Retraction Modalities & Cord Sizes',
      subtitle: 'Compare knitted cords, cordless hemostatic pastes, rotary curettage, electrosurgery, and soft-tissue laser.',
      items: [
        {
          id: 'knitted-cord',
          name: 'Knitted Cord (Ultrapak)',
          category: 'Chemo-Mechanical',
          metrics: [
            { label: 'Sulcus Displacement', value: 95, max: 100, unit: '%' },
            { label: 'Packability & Retention', value: 94, max: 100, unit: '%' },
            { label: 'Tissue Trauma Risk', value: 35, max: 100, unit: '%' },
          ],
          indications: [
            'Interlocking loops compress during packing then expand for displacement',
            '#000 Black / #00 Yellow (anterior), #0 Purple / #1 Blue (bicuspids/double cord), #2 Green / #3 Red (molars)',
          ],
          contraindications: ['Never pack dry; never use serrated packer on knitted/non-braided if tearing risk'],
          clinicalNote: 'Use Fischer 45° packer for continuous circular packing without flipping end-to-end.',
        },
        {
          id: 'expasyl',
          name: 'Expasyl Paste (15% AlCl3)',
          category: 'Cordless Hemostatic',
          metrics: [
            { label: 'Sulcus Displacement', value: 65, max: 100, unit: '%' },
            { label: 'Hemostasis', value: 92, max: 100, unit: '%' },
            { label: 'Patient Comfort', value: 95, max: 100, unit: '%' },
          ],
          indications: [
            'Non-traumatic sulcus hemostasis and mild displacement',
            'Apply pressure with hollow cotton roll to improve displacement',
          ],
          contraindications: ['Deep subgingival margins needing wide lateral retraction'],
          clinicalNote: 'Inject into dried sulcus starting interproximally; leave 5–10 min then rinse thoroughly.',
        },
        {
          id: 'magic-foam',
          name: 'Magic Foam Cord (PVS)',
          category: 'Cordless Expanding Foam',
          metrics: [
            { label: 'Volumetric Expansion', value: 4, max: 5, unit: 'x' },
            { label: 'Tissue Safety', value: 95, max: 100, unit: '%' },
            { label: 'Hemostasis Alone', value: 60, max: 100, unit: '%' },
          ],
          indications: ['Polydimethylsiloxane with tin catalyst releases gas for 4x expansion'],
          contraindications: ['Direct heavy bleeding without prior hemostatic control'],
          clinicalNote: 'Hollow cotton roll directs 4x foam expansion apically into the sulcus.',
        },
        {
          id: 'gingettage',
          name: 'Rotary Curettage (Gingettage)',
          category: 'Surgical Troughing',
          metrics: [
            { label: 'Margin Exposure', value: 85, max: 100, unit: '%' },
            { label: 'Tactile Sense', value: 25, max: 100, unit: '%' },
            { label: 'Recession Risk', value: 75, max: 100, unit: '%' },
          ],
          indications: ['ONLY on healthy gingiva: ZERO bleeding on probing & ≥ 3 mm sulcus depth'],
          contraindications: ['Thin attached gingiva, inflamed tissue, shallow < 3 mm sulcus'],
          clinicalNote: 'Torpedo diamond bur run slowly with abundant water; AlCl3 cord controls bleeding.',
        },
        {
          id: 'laser-ndyag',
          name: 'Soft-Tissue Laser (Nd-YAG)',
          category: 'Surgical Adjunctive',
          metrics: [
            { label: 'Coagulation / Bleeding Control', value: 96, max: 100, unit: '%' },
            { label: 'Sterilization & Healing', value: 92, max: 100, unit: '%' },
            { label: 'Recession Risk', value: 15, max: 100, unit: '%' },
          ],
          indications: ['Precise gingival recontouring, hemostasis, minimal anesthesia'],
          contraindications: ['Insufficient attached gingiva'],
          clinicalNote: 'High-energy beam coagulates vessels, sterilizes field, and avoids gingival recession.',
        },
      ],
    },
    diagnosticPlanner: {
      id: 'lec07a-planner',
      title: 'Biological Width & Cord Thickness Planner',
      subtitle: 'Verify restorative margin clearance above the alveolar bone crest and select safe retraction cords.',
      scenario: 'Prevent Biological Width violation and iatrogenic gingival recession.',
      diagramType: 'biologic-width',
      variables: [
        {
          id: 'marginDepth',
          label: 'Subgingival Margin Placement',
          options: [
            { id: '0.5', label: '0.5 mm Intrasulcular', scoreDelta: 100, note: 'Preserves 2.04 mm biologic width + 0.5 mm remaining sulcus' },
            { id: '1.5', label: '1.5 mm Deep Subgingival (Infringes JE)', scoreDelta: 25, note: 'Violates 3 mm bone-to-margin rule → chronic inflammation/bone loss' },
          ],
        },
        {
          id: 'cordSize',
          label: 'Ultrapak Color-Coded Cord Size',
          options: [
            { id: '000-00', label: '#000 Black / #00 Yellow (Small)', scoreDelta: 95, note: 'Anterior teeth with thin firm tissue & primary double cord' },
            { id: '0-1', label: '#0 Purple / #1 Blue (Medium)', scoreDelta: 90, note: 'Bicuspids (#0 primary, #1 secondary in double cord)' },
            { id: '2-3', label: '#2 Green / #3 Red (Molar/Large)', scoreDelta: 65, note: 'Molars only where tissue permits; #3 risks soft-tissue trauma' },
          ],
        },
        {
          id: 'prepTechnique',
          label: 'Cord Moisture State at Placement',
          options: [
            { id: 'moist', label: 'Impregnated / Moistened Before Removal', scoreDelta: 100, note: 'Prevents sulcular epithelium sticking and tearing' },
            { id: 'dry', label: 'Packed Dry & Removed Dry', scoreDelta: 15, note: 'Tears crevicular epithelium and triggers bleeding' },
          ],
        },
      ],
    },
    visualComponents: [
      {
        id: 'v07a-1',
        kind: 'metric-grid',
        title: 'Oral Cavity Fluid Flow Rates',
        subtitle: 'Why strict moisture control is mandatory',
        items: [
          { title: 'Resting Saliva', value: '0.26 ± 0.16 ml/min', note: 'Parotid, submandibular & sublingual glands', status: 'safe' },
          { title: 'Chewing Saliva', value: '3.6 ± 0.8 ml/min', note: 'Increases >10x during mastication', status: 'warn' },
          { title: 'High-Speed Handpiece', value: '30 mL/min', note: 'Rotary coolant + triplex syringe', status: 'warn' },
          { title: 'Sulcular Fluid (GCF)', value: '0.05–0.20 µL/min', note: 'Increases dramatically with gingival inflammation', status: 'danger' },
        ],
      },
      {
        id: 'v07a-2',
        kind: 'hotspot-diagram',
        title: 'Biological Width Interactive Cross-Section',
        subtitle: 'Explore the 3 mm rule from crown margin to alveolar bone crest',
        diagramKey: 'biologic-width',
        hotspots: [
          { id: 'bw1', x: 45, y: 28, label: 'Sulcus Depth (mean 0.69 mm / ~1.0 mm)', detail: 'V-shaped crevice bounded by tooth and free gingiva; safe margin limit is ≤ 0.5 mm.' },
          { id: 'bw2', x: 45, y: 50, label: 'Junctional Epithelium (mean 0.97 mm)', detail: 'Ranges 0.71–1.35 mm; forms epithelial barrier.' },
          { id: 'bw3', x: 45, y: 72, label: 'Connective Tissue (mean 1.07 mm)', detail: 'Ranges 1.06–1.08 mm; total Biologic Width = 0.97 + 1.07 = 2.04 mm (require ≥ 3 mm bone-to-margin).' },
        ],
      },
      {
        id: 'v07a-3',
        kind: 'comparison-table',
        title: 'Retraction Cord Color & Size Guide',
        subtitle: 'Ultrapak diameter classification by tooth region',
        headers: ['Color Code', 'Size', 'Category', 'Recommended Clinical Application'],
        rows: [
          ['Black', '#000', 'Small', 'Anterior teeth (thin firm tissue) & primary cord in double-cord'],
          ['Yellow', '#00', 'Small', 'Anterior teeth & primary cord in double-cord'],
          ['Purple', '#0', 'Medium', 'Bicuspids & primary cord in double-cord'],
          ['Blue', '#1', 'Medium', 'Bicuspids & secondary cord in double-cord'],
          ['Green', '#2', 'Medium', 'Molars where tissue friability permits'],
          ['Red', '#3', 'Large', 'Molars only with extreme caution (soft-tissue trauma risk)'],
        ],
      },
      {
        id: 'v07a-4',
        kind: 'comparison-table',
        title: 'Anti-Sialagogic Medications & Safety',
        subtitle: 'Chemical moisture control pharmacology',
        headers: ['Drug', 'Regimen', 'Mechanism', 'Key Contraindications'],
        rows: [
          ['Atropine', '0.4 mg tablet/day', 'Anticholinergic', 'Heart disease, glaucoma (blindness), caution in older adults'],
          ['Methantheline (Banthine)', '50 mg 1h pre-op', 'Anticholinergic', 'Heart disease, glaucoma'],
          ['Propantheline (Pro-Banthine)', '15 mg 1h pre-op', 'Anticholinergic', 'Heart disease, glaucoma'],
          ['Clonidine HCl', '0.2 mg 1h pre-op', 'Antihypertensive', 'No absolute contraindications; caution in hypertensive patients'],
        ],
      },
      {
        id: 'v07a-5',
        kind: 'metric-grid',
        title: 'Cord Configuration Mechanics',
        subtitle: 'Twisted vs. Braided vs. Knitted',
        items: [
          { title: 'Knitted Cord', value: 'Preferred', note: 'Interlocking tiny loops compress on packing & expand in sulcus', status: 'safe' },
          { title: 'Braided Cord', value: 'Tighter Weave', note: 'Use serrated cord packers only with braided cord', status: 'warn' },
          { title: 'Twisted Cord', value: 'Unravels Easily', note: 'Lower packability; twist tightly before insertion', status: 'warn' },
        ],
      },
      {
        id: 'v07a-6',
        kind: 'flowchart',
        title: 'Double-Cord Retraction Architecture',
        subtitle: 'When deeper subgingival margins risk sulcus collapse',
        steps: [
          { label: '1. Place Thin Primary Cord (#000 or #0)', detail: 'Seated at bottom of crevice leaving ~1 mm intact tooth below margin; stays in during impression' },
          { label: '2. Place Thick Secondary Cord (#1)', detail: 'Seated coronally above primary cord to displace gingiva laterally' },
          { label: '3. Remove Secondary Cord Only', detail: 'Remove #1 immediately before syringing; #0 prevents cuff recoil & seepage' },
        ],
      },
      {
        id: 'v07a-7',
        kind: 'safety-alert',
        title: 'Critical Contraindications in Tissue Management',
        subtitle: 'Avoid iatrogenic systemic and periodontal harm',
        items: [
          { title: 'Dry Cord Packing', value: 'Never Pack Dry', note: 'Sticks to sulcular epithelium and tears tissue on removal.', status: 'danger' },
          { title: 'Electrosurgery', value: '3 Contraindications', note: 'Pacemakers, thin gingiva (lower anteriors / upper canines), metallic restorations/instruments.', status: 'danger' },
        ],
      },
      {
        id: 'v07a-8',
        kind: 'checklist',
        title: 'Fischer Packer Instrument Geometry',
        subtitle: '45° vs. 90° and Parallel heads',
        items: [
          { title: '45° to Handle (#170/#171)', value: 'Circular Packing', note: 'Pack 360° around prep without flipping instrument end-to-end', status: 'safe' },
          { title: '90° & Parallel (#172/#174)', value: 'Dual Axis', note: 'One head inline with shank, one at 90°; small packer for lower incisors/upper laterals', status: 'safe' },
        ],
      },
      {
        id: 'v07a-9',
        kind: 'timeline',
        title: 'Gingettage (Rotary Curettage) Criteria & Steps',
        subtitle: 'Simultaneous finish line and inner sulcular epithelium troughing',
        steps: [
          { label: 'Verify Criteria', detail: 'ZERO bleeding on probing + minimum 3 mm sulcus depth + adequate attached gingiva' },
          { label: 'Shoulder to Crest', detail: 'Prepare shoulder finish line to level of gingival crest' },
          { label: 'Torpedo Diamond Bur', detail: 'Form chamfer subgingivally while curetting sulcular epithelium slowly with abundant water' },
          { label: 'AlCl3 Cord Hemostasis', detail: 'Place AlCl3-impregnated cord in troughed sulcus' },
        ],
      },
      {
        id: 'v07a-10',
        kind: 'checklist',
        title: '4 Objectives of Gingival Retraction',
        subtitle: 'Required for accurate subgingival finish-line capture',
        items: [
          { title: '1. Subgingival Access', value: 'Expose Finish Line', status: 'safe' },
          { title: '2. Material Bulk', value: 'Prevent Impression Tear', status: 'safe' },
          { title: '3. Fluid Control', value: 'Dry Field for Hydrophobic Elastomers', status: 'safe' },
          { title: '4. Reduce Sulcular Seepage', value: 'Eliminate Margin Voids', status: 'safe' },
        ],
      },
    ],
    quiz: [
      {
        id: 'q07a-1',
        type: 'visual-id',
        prompt: 'What is the mean Biological Width (junctional epithelium + supracrestal connective tissue attachment), and what minimum bone-to-margin clearance is required?',
        options: [
          { id: 'a', text: '1.00 mm BW; 1.5 mm bone clearance', explanation: '1.0 mm represents only one tissue component.' },
          { id: 'b', text: '2.04 mm BW (0.97 + 1.07 mm); 3.0 mm bone clearance', explanation: 'Correct: 0.97 mm JE + 1.07 mm CT = 2.04 mm Biological Width, requiring ≥ 3 mm space to bone.' },
          { id: 'c', text: '3.50 mm BW; 5.0 mm bone clearance', explanation: 'These values exceed the Gargiulo anatomical means.' },
          { id: 'd', text: '0.69 mm BW; 1.0 mm bone clearance', explanation: '0.69 mm is the mean sulcular depth, not Biological Width.' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q07a-2',
        type: 'model-3d',
        prompt: 'In the 3D Double-Cord Retraction mode, which cord remains inside the gingival sulcus while the impression is taken?',
        options: [
          { id: 'a', text: 'The thicker secondary cord (#1)', explanation: 'The thicker coronal cord is removed immediately before syringing.' },
          { id: 'b', text: 'The thinner primary cord (#000 or #0)', explanation: 'Correct: the thin primary cord stays at the base of the crevice to control hemorrhage and prevent cuff recoil.' },
          { id: 'c', text: 'Both cords stay in during impression', explanation: 'Leaving the top cord would block impression ingress into the finish line.' },
          { id: 'd', text: 'Neither cord remains in the sulcus', explanation: 'Removing both defines single-cord, not double-cord technique.' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q07a-3',
        type: 'clinical-mcq',
        prompt: 'Which patient condition is an absolute contraindication to anticholinergic anti-sialagogues (Atropine, Propantheline) due to risk of permanent blindness?',
        options: [
          { id: 'a', text: 'Mild gingivitis', explanation: 'Gingivitis does not contraindicating systemic anticholinergics.' },
          { id: 'b', text: 'Glaucoma', explanation: 'Correct: anticholinergics are contraindicated in glaucoma (can cause permanent blindness) and heart disease.' },
          { id: 'c', text: 'Bruxism', explanation: 'Bruxism is an occlusal parafunction unrelated to anticholinergics.' },
          { id: 'd', text: 'Allergy to latex', explanation: 'Latex allergy affects glove and rubber dam selection, not atropine.' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q07a-4',
        type: 'clinical-mcq',
        prompt: 'Why does Magic Foam Cord expand inside the gingival sulcus?',
        options: [
          { id: 'a', text: 'Hygroscopic swelling from saliva absorption', explanation: 'It relies on a chemical gas-release reaction, not water imbibition.' },
          { id: 'b', text: 'Tin-catalyzed polydimethylsiloxane gas release producing 4x volumetric expansion', explanation: 'Correct: reaction between base and catalyst releases gas for a 4x expansion directed apically by a hollow cotton roll.' },
          { id: 'c', text: '15% aluminum chloride precipitation', explanation: '15% AlCl3 is the active ingredient in Expasyl paste.' },
          { id: 'd', text: 'Thermal expansion at body temperature', explanation: 'Expansion is driven by polymerization gas release.' },
        ],
        correctOptionId: 'b',
      },
    ],
    referencesAndLimitations: {
      sources: [
        'Asst. Prof. Dr. Manhal Abdul-Rahman — Lecture 7: Fluid Control & Soft Tissue Management (Lecture_7__Tissue_Management__-_manhal.abdulrahman_a3308e24.pdf).',
      ],
      clinicalReviewFlags: [
        'Pharmacologic anti-sialagogues carry systemic risks and require individualized medical screening prior to clinical administration.',
      ],
    },
  },
];
