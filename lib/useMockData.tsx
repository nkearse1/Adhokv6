'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface MockDataContextValue {
  projects: any[];
  clients: any[];
  talents: any[];
  bids: any[];
  reviews: any[];
  getProjectById: (id: string) => any | undefined;
}

const MockDataContext = createContext<MockDataContextValue>({
  projects: [],
  clients: [],
  talents: [],
  bids: [],
  reviews: [],
  getProjectById: () => undefined,
});

export const useMockData = () => useContext(MockDataContext);

export function MockDataProvider({ children }: { children: React.ReactNode }) {
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [talents, setTalents] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!isMock) return;
    async function load() {
      try {
        const [pRes, cRes, tRes, bRes, rRes] = await Promise.all([
          fetch('/api/db?table=projects'),
          fetch('/api/db?table=users'),
          fetch('/api/db?table=talent_profiles'),
          fetch('/api/db?table=project_bids'),
          fetch('/api/db?table=project_reviews').catch(() => ({ ok: false } as Response)),
        ]);
        const parse = async (res: Response) => (res.ok ? (await res.json()).data || [] : []);
        const proj = await parse(pRes);
        const users = await parse(cRes);
        const tals = await parse(tRes);
        const bidsData = await parse(bRes);
        const revs = await parse(rRes);
        setProjects(proj);
        setClients(users.filter((u: any) => u.userRole === 'client'));
        setTalents(tals);
        setBids(bidsData);
        setReviews(revs);
      } catch (err) {
        console.error('Failed loading mock data', err);
      }
    }
    load();
  }, [isMock]);

  if (!isMock) {
    return <>{children}</>;
  }

  const value: MockDataContextValue = {
    projects,
    clients,
    talents,
    bids,
    reviews,
    getProjectById: (id: string) => projects.find((p) => p.id === id),
  };

  return <MockDataContext.Provider value={value}>{children}</MockDataContext.Provider>;
}
