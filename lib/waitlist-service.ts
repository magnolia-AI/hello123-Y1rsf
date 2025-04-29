'use client';

import { nanoid } from 'nanoid';
import { WaitlistEntry } from './types';

// In a real app, this would be stored in a database
let waitlistEntries: WaitlistEntry[] = [];

export const getWaitlistPosition = (email: string): number | null => {
  const entry = waitlistEntries.find(entry => entry.email === email);
  return entry ? entry.position : null;
};

export const joinWaitlist = (
  name: string, 
  email: string, 
  referralCode?: string
): { success: boolean; entry?: WaitlistEntry; error?: string } => {
  // Check if email already exists
  if (waitlistEntries.some(entry => entry.email === email)) {
    return { 
      success: false, 
      error: 'This email is already on the waitlist.' 
    };
  }

  let referredBy: string | undefined = undefined;
  
  // Check if referral code is valid
  if (referralCode) {
    const referrer = waitlistEntries.find(entry => entry.referralCode === referralCode);
    if (referrer) {
      referredBy = referrer.id;
      
      // Increment referrer's count
      referrer.referralCount += 1;
      
      // Recalculate positions based on referral counts
      recalculatePositions();
    }
  }

  // Create new entry
  const newEntry: WaitlistEntry = {
    id: nanoid(),
    name,
    email,
    referralCode: nanoid(8), // Generate a unique referral code
    referredBy,
    referralCount: 0,
    position: waitlistEntries.length + 1,
    joinedAt: new Date()
  };

  // Add to waitlist
  waitlistEntries.push(newEntry);
  
  // If this was a referral, recalculate positions
  if (referredBy) {
    recalculatePositions();
  }

  return { 
    success: true, 
    entry: newEntry 
  };
};

export const getWaitlistStats = (email: string): { 
  position: number; 
  referralCount: number; 
  referralCode: string;
  totalEntries: number;
} | null => {
  const entry = waitlistEntries.find(entry => entry.email === email);
  
  if (!entry) return null;
  
  return {
    position: entry.position,
    referralCount: entry.referralCount,
    referralCode: entry.referralCode,
    totalEntries: waitlistEntries.length
  };
};

// Recalculate positions based on referral counts
const recalculatePositions = () => {
  // Sort by referral count (descending) and then by join date (ascending)
  const sorted = [...waitlistEntries].sort((a, b) => {
    if (b.referralCount !== a.referralCount) {
      return b.referralCount - a.referralCount;
    }
    return a.joinedAt.getTime() - b.joinedAt.getTime();
  });
  
  // Reassign positions
  sorted.forEach((entry, index) => {
    entry.position = index + 1;
  });
  
  // Update the waitlist with new positions
  waitlistEntries = sorted;
};

// For development/testing only - in a real app this would be removed
export const getFullWaitlist = (): WaitlistEntry[] => {
  return [...waitlistEntries];
};

// For development/testing only - in a real app this would be removed
export const clearWaitlist = (): void => {
  waitlistEntries = [];
};
