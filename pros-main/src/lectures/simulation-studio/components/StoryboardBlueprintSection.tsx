import { LectureModule } from '../types/prosthodontics';

interface StoryboardBlueprintSectionProps {
  lecture: LectureModule;
}

export function StoryboardBlueprintSection({ lecture }: StoryboardBlueprintSectionProps) {
  const { deliverables, journeyMap, storyboardSections, referencesAndLimitations } = lecture;

  return (
    <section className="space-y-6">
      <div>
        <div className="text-xs font-medium text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
          Scene 06 · Mastery Review & Master Storyboard Blueprint
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] mt-1">
          Complete Pedagogical Storyboard & Technical Blueprint — Lecture {lecture.number}
        </h2>
      </div>

      {/* Learning Flow Diagram */}
      <div className="bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 rounded-xl p-6 space-y-4 transition-colors">
        <h3 className="text-base font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
          01. Learning Flow Diagram
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {deliverables.learningFlowSteps.map((flow) => (
            <div
              key={flow.step}
              className="bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 rounded-lg p-4 space-y-1.5"
            >
              <div className="text-xs font-mono font-bold text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
                {flow.step}
              </div>
              <div className="text-xs text-[#0B1F4D]/85 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/85 leading-relaxed">
                {flow.detail}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section-by-Section Storyboard Table */}
      <div className="bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 rounded-xl p-6 space-y-4 transition-colors">
        <h3 className="text-base font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
          02. Section-by-Section Storyboard
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 text-[#0B1F4D]/70 in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
                <th className="py-2.5 pr-4 font-semibold">Topic</th>
                <th className="py-2.5 pr-4 font-semibold">Learning Goal</th>
                <th className="py-2.5 pr-4 font-semibold">Visual Representation</th>
                <th className="py-2.5 pr-4 font-semibold">Interaction Type</th>
                <th className="py-2.5 font-semibold">Assessment Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:divide-[#1B3A8C]/35 text-[#0B1F4D]/85 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/85">
              {storyboardSections.map((sec) => (
                <tr key={sec.id}>
                  <td className="py-3 pr-4 font-semibold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
                    {sec.topicName}
                  </td>
                  <td className="py-3 pr-4">{sec.learningGoal}</td>
                  <td className="py-3 pr-4">{sec.visualRepresentation}</td>
                  <td className="py-3 pr-4">{sec.interactionType}</td>
                  <td className="py-3">{sec.assessmentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Content Map & Visual Asset Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 rounded-xl p-6 space-y-4 transition-colors">
          <h3 className="text-base font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
            03. Interactive Content Map
          </h3>
          <div className="space-y-2.5">
            {deliverables.interactiveContentMap.map((item) => (
              <div
                key={item.topic}
                className="p-3 bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 rounded-lg flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">{item.topic}</div>
                  <div className="text-[#0B1F4D]/75 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/75">{item.module}</div>
                </div>
                <span className="font-mono text-[11px] font-semibold text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B] shrink-0">
                  {item.targetScene}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 rounded-xl p-6 space-y-4 transition-colors">
          <h3 className="text-base font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
            04. Visual Asset Plan
          </h3>
          <div className="space-y-3 text-xs text-[#0B1F4D]/85 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/85">
            <div>
              <div className="font-semibold text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">3D Models</div>
              <div>{deliverables.visualAssetPlan.models3D.join(' · ')}</div>
            </div>
            <div>
              <div className="font-semibold text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
                Anatomical Illustrations
              </div>
              <div>{deliverables.visualAssetPlan.anatomicalIllustrations.join(' · ')}</div>
            </div>
            <div>
              <div className="font-semibold text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
                Clinical Diagrams
              </div>
              <div>{deliverables.visualAssetPlan.clinicalDiagrams.join(' · ')}</div>
            </div>
            <div>
              <div className="font-semibold text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">Animations</div>
              <div>{deliverables.visualAssetPlan.animations.join(' · ')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D + 4x 2D Sandbox Specifications */}
      <div className="bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 rounded-xl p-6 space-y-5 transition-colors">
        <h3 className="text-base font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
          05. 3D & 2D Sandbox Specifications
        </h3>
        <div className="p-4 rounded-lg bg-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] text-[#FAF8F3] border border-[#1B3A8C]/45 space-y-2">
          <div className="text-xs font-semibold text-[#C9A24B]">Major 3D Interactive Sandbox</div>
          <div className="text-sm font-bold">{deliverables.sandbox3DSpec.title}</div>
          <p className="text-xs text-[#E6E8EC]/90">{deliverables.sandbox3DSpec.primaryObjective}</p>
          <div className="text-[11px] text-[#E6E8EC]/80">
            Manipulable Layers: {deliverables.sandbox3DSpec.manipulableLayers.join(' · ')} · Simulation Variable: {deliverables.sandbox3DSpec.simulationVariable}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliverables.sandboxes2DSpec.map((sb) => (
            <div
              key={sb.id}
              className="p-4 rounded-lg bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 space-y-1"
            >
              <div className="text-xs font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
                {sb.title}
              </div>
              <div className="text-xs text-[#0B1F4D]/80 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/80">
                Linked Objective: {sb.linkedObjective}
              </div>
              <div className="text-[11px] font-medium text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
                Mechanism: {sb.mechanism}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Simulation Plan, Assessment Strategy, Outcomes & Technical Spec */}
      <div className="bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#0B1F4D]/85 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/85 transition-colors">
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
            06. Clinical Simulation & Assessment Plan
          </h4>
          <p>{deliverables.clinicalSimulationPlan}</p>
          <p>
            <strong>Assessment Strategy:</strong> {deliverables.assessmentStrategy}
          </p>
          <p>
            <strong>Expected Outcomes:</strong> {journeyMap.expectedOutcomes.join('; ')}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
            07. Screen Map & Technical Specification
          </h4>
          <p>
            <strong>UI Screen Map:</strong> {deliverables.uiScreenMap.join(' → ')}
          </p>
          <p>
            <strong>Technical Stack:</strong> {deliverables.technicalSpec}
          </p>
          <div className="pt-2 border-t border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 space-y-1 text-[11px] text-[#0B1F4D]/70 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/70">
            <div className="font-semibold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
              References & Clinical Limitations
            </div>
            {referencesAndLimitations.map((ref) => (
              <div key={ref}>• {ref}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
