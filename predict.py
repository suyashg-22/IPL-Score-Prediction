"""
IPL First Innings Score Predictor - Python CLI & ML Model Runner
Trained on IPL historical dataset (Seasons 1-9 for train, Season 10 for test)
Matching Scikit-Learn LinearRegression formulation
"""

import json
import os

MODEL_FILE = os.path.join(os.path.dirname(__file__), 'model_weights.json')

with open(MODEL_FILE, 'r') as f:
    MODEL = json.load(f)

TEAMS = MODEL['teams']
COEFFS = MODEL['coefficients']
INTERCEPT = MODEL['intercept']

def predict_score(
    batting_team='Kolkata Knight Riders',
    bowling_team='Delhi Daredevils',
    overs=9.2,
    runs=79,
    wickets=2,
    runs_in_prev_5=60,
    wickets_in_prev_5=1
):
    if batting_team not in TEAMS:
        raise ValueError(f"Unknown batting team '{batting_team}'. Must be one of: {TEAMS}")
    if bowling_team not in TEAMS:
        raise ValueError(f"Unknown bowling team '{bowling_team}'. Must be one of: {TEAMS}")
    if overs < 5.0 or overs > 20.0:
        raise ValueError("Overs must be between 5.0 and 20.0 as per model constraints.")

    score = INTERCEPT
    score += COEFFS.get(f'bat_{batting_team}', 0.0)
    score += COEFFS.get(f'bowl_{bowling_team}', 0.0)
    score += COEFFS['overs'] * overs
    score += COEFFS['runs'] * runs
    score += COEFFS['wickets'] * wickets
    score += COEFFS['runs_last_5'] * runs_in_prev_5
    score += COEFFS['wickets_last_5'] * wickets_in_prev_5

    predicted = int(round(score))
    predicted = max(runs, predicted)
    return {
        'predicted_score': predicted,
        'range': (max(runs, predicted - 8), predicted + 8),
        'inputs': {
            'batting_team': batting_team,
            'bowling_team': bowling_team,
            'overs': overs,
            'runs': runs,
            'wickets': wickets,
            'runs_in_prev_5': runs_in_prev_5,
            'wickets_in_prev_5': wickets_in_prev_5
        }
    }

if __name__ == '__main__':
    result = predict_score(
        batting_team='Kolkata Knight Riders',
        bowling_team='Delhi Daredevils',
        overs=9.2,
        runs=79,
        wickets=2,
        runs_in_prev_5=60,
        wickets_in_prev_5=1
    )
    print("--- IPL Score Prediction Sample ---")
    print(f"Match: {result['inputs']['batting_team']} vs {result['inputs']['bowling_team']}")
    print(f"Current: {result['inputs']['runs']}/{result['inputs']['wickets']} in {result['inputs']['overs']} overs")
    print(f"Predicted Score: {result['predicted_score']}")
    print(f"Predicted Range: {result['range'][0]} to {result['range'][1]} runs")
