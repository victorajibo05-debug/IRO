/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  MapPin, 
  Calendar, 
  ArrowUp, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  ShieldCheck,
  Send,
  Sliders
} from 'lucide-react';
import { Issue, Comment, UserRole } from '../types';
import { 
  getStoredIssues, 
  saveStoredIssues, 
  getStoredComments, 
  saveStoredComments 
} from '../data';

export default function IssueDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [issue, setIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  
  // Comment Form state
  const [newCommentText, setNewCommentText] = useState('');
  const [commenterName, setCommenterName] = useState('');
  const [commenterRole, setCommenterRole] = useState<UserRole>('student');
  const [isAnonComment, setIsAnonComment] = useState(false);
  
  // Official Status change panel state (Simulated)
  const [showStatusControl, setShowStatusControl] = useState(false);

  useEffect(() => {
    const allIssues = getStoredIssues();
    const foundIssue = allIssues.find(i => i.id === id);
    if (foundIssue) {
      setIssue(foundIssue);
    }

    const allComments = getStoredComments();
    const filteredComments = allComments.filter(c => c.issueId === id);
    setComments(filteredComments);
  }, [id]);

  if (!issue) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center select-none">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
        <h2 className="font-display text-xl font-bold text-black">Issue Report Not Found</h2>
        <p className="text-sm text-neutral-400 mt-2 font-sans">
          The complaint reference ID does not exist or may have been deleted.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center px-5 py-3 bg-brand-green hover:bg-brand-green-hover text-white text-xs font-mono font-bold uppercase rounded-xl shadow-md cursor-pointer"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handleUpvote = () => {
    if (!issue) return;
    const allIssues = getStoredIssues();
    const isUpvoted = !!issue.upvotedByUser;
    
    const updatedIssues = allIssues.map(i => {
      if (i.id === issue.id) {
        return {
          ...i,
          upvotes: isUpvoted ? i.upvotes - 1 : i.upvotes + 1,
          upvotedByUser: !isUpvoted
        };
      }
      return i;
    });

    saveStoredIssues(updatedIssues);
    setIssue({
      ...issue,
      upvotes: isUpvoted ? issue.upvotes - 1 : issue.upvotes + 1,
      upvotedByUser: !isUpvoted
    });
  };

  const handleStatusChange = (newStatus: Issue['status']) => {
    if (!issue) return;
    const allIssues = getStoredIssues();
    
    const updatedIssues = allIssues.map(i => {
      if (i.id === issue.id) {
        return { ...i, status: newStatus };
      }
      return i;
    });

    saveStoredIssues(updatedIssues);
    setIssue({ ...issue, status: newStatus });
    setShowStatusControl(false);

    // Auto-post an official bulletin comment describing the status update
    const systemComment: Comment = {
      id: `comment-sys-${Date.now()}`,
      issueId: issue.id,
      text: `📢 OFFICIAL STATUS BULLETIN: This complaint's resolution pipeline status has been shifted to [${newStatus.toUpperCase()}]. Local youth forums and technical partners are monitoring progress.`,
      date: new Date().toISOString(),
      authorName: 'Akungba IRO Moderator',
      authorRole: 'community_lead'
    };

    const allComments = getStoredComments();
    const updatedComments = [...allComments, systemComment];
    saveStoredComments(updatedComments);
    setComments(updatedComments.filter(c => c.issueId === issue.id));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const authorNameValue = isAnonComment 
      ? 'Anonymous Resident' 
      : (commenterName.trim() || 'Akungba Native');

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      issueId: issue.id,
      text: newCommentText.trim(),
      date: new Date().toISOString(),
      authorName: authorNameValue,
      authorRole: isAnonComment ? 'anonymous' : commenterRole
    };

    const allComments = getStoredComments();
    const updatedComments = [...allComments, newComment];
    saveStoredComments(updatedComments);

    setComments([...comments, newComment]);
    setNewCommentText('');
    if (!isAnonComment) setCommenterName('');
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusDisplay = (status: Issue['status']) => {
    switch (status) {
      case 'resolved':
        return {
          label: 'RESOLVED',
          color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
          desc: 'Civic action has successfully settled this complaint.',
          icon: <CheckCircle className="h-5 w-5 text-brand-green" />
        };
      case 'investigating':
        return {
          label: 'INVESTIGATING',
          color: 'text-amber-800 bg-amber-50/50 border-amber-100',
          desc: 'Local groups or administrative desks are assessing remedies.',
          icon: <Clock className="h-5 w-5 text-amber-600" />
        };
      case 'pending':
        return {
          label: 'AWAITING ASSESSMENT',
          color: 'text-neutral-400 bg-neutral-50 border-neutral-200',
          desc: 'Filed on public notice board. Awaiting general upvote validation.',
          icon: <AlertCircle className="h-5 w-5 text-neutral-400" />
        };
    }
  };

  const currentStatusObj = getStatusDisplay(issue.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in select-none">
      
      {/* Navigation and Audit Code */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 hover:text-brand-green transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Dashboard Feed
        </button>
        <span className="text-[10px] font-mono text-neutral-400 bg-neutral-50 px-2.5 py-1 border border-neutral-100 rounded-lg">
          TRACKING REF: {issue.referenceCode}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Core complaint summary & photo */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Complaint Header & Details Card */}
          <div className="bg-white border border-neutral-100 shadow-sm rounded-2xl p-6 md:p-8">
            
            {/* Category tag */}
            <div className="flex items-center space-x-2 mb-3">
              <span className={`h-2.5 w-2.5 rounded-full ${
                issue.category === 'security' 
                  ? 'bg-red-500' 
                  : issue.category === 'infrastructure' 
                    ? 'bg-brand-green' 
                    : 'bg-amber-500'
              }`}></span>
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-neutral-400">
                {issue.category} complaint
              </span>
            </div>

            <h1 className="font-display text-2xl md:text-3xl font-black text-black tracking-tight leading-tight uppercase">
              {issue.title}
            </h1>

            {/* Geographical marker & timestamps */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 border-y border-neutral-50 py-3.5 my-4 text-xs text-neutral-400">
              <span className="flex items-center font-mono font-bold text-neutral-500">
                <MapPin className="h-4 w-4 mr-1.5 text-brand-green shrink-0" />
                {issue.location}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5 text-neutral-400 shrink-0" />
                {formatDate(issue.date)}
              </span>
              <span className="font-mono text-[10px]">
                By <strong className="font-bold text-neutral-500 capitalize">{issue.reporterName}</strong> ({issue.reporterRole})
              </span>
            </div>

            {/* Evidence Image */}
            {issue.evidenceImage && (
              <div className="mb-5 border border-neutral-100 rounded-2xl overflow-hidden bg-neutral-50 shadow-sm">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-900 text-white px-4 py-2.5 flex items-center justify-between">
                  <span>Attached Photographic Evidence</span>
                  <span className="text-emerald-400 font-bold">SECURE LINK</span>
                </div>
                <img 
                  src={issue.evidenceImage} 
                  alt={issue.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-72 object-cover" 
                />
              </div>
            )}

            {/* Description text */}
            <div className="prose max-w-none text-neutral-600 font-sans text-sm md:text-base leading-relaxed whitespace-pre-line">
              {issue.description}
            </div>

            {/* Upvote Board & Quick Actions */}
            <div className="border-t border-neutral-50 pt-5 mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-neutral-400">
                Are you also affected? Upvoting helps escalate this onto local leadership feeds.
              </div>
              <button
                onClick={handleUpvote}
                className={`px-5 py-3 rounded-xl flex items-center space-x-2 font-display text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  issue.upvotedByUser
                    ? 'bg-brand-green text-white border-brand-green shadow-lg shadow-brand-green/20'
                    : 'bg-white hover:bg-emerald-50 text-brand-green border-neutral-200 hover:border-brand-green'
                }`}
              >
                <ArrowUp className={`h-4 w-4 ${issue.upvotedByUser ? 'animate-bounce' : ''}`} />
                <span>Upvote This Issue ({issue.upvotes})</span>
              </button>
            </div>

          </div>

          {/* Comments and discussion panel */}
          <div className="bg-white border border-neutral-100 shadow-sm rounded-2xl p-6 md:p-8 space-y-6">
            <h3 className="font-display text-lg font-black text-black tracking-tight border-b border-neutral-50 pb-3 flex items-center uppercase">
              <MessageSquare className="h-5 w-5 mr-2 text-brand-green shrink-0" />
              Comments & Advisory ({comments.length})
            </h3>

            {/* Comment Feed */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-none">
              {comments.length > 0 ? (
                comments.map(c => {
                  const isOfficial = c.authorRole === 'community_lead' || c.authorRole === 'government_official';
                  return (
                    <div 
                      key={c.id} 
                      className={`p-4 border rounded-xl ${
                        isOfficial 
                          ? 'bg-emerald-50/50 border-emerald-100' 
                          : 'bg-neutral-50/50 border-neutral-100'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <div className="flex items-center space-x-2">
                          <span className={`font-mono font-bold ${isOfficial ? 'text-emerald-800' : 'text-neutral-700'}`}>
                            {c.authorName}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider ${
                            isOfficial 
                              ? 'bg-emerald-700 text-white font-bold' 
                              : 'bg-neutral-200 text-neutral-500'
                          }`}>
                            {c.authorRole.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="font-mono text-neutral-400 text-[10px]">
                          {formatDate(c.date)}
                        </span>
                      </div>
                      <p className={`text-xs md:text-sm ${isOfficial ? 'text-emerald-950 font-bold' : 'text-neutral-500'} font-sans leading-relaxed whitespace-pre-line`}>
                        {c.text}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-neutral-400 text-xs font-mono">
                  No community comments filed yet. Be the first to advise on this!
                </div>
              )}
            </div>

            {/* Leave a Comment form (Green interactive buttons!) */}
            <form onSubmit={handleAddComment} className="border-t border-neutral-100 pt-5 space-y-4">
              <h4 className="font-display text-xs font-bold text-black uppercase tracking-wider">
                Add Your Guidance / Update
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    id="anon-comment-toggle"
                    type="checkbox"
                    checked={isAnonComment}
                    onChange={(e) => setIsAnonComment(e.target.checked)}
                    className="h-4 w-4 text-brand-green border-neutral-300 rounded focus:ring-brand-green cursor-pointer"
                  />
                  <label htmlFor="anon-comment-toggle" className="text-xs font-mono font-bold text-black cursor-pointer">
                    Post Comment Anonymously
                  </label>
                </div>

                {!isAnonComment && (
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name (e.g., Ayodeji, AAUA student)"
                      value={commenterName}
                      onChange={(e) => setCommenterName(e.target.value)}
                      maxLength={50}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs text-black focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                    />
                  </div>
                )}
              </div>

              {!isAnonComment && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Your Affiliation:</span>
                  {(['student', 'indigene', 'community_lead', 'government_official'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setCommenterRole(role)}
                      className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase rounded-xl border transition-all cursor-pointer ${
                        commenterRole === role
                          ? 'bg-black text-white border-black font-semibold'
                          : 'bg-white text-neutral-500 border-neutral-100 hover:border-black'
                      }`}
                    >
                      {role.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              )}

              <div className="relative">
                <textarea
                  rows={3}
                  placeholder="Share advice, updates, or organize collaborative resolutions..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-neutral-200 bg-neutral-50/30 rounded-xl text-sm text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green focus:bg-white transition-all"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-3 bg-brand-green hover:bg-brand-green-hover text-white font-display text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-brand-green/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Post Comment</span>
                </button>
              </div>
            </form>

          </div>

        </div>

        {/* Right Column: Status Timeline & Civic Action Console */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Status Tracker Block */}
          <div className="bg-white border border-neutral-100 shadow-sm rounded-2xl p-6">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
              Complaint Status Pipeline
            </h3>

            <div className={`border rounded-xl p-4 mb-5 flex items-start space-x-3 ${currentStatusObj?.color}`}>
              <div className="shrink-0 mt-0.5">{currentStatusObj?.icon}</div>
              <div>
                <span className="font-mono text-[10px] font-black tracking-wider block">
                  {currentStatusObj?.label}
                </span>
                <p className="text-[11px] mt-1 leading-relaxed opacity-95">
                  {currentStatusObj?.desc}
                </p>
              </div>
            </div>

            {/* Visual Timeline Steps */}
            <div className="relative pl-6 space-y-6 text-xs before:absolute before:left-2 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-neutral-100">
              
              {/* Step 3: Resolved */}
              <div className="relative">
                <span className={`absolute -left-6 mt-1 h-3 w-3 rounded-full border-2 ${
                  issue.status === 'resolved' 
                    ? 'bg-brand-green border-brand-green-hover' 
                    : 'bg-white border-neutral-200'
                }`}></span>
                <div>
                  <span className={`font-bold block ${issue.status === 'resolved' ? 'text-brand-green' : 'text-neutral-400'}`}>
                    3. Civic Resolution Actioned
                  </span>
                  <span className="text-[10px] text-neutral-400 block font-mono">
                    Issue resolved & confirmed by town reps.
                  </span>
                </div>
              </div>

              {/* Step 2: Investigating */}
              <div className="relative">
                <span className={`absolute -left-6 mt-1 h-3 w-3 rounded-full border-2 ${
                  issue.status === 'investigating' 
                    ? 'bg-amber-500 border-amber-600' 
                    : issue.status === 'resolved'
                      ? 'bg-brand-green border-brand-green-hover'
                      : 'bg-white border-neutral-200'
                }`}></span>
                <div>
                  <span className={`font-bold block ${
                    issue.status === 'investigating' ? 'text-amber-600' : issue.status === 'resolved' ? 'text-brand-green' : 'text-neutral-400'
                  }`}>
                    2. Administrative Assessment
                  </span>
                  <span className="text-[10px] text-neutral-400 block font-mono">
                    Under review by community youth forum or BEDC/school teams.
                  </span>
                </div>
              </div>

              {/* Step 1: Pending */}
              <div className="relative">
                <span className={`absolute -left-6 mt-1 h-3 w-3 rounded-full border-2 bg-brand-green border-brand-green-hover`}></span>
                <div>
                  <span className="font-bold text-neutral-600 block">
                    1. Issue Filed On Noticeboard
                  </span>
                  <span className="text-[10px] text-neutral-400 block font-mono">
                    Public catalog generated, upvotes active.
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Interactive Mock Civic Console (Great for playing with the app!) */}
          <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 shadow-inner">
            <h4 className="font-display text-xs font-bold text-black uppercase tracking-wider mb-2 flex items-center">
              <Sliders className="h-4 w-4 mr-1.5 text-brand-green" />
              Civic Officer Simulator
            </h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed font-sans mb-4">
              Pretend to be an AAUA student executive or Akungba town elder. You can transition this issue’s status below to simulate how the real system responds:
            </p>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleStatusChange('pending')}
                className={`py-2.5 text-xs font-mono font-bold uppercase rounded-xl border text-center cursor-pointer transition-all ${
                  issue.status === 'pending'
                    ? 'bg-black text-white border-black font-bold'
                    : 'bg-white hover:bg-neutral-100 text-neutral-500 border-neutral-100 shadow-sm'
                }`}
              >
                Reset to Awaiting Review
              </button>
              <button
                onClick={() => handleStatusChange('investigating')}
                className={`py-2.5 text-xs font-mono font-bold uppercase rounded-xl border text-center cursor-pointer transition-all ${
                  issue.status === 'investigating'
                    ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-white hover:bg-neutral-100 text-amber-600 border-neutral-100 shadow-sm'
                }`}
              >
                Set to Investigating 🚧
              </button>
              <button
                onClick={() => handleStatusChange('resolved')}
                className={`py-2.5 text-xs font-mono font-bold uppercase rounded-xl border text-center cursor-pointer transition-all ${
                  issue.status === 'resolved'
                    ? 'bg-brand-green text-white border-brand-green font-bold shadow-md shadow-brand-green/25'
                    : 'bg-white hover:bg-neutral-100 text-brand-green border-neutral-100 shadow-sm'
                }`}
              >
                Mark as Resolved ✔️
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
