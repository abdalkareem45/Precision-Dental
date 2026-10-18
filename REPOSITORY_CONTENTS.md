# Repository source inventory

Generated with `node scripts/list-repository.mjs`.

This lists the current intended source files, not Git's tracked status. It excludes
dependencies, generated builds, ZIP backups, duplicate extractions, local secrets,
and npm-unused Bun lockfiles. No files are deleted by this command.

339 files. Regenerate after adding lectures or other files.

```text
website/
+-- .github/
|   \-- workflows/
|       \-- deploy.yml
+-- .zed/
|   \-- settings.json
+-- crown/
|   +-- src/
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
+-- endo-1-main/
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
+-- orthodontics-main/
|   \-- orthodontics-main/
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
|       |   +-- types/
|       |   |   \-- ortho.ts
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
|   +-- src/
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
+-- scripts/
|   +-- build-pages.mjs
|   +-- dependency-fixes.mjs
|   +-- dependency-fixes.test.mjs
|   +-- endodontics.browser.test.mjs
|   +-- landing.css
|   +-- list-repository.mjs
|   +-- module-source.mjs
|   +-- module-source.test.mjs
|   +-- modules.json
|   +-- package-lock.json
|   +-- package.json
|   +-- pages.test.mjs
|   +-- prepare-modules.py
|   +-- preview-server.mjs
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
