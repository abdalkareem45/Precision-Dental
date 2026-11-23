import type { ClinicalCaseScenario, LectureId, QuizQuestion } from '../types/lecture';

export const LECTURE_QUIZZES: Record<LectureId, QuizQuestion[]> = {
  'lecture-3': [
    {
      id: 'wl-q1',
      prompt: 'Where is the apical constriction typically located relative to the center of the apical foramen?',
      options: [
        { id: 'a', label: '0.5 to 1.0 mm short of the center of the apical foramen' },
        { id: 'b', label: '2.0 to 3.0 mm coronal to the cementodentinal junction' },
        { id: 'c', label: 'Exactly flush with the radiographic apex' },
        { id: 'd', label: '0.5 mm beyond the anatomic apex' },
      ],
      correctOptionId: 'a',
      explanation: 'The apical constriction is the narrowest diameter of the root canal and typically sits 0.5 to 1.0 mm short of the center of the apical foramen.',
      sourceRef: 'Lecture 3, Page 1',
    },
    {
      id: 'wl-q2',
      prompt: 'When external root resorption is present on the radiograph, how much should the adjusted working length be shortened?',
      options: [
        { id: 'a', label: '0.5 mm' },
        { id: 'b', label: '1.0 mm' },
        { id: 'c', label: '2.0 mm' },
        { id: 'd', label: 'No subtraction is required' },
      ],
      correctOptionId: 'c',
      explanation: 'External root resorption destroys normal apical anatomy, so the root canal working length is shortened by 2 mm rather than the standard 1.0 mm.',
      sourceRef: 'Lecture 3, Page 2',
    },
    {
      id: 'wl-q3',
      prompt: 'What electrical resistance at the apical constriction serves as the classical reference value ("0" reading) in resistance-based apex locators?',
      options: [
        { id: 'a', label: '200 ohms' },
        { id: 'b', label: '650 ohms' },
        { id: 'c', label: '1,200 ohms' },
        { id: 'd', label: '4,000 ohms' },
      ],
      correctOptionId: 'b',
      explanation: 'The apical constriction exhibits an electronic resistance characteristic of 650 ohms, used via Ohm’s Law (V = R × I) to detect the constriction.',
      sourceRef: 'Lecture 3, Page 3',
    },
    {
      id: 'wl-q4',
      prompt: 'In which patient group is the use of an electronic apex locator strictly contraindicated?',
      options: [
        { id: 'a', label: 'Pregnant patients requiring reduced radiation' },
        { id: 'b', label: 'Patients with severe gag reflex' },
        { id: 'c', label: 'Patients with cardiac pacemakers' },
        { id: 'd', label: 'Pediatric patients with primary teeth' },
      ],
      correctOptionId: 'c',
      explanation: 'Electronic apex locators are contraindicated in patients with cardiac pacemakers because electrical stimulation can interfere with pacemaker function.',
      sourceRef: 'Lecture 3, Page 4',
    },
  ],
  'lecture-4': [
    {
      id: 'rad-q1',
      prompt: 'Using the Buccal Object Rule (SLOB), if the X-ray cone is shifted mesially, which way does the buccal canal appear to move on the radiograph relative to the lingual canal?',
      options: [
        { id: 'a', label: 'Mesially (same direction as the cone)' },
        { id: 'b', label: 'Distally (opposite direction to the cone)' },
        { id: 'c', label: 'Apically without horizontal separation' },
        { id: 'd', label: 'It remains completely superimposed' },
      ],
      correctOptionId: 'b',
      explanation: 'SLOB stands for Same Lingual, Opposite Buccal. Moving the cone mesially shifts the buccal canal distally (opposite direction).',
      sourceRef: 'Lecture 4 (Radiography), Page 4',
    },
    {
      id: 'rad-q2',
      prompt: 'Why do finger-held bisecting-angle radiographs of maxillary molars often show short buccal roots and a very long palatal root?',
      options: [
        { id: 'a', label: 'Because of the angle of the hard palate relative to the tooth axes' },
        { id: 'b', label: 'Because buccal roots have lower mineral density' },
        { id: 'c', label: 'Because radiolucent rubber dam frames elongate palatal roots' },
        { id: 'd', label: 'Because paralleling aiming rings tilt toward the sinus' },
      ],
      correctOptionId: 'a',
      explanation: 'Due to the slope of the hard palate, finger-held films lie at an angle that foreshortens buccal roots and elongates the palatal root.',
      sourceRef: 'Lecture 4 (Radiography), Page 3',
    },
    {
      id: 'rad-q3',
      prompt: 'Which three components comprise a Direct Digital Radiography (CCD) system as described in the lecture?',
      options: [
        { id: 'a', label: 'Phosphor plate, laser scanner, and developer bath' },
        { id: 'b', label: 'Radio component (sensor), Visio component (monitor/processor), and Graphy component (printer)' },
        { id: 'c', label: 'Cone-beam tube, silver halide film, and darkroom timer' },
        { id: 'd', label: 'Aiming ring, bite block, and optical magnifier' },
      ],
      correctOptionId: 'b',
      explanation: 'Direct digital systems consist of the Radio component (cold-sterilizable sensor with fiber-optic shield), Visio component (monitor/processing unit), and Graphy component (high-resolution printer).',
      sourceRef: 'Lecture 4 (Radiography), Page 6',
    },
    {
      id: 'rad-q4',
      prompt: 'What Field of View (FOV) and voxel resolution are typically used for endodontic CBCT evaluation?',
      options: [
        { id: 'a', label: 'Full-head FOV with 500 µm voxels' },
        { id: 'b', label: 'Limited FOV (4×4 cm or less) with 60–75 µm isotropic voxels' },
        { id: 'c', label: 'Panoramic arch FOV with 250 µm fan-beam pixels' },
        { id: 'd', label: 'Bitewing-only FOV with anisotropic rectangular voxels' },
      ],
      correctOptionId: 'b',
      explanation: 'Endodontic CBCT utilizes a small/limited FOV (4×4 cm or less) yielding isotropic voxels as fine as 60–75 µm for maximum geometric accuracy.',
      sourceRef: 'Lecture 4 (Radiography), Pages 8–9',
    },
  ],
  'lecture-4b': [
    {
      id: 'inst1-q1',
      prompt: 'Which Group I manual instrument has a round tapered wire hacked with sharp projecting barbs and is used to remove soft pulp tissue or lodged cotton/paper points without cutting dentin?',
      options: [
        { id: 'a', label: 'K-file' },
        { id: 'b', label: 'Hedström file' },
        { id: 'c', label: 'Barbed broach' },
        { id: 'd', label: 'K-Flex file' },
      ],
      correctOptionId: 'c',
      explanation: 'A barbed broach is manufactured by hacking a round wire to form barbs; it engages soft tissue or cotton/paper points and does not cut dentin.',
      sourceRef: 'Lecture 4 (Intracanal Instruments), Page 1',
    },
    {
      id: 'inst1-q2',
      prompt: 'What is the diameter of a size #25 ISO file with a 0.02 taper at 3 mm from its tip (D3)?',
      options: [
        { id: 'a', label: '0.27 mm' },
        { id: 'b', label: '0.29 mm' },
        { id: 'c', label: '0.31 mm' },
        { id: 'd', label: '0.43 mm' },
      ],
      correctOptionId: 'c',
      explanation: 'D0 = 0.25 mm; each 1 mm adds 0.02 mm: D1 = 0.27 mm, D2 = 0.29 mm, and D3 = 0.31 mm.',
      sourceRef: 'Lecture 4 (Intracanal Instruments), Page 6',
    },
    {
      id: 'inst1-q3',
      prompt: 'How is a rake angle classified when the angle between the leading cutting edge and the radicular wall tangent is obtuse (> 90°)?',
      options: [
        { id: 'a', label: 'Positive or cutting rake angle' },
        { id: 'b', label: 'Negative or scraping rake angle' },
        { id: 'c', label: 'Neutral rake angle' },
        { id: 'd', label: 'Radial land relief angle' },
      ],
      correctOptionId: 'a',
      explanation: 'An obtuse angle with the surface to be cut produces a positive (cutting) rake angle; an acute angle produces a negative (scraping) rake angle; 90° is neutral.',
      sourceRef: 'Lecture 4 (Intracanal Instruments), Page 5',
    },
    {
      id: 'inst1-q4',
      prompt: 'Which ISO sizes correspond to the intermediate "Golden Mediums" series?',
      options: [
        { id: 'a', label: '06, 08, 10, 15, 20, 25' },
        { id: 'b', label: '12, 17, 22, 27, 32, 37' },
        { id: 'c', label: '15, 25, 35, 45, 55, 65' },
        { id: 'd', label: '20, 40, 60, 80, 100, 120' },
      ],
      correctOptionId: 'b',
      explanation: 'Golden Mediums provide halfway steps between standard ISO sizes: 12, 17, 22, 27, 32, and 37.',
      sourceRef: 'Lecture 4 (Intracanal Instruments), Page 3',
    },
  ],
  'lecture-5': [
    {
      id: 'inst2-q1',
      prompt: 'Which design feature defines the ProTaper Next system and creates a swaggering motion with two-point dentin contact?',
      options: [
        { id: 'a', label: 'U-shaped cross-section with broad radial lands' },
        { id: 'b', label: 'Off-centered rectangular cross-section' },
        { id: 'c', label: 'Hollow compressible NiTi lattice cylinder' },
        { id: 'd', label: 'Square cross-section with constant 0.02 taper' },
      ],
      correctOptionId: 'b',
      explanation: 'ProTaper Next has an off-centered rectangular cross-section enabling 2-point contact with the dentin wall and a swaggering motion for debris removal.',
      sourceRef: 'Lecture 5, Page 3',
    },
    {
      id: 'inst2-q2',
      prompt: 'Before inserting the 1.5 mm Self-Adjusting File (SAF) lattice, what initial glidepath is required and what vibration profile does its handpiece generate?',
      options: [
        { id: 'a', label: '#10 K-file glidepath; 300 rpm continuous rotation' },
        { id: 'b', label: '#20 K-file glidepath; 5,000 in-and-out vibrations/min at 0.4 mm amplitude' },
        { id: 'c', label: '#40 Gates-Glidden glidepath; 30 kHz ultrasonic oscillation' },
        { id: 'd', label: 'No glidepath needed; quarter-turn Giromatic reciprocation' },
      ],
      correctOptionId: 'b',
      explanation: 'A #20 K-file establishes the glidepath so the 1.5 mm hollow lattice compresses to ~#25 dimensions and vibrates at 5,000 vpm (0.4 mm amplitude) with continuous irrigant flow.',
      sourceRef: 'Lecture 5, Page 3',
    },
    {
      id: 'inst2-q3',
      prompt: 'During free ultrasonic vibration in an irrigant-filled canal, what two physical fluid effects enhance debridement?',
      options: [
        { id: 'a', label: 'Cavitation (pressure-driven implosion) and acoustic streaming (circular fluid movement)' },
        { id: 'b', label: 'Thermal R-phase transformation and radial land burnishing' },
        { id: 'c', label: 'Taper lock and coronal brushing' },
        { id: 'd', label: 'Electro-polishing and galvanic passivation' },
      ],
      correctOptionId: 'a',
      explanation: 'Free ultrasonic vibration at 25–30 kHz generates cavitation (positive/negative pressure implosion) and acoustic streaming (intense circular fluid movement around the file).',
      sourceRef: 'Lecture 5, Page 4',
    },
    {
      id: 'inst2-q4',
      prompt: 'Which advancement characterizes the 5th generation of NiTi rotary instruments (e.g., Revo-S, One Shape, ProTaper Next)?',
      options: [
        { id: 'a', label: 'Passive cutting radial lands with fixed 0.04–0.06 tapers' },
        { id: 'b', label: 'Offsetting the center of rotation to create a mechanical wave and reduce taper lock' },
        { id: 'c', label: 'Manual stainless steel twisting' },
        { id: 'd', label: 'Blue titanium oxide surface layer exclusively' },
      ],
      correctOptionId: 'b',
      explanation: 'Fifth-generation instruments offset the center of rotation, producing a mechanical wave of motion along the file that improves debris removal and reduces taper lock/screwing.',
      sourceRef: 'Lecture 5, Pages 6–7',
    },
  ],
  'lecture-7': [
    {
      id: 'mat-q1',
      prompt: 'What is the approximate percentage composition of a modern gutta-percha cone?',
      options: [
        { id: 'a', label: '75% gutta-percha and 25% zinc oxide' },
        { id: 'b', label: '20% gutta-percha, 60–75% zinc oxide, and 5–10% resins, waxes, and metal sulfates' },
        { id: 'c', label: '50% gutta-percha and 50% bioactive glass' },
        { id: 'd', label: '90% gutta-percha and 10% barium sulfate' },
      ],
      correctOptionId: 'b',
      explanation: 'Modern gutta-percha cones contain only ~20% gutta-percha, with 60–75% zinc oxide as the major component and 5–10% resins, waxes, and metal sulfates.',
      sourceRef: 'Lecture 7, Page 5',
    },
    {
      id: 'mat-q2',
      prompt: 'At approximately what temperature does gutta-percha transition from the beta crystalline phase to the alpha phase?',
      options: [
        { id: 'a', label: '37°C' },
        { id: 'b', label: '46°C' },
        { id: 'c', label: '64°C' },
        { id: 'd', label: '90°C' },
      ],
      correctOptionId: 'b',
      explanation: 'Heating gutta-percha transitions beta → alpha around 46°C, develops an amorphous phase at 54–60°C, and softens cones above 64°C.',
      sourceRef: 'Lecture 7, Pages 4–5',
    },
    {
      id: 'mat-q3',
      prompt: 'Which sealer family is hydrophilic, utilizes intracanal moisture to set without shrinkage, and induces periapical cementoblasts and osteoblasts?',
      options: [
        { id: 'a', label: 'Zinc oxide eugenol (Rickert sealer)' },
        { id: 'b', label: 'Glass ionomer sealer (Ketac-endo)' },
        { id: 'c', label: 'Bioceramic sealers (BioRoot RCS, iRoot SP, Total Fill BC)' },
        { id: 'd', label: 'Formaldehyde-releasing AH-26 epoxy resin' },
      ],
      correctOptionId: 'c',
      explanation: 'Bioceramic sealers are hydrophilic, do not shrink on setting, exhibit antimicrobial activity while setting, and are bioactive toward periapical cells.',
      sourceRef: 'Lecture 7, Pages 3–4',
    },
    {
      id: 'mat-q4',
      prompt: 'Why is chairside disinfection of gutta-percha cones performed by immersing them in 5.25% NaOCl for 1 minute?',
      options: [
        { id: 'a', label: 'To dissolve the zinc oxide core' },
        { id: 'b', label: 'Because gutta-percha cones cannot be heat-sterilized without deforming' },
        { id: 'c', label: 'To convert beta phase permanently into Resilon' },
        { id: 'd', label: 'To etch the cone for dentin adhesion without sealer' },
      ],
      correctOptionId: 'b',
      explanation: 'Gutta-percha points cannot be heat-sterilized; placing them in 5.25% NaOCl for 1 minute is the most effective antimicrobial disinfection protocol noted in the lecture.',
      sourceRef: 'Lecture 7, Page 5',
    },
  ],
  'lecture-8': [
    {
      id: 'obt-q1',
      prompt: 'Which four post-treatment radiographic factors govern the success of nonsurgical root canal treatment?',
      options: [
        { id: 'a', label: 'Absence of periapical lesion, no voids, obturation within 2.0 mm of radiographic apex, and adequate coronal restoration' },
        { id: 'b', label: 'Slight sealer puff beyond apex, single cone only, metallic post, and negative pre-op culture' },
        { id: 'c', label: 'Paraformaldehyde paste fill, 4 mm short of apex, temporary zinc oxide crown, and zero taper' },
        { id: 'd', label: 'Silver cone fit, open access cavity, high occlusal contact, and chloroform softening' },
      ],
      correctOptionId: 'a',
      explanation: 'Lecture 8 identifies four success factors: absence of a periapical lesion, obturation free of radiographic voids, termination within 2.0 mm of the radiographic apex, and an adequate coronal restoration.',
      sourceRef: 'Lecture 8, Page 1',
    },
    {
      id: 'obt-q2',
      prompt: 'In the Continuous Wave Compaction Technique (System B at 200°C), why is the plugger held with sustained apical pressure for 10 seconds after releasing the heating switch?',
      options: [
        { id: 'a', label: 'To sterilize the dentinal tubules thermally' },
        { id: 'b', label: 'To take up shrinkage that occurs as the softened gutta-percha cools' },
        { id: 'c', label: 'To dissolve the smear layer chemically' },
        { id: 'd', label: 'To separate the carrier shaft from the handle' },
      ],
      correctOptionId: 'b',
      explanation: 'Sustained apical pressure for 10 seconds during cooling compensates for thermal contraction/shrinkage of gutta-percha.',
      sourceRef: 'Lecture 8, Page 4',
    },
    {
      id: 'obt-q3',
      prompt: 'After heating a Thermafil/Soft Core carrier, approximately how long does the clinician have to insert it to working length without rotation or twisting?',
      options: [
        { id: 'a', label: '10 seconds' },
        { id: 'b', label: '45 seconds' },
        { id: 'c', label: '2 to 4 minutes' },
        { id: 'd', label: '10 minutes' },
      ],
      correctOptionId: 'a',
      explanation: 'Once heated, the carrier has ~10 seconds to be inserted without twisting, then 2–4 minutes of cooling is allowed before resecting the coronal carrier.',
      sourceRef: 'Lecture 8, Pages 5–6',
    },
    {
      id: 'obt-q4',
      prompt: 'In a necrotic immature tooth with an open apex, what is the primary biological goal of pulp revascularization compared with simple apical obturation?',
      options: [
        { id: 'a', label: 'To extrude gutta-percha beyond the apex for a mechanical lock' },
        { id: 'b', label: 'To regenerate pulp vitality, increase canal wall thickness, and induce root apex formation' },
        { id: 'c', label: 'To leave the canal open permanently to drain periapical fluid' },
        { id: 'd', label: 'To place a rigid Vitallium implant through the apex' },
      ],
      correctOptionId: 'b',
      explanation: 'Pulp revascularization induces a blood clot scaffold invaded by SCAP, covered with MTA and a coronal seal, to thicken canal walls and promote root apex development.',
      sourceRef: 'Lecture 8, Pages 6–7',
    },
  ],
  'lecture-9': [
    {
      id: 'emg-q1',
      prompt: 'Which diagnostic finding is described as the hallmark test for Symptomatic Apical Periodontitis?',
      options: [
        { id: 'a', label: 'Short sharp pain only to cold air on cervical dentin' },
        { id: 'b', label: 'Sensitivity to percussion due to fluid pressure in the periodontal ligament space' },
        { id: 'c', label: 'Ecchymosis and paresthesia along the cheek' },
        { id: 'd', label: 'Complete relief upon biting laterally on a cotton roll' },
      ],
      correctOptionId: 'b',
      explanation: 'Symptomatic apical periodontitis elevates the tooth in its socket via PDL fluid pressure, producing discomfort on biting and sensitivity to percussion (hallmark test).',
      sourceRef: 'Lecture 9, Page 3',
    },
    {
      id: 'emg-q2',
      prompt: 'Why is local infiltration anesthesia directly near a distended acute periapical abscess swelling contraindicated?',
      options: [
        { id: 'a', label: 'It causes pain in the distended area, risks spreading microorganisms, and is ineffective locally' },
        { id: 'b', label: 'It dissolves gutta-percha cones in adjacent teeth' },
        { id: 'c', label: 'It permanently blocks inferior alveolar nerve regeneration' },
        { id: 'd', label: 'It converts reversible pulpitis into dentin hypersensitivity' },
      ],
      correctOptionId: 'a',
      explanation: 'Injection near swelling causes pain in distended tissue, can spread infection, and is pharmacologically ineffective; regional nerve block techniques are preferred.',
      sourceRef: 'Lecture 9, Pages 3–4',
    },
    {
      id: 'emg-q3',
      prompt: 'How should a cracked tooth be managed if the fracture involves the pulp and the crack remains superficial to the alveolar bone crest?',
      options: [
        { id: 'a', label: 'Immediate extraction without occlusal adjustment' },
        { id: 'b', label: 'Desensitizing toothpaste only' },
        { id: 'c', label: 'Reduce occlusal contact and perform endodontic treatment (followed by cuspal protection)' },
        { id: 'd', label: 'Leave the access open for 3 weeks' },
      ],
      correctOptionId: 'c',
      explanation: 'Crown-only cracks require full crown coverage; pulp-involved cracks superficial to alveolar bone require endodontic treatment; cracks below alveolar bone require extraction.',
      sourceRef: 'Lecture 9, Page 4',
    },
    {
      id: 'emg-q4',
      prompt: 'What thermal home-care sequence is recommended after an acute sodium hypochlorite extrusion accident?',
      options: [
        { id: 'a', label: 'Warm packs immediately for 48 hours' },
        { id: 'b', label: 'Cold packs initially to minimize pain and swelling, followed by warm packs after 24 hours to encourage healing' },
        { id: 'c', label: 'No thermal therapy and immediate random retreatment' },
        { id: 'd', label: 'Chloroform irrigation to neutralize NaOCl' },
      ],
      correctOptionId: 'b',
      explanation: 'Following immediate aspiration and icepacks, home care uses cold packs first to limit swelling and transitions to warm packs after 24 hours to support healing.',
      sourceRef: 'Lecture 9, Page 5',
    },
  ],
};

export const LECTURE_CASES: Record<LectureId, ClinicalCaseScenario[]> = {
  'lecture-3': [
    {
      id: 'wl-case-1',
      title: 'Mandibular Molar with Pacemaker & Distal External Resorption',
      patientPresentation:
        'A 58-year-old patient with a permanent cardiac pacemaker presents for root canal therapy on a mandibular first molar. Preoperative radiograph reveals external apical root resorption on the distal root.',
      clinicalFindings: [
        'Medical history: Implanted cardiac pacemaker',
        'Preoperative distal root estimate: 20.5 mm',
        'Radiographic trial file (#15 K-file at 19.5 mm) ends 0.5 mm short of the resorbed radiographic root end',
      ],
      question: 'Which working length workflow is clinically appropriate based on Lecture 3?',
      options: [
        {
          id: 'opt-eal',
          label: 'Use a 6th-generation electronic apex locator to read "0" and skip the radiograph.',
          isOptimal: false,
          clinicalOutcome: 'Unsafe device selection — pacemaker interference risk.',
          rationale: 'Electronic apex locators are contraindicated in patients with cardiac pacemakers due to potential electromagnetic interference.',
        },
        {
          id: 'opt-rad-1mm',
          label: 'Calculate adjusted tooth length (20.0 mm) and subtract 1.0 mm to set WL at 19.0 mm.',
          isOptimal: false,
          clinicalOutcome: 'Risk of apical over-instrumentation through resorbed apex.',
          rationale: 'Standard 1.0 mm subtraction assumes intact apical constriction. External root resorption destroys apical anatomy.',
        },
        {
          id: 'opt-rad-2mm',
          label: 'Omit the apex locator; use the radiographic method, adjust tooth length to 20.0 mm, and subtract 2.0 mm for resorption (WL = 18.0 mm).',
          isOptimal: true,
          clinicalOutcome: 'Safe pacemaker avoidance and apical stop preserved short of resorption defect.',
          rationale: 'Radiographic working length avoids pacemaker hazards, and subtracting 2.0 mm compensates for loss of apical anatomy in external root resorption.',
        },
      ],
      educationalNote: 'Educational simulation based on Lecture 3 rules. Always verify medical device clearances and clinical radiographs with qualified supervision.',
    },
  ],
  'lecture-4': [
    {
      id: 'rad-case-1',
      title: 'Separating Superimposed Canals in a Maxillary First Premolar',
      patientPresentation:
        'An orthogonal (0°) working-length radiograph of a maxillary first premolar shows a single superimposed outline for two endodontic files.',
      clinicalFindings: [
        'Orthogonal film: Both files overlap completely',
        'Second exposure taken with the X-ray cone shifted 20° MESIALLY',
        'On the mesial-shift film, File X moves DISTALLY and File Y moves MESIALLY',
      ],
      question: 'Applying the Buccal Object Rule (SLOB), identify File X and File Y.',
      options: [
        {
          id: 'opt-x-buccal',
          label: 'File X is in the Buccal canal; File Y is in the Palatal (Lingual) canal.',
          isOptimal: true,
          clinicalOutcome: 'Accurate 3D canal localization from 2D films.',
          rationale: 'SLOB: Same = Lingual/Palatal, Opposite = Buccal. Moving the cone mesially made File Y move mesially (Same -> Palatal) and File X move distally (Opposite -> Buccal).',
        },
        {
          id: 'opt-x-palatal',
          label: 'File X is in the Palatal canal; File Y is in the Buccal canal.',
          isOptimal: false,
          clinicalOutcome: 'Canal identities reversed — risk of misrecording working lengths.',
          rationale: 'A canal moving in the opposite direction of a mesial cone shift (distally) lies on the buccal side, not the palatal side.',
        },
        {
          id: 'opt-cbct-only',
          label: 'Discard the shifted periapical films and order a full-head CBCT scan.',
          isOptimal: false,
          clinicalOutcome: 'Unnecessary radiation exposure for simple canal separation.',
          rationale: 'A horizontal cone-shift periapical resolves two-canal overlap immediately; when CBCT is needed in endodontics, a limited ≤ 4×4 cm FOV is indicated.',
        },
      ],
      educationalNote: 'SLOB applies equally to lingual (mandibular) and palatal (maxillary) structures relative to the buccal object.',
    },
  ],
  'lecture-4b': [
    {
      id: 'inst1-case-1',
      title: 'Curved Apical Canal Negotiation & Coronal Flaring Strategy',
      patientPresentation:
        'A mandibular molar mesial canal exhibits a pronounced curvature beginning in the middle third. You need coronal straight-line access and apical shaping without ledging or transportation.',
      clinicalFindings: [
        'Straight coronal third transitions into a 35° apical curve',
        'Available instruments: Gates-Glidden burs, sharp-tip stainless steel K-files, Flex-R / NiTi files, Hedström files',
      ],
      question: 'Which instrument and motion sequence minimizes ledging and outer-wall transportation?',
      options: [
        {
          id: 'opt-gg-deep',
          label: 'Advance a Gates-Glidden bur around the middle-third curve to straighten the entire canal.',
          isOptimal: false,
          clinicalOutcome: 'High risk of lateral strip perforation.',
          rationale: 'Lecture 4 explicitly warns that Group II low-speed rotary burs (GG and Peeso) must be limited to the straight coronal portion and never used in canal curvatures.',
        },
        {
          id: 'opt-safe-tip',
          label: 'Restrict Gates-Glidden burs to the straight coronal segment up to the initial curvature; negotiate the curve with a non-cutting Batt/Flex-R or NiTi file using reaming rather than aggressive filing.',
          isOptimal: true,
          clinicalOutcome: 'Maintains original canal curvature and avoids apical ledge formation.',
          rationale: 'Non-cutting rounded tips guide along the curve without ledging, and reaming motion causes less outer-wall apical transportation than filing.',
        },
        {
          id: 'opt-hfile-rot',
          label: 'Rotate a Hedström file clockwise aggressively to the apex.',
          isOptimal: false,
          clinicalOutcome: 'High risk of stress concentration, threading, and instrument fracture.',
          rationale: 'Hedström files cut only on the pulling stroke and concentrate bending stress along their ground continuous flute.',
        },
      ],
      educationalNote: 'Educational instrument-mechanics scenario aligned with Lecture 4 (Intracanal Instruments).',
    },
  ],
  'lecture-5': [
    {
      id: 'inst2-case-1',
      title: 'Shaping a Flattened Ribbon-Shaped Mandibular Premolar Canal',
      patientPresentation:
        'Radiographic and cross-sectional evaluation reveals a broad, buccolingually flattened (oval) canal in a mandibular premolar.',
      clinicalFindings: [
        'Buccolingual canal width is significantly wider than mesiodistal width',
        'Circular rotary preparation risks leaving uninstrumented buccal/lingual recesses',
      ],
      question: 'Based on Lecture 5, which instrumentation approach addresses flattened/oval geometry most uniformly?',
      options: [
        {
          id: 'opt-1st-gen',
          label: 'Use only first-generation fixed-taper radial-landed rotary files in a single central path.',
          isOptimal: false,
          clinicalOutcome: 'Centered circular bore leaves buccal and lingual recesses uncleaned.',
          rationale: 'Lecture 5 notes poor cleaning in flattened root canals as a specific disadvantage of first-generation centered rotary instruments.',
        },
        {
          id: 'opt-saf',
          label: 'Establish a #20 K-file glidepath and use the Self-Adjusting File (SAF) hollow NiTi lattice with continuous irrigant flow and 5,000 vpm oscillation (or brushing motion with ProTaper).',
          isOptimal: true,
          clinicalOutcome: '3D cross-sectional adaptation and continuous debris flushing.',
          rationale: 'The SAF adapts both longitudinally and cross-sectionally to oval walls, removing a uniform dentin layer while continuously flushing debris.',
        },
        {
          id: 'opt-ultrasound-dry',
          label: 'Force an active ultrasonic file tightly against the dry buccal and lingual walls at maximum power.',
          isOptimal: false,
          clinicalOutcome: 'Damping of standing wave, heat generation, and wall gouging.',
          rationale: 'Ultrasonic files must remain passive inside an irrigant-filled canal for short periods with controlled power to permit cavitation and acoustic streaming.',
        },
      ],
      educationalNote: 'Educational simulation illustrating mechanical differences across Lecture 5 rotary, SAF, and ultrasonic groups.',
    },
  ],
  'lecture-7': [
    {
      id: 'mat-case-1',
      title: 'Selecting & Placing Sealer in an Oval Canal with Esthetic Zone Concerns',
      patientPresentation:
        'A maxillary central incisor with a wide oval canal requires obturation. The patient is concerned about future crown discoloration, and the clinician wants zero setting shrinkage.',
      clinicalFindings: [
        'Anterior esthetic tooth — staining materials must be avoided',
        'Wide oval cross-section where single-cone coating alone may leave voids',
      ],
      question: 'Which sealer choice and placement technique align best with Lecture 7?',
      options: [
        {
          id: 'opt-rickert',
          label: 'Coat the master cone with Rickert zinc oxide eugenol sealer and insert once.',
          isOptimal: false,
          clinicalOutcome: 'Tooth discoloration from silver particles and potential voids in wide canal.',
          rationale: 'Rickert sealer contains silver particles that stain tooth structure, and master-cone coating alone may be insufficient in oval or wide canals.',
        },
        {
          id: 'opt-bioceramic',
          label: 'Use a non-staining Bioceramic sealer delivered via a flexible capillary cannula tip after purging trapped air, then seat a 5.25% NaOCl-disinfected gutta-percha master cone.',
          isOptimal: true,
          clinicalOutcome: 'Zero shrinkage, hydrophilic set, non-staining, and complete wall coating.',
          rationale: 'Bioceramic sealers do not shrink or stain, exploit canal moisture, and capillary cannula injection from the coronal/middle third fills oval spaces before master-cone insertion.',
        },
        {
          id: 'opt-resilon',
          label: 'Select Resilon cones with Epiphany sealer for permanent enzymatic stability.',
          isOptimal: false,
          clinicalOutcome: 'Material withdrawn due to degradation.',
          rationale: 'Resilon breaks down via enzymatic degradation over time and was withdrawn from the market in 2014.',
        },
      ],
      educationalNote: 'Always follow current manufacturer instructions and institutional clinical protocols for sealer handling.',
    },
  ],
  'lecture-8': [
    {
      id: 'obt-case-1',
      title: 'Timing & Technique Selection for Symptomatic Necrotic Molar',
      patientPresentation:
        'A patient returns for obturation of a necrotic mandibular molar. On examination, the tooth is tender to percussion and exhibits active purulent exudate draining from the canals.',
      clinicalFindings: [
        'Necrotic pulp with active periapical inflammation',
        'Marked sensitivity to percussion and purulent exudate present',
      ],
      question: 'What is the appropriate timing decision according to Lecture 8?',
      options: [
        {
          id: 'opt-obturate-now',
          label: 'Proceed immediately with System B warm vertical obturation to seal the exudate apically.',
          isOptimal: false,
          clinicalOutcome: 'High risk of severe post-obturation flare-up and compromised seal.',
          rationale: 'Lecture 8 states that teeth with percussion sensitivity, purulent exudate, or sinus tract have active inflammation and must NOT be obturated until inflammation subsides.',
        },
        {
          id: 'opt-defer',
          label: 'Defer obturation; complete chemo-mechanical debridement, medicate, and wait until percussion sensitivity and exudate have subsided before obturating.',
          isOptimal: true,
          clinicalOutcome: 'Inflammation resolves before 3D fluid-tight obturation.',
          rationale: 'Single-visit obturation applies to vital cases or asymptomatic necrotic teeth; symptomatic exudative cases require resolution of inflammation first.',
        },
        {
          id: 'opt-paste',
          label: 'Fill the wet canal with a paraformaldehyde-containing paste for rapid fixation.',
          isOptimal: false,
          clinicalOutcome: 'Severe chemical tissue toxicity.',
          rationale: 'Lecture 8 explicitly notes that paraformaldehyde pastes are toxic and no longer used.',
        },
      ],
      educationalNote: 'Clinical decision framework sourced from Lecture 8 (Timing of Obturation).',
    },
  ],
  'lecture-9': [
    {
      id: 'emg-case-1',
      title: 'Acute Facial Swelling & Pain During NaOCl Irrigation',
      patientPresentation:
        'During endodontic irrigation of a maxillary premolar with an immature/resorbed apex, the needle binds and sodium hypochlorite is forcefully injected. The patient immediately experiences severe burning pain and rapid upper-lip edema and ecchymosis.',
      clinicalFindings: [
        'Immediate severe pain, progressive soft-tissue edema, and ecchymosis',
        'Suspected sodium hypochlorite extrusion accident',
      ],
      question: 'Which immediate and 24-hour emergency management plan follows Lecture 9?',
      options: [
        {
          id: 'opt-warm-first',
          label: 'Apply hot compresses immediately and instruct the patient to rinse with salt water only.',
          isOptimal: false,
          clinicalOutcome: 'Increased early edema and unaddressed tissue necrosis risk.',
          rationale: 'Immediate thermal care requires cold icepacks during the first 24 hours to minimize pain and swelling before switching to warm packs after 24 h.',
        },
        {
          id: 'opt-naocl-protocol',
          label: 'Perform immediate aspiration, apply icepacks (switching to warm packs after 24 h), prescribe analgesics, antibiotics, and antihistamines (with steroids/hospitalization if severe).',
          isOptimal: true,
          clinicalOutcome: 'Limits tissue destruction, controls swelling/infection risk, and supports 7–10 day recovery.',
          rationale: 'This matches the exact 4-step Hypochlorite Accident management protocol in Lecture 9 (page 5).',
        },
        {
          id: 'opt-infiltrate-swelling',
          label: 'Inject local anesthetic directly into the swollen facial tissue and force a large GP cone through the apex.',
          isOptimal: false,
          clinicalOutcome: 'Exacerbated pain, spread of infection, and mechanical trauma.',
          rationale: 'Injection into distended tissue is painful, ineffective, and risks spreading microorganisms; over-extension further worsens periapical trauma.',
        },
      ],
      educationalNote: 'Emergency management steps require immediate qualified clinical evaluation; severe airway or spreading cellulitis signs warrant urgent hospital care.',
    },
  ],
};

// Structured 2D interactive datasets strictly from the uploaded PDFs

export interface ApexLocatorGenInfo {
  gen: string;
  yearOrBasis: string;
  mechanism: string;
  fluidBehavior: string;
  dryBehavior: string;
  limitationOrAdvantage: string;
}

export const APEX_LOCATOR_GENERATIONS: ApexLocatorGenInfo[] = [
  {
    gen: '1st Generation',
    yearOrBasis: '1969 · Resistance',
    mechanism: 'Direct current measuring electrical resistance (650 Ω at constriction).',
    fluidBehavior: 'Inaccurate with strong electrolytes (irrigants, hemorrhage, pus, pulp tissue).',
    dryBehavior: 'Requires moist canal wall contact; unreliable vs. radiographs.',
    limitationOrAdvantage: 'High current caused patient pain; unreliable in clinical fluids.',
  },
  {
    gen: '2nd Generation',
    yearOrBasis: '1971 · Impedance',
    mechanism: 'Single-frequency impedance calibrated at the periodontal pocket of each tooth.',
    fluidBehavior: 'Inaccurate readings when electrolytes are present in canals.',
    dryBehavior: 'Also inaccurate when canals are completely dry.',
    limitationOrAdvantage: 'Required per-tooth periodontal pocket calibration.',
  },
  {
    gen: '3rd Generation',
    yearOrBasis: 'Multi-Frequency',
    mechanism: 'Uses multiple frequencies simultaneously to detect impedance ratio changes.',
    fluidBehavior: 'Accurately measures WL even in the presence of electrolytes.',
    dryBehavior: 'Works best with conductive fluid present.',
    limitationOrAdvantage: 'Achieves 90–100% accuracy in electrolyte-filled canals.',
  },
  {
    gen: '4th Generation',
    yearOrBasis: '400 Hz & 8 kHz',
    mechanism: 'Compares impedance at two separate frequencies (400 Hz and 8 kHz).',
    fluidBehavior: 'Inapplicable in heavy exudates or profuse blood.',
    dryBehavior: 'Requires partially dried canals to perform accurately.',
    limitationOrAdvantage: 'High accuracy in partially dried canals; fails in heavy blood/pus.',
  },
  {
    gen: '5th Generation',
    yearOrBasis: 'Dual Data + Math',
    mechanism: 'Compares electrical canal characteristics using mathematical processing.',
    fluidBehavior: 'Performs extremely well in the presence of blood and exudate.',
    dryBehavior: 'Considerable problems in dry canals; additional liquid must be inserted.',
    limitationOrAdvantage: 'Strong in wet/bleeding canals; requires wetting if canal is dry.',
  },
  {
    gen: '6th Generation',
    yearOrBasis: 'Adaptive Multi-Freq',
    mechanism: 'Combines 4th & 5th generation advantages by dynamically adapting measurement method.',
    fluidBehavior: 'High precision in blood and sodium hypochlorite (NaOCl).',
    dryBehavior: 'High precision even while manipulating dry canals.',
    limitationOrAdvantage: 'Eliminates necessity of drying or moistening the canal.',
  },
];

export interface NiTiGenerationInfo {
  gen: number;
  title: string;
  era: string;
  keyFeature: string;
  examples: string;
  advantages: string[];
  disadvantages: string[];
}

export const NITI_GENERATIONS: NiTiGenerationInfo[] = [
  {
    gen: 1,
    title: '1st Generation: Passive Radial Lands',
    era: 'Mid-1990s',
    keyFeature: 'Passive cutting radial lands with fixed 0.04–0.06 tapers over full working length.',
    examples: 'LightSpeed (1992), ProFile (1993), Quantec (1996), GT System (1998)',
    advantages: [
      'Optimum flexibility follows curvature, avoiding steps and perforations',
      'Centered smooth canal walls with low procedural errors',
      'Reduced working time and lower post-op pain',
    ],
    disadvantages: [
      'Requires numerous files and complex sequences',
      'Single-use cost and fracture risk',
      'Poor cleaning in flattened root canals',
    ],
  },
  {
    gen: 2,
    title: '2nd Generation: Active Cutting Edges',
    era: '2001',
    keyFeature: 'Active cutting blades (no radial lands) requiring fewer instruments to clean and shape.',
    examples: 'ProTaper Universal, K3, Mtwo, Hero Shaper, iRaCe / iRaCe Plus, TF Adaptive (2013)',
    advantages: [
      'Greater cutting efficiency with fewer files needed',
      'High resistance to cyclic & torsional fatigue; lower fracture index',
      'Preserves original canal shape even in curved/calcified cases',
    ],
    disadvantages: [
      'Some canal transportation reported',
      'Single-use cost; fracture still possible (lower than Gen 1)',
    ],
  },
  {
    gen: 3,
    title: '3rd Generation: Heat-Treated Alloys',
    era: 'Late 2007',
    keyFeature: 'M-Wire, R-Phase, Controlled Memory (CM), Gold thermal treatment & EDM reduce cyclic fatigue.',
    examples: 'K3XF, ProFile GTX, HyFlex CM, Vortex Blue, NeoEndo Flex',
    advantages: [
      '15% greater flexibility vs. Gen 1 and significantly lower separation risk',
      'CM files retain curved canal shape when withdrawn',
      'Lower fracture index even on reuse; less post-op pain',
    ],
    disadvantages: [
      'Higher instrument cost (manufacturer single-use recommendation)',
      'Low—but nonzero—fracture incidence',
    ],
  },
  {
    gen: 4,
    title: '4th Generation: Reciprocation & Single-File',
    era: 'Modern Reciprocating',
    keyFeature: 'CW/CCW back-and-forth reciprocation (derived from Blanc 1950s) enabling single-file shaping.',
    examples: 'WaveOne (Dentsply), Reciproc (VDW), SAF (ReDent Nova)',
    advantages: [
      'Indicated for severe anatomical complexity; 80% more flexible',
      '300% more resistant to cyclic fatigue; lower fracture index',
      'Single-file efficiency reduces bacterial counts and working time',
    ],
    disadvantages: [
      'Contraindicated for wide or relatively wide and straight canals',
    ],
  },
  {
    gen: 5,
    title: '5th Generation: Offset Center of Rotation',
    era: 'Offset Mass',
    keyFeature: 'Off-centered cross-section produces a mechanical wave of motion reducing taper lock/screwing.',
    examples: 'ProTaper Next, Revo-S, One Shape (25/.06), HyFlex EDM',
    advantages: [
      '80% more flexible than conventional rotaries',
      '150% higher cyclic fatigue resistance vs. ProTaper Universal',
      'Enhanced debris augering and reduced screwing-in effect',
    ],
    disadvantages: [
      'Requires dedicated glide path (optional in One Shape) and single-use discipline',
    ],
  },
  {
    gen: 6,
    title: 'New Generation: NiTi Blue Treatment',
    era: 'Thermal Blue Oxide',
    keyFeature: 'Nitinol 508 with blue titanium oxide hard surface layer compensating for heat-treated softness.',
    examples: 'Vortex Blue (Dentsply/Sirona)',
    advantages: [
      '65% higher cyclic fatigue resistance vs. M-Wire and 99% vs. Gen 1 NiTi',
      'Reduced shape memory allows slight pre-curving in severe curves',
      'Greater torsional resistance and lower working time',
    ],
    disadvantages: [
      'Torsion resistance remains influenced by cross-section and metal mass',
    ],
  },
];

export interface SealerComparisonRow {
  id: string;
  family: string;
  examples: string;
  settingChange: string;
  stainingRisk: string;
  antimicrobial: string;
  retreatment: string;
  keyNote: string;
}

export const SEALER_FAMILIES: SealerComparisonRow[] = [
  {
    id: 'znoe',
    family: 'Zinc Oxide Eugenol',
    examples: 'Rickert (silver), Procosol, Roth’s, Tubli-Seal',
    settingChange: 'Shrinks on setting; resorbable if extruded',
    stainingRisk: 'Rickert stains (silver); Roth’s & Procosol non-staining',
    antimicrobial: 'Yes (antimicrobial activity)',
    retreatment: 'Soluble in common solvents',
    keyNote: 'Slow set (Tubli-Seal catalyst/base sets faster); soluble over time.',
  },
  {
    id: 'noneugenol',
    family: 'Non-Eugenol',
    examples: 'Nogenol',
    settingChange: 'Minimal shrinkage',
    stainingRisk: 'Non-staining',
    antimicrobial: 'Limited',
    retreatment: 'Standard solvent/mechanical removal',
    keyNote: 'Eliminates irritating tissue effects of eugenol.',
  },
  {
    id: 'caoh',
    family: 'Calcium Hydroxide',
    examples: 'Sealapex, Apexit, Apexit Plus',
    settingChange: 'Moderate solubility',
    stainingRisk: 'Non-staining',
    antimicrobial: 'Limited (cannot sustain high pH long-term)',
    retreatment: 'Easily removed',
    keyNote: 'Intended for osteogenic-cementogenic stimulation, but long-term high pH is limited.',
  },
  {
    id: 'gic',
    family: 'Glass Ionomer',
    examples: 'Ketac-endo',
    settingChange: 'Bonds to dentin wall',
    stainingRisk: 'Non-staining',
    antimicrobial: 'Minimal antimicrobial activity',
    retreatment: 'Difficult to remove during retreatment',
    keyNote: 'Hard to condition middle/apical dentinal walls properly.',
  },
  {
    id: 'epoxy',
    family: 'Epoxy Resin',
    examples: 'AH-26 (releases formaldehyde), AH Plus (formaldehyde-free)',
    settingChange: 'Low shrinkage, ~4 h working time (AH Plus)',
    stainingRisk: 'Low/minimal (AH Plus)',
    antimicrobial: 'Moderate during setting',
    retreatment: 'Firm set; requires solvent/mechanical negotiation',
    keyNote: 'AH Plus removes formaldehyde release seen in AH-26.',
  },
  {
    id: 'methacrylate',
    family: 'Methacrylate Resin (Monoblock)',
    examples: 'EndoREZ, Diaket (polyvinyl), MetaSEAL, RealSeal, Epiphany',
    settingChange: 'Forms resin tags into dentinal tubules after NaOCl + EDTA',
    stainingRisk: 'Non-staining',
    antimicrobial: 'Low',
    retreatment: 'Bonded monoblock interface',
    keyNote: '4th-gen self-adhesive sealers contain acidic monomer; no separate etch/prime step.',
  },
  {
    id: 'silicone',
    family: 'Silicone Sealers',
    examples: 'RoekoSeal, GuttaFlow / GuttaFlow 2',
    settingChange: 'Slight expansion on setting',
    stainingRisk: 'Non-staining',
    antimicrobial: 'Low',
    retreatment: 'Retrievable with rotary/solvents',
    keyNote: 'GuttaFlow combines triturated GP powder + RoekoSeal capsule injection + single master cone.',
  },
  {
    id: 'bioceramic',
    family: 'Bioceramic Sealers',
    examples: 'BioRoot RCS, iRoot SP, Total Fill BC Sealer',
    settingChange: 'Hydrophilic; zero shrinkage on setting',
    stainingRisk: 'Non-staining',
    antimicrobial: 'Antimicrobial during setting reaction',
    retreatment: 'Requires ultrasonic/mechanical removal',
    keyNote: 'Uses canal moisture to set; bioactive (induces cementoblasts & osteoblasts).',
  },
];

export const PAIN_LADDER_STEPS = [
  {
    level: 'Mild Pain',
    accent: 'emerald',
    primaryRegimen: 'Ibuprofen 200–400 mg OR Paracetamol 650–1000 mg',
    escalationTrigger: 'If inadequate pain relief → escalate to Moderate Pain',
  },
  {
    level: 'Moderate Pain',
    accent: 'amber',
    primaryRegimen: 'Ibuprofen 400–600 mg',
    secondaryRegimen: 'If inadequate pain control → Ibuprofen 400–600 mg / Paracetamol 650–1000 mg + Narcotic or non-narcotic combination equivalent to 60 mg of codeine',
    escalationTrigger: 'If inadequate control → escalate to Severe Pain',
  },
  {
    level: 'Severe Pain',
    accent: 'rose',
    primaryRegimen: 'Ibuprofen 600–800 mg / Paracetamol 650–1000 mg + Narcotic or non-narcotic drug equivalent to 10 mg of oxycodone',
    escalationTrigger: 'Re-evaluate local endodontic drainage, occlusion, and etiology immediately.',
  },
];
