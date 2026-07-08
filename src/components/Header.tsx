/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertTriangle, Menu, X, Landmark, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-100 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo / Branding */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-brand-green text-white p-2.5 rounded-xl group-hover:scale-105 transition-all duration-200 shadow-sm shadow-brand-green/20">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <span className="font-display text-xl font-black tracking-tight text-black block leading-none">
                  IRO <span className="text-brand-green">AKUNGBA</span>
                </span>
                <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase block mt-1">
                  Issues Reporting Outlet
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link
              to="/"
              className={`pb-1 transition-all duration-200 border-b-2 ${
                isActive('/')
                  ? 'border-brand-green text-brand-green font-bold'
                  : 'border-transparent text-neutral-400 hover:text-black'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/resources"
              className={`pb-1 transition-all duration-200 border-b-2 ${
                isActive('/resources')
                  ? 'border-brand-green text-brand-green font-bold'
                  : 'border-transparent text-neutral-400 hover:text-black'
              }`}
            >
              Emergency Contacts
            </Link>
          </nav>

          {/* Desktop Call to Action (Green button) */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-neutral-50 px-3 py-1.5 border border-neutral-100 rounded-lg text-xs font-mono text-neutral-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>PORTAL ACTIVE</span>
            </div>
            <Link
              to="/report"
              className="px-5 py-3 bg-brand-green hover:bg-brand-green-hover text-white font-display text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-brand-green/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 cursor-pointer"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Report An Issue</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-3">
            <Link
              to="/report"
              className="p-2 bg-brand-green hover:bg-brand-green-hover text-white rounded-xl shadow-sm cursor-pointer"
              title="Report an issue"
            >
              <AlertTriangle className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-black hover:bg-neutral-50 border border-neutral-100 rounded-xl focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Bulletin Banner */}
      <div className="bg-black text-white text-xs py-2.5 px-4 overflow-hidden border-t border-neutral-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <span className="bg-brand-green text-[10px] font-mono font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 text-white">
              Latest Alert
            </span>
            <p className="font-mono text-neutral-300 truncate text-[11px] sm:text-xs">
              ⚠️ Vigilante groups active around Medoline and AAUA South Gate quarters tonight. Keep emergency contacts handy!
            </p>
          </div>
          <div className="hidden lg:block text-neutral-400 text-[11px] font-mono">
            Akungba-Akoko, Ondo State
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-100 py-4 px-4 space-y-3 transition-all duration-200">
          <div className="grid grid-cols-1 gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 text-base font-medium rounded-xl border ${
                isActive('/')
                  ? 'bg-neutral-50 border-brand-green text-brand-green font-bold'
                  : 'border-neutral-100 text-black hover:border-black'
              }`}
            >
              Dashboard (Issues List)
            </Link>
            <Link
              to="/resources"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 text-base font-medium rounded-xl border ${
                isActive('/resources')
                  ? 'bg-neutral-50 border-brand-green text-brand-green font-bold'
                  : 'border-neutral-100 text-black hover:border-black'
              }`}
            >
              Emergency Helplines
            </Link>
            <Link
              to="/report"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 text-base font-semibold bg-brand-green text-white rounded-xl border border-brand-green-hover flex items-center justify-center space-x-2"
            >
              <AlertTriangle className="h-5 w-5" />
              <span>Report An Issue</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>AAUA Community Core</span>
            <span className="flex items-center text-brand-green font-bold">
              <span className="h-2 w-2 rounded-full bg-brand-green mr-1.5 animate-pulse"></span>
              PORTAL ACTIVE
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
