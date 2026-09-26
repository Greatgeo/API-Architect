/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navbar } from './components/Navbar.tsx';
import { RequirementConsole } from './components/RequirementConsole.tsx';
import { ArchitecturePipeline } from './components/ArchitecturePipeline.tsx';
import { DomainModelViewer } from './components/DomainModelViewer.tsx';
import { PhaseRoadmap } from './components/PhaseRoadmap.tsx';
import { Footer } from './components/Footer.tsx';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/20 selection:text-sky-300">
      <Navbar />

      <main className="flex-1">
        <RequirementConsole />
        <ArchitecturePipeline />
        <DomainModelViewer />
        <PhaseRoadmap />
      </main>

      <Footer />
    </div>
  );
}
