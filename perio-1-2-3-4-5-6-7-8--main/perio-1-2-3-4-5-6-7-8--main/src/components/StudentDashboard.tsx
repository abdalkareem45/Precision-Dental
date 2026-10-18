import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  Bell,
  Sparkles,
  BookOpen,
  Plus,
  Trash2,
  Printer,
  FileCheck,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { IRAQI_5TH_STAGE_COMPETENCIES, ALAA_OMRAN_CLINICAL_PEARLS } from '../data/curriculumData';
import { IraqiCompetency, StudyReminder } from '../types/periodontics';
import { BrandLogo } from './BrandLogo';

export const StudentDashboard: React.FC = () => {
  // Competencies State (Persisted in localStorage if available)
  const [competencies, setCompetencies] = useState<IraqiCompetency[]>(() => {
    const saved = localStorage.getItem('perio3d_competencies');
    return saved ? JSON.parse(saved) : IRAQI_5TH_STAGE_COMPETENCIES;
  });

  // Reminders State
  const [reminders, setReminders] = useState<StudyReminder[]>(() => {
    const saved = localStorage.getItem('perio3d_reminders');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'rem-1',
            title: 'Review Stage IV Phenotype 2 Orthodontic Sequencing Rules',
            topic: 'Stage IV Management',
            scheduledDate: 'Tomorrow at 09:00 AM',
            completed: false,
            priority: 'High'
          },
          {
            id: 'rem-2',
            title: 'Practice 6-Site BOP & Plaque Index Charting on Molar Cases',
            topic: 'Clinical Diagnostics',
            scheduledDate: 'Thursday at 02:00 PM',
            completed: false,
            priority: 'High'
          },
          {
            id: 'rem-3',
            title: 'Re-memorize Miller Mobility 1-3 vs Glickman Furcation I-IV',
            topic: 'Anatomy & Indices',
            scheduledDate: 'Saturday at 11:00 AM',
            completed: true,
            priority: 'Medium'
          }
        ];
  });

  const [newReminderTitle, setNewReminderTitle] = useState<string>('');
  const [newReminderTopic, setNewReminderTopic] = useState<string>('Clinical Board Prep');
  const [expandedPearl, setExpandedPearl] = useState<number | null>(0);
  const [showChartModal, setShowChartModal] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('perio3d_competencies', JSON.stringify(competencies));
  }, [competencies]);

  useEffect(() => {
    localStorage.setItem('perio3d_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const incrementCompetency = (id: string) => {
    setCompetencies((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextCount = Math.min(c.requiredCount, c.completedCount + 1);
          return {
            ...c,
            completedCount: nextCount,
            verified: nextCount >= c.requiredCount
          };
        }
        return c;
      })
    );
  };

  const addReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderTitle.trim()) return;
    const newRem: StudyReminder = {
      id: `rem-${Date.now()}`,
      title: newReminderTitle.trim(),
      topic: newReminderTopic,
      scheduledDate: 'Scheduled Review',
      completed: false,
      priority: 'High'
    };
    setReminders([newRem, ...reminders]);
    setNewReminderTitle('');
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  // Overall Graduation Progress
  const totalRequired = competencies.reduce((acc, c) => acc + c.requiredCount, 0);
  const totalCompleted = competencies.reduce((acc, c) => acc + c.completedCount, 0);
  const graduationProgress = Math.round((totalCompleted / totalRequired) * 100);

  return (
    <div className="flex flex-col gap-6 w-full text-[#FAF8F3] font-sans">
      {/* Top Welcome Banner with Brand Logo and Tagline */}
      <div className="bg-gradient-to-r from-[#071433] via-[#0B1F4D] to-[#1B3A8C] p-6 md:p-8 rounded-3xl border border-[#E6E8EC]/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left">
          <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
            <BrandLogo size="sm" showText={false} showArabic={false} />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#C9A24B] bg-[#071433] px-3 py-1 rounded-full border border-[#C9A24B]/40 font-bold">
              Precision Dental • 5th-Stage Senior Hub
            </span>
            <span dir="rtl" className="text-xs font-arabic font-bold text-[#dfbe6e] px-2.5 py-0.5 rounded-full bg-[#0B1F4D] border border-[#C9A24B]/30">
              دقّة الأسنان
            </span>
            <span className="text-[11px] font-mono text-[#FAF8F3]/80 bg-[#071433]/80 px-3 py-1 rounded-full border border-[#E6E8EC]/20">
              Academic Year 2026–2027
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="text-xs font-bold text-[#C9A24B] uppercase tracking-wider">
              "Precision in Every Smile" • Advanced Dentistry for a Brighter Tomorrow
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#FAF8F3] tracking-tight">
              Clinical Board &amp; University Quota Tracker
            </h2>
          </div>
          <p className="text-xs md:text-sm text-[#E6E8EC]/85 max-w-2xl leading-relaxed">
            Aligned with Department of Periodontics clinical quotas, EFP S3 Level CPG, and Iraqi university teaching hospital standards.
          </p>
        </div>

        {/* Graduation Progress Circular / Stat Widget */}
        <div className="bg-[#071433]/90 backdrop-blur-md p-5 rounded-3xl border border-[#C9A24B]/40 shadow-xl text-center min-w-[210px]">
          <div className="text-xs font-semibold text-[#C9A24B] uppercase tracking-wider font-mono">
            Clinical Quota Completed
          </div>
          <div className="text-4xl font-black text-[#FAF8F3] font-mono my-1">
            {graduationProgress}%
          </div>
          <div className="text-xs text-[#E6E8EC]/70">
            {totalCompleted} of {totalRequired} clinical cases logged
          </div>
          <div className="w-full bg-[#0B1F4D] h-2 rounded-full mt-2.5 overflow-hidden border border-[#E6E8EC]/15">
            <div
              className="bg-gradient-to-r from-[#1B3A8C] to-[#C9A24B] h-full rounded-full transition-all duration-500"
              style={{ width: `${graduationProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Grid: Competency Logbook & Spaced Repetition Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Competencies Tracker (2 Columns) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                Senior Year Clinical Quota &amp; Competency Logbook
              </h3>
              <p className="text-xs text-slate-400">
                Tap "+" after each clinical patient encounter in the university teaching hospital.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
              Department Verified
            </span>
          </div>

          <div className="space-y-3">
            {competencies.map((comp) => {
              const percent = Math.round((comp.completedCount / comp.requiredCount) * 100);
              const isFinished = comp.completedCount >= comp.requiredCount;

              return (
                <div
                  key={comp.id}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{comp.title}</span>
                      {isFinished && (
                        <span className="text-[10px] text-emerald-300 bg-emerald-950 border border-emerald-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Complete
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {comp.description}
                    </p>
                    <div className="w-48 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div
                        className={`h-full rounded-full ${isFinished ? 'bg-emerald-400' : 'bg-blue-500'}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-mono font-bold text-sm text-cyan-300">
                        {comp.completedCount} / {comp.requiredCount}
                      </span>
                      <div className="text-[10px] text-slate-500">Procedures</div>
                    </div>

                    <button
                      onClick={() => incrementCompetency(comp.id)}
                      disabled={isFinished}
                      className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 text-white rounded-xl transition shadow cursor-pointer"
                      title="Log clinical procedure"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Study Resource Reminders & Spaced Repetition (1 Column) */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  Study Reminders
                </h3>
                <p className="text-xs text-slate-400">Integrated spaced-repetition prompts.</p>
              </div>
            </div>

            {/* Quick Add Reminder Form */}
            <form onSubmit={addReminder} className="space-y-2">
              <input
                type="text"
                value={newReminderTitle}
                onChange={(e) => setNewReminderTitle(e.target.value)}
                placeholder="Add high-yield study reminder..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-2">
                <select
                  value={newReminderTopic}
                  onChange={(e) => setNewReminderTopic(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-[11px] text-slate-300 flex-1"
                >
                  <option value="Clinical Board Prep">Clinical Board Prep</option>
                  <option value="Stage IV Management">Stage IV Management</option>
                  <option value="Anatomy & Probing">Anatomy &amp; Probing</option>
                  <option value="Staging & Grading">Staging &amp; Grading</option>
                </select>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            </form>

            {/* Reminder List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className={`p-3 rounded-2xl border text-xs transition flex items-start justify-between gap-2 ${
                    rem.completed
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={() => toggleReminder(rem.id)}
                      className={`w-4 h-4 rounded-md border flex items-center justify-center mt-0.5 transition ${
                        rem.completed ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {rem.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </button>
                    <div>
                      <div className={`font-medium ${rem.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {rem.title}
                      </div>
                      <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                        {rem.topic}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteReminder(rem.id)}
                    className="text-slate-600 hover:text-rose-400 transition p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Chart Generator Action */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => window.print()}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Print Periodontal Patient Chart Sheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: ALAA OMRAN HIGH-YIELD CLINICAL PEARLS FLASHCARD ACCORDION */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Assist. Prof. Alaa Omran Clinical Pearls &amp; Exam Tips
            </h3>
            <p className="text-xs text-slate-400">
              Crucial rules frequently tested in Iraqi 5th-stage viva voce oral board examinations.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-300 bg-amber-950 px-2.5 py-1 rounded-lg border border-amber-800">
            6 High-Yield Pearls
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ALAA_OMRAN_CLINICAL_PEARLS.map((pearl, pIdx) => {
            const isExp = expandedPearl === pIdx;
            return (
              <div
                key={pIdx}
                className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden transition"
              >
                <button
                  onClick={() => setExpandedPearl(isExp ? null : pIdx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-900/60 transition"
                >
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-950 border border-blue-700 flex items-center justify-center text-[10px] text-blue-300 font-mono">
                      {pIdx + 1}
                    </span>
                    {pearl.title}
                  </span>
                  {isExp ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>
                {isExp && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-900 bg-slate-950/40">
                    {pearl.pearl}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
