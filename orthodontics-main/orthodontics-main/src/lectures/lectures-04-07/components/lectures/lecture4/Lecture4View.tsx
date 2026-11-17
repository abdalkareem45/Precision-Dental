import type { LectureMeta } from '../../../types/lecture';
import { KnowledgeCheck } from '../../common/KnowledgeCheck';
import { Tmd3DSandbox } from './Tmd3DSandbox';
import { Tmd2DEtiologySandbox } from './Tmd2DEtiologySandbox';
import { Tmd2DPalpationSandbox } from './Tmd2DPalpationSandbox';
import { Tmd2DSoundsSandbox } from './Tmd2DSoundsSandbox';
import { Tmd2DProtocolSandbox } from './Tmd2DProtocolSandbox';

interface Lecture4ViewProps {
  meta: LectureMeta;
}

export default function Lecture4View({ meta }: Lecture4ViewProps) {
  return (
    <div className="space-y-8">
      <Tmd3DSandbox />
      <Tmd2DEtiologySandbox />
      <Tmd2DPalpationSandbox />
      <Tmd2DSoundsSandbox />
      <Tmd2DProtocolSandbox />
      <KnowledgeCheck id="lec4-quiz" lectureNumber={meta.number} questions={meta.quiz} />
    </div>
  );
}
