/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Trash2, 
  Wrench, 
  MapPin, 
  Search, 
  ArrowUp, 
  MessageSquare, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';
import { Issue, IssueCategory, AKUNGBA_LOCATIONS } from '../types';
import { getStoredIssues, saveStoredIssues } from '../data';

export default function Dashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'upvotes' | 'recent'>('upvotes');
  
  // Interactive mini-map helper state
  const [activeQuartersMap, setActiveQuartersMap] = useState<string | null>(null);

  useEffect(() => {
    setIssues(getStoredIssues());
  }, []);

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail if clicked on card upvote button
    const updatedIssues = issues.map(issue => {
      if (issue.id === id) {
        const isUpvoted = !!issue.upvotedByUser;
        return {
          ...issue,
          upvotes: isUpvoted ? issue.upvotes - 1 : issue.upvotes + 1,
          upvotedByUser: !isUpvoted
        };
      }
      return issue;
    });
    setIssues(updatedIssues);
    saveStoredIssues(updatedIssues);
  };

  // Stats calculation
  const totalReports = issues.length;
  const securityCount = issues.filter(i => i.category === 'security').length;
  const infraCount = issues.filter(i => i.category === 'infrastructure').length;
  const sanitationCount = issues.filter(i => i.category === 'sanitation').length;
  const resolvedCount = issues.filter(i => i.status === 'resolved').length;
  const pendingCount = issues.filter(i => i.status === 'pending').length;
  const investigatingCount = issues.filter(i => i.status === 'investigating').length;

  // Filter and Search Logic
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.referenceCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || issue.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || issue.location === selectedLocation;
    const matchesMapQuarter = !activeQuartersMap || issue.location.toLowerCase().includes(activeQuartersMap.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation && matchesMapQuarter;
  });

  // Sort logic
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === 'upvotes') {
      return b.upvotes - a.upvotes;
    } else {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const getCategoryIcon = (category: IssueCategory) => {
    switch (category) {
      case 'security':
        return <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />;
      case 'infrastructure':
        return <Wrench className="h-5 w-5 text-brand-green shrink-0" />;
      case 'sanitation':
        return <Trash2 className="h-5 w-5 text-amber-500 shrink-0" />;
    }
  };

  const getStatusBadge = (status: Issue['status']) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Resolved
          </span>
        );
      case 'investigating':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50/50 text-amber-700 border border-amber-100">
            <Clock className="h-3 w-3 mr-1" />
            Investigating
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-50 text-neutral-400 border border-neutral-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Awaiting Review
          </span>
        );
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in select-none">
      
      {/* Welcome Banner */}
      <div className="bg-white border border-neutral-100 shadow-sm p-6 md:p-8 mb-8 rounded-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-neutral-50/30 -skew-x-12 transform origin-top-right border-l border-neutral-100 hidden md:block"></div>
        <div className="relative z-10 max-w-3xl">
          <span className="text-[10px] font-mono font-bold text-brand-green bg-brand-green/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Akungba-Akoko Civic Outlet
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight text-black mt-4 leading-none">
            EMPOWERING AKUNGBA <br/>
            <span className="text-brand-green">TO REPORT COMPLAINTS.</span>
          </h1>
          <p className="font-sans text-neutral-500 text-xs md:text-sm mt-3 leading-relaxed">
            Are you an Adekunle Ajasin University (AAUA) student or a proud indigene? Relate issues concerning security vulnerabilities, infrastructure breakdown, and health hazard dump sites directly. Together, we track, upvote, and mobilize resolutions.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="/report"
              className="px-5 py-3.5 bg-brand-green hover:bg-brand-green-hover text-white font-display text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-brand-green/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Report New Community Issue
            </Link>
            <a
              href="#issues-list"
              className="px-5 py-3.5 bg-neutral-50 hover:bg-neutral-100 text-black font-display text-xs font-bold uppercase tracking-wider border border-neutral-200 rounded-xl transition-all"
            >
              Explore Existing Reports
            </a>
          </div>
        </div>
      </div>

      {/* Stats Board (Bento-style layout) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-neutral-100 shadow-sm p-6 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">Total Reports</span>
          <span className="font-display text-3xl md:text-4xl font-black text-black mt-2">{totalReports}</span>
          <span className="text-[11px] font-mono text-neutral-400 mt-2 block border-t border-neutral-50 pt-2">Active database</span>
        </div>
        
        <div className="bg-white border border-neutral-100 shadow-sm p-6 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">Security Alerts</span>
          <span className="font-display text-3xl md:text-4xl font-black text-red-500 mt-2">{securityCount}</span>
          <span className="text-[11px] font-mono text-neutral-400 mt-2 block border-t border-neutral-50 pt-2 font-medium">Immediate support</span>
        </div>

        <div className="bg-white border border-neutral-100 shadow-sm p-6 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">Resolved Cases</span>
          <span className="font-display text-3xl md:text-4xl font-black text-brand-green mt-2">{resolvedCount}</span>
          <span className="text-[11px] font-mono text-brand-green mt-2 block border-t border-neutral-50 pt-2 font-bold">
            {totalReports > 0 ? Math.round((resolvedCount / totalReports) * 100) : 0}% Success Rate
          </span>
        </div>

        <div className="bg-white border border-neutral-100 shadow-sm p-6 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">Pending Action</span>
          <span className="font-display text-3xl md:text-4xl font-black text-neutral-800 mt-2">{pendingCount + investigatingCount}</span>
          <span className="text-[11px] font-mono text-amber-600 mt-2 block border-t border-neutral-50 pt-2 font-medium">
            {investigatingCount} in active assessment
          </span>
        </div>
      </div>

      {/* Main Content Split: Map and Issues Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Hand: Controls & Notice Board & Location Map */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Active Area Interactive Micro-Map */}
          <div className="bg-white border border-neutral-100 shadow-sm rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 border-b border-neutral-50 pb-2">
              <h2 className="font-display text-xs font-bold uppercase tracking-wider text-black flex items-center">
                <MapPin className="h-4 w-4 mr-1.5 text-brand-green" />
                Akungba Hotspot Locator
              </h2>
              {activeQuartersMap && (
                <button 
                  onClick={() => setActiveQuartersMap(null)}
                  className="text-[10px] font-mono text-brand-green hover:underline cursor-pointer"
                >
                  Clear filter
                </button>
              )}
            </div>
            
            <p className="text-xs text-neutral-400 font-sans mb-4">
              Select an AAUA zone or Akungba quarter below to instantly narrow down reported complaints.
            </p>

            {/* Simulated Interactive Map Representation */}
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              {[
                { label: 'Medoline Area', key: 'Medoline' },
                { label: 'AAUA Main Gate', key: 'Main Gate' },
                { label: 'AAUA South Gate', key: 'South Gate' },
                { label: 'Permanent Site', key: 'Permanent' },
                { label: 'Okusa Market', key: 'Okusa' },
                { label: 'Iwaro Intersection', key: 'Iwaro' },
              ].map(zone => {
                const isActive = activeQuartersMap === zone.key;
                return (
                  <button
                    key={zone.key}
                    onClick={() => setActiveQuartersMap(isActive ? null : zone.key)}
                    className={`p-2.5 text-left border rounded-xl transition-all duration-150 cursor-pointer ${
                      isActive 
                        ? 'bg-brand-green text-white border-brand-green font-bold shadow-md shadow-brand-green/20' 
                        : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-100 text-black'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{zone.label}</span>
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ml-1 ${
                        isActive ? 'bg-white' : 'bg-brand-green'
                      }`}></span>
                    </div>
                  </button>
                );
              })}
            </div>
            {activeQuartersMap && (
              <div className="mt-3 p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl text-[10px] text-emerald-800 font-mono flex items-center">
                <Info className="h-3.5 w-3.5 mr-1.5 text-brand-green shrink-0" />
                Showing complaints in: <strong className="ml-1 uppercase">{activeQuartersMap}</strong>
              </div>
            )}
          </div>

          {/* Quick Informative Resource Box */}
          <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6">
            <h3 className="font-display text-xs font-bold text-black uppercase tracking-wider mb-3 flex items-center">
              💡 How It Works
            </h3>
            <ul className="text-xs text-neutral-500 space-y-3 list-inside list-disc">
              <li>
                <strong className="text-black">Relate:</strong> Submit details with exact location tags in Akungba town.
              </li>
              <li>
                <strong className="text-black">Amplify:</strong> Upvote issues to demonstrate severity. High upvote counts are flagged to youth reps and school executives.
              </li>
              <li>
                <strong className="text-black">Resolve:</strong> Status shifts to <span className="text-amber-600 font-bold">Investigating</span> then <span className="text-brand-green font-bold">Resolved</span> as local leaders act.
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <Link 
                to="/resources" 
                className="text-xs text-brand-green font-mono font-bold hover:text-brand-green-hover flex items-center group"
              >
                Access Direct Emergency Helplines
                <ChevronRight className="h-3.5 w-3.5 ml-1 transform group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>

        {/* Right Hand: Issues Feed */}
        <div id="issues-list" className="lg:col-span-2 space-y-6">
          
          {/* Filters Bar */}
          <div className="bg-white border border-neutral-100 shadow-sm rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search complaints, reference ID or hotspots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-100 bg-neutral-50/50 rounded-xl text-xs text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
              />
            </div>

            {/* Sorting controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider mr-1">
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
                Sort:
              </div>
              <button
                onClick={() => setSortBy('upvotes')}
                className={`px-4 py-2 text-[10px] uppercase tracking-wider font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                  sortBy === 'upvotes'
                    ? 'bg-black text-white border-black shadow-sm'
                    : 'bg-white hover:bg-neutral-50 text-neutral-500 border-neutral-100'
                }`}
              >
                Top Upvoted
              </button>
              <button
                onClick={() => setSortBy('recent')}
                className={`px-4 py-2 text-[10px] uppercase tracking-wider font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                  sortBy === 'recent'
                    ? 'bg-black text-white border-black shadow-sm'
                    : 'bg-white hover:bg-neutral-50 text-neutral-500 border-neutral-100'
                }`}
              >
                Most Recent
              </button>
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex space-x-2 border-b border-neutral-100 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'All Complaints' },
              { id: 'security', label: '🛡️ Security Concerns' },
              { id: 'infrastructure', label: '🚧 Infrastructure' },
              { id: 'sanitation', label: '🧹 Sanitation & Trash' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-5 py-2.5 text-xs font-display font-bold rounded-xl shrink-0 transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-brand-green/10 text-brand-green'
                    : 'text-neutral-400 hover:text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Location Dropdown Quick Selector */}
          <div className="flex items-center space-x-2 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
            <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">Filter Quarter Location:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-white border border-neutral-100 text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20"
            >
              <option value="all">Everywhere in Akungba</option>
              {AKUNGBA_LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Issues List Feed */}
          <div className="space-y-4">
            {sortedIssues.length > 0 ? (
              sortedIssues.map(issue => (
                <div 
                  key={issue.id} 
                  className="bg-white border border-neutral-100 hover:border-brand-green/30 hover:shadow-md hover:shadow-brand-green/5 rounded-2xl transition-all duration-300 overflow-hidden relative group animate-fade-in shadow-sm"
                >
                  {/* Category Accent top border */}
                  <div className={`h-1.5 w-full ${
                    issue.category === 'security' 
                      ? 'bg-red-500' 
                      : issue.category === 'infrastructure' 
                        ? 'bg-brand-green' 
                        : 'bg-amber-500'
                  }`}></div>

                  <div className="p-5 md:p-6">
                    {/* Header line of card */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(issue.category)}
                        <span className="text-[10px] font-mono font-black uppercase tracking-widest text-neutral-400">
                          {issue.category}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100 font-bold">
                          {issue.referenceCode}
                        </span>
                      </div>
                      <div>{getStatusBadge(issue.status)}</div>
                    </div>

                    {/* Main Title */}
                    <Link to={`/issue/${issue.id}`} className="block group/title">
                      <h3 className="font-display text-base md:text-lg font-black text-black group-hover/title:text-brand-green transition-colors duration-150 leading-snug">
                        {issue.title}
                      </h3>
                    </Link>

                    {/* Short Description snippet */}
                    <p className="text-xs md:text-sm text-neutral-500 font-sans mt-2.5 line-clamp-2 leading-relaxed">
                      {issue.description}
                    </p>

                    {/* Footer Details */}
                    <div className="flex flex-wrap items-center justify-between border-t border-neutral-100 pt-4 mt-4 gap-3 text-xs text-neutral-400">
                      
                      {/* Meta stats left */}
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4">
                        <span className="flex items-center font-mono font-bold text-neutral-500">
                          <MapPin className="h-3.5 w-3.5 mr-1 text-brand-green shrink-0" />
                          {issue.location}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-neutral-400 shrink-0" />
                          {formatDate(issue.date)}
                        </span>
                        <span className="text-[10px] font-mono">
                          By <strong className="font-bold text-neutral-600 capitalize">{issue.reporterName}</strong> ({issue.reporterRole})
                        </span>
                      </div>

                      {/* Interactive Buttons right (Green interactive target!) */}
                      <div className="flex items-center space-x-2 shrink-0">
                        
                        {/* Vote Action */}
                        <button
                          onClick={(e) => handleUpvote(issue.id, e)}
                          className={`px-4 py-2 rounded-xl flex items-center space-x-1.5 font-mono text-xs font-bold border transition-all duration-150 cursor-pointer ${
                            issue.upvotedByUser
                              ? 'bg-brand-green text-white border-brand-green shadow-md shadow-brand-green/20'
                              : 'bg-white hover:bg-emerald-50 text-brand-green border-neutral-200 hover:border-brand-green'
                          }`}
                        >
                          <ArrowUp className={`h-3.5 w-3.5 ${issue.upvotedByUser ? 'animate-bounce' : ''}`} />
                          <span>Upvote ({issue.upvotes})</span>
                        </button>

                        {/* View Details Link */}
                        <Link
                          to={`/issue/${issue.id}`}
                          className="px-4 py-2 rounded-xl bg-black hover:bg-brand-green text-white text-xs font-mono font-bold flex items-center space-x-1 transition-all"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>Discuss</span>
                        </Link>

                      </div>

                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-neutral-100 shadow-sm rounded-2xl p-12 text-center">
                <AlertCircle className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                <h4 className="font-display text-lg font-bold text-black mb-1">No reports match your filters</h4>
                <p className="text-sm text-neutral-400 max-w-md mx-auto">
                  Try clearing search terms or selected locations, or be the first to report this issue in Akungba!
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedLocation('all');
                    setActiveQuartersMap(null);
                  }}
                  className="mt-4 px-5 py-2.5 bg-brand-green hover:bg-brand-green-hover text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
