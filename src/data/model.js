export const TEAMS = [
  {
    id: 'Chennai Super Kings',
    shortName: 'CSK',
    title: 'Chennai Super Kings',
    primaryColor: '#FDB913',
    secondaryColor: '#0054A5',
    accentColor: '#F5A623',
    gradient: 'from-amber-400 to-yellow-500',
    jerseyColor: '#FDB913',
    textColor: '#1a1a1a',
    homeVenue: 'M. A. Chidambaram Stadium, Chennai',
    captain: 'MS Dhoni / Ruturaj Gaikwad',
    trophies: 5,
    emoji: '🦁'
  },
  {
    id: 'Mumbai Indians',
    shortName: 'MI',
    title: 'Mumbai Indians',
    primaryColor: '#004BA0',
    secondaryColor: '#D1AB3E',
    accentColor: '#0078FF',
    gradient: 'from-blue-600 to-indigo-700',
    jerseyColor: '#004BA0',
    textColor: '#ffffff',
    homeVenue: 'Wankhede Stadium, Mumbai',
    captain: 'Rohit Sharma / Hardik Pandya',
    trophies: 5,
    emoji: '⚡'
  },
  {
    id: 'Royal Challengers Bangalore',
    shortName: 'RCB',
    title: 'Royal Challengers Bangalore',
    primaryColor: '#EC1C24',
    secondaryColor: '#000000',
    accentColor: '#D4AF37',
    gradient: 'from-red-600 to-neutral-900',
    jerseyColor: '#EC1C24',
    textColor: '#ffffff',
    homeVenue: 'M. Chinnaswamy Stadium, Bengaluru',
    captain: 'Virat Kohli / Faf du Plessis',
    trophies: 0,
    emoji: '👑'
  },
  {
    id: 'Kolkata Knight Riders',
    shortName: 'KKR',
    title: 'Kolkata Knight Riders',
    primaryColor: '#3A225D',
    secondaryColor: '#B3A123',
    accentColor: '#7B2CBF',
    gradient: 'from-purple-800 to-indigo-900',
    jerseyColor: '#3A225D',
    textColor: '#ffffff',
    homeVenue: 'Eden Gardens, Kolkata',
    captain: 'Shreyas Iyer',
    trophies: 3,
    emoji: '⚔️'
  },
  {
    id: 'Rajasthan Royals',
    shortName: 'RR',
    title: 'Rajasthan Royals',
    primaryColor: '#EA1A85',
    secondaryColor: '#254AA5',
    accentColor: '#FF69B4',
    gradient: 'from-pink-600 to-rose-700',
    jerseyColor: '#EA1A85',
    textColor: '#ffffff',
    homeVenue: 'Sawai Mansingh Stadium, Jaipur',
    captain: 'Sanju Samson',
    trophies: 1,
    emoji: '🛡️'
  },
  {
    id: 'Sunrisers Hyderabad',
    shortName: 'SRH',
    title: 'Sunrisers Hyderabad',
    primaryColor: '#F26522',
    secondaryColor: '#000000',
    accentColor: '#FFA500',
    gradient: 'from-orange-600 to-amber-700',
    jerseyColor: '#F26522',
    textColor: '#ffffff',
    homeVenue: 'Rajiv Gandhi Intl. Stadium, Hyderabad',
    captain: 'Pat Cummins',
    trophies: 1,
    emoji: '🦅'
  },
  {
    id: 'Kings XI Punjab',
    shortName: 'KXIP',
    title: 'Kings XI Punjab (PBKS)',
    primaryColor: '#ED1B24',
    secondaryColor: '#A7A9AC',
    accentColor: '#FF4136',
    gradient: 'from-red-600 to-red-800',
    jerseyColor: '#ED1B24',
    textColor: '#ffffff',
    homeVenue: 'PCA Stadium, Mohali',
    captain: 'Shikhar Dhawan',
    trophies: 0,
    emoji: '🦁'
  },
  {
    id: 'Delhi Daredevils',
    shortName: 'DD',
    title: 'Delhi Daredevils (DC)',
    primaryColor: '#004C97',
    secondaryColor: '#EF1C24',
    accentColor: '#2575FC',
    gradient: 'from-blue-700 to-red-600',
    jerseyColor: '#004C97',
    textColor: '#ffffff',
    homeVenue: 'Arun Jaitley Stadium, Delhi',
    captain: 'Rishabh Pant',
    trophies: 0,
    emoji: '🐅'
  }
];

export const MODEL_METRICS = {
  mae: 12.12,
  mse: 251.01,
  rmse: 15.84,
  trainSamples: 37330,
  testSamples: 2778,
  algorithm: 'Linear Regression (Scikit-Learn Standard formulation)',
  baselineSeasons: 'IPL Seasons 1 to 9 (2008 - 2016) for Training, Season 10 (2017) for Testing'
};

export const MODEL_COEFFICIENTS = {
  batting: {
    'Chennai Super Kings': 1.1100696957077596,
    'Delhi Daredevils': -2.231487867588605,
    'Kings XI Punjab': 0.6099435731173036,
    'Kolkata Knight Riders': -2.929620045517251,
    'Mumbai Indians': 2.8909465706962605,
    'Rajasthan Royals': -3.6757265154249126,
    'Royal Challengers Bangalore': 3.8836134376141316,
    'Sunrisers Hyderabad': 0.6105947889543177
  },
  bowling: {
    'Chennai Super Kings': 0.167939442707093,
    'Delhi Daredevils': 0.8869491477039542,
    'Kings XI Punjab': 1.6464047520698089,
    'Kolkata Knight Riders': -3.3294148293263692,
    'Mumbai Indians': 0.22674826543002083,
    'Rajasthan Royals': 0.3247326288057306,
    'Royal Challengers Bangalore': 0.7222854069045325,
    'Sunrisers Hyderabad': -0.3821065192875562
  },
  matchStats: {
    overs: -6.371272072040358,
    runs: 0.9632020258144371,
    wickets: -4.8854098909319426,
    runs_last_5: -0.01670462212886034,
    wickets_last_5: -1.15508420368663
  },
  intercept: 165.6663367019631
};

export function predictIPLScore({
  battingTeam,
  bowlingTeam,
  overs,
  runs,
  wickets,
  runsLast5,
  wicketsLast5
}) {
  const batWeight = MODEL_COEFFICIENTS.batting[battingTeam] || 0;
  const bowlWeight = MODEL_COEFFICIENTS.bowling[bowlingTeam] || 0;

  const validOvers = Math.max(5.0, Math.min(19.5, Number(overs) || 5.0));
  const validRuns = Math.max(0, Number(runs) || 0);
  const validWickets = Math.max(0, Math.min(9, Number(wickets) || 0));
  const validRunsLast5 = Math.max(0, Number(runsLast5) || 0);
  const validWicketsLast5 = Math.max(0, Math.min(validWickets, Math.min(5, Number(wicketsLast5) || 0)));

  let rawPrediction = MODEL_COEFFICIENTS.intercept;
  rawPrediction += batWeight;
  rawPrediction += bowlWeight;
  rawPrediction += MODEL_COEFFICIENTS.matchStats.overs * validOvers;
  rawPrediction += MODEL_COEFFICIENTS.matchStats.runs * validRuns;
  rawPrediction += MODEL_COEFFICIENTS.matchStats.wickets * validWickets;
  rawPrediction += MODEL_COEFFICIENTS.matchStats.runs_last_5 * validRunsLast5;
  rawPrediction += MODEL_COEFFICIENTS.matchStats.wickets_last_5 * validWicketsLast5;

  let finalScore = Math.round(rawPrediction);
  // Boundary safety checks: final score cannot be less than current runs
  finalScore = Math.max(validRuns, finalScore);

  const rangeLow = Math.max(validRuns, finalScore - 8);
  const rangeHigh = finalScore + 8;

  // Run rate computations
  const currentRunRate = validOvers > 0 ? (validRuns / validOvers).toFixed(2) : '0.00';
  const remainingOvers = Math.max(0.1, 20.0 - validOvers);
  const projectedExtraRuns = Math.max(0, finalScore - validRuns);
  const requiredRunRate = (projectedExtraRuns / remainingOvers).toFixed(2);

  return {
    predictedScore: finalScore,
    rangeLow,
    rangeHigh,
    currentRunRate,
    requiredRunRate,
    remainingOvers: remainingOvers.toFixed(1),
    projectedExtraRuns,
    breakdown: {
      intercept: Math.round(MODEL_COEFFICIENTS.intercept),
      battingBonus: Math.round(batWeight * 10) / 10,
      bowlingImpact: Math.round(bowlWeight * 10) / 10,
      oversFactor: Math.round(MODEL_COEFFICIENTS.matchStats.overs * validOvers * 10) / 10,
      runsContribution: Math.round(MODEL_COEFFICIENTS.matchStats.runs * validRuns * 10) / 10,
      wicketLoss: Math.round(MODEL_COEFFICIENTS.matchStats.wickets * validWickets * 10) / 10
    }
  };
}

export const MATCH_PRESETS = [
  {
    name: 'Season 11: KKR vs DD (Match 13)',
    description: 'Actual match from April 16, 2018 at Eden Gardens',
    battingTeam: 'Kolkata Knight Riders',
    bowlingTeam: 'Delhi Daredevils',
    overs: 9.2,
    runs: 79,
    wickets: 2,
    runsLast5: 60,
    wicketsLast5: 1,
    actualFinalScore: '200/9'
  },
  {
    name: 'Season 11: SRH vs RCB (Match 39)',
    description: 'Actual match from May 7, 2018 at Hyderabad',
    battingTeam: 'Sunrisers Hyderabad',
    bowlingTeam: 'Royal Challengers Bangalore',
    overs: 10.5,
    runs: 67,
    wickets: 3,
    runsLast5: 29,
    wicketsLast5: 1,
    actualFinalScore: '146/10'
  },
  {
    name: 'Season 11: MI vs KXIP (Match 50)',
    description: 'Actual match from May 17, 2018 at Wankhede',
    battingTeam: 'Mumbai Indians',
    bowlingTeam: 'Kings XI Punjab',
    overs: 14.1,
    runs: 136,
    wickets: 4,
    runsLast5: 50,
    wicketsLast5: 0,
    actualFinalScore: '186/8'
  },
  {
    name: 'CSK vs MI El Clásico Powerplay Surge',
    description: 'High-octane rivalry battle at 6.0 overs with 1 wicket down',
    battingTeam: 'Chennai Super Kings',
    bowlingTeam: 'Mumbai Indians',
    overs: 6.0,
    runs: 58,
    wickets: 1,
    runsLast5: 48,
    wicketsLast5: 1,
    actualFinalScore: 'Projected 180+'
  },
  {
    name: 'RCB vs KKR Death Overs Blitz',
    description: 'Explosive finish at M. Chinnaswamy Stadium (15 overs)',
    battingTeam: 'Royal Challengers Bangalore',
    bowlingTeam: 'Kolkata Knight Riders',
    overs: 15.0,
    runs: 142,
    wickets: 3,
    runsLast5: 52,
    wicketsLast5: 1,
    actualFinalScore: 'Projected 205+'
  }
];
