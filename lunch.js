// Updated lecture counts and added Prosthodontics and Preventive Dentistry
const subjects = [
  {
    name: "Crown & Bridge Fundamentals",
    lectures: 3,
    overview: "Abutment evaluations, Jespen root surface area metrics, crown-to-root ratios, and Ante's Law mechanical calculations.",
    launchCode: "f367df11cf62a3147e0a171e3f35c4a0333a68f9"
  },
  {
    name: "Endodontics",
    lectures: 2,
    overview: "Pulp diagnosis, cracked tooth investigation, pain control, local anesthesia techniques, clinical simulators, and knowledge checks.",
    launchCode: "endo-1-main"
  },
  {
    name: "Oral Surgery",
    lectures: 2,
    overview: "ATLS protocols, facial and mandibular fracture classifications, 2D interactive skull maps, and IAN nerve pathways.",
    launchCode: "fe3afe4e5c5b6834c6eebbbcda33fefa5ca06160"
  },
  {
    name: "Oral Medicine",
    lectures: 2,
    overview: "Herpesviruses, Coxsackievirus, oral mucosal lesions, diagnostic decision trees, and interactive 2D/3D lesion visualizers.",
    launchCode: "oral-med-12-main"
  },
  {
    name: "Orthodontics",
    lectures: 3,
    overview: "Craniofacial growth, cephalometric calipers, 3D dental arches, incisor vector simulators, and case diagnostics.",
    launchCode: "8666a648e8a3f5a983a00b19e5cc39db2ef0d29c"
  },
  {
    name: "Pediatric Dentistry",
    lectures: 10,
    overview: "Behavior management, dental trauma timers (luxation/avulsion), root fractures, and vital pulp therapy for immature teeth.",
    launchCode: "40b5e7081aa8886e9b639e3dff92927c51b00497"
  },
  {
    name: "Periodontics",
    lectures: 8,
    overview: "Staging & grading calculators, 3D furcation/mobility/plaque simulators, permanent odontograms, and visual mechanics labs.",
    launchCode: "perio-1-2-3-4-5-6-7-8--main"
  },
  {
    name: "Preventive Dentistry",
    lectures: 9,
    overview: "Caries risk assessment, remineralization protocols, sealant placement, fluoridation mechanisms, and oral hygiene strategies.",
    launchCode: "prevention-main"
  },
  {
    name: "Prosthodontics",
    lectures: 3,
    overview: "Complete and partial denture biomechanics, border molding techniques, occlusal vertical dimension, and impression procedures.",
    launchCode: "pros-main"
  }
];

// Navigation trigger
function navigateToSubject(launchCode) {
  if (!subjects.some(subject => subject.launchCode === launchCode)) return;
  window.location.href = `./subject.html?id=${encodeURIComponent(launchCode)}`;
}

// Render Cards Grid
const gridContainer = document.getElementById('subjects-grid');

gridContainer.innerHTML = subjects.map(subject => `
  <a
    href="./subject.html?id=${encodeURIComponent(subject.launchCode)}"
    class="group relative bg-white border border-marbleGrey rounded-2xl p-6 hover:border-precisionGold transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-xl hover:-translate-y-0.5"
  >
    <div>
      <!-- Badge Header -->
      <div class="flex justify-between items-center mb-4">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-marbleGrey/80 text-royalBlue border border-marbleGrey">
          ${subject.lectures} ${subject.lectures === 1 ? 'Lecture' : 'Lectures'}
        </span>
        <i class="fa-solid fa-arrow-up-right-from-square text-slate-400 group-hover:text-precisionGold transition-colors text-sm"></i>
      </div>

      <!-- Subject Title -->
      <h3 class="text-xl font-extrabold text-deepNavy mb-2 group-hover:text-royalBlue transition-colors">
        ${subject.name}
      </h3>

      <!-- Overview -->
      <p class="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
        ${subject.overview}
      </p>
    </div>

    <!-- Action Button -->
    <div class="flex items-center text-sm font-bold text-royalBlue group-hover:text-precisionGold group-hover:translate-x-1 transition-all duration-200">
      <span>Explore Subject</span>
      <i class="fa-solid fa-chevron-right ml-2 text-xs"></i>
    </div>
  </a>
`).join('');