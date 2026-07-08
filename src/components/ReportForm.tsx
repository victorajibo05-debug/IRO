/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, MapPin, User, ChevronLeft, Shield, Trash, Wrench, Info } from 'lucide-react';
import { Issue, IssueCategory, AKUNGBA_LOCATIONS } from '../types';
import { getStoredIssues, saveStoredIssues } from '../data';

export default function ReportForm() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<IssueCategory>('security');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(AKUNGBA_LOCATIONS[0]);
  const [reporterName, setReporterName] = useState('');
  const [reporterRole, setReporterRole] = useState<'student' | 'indigene'>('student');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Photo Simulation Preset
  const [selectedPhotoPreset, setSelectedPhotoPreset] = useState<string>('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Realistic mock image presets corresponding to Akungba complaints
  const photoPresets = [
    { label: 'Erosion / Broken Pathway', value: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600' },
    { label: 'Dark / Unlit Alleyway', value: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=600' },
    { label: 'Clogged Gutter / Refuse heap', value: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600' },
    { label: 'Overhead Electrical Cable Fault', value: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a short, descriptive title for this issue.');
      return;
    }
    if (!description.trim() || description.length < 15) {
      setError('Please write a detailed description (minimum 15 characters) so responders can understand the situation.');
      return;
    }
    if (!isAnonymous && !reporterName.trim()) {
      setError('Please provide your name or toggle "Report anonymously" to submit.');
      return;
    }

    // Generate reference code e.g. IRO-AK-2026-829
    const randomNum = Math.floor(100 + Math.random() * 900);
    const refCode = `IRO-AK-2026-${randomNum}`;
    const newId = `issue-${Date.now()}`;

    const newIssue: Issue = {
      id: newId,
      title: title.trim(),
      category,
      description: description.trim(),
      location,
      date: new Date().toISOString(),
      status: 'pending',
      upvotes: 1, // Auto-upvoted by reporter
      reporterName: isAnonymous ? 'Anonymous Resident' : reporterName.trim(),
      reporterRole: isAnonymous ? 'anonymous' : reporterRole,
      referenceCode: refCode,
      evidenceImage: selectedPhotoPreset || undefined,
      upvotedByUser: true
    };

    const currentIssues = getStoredIssues();
    const updatedIssues = [newIssue, ...currentIssues];
    saveStoredIssues(updatedIssues);

    setSuccess(true);
    setTimeout(() => {
      navigate('/');
    }, 1800);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in select-none">
      
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="mb-6 inline-flex items-center text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 hover:text-brand-green transition-colors cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </button>

      <div className="bg-white border border-neutral-100 shadow-sm rounded-2xl p-6 md:p-8">
        
        {/* Form header */}
        <div className="border-b border-neutral-100 pb-5 mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-black text-black tracking-tight uppercase">
            Relate a Complaint
          </h1>
          <p className="text-xs md:text-sm text-neutral-400 mt-2 font-sans leading-relaxed">
            Fill out the form below. Once submitted, your issue will be posted on the public bulletin board where AAUA students and indigenes can review, comment, and upvote to alert local organizers.
          </p>
        </div>

        {success ? (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 text-brand-green mb-4 animate-bounce">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="font-display text-xl font-bold text-black">Report Filed Successfully!</h2>
            <p className="text-sm text-neutral-400 max-w-sm mx-auto mt-2 font-sans">
              Your report has been logged with an audit trail code. Redirecting you to the live dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-xs text-red-800 font-mono flex items-start space-x-2">
                <span className="font-bold shrink-0">⚠️ Error:</span>
                <span>{error}</span>
              </div>
            )}

            {/* Category selection (Interactive tab buttons with Green actions!) */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2">
                1. Select Issue Category
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'security', label: 'Security Threat', desc: 'Cultism, theft, harassment', icon: <Shield className="h-4 w-4" /> },
                  { id: 'infrastructure', label: 'Infrastructure', desc: 'Erosion, light grids, roads', icon: <Wrench className="h-4 w-4" /> },
                  { id: 'sanitation', label: 'Sanitation Unit', desc: 'Waste heap, blocked drains', icon: <Trash className="h-4 w-4" /> }
                ].map(opt => {
                  const isSelected = category === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCategory(opt.id as IssueCategory)}
                      className={`p-4 text-left border rounded-xl transition-all cursor-pointer flex flex-col justify-between h-24 ${
                        isSelected 
                          ? 'bg-brand-green text-white border-brand-green shadow-lg shadow-brand-green/20 font-bold' 
                          : 'bg-neutral-50/50 hover:bg-neutral-100 text-black border-neutral-100'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] font-mono font-bold uppercase">{opt.id}</span>
                        {opt.icon}
                      </div>
                      <div className="mt-auto">
                        <span className="text-[11px] block leading-tight opacity-90">{opt.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title input */}
            <div>
              <label htmlFor="title" className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                2. Summary / Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Broken drainage cable near Permanent Site transformer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={80}
                className="w-full px-4 py-3 border border-neutral-200 bg-neutral-50/30 rounded-xl text-sm text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green focus:bg-white transition-all"
              />
              <span className="text-[10px] font-mono text-neutral-400 mt-1 block">
                Keep it precise. Max 80 characters.
              </span>
            </div>

            {/* Detailed description */}
            <div>
              <label htmlFor="description" className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                3. Detailed Description
              </label>
              <textarea
                id="description"
                rows={5}
                placeholder="Provide accurate details: What is happening? Who does it affect? What actions are requested? (Min 15 characters)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-200 bg-neutral-50/30 rounded-xl text-sm text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green focus:bg-white transition-all"
              />
            </div>

            {/* Location selector */}
            <div>
              <label htmlFor="location" className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                4. Primary Location in Akungba
              </label>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-brand-green shrink-0" />
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-3 bg-white border border-neutral-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                >
                  {AKUNGBA_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Photo / Evidence simulation */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                5. Simulated Evidence Attachment (Optional)
              </label>
              <p className="text-xs text-neutral-400 font-sans mb-3">
                Since we are in the sandbox UI, you can select one of our realistic community stock pictures to represent the issue:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {photoPresets.map(preset => {
                  const isSelected = selectedPhotoPreset === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setSelectedPhotoPreset(isSelected ? '' : preset.value)}
                      className={`p-3 text-left text-[11px] font-mono border rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-emerald-50/50 border-brand-green text-brand-green font-bold' 
                          : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-100 text-neutral-600'
                      }`}
                    >
                      <span className="truncate mr-1">{preset.label}</span>
                      <span className={`h-2.5 w-2.5 rounded-full shrink-0 border ${
                        isSelected ? 'bg-brand-green border-brand-green' : 'bg-transparent border-neutral-300'
                      }`}></span>
                    </button>
                  );
                })}
              </div>
              {selectedPhotoPreset && (
                <div className="mt-3 relative w-full h-40 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-100">
                  <img 
                    src={selectedPhotoPreset} 
                    alt="Evidence Preview" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                  <button 
                    type="button"
                    onClick={() => setSelectedPhotoPreset('')}
                    className="absolute top-2 right-2 px-3 py-1.5 bg-black/80 hover:bg-red-600 text-white text-[10px] font-mono uppercase tracking-wider font-bold rounded-lg transition-colors"
                  >
                    Remove Photo
                  </button>
                </div>
              )}
            </div>

            {/* Reporter Profile and Role */}
            <div className="bg-neutral-50/50 p-5 rounded-2xl border border-neutral-100 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                <h3 className="font-display text-xs font-bold text-black uppercase tracking-wider flex items-center">
                  <User className="h-4 w-4 mr-1.5 text-brand-green" />
                  6. Reporter Identification
                </h3>
                <div className="flex items-center space-x-2">
                  <input
                    id="anonymous-checkbox"
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="h-4 w-4 text-brand-green border-neutral-300 rounded focus:ring-brand-green cursor-pointer"
                  />
                  <label htmlFor="anonymous-checkbox" className="text-xs font-mono font-bold text-black cursor-pointer">
                    Report Anonymously
                  </label>
                </div>
              </div>

              {!isAnonymous ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                  <div>
                    <label htmlFor="reporterName" className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Your Full Name
                    </label>
                    <input
                      id="reporterName"
                      type="text"
                      placeholder="e.g. Kolawole Ogunmola"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Your Affiliation / Role
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setReporterRole('student')}
                        className={`py-2.5 text-xs font-mono font-bold uppercase rounded-xl border transition-all cursor-pointer ${
                          reporterRole === 'student'
                            ? 'bg-black text-white border-black font-semibold shadow-sm'
                            : 'bg-white hover:bg-neutral-50 text-neutral-500 border-neutral-100'
                        }`}
                      >
                        🎓 AAUA Student
                      </button>
                      <button
                        type="button"
                        onClick={() => setReporterRole('indigene')}
                        className={`py-2.5 text-xs font-mono font-bold uppercase rounded-xl border transition-all cursor-pointer ${
                          reporterRole === 'indigene'
                            ? 'bg-black text-white border-black font-semibold shadow-sm'
                            : 'bg-white hover:bg-neutral-50 text-neutral-500 border-neutral-100'
                        }`}
                      >
                        🏡 Town Indigene
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white border border-neutral-100 rounded-xl text-xs text-neutral-400 flex items-center font-mono">
                  <Info className="h-4 w-4 mr-2 text-brand-green shrink-0" />
                  Your name won't be saved or shown. Your issue will be cataloged under "Anonymous Resident".
                </div>
              )}
            </div>

            {/* Action buttons (Submit green action button!) */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-5 py-3 text-xs font-display font-bold uppercase tracking-wider text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-brand-green hover:bg-brand-green-hover text-white text-xs font-display font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-brand-green/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 cursor-pointer"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Submit Complaint</span>
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
