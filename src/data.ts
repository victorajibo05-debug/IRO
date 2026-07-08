/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Issue, Comment, CommunityResource } from './types';

export const INITIAL_ISSUES: Issue[] = [
  {
    id: 'issue-1',
    title: 'Frequent Nighttime Petty Theft around Medoline',
    category: 'security',
    description: 'There has been a rise in burglary and phone snatching around the Medoline student residential area, especially between 9 PM and midnight. We need more active local vigilante patrols and better lighting along the major paths.',
    location: 'Medoline (Student Area)',
    date: '2026-07-05T19:30:00Z',
    status: 'investigating',
    upvotes: 48,
    reporterName: 'Segun Adebayo',
    reporterRole: 'student',
    referenceCode: 'IRO-AK-2026-001',
    upvotedByUser: false
  },
  {
    id: 'issue-2',
    title: 'Severe Erosion and Deep Gullies Near AAUA South Gate Pathway',
    category: 'infrastructure',
    description: 'The recent heavy downpours have expanded the gullies near the South Gate pathway. Students walking to lectures from the permanent site are finding it highly hazardous, especially when it rains. The pathway requires stone-base filling and concrete drainage construction.',
    location: 'AAUA South Gate Pathway',
    date: '2026-07-06T08:15:00Z',
    status: 'pending',
    upvotes: 72,
    reporterName: 'Funmilayo Bello',
    reporterRole: 'student',
    referenceCode: 'IRO-AK-2026-002',
    upvotedByUser: true
  },
  {
    id: 'issue-3',
    title: 'Clogged Drainage & Illegal Waste Dumping at Okusa Market',
    category: 'sanitation',
    description: 'Traders at the Okusa community market are dumping organic waste and plastic packaging directly into the central drainage channel. This has completely blocked the water flow, leading to stagnant, foul-smelling water and breeding mosquitoes. A joint student-indigene clean-up is required.',
    location: 'Okusa Community Market',
    date: '2026-07-04T11:00:00Z',
    status: 'resolved',
    upvotes: 35,
    reporterName: 'Pa Elijah Ojo',
    reporterRole: 'indigene',
    referenceCode: 'IRO-AK-2026-003',
    upvotedByUser: false
  },
  {
    id: 'issue-4',
    title: 'Damaged Transformer Cable Causing Outage in Permanent Site Quarters',
    category: 'infrastructure',
    description: 'High-voltage surge last Thursday damaged the primary distribution cable connected to the Permanent Site transformer. A large portion of the quarters has been in total darkness for 6 days now. BEDC officials have been notified but no technician has arrived yet.',
    location: 'Permanent Site Quarters',
    date: '2026-07-07T14:20:00Z',
    status: 'pending',
    upvotes: 56,
    reporterName: 'Oluwaseun Alao',
    reporterRole: 'indigene',
    referenceCode: 'IRO-AK-2026-004',
    upvotedByUser: false
  },
  {
    id: 'issue-5',
    title: 'Uncontrolled Speeding Near the AAUA Main Gate Area',
    category: 'security',
    description: 'Heavy vehicles and interstate transport shuttle drivers speed excessively through the highway fronting the AAUA Main Gate. This represents a serious danger to students crossing to and from campus. We need speed breakers (humps) or pedestrian zebra crossings painted immediately.',
    location: 'AAUA Main Gate Area',
    date: '2026-07-07T16:45:00Z',
    status: 'investigating',
    upvotes: 83,
    reporterName: 'Anonymous Student',
    reporterRole: 'anonymous',
    referenceCode: 'IRO-AK-2026-005',
    upvotedByUser: false
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    issueId: 'issue-1',
    text: 'I was a victim last week. They snatched my bag right in front of the second villa. We need the local hunters or community vigilante to help secure that area.',
    date: '2026-07-05T20:15:00Z',
    authorName: 'Ayomide Johnson',
    authorRole: 'student'
  },
  {
    id: 'c2',
    issueId: 'issue-1',
    text: 'As an indigene who has a shop nearby, I am willing to contribute to getting solar-powered lamps for that dark stretch. Let’s organize a meeting.',
    date: '2026-07-06T09:40:00Z',
    authorName: 'Chief Adebisi',
    authorRole: 'indigene'
  },
  {
    id: 'c3',
    issueId: 'issue-2',
    text: 'We had to leap over a 4-foot deep trench today just to get to the science lecture theater. This is really critical. Glad it is trending!',
    date: '2026-07-06T10:12:00Z',
    authorName: 'Chinedu Eze',
    authorRole: 'student'
  },
  {
    id: 'c4',
    issueId: 'issue-3',
    text: 'We carried out a sanitation exercise last Saturday. The local government chairman sent waste trucks to clear the accumulated pile. Let us maintain this cleanliness.',
    date: '2026-07-05T16:00:00Z',
    authorName: 'Hon. Kehinde',
    authorRole: 'government_official'
  },
  {
    id: 'c5',
    issueId: 'issue-5',
    text: 'This highway has taken too many student lives in previous years. A flyover or robust rumble strips are desperately required. The management of AAUA must lobby the State Ministry of Works.',
    date: '2026-07-07T18:02:00Z',
    authorName: 'Dr. (Mrs) Falode',
    authorRole: 'community_lead'
  }
];

export const COMMUNITY_RESOURCES: CommunityResource[] = [
  {
    name: 'AAUA Security Unit (Emergency Host)',
    category: 'security',
    contact: '+234 803 456 7890',
    description: 'Active campus response team and immediate peripheral student housing patrol.'
  },
  {
    name: 'Akungba Police Divisional Headquarters',
    category: 'security',
    contact: '+234 805 112 3344',
    description: 'State police desk in Akungba town for major security reporting and complaints.'
  },
  {
    name: 'AAUA Campus Health Center',
    category: 'health',
    contact: '+234 806 987 6543',
    description: 'Available 24/7 for students and staff on campus for emergency medical support.'
  },
  {
    name: 'Akungba Basic Health Center (Okusa Quarters)',
    category: 'health',
    contact: '+234 812 345 6789',
    description: 'Community maternity and primary health center for indigenes and general residents.'
  },
  {
    name: 'Ondo State Waste Management (ODWMA) representative',
    category: 'utility',
    contact: '+234 807 555 1234',
    description: 'Call to report major garbage buildup or coordinate community cleaning trucks.'
  },
  {
    name: 'BEDC Akungba Service Desk',
    category: 'utility',
    contact: '+234 809 321 4321',
    description: 'For reporting transformer vandalism, fallen poles, or power billing escalations.'
  },
  {
    name: 'Akungba Youth Community Forum',
    category: 'administration',
    contact: '+234 813 444 5555',
    description: 'Indigene-student relations council coordinating civic intervention projects.'
  }
];

// Helper to initialize and retrieve issues from LocalStorage
export function getStoredIssues(): Issue[] {
  const data = localStorage.getItem('akungba_iro_issues');
  if (!data) {
    localStorage.setItem('akungba_iro_issues', JSON.stringify(INITIAL_ISSUES));
    return INITIAL_ISSUES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_ISSUES;
  }
}

export function saveStoredIssues(issues: Issue[]): void {
  localStorage.setItem('akungba_iro_issues', JSON.stringify(issues));
}

// Helper to initialize and retrieve comments from LocalStorage
export function getStoredComments(): Comment[] {
  const data = localStorage.getItem('akungba_iro_comments');
  if (!data) {
    localStorage.setItem('akungba_iro_comments', JSON.stringify(INITIAL_COMMENTS));
    return INITIAL_COMMENTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_COMMENTS;
  }
}

export function saveStoredComments(comments: Comment[]): void {
  localStorage.setItem('akungba_iro_comments', JSON.stringify(comments));
}
