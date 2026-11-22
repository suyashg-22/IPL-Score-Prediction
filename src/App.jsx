import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Flame,
  Activity,
  ArrowRightLeft,
  RotateCcw,
  Sparkles,
  Info,
  Code2,
  TrendingUp,
  Shield,
  Target,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sliders,
  BarChart3
} from 'lucide-react';
import { TEAMS, MODEL_METRICS, MATCH_PRESETS, predictIPLScore } from './data/model';

export default function App() {
  const [battingTeam, setBattingTeam] = useState('Kolkata Knight Riders');
  const [bowlingTeam, setBowlingTeam] = useState('Delhi Daredevils');
  const [overs, setOvers] = useState(9.2);
  const [runs, setRuns] = useState(79);
  const [wickets, setWickets] = useState(2);
  const [runsLast5, setRunsLast5] = useState(60);
  const [wicketsLast5, setWicketsLast5] = useState(1);
  const [activeTab, setActiveTab] = useState('prediction'); // 'prediction' | 'model' | 'api'
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Batting and Bowling Team objects
  const batTeamObj = useMemo(() => TEAMS.find(t => t.id === battingTeam) || TEAMS[0], [battingTeam]);
  const bowlTeamObj = useMemo(() => TEAMS.find(t => t.id === bowlingTeam) || TEAMS[1], [bowlingTeam]);

  // Real-time Prediction
  const prediction = useMemo(() => {
    return predictIPLScore({
      battingTeam,
      bowlingTeam,
      overs,
      runs,
      wickets,
      runsLast5,
      wicketsLast5
    });
  }, [battingTeam, bowlingTeam, overs, runs, wickets, runsLast5, wicketsLast5]);

  // Trigger celebration if score crosses 195
  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FDB913', '#004BA0', '#EC1C24', '#3A225D']
    });
  };

  const handleScoreBurst = (newRuns) => {
    setRuns(newRuns);
    if (newRuns >= 190 && !hasCelebrated) {
      triggerConfetti();
      setHasCelebrated(true);
    }
  };

  const handleSwapTeams = () => {
    setBattingTeam(bowlingTeam);
    setBowlingTeam(battingTeam);
  };

  const loadPreset = (preset) => {
    setBattingTeam(preset.battingTeam);
    setBowlingTeam(preset.bowlingTeam);
    setOvers(preset.overs);
    setRuns(preset.runs);
    setWickets(preset.wickets);
    setRunsLast5(preset.runsLast5);
    setWicketsLast5(preset.wicketsLast5);
  };

  const handleReset = () => {
    setOvers(5.0);
    setRuns(45);
    setWickets(1);
    setRunsLast5(45);
    setWicketsLast5(1);
    setHasCelebrated(false);
  };

  // Score tier evaluation
  const getScoreTier = (score) => {
    if (score >= 200) return { label: '🔥 Mammoth Total (200+)', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' };
    if (score >= 175) return { label: '⚡ Above Par Score (175 - 199)', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' };
    if (score >= 150) return { label: '⚖️ Competitive Total (150 - 174)', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' };
    return { label: '⚠️ Below Par Score (<150)', color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' };
  };

  const scoreTier = getScoreTier(prediction.predictedScore);

  return (
    <div className="min-h-screen text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-900">
      {/* Top Bar with Match Ticker */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold text-xl">
              🏏
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-300 via-yellow-200 to-white bg-clip-text text-transparent">
                  IPL SCORE PREDICTOR
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-pulse"></span> ML LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Trained on 76,000+ IPL match deliveries with Scikit-Learn
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/suyashg-22/IPL-Score-Prediction"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-black bg-white hover:bg-slate-200 transition"
            >
              <svg className="w-3 h-3" viewBox="0 0 76 65" fill="currentColor">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
              </svg>
              <span>Vercel Deploy</span>
            </a>
          </div>
        </div>
      </header>

      {/* Preset Match Scenarios Pill Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-4 py-2.5 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 whitespace-nowrap mr-1">
            <Sparkles className="w-3.5 h-3.5" /> Historical Match Presets:
          </span>
          <div className="flex items-center gap-2 flex-nowrap">
            {MATCH_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => loadPreset(preset)}
                className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium bg-slate-800 hover:bg-slate-700/90 text-slate-300 hover:text-white border border-slate-700/60 hover:border-amber-500/40 transition flex items-center gap-1.5"
              >
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('prediction')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'prediction'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Live Match Predictor</span>
          </button>
          <button
            onClick={() => setActiveTab('model')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'model'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>ML Model Stats & Accuracy</span>
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'api'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>REST API / Vercel Deploy</span>
          </button>
        </div>

        {activeTab === 'prediction' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Match Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Teams Selection Card */}
              <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>Select Franchises</span>
                  </h2>
                  <button
                    onClick={handleSwapTeams}
                    title="Swap Batting and Bowling Teams"
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 transition flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Swap Sides</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Batting Team Dropdown */}
                  <div className="p-4 rounded-xl border border-slate-700/60 bg-slate-900/80 relative">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                      <span className="uppercase tracking-wider">🏏 Batting Team</span>
                      <span className="text-amber-400">{batTeamObj.emoji} {batTeamObj.shortName}</span>
                    </div>
                    <select
                      value={battingTeam}
                      onChange={(e) => {
                        const newBat = e.target.value;
                        setBattingTeam(newBat);
                        if (newBat === bowlingTeam) {
                          const fallbackBowl = TEAMS.find(t => t.id !== newBat)?.id || '';
                          setBowlingTeam(fallbackBowl);
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-700 text-white font-semibold text-sm rounded-lg px-3 py-2.5 outline-none focus:border-amber-400 transition"
                    >
                      {TEAMS.map(team => (
                        <option key={team.id} value={team.id} disabled={team.id === bowlingTeam}>
                          {team.emoji} {team.title}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-400 mt-2 truncate">
                      Home: {batTeamObj.homeVenue}
                    </p>
                  </div>

                  {/* Bowling Team Dropdown */}
                  <div className="p-4 rounded-xl border border-slate-700/60 bg-slate-900/80 relative">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                      <span className="uppercase tracking-wider">🎯 Bowling Team</span>
                      <span className="text-blue-400">{bowlTeamObj.emoji} {bowlTeamObj.shortName}</span>
                    </div>
                    <select
                      value={bowlingTeam}
                      onChange={(e) => {
                        const newBowl = e.target.value;
                        setBowlingTeam(newBowl);
                        if (newBowl === battingTeam) {
                          const fallbackBat = TEAMS.find(t => t.id !== newBowl)?.id || '';
                          setBattingTeam(fallbackBat);
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-700 text-white font-semibold text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-400 transition"
                    >
                      {TEAMS.map(team => (
                        <option key={team.id} value={team.id} disabled={team.id === battingTeam}>
                          {team.emoji} {team.title}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-400 mt-2 truncate">
                      Home: {bowlTeamObj.homeVenue}
                    </p>
                  </div>
                </div>
              </div>

              {/* Match State Controls */}
              <div className="glass-panel rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span>In-Game Match Parameters</span>
                  </h2>
                  <button
                    onClick={handleReset}
                    className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Overs Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-slate-300">
                      Overs Completed: <span className="text-amber-400 font-bold text-base">{Number(overs).toFixed(1)}</span> / 20.0
                    </label>
                    <span className="text-xs text-slate-500 font-medium">Min 5.0 (per ML model)</span>
                  </div>
                  <input
                    type="range"
                    min="5.0"
                    max="19.5"
                    step="0.1"
                    value={overs}
                    onChange={(e) => setOvers(parseFloat(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>5.0 (Powerplay End)</span>
                    <span>10.0 (Middle)</span>
                    <span>15.0 (Death Overs)</span>
                    <span>19.5 (Final Over)</span>
                  </div>
                </div>

                {/* Current Runs & Quick Steppers */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-slate-300">
                      Current Runs: <span className="text-emerald-400 font-bold text-lg">{runs}</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleScoreBurst(runs + 1)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => handleScoreBurst(runs + 4)}
                        className="px-2 py-0.5 rounded bg-blue-500/20 hover:bg-blue-500/30 text-xs font-bold text-blue-300 border border-blue-500/40 transition"
                      >
                        +4 FOUR
                      </button>
                      <button
                        onClick={() => handleScoreBurst(runs + 6)}
                        className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-xs font-bold text-amber-300 border border-amber-500/40 transition"
                      >
                        +6 SIX!
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="350"
                    value={runs}
                    onChange={(e) => setRuns(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-700 text-white font-bold text-lg rounded-xl px-4 py-2.5 outline-none focus:border-emerald-400 transition"
                  />
                </div>

                {/* Current Wickets Fallen */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Wickets Fallen: <span className="text-rose-400 font-bold">{wickets}</span> / 10
                  </label>
                  <div className="grid grid-cols-10 gap-1.5">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((w) => (
                      <button
                        key={w}
                        onClick={() => {
                          setWickets(w);
                          if (wicketsLast5 > w) setWicketsLast5(w);
                        }}
                        className={`py-2 rounded-lg text-xs font-bold transition border ${
                          wickets === w
                            ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30'
                            : w < wickets
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Last 5 Overs Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Runs in Last 5 Overs: <span className="text-amber-400 font-bold">{runsLast5}</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={runs}
                      value={runsLast5}
                      onChange={(e) => setRunsLast5(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-slate-950 border border-slate-700 text-white font-semibold text-sm rounded-lg px-3 py-2 outline-none focus:border-amber-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Wickets in Last 5 Overs: <span className="text-rose-400 font-bold">{wicketsLast5}</span>
                    </label>
                    <div className="flex gap-1.5">
                      {[0, 1, 2, 3, 4, 5].map((w5) => (
                        <button
                          key={w5}
                          disabled={w5 > wickets}
                          onClick={() => setWicketsLast5(w5)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                            wicketsLast5 === w5
                              ? 'bg-amber-400 text-slate-950 border-amber-300'
                              : w5 > wickets
                              ? 'opacity-30 cursor-not-allowed bg-slate-950 border-slate-800'
                              : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                          }`}
                        >
                          {w5}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Prediction Scoreboard (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Highlighted Prediction Board */}
              <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden">
                {/* Background decorative glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-xs uppercase tracking-widest font-extrabold text-amber-400">
                    Projected 1st Innings Total
                  </span>
                </div>

                {/* Score Number Display */}
                <div className="my-2">
                  <div className="teko-font text-7xl sm:text-8xl font-extrabold text-white leading-none tracking-tight">
                    {prediction.predictedScore}
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Expected Range: <span className="text-amber-300 font-extrabold text-sm">{prediction.rangeLow} - {prediction.rangeHigh}</span> Runs
                  </div>
                </div>

                {/* Score Tier Badge */}
                <div className="mt-4">
                  <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold border ${scoreTier.color}`}>
                    {scoreTier.label}
                  </span>
                </div>

                {/* Match Velocity Metrics */}
                <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-left">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Current Run Rate
                    </span>
                    <span className="text-lg font-extrabold text-emerald-400">
                      {prediction.currentRunRate} <span className="text-xs text-slate-400 font-normal">rpo</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Projected Req. RR
                    </span>
                    <span className="text-lg font-extrabold text-amber-400">
                      {prediction.requiredRunRate} <span className="text-xs text-slate-400 font-normal">rpo</span>
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 mt-4 flex items-center justify-between px-2">
                  <span>Runs to add in {prediction.remainingOvers} overs:</span>
                  <span className="font-bold text-white">+{prediction.projectedExtraRuns} runs</span>
                </div>
              </div>

              {/* Over-by-Over Worm Simulation */}
              <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Projected Match Worm Trajectory</span>
                </h3>

                {/* Simple SVG Worm Chart */}
                <div className="h-32 w-full relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 100">
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="200" y2="20" stroke="#334155" strokeDasharray="3 3" opacity="0.3" />
                    <line x1="0" y1="50" x2="200" y2="50" stroke="#334155" strokeDasharray="3 3" opacity="0.3" />
                    <line x1="0" y1="80" x2="200" y2="80" stroke="#334155" strokeDasharray="3 3" opacity="0.3" />

                    {/* Trajectory Path: (0, 100) -> (overs * 10, 100 - (runs/250)*80) -> (200, 100 - (predictedScore/250)*80) */}
                    {(() => {
                      const curX = Math.min(200, (overs / 20.0) * 200);
                      const curY = Math.max(10, 100 - (runs / 240.0) * 85);
                      const endY = Math.max(5, 100 - (prediction.predictedScore / 240.0) * 85);
                      return (
                        <>
                          {/* Past trajectory solid line */}
                          <path
                            d={`M 0 95 Q ${curX * 0.5} ${95 - (runs / 240) * 40} ${curX} ${curY}`}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="3"
                          />
                          {/* Projected trajectory dashed line */}
                          <path
                            d={`M ${curX} ${curY} Q ${(curX + 200) * 0.5} ${(curY + endY) * 0.5} 200 ${endY}`}
                            fill="none"
                            stroke="#facc15"
                            strokeWidth="3"
                            strokeDasharray="4 4"
                          />
                          {/* Current match ball point */}
                          <circle cx={curX} cy={curY} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                          {/* Predicted final score point */}
                          <circle cx="200" cy={endY} r="5" fill="#facc15" stroke="#ffffff" strokeWidth="2" />
                        </>
                      );
                    })()}
                  </svg>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Current: {runs}/{wickets} ({overs} ov)
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Predicted: {prediction.predictedScore} (20 ov)
                  </span>
                </div>
              </div>

              {/* Model Feature Influence Details */}
              <div className="glass-panel rounded-2xl p-5 text-xs space-y-2">
                <span className="font-bold text-slate-300 block mb-1">
                  How Features Affected This Score:
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-400">
                  <div className="p-2 rounded bg-slate-900/60 flex justify-between">
                    <span>Base Intercept:</span>
                    <span className="font-bold text-white">{prediction.breakdown.intercept}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 flex justify-between">
                    <span>Batting Franchise:</span>
                    <span className={`font-bold ${prediction.breakdown.battingBonus >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {prediction.breakdown.battingBonus > 0 ? `+${prediction.breakdown.battingBonus}` : prediction.breakdown.battingBonus}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 flex justify-between">
                    <span>Bowling Franchise:</span>
                    <span className={`font-bold ${prediction.breakdown.bowlingImpact >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {prediction.breakdown.bowlingImpact > 0 ? `+${prediction.breakdown.bowlingImpact}` : prediction.breakdown.bowlingImpact}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 flex justify-between">
                    <span>Wickets Impact:</span>
                    <span className="font-bold text-rose-400">{prediction.breakdown.wicketLoss}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Model Performance & Architecture */}
        {activeTab === 'model' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                <span>Machine Learning Model Architecture & Benchmarks</span>
              </h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                The notebook evaluated 5 regression algorithms: Linear Regression, Decision Trees, Random Forest, and AdaBoost.
                Linear Regression achieved the lowest Mean Absolute Error (MAE: 12.12 runs) and Root Mean Squared Error (RMSE: 15.84 runs).
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Mean Absolute Error</span>
                  <span className="text-2xl font-extrabold text-amber-400">{MODEL_METRICS.mae}</span>
                  <span className="text-[11px] text-slate-500 block">Runs error margin</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Root Mean Sq. Error</span>
                  <span className="text-2xl font-extrabold text-emerald-400">{MODEL_METRICS.rmse}</span>
                  <span className="text-[11px] text-slate-500 block">RMSE metric</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Training Samples</span>
                  <span className="text-2xl font-extrabold text-blue-400">37,330</span>
                  <span className="text-[11px] text-slate-500 block">Seasons 2008-2016</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Test Samples</span>
                  <span className="text-2xl font-extrabold text-purple-400">2,778</span>
                  <span className="text-[11px] text-slate-500 block">Season 2017</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mb-3">Model Comparison from Notebook</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900 text-xs uppercase text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Algorithm</th>
                      <th className="py-3 px-4">MAE (Runs)</th>
                      <th className="py-3 px-4">MSE</th>
                      <th className="py-3 px-4">RMSE</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs">
                    <tr className="bg-amber-400/10 font-bold text-amber-300">
                      <td className="py-3 px-4 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-400" /> Linear Regression
                      </td>
                      <td className="py-3 px-4">12.12</td>
                      <td className="py-3 px-4">251.01</td>
                      <td className="py-3 px-4">15.84</td>
                      <td className="py-3 px-4 text-emerald-400">Selected (Best Model)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">AdaBoost Regressor</td>
                      <td className="py-3 px-4">12.22</td>
                      <td className="py-3 px-4">249.60</td>
                      <td className="py-3 px-4">15.80</td>
                      <td className="py-3 px-4 text-slate-500">Negligible difference</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Random Forest</td>
                      <td className="py-3 px-4">13.76</td>
                      <td className="py-3 px-4">330.21</td>
                      <td className="py-3 px-4">18.17</td>
                      <td className="py-3 px-4 text-slate-500">Overfitting</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Decision Tree</td>
                      <td className="py-3 px-4">17.09</td>
                      <td className="py-3 px-4">531.06</td>
                      <td className="py-3 px-4">23.04</td>
                      <td className="py-3 px-4 text-rose-500">Highest variance</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: API & Vercel Deployment Guide */}
        {activeTab === 'api' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-amber-400" />
                <span>Vercel Deployment & REST API Integration</span>
              </h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Because this application is built with React/Vite and includes a Vercel Serverless Function at <code className="text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded">/api/predict</code>,
                it can be deployed directly to Vercel without configuring complex Python microservices or Docker containers.
              </p>

              {/* Deployment Steps Card */}
              <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 mb-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>How to Deploy to Vercel in 2 Minutes:</span>
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-300">
                  <li>
                    Push this workspace commit to your GitHub repository:
                    <pre className="mt-1 p-2 rounded bg-slate-950 text-amber-300 text-xs overflow-x-auto">
                      git add . && git commit -m "Add React frontend and Vercel deployment" && git push origin main
                    </pre>
                  </li>
                  <li>
                    Open your Vercel Dashboard at <a href="https://vercel.com/suyashs-projects-8d8c18dc" target="_blank" rel="noreferrer" className="text-amber-400 underline font-semibold">vercel.com/suyashs-projects-8d8c18dc</a>.
                  </li>
                  <li>
                    Click <strong>Add New Project</strong> &rarr; Import <strong>IPL-Score-Prediction</strong>.
                  </li>
                  <li>
                    Vercel automatically detects the Vite framework. Click <strong>Deploy</strong>!
                  </li>
                </ol>
              </div>

              {/* cURL API Sample */}
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Example REST API Request (Serverless):</h3>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 overflow-x-auto">
{`curl -X POST https://your-project.vercel.app/api/predict \\
  -H "Content-Type: application/json" \\
  -d '{
    "battingTeam": "Kolkata Knight Riders",
    "bowlingTeam": "Delhi Daredevils",
    "overs": 9.2,
    "runs": 79,
    "wickets": 2,
    "runsLast5": 60,
    "wicketsLast5": 1
  }'`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>IPL First Innings Score Predictor • Machine Learning Project</p>
        <p className="mt-1">
          GitHub: <a href="https://github.com/suyashg-22/IPL-Score-Prediction" className="text-slate-400 hover:text-white transition">suyashg-22/IPL-Score-Prediction</a>
        </p>
      </footer>
    </div>
  );
}
