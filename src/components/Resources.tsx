/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Phone, 
  Copy, 
  Check, 
  ShieldCheck, 
  HeartPulse, 
  Lightbulb, 
  BookOpen, 
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { COMMUNITY_RESOURCES } from '../data';
import { CommunityResource } from '../types';

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedContact, setCopiedContact] = useState<string | null>(null);

  const handleCopy = (contact: string) => {
    navigator.clipboard.writeText(contact);
    setCopiedContact(contact);
    setTimeout(() => {
      setCopiedContact(null);
    }, 1500);
  };

  const filteredResources = COMMUNITY_RESOURCES.filter(resource => 
    resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryBadge = (category: CommunityResource['category']) => {
    switch (category) {
      case 'security':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-red-50 text-red-700 border border-red-100 uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" />
            Security Response
          </span>
        );
      case 'health':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
            <HeartPulse className="h-3.5 w-3.5 mr-1" />
            Medical Desk
          </span>
        );
      case 'utility':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
            <Lightbulb className="h-3.5 w-3.5 mr-1" />
            Utility / Grid
          </span>
        );
      case 'administration':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-100 uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5 mr-1" />
            Admin / Youth Forum
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in select-none">
      
      {/* Page Header */}
      <div className="bg-white border border-neutral-100 shadow-sm rounded-2xl p-6 md:p-8 mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight text-black leading-none uppercase">
          Emergency Helplines & Civic Resources
        </h1>
        <p className="text-xs md:text-sm text-neutral-400 font-sans mt-3 max-w-4xl leading-relaxed">
          Need immediate security, medical assistance, or want to report utility disruptions directly to personnel in Akungba? Use this verified directory. Click the copy icon to grab phone numbers quickly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Helpline Directory List (Cols 1-2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search contacts (e.g. AAUA Security, police, electric, medical)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-neutral-200 bg-neutral-50/30 rounded-xl text-sm text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource, idx) => (
                <div key={idx} className="bg-white border border-neutral-100 shadow-sm rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="mb-3">
                      {getCategoryBadge(resource.category)}
                    </div>
                    <h3 className="font-display text-sm font-black text-black leading-tight uppercase">
                      {resource.name}
                    </h3>
                    <p className="text-xs text-neutral-400 font-sans mt-2 leading-relaxed">
                      {resource.description}
                    </p>
                  </div>

                  {/* Interactive phone widget */}
                  <div className="border-t border-neutral-50 pt-4 mt-4 flex items-center justify-between">
                    <div className="flex items-center text-brand-green font-mono text-xs font-bold">
                      <Phone className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                      <span>{resource.contact}</span>
                    </div>

                    <button
                      onClick={() => handleCopy(resource.contact)}
                      className={`p-2 rounded-xl border transition-all duration-150 cursor-pointer ${
                        copiedContact === resource.contact
                          ? 'bg-brand-green text-white border-brand-green shadow-md shadow-brand-green/20'
                          : 'bg-white hover:bg-neutral-50 text-neutral-600 border-neutral-200'
                      }`}
                      title="Copy Number"
                    >
                      {copiedContact === resource.contact ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 bg-white border border-neutral-100 shadow-sm rounded-2xl p-8 text-center text-neutral-400 text-xs font-mono">
                No matching helpline contacts found. Try general keywords.
              </div>
            )}
          </div>

        </div>

        {/* Right Hand Sidebar: Safety & Civic Guidelines (Col 3) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Safety Guidelines for AAUA Students */}
          <div className="bg-white border border-neutral-100 shadow-sm rounded-2xl p-5">
            <h3 className="font-display text-xs font-bold text-black uppercase tracking-wider mb-3 pb-2 border-b border-neutral-50 flex items-center">
              🛡️ Student Security Tips
            </h3>
            <ul className="text-[11px] md:text-xs text-neutral-400 space-y-3 list-inside list-disc leading-relaxed">
              <li>
                <strong className="text-neutral-600 font-bold">Late Commutes:</strong> Avoid walking the dark pathways between AAUA South Gate and Medoline alone after 8:30 PM. Use group commutes.
              </li>
              <li>
                <strong className="text-neutral-600 font-bold">Hostel Vigilance:</strong> Ensure all secondary entrance gates and security padlocks are fastened before going to sleep.
              </li>
              <li>
                <strong className="text-neutral-600 font-bold">Emergency Reporting:</strong> If you suspect security breaches, dial the AAUA Security host lines immediately. Do not confront suspects.
              </li>
            </ul>
          </div>

          {/* Sanitation and Market Guidelines */}
          <div className="bg-white border border-neutral-100 shadow-sm rounded-2xl p-5">
            <h3 className="font-display text-xs font-bold text-black uppercase tracking-wider mb-3 pb-2 border-b border-neutral-50 flex items-center">
              🧹 Civic Sanitation Guidelines
            </h3>
            <ul className="text-[11px] md:text-xs text-neutral-400 space-y-3 list-inside list-disc leading-relaxed">
              <li>
                <strong className="text-neutral-600 font-bold">Market Waste:</strong> Traders at the Okusa market must gather plastic and organic waste in bags, rather than discarding them in gutters.
              </li>
              <li>
                <strong className="text-neutral-600 font-bold">Saturday Sanitation:</strong> Participation in the monthly Ondo State Sanitation Drill (last Saturday of the month, 7 AM - 10 AM) is mandatory for both local shop owners and residents.
              </li>
              <li>
                <strong className="text-neutral-600 font-bold">Drainage Clearance:</strong> Clear leaves and silt around student villas before heavy rain seasons to mitigate flash flooding.
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
