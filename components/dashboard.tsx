'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChevronDown, TrendingUp, Users, Trophy, Activity } from 'lucide-react';

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

interface DashboardProps {
  nbaData: NBATeamData[];
  gameData: GameData[];
}

export default function Dashboard({ nbaData, gameData }: DashboardProps) {
  const [selectedYear, setSelectedYear] = useState<string>('2019');
  const [viewMode, setViewMode] = useState<'overview' | 'advanced'>('overview');

  const years = useMemo(() => {
    const uniqueYears = [...new Set(nbaData.map(d => d.yearID as string))].sort().reverse();
    return uniqueYears;
  }, [nbaData]);

  const filteredTeamData = useMemo(() => {
    return nbaData.filter(d => d.yearID === selectedYear).sort((a, b) => (b.W as number) - (a.W as number));
  }, [nbaData, selectedYear]);

  const yearOverYearTrend = useMemo(() => {
    const grouped: { [key: string]: NBATeamData[] } = {};
    nbaData.forEach(d => {
      if (!grouped[d.yearID]) grouped[d.yearID] = [];
      grouped[d.yearID].push(d);
    });

    return Object.keys(grouped)
      .sort()
      .map(year => {
        const teams = grouped[year];
        const avgPTS = teams.reduce((sum, t) => sum + (t.PTS as number), 0) / teams.length;
        const avgORtg = teams.reduce((sum, t) => sum + (t.ORtg as number), 0) / teams.length;
        const avgDRtg = teams.reduce((sum, t) => sum + (t.DRtg as number), 0) / teams.length;
        return {
          year: year.slice(-2),
          avgPTS: parseFloat(avgPTS.toFixed(1)),
          avgORtg: parseFloat(avgORtg.toFixed(1)),
          avgDRtg: parseFloat(avgDRtg.toFixed(1)),
        };
      });
  }, [nbaData]);

  const winLossData = useMemo(() => {
    return filteredTeamData.slice(0, 10).map(team => ({
      name: team.Team?.toString().split(' ').pop() || 'Team',
      wins: team.W,
      losses: team.L,
      fullName: team.Team,
    }));
  }, [filteredTeamData]);

  const statCorrelation = useMemo(() => {
    return filteredTeamData.slice(0, 12).map(team => ({
      name: team.Team?.toString().split(' ').pop() || 'Team',
      ORtg: team.ORtg,
      DRtg: team.DRtg,
      wins: team.W,
    }));
  }, [filteredTeamData]);

  const stats = useMemo(() => {
    if (filteredTeamData.length === 0) return null;
    const avgWins = (filteredTeamData.reduce((sum, t) => sum + (t.W as number), 0) / filteredTeamData.length).toFixed(1);
    const avgORtg = (filteredTeamData.reduce((sum, t) => sum + (t.ORtg as number), 0) / filteredTeamData.length).toFixed(1);
    const topTeam = filteredTeamData[0];
    return { avgWins, avgORtg, topTeam };
  }, [filteredTeamData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-foreground">
                Basketball Analytics
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                NBA Performance & Statistics Dashboard
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 bg-secondary text-foreground rounded-lg border border-border text-sm md:text-base"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <Button
                variant={viewMode === 'overview' ? 'default' : 'outline'}
                onClick={() => setViewMode('overview')}
                className="text-sm md:text-base"
              >
                Overview
              </Button>
              <Button
                variant={viewMode === 'advanced' ? 'default' : 'outline'}
                onClick={() => setViewMode('advanced')}
                className="text-sm md:text-base"
              >
                Advanced
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 md:p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-2">Average Wins</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{stats.avgWins}</p>
                </div>
                <Trophy className="w-8 h-8 md:w-10 md:h-10 text-accent opacity-50" />
              </div>
            </Card>

            <Card className="p-4 md:p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-2">Avg Offensive Rating</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{stats.avgORtg}</p>
                </div>
                <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-accent opacity-50" />
              </div>
            </Card>

            <Card className="p-4 md:p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-2">Top Team</p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">
                    {stats.topTeam.Team?.toString().split(' ').slice(-2).join(' ')}
                  </p>
                </div>
                <Users className="w-8 h-8 md:w-10 md:h-10 text-accent opacity-50" />
              </div>
            </Card>

            <Card className="p-4 md:p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-2">Teams Analyzed</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{filteredTeamData.length}</p>
                </div>
                <Activity className="w-8 h-8 md:w-10 md:h-10 text-accent opacity-50" />
              </div>
            </Card>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Win/Loss Chart */}
          <Card className="p-4 md:p-6 bg-card border-border">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Top 10 Teams - Wins vs Losses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={winLossData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="wins" fill="#00d084" />
                <Bar dataKey="losses" fill="#ff6b6b" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Offensive vs Defensive Rating */}
          <Card className="p-4 md:p-6 bg-card border-border">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Offensive vs Defensive Rating</h2>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  type="number"
                  dataKey="ORtg"
                  name="Offensive Rating"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  type="number"
                  dataKey="DRtg"
                  name="Defensive Rating"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                  labelStyle={{ color: '#fff' }}
                  cursor={{ strokeDasharray: '3 3' }}
                />
                <Scatter
                  name="Teams"
                  data={statCorrelation}
                  fill="#00d084"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Year Over Year Trend */}
        <Card className="p-4 md:p-6 bg-card border-border mt-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">League Trends Over Time</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={yearOverYearTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="avgPTS" stroke="#00d084" strokeWidth={2} name="Avg Points" />
              <Line type="monotone" dataKey="avgORtg" stroke="#4f46e5" strokeWidth={2} name="Avg Offensive Rating" />
              <Line type="monotone" dataKey="avgDRtg" stroke="#f97316" strokeWidth={2} name="Avg Defensive Rating" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Advanced Stats - Team Table */}
        {viewMode === 'advanced' && (
          <Card className="p-4 md:p-6 bg-card border-border mt-6">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Detailed Team Statistics</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 md:px-4 text-muted-foreground font-semibold">Team</th>
                    <th className="text-right py-3 px-2 md:px-4 text-muted-foreground font-semibold">W</th>
                    <th className="text-right py-3 px-2 md:px-4 text-muted-foreground font-semibold">L</th>
                    <th className="text-right py-3 px-2 md:px-4 text-muted-foreground font-semibold">PTS</th>
                    <th className="text-right py-3 px-2 md:px-4 text-muted-foreground font-semibold">ORtg</th>
                    <th className="text-right py-3 px-2 md:px-4 text-muted-foreground font-semibold">DRtg</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeamData.map((team, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-secondary transition-colors">
                      <td className="py-3 px-2 md:px-4 text-foreground font-medium truncate">{team.Team}</td>
                      <td className="text-right py-3 px-2 md:px-4 text-foreground">{team.W}</td>
                      <td className="text-right py-3 px-2 md:px-4 text-foreground">{team.L}</td>
                      <td className="text-right py-3 px-2 md:px-4 text-foreground">{(team.PTS as number).toFixed(1)}</td>
                      <td className="text-right py-3 px-2 md:px-4 text-accent font-semibold">{(team.ORtg as number).toFixed(1)}</td>
                      <td className="text-right py-3 px-2 md:px-4 text-foreground">{(team.DRtg as number).toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6 md:py-8 text-center text-sm md:text-base text-muted-foreground">
          <p>Basketball Performance Analytics Dashboard • Data includes NBA seasons 2000-2019</p>
        </div>
      </footer>
    </div>
  );
}
