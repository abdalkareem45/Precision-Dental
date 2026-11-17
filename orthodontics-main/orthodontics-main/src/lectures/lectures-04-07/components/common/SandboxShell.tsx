import { RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';

interface SandboxShellProps {
  id: string;
  kind: '3D Sandbox' | '2D Sandbox';
  title: string;
  instruction: string;
  onReset?: () => void;
  resetLabel?: string;
  headerRight?: ReactNode;
  children: ReactNode;
}

export function SandboxShell({
  id,
  kind,
  title,
  instruction,
  onReset,
  resetLabel = 'Reset',
  headerRight,
  children,
}: SandboxShellProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="bg-white border border-[#E6E8EC] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(11,31,77,0.04)] scroll-mt-24"
    >
      <div className="px-5 py-4 sm:px-6 border-b border-[#E6E8EC] flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-[#8A691B] mb-1">
            {kind}
            <span aria-hidden="true" className="mx-1.5 text-[#CBD5E1]">
              ·
            </span>
            <span className="text-[#475569] font-medium">{instruction}</span>
          </p>
          <h3 id={`${id}-heading`} className="text-lg sm:text-xl font-bold text-[#0B1F4D] leading-snug">
            {title}
          </h3>
        </div>
        <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
          {headerRight}
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0B1F4D] bg-[#FAF8F3] border border-[#E6E8EC] rounded-lg hover:border-[#1B3A8C] hover:text-[#1B3A8C] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{resetLabel}</span>
            </button>
          )}
        </div>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}
