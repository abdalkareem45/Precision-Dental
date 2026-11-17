import type { LectureMeta } from '../../../types/lecture';
import { KnowledgeCheck } from '../../common/KnowledgeCheck';
import { Ceph3DSandbox } from './Ceph3DSandbox';
import { Ceph2DLandmarksSandbox } from './Ceph2DLandmarksSandbox';
import { Ceph2DAnteroposteriorSandbox } from './Ceph2DAnteroposteriorSandbox';
import { Ceph2DVerticalIncisorSandbox } from './Ceph2DVerticalIncisorSandbox';
import { Ceph2DSoftTissueSuperimpositionSandbox } from './Ceph2DSoftTissueSuperimpositionSandbox';

interface Lecture5ViewProps {
  meta: LectureMeta;
}

export default function Lecture5View({ meta }: Lecture5ViewProps) {
  return (
    <div className="space-y-8">
      <Ceph3DSandbox />
      <Ceph2DLandmarksSandbox />
      <Ceph2DAnteroposteriorSandbox />
      <Ceph2DVerticalIncisorSandbox />
      <Ceph2DSoftTissueSuperimpositionSandbox />
      <KnowledgeCheck id="lec5-quiz" lectureNumber={meta.number} questions={meta.quiz} />
    </div>
  );
}
