// Vercel Serverless Function for IPL Score Prediction
// Endpoint: POST /api/predict

const MODEL_COEFFICIENTS = {
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

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Please use POST.' });
  }

  try {
    const {
      battingTeam,
      bowlingTeam,
      overs,
      runs,
      wickets,
      runsLast5,
      wicketsLast5
    } = req.body || {};

    if (!battingTeam || !bowlingTeam) {
      return res.status(400).json({ error: 'battingTeam and bowlingTeam are required.' });
    }

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

    let predictedScore = Math.round(rawPrediction);
    predictedScore = Math.max(validRuns, predictedScore);

    const rangeLow = Math.max(validRuns, predictedScore - 8);
    const rangeHigh = predictedScore + 8;
    const currentRunRate = validOvers > 0 ? (validRuns / validOvers).toFixed(2) : '0.00';

    return res.status(200).json({
      success: true,
      data: {
        predictedScore,
        rangeLow,
        rangeHigh,
        currentRunRate,
        inputs: {
          battingTeam,
          bowlingTeam,
          overs: validOvers,
          runs: validRuns,
          wickets: validWickets,
          runsLast5: validRunsLast5,
          wicketsLast5: validWicketsLast5
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
