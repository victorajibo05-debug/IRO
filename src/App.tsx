/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ReportForm from './components/ReportForm';
import IssueDetail from './components/IssueDetail';
import Resources from './components/Resources';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white text-black font-sans antialiased">
        {/* Navigation Header */}
        <Header />

        {/* Main Routed Content Stage */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/report" element={<ReportForm />} />
            <Route path="/issue/:id" element={<IssueDetail />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        </main>

        {/* Global Civic Footer */}
        <footer className="bg-black text-white py-12 border-t-2 border-black mt-16 select-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Column 1: Info */}
              <div className="space-y-3">
                <h4 className="font-display text-sm font-bold tracking-wider uppercase text-green-500">
                  Akungba-Akoko IRO
                </h4>
                <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-sm">
                  The Issues Reporting Outlet (IRO) is an independent citizen-led forum to collect, verify, and resolve crucial civic concerns around Adekunle Ajasin University (AAUA) and the Akungba township.
                </p>
              </div>

              {/* Column 2: Affiliation info */}
              <div className="space-y-3">
                <h4 className="font-display text-sm font-bold tracking-wider uppercase text-neutral-200">
                  Civic Affiliation
                </h4>
                <ul className="text-xs text-neutral-400 space-y-2 font-mono">
                  <li>🎓 AAUA Student Union Government</li>
                  <li>🏡 Akungba Town Progressive Council</li>
                  <li>📍 Ondo State Local Government Desk</li>
                </ul>
              </div>

              {/* Column 3: Stats Summary */}
              <div className="space-y-3">
                <h4 className="font-display text-sm font-bold tracking-wider uppercase text-neutral-200">
                  Portal Information
                </h4>
                <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                  All submitted data resides locally in your browser sandbox. Authentic reference codes are issued for administrative record-keeping.
                </p>
                <div className="inline-block bg-neutral-900 border border-neutral-800 text-green-400 font-mono text-[10px] px-2.5 py-1 uppercase tracking-widest mt-1">
                  SECURE & ACCESSIBLE
                </div>
              </div>

            </div>

            <div className="border-t border-neutral-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500 font-mono">
              <p>© {new Date().getFullYear()} Akungba Issues Reporting Outlet (IRO). All rights reserved.</p>
              <p className="mt-2 md:mt-0">
                Created with pride for <span className="text-green-500 font-bold">Ondo State indigenes & students</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

