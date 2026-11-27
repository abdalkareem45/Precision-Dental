# Repository source inventory

Generated with `node scripts/list-repository.mjs`.

This lists the current intended source files, not Git's tracked status. It excludes
dependencies, generated builds, ZIP backups, duplicate extractions, local secrets,
and npm-unused Bun lockfiles. No files are deleted by this command.

550 files. Regenerate after adding lectures or other files.

```text
website/
+-- .github/
|   \-- workflows/
|       \-- deploy.yml
+-- .zed/
|   \-- settings.json
+-- crown/
|   +-- public/
|   |   \-- assets/
|   |       \-- crown-virtual-lab/
|   |           +-- Bite_Registration_a32164be.pdf
|   |           +-- ElevenLabs_image_gpt-image-2-5-sunburst_A_brand_guideli_2026-10-13T17_08_46_a60636c3.png
|   |           +-- Lect_4_12e19f3e.pdf
|   |           +-- Lect_5_4a645c29.pdf
|   |           +-- Lect_6_pontic_7e6e6710.pdf
|   |           +-- Lecture_7__Impression_2024__7eee9057.pdf
|   |           +-- Lecture_7__Tissue_Management__-_manhal.abdulrahman_a3308e24.pdf
|   |           +-- Provisional__temporary__Restorations_46a0b2eb.pdf
|   |           +-- Shade_Selection_f0f9cf15.pdf
|   |           \-- Try-in___Cementation__09efe577.pdf
|   +-- src/
|   |   +-- lectures/
|   |   |   \-- virtual-lab/
|   |   |       +-- components/
|   |   |       |   +-- quiz/
|   |   |       |   |   +-- LectureQuizModule.tsx
|   |   |       |   |   \-- LectureQuizSkeleton.tsx
|   |   |       |   +-- sandboxes/
|   |   |       |   |   +-- ClinicalCaseSandbox.tsx
|   |   |       |   |   +-- DiagnosticPlannerSandbox.tsx
|   |   |       |   |   +-- MaterialComparisonSandbox.tsx
|   |   |       |   |   \-- ProcedureFlowSandbox.tsx
|   |   |       |   +-- three/
|   |   |       |   |   +-- buildLectureScene.ts
|   |   |       |   |   +-- Dental3DSandbox.tsx
|   |   |       |   |   \-- dentalGeometry.ts
|   |   |       |   +-- visuals/
|   |   |       |   |   +-- VisualLearningGrid.tsx
|   |   |       |   |   \-- VisualLearningGridSkeleton.tsx
|   |   |       |   +-- BrandMark.tsx
|   |   |       |   \-- ProgressDashboard.tsx
|   |   |       +-- data/
|   |   |       |   +-- lectures.ts
|   |   |       |   +-- lecturesPart1.ts
|   |   |       |   \-- lecturesPart2.ts
|   |   |       +-- store/
|   |   |       |   +-- progress.ts
|   |   |       |   \-- useLabStore.ts
|   |   |       +-- tests/
|   |   |       |   +-- content.test.ts
|   |   |       |   +-- run.mjs
|   |   |       |   +-- store.test.ts
|   |   |       |   \-- three.test.ts
|   |   |       +-- types/
|   |   |       |   \-- lecture.ts
|   |   |       +-- App.tsx
|   |   |       +-- index.css
|   |   |       +-- README.md
|   |   |       +-- registry.ts
|   |   |       \-- sourcePdfs.ts
|   |   +-- App.tsx
|   |   +-- Foundations.tsx
|   |   +-- index.css
|   |   +-- main.tsx
|   |   \-- navigation.ts
|   +-- .env.example
|   +-- .gitignore
|   +-- index.html
|   +-- metadata.json
|   +-- package-lock.json
|   +-- package.json
|   +-- README.md
|   +-- tsconfig.json
|   \-- vite.config.ts
+-- endo-1-main/
|   +-- public/
|   |   \-- assets/
|   |       \-- endo-curriculum/
|   |           \-- aistudio/
|   |               +-- ElevenLabs_image_gpt-image-2-5-sunburst_A_brand_guideli_2026-10-13T17_08_46_a60636c3.png
|   |               +-- Endodontic_Radiography_lec_4_3d110457.pdf
|   |               +-- Lecture_4.pdf_intra_canal_bd9ce3c6.pdf
|   |               +-- Lecture_5__2__d85cde41.pdf
|   |               +-- Lecture_7_0b8100ae.pdf
|   |               +-- Lecture_8_4641b218.pdf
|   |               +-- Lecture_9_74931c72.pdf
|   |               \-- workinglength.pdf_lec_3_3b4f5f88.pdf
|   +-- src/
|   |   +-- components/
|   |   |   +-- CaseSimulator.tsx
|   |   |   +-- ClinicalExamExplorer.tsx
|   |   |   +-- ClinicalTestStation.tsx
|   |   |   +-- CrackedToothDetectives.tsx
|   |   |   +-- DifferentialDiagnosisComparator.tsx
|   |   |   +-- HydrodynamicTubuleLab.tsx
|   |   |   +-- IntrapulpalPressureChamber.tsx
|   |   |   +-- LayerControls.tsx
|   |   |   +-- LectureNotesPanel.tsx
|   |   |   +-- NeuroActionPotentialLab.tsx
|   |   |   +-- PainDiagnosisExplorer.tsx
|   |   |   +-- PrecisionDentalLogo.tsx
|   |   |   \-- ThreeCanvas.tsx
|   |   +-- data/
|   |   |   +-- lectureData.ts
|   |   |   \-- painMnemonics.ts
|   |   +-- lectures/
|   |   |   +-- curriculum/
|   |   |   |   +-- components/
|   |   |   |   |   +-- sandboxes2d/
|   |   |   |   |   |   +-- Lecture2DSandboxes.tsx
|   |   |   |   |   |   \-- QuizAndCaseModule.tsx
|   |   |   |   |   +-- sandboxes3d/
|   |   |   |   |   |   +-- Emergencies3DSandboxes.tsx
|   |   |   |   |   |   +-- FillingMaterials3DSandboxes.tsx
|   |   |   |   |   |   +-- InstrumentsI3DSandboxes.tsx
|   |   |   |   |   |   +-- InstrumentsII3DSandboxes.tsx
|   |   |   |   |   |   +-- Obturation3DSandboxes.tsx
|   |   |   |   |   |   +-- Radiography3DSandboxes.tsx
|   |   |   |   |   |   \-- WorkingLength3DSandboxes.tsx
|   |   |   |   |   +-- BrandLogo.tsx
|   |   |   |   |   +-- LectureWorkspace.tsx
|   |   |   |   |   +-- ProgressOverviewModal.tsx
|   |   |   |   |   \-- ThreeSandboxShell.tsx
|   |   |   |   +-- data/
|   |   |   |   |   +-- lectures.ts
|   |   |   |   |   \-- quizzesAndCases.ts
|   |   |   |   +-- tests/
|   |   |   |   |   +-- curriculum.test.tsx
|   |   |   |   |   +-- run.mjs
|   |   |   |   |   \-- three-mock.ts
|   |   |   |   +-- three/
|   |   |   |   |   +-- dentalGeometry.ts
|   |   |   |   |   \-- studioEngine.ts
|   |   |   |   +-- types/
|   |   |   |   |   \-- lecture.ts
|   |   |   |   +-- App.tsx
|   |   |   |   +-- curriculum.css
|   |   |   |   +-- progress.ts
|   |   |   |   \-- README.md
|   |   |   \-- lecture-02/
|   |   |       +-- components/
|   |   |       |   +-- GrandVisualizerSandbox.tsx
|   |   |       |   +-- MandibularSandbox.tsx
|   |   |       |   +-- MaxillarySupplementalSandbox.tsx
|   |   |       |   +-- NeurophysiologySandbox.tsx
|   |   |       |   +-- PharmacologySandbox.tsx
|   |   |       |   \-- ReferredPainSandbox.tsx
|   |   |       \-- App.tsx
|   |   +-- types/
|   |   |   \-- endodontics.ts
|   |   +-- App.tsx
|   |   +-- index.css
|   |   +-- Lecture01.tsx
|   |   \-- main.tsx
|   +-- .env.example
|   +-- .gitignore
|   +-- index.html
|   +-- metadata.json
|   +-- package-lock.json
|   +-- package.json
|   +-- README.md
|   +-- tsconfig.json
|   \-- vite.config.ts
+-- oral surgery/
|   +-- src/
|   |   +-- components/
|   |   |   +-- DiagnosticSimulator.tsx
|   |   |   +-- Lecture1.tsx
|   |   |   +-- Lecture2.tsx
|   |   |   +-- LectureClassification.tsx
|   |   |   +-- LectureExam.tsx
|   |   |   +-- LectureIntro.tsx
|   |   |   +-- LectureManagement.tsx
|   |   |   +-- LectureSpecial.tsx
|   |   |   +-- Navigation.tsx
|   |   |   +-- QuizEngine.tsx
|   |   |   \-- UI.tsx
|   |   +-- App.tsx
|   |   +-- index.css
|   |   \-- main.tsx
|   +-- .env.example
|   +-- .gitignore
|   +-- index.html
|   +-- metadata.json
|   +-- package-lock.json
|   +-- package.json
|   +-- README.md
|   +-- tsconfig.json
|   \-- vite.config.ts
+-- oral-med-12-main/
|   \-- oral-med-12-main/
|       +-- src/
|       |   +-- components/
|       |   |   +-- 2d/
|       |   |   |   \-- OralCavity2D.tsx
|       |   |   +-- 3d/
|       |   |   |   +-- HsvVirion3D.tsx
|       |   |   |   +-- OralCavity3D.tsx
|       |   |   |   +-- OralLesion3D.tsx
|       |   |   |   +-- Periodontal3D.tsx
|       |   |   |   +-- RamsayReye3D.tsx
|       |   |   |   +-- SkinTarget3D.tsx
|       |   |   |   +-- TrigeminalHead3D.tsx
|       |   |   |   +-- Virion3D.tsx
|       |   |   |   \-- ZosterDermatome3D.tsx
|       |   |   +-- brand/
|       |   |   |   \-- PrecisionDentalLogo.tsx
|       |   |   +-- dashboard/
|       |   |   |   \-- MainDashboard.tsx
|       |   |   +-- lecture1/
|       |   |   |   +-- AntiviralNodeGraph.tsx
|       |   |   |   +-- DiascopyMorphologyLab.tsx
|       |   |   |   +-- HsvInteractiveSuite.tsx
|       |   |   |   +-- Lecture1MasterView.tsx
|       |   |   |   +-- Lecture1QuizView.tsx
|       |   |   |   \-- VzvInteractiveSuite.tsx
|       |   |   +-- modules/
|       |   |   |   +-- DiseaseModuleView.tsx
|       |   |   |   \-- Virion3DModuleExplorer.tsx
|       |   |   +-- navigation/
|       |   |   |   +-- ClinicalHeader.tsx
|       |   |   |   \-- SidebarNavigation.tsx
|       |   |   +-- procedures/
|       |   |   |   +-- CmvDiagnosticDecisionTree.tsx
|       |   |   |   +-- CoxsackieDiagnosticDecisionTree.tsx
|       |   |   |   +-- NugDebridementSimulator.tsx
|       |   |   |   +-- PatchTestSimulator.tsx
|       |   |   |   \-- SjsScortenCalculator.tsx
|       |   |   +-- sandboxes/
|       |   |   |   +-- DiagnosticReasoningSandbox.tsx
|       |   |   |   +-- HistopathologySandbox.tsx
|       |   |   |   +-- MicrobiologyLabSandbox.tsx
|       |   |   |   +-- OralDiseaseSimulatorSandbox.tsx
|       |   |   |   \-- TreatmentPlanningSandbox.tsx
|       |   |   +-- study/
|       |   |   |   +-- ActiveRecallQuiz.tsx
|       |   |   |   +-- AIAssistantModal.tsx
|       |   |   |   +-- DifferentialMatrix.tsx
|       |   |   |   +-- FeynmanTeachBack.tsx
|       |   |   |   \-- FlashcardsViewer.tsx
|       |   |   \-- ui/
|       |   |       +-- ClinicalImageModal.tsx
|       |   |       \-- TopNavigation.tsx
|       |   +-- context/
|       |   |   +-- LearningContext.tsx
|       |   |   \-- VirionSceneContext.tsx
|       |   +-- data/
|       |   |   +-- clinicalCases.ts
|       |   |   +-- flashcardsData.ts
|       |   |   +-- lecture1Data.ts
|       |   |   +-- lectureData.ts
|       |   |   \-- quizData.ts
|       |   +-- services/
|       |   |   \-- geminiService.ts
|       |   +-- types/
|       |   |   \-- index.ts
|       |   +-- App.tsx
|       |   +-- index.css
|       |   \-- main.tsx
|       +-- .env.example
|       +-- .gitignore
|       +-- index.html
|       +-- metadata.json
|       +-- package-lock.json
|       +-- package.json
|       +-- tsconfig.json
|       \-- vite.config.ts
+-- oral-med-explorer/
|   +-- public/
|   |   \-- assets/
|   |       \-- aistudio/
|   |           +-- 2025_tmj_4cbe5ae2.pdf
|   |           +-- ElevenLabs_image_gpt-image-2-5-sunburst_A_brand_guideli_2026-10-13T17_08_46_a60636c3.png
|   |           +-- FACIAL_PAIN_1_2_LEC_8242a562.pdf
|   |           +-- lec_1_intro_36165713.pdf
|   |           +-- lec_7_4f13f7cb.pdf
|   |           +-- lecture_2_2025_46dabbf2.pdf
|   |           +-- lecture_3_2025_5193f14e.pdf
|   |           +-- lecture_4_2025_141bfc41.pdf
|   |           +-- lecture_5_2024_9e792a21.pdf
|   |           +-- lecture_7_2025_5a091e97.pdf
|   |           +-- lecture_sex_2024docx_bac30f50.pdf
|   |           +-- Pigmented_lesions_of_oral_mucosa_1_6d68ea00.pdf
|   |           +-- Red_and_White_Lesions_of_the_Oral_Mucosa__2_and_3_ccf66081.pdf
|   |           +-- The_first_and_second_lecture_of_salivary_gland___baba599a.pdf
|   |           \-- Ulcerative__Vesicular__Bullous_Lesions_3_and_4_9bc03851.pdf
|   +-- src/
|   |   +-- assets/
|   |   |   \-- images/
|   |   |       +-- hero_precision_oral_med_1795805794805.jpg
|   |   |       +-- topic_hematology_coagulation_1795805797541.jpg
|   |   |       +-- topic_oral_mucosa_lesions_1795805797106.jpg
|   |   |       +-- topic_orofacial_neuralgia_1795805795788.jpg
|   |   |       +-- topic_salivary_glands_1795805796401.jpg
|   |   |       \-- topic_tmj_kinematics_1795805795480.jpg
|   |   +-- components/
|   |   |   +-- lecture/
|   |   |   |   +-- AssessmentCenter.tsx
|   |   |   |   +-- ClinicalCasesSection.tsx
|   |   |   |   +-- HistopathologyLab.tsx
|   |   |   |   +-- InteractiveHero.tsx
|   |   |   |   +-- KnowledgeMap.tsx
|   |   |   |   +-- Lab2DSection.tsx
|   |   |   |   +-- Lab3DSection.tsx
|   |   |   |   +-- LectureWorkspace.tsx
|   |   |   |   +-- RevisionCenter.tsx
|   |   |   |   \-- VisualModulesSection.tsx
|   |   |   +-- three/
|   |   |   |   +-- sceneBuilders.ts
|   |   |   |   \-- ThreeSandboxViewport.tsx
|   |   |   +-- AiTutorDrawer.tsx
|   |   |   +-- BrandLogo.tsx
|   |   |   +-- ErrorBoundary.tsx
|   |   |   +-- HomeDashboard.tsx
|   |   |   +-- ThreeCanvasBoundary.tsx
|   |   |   \-- TopNavbar.tsx
|   |   +-- data/
|   |   |   \-- lectures/
|   |   |       +-- index.ts
|   |   |       +-- lecture01.ts
|   |   |       +-- lecture02.ts
|   |   |       +-- lecture03.ts
|   |   |       +-- lecture04.ts
|   |   |       +-- lecture05.ts
|   |   |       +-- lecture06.ts
|   |   |       +-- lecture07.ts
|   |   |       +-- lecture08.ts
|   |   |       +-- lecture09.ts
|   |   |       \-- lecture10.ts
|   |   +-- hooks/
|   |   |   \-- useCanvasResize.ts
|   |   +-- store/
|   |   |   \-- useLearningStore.ts
|   |   +-- types/
|   |   |   \-- lecture.ts
|   |   +-- App.tsx
|   |   +-- index.css
|   |   \-- main.tsx
|   +-- index.html
|   +-- package-lock.json
|   +-- package.json
|   +-- tsconfig.json
|   \-- vite.config.ts
+-- orthodontics-main/
|   \-- orthodontics-main/
|       +-- public/
|       |   \-- assets/
|       |       \-- orthodontics-04-07/
|       |           +-- ElevenLabs_image_gpt-image-2-5-sunburst_A_brand_guideli_2026-10-13T17_08_46_a60636c3.png
|       |           +-- Ortho.4._new_b8f99839.pdf
|       |           +-- Ortho.5._neew_d0193574.pdf
|       |           +-- Ortho.6._new_c554aea8.pdf
|       |           \-- Ortho.7._new_c29a5c2c.pdf
|       +-- src/
|       |   +-- components/
|       |   |   +-- clinical/
|       |   |   |   +-- ClinicalCaseSimulator.tsx
|       |   |   |   \-- ExamQuizModule.tsx
|       |   |   +-- common/
|       |   |   |   +-- AcademyOverview.tsx
|       |   |   |   +-- BrandHeader.tsx
|       |   |   |   \-- BrandLogo.tsx
|       |   |   +-- lab/
|       |   |   |   \-- VirtualLabView.tsx
|       |   |   +-- lecture1_2/
|       |   |   |   \-- Lecture1And2View.tsx
|       |   |   +-- lecture3/
|       |   |   |   \-- Lecture3View.tsx
|       |   |   +-- three/
|       |   |   |   +-- ThreeCraniofacialProfileScene.tsx
|       |   |   |   \-- ThreeDentalArchScene.tsx
|       |   |   \-- tools/
|       |   |       +-- BsiIncisorSimulator.tsx
|       |   |       +-- CephalometricCaliper.tsx
|       |   |       \-- SmileAestheticAnalyzer.tsx
|       |   +-- lectures/
|       |   |   \-- lectures-04-07/
|       |   |       +-- components/
|       |   |       |   +-- common/
|       |   |       |   |   +-- BrandLogo.tsx
|       |   |       |   |   +-- KnowledgeCheck.tsx
|       |   |       |   |   +-- SandboxShell.tsx
|       |   |       |   |   \-- ThreeViewport.tsx
|       |   |       |   \-- lectures/
|       |   |       |       +-- lecture4/
|       |   |       |       |   +-- Lecture4View.tsx
|       |   |       |       |   +-- Tmd2DEtiologySandbox.tsx
|       |   |       |       |   +-- Tmd2DPalpationSandbox.tsx
|       |   |       |       |   +-- Tmd2DProtocolSandbox.tsx
|       |   |       |       |   +-- Tmd2DSoundsSandbox.tsx
|       |   |       |       |   \-- Tmd3DSandbox.tsx
|       |   |       |       +-- lecture5/
|       |   |       |       |   +-- Ceph2DAnteroposteriorSandbox.tsx
|       |   |       |       |   +-- Ceph2DLandmarksSandbox.tsx
|       |   |       |       |   +-- Ceph2DSoftTissueSuperimpositionSandbox.tsx
|       |   |       |       |   +-- Ceph2DVerticalIncisorSandbox.tsx
|       |   |       |       |   +-- Ceph3DSandbox.tsx
|       |   |       |       |   \-- Lecture5View.tsx
|       |   |       |       +-- lecture6/
|       |   |       |       |   +-- Lecture6View.tsx
|       |   |       |       |   +-- Opg2DAnatomySandbox.tsx
|       |   |       |       |   +-- Opg2DCasesModalitiesSandbox.tsx
|       |   |       |       |   +-- Opg2DGhostArtifactSandbox.tsx
|       |   |       |       |   +-- Opg2DStepsSandbox.tsx
|       |   |       |       |   \-- Opg3DSandbox.tsx
|       |   |       |       \-- lecture7/
|       |   |       |           +-- Lecture7View.tsx
|       |   |       |           +-- Models2DBoltonSandbox.tsx
|       |   |       |           +-- Models2DCareyHoweSandbox.tsx
|       |   |       |           +-- Models2DMixedDentitionSandbox.tsx
|       |   |       |           +-- Models2DPontKorkhausSandbox.tsx
|       |   |       |           \-- Models3DSandbox.tsx
|       |   |       +-- data/
|       |   |       |   +-- assets.ts
|       |   |       |   \-- lecturesMeta.ts
|       |   |       +-- types/
|       |   |       |   \-- lecture.ts
|       |   |       +-- App.tsx
|       |   |       +-- content.css
|       |   |       +-- content.test.mjs
|       |   |       \-- README.md
|       |   +-- types/
|       |   |   \-- ortho.ts
|       |   +-- App.tsx
|       |   +-- index.css
|       |   +-- main.tsx
|       |   \-- navigation.ts
|       +-- .env.example
|       +-- .gitignore
|       +-- index.html
|       +-- metadata.json
|       +-- package-lock.json
|       +-- package.json
|       +-- README.md
|       +-- tsconfig.json
|       \-- vite.config.ts
+-- peidatiric-10-main/
|   \-- peidatiric-10-main/
|       +-- src/
|       |   +-- components/
|       |   |   +-- 3d/
|       |   |   |   +-- BehavioralClinic3D.tsx
|       |   |   |   +-- DentalLuxation3D.tsx
|       |   |   |   +-- PediatricArch3D.tsx
|       |   |   |   +-- SystemicPatient3D.tsx
|       |   |   |   \-- ToothTrauma3D.tsx
|       |   |   +-- brand/
|       |   |   |   +-- BrandHeader.tsx
|       |   |   |   \-- BrandLogo.tsx
|       |   |   +-- lectures/
|       |   |   |   +-- GrandRoundsQuiz.tsx
|       |   |   |   +-- Lec10LuxationAvulsion.tsx
|       |   |   |   +-- Lec11RootFracturesBurns.tsx
|       |   |   |   +-- Lec1Exam.tsx
|       |   |   |   +-- Lec2Intraoral.tsx
|       |   |   |   +-- Lec3Behavior.tsx
|       |   |   |   +-- Lec7TraumaExamFractures.tsx
|       |   |   |   +-- Lec8VitalPulpImmature.tsx
|       |   |   |   +-- Lec9ReactionsToTrauma.tsx
|       |   |   |   \-- LecSystemicSpecialNeeds.tsx
|       |   |   \-- tools/
|       |   |       +-- AhaProphylaxisCalculator.tsx
|       |   |       +-- AvulsionEmergencyTimer.tsx
|       |   |       +-- BinetIqCalculator.tsx
|       |   |       +-- EllisDaveyExplorer.tsx
|       |   |       \-- PlateletRiskGauge.tsx
|       |   +-- types/
|       |   |   \-- index.ts
|       |   +-- utils/
|       |   |   \-- audio.ts
|       |   +-- App.tsx
|       |   +-- index.css
|       |   \-- main.tsx
|       +-- .env.example
|       +-- .gitignore
|       +-- index.html
|       +-- metadata.json
|       +-- package-lock.json
|       +-- package.json
|       +-- tsconfig.json
|       \-- vite.config.ts
+-- perio-1-2-3-4-5-6-7-8--main/
|   \-- perio-1-2-3-4-5-6-7-8--main/
|       +-- public/
|       |   +-- periodontics-mechanics.css
|       |   \-- periodontics-mechanics.html
|       +-- src/
|       |   +-- components/
|       |   |   +-- boneLoss/
|       |   |   |   +-- AIPeriodontology.tsx
|       |   |   |   +-- BoneLoss3DCanvas.tsx
|       |   |   |   +-- BoneLossMaster.tsx
|       |   |   |   +-- ComparisonMode.tsx
|       |   |   |   +-- DefectSimulator.tsx
|       |   |   |   +-- FurcationModule.tsx
|       |   |   |   +-- InteractiveLecture.tsx
|       |   |   |   +-- OsseousMorphology.tsx
|       |   |   |   +-- Periodontal3DCrossSection.tsx
|       |   |   |   +-- QuizModule.tsx
|       |   |   |   +-- RapidReview.tsx
|       |   |   |   \-- types.ts
|       |   |   +-- cpg/
|       |   |   |   +-- CpgCaseWalkthrough.tsx
|       |   |   |   +-- CpgCrossSection2D.tsx
|       |   |   |   +-- CpgDecisionTree2D.tsx
|       |   |   |   +-- CpgGuidelineMaster.tsx
|       |   |   |   +-- CpgQuizModule.tsx
|       |   |   |   \-- CpgStepViewer3D.tsx
|       |   |   +-- furcation/
|       |   |   |   +-- Furcation3DViewer.tsx
|       |   |   |   +-- FurcationAnatomy2D.tsx
|       |   |   |   +-- FurcationCases.tsx
|       |   |   |   +-- FurcationMaster.tsx
|       |   |   |   \-- FurcationQuizModule.tsx
|       |   |   +-- medComp/
|       |   |   |   +-- MedCompCases.tsx
|       |   |   |   +-- MedCompClinicalMatrix2D.tsx
|       |   |   |   +-- MedCompQuizModule.tsx
|       |   |   |   +-- MedicallyCompromised3D.tsx
|       |   |   |   \-- MedicallyCompromisedMaster.tsx
|       |   |   +-- AnatomyQuizModal.tsx
|       |   |   +-- BoardQuizModule.tsx
|       |   |   +-- BrandLogo.tsx
|       |   |   +-- ClinicalCasesModule.tsx
|       |   |   +-- ClinicalExamSimulator.tsx
|       |   |   +-- ComparisonModeModal.tsx
|       |   |   +-- DentalLaboratory.tsx
|       |   |   +-- GuidedLessonModal.tsx
|       |   |   +-- InteractivePanoramicCorrelator.tsx
|       |   |   +-- InteractiveTimelinePlanner.tsx
|       |   |   +-- MultiToothSandbox.tsx
|       |   |   +-- Navbar.tsx
|       |   |   +-- NumberedLectureBar.tsx
|       |   |   +-- PeriodonticsByKareemTab.tsx
|       |   |   +-- PermanentOdontogram.tsx
|       |   |   +-- StageIV3DViewer.tsx
|       |   |   +-- StagingGradingCalculator.tsx
|       |   |   +-- StudentDashboard.tsx
|       |   |   +-- StudentProgressTracker.tsx
|       |   |   +-- ThreeBopViewer.tsx
|       |   |   +-- ThreeFurcationSimulator.tsx
|       |   |   +-- ThreeMobilitySimulator.tsx
|       |   |   +-- ThreePeriodontalSandbox.tsx
|       |   |   +-- ThreePlaqueViewer.tsx
|       |   |   +-- ToothInfoPanel.tsx
|       |   |   +-- ToothViewer3D.tsx
|       |   |   +-- TreatmentPlanningModule.tsx
|       |   |   +-- VisualMechanicsLab.tsx
|       |   |   \-- VisualMechanicsPeriodontics.tsx
|       |   +-- data/
|       |   |   +-- curriculumData.ts
|       |   |   \-- permanentTeethData.ts
|       |   +-- types/
|       |   |   \-- periodontics.ts
|       |   +-- utils/
|       |   |   \-- dentalAnatomy3D.ts
|       |   +-- App.tsx
|       |   +-- index.css
|       |   \-- main.tsx
|       +-- .env.example
|       +-- .gitignore
|       +-- index.html
|       +-- metadata.json
|       +-- package-lock.json
|       +-- package.json
|       +-- tsconfig.json
|       \-- vite.config.ts
+-- prevention-1-9--main/
|   \-- prevention-1-9--main/
|       +-- src/
|       |   +-- components/
|       |   |   +-- visuals/
|       |   |   |   +-- 2d/
|       |   |   |   |   +-- Lec1Visuals.tsx
|       |   |   |   |   +-- Lec2Visuals.tsx
|       |   |   |   |   +-- Lec3Visuals.tsx
|       |   |   |   |   +-- Lec4Visuals.tsx
|       |   |   |   |   +-- Lec5Visuals.tsx
|       |   |   |   |   +-- Lec6Visuals.tsx
|       |   |   |   |   +-- Lec7Visuals.tsx
|       |   |   |   |   +-- Lec8Visuals.tsx
|       |   |   |   |   \-- Lec9Visuals.tsx
|       |   |   |   \-- 3d/
|       |   |   |       +-- BiofilmStephan3D.tsx
|       |   |   |       +-- DentalImplant3D.tsx
|       |   |   |       +-- FluorideCrystal3D.tsx
|       |   |   |       +-- HealthDimensions3D.tsx
|       |   |   |       +-- MinimalInvasive3D.tsx
|       |   |   |       +-- Organogenesis3D.tsx
|       |   |   |       +-- PeriodontalPocket3D.tsx
|       |   |   |       +-- SealantProcedure3D.tsx
|       |   |   |       \-- SweetenersBiofilm3D.tsx
|       |   |   +-- BrandHeader.tsx
|       |   |   +-- BrandLogo.tsx
|       |   |   +-- ClinicalPearlsModal.tsx
|       |   |   +-- LectureQuiz.tsx
|       |   |   +-- SearchModal.tsx
|       |   |   \-- ThreeCanvasContainer.tsx
|       |   +-- data/
|       |   |   \-- lecturesData.ts
|       |   +-- types/
|       |   |   \-- dental.ts
|       |   +-- App.tsx
|       |   +-- index.css
|       |   \-- main.tsx
|       +-- .env.example
|       +-- .gitignore
|       +-- index.html
|       +-- metadata.json
|       +-- package-lock.json
|       +-- package.json
|       +-- tsconfig.json
|       \-- vite.config.ts
+-- pros-main/
|   +-- public/
|   |   \-- assets/
|   |       \-- prostho-studio/
|   |           +-- pros_4_website_2fa347ec.pdf
|   |           +-- pros_5_website_7589ac99.pdf
|   |           +-- pros_6_website_5f6a27ef.pdf
|   |           +-- pros_7_and_8_website_43ed1976.pdf
|   |           \-- pros_9_and_10_website_a6e40e0e.pdf
|   +-- src/
|   |   +-- lectures/
|   |   |   \-- simulation-studio/
|   |   |       +-- components/
|   |   |       |   +-- ChallengeQuizSection.tsx
|   |   |       |   +-- ClinicalCasesSection.tsx
|   |   |       |   +-- ConceptSection.tsx
|   |   |       |   +-- HeroScene.tsx
|   |   |       |   +-- PrecisionLogo.tsx
|   |   |       |   +-- ProgressModal.tsx
|   |   |       |   +-- StoryboardBlueprintSection.tsx
|   |   |       |   +-- ThreeDProsthoSandbox.tsx
|   |   |       |   +-- TopNav.tsx
|   |   |       |   \-- TwoDSandboxes.tsx
|   |   |       +-- data/
|   |   |       |   +-- lectures.ts
|   |   |       |   +-- lecturesPart1.ts
|   |   |       |   \-- lecturesPart2.ts
|   |   |       +-- tests/
|   |   |       |   +-- run.mjs
|   |   |       |   \-- suite.tsx
|   |   |       +-- types/
|   |   |       |   \-- prosthodontics.ts
|   |   |       +-- utils/
|   |   |       |   +-- assets.ts
|   |   |       |   +-- progress.ts
|   |   |       |   +-- resources.ts
|   |   |       |   \-- webglModels.ts
|   |   |       +-- App.tsx
|   |   |       +-- index.css
|   |   |       +-- index.ts
|   |   |       \-- README.md
|   |   +-- App.tsx
|   |   +-- index.css
|   |   +-- main.tsx
|   |   \-- SubjectApp.tsx
|   +-- .env.example
|   +-- .gitignore
|   +-- index.html
|   +-- metadata.json
|   +-- package-lock.json
|   +-- package.json
|   +-- README.md
|   +-- tsconfig.json
|   \-- vite.config.ts
+-- scripts/
|   +-- build-pages.mjs
|   +-- crown.browser.test.mjs
|   +-- dependency-fixes.mjs
|   +-- dependency-fixes.test.mjs
|   +-- endodontics-curriculum.browser.test.mjs
|   +-- endodontics.browser.test.mjs
|   +-- landing.css
|   +-- list-repository.mjs
|   +-- module-source.mjs
|   +-- module-source.test.mjs
|   +-- modules.json
|   +-- oral-medicine-explorer.browser.test.mjs
|   +-- orthodontics.browser.test.mjs
|   +-- package-lock.json
|   +-- package.json
|   +-- pages.test.mjs
|   +-- prepare-modules.py
|   +-- preview-server.mjs
|   +-- prosthodontics.browser.test.mjs
|   +-- subjects.browser.test.mjs
|   +-- vite-pages-options.mjs
|   \-- vite-pages-options.test.mjs
+-- .gitignore
+-- DEPLOYMENT.md
+-- index.html
+-- lunch.js
+-- README.md
+-- REPOSITORY_CONTENTS.md
\-- subject.html
```
