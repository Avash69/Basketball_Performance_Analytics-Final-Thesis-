'use client';

import { useState, useMemo } from 'react';
import Papa from 'papaparse';
import Dashboard from '@/components/dashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface NBATeamData {
  yearID: string;
  Team: string;
  W: number;
  L: number;
  PTS: number;
  ORtg: number;
  DRtg: number;
  [key: string]: string | number;
}

interface GameData {
  yearID: string;
  home_team: string;
  away_team: string;
  home_win: number;
  [key: string]: string | number;
}

export default function Home() {
  const [nbaData, setNbaData] = useState<NBATeamData[]>([]);
  const [gameData, setGameData] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load CSV data
  useMemo(() => {
    const loadData = async () => {
      try {
        const nbaResponse = await fetch('/data/nba_data.csv');
        const nbaText = await nbaResponse.text();
        
        const gameResponse = await fetch('/data/game_data.csv');
        const gameText = await gameResponse.text();

        Papa.parse(nbaText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setNbaData(results.data as NBATeamData[]);
          },
        });

        Papa.parse(gameText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setGameData(results.data as GameData[]);
          },
        });

        setLoading(false);
        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    if (!dataLoaded) {
      loadData();
    }
  }, [dataLoaded]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center max-w-md mx-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">Loading basketball analytics...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Dashboard nbaData={nbaData} gameData={gameData} />
    </div>
  );
}
