import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'motion/react';
import heroPrecisionImg from '@/src/assets/images/hero_precision_oral_med_1795805794805.jpg';
import { LECTURES } from '@/src/data/lectures';
import { calculateLectureCompletion, useLearningStore } from '@/src/store/useLearningStore';
import { BrandLogo } from './BrandLogo';

export const HomeDashboard: React.FC = () => {
  const {
    openLecture,
    progressByLecture,
    studySeconds,
    resetAllProgress,
    setTutorOpen,
  } = useLearningStore();

  const [query, setQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Foundational' | 'Intermediate' | 'Advanced'>('All');

  const analytics = useMemo(() => {
    const completions = LECTURES.map((l) => ({
      lecture: l,
      pct: calculateLectureCompletion(progressByLecture[l.id]),
      record: progressByLecture[l.id],
    }));
    const completedCount = completions.filter((c) => c.pct >= 80).length;
    const avgMastery = Math.round(
      completions.reduce((acc, c) => acc + c.pct, 0) / LECTURES.length
    );

    const quizRecords = completions.filter((c) => c.record?.assessmentScore !== null && c.record?.assessmentScore !== undefined);
    const quizPct = quizRecords.length
      ? Math.round(
          (quizRecords.reduce((acc, c) => acc + (c.record?.assessmentScore || 0), 0) /
            Math.max(1, quizRecords.reduce((acc, c) => acc + (c.record?.assessmentTotal || 1), 0))) *
            100
        )
      : null;

    const mostRecent = [...completions]
      .filter((c) => c.record?.lastVisitedAt)
      .sort((a, b) => (b.record?.lastVisitedAt || 0) - (a.record?.lastVisitedAt || 0))[0]?.lecture || LECTURES[0];

    return { completions, completedCount, avgMastery, quizPct, mostRecent };
  }, [progressByLecture]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const hits: Array<{
      lectureId: string;
      lectureNum: number;
      lectureTitle: string;
      matchType: string;
      matchText: string;
      section: 'hero' | 'knowledge-map' | 'visual-modules' | 'lab-3d' | 'lab-2d' | 'clinical-cases' | 'histopathology';
    }> = [];

    for (const lec of LECTURES) {
      if (
        lec.title.toLowerCase().includes(q) ||
        lec.specialty.toLowerCase().includes(q) ||
        lec.searchKeywords.some((k) => k.toLowerCase().includes(q))
      ) {
        const matchedKw = lec.searchKeywords.find((k) => k.toLowerCase().includes(q));
        hits.push({
          lectureId: lec.id,
          lectureNum: lec.number,
          lectureTitle: lec.title,
          matchType: matchedKw ? 'Concept / Keyword' : 'Lecture Title',
          matchText: matchedKw || lec.title,
          section: 'knowledge-map',
        });
      }
      for (const node of lec.knowledgeMap) {
        if (node.label.toLowerCase().includes(q) || node.summary.toLowerCase().includes(q)) {
          hits.push({
            lectureId: lec.id,
            lectureNum: lec.number,
            lectureTitle: lec.shortTitle,
            matchType: node.category,
            matchText: node.label,
            section: node.targetSection === 'revision' || node.targetSection === 'assessment' ? 'visual-modules' : node.targetSection,
          });
        }
      }
      for (const cs of lec.clinicalCases) {
        if (cs.title.toLowerCase().includes(q) || cs.learningFocus.toLowerCase().includes(q)) {
          hits.push({
            lectureId: lec.id,
            lectureNum: lec.number,
            lectureTitle: lec.shortTitle,
            matchType: 'Clinical Case',
            matchText: cs.title,
            section: 'clinical-cases',
          });
        }
      }
    }
    return hits.slice(0, 12);
  }, [query]);

  const filteredLectures = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LECTURES.filter((lec) => {
      const matchesDiff = difficultyFilter === 'All' || lec.difficulty === difficultyFilter;
      if (!matchesDiff) return false;
      if (!q) return true;
      return (
        lec.title.toLowerCase().includes(q) ||
        lec.shortTitle.toLowerCase().includes(q) ||
        lec.specialty.toLowerCase().includes(q) ||
        lec.searchKeywords.some((k) => k.toLowerCase().includes(q)) ||
        lec.knowledgeMap.some((n) => n.label.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q))
      );
    });
  }, [query, difficultyFilter]);

  const studyMins = Math.floor(studySeconds / 60);

  return (
    <div className="pb-16">
      {/* HERO SECTION */}
      <section
        id="hero-overview"
        className="relative overflow-hidden border-b border-[#E6E8EC] dark:border-[#1F2937] bg-[#0B1F4D] text-white"
      >
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${heroPrecisionImg})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0B1F4D] via-[#0B1F4D]/92 to-[#0B1220]/75 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 grid lg:grid-cols-12 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-3 px-3.5 py-2 rounded-xl bg-white/95 dark:bg-[#111827]/95 border border-[#C9A24B]/50 shadow-sm">
              <BrandLogo showArabic />
            </div>

            <div className="space-y-3">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#E4C16E]">
                Interactive Simulation Curriculum • 10 Clinical Lectures
              </p>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Oral Medicine Explorer
              </h1>
              <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
                Explore anatomy in 3D, test clinical hypotheses in diagnostic decision trees, examine histopathology
                slides, and solve virtual patient cases—built for active visual mastery rather than static reading.
              </p>
            </div>

            {/* Learning Philosophy Strip (10 / 30 / 60) */}
            <div className="grid grid-cols-3 gap-3 max-w-lg">
              <div className="rounded-xl bg-white/10 border border-white/15 px-3.5 py-2.5 backdrop-blur-sm">
                <div className="font-mono text-lg font-bold text-[#E4C16E] tabular-nums">10%</div>
                <div className="text-xs text-slate-200">Concise Reading</div>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/15 px-3.5 py-2.5 backdrop-blur-sm">
                <div className="font-mono text-lg font-bold text-[#38BDF8] tabular-nums">30%</div>
                <div className="text-xs text-slate-200">Visual Diagrams</div>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/15 px-3.5 py-2.5 backdrop-blur-sm">
                <div className="font-mono text-lg font-bold text-[#2DD4BF] tabular-nums">60%</div>
                <div className="text-xs text-slate-200">3D & 2D Labs</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => openLecture(analytics.mostRecent.id)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C9A24B] hover:bg-[#B89038] text-[#0B1F4D] font-display font-bold text-sm transition-colors shadow-sm cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                {Object.keys(progressByLecture).length > 0 ? `Resume Lecture ${analytics.mostRecent.number}` : 'Start Learning'}
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('lecture-grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/12 hover:bg-white/20 border border-white/25 text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                Explore All 10 Lectures
              </button>
              <button
                type="button"
                onClick={() => setTutorOpen(true, 'Oral Medicine Overview')}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#14B8A6]/20 hover:bg-[#14B8A6]/30 border border-[#14B8A6]/40 text-[#99F6E4] font-semibold text-sm transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Ask AI Clinical Tutor
              </button>
            </div>
          </motion.div>

          {/* Right Hero Featured Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="rounded-2xl overflow-hidden border border-[#C9A24B]/40 bg-[#0B1220]/90 shadow-2xl">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={heroPrecisionImg}
                  alt="3D translucent craniofacial anatomy showing trigeminal neural pathways"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#E4C16E]">
                      Active Clinical Atlas
                    </div>
                    <div className="text-sm font-semibold text-white">
                      30 Interactive 3D Sandboxes • 40 2D Clinical Labs
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[#1B3A8C] text-white font-mono text-xs font-semibold">
                    30 Cases
                  </span>
                </div>
              </div>
              <div className="p-4 grid grid-cols-3 divide-x divide-white/10 text-center">
                <div>
                  <div className="font-mono text-lg font-bold text-white tabular-nums">10</div>
                  <div className="text-[11px] text-slate-400">Modules</div>
                </div>
                <div>
                  <div className="font-mono text-lg font-bold text-[#38BDF8] tabular-nums">30</div>
                  <div className="text-[11px] text-slate-400">3D Labs</div>
                </div>
                <div>
                  <div className="font-mono text-lg font-bold text-[#C9A24B] tabular-nums">50</div>
                  <div className="text-[11px] text-slate-400">Assessments</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 mt-8">
        {/* GLOBAL SEARCH */}
        <section aria-label="Global clinical search">
          <div className="rounded-2xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] p-4 sm:p-5">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#1B3A8C] dark:text-[#3B82F6] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search diseases, symptoms, drugs, lab tests, or anatomy (e.g. Virchow, Indomethacin, DSG3, Sialolith, HbA1c)..."
                  aria-label="Search across all 10 Oral Medicine lectures"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] text-sm text-[#0B1F4D] dark:text-[#F9FAFB] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A8C] dark:focus:ring-[#3B82F6]"
                />
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {(['All', 'Foundational', 'Intermediate', 'Advanced'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficultyFilter(level)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      difficultyFilter === level
                        ? 'bg-[#1B3A8C] text-white dark:bg-[#3B82F6]'
                        : 'bg-[#FAF8F3] dark:bg-[#1F2937] text-[#0B1F4D]/75 dark:text-slate-300 hover:bg-[#E6E8EC] dark:hover:bg-slate-700'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Instant Search Jump Matches */}
            {searchResults.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#E6E8EC] dark:border-[#1F2937]">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  Direct Concept Jumps ({searchResults.length})
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {searchResults.map((hit, idx) => (
                    <button
                      key={`${hit.lectureId}-${idx}`}
                      type="button"
                      onClick={() => openLecture(hit.lectureId, hit.section)}
                      className="text-left p-2.5 rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] hover:border-[#1B3A8C] dark:hover:border-[#3B82F6] bg-[#FAF8F3] dark:bg-[#0B1220] transition-colors flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#0B1F4D] dark:text-white truncate">
                          {hit.matchText}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          Lec {String(hit.lectureNum).padStart(2, '0')} • {hit.matchType}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#1B3A8C] dark:text-[#3B82F6] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* PROGRESS ANALYTICS DASHBOARD */}
        <section id="progress-analytics" aria-labelledby="progress-heading">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 id="progress-heading" className="font-display text-xl font-bold text-[#0B1F4D] dark:text-white">
                Learning Progress & Mastery Analytics
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Tracked automatically in your browser as you explore 3D scenes, 2D sandboxes, cases, and assessments.
              </p>
            </div>
            <button
              type="button"
              onClick={resetAllProgress}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-[#111827] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Progress
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] p-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Completed Lectures</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="mt-2 font-mono text-2xl font-bold tabular-nums text-[#0B1F4D] dark:text-white">
                {analytics.completedCount} <span className="text-sm font-normal text-slate-400">/ 10</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] p-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Overall Mastery</span>
                <TrendingUp className="w-4 h-4 text-[#1B3A8C] dark:text-[#3B82F6]" />
              </div>
              <div className="mt-2 font-mono text-2xl font-bold tabular-nums text-[#0B1F4D] dark:text-white">
                {analytics.avgMastery}%
              </div>
            </div>

            <div className="rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] p-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Quiz Performance</span>
                <Award className="w-4 h-4 text-[#C9A24B]" />
              </div>
              <div className="mt-2 font-mono text-2xl font-bold tabular-nums text-[#0B1F4D] dark:text-white">
                {analytics.quizPct !== null ? `${analytics.quizPct}%` : '—'}
              </div>
            </div>

            <div className="rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] p-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Active Study Time</span>
                <Clock className="w-4 h-4 text-teal-600 dark:text-[#14B8A6]" />
              </div>
              <div className="mt-2 font-mono text-2xl font-bold tabular-nums text-[#0B1F4D] dark:text-white">
                {studyMins} <span className="text-sm font-normal text-slate-400">min</span>
              </div>
            </div>

            <div className="col-span-2 lg:col-span-1 rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] p-4 flex flex-col justify-between">
              <div className="text-xs text-slate-500 dark:text-slate-400">Current Focus</div>
              <button
                type="button"
                onClick={() => openLecture(analytics.mostRecent.id)}
                className="mt-2 text-left group cursor-pointer"
              >
                <div className="text-sm font-bold text-[#1B3A8C] dark:text-[#3B82F6] group-hover:underline truncate">
                  Lec {String(analytics.mostRecent.number).padStart(2, '0')}: {analytics.mostRecent.shortTitle}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Click to launch</div>
              </button>
            </div>
          </div>

          {/* 10-lecture mini progress spectrum bar */}
          <div className="mt-3 rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] p-4">
            <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-3">
              <span>Per-Lecture Completion Spectrum</span>
              <span className="font-mono">Click any bar to jump</span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {analytics.completions.map(({ lecture, pct }) => (
                <button
                  key={lecture.id}
                  type="button"
                  onClick={() => openLecture(lecture.id)}
                  className="text-left group cursor-pointer"
                  title={`${lecture.title} (${pct}%)`}
                >
                  <div className="h-14 rounded-lg bg-[#FAF8F3] dark:bg-[#0B1220] border border-[#E6E8EC] dark:border-[#1F2937] p-1 flex items-end overflow-hidden">
                    <div
                      className="w-full rounded bg-gradient-to-t from-[#1B3A8C] to-[#C9A24B] dark:from-[#3B82F6] dark:to-[#14B8A6] transition-all"
                      style={{ height: `${Math.max(8, pct)}%` }}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400 group-hover:text-[#1B3A8C] dark:group-hover:text-white">
                    <span>L{String(lecture.number).padStart(2, '0')}</span>
                    <span>{pct}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 10-LECTURE INTERACTIVE GRID */}
        <section id="lecture-grid" aria-labelledby="lectures-heading">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
            <div>
              <h2 id="lectures-heading" className="font-display text-2xl font-bold text-[#0B1F4D] dark:text-white">
                Oral Medicine Interactive Lectures
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Every lecture opens a dedicated 10-section workspace with 3D labs, 2D sandboxes, cases, slides, and quizzes.
              </p>
            </div>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredLectures.length} of {LECTURES.length} lectures
            </span>
          </div>

          {filteredLectures.length === 0 ? (
            <div className="rounded-2xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] p-10 text-center space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No lectures matched "{query}". Try searching a broader Oral Medicine keyword.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setDifficultyFilter('All');
                }}
                className="px-4 py-2 rounded-lg bg-[#1B3A8C] text-white text-xs font-semibold cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLectures.map((lec) => {
                const record = progressByLecture[lec.id];
                const pct = calculateLectureCompletion(record);
                const statusLabel = pct >= 80 ? 'Completed' : pct > 0 ? 'In Progress' : 'Not Started';

                return (
                  <article
                    key={lec.id}
                    className="group rounded-2xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] overflow-hidden hover:border-[#1B3A8C] dark:hover:border-[#3B82F6] transition-colors flex flex-col"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-[#0B1F4D]">
                      <img
                        src={lec.heroImage}
                        alt={lec.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/90 via-[#0B1220]/20 to-transparent" />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#0B1F4D]/90 text-[#E4C16E] border border-[#C9A24B]/40">
                          LECTURE {String(lec.number).padStart(2, '0')}
                        </span>
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-black/55 text-white backdrop-blur-sm">
                          {lec.difficulty}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
                        <span className="font-medium truncate">{lec.specialty}</span>
                        <span className="font-mono shrink-0">{lec.estimatedMinutes} min</span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="font-display text-lg font-bold text-[#0B1F4D] dark:text-white leading-snug">
                          {lec.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                          {lec.learningObjectives[0]}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-medium text-slate-600 dark:text-slate-400">{statusLabel}</span>
                            <span className="font-mono font-semibold tabular-nums text-[#1B3A8C] dark:text-[#3B82F6]">
                              {pct}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-[#FAF8F3] dark:bg-[#0B1220] border border-[#E6E8EC] dark:border-[#1F2937] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#1B3A8C] dark:bg-[#14B8A6] transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1">
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                            3D × 3 • 2D × 4 • Cases × {lec.clinicalCases.length}
                          </span>
                          <button
                            type="button"
                            onClick={() => openLecture(lec.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1B3A8C] hover:bg-[#0B1F4D] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            Launch
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Educational Disclaimer Footer */}
        <footer className="rounded-2xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] p-5 text-xs text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <strong className="text-[#0B1F4D] dark:text-slate-200">Educational Use Disclaimer:</strong> Precision Dental Oral Medicine Explorer
            transforms undergraduate Oral Medicine lecture notes into interactive educational simulations. Simulations and quiz scores do not replace qualified clinical supervision or institutional protocols.
          </div>
          <span className="font-mono shrink-0 text-[#C9A24B] font-semibold">PRECISION DENTAL</span>
        </footer>
      </div>
    </div>
  );
};
