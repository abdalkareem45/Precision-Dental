import type { LectureMeta } from '../../../types/lecture';
import { KnowledgeCheck } from '../../common/KnowledgeCheck';
import { Models3DSandbox } from './Models3DSandbox';
import { Models2DPontKorkhausSandbox } from './Models2DPontKorkhausSandbox';
import { Models2DBoltonSandbox } from './Models2DBoltonSandbox';
import { Models2DCareyHoweSandbox } from './Models2DCareyHoweSandbox';
import { Models2DMixedDentitionSandbox } from './Models2DMixedDentitionSandbox';

interface Lecture7ViewProps {
  meta: LectureMeta;
}

export default function Lecture7View({ meta }: Lecture7ViewProps) {
  return (
    <div className="space-y-8">
      <Models3DSandbox />
      <Models2DPontKorkhausSandbox />
      <Models2DBoltonSandbox />
      <Models2DCareyHoweSandbox />
      <Models2DMixedDentitionSandbox />
      <KnowledgeCheck id="lec7-quiz" lectureNumber={meta.number} questions={meta.quiz} />
    </div>
  );
}
