/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type IssueCategory = 'security' | 'infrastructure' | 'sanitation';

export type UserRole = 'student' | 'indigene' | 'anonymous' | 'community_lead' | 'government_official';

export interface Issue {
  id: string;
  title: string;
  category: IssueCategory;
  description: string;
  location: string;
  date: string;
  status: 'pending' | 'investigating' | 'resolved';
  upvotes: number;
  reporterName: string;
  reporterRole: 'student' | 'indigene' | 'anonymous';
  referenceCode: string;
  evidenceImage?: string;
  upvotedByUser?: boolean;
}

export interface Comment {
  id: string;
  issueId: string;
  text: string;
  date: string;
  authorName: string;
  authorRole: UserRole;
}

export const AKUNGBA_LOCATIONS = [
  'AAUA Main Gate Area',
  'AAUA South Gate Pathway',
  'Medoline (Student Area)',
  'Permanent Site Quarters',
  'Iwaro Road Intersection',
  'Okusa Community Market',
  'Ebilo Quarters',
  'Akua Quarters',
  'AAUA Campus (Lecture Theatre Area)',
  'AAUA Campus (Sports Complex)',
  'Ondo Road Outer Area',
  'Central Mosque / Palace Area'
] as const;

export interface CommunityResource {
  name: string;
  category: 'security' | 'health' | 'utility' | 'administration';
  contact: string;
  description: string;
}
