import type { LectureMeta } from '../../../types/lecture';
import { KnowledgeCheck } from '../../common/KnowledgeCheck';
import { Opg3DSandbox } from './Opg3DSandbox';
import { Opg2DAnatomySandbox } from './Opg2DAnatomySandbox';
import { Opg2DStepsSandbox } from './Opg2DStepsSandbox';
import { Opg2DCasesModalitiesSandbox } from './Opg2DCasesModalitiesSandbox';
import { Opg2DGhostArtifactSandbox } from './Opg2DGhostArtifactSandbox';

interface Lecture6ViewProps {
  meta: LectureMeta;
}

export default function Lecture6View({ meta }: Lecture6ViewProps) {
  return (
    <div className="space-y-8">
      <Opg3DSandbox />
      <Opg2DAnatomySandbox />
      <Opg2DStepsSandbox />
      <Opg2DCasesModalitiesSandbox />
      <Opg2DGhostArtifactSandbox />
      <KnowledgeCheck id="lec6-quiz" lectureNumber={meta.number} questions={meta.quiz} />
    </div>
  );
}
