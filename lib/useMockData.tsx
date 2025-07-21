'use client';
import React, { createContext, useContext } from 'react';
import {
  mockProjects,
  mockClients,
  mockTalents,
  mockBids,
  mockReviews,
  getProjectById,
  type MockProject,
  type MockUser,
  type MockBid,
  type MockReview,
} from './mockData';

interface MockDataContextValue {
  projects: MockProject[];
  clients: MockUser[];
  talents: MockUser[];
  bids: MockBid[];
  reviews: MockReview[];
  getProjectById: (id: string) => MockProject | undefined;
}

const MockDataContext = createContext<MockDataContextValue>({
  projects: mockProjects,
  clients: mockClients,
  talents: mockTalents,
  bids: mockBids,
  reviews: mockReviews,
  getProjectById,
});

export const useMockData = () => useContext(MockDataContext);

export function MockDataProvider({ children }: { children: React.ReactNode }) {
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
  if (!isMock) return <>{children}</>;
  const value: MockDataContextValue = {
    projects: mockProjects,
    clients: mockClients,
    talents: mockTalents,
    bids: mockBids,
    reviews: mockReviews,
    getProjectById,
  };
  return (
    <MockDataContext.Provider value={value}>{children}</MockDataContext.Provider>
  );
}
