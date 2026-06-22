 function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { var lastAccessLHS = undefined; var value = ops[0]; var i = 1; while (i < ops.length) { var op = ops[i]; var fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var { useState, useEffect, useRef } = React;
var { createClient } = supabase;

// ─── SUPABASE CLIENT ──────────────────────────────────────────────────────────
var SUPABASE_URL  = "https://gnsslilzhdqfxousonvr.supabase.co";
var SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imduc3NsaWx6aGRxZnhvdXNvbnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNjExMjAsImV4cCI6MjA5MDgzNzEyMH0.iglSD2SqKaNUM8719ag9ZURB03jeMHmjDSdkFDKP-ww";
var supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ─── GAME DATA ────────────────────────────────────────────────────────────────

var GAMES = [
  // AROUND THE CLOCK — 4 LEVELS
  {
    id: "atc-l1", name: "Around the Clock — Level 1", icon: "🕐", category: "Accuracy", difficulty: "Beginner", duration: "10–15 min",
    shortDesc: "Hit every number 1–20 in order (any segment), then finish on the bull.",
    description: "The most fundamental darts training game. Hit each number 1–20 in any segment — single, double or treble all count. Track how many darts it takes. Perfect starting point for all levels.",
    rules: ["Start at 1. Hit any segment of each number to advance.", "Work up to 20, then finish on any bull (inner or outer).", "Count every dart thrown — including misses.", "If you hit the current AND next number in one visit, you advance twice.", "Record total darts to complete the full circuit."],
    scoring: "Total darts thrown. Perfect = 21 darts. Beginners average 60–120. Lower is better.",
    tips: "Aim for the largest part of each segment. No bonus for doubles or trebles here — just hit the number.",
    scoreLabel: "Total darts thrown", scoreType: "lower", isSpecial: "atc", level: 1,
  },
  {
    id: "atc-l2", name: "Around the Clock — Level 2", icon: "🕑", category: "Accuracy", difficulty: "Intermediate", duration: "15–20 min",
    shortDesc: "Doubles only — hit D1 through D20, finish on double bull.",
    description: "Same structure as Level 1 but only doubles count. A direct finishing drill — you can't win 501 without hitting doubles, and this forces you to visit every single one on the board.",
    rules: ["Start at D1. You must hit the double segment to advance — singles and trebles don't count.", "Work through D2, D3... up to D20, then finish on double bull.", "Count every dart thrown including misses.", "Record total darts to complete the full circuit."],
    scoring: "Total darts thrown. Expect 80–150 as a beginner. Under 60 is excellent. Note which doubles slow you down.",
    tips: "D3, D4, D11 and D12 catch most players out. If you're consistently slow on certain doubles, give them extra practice at the start of your next session.",
    scoreLabel: "Total darts thrown", scoreType: "lower", isSpecial: "atc", level: 2,
  },
  {
    id: "atc-l3", name: "Around the Clock — Level 3", icon: "🕒", category: "Accuracy", difficulty: "Advanced", duration: "15–20 min",
    shortDesc: "Trebles only — hit T1 through T20, finish on double bull.",
    description: "The hardest sequential version. You must hit the treble of each number to advance. The treble bed is only 8mm wide — this drill exposes any inconsistency in your release and arm action.",
    rules: ["Start at T1. You must hit the treble segment to advance — singles and doubles don't count.", "Work through T2, T3... up to T20, then finish on double bull.", "Count every dart thrown including misses.", "Record total darts to complete the full circuit."],
    scoring: "Total darts thrown. Under 80 is excellent. Most players will use 100–200+ darts. This is serious accuracy training.",
    tips: "Accuracy over power. If you're grouping around the treble but not in it, your aim is fine but your release point varies. Focus on releasing at exactly the same point every throw.",
    scoreLabel: "Total darts thrown", scoreType: "lower", isSpecial: "atc", level: 3,
  },
  {
    id: "atc-l4", name: "Around the Clock — Level 4", icon: "🕓", category: "Accuracy", difficulty: "Advanced", duration: "20 min",
    shortDesc: "Shanghai each number — hit single, double AND treble. 20 minute time limit.",
    description: "The ultimate Around the Clock challenge. You must hit the single, double AND treble of each number in any order before advancing — a Shanghai. You can take as many darts as you need, but there's a 20 minute overall time limit. Finish on any bull. This is elite-level all-board accuracy.",
    rules: ["Start at 1. You must hit the single, double AND treble of that number before advancing.", "You can throw as many darts as needed — but the whole game has a 20 minute time limit.", "Track which segments you've hit on each number — the app shows your progress.", "Once all three segments are ticked off, you advance to the next number.", "Finish by hitting any bull (inner or outer). If time runs out, your score is the last number you completed."],
    scoring: "How many numbers you Shanghai'd before time runs out. Completing 1–20 plus bull within 20 minutes is the goal. Record how far you get each session.",
    tips: "Plan your darts — if you've hit the single and treble, go for the double next. Don't waste darts on segments you've already hit. Stay calm as the timer counts down.",
    scoreLabel: "Numbers completed", scoreType: "higher", isSpecial: "atc", level: 4,
  },

  // OTHER GAMES
  {
    id: "501", name: "501", icon: "🎯", category: "Scoring", difficulty: "Intermediate", duration: "15–20 min",
    shortDesc: "Start at 501, reach exactly zero. Must finish on a double.",
    description: "501 is the standard competitive darts format. It develops scoring on treble 20, mental arithmetic for calculating outs, and the pressure of finishing on a double.",
    rules: ["Start at 501. Subtract your 3-dart total each round.", "You must reach exactly zero — going below zero is a bust.", "The final dart MUST land in a double or the bullseye.", "Track how many darts it takes to complete each leg."],
    scoring: "Darts per leg. Professionals finish in ~15–17 darts. Club players 20–35 darts.",
    tips: "T20 = 60 pts. When you drop out of T20, switch to T19 or T18. Learn common checkouts: 170, 121, 81, 41.",
    scoreLabel: "Darts to finish the leg", scoreType: "lower",
  },
  {
    id: "cricket", name: "Cricket", icon: "🏏", category: "Match Play", difficulty: "Intermediate", duration: "15–25 min",
    shortDesc: "Close out 15–20 and bull by hitting each three times.",
    description: "Cricket blends accuracy with tactical thinking. Close numbers before your opponent while stopping them from scoring. Great for all-round board knowledge.",
    rules: ["Numbers in play: 15, 16, 17, 18, 19, 20, and bull.", "Hit a number 3 times in any combination to close it.", "Once closed, additional hits score points until your opponent closes it too.", "Win by closing all 7 targets with an equal or higher score."],
    scoring: "Points scored. Solo: close all 7 numbers in as few darts as possible. Under 21 darts (all trebles) is excellent.",
    tips: "Close T20 first for maximum scoring potential.",
    scoreLabel: "Points scored", scoreType: "higher",
  },
  {
    id: "shanghai", name: "Shanghai", icon: "🌆", category: "Accuracy", difficulty: "Intermediate", duration: "10–15 min",
    shortDesc: "Score on numbers 1–7 in order. Hit a Shanghai to win instantly.",
    description: "Shanghai tests all-board accuracy. The target changes every round so you can't settle into a routine. Develops scoring on awkward numbers.",
    rules: ["7 rounds. Round 1 targets 1, round 2 targets 2, up to 7.", "Only hits on the current number score.", "Single = face value, double = double, treble = triple.", "Hit single, double AND treble in one round = Shanghai = instant win."],
    scoring: "Total score after 7 rounds. Maximum = 84 pts (all trebles). Good solo score = 40+.",
    tips: "Don't panic in early rounds — big scores come in rounds 5, 6 and 7.",
    scoreLabel: "Total score", scoreType: "higher",
  },
  {
    id: "halve-it", name: "Halve-It", icon: "✂️", category: "Accuracy", difficulty: "Advanced", duration: "15–20 min",
    shortDesc: "Hit each target or your score gets halved. Brutal consistency training.",
    description: "One of the most psychologically demanding games. Miss a target and your entire score is halved. Creates real competitive pressure on every dart.",
    rules: ["Sequence: 20, 16, any double, 17, any treble, 18, bull.", "Throw 3 darts at the target each round.", "Hit the target at least once → add points scored.", "Miss entirely → score is HALVED (rounded down)."],
    scoring: "Final score after all rounds. Above 200 is strong. Note which rounds you fail.",
    tips: "For the double round, aim for D16 — easier target with forgiving neighbours. Reset mentally after a halving.",
    scoreLabel: "Final score", scoreType: "higher", isSpecial: "halveit",
  },
  {
    id: "bobs-27", name: "Bob's 27", icon: "2️⃣7️⃣", category: "Finishing", difficulty: "Advanced", duration: "15–20 min",
    shortDesc: "Start with 27 points. Hit doubles to gain, miss to lose. A finishing masterclass.",
    description: "Widely regarded as the best finishing practice game. Real consequence for every missed double — your score drops fast. Used by professionals regularly.",
    rules: ["Start with 27 points.", "Work through D1–D20 then double bull.", "3 darts at each double.", "Hit at least once → add total doubles hit. (2 hits on D5 = +20)", "Miss all 3 → subtract that double's value. (miss D5 = −10)", "Score hits zero or below → game over."],
    scoring: "Final score from 27. Positive = hit more than missed. 100+ is excellent.",
    tips: "D1 and D2 are low stakes. By D16–D18 a miss swings 30+ points. Stay smooth under pressure.",
    scoreLabel: "Final score (start: 27)", scoreType: "higher", isSpecial: "bobs27",
  },
  {
    id: "killer", name: "Killer", icon: "☠️", category: "Match Play", difficulty: "Intermediate", duration: "20–30 min",
    shortDesc: "Claim a number, become a killer, then eliminate other players.",
    description: "Classic pub game. Solo version: assign yourself 5 numbers, become Killer on each, then eliminate the others.",
    rules: ["Pick a number (throw with non-dominant hand — wherever it lands).", "Hit the DOUBLE of your number to become a Killer.", "As Killer, hit other players' doubles to remove their lives.", "Last player with lives wins."],
    scoring: "Solo: total darts taken to complete the exercise. Lower = better.",
    tips: "D20 and D19 make you harder to kill in group play.",
    scoreLabel: "Total darts taken", scoreType: "lower",
  },
  {
    id: "doubles", name: "Doubles Practice", icon: "✌️", category: "Finishing", difficulty: "Intermediate", duration: "10–15 min",
    shortDesc: "Systematic doubles practice — D1 to D20 plus double bull.",
    description: "You can't win 501 without hitting a double. This drill visits every double on the board, exposing your weak spots so you know exactly where to focus.",
    rules: ["D1 through D20 then double bull — in strict order.", "3 darts at each double.", "Record hits (0, 1, 2 or 3) at each double.", "No skipping — move through in sequence."],
    scoring: "Total hits out of 63. Beginners: 15–25%. Intermediate: 30–45%. Advanced: 50%+.",
    tips: "Note which specific doubles you miss. D3, D4, D11 and D12 are hardest for most players.",
    scoreLabel: "Total hits (out of 63)", scoreType: "higher", isSpecial: "doubles",
  },
  {
    id: "trebles", name: "Trebles Practice", icon: "🔱", category: "Scoring", difficulty: "Advanced", duration: "10–15 min",
    shortDesc: "Work through every treble. The foundation of high scoring.",
    description: "High scoring is built on T20, T19, T18 and T17. This drill visits every treble — exposing your weaknesses and building consistency on the most important scoring areas.",
    rules: ["T1 through T20 in strict order.", "3 darts at each treble.", "Record hits (0, 1, 2 or 3) at each.", "60 darts total — no bull at the end."],
    scoring: "Total hits out of 60. Focus on T20, T19, T18, T17 hit rates separately.",
    tips: "The treble is only 8mm wide. Consistent release point beats power every time.",
    scoreLabel: "Total treble hits (out of 60)", scoreType: "higher", isSpecial: "trebles",
  },
  {
    id: "bullseye", name: "Bullseye Challenge", icon: "🎪", category: "Accuracy", difficulty: "Advanced", duration: "5–10 min",
    shortDesc: "50 darts at the bull in 5 groups of 10. Track inner and outer separately.",
    description: "The bullseye finishes 170, appears in dozens of checkouts, and ends every Around the Clock game. Yet most players practise it least. 50 darts, tracked in groups of 10.",
    rules: ["5 groups of 10 darts at the bull.", "After each group, record inner bull (50pts) and outer bull (25pts) hits.", "Track running points total and hit rate.", "Rest briefly between groups if needed."],
    scoring: "Total points and hit rate %. Note if accuracy drops in groups 4–5 — arm fatigue shows here first.",
    tips: "Most missed bulls go above or below. Missing high = releasing too early. Missing low = releasing too late.",
    scoreLabel: "Total points scored", scoreType: "higher", isSpecial: "bullseye",
  },
  {
    id: "high-score", name: "High Score", icon: "📈", category: "Scoring", difficulty: "Beginner", duration: "5–10 min",
    shortDesc: "9 darts, maximum score. Pure scoring power.",
    description: "The simplest drill — 9 darts, score as much as possible. Great warm-up game and a quick benchmark for tracking raw scoring power over time.",
    rules: ["Throw exactly 9 darts — 3 rounds of 3.", "All segments score normally.", "Record your total.", "Maximum possible = 540 (nine treble 20s)."],
    scoring: "Under 120 = developing. 120–200 = club standard. 200–300 = strong. 300+ = very strong.",
    tips: "Consistent 140–160 per visit beats occasionally hitting 180 and frequently hitting 60.",
    scoreLabel: "Total score (9 darts)", scoreType: "higher",
  },
  {
    id: "121-level1", name: "121 — Level 1", icon: "🎰", category: "Finishing", difficulty: "Beginner", duration: "15–20 min",
    shortDesc: "Checkout 121 in 9 darts. Hit = up 1. Miss = down 1. Don't drop below 100.",
    description: "A dynamic checkout game. Your target shifts based on performance — checkout and it goes up, miss and it drops. Fall below 100 and the game ends.",
    rules: ["Start at 121. Set a goal number to reach.", "9 darts (3 visits) to checkout your current number.", "Checkout = finish on exactly zero, last dart in a double or bull.", "Checkout ✓ → target UP by 1.", "Miss ✗ → target DOWN by 1.", "Drop below 100 → game over."],
    scoring: "Highest number reached. Beat your peak each session.",
    tips: "121 routes: T20 T11 D10. T19 T14 D5. T17 T18 D5. Know two routes before you start.",
    scoreLabel: "Highest number reached", scoreType: "higher", isSpecial: "121", level: 1,
  },
  {
    id: "121-level2", name: "121 — Level 2", icon: "🎰", category: "Finishing", difficulty: "Intermediate", duration: "15–20 min",
    shortDesc: "Checkout in 9 darts. Hit = up 1. Miss = DOWN 2. Harder to recover.",
    description: "Same as Level 1 but misses cost two numbers instead of one. A bad run spirals quickly — every visit matters.",
    rules: ["Start at 121. Set a goal number.", "9 darts (3 visits) to checkout.", "Checkout ✓ → target UP by 1.", "Miss ✗ → target DOWN by 2.", "Drop below 100 → game over."],
    scoring: "Highest number reached. Any score above 125 is solid at this level.",
    tips: "Two steps back is recoverable. Don't panic — focus on the route, not the scoreboard.",
    scoreLabel: "Highest number reached", scoreType: "higher", isSpecial: "121", level: 2,
  },
  {
    id: "121-level3", name: "121 — Level 3", icon: "🎰", category: "Finishing", difficulty: "Advanced", duration: "15–20 min",
    shortDesc: "Checkout in just 6 darts. Hit = up 1. Miss = down 1. Elite finishing.",
    description: "Only 6 darts (2 visits) to checkout. Your first visit must be purposeful — set up the double or finish. No room for wasted darts.",
    rules: ["Start at 121. Set a goal number.", "6 darts (2 visits) to checkout.", "Checkout ✓ → target UP by 1.", "Miss ✗ → target DOWN by 1.", "Drop below 100 → game over."],
    scoring: "Highest number reached. Even reaching 125 is strong with only 2 visits.",
    tips: "Ideal first visit leaves you on D16 (32), D20 (40), D18 (36) or D19 (38). Plan visit 1 around setting up visit 2.",
    scoreLabel: "Highest number reached", scoreType: "higher", isSpecial: "121", level: 3,
  },
  {
    id: "f50-level1", name: "Finishing 50 — Level 1", icon: "5️⃣0️⃣", category: "Finishing", difficulty: "Beginner", duration: "10–15 min",
    shortDesc: "25 attempts to checkout. Hit = up 10. Miss = down 1.",
    description: "High-volume checkout drill starting at 50. Hit your checkout and the number climbs fast (+10). Miss and it drops slowly. 25 attempts always played in full.",
    rules: ["Start at 50. Play all 25 attempts.", "3 darts per attempt to checkout.", "Checkout ✓ → target UP by 10.", "Miss ✗ → target DOWN by 1.", "All 25 attempts always played — no early end."],
    scoring: "Checkouts hit out of 25. Hit rate %. 40–55% is solid. 60%+ is very strong.",
    tips: "Common routes: 64 = T16 D8. 70 = T10 D20. 80 = T20 D10. 96 = T20 D18.",
    scoreLabel: "Checkouts hit (out of 25)", scoreType: "higher", isSpecial: "f50", level: 1, upBy: 10,
  },
  {
    id: "f50-level2", name: "Finishing 50 — Level 2", icon: "5️⃣0️⃣", category: "Finishing", difficulty: "Intermediate", duration: "10–15 min",
    shortDesc: "25 attempts. Hit = up 5. Miss = down 1. Slower to climb.",
    description: "Same structure but +5 on checkout instead of +10. Slower progress means you spend more time on each number range — exposing specific doubles you struggle with.",
    rules: ["Start at 50. Play all 25 attempts.", "3 darts per attempt.", "Checkout ✓ → UP by 5.", "Miss ✗ → DOWN by 1."],
    scoring: "Checkouts hit out of 25. 50%+ is solid at this level.",
    tips: "Focus on D16, D18, D20 and bull — these appear most as your number moves through the 50s–70s.",
    scoreLabel: "Checkouts hit (out of 25)", scoreType: "higher", isSpecial: "f50", level: 2, upBy: 5,
  },
  {
    id: "f50-level3", name: "Finishing 50 — Level 3", icon: "5️⃣0️⃣", category: "Finishing", difficulty: "Advanced", duration: "10–15 min",
    shortDesc: "25 attempts. Hit = up only 2. Miss = down 1. The toughest version.",
    description: "Only +2 per checkout. Sustained accuracy across all 25 attempts is required — one bad run and you're back where you started.",
    rules: ["Start at 50. Play all 25 attempts.", "3 darts per attempt.", "Checkout ✓ → UP by 2.", "Miss ✗ → DOWN by 1."],
    scoring: "Checkouts hit out of 25. 60%+ is excellent. You need to hit more than you miss just to progress.",
    tips: "Focus on consistency not score-chasing. Every checkout counts at this level.",
    scoreLabel: "Checkouts hit (out of 25)", scoreType: "higher", isSpecial: "f50", level: 3, upBy: 2,
  },
  {
    id: "jdc-challenge", name: "JDC Challenge", icon: "🏆", category: "Accuracy", difficulty: "Advanced", duration: "20–30 min",
    shortDesc: "Shanghai 10–15, one dart at every double + bull, then Shanghai 15–20.",
    description: "A comprehensive all-board challenge used in junior development. Three sections test your scoring, doubles, and consistency from 10 through 20. Shanghai any number for a 100-point bonus on top of your scored points.",
    rules: [
      "Section 1: Shanghai on numbers 10, 11, 12, 13, 14, 15 (3 darts per number). Score all hits at face value. Hit single, double AND treble in one visit = +100 bonus.",
      "Section 2: One dart at each double D1–D20 in order, then one dart at the bull. Hit a double = 50 pts. Hit the bull = 100 pts. Miss = 0.",
      "Section 3: Shanghai on numbers 15, 16, 17, 18, 19, 20 (3 darts per number). Same scoring as Section 1.",
      "Final score is the sum of all three sections.",
    ],
    scoring: "Maximum possible: ~2106 pts. 800+ is solid. 1200+ is very strong. 1600+ is exceptional.",
    tips: "In the Shanghai sections, aim for the treble first — a treble counts toward your Shanghai and scores the most. In the doubles section, one clean dart is all you get — no second chances.",
    scoreLabel: "Total score", scoreType: "higher", isSpecial: "jdc",
  },
  {
    id: "catch-40", name: "Catch 40", icon: "🎣", category: "Finishing", difficulty: "Advanced", duration: "20–30 min",
    shortDesc: "Checkout every score from 61–100. Max 6 darts. Points for efficiency.",
    description: "Created by John Part, Catch 40 is one of the most demanding checkout drills in darts. You must attempt every checkout from 61 to 100 in order, using a maximum of 6 darts per finish. The fewer darts you use, the more points you earn.",
    rules: [
      "40 checkouts in order: 61, 62, 63 … all the way to 100.",
      "Maximum 6 darts per checkout (2 visits of 3).",
      "2-dart checkout = 3 points.",
      "3-dart checkout = 2 points.",
      "4, 5 or 6-dart checkout = 1 point.",
      "Exception: 99 cannot be finished in fewer than 3 darts, so a 3-dart checkout on 99 scores 3 points.",
      "Fail to checkout in 6 darts = 0 points. Move to the next number.",
    ],
    scoring: "Total points out of a maximum 120. 60+ is solid. 80+ is strong. 100+ is exceptional.",
    tips: "Know your 2-dart finishes cold — 64 = T16 D8, 70 = T10 D20, 80 = T20 D10, 96 = T20 D18, 100 = T20 D20. These are where your big points come from.",
    scoreLabel: "Total points (max 120)", scoreType: "higher", isSpecial: "catch40",
  },
  {
    id: "single-mastery", name: "Single Segment Mastery", icon: "🎯", category: "Accuracy", difficulty: "Intermediate", duration: "15–25 min",
    shortDesc: "Hit 2+ darts in the single for each number 13–20 and bull. 4 points to advance.",
    description: "A grouping drill built around consistency. For each target from 13 to 20 then bull, throw 3 darts. Only the large single segment counts — doubles and trebles are misses. Land 2 or more darts in the single to earn a point. Reach 4 points to advance to the next number.",
    rules: [
      "Targets in order: 13, 14, 15, 16, 17, 18, 19, 20, then Bull.",
      "Throw 3 darts per visit at the current target.",
      "Only hits in the large single segment count. Doubles and trebles are misses.",
      "2 or more single hits in one visit = 1 point.",
      "Fewer than 2 singles = 0 points.",
      "Reach 4 points on a target to advance to the next.",
      "Complete all 9 targets to finish.",
    ],
    scoring: "Total visits used across all 9 targets. Fewer visits = better grouping. Best possible = 36 visits.",
    tips: "Aim at the centre of the single bed — if you're grouping in the treble, move your aim down slightly. The goal is tight clusters, not maximum score.",
    scoreLabel: "Total visits used", scoreType: "lower", isSpecial: "singlemastery",
  },
  {
    id: "kill-bull-l1", name: "Kill the Bull — Level 1", icon: "🎯", category: "Accuracy", difficulty: "Intermediate", duration: "10–20 min",
    shortDesc: "Hit the bull to score. Two visits in a row without a 25 or bull = reset to zero.",
    description: "Set a goal score before you start. Throw at the bull and accumulate points — 25 for outer bull, 50 for inner bull. If you go two full visits (6 darts) in a row without hitting at least a 25, your score resets to zero. Keep going until you hit your goal. Your peak score is saved even if you bust.",
    rules: [
      "Set a goal score before the game starts.",
      "Each visit = 3 darts. Score 25 (outer) or 50 (inner) for every bull hit.",
      "If two consecutive visits both score zero, your score resets to zero.",
      "After a reset, keep throwing — try to beat your previous high score.",
      "Game ends when you reach your goal score.",
    ],
    scoring: "Highest score reached. Your peak is saved even after a bust. Aim to beat your goal.",
    tips: "Stay calm after a bust — the reset is part of the game. Focus on clean technique rather than forcing.",
    scoreLabel: "Peak score reached", scoreType: "higher", isSpecial: "killbull", level: 1,
  },
  {
    id: "kill-bull-l2", name: "Kill the Bull — Level 2", icon: "🎯", category: "Accuracy", difficulty: "Advanced", duration: "10–20 min",
    shortDesc: "Hit the bull to score. One visit without scoring 25+ resets to zero.",
    description: "The strict version. Any single visit that scores less than 25 resets your score to zero immediately. No second chances. Set a goal and fight for it.",
    rules: [
      "Set a goal score before the game starts.",
      "Each visit = 3 darts. Score 25 (outer) or 50 (inner) for every bull hit.",
      "If any visit scores less than 25, your score resets to zero immediately.",
      "After a reset, keep throwing — try to beat your previous high score.",
      "Game ends when you reach your goal score.",
    ],
    scoring: "Highest score reached. Even one zero visit wipes your score. Requires sustained bull accuracy.",
    tips: "Aim for outer bull if unsure — 25 is enough to stay alive. Consistent technique is everything here.",
    scoreLabel: "Peak score reached", scoreType: "higher", isSpecial: "killbull", level: 2,
  },
  {
    id: "xo-checkout", name: "X's & O's", icon: "⭕", category: "Match Play", difficulty: "Intermediate", duration: "10–20 min",
    shortDesc: "Claim checkout squares on a 3×3 grid. Three in a row wins. Vs bot or friend.",
    description: "Two players take turns attempting checkouts on a 3×3 grid of numbers. Claim a square by hitting the checkout. First to get three in a row — horizontal, vertical or diagonal — wins. Play against the bot at any difficulty level or pass the phone to a friend.",
    rules: [
      "A 3×3 grid of 9 checkout numbers is displayed.",
      "On your turn, choose any unclaimed square and attempt that checkout in 3 darts.",
      "Hit the checkout → you claim the square (X or O).",
      "Miss → the square stays unclaimed and your turn ends.",
      "First to get 3 in a row (horizontal, vertical or diagonal) wins.",
      "If all 9 squares are claimed with no winner, it's a draw.",
    ],
    scoring: "Win, lose or draw. Track win rate over time.",
    tips: "Play the centre square first if possible — it's part of 4 winning lines. Block your opponent when they have 2 in a row.",
    scoreLabel: "Result", scoreType: "higher", isSpecial: "xocheckout",
  },
  {
    id: "darts-penalties", name: "Darts Penalties", icon: "⚽", category: "Match Play", difficulty: "Intermediate", duration: "10–20 min",
    shortDesc: "Football-style penalties. 5 random targets each round. First to 3 rounds wins.",
    description: "Darts Penalties brings football penalty shootout tension to the oche. Five random targets per round — singles, doubles and trebles — with players alternating. Score more than your opponent in a round to win it. First to win 3 rounds takes the match.",
    rules: [
      "5 random targets per round — singles, doubles and trebles from any number.",
      "Players alternate: P1 takes penalty 1, P2 takes penalty 1, P1 takes penalty 2, etc.",
      "3 darts to hit the target — any dart counts.",
      "More penalties scored in a round = win that round (+1 point).",
      "First to 3 rounds wins the match.",
    ],
    scoring: "Rounds won. Best of 5 rounds (first to 3). Track your hit rate on each target type.",
    tips: "Trebles are the hardest targets — if you get a treble, take a breath and aim centre. Singles and doubles are your best chance to pull ahead.",
    scoreLabel: "Rounds won", scoreType: "higher", isSpecial: "penalties",
  },
  {
    id: "priestleys-triples", name: "Priestley's Triples", icon: "3️⃣", category: "Scoring", difficulty: "Intermediate", duration: "15–20 min",
    shortDesc: "3 darts at each number 10–20. Single=1pt, Double=2pts, Triple=3pts.",
    description: "Dennis Priestley's classic scoring drill. Work through numbers 10 to 20, throwing 3 darts at each. Every dart scores based on where it lands — single scores 1, double scores 2, treble scores 3. The maximum per number is 9 points (three trebles). Excellent for building consistent scoring across all numbers.",
    rules: [
      "Work through numbers 10, 11, 12 … up to 20 in order.",
      "Throw 3 darts at each target number.",
      "Each dart scores: Single = 1 point, Double = 2 points, Treble = 3 points.",
      "Darts that miss the target number score 0.",
      "Record your total score after all 11 numbers.",
    ],
    scoring: "Total points out of a maximum 99 (all trebles). 40+ is solid. 60+ is strong. 75+ is exceptional.",
    tips: "Don't panic about hitting trebles — singles and doubles still score. Focus on consistent grouping around the number rather than chasing the treble every visit.",
    scoreLabel: "Total points (max 99)", scoreType: "higher", isSpecial: "priestleys",
  },
  {
    id: "street-82", name: "Street 82", icon: "🗺️", category: "Accuracy", difficulty: "Advanced", duration: "15–25 min",
    shortDesc: "82 targets in random order. One dart each — hit or miss, you move on. Score is hits out of 82.",
    description: "Created by Bentegodi (dartn-forum.de). All 82 fields on the board — small singles, big singles, doubles, trebles, single bull, and bull — shuffled into a random order. You get one dart at each target. Hit it or miss it, you always move on. No second chances.",
    rules: [
      "All 82 targets are shuffled randomly at the start.",
      "One dart per target — hit or miss, always move on.",
      "Targets: small singles s1–s20, big singles S1–S20, doubles D1–D20, trebles T1–T20, single bull (25), bull (50).",
      "Score = total hits out of 82.",
    ],
    scoring: "Hits out of 82. 35%+ (29+) is solid. 50%+ (41+) is strong. 65%+ (53+) is exceptional.",
    tips: "The random order is the challenge — you can't settle into a rhythm. Focus on consistent technique across all target types.",
    scoreLabel: "Hits out of 82", scoreType: "higher", isSpecial: "street82",
  },
  {
    id: "checkout-pyramid", name: "Checkout Pyramid", icon: "🔺", category: "Finishing", difficulty: "Intermediate", duration: "10–15 min",
    shortDesc: "Work up a pyramid of checkouts. One visit each. Choose your level.",
    description: "A structured checkout drill that builds through a pyramid of scores. Starting in the 40s and climbing to 130, you get one visit (3 darts) at each checkout. Choose from three preset pyramids — Easy, Medium, or Hard — based on how challenging the checkout routes are. Track how many you hit out of the full pyramid.",
    rules: [
      "Choose a pyramid: Easy (friendlier doubles), Medium (standard routes), or Hard (awkward numbers).",
      "Attempt each checkout in order, from lowest to highest.",
      "3 darts per checkout — one visit only. Hit it or miss it, move on.",
      "Score = checkouts hit out of the total in the pyramid.",
    ],
    scoring: "Checkouts hit out of 9. 5+ is solid. 7+ is strong. 9/9 is exceptional.",
    tips: "Know your routes before you start. The pyramid climbs through 40s, 50s, 60s, 70s, 80s, 90s, 100s, 110s and 120s.",
    scoreLabel: "Checkouts hit (out of 9)", scoreType: "higher", isSpecial: "pyramid",
  },
];

// ─── GAME GROUPS (for level-picker UX) ──────────────────────────────────────
// Games with levels are grouped here. The library shows one card per group.
// Single games have no group entry and display normally.
var GAME_GROUPS = [
  {
    id: "atc",
    name: "Around the Clock",
    icon: "🕐",
    category: "Accuracy",
    shortDesc: "Hit every number 1–20 in order. Four levels of difficulty.",
    levels: [
      { id: "atc-l1", label: "Level 1 — Singles", sublabel: "Any segment, 1–20 + bull", difficulty: "Beginner" },
      { id: "atc-l2", label: "Level 2 — Doubles", sublabel: "Doubles only, D1–D20 + bull", difficulty: "Intermediate" },
      { id: "atc-l3", label: "Level 3 — Trebles", sublabel: "Trebles only, T1–T20 + bull", difficulty: "Advanced" },
      { id: "atc-l4", label: "Level 4 — Shanghai", sublabel: "Hit S + D + T each number, 20 min", difficulty: "Advanced" },
    ],
  },
  {
    id: "121",
    name: "121 Checkout Game",
    icon: "🎰",
    category: "Finishing",
    shortDesc: "Dynamic checkout drill. Levels differ in darts per attempt and penalty.",
    levels: [
      { id: "121-level1", label: "Level 1 — 9 Darts", sublabel: "Hit +1, Miss −1. 3 visits per attempt", difficulty: "Beginner" },
      { id: "121-level2", label: "Level 2 — 9 Darts", sublabel: "Hit +1, Miss −2. Harder to recover", difficulty: "Intermediate" },
      { id: "121-level3", label: "Level 3 — 6 Darts", sublabel: "Hit +1, Miss −1. Only 2 visits", difficulty: "Advanced" },
    ],
  },
  {
    id: "f50",
    name: "Finishing 50",
    icon: "5️⃣0️⃣",
    category: "Finishing",
    shortDesc: "25 checkout attempts. Levels differ in how fast you climb.",
    levels: [
      { id: "f50-level1", label: "Level 1 — Easy Climb", sublabel: "Hit +10, Miss −1", difficulty: "Beginner" },
      { id: "f50-level2", label: "Level 2 — Medium", sublabel: "Hit +5, Miss −1", difficulty: "Intermediate" },
      { id: "f50-level3", label: "Level 3 — Hard", sublabel: "Hit +2, Miss −1", difficulty: "Advanced" },
    ],
  },
  {
    id: "killbull",
    name: "Kill the Bull",
    icon: "🎯",
    category: "Accuracy",
    shortDesc: "Score on the bull — bust if you miss too many. Two levels of difficulty.",
    levels: [
      { id: "kill-bull-l1", label: "Level 1 — Standard", sublabel: "Two consecutive zero visits = reset", difficulty: "Intermediate" },
      { id: "kill-bull-l2", label: "Level 2 — Strict",   sublabel: "Any visit under 25 = instant reset",  difficulty: "Advanced" },
    ],
  },
];

// IDs that belong to a group (hidden from flat library list)
var GROUPED_GAME_IDS = new Set(GAME_GROUPS.flatMap(g => g.levels.map(l => l.id)));

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

var PROGRAMME_TIPS = [
  { icon: "🎯", title: "Start with a theme", body: "Finishing Session (doubles heavy), Scoring Session (trebles + high score), or Full Practice (mix of everything). A theme keeps training intentional." },
  { icon: "⏱", title: "Keep it realistic", body: "3–5 games is ideal (30–45 mins). Too many and fatigue hurts quality." },
  { icon: "📈", title: "Warm up first", body: "Put Around the Clock L1 or High Score first — great for loosening up before demanding drills." },
  { icon: "💪", title: "End with your weakness", body: "Finish on the area you find hardest. You're warmed up and improvement shows most." },
];

var HALVE_IT_SEQUENCE = [
  { label: "20", target: "20", pts: (h) => h * 20 },
  { label: "16", target: "16", pts: (h) => h * 16 },
  { label: "Any Double", target: "double", pts: (h) => h * 20 },
  { label: "17", target: "17", pts: (h) => h * 17 },
  { label: "Any Treble", target: "treble", pts: (h) => h * 51 },
  { label: "18", target: "18", pts: (h) => h * 18 },
  { label: "Bull", target: "bull", pts: (h) => h * 25 },
];

var CATEGORIES = ["All", "Accuracy", "Finishing", "Scoring", "Match Play"];
var DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────

var ACHIEVEMENTS = [
  // MILESTONES
  { id: "first-session",      name: "First Blood",          emoji: "🎯", category: "Milestones",  rarity: "common",    desc: "Complete your very first training session" },
  { id: "ten-sessions",       name: "Creature of Habit",    emoji: "🔁", category: "Milestones",  rarity: "common",    desc: "Complete 10 training sessions" },
  { id: "fifty-sessions",     name: "Dedicated",            emoji: "💪", category: "Milestones",  rarity: "rare",      desc: "Complete 50 training sessions" },
  { id: "hundred-games",      name: "Century Club",         emoji: "💯", category: "Milestones",  rarity: "rare",      desc: "Play 100 total games across all sessions" },
  // STREAKS
  { id: "streak-3",           name: "Getting Warm",         emoji: "🔥", category: "Streaks",     rarity: "common",    desc: "Train 3 days in a row" },
  { id: "streak-7",           name: "On Fire",              emoji: "🔥", category: "Streaks",     rarity: "uncommon",  desc: "Train 7 days in a row" },
  { id: "streak-30",          name: "Unstoppable",          emoji: "⚡", category: "Streaks",     rarity: "legendary", desc: "Train 30 days in a row" },
  // BOB'S 27
  { id: "bobs-50",            name: "Bob's Apprentice",     emoji: "🎲", category: "Bob's 27",    rarity: "common",    desc: "Score 50+ on Bob's 27" },
  { id: "bobs-100",           name: "Bob's Beast",          emoji: "🦁", category: "Bob's 27",    rarity: "uncommon",  desc: "Score 100+ on Bob's 27" },
  { id: "bobs-150",           name: "Bob's Legend",         emoji: "👑", category: "Bob's 27",    rarity: "rare",      desc: "Score 150+ on Bob's 27" },
  // DOUBLES
  { id: "doubles-30pct",      name: "Double Vision",        emoji: "🎪", category: "Doubles",     rarity: "common",    desc: "Hit 30%+ on Doubles Practice" },
  { id: "doubles-50pct",      name: "Double Trouble",       emoji: "✌️", category: "Doubles",     rarity: "uncommon",  desc: "Hit 50%+ on Doubles Practice" },
  // SCORING
  { id: "highscore-100",      name: "Club Standard",        emoji: "🎱", category: "Scoring",     rarity: "common",    desc: "Score 100+ in High Score (9 darts)" },
  { id: "highscore-150",      name: "Big Fish",             emoji: "🐟", category: "Scoring",     rarity: "uncommon",  desc: "Score 150+ in High Score (9 darts)" },
  { id: "highscore-180",      name: "Maximum",              emoji: "🏹", category: "Scoring",     rarity: "legendary", desc: "Score 180 in High Score — maximum 9-dart score" },
  // FINISHING
  { id: "checkout-first",     name: "Checkout Artist",      emoji: "🎨", category: "Finishing",   rarity: "common",    desc: "Hit your first checkout in 121" },
  { id: "f50-10",             name: "Finisher",             emoji: "🏁", category: "Finishing",   rarity: "uncommon",  desc: "Hit 10+ checkouts in a single Finishing 50 session" },
  // BOT GAMES
  { id: "bot-first-win",      name: "Bot Beater",           emoji: "🤖", category: "Bot Games",   rarity: "common",    desc: "Beat the bot for the first time" },
  { id: "bot-level5",         name: "Level Up",             emoji: "⬆️", category: "Bot Games",   rarity: "uncommon",  desc: "Beat the bot on Level 5 or higher" },
  { id: "bot-level10",        name: "World Class",          emoji: "🌍", category: "Bot Games",   rarity: "legendary", desc: "Beat the bot on Level 10" },
  // SPECIAL
  { id: "all-categories",     name: "All Rounder",          emoji: "🌀", category: "Special",     rarity: "rare",      desc: "Play a game from every category in one session (Accuracy, Finishing, Scoring, Match Play)" },
  { id: "atc-complete",       name: "Round the Clock",      emoji: "🕐", category: "Special",     rarity: "uncommon",  desc: "Complete Around the Clock without missing a number" },
  // DAILY CHALLENGES
  { id: "daily-first",        name: "Answer the Bell",      emoji: "🔔", category: "Daily",       rarity: "common",    desc: "Complete your very first Daily Challenge" },
  { id: "daily-7",            name: "Week Warrior",         emoji: "📅", category: "Daily",       rarity: "uncommon",  desc: "Complete 7 Daily Challenges in total" },
  { id: "daily-30",           name: "Monthly Grind",        emoji: "🗓️", category: "Daily",       rarity: "rare",      desc: "Complete 30 Daily Challenges in total" },
  { id: "daily-streak-7",     name: "Daily Devotion",       emoji: "🎖️", category: "Daily",       rarity: "rare",      desc: "Complete the Daily Challenge 7 days in a row" },
  { id: "daily-streak-30",    name: "Clockwork",            emoji: "⏰", category: "Daily",       rarity: "legendary", desc: "Complete the Daily Challenge 30 days in a row" },
  { id: "daily-hard",         name: "Hard Yards",           emoji: "⚙️", category: "Daily",       rarity: "uncommon",  desc: "Complete a Hard difficulty Daily Challenge" },
  { id: "daily-legendary",    name: "Elite Task",           emoji: "🌟", category: "Daily",       rarity: "legendary", desc: "Complete a Legendary difficulty Daily Challenge" },
  { id: "daily-perfect-week", name: "Perfect Week",         emoji: "🏅", category: "Daily",       rarity: "rare",      desc: "Complete all 7 Daily Challenges in a single week" },
  // PROGRAMMES
  { id: "prog-first",         name: "Programme Runner",     emoji: "📋", category: "Programmes",  rarity: "common",    desc: "Complete your first full programme session" },
  { id: "prog-5x",            name: "In the Routine",       emoji: "🔄", category: "Programmes",  rarity: "common",    desc: "Complete the same programme 5 times" },
  { id: "prog-10x",           name: "Devoted",              emoji: "🏋️", category: "Programmes",  rarity: "uncommon",  desc: "Complete the same programme 10 times" },
  { id: "prog-3-different",   name: "Variety Pack",         emoji: "🎭", category: "Programmes",  rarity: "uncommon",  desc: "Complete 3 different programmes" },
  { id: "prog-all-cats",      name: "Full House",           emoji: "🏠", category: "Programmes",  rarity: "rare",      desc: "Complete a session covering all 4 game categories" },
  { id: "prog-no-exit",       name: "No Quit",              emoji: "🛡️", category: "Programmes",  rarity: "uncommon",  desc: "Finish a full programme without exiting early" },
  { id: "prog-pb-session",    name: "PB Session",           emoji: "🚀", category: "Programmes",  rarity: "rare",      desc: "Set a Personal Best in every game within one session" },

  // ── New games ──────────────────────────────────────────────────────────────
  { id: "catch40-60",         name: "Catching On",          emoji: "🎣", category: "Finishing",   rarity: "common",    desc: "Score 60+ points in Catch 40" },
  { id: "catch40-90",         name: "Master Catcher",       emoji: "🏅", category: "Finishing",   rarity: "uncommon",  desc: "Score 90+ points in Catch 40" },
  { id: "catch40-perfect",    name: "Flawless 40",          emoji: "💎", category: "Finishing",   rarity: "legendary", desc: "Score 120 — hit every checkout in Catch 40" },
  { id: "jdc-800",            name: "JDC Competitor",       emoji: "🏆", category: "Special",     rarity: "uncommon",  desc: "Score 800+ in the JDC Challenge" },
  { id: "jdc-1200",           name: "JDC Elite",            emoji: "👑", category: "Special",     rarity: "rare",      desc: "Score 1200+ in the JDC Challenge" },
  { id: "killbull-goal",      name: "Bull Hunter",          emoji: "🎯", category: "Accuracy",    rarity: "common",    desc: "Reach your goal in Kill the Bull" },
  { id: "killbull-200",       name: "Bull Destroyer",       emoji: "💥", category: "Accuracy",    rarity: "uncommon",  desc: "Reach 200+ in Kill the Bull" },
  { id: "priestleys-50",      name: "Priestley Pupil",      emoji: "3️⃣", category: "Scoring",     rarity: "common",    desc: "Score 50+ in Priestley's Triples" },
  { id: "priestleys-75",      name: "Priestley Pro",        emoji: "⭐", category: "Scoring",     rarity: "uncommon",  desc: "Score 75+ in Priestley's Triples" },
  { id: "street82-done",      name: "Street Walker",        emoji: "🗺️", category: "Accuracy",    rarity: "uncommon",  desc: "Complete Street 82 for the first time" },
  { id: "street82-150",       name: "Street Runner",        emoji: "🏃", category: "Accuracy",    rarity: "rare",      desc: "Hit 60+ targets in a Street 82 game (73%+ hit rate)" },
  { id: "pyramid-7",          name: "Pyramid Builder",      emoji: "🔺", category: "Finishing",   rarity: "uncommon",  desc: "Hit 7+ checkouts in a Checkout Pyramid" },
  { id: "pyramid-perfect",    name: "Pyramid Peak",         emoji: "🌋", category: "Finishing",   rarity: "rare",      desc: "Hit all 9 checkouts in a Checkout Pyramid" },
  { id: "singlemastery-done", name: "Steady Aim",           emoji: "🎯", category: "Accuracy",    rarity: "common",    desc: "Complete Single Segment Mastery" },
  { id: "penalties-win",      name: "Penalty Hero",         emoji: "⚽", category: "Match Play",  rarity: "common",    desc: "Win a Darts Penalties match" },
  { id: "penalties-expert",   name: "Shoot-Out King",       emoji: "👑", category: "Match Play",  rarity: "uncommon",  desc: "Beat the Expert bot in Darts Penalties" },
  { id: "xo-win",             name: "Noughts & Crosses",    emoji: "⭕", category: "Finishing",   rarity: "common",    desc: "Win a game of X's & O's" },
  { id: "xo-win-bot",         name: "Grid Master",          emoji: "🔲", category: "Finishing",   rarity: "uncommon",  desc: "Beat the bot at X's & O's on level 7 or higher" },
];

var RARITY_CONFIG = {
  common:    { label: "Common",    color: "#8a8a9a", glow: "rgba(138,138,154,0.3)",  bg: "rgba(138,138,154,0.08)" },
  uncommon:  { label: "Uncommon",  color: "#5cb85c", glow: "rgba(92,184,92,0.35)",   bg: "rgba(92,184,92,0.08)"  },
  rare:      { label: "Rare",      color: "#7ab8f5", glow: "rgba(122,184,245,0.4)",  bg: "rgba(122,184,245,0.1)" },
  legendary: { label: "Legendary", color: "#e8763f", glow: "rgba(232,118,63,0.5)",   bg: "rgba(232,118,63,0.12)" },
};

// ─── DARTS IQ ────────────────────────────────────────────────────────────────

var IQ_TIERS = [
  { min: 0,    max: 199,  label: "Beginner",      color: "#6b6b88", emoji: "🎯" },
  { min: 200,  max: 399,  label: "Club Starter",  color: "#7ab8f5", emoji: "📌" },
  { min: 400,  max: 599,  label: "Club Player",   color: "#5cb85c", emoji: "🏹" },
  { min: 600,  max: 799,  label: "Strong Club",   color: "#f0ad4e", emoji: "⚡" },
  { min: 800,  max: 999,  label: "League Player", color: "#e8763f", emoji: "🔥" },
  { min: 1000, max: 1149, label: "Advanced",      color: "#ff9800", emoji: "👑" },
  { min: 1150, max: 1299, label: "Elite",         color: "#c2483f", emoji: "🌍" },
  { min: 1300, max: 1500, label: "Pro",           color: "#c084fc", emoji: "💜" },
];

function getIQTier(score) {
  return IQ_TIERS.find(t => score >= t.min && score <= t.max) || IQ_TIERS[0];
}

// ─── LOGARITHMIC SCALING HELPER ──────────────────────────────────────────────
// Maps a value in [0, max] to [0, 1] on a logarithmic curve.
// Low values progress quickly, high values are much harder to reach.
// k controls curve steepness — higher k = harder top end.
function logScale(value, max, k = 6) {
  var x = Math.min(1, Math.max(0, value / max));
  return (Math.log(1 + k * x)) / (Math.log(1 + k));
}

function calcDartsIQ({ sessions = 0, streak = 0, weeklyAvg = 0,
                        bobs27Best = 0, doublesRate = 0, highScoreBest = 0,
                        botWinRate = 0, botMaxLevel = 0,
                        achievementsUnlocked = 0, totalAchievements = 1 }) {

  // ── SCORING (35% = 525 pts max) ──────────────────────────────────────────
  // Primary: High Score best (9 darts). 540 = perfect. 300+ = strong club.
  // Secondary: Bob's 27 best as proxy for finishing accuracy under pressure.
  var scoringPrimary   = logScale(highScoreBest, 540, 8) * 350;
  var scoringSecondary = logScale(bobs27Best, 200, 6) * 175;
  var scoring = Math.round(Math.min(525, scoringPrimary + scoringSecondary));

  // ── FINISHING (30% = 450 pts max) ────────────────────────────────────────
  // Doubles rate % is the strongest finishing signal.
  // Bob's 27 also contributes here as a pure doubles drill.
  var finishingDoubles = logScale(doublesRate, 60, 7) * 300;
  var finishingBobs    = logScale(bobs27Best, 200, 6) * 150;
  var finishing = Math.round(Math.min(450, finishingDoubles + finishingBobs));

  // ── MATCH PLAY (15% = 225 pts max) ───────────────────────────────────────
  // Bot level beaten is heavily weighted — beating Level 8+ is very hard.
  // Win rate adds a smaller bonus.
  var matchLevel   = logScale(botMaxLevel, 10, 9) * 175;
  var matchWinRate = logScale(botWinRate, 1, 4) * 50;
  var matchPlay = Math.round(Math.min(225, matchLevel + matchWinRate));

  // ── CONSISTENCY (15% = 225 pts max) ──────────────────────────────────────
  // Sessions played (volume), streak (habit), weekly frequency.
  // Deliberately lower weight so activity alone can't inflate the score.
  var consSessions  = logScale(sessions, 100, 5) * 100;
  var consStreak    = logScale(streak, 30, 6) * 75;
  var consFrequency = logScale(weeklyAvg, 1, 4) * 50;
  var consistency = Math.round(Math.min(225, consSessions + consStreak + consFrequency));

  // ── BREADTH (5% = 75 pts max) ─────────────────────────────────────────────
  // Small bonus for playing across multiple game categories.
  // Unlocking achievements is the proxy for this.
  var breadth = Math.round(logScale(achievementsUnlocked / Math.max(1, totalAchievements), 1, 5) * 75);

  var total = Math.min(1500, scoring + finishing + matchPlay + consistency + breadth);

  return {
    total,
    pillars: [
      { label: "Scoring",      score: scoring,     max: 525, icon: "💥", color: "#f0ad4e",
        desc: `High Score best: ${highScoreBest} · Bob's 27: ${bobs27Best}` },
      { label: "Finishing",    score: finishing,   max: 450, icon: "🎯", color: "#5cb85c",
        desc: `Doubles rate: ${doublesRate}% · Bob's 27: ${bobs27Best}` },
      { label: "Match Play",   score: matchPlay,   max: 225, icon: "🤖", color: "#e8763f",
        desc: `Best bot level: ${botMaxLevel} · Win rate: ${Math.round(botWinRate * 100)}%` },
      { label: "Consistency",  score: consistency, max: 225, icon: "📅", color: "#7ab8f5",
        desc: `Sessions: ${sessions} · Streak: ${streak} days` },
      { label: "Breadth",      score: breadth,     max: 75,  icon: "🏆", color: "#ff9800",
        desc: `Achievements: ${achievementsUnlocked}/${totalAchievements}` },
    ],
  };
}

function checkAchievements(state = {}, currentUnlocked = {}) {
  var ids = [];
  var check = (id, condition) => { if (!currentUnlocked[id] && condition) ids.push(id); };
  var {
    sessions = 0, streak = 0, totalGames = 0,
    bobs27Best = 0, doublesRate = 0, highScoreBest = 0,
    botWin = false, botMaxLevel = 0, checkoutsHit = 0,
    allCatsInSession = false, progNoExit = false, allPBsInSession = false,
    dailyChallengesTotal = 0, dailyStreak = 0,
    dailyHardDone = false, dailyLegendaryDone = false, dailyPerfectWeek = false,
    progCompletions = {},
  } = state;
  check("first-session",      sessions >= 1);
  check("ten-sessions",       sessions >= 10);
  check("fifty-sessions",     sessions >= 50);
  check("hundred-games",      totalGames >= 100);
  check("streak-3",           streak >= 3);
  check("streak-7",           streak >= 7);
  check("streak-30",          streak >= 30);
  check("bobs-50",            bobs27Best >= 50);
  check("bobs-100",           bobs27Best >= 100);
  check("bobs-150",           bobs27Best >= 150);
  check("doubles-30pct",      doublesRate >= 30);
  check("doubles-50pct",      doublesRate >= 50);
  check("highscore-100",      highScoreBest >= 100);
  check("highscore-150",      highScoreBest >= 150);
  check("highscore-180",      highScoreBest >= 180);
  check("checkout-first",     checkoutsHit >= 1);
  check("f50-10",             checkoutsHit >= 10);
  check("bot-first-win",      botWin);
  check("bot-level5",         botWin && botMaxLevel >= 5);
  check("bot-level10",        botWin && botMaxLevel >= 10);
  check("all-categories",     allCatsInSession);
  check("daily-first",        dailyChallengesTotal >= 1);
  check("daily-7",            dailyChallengesTotal >= 7);
  check("daily-30",           dailyChallengesTotal >= 30);
  check("daily-streak-7",     dailyStreak >= 7);
  check("daily-streak-30",    dailyStreak >= 30);
  check("daily-hard",         dailyHardDone);
  check("daily-legendary",    dailyLegendaryDone);
  check("daily-perfect-week", dailyPerfectWeek);
  var maxCount    = Math.max(0, ...Object.values(progCompletions));
  var uniqueProgs = Object.keys(progCompletions).filter(k => progCompletions[k] > 0).length;
  check("prog-first",         sessions >= 1);
  check("prog-5x",            maxCount >= 5);
  check("prog-10x",           maxCount >= 10);
  check("prog-3-different",   uniqueProgs >= 3);
  check("prog-all-cats",      allCatsInSession);
  check("prog-no-exit",       progNoExit);
  check("prog-pb-session",    allPBsInSession);

  // ── New game achievements ──────────────────────────────────────────────────
  var {
    catch40Best = 0, jdcBest = 0, killBullBest = 0, killBullGoalReached = false,
    priestleysBest = 0, street82Done = false, street82Best = 9999,
    pyramidBest = 0, singleMasteryDone = false,
    penaltiesWin = false, penaltiesExpertWin = false,
    xoWin = false, xoWinHighBot = false,
  } = state;
  check("catch40-60",         catch40Best >= 60);
  check("catch40-90",         catch40Best >= 90);
  check("catch40-perfect",    catch40Best >= 120);
  check("jdc-800",            jdcBest >= 800);
  check("jdc-1200",           jdcBest >= 1200);
  check("killbull-goal",      killBullGoalReached);
  check("killbull-200",       killBullBest >= 200);
  check("priestleys-50",      priestleysBest >= 50);
  check("priestleys-75",      priestleysBest >= 75);
  check("street82-done",      street82Done);
  check("street82-150",       street82Done && street82Best >= 60);
  check("pyramid-7",          pyramidBest >= 7);
  check("pyramid-perfect",    pyramidBest >= 9);
  check("singlemastery-done", singleMasteryDone);
  check("penalties-win",      penaltiesWin);
  check("penalties-expert",   penaltiesExpertWin);
  check("xo-win",             xoWin);
  check("xo-win-bot",         xoWinHighBot);
  return ids;
}

// ─── PERSISTENCE ─────────────────────────────────────────────────────────────

var storage = {
  get: (key, fallback = null) => { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e2) { return fallback; } },
  set: (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e3) {} },
};

var loadProgrammes = () => storage.get("dl-programmes", []);
var saveProgrammes = (p) => storage.set("dl-programmes", p);
var loadHistory = () => storage.get("dl-history", []);
var saveHistory = (h) => storage.set("dl-history", h);
var loadBotGames = () => storage.get("dl-bot-games", []);
var saveBotGames = (g) => storage.set("dl-bot-games", g);
var loadStats        = () => storage.get("dl-stats",        { totalSessions: 0, totalDarts: 0, gameStats: {} });
var saveStats        = (s) => storage.set("dl-stats",        s);
var loadAchievements = () => storage.get("dl-achievements",  {});
var saveAchievements = (a) => storage.set("dl-achievements", a);
var loadDartsIQ      = () => storage.get("dl-darts-iq",      { total: 0 });
var saveDartsIQ      = (d) => storage.set("dl-darts-iq",     d);

// Derive personal bests and averages from history
function deriveStats(history, botGames) {
  var gameStats = {};
  history.forEach(session => {
    _optionalChain([session, 'access', _2 => _2.games, 'optionalAccess', _3 => _3.forEach, 'call', _4 => _4(g => {
      if (!gameStats[g.id]) gameStats[g.id] = { name: g.name, icon: g.icon, scores: [], bestScore: null, worstScore: null, totalPlays: 0, pbDate: null };
      var gs = gameStats[g.id];
      gs.scores.push(g.score);
      gs.totalPlays++;
      if (gs.bestScore === null || g.score > gs.bestScore) { gs.bestScore = g.score; gs.pbDate = session.date || null; }
      if (gs.worstScore === null || g.score < gs.worstScore) gs.worstScore = g.score;
    })]);
  });

  var botStats = {
    totalGames: botGames.length,
    wins: botGames.filter(g => g.winner === "player").length,
    losses: botGames.filter(g => g.winner === "bot").length,
    avgScore: botGames.length > 0 ? Math.round(botGames.reduce((a, g) => a + (g.playerAvg || 0), 0) / botGames.length * 10) / 10 : 0,
    bestAvg: botGames.length > 0 ? Math.max(...botGames.map(g => g.playerAvg || 0)) : 0,
    recentGames: botGames.slice(-5),
  };

  return { gameStats, botStats, totalSessions: history.length };
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

var css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Hanken+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');
  .ms { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 24px; line-height: 1; letter-spacing: normal; text-transform: none; white-space: nowrap; word-wrap: normal; direction: ltr; -webkit-font-smoothing: antialiased; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; display: inline-flex; align-items: center; justify-content: center; user-select: none; }
  .ms.fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
  .ms.sz20 { font-size: 20px; }
  .ms.sz18 { font-size: 18px; }
  .ms.sz16 { font-size: 16px; }
  .ms.sz28 { font-size: 28px; }
  .ms.sz32 { font-size: 32px; }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    /* Colours — warm charcoal base with a terracotta accent, no neon */
    --bg:#1b1815; --surface:#23201b; --surface2:#2c2821; --surface3:#363026;
    --border:#3a332a; --border2:#4a4136;
    --accent:#e8763f; --accent2:#c2483f; --accent3:#7a9482;
    --text:#f2ece2; --text2:#cabfae; --muted:#928677;
    --on-accent:#241004;
    /* Radius — soft but structured */
    --radius:16px; --radius-sm:12px; --radius-xs:9px;
    /* Spacing scale — 4/8pt rhythm */
    --sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-5:24px; --sp-6:32px; --sp-7:48px;
    /* Motion tokens */
    --ease-out:cubic-bezier(.16,1,.3,1); --ease-spring:cubic-bezier(.34,1.56,.64,1);
    --dur-fast:120ms; --dur-base:200ms; --dur-slow:320ms;
    /* Shadows — warm, soft, no neon glow */
    --shadow-sm:0 2px 8px rgba(15,10,4,.35);
    --shadow-md:0 6px 22px rgba(15,10,4,.4);
    --shadow-card:0 1px 2px rgba(15,10,4,.3),0 6px 18px rgba(15,10,4,.22);
    --shadow-card-hover:0 2px 6px rgba(15,10,4,.32),0 10px 26px rgba(15,10,4,.26);
    --shadow-accent:0 6px 18px rgba(232,118,63,.22);
    --shadow-glow:0 0 0 rgba(0,0,0,0);
    /* Surfaces — flat, low-blur panels rather than heavy glass */
    --glass-bg:rgba(44,40,33,0.92);
    --glass-border:rgba(74,65,54,0.55);
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration:0.001ms !important; animation-iteration-count:1 !important; transition-duration:0.001ms !important; scroll-behavior:auto !important; }
  }

  body { background:var(--bg); color:var(--text); font-family:'Hanken Grotesk',sans-serif; min-height:100dvh; }
  .app { max-width:430px; margin:0 auto; height:100dvh; background:var(--bg); position:fixed; top:0; left:50%; transform:translateX(-50%); width:100%; display:flex; flex-direction:column; overflow:hidden; }

  /* ── Focus visibility (a11y) ── */
  a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible, [tabindex]:focus-visible, .card:focus-visible, .qs-card:focus-visible, .picker-item:focus-visible {
    outline:2px solid var(--accent); outline-offset:2px; border-radius:var(--radius-sm);
  }
  :focus:not(:focus-visible) { outline:none; }

  /* ── Entrance animation utility ── */
  @keyframes fadeInUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  .fade-in-up { animation:fadeInUp var(--dur-slow) var(--ease-out) both; }
  .fade-in-up:nth-child(1){animation-delay:0ms} .fade-in-up:nth-child(2){animation-delay:40ms}
  .fade-in-up:nth-child(3){animation-delay:80ms} .fade-in-up:nth-child(4){animation-delay:120ms}
  .fade-in-up:nth-child(5){animation-delay:160ms} .fade-in-up:nth-child(6){animation-delay:200ms}
  .fade-in-up:nth-child(n+7){animation-delay:220ms}

  /* ── Navigation ── */
  .nav { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:430px; background:rgba(27,24,21,0.97); border-top:1px solid var(--border); display:flex; z-index:100; padding-bottom:env(safe-area-inset-bottom,0px); box-shadow:0 -2px 14px rgba(15,10,4,.3); }
  .nav-btn { flex:1; min-height:48px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; padding:10px 8px 9px; background:none; border:none; color:var(--muted); font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:500; letter-spacing:.05em; text-transform:uppercase; cursor:pointer; transition:color var(--dur-base) var(--ease-out),background var(--dur-base) var(--ease-out),transform var(--dur-fast); position:relative; border-radius:10px; margin:6px 4px; -webkit-tap-highlight-color:transparent; }
  .nav-btn:active { transform:scale(0.88); }
  .nav-btn.active { color:var(--on-accent); background:var(--accent); }
  .nav-btn.active::after { display:none; }
  .nav-btn svg { width:22px; height:22px; transition:transform var(--dur-base) var(--ease-spring); }
  .nav-btn.active svg { transform:scale(1.08); }

  /* ── Layout ── */
  .scroll-area { flex:1; min-height:0; overflow-y:auto; overflow-x:hidden; padding:0 16px 110px; -webkit-overflow-scrolling:touch; }
  .page-header { padding:52px 0 16px; position:sticky; top:0; background:var(--bg); z-index:10; }
  .page-title { font-family:'Hanken Grotesk',sans-serif; font-size:32px; font-weight:800; letter-spacing:-0.01em; line-height:1.1; color:var(--text); }
  .page-subtitle { font-size:14px; color:var(--muted); margin-top:4px; font-family:'Hanken Grotesk',sans-serif; }

  /* ── Top app bar (new) ── */
  .top-bar { position:sticky; top:0; z-index:10; background:rgba(27,24,21,0.95); border-bottom:1px solid var(--border); padding:0 20px; height:68px; display:flex; align-items:center; justify-content:space-between; }
  .top-bar-title { font-family:'Hanken Grotesk',sans-serif; font-size:20px; font-weight:800; letter-spacing:-0.02em; color:var(--accent); white-space:nowrap; }
  .top-bar-actions { display:flex; align-items:center; gap:8px; flex-shrink:0; }

  /* ── Home screen ── */
  .home-hero { padding:32px 0 20px; }
  .glow-blob { position:absolute; top:-60px; left:50%; transform:translateX(-50%); width:320px; height:320px; background:radial-gradient(ellipse at center, rgba(232,118,63,.10) 0%, rgba(232,118,63,.03) 45%, transparent 70%); border-radius:50%; pointer-events:none; z-index:0; filter:blur(24px); }
  .glow-blob-sm { position:absolute; top:20px; right:-40px; width:180px; height:180px; background:radial-gradient(ellipse at center, rgba(122,148,130,.08) 0%, transparent 70%); border-radius:50%; pointer-events:none; z-index:0; filter:blur(20px); }
  .home-logo { font-family:'Hanken Grotesk',sans-serif; font-size:40px; font-weight:800; letter-spacing:-0.03em; color:var(--text); line-height:1; }
  .home-logo span { color:var(--accent); }
  .home-tagline { font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:500; color:var(--muted); letter-spacing:.05em; text-transform:uppercase; margin-top:6px; }
  .dart-icon { font-size:48px; display:block; margin-bottom:12px; color:var(--accent); }
  .section-label { font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:500; letter-spacing:.05em; text-transform:uppercase; color:var(--muted); margin:20px 0 10px; }

  /* ── Cards ── */
  .card { background:var(--glass-bg); border:1px solid var(--glass-border); border-radius:var(--radius); padding:16px; margin-bottom:10px; cursor:pointer; box-shadow:var(--shadow-card); transition:border-color var(--dur-base) var(--ease-out),transform var(--dur-fast),box-shadow var(--dur-base) var(--ease-out); -webkit-tap-highlight-color:transparent; position:relative; }
  .card:active { transform:scale(.97); box-shadow:var(--shadow-sm); }
  .card:hover { border-color:rgba(232,118,63,.3); box-shadow:var(--shadow-card-hover); }
  .card-header { display:flex; align-items:flex-start; gap:12px; }
  .card-icon { font-size:26px; line-height:1; flex-shrink:0; margin-top:2px; width:44px; height:44px; display:flex; align-items:center; justify-content:center; background:rgba(232,118,63,.1); border-radius:var(--radius-xs); }
  .card-info { flex:1; min-width:0; }
  .card-name { font-family:'Hanken Grotesk',sans-serif; font-size:15px; font-weight:700; color:var(--text); letter-spacing:-0.01em; }
  .card-meta { display:flex; gap:6px; margin-top:4px; flex-wrap:wrap; }
  .card-desc { font-size:13px; color:var(--text2); margin-top:8px; line-height:1.55; }

  /* ── Badges ── */
  .badge { font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:500; letter-spacing:.05em; text-transform:uppercase; padding:3px 8px; border-radius:100px; background:var(--surface2); color:var(--muted); border:1px solid var(--border); white-space:nowrap; transition:background var(--dur-base),color var(--dur-base); }
  .badge.accent { background:rgba(232,118,63,.14); color:var(--accent); border-color:rgba(232,118,63,.28); }
  .badge.red { background:rgba(194,72,63,.14); color:var(--accent2); border-color:rgba(194,72,63,.28); }

  /* ── Quick start grid ── */
  .qs-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px; }
  .qs-card { background:var(--glass-bg); border:1px solid var(--glass-border); border-radius:var(--radius); padding:16px; cursor:pointer; transition:border-color var(--dur-base) var(--ease-out),transform var(--dur-fast),box-shadow var(--dur-base); -webkit-tap-highlight-color:transparent; text-align:center; box-shadow:var(--shadow-card); }
  .qs-card:active { transform:scale(.97); }
  .qs-card:hover { border-color:rgba(232,118,63,.3); box-shadow:var(--shadow-card-hover); }
  .qs-card.featured { grid-column:1/-1; background:linear-gradient(135deg,rgba(232,118,63,.12),rgba(122,148,130,.04)); border-color:rgba(232,118,63,.25); display:flex; align-items:center; gap:16px; text-align:left; }
  .qs-icon { font-size:30px; margin-bottom:8px; }
  .qs-card.featured .qs-icon { margin-bottom:0; font-size:38px; }
  .qs-label { font-family:'Hanken Grotesk',sans-serif; font-size:13px; font-weight:700; color:var(--text); letter-spacing:-0.01em; }
  .qs-sub { font-size:11px; color:var(--text2); margin-top:3px; }

  /* ── Filter pills ── */
  .filter-row { display:flex; gap:8px; overflow-x:auto; padding-bottom:8px; margin-bottom:4px; scrollbar-width:none; }
  .filter-row::-webkit-scrollbar { display:none; }
  .filter-btn { flex-shrink:0; padding:6px 14px; border-radius:100px; font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:500; letter-spacing:.05em; text-transform:uppercase; background:var(--surface); border:1px solid var(--border); color:var(--muted); cursor:pointer; transition:all .15s; -webkit-tap-highlight-color:transparent; }
  .filter-btn:active { transform:scale(0.92); }
  .filter-btn.active { background:var(--accent); border-color:var(--accent); color:var(--on-accent); font-weight:700; }

  /* ── Info blocks ── */
  .info-block { background:var(--glass-bg); border:1px solid var(--glass-border); border-radius:var(--radius); padding:16px; margin-bottom:12px; box-shadow:var(--shadow-card); }
  .info-title { font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:500; letter-spacing:.05em; text-transform:uppercase; color:var(--accent); margin-bottom:10px; opacity:.9; }
  .info-block p { font-size:14px; color:var(--text2); line-height:1.7; }
  .rules-list { list-style:none; display:flex; flex-direction:column; gap:8px; }
  .rules-list li { font-size:14px; color:var(--text2); line-height:1.5; padding-left:20px; position:relative; }
  .rules-list li::before { content:''; position:absolute; left:0; top:7px; width:6px; height:6px; border-radius:50%; background:var(--accent); opacity:.8; }
  .tip-block { background:rgba(232,118,63,.06); border:1px solid rgba(232,118,63,.18); border-radius:var(--radius); padding:14px 16px; margin-bottom:12px; display:flex; gap:12px; }
  .tip-icon { font-size:20px; flex-shrink:0; }
  .tip-text { font-size:13px; color:var(--text2); line-height:1.6; }
  .tip-text strong { color:var(--text); display:block; margin-bottom:4px; font-weight:700; }

  /* ── Programmes ── */
  .prog-card { background:var(--glass-bg); border:1px solid var(--glass-border); border-radius:var(--radius); padding:16px; margin-bottom:10px; box-shadow:var(--shadow-card); }
  .prog-name { font-family:'Hanken Grotesk',sans-serif; font-size:16px; font-weight:700; color:var(--text); letter-spacing:-0.01em; }
  .prog-meta { font-size:12px; color:var(--text2); margin-top:3px; }
  .chip-row { display:flex; gap:6px; flex-wrap:wrap; margin-top:10px; }
  .chip { font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:500; letter-spacing:.03em; padding:3px 10px; background:var(--surface2); border:1px solid var(--border); border-radius:100px; color:var(--text2); }
  .prog-actions { display:flex; gap:8px; margin-top:12px; padding-top:12px; border-top:1px solid var(--border); }

  .btn { display:flex; align-items:center; justify-content:center; gap:7px; min-height:44px; padding:14px 22px; border-radius:var(--radius-sm); font-family:'Hanken Grotesk',sans-serif; font-size:15px; font-weight:700; letter-spacing:-0.01em; border:none; cursor:pointer; transition:transform var(--dur-fast) var(--ease-spring),opacity var(--dur-base),background var(--dur-base),box-shadow var(--dur-base); -webkit-tap-highlight-color:transparent; }
  .btn:active { transform:scale(.96); }
  .btn:disabled { opacity:.4; cursor:not-allowed; pointer-events:none; }
  .btn-primary { background:var(--accent); color:var(--on-accent); box-shadow:var(--shadow-accent); }
  .btn-primary:active { box-shadow:0 2px 8px rgba(232,118,63,.16); }
  .btn-primary:hover { box-shadow:0 8px 24px rgba(232,118,63,.3); }
  .btn-secondary { background:var(--glass-bg); color:var(--text2); border:1px solid var(--glass-border); }
  .btn-secondary:hover { border-color:rgba(232,118,63,.35); color:var(--text); }
  .btn-danger { background:rgba(194,72,63,.14); color:var(--accent2); border:1px solid rgba(194,72,63,.28); }
  .btn-sm { min-height:36px; padding:9px 16px; font-size:13px; border-radius:10px; }
  .btn-full { width:100%; }
  .fab { position:fixed; bottom:88px; right:20px; width:56px; height:56px; border-radius:50%; background:var(--accent); color:var(--on-accent); border:none; font-size:24px; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:50; transition:transform .15s,box-shadow .15s; -webkit-tap-highlight-color:transparent; box-shadow:0 6px 20px rgba(232,118,63,.32),0 2px 8px rgba(15,10,4,.3); }
  .fab:active { transform:scale(.93); box-shadow:none; }

  @keyframes overlayIn { from { opacity:0; } to { opacity:1; } }
  @keyframes sheetIn { from { transform:translateY(24px); opacity:0; } to { transform:translateY(0); opacity:1; } }
  .modal-overlay { position:fixed; inset:0; background:rgba(10,7,4,.78); backdrop-filter:blur(4px); z-index:200; display:flex; align-items:flex-end; animation:overlayIn var(--dur-base) var(--ease-out) both; }
  .modal { background:#24201b; border-radius:24px 24px 0 0; width:100%; max-width:430px; margin:0 auto; padding:24px 20px 36px; max-height:92vh; overflow-y:auto; border-top:1px solid var(--glass-border); box-shadow:0 -10px 32px rgba(10,7,4,.5); animation:sheetIn var(--dur-slow) var(--ease-spring) both; }
  .modal-handle { width:36px; height:3px; background:var(--border2); border-radius:100px; margin:0 auto 22px; }
  .modal-title { font-family:'Hanken Grotesk',sans-serif; font-size:26px; font-weight:800; letter-spacing:-0.02em; color:var(--text); margin-bottom:6px; }
  .modal-sub { font-size:13px; color:var(--text2); margin-bottom:22px; line-height:1.55; }

  .form-group { margin-bottom:18px; }
  .form-label { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:9px; display:block; }
  .form-hint { font-size:12px; color:var(--muted); margin-top:6px; line-height:1.4; }
  .form-input { width:100%; background:var(--surface2); border:1px solid var(--border); border-radius:var(--radius-sm); padding:13px 16px; font-family:'Hanken Grotesk',sans-serif; font-size:15px; color:var(--text); outline:none; transition:border-color .2s,box-shadow .2s; }
  .form-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(232,118,63,.12); }
  .form-input::placeholder { color:var(--muted); }
  .picker-item { display:flex; align-items:center; gap:12px; padding:13px 14px; background:var(--surface2); border:1px solid var(--border); border-radius:var(--radius-sm); cursor:pointer; transition:all .15s; margin-bottom:8px; -webkit-tap-highlight-color:transparent; }
  .picker-item.selected { border-color:var(--accent); background:rgba(232,118,63,.1); }
  .picker-item:active { transform:scale(.98); }
  .picker-icon { font-size:22px; }
  .picker-info { flex:1; min-width:0; }
  .picker-name { font-size:14px; font-weight:600; color:var(--text); }
  .picker-meta { font-size:11px; color:var(--text2); margin-top:2px; }
  .check-box { width:22px; height:22px; border-radius:7px; border:2px solid var(--border); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .15s; font-size:12px; font-weight:700; }
  .picker-item.selected .check-box { background:var(--accent); border-color:var(--accent); color:var(--on-accent); }

  .prog-bar-wrap { margin-bottom:14px; }
  .prog-bar-top { display:flex; justify-content:space-between; font-size:12px; color:var(--muted); margin-bottom:7px; }
  .prog-bar-bg { height:4px; background:var(--surface2); border-radius:100px; overflow:hidden; }
  .prog-bar-fill { height:100%; background:linear-gradient(90deg,var(--accent),#f0a06a); border-radius:100px; transition:width .4s ease; }

  .session-header { padding-top:52px; display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
  .back-btn { display:flex; align-items:center; gap:6px; color:var(--text2); font-size:14px; font-weight:600; background:none; border:none; cursor:pointer; padding:0; font-family:'Hanken Grotesk',sans-serif; -webkit-tap-highlight-color:transparent; }
  .big-number { font-family:'Bebas Neue',sans-serif; font-size:96px; letter-spacing:4px; color:var(--accent); line-height:1; }

  /* ── Stats ── */
  .stat-row { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:14px; }
  .stat-box { background:var(--glass-bg); border:1px solid var(--glass-border); border-top:2px solid rgba(232,118,63,.4); border-radius:var(--radius-sm); padding:12px 8px; text-align:center; box-shadow:var(--shadow-sm); }
  .stat-val { font-family:'Hanken Grotesk',sans-serif; font-size:26px; font-weight:800; letter-spacing:-0.04em; color:var(--accent); line-height:1; }
  .stat-lbl { font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:500; letter-spacing:.05em; text-transform:uppercase; color:var(--muted); margin-top:4px; }

  /* ── Buttons ── */
  .hit-btn { flex:1; padding:18px; border-radius:var(--radius-sm); font-family:'Hanken Grotesk',sans-serif; font-size:15px; font-weight:700; border:none; cursor:pointer; -webkit-tap-highlight-color:transparent; transition:all .15s; letter-spacing:-0.01em; }
  .hit-btn:active { transform:scale(.96); }
  .hit-btn.yes { background:var(--accent); color:var(--on-accent); box-shadow:0 2px 14px rgba(232,118,63,.3); }
  .hit-btn.no { background:rgba(194,72,63,.14); color:var(--accent2); border:1px solid rgba(194,72,63,.28); }

  .next-panel { display:flex; gap:10px; }
  .next-box { flex:1; text-align:center; padding:12px 8px; border-radius:var(--radius-sm); }
  .next-box.up { background:rgba(232,118,63,.07); border:1px solid rgba(232,118,63,.2); }
  .next-box.down { background:rgba(194,72,63,.07); border:1px solid rgba(194,72,63,.2); }
  .next-num { font-family:'Hanken Grotesk',sans-serif; font-size:20px; font-weight:800; letter-spacing:-0.02em; }
  .next-num.up { color:var(--accent); }
  .next-num.down { color:var(--accent2); }
  .next-lbl { font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:500; letter-spacing:.05em; text-transform:uppercase; color:var(--muted); margin-top:3px; }

  .segment-dots { display:flex; gap:6px; justify-content:center; margin-top:10px; flex-wrap:wrap; }
  .seg-dot { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:500; border:1px solid var(--border); background:var(--surface2); color:var(--muted); cursor:pointer; transition:all .15s; -webkit-tap-highlight-color:transparent; }
  .seg-dot.hit { background:var(--accent); border-color:var(--accent); color:var(--on-accent); }
  .seg-dot.current { border-color:var(--accent); color:var(--accent); }

  .timer-display { font-family:'Bebas Neue',sans-serif; font-size:48px; letter-spacing:3px; }
  .timer-display.warning { color:var(--accent2); }
  .timer-display.ok { color:var(--accent); }

  .hits-row { display:flex; gap:8px; justify-content:center; }
  .hit-dot-btn { width:52px; height:52px; border-radius:12px; border:2px solid var(--border); background:var(--surface2); color:var(--muted); font-family:'Hanken Grotesk',sans-serif; font-size:17px; font-weight:800; cursor:pointer; display:flex; align-items:center; justify-content:center; -webkit-tap-highlight-color:transparent; transition:all .15s; }
  .hit-dot-btn.selected { background:var(--accent); border-color:var(--accent); color:var(--on-accent); box-shadow:0 2px 12px rgba(232,118,63,.3); }
  .hit-dot-btn:active { transform:scale(.93); }

  .history-row { display:flex; align-items:center; gap:10px; padding:9px 12px; background:var(--surface2); border-radius:10px; margin-bottom:6px; }
  .history-name { font-size:13px; color:var(--text2); flex:1; }
  .history-score { font-family:'Hanken Grotesk',sans-serif; font-size:13px; font-weight:700; color:var(--accent); }
  .history-card { background:var(--glass-bg); border:1px solid var(--glass-border); border-radius:var(--radius); padding:16px; margin-bottom:10px; box-shadow:var(--shadow-card); }
  .divider { height:1px; background:var(--border); margin:14px 0; opacity:.7; }
  .notes-input { width:100%; background:var(--surface2); border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px 14px; font-family:'Hanken Grotesk',sans-serif; font-size:14px; color:var(--text); outline:none; resize:none; height:70px; margin-top:10px; transition:border-color .2s; }
  .notes-input:focus { border-color:var(--accent); }
  .notes-input::placeholder { color:var(--muted); }
  .warn-banner { background:rgba(194,72,63,.1); border:1px solid rgba(194,72,63,.28); border-radius:var(--radius-sm); padding:10px 14px; font-size:12px; color:var(--accent2); font-weight:600; text-align:center; margin-top:10px; }

  /* ── Empty states ── */
  .empty-state { text-align:center; padding:48px 24px; }
  .empty-rings { position:relative; width:140px; height:140px; margin:0 auto 24px; display:flex; align-items:center; justify-content:center; }
  .empty-rings::before { content:''; position:absolute; inset:0; border:1px solid rgba(232,118,63,.18); border-radius:50%; animation:spin 20s linear infinite; }
  .empty-rings::after { content:''; position:absolute; inset:20px; border:1px solid rgba(232,118,63,.28); border-radius:50%; animation:spin 12s linear infinite reverse; }
  @keyframes pulse-neon { 0%,100%{opacity:1} 50%{opacity:.55} }
  .empty-icon-anim { animation:pulse-neon 3s infinite ease-in-out; position:relative; z-index:1; }
  .empty-icon { font-size:52px; margin-bottom:14px; opacity:.65; }
  .empty-title { font-family:'Hanken Grotesk',sans-serif; font-size:20px; font-weight:800; color:var(--text); margin-bottom:8px; letter-spacing:-0.01em; }
  .empty-body { font-size:14px; color:var(--text2); line-height:1.6; max-width:260px; margin:0 auto; }
  @keyframes dlbounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
`;
// ─── ICONS ────────────────────────────────────────────────────────────────────

// ── Real photo assets ────────────────────────────────────────────────────────
var IMG_BOARD_HERO  = "data:image/jpeg;base64,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";
var IMG_BOARD_AUTH  = "data:image/jpeg;base64,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";
var IMG_DARTS_STRIP = "data:image/jpeg;base64,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";

// ── Custom Dartboard SVG ─────────────────────────────────────────────────────
var DartboardSVG = ({ size = 120, muted = false }) => {
  var a = "#e8763f"; // accent
  var d = muted ? "rgba(232,118,63,.15)" : a;
  var r = muted ? "rgba(194,72,63,.2)" : "#c2483f";
  var w = muted ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.12)";
  var b = muted ? "rgba(0,0,0,.3)" : "#1a1a24";
  var cx = 100, cy = 100, R = 90;
  // Build 20 segments alternating black/cream
  var segs = [];
  for (var i = 0; i < 20; i++) {
    var a1 = (i * 18 - 99) * Math.PI / 180;
    var a2 = ((i + 1) * 18 - 99) * Math.PI / 180;
    var fill = i % 2 === 0 ? b : "rgba(240,220,180,.15)";
    var x1s = cx + 20 * Math.cos(a1), y1s = cy + 20 * Math.sin(a1);
    var x2s = cx + 20 * Math.cos(a2), y2s = cy + 20 * Math.sin(a2);
    var x1e = cx + R * Math.cos(a1), y1e = cy + R * Math.sin(a1);
    var x2e = cx + R * Math.cos(a2), y2e = cy + R * Math.sin(a2);
    // Treble ring (radius 56-66)
    var t1x1 = cx+56*Math.cos(a1), t1y1 = cy+56*Math.sin(a1);
    var t1x2 = cx+56*Math.cos(a2), t1y2 = cy+56*Math.sin(a2);
    var t2x1 = cx+66*Math.cos(a1), t2y1 = cy+66*Math.sin(a1);
    var t2x2 = cx+66*Math.cos(a2), t2y2 = cy+66*Math.sin(a2);
    // Double ring (radius 82-90)
    var d1x1 = cx+82*Math.cos(a1), d1y1 = cy+82*Math.sin(a1);
    var d1x2 = cx+82*Math.cos(a2), d1y2 = cy+82*Math.sin(a2);
    // On a real dartboard, segment 0 = 20 (top), which has RED treble/double
    // Even segments (0,2,4...) = red; odd segments = lime/green
    var segFill = i % 2 === 0 ? r : d;
    segs.push(
      React.createElement('g', { key: i,}
        , React.createElement('path', { d: `M${x1s},${y1s} A20,20 0 0,1 ${x2s},${y2s} L${x2e},${y2e} A${R},${R} 0 0,0 ${x1e},${y1e} Z`, fill: fill, stroke: "rgba(0,0,0,.4)", strokeWidth: "0.5",} )
        , React.createElement('path', { d: `M${t1x1},${t1y1} A56,56 0 0,1 ${t1x2},${t1y2} L${t2x2},${t2y2} A66,66 0 0,0 ${t2x1},${t2y1} Z`, fill: segFill, stroke: "rgba(0,0,0,.4)", strokeWidth: "0.5",} )
        , React.createElement('path', { d: `M${d1x1},${d1y1} A82,82 0 0,1 ${d1x2},${d1y2} L${x2e},${y2e} A${R},${R} 0 0,0 ${x1e},${y1e} Z`, fill: segFill, stroke: "rgba(0,0,0,.4)", strokeWidth: "0.5",} )
      )
    );
  }
  return (
    React.createElement('svg', { viewBox: "0 0 200 200"   , width: size, height: size, style: { filter: muted ? "none" : "drop-shadow(0 0 16px rgba(232,118,63,.3))" },}
      , React.createElement('circle', { cx: cx, cy: cy, r: R+2, fill: "rgba(0,0,0,.5)",} )
      , segs
      /* Wire rings */
      , [20,56,66,82,90].map(rr => React.createElement('circle', { key: rr, cx: cx, cy: cy, r: rr, fill: "none", stroke: "rgba(200,180,100,.4)", strokeWidth: "1",} ))
      /* Bull */
      , React.createElement('circle', { cx: cx, cy: cy, r: 14, fill: r,} )
      , React.createElement('circle', { cx: cx, cy: cy, r: 7, fill: d,} )
      /* Glow on bull */
      , !muted && React.createElement('circle', { cx: cx, cy: cy, r: 7, fill: "rgba(232,118,63,.4)",} )
    )
  );
};

// ── Material Symbols helper ──────────────────────────────────────────────────
var Ms = ({ icon, size, fill, style }) => (
  React.createElement('span', { className: ["ms", fill?"fill":"", size?`sz${size}`:""].filter(Boolean).join(" "), style: style,}, icon)
);

// Legacy icon components — now use Material Symbols
var HomeIcon  = () => React.createElement(Ms, { icon: "fitness_center",} );
var LibIcon   = () => React.createElement(Ms, { icon: "sports_cricket",} );
var PlanIcon  = () => React.createElement(Ms, { icon: "calendar_today",} );
var HistIcon  = () => React.createElement(Ms, { icon: "history",} );
var AIIcon    = () => React.createElement(Ms, { icon: "smart_toy",} );

// ─── SHARED SESSION HELPERS ────────────────────────────────────────────────────

// ─── EXIT CONFIRM MODAL ──────────────────────────────────────────────────────
function ExitConfirmModal({ onConfirm, onCancel, message = "Do you want to quit this game?" }) {
  return (
    React.createElement('div', { style: {
      position: "fixed", inset: 0, zIndex: 800,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    },
    onClick: onCancel,}

      /* Bottom sheet */
      , React.createElement('div', {
        onClick: e => e.stopPropagation(),
        style: {
          background: "#1a1f1a", borderRadius: "24px 24px 0 0",
          padding: "0 0 40px", width: "100%", maxWidth: 480,
          boxShadow: "0 -4px 40px rgba(0,0,0,0.5)",
        },}

        /* Header row: Close — QUIT GAME */
        , React.createElement('div', { style: {
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px 0",
        },}
          , React.createElement('button', { onClick: onCancel, style: {
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif", fontSize: 15,
            color: "rgba(255,255,255,0.55)", WebkitTapHighlightColor: "transparent",
            padding: "4px 0",
          },}, "Close"

          )
          , React.createElement('div', { style: {
            fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 18, fontWeight: 700,
            letterSpacing: 3, color: "var(--text)", textAlign: "center", flex: 1,
          },}, "Quit Game"

          )
          , React.createElement('div', { style: { width: 48 },} ), " " /* spacer to centre title */
        )

        /* Message */
        , React.createElement('div', { style: {
          fontSize: 15, color: "rgba(255,255,255,0.55)",
          textAlign: "center", padding: "16px 32px 28px",
          lineHeight: 1.5,
        },}
          , message
        )

        /* Buttons */
        , React.createElement('div', { style: { display: "flex", gap: 12, padding: "0 20px" },}
          , React.createElement('button', { onClick: onConfirm, style: {
            flex: 1, padding: "18px 0", borderRadius: 100,
            background: "#c0392b", border: "none",
            fontFamily: "'DM Sans',sans-serif", fontSize: 17, fontWeight: 700,
            color: "#fff", cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
          },}, "Quit"

          )
          , React.createElement('button', { onClick: onCancel, style: {
            flex: 1, padding: "18px 0", borderRadius: 100,
            background: "#2980b9", border: "none",
            fontFamily: "'DM Sans',sans-serif", fontSize: 17, fontWeight: 700,
            color: "#fff", cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
          },}, "Stay"

          )
        )
      )
    )
  );
}

function SessionTopBar({ onExit, idx, total, label }) {
  var [confirming, setConfirming] = useState(false);
  return (
    React.createElement(React.Fragment, null
      , confirming && (
        React.createElement(ExitConfirmModal, {
          onConfirm: onExit,
          onCancel: () => setConfirming(false),
          message: "Are you sure you want to exit? Your session progress will be lost."            ,}
        )
      )
      , React.createElement('div', { style: { position:"sticky", top:0, zIndex:10, background:"rgba(27,24,21,0.93)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)", padding:"0 16px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between", margin:"0 -16px 16px" },}
        , React.createElement('button', { className: "back-btn", onClick: () => setConfirming(true), style: { fontSize:13, color:"var(--muted)", display:"flex", alignItems:"center", gap:6 },}, React.createElement(Ms, { icon: "close", size: 18,} ), " Exit" )
        , React.createElement('span', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", color:"var(--muted)" },}, label || `${idx + 1} of ${total}`)
      )
    )
  );
}

function ProgressBar({ current, total, label }) {
  return (
    React.createElement('div', { className: "prog-bar-wrap", style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, marginBottom: 14 },}
      , React.createElement('div', { className: "prog-bar-top",}, React.createElement('span', { style: { fontWeight: 600, color: "var(--text)", fontSize: 13 },}, label), React.createElement('span', null, current, " / "  , total))
      , React.createElement('div', { className: "prog-bar-bg",}, React.createElement('div', { className: "prog-bar-fill", style: { width: `${(current / total) * 100}%` },} ))
    )
  );
}

function NextPanel({ upVal, downVal, upLabel, downLabel, warning }) {
  return (
    React.createElement('div', { className: "info-block", style: { marginBottom: 0 },}
      , React.createElement('div', { className: "info-title",}, "What happens next"  )
      , React.createElement('div', { className: "next-panel",}
        , React.createElement('div', { className: "next-box up" ,}, React.createElement('div', { className: "next-num up" ,}, "↑ " , upVal), React.createElement('div', { className: "next-lbl",}, upLabel || "Hit"))
        , React.createElement('div', { className: "next-box down" ,}, React.createElement('div', { className: "next-num down" ,}, "↓ " , downVal), React.createElement('div', { className: "next-lbl",}, downLabel || "Miss"))
      )
      , warning && React.createElement('div', { className: "warn-banner",}, warning)
    )
  );
}

function GameResultScreen({ title, emoji, subtitle, stats, history, notes, setNotes, onDone, doneLabel }) {
  // Map emoji to Material Symbol or keep as-is for celebration ones
  var isWin   = emoji === "🏆";
  var isTime  = emoji === "⏱";
  var isBust  = emoji === "💥";
  var isChart = emoji === "chart";

  return (
    React.createElement('div', { className: "scroll-area", style: { paddingTop: 0 },}
      /* Hero card */
      , React.createElement('div', { style: {
        background: isWin
          ? "linear-gradient(135deg,rgba(232,118,63,.1),rgba(168,255,120,.04))"
          : isBust
            ? "linear-gradient(135deg,rgba(194,72,63,.08),rgba(255,100,100,.03))"
            : "var(--glass-bg)",
        border: `1px solid ${isWin ? "rgba(232,118,63,.25)" : isBust ? "rgba(194,72,63,.2)" : "var(--glass-border)"}`,
        borderTop: `3px solid ${isWin ? "var(--accent)" : isBust ? "var(--accent2)" : "rgba(255,255,255,.1)"}`,
        borderRadius: "var(--radius)", padding: "28px 20px 24px",
        textAlign: "center", marginBottom: 14,
        backdropFilter: "blur(12px)",
      },}
        /* Icon */
        , React.createElement('div', { style: { marginBottom: 14, display: "flex", justifyContent: "center" },}
          , isWin
            ? React.createElement(Ms, { icon: "emoji_events", size: 56, fill: true, style: { color: "var(--accent)" },} )
            : isTime
              ? React.createElement(Ms, { icon: "timer", size: 56, style: { color: "var(--muted)" },} )
              : isBust
                ? React.createElement(Ms, { icon: "cancel", size: 56, style: { color: "var(--accent2)" },} )
                : isChart
                  ? React.createElement(Ms, { icon: "analytics", size: 56, style: { color: "var(--accent)" },} )
                  : React.createElement('span', { style: { fontSize: 52 },}, emoji)
          
        )

        /* Title */
        , React.createElement('div', { style: {
          fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 30, fontWeight: 800,
          letterSpacing: "-0.02em", lineHeight: 1.1,
          color: isWin ? "var(--accent)" : isBust ? "var(--accent2)" : "var(--text)",
          marginBottom: 6,
        },}, title)

        , subtitle && (
          React.createElement('div', { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 500, letterSpacing: ".04em", color: "var(--muted)", marginTop: 4 },}, subtitle)
        )
      )

      /* Stats */
      , React.createElement('div', { className: "stat-row", style: { marginBottom: 14 },}
        , stats.map((s, i) => (
          React.createElement('div', { key: i, className: "stat-box",}
            , React.createElement('div', { className: "stat-val",}, s.val)
            , React.createElement('div', { className: "stat-lbl",}, s.lbl)
          )
        ))
      )

      /* Last attempts */
      , history && history.length > 0 && (
        React.createElement(React.Fragment, null
          , React.createElement('div', { className: "section-label",}, "Last Attempts" )
          , React.createElement('div', { style: { background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: "var(--radius)", padding: "8px 12px", marginBottom: 14, backdropFilter: "blur(12px)" },}
            , history.slice(-8).map((h, i) => (
              React.createElement('div', { key: i, style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < Math.min(history.length, 8) - 1 ? "1px solid var(--border)" : "none" },}
                , React.createElement(Ms, { icon: h.good ? "check_circle" : "cancel", size: 16, fill: true, style: { color: h.good ? "var(--accent)" : "var(--accent2)", flexShrink: 0 },} )
                , React.createElement('span', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 13, color: "var(--text2)", flex: 1 },}, h.label)
                , React.createElement('span', { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: h.good ? "var(--accent)" : "var(--accent2)" },}, h.result)
              )
            ))
          )
        )
      )

      /* Notes */
      , React.createElement('textarea', { className: "notes-input", placeholder: "Notes for this game..."   , value: notes, onChange: e => setNotes(e.target.value),} )

      /* Done button */
      , React.createElement('button', { className: "btn btn-primary btn-full"  , style: { marginTop: 12 }, onClick: onDone,}
        , doneLabel === "Finish Session"
          ? React.createElement(React.Fragment, null, React.createElement(Ms, { icon: "check_circle", size: 18, fill: true,} ), " Finish Session"  )
          : React.createElement(React.Fragment, null, React.createElement(Ms, { icon: "arrow_forward", size: 18,} ), " " , doneLabel)
        
      )
    )
  );
}

// ─── AROUND THE CLOCK SESSION ─────────────────────────────────────────────────

function AtcSession({ game, onDone, onExit, sessionIdx, sessionTotal }) {
  var targets = [...Array(20).keys()].map(i => i + 1);
  var allTargets = [...targets, "Bull"];
  var [currentIdx, setCurrentIdx] = useState(0);
  var [dartCount, setDartCount] = useState(0);
  var [dartInput, setDartInput] = useState(1);
  var [completedNumbers, setCompleted] = useState([]);
  var [done, setDone] = useState(false);
  var [notes, setNotes] = useState("");
  // For level 4: track which segments hit per number
  var [l4Segments, setL4Segments] = useState({});
  var [timeLeft, setTimeLeft] = useState(20 * 60);
  var [timerActive, setTimerActive] = useState(game.level === 4);
  var timerRef = useRef(null);

  useEffect(() => {
    if (game.level === 4 && timerActive && !done) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); setDone(true); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, done, game.level]);

  var current = allTargets[currentIdx];
  var levelLabel = { 1: "Any segment", 2: "Doubles only", 3: "Trebles only", 4: "Shanghai (S + D + T)" };

  var advance = (dartsUsed) => {
    var newTotal = dartCount + dartsUsed;
    setDartCount(newTotal);
    setCompleted(c => [...c, current]);
    if (currentIdx >= allTargets.length - 1) { setDone(true); clearInterval(timerRef.current); }
    else { setCurrentIdx(i => i + 1); setDartInput(1); }
  };

  // Level 4 logic
  var l4Toggle = (seg) => {
    var key = current;
    var existing = l4Segments[key] || [];
    var updated = existing.includes(seg) ? existing.filter(s => s !== seg) : [...existing, seg];
    setL4Segments(s => ({ ...s, [key]: updated }));
    if (["S", "D", "T"].every(s => updated.includes(s)) || (current === "Bull" && updated.includes("Bull"))) {
      setTimeout(() => {
        setDartCount(d => d + 3);
        setCompleted(c => [...c, current]);
        if (currentIdx >= allTargets.length - 1) { setDone(true); clearInterval(timerRef.current); }
        else { setCurrentIdx(i => i + 1); setL4Segments({}); }
      }, 300);
    }
  };

  var fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (done) {
    var score = game.level === 4 ? completedNumbers.length : dartCount;
    return React.createElement(GameResultScreen, {
      title: completedNumbers.length === allTargets.length ? "Complete!" : "Time's Up!",
      emoji: completedNumbers.length === allTargets.length ? "🏆" : "⏱",
      subtitle: game.level === 4 ? `Completed ${completedNumbers.length} of ${allTargets.length} targets` : `${dartCount} total darts`,
      stats: game.level === 4
        ? [{ val: completedNumbers.length, lbl: "Completed" }, { val: allTargets.length - completedNumbers.length, lbl: "Remaining" }, { val: fmt(20 * 60 - timeLeft), lbl: "Time Used" }]
        : [{ val: dartCount, lbl: "Total Darts" }, { val: completedNumbers.length, lbl: "Completed" }, { val: Math.round(dartCount / Math.max(completedNumbers.length, 1) * 10) / 10, lbl: "Avg/Target" }],
      history: completedNumbers.map(n => ({ icon: "✅", label: `${game.level === 2 ? "D" : game.level === 3 ? "T" : ""}${n}`, result: "Hit", good: true })),
      notes: notes, setNotes: setNotes,
      onDone: () => onDone({ score, notes }),
      doneLabel: sessionIdx < sessionTotal - 1 ? "Log & Next" : "Finish Session",}
    );
  }

  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement(SessionTopBar, { onExit: onExit, idx: sessionIdx, total: sessionTotal,} )
      , React.createElement(ProgressBar, { current: currentIdx, total: allTargets.length, label: game.name,} )

      , game.level === 4 && (
        React.createElement('div', { style: { background: "var(--surface)", border: `1px solid ${timeLeft < 120 ? "rgba(194,72,63,.4)" : "var(--border)"}`, borderRadius: "var(--radius)", padding: 14, marginBottom: 14, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}, "Time Remaining" )
          , React.createElement('div', { className: `timer-display ${timeLeft < 120 ? "warning" : "ok"}`,}, fmt(timeLeft))
        )
      )

      , React.createElement('div', { style: { background: "linear-gradient(135deg,rgba(232,118,63,.07),rgba(168,255,120,.03))", border: "1px solid rgba(232,118,63,.25)", borderRadius: "var(--radius)", padding: 20, marginBottom: 14, textAlign: "center" },}
        , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 },}, "Current Target" )
        , React.createElement('div', { className: "big-number", style: { fontSize: current === "Bull" ? 64 : 88 },}, current === "Bull" ? "🎯 Bull" : current)
        , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginTop: 8 },}, levelLabel[game.level])
      )

      , game.level === 4 ? (
        React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Tap each segment as you hit it"      )
          , React.createElement('div', { className: "segment-dots", style: { gap: 10 },}
            , ["S", "D", "T"].map(seg => {
              var hits = l4Segments[current] || [];
              return (
                React.createElement('div', { key: seg, className: `seg-dot ${hits.includes(seg) ? "hit" : "current"}`, style: { width: 64, height: 64, fontSize: 15, borderRadius: 14 }, onClick: () => l4Toggle(seg),}
                  , seg === "S" ? "Single" : seg === "D" ? "Double" : "Treble"
                )
              );
            })
          )
          , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 10 },}, "Hit all 3 to advance automatically"     )
        )
      ) : (
        React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Darts used on this target"    )
          , React.createElement('div', { style: { display: "flex", gap: 8, alignItems: "center" },}
            , React.createElement('button', { className: "btn btn-secondary btn-sm"  , onClick: () => setDartInput(d => Math.max(1, d - 1)),}, "−")
            , React.createElement('div', { style: { flex: 1, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px", textAlign: "center", fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: "var(--accent)", letterSpacing: 2 },}, dartInput)
            , React.createElement('button', { className: "btn btn-secondary btn-sm"  , onClick: () => setDartInput(d => d + 1),}, "+")
          )
          , React.createElement('div', { style: { display: "flex", gap: 6, marginTop: 10 },}
            , [1, 2, 3, 4, 5, 6].map(n => (
              React.createElement('button', { key: n, className: `filter-btn ${dartInput === n ? "active" : ""}`, style: { flex: 1, textAlign: "center", padding: "8px 0" }, onClick: () => setDartInput(n),}, n)
            ))
          )
          , React.createElement('button', { className: "btn btn-primary btn-full"  , style: { marginTop: 12 }, onClick: () => advance(dartInput),}, "✓ Hit! Move to "
                , allTargets[currentIdx + 1] === undefined ? "Finish" : allTargets[currentIdx + 1] === "Bull" ? "Bull" : allTargets[currentIdx + 1]
          )
        )
      )

      , React.createElement('div', { className: "info-block", style: { marginTop: 14 },}
        , React.createElement('div', { className: "info-title",}, "Progress")
        , React.createElement('div', { style: { display: "flex", gap: 5, flexWrap: "wrap" },}
          , allTargets.map((t, i) => (
            React.createElement('div', { key: i, style: { width: 28, height: 28, borderRadius: 7, background: completedNumbers.includes(t) ? "var(--accent)" : i === currentIdx ? "rgba(232,118,63,.15)" : "var(--surface2)", border: `1px solid ${i <= currentIdx ? "var(--accent)" : "var(--border)"}`, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: completedNumbers.includes(t) ? "var(--on-accent)" : i === currentIdx ? "var(--accent)" : "var(--muted)" },}
              , completedNumbers.includes(t) ? "✓" : t === "Bull" ? "B" : t
            )
          ))
        )
      )
    )
  );
}

// ─── BOB'S 27 SESSION ─────────────────────────────────────────────────────────

function Bobs27Session({ onDone, onExit, sessionIdx, sessionTotal }) {
  var doubles = [...Array(20).keys()].map(i => i + 1);
  var allTargets = [...doubles, "Bull"];
  var [idx, setIdx] = useState(0);
  var [score, setScore] = useState(27);
  var [hist, setHist] = useState([]);
  var [selectedHits, setSelectedHits] = useState(null);
  var [done, setDone] = useState(false);
  var [notes, setNotes] = useState("");

  var current = allTargets[idx];
  var dblValue = current === "Bull" ? 25 : current * 2;

  var confirmHits = () => {
    if (selectedHits === null) return;
    var gained = selectedHits === 0 ? -dblValue : selectedHits * dblValue;
    var newScore = score + gained;
    setHist(h => [...h, { target: `D${current === "Bull" ? "Bull" : current}`, hits: selectedHits, gained, scoreBefore: score, scoreAfter: newScore }]);
    setSelectedHits(null);
    if (newScore <= 0) { setDone(true); return; }
    if (idx >= allTargets.length - 1) { setScore(newScore); setDone(true); return; }
    setScore(newScore);
    setIdx(i => i + 1);
  };

  if (done) {
    var finalScore = hist.length > 0 ? hist[hist.length - 1].scoreAfter : score;
    return React.createElement(GameResultScreen, {
      title: finalScore <= 0 ? "Bust!" : "Complete!",
      emoji: finalScore <= 0 ? "💥" : "🏆",
      subtitle: finalScore <= 0 ? "Score hit zero — game over." : `Final score: ${finalScore}`,
      stats: [{ val: Math.max(0, finalScore), lbl: "Final Score" }, { val: hist.filter(h => h.hits > 0).length, lbl: "Doubles Hit" }, { val: hist.filter(h => h.hits === 0).length, lbl: "Missed" }],
      history: hist.map(h => ({ icon: h.hits > 0 ? "✅" : "❌", label: h.target, result: `${h.gained > 0 ? "+" : ""}${h.gained} → ${h.scoreAfter}`, good: h.hits > 0 })),
      notes: notes, setNotes: setNotes,
      onDone: () => onDone({ score: Math.max(0, finalScore), notes }),
      doneLabel: sessionIdx < sessionTotal - 1 ? "Log & Next" : "Finish Session",}
    );
  }

  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement(SessionTopBar, { onExit: onExit, idx: sessionIdx, total: sessionTotal,} )
      , React.createElement(ProgressBar, { current: idx, total: allTargets.length, label: "Bob's 27" ,} )

      , React.createElement('div', { style: { display: "flex", gap: 10, marginBottom: 14 },}
        , React.createElement('div', { style: { flex: 1, background: "linear-gradient(135deg,rgba(232,118,63,.07),rgba(168,255,120,.03))", border: "1px solid rgba(232,118,63,.25)", borderRadius: "var(--radius)", padding: 16, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}, "Score")
          , React.createElement('div', { className: "stat-val", style: { fontSize: 40 },}, score)
        )
        , React.createElement('div', { style: { flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 16, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}, "Target")
          , React.createElement('div', { className: "stat-val", style: { fontSize: 40 },}, "D", current === "Bull" ? "Bull" : current)
        )
      )

      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "How many doubles did you hit? (out of 3 darts)"         )
        , React.createElement('div', { className: "hits-row",}
          , [0, 1, 2, 3].map(n => (
            React.createElement('button', { key: n, className: `hit-dot-btn ${selectedHits === n ? "selected" : ""}`, onClick: () => setSelectedHits(n),}, n)
          ))
        )
        , selectedHits !== null && (
          React.createElement('div', { style: { marginTop: 12, padding: "10px 14px", borderRadius: 10, background: selectedHits === 0 ? "rgba(194,72,63,.08)" : "rgba(232,118,63,.08)", border: `1px solid ${selectedHits === 0 ? "rgba(194,72,63,.3)" : "rgba(232,118,63,.3)"}`, textAlign: "center" },}
            , React.createElement('span', { style: { fontSize: 14, fontWeight: 700, color: selectedHits === 0 ? "var(--accent2)" : "var(--accent)" },}
              , selectedHits === 0 ? `Miss — Score: ${score} − ${dblValue} = ${score - dblValue}` : `${selectedHits} hit${selectedHits > 1 ? "s" : ""} — Score: ${score} + ${selectedHits * dblValue} = ${score + selectedHits * dblValue}`
            )
          )
        )
        , React.createElement('button', { className: "btn btn-primary btn-full"  , style: { marginTop: 12 }, onClick: confirmHits, disabled: selectedHits === null,}, "Confirm & Next →"

        )
        , score - dblValue <= 0 && React.createElement('div', { className: "warn-banner",}, "⚠️ A miss here will end the game!"       )
      )

      , hist.length > 0 && (
        React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Recent")
          , hist.slice(-4).reverse().map((h, i) => (
            React.createElement('div', { key: i, className: "history-row",}
              , React.createElement('span', { style: { fontSize: 14 },}, h.hits > 0 ? "✅" : "❌")
              , React.createElement('span', { className: "history-name",}, h.target)
              , React.createElement('span', { className: "history-score", style: { color: h.hits > 0 ? "var(--accent)" : "var(--accent2)" },}, h.gained > 0 ? "+" : "", h.gained, " → "  , h.scoreAfter)
            )
          ))
        )
      )
    )
  );
}

// ─── DOUBLES SESSION ──────────────────────────────────────────────────────────

function DoublesSession({ onDone, onExit, sessionIdx, sessionTotal }) {
  var allTargets = [...Array(20).keys()].map(i => `D${i + 1}`).concat(["D-Bull"]);
  var [idx, setIdx] = useState(0);
  var [totalHits, setTotalHits] = useState(0);
  var [results, setResults] = useState([]);
  var [selectedHits, setSelectedHits] = useState(null);
  var [done, setDone] = useState(false);
  var [notes, setNotes] = useState("");

  var confirm = () => {
    if (selectedHits === null) return;
    var newHits = totalHits + selectedHits;
    setResults(r => [...r, { target: allTargets[idx], hits: selectedHits }]);
    setTotalHits(newHits);
    setSelectedHits(null);
    if (idx >= allTargets.length - 1) { setDone(true); return; }
    setIdx(i => i + 1);
  };

  if (done) {
    var pct = Math.round((totalHits / 63) * 100);
    return React.createElement(GameResultScreen, {
      title: "Complete!", emoji: "✌️",
      subtitle: `${totalHits} hits out of 63 darts — ${pct}% hit rate`,
      stats: [{ val: totalHits, lbl: "Total Hits" }, { val: `${pct}%`, lbl: "Hit Rate" }, { val: 63 - totalHits, lbl: "Misses" }],
      history: results.map(r => ({ icon: r.hits > 0 ? "✅" : "❌", label: r.target, result: `${r.hits}/3`, good: r.hits > 0 })),
      notes: notes, setNotes: setNotes,
      onDone: () => onDone({ score: totalHits, notes }),
      doneLabel: sessionIdx < sessionTotal - 1 ? "Log & Next" : "Finish Session",}
    );
  }

  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement(SessionTopBar, { onExit: onExit, idx: sessionIdx, total: sessionTotal,} )
      , React.createElement(ProgressBar, { current: idx, total: allTargets.length, label: "Doubles Practice" ,} )

      , React.createElement('div', { style: { display: "flex", gap: 10, marginBottom: 14 },}
        , React.createElement('div', { style: { flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}, "Hits So Far"  )
          , React.createElement('div', { className: "stat-val",}, totalHits)
          , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginTop: 2 },}, idx > 0 ? `${Math.round((totalHits / (idx * 3)) * 100)}% so far` : "—")
        )
        , React.createElement('div', { style: { flex: 1, background: "linear-gradient(135deg,rgba(232,118,63,.07),rgba(168,255,120,.03))", border: "1px solid rgba(232,118,63,.25)", borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}, "Target")
          , React.createElement('div', { className: "stat-val", style: { fontSize: 36 },}, allTargets[idx])
        )
      )

      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Hits out of 3 darts"    )
        , React.createElement('div', { className: "hits-row",}
          , [0, 1, 2, 3].map(n => (
            React.createElement('button', { key: n, className: `hit-dot-btn ${selectedHits === n ? "selected" : ""}`, onClick: () => setSelectedHits(n),}, n)
          ))
        )
        , React.createElement('button', { className: "btn btn-primary btn-full"  , style: { marginTop: 12 }, onClick: confirm, disabled: selectedHits === null,}, "Log & Next →"

        )
      )

      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "All Doubles" )
        , React.createElement('div', { style: { display: "flex", gap: 5, flexWrap: "wrap" },}
          , allTargets.map((t, i) => {
            var res = results[i];
            return (
              React.createElement('div', { key: i, style: { width: 34, height: 34, borderRadius: 8, background: res ? (res.hits > 0 ? "var(--accent)" : "rgba(194,72,63,.2)") : i === idx ? "rgba(232,118,63,.15)" : "var(--surface2)", border: `1px solid ${i === idx ? "var(--accent)" : res ? (res.hits > 0 ? "var(--accent)" : "rgba(194,72,63,.4)") : "var(--border)"}`, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: res ? (res.hits > 0 ? "var(--on-accent)" : "var(--accent2)") : i === idx ? "var(--accent)" : "var(--muted)" },}
                , res ? res.hits : t === "D-Bull" ? "B" : i + 1
              )
            );
          })
        )
      )
    )
  );
}

// ─── TREBLES SESSION ──────────────────────────────────────────────────────────

function TreblesSession({ onDone, onExit, sessionIdx, sessionTotal }) {
  var allTargets = Array.from({ length: 20 }, (_, i) => `T${i + 1}`);
  var [idx, setIdx] = useState(0);
  var [totalHits, setTotalHits] = useState(0);
  var [results, setResults] = useState([]);
  var [selectedHits, setSelectedHits] = useState(null);
  var [done, setDone] = useState(false);
  var [notes, setNotes] = useState("");

  var confirm = () => {
    if (selectedHits === null) return;
    setResults(r => [...r, { target: allTargets[idx], hits: selectedHits }]);
    setTotalHits(h => h + selectedHits);
    setSelectedHits(null);
    if (idx >= allTargets.length - 1) { setDone(true); return; }
    setIdx(i => i + 1);
  };

  if (done) {
    var pct = Math.round((totalHits / 60) * 100);
    var keyTrebles = results.filter(r => ["T20", "T19", "T18", "T17"].includes(r.target));
    var keyHits = keyTrebles.reduce((a, r) => a + r.hits, 0);
    return React.createElement(GameResultScreen, {
      title: "Complete!", emoji: "🔱",
      subtitle: `${totalHits} hits out of 60 — ${pct}% hit rate`,
      stats: [{ val: totalHits, lbl: "Total Hits" }, { val: `${pct}%`, lbl: "Hit Rate" }, { val: `${keyHits}/12`, lbl: "T17–T20" }],
      history: results.map(r => ({ icon: r.hits > 0 ? "✅" : "❌", label: r.target, result: `${r.hits}/3`, good: r.hits > 0 })),
      notes: notes, setNotes: setNotes,
      onDone: () => onDone({ score: totalHits, notes }),
      doneLabel: sessionIdx < sessionTotal - 1 ? "Log & Next" : "Finish Session",}
    );
  }

  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement(SessionTopBar, { onExit: onExit, idx: sessionIdx, total: sessionTotal,} )
      , React.createElement(ProgressBar, { current: idx, total: allTargets.length, label: "Trebles Practice" ,} )

      , React.createElement('div', { style: { display: "flex", gap: 10, marginBottom: 14 },}
        , React.createElement('div', { style: { flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}, "Hits So Far"  )
          , React.createElement('div', { className: "stat-val",}, totalHits)
          , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginTop: 2 },}, idx > 0 ? `${Math.round((totalHits / (idx * 3)) * 100)}%` : "—")
        )
        , React.createElement('div', { style: { flex: 1, background: "linear-gradient(135deg,rgba(232,118,63,.07),rgba(168,255,120,.03))", border: "1px solid rgba(232,118,63,.25)", borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}, "Target")
          , React.createElement('div', { className: "stat-val", style: { fontSize: 36 },}, allTargets[idx])
          , ["T20", "T19", "T18", "T17"].includes(allTargets[idx]) && React.createElement('div', { style: { fontSize: 10, color: "var(--accent)", fontWeight: 700, marginTop: 4 },}, React.createElement(Ms, { icon: "star", size: 10, fill: true,} ), " KEY TREBLE"  )
        )
      )

      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Hits out of 3 darts"    )
        , React.createElement('div', { className: "hits-row",}
          , [0, 1, 2, 3].map(n => (
            React.createElement('button', { key: n, className: `hit-dot-btn ${selectedHits === n ? "selected" : ""}`, onClick: () => setSelectedHits(n),}, n)
          ))
        )
        , React.createElement('button', { className: "btn btn-primary btn-full"  , style: { marginTop: 12 }, onClick: confirm, disabled: selectedHits === null,}, "Log & Next →"

        )
      )

      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Progress")
        , React.createElement('div', { style: { display: "flex", gap: 5, flexWrap: "wrap" },}
          , allTargets.map((t, i) => {
            var res = results[i];
            return (
              React.createElement('div', { key: i, style: { width: 34, height: 34, borderRadius: 8, background: res ? (res.hits > 0 ? "var(--accent)" : "rgba(194,72,63,.2)") : i === idx ? "rgba(232,118,63,.15)" : "var(--surface2)", border: `1px solid ${i === idx ? "var(--accent)" : res ? (res.hits > 0 ? "var(--accent)" : "rgba(194,72,63,.4)") : "var(--border)"}`, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: res ? (res.hits > 0 ? "var(--on-accent)" : "var(--accent2)") : i === idx ? "var(--accent)" : "var(--muted)" },}
                , res ? res.hits : i + 1
              )
            );
          })
        )
      )
    )
  );
}

// ─── BULLSEYE SESSION ─────────────────────────────────────────────────────────

function BullseyeSession({ onDone, onExit, sessionIdx, sessionTotal }) {
  var GROUPS = 5;
  var [groupIdx, setGroupIdx] = useState(0);
  var [innerHits, setInnerHits] = useState(null);
  var [outerHits, setOuterHits] = useState(null);
  var [results, setResults] = useState([]);
  var [done, setDone] = useState(false);
  var [notes, setNotes] = useState("");

  var confirm = () => {
    if (innerHits === null || outerHits === null) return;
    var pts = innerHits * 50 + outerHits * 25;
    setResults(r => [...r, { group: groupIdx + 1, inner: innerHits, outer: outerHits, pts }]);
    setInnerHits(null); setOuterHits(null);
    if (groupIdx >= GROUPS - 1) { setDone(true); return; }
    setGroupIdx(g => g + 1);
  };

  if (done) {
    var totalPts = results.reduce((a, r) => a + r.pts, 0);
    var totalHits = results.reduce((a, r) => a + r.inner + r.outer, 0);
    var pct = Math.round((totalHits / 50) * 100);
    return React.createElement(GameResultScreen, {
      title: "Complete!", emoji: "🎪",
      subtitle: `${totalPts} points · ${pct}% hit rate`,
      stats: [{ val: totalPts, lbl: "Total Points" }, { val: `${pct}%`, lbl: "Hit Rate" }, { val: results.reduce((a, r) => a + r.inner, 0), lbl: "Inner Bulls" }],
      history: results.map(r => ({ icon: "🎯", label: `Group ${r.group}`, result: `${r.inner} inner, ${r.outer} outer = ${r.pts}pts`, good: r.pts > 0 })),
      notes: notes, setNotes: setNotes,
      onDone: () => onDone({ score: totalPts, notes }),
      doneLabel: sessionIdx < sessionTotal - 1 ? "Log & Next" : "Finish Session",}
    );
  }

  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement(SessionTopBar, { onExit: onExit, idx: sessionIdx, total: sessionTotal,} )
      , React.createElement(ProgressBar, { current: groupIdx, total: GROUPS, label: "Bullseye Challenge" ,} )

      , React.createElement('div', { style: { background: "linear-gradient(135deg,rgba(232,118,63,.07),rgba(168,255,120,.03))", border: "1px solid rgba(232,118,63,.25)", borderRadius: "var(--radius)", padding: 20, marginBottom: 14, textAlign: "center" },}
        , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 },}, "Group " , groupIdx + 1, " of "  , GROUPS)
        , React.createElement('div', { style: { marginBottom: 4 },}, React.createElement(DartboardSVG, { size: 64,} ))
        , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)" },}, "Throw 10 darts at the bull — then log results below"          )
      )

      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Inner Bull hits (50 pts each)"     )
        , React.createElement('div', { className: "hits-row",}
          , [0, 1, 2, 3, 4, 5].map(n => (
            React.createElement('button', { key: n, className: `hit-dot-btn ${innerHits === n ? "selected" : ""}`, style: { flex: 1 }, onClick: () => setInnerHits(n),}, n)
          ))
        )
      )

      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Outer Bull hits (25 pts each)"     )
        , React.createElement('div', { className: "hits-row",}
          , [0, 1, 2, 3, 4, 5].map(n => (
            React.createElement('button', { key: n, className: `hit-dot-btn ${outerHits === n ? "selected" : ""}`, style: { flex: 1 }, onClick: () => setOuterHits(n),}, n)
          ))
        )
        , innerHits !== null && outerHits !== null && (
          React.createElement('div', { style: { marginTop: 10, textAlign: "center", fontSize: 14, fontWeight: 600, color: "var(--accent)" },}, "Group score: "
              , innerHits * 50 + outerHits * 25, " pts — Running total: "     , results.reduce((a, r) => a + r.pts, 0) + innerHits * 50 + outerHits * 25, " pts"
          )
        )
        , React.createElement('button', { className: "btn btn-primary btn-full"  , style: { marginTop: 12 }, onClick: confirm, disabled: innerHits === null || outerHits === null,}
          , groupIdx < GROUPS - 1 ? "Log Group & Continue" : "Finish Challenge 🏆"
        )
      )

      , results.length > 0 && (
        React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Groups Done" )
          , results.map((r, i) => (
            React.createElement('div', { key: i, className: "history-row",}
              , React.createElement('span', { style: { fontSize: 14 },}, "🎯")
              , React.createElement('span', { className: "history-name",}, "Group " , r.group)
              , React.createElement('span', { className: "history-score",}, r.inner, "×50 + "  , r.outer, "×25 = "  , r.pts, "pts")
            )
          ))
        )
      )
    )
  );
}

// ─── HALVE-IT SESSION ─────────────────────────────────────────────────────────

function HalveItSession({ onDone, onExit, sessionIdx, sessionTotal }) {
  var [roundIdx, setRoundIdx] = useState(0);
  var [score, setScore] = useState(0);
  var [results, setResults] = useState([]);
  var [ptsInput, setPtsInput] = useState(null);
  var [done, setDone] = useState(false);
  var [notes, setNotes] = useState("");

  var round = HALVE_IT_SEQUENCE[roundIdx];

  var confirmRound = (hit) => {
    var newScore;
    if (hit) {
      var pts = ptsInput || 0;
      newScore = score + pts;
    } else {
      newScore = Math.floor(score / 2);
    }
    setResults(r => [...r, { label: round.label, hit, scoreBefore: score, scoreAfter: newScore }]);
    setScore(newScore);
    setPtsInput(null);
    if (roundIdx >= HALVE_IT_SEQUENCE.length - 1) { setDone(true); return; }
    setRoundIdx(i => i + 1);
  };

  if (done) {
    return React.createElement(GameResultScreen, {
      title: "Complete!", emoji: "✂️",
      subtitle: `Final score: ${score}`,
      stats: [{ val: score, lbl: "Final Score" }, { val: results.filter(r => r.hit).length, lbl: "Rounds Hit" }, { val: results.filter(r => !r.hit).length, lbl: "Halvings" }],
      history: results.map(r => ({ icon: r.hit ? "✅" : "✂️", label: r.label, result: r.hit ? `+pts → ${r.scoreAfter}` : `Halved → ${r.scoreAfter}`, good: r.hit })),
      notes: notes, setNotes: setNotes,
      onDone: () => onDone({ score, notes }),
      doneLabel: sessionIdx < sessionTotal - 1 ? "Log & Next" : "Finish Session",}
    );
  }

  var quickPts = round.target === "20" ? [20, 40, 60] : round.target === "16" ? [16, 32, 48] : round.target === "17" ? [17, 34, 51] : round.target === "18" ? [18, 36, 54] : round.target === "double" ? [20, 40, 60] : round.target === "treble" ? [51, 102, 153] : [25, 50];

  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement(SessionTopBar, { onExit: onExit, idx: sessionIdx, total: sessionTotal,} )
      , React.createElement(ProgressBar, { current: roundIdx, total: HALVE_IT_SEQUENCE.length, label: "Halve-It",} )

      , React.createElement('div', { style: { display: "flex", gap: 10, marginBottom: 14 },}
        , React.createElement('div', { style: { flex: 1, background: "linear-gradient(135deg,rgba(232,118,63,.07),rgba(168,255,120,.03))", border: "1px solid rgba(232,118,63,.25)", borderRadius: "var(--radius)", padding: 16, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}, "Score")
          , React.createElement('div', { className: "stat-val", style: { fontSize: 40 },}, score)
          , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginTop: 2 },}, "Halved → "  , Math.floor(score / 2))
        )
        , React.createElement('div', { style: { flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 16, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}, "Round " , roundIdx + 1)
          , React.createElement('div', { className: "stat-val", style: { fontSize: 24 },}, round.label)
        )
      )

      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Did you hit the target?"    )
        , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)", marginBottom: 12 },}, "Target: " , React.createElement('strong', { style: { color: "var(--text)" },}, round.label), " — throw 3 darts, hit it at least once to score."           )

        , React.createElement('div', { style: { marginBottom: 12 },}
          , React.createElement('div', { className: "info-title", style: { marginBottom: 8 },}, "Points scored this round"   )
          , React.createElement('div', { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 8 },}
            , React.createElement('button', { className: "btn btn-secondary btn-sm"  , onClick: () => setPtsInput(p => Math.max(0, (p || 0) - (quickPts[0] || 1))),}, "−")
            , React.createElement('div', { style: { flex: 1, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px", textAlign: "center", fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, color: "var(--accent)", letterSpacing: 2 },}, ptsInput || 0)
            , React.createElement('button', { className: "btn btn-secondary btn-sm"  , onClick: () => setPtsInput(p => (p || 0) + (quickPts[0] || 1)),}, "+")
          )
          , React.createElement('div', { style: { display: "flex", gap: 6 },}
            , quickPts.map(v => (React.createElement('button', { key: v, className: "filter-btn", style: { flex: 1, textAlign: "center" }, onClick: () => setPtsInput(v),}, v)))
          )
        )

        , React.createElement('div', { style: { display: "flex", gap: 10 },}
          , React.createElement('button', { className: "hit-btn yes" , onClick: () => { haptic("hit"); confirmRound(true); },}, React.createElement(Ms, { icon: "check", size: 18,} ), " Hit! +"  , ptsInput || 0, "pts")
          , React.createElement('button', { className: "hit-btn no" , onClick: () => { haptic("miss"); confirmRound(false); },}, "✂️ Miss — Halve"   )
        )
      )

      , results.length > 0 && (
        React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "So Far" )
          , results.slice(-3).reverse().map((r, i) => (
            React.createElement('div', { key: i, className: "history-row",}
              , React.createElement('span', { style: { fontSize: 14 },}, r.hit ? "✅" : "✂️")
              , React.createElement('span', { className: "history-name",}, r.label)
              , React.createElement('span', { className: "history-score", style: { color: r.hit ? "var(--accent)" : "var(--accent2)" },}, r.hit ? `→ ${r.scoreAfter}` : `Halved → ${r.scoreAfter}`)
            )
          ))
        )
      )
    )
  );
}

// ─── 121 SESSION ──────────────────────────────────────────────────────────────

function Game121Session({ game, onDone, onExit, sessionIdx, sessionTotal }) {
  var levelConfig = { 1: { darts: 9, downBy: 1 }, 2: { darts: 9, downBy: 2 }, 3: { darts: 6, downBy: 1 } };
  var config = levelConfig[game.level];
  var maxVisits = config.darts / 3;

  // ── Setup state ───────────────────────────────────────────────────────────
  var [goal, setGoal]               = useState("");
  var [goalSet, setGoalSet]         = useState(false);
  var [floorInput, setFloorInput]   = useState("100");
  var [timeLimitMins, setTimeLimitMins] = useState(null);

  // ── Game state ────────────────────────────────────────────────────────────
  var [current, setCurrent]         = useState(121);
  var [highest, setHighest]         = useState(121);
  var [visit, setVisit]             = useState(1);
  var [gameOver, setGameOver]       = useState(false);
  var [goalReached, setGoalReached] = useState(false);
  var [timeUp, setTimeUp]           = useState(false);
  var [hist, setHist]               = useState([]);
  var [notes, setNotes]             = useState("");
  var [secondsLeft, setSecondsLeft] = useState(null);
  var timerRef121 = useRef(null);

  var floor = parseInt(floorInput) || 100;

  // Start timer when game starts
  useEffect(() => {
    if (!goalSet || !timeLimitMins) return;
    var totalSecs = timeLimitMins * 60;
    setSecondsLeft(totalSecs);
    timerRef121.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(timerRef121.current);
          setTimeUp(true);
          setGameOver(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef121.current);
  }, [goalSet]);

  var fmtTime121 = (s) => {
    if (s === null) return null;
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  var handleResult = (hit) => {
    setHist(h => [...h, { number: current, result: hit ? "hit" : "miss" }]);
    var next = hit ? current + 1 : current - config.downBy;
    setHighest(h => Math.max(h, current));
    if (hit && parseInt(goal) && next > parseInt(goal)) { setGoalReached(true); clearInterval(timerRef121.current); return; }
    if (next < floor) { setGameOver(true); clearInterval(timerRef121.current); return; }
    setCurrent(next); setVisit(1);
  };

  // ── Setup screen ──────────────────────────────────────────────────────────
  if (!goalSet) return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement(SessionTopBar, { onExit: onExit, idx: sessionIdx, total: sessionTotal,} )
      , React.createElement('div', { style: { textAlign: "center", padding: "24px 0 20px" },}
        , React.createElement('div', { style: { fontSize: 56, marginBottom: 10 },}, "🎰")
        , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 6 },}, game.name)
        , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)", lineHeight: 1.5 },}, game.shortDesc)
      )

      /* Goal */
      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Goal — number to reach"    )
        , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginBottom: 10 },}, "Game ends when you hit this number."      )
        , React.createElement('div', { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 },}
          , [130, 135, 140, 150].map(s => (
            React.createElement('button', { key: s, className: `filter-btn ${goal === String(s) ? "active" : ""}`,
              style: { flex: 1 }, onClick: () => setGoal(String(s)),}, s)
          ))
        )
        , React.createElement('input', { className: "form-input", type: "number", placeholder: "Custom goal..." , value: goal,
          onChange: e => setGoal(e.target.value), min: "102", max: "300",} )
        , goal && parseInt(goal) <= 100 && React.createElement('div', { style: { fontSize: 12, color: "var(--accent2)", marginTop: 6 },}, "Must be above 100"   )
      )

      /* Floor */
      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Floor — game ends if you drop to this"        )
        , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginBottom: 10 },}, "Default is 100. Raise it to make the game harder."         )
        , React.createElement('div', { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 },}
          , [100, 105, 110, 115].map(f => (
            React.createElement('button', { key: f, className: `filter-btn ${floorInput === String(f) ? "active" : ""}`,
              style: { flex: 1 }, onClick: () => setFloorInput(String(f)),}, f)
          ))
        )
        , React.createElement('input', { className: "form-input", type: "number", placeholder: "Custom floor..." , value: floorInput,
          onChange: e => setFloorInput(e.target.value), min: "100", max: "130",} )
      )

      /* Time limit */
      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Time Limit (optional)"  )
        , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginBottom: 10 },}, "Safety net — game ends when time runs out."        )
        , React.createElement('div', { style: { display: "flex", gap: 8, flexWrap: "wrap" },}
          , [null, 5, 10, 15, 20].map(t => (
            React.createElement('button', { key: String(t), className: `filter-btn ${timeLimitMins === t ? "active" : ""}`,
              style: { flex: 1 }, onClick: () => setTimeLimitMins(t),}
              , t === null ? "No limit" : `${t} min`
            )
          ))
        )
      )

      , React.createElement('button', { className: "btn btn-primary btn-full"  ,
        disabled: !goal || parseInt(goal) <= 100,
        onClick: () => setGoalSet(true),}, "Start Game →"

      )
    )
  );

  // ── Result screen ─────────────────────────────────────────────────────────
  if (gameOver || goalReached) {
    var endReason = goalReached ? `Goal of ${goal} reached!` : timeUp ? "Time ran out." : `Dropped below ${floor}.`;
    return (
      React.createElement(GameResultScreen, {
        title: goalReached ? "Goal Reached!" : timeUp ? "Time's Up!" : "Game Over",
        emoji: goalReached ? "🏆" : timeUp ? "⏱" : "💥",
        subtitle: endReason,
        stats: [{ val: highest, lbl: "Highest" }, { val: goal || "—", lbl: "Goal" }, { val: hist.filter(h => h.result === "hit").length, lbl: "Checkouts" }],
        history: hist.slice(-8).map(h => ({ icon: h.result === "hit" ? "✅" : "❌", label: `Target: ${h.number}`, result: h.result === "hit" ? `→ ${h.number + 1}` : `→ ${h.number - config.downBy}`, good: h.result === "hit" })),
        notes: notes, setNotes: setNotes,
        onDone: () => onDone({ score: highest, notes }),
        doneLabel: sessionIdx < sessionTotal - 1 ? "Log & Next" : "Finish Session",}
      )
    );
  }

  var timerWarning121 = secondsLeft !== null && secondsLeft <= 60;

  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement(SessionTopBar, { onExit: onExit, idx: sessionIdx, total: sessionTotal,} )

      /* Timer */
      , secondsLeft !== null && (
        React.createElement('div', { style: { background: timerWarning121 ? "rgba(194,72,63,.08)" : "var(--surface)", border: `1px solid ${timerWarning121 ? "rgba(194,72,63,.35)" : "var(--border)"}`, borderRadius: 12, padding: "8px 14px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" },}
          , React.createElement('span', { style: { fontSize: 12, color: timerWarning121 ? "var(--accent2)" : "var(--muted)" },}, "⏱ Time remaining"  )
          , React.createElement('span', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: timerWarning121 ? "var(--accent2)" : "var(--text)", letterSpacing: 2 },}, fmtTime121(secondsLeft))
        )
      )

      , React.createElement('div', { style: { background: "linear-gradient(135deg,rgba(232,118,63,.08),rgba(168,255,120,.04))", border: "1px solid rgba(232,118,63,.25)", borderRadius: "var(--radius)", padding: 20, marginBottom: 14, textAlign: "center" },}
        , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 },}, "Current Target" )
        , React.createElement('div', { className: "big-number",}, current)
        , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)", marginTop: 6 },}, config.darts, " darts · Goal: "    , goal, " · Floor: "   , floor, " · Best: "   , highest)
        , React.createElement('div', { style: { display: "flex", justifyContent: "center", gap: 8, marginTop: 12 },}
          , Array.from({ length: maxVisits }, (_, i) => i + 1).map(v => (
            React.createElement('div', { key: v, style: { width: 36, height: 36, borderRadius: 10, background: v < visit ? "var(--accent)" : v === visit ? "rgba(232,118,63,.2)" : "var(--surface2)", border: `1px solid ${v <= visit ? "var(--accent)" : "var(--border)"}`, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: v < visit ? "var(--on-accent)" : v === visit ? "var(--accent)" : "var(--muted)" },}
              , v < visit ? "✓" : v
            )
          ))
        )
      )
      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 4 },}, "Visit " , visit, " of "  , maxVisits)
        , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)", marginBottom: 14 },}, visit < maxVisits ? `Did you checkout ${current}?` : `Final chance — checkout ${current} now.`)
        , React.createElement('div', { style: { display: "flex", gap: 10 },}
          , React.createElement('button', { className: "hit-btn yes" , onClick: () => { haptic("hit"); handleResult(true); },}, React.createElement(Ms, { icon: "check_circle", size: 18, fill: true,} ), " Checked Out!"  )
          , visit < maxVisits
            ? React.createElement('button', { className: "hit-btn no" , style: { background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" }, onClick: () => { haptic("miss"); setVisit(v => v + 1); },}, "Miss → Visit "   , visit + 1)
            : React.createElement('button', { className: "hit-btn no" , onClick: () => { haptic("miss"); handleResult(false); },}, "✗ Missed All"  )
        )
      )
      , React.createElement(NextPanel, { upVal: current + 1, downVal: current - config.downBy, upLabel: "Checkout", downLabel: `Miss (−${config.downBy})`, warning: current - config.downBy < floor ? `⚠️ A miss will end the game!` : null,} )
    )
  );
}

// ─── FINISHING 50 SESSION ─────────────────────────────────────────────────────

function GameF50Session({ game, onDone, onExit, sessionIdx, sessionTotal }) {
  var TOTAL = 25;
  var [current, setCurrent] = useState(50);
  var [attempt, setAttempt] = useState(1);
  var [checkouts, setCheckouts] = useState(0);
  var [hist, setHist] = useState([]);
  var [done, setDone] = useState(false);
  var [notes, setNotes] = useState("");

  var handleResult = (hit) => {
    var next = Math.max(2, hit ? current + game.upBy : current - 1);
    setHist(h => [...h, { attempt, number: current, result: hit ? "hit" : "miss", next }]);
    if (hit) setCheckouts(c => c + 1);
    if (attempt >= TOTAL) { setCurrent(next); setDone(true); return; }
    setCurrent(next); setAttempt(a => a + 1);
  };

  if (done) {
    var pct = Math.round((checkouts / TOTAL) * 100);
    return React.createElement(GameResultScreen, {
      title: "Done!", emoji: "chart",
      subtitle: `${checkouts} checkouts from 25 — ${pct}% hit rate`,
      stats: [{ val: checkouts, lbl: "Checkouts" }, { val: `${pct}%`, lbl: "Hit Rate" }, { val: current, lbl: "Final Number" }],
      history: hist.slice(-8).map(h => ({ icon: h.result === "hit" ? "✅" : "❌", label: `#${h.attempt} — ${h.number}`, result: `→ ${h.next}`, good: h.result === "hit" })),
      notes: notes, setNotes: setNotes,
      onDone: () => onDone({ score: checkouts, notes }),
      doneLabel: sessionIdx < sessionTotal - 1 ? "Log & Next" : "Finish Session",}
    );
  }

  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement(SessionTopBar, { onExit: onExit, idx: sessionIdx, total: sessionTotal,} )
      , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, marginBottom: 14 },}
        , React.createElement('div', { className: "prog-bar-top",}, React.createElement('span', { style: { fontWeight: 600, color: "var(--text)", fontSize: 13 },}, "Finishing 50 — L"   , game.level), React.createElement('span', null, "Attempt " , attempt, " of "  , TOTAL))
        , React.createElement('div', { className: "prog-bar-bg",}, React.createElement('div', { className: "prog-bar-fill", style: { width: `${((attempt - 1) / TOTAL) * 100}%` },} ))
        , React.createElement('div', { style: { display: "flex", gap: 16, marginTop: 10 },}
          , React.createElement('span', { style: { fontSize: 12, color: "var(--muted)" },}, "✅ " , checkouts, " hits" )
          , React.createElement('span', { style: { fontSize: 12, color: "var(--muted)" },}, "❌ " , attempt - 1 - checkouts, " misses" )
          , React.createElement('span', { style: { fontSize: 12, color: "var(--accent)" },}, attempt > 1 ? `${Math.round((checkouts / (attempt - 1)) * 100)}% so far` : "—")
        )
      )
      , React.createElement('div', { style: { background: "linear-gradient(135deg,rgba(232,118,63,.08),rgba(168,255,120,.04))", border: "1px solid rgba(232,118,63,.25)", borderRadius: "var(--radius)", padding: 20, marginBottom: 14, textAlign: "center" },}
        , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 },}, "Checkout This Number"  )
        , React.createElement('div', { className: "big-number",}, current)
        , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)", marginTop: 8 },}, "3 darts · Finish on a double"      )
      )
      , React.createElement('div', { style: { display: "flex", gap: 10, marginBottom: 14 },}
        , React.createElement('button', { className: "hit-btn yes" , onClick: () => handleResult(true),}, React.createElement(Ms, { icon: "check_circle", size: 18, fill: true,} ), " Checked Out!"  )
        , React.createElement('button', { className: "hit-btn no" , onClick: () => { haptic("miss"); handleResult(false); },}, "✗ Missed" )
      )
      , React.createElement(NextPanel, { upVal: current + game.upBy, downVal: current - 1, upLabel: `+${game.upBy} on checkout`, downLabel: "−1 on miss"  ,} )
    )
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────

function HomePage({ programmes, onStartSession, onGoTo, onPlayBot, authUser, onGoToAuth }) {
  return (
    React.createElement('div', { className: "scroll-area",}
      /* Guest warning — progress not backed up */
      , authUser === false && (
        React.createElement('div', { onClick: onGoToAuth, role: "button", "aria-label": "Create a free account to back up your progress", style: { background: "rgba(255,165,0,.1)", border: "1px solid rgba(255,165,0,.35)", borderRadius: 14, padding: "10px 14px", marginBottom: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, WebkitTapHighlightColor: "transparent", transition: "border-color var(--dur-base)" },}
          , React.createElement(Ms, { icon: "warning", size: 22, style: { color: "#ffb347" },} )
          , React.createElement('div', { style: { flex: 1 },}
            , React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: "#ffb347" },}, "Guest mode — progress not backed up"      )
            , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginTop: 2 },}, "Tap to create a free account and save your progress permanently."          )
          )
          , React.createElement(Ms, { icon: "chevron_right", size: 18, style: { color: "#ffb347", flexShrink: 0 },} )
        )
      )
      , React.createElement('div', { className: "home-hero", style: { position:"relative", overflow:"hidden", borderRadius:"var(--radius)", background:"var(--surface)" },}
        /* Dartboard photo — darkened background */
        , React.createElement('div', { style: { position:"absolute", inset:0, backgroundImage:`url(${IMG_BOARD_HERO})`, backgroundSize:"150%", backgroundPosition:"center", opacity:0.2, pointerEvents:"none" },} )
        /* Radial fade so edges blend into dark */
        , React.createElement('div', { style: { position:"absolute", inset:0, background:"radial-gradient(ellipse at center, transparent 30%, rgba(27,24,21,.75) 80%)", pointerEvents:"none" },} )
        , React.createElement('span', { className: "dart-icon", style: { position:"relative", zIndex:1 },}, React.createElement(DartboardSVG, { size: 56,} ))
        , React.createElement('div', { className: "home-logo",}, "DARTS ", React.createElement('span', null, "IQ") )
        , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)", letterSpacing: 2, textTransform: "uppercase", marginTop: 6 },}, "Train smarter. Throw better."   )
      )
      , programmes.length > 0 && (React.createElement(React.Fragment, null
        , React.createElement('div', { className: "section-label",}, "My Programmes" )
        , programmes.slice(0, 2).map(p => {
          var mins = p.games.reduce((a, id) => { var g = GAMES.find(g => g.id === id); return a + (g ? parseInt(g.duration) : 0); }, 0);
          return (
            React.createElement('div', { key: p.id, className: "card fade-in-up", onClick: () => onStartSession(p),}
              , React.createElement('div', { className: "card-header",}
                , React.createElement('div', { className: "card-icon",}, React.createElement(Ms, { icon: "calendar_today", size: 26,} ))
                , React.createElement('div', { className: "card-info",}
                  , React.createElement('div', { className: "card-name",}, p.name)
                  , React.createElement('div', { className: "card-meta",}, React.createElement('span', { className: "badge accent" ,}, p.games.length, " games" ), React.createElement('span', { className: "badge",}, "~", mins, " min" ))
                  , p.description && React.createElement('div', { className: "card-desc", style: { marginTop: 4 },}, p.description)
                )
                , React.createElement('button', { className: "btn btn-primary btn-sm", "aria-label": `Start ${p.name}`, onClick: e => { e.stopPropagation(); onStartSession(p); },}, React.createElement(Ms, { icon: "play_arrow", size: 16,} ))
              )
            )
          );
        })
      ))
      , React.createElement('div', { className: "section-label",}, "Quick Start" )
      , React.createElement('div', { className: "qs-grid",}
        , React.createElement('div', { className: "qs-card featured fade-in-up", onClick: () => onGoTo("programmes"),}
          , React.createElement('div', { className: "qs-icon",}, React.createElement(Ms, { icon: "calendar_today", size: 30,} ))
          , React.createElement('div', null, React.createElement('div', { className: "qs-label",}, programmes.length > 0 ? "My Programmes" : "Create a Programme"), React.createElement('div', { className: "qs-sub",}, programmes.length > 0 ? `${programmes.length} saved` : "Build your training plan"))
        )
        , React.createElement('div', { className: "qs-card fade-in-up", onClick: () => onGoTo("library"),}, React.createElement('div', { className: "qs-icon",}, React.createElement(Ms, { icon: "track_changes", size: 30,} )), React.createElement('div', { className: "qs-label",}, "Game Library" ), React.createElement('div', { className: "qs-sub",}, GAMES.length, " games" ))
        , React.createElement('div', { className: "qs-card fade-in-up", onClick: () => onGoTo("history"),}, React.createElement('div', { className: "qs-icon",}, React.createElement(Ms, { icon: "analytics", size: 30,} )), React.createElement('div', { className: "qs-label",}, "History"), React.createElement('div', { className: "qs-sub",}, "Past sessions" ))
        , React.createElement('div', { className: "qs-card featured fade-in-up", style: { background: "linear-gradient(135deg,rgba(194,72,63,.12),rgba(194,72,63,.06))", borderColor: "rgba(194,72,63,.3)" }, onClick: onPlayBot,}
          , React.createElement('div', { className: "qs-icon", style: { marginBottom: 0 },}, React.createElement(Ms, { icon: "smart_toy", size: 38,} ))
          , React.createElement('div', null, React.createElement('div', { className: "qs-label",}, "Play vs Bot"  ), React.createElement('div', { className: "qs-sub",}, "10 difficulty levels"  ))
        )
      )
      , React.createElement('div', { className: "section-label",}, "Featured Games" )
      , ["darts-penalties", "catch-40", "bobs-27", "halve-it"].map(id => {
        var g = GAMES.find(x => x.id === id);
        if (!g) return null;
        return (
          React.createElement('div', { key: g.id, className: "card fade-in-up", onClick: () => onGoTo("library", g.id),}
            , React.createElement('div', { className: "card-header",}
              , React.createElement('div', { className: "card-icon",}, g.icon)
              , React.createElement('div', { className: "card-info",}
                , React.createElement('div', { className: "card-name",}, g.name)
                , React.createElement('div', { className: "card-meta",}, React.createElement('span', { className: "badge",}, g.category), React.createElement('span', { className: `badge ${g.difficulty === "Advanced" ? "red" : ""}`,}, g.difficulty))
              )
            )
            , React.createElement('div', { className: "card-desc",}, g.shortDesc)
          )
        );
      })
    )
  );
}

function LibraryPage({ onViewGame }) {
  var [cat, setCat] = useState("All");
  var [diff, setDiff] = useState("All");
  var filtered = GAMES.filter(g => (cat === "All" || g.category === cat) && (diff === "All" || g.difficulty === diff));
  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement('div', { className: "page-header",}, React.createElement('div', { className: "page-title",}, "Game Library" ), React.createElement('div', { className: "page-subtitle",}, GAMES.length, " games — tap any for full rules"       ))
      , React.createElement('div', { className: "filter-row",}, CATEGORIES.map(c => React.createElement('button', { key: c, className: `filter-btn ${cat === c ? "active" : ""}`, onClick: () => setCat(c),}, c)))
      , React.createElement('div', { className: "filter-row",}, DIFFICULTIES.map(d => React.createElement('button', { key: d, className: `filter-btn ${diff === d ? "active" : ""}`, onClick: () => setDiff(d),}, d)))
      , filtered.map(g => (
        React.createElement('div', { key: g.id, className: "card fade-in-up", onClick: () => onViewGame(g),}
          , React.createElement('div', { className: "card-header",}
            , React.createElement('div', { className: "card-icon",}, g.icon)
            , React.createElement('div', { className: "card-info",}
              , React.createElement('div', { className: "card-name",}, g.name)
              , React.createElement('div', { className: "card-meta",}, React.createElement('span', { className: "badge accent" ,}, g.category), React.createElement('span', { className: `badge ${g.difficulty === "Advanced" ? "red" : ""}`,}, g.difficulty), React.createElement('span', { className: "badge",}, "⏱ " , g.duration))
            )
          )
          , React.createElement('div', { className: "card-desc",}, g.shortDesc)
        )
      ))
    )
  );
}

function GameDetailPage({ game, onBack, onAddToProgramme }) {
  return (
    React.createElement('div', { className: "scroll-area", style: { paddingBottom: 120 },}
      , React.createElement('div', { style: { paddingTop: 52 },}, React.createElement('button', { className: "back-btn", onClick: onBack,}, React.createElement(Ms, { icon: "arrow_back", size: 18,} ), " Back" ))
      , React.createElement('div', { className: "fade-in-up", style: { textAlign: "center", padding: "24px 0" },}
        , React.createElement('div', { style: { fontSize: 56, lineHeight: 1, width: 96, height: 96, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle,rgba(232,118,63,.1),transparent 70%)", borderRadius: "50%" },}, game.icon)
        , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text)" },}, game.name)
        , React.createElement('div', { style: { display: "flex", gap: 8, justifyContent: "center", marginTop: 10, flexWrap: "wrap" },}
          , React.createElement('span', { className: "badge accent" ,}, game.category)
          , React.createElement('span', { className: `badge ${game.difficulty === "Advanced" ? "red" : ""}`,}, game.difficulty)
          , React.createElement('span', { className: "badge",}, React.createElement(Ms, { icon: "schedule", size: 11, style: { verticalAlign: "-2px", marginRight: 3 },} ), game.duration)
        )
      )
      , React.createElement('div', { className: "info-block fade-in-up",}, React.createElement('div', { className: "info-title",}, "About"), React.createElement('p', null, game.description))
      , React.createElement('div', { className: "info-block fade-in-up",}, React.createElement('div', { className: "info-title",}, "How to Play"  ), React.createElement('ul', { className: "rules-list",}, game.rules.map((r, i) => React.createElement('li', { key: i,}, r))))
      , React.createElement('div', { className: "info-block fade-in-up",}, React.createElement('div', { className: "info-title",}, "Scoring"), React.createElement('p', null, game.scoring))
      , game.tips && React.createElement('div', { className: "tip-block fade-in-up",}, React.createElement('span', { className: "tip-icon",}, "💡"), React.createElement('div', { className: "tip-text",}, React.createElement('strong', null, "Pro Tip" ), game.tips))
      , React.createElement('button', { className: "btn btn-primary btn-full"  , style: { marginTop: 8 }, onClick: () => onAddToProgramme(game),}, React.createElement(Ms, { icon: "add", size: 18,} ), "Add to Programme"   )
    )
  );
}

function ProgrammesPage({ programmes, onEdit, onDelete, onStartSession, onNew }) {
  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement('div', { className: "page-header",}, React.createElement('div', { className: "page-title",}, "Programmes"), React.createElement('div', { className: "page-subtitle",}, "Your training plans"  ))
      , React.createElement('div', { className: "section-label",}, "Planning Tips" )
      , PROGRAMME_TIPS.map((t, i) => (React.createElement('div', { key: i, className: "tip-block",}, React.createElement('span', { className: "tip-icon",}, t.icon), React.createElement('div', { className: "tip-text",}, React.createElement('strong', null, t.title), t.body))))
      , programmes.length > 0 && React.createElement('div', { className: "section-label",}, "My Programmes" )
      , programmes.length === 0 ? (
        React.createElement('div', { className: "empty-state",}, React.createElement('div', { className: "empty-icon",}, React.createElement(Ms, { icon: "calendar_today", size: 52,} )), React.createElement('div', { className: "empty-title",}, "No programmes yet"  ), React.createElement('div', { className: "empty-body",}, "Tap + to create your first training programme."       ))
      ) : programmes.map(p => {
        var mins = p.games.reduce((a, id) => { var g = GAMES.find(g => g.id === id); return a + (g ? parseInt(g.duration) : 0); }, 0);
        return (
          React.createElement('div', { key: p.id, className: "prog-card fade-in-up",}
            , React.createElement('div', { className: "prog-name",}, p.name)
            , React.createElement('div', { className: "prog-meta",}, p.games.length, " games · ~"   , mins, " min" )
            , p.description && React.createElement('div', { className: "prog-meta", style: { fontStyle: "italic", marginTop: 2 },}, p.description)
            , React.createElement('div', { className: "chip-row",}, p.games.map(id => { var g = GAMES.find(g => g.id === id); return g ? React.createElement('div', { key: id, className: "chip",}, g.icon, " " , g.name) : null; }))
            , React.createElement('div', { className: "prog-actions",}
              , React.createElement('button', { className: "btn btn-primary btn-sm"  , style: { flex: 1 }, onClick: () => onStartSession(p),}, React.createElement(Ms, { icon: "play_arrow", size: 16,} ), "Start" )
              , React.createElement('button', { className: "btn btn-secondary btn-sm"  , onClick: () => onEdit(p),}, "Edit")
              , React.createElement('button', { className: "btn btn-danger btn-sm", "aria-label": `Delete ${p.name}`, onClick: () => onDelete(p.id),}, React.createElement(Ms, { icon: "delete", size: 16,} ))
            )
          )
        );
      })
      , React.createElement('button', { className: "fab", "aria-label": "Create new programme", onClick: onNew,}, React.createElement(Ms, { icon: "add", size: 28,} ))
    )
  );
}

function ProgrammeModal({ programme, onSave, onClose }) {
  var [name, setName] = useState(_optionalChain([programme, 'optionalAccess', _5 => _5.name]) || "");
  var [desc, setDesc] = useState(_optionalChain([programme, 'optionalAccess', _6 => _6.description]) || "");
  var [selected, setSelected] = useState(_optionalChain([programme, 'optionalAccess', _7 => _7.games]) || []);
  var toggle = (id) => setSelected(p => p.includes(id) ? p.filter(g => g !== id) : [...p, id]);
  var mins = selected.reduce((a, id) => { var g = GAMES.find(g => g.id === id); return a + (g ? parseInt(g.duration) : 0); }, 0);
  var handleSave = () => {
    if (!name.trim() || selected.length === 0) return;
    onSave({ id: _optionalChain([programme, 'optionalAccess', _8 => _8.id]) || Date.now().toString(), name: name.trim(), description: desc.trim(), games: selected, createdAt: _optionalChain([programme, 'optionalAccess', _9 => _9.createdAt]) || new Date().toISOString() });
  };
  return (
    React.createElement('div', { className: "modal-overlay", onClick: onClose,}
      , React.createElement('div', { className: "modal", onClick: e => e.stopPropagation(),}
        , React.createElement('div', { className: "modal-handle",} )
        , React.createElement('div', { className: "modal-title",}, _optionalChain([programme, 'optionalAccess', _10 => _10.id]) ? "Edit Programme" : "New Programme")
        , React.createElement('div', { className: "modal-sub",}, "Pick a name and select your games. 3–5 games is a great session."            )
        , React.createElement('div', { className: "form-group",}
          , React.createElement('label', { className: "form-label",}, "Name")
          , React.createElement('input', { className: "form-input", placeholder: "e.g. Monday Finishing Focus"   , value: name, onChange: e => setName(e.target.value),} )
        )
        , React.createElement('div', { className: "form-group",}
          , React.createElement('label', { className: "form-label",}, "Description (optional)" )
          , React.createElement('input', { className: "form-input", placeholder: "e.g. Warm up then doubles practice"     , value: desc, onChange: e => setDesc(e.target.value),} )
        )
        , React.createElement('div', { className: "form-group",}
          , React.createElement('label', { className: "form-label",}, "Games " , selected.length > 0 && `— ${selected.length} selected · ~${mins} min`)
          , React.createElement('div', { className: "form-hint", style: { marginBottom: 10 },}, "Tip: start easy (warm-up), end hard (weakness)."      )
          /* Grouped games */
          , GAME_GROUPS.map(group => (
            React.createElement('div', { key: group.id,}
              , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", padding: "8px 0 4px", marginTop: 4 },}
                , group.icon, " " , group.name
              )
              , group.levels.map(level => {
                var g = GAMES.find(x => x.id === level.id);
                if (!g) return null;
                return (
                  React.createElement('div', { key: g.id, className: `picker-item ${selected.includes(g.id) ? "selected" : ""}`, onClick: () => toggle(g.id), style: { paddingLeft: 14 },}
                    , React.createElement('span', { className: "picker-icon", style: { fontSize: 14 },}, "L", g.level)
                    , React.createElement('div', { className: "picker-info",}, React.createElement('div', { className: "picker-name",}, level.label), React.createElement('div', { className: "picker-meta",}, level.sublabel, " · "  , g.duration))
                    , React.createElement('div', { className: "check-box",}, selected.includes(g.id) && React.createElement(Ms, { icon: "check", size: 14,} ))
                  )
                );
              })
            )
          ))
          /* Single games */
          , GAMES.filter(g => !GROUPED_GAME_IDS.has(g.id)).map(g => (
            React.createElement('div', { key: g.id, className: `picker-item ${selected.includes(g.id) ? "selected" : ""}`, onClick: () => toggle(g.id),}
              , React.createElement('span', { className: "picker-icon",}, g.icon)
              , React.createElement('div', { className: "picker-info",}, React.createElement('div', { className: "picker-name",}, g.name), React.createElement('div', { className: "picker-meta",}, g.category, " · "  , g.difficulty, " · "  , g.duration))
              , React.createElement('div', { className: "check-box",}, selected.includes(g.id) && React.createElement(Ms, { icon: "check", size: 14,} ))
            )
          ))
        )
        , React.createElement('div', { style: { display: "flex", gap: 10 },}
          , React.createElement('button', { className: "btn btn-secondary" , style: { flex: 1 }, onClick: onClose,}, "Cancel")
          , React.createElement('button', { className: "btn btn-primary" , style: { flex: 2 }, onClick: handleSave, disabled: !name.trim() || selected.length === 0,}, _optionalChain([programme, 'optionalAccess', _11 => _11.id]) ? "Save" : "Create")
        )
      )
    )
  );
}

// ─── GENERIC SESSION (for games without special mode) ─────────────────────────

function GenericSession({ game, onDone, onExit, sessionIdx, sessionTotal }) {
  var [score, setScore] = useState(0);
  var [notes, setNotes] = useState("");
  var qv = game.scoreType === "lower" ? [1, 3, 5, 10] : game.id === "501" ? [26, 41, 60, 100] : game.id === "high-score" ? [26, 60, 100, 140] : [10, 25, 50, 100];
  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement(SessionTopBar, { onExit: onExit, idx: sessionIdx, total: sessionTotal,} )
      , React.createElement('div', { style: { background: "linear-gradient(135deg,rgba(232,118,63,.06),rgba(168,255,120,.03))", border: "1px solid rgba(232,118,63,.25)", borderRadius: "var(--radius)", padding: 20, marginBottom: 14, textAlign: "center" },}
        , React.createElement('div', { style: { fontSize: 52, marginBottom: 10 },}, game.icon)
        , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 6 },}, game.name)
        , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginBottom: 14 },}, game.shortDesc)
        , React.createElement('div', { className: "divider",} )
        , React.createElement('ul', { className: "rules-list", style: { textAlign: "left", marginTop: 10 },}, game.rules.map((r, i) => React.createElement('li', { key: i,}, r)))
        , game.tips && React.createElement('div', { style: { marginTop: 12, padding: "10px 12px", background: "rgba(232,118,63,.06)", borderRadius: 10, border: "1px solid rgba(232,118,63,.15)", textAlign: "left" },}, React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--accent)", marginBottom: 4 },}, "💡 Tip" ), React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", lineHeight: 1.5 },}, game.tips))
      )
      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, game.scoreLabel)
        , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginBottom: 12, lineHeight: 1.5 },}, game.scoring)
        , React.createElement('div', { style: { display: "flex", gap: 10, alignItems: "center" },}
          , React.createElement('button', { className: "btn btn-secondary btn-sm"  , onClick: () => setScore(s => Math.max(0, s - 1)),}, "−")
          , React.createElement('div', { style: { flex: 1, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px", textAlign: "center", fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: "var(--accent)", letterSpacing: 2 },}, score)
          , React.createElement('button', { className: "btn btn-secondary btn-sm"  , onClick: () => setScore(s => s + 1),}, "+")
        )
        , React.createElement('div', { style: { display: "flex", gap: 6, marginTop: 10 },}
          , qv.map(v => React.createElement('button', { key: v, className: "filter-btn", style: { flex: 1, textAlign: "center" }, onClick: () => setScore(s => s + v),}, "+", v))
          , React.createElement('button', { className: "filter-btn", style: { color: "var(--accent2)" }, onClick: () => setScore(0),}, "Reset")
        )
        , React.createElement('textarea', { className: "notes-input", placeholder: "Notes...", value: notes, onChange: e => setNotes(e.target.value),} )
      )
      , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: () => onDone({ score, notes }),}
        , sessionIdx < sessionTotal - 1 ? "Log & Next" : "Finish Session"
      )
    )
  );
}

// ─── SINGLE SEGMENT MASTERY SESSION ─────────────────────────────────────────
// Targets: 13-20 then Bull, in order.
// 3 darts per visit. 2+ singles = 1 point. Need 4 points to advance.
// Doubles and trebles do NOT count. Track hit rate % and visits per number.

function SingleMasterySession({ onDone, onExit, sessionIdx, sessionTotal }) {
  var TARGETS = [13, 14, 15, 16, 17, 18, 19, 20, "Bull"];
  var POINTS_TO_ADVANCE = 4;

  var [targetIdx, setTargetIdx]         = useState(0);
  var [currentPoints, setCurrentPoints] = useState(0);
  var [singlesHit, setSinglesHit]       = useState(null);
  var [visitStreak, setVisitStreak]     = useState(0);
  var [bestStreak, setBestStreak]       = useState(0);
  var [totalVisits, setTotalVisits]     = useState(0);
  var [totalPoints, setTotalPoints]     = useState(0);
  var [visitHist, setVisitHist]         = useState([]);
  var [notes, setNotes]                 = useState("");
  var [done, setDone]                   = useState(false);

  var current = TARGETS[targetIdx];
  var isSuccess = singlesHit !== null && singlesHit >= 2;

  var confirm = () => {
    if (singlesHit === null) return;
    var success = singlesHit >= 2;
    var newPoints    = currentPoints + (success ? 1 : 0);
    var newVisits    = totalVisits + 1;
    var newTotalPts  = totalPoints + (success ? 1 : 0);
    var newStreak    = success ? visitStreak + 1 : 0;
    var newBest      = Math.max(bestStreak, newStreak);

    setTotalVisits(newVisits);
    setTotalPoints(newTotalPts);
    setVisitStreak(newStreak);
    setBestStreak(newBest);
    setVisitHist(h => [...h, { target: current, singles: singlesHit, success, points: newPoints }]);
    setSinglesHit(null);

    if (newPoints >= POINTS_TO_ADVANCE) {
      setCurrentPoints(0);
      if (targetIdx >= TARGETS.length - 1) {
        setDone(true);
      } else {
        setTargetIdx(i => i + 1);
      }
    } else {
      setCurrentPoints(newPoints);
    }
  };

  // ── Done screen ──────────────────────────────────────────────────────────
  if (done) {
    var hitRate = totalVisits > 0 ? Math.round((totalPoints / totalVisits) * 100) : 0;
    var rating = hitRate >= 80 ? "Elite Grouping ★" : hitRate >= 65 ? "Very Consistent 💪" : hitRate >= 50 ? "Solid 👍" : hitRate >= 35 ? "Developing 📈" : "Keep Practising";
    return (
      React.createElement('div', { className: "scroll-area",}
        , React.createElement('div', { style: { paddingTop: 52, textAlign: "center", paddingBottom: 20 },}
          , React.createElement('div', { style: { fontSize: 64, marginBottom: 12 },}, "🎯")
          , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--accent)", marginBottom: 4 },}, "All Targets Done!"  )
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 56, color: "var(--text)", letterSpacing: 2 },}, totalVisits)
          , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)" },}, "Total visits · "   , rating)
        )

        , React.createElement('div', { className: "stat-row",}
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val", style: { color: "var(--accent)" },}, hitRate, "%"), React.createElement('div', { className: "stat-lbl",}, "Hit Rate" ))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, totalPoints, "/", totalVisits), React.createElement('div', { className: "stat-lbl",}, "Successful"))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val", style: { color: "#f0ad4e" },}, bestStreak), React.createElement('div', { className: "stat-lbl",}, "Best Streak" ))
        )

        /* Per-number visit breakdown */
        , React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Visits per Number"  )
          , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 },}
            , visitHist.reduce((acc, v) => {
              var key = String(v.target);
              var existing = acc.find(a => a.target === key);
              if (existing) { existing.visits++; existing.successes += v.success ? 1 : 0; }
              else acc.push({ target: key, visits: 1, successes: v.success ? 1 : 0 });
              return acc;
            }, []).map((n, i) => {
              var rate = Math.round((n.successes / n.visits) * 100);
              var col = rate >= 75 ? "var(--accent)" : rate >= 50 ? "#f0ad4e" : "var(--accent2)";
              return (
                React.createElement('div', { key: i, style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px 8px", textAlign: "center" },}
                  , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text)" },}, n.target)
                  , React.createElement('div', { style: { fontSize: 12, color: col, fontWeight: 700 },}, rate, "%")
                  , React.createElement('div', { style: { fontSize: 10, color: "var(--muted)", marginTop: 2 },}, n.visits, " visit" , n.visits !== 1 ? "s" : "")
                )
              );
            })
          )
        )

        /* Visit history */
        , React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Visit Log" )
          , visitHist.slice().reverse().map((v, i) => (
            React.createElement('div', { key: i, className: "history-row",}
              , React.createElement('span', { style: { fontSize: 14 },}, v.success ? "✅" : "❌")
              , React.createElement('span', { className: "history-name",}, v.target)
              , React.createElement('span', { style: { fontSize: 12, color: "var(--muted)" },}, v.singles, "/3 singles" )
              , React.createElement('span', { className: "history-score", style: { color: v.success ? "var(--accent)" : "var(--accent2)" },}
                , v.success ? `+1 → ${v.points}` : `0 → ${v.points}`
              )
            )
          ))
        )

        , React.createElement('textarea', { className: "notes-input", placeholder: "Notes...", value: notes, onChange: e => setNotes(e.target.value),} )
        , React.createElement('button', { className: "btn btn-primary btn-full"  , style: { marginTop: 8 }, onClick: () => onDone({ score: totalVisits, notes }),}
          , sessionIdx < sessionTotal - 1 ? "Log & Next" : "Finish Session"
        )
      )
    );
  }

  // ── Main game screen ─────────────────────────────────────────────────────
  var visitHitRate = totalVisits > 0 ? Math.round((totalPoints / totalVisits) * 100) : null;
  var overallPct = Math.round((targetIdx / TARGETS.length) * 100);

  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement(SessionTopBar, { onExit: onExit, idx: sessionIdx, total: sessionTotal,} )

      /* Overall progress bar */
      , React.createElement('div', { style: { marginBottom: 14 },}
        , React.createElement('div', { style: { display: "flex", justifyContent: "space-between", marginBottom: 4 },}
          , React.createElement('span', { style: { fontSize: 11, color: "var(--muted)" },}, "Target " , targetIdx + 1, " of "  , TARGETS.length)
          , React.createElement('span', { style: { fontSize: 11, fontWeight: 700, color: "var(--accent)" },}, overallPct, "% complete" )
        )
        , React.createElement('div', { style: { height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 100, overflow: "hidden" },}
          , React.createElement('div', { style: { height: "100%", width: `${overallPct}%`, background: "linear-gradient(90deg,var(--accent),#f0a06a)", borderRadius: 100, transition: "width .5s ease" },} )
        )
        /* Target pip track */
        , React.createElement('div', { style: { display: "flex", gap: 4, marginTop: 8, justifyContent: "center" },}
          , TARGETS.map((t, i) => (
            React.createElement('div', { key: i, style: { width: i === targetIdx ? 20 : 8, height: 8, borderRadius: 100, background: i < targetIdx ? "var(--accent)" : i === targetIdx ? "var(--accent)" : "rgba(255,255,255,0.1)", transition: "all .3s", opacity: i > targetIdx ? 0.4 : 1 },} )
          ))
        )
      )

      /* Score cards */
      , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 },}
        , React.createElement('div', { style: { background: "linear-gradient(135deg,rgba(232,118,63,.08),rgba(168,255,120,.04))", border: "1px solid rgba(232,118,63,.3)", borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--accent)", marginBottom: 4 },}, "Target")
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 40, color: "var(--accent)", lineHeight: 1 },}, current)
        )
        , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}, "Points")
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 40, color: "var(--text)", lineHeight: 1 },}, currentPoints, "/", POINTS_TO_ADVANCE)
        )
        , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}
            , visitStreak > 0 ? "🔥 Streak" : "Hit Rate"
          )
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 40, color: visitStreak >= 3 ? "var(--accent)" : "var(--text)", lineHeight: 1 },}
            , visitStreak > 0 ? visitStreak : (visitHitRate !== null ? `${visitHitRate}%` : "—")
          )
        )
      )

      /* Points progress dots */
      , React.createElement('div', { style: { display: "flex", gap: 8, justifyContent: "center", marginBottom: 14 },}
        , Array.from({ length: POINTS_TO_ADVANCE }).map((_, i) => (
          React.createElement('div', { key: i, style: { width: 32, height: 32, borderRadius: "50%", background: i < currentPoints ? "var(--accent)" : "rgba(255,255,255,0.07)", border: `2px solid ${i < currentPoints ? "var(--accent)" : "rgba(255,255,255,0.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, transition: "all .25s" },}
            , i < currentPoints ? "✓" : ""
          )
        ))
      )

      /* Singles hit selector */
      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "3 darts at single "    , current, " — how many singles?"    )
        , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginBottom: 14 },}, "Doubles and trebles do NOT count."     )
        , React.createElement('div', { style: { display: "flex", gap: 10, marginBottom: 14 },}
          , [0, 1, 2, 3].map(n => {
            var success = n >= 2;
            var col = n === 0 ? "var(--accent2)" : success ? "var(--accent)" : "#f0ad4e";
            return (
              React.createElement('button', { key: n, onClick: () => setSinglesHit(n),
                style: { flex: 1, padding: "18px 0", background: singlesHit === n ? `${col}22` : "var(--surface2)", border: `2px solid ${singlesHit === n ? col : "var(--border)"}`, borderRadius: 16, fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: singlesHit === n ? col : "var(--text)", cursor: "pointer", transition: "all .15s", WebkitTapHighlightColor: "transparent" },}
                , n
              )
            );
          })
        )

        , singlesHit !== null && (
          React.createElement('div', { style: { padding: "10px 14px", borderRadius: 10, marginBottom: 12, textAlign: "center", fontSize: 14, fontWeight: 600,
            background: isSuccess ? "rgba(232,118,63,.08)" : "rgba(194,72,63,.06)",
            border: `1px solid ${isSuccess ? "rgba(232,118,63,.25)" : "rgba(194,72,63,.2)"}`,
            color: isSuccess ? "var(--accent)" : "var(--accent2)",
          },}
            , isSuccess
              ? `✅ ${singlesHit}/3 singles → +1 point (${currentPoints + 1}/${POINTS_TO_ADVANCE}${currentPoints + 1 >= POINTS_TO_ADVANCE ? " — Advance!" : ""})`
              : `❌ ${singlesHit}/3 singles — need 2+ to score`
          )
        )

        , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: confirm, disabled: singlesHit === null,}, "Confirm →"

        )
      )

      /* Recent visits */
      , visitHist.length > 0 && (
        React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Recent")
          , visitHist.slice(-4).reverse().map((v, i) => (
            React.createElement('div', { key: i, className: "history-row",}
              , React.createElement('span', { style: { fontSize: 14 },}, v.success ? "✅" : "❌")
              , React.createElement('span', { className: "history-name",}, v.target)
              , React.createElement('span', { style: { fontSize: 12, color: "var(--muted)" },}, v.singles, "/3 singles" )
              , React.createElement('span', { className: "history-score", style: { color: v.success ? "var(--accent)" : "var(--accent2)" },}
                , v.success ? `+1 → ${v.points}` : `0 → ${v.points}`
              )
            )
          ))
        )
      )
    )
  );
}

// ─── KILL THE BULL SESSION ───────────────────────────────────────────────────
// Level 1: 2 consecutive zero visits = reset to zero. Keep playing until goal.
// Level 2: 1 zero visit = reset to zero immediately.

function KillTheBullSession({ game, onDone, onExit, sessionIdx, sessionTotal }) {
  var level = game.level || 1;

  // ── Goal + time limit setup ───────────────────────────────────────────────
  var [goal, setGoal]           = useState(null);   // null = not started yet
  var [goalInput, setGoalInput] = useState("200");
  var [timeLimitMins, setTimeLimitMins] = useState(null); // null = no limit

  // ── Game state ────────────────────────────────────────────────────────────
  var [currentScore, setCurrentScore]   = useState(0);
  var [peakScore, setPeakScore]         = useState(0);
  var [visitScore, setVisitScore]       = useState(null);
  var [consecMisses, setConsecMisses]   = useState(0);
  var [hist, setHist]                   = useState([]);
  var [done, setDone]                   = useState(false);
  var [timeUp, setTimeUp]               = useState(false);
  var [notes, setNotes]                 = useState("");
  var [busts, setBusts]                 = useState(0);
  var [secondsLeft, setSecondsLeft]     = useState(null);
  var timerRef = useRef(null);

  // Start countdown when goal is set and a time limit chosen
  useEffect(() => {
    if (goal === null || !timeLimitMins) return;
    var totalSecs = timeLimitMins * 60;
    setSecondsLeft(totalSecs);
    timerRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          setTimeUp(true);
          setDone(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [goal]);

  var fmtTime = (s) => {
    if (s === null) return null;
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  // Visit score options: 0, 25, 50, 75, 100, 125, 150 (1-3 bulls per visit)
  var VISIT_OPTIONS = [0, 25, 50, 75, 100, 125, 150];

  var confirmVisit = () => {
    if (visitScore === null) return;

    var newScore = currentScore + visitScore;
    var newPeak  = Math.max(peakScore, newScore);
    setPeakScore(newPeak);

    // Check bust condition
    var busted = false;
    if (level === 1) {
      var newConsec = visitScore === 0 ? consecMisses + 1 : 0;
      setConsecMisses(newConsec);
      if (newConsec >= 2) busted = true;
    } else {
      // Level 2: any visit < 25 = instant bust
      if (visitScore < 25) busted = true;
    }

    var entry = {
      visitScore,
      scoreBefore: currentScore,
      scoreAfter: busted ? 0 : newScore,
      busted,
      peak: newPeak,
    };
    setHist(h => [...h, entry]);
    setVisitScore(null);

    if (busted) {
      setBusts(b => b + 1);
      setCurrentScore(0);
      setConsecMisses(0);
    } else {
      setCurrentScore(newScore);
      // Check goal reached
      if (goal && newScore >= goal) {
        setDone(true);
        return;
      }
    }
  };

  // ── Goal setup screen ────────────────────────────────────────────────────
  if (goal === null) {
    var suggested = level === 1 ? [150, 200, 300, 500] : [100, 150, 200, 300];
    return (
      React.createElement('div', { className: "scroll-area",}
        , React.createElement('div', { style: { paddingTop: 52 },}, React.createElement('button', { className: "back-btn", onClick: onExit,}, "✕ Exit" ))
        , React.createElement('div', { style: { textAlign: "center", padding: "24px 0 28px" },}
          , React.createElement('div', { style: { fontSize: 56, marginBottom: 10 },}, "🎯")
          , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 6 },}, "Kill the Bull — Level "
                 , level
          )
          , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)", lineHeight: 1.6, maxWidth: 300, margin: "0 auto" },}
            , level === 1
              ? "Two visits in a row without a bull = reset to zero."
              : "Any visit under 25 = instant reset to zero."
          )
        )
        , React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Set Your Goal Score"   )
          , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginBottom: 12 },}, "What score are you aiming for? The game ends when you hit it."            )
          , React.createElement('div', { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 },}
            , suggested.map(s => (
              React.createElement('button', { key: s, className: `filter-btn ${goalInput === String(s) ? "active" : ""}`,
                style: { flex: 1 }, onClick: () => setGoalInput(String(s)),}, s)
            ))
          )
          , React.createElement('input', { className: "form-input", type: "number", placeholder: "Or enter custom goal..."   , value: goalInput,
            onChange: e => setGoalInput(e.target.value), min: "50", max: "9999",
            style: { textAlign: "center", fontSize: 22, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 2, marginBottom: 14 },} )
        )
        , React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Time Limit (optional)"  )
          , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginBottom: 12 },}, "Game also ends when time runs out — or leave it off."           )
          , React.createElement('div', { style: { display: "flex", gap: 8, flexWrap: "wrap" },}
            , [null, 5, 10, 15, 20].map(t => (
              React.createElement('button', { key: String(t), className: `filter-btn ${timeLimitMins === t ? "active" : ""}`,
                style: { flex: 1 }, onClick: () => setTimeLimitMins(t),}
                , t === null ? "No limit" : `${t} min`
              )
            ))
          )
        )
        , React.createElement('button', { className: "btn btn-primary btn-full"  ,
          disabled: !goalInput || parseInt(goalInput) < 25,
          onClick: () => setGoal(parseInt(goalInput)),}, "Start Game →"

        )
      )
    );
  }

  // ── Done screen ──────────────────────────────────────────────────────────
  if (done) {
    var totalVisits = hist.length;
    var bullVisits  = hist.filter(h => h.visitScore > 0).length;
    var zeroVisits  = hist.filter(h => h.visitScore === 0).length;
    var hitRate     = totalVisits > 0 ? Math.round((bullVisits / totalVisits) * 100) : 0;
    return (
      React.createElement('div', { className: "scroll-area",}
        , React.createElement('div', { style: { paddingTop: 52, textAlign: "center", paddingBottom: 20 },}
          , React.createElement('div', { style: { fontSize: 64, marginBottom: 12 },}, "🎯")
          , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--accent)", marginBottom: 4 },}
            , timeUp ? "Time's Up!" : "Goal Reached!"
          )
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 64, color: "var(--text)", letterSpacing: 2 },}, peakScore)
          , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)" },}, "Peak score · Goal was "     , goal, timeUp ? " · Time ran out" : "")
        )
        , React.createElement('div', { className: "stat-row",}
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, totalVisits), React.createElement('div', { className: "stat-lbl",}, "Total Visits" ))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val", style: { color: "var(--accent)" },}, hitRate, "%"), React.createElement('div', { className: "stat-lbl",}, "Bull Hit Rate"  ))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val", style: { color: "var(--accent2)" },}, busts), React.createElement('div', { className: "stat-lbl",}, "Busts"))
        )
        , React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Visit History" )
          , hist.slice().reverse().map((h, i) => (
            React.createElement('div', { key: i, className: "history-row",}
              , React.createElement('span', { style: { fontSize: 14 },}, h.busted ? "💥" : h.visitScore === 0 ? "⚪" : h.visitScore >= 100 ? "🔥" : "🎯")
              , React.createElement('span', { className: "history-name",}, h.visitScore === 0 ? "Miss" : `+${h.visitScore}`)
              , React.createElement('span', { className: "history-score", style: { color: h.busted ? "var(--accent2)" : h.visitScore > 0 ? "var(--accent)" : "var(--muted)" },}
                , h.busted ? `BUST → 0` : `→ ${h.scoreAfter}`
              )
            )
          ))
        )
        , React.createElement('textarea', { className: "notes-input", placeholder: "Notes...", value: notes, onChange: e => setNotes(e.target.value),} )
        , React.createElement('button', { className: "btn btn-primary btn-full"  , style: { marginTop: 8 }, onClick: () => onDone({ score: peakScore, notes }),}
          , sessionIdx < sessionTotal - 1 ? "Log & Next" : "Finish Session"
        )
      )
    );
  }

  // ── Main game screen ─────────────────────────────────────────────────────
  var goalPct    = Math.min(100, Math.round((currentScore / goal) * 100));
  var isDanger   = level === 1 && consecMisses === 1;
  var borderCol  = isDanger ? "rgba(194,72,63,.5)" : "rgba(232,118,63,.3)";
  var timerWarning = secondsLeft !== null && secondsLeft <= 60;

  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement(SessionTopBar, { onExit: onExit, idx: sessionIdx, total: sessionTotal,} )

      /* Score + peak + goal */
      , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 },}
        , React.createElement('div', { style: { background: isDanger ? "rgba(194,72,63,.08)" : "linear-gradient(135deg,rgba(232,118,63,.08),rgba(168,255,120,.04))", border: `1px solid ${borderCol}`, borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: isDanger ? "var(--accent2)" : "var(--accent)", marginBottom: 4 },}
            , isDanger ? "⚠️ DANGER" : "Score"
          )
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 40, color: isDanger ? "var(--accent2)" : "var(--accent)", lineHeight: 1 },}, currentScore)
        )
        , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}, "Peak")
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 40, color: "var(--text)", lineHeight: 1 },}, peakScore)
        )
        , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}, "Goal")
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 40, color: "var(--text)", lineHeight: 1 },}, goal)
        )
      )

      /* Timer display */
      , secondsLeft !== null && (
        React.createElement('div', { style: { background: timerWarning ? "rgba(194,72,63,.08)" : "var(--surface)", border: `1px solid ${timerWarning ? "rgba(194,72,63,.35)" : "var(--border)"}`, borderRadius: 12, padding: "8px 14px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" },}
          , React.createElement('span', { style: { fontSize: 12, color: timerWarning ? "var(--accent2)" : "var(--muted)" },}, "⏱ Time remaining"  )
          , React.createElement('span', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: timerWarning ? "var(--accent2)" : "var(--text)", letterSpacing: 2 },}, fmtTime(secondsLeft))
        )
      )

      /* Goal progress bar */
      , React.createElement('div', { style: { marginBottom: 14 },}
        , React.createElement('div', { style: { display: "flex", justifyContent: "space-between", marginBottom: 4 },}
          , React.createElement('span', { style: { fontSize: 11, color: "var(--muted)" },}, "Progress to goal"  )
          , React.createElement('span', { style: { fontSize: 11, fontWeight: 700, color: "var(--accent)" },}, goalPct, "%")
        )
        , React.createElement('div', { style: { height: 8, background: "rgba(255,255,255,0.07)", borderRadius: 100, overflow: "hidden" },}
          , React.createElement('div', { style: { height: "100%", width: `${goalPct}%`, background: "linear-gradient(90deg,var(--accent),#f0a06a)", borderRadius: 100, transition: "width .4s ease" },} )
        )
      )

      /* L1 danger warning */
      , isDanger && (
        React.createElement('div', { style: { background: "rgba(194,72,63,.08)", border: "1px solid rgba(194,72,63,.35)", borderRadius: 12, padding: "10px 14px", marginBottom: 12, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: "var(--accent2)" },}, "⚠️ One more miss = BUST!"     )
          , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginTop: 2 },}, "Hit at least a 25 this visit to stay alive"         )
        )
      )

      /* Visit score selector */
      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "This Visit (3 darts at the bull)"      )
        , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 },}
          , VISIT_OPTIONS.map(v => {
            var col = v === 0 ? "var(--accent2)" : v >= 100 ? "var(--accent)" : "#64c8ff";
            var label = v === 0 ? "Miss" : v === 25 ? "25\n1 outer" : v === 50 ? "50\n1 inner" : v === 75 ? "75\n2 bulls" : v === 100 ? "100\n2 inner" : v === 125 ? "125\n3 bulls" : "150\n3 inner";
            return (
              React.createElement('button', { key: v, onClick: () => setVisitScore(v),
                style: { padding: "14px 4px", background: visitScore === v ? `${col}22` : "var(--surface2)", border: `2px solid ${visitScore === v ? col : "var(--border)"}`, borderRadius: 14, textAlign: "center", cursor: "pointer", WebkitTapHighlightColor: "transparent", transition: "all .15s" },}
                , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: visitScore === v ? col : "var(--text)" },}, v)
                , React.createElement('div', { style: { fontSize: 9, color: "var(--muted)", whiteSpace: "pre-line", marginTop: 2 },}, label.split("\n")[1])
              )
            );
          })
        )

        , visitScore !== null && (
          React.createElement('div', { style: { padding: "10px 14px", borderRadius: 10, marginBottom: 12, textAlign: "center", fontSize: 14, fontWeight: 600,
            background: visitScore === 0 ? "rgba(194,72,63,.08)" : "rgba(232,118,63,.06)",
            border: `1px solid ${visitScore === 0 ? "rgba(194,72,63,.25)" : "rgba(232,118,63,.2)"}`,
            color: visitScore === 0 ? "var(--accent2)" : "var(--accent)",
          },}
            , visitScore === 0
              ? level === 1
                ? consecMisses >= 1 ? "BUST — score resets to zero!" : "Miss — one more zeros and you bust"
                : "BUST — score resets to zero!"
              : `+${visitScore} → ${currentScore + visitScore}${currentScore + visitScore >= goal ? " 🎯 GOAL!" : ""}`
          )
        )

        , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: confirmVisit, disabled: visitScore === null,}, "Confirm Visit →"

        )
      )

      /* Recent visits */
      , hist.length > 0 && (
        React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Recent")
          , hist.slice(-4).reverse().map((h, i) => (
            React.createElement('div', { key: i, className: "history-row",}
              , React.createElement('span', { style: { fontSize: 14 },}, h.busted ? "💥" : h.visitScore === 0 ? "⚪" : h.visitScore >= 100 ? "🔥" : "🎯")
              , React.createElement('span', { className: "history-name",}, h.visitScore === 0 ? "Miss" : `+${h.visitScore}`)
              , React.createElement('span', { className: "history-score", style: { color: h.busted ? "var(--accent2)" : h.visitScore > 0 ? "var(--accent)" : "var(--muted)" },}
                , h.busted ? "BUST → 0" : `→ ${h.scoreAfter}`
              )
            )
          ))
        )
      )
    )
  );
}

// ─── CATCH 40 SESSION ────────────────────────────────────────────────────────
// Checkouts 61-100 in order. Max 6 darts each. Points for efficiency.
// 2 darts = 3pts, 3 darts = 2pts, 4-6 darts = 1pt. 99 exception: 3 darts = 3pts.
// Miss in 6 darts = 0pts.

function Catch40Session({ onDone, onExit, sessionIdx, sessionTotal }) {
  var SCORES = Array.from({ length: 40 }, (_, i) => i + 61); // 61–100
  var [idx, setIdx]         = useState(0);
  var [totalPoints, setTotalPoints] = useState(0);
  var [hist, setHist]       = useState([]);
  var [dartsUsed, setDartsUsed] = useState(null); // null | 2|3|4|5|6 | "miss"
  var [notes, setNotes]     = useState("");
  var [done, setDone]       = useState(false);

  var current = SCORES[idx];
  var is99    = current === 99;

  // Points for a given dart count on a given score
  var getPoints = (score, darts) => {
    if (darts === "miss") return 0;
    if (score === 99) return darts === 3 ? 3 : darts <= 6 ? 1 : 0;
    if (darts === 2) return 3;
    if (darts === 3) return 2;
    if (darts <= 6)  return 1;
    return 0;
  };

  var confirm = () => {
    if (dartsUsed === null) return;
    var pts = getPoints(current, dartsUsed);
    var entry = {
      score: current,
      darts: dartsUsed,
      pts,
      runningTotal: totalPoints + pts,
    };
    setHist(h => [...h, entry]);
    var newTotal = totalPoints + pts;
    if (idx >= SCORES.length - 1) {
      setTotalPoints(newTotal);
      setDone(true);
    } else {
      setTotalPoints(newTotal);
      setDartsUsed(null);
      setIdx(i => i + 1);
    }
  };

  if (done) {
    var hit2 = hist.filter(h => h.darts === 2).length;
    var hit3 = hist.filter(h => h.darts === 3).length;
    var hit46 = hist.filter(h => typeof h.darts === "number" && h.darts >= 4).length;
    var misses = hist.filter(h => h.darts === "miss").length;
    var rating = totalPoints >= 100 ? "Exceptional ★" : totalPoints >= 80 ? "Very Strong" : totalPoints >= 60 ? "Solid 👍" : totalPoints >= 40 ? "Developing 📈" : "Keep Practising";
    return (
      React.createElement('div', { className: "scroll-area",}
        , React.createElement('div', { style: { paddingTop: 52, textAlign: "center", paddingBottom: 20 },}
          , React.createElement('div', { style: { fontSize: 64, marginBottom: 12 },}, "🎣")
          , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--accent)", marginBottom: 4 },}, "Catch 40 Done!"  )
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 64, color: "var(--text)", letterSpacing: 2 },}, totalPoints)
          , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)" },}, "/ 120 points · "    , rating)
        )
        , React.createElement('div', { className: "stat-row",}
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val", style: { color: "var(--accent)" },}, hit2), React.createElement('div', { className: "stat-lbl",}, "2-dart (3pts)" ))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, hit3), React.createElement('div', { className: "stat-lbl",}, "3-dart (2pts)" ))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, hit46), React.createElement('div', { className: "stat-lbl",}, "4–6 dart (1pt)"  ))
        )
        , React.createElement('div', { className: "stat-row",}
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val", style: { color: "var(--accent2)" },}, misses), React.createElement('div', { className: "stat-lbl",}, "Misses (0pts)" ))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, Math.round((totalPoints / 120) * 100), "%"), React.createElement('div', { className: "stat-lbl",}, "Efficiency"))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, hit2 + hit3 + hit46), React.createElement('div', { className: "stat-lbl",}, "Checkouts Hit" ))
        )

        /* Score breakdown grid */
        , React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Breakdown — 61 to 100"    )
          , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 },}
            , hist.map((h, i) => (
              React.createElement('div', { key: i, style: { background: h.pts === 3 ? "rgba(232,118,63,.15)" : h.pts === 2 ? "rgba(100,200,255,.1)" : h.pts === 1 ? "rgba(255,152,0,.1)" : "rgba(194,72,63,.08)", border: `1px solid ${h.pts === 3 ? "rgba(232,118,63,.35)" : h.pts === 2 ? "rgba(100,200,255,.25)" : h.pts === 1 ? "rgba(255,152,0,.25)" : "rgba(194,72,63,.2)"}`, borderRadius: 10, padding: "6px 4px", textAlign: "center" },}
                , React.createElement('div', { style: { fontSize: 10, color: "var(--muted)" },}, h.score)
                , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: h.pts === 3 ? "var(--accent)" : h.pts === 2 ? "#64c8ff" : h.pts === 1 ? "#ff9800" : "var(--accent2)" },}
                  , h.pts > 0 ? `+${h.pts}` : "—"
                )
                , React.createElement('div', { style: { fontSize: 9, color: "var(--muted)" },}, h.darts === "miss" ? "miss" : `${h.darts}d`)
              )
            ))
          )
        )

        , React.createElement('textarea', { className: "notes-input", placeholder: "Notes...", value: notes, onChange: e => setNotes(e.target.value),} )
        , React.createElement('button', { className: "btn btn-primary btn-full"  , style: { marginTop: 8 }, onClick: () => onDone({ score: totalPoints, notes }),}
          , sessionIdx < sessionTotal - 1 ? "Log & Next" : "Finish Session"
        )
      )
    );
  }

  var checkout = CHECKOUT_ROUTES[current] || "—";
  var progress = Math.round((idx / SCORES.length) * 100);

  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement(SessionTopBar, { onExit: onExit, idx: sessionIdx, total: sessionTotal,} )
      , React.createElement(ProgressBar, { current: idx, total: SCORES.length, label: "Catch 40" ,} )

      /* Score + target */
      , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 },}
        , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}, "Points")
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, color: "var(--text)" },}, totalPoints)
        )
        , React.createElement('div', { style: { background: "linear-gradient(135deg,rgba(232,118,63,.08),rgba(168,255,120,.04))", border: "1px solid rgba(232,118,63,.3)", borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--accent)", marginBottom: 4 },}, "Checkout")
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 44, color: "var(--accent)", letterSpacing: 2 },}, current)
        )
        , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}, "Left")
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, color: "var(--muted)" },}, SCORES.length - idx)
        )
      )

      /* Checkout route hint */
      , checkout !== "—" && (
        React.createElement('div', { style: { background: "rgba(232,118,63,.06)", border: "1px solid rgba(232,118,63,.2)", borderRadius: 12, padding: "8px 14px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" },}
          , React.createElement('span', { style: { fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: 1 },}, "💡 ROUTE" )
          , React.createElement('span', { style: { fontSize: 14, fontWeight: 700, color: "var(--text)" },}, checkout)
        )
      )

      /* Dart selector */
      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "How did you finish "
              , current, "?"
          , is99 && React.createElement('span', { style: { fontSize: 11, color: "var(--accent)", marginLeft: 8 },}, "99 = 3-dart min → 3pts"     )
        )

        /* Points guide */
        , React.createElement('div', { style: { display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" },}
          , [
            { label: "2 darts", pts: is99 ? "—" : "3 pts", darts: 2, color: "var(--accent)", disabled: is99 },
            { label: "3 darts", pts: is99 ? "3 pts" : "2 pts", darts: 3, color: is99 ? "var(--accent)" : "#64c8ff", disabled: false },
            { label: "4–6 darts", pts: "1 pt",  darts: 4, color: "#ff9800", disabled: false },
            { label: "Miss (6+)", pts: "0 pts", darts: "miss", color: "var(--accent2)", disabled: false },
          ].map(opt => (
            React.createElement('button', { key: opt.darts, onClick: () => !opt.disabled && setDartsUsed(opt.darts),
              disabled: opt.disabled,
              style: { flex: 1, minWidth: 70, padding: "14px 8px", background: dartsUsed === opt.darts ? `${opt.color}22` : "var(--surface2)", border: `2px solid ${dartsUsed === opt.darts ? opt.color : "var(--border)"}`, borderRadius: 14, textAlign: "center", cursor: opt.disabled ? "not-allowed" : "pointer", opacity: opt.disabled ? 0.35 : 1, WebkitTapHighlightColor: "transparent", transition: "all .15s" },}
              , React.createElement('div', { style: { fontSize: 12, fontWeight: 700, color: dartsUsed === opt.darts ? opt.color : "var(--text)" },}, opt.label)
              , React.createElement('div', { style: { fontSize: 16, fontWeight: 700, color: dartsUsed === opt.darts ? opt.color : "var(--muted)", marginTop: 4 },}, opt.pts)
            )
          ))
        )

        , dartsUsed !== null && (
          React.createElement('div', { style: { padding: "10px 14px", borderRadius: 10, background: dartsUsed === "miss" ? "rgba(194,72,63,.06)" : "rgba(232,118,63,.06)", border: `1px solid ${dartsUsed === "miss" ? "rgba(194,72,63,.2)" : "rgba(232,118,63,.2)"}`, textAlign: "center", fontSize: 14, fontWeight: 600, color: dartsUsed === "miss" ? "var(--accent2)" : "var(--accent)", marginBottom: 12 },}
            , dartsUsed === "miss" ? `Missed ${current} — 0 points` : `${current} in ${dartsUsed === 4 ? "4–6" : dartsUsed} darts → +${getPoints(current, dartsUsed)} point${getPoints(current, dartsUsed) !== 1 ? "s" : ""}`
          )
        )

        , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: confirm, disabled: dartsUsed === null,}, "Confirm & Next →"

        )
      )

      /* Recent */
      , hist.length > 0 && (
        React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Recent")
          , hist.slice(-4).reverse().map((h, i) => (
            React.createElement('div', { key: i, className: "history-row",}
              , React.createElement('span', { style: { fontSize: 14, minWidth: 32 },}, h.pts > 0 ? (h.pts === 3 ? "🟡" : h.pts === 2 ? "🔵" : "🟠") : "❌")
              , React.createElement('span', { className: "history-name",}, h.score)
              , React.createElement('span', { style: { fontSize: 12, color: "var(--muted)" },}, h.darts === "miss" ? "miss" : `${h.darts}d`)
              , React.createElement('span', { className: "history-score", style: { color: h.pts > 0 ? "var(--accent)" : "var(--accent2)" },}
                , h.pts > 0 ? `+${h.pts}` : "—", " → "  , h.runningTotal
              )
            )
          ))
        )
      )
    )
  );
}

// ─── JDC CHALLENGE SESSION ────────────────────────────────────────────────────

function JDCSession({ onDone, onExit, sessionIdx, sessionTotal }) {
  // Game structure:
  // Section 1: Shanghai on 10-15 (6 numbers, 3 darts each)
  // Section 2: One dart at D1-D20 then Bull (21 throws)
  // Section 3: Shanghai on 15-20 (6 numbers, 3 darts each)

  var SEC1_NUMS = [10, 11, 12, 13, 14, 15];
  var SEC2_TARGETS = [...Array(20).keys()].map(i => i + 1); // 1-20 for doubles, then bull
  var SEC3_NUMS = [15, 16, 17, 18, 19, 20];

  // section: "s1" | "s2" | "s3" | "done"
  var [section, setSection] = useState("s1");
  var [stepIdx, setStepIdx] = useState(0);
  var [totalScore, setTotalScore] = useState(0);
  var [sectionScore, setSectionScore] = useState(0);
  var [hist, setHist] = useState([]);
  var [notes, setNotes] = useState("");

  // Shanghai section state — which segments hit this visit
  var [hitSingle, setHitSingle] = useState(false);
  var [hitDouble, setHitDouble] = useState(false);
  var [hitTreble, setHitTreble] = useState(false);

  // Doubles section state — did they hit?
  var [doubleHit, setDoubleHit] = useState(null); // null | true | false

  var isShanghai = hitSingle && hitDouble && hitTreble;

  // Current target info
  var currentNum   = section === "s1" ? SEC1_NUMS[stepIdx] : section === "s3" ? SEC3_NUMS[stepIdx] : null;
  var currentDbl   = section === "s2" ? (stepIdx < 20 ? SEC2_TARGETS[stepIdx] : "Bull") : null;
  var totalSteps   = section === "s1" ? SEC1_NUMS.length : section === "s2" ? 21 : SEC3_NUMS.length;

  // Score for current Shanghai visit
  var visitScore = (hitSingle ? currentNum : 0) + (hitDouble ? currentNum * 2 : 0) + (hitTreble ? currentNum * 3 : 0);
  var shanghaiBonus = isShanghai ? 100 : 0;
  var thisVisitTotal = visitScore + shanghaiBonus;

  var confirmShanghai = () => {
    if (!hitSingle && !hitDouble && !hitTreble) return; // must select at least miss
    var earned = thisVisitTotal;
    var entry = {
      section: section === "s1" ? "S1" : "S3",
      target: currentNum,
      hitS: hitSingle, hitD: hitDouble, hitT: hitTreble,
      shanghai: isShanghai,
      earned,
      runningTotal: totalScore + sectionScore + earned,
    };
    setHist(h => [...h, entry]);
    var newSectionScore = sectionScore + earned;

    var isLastStep = stepIdx >= totalSteps - 1;
    if (isLastStep) {
      var newTotal = totalScore + newSectionScore;
      setTotalScore(newTotal);
      setSectionScore(0);
      setHitSingle(false); setHitDouble(false); setHitTreble(false);
      setStepIdx(0);
      setSection(section === "s1" ? "s2" : "done");
    } else {
      setSectionScore(newSectionScore);
      setHitSingle(false); setHitDouble(false); setHitTreble(false);
      setStepIdx(i => i + 1);
    }
  };

  var confirmMiss = () => {
    var entry = {
      section: section === "s1" ? "S1" : "S3",
      target: currentNum,
      hitS: false, hitD: false, hitT: false,
      shanghai: false, earned: 0,
      runningTotal: totalScore + sectionScore,
    };
    setHist(h => [...h, entry]);
    var isLastStep = stepIdx >= totalSteps - 1;
    if (isLastStep) {
      var newTotal = totalScore + sectionScore;
      setTotalScore(newTotal);
      setSectionScore(0);
      setHitSingle(false); setHitDouble(false); setHitTreble(false);
      setStepIdx(0);
      setSection(section === "s1" ? "s2" : "done");
    } else {
      setHitSingle(false); setHitDouble(false); setHitTreble(false);
      setStepIdx(i => i + 1);
    }
  };

  var confirmDouble = () => {
    if (doubleHit === null) return;
    var pts = doubleHit ? (currentDbl === "Bull" ? 100 : 50) : 0;
    var entry = {
      section: "S2",
      target: currentDbl === "Bull" ? "Bull" : `D${currentDbl}`,
      hit: doubleHit, earned: pts,
      runningTotal: totalScore + sectionScore + pts,
    };
    setHist(h => [...h, entry]);
    var newSectionScore = sectionScore + pts;
    var isLastStep = stepIdx >= 20; // 21 total (0-19 = D1-D20, 20 = Bull)
    if (isLastStep) {
      var newTotal = totalScore + newSectionScore;
      setTotalScore(newTotal);
      setSectionScore(0);
      setDoubleHit(null);
      setStepIdx(0);
      setSection("s3");
    } else {
      setSectionScore(newSectionScore);
      setDoubleHit(null);
      setStepIdx(i => i + 1);
    }
  };

  // ── Result screen ─────────────────────────────────────────────────────────
  if (section === "done") {
    var s1Hist = hist.filter(h => h.section === "S1");
    var s2Hist = hist.filter(h => h.section === "S2");
    var s3Hist = hist.filter(h => h.section === "S3");
    var s1Score = s1Hist.reduce((a, h) => a + h.earned, 0);
    var s2Score = s2Hist.reduce((a, h) => a + h.earned, 0);
    var s3Score = s3Hist.reduce((a, h) => a + h.earned, 0);
    var shanghaiBonuses = hist.filter(h => h.shanghai).length;
    var doublesHit = s2Hist.filter(h => h.hit).length;
    return (
      React.createElement('div', { className: "scroll-area",}
        , React.createElement('div', { style: { paddingTop: 52, textAlign: "center", paddingBottom: 20 },}
          , React.createElement('div', { style: { fontSize: 64, marginBottom: 12 },}, "🏆")
          , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--accent)", marginBottom: 4 },}, "JDC Complete!" )
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 56, color: "var(--text)", letterSpacing: 2 },}, totalScore)
          , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)" },}, "Total Score" )
        )

        /* Section breakdown */
        , React.createElement('div', { className: "stat-row",}
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, s1Score), React.createElement('div', { className: "stat-lbl",}, "Section 1" ))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, s2Score), React.createElement('div', { className: "stat-lbl",}, "Doubles"))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, s3Score), React.createElement('div', { className: "stat-lbl",}, "Section 3" ))
        )
        , React.createElement('div', { className: "stat-row",}
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, shanghaiBonuses), React.createElement('div', { className: "stat-lbl",}, "Shanghais 🎯" ))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, doublesHit, "/21"), React.createElement('div', { className: "stat-lbl",}, "Doubles Hit" ))
          , React.createElement('div', { className: "stat-box",}
            , React.createElement('div', { className: "stat-val",}, totalScore >= 1600 ? "★" : totalScore >= 1200 ? "💪" : totalScore >= 800 ? "👍" : "📈")
            , React.createElement('div', { className: "stat-lbl",}, totalScore >= 1600 ? "Exceptional" : totalScore >= 1200 ? "Very Strong" : totalScore >= 800 ? "Solid" : "Keep Going")
          )
        )

        /* Full breakdown */
        , React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Full Breakdown" )
          , hist.map((h, i) => (
            React.createElement('div', { key: i, className: "history-row",}
              , React.createElement('span', { style: { fontSize: 13, minWidth: 40, color: "var(--muted)" },}, h.section)
              , React.createElement('span', { className: "history-name", style: { fontSize: 13 },}
                , h.section === "S2"
                  ? h.target
                  : `${h.target} — ${[h.hitS && "S", h.hitD && "D", h.hitT && "T"].filter(Boolean).join("+") || "Miss"}${h.shanghai ? " 🎯" : ""}`
              )
              , React.createElement('span', { className: "history-score", style: { color: h.earned > 0 ? "var(--accent)" : "var(--muted)" },}
                , h.earned > 0 ? `+${h.earned}` : "—", " → "  , h.runningTotal
              )
            )
          ))
        )

        , React.createElement('textarea', { className: "notes-input", placeholder: "Notes...", value: notes, onChange: e => setNotes(e.target.value),} )
        , React.createElement('button', { className: "btn btn-primary btn-full"  , style: { marginTop: 8 }, onClick: () => onDone({ score: totalScore, notes }),}
          , sessionIdx < sessionTotal - 1 ? "Log & Next" : "Finish Session"
        )
      )
    );
  }

  var runningTotal = totalScore + sectionScore;

  // ── Shanghai section (s1 or s3) ───────────────────────────────────────────
  if (section === "s1" || section === "s3") {
    var sectionLabel = section === "s1" ? "Section 1 — Numbers 10–15" : "Section 3 — Numbers 15–20";
    var sectionColor = section === "s1" ? "rgba(232,118,63,.25)" : "rgba(168,85,247,.3)";
    var sectionBg    = section === "s1" ? "rgba(232,118,63,.06)" : "rgba(168,85,247,.06)";
    var sectionAccent = section === "s1" ? "var(--accent)" : "rgb(168,85,247)";

    return (
      React.createElement('div', { className: "scroll-area",}
        , React.createElement(SessionTopBar, { onExit: onExit, idx: sessionIdx, total: sessionTotal,} )
        , React.createElement(ProgressBar, { current: stepIdx, total: totalSteps, label: sectionLabel,} )

        /* Score + target */
        , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 },}
          , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
            , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}, "Total")
            , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: "var(--text)" },}, runningTotal)
          )
          , React.createElement('div', { style: { background: sectionBg, border: `1px solid ${sectionColor}`, borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
            , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: sectionAccent, marginBottom: 4 },}, "Target")
            , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 44, color: sectionAccent, letterSpacing: 2 },}, currentNum)
          )
          , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
            , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}, "This Visit" )
            , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: isShanghai ? "var(--accent)" : "var(--text)" },}
              , thisVisitTotal > 0 ? `+${thisVisitTotal}` : "0"
            )
          )
        )

        /* Shanghai hit tracking */
        , React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "3 Darts at "   , currentNum, " — Which did you hit?"     )
          , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 },}
            , [
              { label: "Single", key: "S", hit: hitSingle, set: setHitSingle, pts: currentNum, color: "rgba(100,200,255,.3)", accent: "#64c8ff" },
              { label: "Double", key: "D", hit: hitDouble, set: setHitDouble, pts: currentNum * 2, color: "rgba(232,118,63,.3)", accent: "var(--accent)" },
              { label: "Treble", key: "T", hit: hitTreble, set: setHitTreble, pts: currentNum * 3, color: "rgba(255,100,100,.3)", accent: "var(--accent2)" },
            ].map(({ label, hit, set, pts, color, accent }) => (
              React.createElement('button', { key: label, onClick: () => set(v => !v),
                style: { background: hit ? color : "var(--surface2)", border: `2px solid ${hit ? accent : "var(--border)"}`, borderRadius: 16, padding: "16px 8px", cursor: "pointer", textAlign: "center", WebkitTapHighlightColor: "transparent", transition: "all .15s" },}
                , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: hit ? accent : "var(--muted)" },}, label)
                , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: hit ? accent : "var(--muted)", marginTop: 4 },}, "+", pts)
                , React.createElement('div', { style: { fontSize: 20, marginTop: 4 },}, hit ? "✓" : "○")
              )
            ))
          )

          , isShanghai && (
            React.createElement('div', { style: { background: "linear-gradient(135deg,rgba(232,118,63,.15),rgba(168,255,120,.08))", border: "1px solid rgba(232,118,63,.5)", borderRadius: 12, padding: "12px 16px", marginBottom: 12, textAlign: "center" },}
              , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: "var(--accent)", letterSpacing: 2 },}, "🎯 SHANGHAI! +100 Bonus"   )
              , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)", marginTop: 2 },}, "Scored " , visitScore, " + 100 bonus = "     , thisVisitTotal, " pts" )
            )
          )

          , !isShanghai && (hitSingle || hitDouble || hitTreble) && (
            React.createElement('div', { style: { background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px 14px", marginBottom: 12, textAlign: "center", fontSize: 13, color: "var(--muted)" },}, "Scored: "
               , visitScore, " pts — hit Shanghai for +100 bonus"
            )
          )

          , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },}
            , React.createElement('button', { className: "btn btn-secondary" , onClick: confirmMiss,}, "Miss (0 pts)"

            )
            , React.createElement('button', { className: "btn btn-primary" , onClick: confirmShanghai, disabled: !hitSingle && !hitDouble && !hitTreble,}, "Confirm → +"
                , thisVisitTotal
            )
          )
        )

        , hist.length > 0 && (
          React.createElement('div', { className: "info-block",}
            , React.createElement('div', { className: "info-title",}, "Recent")
            , hist.slice(-4).reverse().map((h, i) => (
              React.createElement('div', { key: i, className: "history-row",}
                , React.createElement('span', { style: { fontSize: 13, color: "var(--muted)", minWidth: 24 },}, h.target)
                , React.createElement('span', { className: "history-name",}
                  , h.section === "S2" ? h.target : [h.hitS && "S", h.hitD && "D", h.hitT && "T"].filter(Boolean).join("+") || "Miss"
                  , h.shanghai && " 🎯"
                )
                , React.createElement('span', { className: "history-score", style: { color: h.earned > 0 ? "var(--accent)" : "var(--muted)" },}
                  , h.earned > 0 ? `+${h.earned}` : "—", " → "  , h.runningTotal
                )
              )
            ))
          )
        )
      )
    );
  }

  // ── Doubles section (s2) ─────────────────────────────────────────────────
  var isBull = stepIdx === 20;
  var dblLabel = isBull ? "Bull" : `D${SEC2_TARGETS[stepIdx]}`;
  var dblPts   = isBull ? 100 : 50;

  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement(SessionTopBar, { onExit: onExit, idx: sessionIdx, total: sessionTotal,} )
      , React.createElement(ProgressBar, { current: stepIdx, total: 21, label: "Section 2 — Doubles + Bull"     ,} )

      , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 },}
        , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}, "Running Total" )
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, color: "var(--text)" },}, runningTotal)
        )
        , React.createElement('div', { style: { background: "linear-gradient(135deg,rgba(255,100,100,.08),rgba(194,72,63,.04))", border: "1px solid rgba(255,100,100,.3)", borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--accent2)", marginBottom: 4 },}, "Target")
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 44, color: "var(--accent2)", letterSpacing: 2 },}, dblLabel)
        )
      )

      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "One dart at "   , dblLabel, " — "  , dblPts, " pts if hit"   )
        , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 },}
          , React.createElement('button', { onClick: () => setDoubleHit(true),
            style: { padding: "24px 0", background: doubleHit === true ? "rgba(232,118,63,.15)" : "var(--surface2)", border: `2px solid ${doubleHit === true ? "var(--accent)" : "var(--border)"}`, borderRadius: 18, fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: doubleHit === true ? "var(--accent)" : "var(--muted)", cursor: "pointer", WebkitTapHighlightColor: "transparent", transition: "all .15s" },}, "✓ Hit"
             , React.createElement('br', null)
            , React.createElement('span', { style: { fontSize: 32, letterSpacing: 1 },}, "+", dblPts)
          )
          , React.createElement('button', { onClick: () => setDoubleHit(false),
            style: { padding: "24px 0", background: doubleHit === false ? "rgba(194,72,63,.12)" : "var(--surface2)", border: `2px solid ${doubleHit === false ? "var(--accent2)" : "var(--border)"}`, borderRadius: 18, fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: doubleHit === false ? "var(--accent2)" : "var(--muted)", cursor: "pointer", WebkitTapHighlightColor: "transparent", transition: "all .15s" },}, "✗ Miss"
             , React.createElement('br', null)
            , React.createElement('span', { style: { fontSize: 32 },}, "0")
          )
        )

        , doubleHit !== null && (
          React.createElement('div', { style: { padding: "10px 14px", borderRadius: 10, background: doubleHit ? "rgba(232,118,63,.06)" : "rgba(194,72,63,.06)", border: `1px solid ${doubleHit ? "rgba(232,118,63,.25)" : "rgba(194,72,63,.25)"}`, textAlign: "center", fontSize: 14, fontWeight: 600, color: doubleHit ? "var(--accent)" : "var(--accent2)", marginBottom: 12 },}
            , doubleHit ? `Hit! ${dblLabel} = +${dblPts} pts` : `Miss — no points for ${dblLabel}`
          )
        )

        , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: confirmDouble, disabled: doubleHit === null,}, "Confirm & Next →"

        )
      )

      /* Progress through doubles */
      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Doubles progress ("  , stepIdx, "/21)")
        , React.createElement('div', { style: { display: "flex", flexWrap: "wrap", gap: 6 },}
          , [...Array(21)].map((_, i) => {
            var label = i === 20 ? "B" : `${i + 1}`;
            var done  = i < stepIdx;
            var h     = hist.find(x => x.section === "S2" && x.target === (i === 20 ? "Bull" : `D${i + 1}`));
            return (
              React.createElement('div', { key: i, style: { width: 34, height: 34, borderRadius: 8, background: done ? (_optionalChain([h, 'optionalAccess', _12 => _12.hit]) ? "rgba(232,118,63,.2)" : "rgba(194,72,63,.12)") : i === stepIdx ? "var(--surface2)" : "var(--surface)", border: `1px solid ${done ? (_optionalChain([h, 'optionalAccess', _13 => _13.hit]) ? "rgba(232,118,63,.4)" : "rgba(194,72,63,.3)") : i === stepIdx ? "var(--accent)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: done ? (_optionalChain([h, 'optionalAccess', _14 => _14.hit]) ? "var(--accent)" : "var(--accent2)") : i === stepIdx ? "var(--accent)" : "var(--muted)" },}
                , label
              )
            );
          })
        )
      )
    )
  );
}

async function getMatchInsight(matchData) {
  var { type, playerWon, playerAvg, botAvg, botName, botLevel,
          playerLegs, botLegs, playerDartsAtDouble, playerDoublesHit,
          p1Name, p2Name, p1Avg, p2Avg, p1Legs, p2Legs,
          p1DartsAtDouble, p1DoublesHit, p2DartsAtDouble, p2DoublesHit } = matchData;

  var prompt = "";
  if (type === "bot") {
    var doublesStr = playerDartsAtDouble > 0
      ? `Doubles: ${playerDoublesHit}/${playerDartsAtDouble} converted (${Math.round(playerDoublesHit/playerDartsAtDouble*100)}%)`
      : "No doubles data recorded";
    prompt = `A darts player just finished a match against a bot. Data:
Result: ${playerWon ? "Player WON" : "Player LOST"}
Score: ${playerLegs}–${botLegs} legs
Player average: ${playerAvg}
Bot average: ${botAvg} (${botName}, Level ${botLevel}/10)
${doublesStr}
Give ONE specific, actionable coaching insight. Mention their average, doubles rate, or suggest a next step. 2-3 sentences max. No preamble, no sign-off.`;
  } else {
    var p1Dbl = p1DartsAtDouble > 0 ? `${Math.round(p1DoublesHit/p1DartsAtDouble*100)}%` : "not recorded";
    var p2Dbl = p2DartsAtDouble > 0 ? `${Math.round(p2DoublesHit/p2DartsAtDouble*100)}%` : "not recorded";
    prompt = `Two darts players just finished a friendly match. Data:
${p1Name}: ${p1Legs} legs, ${p1Avg} average, doubles ${p1Dbl}
${p2Name}: ${p2Legs} legs, ${p2Avg} average, doubles ${p2Dbl}
Winner: ${p1Legs > p2Legs ? p1Name : p2Name}
Give ONE coaching insight comparing both players — what decided the match and what the loser should work on. 2-3 sentences max. No preamble, no sign-off.`;
  }

  try {
    var { data, error } = await supabase.functions.invoke("claude-proxy", {
      body: { model: "claude-haiku-4-5-20251001", max_tokens: 150, messages: [{ role: "user", content: prompt }] },
    });
    if (error) return null;
    return _optionalChain([data, 'access', _15 => _15.content, 'optionalAccess', _16 => _16[0], 'optionalAccess', _17 => _17.text, 'optionalAccess', _18 => _18.trim, 'call', _19 => _19()]) || null;
  } catch (e4) { return null; }
}

// ─── MAIN SESSION ORCHESTRATOR ────────────────────────────────────────────────

// ─── PROACTIVE AI COACHING ───────────────────────────────────────────────────
// Fires automatically after every session. Analyses recent data and returns
// one specific, actionable insight. Fails silently if no API credits.

// Game score context for AI coaching — what each score means
var GAME_SCORE_CONTEXT = {
  "Bob's 27":              { unit: "pts", lower: 50, mid: 100, high: 150, note: "start 27pts, hit doubles to score" },
  "High Score":            { unit: "pts", lower: 100, mid: 180, high: 270, note: "9 darts, max 540" },
  "Doubles Practice":      { unit: "hits", lower: 15, mid: 30, high: 45, note: "out of 63 doubles" },
  "Catch 40":              { unit: "pts", lower: 40, mid: 70, high: 100, note: "max 120, checkouts 61-100" },
  "JDC Challenge":         { unit: "pts", lower: 400, mid: 800, high: 1200, note: "Shanghai 10-15, doubles, Shanghai 15-20" },
  "Priestley's Triples":   { unit: "pts", lower: 25, mid: 50, high: 75, note: "max 99, numbers 10-20" },
  "Checkout Pyramid":      { unit: "hits", lower: 3, mid: 6, high: 8, note: "out of 9 checkouts" },
  "Street 82":             { unit: "hits", lower: 25, mid: 41, high: 60, note: "out of 82 targets, random order" },
  "Kill the Bull — Level 1": { unit: "pts", lower: 100, mid: 200, high: 400, note: "bull scoring game" },
  "Kill the Bull — Level 2": { unit: "pts", lower: 75, mid: 150, high: 300, note: "strict bull game" },
  "Single Segment Mastery":  { unit: "visits", lower: 50, mid: 36, high: 25, note: "lower visits = better grouping" },
};

async function getProactiveInsight(sessionGames, history) {
  var recent = history.slice(-5);

  // Build per-game history with trend
  var gameHistory = {};
  recent.forEach(session => {
    (session.games || []).forEach(g => {
      if (!gameHistory[g.name]) gameHistory[g.name] = [];
      gameHistory[g.name].push(g.score);
    });
  });

  // This session with context
  var thisSession = sessionGames.map(g => {
    var ctx = GAME_SCORE_CONTEXT[g.name];
    if (ctx) {
      var level = g.score >= ctx.high ? "strong" : g.score >= ctx.mid ? "solid" : "developing";
      return `${g.name}: ${g.score} ${ctx.unit} (${level} — ${ctx.note})`;
    }
    return `${g.name}: ${g.score}`;
  }).join("\n");

  // Trend lines
  var trends = Object.entries(gameHistory).map(([name, scores]) => {
    if (scores.length < 2) return `${name}: ${scores[0]} (1 session)`;
    var avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
    var trend = scores[scores.length - 1] > scores[0] ? "↑ improving" : scores[scores.length - 1] < scores[0] ? "↓ declining" : "→ flat";
    return `${name}: avg ${avg} over ${scores.length} sessions, ${trend}`;
  }).join("\n");

  var prompt = `A darts player just completed a training session. Here is their data:

THIS SESSION:
${thisSession}

RECENT FORM (last ${recent.length} sessions):
${trends || "First session — no history yet."}

Give ONE specific, actionable coaching insight. Focus on the most meaningful pattern — a drop in performance, a breakthrough, or the area that would most improve their game. Be direct, specific to the games they played, and practical. 2-3 sentences max. No preamble, no sign-off.`;

  var { data, error } = await supabase.functions.invoke("claude-proxy", {
    body: { model: "claude-haiku-4-5-20251001", max_tokens: 150, messages: [{ role: "user", content: prompt }] },
  });

  if (error) return null;
  return _optionalChain([data, 'access', _20 => _20.content, 'optionalAccess', _21 => _21[0], 'optionalAccess', _22 => _22.text, 'optionalAccess', _23 => _23.trim, 'call', _24 => _24()]) || null;
}


// ─── SHAREABLE RESULTS CARDS ──────────────────────────────────────────────────
// Uses HTML Canvas to render a PNG, then Web Share API (or download fallback).

// Polyfill for ctx.roundRect — not supported on Safari < 15.4 / older Android
function patchRoundRect(ctx) {
  if (typeof ctx.roundRect === "function") return; // already supported
  ctx.roundRect = function(x, y, w, h, r) {
    var radius = typeof r === "number" ? r : (Array.isArray(r) ? r[0] : 0);
    var rr = Math.min(radius, Math.min(w, h) / 2);
    this.moveTo(x + rr, y);
    this.lineTo(x + w - rr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + rr);
    this.lineTo(x + w, y + h - rr);
    this.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    this.lineTo(x + rr, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - rr);
    this.lineTo(x, y + rr);
    this.quadraticCurveTo(x, y, x + rr, y);
    this.closePath();
  };
}

// ─── HAPTIC FEEDBACK ─────────────────────────────────────────────────────────
// Short tap for hits, double pulse for misses.
// Silently ignored on browsers that don't support vibration (iOS Safari).
function haptic(type = "hit") {
  if (!navigator.vibrate) return;
  if (type === "hit")   navigator.vibrate(35);
  else if (type === "miss") navigator.vibrate([20, 60, 20]);
  else if (type === "success") navigator.vibrate([30, 50, 60]);
  else if (type === "error") navigator.vibrate([50, 40, 50, 40, 80]);
}

async function shareCanvas(canvas, filename) {
  canvas.toBlob(async (blob) => {
    if (!blob) return;
    var file = new File([blob], filename, { type: "image/png" });
    if (navigator.share && _optionalChain([navigator, 'access', _25 => _25.canShare, 'optionalCall', _26 => _26({ files: [file] })])) {
      try {
        await navigator.share({ files: [file], title: "Darts IQ", text: "Check out my Darts IQ score! 🎯" });
        return;
      } catch (e5) {}
    }
    // Fallback — download
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }, "image/png");
}

// ── Session Result Card ───────────────────────────────────────────────────────
function ShareSessionCard({ results, programmeName, hasPBs, sessionPBs }) {
  var [sharing, setSharing] = useState(false);

  var handleShare = async () => {
    setSharing(true);
    var canvas = document.createElement("canvas");
    canvas.width = 900; canvas.height = 500;
    var ctx = canvas.getContext("2d");
    patchRoundRect(ctx);

    // Background
    ctx.fillStyle = "var(--on-accent)";
    ctx.fillRect(0, 0, 900, 500);

    // Accent border top
    var grad = ctx.createLinearGradient(0, 0, 900, 0);
    grad.addColorStop(0, "#e8763f"); grad.addColorStop(1, "#f0a06a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 900, 4);

    // Logo area — left column
    ctx.fillStyle = "#e8763f";
    ctx.font = "bold 13px sans-serif";
    ctx.letterSpacing = "3px";
    ctx.fillText("DARTS IQ", 48, 52);

    // Dart icon (simplified SVG path as text)
    ctx.fillStyle = "rgba(232,118,63,0.15)";
    ctx.beginPath(); ctx.arc(62, 100, 38, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#e8763f";
    ctx.font = "bold 48px sans-serif";
    ctx.fillText("🎯", 42, 120);

    // Session name
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "13px sans-serif";
    ctx.fillText(programmeName.toUpperCase(), 48, 165);

    // Date
    var dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = "11px sans-serif";
    ctx.fillText(dateStr, 48, 185);

    // Divider
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(200, 24); ctx.lineTo(200, 476); ctx.stroke();

    // Game results — right side
    var startX = 228, startY = 48;
    var colW = 332, rowH = 72;
    var cols = 2;

    // PB banner
    if (hasPBs) {
      ctx.fillStyle = "rgba(232,118,63,0.1)";
      ctx.beginPath(); ctx.roundRect(startX, 24, 648, 36, 8); ctx.fill();
      ctx.fillStyle = "#e8763f";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(`🏆  ${sessionPBs.length} NEW PERSONAL BEST${sessionPBs.length > 1 ? "S" : ""} THIS SESSION`, startX + 16, 47);
    }

    results.slice(0, 6).forEach((r, i) => {
      var col = i % cols;
      var row = Math.floor(i / cols);
      var x = startX + col * colW;
      var y = (hasPBs ? 74 : startY) + row * rowH;
      var isPB = _optionalChain([sessionPBs, 'optionalAccess', _27 => _27.find, 'call', _28 => _28(p => p.name === r.name)]);

      // Card bg
      ctx.fillStyle = isPB ? "rgba(232,118,63,0.07)" : "rgba(255,255,255,0.04)";
      ctx.beginPath(); ctx.roundRect(x, y, colW - 12, rowH - 8, 10); ctx.fill();
      if (isPB) {
        ctx.strokeStyle = "rgba(232,118,63,0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect(x, y, colW - 12, rowH - 8, 10); ctx.stroke();
      }

      // Game name
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.font = "11px sans-serif";
      var gameName = r.name.length > 22 ? r.name.substring(0, 21) + "…" : r.name;
      ctx.fillText(gameName, x + 12, y + 22);

      // Score
      ctx.fillStyle = isPB ? "#e8763f" : "#f0f0f8";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText(r.score.toString(), x + 12, y + 54);

      // PB badge
      if (isPB) {
        ctx.fillStyle = "rgba(232,118,63,0.2)";
        ctx.beginPath(); ctx.roundRect(x + colW - 52, y + 36, 32, 18, 4); ctx.fill();
        ctx.fillStyle = "#e8763f";
        ctx.font = "bold 9px sans-serif";
        ctx.fillText("PB", x + colW - 44, y + 49);
      }
    });

    // Footer
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.font = "11px sans-serif";
    ctx.fillText("dartsiq.app — Track. Improve. Excel.", 48, 470);

    await shareCanvas(canvas, "darts-iq-session.png");
    setSharing(false);
  };

  return (
    React.createElement('button', { onClick: handleShare, disabled: sharing,
      style: { width: "100%", padding: "14px 0", marginTop: 10, background: "rgba(232,118,63,.08)", border: "1px solid rgba(232,118,63,.25)", borderRadius: 14, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, color: "var(--accent)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, WebkitTapHighlightColor: "transparent", transition: "opacity .15s", opacity: sharing ? 0.5 : 1 },}
      , sharing ? "⏳ Preparing…" : "📤 Share Session"
    )
  );
}

// ── IQ Card ───────────────────────────────────────────────────────────────────
function ShareIQCard({ iqData, iqTier, iqNextTier, iqPct }) {
  var [sharing, setSharing] = useState(false);

  var handleShare = async () => {
    setSharing(true);
    var canvas = document.createElement("canvas");
    canvas.width = 800; canvas.height = 800;
    var ctx = canvas.getContext("2d");
    patchRoundRect(ctx);

    // Background — dark with subtle radial glow
    ctx.fillStyle = "var(--on-accent)";
    ctx.fillRect(0, 0, 800, 800);
    var radGrad = ctx.createRadialGradient(400, 350, 0, 400, 350, 420);
    radGrad.addColorStop(0, `${iqTier.color}18`);
    radGrad.addColorStop(1, "transparent");
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 800, 800);

    // Top accent bar
    var topGrad = ctx.createLinearGradient(0, 0, 800, 0);
    topGrad.addColorStop(0, iqTier.color); topGrad.addColorStop(1, "#f0a06a");
    ctx.fillStyle = topGrad; ctx.fillRect(0, 0, 800, 4);

    // Logo
    ctx.fillStyle = "#e8763f";
    ctx.font = "bold 14px sans-serif";
    ctx.letterSpacing = "4px";
    ctx.fillText("DARTS IQ", 40, 44);

    // Tier emoji + label — centre
    ctx.font = "72px sans-serif";
    ctx.fillText(iqTier.emoji, 356, 175);

    ctx.fillStyle = iqTier.color;
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(iqTier.label.toUpperCase(), 400, 220);

    // Big IQ number
    ctx.fillStyle = "#f0f0f8";
    ctx.font = "bold 110px sans-serif";
    ctx.fillText(iqData.total.toString(), 400, 345);

    // "Darts IQ" label under number
    ctx.fillStyle = `${iqTier.color}99`;
    ctx.font = "bold 16px sans-serif";
    ctx.letterSpacing = "6px";
    ctx.fillText("DARTS IQ", 400, 378);
    ctx.letterSpacing = "0px";

    // Next tier progress
    if (iqNextTier) {
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.font = "12px sans-serif";
      ctx.fillText(`${iqNextTier.min - iqData.total} pts to ${iqNextTier.emoji} ${iqNextTier.label}`, 400, 408);

      // Progress bar
      var barX = 200, barY = 418, barW = 400, barH = 6;
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath(); ctx.roundRect(barX, barY, barW, barH, 3); ctx.fill();
      var prog = ctx.createLinearGradient(barX, 0, barX + barW, 0);
      prog.addColorStop(0, iqTier.color); prog.addColorStop(1, iqNextTier.color);
      ctx.fillStyle = prog;
      ctx.beginPath(); ctx.roundRect(barX, barY, barW * (iqPct / 100), barH, 3); ctx.fill();
    }

    // Pillars
    var pillars = iqData.pillars;
    var pillW = 136, pillGap = 10;
    var totalW = pillars.length * pillW + (pillars.length - 1) * pillGap;
    var pillStartX = (800 - totalW) / 2;
    var pillY = iqNextTier ? 450 : 430;

    pillars.forEach((p, i) => {
      var x = pillStartX + i * (pillW + pillGap);
      var pct = p.score / p.max;

      // Card bg
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.beginPath(); ctx.roundRect(x, pillY, pillW, 88, 10); ctx.fill();

      // Bar
      var bh = Math.max(4, pct * 40);
      ctx.fillStyle = `${p.color}40`;
      ctx.beginPath(); ctx.roundRect(x + 12, pillY + 68 - 40, pillW - 24, 40, 4); ctx.fill();
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.roundRect(x + 12, pillY + 68 - bh, pillW - 24, bh, 4); ctx.fill();

      // Score
      ctx.fillStyle = p.color;
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(p.score.toString(), x + pillW / 2, pillY + 20);

      // Label
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "9px sans-serif";
      ctx.letterSpacing = "1px";
      ctx.fillText(p.label.toUpperCase(), x + pillW / 2, pillY + 36);
      ctx.letterSpacing = "0px";
    });

    // CTA
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Can you beat me? → dartsiq.app", 400, 765);

    // Footer divider
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(100, 750); ctx.lineTo(700, 750); ctx.stroke();

    ctx.textAlign = "left"; // reset
    await shareCanvas(canvas, "darts-iq-score.png");
    setSharing(false);
  };

  return (
    React.createElement('button', { onClick: handleShare, disabled: sharing,
      style: { width: "100%", padding: "14px 0", marginTop: 16, background: `${iqTier.color}12`, border: `1px solid ${iqTier.color}35`, borderRadius: 14, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, color: iqTier.color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, WebkitTapHighlightColor: "transparent", transition: "opacity .15s", opacity: sharing ? 0.5 : 1 },}
      , sharing ? "⏳ Preparing…" : "📤 Share My Darts IQ"
    )
  );
}

function SessionOrchestrator({ programme, onComplete, onExit, savedHistory }) {
  var games = programme.games.map(id => GAMES.find(g => g.id === id)).filter(Boolean);
  var [idx, setIdx]             = useState(0);
  var [allResults, setAllResults] = useState([]);
  var [done, setDone]           = useState(false);
  var [coachInsight, setCoachInsight] = useState(null);  // null | "loading" | string
  var coachFiredRef = useRef(false);

  var handleDone = (result) => {
    var game = games[idx];
    var updated = [...allResults, { id: game.id, name: game.name, icon: game.icon, score: result.score, note: result.notes || "" }];
    setAllResults(updated);
    if (idx < games.length - 1) { setIdx(i => i + 1); }
    else {
      setDone(true);
      onComplete({ id: Date.now().toString(), programmeId: programme.id, programmeName: programme.name, date: new Date().toISOString(), games: updated });
      // Fire proactive coaching (async, non-blocking)
      if (!coachFiredRef.current) {
        coachFiredRef.current = true;
        setCoachInsight("loading");
        getProactiveInsight(updated, savedHistory || [])
          .then(msg => setCoachInsight(msg))
          .catch(() => setCoachInsight(null));
      }
    }
  };

  if (done) {
    var completedSession = { games: allResults };
    var sessionPBs = checkPBs(completedSession, savedHistory || []);
    var hasPBs = sessionPBs.length > 0;
    return (
      React.createElement('div', { className: "scroll-area",}
        , React.createElement('div', { style: { paddingTop: 52, textAlign: "center", paddingBottom: 20 },}
          , React.createElement('div', { style: { fontSize: 64, marginBottom: 12 },}, hasPBs ? "🏆" : "✅")
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 38, letterSpacing: 3, color: hasPBs ? "var(--accent)" : "var(--text)", marginBottom: 6 },}
            , hasPBs ? "New Personal Best!" : "Session Done!"
          )
          , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)", lineHeight: 1.5 },}
            , hasPBs ? `You set ${sessionPBs.length} new PB${sessionPBs.length>1?"s":""} this session.` : `${allResults.length} game${allResults.length!==1?"s":""} completed and logged.`
          )
        )

        /* ── Proactive AI coaching card ── */
        , coachInsight === "loading" && (
          React.createElement('div', { style: { background: "linear-gradient(135deg,rgba(168,85,247,.08),rgba(232,118,63,.04))", border: "1px solid rgba(168,85,247,.25)", borderRadius: "var(--radius)", padding: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 },}
            , React.createElement('div', { style: { fontSize: 28, flexShrink: 0 },}, "🎯")
            , React.createElement('div', { style: { flex: 1 },}
              , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "rgb(168,85,247)", marginBottom: 6 },}, "AI Coach" )
              , React.createElement('div', { style: { display: "flex", gap: 5, alignItems: "center" },}
                , [0,1,2].map(i => (
                  React.createElement('div', { key: i, style: { width: 7, height: 7, borderRadius: "50%", background: "rgb(168,85,247)", animation: `dlbounce 1.2s ${i*0.2}s infinite ease-in-out` },} )
                ))
                , React.createElement('span', { style: { fontSize: 12, color: "var(--muted)", marginLeft: 6 },}, "Analysing your session…"  )
              )
            )
          )
        )
        , coachInsight && coachInsight !== "loading" && (
          React.createElement('div', { style: { background: "linear-gradient(135deg,rgba(168,85,247,.08),rgba(232,118,63,.04))", border: "1px solid rgba(168,85,247,.3)", borderRadius: "var(--radius)", padding: 16, marginBottom: 16 },}
            , React.createElement('div', { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },}
              , React.createElement('div', { style: { width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,rgb(168,85,247),rgba(232,118,63,.6))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 },}, "🎯")
              , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "rgb(168,85,247)" },}, "Coach Insight" )
            )
            , React.createElement('div', { style: { fontSize: 14, color: "var(--text)", lineHeight: 1.65 },}, coachInsight)
          )
        )

        , hasPBs && (
          React.createElement('div', { style: { background: "linear-gradient(135deg,rgba(232,118,63,.12),rgba(168,255,120,.06))", border: "1px solid rgba(232,118,63,.4)", borderRadius: "var(--radius)", padding: 16, marginBottom: 16 },}
            , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 },}, "🏆 Personal Bests"  )
            , sessionPBs.map((pb, i) => (
              React.createElement('div', { key: i, style: { display: "flex", alignItems: "center", gap: 10, marginBottom: i < sessionPBs.length-1 ? 8 : 0 },}
                , React.createElement('span', { style: { fontSize: 22 },}, pb.icon)
                , React.createElement('div', { style: { flex: 1 },}
                  , React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: "var(--text)" },}, pb.name)
                  , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginTop: 1 },}
                    , React.createElement('span', { style: { textDecoration: "line-through", marginRight: 6 },}, pb.old)
                    , React.createElement('span', { style: { color: "var(--accent)", fontWeight: 700 },}, "→ " , pb.new)
                  )
                )
              )
            ))
          )
        )

        , React.createElement('div', { className: "stat-row",}
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, games.length), React.createElement('div', { className: "stat-lbl",}, "Games"))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, allResults.reduce((a, r) => a + r.score, 0)), React.createElement('div', { className: "stat-lbl",}, "Total Pts" ))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, Math.max(...allResults.map(r => r.score), 0)), React.createElement('div', { className: "stat-lbl",}, "Best Game" ))
        )
        , React.createElement('div', { className: "section-label",}, "Game Breakdown" )
        , allResults.map((r, i) => {
          var isPB = sessionPBs.find(p => p.name === r.name);
          return (
            React.createElement('div', { key: i, className: "history-card", style: { border: isPB ? "1px solid rgba(232,118,63,.35)" : undefined },}
              , React.createElement('div', { className: "history-row", style: { padding: 0, background: "none" },}
                , React.createElement('span', { style: { fontSize: 22 },}, r.icon)
                , React.createElement('span', { className: "history-name",}, r.name)
                , React.createElement('div', { style: { display: "flex", alignItems: "center", gap: 6 },}
                  , isPB && React.createElement('span', { style: { fontSize: 10, fontWeight: 700, color: "var(--accent)", background: "rgba(232,118,63,.15)", padding: "2px 6px", borderRadius: 6 },}, "PB")
                  , React.createElement('span', { className: "history-score",}, r.score)
                )
              )
              , r.note && React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginTop: 6, fontStyle: "italic" },}, r.note)
            )
          );
        })
        , React.createElement(ShareSessionCard, {
          results: allResults,
          programmeName: programme.name,
          hasPBs: hasPBs,
          sessionPBs: sessionPBs,}
        )
        , React.createElement('button', { className: "btn btn-primary btn-full"  , style: { marginTop: 10 }, onClick: onExit,}, React.createElement(Ms, { icon: "arrow_back", size: 18,} ), " Back to Home"   )
      )
    );
  }

  var game = games[idx];
  var sharedProps = { game, onDone: handleDone, onExit, sessionIdx: idx, sessionTotal: games.length };

  if (game.isSpecial === "atc") return React.createElement(AtcSession, { ...sharedProps,} );
  if (game.isSpecial === "bobs27") return React.createElement(Bobs27Session, { ...sharedProps,} );
  if (game.isSpecial === "doubles") return React.createElement(DoublesSession, { ...sharedProps,} );
  if (game.isSpecial === "trebles") return React.createElement(TreblesSession, { ...sharedProps,} );
  if (game.isSpecial === "bullseye") return React.createElement(BullseyeSession, { ...sharedProps,} );
  if (game.isSpecial === "halveit") return React.createElement(HalveItSession, { ...sharedProps,} );
  if (game.isSpecial === "121") return React.createElement(Game121Session, { ...sharedProps,} );
  if (game.isSpecial === "f50") return React.createElement(GameF50Session, { ...sharedProps,} );
  if (game.isSpecial === "jdc") return React.createElement(JDCSession, { ...sharedProps,} );
  if (game.isSpecial === "catch40") return React.createElement(Catch40Session, { ...sharedProps,} );
  if (game.isSpecial === "killbull") return React.createElement(KillTheBullSession, { ...sharedProps,} );
  if (game.isSpecial === "singlemastery") return React.createElement(SingleMasterySession, { ...sharedProps,} );
  if (game.isSpecial === "penalties") return React.createElement(PenaltiesSessionWrapper, { ...sharedProps,} );
  if (game.isSpecial === "priestleys") return React.createElement(PriestleysSession, { ...sharedProps,} );
  if (game.isSpecial === "street82") return React.createElement(Street82Session, { ...sharedProps,} );
  if (game.isSpecial === "pyramid") return React.createElement(CheckoutPyramidSession, { ...sharedProps,} );
  return React.createElement(GenericSession, { ...sharedProps,} );
}

// ─── HISTORY PAGE ─────────────────────────────────────────────────────────────

// ─── SVG TREND CHART ─────────────────────────────────────────────────────────

function TrendChart({ scores, color = "#e8763f", height = 56, showDots = true }) {
  if (!scores || scores.length < 2) return (
    React.createElement('div', { style: { height, display: "flex", alignItems: "center", justifyContent: "center" },}
      , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)" },}, "Need 2+ sessions to show trend"     )
    )
  );
  var w = 280, h = height;
  var pad = 6;
  var min = Math.min(...scores);
  var max = Math.max(...scores);
  var range = max - min || 1;
  var pts = scores.map((s, i) => {
    var x = pad + (i / (scores.length - 1)) * (w - pad * 2);
    var y = h - pad - ((s - min) / range) * (h - pad * 2);
    return [x, y];
  });
  var pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  var areaD = pathD + ` L${pts[pts.length-1][0].toFixed(1)},${h} L${pts[0][0].toFixed(1)},${h} Z`;
  var trend = scores[scores.length-1] >= scores[0];
  var lineColor = trend ? color : "#c2483f";
  return (
    React.createElement('svg', { viewBox: `0 0 ${w} ${h}`, style: { width: "100%", height, display: "block" },}
      , React.createElement('defs', null
        , React.createElement('linearGradient', { id: `grad-${color.replace("#","")}`, x1: "0", y1: "0", x2: "0", y2: "1",}
          , React.createElement('stop', { offset: "0%", stopColor: lineColor, stopOpacity: "0.25",})
          , React.createElement('stop', { offset: "100%", stopColor: lineColor, stopOpacity: "0",})
        )
      )
      , React.createElement('path', { d: areaD, fill: `url(#grad-${color.replace("#","")})`,})
      , React.createElement('path', { d: pathD, fill: "none", stroke: lineColor, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round",})
      , showDots && pts.map((p, i) => (
        React.createElement('circle', { key: i, cx: p[0], cy: p[1], r: i === pts.length-1 ? 4 : 3,
          fill: i === pts.length-1 ? lineColor : "var(--surface)",
          stroke: lineColor, strokeWidth: "2",})
      ))
    )
  );
}

// ─── TRAINING CALENDAR ────────────────────────────────────────────────────────

function TrainingCalendar({ history }) {
  var days = 35;
  var today = new Date(); today.setHours(0,0,0,0);
  var trainedDays = new Set(history.map(s => new Date(s.date).toDateString()));
  var cells = Array.from({ length: days }, (_, i) => {
    var d = new Date(today); d.setDate(today.getDate() - (days - 1 - i));
    var trained = trainedDays.has(d.toDateString());
    var isToday = d.toDateString() === today.toDateString();
    return { date: d, trained, isToday };
  });
  return (
    React.createElement('div', null
      , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 },}, "Last 5 Weeks"  )
      , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 },}
        , ["M","T","W","T","F","S","S"].map((d,i) => (
          React.createElement('div', { key: i, style: { fontSize: 10, color: "var(--muted)", textAlign: "center", paddingBottom: 2 },}, d)
        ))
        , cells.map((c, i) => (
          React.createElement('div', { key: i, style: {
            aspectRatio: "1", borderRadius: 5,
            background: c.trained ? "var(--accent)" : "var(--surface2)",
            border: c.isToday ? "2px solid var(--accent)" : "1px solid var(--border)",
            opacity: c.trained ? 1 : 0.5,
          }, title: c.date.toDateString(),})
        ))
      )
      , React.createElement('div', { style: { display: "flex", gap: 12, marginTop: 8, fontSize: 11, color: "var(--muted)" },}
        , React.createElement('div', { style: { display: "flex", alignItems: "center", gap: 4 },}
          , React.createElement('div', { style: { width: 10, height: 10, borderRadius: 3, background: "var(--accent)" },}), "Trained"
        )
        , React.createElement('div', { style: { display: "flex", alignItems: "center", gap: 4 },}
          , React.createElement('div', { style: { width: 10, height: 10, borderRadius: 3, background: "var(--surface2)", border: "1px solid var(--border)" },}), "Rest"
        )
      )
    )
  );
}

// ─── HISTORY / PROGRESS PAGE ─────────────────────────────────────────────────

function HistoryPage({ history, botGames, unlockedAchievements = {}, authUser, dartsIQ }) {
  var [activeTab, setActiveTab] = useState("sessions");
  var [pbCat, setPbCat] = useState("All");
  var [expandedGame, setExpandedGame] = useState(null);
  var [achCategory, setAchCategory] = useState("All");
  var fmt = (iso) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  var fmtShort = (iso) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  var stats = deriveStats(history, botGames);
  var streak = calcStreak(history);

  var gamePBs = Object.entries(stats.gameStats)
    .filter(([,g]) => g.bestScore !== null)
    .sort((a, b) => b[1].totalPlays - a[1].totalPlays);

  var botAvgs = [...botGames].map(g => g.playerAvg || 0);
  var unlockedCount = Object.keys(unlockedAchievements).length;
  var achCategories = ["All", ...new Set(ACHIEVEMENTS.map(a => a.category))];

  // Darts IQ
  var iqData = calcDartsIQ({
    ...deriveAchievementState(history, botGames),
    achievementsUnlocked: unlockedCount,
    totalAchievements: ACHIEVEMENTS.length,
  });
  var iqTier = getIQTier(iqData.total);
  var iqNextTier = IQ_TIERS.find(t => t.min > iqData.total);
  var iqPct = iqNextTier ? Math.round(((iqData.total - iqTier.min) / (iqNextTier.min - iqTier.min)) * 100) : 100;

  var totalGames = history.reduce((a,s) => a + (_optionalChain([s, 'access', _29 => _29.games, 'optionalAccess', _30 => _30.length])||0), 0);

  return (
    React.createElement('div', { className: "scroll-area",}
      /* Top bar */
      , React.createElement('div', { className: "top-bar",}
        , React.createElement('span', { className: "top-bar-title",}, "Progress")
        , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"var(--muted)", letterSpacing:".05em" },}
          , history.length > 0 ? `${history.length} sessions${streak > 0 ? ` · 🔥 ${streak}` : ""}` : "No sessions yet"
        )
      )

      /* Summary stat strip */
      , history.length > 0 && (
        React.createElement('div', { style: { display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8, margin:"12px 0 14px" },}
          , [
            { val: history.length, lbl: "Sessions" },
            { val: totalGames, lbl: "Games" },
            { val: streak > 0 ? `${streak}🔥` : "—", lbl: "Streak" },
            { val: iqData.total, lbl: `${iqTier.emoji} IQ` },
          ].map(({ val, lbl }) => (
            React.createElement('div', { key: lbl, style: { background:"var(--glass-bg)", border:"1px solid var(--glass-border)", borderTop:"2px solid rgba(232,118,63,.25)", borderRadius:"var(--radius-sm)", padding:"11px 6px", textAlign:"center", backdropFilter:"blur(12px)" },}
              , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:20, fontWeight:800, letterSpacing:"-0.04em", color:"var(--accent)", lineHeight:1 },}, val)
              , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:8, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", color:"var(--muted)", marginTop:4 },}, lbl)
            )
          ))
        )
      )

      /* Tab switcher */
      , React.createElement('div', { style: { display:"flex", gap:6, marginBottom:14, overflowX:"auto", paddingBottom:2, scrollbarWidth:"none" },}
        , [["sessions","Sessions"],["pbs","PBs"],["stats","Stats"],["bot","Bot"],["achievements","Badges"],["iq","IQ"],["leaderboard","Ranks"]].map(([t,label]) => (
          React.createElement('button', { key: t, className: `filter-btn ${activeTab === t ? "active" : ""}`, style: { flexShrink:0, textAlign:"center" }, onClick: () => setActiveTab(t),}, label)
        ))
      )

      /* ── PERSONAL BESTS TAB ── */
      , activeTab === "pbs" && (() => {
        // Build all PBs from history, grouped by category
        var allPBs = Object.entries(stats.gameStats)
          .filter(([,g]) => g.bestScore !== null)
          .map(([id, g]) => {
            var game = GAMES.find(x => x.id === id);
            var scoreType = _optionalChain([game, 'optionalAccess', _31 => _31.scoreType]) || "higher";
            var recent5 = g.scores.slice(-5);
            var trend = recent5.length >= 2
              ? recent5[recent5.length-1] - recent5[0] > 0 ? "up"
              : recent5[recent5.length-1] - recent5[0] < 0 ? "down" : "flat"
              : "flat";
            return { id, ...g, category: _optionalChain([game, 'optionalAccess', _32 => _32.category]) || "Other", scoreType, trend, recent5 };
          })
          .sort((a, b) => b.totalPlays - a.totalPlays);

        var CAT_COLORS = {
          Accuracy:    "#6f93b5",
          Finishing:   "#e8763f",
          Scoring:     "#f0ad4e",
          "Match Play":"#c2483f",
        };

        var cats = ["All", ...Object.keys(CAT_COLORS)];
        var filtered = pbCat === "All" ? allPBs : allPBs.filter(g => g.category === pbCat);

        if (allPBs.length === 0) return (
          React.createElement('div', { className: "empty-state",}
            , React.createElement('div', { className: "empty-icon",}, "🏆")
            , React.createElement('div', { className: "empty-title",}, "No personal bests yet"   )
            , React.createElement('div', { className: "empty-body",}, "Complete training sessions and your best scores will appear here, organised by game."            )
          )
        );

        return (
          React.createElement(React.Fragment, null
            /* Category filter */
            , React.createElement('div', { className: "filter-row", style: { marginBottom: 16 },}
              , cats.map(c => {
                var col = CAT_COLORS[c];
                return (
                  React.createElement('button', { key: c, className: `filter-btn ${pbCat===c?"active":""}`,
                    onClick: () => setPbCat(c),
                    style: pbCat===c && col ? { background: col, borderColor: col, color: "var(--on-accent)" } : col ? { borderColor: `${col}44`, color: col } : {},}
                    , c
                  )
                );
              })
            )

            /* Summary strip */
            , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 },}
              , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 8px", textAlign: "center", boxShadow: "var(--shadow-sm)" },}
                , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--accent)" },}, allPBs.length)
                , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted)", marginTop: 2 },}, "Games Tracked" )
              )
              , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 8px", textAlign: "center", boxShadow: "var(--shadow-sm)" },}
                , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--accent)" },}, allPBs.filter(g => g.trend === "up").length)
                , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted)", marginTop: 2 },}, "Improving")
              )
              , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 8px", textAlign: "center", boxShadow: "var(--shadow-sm)" },}
                , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--accent)" },}, allPBs.reduce((a,g) => a + g.totalPlays, 0))
                , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted)", marginTop: 2 },}, "Total Plays" )
              )
            )

            /* PB cards */
            , filtered.map(g => {
              var col = CAT_COLORS[g.category] || "var(--accent)";
              var trendIcon = g.trend === "up" ? React.createElement(Ms, { icon: "trending_up", size: 14, style: {color:"var(--accent)"},} ) : g.trend === "down" ? React.createElement(Ms, { icon: "trending_down", size: 14, style: {color:"var(--accent2)"},} ) : React.createElement(Ms, { icon: "trending_flat", size: 14, style: {color:"var(--muted)"},} );
              var trendCol  = g.trend === "up" ? "var(--accent)" : g.trend === "down" ? "var(--accent2)" : "var(--muted)";
              var pbDateFmt = g.pbDate ? new Date(g.pbDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null;

              return (
                React.createElement('div', { key: g.id, style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18, padding: 16, marginBottom: 10, boxShadow: "var(--shadow-card)", borderLeft: `3px solid ${col}` },}
                  /* Header row */
                  , React.createElement('div', { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 },}
                    , React.createElement('div', { style: { fontSize: 26 },}, g.icon)
                    , React.createElement('div', { style: { flex: 1, minWidth: 0 },}
                      , React.createElement('div', { style: { fontSize: 14, fontWeight: 700, color: "var(--text)", lineHeight: 1.2 },}, g.name)
                      , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: .4, textTransform: "uppercase", color: col, marginTop: 3 },}, g.category)
                    )
                    /* PB score */
                    , React.createElement('div', { style: { textAlign: "right" },}
                      , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, color: "var(--accent)", lineHeight: 1 },}, g.bestScore)
                      , React.createElement('div', { style: { fontSize: 9, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 },}, "Best")
                    )
                  )

                  /* Stats row */
                  , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: g.recent5.length >= 3 ? 12 : 0 },}
                    , React.createElement('div', { style: { background: "var(--surface2)", borderRadius: 10, padding: "7px 6px", textAlign: "center" },}
                      , React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: "var(--text)" },}, g.totalPlays)
                      , React.createElement('div', { style: { fontSize: 9, color: "var(--muted)" },}, "Plays")
                    )
                    , React.createElement('div', { style: { background: "var(--surface2)", borderRadius: 10, padding: "7px 6px", textAlign: "center" },}
                      , React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: "var(--text)" },}, g.scores.length > 0 ? Math.round(g.scores.reduce((a,b)=>a+b,0)/g.scores.length) : "—")
                      , React.createElement('div', { style: { fontSize: 9, color: "var(--muted)" },}, "Avg")
                    )
                    , React.createElement('div', { style: { background: "var(--surface2)", borderRadius: 10, padding: "7px 6px", textAlign: "center" },}
                      , React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: trendCol },}, trendIcon)
                      , React.createElement('div', { style: { fontSize: 9, color: "var(--muted)" },}, "Trend")
                    )
                    , React.createElement('div', { style: { background: "var(--surface2)", borderRadius: 10, padding: "7px 6px", textAlign: "center" },}
                      , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, color: "var(--text2)", lineHeight: 1.3 },}, pbDateFmt || "—")
                      , React.createElement('div', { style: { fontSize: 9, color: "var(--muted)" },}, "PB Set" )
                    )
                  )

                  /* Mini sparkline — last 5 scores as bars */
                  , g.recent5.length >= 3 && (
                    React.createElement('div', { style: { display: "flex", alignItems: "flex-end", gap: 3, height: 28 },}
                      , g.recent5.map((s, i) => {
                        var mn = Math.min(...g.recent5), mx = Math.max(...g.recent5);
                        var h = mx === mn ? 14 : Math.max(4, Math.round(((s - mn) / (mx - mn)) * 24));
                        var isLatest = i === g.recent5.length - 1;
                        return (
                          React.createElement('div', { key: i, style: { flex: 1, height: h, borderRadius: 3, background: isLatest ? col : `${col}50`, transition: "height .3s" },} )
                        );
                      })
                      , React.createElement('div', { style: { fontSize: 9, color: "var(--muted)", paddingLeft: 6, alignSelf: "center", whiteSpace: "nowrap" },}, "last " , g.recent5.length)
                    )
                  )
                )
              );
            })
          )
        );
      })()

      /* ── SESSIONS TAB ── */
      , activeTab === "sessions" && (
        history.length === 0
          ? React.createElement('div', { className: "empty-state",}
              , React.createElement('div', { className: "empty-rings",}, React.createElement('div', { className: "empty-icon-anim",}, React.createElement(DartboardSVG, { size: 100, muted: true,} )))
              , React.createElement('div', { className: "empty-title",}, "No sessions yet"  )
              , React.createElement('div', { className: "empty-body",}, "Complete a training session and your results will appear here."         )
              /* Teaser preview cards */
              , React.createElement('div', { style: { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:28, opacity:.35, filter:"grayscale(1)", pointerEvents:"none" },}
                , [{lbl:"AVG SCORE",val:"--.-",color:"var(--accent)"},{lbl:"CHECKOUT %",val:"--%",color:"#64c8ff"},{lbl:"ACCURACY",val:"--.-",color:"#f0a06a"}].map((s,i) => (
                  React.createElement('div', { key: i, style: { background:"rgba(19,19,26,0.7)", border:"1px solid rgba(255,255,255,.08)", borderRadius:14, padding:"12px 8px", backdropFilter:"blur(8px)" },}
                    , React.createElement('div', { style: { fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"var(--muted)", marginBottom:6 },}, s.lbl)
                    , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:22, fontWeight:800, letterSpacing:"-0.04em", color:s.color },}, s.val)
                    , React.createElement('div', { style: { height:3, background:"rgba(255,255,255,.06)", borderRadius:100, marginTop:8 },}, React.createElement('div', { style: { height:"100%", width:0, background:s.color, borderRadius:100 },} ))
                  )
                ))
              )
            )
          : React.createElement(React.Fragment, null
            , React.createElement('div', { className: "info-block", style: { marginBottom: 16 },}
              , React.createElement('div', { className: "info-title",}, "Training Frequency" )
              , React.createElement(TrainingCalendar, { history: history,} )
            )
            , [...history].reverse().map(s => (
              React.createElement('div', { key: s.id, className: "history-card",}
                , React.createElement('div', { style: { display: "flex", justifyContent: "space-between", marginBottom: 10 },}
                  , React.createElement('div', null
                    , React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: "var(--text)" },}, s.programmeName)
                    , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)" },}, fmt(s.date))
                  )
                  , React.createElement('span', { className: "badge accent" ,}, s.games.length, " games" )
                )
                , s.games.map((g, i) => (
                  React.createElement('div', { key: i, className: "history-row",}
                    , React.createElement('span', { style: { fontSize: 16 },}, g.icon)
                    , React.createElement('span', { className: "history-name",}, g.name)
                    , React.createElement('span', { className: "history-score",}, g.score)
                  )
                ))
              )
            ))
          )
      )

      /* ── STATS TAB ── */
      , activeTab === "stats" && (
        gamePBs.length === 0
          ? React.createElement('div', { className: "empty-state",}, React.createElement('div', { className: "empty-rings",}, React.createElement('div', { className: "empty-icon-anim",}, React.createElement(DartboardSVG, { size: 100, muted: true,} ))), React.createElement('div', { className: "empty-title",}, "No stats yet"  ), React.createElement('div', { className: "empty-body",}, "Complete some training sessions to see your personal bests and trend charts here."            ))
          : React.createElement(React.Fragment, null
            , React.createElement(TierCard, { history: history,} )
            , React.createElement('div', { className: "stat-row",}
              , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, history.length), React.createElement('div', { className: "stat-lbl",}, "Sessions"))
              , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, history.reduce((a,s) => a+(_optionalChain([s, 'access', _33 => _33.games, 'optionalAccess', _34 => _34.length])||0),0)), React.createElement('div', { className: "stat-lbl",}, "Games"))
              , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, streak > 0 ? `${streak}🔥` : "—"), React.createElement('div', { className: "stat-lbl",}, "Streak"))
            )
            , React.createElement(InsightsSection, { history: history, botGames: botGames, stats: stats,} )

            , React.createElement('div', { className: "section-label",}, "Game Trends — tap to expand"     )
            , gamePBs.map(([id, g]) => {
              var isExpanded = expandedGame === id;
              var lastScore = g.scores[g.scores.length - 1];
              var prevScore = g.scores.length > 1 ? g.scores[g.scores.length - 2] : null;
              var trend = prevScore !== null ? (lastScore > prevScore ? "↑" : lastScore < prevScore ? "↓" : "→") : "—";
              var trendColor = trend === "↑" ? "var(--accent)" : trend === "↓" ? "var(--accent2)" : "var(--muted)";
              var improvement = g.scores.length > 1 ? lastScore - g.scores[0] : 0;

              return (
                React.createElement('div', { key: id, className: "history-card", style: { marginBottom: 10, cursor: "pointer" }, onClick: () => setExpandedGame(isExpanded ? null : id),}
                  /* Header row */
                  , React.createElement('div', { style: { display: "flex", alignItems: "center", gap: 12 },}
                    , React.createElement('div', { style: { fontSize: 26 },}, g.icon)
                    , React.createElement('div', { style: { flex: 1 },}
                      , React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: "var(--text)" },}, g.name)
                      , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginTop: 1 },}, g.totalPlays, " session" , g.totalPlays !== 1 ? "s" : "")
                    )
                    , React.createElement('div', { style: { textAlign: "center" },}
                      , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--accent)" },}, g.bestScore)
                      , React.createElement('div', { style: { fontSize: 10, color: "var(--muted)" },}, "PB")
                    )
                    , React.createElement('div', { style: { textAlign: "center", marginLeft: 8 },}
                      , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: trendColor },}, trend)
                      , React.createElement('div', { style: { fontSize: 10, color: "var(--muted)" },}, "Last")
                    )
                    , React.createElement('div', { style: { fontSize: 16, color: "var(--muted)", marginLeft: 4 },}, isExpanded ? "▲" : "▼")
                  )

                  /* Expanded trend chart */
                  , isExpanded && (
                    React.createElement('div', { style: { marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" },}
                      , React.createElement('div', { style: { display: "flex", justifyContent: "space-between", marginBottom: 8 },}
                        , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)" },}, "Score over time ("   , g.scores.length, " plays)" )
                        , improvement !== 0 && (
                          React.createElement('div', { style: { fontSize: 11, fontWeight: 700, color: improvement > 0 ? "var(--accent)" : "var(--accent2)" },}
                            , improvement > 0 ? "+" : "", improvement, " since first play"
                          )
                        )
                      )
                      , React.createElement(TrendChart, { scores: g.scores, height: 64,} )
                      , React.createElement('div', { style: { display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--muted)" },}
                        , React.createElement('span', null, "First: " , g.scores[0])
                        , React.createElement('span', null, "Best: " , g.bestScore)
                        , React.createElement('span', null, "Last: " , lastScore)
                      )

                      /* Score history mini list */
                      , React.createElement('div', { style: { marginTop: 10, display: "flex", gap: 5, flexWrap: "wrap" },}
                        , g.scores.slice(-10).map((s, i) => (
                          React.createElement('div', { key: i, style: { padding: "3px 8px", borderRadius: 8, background: s === g.bestScore ? "rgba(232,118,63,.15)" : "var(--surface2)", border: `1px solid ${s === g.bestScore ? "rgba(232,118,63,.4)" : "var(--border)"}`, fontSize: 12, fontWeight: s === g.bestScore ? 700 : 400, color: s === g.bestScore ? "var(--accent)" : "var(--muted)" },}
                            , s
                          )
                        ))
                      )
                    )
                  )
                )
              );
            })
          )
      )

      /* ── BOT GAMES TAB ── */
      , activeTab === "bot" && (
        botGames.length === 0
          ? React.createElement('div', { className: "empty-state",}, React.createElement('div', { className: "empty-rings",}, React.createElement('div', { className: "empty-icon-anim", style: {fontSize:52},}, React.createElement(Ms, { icon: "smart_toy", size: 52,} ))), React.createElement('div', { className: "empty-title",}, "No bot games yet"   ), React.createElement('div', { className: "empty-body",}, "Play vs Bot from the Play tab to see your results here."           ))
          : React.createElement(React.Fragment, null
            , React.createElement('div', { className: "stat-row",}
              , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, stats.botStats.wins), React.createElement('div', { className: "stat-lbl",}, "Wins"))
              , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, stats.botStats.losses), React.createElement('div', { className: "stat-lbl",}, "Losses"))
              , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, stats.botStats.bestAvg), React.createElement('div', { className: "stat-lbl",}, "Best Avg" ))
            )

            /* Win rate bar */
            , React.createElement('div', { className: "info-block",}
              , React.createElement('div', { className: "info-title",}, "Win Rate" )
              , React.createElement('div', { style: { display: "flex", justifyContent: "space-between", marginBottom: 8 },}
                , React.createElement('span', { style: { fontSize: 13, color: "var(--muted)" },}, botGames.length, " games played"  )
                , React.createElement('span', { style: { fontSize: 13, fontWeight: 700, color: "var(--text)" },}, botGames.length > 0 ? Math.round((stats.botStats.wins/botGames.length)*100) : 0, "%")
              )
              , React.createElement('div', { style: { height: 10, background: "var(--surface2)", borderRadius: 100, overflow: "hidden" },}
                , React.createElement('div', { style: { width: `${botGames.length > 0 ? (stats.botStats.wins/botGames.length)*100 : 0}%`, height: "100%", background: "var(--accent)", borderRadius: 100, transition: "width .5s" },})
              )
            )

            /* Average trend chart */
            , botAvgs.length >= 2 && (
              React.createElement('div', { className: "info-block",}
                , React.createElement('div', { className: "info-title",}, "Your Average Over Time"   )
                , React.createElement(TrendChart, { scores: botAvgs, height: 60,} )
                , React.createElement('div', { style: { display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--muted)" },}
                  , React.createElement('span', null, "First game: "  , botAvgs[0])
                  , React.createElement('span', null, "Best: " , Math.max(...botAvgs))
                  , React.createElement('span', null, "Last: " , botAvgs[botAvgs.length-1])
                )
                , botAvgs.length > 1 && (
                  React.createElement('div', { style: { marginTop: 8, fontSize: 12, color: botAvgs[botAvgs.length-1] >= botAvgs[0] ? "var(--accent)" : "var(--accent2)", fontWeight: 600 },}
                    , botAvgs[botAvgs.length-1] >= botAvgs[0]
                      ? `↑ Average improved by ${(botAvgs[botAvgs.length-1] - botAvgs[0]).toFixed(1)} since first game`
                      : `↓ Average down ${(botAvgs[0] - botAvgs[botAvgs.length-1]).toFixed(1)} from first game — keep playing`
                  )
                )
              )
            )

            /* Recent games */
            , React.createElement('div', { className: "section-label",}, "Recent Games" )
            , [...botGames].reverse().slice(0, 10).map((g, i) => (
              React.createElement('div', { key: i, className: "history-card",}
                , React.createElement('div', { style: { display: "flex", justifyContent: "space-between", marginBottom: 8 },}
                  , React.createElement('div', null
                    , React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: g.winner === "player" ? "var(--accent)" : "var(--accent2)" },}
                      , g.winner === "player" ? "🏆 Win" : "😤 Loss"
                    )
                    , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginTop: 2 },}, "vs " , g.botName, " (L" , g.botLevel, ") · "  , g.date ? fmtShort(g.date) : "")
                  )
                  , React.createElement('div', { style: { textAlign: "right" },}
                    , React.createElement('div', { style: { fontSize: 13, color: "var(--text)", fontWeight: 600 },}
                      , g.playerSets !== undefined && g.playerSets + g.botSets > 0 ? `${g.playerSets}–${g.botSets} sets` : `${g.playerLegs}–${g.botLegs} legs`
                    )
                    , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginTop: 2 },}, "avg " , g.playerAvg)
                  )
                )
                , React.createElement('div', { style: { height: 4, background: "var(--surface2)", borderRadius: 100, overflow: "hidden" },}
                  , React.createElement('div', { style: { width: g.winner === "player" ? "100%" : "0%", height: "100%", background: g.winner === "player" ? "var(--accent)" : "var(--accent2)", borderRadius: 100 },})
                )
              )
            ))
          )
      )

      /* ── ACHIEVEMENTS TAB ── */
      , activeTab === "achievements" && (
        React.createElement('div', null
          /* Header stats */
          , React.createElement('div', { style: { background:"var(--glass-bg)", border:"1px solid rgba(232,118,63,.2)", borderTop:"2px solid rgba(232,118,63,.3)", borderRadius:"var(--radius)", padding:16, marginBottom:14, backdropFilter:"blur(12px)" },}
            , React.createElement('div', { style: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 },}
              , React.createElement('div', null
                , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:28, fontWeight:800, letterSpacing:"-0.04em", color:"var(--accent)", lineHeight:1 },}, unlockedCount, React.createElement('span', { style: { fontSize:16, color:"var(--muted)", fontWeight:500 },}, " / "  , ACHIEVEMENTS.length))
                , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", color:"var(--muted)", marginTop:4 },}, "Unlocked")
              )
              , React.createElement('div', { style: { textAlign:"right" },}
                , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:28, fontWeight:800, letterSpacing:"-0.04em", color:"var(--accent)", lineHeight:1 },}, Math.round((unlockedCount / ACHIEVEMENTS.length) * 100), "%")
                , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", color:"var(--muted)", marginTop:4 },}, "Complete")
              )
            )
            , React.createElement('div', { style: { height:4, background:"rgba(255,255,255,0.08)", borderRadius:100, overflow:"hidden" },}
              , React.createElement('div', { style: { height:"100%", width:`${(unlockedCount / ACHIEVEMENTS.length) * 100}%`, background:"linear-gradient(90deg,var(--accent),#f0a06a)", borderRadius:100, transition:"width .6s ease", boxShadow:"0 0 8px rgba(232,118,63,.35)" },} )
            )
          )

          /* Rarity legend */
          , React.createElement('div', { style: { display: "flex", gap: 12, marginBottom: 14, padding: "8px 12px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, flexWrap: "wrap" },}
            , Object.entries(RARITY_CONFIG).map(([k, r]) => (
              React.createElement('div', { key: k, style: { display: "flex", alignItems: "center", gap: 5 },}
                , React.createElement('div', { style: { width: 7, height: 7, borderRadius: "50%", background: r.color },} )
                , React.createElement('span', { style: { fontSize: 11, color: "var(--muted)" },}, r.label)
              )
            ))
          )

          /* Category filter */
          , React.createElement('div', { style: { display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10, marginBottom: 8 },}
            , achCategories.map(cat => (
              React.createElement('button', { key: cat, className: `filter-btn ${achCategory === cat ? "active" : ""}`, style: { flexShrink: 0, fontSize: 11 }, onClick: () => setAchCategory(cat),}, cat)
            ))
          )

          /* Achievement cards */
          , React.createElement('div', { style: { display: "flex", flexDirection: "column", gap: 8 },}
            , (achCategory === "All" ? ACHIEVEMENTS : ACHIEVEMENTS.filter(a => a.category === achCategory))
              .sort((a, b) => (unlockedAchievements[b.id] ? 1 : 0) - (unlockedAchievements[a.id] ? 1 : 0))
              .map(achievement => {
                var unlocked = !!unlockedAchievements[achievement.id];
                var r = RARITY_CONFIG[achievement.rarity];
                return (
                  React.createElement('div', { key: achievement.id, style: {
                    background: unlocked ? r.bg : "rgba(255,255,255,0.02)",
                    border: `1px solid ${unlocked ? r.color + "50" : "rgba(255,255,255,0.07)"}`,
                    borderRadius: 16, padding: "13px 15px",
                    display: "flex", alignItems: "center", gap: 13,
                    opacity: unlocked ? 1 : 0.42,
                    boxShadow: unlocked ? `0 0 16px ${r.glow}` : "none",
                    position: "relative", overflow: "hidden",
                  },}
                    /* Lock texture */
                    , !unlocked && React.createElement('div', { style: { position: "absolute", inset: 0, borderRadius: 16, background: "repeating-linear-gradient(45deg,transparent,transparent 12px,rgba(255,255,255,0.012) 12px,rgba(255,255,255,0.012) 24px)" },} )
                    /* Icon */
                    , React.createElement('div', { style: { fontSize: 28, width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center", background: unlocked ? `${r.color}18` : "rgba(255,255,255,0.04)", borderRadius: 13, flexShrink: 0, filter: unlocked ? `drop-shadow(0 0 8px ${r.color}88)` : "grayscale(1) brightness(0.4)" },}
                      , unlocked ? achievement.emoji : "🔒"
                    )
                    /* Text */
                    , React.createElement('div', { style: { flex: 1, minWidth: 0 },}
                      , React.createElement('div', { style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 3, flexWrap: "wrap" },}
                        , React.createElement('span', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:14, fontWeight:700, letterSpacing:"-0.01em", color: unlocked ? "var(--text)" : "rgba(255,255,255,0.3)" },}, achievement.name)
                        , React.createElement('span', { style: { fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "2px 6px", background: `${r.color}20`, color: r.color, borderRadius: 4 },}, r.label)
                      )
                      , React.createElement('div', { style: { fontSize: 12, color: "rgba(255,255,255,0.38)", lineHeight: 1.4 },}
                        , unlocked ? achievement.desc : "???"
                      )
                      , unlocked && unlockedAchievements[achievement.id] && (
                        React.createElement('div', { style: { fontSize: 10, color: r.color, marginTop: 3, opacity: 0.8 },}
                          , React.createElement(Ms, { icon: "check_circle", size: 12, fill: true,} ), " " , new Date(unlockedAchievements[achievement.id]).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                        )
                      )
                    )
                  )
                );
              })
            
          )
        )
      )

      /* ── DARTS IQ TAB ── */
      , activeTab === "iq" && (
        React.createElement('div', null
          /* Ring + score */
          , React.createElement('div', { style: { display: "flex", justifyContent: "center", margin: "8px 0 4px", position:"relative" },}
            /* Real board faintly behind IQ ring */
            , React.createElement('div', { style: { position:"absolute", width:170, height:170, borderRadius:"50%", overflow:"hidden", opacity:0.25, pointerEvents:"none" },}
              , React.createElement('img', { src: IMG_BOARD_HERO, alt: "", style: { width:"100%", height:"100%", objectFit:"cover", objectPosition:"center" },} )
            )
            , React.createElement('svg', { width: 170, height: 170, viewBox: "0 0 170 170"   , style: { position:"relative", zIndex:1 },}
              , React.createElement('circle', { cx: 85, cy: 85, r: 68, fill: "none", stroke: "rgba(255,255,255,0.07)", strokeWidth: 10,} )
              , React.createElement('circle', { cx: 85, cy: 85, r: 68, fill: "none", stroke: iqTier.color, strokeWidth: 10,
                strokeDasharray: `${(iqData.total / 1500) * (2 * Math.PI * 68)} ${2 * Math.PI * 68}`,
                strokeDashoffset: 2 * Math.PI * 68 * 0.25, strokeLinecap: "round",
                style: { filter: `drop-shadow(0 0 8px ${iqTier.color}88)`, transition: "stroke-dasharray 1s ease" },}
              )
              , React.createElement('text', { x: 85, y: 80, textAnchor: "middle", style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 36, fontWeight: 800, fill: "var(--text)", letterSpacing: -2 },}, iqData.total)
              , React.createElement('text', { x: 85, y: 97, textAnchor: "middle", style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fill: iqTier.color, fontWeight: 500, letterSpacing: 3 },}, "DARTS IQ" )
              , React.createElement('text', { x: 85, y: 113, textAnchor: "middle", style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 11, fontWeight: 600, fill: "rgba(255,255,255,0.4)" },}, iqTier.label)
            )
          )

          /* Next tier progress */
          , iqNextTier && (
            React.createElement('div', { style: { background:"var(--glass-bg)", border:"1px solid var(--glass-border)", borderRadius:"var(--radius)", padding:"14px 16px", marginBottom:14, backdropFilter:"blur(12px)" },}
              , React.createElement('div', { style: { display:"flex", justifyContent:"space-between", marginBottom:8 },}
                , React.createElement('span', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:13, fontWeight:600, color:"var(--text2)" },}, "Progress to "  , iqNextTier.emoji, " " , iqNextTier.label)
                , React.createElement('span', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:iqNextTier.color },}, iqPct, "%")
              )
              , React.createElement('div', { style: { height:5, background:"rgba(255,255,255,0.07)", borderRadius:100, overflow:"hidden" },}
                , React.createElement('div', { style: { height:"100%", width:`${iqPct}%`, background:`linear-gradient(90deg,${iqTier.color},${iqNextTier.color})`, borderRadius:100, transition:"width 1s ease" },} )
              )
              , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"var(--muted)", marginTop:5, letterSpacing:".03em" },}, iqNextTier.min - iqData.total, " pts to "   , iqNextTier.label)
            )
          )

          /* Pillar breakdown */
          , React.createElement('div', { style: { background:"var(--glass-bg)", border:"1px solid var(--glass-border)", borderRadius:"var(--radius)", padding:16, marginBottom:14, backdropFilter:"blur(12px)" },}
            , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", color:"var(--muted)", marginBottom:14 },}, "Score Breakdown" )
            , iqData.pillars.map(p => (
              React.createElement('div', { key: p.label, style: { marginBottom:14 },}
                , React.createElement('div', { style: { display:"flex", justifyContent:"space-between", marginBottom:6 },}
                  , React.createElement('div', { style: { display:"flex", alignItems:"center", gap:8 },}
                    , React.createElement('span', { style: { fontSize:14 },}, p.icon)
                    , React.createElement('span', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:13, fontWeight:700, color:"var(--text)", letterSpacing:"-0.01em" },}, p.label)
                  )
                  , React.createElement('div', { style: { display:"flex", alignItems:"baseline", gap:3 },}
                    , React.createElement('span', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:18, fontWeight:800, letterSpacing:"-0.03em", color:p.color },}, p.score)
                    , React.createElement('span', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"var(--muted)" },}, "/", p.max)
                  )
                )
                , React.createElement('div', { style: { height:5, background:"rgba(255,255,255,0.07)", borderRadius:100, overflow:"hidden" },}
                  , React.createElement('div', { style: { height:"100%", width:`${Math.round((p.score / p.max) * 100)}%`, background:`linear-gradient(90deg,${p.color}bb,${p.color})`, borderRadius:100, boxShadow:`0 0 6px ${p.color}55`, transition:"width 1s ease" },} )
                )
                , p.desc && React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:500, letterSpacing:".03em", color:"var(--muted)", marginTop:4 },}, p.desc)
              )
            ))
          )

          /* All tiers */
          , React.createElement('div', { style: { background:"var(--glass-bg)", border:"1px solid var(--glass-border)", borderRadius:"var(--radius)", padding:16, marginBottom:14, backdropFilter:"blur(12px)" },}
            , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", color:"var(--muted)", marginBottom:12 },}, "All Tiers" )
            , IQ_TIERS.map(t => {
              var active = iqData.total >= t.min && iqData.total <= t.max;
              var achieved = iqData.total > t.max;
              return (
                React.createElement('div', { key: t.label, style: { display: "flex", alignItems: "center", gap: 12, padding: "8px 10px", borderRadius: 10, marginBottom: 4, background: active ? `${t.color}15` : "transparent", border: `1px solid ${active ? t.color + "40" : "transparent"}` },}
                  , React.createElement('span', { style: { fontSize: 18, opacity: achieved || active ? 1 : 0.28 },}, t.emoji)
                  , React.createElement('div', { style: { flex: 1 },}
                    , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"-0.01em", color: active ? t.color : achieved ? "var(--text)" : "var(--muted)" },}
                      , t.label, " " , active && React.createElement('span', { style: { fontSize: 10, color: t.color },}, "← You are here"   )
                    )
                    , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)" },}, t.min, "–", t.max)
                  )
                  , (achieved || active) && React.createElement('span', { style: { fontSize: 12, color: t.color },}, achieved ? "✓" : iqData.total)
                )
              );
            })
          )

          /* How it's calculated */
          , React.createElement('div', { style: { padding: "13px 15px", background: "rgba(232,118,63,.04)", border: "1px solid rgba(232,118,63,.12)", borderRadius: "var(--radius)" },}
            , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(232,118,63,.6)", marginBottom: 7 },}, "How it's calculated"  )
            , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", lineHeight: 1.65 },}, "Five pillars totalling 1500 points. "
                   , React.createElement('strong', { style: { color: "var(--text)" },}, "Scoring"), " (35%) is based on your High Score and Bob's 27 best. "            , React.createElement('strong', { style: { color: "var(--text)" },}, "Finishing"), " (30%) tracks your doubles rate and checkout accuracy. "         , React.createElement('strong', { style: { color: "var(--text)" },}, "Match Play" ), " (15%) rewards beating higher bot levels. "       , React.createElement('strong', { style: { color: "var(--text)" },}, "Consistency"), " (15%) adds points for sessions and streaks. "        , React.createElement('strong', { style: { color: "var(--text)" },}, "Breadth"), " (5%) rewards playing across all game types. All pillars use logarithmic scaling — the top tiers genuinely require elite play."
            )
          )

          , React.createElement(ShareIQCard, { iqData: iqData, iqTier: iqTier, iqNextTier: iqNextTier, iqPct: iqPct,} )
        )
      )

      /* ── LEADERBOARD TAB ── */
      , activeTab === "leaderboard" && (
        React.createElement(LeaderboardTab, {
          authUser: authUser,
          history: history,
          botGames: botGames,
          dartsIQ: dartsIQ,}
        )
      )
    )
  );
}


// ─── LEADERBOARD TAB ─────────────────────────────────────────────────────────

function LeaderboardTab({ authUser, history, botGames, dartsIQ }) {
  var [activeGame, setActiveGame]   = useState("bobs-27");
  var [allTime, setAllTime]         = useState(false);
  var [entries, setEntries]         = useState([]);
  var [loading, setLoading]         = useState(true);
  var [lastRefresh, setLastRefresh] = useState(null);
  var weekKey    = getWeekKey();
  var gameConfig = LEADERBOARD_GAMES.find(g => g.id === activeGame);

  var fetchData = async () => {
    setLoading(true);
    var data = await fetchLeaderboard(activeGame, weekKey, allTime);
    setEntries(data);
    setLoading(false);
    setLastRefresh(new Date());
  };

  useEffect(() => { fetchData(); }, [activeGame, allTime]);

  // Find current user's rank
  var myEntry = authUser && authUser !== false
    ? entries.find(e => e.user_id === authUser.id)
    : null;
  var myRank = myEntry ? entries.indexOf(myEntry) + 1 : null;

  // Medal colours
  var medalColor = (i) => {
    if (i === 0) return { color: "#FFD700", bg: "rgba(255,215,0,0.12)",  border: "rgba(255,215,0,0.3)"  };
    if (i === 1) return { color: "#C0C0C0", bg: "rgba(192,192,192,0.1)", border: "rgba(192,192,192,0.25)" };
    if (i === 2) return { color: "#CD7F32", bg: "rgba(205,127,50,0.1)",  border: "rgba(205,127,50,0.25)" };
    return { color: "var(--muted)", bg: "transparent", border: "transparent" };
  };

  var rankEmoji = (i) => i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;

  return (
    React.createElement('div', null
      /* Header */
      , React.createElement('div', { style: { background: "linear-gradient(135deg,rgba(232,118,63,.08),rgba(168,255,120,.04))", border: "1px solid rgba(232,118,63,.2)", borderRadius: "var(--radius)", padding: "16px", marginBottom: 16 },}
        , React.createElement('div', { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },}
          , React.createElement('div', null
            , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--accent)", lineHeight: 1 },}, "Leaderboards")
            , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginTop: 3 },}
              , allTime ? "All-time best scores" : `This week · ${weekKey}`
            )
          )
          , myRank && (
            React.createElement('div', { style: { textAlign: "center", padding: "8px 12px", background: "rgba(232,118,63,.1)", border: "1px solid rgba(232,118,63,.25)", borderRadius: 12 },}
              , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--accent)", lineHeight: 1 },}, "#", myRank)
              , React.createElement('div', { style: { fontSize: 9, color: "var(--muted)", letterSpacing: 1, textTransform: "uppercase" },}, "Your Rank" )
            )
          )
        )

        /* Weekly / All-time toggle */
        , React.createElement('div', { style: { display: "flex", gap: 8, marginTop: 12 },}
          , React.createElement('button', { onClick: () => setAllTime(false), style: { flex: 1, padding: "7px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, background: !allTime ? "var(--accent)" : "rgba(255,255,255,0.07)", color: !allTime ? "var(--on-accent)" : "var(--muted)", transition: "all .2s" },}, "🗓 This Week"

          )
          , React.createElement('button', { onClick: () => setAllTime(true), style: { flex: 1, padding: "7px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, background: allTime ? "var(--accent)" : "rgba(255,255,255,0.07)", color: allTime ? "var(--on-accent)" : "var(--muted)", transition: "all .2s" },}, "🏆 All Time"

          )
        )
      )

      /* Game selector */
      , React.createElement('div', { style: { display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10, marginBottom: 14 },}
        , LEADERBOARD_GAMES.map(g => (
          React.createElement('button', { key: g.id, onClick: () => setActiveGame(g.id), style: { flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 100, border: `1px solid ${activeGame === g.id ? "var(--accent)" : "var(--border)"}`, background: activeGame === g.id ? "rgba(232,118,63,.1)" : "var(--surface)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: activeGame === g.id ? "var(--accent)" : "var(--muted)", transition: "all .2s" },}
            , React.createElement('span', null, g.icon), " " , g.label
          )
        ))
      )

      /* Entries */
      , loading ? (
        React.createElement('div', { style: { textAlign:"center", padding:"40px 0" },}
          , React.createElement(Ms, { icon: "hourglass_empty", size: 32, style: { color:"var(--muted)", marginBottom:10, display:"block", margin:"0 auto 10px" },} )
          , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", color:"var(--muted)" },}, "Loading scores…" )
        )
      ) : entries.length === 0 ? (
        React.createElement('div', { style: { textAlign:"center", padding:"40px 20px" },}
          , React.createElement('div', { style: { marginBottom:16 },}, React.createElement(DartboardSVG, { size: 90, muted: true,} ))
          , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:18, fontWeight:800, letterSpacing:"-0.01em", color:"var(--text)", marginBottom:6 },}, "No scores yet"  )
          , React.createElement('div', { style: { fontSize:13, color:"var(--muted)", lineHeight:1.5 },}
            , authUser && authUser !== false ? "Complete a session with this game to appear here." : "Create an account to appear on the leaderboard."
          )
        )
      ) : (
        React.createElement('div', { style: { display:"flex", flexDirection:"column", gap:8 },}
          , entries.map((entry, i) => {
            var isMe  = authUser && authUser !== false && entry.user_id === authUser.id;
            var medal = medalColor(i);
            var emoji = rankEmoji(i);
            return (
              React.createElement('div', { key: entry.user_id + i, style: { display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background: isMe ? "linear-gradient(135deg,rgba(232,118,63,.12),rgba(168,255,120,.06))" : i < 3 ? medal.bg : "var(--surface)", border:`1px solid ${isMe ? "rgba(232,118,63,.4)" : i < 3 ? medal.border : "var(--border)"}`, borderRadius:14 },}
                , React.createElement('div', { style: { width:32, textAlign:"center", flexShrink:0 },}
                  , emoji ? React.createElement('span', { style: { fontSize:22 },}, emoji) : React.createElement('span', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:20, color:"var(--muted)" },}, "#", i+1)
                )
                , React.createElement('div', { style: { flex:1, minWidth:0 },}
                  , React.createElement('div', { style: { fontSize:14, fontWeight:700, color: isMe ? "var(--accent)" : "var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },}
                    , entry.username || "Player", " " , isMe && React.createElement('span', { style: { fontSize:10, color:"var(--accent)", fontWeight:400 },}, "· You" )
                  )
                  , React.createElement('div', { style: { fontSize:11, color:"var(--muted)", marginTop:1 },}
                    , new Date(entry.created_at).toLocaleDateString("en-GB", { day:"numeric", month:"short" })
                  )
                )
                , React.createElement('div', { style: { textAlign:"right", flexShrink:0 },}
                  , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:24, fontWeight:800, letterSpacing:"-0.04em", color: isMe ? "var(--accent)" : i < 3 ? medal.color : "var(--text)", lineHeight:1 },}
                    , fmtScore(entry.score, activeGame)
                  )
                  , React.createElement('div', { style: { fontSize:10, color:"var(--muted)", marginTop:1 },}, _optionalChain([gameConfig, 'optionalAccess', _35 => _35.desc]))
                )
              )
            );
          })
        )
      )

      , (!authUser || authUser === false) && (
        React.createElement('div', { style: { marginTop:16, padding:"14px 16px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"var(--radius)", textAlign:"center" },}
          , React.createElement('div', { style: { fontSize:13, color:"var(--muted)", lineHeight:1.6 },}, "You're viewing as a guest. "
                 , React.createElement('span', { style: { color:"var(--accent)", fontWeight:600 },}, "Create an account"  ), " to appear on the leaderboard."
          )
        )
      )

      , authUser && authUser !== false && !myEntry && entries.length > 0 && (
        React.createElement('div', { style: { marginTop:12, padding:"12px 14px", background:"rgba(232,118,63,.05)", border:"1px solid rgba(232,118,63,.15)", borderRadius:12, fontSize:13, color:"var(--muted)", textAlign:"center" },}, "No score posted yet this "
               , allTime ? "season" : "week", ". Play a session to appear here."
        )
      )

      , lastRefresh && (
        React.createElement('div', { style: { display:"flex", justifyContent:"center", marginTop:14 },}
          , React.createElement('button', { onClick: fetchData, style: { background:"none", border:"1px solid var(--border)", borderRadius:10, padding:"7px 16px", color:"var(--muted)", fontSize:12, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" },}, "↺ Refresh · "
               , lastRefresh.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" })
          )
        )
      )
    )
  );
}

// ─── AI SYSTEM PROMPT ─────────────────────────────────────────────────────────

var AI_SYSTEM_PROMPT = `You are the Darts IQ Coach — a knowledgeable, encouraging, and no-nonsense darts training assistant built into the Darts IQ app. You speak like a real darts coach: direct, practical, focused on improvement. Keep responses concise and mobile-friendly — short paragraphs, easy to read on a phone screen. Never waffle.

THE APP — Darts IQ has these sections:
- Train tab: Game Library (browse all games with rules), My Programmes (create/edit training plans), start sessions, Daily Challenge
- Progress tab: Session history, Personal Bests per game with trend charts, Bot game win/loss record, Achievements gallery, Darts IQ Score, Global Leaderboards
- Play tab: X01 game vs AI bot (customisable format, 10 difficulty levels) or Friend vs Friend (pass the phone)
- AI Coach button (bottom right, always visible): that's you

HOW TO USE THE APP:
- To train: go to Train → My Programmes → tap + to create a programme → select games → tap Start Session
- To play the bot: tap Play tab → choose format, legs/sets, finish rule, difficulty → Start Match
- To play a friend: tap Play tab → Friend vs Friend → enter names → Bull Throw to decide who goes first
- To see progress: tap Progress tab → tabs: Sessions, My Stats, Bot Games, Achievements, Darts IQ, 🌍 Ranks (leaderboard)
- Programmes are saved permanently. All session history and bot games are saved permanently.

DAILY CHALLENGE:
- A new challenge appears every day, calibrated to the player's level
- Completing it extends your Daily Challenge Streak — separate from your training streak
- Challenges reset at midnight. Missing a day breaks your streak
- Completing 7 days straight unlocks the Daily Devotion achievement
- Challenge difficulty ranges from Normal to Hard to Legendary

DARTS IQ SCORE:
- A single number from 0–2000 that represents overall skill level
- Calculated from 5 pillars: Consistency (sessions + streak), Finishing (Bob's 27 + doubles %), Scoring (High Score benchmark), Match Play (bot win rate + max level beaten), Achievements (% of badges unlocked)
- Tiers: Beginner (0–299) → Club Starter (300–599) → Club Player (600–899) → Strong Club (900–1199) → League Player (1200–1499) → Advanced (1500–1799) → Elite (1800–2000)
- Score increases as you train, beat the bot at higher levels, and unlock achievements
- Shown on the Progress tab with a breakdown of all 5 pillars

ACHIEVEMENTS SYSTEM (38 total badges across 9 categories):
- Milestones: First Blood, Creature of Habit, Dedicated, Century Club
- Streaks: Getting Warm (3 days), On Fire (7 days), Unstoppable (30 days)
- Bob's 27: Bob's Apprentice (50+), Bob's Beast (100+), Bob's Legend (150+)
- Doubles: Double Vision (30%+), Double Trouble (50%+)
- Scoring: Club Standard (100+), Big Fish (150+), Maximum (180 — legendary)
- Finishing: Checkout Artist, Finisher
- Bot Games: Bot Beater, Level Up (beat L5+), World Class (beat L10 — legendary)
- Daily Challenges: Answer the Bell, Week Warrior, Monthly Grind, Daily Devotion, Clockwork (30-day daily streak — legendary), Hard Yards, Elite Task, Perfect Week
- Programmes: Programme Runner, In the Routine (5× same programme), Devoted (10×), Variety Pack (3 different programmes), Full House (all 5 categories in one session), No Quit, PB Session
- Rarities: Common, Uncommon, Rare, Legendary — locked gallery shows what you haven't unlocked yet

GAME LIBRARY — every game the app contains:
Around the Clock (4 levels): L1=any segment 1-20+bull, L2=doubles only, L3=trebles only, L4=Shanghai (hit S+D+T per number, 20min timer)
501/301/X01: standard format, double out or straight out
Cricket: close 15-20 and bull, 3 hits each
Shanghai: 7 rounds targeting 1-7, Shanghai=instant win
Halve-It: sequence 20/16/double/17/treble/18/bull — miss=score halved
Bob's 27: start 27pts, D1-D20+Dbull in order, hit=+points, miss=-points, bust=game over
Doubles Practice: D1-D20+Dbull, 3 darts each, record hits, track %
Trebles Practice: T1-T20, 3 darts each, track hits, key trebles T17-T20
Bullseye Challenge: 50 darts in 5 groups of 10, track inner+outer bull separately
High Score: 9 darts, max score, benchmark for raw scoring
121 (3 levels): L1=9 darts hit+1 miss-1, L2=9 darts hit+1 miss-2, L3=6 darts hit+1 miss-1. Drop below 100=game over
Finishing 50 (3 levels): 25 attempts, start 50. L1=hit+10, L2=hit+5, L3=hit+2. Miss always -1

BOT LEVELS (10 total):
L1 Pub Beginner ~28avg | L2 Social ~38avg | L3 Casual Club ~48avg | L4 Regular Club ~58avg | L5 Strong Club ~70avg | L6 League ~80avg | L7 County ~90avg | L8 Semi-Pro ~100avg | L9 Pro ~112avg | L10 World Class ~124avg

KEY CHECKOUT ROUTES (know these well):
170: T20 T20 Bull | 167: T20 T19 Bull | 160: T20 T20 D20 | 121: T20 T11 D10 or T19 T14 D5 | 100: T20 D20 | 81: T19 D12 | 61: T15 D8 | 41: 9 D16 | 40: D20 | 32: D16

TRAINING ADVICE YOU GIVE:
- Beginners: start with Around the Clock L1, High Score, and basic 501. Build consistency before doubles
- Intermediate: add Bob's 27, Doubles Practice, Finishing 50 L1. Focus on checkout conversion
- Advanced: Halve-It, Around the Clock L3+L4, 121 L2+L3. Track averages and push bot difficulty
- For doubles: Bob's 27 is the single best game. Do it every session. Track your score improving over time
- For scoring: Trebles Practice daily on T20/T19/T18/T17. High Score as a benchmark
- Programme structure: warm up first (Around the Clock L1 or High Score), end with your weakness
- 3-5 games per session is ideal. Quality over quantity
- For Darts IQ: the fastest way to raise your score is consistency (daily training) + finishing (Bob's 27 + doubles)
- For achievements: Bob's 27 unlocks 3 badges, Doubles Practice unlocks 2 — both are high-value for your IQ score too

BENCHMARKS TO SHARE:
- Doubles hit rate: beginner 15-25%, intermediate 30-45%, advanced 50%+
- Bob's 27 score: 0-50 developing, 50-100 solid, 100+ strong, 150+ excellent
- 501 leg: 35+ darts beginner, 25-35 club, 18-25 strong club, under 18 semi-pro
- 3-dart average: under 40 beginner, 40-60 club, 60-80 strong club, 80-100 county, 100+ semi-pro
- Darts IQ: under 300 beginner, 300-600 club starter, 600-900 club player, 900-1200 strong club, 1200+ league level

Be encouraging but honest. If someone is struggling, acknowledge it and give specific actionable advice. Never give generic motivational fluff. If someone asks about their Darts IQ or achievements, explain how to improve specific pillars.`;

var SUGGESTED_QUESTIONS = [
  "Build me a beginner training programme",
  "How do I improve my doubles?",
  "What's the best checkout route for 121?",
  "How do I raise my Darts IQ Score?",
  "Which achievements should I go for first?",
  "What does Bob's 27 train exactly?",
  "How do I improve my 3-dart average?",
  "Which games unlock the most achievements?",
];

// ─── CELEBRATION SCREEN ──────────────────────────────────────────────────────

function CelebrationScreen({ achievement, onDismiss }) {
  var r = RARITY_CONFIG[achievement.rarity];
  var particles = useRef(
    Array.from({ length: 52 }, (_, i) => ({
      id: i,
      left:  `${8 + Math.random() * 84}%`,
      top:   `${8 + Math.random() * 84}%`,
      size:  4 + Math.random() * 7,
      color: i % 4 === 0 ? r.color : i % 4 === 1 ? "#ffffff" : i % 4 === 2 ? "#ff9800" : "#f0a06a",
      delay: Math.random() * 0.65,
      angle: Math.random() * 360,
      dist:  100 + Math.random() * 160,
    }))
  ).current;

  return (
    React.createElement('div', { onClick: onDismiss, style: {
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.93)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      cursor: "pointer", overflow: "hidden",
    },}
      , React.createElement('style', null, `
        @keyframes cel-p { 0%{opacity:1;transform:translate(0,0) scale(1) rotate(0deg)} 100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(0.1) rotate(540deg)} }
        @keyframes cel-g { from{opacity:0.5;transform:scale(0.85)} to{opacity:1;transform:scale(1.2)} }
        @keyframes cel-pop { 0%{transform:scale(0) rotate(-15deg);opacity:0} 65%{transform:scale(1.3) rotate(4deg);opacity:1} 100%{transform:scale(1) rotate(0);opacity:1} }
        @keyframes cel-up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cel-ring { 0%{transform:scale(0.5);opacity:0.9} 100%{transform:scale(2.4);opacity:0} }
      `)

      /* Particles */
      , particles.map(p => (
        React.createElement('div', { key: p.id, style: {
          position: "absolute", left: p.left, top: p.top,
          width: p.size, height: p.size,
          borderRadius: p.id % 3 === 0 ? "50%" : "2px",
          background: p.color,
          "--dx": `${Math.cos(p.angle) * p.dist}px`,
          "--dy": `${Math.sin(p.angle) * p.dist}px`,
          animation: `cel-p 1.3s ${p.delay}s ease-out both`,
        },} )
      ))

      /* Glow */
      , React.createElement('div', { style: {
        position: "absolute", width: 480, height: 480, borderRadius: "50%",
        background: `radial-gradient(circle, ${r.glow} 0%, transparent 65%)`,
        animation: "cel-g 1.8s ease-in-out infinite alternate",
        pointerEvents: "none",
      },} )

      /* Ring burst */
      , React.createElement('div', { style: {
        position: "absolute", width: 180, height: 180, borderRadius: "50%",
        border: `3px solid ${r.color}`,
        animation: "cel-ring 0.9s ease-out 0.05s both",
        pointerEvents: "none",
      },} )

      /* Content */
      , React.createElement('div', { style: { position: "relative", textAlign: "center", padding: "0 28px", maxWidth: 360 },}
        , React.createElement('div', { style: {
          fontSize: 11, fontWeight: 700, letterSpacing: 3,
          textTransform: "uppercase", color: r.color, marginBottom: 16,
          animation: "cel-up 0.4s ease both",
        },}
          , r.label, " Achievement Unlocked"
        )

        , React.createElement('div', { style: {
          fontSize: 84, lineHeight: 1, marginBottom: 18,
          animation: "cel-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.05s both",
          filter: `drop-shadow(0 0 28px ${r.color})`,
          display: "block",
        },}
          , achievement.emoji
        )

        , React.createElement('div', { style: {
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 42, letterSpacing: 3, color: "#fff", lineHeight: 1,
          marginBottom: 12, animation: "cel-up 0.5s 0.12s ease both",
          textShadow: `0 0 40px ${r.color}88`,
        },}
          , achievement.name
        )

        , React.createElement('div', { style: {
          fontSize: 14, color: "rgba(255,255,255,0.52)",
          lineHeight: 1.6, marginBottom: 28,
          animation: "cel-up 0.5s 0.22s ease both",
        },}
          , achievement.desc
        )

        , React.createElement('div', { style: {
          display: "inline-block", padding: "4px 14px",
          background: `${r.color}18`, border: `1px solid ${r.color}44`,
          borderRadius: 100, fontSize: 11, color: r.color,
          marginBottom: 24, animation: "cel-up 0.5s 0.32s ease both",
        },}
          , achievement.category
        )

        , React.createElement('div', { style: {
          fontSize: 11, color: "rgba(255,255,255,0.22)",
          letterSpacing: 1, animation: "cel-up 0.5s 0.55s ease both",
        },}, "Tap anywhere to continue"

        )
      )
    )
  );
}

// ─── AI PAGE ─────────────────────────────────────────────────────────────────

function AIPage({ compact }) {
  var [messages, setMessages] = useState([]);
  var [input, setInput] = useState("");
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState(null);
  var bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  var sendMessage = async (text) => {
    var userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");
    setError(null);
    var newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      var { data, error: invokeError } = await supabase.functions.invoke("claude-proxy", {
        body: { model: "claude-sonnet-4-5", max_tokens: 1000, system: AI_SYSTEM_PROMPT, messages: newMessages },
      });
      if (invokeError) {
        throw new Error(_optionalChain([data, 'optionalAccess', _36 => _36.error, 'optionalAccess', _37 => _37.message]) || invokeError.message || "API error");
      }
      var reply = _optionalChain([data, 'access', _38 => _38.content, 'optionalAccess', _39 => _39.map, 'call', _40 => _40(b => b.text || ""), 'access', _41 => _41.join, 'call', _42 => _42("")]) || "Sorry, I could not generate a response.";
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(`Something went wrong: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  var handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  return (
    React.createElement('div', { style: { display: "flex", flexDirection: "column", height: compact ? "100%" : "100dvh", background: "var(--bg)" },}
      , !compact && (
        React.createElement('div', { style: { padding: "52px 16px 14px", borderBottom: "1px solid var(--border)", flexShrink: 0 },}
          , React.createElement('div', { style: { display: "flex", alignItems: "center", gap: 12 },}
            , React.createElement('div', { style: { width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg,var(--accent),#f0a06a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 },}, "🎯")
            , React.createElement('div', null
              , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text)", lineHeight: 1 },}, "Darts IQ AI"  )
              , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginTop: 2 },}, "Your personal darts coach"   )
            )
          )
        )
      )

      , React.createElement('div', { style: { flex: 1, overflowY: "auto", padding: "16px 16px 0", WebkitOverflowScrolling: "touch" },}
        , messages.length === 0 && (
          React.createElement('div', null
            , React.createElement('div', { style: { textAlign: "center", padding: "20px 0 24px" },}
              , React.createElement('div', { style: { fontSize: 52, marginBottom: 10 },}, "🎯")
              , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 6 },}, "Ask Me Anything"  )
              , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)", lineHeight: 1.55 },}, "Training plans, checkout routes, game rules, technique — I know it all."           )
            )
            , React.createElement('div', { style: { fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 },}, "Suggested Questions" )
            , React.createElement('div', { style: { display: "grid", gap: 8, paddingBottom: 16 },}
              , SUGGESTED_QUESTIONS.map((q, i) => (
                React.createElement('button', { key: i, onClick: () => sendMessage(q), style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 14px", textAlign: "left", color: "var(--text)", fontSize: 13, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", WebkitTapHighlightColor: "transparent", lineHeight: 1.4 },}
                  , q
                )
              ))
            )
          )
        )

        , messages.map((m, i) => (
          React.createElement('div', { key: i, style: { marginBottom: 14, display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" },}
            , m.role === "assistant" && (
              React.createElement('div', { style: { width: 26, height: 26, borderRadius: 8, background: "linear-gradient(135deg,var(--accent),#f0a06a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, marginBottom: 5 },}, "🎯")
            )
            , React.createElement('div', { style: { maxWidth: "88%", padding: "12px 14px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px", background: m.role === "user" ? "var(--accent)" : "var(--surface)", color: m.role === "user" ? "var(--on-accent)" : "var(--text)", border: m.role === "assistant" ? "1px solid var(--border)" : "none", fontSize: 14, lineHeight: 1.6, fontFamily: "'DM Sans',sans-serif", whiteSpace: "pre-wrap", wordBreak: "break-word" },}
              , m.content
            )
          )
        ))

        , loading && (
          React.createElement('div', { style: { marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 8 },}
            , React.createElement('div', { style: { width: 26, height: 26, borderRadius: 8, background: "linear-gradient(135deg,var(--accent),#f0a06a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 },}, "🎯")
            , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "4px 16px 16px 16px", padding: "14px 18px", display: "flex", gap: 5, alignItems: "center" },}
              , [0,1,2].map(i => (React.createElement('div', { key: i, style: { width: 7, height: 7, borderRadius: "50%", background: "var(--muted)", animation: `dlbounce 1.2s ${i*0.2}s infinite ease-in-out` },} )))
            )
          )
        )

        , error && (
          React.createElement('div', { style: { background: "rgba(194,72,63,.08)", border: "1px solid rgba(194,72,63,.3)", borderRadius: 12, padding: "12px 14px", marginBottom: 14, fontSize: 13, color: "var(--accent2)", textAlign: "center" },}, error)
        )
        , React.createElement('div', { ref: bottomRef, style: { height: 8 },} )
      )

      , React.createElement('div', { style: { padding: compact ? "10px 16px 16px" : "12px 16px 90px", borderTop: "1px solid var(--border)", background: "var(--bg)", flexShrink: 0 },}
        , messages.length > 0 && (
          React.createElement('button', { onClick: () => setMessages([]), style: { fontSize: 12, color: "var(--muted)", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginBottom: 10, padding: 0 },}, "+ New conversation"  )
        )
        , React.createElement('div', { style: { display: "flex", gap: 10, alignItems: "flex-end" },}
          , React.createElement('textarea', { value: input, onChange: e => setInput(e.target.value), onKeyDown: handleKey, placeholder: "Ask your darts coach..."   , rows: 1,
            style: { flex: 1, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 14px", fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--text)", outline: "none", resize: "none", maxHeight: 120, overflowY: "auto", lineHeight: 1.5 },} )
          , React.createElement('button', { onClick: () => sendMessage(), disabled: !input.trim() || loading,
            style: { width: 44, height: 44, borderRadius: 12, background: input.trim() && !loading ? "var(--accent)" : "var(--surface2)", border: "1px solid " + (input.trim() && !loading ? "var(--accent)" : "var(--border)"), color: input.trim() && !loading ? "var(--on-accent)" : "var(--muted)", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() && !loading ? "pointer" : "default", flexShrink: 0, transition: "all .15s" },}, "↑")
        )
        , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginTop: 8, textAlign: "center" },}, "Powered by Claude · Conversation resets when you leave this tab"          )
      )
      , React.createElement('style', null, `@keyframes dlbounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`)
    )
  );
}


// ─── X01 GAME ENGINE ─────────────────────────────────────────────────────────

var BOT_LEVELS = [
  { level:1,  name:"Pub Beginner",   avg:28,  checkoutPct:0.10, badChance:0.30, spread:0.55 },
  { level:2,  name:"Social Player",  avg:38,  checkoutPct:0.16, badChance:0.24, spread:0.48 },
  { level:3,  name:"Casual Club",    avg:48,  checkoutPct:0.23, badChance:0.19, spread:0.42 },
  { level:4,  name:"Regular Club",   avg:58,  checkoutPct:0.31, badChance:0.15, spread:0.36 },
  { level:5,  name:"Strong Club",    avg:70,  checkoutPct:0.39, badChance:0.12, spread:0.30 },
  { level:6,  name:"League Player",  avg:80,  checkoutPct:0.47, badChance:0.09, spread:0.25 },
  { level:7,  name:"County Level",   avg:90,  checkoutPct:0.55, badChance:0.07, spread:0.20 },
  { level:8,  name:"Semi-Pro",       avg:100, checkoutPct:0.63, badChance:0.05, spread:0.17 },
  { level:9,  name:"Pro",            avg:112, checkoutPct:0.72, badChance:0.03, spread:0.13 },
  { level:10, name:"World Class",    avg:124, checkoutPct:0.82, badChance:0.015,spread:0.10 },
];

var CHECKOUTS = {
  // 3-dart finishes — Red Dragon checkout table
  170:"T20 T20 Bull", 167:"T20 T19 Bull", 164:"T20 T18 Bull", 161:"T19 T18 Bull",
  160:"T20 T20 D20", 158:"T20 T20 D19", 157:"T19 T20 D20", 156:"T20 T20 D18",
  155:"T20 T19 D19", 154:"T19 T19 D20", 153:"T20 T19 D18", 152:"T20 T20 D16",
  151:"T20 T17 D20", 150:"T20 T20 D15", 149:"T20 T19 D16", 148:"T20 T20 D14",
  147:"T20 T17 D18", 146:"T20 T18 D16", 145:"T20 T15 D20", 144:"T20 T20 D12",
  143:"T20 T17 D16", 142:"T20 T14 D20", 141:"T20 T15 D18", 140:"T20 T20 D10",
  139:"T20 T13 D20", 138:"T20 T18 D12", 137:"T18 T17 D16", 136:"T20 T20 D8",
  135:"Bull T15 D20", 134:"T20 T14 D16", 133:"T20 T19 D8",  132:"T20 T16 D12",
  131:"T20 T13 D16", 130:"T20 T18 D8",  129:"T19 T16 D12", 128:"T18 T18 D10",
  127:"T20 T17 D8",  126:"T19 T19 D6",  125:"T20 T15 D10", 124:"T20 T16 D8",
  123:"T19 S16 Bull",122:"T18 T18 Bull", 121:"T20 T11 Bull",120:"T20 S20 D20",
  119:"T19 S12 Bull",118:"T20 S18 D20", 117:"T20 T17 D3",  116:"T19 S19 D20",
  115:"T20 S15 D20", 114:"T20 T14 D6",  113:"T20 T13 D7",  112:"T20 S20 D16",
  111:"T20 S19 D16", 110:"T20 S10 D20", 109:"T19 S12 D20", 108:"T19 S19 D16",
  107:"T19 S10 D20", 106:"T20 S10 D18", 105:"T20 S13 D16", 104:"T18 S18 D16",
  103:"T19 S10 D18", 102:"T20 S10 D16", 101:"T17 S10 D20", 100:"T20 D20",
  99:"T19 S10 D16",  98:"T20 D19",      97:"T19 D20",      96:"T20 D18",
  95:"T19 D19",      94:"T18 D20",      93:"T19 D18",      92:"T20 D16",
  91:"T17 D20",      90:"T18 D18",      89:"T19 D16",      88:"T20 D14",
  87:"T17 D18",      86:"T18 D16",      85:"T15 D20",      84:"T20 D12",
  83:"T17 D16",      82:"Bull D16",     81:"T15 D18",      80:"T20 D10",
  79:"T19 D11",      78:"T18 D12",      77:"T19 D10",      76:"T20 D8",
  75:"T17 D12",      74:"T14 D16",      73:"T19 D8",       72:"T16 D12",
  71:"T13 D16",      70:"T18 D8",       69:"T19 D6",       68:"T20 D4",
  67:"T17 D8",       66:"T10 D18",      65:"S25 D20",      64:"T16 D8",
  63:"T17 D6",       62:"T10 D16",      61:"T15 D8",       60:"S20 D20",
  59:"S19 D20",      58:"S18 D20",      57:"S17 D20",      56:"S16 D20",
  55:"S15 D20",      54:"S14 D20",      53:"S13 D20",      52:"S12 D20",
  51:"S11 D20",      50:"S10 D20",      49:"S9 D20",       48:"S16 D16",
  47:"S15 D16",      46:"S6 D20",       45:"S13 D16",      44:"S12 D16",
  43:"S3 D20",       42:"S10 D16",      41:"S9 D16",       40:"D20",
  38:"D19",          36:"D18",          34:"D17",          32:"D16",
  30:"D15",          28:"D14",          26:"D13",          24:"D12",
  22:"D11",          20:"D10",          18:"D9",           16:"D8",
  14:"D7",           12:"D6",           10:"D5",           8:"D4",
  6:"D3",            4:"D2",            2:"D1",
};

function getCheckoutHint(score, finishRule) {
  if (finishRule === "straight" && score <= 60) return `${score} — finish straight`;
  if (score < 2 || score > 170 || (finishRule === "double" && score === 1)) return null;
  if (CHECKOUTS[score]) return CHECKOUTS[score];
  if (score <= 40 && score % 2 === 0) return `D${score / 2}`;
  if (score <= 60) return `S${score - 40} D20`;
  return null;
}

function calcAvg(startScore, remaining, darts) {
  if (darts === 0) return 0;
  return Math.round(((startScore - remaining) / darts) * 3 * 10) / 10;
}

function generateBotVisit(botLevel, remaining, finishRule) {
  var bot = BOT_LEVELS[botLevel - 1];

  // Attempt checkout if possible
  var canFinish = finishRule === "straight" ? remaining <= 180 : remaining <= 170 && remaining >= 2;
  if (canFinish) {
    var boostNearFinish = remaining <= 32 ? 1.6 : remaining <= 60 ? 1.25 : 1.0;
    if (Math.random() < Math.min(0.95, bot.checkoutPct * boostNearFinish)) {
      return { score: remaining, checkout: true, comment: "Checkout!" };
    }
    // Missed checkout — score something that doesn't bust and ideally leaves a double
    if (remaining <= 60) {
      var safeLeaves = [32, 40, 36, 38, 20, 24, 16];
      for (var leave of safeLeaves) {
        var s = remaining - leave;
        if (s > 0 && s <= 60) return { score: s, checkout: false, comment: "" };
      }
      return { score: Math.max(0, remaining - 32), checkout: false, comment: "" };
    }
  }

  // Bad visit occasionally
  if (Math.random() < bot.badChance) {
    var badScore = Math.floor(Math.random() * bot.avg * 0.35);
    return { score: Math.min(badScore, remaining - (finishRule === "double" ? 2 : 0)), checkout: false, comment: "Bad visit" };
  }

  // Normal visit — bell-curve-ish distribution
  var r = (Math.random() + Math.random() + Math.random()) / 3;
  var variance = bot.avg * bot.spread;
  var score = Math.round(bot.avg + (r - 0.5) * variance * 2);
  score = Math.max(0, Math.min(score, 180));

  // Don't bust
  var minLeave = finishRule === "double" ? 2 : 0;
  if (score >= remaining) score = Math.max(0, remaining - minLeave - Math.floor(Math.random() * 10));

  return { score: Math.max(0, score), checkout: false, comment: "" };
}

function isValidFinish(score, finishRule) {
  if (finishRule === "straight") return score === 0;
  return score === 0; // player must input 0 intentionally when they checkout on a double
}

// ─── PLAY PAGE (X01 GAME ENGINE) ──────────────────────────────────────────────


// ─── FRIEND VS FRIEND GAME ────────────────────────────────────────────────────

function FriendSetup({ onStart, onBack }) {
  var [p1Name, setP1Name] = useState("Player 1");
  var [p2Name, setP2Name] = useState("Player 2");
  var [startScore, setStartScore] = useState(501);
  var [customScore, setCustomScore] = useState("");
  var [isSets, setIsSets] = useState(false);
  var [targetLegs, setTargetLegs] = useState(3);
  var [customLegs, setCustomLegs] = useState("");
  var [legsPerSet, setLegsPerSet] = useState(3);
  var [customLegsPerSet, setCustomLegsPerSet] = useState("");
  var [targetSets, setTargetSets] = useState(3);
  var [customSets, setCustomSets] = useState("");
  var [finishRule, setFinishRule] = useState("double");
  var finalScore = startScore === "custom" ? (parseInt(customScore) || 501) : startScore;
  var finalLegs = targetLegs === "custom" ? (parseInt(customLegs) || 3) : targetLegs;
  var finalSets = targetSets === "custom" ? (parseInt(customSets) || 3) : targetSets;
  var finalLegsPerSet = legsPerSet === "custom" ? (parseInt(customLegsPerSet) || 3) : legsPerSet;

  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement('div', { style: { paddingTop: 52, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },}
        , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text)" },}, "Play vs Friend"  )
        , React.createElement('button', { className: "back-btn", onClick: onBack,}, React.createElement(Ms, { icon: "arrow_back", size: 18,} ), " Back" )
      )

      /* Player names */
      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Player Names" )
        , React.createElement('div', { style: { display: "flex", gap: 10 },}
          , React.createElement('div', { style: { flex: 1 },}
            , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginBottom: 6, fontWeight: 600 },}, "Player 1" )
            , React.createElement('input', { className: "form-input", value: p1Name, onChange: e => setP1Name(e.target.value), placeholder: "Player 1" , maxLength: 14,} )
          )
          , React.createElement('div', { style: { flex: 1 },}
            , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginBottom: 6, fontWeight: 600 },}, "Player 2" )
            , React.createElement('input', { className: "form-input", value: p2Name, onChange: e => setP2Name(e.target.value), placeholder: "Player 2" , maxLength: 14,} )
          )
        )
      )

      /* Starting score */
      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Starting Score" )
        , React.createElement('div', { style: { display: "flex", gap: 8, flexWrap: "wrap" },}
          , [301, 501, 701].map(s => (
            React.createElement('button', { key: s, className: `filter-btn ${startScore === s ? "active" : ""}`, style: { flex: 1 }, onClick: () => setStartScore(s),}, s)
          ))
          , React.createElement('button', { className: `filter-btn ${startScore === "custom" ? "active" : ""}`, style: { flex: 1 }, onClick: () => setStartScore("custom"),}, "Custom")
        )
        , startScore === "custom" && (
          React.createElement('input', { className: "form-input", style: { marginTop: 10 }, type: "number", placeholder: "e.g. 401" , value: customScore, onChange: e => setCustomScore(e.target.value), min: "101", max: "1001",} )
        )
      )

      /* Format */
      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Match Format" )
        , React.createElement('div', { style: { display: "flex", gap: 8, marginBottom: 12 },}
          , React.createElement('button', { className: `filter-btn ${!isSets ? "active" : ""}`, style: { flex: 1 }, onClick: () => setIsSets(false),}, "Legs Only" )
          , React.createElement('button', { className: `filter-btn ${isSets ? "active" : ""}`, style: { flex: 1 }, onClick: () => setIsSets(true),}, "Sets & Legs"  )
        )
        , !isSets ? (
          React.createElement('div', null
            , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginBottom: 8 },}, "First to how many legs?"    )
            , React.createElement('div', { style: { display: "flex", gap: 6, flexWrap: "wrap" },}
              , [1,2,3,5,7,10,"custom"].map(n => (
                React.createElement('button', { key: n, className: `filter-btn ${targetLegs === n ? "active" : ""}`, onClick: () => setTargetLegs(n),}, n === "custom" ? "Other" : n)
              ))
            )
            , targetLegs === "custom" && (
              React.createElement('input', { className: "form-input", style: { marginTop: 10 }, type: "number", placeholder: "Enter number of legs"   , value: customLegs, onChange: e => setCustomLegs(e.target.value), min: "1", max: "99",} )
            )
          )
        ) : (
          React.createElement('div', null
            , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginBottom: 8 },}, "First to sets"  )
            , React.createElement('div', { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 },}
              , [2,3,4,5,6,7,"custom"].map(n => (
                React.createElement('button', { key: n, className: `filter-btn ${targetSets === n ? "active" : ""}`, onClick: () => setTargetSets(n),}, n === "custom" ? "Other" : n)
              ))
            )
            , targetSets === "custom" && (
              React.createElement('input', { className: "form-input", style: { marginTop: 0, marginBottom: 10 }, type: "number", placeholder: "Enter number of sets"   , value: customSets, onChange: e => setCustomSets(e.target.value), min: "1", max: "99",} )
            )
            , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginBottom: 8, marginTop: targetSets === "custom" ? 0 : 4 },}, "Legs per set"  )
            , React.createElement('div', { style: { display: "flex", gap: 6, flexWrap: "wrap" },}
              , [2,3,4,5,"custom"].map(n => (
                React.createElement('button', { key: n, className: `filter-btn ${legsPerSet === n ? "active" : ""}`, onClick: () => setLegsPerSet(n),}, n === "custom" ? "Other" : n)
              ))
            )
            , legsPerSet === "custom" && (
              React.createElement('input', { className: "form-input", style: { marginTop: 10 }, type: "number", placeholder: "Legs per set"  , value: customLegsPerSet, onChange: e => setCustomLegsPerSet(e.target.value), min: "1", max: "20",} )
            )
          )
        )
      )

      /* Finish rule */
      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Finish Rule" )
        , React.createElement('div', { style: { display: "flex", gap: 8 },}
          , React.createElement('button', { className: `filter-btn ${finishRule === "double" ? "active" : ""}`, style: { flex: 1 }, onClick: () => setFinishRule("double"),}, "Double Out" )
          , React.createElement('button', { className: `filter-btn ${finishRule === "straight" ? "active" : ""}`, style: { flex: 1 }, onClick: () => setFinishRule("straight"),}, "Straight Out" )
        )
        , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginTop: 8 },}
          , finishRule === "double" ? "Final dart must land in a double or bull." : "Reach exactly zero with any dart."
        )
      )

      /* Summary */
      , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, marginBottom: 16, textAlign: "center", fontSize: 13, color: "var(--muted)" },}
        , p1Name, " vs "  , p2Name, " · "  , finalScore, " · "  , isSets ? `First to ${finalSets} sets (${finalLegsPerSet} legs/set)` : `First to ${finalLegs} leg${finalLegs > 1 ? "s" : ""}`, " · "  , finishRule === "double" ? "Double out" : "Straight out"
      )

      , React.createElement('button', { className: "btn btn-primary btn-full"  ,
        disabled: !p1Name.trim() || !p2Name.trim() || (startScore === "custom" && (!customScore || parseInt(customScore) < 2)),
        onClick: () => onStart({ p1Name: p1Name.trim(), p2Name: p2Name.trim(), startScore: finalScore, isSets, targetLegs: finalLegs, legsPerSet: finalLegsPerSet, targetSets: finalSets, finishRule }),}, "Start Game →"

      )
    )
  );
}

// ─── STARTER SELECTION ───────────────────────────────────────────────────────
// Handles: coin toss, bull throw, or manual choice.
// Calls onDecided(1 | 2) with whoever throws first.

function StarterSelect({ p1Name, p2Name, onDecided }) {
  var [method, setMethod] = useState(null); // null | "coin" | "bull" | "choose"

  if (!method) return (
    React.createElement('div', { style: { position:"fixed", inset:0, background:"var(--bg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:32, zIndex:50 },}
      , React.createElement('div', { style: { fontSize:56, marginBottom:12 },}, "🎲")
      , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:22, fontWeight:800, letterSpacing:"-0.02em", color:"var(--text)", marginBottom:6 },}, "Who Goes First?"  )
      , React.createElement('div', { style: { fontSize:13, color:"var(--muted)", marginBottom:28 },}, "Choose how to decide who throws first"      )
      , React.createElement('div', { style: { display:"flex", flexDirection:"column", gap:12, width:"100%", maxWidth:300 },}
        , React.createElement('button', { className: "btn btn-primary" , onClick: () => setMethod("bull"),}, "🎯 Bull Throw"  )
        , React.createElement('button', { className: "btn btn-secondary" , onClick: () => setMethod("coin"),}, "🪙 Coin Toss"  )
        , React.createElement('button', { className: "btn btn-secondary" , onClick: () => setMethod("choose"),}, "👆 Choose Manually"  )
      )
    )
  );

  if (method === "coin") return React.createElement(CoinToss, { p1Name: p1Name, p2Name: p2Name, onDecided: onDecided,} );
  if (method === "bull") return React.createElement(BullThrow, { p1Name: p1Name, p2Name: p2Name, onDecided: onDecided,} );
  if (method === "choose") return (
    React.createElement('div', { style: { position:"fixed", inset:0, background:"var(--bg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:32, zIndex:50 },}
      , React.createElement('div', { style: { fontSize:56, marginBottom:12 },}, "👆")
      , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:22, fontWeight:800, letterSpacing:"-0.02em", color:"var(--text)", marginBottom:8 },}, "Choose Starter" )
      , React.createElement('div', { style: { fontSize:13, color:"var(--muted)", marginBottom:28 },}, "Who throws first?"  )
      , React.createElement('div', { style: { display:"flex", gap:12, width:"100%", maxWidth:320 },}
        , React.createElement('button', { className: "btn btn-primary" , style: { flex:1, fontSize:16, padding:"18px 0" }, onClick: () => onDecided(1),}, p1Name)
        , React.createElement('button', { className: "btn btn-primary" , style: { flex:1, fontSize:16, padding:"18px 0" }, onClick: () => onDecided(2),}, p2Name)
      )
    )
  );
  return null;
}

function CoinToss({ p1Name, p2Name, onDecided }) {
  var [flipping, setFlipping] = useState(false);
  var [result, setResult]     = useState(null); // null | "heads" | "tails"
  var [calling, setCalling]   = useState(null); // which player is calling
  var [call, setCall]         = useState(null); // "heads" | "tails"

  var flip = () => {
    setFlipping(true);
    setTimeout(() => {
      var outcome = Math.random() < 0.5 ? "heads" : "tails";
      setResult(outcome);
      setFlipping(false);
    }, 1200);
  };

  if (!calling) return (
    React.createElement('div', { style: { position:"fixed", inset:0, background:"var(--bg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:32, zIndex:50 },}
      , React.createElement('div', { style: { fontSize:56, marginBottom:12 },}, "🪙")
      , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:22, fontWeight:800, letterSpacing:"-0.02em", color:"var(--text)", marginBottom:8 },}, "Coin Toss" )
      , React.createElement('div', { style: { fontSize:13, color:"var(--muted)", marginBottom:28 },}, "Who calls it?"  )
      , React.createElement('div', { style: { display:"flex", gap:12, width:"100%", maxWidth:320 },}
        , React.createElement('button', { className: "btn btn-primary" , style: { flex:1 }, onClick: () => setCalling(1),}, p1Name)
        , React.createElement('button', { className: "btn btn-primary" , style: { flex:1 }, onClick: () => setCalling(2),}, p2Name)
      )
    )
  );

  if (!call) return (
    React.createElement('div', { style: { position:"fixed", inset:0, background:"var(--bg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:32, zIndex:50 },}
      , React.createElement('div', { style: { fontSize:56, marginBottom:12 },}, "🪙")
      , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:24, letterSpacing:2, color:"var(--text)", marginBottom:6 },}, calling === 1 ? p1Name : p2Name)
      , React.createElement('div', { style: { fontSize:13, color:"var(--muted)", marginBottom:28 },}, "Call it!" )
      , React.createElement('div', { style: { display:"flex", gap:12 },}
        , React.createElement('button', { className: "btn btn-primary" , style: { minWidth:120 }, onClick: () => { setCall("heads"); flip(); },}, "Heads")
        , React.createElement('button', { className: "btn btn-primary" , style: { minWidth:120 }, onClick: () => { setCall("tails"); flip(); },}, "Tails")
      )
    )
  );

  if (flipping) return (
    React.createElement('div', { style: { position:"fixed", inset:0, background:"var(--bg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:32, zIndex:50 },}
      , React.createElement('div', { style: { fontSize:72, marginBottom:16, animation:"spin 0.3s linear infinite" },}, "🪙")
      , React.createElement('div', { style: { fontSize:16, color:"var(--muted)" },}, "Flipping…")
      , React.createElement('style', null, `@keyframes spin { from{transform:rotateY(0deg)} to{transform:rotateY(360deg)} }`)
    )
  );

  // Show result
  var callerWon = call === result;
  var winner    = callerWon ? calling : (calling === 1 ? 2 : 1);
  var winnerName = winner === 1 ? p1Name : p2Name;

  return (
    React.createElement('div', { style: { position:"fixed", inset:0, background:"var(--bg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:32, zIndex:50 },}
      , React.createElement('div', { style: { fontSize:72, marginBottom:16 },}, result === "heads" ? "🪙" : "🟡")
      , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:32, letterSpacing:3, color:"var(--accent)", marginBottom:4 },}
        , result === "heads" ? "Heads!" : "Tails!"
      )
      , React.createElement('div', { style: { fontSize:16, color:"var(--text)", fontWeight:700, marginBottom:6 },}, winnerName, " throws first"  )
      , React.createElement('div', { style: { fontSize:13, color:"var(--muted)", marginBottom:28 },}
        , callerWon ? `${winnerName} called it right!` : `${winnerName} wins the toss`
      )
      , React.createElement('button', { className: "btn btn-primary" , style: { minWidth:200 }, onClick: () => onDecided(winner),}, "Start Match →"

      )
    )
  );
}

function InteractiveDartboard({ onSegmentTap }) {
  // Numbers in clockwise order starting from top
  var NUMBERS = [20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5];
  var cx = 150, cy = 150, total = 20;
  var angleStep = (2 * Math.PI) / total;
  var startAngle = -Math.PI / 2 - angleStep / 2;

  // Radii
  var R_BULL     = 12;
  var R_SBULL    = 25;
  var R_INNER_S  = 95;  // inner single (small bed)
  var R_TREBLE_O = 105;
  var R_OUTER_S  = 145; // outer single (big bed)
  var R_DOUBLE_O = 158;
  var R_BOARD    = 165;

  // Colours
  var COL_DARK   = "#1a1a14";
  var COL_LIGHT  = "#f5e6c8";
  var COL_RED    = "#c41e1e";
  var COL_GREEN  = "#1a7a1a";

  var segPath = (r1, r2, i) => {
    var a1 = startAngle + i * angleStep;
    var a2 = a1 + angleStep;
    var x1 = cx + r1 * Math.cos(a1), y1 = cy + r1 * Math.sin(a1);
    var x2 = cx + r2 * Math.cos(a1), y2 = cy + r2 * Math.sin(a1);
    var x3 = cx + r2 * Math.cos(a2), y3 = cy + r2 * Math.sin(a2);
    var x4 = cx + r1 * Math.cos(a2), y4 = cy + r1 * Math.sin(a2);
    return `M ${x1} ${y1} L ${x2} ${y2} A ${r2} ${r2} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${r1} ${r1} 0 0 0 ${x1} ${y1} Z`;
  };

  var labelPos = (r, i) => {
    var a = startAngle + (i + 0.5) * angleStep;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  return (
    React.createElement('svg', { viewBox: "0 0 300 300"   , style: { width:"100%", maxWidth:320, touchAction:"none", userSelect:"none", WebkitUserSelect:"none" },
      onClick: e => {
        var rect = e.currentTarget.getBoundingClientRect();
        var px = (e.clientX - rect.left) * (300 / rect.width);
        var py = (e.clientY - rect.top) * (300 / rect.height);
        var dx = px - cx, dy = py - cy;
        var dist = Math.sqrt(dx*dx + dy*dy);
        if (dist <= R_BULL) { onSegmentTap(50); return; }
        if (dist <= R_SBULL) { onSegmentTap(25); return; }
        if (dist > R_BOARD) { onSegmentTap(0); return; }
        var angle = Math.atan2(dy, dx) - startAngle;
        while (angle < 0) angle += 2*Math.PI;
        while (angle >= 2*Math.PI) angle -= 2*Math.PI;
        var idx = Math.floor(angle / angleStep) % total;
        var num = NUMBERS[idx];
        if (dist <= R_INNER_S) { onSegmentTap(num); return; }   // small single
        if (dist <= R_TREBLE_O) { onSegmentTap(num * 3); return; } // treble (score 3x but we just need "hit" here — use num for proximity)
        if (dist <= R_OUTER_S) { onSegmentTap(num); return; }   // big single
        if (dist <= R_DOUBLE_O) { onSegmentTap(num * 2); return; } // double
        onSegmentTap(num); // wire/border
      },}
      /* Board background */
      , React.createElement('circle', { cx: cx, cy: cy, r: R_BOARD, fill: "#111",} )

      /* Segments */
      , NUMBERS.map((num, i) => {
        var isEven = i % 2 === 0;
        return (
          React.createElement('g', { key: i,}
            /* Small single */
            , React.createElement('path', { d: segPath(R_SBULL, R_INNER_S, i), fill: isEven ? COL_DARK : COL_LIGHT, stroke: "#222", strokeWidth: "0.5",} )
            /* Treble */
            , React.createElement('path', { d: segPath(R_INNER_S, R_TREBLE_O, i), fill: isEven ? COL_RED : COL_GREEN, stroke: "#222", strokeWidth: "0.5",} )
            /* Big single */
            , React.createElement('path', { d: segPath(R_TREBLE_O, R_OUTER_S, i), fill: isEven ? COL_DARK : COL_LIGHT, stroke: "#222", strokeWidth: "0.5",} )
            /* Double */
            , React.createElement('path', { d: segPath(R_OUTER_S, R_DOUBLE_O, i), fill: isEven ? COL_RED : COL_GREEN, stroke: "#222", strokeWidth: "0.5",} )
          )
        );
      })

      /* Number labels */
      , NUMBERS.map((num, i) => {
        var pos = labelPos(R_DOUBLE_O + 9, i);
        return React.createElement('text', { key: i, x: pos.x, y: pos.y, textAnchor: "middle", dominantBaseline: "middle",
          style: { fontSize:9, fontWeight:700, fill:"#f0f0f0", fontFamily:"sans-serif" },}, num);
      })

      /* Outer bull (25) */
      , React.createElement('circle', { cx: cx, cy: cy, r: R_SBULL, fill: COL_GREEN, stroke: "#222", strokeWidth: "1",} )
      /* Inner bull (50) */
      , React.createElement('circle', { cx: cx, cy: cy, r: R_BULL, fill: COL_RED, stroke: "#222", strokeWidth: "1",} )

      /* Centre dot */
      , React.createElement('circle', { cx: cx, cy: cy, r: 3, fill: "#c2483f",} )
    )
  );
}

function BullThrow({ p1Name, p2Name, onDecided }) {
  var [phase, setPhase]     = useState("intro");
  var [p1Score, setP1Score] = useState(null);
  var [selected, setSelected] = useState(null); // what they tapped
  var p1ScoreRef = useRef(null);

  var scoreLabel = (val) => {
    if (val === 50) return "Bull (50)";
    if (val === 25) return "Single Bull (25)";
    if (val === 0)  return "Miss";
    // Check if it's a treble or double
    if (val > 20 && val % 3 === 0 && val <= 60) return `Treble ${val/3}`;
    if (val > 20 && val % 2 === 0 && val <= 40) return `Double ${val/2}`;
    return `${val}`;
  };

  var handleSegment = (val) => {
    haptic("hit");
    setSelected(val);
  };

  var confirmThrow = () => {
    if (selected === null) return;
    if (phase === "p1throw") {
      p1ScoreRef.current = selected;
      setP1Score(selected);
      setSelected(null);
      setPhase("p2throw");
    } else if (phase === "p2throw") {
      var p1 = p1ScoreRef.current;
      if (selected === p1 && selected > 0) {
        // Both hit same bull zone — throw again
        p1ScoreRef.current = null;
        setP1Score(null);
        setSelected(null);
        setPhase("tiebreak");
      } else if (selected === 0 && p1 === 0) {
        // Both missed — human judgment needed
        setSelected(null);
        setPhase("closer");
      } else {
        setPhase("result");
        setTimeout(() => onDecided(selected > p1 ? 2 : 1), 0);
      }
    }
  };

  if (phase === "intro") return (
    React.createElement('div', { style: { position:"fixed", inset:0, background:"var(--bg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:32, zIndex:50 },}
      , React.createElement('button', { onClick: () => onDecided(0), style: { position:"absolute", top:16, left:16, background:"none", border:"none", color:"var(--muted)", fontSize:14, fontFamily:"'DM Sans',sans-serif", cursor:"pointer", padding:"8px 12px" },}, React.createElement(Ms, { icon: "arrow_back", size: 18,} ), " Back" )
      , React.createElement('div', { style: { marginBottom:16 },}, React.createElement(DartboardSVG, { size: 96,} ))
      , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:26, fontWeight:800, letterSpacing:"-0.02em", color:"var(--text)", marginBottom:8 },}, "Bull Throw" )
      , React.createElement('div', { style: { fontSize:14, color:"var(--muted)", lineHeight:1.6, marginBottom:28 },}, "Each player throws one dart at the bull. Closest to the bull throws first. Inner bull beats outer bull."                  )
      , React.createElement('button', { className: "btn btn-primary" , style: { minWidth:200 }, onClick: () => setPhase("p1throw"),}, "Start — "  , p1Name, " throws first"  )
    )
  );

  if (phase === "tiebreak") return (
    React.createElement('div', { style: { position:"fixed", inset:0, background:"var(--bg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:32, zIndex:50 },}
      , React.createElement('button', { onClick: () => onDecided(0), style: { position:"absolute", top:16, left:16, background:"none", border:"none", color:"var(--muted)", fontSize:14, fontFamily:"'DM Sans',sans-serif", cursor:"pointer", padding:"8px 12px" },}, React.createElement(Ms, { icon: "arrow_back", size: 18,} ), " Back" )
      , React.createElement('div', { style: { fontSize:56, marginBottom:12 },}, "🔄")
      , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:22, fontWeight:800, letterSpacing:"-0.02em", color:"var(--accent)", marginBottom:8 },}, "Tie!")
      , React.createElement('div', { style: { fontSize:13, color:"var(--muted)", marginBottom:24 },}, "Both players scored the same. Throw again."      )
      , React.createElement('button', { className: "btn btn-primary" , style: { minWidth:200 }, onClick: () => setPhase("p1throw"),}, "Throw Again" )
    )
  );

  if (phase === "result") return null;

  var thrower = phase === "p1throw" ? p1Name : p2Name;

  // If both missed (both scored 0 or low number) show closer screen
  if (phase === "closer") {
    return (
      React.createElement('div', { style: { position:"fixed", inset:0, background:"var(--bg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:32, zIndex:50 },}
        , React.createElement('div', { style: { fontSize:56, marginBottom:12 },}, "🎯")
        , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:22, fontWeight:800, letterSpacing:"-0.02em", color:"var(--accent)", marginBottom:8 },}, "Who Was Closer?"  )
        , React.createElement('div', { style: { fontSize:14, color:"var(--muted)", lineHeight:1.6, marginBottom:28 },}, "Both players missed the bull area. Decide who was closest and tap their name."             )
        , React.createElement('div', { style: { display:"flex", gap:12, width:"100%" },}
          , React.createElement('button', { className: "btn btn-primary" , style: { flex:1, padding:"20px 0" }, onClick: () => { setPhase("result"); setTimeout(() => onDecided(1), 0); },}
            , React.createElement('div', { style: { fontSize:16 },}, p1Name)
            , React.createElement('div', { style: { fontSize:11, opacity:.7, marginTop:2 },}, "was closer" )
          )
          , React.createElement('button', { className: "btn btn-primary" , style: { flex:1, padding:"20px 0" }, onClick: () => { setPhase("result"); setTimeout(() => onDecided(2), 0); },}
            , React.createElement('div', { style: { fontSize:16 },}, p2Name)
            , React.createElement('div', { style: { fontSize:11, opacity:.7, marginTop:2 },}, "was closer" )
          )
        )
        , React.createElement('button', { className: "btn btn-secondary btn-full"  , style: { marginTop:10 }, onClick: () => { setP1Score(null); p1ScoreRef.current = null; setSelected(null); setPhase("p1throw"); },}, "↺ Throw Again Instead"

        )
      )
    );
  }

  return (
    React.createElement('div', { style: { position:"fixed", inset:0, background:"var(--bg)", zIndex:50, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 20px" },}

      /* Header */
      , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:14, letterSpacing:3, color:"var(--muted)", textTransform:"uppercase", marginBottom:4 },}, "Who Throws First?"  )
      , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:30, letterSpacing:2, color:"var(--text)", marginBottom:4 },}, thrower)
      , React.createElement('div', { style: { fontSize:13, color:"var(--muted)", marginBottom:16 },}, "Throw at the bull — tap your result below"        )

      , phase === "p2throw" && p1Score !== null && (
        React.createElement('div', { style: { fontSize:13, marginBottom:16, padding:"7px 16px", background:"var(--surface)", borderRadius:10, border:"1px solid var(--border)" },}
          , p1Name, ": " , React.createElement('span', { style: { color:"var(--accent)", fontWeight:700 },}, scoreLabel(p1Score))
        )
      )

      /* Three simple options */
      , React.createElement('div', { style: { display:"flex", flexDirection:"column", gap:12, width:"100%", maxWidth:320 },}
        , React.createElement('button', { onClick: () => { haptic("hit"); setSelected(50); },
          style: { padding:"22px 0", background: selected===50 ? "rgba(194,72,63,.25)" : "rgba(194,72,63,.1)", border:`2px solid ${selected===50?"#c2483f":"rgba(194,72,63,.4)"}`, borderRadius:18, cursor:"pointer", WebkitTapHighlightColor:"transparent", transition:"all .15s" },}
          , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:36, color:"#c2483f", lineHeight:1 },}, "BULL")
          , React.createElement('div', { style: { fontSize:12, color:"rgba(194,72,63,.8)", marginTop:4 },}, "Inner Bull — 50 points"    )
        )

        , React.createElement('button', { onClick: () => { haptic("hit"); setSelected(25); },
          style: { padding:"22px 0", background: selected===25 ? "rgba(240,173,78,.25)" : "rgba(240,173,78,.1)", border:`2px solid ${selected===25?"#f0ad4e":"rgba(240,173,78,.4)"}`, borderRadius:18, cursor:"pointer", WebkitTapHighlightColor:"transparent", transition:"all .15s" },}
          , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:36, color:"#f0ad4e", lineHeight:1 },}, "25")
          , React.createElement('div', { style: { fontSize:12, color:"rgba(240,173,78,.8)", marginTop:4 },}, "Single Bull — 25 points"    )
        )

        , React.createElement('button', { onClick: () => { haptic("miss"); setSelected(0); },
          style: { padding:"22px 0", background: selected===0 ? "rgba(255,255,255,.1)" : "rgba(255,255,255,.04)", border:`2px solid ${selected===0?"rgba(255,255,255,.4)":"rgba(255,255,255,.12)"}`, borderRadius:18, cursor:"pointer", WebkitTapHighlightColor:"transparent", transition:"all .15s" },}
          , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:36, color:"var(--muted)", lineHeight:1 },}, "MISS")
          , React.createElement('div', { style: { fontSize:12, color:"var(--muted)", marginTop:4 },}, "Missed the bull area"   )
        )
      )

      /* Confirm */
      , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: confirmThrow, disabled: selected === null,
        style: { marginTop:20, maxWidth:320, opacity: selected === null ? 0.4 : 1, transition:"opacity .2s" },}
        , selected !== null ? `Confirm — ${scoreLabel(selected)} →` : "Select your result first"
      )
    )
  );
}

function FriendGame({ config, onComplete, onExit }) {
  var { p1Name, p2Name, startScore, isSets, targetLegs, legsPerSet, targetSets, finishRule } = config;

  var [bullDone, setBullDone] = useState(false);
  var [p1Remaining, setP1Remaining] = useState(startScore);
  var [p2Remaining, setP2Remaining] = useState(startScore);
  var [p1Darts, setP1Darts] = useState(0);
  var [p2Darts, setP2Darts] = useState(0);
  var [p1Legs, setP1Legs] = useState(0);
  var [p2Legs, setP2Legs] = useState(0);
  var [p1Sets, setP1Sets] = useState(0);
  var [p2Sets, setP2Sets] = useState(0);
  var [p1LegsInSet, setP1LegsInSet] = useState(0);
  var [p2LegsInSet, setP2LegsInSet] = useState(0);
  // leg1Starter tracks who threw first in leg 1 (winner of bull throw)
  // Each leg strictly alternates from there
  var [leg1Starter, setLeg1Starter] = useState(1);
  var [legNumber, setLegNumber] = useState(1);
  // currentPlayer derived from leg alternation: odd legs = leg1Starter, even = other
  var legStarter = legNumber % 2 === 1 ? leg1Starter : (leg1Starter === 1 ? 2 : 1);
  var [currentPlayer, setCurrentPlayer] = useState(legStarter);
  var [visitInput, setVisitInput] = useState("");
  var [inputError, setInputError] = useState("");
  var [p1Visits, setP1Visits] = useState([]);
  var [p2Visits, setP2Visits] = useState([]);
  var [legWinner, setLegWinner] = useState(null);
  var [showHandoff, setShowHandoff] = useState(false);
  var [handoffName, setHandoffName] = useState("");
  var [checkoutPending, setCheckoutPending] = useState(null);
  // Per-leg dart tracking for accurate averages
  var [p1LegDarts, setP1LegDarts] = useState(0);
  var [p2LegDarts, setP2LegDarts] = useState(0);
  var [p1TotalDarts, setP1TotalDarts]   = useState(0);
  var [p2TotalDarts, setP2TotalDarts]   = useState(0);
  var [p1TotalScored, setP1TotalScored] = useState(0);
  var [p2TotalScored, setP2TotalScored] = useState(0);
  var [undoStack, setUndoStack]         = useState([]);
  // Doubles tracking
  var [p1DartsAtDouble, setP1DartsAtDouble] = useState(0);
  var [p2DartsAtDouble, setP2DartsAtDouble] = useState(0);
  var [p1DoublesHit, setP1DoublesHit]       = useState(0);
  var [p2DoublesHit, setP2DoublesHit]       = useState(0);
  var [doublePopupPending, setDoublePopupPending] = useState(null); // {player, remaining, isCheckout}
  var [confirmExit, setConfirmExit]   = useState(false);

  // ── Hooks must all be declared before any early returns ──────────────────
  var friendPrevRemainingRef = useRef(null);
  var _remaining = currentPlayer === 1 ? p1Remaining : p2Remaining;
  var _checkoutHint = getCheckoutHint(_remaining, finishRule);
  useEffect(() => {
    if (!bullDone) return; // don't fire before game starts
    if (_checkoutHint && _remaining !== friendPrevRemainingRef.current && _remaining > 0) {
      setTimeout(() => speak(`${currentPlayer === 1 ? p1Name : p2Name} requires ${_remaining}`), 700);
    }
    friendPrevRemainingRef.current = _remaining;
  }, [_remaining, currentPlayer, bullDone]);

  // Show starter selection first
  if (!bullDone) return (
    React.createElement(StarterSelect, { p1Name: p1Name, p2Name: p2Name, onDecided: (winner) => {
      setLeg1Starter(winner);
      setCurrentPlayer(winner);
      setBullDone(true);
    },} )
  );

  var p1AllDarts  = p1TotalDarts + p1LegDarts;
  var p2AllDarts  = p2TotalDarts + p2LegDarts;
  // Use running total scored + this leg's scored (startScore - remaining) for accurate mid-leg average
  var p1FullScored = p1TotalScored + (startScore - p1Remaining);
  var p2FullScored = p2TotalScored + (startScore - p2Remaining);
  var p1Avg       = p1AllDarts > 0 ? Math.round((p1FullScored / p1AllDarts) * 3 * 10) / 10 : 0;
  var p2Avg       = p2AllDarts > 0 ? Math.round((p2FullScored / p2AllDarts) * 3 * 10) / 10 : 0;
  var p1LegAvg    = p1LegDarts > 0 ? Math.round(((startScore - p1Remaining) / p1LegDarts) * 3 * 10) / 10 : 0;
  var p2LegAvg    = p2LegDarts > 0 ? Math.round(((startScore - p2Remaining) / p2LegDarts) * 3 * 10) / 10 : 0;
  var activeLegAvg = currentPlayer === 1 ? p1LegAvg : p2LegAvg;
  var remaining = currentPlayer === 1 ? p1Remaining : p2Remaining;
  var checkoutHint = getCheckoutHint(remaining, finishRule);

  var playerName = currentPlayer === 1 ? p1Name : p2Name;
  var otherName = currentPlayer === 1 ? p2Name : p1Name;

  var checkMatchWinner = (pl1, pl2, ps1, ps2) => {
    if (isSets) { if (ps1 >= targetSets) return 1; if (ps2 >= targetSets) return 2; }
    else { if (pl1 >= targetLegs) return 1; if (pl2 >= targetLegs) return 2; }
    return null;
  };

  var handleUndo = () => {
    if (undoStack.length === 0) return;
    var prev = undoStack[undoStack.length - 1];
    setUndoStack(s => s.slice(0, -1));
    setP1Remaining(prev.p1Remaining);
    setP2Remaining(prev.p2Remaining);
    setP1LegDarts(prev.p1LegDarts);
    setP2LegDarts(prev.p2LegDarts);
    setP1Visits(prev.p1Visits);
    setP2Visits(prev.p2Visits);
    setCurrentPlayer(prev.currentPlayer);
    setInputError("");
    setVisitInput("");
  };

  var handleSubmit = () => {
    var scored = parseInt(visitInput);
    if (isNaN(scored) || scored < 0 || scored > 180) { setInputError("Enter a valid score (0–180)"); return; }
    setInputError("");

    // Push full snapshot before committing
    setUndoStack(s => [...s, { p1Remaining, p2Remaining, p1LegDarts, p2LegDarts, p1Visits, p2Visits, currentPlayer }]);

    var newRemaining = remaining - scored;
    var bust = finishRule === "double" ? (newRemaining < 0 || newRemaining === 1) : newRemaining < 0;

    if (bust) {
      setInputError(`Bust! Score stays at ${remaining}`);
      setVisitInput("");
      if (currentPlayer === 1) setP1LegDarts(d => d + 3);
      else setP2LegDarts(d => d + 3);
      var nextPlayer = currentPlayer === 1 ? 2 : 1;
      setHandoffName(currentPlayer === 1 ? p2Name : p1Name);
      setShowHandoff(true);
      setTimeout(() => { setCurrentPlayer(nextPlayer); setShowHandoff(false); }, 1800);
      return;
    }

    // Record visit
    var visit = { score: scored, remaining: newRemaining };
    if (currentPlayer === 1) {
      setP1Visits(v => [...v, visit]);
      setP1LegDarts(d => d + 3);
      setP1Remaining(newRemaining);
    } else {
      setP2Visits(v => [...v, visit]);
      setP2LegDarts(d => d + 3);
      setP2Remaining(newRemaining);
    }
    setVisitInput("");

    if (newRemaining === 0) {
      // Checkout — show doubles popup first, then checkout dart selector
      setDoublePopupPending({
        player: currentPlayer, remaining: 0, isCheckout: true,
        checkoutSnapshot: {
          scored, newRemaining, currentPlayer,
          snap1Leg:    currentPlayer === 1 ? p1LegDarts + 3 : p1LegDarts,
          snap2Leg:    currentPlayer === 2 ? p2LegDarts + 3 : p2LegDarts,
          snap1Total:  p1TotalDarts,
          snap2Total:  p2TotalDarts,
          finishRoute: CHECKOUTS[newRemaining] || null,
        }
      });
      return;
    }

    // If remaining <= 50 trigger doubles popup before switching
    if (newRemaining <= 50 && newRemaining > 0) {
      setDoublePopupPending({ player: currentPlayer, remaining: newRemaining, isCheckout: false });
      return;
    }

    // Switch player with handoff screen
    var nextPlayer = currentPlayer === 1 ? 2 : 1;
    setHandoffName(nextPlayer === 1 ? p1Name : p2Name);
    setShowHandoff(true);
    setTimeout(() => { setCurrentPlayer(nextPlayer); setShowHandoff(false); }, 1800);
  };

  var handleDoublePopupFriend = (dartsUsed) => {
    if (!doublePopupPending) return;
    var { player, isCheckout, checkoutSnapshot } = doublePopupPending;
    if (player === 1) setP1DartsAtDouble(d => d + dartsUsed);
    else setP2DartsAtDouble(d => d + dartsUsed);
    setDoublePopupPending(null);

    if (isCheckout && checkoutSnapshot) {
      if (player === 1) setP1DoublesHit(h => h + 1);
      else setP2DoublesHit(h => h + 1);
      // Now show the checkout dart selector
      setCheckoutPending(checkoutSnapshot);
      return;
    }

    // Normal switch
    var nextPlayer = player === 1 ? 2 : 1;
    setHandoffName(nextPlayer === 1 ? p1Name : p2Name);
    setShowHandoff(true);
    setTimeout(() => { setCurrentPlayer(nextPlayer); setShowHandoff(false); }, 1800);
  };

  var confirmCheckout = (dartsUsed) => {
    if (!checkoutPending) return;
    // Read snapshot values stored in checkoutPending to avoid stale closures
    var { currentPlayer: winner, snap1Leg, snap2Leg, snap1Total, snap2Total } = checkoutPending;

    // Actual leg darts for the winner (replace assumed 3 with real count)
    var actual1Leg = winner === 1 ? snap1Leg - 3 + dartsUsed : snap1Leg;
    var actual2Leg = winner === 2 ? snap2Leg - 3 + dartsUsed : snap2Leg;

    // Commit leg darts into totals
    var new1Total = snap1Total + actual1Leg;
    var new2Total = snap2Total + actual2Leg;
    setP1TotalDarts(new1Total);
    setP2TotalDarts(new2Total);
    setP1LegDarts(0); setP2LegDarts(0);
    setCheckoutPending(null);

    // Compute fresh averages using committed totals
    var np1Rem = winner === 1 ? 0 : p1Remaining;
    var np2Rem = winner === 2 ? 0 : p2Remaining;

    var np1l = p1Legs, np2l = p2Legs, np1s = p1Sets, np2s = p2Sets;
    var np1ls = p1LegsInSet, np2ls = p2LegsInSet;
    if (winner === 1) {
      np1l = p1Legs + 1; np1ls = p1LegsInSet + 1;
      if (isSets && np1ls >= legsPerSet) { np1s = p1Sets + 1; np1ls = 0; np2ls = 0; }
      setP1Legs(np1l); setP1LegsInSet(np1ls);
      if (isSets) { setP1Sets(np1s); setP2LegsInSet(0); }
    } else {
      np2l = p2Legs + 1; np2ls = p2LegsInSet + 1;
      if (isSets && np2ls >= legsPerSet) { np2s = p2Sets + 1; np2ls = 0; np1ls = 0; }
      setP2Legs(np2l); setP2LegsInSet(np2ls);
      if (isSets) { setP2Sets(np2s); setP1LegsInSet(0); }
    }

    // Compute final averages from visit arrays
    var finalP1Scored = p1Visits.reduce((a, v) => a + (v.score || 0), 0);
    var finalP2Scored = p2Visits.reduce((a, v) => a + (v.score || 0), 0);
    var finalP1Avg = p1Visits.length > 0 ? Math.round(finalP1Scored / p1Visits.length * 10) / 10 : 0;
    var finalP2Avg = p2Visits.length > 0 ? Math.round(finalP2Scored / p2Visits.length * 10) / 10 : 0;

    var matchWinner = checkMatchWinner(np1l, np2l, np1s, np2s);
    // Voice callout
    speak(matchWinner ? "Game shot and the match" : "Game shot");
    if (matchWinner) {
      onComplete({ winner: matchWinner, winnerName: matchWinner === 1 ? p1Name : p2Name, p1Legs: np1l, p2Legs: np2l, p1Sets: np1s, p2Sets: np2s, p1Avg: finalP1Avg, p2Avg: finalP2Avg, p1Name, p2Name, p1DartsAtDouble, p2DartsAtDouble, p1DoublesHit, p2DoublesHit });
    } else {
      // Commit this leg's scored totals before resetting
      var thisLegP1 = p1Visits.reduce((a, v) => a + (v.score || 0), 0);
      var thisLegP2 = p2Visits.reduce((a, v) => a + (v.score || 0), 0);
      setP1TotalScored(prev => prev + thisLegP1);
      setP2TotalScored(prev => prev + thisLegP2);
      setP1Remaining(startScore); setP2Remaining(startScore);
      setP1Visits([]); setP2Visits([]);
      setLegWinner(winner);
    }
  };

  // Handoff screen — pass phone
  if (showHandoff) return (
    React.createElement('div', { style: { position: "fixed", inset: 0, background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 32 },}
      , React.createElement('div', { style: { fontSize: 64, marginBottom: 20 },}, "👥")
      , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, letterSpacing: 3, color: "var(--text)", marginBottom: 8 },}, "Hand it Over"  )
      , React.createElement('div', { style: { fontSize: 16, color: "var(--muted)", marginBottom: 20 },}, "Pass the phone to"   )
      , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 44, letterSpacing: 3, color: "var(--accent)" },}, handoffName)
    )
  );

  // Leg won screen
  if (legWinner) {
    var thisLegStarter = legNumber % 2 === 1 ? leg1Starter : (leg1Starter === 1 ? 2 : 1);
    var wasBreak = legWinner !== thisLegStarter;
    return (
    React.createElement('div', { className: "scroll-area",}
      , confirmExit && React.createElement(ExitConfirmModal, { onConfirm: onExit, onCancel: () => setConfirmExit(false),} )
      , React.createElement('div', { style: { paddingTop: 52, textAlign: "center", paddingBottom: 24 },}
        , React.createElement('div', { style: { fontSize: 64, marginBottom: 12 },}, wasBreak ? "💥" : "🎯")
        , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, letterSpacing: 3, color: wasBreak ? "var(--accent2)" : "var(--accent)", marginBottom: 6 },}
          , wasBreak ? "Break!" : "Leg Won!"
        )
        , React.createElement('div', { style: { fontSize: 18, color: "var(--text)", fontWeight: 600, marginBottom: 4 },}, legWinner === 1 ? p1Name : p2Name)
        , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)" },}
          , isSets ? `Sets: ${p1Name} ${p1Sets}–${p2Sets} ${p2Name}` : `Legs: ${p1Name} ${p1Legs}–${p2Legs} ${p2Name}`
        )
      )
      , React.createElement('div', { className: "stat-row",}
        , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, p1Avg), React.createElement('div', { className: "stat-lbl",}, p1Name, " Avg" ))
        , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, legNumber), React.createElement('div', { className: "stat-lbl",}, "Leg"))
        , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, p2Avg), React.createElement('div', { className: "stat-lbl",}, p2Name, " Avg" ))
      )
      , (() => {
        // Next leg: strictly alternate. Odd legs = leg1Starter, even = other
        var nextLegNum = legNumber + 1;
        var nextStarter = nextLegNum % 2 === 1 ? leg1Starter : (leg1Starter === 1 ? 2 : 1);
        var nextStarterName = nextStarter === 1 ? p1Name : p2Name;
        // Was this a break? Winner won on opponent's throw
        var thisLegStarter = legNumber % 2 === 1 ? leg1Starter : (leg1Starter === 1 ? 2 : 1);
        var isBreak = legWinner !== thisLegStarter;
        return (
          React.createElement(React.Fragment, null
            , isBreak && (
              React.createElement('div', { style: { background:"rgba(232,118,63,.1)", border:"1px solid rgba(232,118,63,.3)", borderRadius:12, padding:"10px 14px", marginBottom:12, textAlign:"center" },}
                , React.createElement('div', { style: { fontSize:14, fontWeight:700, color:"var(--accent)" },}, "💥 Break of Throw!"   )
                , React.createElement('div', { style: { fontSize:12, color:"var(--muted)", marginTop:3 },}, legWinner === 1 ? p1Name : p2Name, " won on the opponent's throw"     )
              )
            )
            , React.createElement('div', { style: { fontSize:13, color:"var(--muted)", textAlign:"center", marginBottom:12 },}
              , nextStarterName, " throws first in leg "     , nextLegNum
            )
            , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: () => {
              setP1Remaining(startScore); setP2Remaining(startScore);
              setP1LegDarts(0); setP2LegDarts(0);
              setP1Visits([]); setP2Visits([]);
              setLegWinner(null);
              var nl = legNumber + 1; setLegNumber(nl);
              var ns = nl % 2 === 1 ? leg1Starter : (leg1Starter === 1 ? 2 : 1);
              setCurrentPlayer(ns);
              setVisitInput(""); setInputError("");
            },}, "Next Leg →"  )
          )
        );
      })()
      , React.createElement('button', { className: "btn btn-secondary btn-full"  , style: { marginTop: 10 }, onClick: () => setConfirmExit(true),}, "Exit Match" )
    )
  );}

  // Main game screen
  return (
    React.createElement('div', { className: "scroll-area",}
      /* Checkout dart selector overlay */
      , doublePopupPending && (
        React.createElement(DartsAtDoublePopup, {
          remaining: doublePopupPending.remaining,
          onConfirm: handleDoublePopupFriend,}
        )
      )
      , !doublePopupPending && checkoutPending && React.createElement(CheckoutDartSelector, { score: checkoutPending.scored, finishRoute: checkoutPending.finishRoute, onConfirm: confirmCheckout,} )
      , confirmExit && React.createElement(ExitConfirmModal, { onConfirm: onExit, onCancel: () => setConfirmExit(false),} )

      , React.createElement('div', { style: { paddingTop: 52, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },}
        , React.createElement('button', { className: "back-btn", onClick: () => setConfirmExit(true),}, "✕ Exit" )
        , React.createElement('div', { style: { textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)" },}
            , isSets ? `Sets ${p1Sets}–${p2Sets}` : `Legs ${p1Legs}–${p2Legs}`
          )
          , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginTop: 2 },}, "Leg " , legNumber, " · "  , startScore, " · "  , finishRule === "double" ? "D-out" : "Straight")
        )
        , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)" },}, "🎯")
      )

      /* Scoreboard with dual averages */
      , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 },}
        , [
          { name: p1Name, rem: p1Remaining, gameAvg: p1Avg, legAvg: p1LegAvg, legDarts: p1LegDarts, visits: p1Visits, isActive: currentPlayer === 1 },
          { name: p2Name, rem: p2Remaining, gameAvg: p2Avg, legAvg: p2LegAvg, legDarts: p2LegDarts, visits: p2Visits, isActive: currentPlayer === 2 },
        ].map((p, i) => (
          React.createElement('div', { key: i, style: {
            background: p.isActive ? "linear-gradient(135deg,rgba(232,118,63,.10),rgba(168,255,120,.05))" : "var(--surface)",
            border: `1px solid ${p.isActive ? "rgba(232,118,63,.4)" : "var(--border)"}`,
            borderRadius: "var(--radius)", padding: "14px 12px", textAlign: "center", transition: "all .3s",
          },}
            , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: p.isActive ? "var(--accent)" : "var(--muted)", marginBottom: 4 },}
              , p.isActive ? "🎯 " : "", p.name
            )
            , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 52, letterSpacing: 3, color: "var(--text)", lineHeight: 1 },}, p.rem)
            , React.createElement('div', { style: { display: "flex", gap: 4, justifyContent: "center", marginTop: 6 },}
              , React.createElement('div', { style: { background: p.isActive ? "rgba(232,118,63,.1)" : "var(--surface2)", borderRadius: 8, padding: "2px 6px" },}
                , React.createElement('div', { style: { fontSize: 8, color: p.isActive ? "var(--accent)" : "var(--muted)", fontWeight: 700, letterSpacing: 1 },}, "LEG")
                , React.createElement('div', { style: { fontSize: 12, fontWeight: 700, color: p.isActive ? "var(--accent)" : "var(--text)" },}, p.legAvg)
              )
              , React.createElement('div', { style: { background: "var(--surface2)", borderRadius: 8, padding: "2px 6px" },}
                , React.createElement('div', { style: { fontSize: 8, color: "var(--muted)", fontWeight: 700, letterSpacing: 1 },}, "GAME")
                , React.createElement('div', { style: { fontSize: 12, fontWeight: 700, color: "var(--text)" },}, p.gameAvg)
              )
              , React.createElement('div', { style: { background: "var(--surface2)", borderRadius: 8, padding: "2px 6px" },}
                , React.createElement('div', { style: { fontSize: 8, color: "var(--muted)", fontWeight: 700, letterSpacing: 1 },}, "DARTS")
                , React.createElement('div', { style: { fontSize: 12, fontWeight: 700, color: "var(--text)" },}, p.legDarts)
              )
            )
            , p.visits.length > 0 && (
              React.createElement('div', { style: { marginTop: 6, padding: "3px 8px", borderRadius: 8, display: "inline-block", background: "var(--surface2)", fontSize: 13, fontWeight: 700, color: "var(--text)" },}, "+"
                , p.visits[p.visits.length-1].score
              )
            )
          )
        ))
      )

      /* Checkout hint inline */
      , checkoutHint && (
        React.createElement('div', { style: { background: "rgba(232,118,63,.08)", border: "1px solid rgba(232,118,63,.3)", borderRadius: 12, padding: "8px 14px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" },}
          , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, color: "var(--accent)" },}, "💡 " , remaining)
          , React.createElement('div', { style: { fontSize: 14, fontWeight: 700, color: "var(--text)" },}, checkoutHint)
        )
      )

      /* Undo + Numpad */
      , undoStack.length > 0 && (
        React.createElement('button', { onClick: handleUndo, style: {
          width: "100%", padding: "11px", marginBottom: 8,
          background: "rgba(194,72,63,.08)", border: "1px solid rgba(194,72,63,.25)",
          borderRadius: 14, cursor: "pointer", color: "var(--accent2)",
          fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          WebkitTapHighlightColor: "transparent",
        },}, "↩ Undo Last Visit"

        )
      )
      , React.createElement('div', { style: { marginBottom: 4, fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: 1, textTransform: "uppercase" },}, "🎯 "
         , playerName, "'s Visit"
      )
      , React.createElement(Numpad, {
        value: visitInput,
        onChange: v => { setVisitInput(v); setInputError(""); },
        onSubmit: handleSubmit,
        disabled: false,
        submitLabel: "Submit & Pass Phone →"    ,
        error: inputError,
        remaining: remaining,}
      )


    )
  );
}

function FriendResult({ result, config, onPlayAgain, onExit }) {
  var { winnerName, p1Name, p2Name, p1Legs, p2Legs, p1Sets, p2Sets, p1Avg, p2Avg, p1DartsAtDouble, p2DartsAtDouble, p1DoublesHit, p2DoublesHit } = result;
  var [coachInsight, setCoachInsight] = React.useState(null);
  var [coachLoading, setCoachLoading] = React.useState(true);
  React.useEffect(() => {
    getMatchInsight({ type:"friend", p1Name, p2Name, p1Avg, p2Avg, p1Legs, p2Legs, p1DartsAtDouble, p1DoublesHit, p2DartsAtDouble, p2DoublesHit })
      .then(insight => { setCoachInsight(insight); setCoachLoading(false); })
      .catch(() => setCoachLoading(false));
  }, []);
  var loserName = winnerName === p1Name ? p2Name : p1Name;
  var winnerAvg = winnerName === p1Name ? p1Avg : p2Avg;
  var loserAvg = winnerName === p1Name ? p2Avg : p1Avg;

  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement('div', { style: { paddingTop: 52, textAlign: "center", paddingBottom: 24 },}
        , React.createElement('div', { style: { fontSize: 72, marginBottom: 16 },}, "🏆")
        , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--accent)", marginBottom: 6 },}, winnerName)
        , React.createElement('div', { style: { fontSize: 16, color: "var(--text)", fontWeight: 600, marginBottom: 4 },}, "Wins the match!"  )
        , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)" },}
          , config.isSets ? `${p1Sets}–${p2Sets} sets` : `${p1Legs}–${p2Legs} legs`
        )
      )

      , React.createElement('div', { className: "stat-row",}
        , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, winnerAvg), React.createElement('div', { className: "stat-lbl",}, winnerName, " Avg" ))
        , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, config.isSets ? `${p1Sets}–${p2Sets}` : `${p1Legs}–${p2Legs}`), React.createElement('div', { className: "stat-lbl",}, "Score"))
        , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, loserAvg), React.createElement('div', { className: "stat-lbl",}, loserName, " Avg" ))
      )
      /* Doubles % for both players */
      , (p1DartsAtDouble > 0 || p2DartsAtDouble > 0) && (
        React.createElement('div', { style: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 },}
          , [{name:p1Name, darts:p1DartsAtDouble, hits:p1DoublesHit},{name:p2Name, darts:p2DartsAtDouble, hits:p2DoublesHit}].map((p,i) => (
            React.createElement('div', { key: i, style: { background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:"12px 8px", textAlign:"center" },}
              , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color:"var(--accent)" },}, p.darts > 0 ? `${Math.round(p.hits/p.darts*100)}%` : "—")
              , React.createElement('div', { style: { fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:"var(--muted)", marginTop:2 },}, p.name, " Doubles" )
              , React.createElement('div', { style: { fontSize:11, color:"var(--muted)", marginTop:2 },}, p.hits, "/", p.darts, " hit" )
            )
          ))
        )
      )

      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Match Summary" )
        , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, textAlign: "center" },}
          , [
            { name: p1Name, legs: p1Legs, sets: p1Sets, avg: p1Avg, won: winnerName === p1Name },
            { name: p2Name, legs: p2Legs, sets: p2Sets, avg: p2Avg, won: winnerName === p2Name },
          ].map((p, i) => (
            React.createElement('div', { key: i, style: { padding: "14px 10px", background: p.won ? "rgba(232,118,63,.08)" : "var(--surface2)", border: `1px solid ${p.won ? "rgba(232,118,63,.3)" : "var(--border)"}`, borderRadius: 12 },}
              , React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: p.won ? "var(--accent)" : "var(--muted)", marginBottom: 6 },}
                , p.won ? "🏆 " : "", p.name
              )
              , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, color: p.won ? "var(--accent)" : "var(--text)" },}
                , config.isSets ? p.sets : p.legs
              )
              , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginBottom: 8 },}, config.isSets ? "sets" : "legs")
              , React.createElement('div', { style: { fontSize: 18, fontWeight: 600, color: p.won ? "var(--accent)" : "var(--muted)" },}, p.avg)
              , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)" },}, "average")
            )
          ))
        )
        , React.createElement('div', { style: { marginTop: 14, padding: "10px 14px", background: "var(--surface2)", borderRadius: 10, fontSize: 13, color: "var(--muted)", lineHeight: 1.5, textAlign: "center" },}
          , winnerAvg > loserAvg
            ? `${winnerName} outscored ${loserName} — well played!`
            : `${loserName} actually averaged more, but ${winnerName} closed out better. Good match.`
        )
      )

      /* AI Coaching */
      , React.createElement('div', { style: { background:"var(--surface)", border:"1px solid rgba(232,118,63,.2)", borderRadius:"var(--radius)", padding:16, marginBottom:14 },}
        , React.createElement('div', { style: { fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"rgba(232,118,63,.7)", marginBottom:8 },}, React.createElement(Ms, { icon: "psychology", size: 14, fill: true,} ), " Coach Insight"  )
        , coachLoading
          ? React.createElement('div', { style: { display:"flex", alignItems:"center", gap:10 },}
              , React.createElement('div', { style: { width:16, height:16, border:"2px solid rgba(232,118,63,.2)", borderTopColor:"var(--accent)", borderRadius:"50%", animation:"spin .9s linear infinite", flexShrink:0 },} )
              , React.createElement('div', { style: { fontSize:13, color:"var(--muted)" },}, "Analysing your match…"  )
            )
          : coachInsight
            ? React.createElement('div', { style: { fontSize:14, color:"var(--text2)", lineHeight:1.65 },}, coachInsight)
            : React.createElement('div', { style: { fontSize:13, color:"var(--muted)" },}, "Keep playing to unlock insights."    )
        
      )
      , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: onPlayAgain,}, "🎯 Play Again"  )
      , React.createElement('button', { className: "btn btn-secondary btn-full"  , style: { marginTop: 10 }, onClick: onExit,}, React.createElement(Ms, { icon: "arrow_back", size: 18,} ), " Back" )
    )
  );
}

function PlayPage({ onClose, onGameComplete, onGameStart, onGameEnd, embedded }) {
  var [mode, setMode] = useState(null); // null | "bot" | "friend"
  var [phase, setPhase] = useState("setup");
  var [config, setConfig] = useState(null);
  var [result, setResult] = useState(null);

  // Mode selection screen
  var MODES = [
    { id:"bot",      icon:"🤖", label:"VS Bot",     sub:"AI opponent · 10 difficulty levels", color:"#e8763f", features:["Pub Beginner","Club Player","Semi-Pro","World Class"] },
    { id:"friend",   icon:"👥", label:"VS Friend",  sub:"Pass the phone between players",      color:"#c2483f", features:["Custom names","Any format","Legs or Sets","Stats tracked"] },
    { id:"xo",       icon:"⭕", label:"X's & O's",  sub:"Checkout noughts & crosses",          color:"#a855f7", features:["3×3 grid","Choose your square","Strategic bot","10 levels"] },
    { id:"penalties",icon:"⚽", label:"Penalties",  sub:"5 random targets — first to 3 wins", color:"#f0ad4e", features:["Random targets","5 penalties","First to 3","vs Bot or Friend"] },
  ];

  if (!mode) return (
    React.createElement('div', { className: "scroll-area",}
      /* Top bar */
      , React.createElement('div', { className: "top-bar",}
        , React.createElement('span', { className: "top-bar-title",}, "Play")
        , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"var(--muted)", letterSpacing:".05em" },}, "Choose mode" )
      )

      , React.createElement('div', { style: { display:"flex", flexDirection:"column", gap:10, marginTop:12 },}
        , MODES.map(m => (
          React.createElement('div', { key: m.id, onClick: () => setMode(m.id),
            style: { background:"var(--glass-bg)", border:`1px solid ${m.color}30`, borderLeft:`3px solid ${m.color}`, borderRadius:"var(--radius)", padding:18, cursor:"pointer", WebkitTapHighlightColor:"transparent", backdropFilter:"blur(12px)", boxShadow:"var(--shadow-card)", transition:"transform .15s" },
            onTouchStart: e => e.currentTarget.style.transform="scale(.98)",
            onTouchEnd: e => e.currentTarget.style.transform="scale(1)",}
            , React.createElement('div', { style: { display:"flex", alignItems:"center", gap:14, marginBottom:10 },}
              , React.createElement('div', { style: { width:48, height:48, borderRadius:14, background:`${m.color}15`, border:`1px solid ${m.color}25`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 },}, m.icon)
              , React.createElement('div', null
                , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:18, fontWeight:800, letterSpacing:"-0.02em", color:"var(--text)", lineHeight:1 },}, m.label)
                , React.createElement('div', { style: { fontSize:12, color:"var(--muted)", marginTop:4 },}, m.sub)
              )
              , React.createElement('div', { style: { marginLeft:"auto", color:"var(--muted)", fontSize:18 },}, "›")
            )
            , React.createElement('div', { style: { display:"flex", gap:5, flexWrap:"wrap" },}
              , m.features.map(f => (
                React.createElement('span', { key: f, style: { fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", padding:"2px 8px", borderRadius:100, background:`${m.color}10`, color:m.color, border:`1px solid ${m.color}25` },}, f)
              ))
            )
          )
        ))
      )
    )
  );

  // Bot flow
  if (mode === "bot") {
    if (phase === "setup") return React.createElement(X01Setup, { onStart: cfg => { setConfig({...cfg, mode:"bot"}); setPhase("game"); if (onGameStart) onGameStart(); }, onClose: () => setMode(null),} );
    if (phase === "game") return React.createElement(X01Game, { config: config, onComplete: res => { setResult(res); setPhase("result"); if (onGameEnd) onGameEnd(); if (onGameComplete) onGameComplete(res); }, onExit: () => { setMode(null); if (onGameEnd) onGameEnd(); },} );
    if (phase === "result") return React.createElement(X01Result, { result: result, config: config, onPlayAgain: () => { setPhase("setup"); if (onGameStart) onGameStart(); }, onExit: () => { setMode(null); setPhase("setup"); if (onGameEnd) onGameEnd(); },} );
  }

  // Friend flow
  if (mode === "friend") {
    if (phase === "setup") return React.createElement(FriendSetup, { onStart: cfg => { setConfig({...cfg, mode:"friend"}); setPhase("game"); if (onGameStart) onGameStart(); }, onBack: () => setMode(null),} );
    if (phase === "game") return React.createElement(FriendGame, { config: config, onComplete: res => { setResult(res); setPhase("result"); if (onGameEnd) onGameEnd(); }, onExit: () => { setMode(null); if (onGameEnd) onGameEnd(); },} );
    if (phase === "result") return React.createElement(FriendResult, { result: result, config: config, onPlayAgain: () => { setPhase("setup"); if (onGameStart) onGameStart(); }, onExit: () => { setMode(null); setPhase("setup"); if (onGameEnd) onGameEnd(); },} );
  }

  // X's & O's flow
  if (mode === "xo") {
    if (phase === "setup") return React.createElement(XOSetup, { onStart: cfg => { setConfig(cfg); setPhase("game"); if (onGameStart) onGameStart(); }, onBack: () => setMode(null),} );
    if (phase === "game") return React.createElement(XOGame, { config: config, onComplete: res => { setResult(res); setPhase("result"); if (onGameEnd) onGameEnd(); }, onExit: () => { setMode(null); setPhase("setup"); if (onGameEnd) onGameEnd(); },} );
    if (phase === "result") return React.createElement(XOResult, { result: result, config: config, onPlayAgain: () => { setPhase("setup"); if (onGameStart) onGameStart(); }, onExit: () => { setMode(null); setPhase("setup"); if (onGameEnd) onGameEnd(); },} );
  }

  // Penalties flow
  if (mode === "penalties") {
    if (phase === "setup")  return React.createElement(PenaltiesSetup, { onStart: cfg => { setConfig(cfg); setPhase("game"); if (onGameStart) onGameStart(); }, onBack: () => setMode(null),} );
    if (phase === "game")   return React.createElement(PenaltiesGame, { config: config, onComplete: res => { setResult(res); setPhase("result"); if (onGameEnd) onGameEnd(); }, onExit: () => { setMode(null); setPhase("setup"); if (onGameEnd) onGameEnd(); },} );
    if (phase === "result") return React.createElement(PenaltiesResult, { result: result, config: config, onPlayAgain: () => { setPhase("setup"); if (onGameStart) onGameStart(); }, onExit: () => { setMode(null); setPhase("setup"); if (onGameEnd) onGameEnd(); },} );
  }

  return null;
}



// ─── CHECKOUT PYRAMID SESSION ────────────────────────────────────────────────
// Three preset pyramids of 9 checkouts, climbing from ~40s to ~130.
// One visit (3 darts) per checkout. Score = checkouts hit out of 9.

function CheckoutPyramidSession({ onDone, onExit, sessionIdx, sessionTotal }) {

  // Three pyramids — same structure, different numbers
  var PYRAMIDS = [
    {
      label: "Easy",
      sublabel: "Friendlier doubles throughout",
      color: "#f0a06a",
      scores: [40, 52, 62, 74, 80, 96, 100, 114, 128],
    },
    {
      label: "Medium",
      sublabel: "Standard checkout routes",
      color: "var(--accent)",
      scores: [41, 54, 64, 76, 84, 98, 106, 116, 130],
    },
    {
      label: "Hard",
      sublabel: "Tricky numbers and routes",
      color: "#ff6b6b",
      scores: [45, 57, 67, 78, 87, 99, 110, 121, 130],
    },
  ];

  var [pyramidIdx, setPyramidIdx] = useState(null); // null = not chosen
  var [idx, setIdx]               = useState(0);
  var [results, setResults]       = useState([]); // true/false per checkout
  var [notes, setNotes]           = useState("");
  var [done, setDone]             = useState(false);

  var pyramid = pyramidIdx !== null ? PYRAMIDS[pyramidIdx] : null;
  var current = pyramid ? pyramid.scores[idx] : null;
  var route   = current ? (CHECKOUT_ROUTES[current] || CHECKOUTS[current] || "—") : null;
  var pColor  = _optionalChain([pyramid, 'optionalAccess', _43 => _43.color]) || "var(--accent)";

  var confirmResult = (hit) => {
    var newResults = [...results, hit];
    setResults(newResults);
    if (idx >= pyramid.scores.length - 1) {
      setDone(true);
    } else {
      setIdx(i => i + 1);
    }
  };

  // ── Pyramid picker ────────────────────────────────────────────────────────
  if (pyramidIdx === null) return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement(SessionTopBar, { onExit: onExit, idx: sessionIdx, total: sessionTotal,} )
      , React.createElement('div', { style: { textAlign: "center", padding: "20px 0 24px" },}
        , React.createElement('div', { style: { fontSize: 56, marginBottom: 10 },}, "🔺")
        , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 6 },}, "Checkout Pyramid" )
        , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)", lineHeight: 1.55 },}, "9 checkouts, one visit each."    , React.createElement('br', null), "Climb from the 40s to 130."     )
      )

      , React.createElement('div', { style: { display: "flex", flexDirection: "column", gap: 12 },}
        , PYRAMIDS.map((p, i) => (
          React.createElement('button', { key: i, onClick: () => setPyramidIdx(i),
            style: { background: `${p.color}0f`, border: `1px solid ${p.color}44`, borderRadius: "var(--radius)", padding: "18px 20px", textAlign: "left", cursor: "pointer", WebkitTapHighlightColor: "transparent", transition: "all .15s", width: "100%" },}
            , React.createElement('div', { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },}
              , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", color: p.color },}, p.label)
              , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)" },}, p.sublabel)
            )
            /* Pyramid visual */
            , React.createElement('div', { style: { display: "flex", gap: 4, alignItems: "flex-end", justifyContent: "center" },}
              , p.scores.map((s, j) => (
                React.createElement('div', { key: j, style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 3 },}
                  , React.createElement('div', { style: { width: 30, background: `${p.color}22`, border: `1px solid ${p.color}44`, borderRadius: 6, height: `${16 + j * 4}px` },} )
                  , React.createElement('div', { style: { fontSize: 9, color: "var(--muted)", fontWeight: 700 },}, s)
                )
              ))
            )
          )
        ))
      )
    )
  );

  // ── Done screen ──────────────────────────────────────────────────────────
  if (done) {
    var hits = results.filter(Boolean).length;
    var total = pyramid.scores.length;
    var pct = Math.round((hits / total) * 100);
    var rating = hits === 9 ? "Perfect!" : hits >= 7 ? "Very Strong" : hits >= 5 ? "Solid 👍" : hits >= 3 ? "Developing 📈" : "Keep Practising";

    return (
      React.createElement('div', { className: "scroll-area",}
        , React.createElement('div', { style: { paddingTop: 52, textAlign: "center", paddingBottom: 20 },}
          , React.createElement('div', { style: { fontSize: 64, marginBottom: 12 },}, "🔺")
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 30, letterSpacing: 3, color: pColor, marginBottom: 4 },}
            , pyramid.label, " Pyramid"
          )
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 64, color: "var(--text)", letterSpacing: 2 },}, hits, "/", total)
          , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)" },}, pct, "% hit rate · "    , rating)
        )

        , React.createElement('div', { className: "stat-row",}
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val", style: { color: pColor },}, hits), React.createElement('div', { className: "stat-lbl",}, "Hit"))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val", style: { color: "var(--accent2)" },}, total - hits), React.createElement('div', { className: "stat-lbl",}, "Missed"))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, pct, "%"), React.createElement('div', { className: "stat-lbl",}, "Rate"))
        )

        /* Full pyramid result */
        , React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Pyramid Breakdown" )
          , React.createElement('div', { style: { display: "flex", gap: 6, alignItems: "flex-end", justifyContent: "center", padding: "8px 0 4px" },}
            , pyramid.scores.map((s, j) => (
              React.createElement('div', { key: j, style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },}
                , React.createElement('div', { style: { fontSize: 16 },}, results[j] ? "✅" : "❌")
                , React.createElement('div', { style: { width: 32, background: results[j] ? `${pColor}30` : "rgba(194,72,63,.12)", border: `1px solid ${results[j] ? pColor + "55" : "rgba(194,72,63,.3)"}`, borderRadius: 6, height: `${20 + j * 4}px` },} )
                , React.createElement('div', { style: { fontSize: 9, color: "var(--muted)", fontWeight: 700 },}, s)
              )
            ))
          )
        )

        /* Route recap */
        , React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Routes")
          , pyramid.scores.map((s, j) => (
            React.createElement('div', { key: j, className: "history-row",}
              , React.createElement('span', { style: { fontSize: 16 },}, results[j] ? "✅" : "❌")
              , React.createElement('span', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: pColor, minWidth: 40 },}, s)
              , React.createElement('span', { className: "history-name", style: { color: "var(--muted)", fontSize: 12 },}, CHECKOUT_ROUTES[s] || CHECKOUTS[s] || "—")
            )
          ))
        )

        , React.createElement('textarea', { className: "notes-input", placeholder: "Notes...", value: notes, onChange: e => setNotes(e.target.value),} )
        , React.createElement('button', { className: "btn btn-primary btn-full"  , style: { marginTop: 8 }, onClick: () => onDone({ score: hits, notes }),}
          , sessionIdx < sessionTotal - 1 ? "Log & Next" : "Finish Session"
        )
      )
    );
  }

  // ── Game screen ───────────────────────────────────────────────────────────
  var progressPct = Math.round((idx / pyramid.scores.length) * 100);
  var hitsCount   = results.filter(Boolean).length;

  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement(SessionTopBar, { onExit: onExit, idx: sessionIdx, total: sessionTotal,} )

      /* Progress */
      , React.createElement('div', { style: { marginBottom: 14 },}
        , React.createElement('div', { style: { display: "flex", justifyContent: "space-between", marginBottom: 4 },}
          , React.createElement('span', { style: { fontSize: 11, color: "var(--muted)" },}, pyramid.label, " — Checkout "   , idx + 1, " of "  , pyramid.scores.length)
          , React.createElement('span', { style: { fontSize: 11, fontWeight: 700, color: pColor },}, hitsCount, "/", idx, " hit" )
        )
        , React.createElement('div', { style: { height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 100, overflow: "hidden" },}
          , React.createElement('div', { style: { height: "100%", width: `${progressPct}%`, background: `linear-gradient(90deg,${pColor},var(--accent))`, borderRadius: 100, transition: "width .3s ease" },} )
        )
      )

      /* Pyramid progress strip */
      , React.createElement('div', { style: { display: "flex", gap: 4, alignItems: "flex-end", justifyContent: "center", marginBottom: 14 },}
        , pyramid.scores.map((s, j) => {
          var isCurrent = j === idx;
          var isPast    = j < idx;
          var hitIt     = results[j];
          return (
            React.createElement('div', { key: j, style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 3 },}
              , isPast && React.createElement('div', { style: { fontSize: 10 },}, hitIt ? "✅" : "❌")
              , isCurrent && React.createElement('div', { style: { fontSize: 10, color: pColor },}, "▼")
              , !isPast && !isCurrent && React.createElement('div', { style: { fontSize: 10 },}, " " )
              , React.createElement('div', { style: { width: 28, background: isPast ? (hitIt ? `${pColor}30` : "rgba(194,72,63,.15)") : isCurrent ? `${pColor}20` : "rgba(255,255,255,0.05)", border: `1px solid ${isCurrent ? pColor : isPast ? (hitIt ? pColor + "44" : "rgba(194,72,63,.3)") : "rgba(255,255,255,0.1)"}`, borderRadius: 6, height: `${14 + j * 3}px`, transition: "all .3s" },} )
              , React.createElement('div', { style: { fontSize: 9, color: isCurrent ? pColor : "var(--muted)", fontWeight: isCurrent ? 700 : 400 },}, s)
            )
          );
        })
      )

      /* Target */
      , React.createElement('div', { style: { background: `${pColor}12`, border: `2px solid ${pColor}44`, borderRadius: 20, padding: "24px 20px", marginBottom: 16, textAlign: "center" },}
        , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: pColor, marginBottom: 8 },}, "Checkout")
        , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 72, color: pColor, lineHeight: 1, letterSpacing: 2 },}, current)
        , route && route !== "—" && (
          React.createElement('div', { style: { fontSize: 16, fontWeight: 700, color: "var(--text)", marginTop: 10 },}, route)
        )
        , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginTop: 6 },}, "3 darts — one visit only"     )
      )

      /* Hit / Miss */
      , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },}
        , React.createElement('button', { onClick: () => { haptic("miss"); confirmResult(false); },
          style: { padding: "22px 0", background: "rgba(194,72,63,.08)", border: "1px solid rgba(194,72,63,.3)", borderRadius: 18, fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: "var(--accent2)", cursor: "pointer", WebkitTapHighlightColor: "transparent", letterSpacing: 1 },}, "✗ MISS"

        )
        , React.createElement('button', { onClick: () => { haptic("hit"); confirmResult(true); },
          style: { padding: "22px 0", background: `${pColor}18`, border: `1px solid ${pColor}55`, borderRadius: 18, fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: pColor, cursor: "pointer", WebkitTapHighlightColor: "transparent", letterSpacing: 1 },}, "✓ HIT!"

        )
      )
    )
  );
}

// ─── STREET 82 SESSION ───────────────────────────────────────────────────────
// One dart at each of 82 targets in RANDOM order.
// Hit or miss — either way you move on. No second chances.
// Score = hits out of 82 (and hit %).

function Street82Session({ onDone, onExit, sessionIdx, sessionTotal }) {

  var SECTIONS = [
    { id: "small",  label: "Small Singles", count: 20, color: "#64c8ff" },
    { id: "big",    label: "Big Singles",   count: 20, color: "#f0a06a" },
    { id: "double", label: "Doubles",       count: 20, color: "var(--accent)" },
    { id: "treble", label: "Trebles",       count: 20, color: "#ff6b6b" },
    { id: "bull",   label: "Bull",          count: 2,  color: "#f0ad4e" },
  ];

  // Build and shuffle all 82 targets once on mount
  var buildTargets = () => {
    var t = [];
    for (var i = 1; i <= 20; i++) t.push({ label: `s${i}`, desc: `Small Single ${i}`, section: "small" });
    for (var i = 1; i <= 20; i++) t.push({ label: `S${i}`, desc: `Big Single ${i}`,   section: "big" });
    for (var i = 1; i <= 20; i++) t.push({ label: `D${i}`, desc: `Double ${i}`,        section: "double" });
    for (var i = 1; i <= 20; i++) t.push({ label: `T${i}`, desc: `Treble ${i}`,        section: "treble" });
    t.push({ label: "25",   desc: "Single Bull (outer)", section: "bull" });
    t.push({ label: "Bull", desc: "Bull (inner)",         section: "bull" });
    // Fisher-Yates shuffle
    for (var i = t.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      [t[i], t[j]] = [t[j], t[i]];
    }
    return t;
  };

  var [targets]   = useState(buildTargets);   // shuffled once, never changes
  var [idx, setIdx]       = useState(0);
  var [hits, setHits]     = useState(0);
  var [results, setResults] = useState([]);   // true/false per target
  var [notes, setNotes]   = useState("");
  var [done, setDone]     = useState(false);
  var [lastResult, setLastResult] = useState(null); // "hit"|"miss"|null for flash

  var total = targets.length; // 82
  var current = targets[idx];
  var sectionColor = _optionalChain([SECTIONS, 'access', _44 => _44.find, 'call', _45 => _45(s => s.id === _optionalChain([current, 'optionalAccess', _46 => _46.section])), 'optionalAccess', _47 => _47.color]) || "var(--accent)";
  var progressPct = Math.round((idx / total) * 100);
  var hitPct = idx > 0 ? Math.round((hits / idx) * 100) : 0;
  var next3 = targets.slice(idx + 1, idx + 4);

  var advance = (hit) => {
    setLastResult(hit ? "hit" : "miss");
    setResults(r => [...r, hit]);
    if (hit) setHits(h => h + 1);
    setTimeout(() => {
      setLastResult(null);
      if (idx >= total - 1) {
        setDone(true);
      } else {
        setIdx(i => i + 1);
      }
    }, 400);
  };

  // ── Section hit rates for results ─────────────────────────────────────────
  var sectionStats = () => {
    var s = {};
    SECTIONS.forEach(sec => { s[sec.id] = { hits: 0, total: 0 }; });
    targets.forEach((t, i) => {
      if (i < results.length) {
        s[t.section].total++;
        if (results[i]) s[t.section].hits++;
      }
    });
    return s;
  };

  // ── Done screen ───────────────────────────────────────────────────────────
  if (done) {
    var pct = Math.round((hits / total) * 100);
    var rating = pct >= 80 ? "Exceptional ★" : pct >= 65 ? "Elite" : pct >= 50 ? "Very Strong 👍" : pct >= 35 ? "Solid 📈" : "Keep Practising";
    var ss = sectionStats();
    // Missed targets
    var missed = targets.filter((t, i) => !results[i]);

    return (
      React.createElement('div', { className: "scroll-area",}
        , React.createElement('div', { style: { paddingTop: 52, textAlign: "center", paddingBottom: 20 },}
          , React.createElement('div', { style: { fontSize: 64, marginBottom: 12 },}, "🗺️")
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 30, letterSpacing: 3, color: "var(--accent)", marginBottom: 4 },}, "Street 82 Complete!"  )
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 72, color: "var(--text)", letterSpacing: 2, lineHeight: 1 },}, hits, React.createElement('span', { style: { fontSize: 32, color: "var(--muted)" },}, "/", total))
          , React.createElement('div', { style: { fontSize: 14, fontWeight: 700, color: "var(--accent)", marginTop: 6 },}, pct, "% hit rate · "    , rating)
        )

        , React.createElement('div', { className: "stat-row",}
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val", style: { color: "var(--accent)" },}, hits), React.createElement('div', { className: "stat-lbl",}, "Hits"))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val", style: { color: "var(--accent2)" },}, total - hits), React.createElement('div', { className: "stat-lbl",}, "Misses"))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, pct, "%"), React.createElement('div', { className: "stat-lbl",}, "Hit Rate" ))
        )

        /* Section breakdown */
        , React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Section Breakdown" )
          , SECTIONS.map(s => {
            var stat = ss[s.id];
            var pct = stat.total > 0 ? Math.round((stat.hits / stat.total) * 100) : 0;
            return (
              React.createElement('div', { key: s.id, style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },}
                , React.createElement('div', { style: { width: 84, fontSize: 11, color: s.color, fontWeight: 700 },}, s.label)
                , React.createElement('div', { style: { flex: 1 },}
                  , React.createElement('div', { style: { height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 100, overflow: "hidden" },}
                    , React.createElement('div', { style: { height: "100%", width: `${pct}%`, background: s.color, borderRadius: 100 },} )
                  )
                )
                , React.createElement('div', { style: { fontSize: 12, fontWeight: 700, color: "var(--text)", minWidth: 52, textAlign: "right" },}, stat.hits, "/", stat.total)
                , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", minWidth: 36, textAlign: "right" },}, pct, "%")
              )
            );
          })
        )

        /* Missed targets */
        , missed.length > 0 && (
          React.createElement('div', { className: "info-block",}
            , React.createElement('div', { className: "info-title",}, "Missed (" , missed.length, ")")
            , React.createElement('div', { style: { display: "flex", gap: 6, flexWrap: "wrap" },}
              , missed.map((t, i) => {
                var col = _optionalChain([SECTIONS, 'access', _48 => _48.find, 'call', _49 => _49(s => s.id === t.section), 'optionalAccess', _50 => _50.color]) || "var(--muted)";
                return (
                  React.createElement('span', { key: i, style: { fontSize: 12, fontWeight: 700, color: col, background: `${col}15`, border: `1px solid ${col}30`, borderRadius: 8, padding: "3px 8px" },}, t.label)
                );
              })
            )
          )
        )

        , React.createElement('textarea', { className: "notes-input", placeholder: "Notes...", value: notes, onChange: e => setNotes(e.target.value),} )
        , React.createElement('button', { className: "btn btn-primary btn-full"  , style: { marginTop: 8 }, onClick: () => onDone({ score: hits, notes }),}
          , sessionIdx < sessionTotal - 1 ? "Log & Next" : "Finish Session"
        )
      )
    );
  }

  // ── Game screen ───────────────────────────────────────────────────────────
  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement(SessionTopBar, { onExit: onExit, idx: sessionIdx, total: sessionTotal,} )

      /* Stats row — hits/darts, open targets, hit % */
      , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 },}
        , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 8px", textAlign: "center", boxShadow: "var(--shadow-sm)" },}
          , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: "var(--accent)" },}, hits, "/", idx)
          , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted)", marginTop: 2 },}, "Hits/Darts")
        )
        , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 8px", textAlign: "center", boxShadow: "var(--shadow-sm)" },}
          , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text)" },}, total - idx)
          , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted)", marginTop: 2 },}, "Remaining")
        )
        , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 8px", textAlign: "center", boxShadow: "var(--shadow-sm)" },}
          , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: idx > 0 ? (hitPct >= 50 ? "var(--accent)" : "var(--accent2)") : "var(--muted)" },}, idx > 0 ? `${hitPct}%` : "—")
          , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted)", marginTop: 2 },}, "Hit Rate" )
        )
      )

      /* Progress bar */
      , React.createElement('div', { style: { marginBottom: 14 },}
        , React.createElement('div', { style: { height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 100, overflow: "hidden" },}
          , React.createElement('div', { style: { height: "100%", width: `${progressPct}%`, background: `linear-gradient(90deg,${sectionColor},var(--accent))`, borderRadius: 100, transition: "width .3s ease" },} )
        )
        , React.createElement('div', { style: { display: "flex", justifyContent: "space-between", marginTop: 4 },}
          , React.createElement('span', { style: { fontSize: 10, color: "var(--muted)" },}, "Dart " , idx + 1, " of "  , total)
          , React.createElement('span', { style: { fontSize: 10, color: sectionColor, fontWeight: 700 },}, progressPct, "%")
        )
      )

      /* Current target */
      , React.createElement('div', { style: { background: lastResult === "hit" ? "rgba(232,118,63,.15)" : lastResult === "miss" ? "rgba(194,72,63,.12)" : `${sectionColor}10`, border: `2px solid ${lastResult === "hit" ? "rgba(232,118,63,.5)" : lastResult === "miss" ? "rgba(194,72,63,.4)" : sectionColor + "44"}`, borderRadius: 20, padding: "24px 20px", marginBottom: 14, textAlign: "center", transition: "all .2s" },}
        , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: sectionColor, marginBottom: 6 },}
          , _optionalChain([SECTIONS, 'access', _51 => _51.find, 'call', _52 => _52(s => s.id === current.section), 'optionalAccess', _53 => _53.label])
        )
        , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 72, color: lastResult === "hit" ? "var(--accent)" : lastResult === "miss" ? "var(--accent2)" : sectionColor, lineHeight: 1, letterSpacing: 2 },}
          , lastResult === "hit" ? "✓" : lastResult === "miss" ? "✗" : current.label
        )
        , !lastResult && React.createElement('div', { style: { fontSize: 14, color: "var(--text2)", marginTop: 6 },}, current.desc)
        , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginTop: 6 },}, "1 dart only — hit or miss, move on"        )
      )

      /* Hit / Miss buttons */
      , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 },}
        , React.createElement('button', { onClick: () => { haptic("miss"); advance(false); }, disabled: !!lastResult,
          style: { padding: "22px 0", background: "rgba(194,72,63,.08)", border: "1px solid rgba(194,72,63,.3)", borderRadius: 18, fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: "var(--accent2)", cursor: "pointer", WebkitTapHighlightColor: "transparent", letterSpacing: 1, opacity: lastResult ? 0.4 : 1, transition: "opacity .2s" },}, "✗ MISS"

        )
        , React.createElement('button', { onClick: () => { haptic("hit"); advance(true); }, disabled: !!lastResult,
          style: { padding: "22px 0", background: `${sectionColor}18`, border: `1px solid ${sectionColor}55`, borderRadius: 18, fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: sectionColor, cursor: "pointer", WebkitTapHighlightColor: "transparent", letterSpacing: 1, opacity: lastResult ? 0.4 : 1, transition: "opacity .2s" },}, "✓ HIT!"

        )
      )

      /* Next 3 targets */
      , next3.length > 0 && (
        React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Next targets" )
          , React.createElement('div', { style: { display: "flex", gap: 8 },}
            , next3.map((t, i) => {
              var col = _optionalChain([SECTIONS, 'access', _54 => _54.find, 'call', _55 => _55(s => s.id === t.section), 'optionalAccess', _56 => _56.color]) || "var(--muted)";
              return (
                React.createElement('div', { key: i, style: { flex: 1, textAlign: "center", padding: "10px 6px", background: "var(--surface2)", borderRadius: 12, border: `1px solid ${col}30` },}
                  , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: col },}, t.label)
                  , React.createElement('div', { style: { fontSize: 9, color: "var(--muted)", marginTop: 2 },}, t.desc.replace(" (outer)", "").replace(" (inner)", ""))
                )
              );
            })
          )
        )
      )

      /* Recent results strip */
      , results.length > 0 && (
        React.createElement('div', { style: { display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 },}
          , results.slice(-20).map((r, i) => (
            React.createElement('div', { key: i, style: { width: 20, height: 20, borderRadius: 4, background: r ? "rgba(232,118,63,.3)" : "rgba(194,72,63,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 },}
              , r ? "✓" : "✗"
            )
          ))
        )
      )
    )
  );
}
// ─── PRIESTLEY'S TRIPLES SESSION ─────────────────────────────────────────────
// Numbers 10–20. 3 darts per target.
// Single = 1pt, Double = 2pts, Treble = 3pts per dart. Max 99 pts total.

function PriestleysSession({ onDone, onExit, sessionIdx, sessionTotal }) {
  var TARGETS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  var [idx, setIdx]           = useState(0);
  var [totalScore, setTotalScore] = useState(0);
  var [hist, setHist]         = useState([]); // {num, s, d, t, pts}
  var [notes, setNotes]       = useState("");
  var [done, setDone]         = useState(false);

  // Per-visit dart selections: how many singles, doubles, trebles
  var [singles, setSingles]   = useState(0);
  var [doubles, setDoubles]   = useState(0);
  var [trebles, setTrebles]   = useState(0);

  var current = TARGETS[idx];
  var dartsUsed = singles + doubles + trebles;
  var visitPts  = singles * 1 + doubles * 2 + trebles * 3;
  var dartsLeft = 3 - dartsUsed;

  var confirmVisit = () => {
    var entry = { num: current, singles, doubles, trebles, pts: visitPts };
    var newTotal = totalScore + visitPts;
    setHist(h => [...h, entry]);
    setTotalScore(newTotal);
    setSingles(0); setDoubles(0); setTrebles(0);
    if (idx >= TARGETS.length - 1) {
      setDone(true);
    } else {
      setIdx(i => i + 1);
    }
  };

  // ── Done screen ──────────────────────────────────────────────────────────
  if (done) {
    var maxPossible = TARGETS.length * 9;
    var pct = Math.round((totalScore / maxPossible) * 100);
    var rating = totalScore >= 75 ? "Exceptional ★" : totalScore >= 60 ? "Very Strong" : totalScore >= 40 ? "Solid 👍" : totalScore >= 25 ? "Developing 📈" : "Keep Practising";
    var totalSingles = hist.reduce((a,h) => a + h.singles, 0);
    var totalDoubles = hist.reduce((a,h) => a + h.doubles, 0);
    var totalTrebles = hist.reduce((a,h) => a + h.trebles, 0);
    var totalMisses  = 33 - totalSingles - totalDoubles - totalTrebles;

    return (
      React.createElement('div', { className: "scroll-area",}
        , React.createElement('div', { style: { paddingTop: 52, textAlign: "center", paddingBottom: 20 },}
          , React.createElement('div', { style: { fontSize: 64, marginBottom: 12 },}, "3️⃣")
          , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--accent)", marginBottom: 4 },}, "Priestley's Triples" )
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 64, color: "var(--text)", letterSpacing: 2 },}, totalScore)
          , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)" },}, "/ " , maxPossible, " points · "   , rating)
        )

        , React.createElement('div', { className: "stat-row",}
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val", style: { color: "#ff6b6b" },}, totalTrebles), React.createElement('div', { className: "stat-lbl",}, "Trebles (3pt)" ))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val", style: { color: "var(--accent)" },}, totalDoubles), React.createElement('div', { className: "stat-lbl",}, "Doubles (2pt)" ))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val", style: { color: "#64c8ff" },}, totalSingles), React.createElement('div', { className: "stat-lbl",}, "Singles (1pt)" ))
        )
        , React.createElement('div', { className: "stat-row",}
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val", style: { color: "var(--muted)" },}, totalMisses), React.createElement('div', { className: "stat-lbl",}, "Misses"))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, pct, "%"), React.createElement('div', { className: "stat-lbl",}, "Efficiency"))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, (totalScore / TARGETS.length).toFixed(1)), React.createElement('div', { className: "stat-lbl",}, "Avg / Number"  ))
        )

        /* Per-number breakdown */
        , React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Breakdown — 10 to 20"    )
          , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 },}
            , hist.map((h, i) => {
              var col = h.pts >= 7 ? "var(--accent)" : h.pts >= 4 ? "#64c8ff" : h.pts >= 1 ? "#f0ad4e" : "var(--accent2)";
              return (
                React.createElement('div', { key: i, style: { background: "var(--surface)", border: `1px solid ${h.pts === 0 ? "var(--border)" : col + "44"}`, borderRadius: 12, padding: "8px 6px", textAlign: "center" },}
                  , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)" },}, h.num)
                  , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: col, lineHeight: 1 },}, h.pts)
                  , React.createElement('div', { style: { fontSize: 9, color: "var(--muted)", marginTop: 2 },}
                    , [h.trebles > 0 && `${h.trebles}T`, h.doubles > 0 && `${h.doubles}D`, h.singles > 0 && `${h.singles}S`].filter(Boolean).join(" ") || "Miss"
                  )
                )
              );
            })
          )
        )

        , React.createElement('textarea', { className: "notes-input", placeholder: "Notes...", value: notes, onChange: e => setNotes(e.target.value),} )
        , React.createElement('button', { className: "btn btn-primary btn-full"  , style: { marginTop: 8 }, onClick: () => onDone({ score: totalScore, notes }),}
          , sessionIdx < sessionTotal - 1 ? "Log & Next" : "Finish Session"
        )
      )
    );
  }

  // ── Game screen ───────────────────────────────────────────────────────────
  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement(SessionTopBar, { onExit: onExit, idx: sessionIdx, total: sessionTotal,} )
      , React.createElement(ProgressBar, { current: idx, total: TARGETS.length, label: "Priestley's Triples" ,} )

      /* Score + target */
      , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 },}
        , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}, "Total")
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, color: "var(--text)" },}, totalScore)
        )
        , React.createElement('div', { style: { background: "linear-gradient(135deg,rgba(232,118,63,.08),rgba(168,255,120,.04))", border: "1px solid rgba(232,118,63,.3)", borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--accent)", marginBottom: 4 },}, "Target")
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 44, color: "var(--accent)", lineHeight: 1 },}, current)
        )
        , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}, "This Visit" )
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, color: visitPts > 0 ? "var(--accent)" : "var(--muted)" },}, "+", visitPts)
        )
      )

      /* Dart input — select what each dart hit */
      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "3 darts at "   , current, " — what did you hit?"     )
        , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginBottom: 14 },}
          , dartsLeft > 0 ? `${dartsLeft} dart${dartsLeft > 1 ? "s" : ""} remaining` : "All 3 darts used"
        )

        , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 16 },}
          , [
            { label: "Miss", sub: "0 pts", val: "miss", color: "var(--muted)", pts: 0 },
            { label: "Single", sub: "1 pt", val: "single", color: "#64c8ff", pts: 1 },
            { label: "Double", sub: "2 pts", val: "double", color: "var(--accent)", pts: 2 },
            { label: "Treble", sub: "3 pts", val: "treble", color: "#ff6b6b", pts: 3 },
          ].map(opt => {
            var count = opt.val === "single" ? singles : opt.val === "double" ? doubles : opt.val === "treble" ? trebles : 3 - dartsLeft - singles - doubles - trebles;
            var canAdd = dartsLeft > 0 || opt.val === "miss";
            return (
              React.createElement('div', { key: opt.val, style: { textAlign: "center" },}
                , React.createElement('button', { onClick: () => {
                  if (!canAdd && opt.val !== "miss") return;
                  if (opt.val === "single" && dartsLeft > 0) setSingles(s => s + 1);
                  else if (opt.val === "double" && dartsLeft > 0) setDoubles(d => d + 1);
                  else if (opt.val === "treble" && dartsLeft > 0) setTrebles(t => t + 1);
                },
                  disabled: opt.val !== "miss" && dartsLeft === 0,
                  style: { width: "100%", padding: "14px 4px", background: count > 0 ? `${opt.color}22` : "var(--surface2)", border: `2px solid ${count > 0 ? opt.color : "var(--border)"}`, borderRadius: 14, cursor: dartsLeft > 0 || opt.val === "miss" ? "pointer" : "not-allowed", opacity: opt.val !== "miss" && dartsLeft === 0 ? 0.4 : 1, WebkitTapHighlightColor: "transparent", transition: "all .15s" },}
                  , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: count > 0 ? opt.color : "var(--text)", lineHeight: 1 },}, count)
                  , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, color: count > 0 ? opt.color : "var(--muted)", marginTop: 2 },}, opt.label)
                  , React.createElement('div', { style: { fontSize: 10, color: "var(--muted)" },}, opt.sub)
                )
                , count > 0 && (
                  React.createElement('button', { onClick: () => {
                    if (opt.val === "single") setSingles(s => Math.max(0, s-1));
                    else if (opt.val === "double") setDoubles(d => Math.max(0, d-1));
                    else if (opt.val === "treble") setTrebles(t => Math.max(0, t-1));
                  }, style: { background: "none", border: "none", color: "var(--muted)", fontSize: 11, cursor: "pointer", marginTop: 4 },}, "− remove"

                  )
                )
              )
            );
          })
        )

        /* Preview */
        , (singles > 0 || doubles > 0 || trebles > 0) && (
          React.createElement('div', { style: { padding: "10px 14px", borderRadius: 10, marginBottom: 12, background: "rgba(232,118,63,.06)", border: "1px solid rgba(232,118,63,.2)", fontSize: 13, color: "var(--accent)", textAlign: "center" },}
            , [trebles > 0 && `${trebles}×Treble (${trebles*3}pts)`, doubles > 0 && `${doubles}×Double (${doubles*2}pts)`, singles > 0 && `${singles}×Single (${singles}pts)`].filter(Boolean).join(" + "), " = "  , visitPts, " pts"
          )
        )

        , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: confirmVisit, disabled: dartsUsed === 0,}, "Confirm — "
            , dartsLeft > 0 ? `${dartsLeft} dart${dartsLeft > 1 ? "s" : ""} not logged as miss?` : `+${visitPts} pts →`
        )
        , dartsLeft > 0 && dartsUsed > 0 && (
          React.createElement('button', { className: "btn btn-secondary btn-full"  , style: { marginTop: 8 }, onClick: confirmVisit,}, "Rest are misses — Confirm →"

          )
        )
      )

      /* Recent */
      , hist.length > 0 && (
        React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Recent")
          , hist.slice(-4).reverse().map((h, i) => (
            React.createElement('div', { key: i, className: "history-row",}
              , React.createElement('span', { style: { fontSize: 14, minWidth: 28 },}, h.num)
              , React.createElement('span', { className: "history-name",}
                , [h.trebles > 0 && `${h.trebles}T`, h.doubles > 0 && `${h.doubles}D`, h.singles > 0 && `${h.singles}S`].filter(Boolean).join("+") || "Miss"
              )
              , React.createElement('span', { className: "history-score", style: { color: h.pts > 0 ? "var(--accent)" : "var(--muted)" },}, "+", h.pts)
            )
          ))
        )
      )
    )
  );
}

// ─── PENALTIES SESSION WRAPPER ───────────────────────────────────────────────
// Used when Darts Penalties is played from a training programme.
// Shows the setup screen then runs the full game, reporting score to the session.

function PenaltiesSessionWrapper({ onDone, onExit, sessionIdx, sessionTotal }) {
  var [phase, setPhase] = useState("setup");   // "setup" | "game" | "result"
  var [config, setConfig] = useState(null);
  var [result, setResult] = useState(null);

  if (phase === "setup") return (
    React.createElement(PenaltiesSetup, {
      onStart: cfg => { setConfig(cfg); setPhase("game"); },
      onBack: onExit,}
    )
  );

  if (phase === "game") return (
    React.createElement(PenaltiesGame, {
      config: config,
      onComplete: res => { setResult(res); setPhase("result"); },
      onExit: onExit,}
    )
  );

  if (phase === "result" && result) {
    var score = result.p1Rounds; // rounds won as the score
    return (
      React.createElement('div', { className: "scroll-area",}
        , React.createElement('div', { style: { paddingTop: 52, textAlign: "center", paddingBottom: 24 },}
          , React.createElement('div', { style: { fontSize: 64, marginBottom: 12 },}, result.winner === result.p1Name ? "🏆" : "😤")
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 34, letterSpacing: 3, color: result.winner === result.p1Name ? "var(--accent)" : "#ff6b6b", marginBottom: 6 },}
            , result.winner === result.p1Name ? "You Win!" : "You Lost"
          )
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 40, color: "var(--text)", letterSpacing: 2 },}
            , result.p1Rounds, "–", result.p2Rounds
          )
          , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)", marginTop: 4 },}, "vs " , result.p2Name)
        )
        , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: () => onDone({ score, notes: "" }),}
          , sessionIdx < sessionTotal - 1 ? "Log & Next" : "Finish Session"
        )
      )
    );
  }

  return null;
}

// ─── DARTS PENALTIES ─────────────────────────────────────────────────────────
// Football-style penalties. 5 random targets each per round.
// Alternate: P1 takes penalty 1, P2 takes penalty 1, P1 takes penalty 2, etc.
// More penalties scored in round = win that round (+1 point). First to 3 rounds wins.

var PENALTY_BOT_LEVELS = [
  { id: "beginner",     label: "Beginner",     hitRate: 0.25, emoji: "🟢" },
  { id: "intermediate", label: "Intermediate", hitRate: 0.55, emoji: "🟡" },
  { id: "expert",       label: "Expert",        hitRate: 0.82, emoji: "🔴" },
];

// Generate 5 random penalty targets for a round
// Targets: S1-S20 (big single), s1-s20 (small single), D1-D20, T1-T20
function generatePenaltyTargets() {
  var targets = [];
  var types = ["single-big", "single-big", "double", "treble", "single-small"];
  // Shuffle types slightly for variety
  var shuffled = [...types].sort(() => Math.random() - 0.5);
  for (var i = 0; i < 5; i++) {
    var type = shuffled[i];
    var num  = Math.floor(Math.random() * 20) + 1;
    if (type === "single-big")   targets.push({ type, num, label: `S${num}`, desc: `Single ${num} (big bed)` });
    else if (type === "single-small") targets.push({ type, num, label: `s${num}`, desc: `Single ${num} (small bed)` });
    else if (type === "double")  targets.push({ type, num, label: `D${num}`, desc: `Double ${num}` });
    else                         targets.push({ type, num, label: `T${num}`, desc: `Treble ${num}` });
  }
  return targets;
}

// ── PenaltiesSetup ────────────────────────────────────────────────────────────
function PenaltiesSetup({ onStart, onBack }) {
  var [vsMode, setVsMode]     = useState("bot");
  var [botLevel, setBotLevel] = useState(0); // index into PENALTY_BOT_LEVELS
  var [p1Name, setP1Name]     = useState("Player 1");
  var [p2Name, setP2Name]     = useState("Player 2");
  var bot = PENALTY_BOT_LEVELS[botLevel];

  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement('div', { style: { paddingTop: 52, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },}
        , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: 2, color: "var(--text)" },}, "PENALTIES")
        , React.createElement('button', { className: "back-btn", onClick: onBack,}, React.createElement(Ms, { icon: "arrow_back", size: 18,} ), " Back" )
      )

      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Rules")
        , React.createElement('ul', { className: "rules-list",}
          , React.createElement('li', null, "5 random targets per round — singles, doubles and trebles."         )
          , React.createElement('li', null, "Players alternate: P1 takes penalty 1, P2 takes penalty 1, and so on."            )
          , React.createElement('li', null, "3 darts to hit the target — any dart counts."         )
          , React.createElement('li', null, "More penalties scored in a round = win that round (+1 point)."           )
          , React.createElement('li', null, "First to 3 rounds wins the match."      )
        )
      )

      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Game Mode" )
        , React.createElement('div', { style: { display: "flex", gap: 10 },}
          , React.createElement('button', { className: `filter-btn ${vsMode === "bot" ? "active" : ""}`, style: { flex: 1, padding: "12px 0" }, onClick: () => setVsMode("bot"),}, "🤖 vs Bot"  )
          , React.createElement('button', { className: `filter-btn ${vsMode === "friend" ? "active" : ""}`, style: { flex: 1, padding: "12px 0" }, onClick: () => setVsMode("friend"),}, "👥 vs Friend"  )
        )
      )

      , vsMode === "bot" && (
        React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Bot Difficulty" )
          , React.createElement('div', { style: { display: "flex", gap: 10 },}
            , PENALTY_BOT_LEVELS.map((b, i) => (
              React.createElement('button', { key: b.id, className: `filter-btn ${botLevel === i ? "active" : ""}`,
                style: { flex: 1, padding: "14px 0" }, onClick: () => setBotLevel(i),}
                , React.createElement('div', { style: { fontSize: 18 },}, b.emoji)
                , React.createElement('div', { style: { fontSize: 12, marginTop: 4 },}, b.label)
              )
            ))
          )
          , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginTop: 10 },}
            , bot.label, " hits approximately "   , Math.round(bot.hitRate * 100), "% of penalty targets."
          )
        )
      )

      , vsMode === "friend" && (
        React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Player Names" )
          , React.createElement('div', { style: { display: "flex", gap: 10 },}
            , React.createElement('div', { style: { flex: 1 },}
              , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginBottom: 6, fontWeight: 600 },}, "Player 1" )
              , React.createElement('input', { className: "form-input", value: p1Name, onChange: e => setP1Name(e.target.value), maxLength: 14,} )
            )
            , React.createElement('div', { style: { flex: 1 },}
              , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginBottom: 6, fontWeight: 600 },}, "Player 2" )
              , React.createElement('input', { className: "form-input", value: p2Name, onChange: e => setP2Name(e.target.value), maxLength: 14,} )
            )
          )
        )
      )

      , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: () => onStart({
        vsMode, botLevel,
        p1Name, p2Name: vsMode === "bot" ? `${PENALTY_BOT_LEVELS[botLevel].label} Bot` : p2Name,
      }),}, "Start Match →"

      )
    )
  );
}

// ── PenaltiesGame ─────────────────────────────────────────────────────────────
function PenaltiesGame({ config, onComplete, onExit }) {
  var { vsMode, botLevel, p1Name, p2Name } = config;
  var bot = PENALTY_BOT_LEVELS[botLevel] || PENALTY_BOT_LEVELS[0];

  // Match state
  var [p1Rounds, setP1Rounds] = useState(0); // rounds won
  var [p2Rounds, setP2Rounds] = useState(0);

  // Round state
  var [targets, setTargets]       = useState(() => generatePenaltyTargets());
  var [penIdx, setPenIdx]         = useState(0);   // 0-4 which penalty
  var [whoseTurn, setWhoseTurn]   = useState("p1"); // "p1" | "p2"
  var [p1Scores, setP1Scores]     = useState([]);  // true/false for each penalty
  var [p2Scores, setP2Scores]     = useState([]);
  var [roundPhase, setRoundPhase] = useState("attempt"); // "attempt" | "roundResult"
  var [roundWinner, setRoundWinner] = useState(null);
  var [matchDone, setMatchDone]   = useState(false);
  var [matchWinner, setMatchWinner] = useState(null);
  var [attemptResult, setAttemptResult] = useState(null); // null | true | false
  var [confirmExit, setConfirmExit] = useState(false);
  var [botThinking, setBotThinking] = useState(false);

  var target = targets[penIdx];
  var isP1Turn = whoseTurn === "p1";

  // After player attempt, process result and move to next
  var processAttempt = (hit, who) => {
    setAttemptResult(hit);
    var newP1 = who === "p1" ? [...p1Scores, hit] : p1Scores;
    var newP2 = who === "p2" ? [...p2Scores, hit] : p2Scores;
    if (who === "p1") setP1Scores(newP1);
    else setP2Scores(newP2);

    setTimeout(() => {
      setAttemptResult(null);
      // Determine next state
      var nextTurn = who === "p1" ? "p2" : "p1";
      var isLastPenalty = penIdx === 4;

      if (who === "p1") {
        // P1 just went — now P2's turn (bot or friend)
        setWhoseTurn("p2");
        if (vsMode === "bot") {
          setBotThinking(true);
          setTimeout(() => {
            var botHit = Math.random() < bot.hitRate;
            setBotThinking(false);
            var updatedP2 = [...newP2, botHit];
            setP2Scores(updatedP2);
            setAttemptResult(botHit);
            setTimeout(() => {
              setAttemptResult(null);
              if (isLastPenalty) {
                finishRound(newP1, updatedP2, p1Rounds, p2Rounds);
              } else {
                setPenIdx(i => i + 1);
                setWhoseTurn("p1");
              }
            }, 900);
          }, 1200);
        }
        // Friend mode — stay on p2's turn, wait for manual input
      } else {
        // P2 just went — advance penalty
        if (isLastPenalty) {
          finishRound(newP1, newP2, p1Rounds, p2Rounds);
        } else {
          setPenIdx(i => i + 1);
          setWhoseTurn("p1");
        }
      }
    }, 900);
  };

  var finishRound = (p1s, p2s, curP1Rounds, curP2Rounds) => {
    var p1Total = p1s.filter(Boolean).length;
    var p2Total = p2s.filter(Boolean).length;
    var winner = p1Total > p2Total ? "p1" : p2Total > p1Total ? "p2" : "draw";
    var newP1R = curP1Rounds + (winner === "p1" ? 1 : 0);
    var newP2R = curP2Rounds + (winner === "p2" ? 1 : 0);
    setRoundWinner(winner);
    setP1Rounds(newP1R);
    setP2Rounds(newP2R);
    setRoundPhase("roundResult");
    if (newP1R >= 3 || newP2R >= 3) {
      setMatchDone(true);
      setMatchWinner(newP1R >= 3 ? "p1" : "p2");
      onComplete({ winner: newP1R >= 3 ? p1Name : p2Name, p1Rounds: newP1R, p2Rounds: newP2R, p1Name, p2Name, vsMode });
    }
  };

  var startNextRound = () => {
    setTargets(generatePenaltyTargets());
    setPenIdx(0);
    setWhoseTurn("p1");
    setP1Scores([]);
    setP2Scores([]);
    setRoundPhase("attempt");
    setRoundWinner(null);
  };

  if (confirmExit) return React.createElement(ExitConfirmModal, { onConfirm: onExit, onCancel: () => setConfirmExit(false),} );

  // ── Round result screen ───────────────────────────────────────────────────
  if (roundPhase === "roundResult") {
    var p1Total = p1Scores.filter(Boolean).length;
    var p2Total = p2Scores.filter(Boolean).length;
    var rwLabel = roundWinner === "draw" ? "Draw!" : roundWinner === "p1" ? `${p1Name} wins the round!` : `${p2Name} wins the round!`;
    return (
      React.createElement('div', { className: "scroll-area",}
        , React.createElement('div', { style: { paddingTop: 52, textAlign: "center", paddingBottom: 20 },}
          , React.createElement('div', { style: { fontSize: 56, marginBottom: 12 },}, roundWinner === "draw" ? "🤝" : roundWinner === "p1" ? "🏆" : "😤")
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 30, letterSpacing: 2, color: roundWinner === "p1" ? "var(--accent)" : roundWinner === "p2" ? "#ff6b6b" : "var(--text)", marginBottom: 6 },}, rwLabel)
          , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text)", letterSpacing: 2, marginBottom: 4 },}
            , p1Name, " " , p1Rounds, " – "  , p2Rounds, " " , p2Name
          )
          , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)" },}, "First to 3 rounds wins"    )
        )

        /* Penalty scorecard */
        , React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Round Scorecard" )
          , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 6, alignItems: "center" },}
            , React.createElement('div', { style: { fontSize: 12, fontWeight: 700, color: "var(--accent)", textAlign: "center", marginBottom: 6 },}, p1Name)
            , React.createElement('div', null )
            , React.createElement('div', { style: { fontSize: 12, fontWeight: 700, color: "#ff6b6b", textAlign: "center", marginBottom: 6 },}, p2Name)
            , targets.map((t, i) => (
              React.createElement(React.Fragment, null
                , React.createElement('div', { key: `p1-${i}`, style: { textAlign: "center", padding: "6px 0", background: p1Scores[i] ? "rgba(232,118,63,.1)" : "rgba(194,72,63,.06)", borderRadius: 8, fontSize: 18 },}
                  , p1Scores[i] ? "✅" : "❌"
                )
                , React.createElement('div', { key: `t-${i}`, style: { textAlign: "center", fontSize: 12, fontWeight: 700, color: "var(--text)", padding: "0 8px" },}, t.label)
                , React.createElement('div', { key: `p2-${i}`, style: { textAlign: "center", padding: "6px 0", background: p2Scores[i] ? "rgba(255,107,107,.1)" : "rgba(194,72,63,.06)", borderRadius: 8, fontSize: 18 },}
                  , p2Scores[i] ? "✅" : "❌"
                )
              )
            ))
            , React.createElement('div', { style: { textAlign: "center", fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: "var(--accent)", paddingTop: 8 },}, p1Total)
            , React.createElement('div', { style: { textAlign: "center", fontSize: 12, color: "var(--muted)", paddingTop: 8 },}, "scored")
            , React.createElement('div', { style: { textAlign: "center", fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: "#ff6b6b", paddingTop: 8 },}, p2Total)
          )
        )

        , matchDone ? (
          React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: onExit,}, "Match Over — Back"   )
        ) : (
          React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: startNextRound,}, "Next Round →"  )
        )
      )
    );
  }

  // ── Main game screen ──────────────────────────────────────────────────────
  var typeColor = target.type === "double" ? "var(--accent)" : target.type === "treble" ? "var(--accent2)" : "#64c8ff";

  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement('div', { style: { paddingTop: 52, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },}
        , React.createElement('button', { className: "back-btn", onClick: () => setConfirmExit(true),}, "✕ Exit" )
        , React.createElement('div', { style: { textAlign: "center" },}
          , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text)" },}, "PENALTIES")
          , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)" },}, "Penalty " , penIdx + 1, " of 5"  )
        )
        , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", textAlign: "right" },}
          , p1Name, " " , p1Rounds, "–", p2Rounds, " " , p2Name
        )
      )

      /* Round progress dots */
      , React.createElement('div', { style: { display: "flex", gap: 6, justifyContent: "center", marginBottom: 14 },}
        , [0,1,2].map(i => {
          var p1Won = i < p1Rounds;
          var p2Won = i < p2Rounds;
          return (
            React.createElement('div', { key: i, style: { width: 28, height: 28, borderRadius: "50%", border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, background: p1Won ? "rgba(232,118,63,.2)" : p2Won ? "rgba(255,107,107,.2)" : "var(--surface2)", color: p1Won ? "var(--accent)" : p2Won ? "#ff6b6b" : "var(--muted)" },}
              , p1Won ? "X" : p2Won ? "O" : i + 1
            )
          );
        })
      )

      /* Penalty scorecard mini */
      , React.createElement('div', { style: { display: "flex", gap: 6, marginBottom: 14, justifyContent: "center" },}
        , [0,1,2,3,4].map(i => {
          var p1hit = p1Scores[i];
          var p2hit = p2Scores[i];
          var current = i === penIdx;
          return (
            React.createElement('div', { key: i, style: { flex: 1, background: "var(--surface)", border: `1px solid ${current ? "var(--accent)" : "var(--border)"}`, borderRadius: 10, padding: "6px 4px", textAlign: "center" },}
              , React.createElement('div', { style: { fontSize: 9, color: "var(--muted)", marginBottom: 4 },}, "P", i+1)
              , React.createElement('div', { style: { fontSize: 14 },}, p1Scores.length > i ? (p1hit ? "✅" : "❌") : "○")
              , React.createElement('div', { style: { fontSize: 14 },}, p2Scores.length > i ? (p2hit ? "✅" : "❌") : "○")
            )
          );
        })
      )

      /* Whose turn */
      , React.createElement('div', { style: { display: "flex", gap: 10, marginBottom: 14 },}
        , [{ name: p1Name, who: "p1", color: "var(--accent)" }, { name: p2Name, who: "p2", color: "#ff6b6b" }].map(p => (
          React.createElement('div', { key: p.who, style: { flex: 1, padding: "10px", borderRadius: 14, background: whoseTurn === p.who ? `${p.color}15` : "var(--surface)", border: `2px solid ${whoseTurn === p.who ? p.color : "var(--border)"}`, textAlign: "center", transition: "all .2s" },}
            , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, color: whoseTurn === p.who ? p.color : "var(--muted)" },}, p.name)
            , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: whoseTurn === p.who ? p.color : "var(--muted)" },}
              , p.who === "p1" ? p1Scores.filter(Boolean).length : p2Scores.filter(Boolean).length, "/", p.who === "p1" ? p1Scores.length : p2Scores.length
            )
          )
        ))
      )

      /* Target */
      , React.createElement('div', { style: { background: `${typeColor}12`, border: `2px solid ${typeColor}44`, borderRadius: 20, padding: "24px 20px", marginBottom: 16, textAlign: "center" },}
        , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: typeColor, marginBottom: 8 },}
          , botThinking ? `${p2Name} is throwing…` : `${isP1Turn ? p1Name : p2Name} — Penalty ${penIdx + 1}`
        )
        , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 64, color: typeColor, lineHeight: 1, letterSpacing: 2 },}, target.label)
        , React.createElement('div', { style: { fontSize: 14, color: "var(--muted)", marginTop: 8 },}, target.desc)
        , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginTop: 4 },}, "3 darts — any dart counts"     )
      )

      /* Bot thinking */
      , botThinking && (
        React.createElement('div', { style: { display: "flex", gap: 5, justifyContent: "center", marginBottom: 16 },}
          , [0,1,2].map(i => React.createElement('div', { key: i, style: { width: 10, height: 10, borderRadius: "50%", background: "#ff6b6b", animation: `dlbounce 1.2s ${i*0.2}s infinite ease-in-out` },} ))
        )
      )

      /* Attempt result feedback */
      , attemptResult !== null && (
        React.createElement('div', { style: { padding: "12px 16px", borderRadius: 14, marginBottom: 14, textAlign: "center", fontSize: 16, fontWeight: 700, background: attemptResult ? "rgba(232,118,63,.1)" : "rgba(194,72,63,.08)", border: `1px solid ${attemptResult ? "rgba(232,118,63,.3)" : "rgba(194,72,63,.25)"}`, color: attemptResult ? "var(--accent)" : "var(--accent2)" },}
          , attemptResult ? `✅ ${isP1Turn && !botThinking ? p1Name : p2Name} hit ${target.label}!` : `❌ ${isP1Turn && !botThinking ? p1Name : p2Name} missed ${target.label}`
        )
      )

      /* Hit / Miss buttons — only when it's a human's turn */
      , !botThinking && attemptResult === null && (isP1Turn || vsMode === "friend") && (
        React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },}
          , React.createElement('button', { className: "btn btn-secondary" , style: { padding: "18px 0", fontSize: 16 },
            onClick: () => { haptic("miss"); processAttempt(false, isP1Turn ? "p1" : "p2"); },}, "✗ Missed" )
          , React.createElement('button', { className: "btn btn-primary" , style: { padding: "18px 0", fontSize: 16 },
            onClick: () => { haptic("hit"); processAttempt(true, isP1Turn ? "p1" : "p2"); },}, "✓ Hit!" )
        )
      )
    )
  );
}

// ── PenaltiesResult ────────────────────────────────────────────────────────────
function PenaltiesResult({ result, config, onPlayAgain, onExit }) {
  var { winner, p1Rounds, p2Rounds, p1Name, p2Name } = result;
  var playerWon = winner === p1Name;
  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement('div', { style: { paddingTop: 52, textAlign: "center", paddingBottom: 24 },}
        , React.createElement('div', { style: { fontSize: 72, marginBottom: 12 },}, playerWon ? "🏆" : "😤")
        , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 38, letterSpacing: 3, color: playerWon ? "var(--accent)" : "#ff6b6b", marginBottom: 6 },}
          , winner, " Wins!"
        )
        , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, color: "var(--text)", letterSpacing: 2, marginBottom: 4 },}
          , p1Rounds, " – "  , p2Rounds
        )
        , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)" },}
          , config.vsMode === "bot" ? `vs ${p2Name}` : `${p1Name} vs ${p2Name}`
        )
      )
      , React.createElement('div', { style: { display: "flex", gap: 10 },}
        , React.createElement('button', { className: "btn btn-secondary" , style: { flex: 1 }, onClick: onExit,}, React.createElement(Ms, { icon: "arrow_back", size: 18,} ), " Back" )
        , React.createElement('button', { className: "btn btn-primary" , style: { flex: 2 }, onClick: onPlayAgain,}, "Play Again →"  )
      )
    )
  );
}

// ─── X'S & O'S CHECKOUT GAME ─────────────────────────────────────────────────
// 3x3 grid of checkout numbers. Hit the checkout to claim the square.
// First to get 3 in a row wins. Bot plays strategically.

// Nine grids of different number ranges — picked based on bot level / mode
var XO_GRIDS = [
  // Grid 1 — highest (110) in centre, mixed difficulty, no easy winning lines
  // Layout: [41, 96, 64, 100, 110, 56, 80, 70, 81]
  //         [easy hard mid  hard  MAX easy mid easy mid]
  //  Row 0: 41(e)  96(h)  64(m)  — mixed ✓
  //  Row 1: 100(h) 110(M) 56(e)  — mixed ✓
  //  Row 2: 80(m)  70(e)  81(m)  — mixed ✓
  //  Col 0: 41 100 80 — e/h/m ✓  Col 1: 96 110 70 — h/M/e ✓  Col 2: 64 56 81 — m/e/m ✓
  //  Diag:  41 110 81 — e/M/m ✓  Anti: 64 110 80 — m/M/m (no all-easy) ✓
  [41, 96, 64, 100, 110, 56, 80, 70, 81],

  // Grid 2 — highest (116) in centre
  [45, 98, 67, 106, 116, 54, 84, 72, 87],

  // Grid 3 — highest (121) in centre
  [50, 99, 66, 110, 121, 60, 85, 74, 96],
];

// Bot checkout hit rate by level (mirrors BOT_LEVELS checkout percentages)
var XO_BOT_HIT_RATE = [0.08, 0.14, 0.22, 0.32, 0.42, 0.52, 0.62, 0.72, 0.82, 0.92];

// Winning line patterns for a 3x3 grid (indices 0-8)
var XO_LINES = [
  [0,1,2],[3,4,5],[6,7,8],   // rows
  [0,3,6],[1,4,7],[2,5,8],   // cols
  [0,4,8],[2,4,6],           // diagonals
];

function getXOWinner(cells) {
  for (var [a,b,c] of XO_LINES) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) return { winner: cells[a], line: [a,b,c] };
  }
  return null;
}

// Bot AI: returns index of best square to play
function botPickSquare(cells, botMark, playerMark) {
  var empty = cells.map((c,i) => c ? -1 : i).filter(i => i >= 0);
  if (empty.length === 0) return -1;

  // 1. Win if possible
  for (var idx of empty) {
    var test = [...cells]; test[idx] = botMark;
    if (getXOWinner(test)) return idx;
  }
  // 2. Block player win
  for (var idx of empty) {
    var test = [...cells]; test[idx] = playerMark;
    if (getXOWinner(test)) return idx;
  }
  // 3. Take centre
  if (empty.includes(4)) return 4;
  // 4. Take a corner
  var corners = [0,2,6,8].filter(i => empty.includes(i));
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
  // 5. Any edge
  return empty[Math.floor(Math.random() * empty.length)];
}

// ── XOSetup ──────────────────────────────────────────────────────────────────
function XOSetup({ onStart, onBack }) {
  var [vsMode, setVsMode]   = useState("bot"); // "bot" | "friend"
  var [botLevel, setBotLevel] = useState(3);
  var [p1Name, setP1Name]   = useState("Player 1");
  var [p2Name, setP2Name]   = useState("Player 2");
  var [gridIdx, setGridIdx] = useState(0);
  var bot = BOT_LEVELS[botLevel - 1];

  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement('div', { style: { paddingTop: 52, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },}
        , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: 2, color: "var(--text)" },}, "X'S & O'S"  )
        , React.createElement('button', { className: "back-btn", onClick: onBack,}, React.createElement(Ms, { icon: "arrow_back", size: 18,} ), " Back" )
      )

      /* Mode */
      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Game Mode" )
        , React.createElement('div', { style: { display: "flex", gap: 10 },}
          , React.createElement('button', { className: `filter-btn ${vsMode === "bot" ? "active" : ""}`, style: { flex: 1, padding: "12px 0" }, onClick: () => setVsMode("bot"),}, "🤖 vs Bot"  )
          , React.createElement('button', { className: `filter-btn ${vsMode === "friend" ? "active" : ""}`, style: { flex: 1, padding: "12px 0" }, onClick: () => setVsMode("friend"),}, "👥 vs Friend"  )
        )
      )

      /* Bot difficulty */
      , vsMode === "bot" && (
        React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Bot Difficulty" )
          , React.createElement('div', { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 },}
            , BOT_LEVELS.map((b,i) => (
              React.createElement('button', { key: i, className: `filter-btn ${botLevel === i+1 ? "active" : ""}`,
                onClick: () => setBotLevel(i+1), style: { minWidth: 36 },}, i+1)
            ))
          )
          , React.createElement('div', { style: { fontSize: 12, color: "var(--accent)" },}, bot.name, " — checkout rate ~"    , Math.round(XO_BOT_HIT_RATE[botLevel-1]*100), "%")
        )
      )

      /* Player names (friend mode) */
      , vsMode === "friend" && (
        React.createElement('div', { className: "info-block",}
          , React.createElement('div', { className: "info-title",}, "Player Names" )
          , React.createElement('div', { style: { display: "flex", gap: 10 },}
            , React.createElement('div', { style: { flex: 1 },}
              , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginBottom: 6, fontWeight: 600 },}, "Player 1 (X)"  )
              , React.createElement('input', { className: "form-input", value: p1Name, onChange: e => setP1Name(e.target.value), maxLength: 12,} )
            )
            , React.createElement('div', { style: { flex: 1 },}
              , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginBottom: 6, fontWeight: 600 },}, "Player 2 (O)"  )
              , React.createElement('input', { className: "form-input", value: p2Name, onChange: e => setP2Name(e.target.value), maxLength: 12,} )
            )
          )
        )
      )

      /* Grid preview */
      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Checkout Grid" )
        , React.createElement('div', { style: { display: "flex", gap: 8, marginBottom: 12 },}
          , XO_GRIDS.map((_, i) => (
            React.createElement('button', { key: i, className: `filter-btn ${gridIdx === i ? "active" : ""}`, style: { flex: 1 }, onClick: () => setGridIdx(i),}, "Grid " , i+1)
          ))
        )
        , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 },}
          , XO_GRIDS[gridIdx].map((n, i) => (
            React.createElement('div', { key: i, style: { background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 0", textAlign: "center" },}
              , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: "var(--accent)" },}, n)
              , React.createElement('div', { style: { fontSize: 10, color: "var(--muted)" },}, CHECKOUTS[n] || "—")
            )
          ))
        )
      )

      , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: () => onStart({ vsMode, botLevel, p1Name, p2Name: vsMode === "bot" ? BOT_LEVELS[botLevel-1].name : p2Name, grid: XO_GRIDS[gridIdx] }),}, "Start Game →"

      )
    )
  );
}

// ── XOGame ───────────────────────────────────────────────────────────────────
function XOGame({ config, onComplete, onExit }) {
  var { vsMode, botLevel, p1Name, p2Name, grid } = config;
  var botHitRate = XO_BOT_HIT_RATE[botLevel - 1];

  // cells: null | "X" | "O" for each of 9 squares
  var [cells, setCells]       = useState(Array(9).fill(null));
  var [turn, setTurn]         = useState("X");  // "X" = player/p1, "O" = bot/p2
  var [selected, setSelected] = useState(null); // which square the player has tapped
  var [phase, setPhase]       = useState("pick"); // "pick" | "attempt" | "botthinking" | "done"
  var [message, setMessage]   = useState("");
  var [winResult, setWinResult] = useState(null); // {winner, line} | null
  var [confirmExit, setConfirmExit] = useState(false);
  var [attemptResult, setAttemptResult] = useState(null); // "hit" | "miss" | null

  var isPlayerTurn = turn === "X";
  var currentName = turn === "X" ? p1Name : p2Name;

  // Check for win/draw after cells update
  var checkEnd = (newCells) => {
    var result = getXOWinner(newCells);
    if (result) return result;
    if (newCells.every(c => c !== null)) return { winner: "draw", line: [] };
    return null;
  };

  var claimSquare = (idx, mark, newCells) => {
    newCells[idx] = mark;
    var end = checkEnd(newCells);
    setCells([...newCells]);
    if (end) {
      setWinResult(end);
      setPhase("done");
      var winner = end.winner === "draw" ? null : end.winner === "X" ? p1Name : p2Name;
      onComplete({ winner, p1Name, p2Name, vsMode, botLevel, cells: newCells });
      return true;
    }
    return false;
  };

  // Player picks a square
  var handleSquareTap = (idx) => {
    if (phase !== "pick" || !isPlayerTurn || cells[idx]) return;
    setSelected(idx);
    setAttemptResult(null);
    setPhase("attempt");
    setMessage(`Attempt checkout on ${grid[idx]}!`);
  };

  // Player confirms hit or miss
  var handleAttempt = (hit) => {
    if (selected === null) return;
    var newCells = [...cells];
    setAttemptResult(hit ? "hit" : "miss");
    if (hit) {
      var ended = claimSquare(selected, "X", newCells);
      if (!ended) {
        setTimeout(() => {
          setSelected(null);
          setAttemptResult(null);
          setPhase("botthinking");
          setTurn("O");
          setMessage(vsMode === "bot" ? `${p2Name} is throwing…` : `Pass to ${p2Name}`);
          if (vsMode === "bot") {
            setTimeout(() => runBotXO(newCells), 1400);
          }
        }, 800);
      }
    } else {
      // Miss — still bot's turn
      setTimeout(() => {
        setSelected(null);
        setAttemptResult(null);
        setPhase(vsMode === "bot" ? "botthinking" : "pick");
        setTurn("O");
        if (vsMode === "bot") {
          setMessage(`${p2Name} is throwing…`);
          setTimeout(() => runBotXO(newCells), 1400);
        } else {
          setMessage(`${p2Name}'s turn — pick a square`);
        }
      }, 800);
    }
  };

  // Friend player 2's turn
  var handleP2Attempt = (hit) => {
    if (selected === null) return;
    var newCells = [...cells];
    setAttemptResult(hit ? "hit" : "miss");
    if (hit) {
      var ended = claimSquare(selected, "O", newCells);
      if (!ended) {
        setTimeout(() => {
          setSelected(null); setAttemptResult(null);
          setTurn("X"); setPhase("pick");
          setMessage(`${p1Name}'s turn — pick a square`);
        }, 800);
      }
    } else {
      setTimeout(() => {
        setSelected(null); setAttemptResult(null);
        setTurn("X"); setPhase("pick");
        setMessage(`${p1Name}'s turn — pick a square`);
      }, 800);
    }
  };

  var runBotXO = (currentCells) => {
    var idx = botPickSquare(currentCells, "O", "X");
    if (idx === -1) return;
    var hit = Math.random() < botHitRate;
    var newCells = [...currentCells];
    if (hit) {
      var ended = claimSquare(idx, "O", newCells);
      if (!ended) {
        setTurn("X"); setPhase("pick");
        setMessage(`Bot hit ${grid[idx]}! Your turn.`);
      }
    } else {
      setCells([...currentCells]);
      setTurn("X"); setPhase("pick");
      setMessage(`Bot missed ${grid[idx]}. Your turn!`);
    }
  };

  // Friend mode: P2 picks square
  var handleP2SquareTap = (idx) => {
    if (phase !== "pick" || turn !== "O" || cells[idx]) return;
    setSelected(idx);
    setAttemptResult(null);
    setPhase("attempt");
    setMessage(`${p2Name}: attempt checkout on ${grid[idx]}!`);
  };

  if (confirmExit) return React.createElement(ExitConfirmModal, { onConfirm: onExit, onCancel: () => setConfirmExit(false),} );

  var winLine = _optionalChain([winResult, 'optionalAccess', _57 => _57.line]) || [];

  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement('div', { style: { paddingTop: 52, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },}
        , React.createElement('button', { className: "back-btn", onClick: () => setConfirmExit(true),}, "✕ Exit" )
        , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text)" },}, "X'S & O'S"  )
        , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", textAlign: "right" },}, vsMode === "bot" ? `L${botLevel}` : "vs Friend")
      )

      /* Turn indicator */
      , React.createElement('div', { style: { display: "flex", gap: 10, marginBottom: 16 },}
        , [{ name: p1Name, mark: "X", color: "var(--accent)" }, { name: p2Name, mark: "O", color: "#ff6b6b" }].map(p => (
          React.createElement('div', { key: p.mark, style: { flex: 1, padding: "10px 12px", borderRadius: 14, background: turn === p.mark ? `${p.color}15` : "var(--surface)", border: `2px solid ${turn === p.mark ? p.color : "var(--border)"}`, textAlign: "center", transition: "all .2s" },}
            , React.createElement('div', { style: { fontSize: 18, fontWeight: 900, color: p.color, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 2 },}, p.mark)
            , React.createElement('div', { style: { fontSize: 11, color: turn === p.mark ? p.color : "var(--muted)", fontWeight: 600, marginTop: 2 },}, p.name)
            , turn === p.mark && phase !== "done" && React.createElement('div', { style: { fontSize: 10, color: p.color, marginTop: 2 },}, "● TURN" )
          )
        ))
      )

      /* Status message */
      , message && phase !== "done" && (
        React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "8px 14px", marginBottom: 14, textAlign: "center", fontSize: 13, color: "var(--muted)" },}
          , phase === "botthinking" ? (
            React.createElement('div', { style: { display: "flex", gap: 5, justifyContent: "center", alignItems: "center" },}
              , [0,1,2].map(i => React.createElement('div', { key: i, style: { width:7,height:7,borderRadius:"50%",background:"var(--muted)",animation:`dlbounce 1.2s ${i*0.2}s infinite ease-in-out` },} ))
              , React.createElement('span', { style: { marginLeft: 8 },}, message)
            )
          ) : message
        )
      )

      /* The grid */
      , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 },}
        , grid.map((num, i) => {
          var owner = cells[i];
          var isSelected = selected === i;
          var inWinLine = winLine.includes(i);
          var ownerColor = owner === "X" ? "var(--accent)" : "#ff6b6b";
          var canTap = !owner && phase === "pick" && ((turn === "X") || (turn === "O" && vsMode === "friend"));
          return (
            React.createElement('div', { key: i, onClick: () => {
              if (turn === "X") handleSquareTap(i);
              else if (vsMode === "friend") handleP2SquareTap(i);
            },
              style: { aspectRatio: "1", background: inWinLine ? `${ownerColor}25` : owner ? `${ownerColor}12` : isSelected ? "rgba(232,118,63,.1)" : "var(--surface)", border: `2px solid ${inWinLine ? ownerColor : isSelected ? "var(--accent)" : owner ? ownerColor + "60" : "var(--border)"}`, borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: canTap ? "pointer" : "default", transition: "all .15s", WebkitTapHighlightColor: "transparent" },}
              , owner ? (
                React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: ownerColor, lineHeight: 1, filter: inWinLine ? `drop-shadow(0 0 8px ${ownerColor})` : "none" },}, owner)
              ) : (
                React.createElement(React.Fragment, null
                  , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: isSelected ? "var(--accent)" : "var(--text)", lineHeight: 1 },}, num)
                  , React.createElement('div', { style: { fontSize: 9, color: "var(--muted)", marginTop: 2 },}, CHECKOUTS[num] || "—")
                )
              )
            )
          );
        })
      )

      /* Attempt panel */
      , phase === "attempt" && selected !== null && (
        React.createElement('div', { className: "info-block",}
          , React.createElement('div', { style: { textAlign: "center", marginBottom: 14 },}
            , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: turn === "X" ? "var(--accent)" : "#ff6b6b", marginBottom: 4 },}
              , currentName, " — Checkout "   , grid[selected]
            )
            , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 44, color: "var(--text)" },}, grid[selected])
            , React.createElement('div', { style: { fontSize: 13, color: "var(--accent)", marginTop: 2 },}, CHECKOUTS[grid[selected]] || "—")
          )
          , attemptResult ? (
            React.createElement('div', { style: { textAlign: "center", padding: "12px", borderRadius: 12, background: attemptResult === "hit" ? "rgba(232,118,63,.1)" : "rgba(194,72,63,.08)", border: `1px solid ${attemptResult === "hit" ? "rgba(232,118,63,.3)" : "rgba(194,72,63,.25)"}`, fontSize: 16, fontWeight: 700, color: attemptResult === "hit" ? "var(--accent)" : "var(--accent2)" },}
              , attemptResult === "hit" ? `✅ Hit! Square claimed.` : `❌ Miss — square stays open.`
            )
          ) : (
            React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },}
              , React.createElement('button', { className: "btn btn-secondary" , onClick: () => { haptic("miss"); turn === "X" ? handleAttempt(false) : handleP2Attempt(false); },}, "✗ Missed" )
              , React.createElement('button', { className: "btn btn-primary" , onClick: () => { haptic("hit"); turn === "X" ? handleAttempt(true) : handleP2Attempt(true); },}, "✓ Hit!" )
            )
          )
        )
      )

      /* Done overlay */
      , phase === "done" && winResult && (
        React.createElement('div', { style: { background: winResult.winner === "draw" ? "var(--surface)" : winResult.winner === "X" ? "rgba(232,118,63,.08)" : "rgba(255,107,107,.08)", border: `1px solid ${winResult.winner === "draw" ? "var(--border)" : winResult.winner === "X" ? "rgba(232,118,63,.35)" : "rgba(255,107,107,.35)"}`, borderRadius: 16, padding: 20, textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 48, marginBottom: 8 },}, winResult.winner === "draw" ? "🤝" : winResult.winner === "X" ? "🏆" : "😤")
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: 2, color: winResult.winner === "X" ? "var(--accent)" : winResult.winner === "draw" ? "var(--text)" : "#ff6b6b", marginBottom: 6 },}
            , winResult.winner === "draw" ? "It's a Draw!" : `${winResult.winner === "X" ? p1Name : p2Name} Wins!`
          )
          , React.createElement('button', { className: "btn btn-primary btn-full"  , style: { marginTop: 10 }, onClick: onExit,}, "Back to Play"  )
        )
      )
    )
  );
}

// ── XOResult ─────────────────────────────────────────────────────────────────
function XOResult({ result, config, onPlayAgain, onExit }) {
  var { winner, p1Name, p2Name } = result;
  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement('div', { style: { paddingTop: 52, textAlign: "center", paddingBottom: 24 },}
        , React.createElement('div', { style: { fontSize: 72, marginBottom: 12 },}, !winner ? "🤝" : winner === p1Name ? "🏆" : "😤")
        , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 38, letterSpacing: 3, color: !winner ? "var(--text)" : winner === p1Name ? "var(--accent)" : "#ff6b6b", marginBottom: 6 },}
          , !winner ? "Draw!" : `${winner} Wins!`
        )
        , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)" },}
          , config.vsMode === "bot" ? `vs ${p2Name} (Level ${config.botLevel})` : `${p1Name} vs ${p2Name}`
        )
      )
      , React.createElement('div', { style: { display: "flex", gap: 10 },}
        , React.createElement('button', { className: "btn btn-secondary" , style: { flex: 1 }, onClick: onExit,}, React.createElement(Ms, { icon: "arrow_back", size: 18,} ), " Back" )
        , React.createElement('button', { className: "btn btn-primary" , style: { flex: 2 }, onClick: onPlayAgain,}, "Play Again →"  )
      )
    )
  );
}

// ─── DARTS AT DOUBLE POPUP ───────────────────────────────────────────────────
// Appears after any visit that leaves the player on 50 or below.
// Tracks doubles percentage across the match.

function DartsAtDoublePopup({ remaining, onConfirm }) {
  var [selected, setSelected] = React.useState(null);
  return (
    React.createElement('div', { style: { position:"fixed", inset:0, background:"rgba(0,0,0,.85)", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" },
      onClick: e => e.stopPropagation(),}
      , React.createElement('div', { style: { background:"var(--surface)", borderRadius:"28px 28px 0 0", width:"100%", maxWidth:430, padding:"24px 20px 36px", border:"1px solid var(--border)", boxShadow:"0 -8px 40px rgba(0,0,0,.6)" },}
        , React.createElement('div', { style: { width:36, height:3, background:"var(--border2)", borderRadius:100, margin:"0 auto 20px" },} )
        , React.createElement('div', { style: { textAlign:"center", marginBottom:20 },}
          , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:2, color:"var(--text)", marginBottom:4 },}, "Darts at a Double"   )
          , React.createElement('div', { style: { fontSize:13, color:"var(--muted)" },}, "How many darts did you throw at a double this visit?"          )
        )
        , React.createElement('div', { style: { display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:10, marginBottom:16 },}
          , [0,1,2,3].map(n => (
            React.createElement('button', { key: n, onClick: () => { haptic("hit"); setSelected(n); },
              style: { padding:"18px 0", background: selected===n ? "rgba(232,118,63,.2)" : "var(--surface2)", border:`2px solid ${selected===n ? "var(--accent)" : "var(--border)"}`, borderRadius:14, fontFamily:"'Bebas Neue',sans-serif", fontSize:32, color: selected===n ? "var(--accent)" : "var(--text)", cursor:"pointer", WebkitTapHighlightColor:"transparent", transition:"all .15s" },}
              , n
            )
          ))
        )
        , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: () => selected !== null && onConfirm(selected),
          style: { opacity: selected === null ? 0.4 : 1, transition:"opacity .2s" },}
          , selected !== null ? `Confirm — ${selected} dart${selected !== 1 ? "s" : ""} at double` : "Select darts used"
        )
      )
    )
  );
}

// ─── SHARED NUMPAD ───────────────────────────────────────────────────────────
// Used by both X01Game and FriendGame. Replaces the text input with a
// tap-to-build numpad identical to Dartcounter.

// ─── VOICE CALLOUT ───────────────────────────────────────────────────────────
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95; u.pitch = 0.85; u.volume = 1.0;
  // Always set lang to en-GB — this is the most reliable way to get English
  u.lang = "en-GB";
  var voices = window.speechSynthesis.getVoices();
  var FEMALE = /samantha|victoria|karen|moira|fiona|tessa|kate|lisa|susan|sara|siri|zira|hazel|eva|alice|amelie|nora|ava|allison|susan|emily|serena/i;
  var MALE_NAMES = /daniel|david|mark|james|fred|alex|george|arthur|thomas|oliver|ryan|aaron|bruce|lee|gordon|rishi/i;
  // 1. English male by name
  var byName = voices.find(v => v.lang.startsWith("en") && MALE_NAMES.test(v.name));
  // 2. Any male-flagged English voice
  var byFlag = voices.find(v => v.lang.startsWith("en") && /male/i.test(v.name) && !/fe ?male/i.test(v.name));
  // 3. Any English voice that isn't a known female name
  var byLang = voices.find(v => v.lang.startsWith("en") && !FEMALE.test(v.name));
  // 4. Any English voice at all
  var anyEn = voices.find(v => v.lang.startsWith("en"));
  var chosen = byName || byFlag || byLang || anyEn || null;
  if (chosen) u.voice = chosen;
  window.speechSynthesis.speak(u);
}

// Preload voices on first interaction (required by some browsers)
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

function Numpad({ value, onChange, onSubmit, disabled, submitLabel = "Submit →", error, remaining }) {
  var press = (digit) => {
    if (disabled) return;
    var next = value + digit;
    if (parseInt(next) > 180) return;
    haptic("hit");
    onChange(next);
  };
  var backspace = () => {
    if (disabled) return;
    onChange(value.slice(0, -1));
  };
  var handleSubmitWithVoice = () => {
    if (disabled || !value) return;
    var scored = parseInt(value) || 0;
    speak(String(scored));
    onSubmit();
  };
  var handleMiss = () => {
    if (disabled) return;
    onChange("0");
    speak("Miss");
    onSubmit();
  };

  var hasValue = !!value && value !== "0";

  return (
    React.createElement('div', null
      /* ── Score display bar ── */
      , React.createElement('div', { style: {
        background: hasValue ? "var(--glass-bg)" : "var(--surface)",
        border: `1.5px solid ${error ? "rgba(194,72,63,.5)" : hasValue ? "rgba(232,118,63,.35)" : "var(--border)"}`,
        borderRadius: "var(--radius-sm)", padding: "12px 16px", marginBottom: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        backdropFilter: "blur(12px)", transition: "border-color .15s",
        boxShadow: hasValue ? "0 0 0 3px rgba(232,118,63,.06)" : "none",
      },}
        , React.createElement('div', { style: {
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 56, letterSpacing: 2,
          color: hasValue ? "var(--text)" : "var(--muted)", lineHeight: 1, minWidth: 80,
          filter: hasValue ? "drop-shadow(0 0 8px rgba(232,118,63,.2))" : "none",
          transition: "filter .15s, color .15s",
        },}
          , value || "—"
        )
        , React.createElement('div', { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 },}
          , error && (
            React.createElement('div', { style: { display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--accent2)", fontWeight: 600 },}
              , React.createElement(Ms, { icon: "warning", size: 14,} ), " " , error
            )
          )
          , React.createElement('button', { onClick: backspace, disabled: disabled || !value,
            style: { background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 9, width: 40, height: 40, color: value ? "var(--text2)" : "var(--muted)", cursor: value ? "pointer" : "not-allowed", WebkitTapHighlightColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", opacity: value ? 1 : 0.4, transition: "opacity .15s" },}
            , React.createElement(Ms, { icon: "backspace", size: 18,} )
          )
        )
      )

      /* ── Digit grid 1–9 ── */
      , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 },}
        , ["1","2","3","4","5","6","7","8","9"].map(d => (
          React.createElement('button', { key: d, onClick: () => press(d), disabled: disabled,
            style: {
              background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
              borderRadius: "var(--radius-sm)", padding: "17px 0",
              fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 24, fontWeight: 700,
              letterSpacing: "-0.02em", color: disabled ? "var(--muted)" : "var(--text)",
              cursor: disabled ? "not-allowed" : "pointer",
              WebkitTapHighlightColor: "transparent", backdropFilter: "blur(8px)",
              transition: "transform .08s, background .1s", opacity: disabled ? 0.5 : 1,
            },
            onTouchStart: e => !disabled && (e.currentTarget.style.transform = "scale(.93)"),
            onTouchEnd: e => (e.currentTarget.style.transform = "scale(1)"),}
, d)
        ))
      )

      /* ── Bottom row: Miss | 0 | Submit ── */
      , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 },}
        /* Miss */
        , React.createElement('button', { onClick: () => { haptic("miss"); handleMiss(); }, disabled: disabled,
          style: {
            background: "rgba(194,72,63,.08)", border: "1px solid rgba(194,72,63,.25)",
            borderRadius: "var(--radius-sm)", padding: "17px 0",
            fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 13, fontWeight: 700,
            color: "var(--accent2)", cursor: disabled ? "not-allowed" : "pointer",
            WebkitTapHighlightColor: "transparent", opacity: disabled ? 0.5 : 1,
            transition: "transform .08s",
          },
          onTouchStart: e => !disabled && (e.currentTarget.style.transform = "scale(.93)"),
          onTouchEnd: e => (e.currentTarget.style.transform = "scale(1)"),}
, "Miss")

        /* 0 */
        , React.createElement('button', { onClick: () => press("0"), disabled: disabled,
          style: {
            background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
            borderRadius: "var(--radius-sm)", padding: "17px 0",
            fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 24, fontWeight: 700,
            letterSpacing: "-0.02em", color: disabled ? "var(--muted)" : "var(--text)",
            cursor: disabled ? "not-allowed" : "pointer",
            WebkitTapHighlightColor: "transparent", backdropFilter: "blur(8px)",
            transition: "transform .08s", opacity: disabled ? 0.5 : 1,
          },
          onTouchStart: e => !disabled && (e.currentTarget.style.transform = "scale(.93)"),
          onTouchEnd: e => (e.currentTarget.style.transform = "scale(1)"),}
, "0")

        /* Submit */
        , React.createElement('button', { onClick: handleSubmitWithVoice, disabled: disabled || !value,
          style: {
            background: hasValue && !disabled ? "var(--accent)" : "var(--surface2)",
            border: "none", borderRadius: "var(--radius-sm)", padding: "17px 0",
            color: hasValue && !disabled ? "var(--on-accent)" : "var(--muted)",
            cursor: hasValue && !disabled ? "pointer" : "not-allowed",
            WebkitTapHighlightColor: "transparent",
            transition: "background .15s, transform .08s",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: hasValue && !disabled ? "0 4px 16px rgba(232,118,63,.25)" : "none",
          },
          onTouchStart: e => hasValue && !disabled && (e.currentTarget.style.transform = "scale(.93)"),
          onTouchEnd: e => (e.currentTarget.style.transform = "scale(1)"),}

          , React.createElement(Ms, { icon: "arrow_upward", size: 26,} )
        )
      )

      /* ── Quick scores ── */
      , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6, marginBottom: 8 },}
        , [26, 41, 60, 100, 140, 45, 81, 85, 121, 180].map(v => (
          React.createElement('button', { key: v, onClick: () => { haptic("hit"); onChange(String(v)); }, disabled: disabled,
            style: {
              background: v === 180 ? "rgba(232,118,63,.08)" : "var(--surface2)",
              border: `1px solid ${v === 180 ? "rgba(232,118,63,.2)" : "var(--border)"}`,
              borderRadius: 9, padding: "7px 4px",
              fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 500,
              color: v === 180 ? "var(--accent)" : "var(--muted)",
              cursor: disabled ? "not-allowed" : "pointer",
              WebkitTapHighlightColor: "transparent", transition: "transform .08s",
            },
            onTouchStart: e => !disabled && (e.currentTarget.style.transform = "scale(.9)"),
            onTouchEnd: e => (e.currentTarget.style.transform = "scale(1)"),}
, v)
        ))
      )
    )
  );
}

// Dart count selector — shown when a player checks out
function CheckoutDartSelector({ score, finishRoute, onConfirm }) {
  var [darts, setDarts] = useState(null);

  // Work out max darts on a double from the route string.
  // "D16" = 1, "T20 D16" = 2, "T20 T20 Bull" = 3
  var routeParts = finishRoute ? finishRoute.trim().split(/\s+/).length : 3;
  // Options: 0 (missed every dart on the double) up to routeParts
  var options = Array.from({ length: routeParts + 1 }, (_, i) => i); // [0, 1] / [0,1,2] / [0,1,2,3]

  return (
    React.createElement('div', { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)", zIndex: 500, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" },}
      , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid rgba(232,118,63,.3)", borderRadius: 24, padding: "28px 24px", width: "100%", maxWidth: 380, textAlign: "center" },}
        , React.createElement('div', { style: { fontSize: 48, marginBottom: 8 },}, "🎯")
        , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, letterSpacing: 2, color: "var(--accent)", marginBottom: 4 },}, "Checkout!")
        , React.createElement('div', { style: { fontSize: 14, color: "var(--muted)", marginBottom: 6 },}, "Finished on "
            , React.createElement('span', { style: { color: "var(--text)", fontWeight: 700 },}, score)
          , finishRoute && React.createElement('span', { style: { color: "var(--accent)", display: "block", marginTop: 4, fontSize: 13 },}, finishRoute)
        )
        , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)", marginBottom: 20 },}, "How many darts did you use on the double?"

        )
        , React.createElement('div', { style: { display: "flex", gap: 8, marginBottom: 20, justifyContent: "center" },}
          , options.map(d => (
            React.createElement('button', { key: d, onClick: () => setDarts(d),
              style: { flex: 1, maxWidth: 72, padding: "18px 0", background: darts === d ? "var(--accent)" : "var(--surface2)", border: `1px solid ${darts === d ? "var(--accent)" : "var(--border)"}`, borderRadius: 16, fontFamily: "'Bebas Neue',sans-serif", fontSize: 34, color: darts === d ? "var(--on-accent)" : "var(--text)", cursor: "pointer", transition: "all .15s", WebkitTapHighlightColor: "transparent" },}
              , d
            )
          ))
        )
        , React.createElement('button', { onClick: () => darts !== null && onConfirm(darts), disabled: darts === null,
          style: { width: "100%", padding: "14px", background: darts !== null ? "var(--accent)" : "rgba(255,255,255,0.07)", border: "none", borderRadius: 14, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700, color: darts !== null ? "var(--on-accent)" : "var(--muted)", cursor: darts !== null ? "pointer" : "not-allowed", transition: "all .2s" },}, "Confirm →"

        )
      )
    )
  );
}

function X01Setup({ onStart, onClose }) {
  var [startScore, setStartScore] = useState(501);
  var [customScore, setCustomScore] = useState("");
  var [isSets, setIsSets] = useState(false);
  var [targetLegs, setTargetLegs] = useState(3);
  var [legsPerSet, setLegsPerSet] = useState(3);
  var [targetSets, setTargetSets] = useState(3);
  var [finishRule, setFinishRule] = useState("double");
  var [botLevel, setBotLevel] = useState(3);
  var bot = BOT_LEVELS[botLevel - 1];
  var finalScore = startScore === "custom" ? parseInt(customScore) || 501 : startScore;
  var [customLegsBot, setCustomLegsBot] = useState("");
  var [customSetsBot, setCustomSetsBot] = useState("");
  var [customLpsBot, setCustomLpsBot] = useState("");
  var finalTargetLegs = targetLegs === "custom" ? (parseInt(customLegsBot) || 3) : targetLegs;
  var finalTargetSets = targetSets === "custom" ? (parseInt(customSetsBot) || 3) : targetSets;
  var finalLegsPerSet = legsPerSet === "custom" ? (parseInt(customLpsBot) || 3) : legsPerSet;

  var handleStart = () => {
    onStart({ startScore: finalScore, isSets, targetLegs: finalTargetLegs, legsPerSet: finalLegsPerSet, targetSets: finalTargetSets, finishRule, botLevel });
  };

  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement('div', { style: { paddingTop: 52, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },}
        , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, letterSpacing: 2, color: "var(--text)" },}, "PLAY vs BOT"  )
        , React.createElement('button', { className: "back-btn", onClick: onClose,}, "✕ Close" )
      )

      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Starting Score" )
        , React.createElement('div', { style: { display: "flex", gap: 8, flexWrap: "wrap" },}
          , [301, 501, 701].map(s => (
            React.createElement('button', { key: s, className: `filter-btn ${startScore === s ? "active" : ""}`, style: { flex: 1 }, onClick: () => setStartScore(s),}, s)
          ))
          , React.createElement('button', { className: `filter-btn ${startScore === "custom" ? "active" : ""}`, style: { flex: 1 }, onClick: () => setStartScore("custom"),}, "Custom")
        )
        , startScore === "custom" && (
          React.createElement('input', { className: "form-input", style: { marginTop: 10 }, type: "number", placeholder: "e.g. 401" , value: customScore, onChange: e => setCustomScore(e.target.value), min: "101", max: "1001",} )
        )
      )

      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Match Format" )
        , React.createElement('div', { style: { display: "flex", gap: 8, marginBottom: 12 },}
          , React.createElement('button', { className: `filter-btn ${!isSets ? "active" : ""}`, style: { flex: 1 }, onClick: () => setIsSets(false),}, "Legs Only" )
          , React.createElement('button', { className: `filter-btn ${isSets ? "active" : ""}`, style: { flex: 1 }, onClick: () => setIsSets(true),}, "Sets & Legs"  )
        )
        , !isSets ? (
          React.createElement('div', null
            , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginBottom: 8 },}, "First to how many legs?"    )
            , React.createElement('div', { style: { display: "flex", gap: 6, flexWrap: "wrap" },}
              , [1,2,3,5,7,10,"custom"].map(n => (
                React.createElement('button', { key: n, className: `filter-btn ${targetLegs === n ? "active" : ""}`, onClick: () => setTargetLegs(n),}, n === "custom" ? "Other" : n)
              ))
            )
            , targetLegs === "custom" && (
              React.createElement('input', { className: "form-input", style: { marginTop: 10 }, type: "number", placeholder: "Enter legs" , value: customLegsBot, onChange: e => setCustomLegsBot(e.target.value), min: "1", max: "99",} )
            )
          )
        ) : (
          React.createElement('div', null
            , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginBottom: 8 },}, "First to sets"  )
            , React.createElement('div', { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 },}
              , [2,3,4,5,6,7,"custom"].map(n => (
                React.createElement('button', { key: n, className: `filter-btn ${targetSets === n ? "active" : ""}`, onClick: () => setTargetSets(n),}, n === "custom" ? "Other" : n)
              ))
            )
            , targetSets === "custom" && (
              React.createElement('input', { className: "form-input", style: { marginTop: 0, marginBottom: 10 }, type: "number", placeholder: "Enter sets" , value: customSetsBot, onChange: e => setCustomSetsBot(e.target.value), min: "1", max: "99",} )
            )
            , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginBottom: 8 },}, "Legs per set (first to)"    )
            , React.createElement('div', { style: { display: "flex", gap: 6, flexWrap: "wrap" },}
              , [2,3,4,5,"custom"].map(n => (
                React.createElement('button', { key: n, className: `filter-btn ${legsPerSet === n ? "active" : ""}`, onClick: () => setLegsPerSet(n),}, n === "custom" ? "Other" : n)
              ))
            )
            , legsPerSet === "custom" && (
              React.createElement('input', { className: "form-input", style: { marginTop: 10 }, type: "number", placeholder: "Legs per set"  , value: customLpsBot, onChange: e => setCustomLpsBot(e.target.value), min: "1", max: "20",} )
            )
          )
        )
      )

      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Finish Rule" )
        , React.createElement('div', { style: { display: "flex", gap: 8 },}
          , React.createElement('button', { className: `filter-btn ${finishRule === "double" ? "active" : ""}`, style: { flex: 1 }, onClick: () => setFinishRule("double"),}, "Double Out" )
          , React.createElement('button', { className: `filter-btn ${finishRule === "straight" ? "active" : ""}`, style: { flex: 1 }, onClick: () => setFinishRule("straight"),}, "Straight Out" )
        )
        , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginTop: 8 },}, finishRule === "double" ? "Final dart must land in a double or bull. Standard competitive rule." : "Reach exactly zero with any dart. No double required.")
      )

      , React.createElement('div', { className: "info-block",}
        , React.createElement('div', { className: "info-title",}, "Bot Difficulty" )
        , React.createElement('div', { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 14 },}
          , React.createElement('button', { className: "btn btn-secondary btn-sm"  , onClick: () => setBotLevel(l => Math.max(1, l - 1)),}, "−")
          , React.createElement('div', { style: { flex: 1, textAlign: "center" },}
            , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: "var(--accent)", letterSpacing: 2 },}, "Level " , botLevel)
            , React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: "var(--text)" },}, bot.name)
            , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginTop: 2 },}, "~", bot.avg, " avg · "   , Math.round(bot.checkoutPct * 100), "% checkout rate"  )
          )
          , React.createElement('button', { className: "btn btn-secondary btn-sm"  , onClick: () => setBotLevel(l => Math.min(10, l + 1)),}, "+")
        )
        , React.createElement('div', { style: { display: "flex", gap: 5, justifyContent: "center" },}
          , BOT_LEVELS.map(b => (
            React.createElement('div', { key: b.level, onClick: () => setBotLevel(b.level), style: { width: 24, height: 24, borderRadius: 6, background: botLevel === b.level ? "var(--accent)" : "var(--surface2)", border: `1px solid ${botLevel === b.level ? "var(--accent)" : "var(--border)"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: botLevel === b.level ? "var(--on-accent)" : "var(--muted)" },}
              , b.level
            )
          ))
        )
      )

      , React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, marginBottom: 16, textAlign: "center" },}
        , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)" },}
          , finalScore, " · "  , isSets ? `First to ${targetSets} sets (${legsPerSet} legs/set)` : `First to ${targetLegs} leg${targetLegs > 1 ? "s" : ""}`, " · "  , finishRule === "double" ? "Double out" : "Straight out", " · vs "   , bot.name
        )
      )

      , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: handleStart, disabled: startScore === "custom" && (!customScore || parseInt(customScore) < 2),}, "🎯 Start Match"

      )
    )
  );
}

function X01Game({ config, onComplete, onExit }) {
  var { startScore, isSets, targetLegs, legsPerSet, targetSets, finishRule, botLevel } = config;
  var bot = BOT_LEVELS[botLevel - 1];

  // Who goes first — null until decided
  var [whoFirst, setWhoFirst] = useState(null); // null | "player" | "bot"
  var [botGoesFirst, setBotGoesFirst] = useState(false);

  // Total game darts
  var [playerDarts, setPlayerDarts]       = useState(0);
  var [botDarts, setBotDarts]             = useState(0);
  // Current leg darts (reset each leg)
  var [playerLegDarts, setPlayerLegDarts] = useState(0);
  var [botLegDarts, setBotLegDarts]       = useState(0);
  // Remaining scores
  var [playerRemaining, setPlayerRemaining] = useState(startScore);
  var [botRemaining, setBotRemaining]       = useState(startScore);
  // Leg/set counters
  var [playerLegs, setPlayerLegs]           = useState(0);
  var [botLegs, setBotLegs]                 = useState(0);
  var [playerSets, setPlayerSets]           = useState(0);
  var [botSets, setBotSets]                 = useState(0);
  var [playerLegsInSet, setPlayerLegsInSet] = useState(0);
  var [botLegsInSet, setBotLegsInSet]       = useState(0);
  // Input
  var [visitInput, setVisitInput]           = useState("");
  var [inputError, setInputError]           = useState("");
  var [lastPlayerVisit, setLastPlayerVisit] = useState(null);
  var [lastBotVisit, setLastBotVisit]       = useState(null);
  var [playerVisits, setPlayerVisits]       = useState([]);
  var [botVisits, setBotVisits]             = useState([]);
  var [botThinking, setBotThinking]         = useState(false);
  var [legWinner, setLegWinner]             = useState(null);
  var [legNumber, setLegNumber]             = useState(1);
  var [checkoutPending, setCheckoutPending] = useState(null); // {scored, newRemaining, newDarts, newVisits}
  var [undoStack, setUndoStack]             = useState([]); // snapshots for undo
  var [confirmExit, setConfirmExit]         = useState(false);
  var [legAvgSnapshot, setLegAvgSnapshot]   = useState({ playerAvg: 0, botAvg: 0 });
  var [playerDartsAtDouble, setPlayerDartsAtDouble] = useState(0);
  var [playerDoublesHit, setPlayerDoublesHit]       = useState(0);
  var [doublePopupPending, setDoublePopupPending]   = useState(null);
  // Running totals of score from the board — updated each leg, not derived from remaining
  var [playerTotalScored, setPlayerTotalScored] = useState(0);
  var [botTotalScored, setBotTotalScored]       = useState(0);

  // legAvg = this leg only (score so far this leg / darts thrown this leg).
  // gameAvg = cumulative running total across whole match.
  var totalPlayerDartsThrown = playerDarts + playerLegDarts;
  var totalBotDartsThrown    = botDarts + botLegDarts;
  // This leg's score = startScore - playerRemaining (how much scored off the board this leg)
  var thisLegPlayerScored    = startScore - playerRemaining;
  var thisLegBotScored       = startScore - botRemaining;
  // Full match scored = all previous legs + this leg
  var fullPlayerScored       = playerTotalScored + thisLegPlayerScored;
  var fullBotScored          = botTotalScored    + thisLegBotScored;
  var legAvg     = playerLegDarts > 0 ? Math.round(thisLegPlayerScored / playerLegDarts * 3 * 10) / 10 : 0;
  var gameAvg    = totalPlayerDartsThrown > 0 ? Math.round(fullPlayerScored / totalPlayerDartsThrown * 3 * 10) / 10 : 0;
  var botGameAvg = totalBotDartsThrown    > 0 ? Math.round(fullBotScored    / totalBotDartsThrown    * 3 * 10) / 10 : 0;
  var checkoutHint = getCheckoutHint(playerRemaining, finishRule);

  // "You require X" is fired directly in handlePlayerSubmit (not via useEffect)
  // so we can precisely time it after the bot score callout finishes.

  var checkMatchWinner = (pLegs, bLegs, pSets, bSets, pLegsSet, bLegsSet) => {
    if (isSets) {
      if (pSets >= targetSets) return "player";
      if (bSets >= targetSets) return "bot";
    } else {
      if (pLegs >= targetLegs) return "player";
      if (bLegs >= targetLegs) return "bot";
    }
    return null;
  };

  var startNewLeg = (newPLegs, newBLegs, newPSets, newBSets, newPLegsSet, newBLegsSet) => {
    // Commit this leg's scored totals before resetting remaining
    setPlayerTotalScored(t => t + (startScore - playerRemaining));
    setBotTotalScored(t => t + (startScore - botRemaining));
    setPlayerRemaining(startScore);
    setBotRemaining(startScore);
    setPlayerDarts(d => d + playerLegDarts);
    setBotDarts(d => d + botLegDarts);
    setPlayerLegDarts(0);
    setBotLegDarts(0);
    setLastPlayerVisit(null);
    setLastBotVisit(null);
    setLegWinner(null);
    setLegNumber(n => n + 1);
    setVisitInput("");
  };

  var handleLegWon = (winner, newPLegs, newBLegs, newPSets, newBSets, newPLegsSet, newBLegsSet, allPlayerVisits, allBotVisits, finalPlayerLegDarts, finalBotLegDarts) => {
    var matchWinner = checkMatchWinner(newPLegs, newBLegs, newPSets, newBSets, newPLegsSet, newBLegsSet);
    if (matchWinner) {
      // Compute averages directly from visit arrays — most accurate source.
      // Average = total scored / total visits * 3 (per-dart average × 3 = per-visit average).
      // Busted visits scored 0 effectively so we only sum non-bust scores.
      var pTotalScored = allPlayerVisits.reduce((a, v) => a + (v.score || 0), 0);
      var bTotalScored = allBotVisits.reduce((a, v) => a + (v.score || 0), 0);
      var pVisits = allPlayerVisits.length;
      var bVisits = allBotVisits.length;
      var finalPAvg = pVisits > 0 ? Math.round(pTotalScored / pVisits * 10) / 10 : 0;
      var finalBAvg = bVisits > 0 ? Math.round(bTotalScored / bVisits * 10) / 10 : 0;
      onComplete({ winner: matchWinner, playerLegs: newPLegs, botLegs: newBLegs, playerSets: newPSets, botSets: newBSets, playerAvg: finalPAvg, botAvg: finalBAvg, playerVisits: allPlayerVisits, botVisits: allBotVisits, botName: bot.name, botLevel, playerDartsAtDouble, playerDoublesHit });
    } else {
      // Snapshot the averages now, before startNewLeg resets the dart counters
      var snapPDarts = playerDarts + (_nullishCoalesce(finalPlayerLegDarts, () => ( playerLegDarts)));
      var snapBDarts = botDarts    + (_nullishCoalesce(finalBotLegDarts, () => ( botLegDarts)));
      var snapPScored = (startScore * newPLegs) + (startScore - playerRemaining);
      var snapBScored = (startScore * newBLegs) + (startScore - botRemaining);
      // Use full match running totals for the snapshot averages
      var snapPScored = playerTotalScored + (startScore - playerRemaining);
      var snapBScored = botTotalScored    + (startScore - botRemaining);
      setLegAvgSnapshot({
        playerAvg: snapPDarts > 0 ? Math.round(snapPScored / snapPDarts * 3 * 10) / 10 : 0,
        botAvg:    snapBDarts > 0 ? Math.round(snapBScored / snapBDarts * 3 * 10) / 10 : 0,
      });
      setLegWinner(winner);
    }
  };

  var handleUndo = () => {
    if (undoStack.length === 0 || botThinking) return;
    var prev = undoStack[undoStack.length - 1];
    setUndoStack(s => s.slice(0, -1));
    setPlayerRemaining(prev.playerRemaining);
    setPlayerLegDarts(prev.playerLegDarts);
    setPlayerVisits(prev.playerVisits);
    setLastPlayerVisit(prev.lastPlayerVisit);
    setInputError("");
    setVisitInput("");
  };

  var handlePlayerSubmit = () => {
    haptic("hit");
    var scored = parseInt(visitInput);
    if (isNaN(scored) || scored < 0 || scored > 180) { haptic("error"); setInputError("Enter a valid score (0–180)"); return; }
    setInputError("");
    var newRemaining = playerRemaining - scored;
    var newLegDarts  = playerLegDarts + 3;

    // Push snapshot before committing
    setUndoStack(s => [...s, { playerRemaining, playerLegDarts, playerVisits, lastPlayerVisit }]);

    // Bust check
    var bust = finishRule === "double" ? (newRemaining < 0 || newRemaining === 1) : newRemaining < 0;
    if (bust) {
      setInputError(`Bust! You need ${playerRemaining}${finishRule === "double" ? " (not 1)" : ""}`);
      setLastPlayerVisit({ score: scored, bust: true });
      setPlayerLegDarts(newLegDarts);
      setVisitInput("");
      setTimeout(() => runBotVisit(playerRemaining, newLegDarts), 800);
      return;
    }

    var newVisits = [...playerVisits, { score: scored, remaining: newRemaining }];
    setPlayerVisits(newVisits);
    setPlayerRemaining(newRemaining);
    setLastPlayerVisit({ score: scored, remaining: newRemaining, checkout: newRemaining === 0 });
    setVisitInput("");

    if (newRemaining === 0) {
      // Checkout — show doubles popup first
      setDoublePopupPending({ isCheckout: true, checkoutData: { scored, newRemaining, newLegDarts, newVisits, finishRoute: CHECKOUTS[newRemaining] || null } });
    } else if (newRemaining <= 50) {
      // On a double — ask darts used before bot throws
      setDoublePopupPending({ isCheckout: false, newRemaining, newLegDarts, newVisits });
    } else {
      setPlayerLegDarts(newLegDarts);
      setTimeout(() => runBotVisit(newRemaining, newLegDarts), 900);
      if (getCheckoutHint(newRemaining, finishRule) && newRemaining > 0) {
        setTimeout(() => speak(`You require ${newRemaining}`), 3800);
      }
    }
  };

  var handleDoublePopupBot = (dartsUsed) => {
    if (!doublePopupPending) return;
    setPlayerDartsAtDouble(d => d + dartsUsed);
    var { isCheckout, checkoutData, newRemaining, newLegDarts, newVisits } = doublePopupPending;
    setDoublePopupPending(null);
    if (isCheckout && checkoutData) {
      setPlayerDoublesHit(h => h + 1);
      setCheckoutPending(checkoutData);
    } else {
      setPlayerLegDarts(newLegDarts);
      setTimeout(() => runBotVisit(newRemaining, newLegDarts), 900);
      if (getCheckoutHint(newRemaining, finishRule) && newRemaining > 0) {
        setTimeout(() => speak(`You require ${newRemaining}`), 3800);
      }
    }
  };

  var confirmCheckout = (dartsUsed) => {
    if (!checkoutPending) return;
    var { newVisits, newLegDarts } = checkoutPending;
    var actualLegDarts = newLegDarts - 3 + dartsUsed;
    setPlayerLegDarts(actualLegDarts);
    setCheckoutPending(null);
    var nPLegs = playerLegs + 1;
    var nPSets = playerSets, nPLegsSet = playerLegsInSet + 1, nBLegsSet = botLegsInSet;
    if (isSets && nPLegsSet >= legsPerSet) { nPSets = playerSets + 1; nPLegsSet = 0; nBLegsSet = 0; }
    setPlayerLegs(nPLegs);
    if (isSets) { setPlayerSets(nPSets); setPlayerLegsInSet(nPLegsSet); setBotLegsInSet(nBLegsSet); }
    // Voice callout
    var isMatchWin = checkMatchWinner(nPLegs, botLegs, nPSets, botSets, nPLegsSet, nBLegsSet);
    speak(isMatchWin ? "Game shot and the match" : "Game shot");
    handleLegWon("player", nPLegs, botLegs, nPSets, botSets, nPLegsSet, nBLegsSet, newVisits, botVisits, actualLegDarts, botLegDarts);
  };

  var runBotVisit = (playerNewRemaining, playerNewLegDarts) => {
    setBotThinking(true);
    setTimeout(() => {
      var visit = generateBotVisit(botLevel, botRemaining, finishRule);
      var newBotRemaining = botRemaining - visit.score;
      var newBotLegDarts  = botLegDarts + 3;
      var newBotVisits = [...botVisits, { score: visit.score, remaining: newBotRemaining, checkout: visit.checkout }];
      setBotVisits(newBotVisits);
      setBotRemaining(newBotRemaining);
      setBotLegDarts(newBotLegDarts);
      setLastBotVisit({ ...visit, remaining: newBotRemaining });
      setBotThinking(false);
      // Call out bot's score
      speak(String(visit.score));

      if (newBotRemaining === 0) {
        var nBLegs = botLegs + 1;
        var nBSets = botSets, nBLegsSet = botLegsInSet + 1, nPLegsSet = playerLegsInSet;
        if (isSets && nBLegsSet >= legsPerSet) { nBSets = botSets + 1; nBLegsSet = 0; nPLegsSet = 0; }
        setBotLegs(nBLegs);
        if (isSets) { setBotSets(nBSets); setBotLegsInSet(nBLegsSet); setPlayerLegsInSet(nPLegsSet); }
        // Voice callout for bot checkout
        var isBotMatchWin = checkMatchWinner(playerLegs, nBLegs, playerSets, nBSets, nPLegsSet, nBLegsSet);
        setTimeout(() => speak(isBotMatchWin ? "Game shot and the match" : "Game shot"), 300);
        handleLegWon("bot", playerLegs, nBLegs, playerSets, nBSets, nPLegsSet, nBLegsSet, playerVisits, newBotVisits, playerLegDarts, newBotLegDarts);
      }
    }, 1200 + Math.random() * 800);
  };

  // Who goes first screen
  if (!whoFirst) return (
    React.createElement('div', { style: { position:"fixed", inset:0, background:"var(--bg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:32, zIndex:50 },}
      , React.createElement('div', { style: { fontSize:56, marginBottom:12 },}, "🎯")
      , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:22, fontWeight:800, letterSpacing:"-0.02em", color:"var(--text)", marginBottom:6 },}, "Who Goes First?"  )
      , React.createElement('div', { style: { fontSize:13, color:"var(--muted)", marginBottom:28 },}, "Choose who throws first in leg 1"      )
      , React.createElement('div', { style: { display:"flex", flexDirection:"column", gap:12, width:"100%", maxWidth:300 },}
        , React.createElement('button', { className: "btn btn-primary" , onClick: () => setWhoFirst("player"),}, "🧑 I go first"   )
        , React.createElement('button', { className: "btn btn-secondary" , onClick: () => { setWhoFirst("bot"); setBotGoesFirst(true); setTimeout(() => runBotVisit(startScore, 0), 600); },}, "🤖 " , bot.name, " goes first"  )
        , React.createElement('button', { className: "btn btn-secondary" , onClick: () => {
          var coinWinner = Math.random() < 0.5 ? "player" : "bot";
          setWhoFirst(coinWinner);
          if (coinWinner === "bot") { setBotGoesFirst(true); setTimeout(() => runBotVisit(startScore, 0), 600); }
        },}, "🪙 Coin Toss"  )
      )
    )
  );

  if (legWinner) {
    return (
      React.createElement('div', { className: "scroll-area",}
        , confirmExit && React.createElement(ExitConfirmModal, { onConfirm: onExit, onCancel: () => setConfirmExit(false),} )
        , React.createElement('div', { style: { paddingTop: 52, textAlign: "center", paddingBottom: 24 },}
          , React.createElement('div', { style: { fontSize: 64, marginBottom: 12 },}, legWinner === "player" ? "🏆" : "😤")
          , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 6 },}
            , legWinner === "player" ? "Leg Won!" : "Leg Lost"
          )
          , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)" },}
            , isSets ? `Sets: You ${playerSets} – ${botSets} ${bot.name}` : `Legs: You ${playerLegs} – ${botLegs} ${bot.name}`
          )
        )
        , React.createElement('div', { className: "stat-row",}
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, legAvgSnapshot.playerAvg), React.createElement('div', { className: "stat-lbl",}, "Your Avg" ))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, legAvgSnapshot.botAvg), React.createElement('div', { className: "stat-lbl",}, "Bot Avg" ))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, legNumber), React.createElement('div', { className: "stat-lbl",}, "Leg"))
        )
        , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: () => {
          var nPLegs = playerLegs, nBLegs = botLegs;
          var nPSets = playerSets, nBSets = botSets;
          startNewLeg(nPLegs, nBLegs, nPSets, nBSets, playerLegsInSet, botLegsInSet);
        },}, "Next Leg →"  )
        , React.createElement('button', { className: "btn btn-secondary btn-full"  , style: { marginTop: 10 }, onClick: () => setConfirmExit(true),}, "Exit Match" )
      )
    );
  }

  return (
    React.createElement('div', { className: "scroll-area",}
      /* Checkout dart selector overlay */
      , doublePopupPending && (
        React.createElement(DartsAtDoublePopup, {
          remaining: doublePopupPending.isCheckout ? 0 : doublePopupPending.newRemaining,
          onConfirm: handleDoublePopupBot,}
        )
      )
      , !doublePopupPending && checkoutPending && React.createElement(CheckoutDartSelector, { score: checkoutPending.scored, finishRoute: checkoutPending.finishRoute, onConfirm: confirmCheckout,} )
      , confirmExit && React.createElement(ExitConfirmModal, { onConfirm: onExit, onCancel: () => setConfirmExit(false),} )

      , React.createElement('div', { style: { paddingTop: 52, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },}
        , React.createElement('button', { className: "back-btn", onClick: () => setConfirmExit(true),}, "✕ Exit" )
        , React.createElement('div', { style: { textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)" },}
            , isSets ? `Sets ${playerSets}–${botSets} · Legs ${playerLegsInSet}–${botLegsInSet}` : `Legs ${playerLegs}–${botLegs}`
          )
          , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginTop: 2 },}, "Leg " , legNumber, " · "  , startScore, " · "  , finishRule === "double" ? "Double out" : "Straight out")
        )
        , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", textAlign: "right" },}, "L", botLevel, React.createElement('br', null), bot.name.split(" ")[0])
      )

      /* Scoreboard */
      , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 },}
        /* Player */
        , React.createElement('div', { style: { background: "linear-gradient(135deg,rgba(232,118,63,.08),rgba(168,255,120,.03))", border: "1px solid rgba(232,118,63,.3)", borderRadius: "var(--radius)", padding: "14px 12px", textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--accent)", marginBottom: 4 },}, "You")
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 56, letterSpacing: 3, color: "var(--text)", lineHeight: 1 },}, playerRemaining)
          /* Averages + dart count */
          , React.createElement('div', { style: { display: "flex", gap: 5, justifyContent: "center", marginTop: 6 },}
            , React.createElement('div', { style: { background: "rgba(232,118,63,.1)", borderRadius: 8, padding: "3px 7px" },}
              , React.createElement('div', { style: { fontSize: 8, color: "var(--accent)", fontWeight: 700, letterSpacing: 1 },}, "LEG")
              , React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: "var(--accent)" },}, legAvg)
            )
            , React.createElement('div', { style: { background: "var(--surface2)", borderRadius: 8, padding: "3px 7px" },}
              , React.createElement('div', { style: { fontSize: 8, color: "var(--muted)", fontWeight: 700, letterSpacing: 1 },}, "GAME")
              , React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: "var(--text)" },}, gameAvg)
            )
            , React.createElement('div', { style: { background: "var(--surface2)", borderRadius: 8, padding: "3px 7px" },}
              , React.createElement('div', { style: { fontSize: 8, color: "var(--muted)", fontWeight: 700, letterSpacing: 1 },}, "DARTS")
              , React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: "var(--text)" },}, playerLegDarts)
            )
            , playerDartsAtDouble > 0 && (
              React.createElement('div', { style: { background: "var(--surface2)", borderRadius: 8, padding: "3px 7px" },}
                , React.createElement('div', { style: { fontSize: 8, color: "var(--muted)", fontWeight: 700, letterSpacing: 1 },}, "DBL%")
                , React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: "var(--accent)" },}, Math.round(playerDoublesHit / playerDartsAtDouble * 100), "%")
              )
            )
          )
          /* Hide last visit badge when on a finish — checkout hint takes over */
          , lastPlayerVisit && !checkoutHint && (
            React.createElement('div', { style: { marginTop: 6, padding: "3px 8px", borderRadius: 8, display: "inline-block", background: lastPlayerVisit.bust ? "rgba(194,72,63,.15)" : lastPlayerVisit.checkout ? "rgba(232,118,63,.2)" : "var(--surface2)", fontSize: 13, fontWeight: 700, color: lastPlayerVisit.bust ? "var(--accent2)" : lastPlayerVisit.checkout ? "var(--accent)" : "var(--text)" },}
              , lastPlayerVisit.bust ? `BUST` : lastPlayerVisit.checkout ? `✓ ${lastPlayerVisit.score}` : `+${lastPlayerVisit.score}`
            )
          )
        )
        /* Bot */
        , React.createElement('div', { style: { background: "var(--surface)", border: `1px solid ${getCheckoutHint(botRemaining, finishRule) ? "rgba(194,72,63,.3)" : "var(--border)"}`, borderRadius: "var(--radius)", padding: "14px 12px", textAlign: "center" },}
          , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 },}, bot.name.split(" ")[0])
          , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 56, letterSpacing: 3, color: "var(--text)", lineHeight: 1 },}, botRemaining)
          /* Show bot checkout hint if on a finish */
          , getCheckoutHint(botRemaining, finishRule) && (
            React.createElement('div', { style: { fontSize: 12, fontWeight: 700, color: "var(--accent2)", marginTop: 4 },}
              , getCheckoutHint(botRemaining, finishRule)
            )
          )
          , React.createElement('div', { style: { display: "flex", gap: 6, justifyContent: "center", marginTop: 6 },}
            , React.createElement('div', { style: { background: "var(--surface2)", borderRadius: 8, padding: "3px 8px" },}
              , React.createElement('div', { style: { fontSize: 9, color: "var(--muted)", fontWeight: 700, letterSpacing: 1 },}, "GAME")
              , React.createElement('div', { style: { fontSize: 14, fontWeight: 700, color: "var(--text)" },}, botGameAvg)
            )
          )
          , botThinking ? (
            React.createElement('div', { style: { marginTop: 6, display: "flex", gap: 4, justifyContent: "center" },}
              , [0,1,2].map(i => (React.createElement('div', { key: i, style: { width: 7, height: 7, borderRadius: "50%", background: "var(--muted)", animation: `dlbounce 1.2s ${i*0.2}s infinite ease-in-out` },} )))
            )
          ) : lastBotVisit && (
            React.createElement('div', { style: { marginTop: 6, padding: "3px 8px", borderRadius: 8, display: "inline-block", background: lastBotVisit.checkout ? "rgba(194,72,63,.15)" : "var(--surface2)", fontSize: 13, fontWeight: 700, color: lastBotVisit.checkout ? "var(--accent2)" : "var(--text)" },}
              , lastBotVisit.checkout ? `✓ ${lastBotVisit.score}` : `+${lastBotVisit.score}`
            )
          )
        )
      )

      /* Checkout hint — inline under remaining */
      , checkoutHint && (
        React.createElement('div', { style: { background: "rgba(232,118,63,.08)", border: "1px solid rgba(232,118,63,.3)", borderRadius: 12, padding: "8px 14px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" },}
          , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, color: "var(--accent)" },}, "💡 " , playerRemaining)
          , React.createElement('div', { style: { fontSize: 14, fontWeight: 700, color: "var(--text)" },}, checkoutHint)
        )
      )

      /* Undo + Numpad */
      , undoStack.length > 0 && !botThinking && (
        React.createElement('button', { onClick: handleUndo, style: {
          width: "100%", padding: "11px", marginBottom: 8,
          background: "rgba(194,72,63,.08)", border: "1px solid rgba(194,72,63,.25)",
          borderRadius: 14, cursor: "pointer", color: "var(--accent2)",
          fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          WebkitTapHighlightColor: "transparent",
        },}, "↩ Undo Last Visit"

          , React.createElement('span', { style: { fontSize: 11, fontWeight: 400, color: "rgba(194,72,63,.6)" },}, "(was "
             , undoStack[undoStack.length-1].playerRemaining, " → "  , undoStack[undoStack.length-1].playerRemaining - (_nullishCoalesce(_optionalChain([playerVisits, 'access', _58 => _58[playerVisits.length-1], 'optionalAccess', _59 => _59.score]), () => ( 0))), ")"
          )
        )
      )
      , React.createElement(Numpad, {
        value: visitInput,
        onChange: v => { setVisitInput(v); setInputError(""); },
        onSubmit: handlePlayerSubmit,
        disabled: botThinking,
        submitLabel: botThinking ? "Bot is throwing…" : "Submit Visit →",
        error: inputError,
        remaining: playerRemaining,}
      )


    )
  );
}

function X01Result({ result, config, onPlayAgain, onExit }) {
  var { winner, playerLegs, botLegs, playerSets, botSets, playerAvg, botAvg, botName, botLevel, playerDartsAtDouble, playerDoublesHit } = result;
  var playerWon = winner === "player";
  var [coachInsight, setCoachInsight] = React.useState(null);
  var [coachLoading, setCoachLoading] = React.useState(true);
  React.useEffect(() => {
    getMatchInsight({ type:"bot", playerWon, playerAvg, botAvg, botName, botLevel, playerLegs, botLegs, playerDartsAtDouble, playerDoublesHit })
      .then(insight => { setCoachInsight(insight); setCoachLoading(false); })
      .catch(() => setCoachLoading(false));
  }, []);
  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement('div', { style: { paddingTop: 52, textAlign: "center", paddingBottom: 24 },}
        , React.createElement('div', { style: { fontSize: 72, marginBottom: 16 },}, playerWon ? "🏆" : "😤")
        , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", color: playerWon ? "var(--accent)" : "var(--text)", marginBottom: 8 },}
          , playerWon ? "You Win!" : "Bot Wins"
        )
        , React.createElement('div', { style: { fontSize: 14, color: "var(--muted)" },}, "vs "
           , botName, " (Level "  , botLevel, ")"
        )
      )

      , React.createElement('div', { className: "stat-row",}
        , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val", style: { fontSize: 22 },}, config.isSets ? `${playerSets}–${botSets}` : `${playerLegs}–${botLegs}`), React.createElement('div', { className: "stat-lbl",}, config.isSets ? "Sets" : "Legs"))
        , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, playerAvg), React.createElement('div', { className: "stat-lbl",}, "Your Avg" ))
        , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, botAvg), React.createElement('div', { className: "stat-lbl",}, "Bot Avg" ))
        , playerDartsAtDouble > 0 && React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val", style: { color:"var(--accent)" },}, Math.round(playerDoublesHit/playerDartsAtDouble*100), "%"), React.createElement('div', { className: "stat-lbl",}, "Doubles"))
      )

      , React.createElement('div', { className: "info-block", style: { marginBottom: 16 },}
        , React.createElement('div', { className: "info-title",}, "Match Summary" )
        , React.createElement('div', { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, textAlign: "center" },}
          , React.createElement('div', null
            , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginBottom: 4 },}, "You")
            , React.createElement('div', { style: { fontSize: 22, fontWeight: 700, color: "var(--text)" },}, config.isSets ? playerSets : playerLegs)
            , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)" },}, config.isSets ? "sets" : "legs")
            , React.createElement('div', { style: { fontSize: 18, fontWeight: 600, color: "var(--accent)", marginTop: 8 },}, playerAvg)
            , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)" },}, "average")
          )
          , React.createElement('div', null
            , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginBottom: 4 },}, botName)
            , React.createElement('div', { style: { fontSize: 22, fontWeight: 700, color: "var(--text)" },}, config.isSets ? botSets : botLegs)
            , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)" },}, config.isSets ? "sets" : "legs")
            , React.createElement('div', { style: { fontSize: 18, fontWeight: 600, color: "var(--muted)", marginTop: 8 },}, botAvg)
            , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)" },}, "average")
          )
        )
        , React.createElement('div', { style: { marginTop: 14, padding: "10px 14px", background: playerWon ? "rgba(232,118,63,.06)" : "rgba(194,72,63,.06)", border: `1px solid ${playerWon ? "rgba(232,118,63,.2)" : "rgba(194,72,63,.2)"}`, borderRadius: 10, fontSize: 13, color: "var(--muted)", lineHeight: 1.5, textAlign: "center" },}
          , playerWon
            ? playerAvg > botAvg ? "You outscored the bot — well played! 🎯" : "You won on checkouts — great finishing!"
            : playerAvg > botAvg ? "You scored well but the bot closed out better. Work on your finishing!" : `The bot averaged ${botAvg} — try a lower difficulty level to build confidence.`
        )
      )

      /* AI Coaching */
      , React.createElement('div', { style: { background:"var(--surface)", border:"1px solid rgba(232,118,63,.2)", borderRadius:"var(--radius)", padding:16, marginBottom:14 },}
        , React.createElement('div', { style: { fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"rgba(232,118,63,.7)", marginBottom:8 },}, React.createElement(Ms, { icon: "psychology", size: 14, fill: true,} ), " Coach Insight"  )
        , coachLoading
          ? React.createElement('div', { style: { display:"flex", alignItems:"center", gap:10 },}
              , React.createElement('div', { style: { width:16, height:16, border:"2px solid rgba(232,118,63,.2)", borderTopColor:"var(--accent)", borderRadius:"50%", animation:"spin .9s linear infinite", flexShrink:0 },} )
              , React.createElement('div', { style: { fontSize:13, color:"var(--muted)" },}, "Analysing your match…"  )
            )
          : coachInsight
            ? React.createElement('div', { style: { fontSize:14, color:"var(--text2)", lineHeight:1.65 },}, coachInsight)
            : React.createElement('div', { style: { fontSize:13, color:"var(--muted)" },}, "Keep playing to unlock insights."    )
        
      )
      , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: onPlayAgain,}, "🎯 Play Again"  )
      , React.createElement('button', { className: "btn btn-secondary btn-full"  , style: { marginTop: 10 }, onClick: onExit,}, React.createElement(Ms, { icon: "arrow_back", size: 18,} ), " Back to Home"   )
    )
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────




// ─── PROFILE SYSTEM ───────────────────────────────────────────────────────────

var PROFILE_KEY = "dl-profile";
var CHECKOUT_SCORES_KEY = "dl-checkout-scores";
var DAILY_CHALLENGE_KEY = "dl-daily-challenge";
var CHALLENGE_STREAK_KEY = "dl-challenge-streak";

var loadProfile = () => storage.get(PROFILE_KEY, { name: "", avatar: "🎯", club: "", county: "", joinedDate: new Date().toISOString() });
var saveProfile = (p) => storage.set(PROFILE_KEY, p);
var loadCheckoutScores = () => storage.get(CHECKOUT_SCORES_KEY, []);
var saveCheckoutScores = (s) => storage.set(CHECKOUT_SCORES_KEY, s);
var loadDailyChallenge = () => storage.get(DAILY_CHALLENGE_KEY, { date: null, completed: false, challenge: null });
var saveDailyChallenge = (d) => storage.set(DAILY_CHALLENGE_KEY, d);
var loadChallengeStreak = () => storage.get(CHALLENGE_STREAK_KEY, { streak: 0, lastDate: null, best: 0 });
var saveChallengeStreak = (s) => storage.set(CHALLENGE_STREAK_KEY, s);

var AVATARS = ["🎯","🏆","🎪","⚡","🔥","💪","🎰","👑","🦅","🐉","🎸","🌟","💎","🦁","🎭","🏹"];

// ─── CHECKOUT TRAINER DATA ────────────────────────────────────────────────────

var CHECKOUT_ROUTES = {
  // 3-dart finishes — Red Dragon checkout table
  170:"T20 T20 Bull", 167:"T20 T19 Bull", 164:"T20 T18 Bull", 161:"T19 T18 Bull",
  160:"T20 T20 D20", 158:"T20 T20 D19", 157:"T19 T20 D20", 156:"T20 T20 D18",
  155:"T20 T19 D19", 154:"T19 T19 D20", 153:"T20 T19 D18", 152:"T20 T20 D16",
  151:"T20 T17 D20", 150:"T20 T20 D15", 149:"T20 T19 D16", 148:"T20 T20 D14",
  147:"T20 T17 D18", 146:"T20 T18 D16", 145:"T20 T15 D20", 144:"T20 T20 D12",
  143:"T20 T17 D16", 142:"T20 T14 D20", 141:"T20 T15 D18", 140:"T20 T20 D10",
  139:"T20 T13 D20", 138:"T20 T18 D12", 137:"T18 T17 D16", 136:"T20 T20 D8",
  135:"Bull T15 D20", 134:"T20 T14 D16", 133:"T20 T19 D8",  132:"T20 T16 D12",
  131:"T20 T13 D16", 130:"T20 T18 D8",  129:"T19 T16 D12", 128:"T18 T18 D10",
  127:"T20 T17 D8",  126:"T19 T19 D6",  125:"T20 T15 D10", 124:"T20 T16 D8",
  123:"T19 S16 Bull",122:"T18 T18 Bull", 121:"T20 T11 Bull",120:"T20 S20 D20",
  119:"T19 S12 Bull",118:"T20 S18 D20", 117:"T20 T17 D3",  116:"T19 S19 D20",
  115:"T20 S15 D20", 114:"T20 T14 D6",  113:"T20 T13 D7",  112:"T20 S20 D16",
  111:"T20 S19 D16", 110:"T20 S10 D20", 109:"T19 S12 D20", 108:"T19 S19 D16",
  107:"T19 S10 D20", 106:"T20 S10 D18", 105:"T20 S13 D16", 104:"T18 S18 D16",
  103:"T19 S10 D18", 102:"T20 S10 D16", 101:"T17 S10 D20", 100:"T20 D20",
  // 2-dart finishes
  99:"T19 S10 D16",  98:"T20 D19",      97:"T19 D20",      96:"T20 D18",
  95:"T19 D19",      94:"T18 D20",      93:"T19 D18",      92:"T20 D16",
  91:"T17 D20",      90:"T18 D18",      89:"T19 D16",      88:"T20 D14",
  87:"T17 D18",      86:"T18 D16",      85:"T15 D20",      84:"T20 D12",
  83:"T17 D16",      82:"Bull D16",     81:"T15 D18",      80:"T20 D10",
  79:"T19 D11",      78:"T18 D12",      77:"T19 D10",      76:"T20 D8",
  75:"T17 D12",      74:"T14 D16",      73:"T19 D8",       72:"T16 D12",
  71:"T13 D16",      70:"T18 D8",       69:"T19 D6",       68:"T20 D4",
  67:"T17 D8",       66:"T10 D18",      65:"S25 D20",      64:"T16 D8",
  63:"T17 D6",       62:"T10 D16",      61:"T15 D8",       60:"S20 D20",
  59:"S19 D20",      58:"S18 D20",      57:"S17 D20",      56:"S16 D20",
  55:"S15 D20",      54:"S14 D20",      53:"S13 D20",      52:"S12 D20",
  51:"S11 D20",      50:"S10 D20",      49:"S9 D20",       48:"S16 D16",
  47:"S15 D16",      46:"S6 D20",       45:"S13 D16",      44:"S12 D16",
  43:"S3 D20",       42:"S10 D16",      41:"S9 D16",       40:"D20",
  38:"D19",          36:"D18",          34:"D17",          32:"D16",
  30:"D15",          28:"D14",          26:"D13",          24:"D12",
  22:"D11",          20:"D10",          18:"D9",           16:"D8",
  14:"D7",           12:"D6",           10:"D5",           8:"D4",
  6:"D3",            4:"D2",            2:"D1",
};

// Scores that have checkout routes
var CHECKOUT_SCORES = Object.keys(CHECKOUT_ROUTES).map(Number).filter(n => n >= 2 && n <= 170);

function getWrongAnswers(correct, score) {
  var all = Object.values(CHECKOUT_ROUTES).filter(r => r !== correct);
  var shuffled = all.sort(() => Math.random() - 0.5).slice(0, 3);
  return shuffled;
}

function generateQuestion() {
  var score = CHECKOUT_SCORES[Math.floor(Math.random() * CHECKOUT_SCORES.length)];
  var correct = CHECKOUT_ROUTES[score];
  var wrong = getWrongAnswers(correct, score);
  var options = [...wrong, correct].sort(() => Math.random() - 0.5);
  return { score, correct, options };
}

// ─── DAILY CHALLENGE ENGINE ───────────────────────────────────────────────────

// difficulty: "normal" | "hard" | "legendary"
// type: "session" | "checkout" | "checkout_timed" | "game_score" | "game_complete"
var DAILY_CHALLENGES = [
  // NORMAL — session & checkout
  { id:"session_1",      title:"Get on the Oche",      desc:"Complete any training session today",                         target:1,   type:"session",          difficulty:"normal",    icon:"🎯" },
  { id:"checkout_5",     title:"Checkout Master",       desc:"Get 5 correct answers in the Checkout Trainer",              target:5,   type:"checkout",         difficulty:"normal",    icon:"✅" },
  { id:"session_2games", title:"Double Up",             desc:"Complete a session with at least 2 games",                   target:2,   type:"session_games",    difficulty:"normal",    icon:"🎪" },
  { id:"checkout_6",     title:"Finishing School",      desc:"Get 6 correct checkouts in the Checkout Trainer",            target:6,   type:"checkout",         difficulty:"normal",    icon:"🏫" },
  { id:"bobs_positive",  title:"Stay in the Black",     desc:"Score a positive total on Bob's 27",                         target:28,  type:"game_score",       difficulty:"normal",    icon:"🎲", gameId:"bobs-27" },
  { id:"highscore_80",   title:"Score 80+",             desc:"Score 80 or more in the High Score game",                    target:80,  type:"game_score",       difficulty:"normal",    icon:"💥", gameId:"high-score" },
  { id:"doubles_hit5",   title:"Five Doubles",          desc:"Hit at least 5 doubles in a Doubles Practice session",       target:5,   type:"game_score",       difficulty:"normal",    icon:"🎯", gameId:"doubles" },
  { id:"session_full",   title:"Full Session",          desc:"Complete a programme with 3 or more games",                  target:3,   type:"session_games",    difficulty:"normal",    icon:"📋" },
  { id:"checkout_7",     title:"Lucky Seven",           desc:"Get 7 correct answers in the Checkout Trainer",              target:7,   type:"checkout",         difficulty:"normal",    icon:"7️⃣" },
  { id:"atc_complete",   title:"Round the Clock",       desc:"Complete Around the Clock Level 1",                          target:1,   type:"game_complete",    difficulty:"normal",    icon:"🕐", gameId:"atc-l1" },
  // HARD
  { id:"checkout_8",     title:"Sharp Finisher",        desc:"Get 8 correct answers in the Checkout Trainer",              target:8,   type:"checkout",         difficulty:"hard",      icon:"🔪" },
  { id:"bobs_50",        title:"Bob's Fifty",           desc:"Score 50+ on Bob's 27",                                      target:50,  type:"game_score",       difficulty:"hard",      icon:"🦊", gameId:"bobs-27" },
  { id:"highscore_120",  title:"Century+",              desc:"Score 120+ in the High Score game",                          target:120, type:"game_score",       difficulty:"hard",      icon:"💯", gameId:"high-score" },
  { id:"doubles_10",     title:"Double Digits",         desc:"Hit 10+ doubles in a Doubles Practice session",              target:10,  type:"game_score",       difficulty:"hard",      icon:"💪", gameId:"doubles" },
  { id:"checkout_timed", title:"Speed Demon",           desc:"Get 5 correct checkouts in under 60 seconds",                target:5,   type:"checkout_timed",   difficulty:"hard",      icon:"⚡" },
  { id:"session_3games", title:"Hat-Trick",             desc:"Complete a session with at least 3 different game types",    target:3,   type:"session_games",    difficulty:"hard",      icon:"🎩" },
  { id:"bobs_75",        title:"Bob's Seventy-Five",    desc:"Score 75+ on Bob's 27",                                      target:75,  type:"game_score",       difficulty:"hard",      icon:"🦁", gameId:"bobs-27" },
  { id:"atc_l2",         title:"Doubles Clock",         desc:"Complete Around the Clock Level 2 (doubles only)",           target:1,   type:"game_complete",    difficulty:"hard",      icon:"🕑", gameId:"atc-l2" },
  { id:"checkout_9",     title:"Nearly Perfect",        desc:"Get 9 correct answers in the Checkout Trainer",              target:9,   type:"checkout",         difficulty:"hard",      icon:"🎯" },
  { id:"trebles_10",     title:"Treble Threat",         desc:"Hit 10+ trebles in a Trebles Practice session",              target:10,  type:"game_score",       difficulty:"hard",      icon:"🔱", gameId:"trebles" },
  // LEGENDARY
  { id:"checkout_10",    title:"Perfect Round",         desc:"Score 10/10 in the Checkout Trainer",                        target:10,  type:"checkout",         difficulty:"legendary", icon:"👑" },
  { id:"bobs_100",       title:"Bob's Century",         desc:"Score 100+ on Bob's 27",                                     target:100, type:"game_score",       difficulty:"legendary", icon:"🏆", gameId:"bobs-27" },
  { id:"highscore_150",  title:"Big Score",             desc:"Score 150+ in the High Score game",                          target:150, type:"game_score",       difficulty:"legendary", icon:"🚀", gameId:"high-score" },
  { id:"doubles_20",     title:"Double Champion",       desc:"Hit 20+ doubles in a Doubles Practice session",              target:20,  type:"game_score",       difficulty:"legendary", icon:"💎", gameId:"doubles" },
  { id:"session_allcat", title:"All Rounder",           desc:"Complete a session covering all 4 game categories",          target:5,   type:"session_cats",     difficulty:"legendary", icon:"🌀" },
  { id:"bobs_bust_free", title:"Consistency King",      desc:"Complete Bob's 27 without going bust",                       target:1,   type:"game_complete",    difficulty:"legendary", icon:"🛡️", gameId:"bobs-27" },
  { id:"checkout_12",    title:"Checkout Genius",       desc:"Get 12+ correct in the Checkout Trainer (extended mode)",    target:12,  type:"checkout",         difficulty:"legendary", icon:"🧠" },
  { id:"atc_l3",         title:"Treble Clock",          desc:"Complete Around the Clock Level 3 (trebles only)",           target:1,   type:"game_complete",    difficulty:"legendary", icon:"🕒", gameId:"atc-l3" },
];

var DIFFICULTY_CONFIG = {
  normal:    { label:"Normal",    color:"#5cb85c", bg:"rgba(92,184,92,0.08)",   border:"rgba(92,184,92,0.25)"   },
  hard:      { label:"Hard",      color:"#f0ad4e", bg:"rgba(240,173,78,0.08)",  border:"rgba(240,173,78,0.25)"  },
  legendary: { label:"Legendary", color:"#e8763f", bg:"rgba(232,118,63,0.08)",  border:"rgba(232,118,63,0.25)"  },
};

var WEEKLY_MISSIONS_KEY = "dl-weekly-missions";
var loadWeeklyMissions  = () => storage.get(WEEKLY_MISSIONS_KEY, { weekKey: null, missions: [], completed: [] });
var saveWeeklyMissions  = (m) => storage.set(WEEKLY_MISSIONS_KEY, m);

// Returns ISO week string e.g. "2025-W14" for stable weekly keys
function getWeekKey() {
  var d = new Date();
  var jan1 = new Date(d.getFullYear(), 0, 1);
  var week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

// 3 missions per week, seeded by week so they're consistent for everyone
var MISSION_POOL = [
  { id:"m-sessions-4",    title:"Four Sessions",          desc:"Complete 4 training sessions this week",          target:4,  type:"sessions",       icon:"📅", points:50 },
  { id:"m-bobs-twice",    title:"Bob's Double",           desc:"Play Bob's 27 twice and score 50+ both times",    target:2,  type:"game_threshold", icon:"🎲", points:60,  gameId:"bobs-27",    threshold:50 },
  { id:"m-bot-win",       title:"Beat the Bot",           desc:"Beat the bot on Level 3 or higher",               target:1,  type:"bot_level",      icon:"🤖", points:55,  minLevel:3 },
  { id:"m-checkout-20",   title:"Checkout Pro",           desc:"Get 20 correct answers in the Checkout Trainer",  target:20, type:"checkout_total", icon:"✅", points:45 },
  { id:"m-doubles-sess",  title:"Doubles Week",           desc:"Complete Doubles Practice 3 times this week",     target:3,  type:"game_plays",     icon:"🎯", points:50,  gameId:"doubles" },
  { id:"m-all-cats",      title:"Full Programme",         desc:"Play a game from every category this week",       target:5,  type:"categories",     icon:"🌀", points:70 },
  { id:"m-highscore-100", title:"Scoring Power",          desc:"Score 100+ in High Score twice this week",        target:2,  type:"game_threshold", icon:"💥", points:55,  gameId:"high-score", threshold:100 },
  { id:"m-sessions-3",    title:"Three Training Days",    desc:"Train on 3 different days this week",             target:3,  type:"training_days",  icon:"📆", points:40 },
  { id:"m-trebles-sess",  title:"Treble Week",            desc:"Complete Trebles Practice 3 times this week",     target:3,  type:"game_plays",     icon:"🔱", points:50,  gameId:"trebles" },
  { id:"m-bot-3wins",     title:"Bot Domination",         desc:"Beat the bot 3 times this week",                  target:3,  type:"bot_wins",       icon:"🏆", points:75 },
  { id:"m-daily-5",       title:"Daily Habit",            desc:"Complete the Daily Challenge 5 days this week",   target:5,  type:"daily_streak",   icon:"🔥", points:65 },
  { id:"m-games-10",      title:"Ten Games",              desc:"Play 10 total games across any sessions",         target:10, type:"total_games",    icon:"💪", points:45 },
];

function getWeeklyMissions() {
  var weekKey = getWeekKey();
  var saved = loadWeeklyMissions();
  if (saved.weekKey === weekKey) return saved;
  // Seed 3 missions from pool based on week number
  var seed = parseInt(weekKey.split("W")[1]) || 1;
  var picks = [];
  var indices = new Set();
  var i = 0;
  while (picks.length < 3 && i < 50) {
    var idx = (seed * 7 + i * 13) % MISSION_POOL.length;
    if (!indices.has(idx)) { indices.add(idx); picks.push({ ...MISSION_POOL[idx], progress: 0, done: false }); }
    i++;
  }
  var fresh = { weekKey, missions: picks, completed: [] };
  saveWeeklyMissions(fresh);
  return fresh;
}

function updateMissionProgress(history, botGames, dailyCompletionsThisWeek = 0) {
  var wm = getWeeklyMissions();
  var weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0,0,0,0);

  var thisWeekSessions = history.filter(s => new Date(s.date) >= weekStart);
  var thisWeekBotGames = botGames.filter(g => new Date(g.date) >= weekStart);
  var thisWeekGames = thisWeekSessions.flatMap(s => s.games || []);
  var trainingDays = new Set(thisWeekSessions.map(s => new Date(s.date).toDateString())).size;
  var totalGames = thisWeekGames.length;
  var categories = new Set(thisWeekGames.map(g => _optionalChain([GAMES, 'access', _60 => _60.find, 'call', _61 => _61(x => x.id === g.id), 'optionalAccess', _62 => _62.category])).filter(Boolean));

  var updated = wm.missions.map(m => {
    var progress = 0;
    switch(m.type) {
      case "sessions":       progress = thisWeekSessions.length; break;
      case "training_days":  progress = trainingDays; break;
      case "total_games":    progress = totalGames; break;
      case "categories":     progress = categories.size; break;
      case "bot_wins":       progress = thisWeekBotGames.filter(g => g.winner === "player").length; break;
      case "bot_level":      progress = thisWeekBotGames.some(g => g.winner === "player" && (g.botLevel||0) >= (m.minLevel||1)) ? 1 : 0; break;
      case "daily_streak":   progress = dailyCompletionsThisWeek; break;
      case "checkout_total": progress = 0; break; // tracked separately
      case "game_plays":     progress = thisWeekGames.filter(g => g.id === m.gameId).length; break;
      case "game_threshold":
        progress = thisWeekGames.filter(g => g.id === m.gameId && g.score >= (m.threshold || 0)).length;
        break;
    }
    var done = progress >= m.target;
    return { ...m, progress: Math.min(progress, m.target), done };
  });

  var newWm = { ...wm, missions: updated };
  saveWeeklyMissions(newWm);
  return newWm;
}

function getTodayChallenge() {
  var today = new Date().toDateString();
  var saved = loadDailyChallenge();
  if (saved.date === today) return saved;
  var dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  var challenge = DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];
  var fresh = { date: today, completed: false, challenge, progress: 0 };
  saveDailyChallenge(fresh);
  return fresh;
}

function updateChallengeStreak(completed) {
  if (!completed) return;
  var today = new Date().toDateString();
  var yesterday = new Date(Date.now() - 86400000).toDateString();
  var s = loadChallengeStreak();
  var newStreak = 1;
  if (s.lastDate === yesterday) newStreak = s.streak + 1;
  else if (s.lastDate === today) return;
  var updated = { streak: newStreak, lastDate: today, best: Math.max(s.best, newStreak) };
  saveChallengeStreak(updated);
  return updated;
}

// Seconds until midnight
function secondsUntilMidnight() {
  var now = new Date();
  var midnight = new Date(now); midnight.setHours(24,0,0,0);
  return Math.floor((midnight - now) / 1000);
}

// ─── PROFILE SCREEN ───────────────────────────────────────────────────────────

function ProfileScreen({ history, botGames, onClose, onProfileSaved, onResetProgress }) {
  var [profile, setProfile] = useState(loadProfile);
  // Only force edit mode if profile has never been set up at all
  var [editing, setEditing]     = useState(!profile.name && !profile.joinedDate);
  var [name, setName]           = useState(profile.name || "");
  var [avatar, setAvatar]       = useState(profile.avatar || "🎯");
  var [club, setClub]           = useState(profile.club || "");
  var [county, setCounty]       = useState(profile.county || "");
  var [showAvatarPicker, setShowAvatarPicker] = useState(false);

  var stats          = deriveStats(history, botGames);
  var tierInfo       = getPlayerTier(history);
  var streak         = calcStreak(history);
  var totalGames     = history.reduce((a,s) => a+(_optionalChain([s, 'access', _63 => _63.games, 'optionalAccess', _64 => _64.length])||0),0);
  var botWins        = botGames.filter(g => g.winner==="player").length;
  var checkoutScores = loadCheckoutScores();
  var bestCheckout   = checkoutScores.length > 0 ? Math.max(...checkoutScores.map(s=>s.score)) : null;
  var challengeStreak = loadChallengeStreak();
  var joinDate       = profile.joinedDate ? new Date(profile.joinedDate).toLocaleDateString("en-GB", { month:"long", year:"numeric" }) : "Recently";

  var gamePBs = Object.entries(stats.gameStats)
    .filter(([,g]) => g.bestScore !== null)
    .sort((a,b) => b[1].totalPlays - a[1].totalPlays)
    .slice(0, 3);

  var handleSave = () => {
    if (!name.trim()) return;
    var updated = { ...profile, name: name.trim(), avatar, club: club.trim(), county: county.trim() };
    saveProfile(updated);
    setProfile(updated);
    setEditing(false);
    if (onProfileSaved) onProfileSaved(updated);
  };

  var inputStyle = {
    width:"100%", background:"var(--glass-bg)", border:"1px solid var(--glass-border)",
    borderRadius:"var(--radius-sm)", padding:"13px 16px", color:"var(--text)",
    fontSize:15, fontFamily:"'Hanken Grotesk',sans-serif", outline:"none",
    marginBottom:12, backdropFilter:"blur(12px)", transition:"border-color .2s",
  };

  // ── Edit screen ──────────────────────────────────────────────────────────────
  if (editing) return (
    React.createElement('div', { style: { position:"fixed", inset:0, background:"var(--bg)", zIndex:400, overflow:"auto" },}
      , React.createElement('div', { style: { maxWidth:430, margin:"0 auto", padding:"0 16px 80px" },}

        /* Top bar */
        , React.createElement('div', { style: { position:"sticky", top:0, zIndex:10, background:"rgba(27,24,21,.95)", backdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", margin:"0 -16px", padding:"0 16px" },}
          , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:18, fontWeight:800, letterSpacing:"-0.02em", color:"var(--text)" },}, "Edit Profile" )
          , profile.name && (
            React.createElement('button', { onClick: () => setEditing(false), style: { background:"none", border:"none", fontFamily:"'Hanken Grotesk',sans-serif", fontSize:14, fontWeight:600, color:"var(--muted)", cursor:"pointer", WebkitTapHighlightColor:"transparent" },}, "Cancel")
          )
        )

        /* Avatar */
        , React.createElement('div', { style: { textAlign:"center", padding:"28px 0 20px" },}
          , React.createElement('div', { onClick: () => setShowAvatarPicker(true),
            style: { fontSize:72, cursor:"pointer", display:"inline-block", marginBottom:8, filter:"drop-shadow(0 0 20px rgba(232,118,63,.3))", lineHeight:1 },}, avatar)
          , React.createElement('div', null
            , React.createElement('button', { onClick: () => setShowAvatarPicker(!showAvatarPicker),
              style: { fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", color:"var(--accent)", background:"none", border:"1px solid rgba(232,118,63,.25)", borderRadius:100, padding:"4px 14px", cursor:"pointer", WebkitTapHighlightColor:"transparent" },}
              , showAvatarPicker ? "Close" : "Change Avatar"
            )
          )
          , showAvatarPicker && (
            React.createElement('div', { style: { display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginTop:14, padding:14, background:"var(--glass-bg)", borderRadius:"var(--radius)", border:"1px solid var(--glass-border)", backdropFilter:"blur(12px)" },}
              , AVATARS.map(a => (
                React.createElement('div', { key: a, onClick: () => { setAvatar(a); setShowAvatarPicker(false); },
                  style: { fontSize:32, cursor:"pointer", padding:8, borderRadius:12, background:a===avatar?"rgba(232,118,63,.15)":"transparent", border:`1px solid ${a===avatar?"var(--accent)":"transparent"}`, transition:"all .15s" },}
                  , a
                )
              ))
            )
          )
        )

        /* Fields */
        , [
          { label:"Your Name", placeholder:"e.g. Phil Taylor", val:name, set:setName, max:20, required:true },
          { label:"Home Club", placeholder:"e.g. The Red Lion", val:club, set:setClub, max:30 },
          { label:"County", placeholder:"e.g. Essex", val:county, set:setCounty, max:20 },
        ].map(f => (
          React.createElement('div', { key: f.label, style: { marginBottom:4 },}
            , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", color:"var(--muted)", marginBottom:6 },}
              , f.label, f.required && React.createElement('span', { style: { color:"var(--accent)", marginLeft:3 },}, "*")
            )
            , React.createElement('input', { style: inputStyle, placeholder: f.placeholder, value: f.val,
              onChange: e => f.set(e.target.value), maxLength: f.max,} )
          )
        ))

        , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: handleSave, disabled: !name.trim(),
          style: { marginTop:8, opacity:name.trim()?1:0.4 },}
          , React.createElement(Ms, { icon: "check", size: 18,} ), " Save Profile"
        )
      )
    )
  );

  // ── View screen ──────────────────────────────────────────────────────────────
  return (
    React.createElement('div', { style: { position:"fixed", inset:0, background:"var(--bg)", zIndex:400, overflow:"auto" },}
      , React.createElement('div', { style: { maxWidth:430, margin:"0 auto", padding:"0 16px 80px" },}

        /* Top bar */
        , React.createElement('div', { style: { position:"sticky", top:0, zIndex:10, background:"rgba(27,24,21,.95)", backdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", margin:"0 -16px", padding:"0 16px" },}
          , React.createElement('button', { onClick: onClose, style: { background:"none", border:"none", display:"flex", alignItems:"center", gap:6, fontFamily:"'Hanken Grotesk',sans-serif", fontSize:14, fontWeight:600, color:"var(--muted)", cursor:"pointer", WebkitTapHighlightColor:"transparent" },}
            , React.createElement(Ms, { icon: "arrow_back", size: 18,} ), " Back"
          )
          , React.createElement('button', { onClick: () => setEditing(true), style: { background:"var(--glass-bg)", border:"1px solid var(--glass-border)", borderRadius:"var(--radius-sm)", padding:"7px 14px", fontFamily:"'Hanken Grotesk',sans-serif", fontSize:13, fontWeight:600, color:"var(--text2)", cursor:"pointer", WebkitTapHighlightColor:"transparent", backdropFilter:"blur(12px)" },}
            , React.createElement(Ms, { icon: "edit", size: 16,} ), " Edit"
          )
        )

        /* Darts photo strip */
        , React.createElement('div', { style: { height:200, borderRadius:"var(--radius)", overflow:"hidden", margin:"12px 0 12px", position:"relative", background:"#0d1018" },}
          , React.createElement('img', { src: IMG_DARTS_STRIP, alt: "Darts", style: { width:"100%", height:"100%", objectFit:"contain", objectPosition:"center center" },} )
          , React.createElement('div', { style: { position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(13,16,24,.4) 0%,transparent 15%,transparent 85%,rgba(13,16,24,.5) 100%)" },} )
        )
        /* Hero card */
        , React.createElement('div', { style: { background:"linear-gradient(135deg,rgba(232,118,63,.08),rgba(168,255,120,.04))", border:"1px solid rgba(232,118,63,.2)", borderTop:"2px solid rgba(232,118,63,.4)", borderRadius:"var(--radius)", padding:"24px 20px 20px", margin:"0 0 14px", textAlign:"center", backdropFilter:"blur(12px)" },}
          , React.createElement('div', { style: { fontSize:72, marginBottom:10, filter:"drop-shadow(0 0 16px rgba(232,118,63,.35))", lineHeight:1 },}, profile.avatar)
          , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:26, fontWeight:800, letterSpacing:"-0.02em", color:"var(--text)", lineHeight:1, marginBottom:4 },}, profile.name || "Anonymous")
          , (profile.club || profile.county) && (
            React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:500, letterSpacing:".04em", color:"var(--muted)", marginTop:4 },}
              , [profile.club, profile.county].filter(Boolean).join(" · ")
            )
          )
          , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"var(--muted)", marginTop:4, letterSpacing:".04em" },}, "Training since "  , joinDate)

          /* Tier badge */
          , React.createElement('div', { style: { display:"inline-flex", alignItems:"center", gap:6, marginTop:14, padding:"6px 16px", borderRadius:100, background:`${tierInfo.tier.color}18`, border:`1px solid ${tierInfo.tier.color}40` },}
            , React.createElement('span', { style: { fontSize:16 },}, tierInfo.tier.emoji)
            , React.createElement('span', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:14, fontWeight:700, color:tierInfo.tier.color },}, tierInfo.tier.name)
          )
        )

        /* Career stats */
        , React.createElement('div', { className: "section-label",}, "Career Stats" )
        , React.createElement('div', { className: "stat-row",}
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, history.length), React.createElement('div', { className: "stat-lbl",}, "Sessions"))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, totalGames), React.createElement('div', { className: "stat-lbl",}, "Games"))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, streak > 0 ? streak : "—"), React.createElement('div', { className: "stat-lbl",}, streak > 0 ? "🔥 Streak" : "Streak"))
        )
        , React.createElement('div', { className: "stat-row",}
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, botWins), React.createElement('div', { className: "stat-lbl",}, "Bot Wins" ))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, challengeStreak.best || "—"), React.createElement('div', { className: "stat-lbl",}, "Best Streak" ))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, bestCheckout !== null ? `${bestCheckout}/10` : "—"), React.createElement('div', { className: "stat-lbl",}, "Best CTO" ))
        )

        /* Personal bests */
        , gamePBs.length > 0 && (
          React.createElement(React.Fragment, null
            , React.createElement('div', { className: "section-label",}, "Personal Bests" )
            , gamePBs.map(([id, g]) => (
              React.createElement('div', { key: id, style: { background:"var(--glass-bg)", border:"1px solid var(--glass-border)", borderRadius:"var(--radius)", padding:"14px 16px", marginBottom:8, backdropFilter:"blur(12px)" },}
                , React.createElement('div', { style: { display:"flex", alignItems:"center", gap:12 },}
                  , React.createElement('div', { style: { width:40, height:40, borderRadius:10, background:"rgba(232,118,63,.08)", border:"1px solid rgba(232,118,63,.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 },}, g.icon)
                  , React.createElement('div', { style: { flex:1 },}
                    , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:14, fontWeight:700, color:"var(--text)", letterSpacing:"-0.01em" },}, g.name)
                    , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:500, letterSpacing:".04em", color:"var(--muted)", marginTop:2 },}, g.totalPlays, " plays" )
                  )
                  , React.createElement('div', { style: { textAlign:"right" },}
                    , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:26, fontWeight:800, letterSpacing:"-0.04em", color:"var(--accent)", lineHeight:1 },}, g.bestScore)
                    , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:500, letterSpacing:".05em", color:"var(--muted)", marginTop:2 },}, "PB")
                  )
                )
              )
            ))
          )
        )

        /* Checkout leaderboard */
        , checkoutScores.length > 0 && (
          React.createElement(React.Fragment, null
            , React.createElement('div', { className: "section-label",}, "Checkout Trainer — Best Runs"    )
            , checkoutScores.slice(0,5).sort((a,b) => b.score - a.score).map((s,i) => (
              React.createElement('div', { key: i, style: { background:"var(--glass-bg)", border:"1px solid var(--glass-border)", borderRadius:"var(--radius)", padding:"12px 16px", marginBottom:8, backdropFilter:"blur(12px)", display:"flex", alignItems:"center", gap:12 },}
                , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:20, fontWeight:800, letterSpacing:"-0.04em", color:i===0?"var(--accent)":"var(--muted)", width:32, flexShrink:0 },}, "#", i+1)
                , React.createElement('div', { style: { flex:1 },}
                  , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:14, fontWeight:700, color:"var(--text)" },}, s.score, "/10 correct" )
                  , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:500, letterSpacing:".04em", color:"var(--muted)", marginTop:2 },}, new Date(s.date).toLocaleDateString("en-GB", { day:"numeric", month:"short" }), " · "  , s.time, "s avg" )
                )
                , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:22, fontWeight:800, letterSpacing:"-0.04em", color:"var(--accent)" },}, Math.round((s.score/10)*100), "%")
              )
            ))
          )
        )

        /* Danger Zone */
        , React.createElement('div', { style: { marginTop:24 },}
          , React.createElement('div', { className: "section-label", style: { color:"var(--accent2)" },}, "Danger Zone" )
          , React.createElement('div', { style: { background:"rgba(194,72,63,.05)", border:"1px solid rgba(194,72,63,.2)", borderRadius:"var(--radius)", padding:16, backdropFilter:"blur(12px)" },}
            , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:15, fontWeight:700, color:"var(--text)", marginBottom:4 },}, "Reset All Progress"  )
            , React.createElement('div', { style: { fontSize:13, color:"var(--muted)", marginBottom:14, lineHeight:1.6 },}, "Clears your session history, bot games, achievements, programmes and Darts IQ score. Cannot be undone."

            )
            , React.createElement('button', { className: "btn btn-danger btn-full"  , onClick: onResetProgress,}
              , React.createElement(Ms, { icon: "delete_forever", size: 18,} ), " Reset All Progress"
            )
          )
        )
      )
    )
  );
}

// ─── CHECKOUT TRAINER ─────────────────────────────────────────────────────────

function CheckoutTrainer({ onClose, onChallengeProgress }) {
  var [phase, setPhase] = useState("menu"); // menu | playing | result
  var [confirmExit, setConfirmExit] = useState(false);
  var [questions, setQuestions] = useState([]);
  var [qIdx, setQIdx] = useState(0);
  var [score, setScore] = useState(0);
  var [selected, setSelected] = useState(null);
  var [timeLeft, setTimeLeft] = useState(15);
  var [totalTime, setTotalTime] = useState(0);
  var [history, setHistory] = useState([]);
  var [leaderboard, setLeaderboard] = useState(loadCheckoutScores);
  var [showAnswer, setShowAnswer] = useState(false);
  var timerRef = useRef(null);

  var startGame = () => {
    var qs = Array.from({length:10}, () => generateQuestion());
    setQuestions(qs);
    setQIdx(0); setScore(0); setSelected(null);
    setTimeLeft(15); setTotalTime(0); setHistory([]);
    setShowAnswer(false);
    setPhase("playing");
  };

  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleAnswer(null, true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, qIdx]);

  var handleAnswer = (option, timedOut = false) => {
    clearInterval(timerRef.current);
    if (selected !== null) return;
    var q = questions[qIdx];
    var correct = !timedOut && option === q.correct;
    var timeTaken = 15 - timeLeft + (timedOut ? 15 : 0);
    setSelected(option || "timeout");
    setShowAnswer(true);
    setTotalTime(t => t + timeTaken);
    if (correct) setScore(s => s + 1);
    setHistory(h => [...h, { score: q.score, correct: q.correct, chosen: option, wasCorrect: correct, timedOut }]);

    setTimeout(() => {
      if (qIdx >= 9) {
        // Game over
        var finalScore = correct ? score + 1 : score;
        var avgTime = Math.round((totalTime + timeTaken) / 10);
        var entry = { score: finalScore, date: new Date().toISOString(), time: avgTime };
        var updated = [...loadCheckoutScores(), entry].sort((a,b) => b.score - a.score).slice(0, 20);
        saveCheckoutScores(updated);
        setLeaderboard(updated);
        if (onChallengeProgress) onChallengeProgress(finalScore);
        setPhase("result");
      } else {
        setQIdx(i => i + 1);
        setSelected(null);
        setShowAnswer(false);
        setTimeLeft(15);
      }
    }, 1200);
  };

  if (phase === "menu") {
    var best = leaderboard.length > 0 ? Math.max(...leaderboard.map(s=>s.score)) : null;
    return (
      React.createElement('div', { style: { position:"fixed", inset:0, background:"var(--bg)", zIndex:400, overflow:"auto" },}
        , React.createElement('div', { style: { maxWidth:430, margin:"0 auto", padding:"52px 16px 80px" },}
          , React.createElement('div', { style: { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 },}
            , React.createElement('button', { className: "back-btn", onClick: onClose,}, React.createElement(Ms, { icon: "arrow_back", size: 18,} ), " Back" )
          )
          , React.createElement('div', { style: { textAlign:"center", marginBottom:28 },}
            , React.createElement('div', { style: { fontSize:64, marginBottom:12 },}, "🎯")
            , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:36, letterSpacing:3, color:"var(--text)", marginBottom:6 },}, "CHECKOUT TRAINER" )
            , React.createElement('div', { style: { fontSize:13, color:"var(--muted)", lineHeight:1.6, maxWidth:280, margin:"0 auto" },}, "10 checkouts. 15 seconds each. Pick the correct route. Score as high as you can."

            )
          )

          , best !== null && (
            React.createElement('div', { style: { background:"linear-gradient(135deg,rgba(232,118,63,.1),rgba(168,255,120,.05))", border:"1px solid rgba(232,118,63,.3)", borderRadius:"var(--radius)", padding:16, marginBottom:16, textAlign:"center" },}
              , React.createElement('div', { style: { fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"var(--accent)", marginBottom:4 },}, "Your Best" )
              , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:48, color:"var(--accent)", letterSpacing:3 },}, best, "/10")
            )
          )

          , React.createElement('div', { className: "info-block", style: { marginBottom:16 },}
            , React.createElement('div', { className: "info-title",}, "How It Works"  )
            , React.createElement('ul', { className: "rules-list",}
              , React.createElement('li', null, "A checkout score is shown — you pick the correct route from 4 options"             )
              , React.createElement('li', null, "You have 15 seconds per question — don't overthink it"         )
              , React.createElement('li', null, "10 questions per round — score as many as possible"         )
              , React.createElement('li', null, "Your best scores are saved to your profile leaderboard"        )
            )
          )

          , leaderboard.length > 0 && (
            React.createElement(React.Fragment, null
              , React.createElement('div', { className: "section-label",}, "Your Best Runs"  )
              , leaderboard.slice(0,5).map((s,i) => (
                React.createElement('div', { key: i, className: "history-row", style: { marginBottom:6 },}
                  , React.createElement('span', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:18, color:i===0?"var(--accent)":"var(--muted)", width:28 },}, "#", i+1)
                  , React.createElement('span', { className: "history-name",}, s.score, "/10 — "  , Math.round((s.score/10)*100), "%")
                  , React.createElement('span', { className: "history-score",}, new Date(s.date).toLocaleDateString("en-GB",{day:"numeric",month:"short"}))
                )
              ))
            )
          )

          , React.createElement('button', { className: "btn btn-primary btn-full"  , style: { marginTop:20 }, onClick: startGame,}, "🎯 Start Round"

          )
        )
      )
    );
  }

  if (phase === "playing" && questions[qIdx]) {
    var q = questions[qIdx];
    var timerPct = (timeLeft / 15) * 100;
    var timerColor = timeLeft <= 5 ? "var(--accent2)" : timeLeft <= 10 ? "#f0ad4e" : "var(--accent)";

    return (
      React.createElement('div', { style: { position:"fixed", inset:0, background:"var(--bg)", zIndex:400, overflow:"auto" },}
        , confirmExit && (
          React.createElement(ExitConfirmModal, {
            onConfirm: onClose,
            onCancel: () => setConfirmExit(false),
            message: "Are you sure you want to quit? Your checkout trainer progress will be lost."             ,}
          )
        )
        , React.createElement('div', { style: { maxWidth:430, margin:"0 auto", padding:"52px 16px 80px" },}
          /* Progress + timer */
          , React.createElement('div', { style: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 },}
            , React.createElement('button', { className: "back-btn", style: { fontSize:11 }, onClick: () => setConfirmExit(true),}, "✕ Quit" )
            , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color:timerColor, letterSpacing:2 },}, timeLeft, "s")
          )
          , React.createElement('div', { style: { height:8, background:"var(--surface2)", borderRadius:100, overflow:"hidden", marginBottom:24 },}
            , React.createElement('div', { style: { width:`${timerPct}%`, height:"100%", background:timerColor, borderRadius:100, transition:"width .9s linear" },})
          )

          /* Question */
          , React.createElement('div', { style: { textAlign:"center", marginBottom:28 },}
            , React.createElement('div', { style: { fontSize:13, fontWeight:600, letterSpacing:2, textTransform:"uppercase", color:"var(--muted)", marginBottom:10 },}, "What's the checkout for..."   )
            , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:96, color:"var(--accent)", letterSpacing:4, lineHeight:1, filter:"drop-shadow(0 0 20px rgba(232,118,63,.3))" },}, q.score)
          )

          /* Options */
          , React.createElement('div', { style: { display:"flex", flexDirection:"column", gap:10 },}
            , q.options.map((opt, i) => {
              var isCorrect = opt === q.correct;
              var isSelected = selected === opt;
              var isTimeout = selected === "timeout";
              var bg = "var(--surface)";
              var border = "1px solid var(--border)";
              var color = "var(--text)";
              if (showAnswer) {
                if (isCorrect) { bg = "rgba(232,118,63,.15)"; border = "1px solid rgba(232,118,63,.5)"; color = "var(--accent)"; }
                else if (isSelected && !isCorrect) { bg = "rgba(194,72,63,.15)"; border = "1px solid rgba(194,72,63,.4)"; color = "var(--accent2)"; }
                else { bg = "var(--surface)"; color = "var(--muted)"; }
              }
              return (
                React.createElement('button', { key: i, onClick: () => !showAnswer && handleAnswer(opt),
                  style: { background:bg, border, borderRadius:14, padding:"16px 18px", textAlign:"left", fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:600, color, cursor:showAnswer?"default":"pointer", transition:"all .15s", WebkitTapHighlightColor:"transparent", display:"flex", alignItems:"center", justifyContent:"space-between" },}
                  , React.createElement('span', null, opt)
                  , showAnswer && isCorrect && React.createElement('span', { style: { fontSize:18 },}, "✓")
                  , showAnswer && isSelected && !isCorrect && React.createElement('span', { style: { fontSize:18 },}, "✗")
                )
              );
            })
          )

          /* Score tracker */
          , React.createElement('div', { style: { display:"flex", gap:6, justifyContent:"center", marginTop:20 },}
            , Array.from({length:10},(_,i) => {
              var h = history[i];
              return React.createElement('div', { key: i, style: { width:26, height:26, borderRadius:7, background: h ? (h.wasCorrect ? "var(--accent)" : "var(--accent2)") : i===qIdx ? "rgba(232,118,63,.2)" : "var(--surface2)", border:`1px solid ${i<=qIdx ? "var(--accent)" : "var(--border)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color: h ? "#0d0d0b" : i===qIdx ? "var(--accent)" : "var(--muted)" },}
                , h ? (h.wasCorrect ? "✓" : "✗") : i+1
              );
            })
          )
        )
      )
    );
  }

  // Result screen
  var finalScore = history.filter(h=>h.wasCorrect).length;
  var avgTime = Math.round(totalTime / 10);
  var rank = leaderboard.findIndex(s=>s.score===finalScore && Math.abs(new Date(s.date)-new Date())<5000);
  var isNewBest = leaderboard.length > 0 && finalScore >= Math.max(...leaderboard.map(s=>s.score));

  return (
    React.createElement('div', { style: { position:"fixed", inset:0, background:"var(--bg)", zIndex:400, overflow:"auto" },}
      , React.createElement('div', { style: { maxWidth:430, margin:"0 auto", padding:"52px 16px 80px" },}
        , React.createElement('div', { style: { textAlign:"center", marginBottom:24 },}
          , React.createElement('div', { style: { fontSize:64, marginBottom:12 },}, finalScore>=8?"🏆":finalScore>=5?"🎯":"💪")
          , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:42, letterSpacing:3, color:isNewBest?"var(--accent)":"var(--text)", marginBottom:6 },}
            , isNewBest ? "New Best!" : "Round Done"
          )
          , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:72, color:"var(--accent)", letterSpacing:4, lineHeight:1 },}, finalScore, "/10")
          , React.createElement('div', { style: { fontSize:13, color:"var(--muted)", marginTop:6 },}, Math.round((finalScore/10)*100), "% accuracy · "   , avgTime, "s avg per question"   )
        )

        , React.createElement('div', { className: "stat-row",}
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, finalScore), React.createElement('div', { className: "stat-lbl",}, "Correct"))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, 10-finalScore), React.createElement('div', { className: "stat-lbl",}, "Wrong"))
          , React.createElement('div', { className: "stat-box",}, React.createElement('div', { className: "stat-val",}, avgTime, "s"), React.createElement('div', { className: "stat-lbl",}, "Avg Time" ))
        )

        , React.createElement('div', { className: "section-label",}, "Question Review" )
        , history.map((h,i) => (
          React.createElement('div', { key: i, className: "history-row", style: { marginBottom:6, background: h.wasCorrect ? "rgba(232,118,63,.06)" : "rgba(194,72,63,.06)", border:`1px solid ${h.wasCorrect ? "rgba(232,118,63,.2)" : "rgba(194,72,63,.2)"}`, borderRadius:10 },}
            , React.createElement('span', { style: { fontSize:14 },}, h.wasCorrect ? "✅" : "❌")
            , React.createElement('div', { style: { flex:1 },}
              , React.createElement('div', { style: { fontSize:13, fontWeight:600, color:"var(--text)" },}, h.score, " → "  , h.correct)
              , !h.wasCorrect && !h.timedOut && React.createElement('div', { style: { fontSize:11, color:"var(--accent2)" },}, "You chose: "  , h.chosen)
              , h.timedOut && React.createElement('div', { style: { fontSize:11, color:"var(--accent2)" },}, "Timed out" )
            )
          )
        ))

        , React.createElement('div', { style: { display:"flex", gap:10, marginTop:20 },}
          , React.createElement('button', { className: "btn btn-secondary" , style: { flex:1 }, onClick: onClose,}, "← Menu" )
          , React.createElement('button', { className: "btn btn-primary" , style: { flex:2 }, onClick: startGame,}, "Play Again 🎯"  )
        )
      )
    )
  );
}

// ─── DAILY CHALLENGE CARD ─────────────────────────────────────────────────────

function DailyChallengeCard({ onOpenCheckout, history }) {
  var [challenge, setChallenge] = useState(getTodayChallenge);
  var [streakData, setStreakData] = useState(loadChallengeStreak);
  var [timeLeft, setTimeLeft] = useState(secondsUntilMidnight());

  // Countdown to midnight
  useEffect(() => {
    var t = setInterval(() => setTimeLeft(secondsUntilMidnight()), 1000);
    return () => clearInterval(t);
  }, []);

  var fmtCountdown = (s) => {
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  if (!challenge.challenge) return null;
  var dc = DIFFICULTY_CONFIG[challenge.challenge.difficulty] || DIFFICULTY_CONFIG.normal;
  var isSessionType = ["session","session_games","session_cats"].includes(challenge.challenge.type);

  return (
    React.createElement('div', { style: { background: challenge.completed ? "linear-gradient(135deg,rgba(232,118,63,.1),rgba(168,255,120,.05))" : `${dc.bg}`, border:`1px solid ${challenge.completed ? "rgba(232,118,63,.4)" : dc.border}`, borderRadius:"var(--radius)", padding:16, marginBottom:14 },}
      /* Header row */
      , React.createElement('div', { style: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 },}
        , React.createElement('div', { style: { display:"flex", alignItems:"center", gap:8 },}
          , React.createElement('span', { style: { fontSize:22 },}, challenge.completed ? "✅" : challenge.challenge.icon)
          , React.createElement('div', null
            , React.createElement('div', { style: { fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color: challenge.completed ? "var(--accent)" : dc.color },}, "Daily Challenge "
                , challenge.completed ? "— Done!" : `· ${dc.label}`
            )
            , React.createElement('div', { style: { fontSize:14, fontWeight:600, color:"var(--text)", marginTop:1 },}, challenge.challenge.title)
          )
        )
        /* Streak badge */
        , streakData.streak >= 1 && (
          React.createElement('div', { style: { textAlign:"center", flexShrink:0, padding:"6px 10px", background:"rgba(232,118,63,.1)", border:"1px solid rgba(232,118,63,.25)", borderRadius:12 },}
            , React.createElement('div', { style: { fontSize:16 },}, "🔥")
            , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:20, color:"var(--accent)", lineHeight:1 },}, streakData.streak)
            , React.createElement('div', { style: { fontSize:8, color:"var(--muted)", letterSpacing:1, textTransform:"uppercase" },}, "Streak")
          )
        )
      )

      /* Description */
      , React.createElement('div', { style: { fontSize:12, color:"var(--muted)", marginBottom:10, lineHeight:1.5 },}, challenge.challenge.desc)

      /* Progress bar if applicable */
      , challenge.progress > 0 && !challenge.completed && (
        React.createElement('div', { style: { marginBottom:10 },}
          , React.createElement('div', { style: { height:5, background:"rgba(255,255,255,0.08)", borderRadius:100, overflow:"hidden" },}
            , React.createElement('div', { style: { height:"100%", width:`${Math.min(100,(challenge.progress/challenge.challenge.target)*100)}%`, background:dc.color, borderRadius:100, transition:"width .4s ease" },} )
          )
          , React.createElement('div', { style: { fontSize:11, color:"var(--muted)", marginTop:4 },}, challenge.progress, " / "  , challenge.challenge.target)
        )
      )

      /* CTA buttons */
      , !challenge.completed && (
        React.createElement('div', { style: { display:"flex", gap:8, alignItems:"center" },}
          , _optionalChain([challenge, 'access', _65 => _65.challenge, 'access', _66 => _66.type, 'optionalAccess', _67 => _67.includes, 'call', _68 => _68("checkout")]) && (
            React.createElement('button', { className: "btn btn-primary btn-sm"  , style: { flex:1 }, onClick: onOpenCheckout,}, "Open Checkout Trainer →"

            )
          )
          , isSessionType && (
            React.createElement('div', { style: { fontSize:12, color:"var(--muted)", flex:1 },}, "Complete a training session to finish this."      )
          )
        )
      )

      /* Countdown footer */
      , React.createElement('div', { style: { display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10, paddingTop:10, borderTop:"1px solid rgba(255,255,255,0.06)" },}
        , React.createElement('div', { style: { fontSize:11, color:"var(--muted)" },}
          , challenge.completed ? "New challenge in" : "Resets in", " " , React.createElement('span', { style: { color:"var(--text)", fontWeight:600, fontFamily:"'Bebas Neue',sans-serif", letterSpacing:1 },}, fmtCountdown(timeLeft))
        )
        , streakData.best > 1 && (
          React.createElement('div', { style: { fontSize:11, color:"var(--muted)" },}, "Best streak: "  , React.createElement('span', { style: { color:"var(--accent)", fontWeight:700 },}, streakData.best))
        )
      )
    )
  );
}

// ─── WEEKLY MISSIONS CARD ─────────────────────────────────────────────────────

function WeeklyMissionsCard({ history, botGames }) {
  var [wm, setWm] = useState(() => updateMissionProgress(history, botGames));

  // Refresh if history changes
  useEffect(() => {
    setWm(updateMissionProgress(history, botGames));
  }, [history.length, botGames.length]);

  var completedCount = wm.missions.filter(m => m.done).length;
  var allDone = completedCount === 3;

  return (
    React.createElement('div', { style: { background: allDone ? "linear-gradient(135deg,rgba(232,118,63,.1),rgba(168,255,120,.05))" : "var(--surface)", border:`1px solid ${allDone ? "rgba(232,118,63,.4)" : "var(--border)"}`, borderRadius:"var(--radius)", padding:16, marginBottom:14 },}
      /* Header */
      , React.createElement('div', { style: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 },}
        , React.createElement('div', null
          , React.createElement('div', { style: { fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color: allDone ? "var(--accent)" : "var(--muted)" },}, "Weekly Missions "
              , allDone ? "— All Done! 🎉" : ""
          )
          , React.createElement('div', { style: { fontSize:12, color:"var(--muted)", marginTop:2 },}, "Resets every Monday"  )
        )
        /* Progress dots */
        , React.createElement('div', { style: { display:"flex", gap:5 },}
          , wm.missions.map((m,i) => (
            React.createElement('div', { key: i, style: { width:12, height:12, borderRadius:"50%", background: m.done ? "var(--accent)" : "rgba(255,255,255,0.12)", border:`1px solid ${m.done ? "var(--accent)" : "rgba(255,255,255,0.2)"}`, transition:"background .3s" },} )
          ))
        )
      )

      /* Mission rows */
      , React.createElement('div', { style: { display:"flex", flexDirection:"column", gap:10 },}
        , wm.missions.map((m, i) => {
          var pct = Math.min(100, Math.round((m.progress / m.target) * 100));
          return (
            React.createElement('div', { key: i, style: { background: m.done ? "rgba(232,118,63,.06)" : "rgba(255,255,255,0.03)", border:`1px solid ${m.done ? "rgba(232,118,63,.2)" : "rgba(255,255,255,0.07)"}`, borderRadius:12, padding:"11px 13px" },}
              , React.createElement('div', { style: { display:"flex", alignItems:"center", gap:10, marginBottom: m.done ? 0 : 7 },}
                , React.createElement('span', { style: { fontSize:20, flexShrink:0 },}, m.done ? "✅" : m.icon)
                , React.createElement('div', { style: { flex:1, minWidth:0 },}
                  , React.createElement('div', { style: { display:"flex", justifyContent:"space-between", alignItems:"baseline" },}
                    , React.createElement('span', { style: { fontSize:13, fontWeight:600, color: m.done ? "var(--accent)" : "var(--text)" },}, m.title)
                    , React.createElement('span', { style: { fontSize:11, color: m.done ? "var(--accent)" : "var(--muted)", flexShrink:0, marginLeft:8 },}
                      , m.done ? "Done" : `${m.progress}/${m.target}`
                    )
                  )
                  , React.createElement('div', { style: { fontSize:11, color:"var(--muted)", marginTop:1, lineHeight:1.4 },}, m.desc)
                )
              )
              , !m.done && (
                React.createElement('div', { style: { height:4, background:"rgba(255,255,255,0.07)", borderRadius:100, overflow:"hidden" },}
                  , React.createElement('div', { style: { height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#7ab8f5,#e8763f)", borderRadius:100, transition:"width .5s ease" },} )
                )
              )
            )
          );
        })
      )

      /* All done callout */
      , allDone && (
        React.createElement('div', { style: { marginTop:12, padding:"10px 12px", background:"rgba(232,118,63,.08)", border:"1px solid rgba(232,118,63,.2)", borderRadius:10, fontSize:12, color:"var(--accent)", fontWeight:600, textAlign:"center" },}, "🏆 Perfect week! New missions drop next Monday."

        )
      )
    )
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────

var ONBOARDING_KEY = "dl-onboarded";
var loadOnboarded = () => storage.get(ONBOARDING_KEY, false);
var saveOnboarded = () => storage.set(ONBOARDING_KEY, true);

// Programme templates by skill + goal
function buildOnboardingProgrammes(skill, goals, freq) {
  var primary = goals[0] || "allround";
  var label = { beginner:"Beginner", casual:"Casual Player", club:"Club Player", competitive:"Competitive" }[skill];
  var goalLabel = { finishing:"Finishing", scoring:"Scoring", pressure:"Pressure", allround:"All-Round" }[primary];

  var templates = {
    beginner: {
      finishing: {
        A: { name:"Warm-Up Session",   games:["atc-l1","high-score","doubles"],                    desc:"Build your base — great starting point" },
        B: { name:"Finishing Focus",   games:["atc-l1","f50-level1","121-level1"],                 desc:"Checkout practice for beginners" },
        C: { name:"Full Session",      games:["atc-l1","high-score","doubles","f50-level1"],        desc:"Longer session combining all areas" },
      },
      scoring: {
        A: { name:"Scoring Basics",    games:["atc-l1","high-score","trebles"],                    desc:"Build your scoring foundation" },
        B: { name:"501 Focus",         games:["501","high-score","priestleys-triples"],             desc:"Standard game + classic scoring drill" },
        C: { name:"Full Session",      games:["atc-l1","501","trebles","high-score"],               desc:"All-round scoring session" },
      },
      pressure: {
        A: { name:"First Pressure",    games:["atc-l1","high-score","darts-penalties"],            desc:"Introduction to pressure with Penalties" },
        B: { name:"Consistency Drill", games:["halve-it","doubles","501"],                         desc:"Miss and get punished" },
        C: { name:"Full Session",      games:["atc-l1","halve-it","high-score","doubles"],         desc:"Full beginner pressure session" },
      },
      allround: {
        A: { name:"Core Basics",       games:["atc-l1","high-score","doubles"],                    desc:"Essential beginner warm-up" },
        B: { name:"Game Practice",     games:["501","trebles","catch-40"],                         desc:"Scoring, finishing and checkout practice" },
        C: { name:"Full Session",      games:["atc-l1","501","doubles","high-score"],              desc:"Complete beginner session" },
      },
    },
    casual: {
      finishing: {
        A: { name:"Doubles Session",   games:["bobs-27","doubles","catch-40"],                     desc:"Bob's 27, doubles and checkout efficiency" },
        B: { name:"Checkout Drills",   games:["atc-l2","121-level1","checkout-pyramid"],           desc:"Systematic checkout practice" },
        C: { name:"Full Session",      games:["atc-l1","bobs-27","doubles","121-level1"],          desc:"Complete finishing session" },
      },
      scoring: {
        A: { name:"Scoring Session",   games:["priestleys-triples","501","high-score"],            desc:"Priestley's Triples + scoring games" },
        B: { name:"Accuracy + Score",  games:["atc-l2","trebles","501"],                          desc:"Doubles accuracy into scoring" },
        C: { name:"Full Session",      games:["high-score","priestleys-triples","501","halve-it"], desc:"Full scoring session" },
      },
      pressure: {
        A: { name:"Pressure Training", games:["halve-it","bobs-27","darts-penalties"],            desc:"Halve-It, Bob's 27, and Penalties" },
        B: { name:"Consistency",       games:["halve-it","doubles","121-level1"],                 desc:"Pressure on every dart" },
        C: { name:"Full Pressure",     games:["halve-it","bobs-27","trebles","darts-penalties"],  desc:"Full pressure session" },
      },
      allround: {
        A: { name:"Core Session",      games:["trebles","bobs-27","501"],                          desc:"The three essentials" },
        B: { name:"Variety Session",   games:["catch-40","halve-it","doubles"],                   desc:"Checkout efficiency + variety" },
        C: { name:"Full Session",      games:["trebles","bobs-27","501","catch-40"],              desc:"Complete all-round session" },
      },
    },
    club: {
      finishing: {
        A: { name:"Finishing Focus",   games:["bobs-27","catch-40","121-level1"],                 desc:"Bob's 27, Catch 40 and 121" },
        B: { name:"Checkout Drills",   games:["atc-l2","bobs-27","doubles","checkout-pyramid"],   desc:"Advanced checkout work" },
        C: { name:"Full Session",      games:["atc-l1","bobs-27","121-level1","catch-40","doubles"], desc:"Full club finishing session" },
      },
      scoring: {
        A: { name:"Scoring Power",     games:["priestleys-triples","501","atc-l3"],               desc:"Trebles and 501 with Priestley's" },
        B: { name:"Pressure Scoring",  games:["halve-it","priestleys-triples","501"],             desc:"Score under pressure" },
        C: { name:"Full Session",      games:["atc-l1","priestleys-triples","501","halve-it"],    desc:"Complete club scoring session" },
      },
      pressure: {
        A: { name:"Pressure Drills",   games:["halve-it","bobs-27","darts-penalties"],            desc:"Three pressure games" },
        B: { name:"Kill the Bull",     games:["kill-bull-l1","halve-it","121-level2"],            desc:"Bull accuracy under pressure" },
        C: { name:"Full Pressure",     games:["halve-it","bobs-27","kill-bull-l1","darts-penalties"], desc:"Full club pressure session" },
      },
      allround: {
        A: { name:"Core Club",         games:["priestleys-triples","bobs-27","501"],              desc:"Three club essentials" },
        B: { name:"Finishing + Match", games:["catch-40","halve-it","121-level1"],                desc:"Checkout and pressure" },
        C: { name:"Full Club Session", games:["priestleys-triples","bobs-27","501","catch-40","doubles"], desc:"Complete club session" },
      },
    },
    competitive: {
      finishing: {
        A: { name:"Elite Finishing",   games:["bobs-27","catch-40","121-level2"],                 desc:"Top-level checkout training" },
        B: { name:"Advanced Checkouts",games:["atc-l3","bobs-27","121-level3","checkout-pyramid"], desc:"Full checkout suite" },
        C: { name:"Competition Prep",  games:["atc-l2","bobs-27","121-level2","catch-40","doubles"], desc:"Full competition prep" },
      },
      scoring: {
        A: { name:"Elite Scoring",     games:["atc-l3","priestleys-triples","501"],               desc:"Trebles accuracy at its hardest" },
        B: { name:"JDC Challenge",     games:["jdc-challenge","priestleys-triples","atc-l4"],     desc:"JDC-level scoring and accuracy" },
        C: { name:"Full Competition",  games:["atc-l3","priestleys-triples","501","halve-it"],    desc:"Complete competitive session" },
      },
      pressure: {
        A: { name:"Mental Toughness",  games:["kill-bull-l2","121-level2","bobs-27"],             desc:"Three elite pressure drills" },
        B: { name:"Elite Pressure",    games:["halve-it","121-level3","darts-penalties"],         desc:"Maximum difficulty pressure" },
        C: { name:"Full Pressure",     games:["halve-it","bobs-27","kill-bull-l2","121-level2"],  desc:"Competition-level pressure session" },
      },
      allround: {
        A: { name:"Core Elite",        games:["priestleys-triples","bobs-27","jdc-challenge"],    desc:"Essential competitive drills" },
        B: { name:"Competitive Variety",games:["atc-l3","catch-40","501","street-82"],            desc:"Full board variety session" },
        C: { name:"Full Competition",  games:["priestleys-triples","bobs-27","501","121-level2","catch-40"], desc:"Complete competitive session" },
      },
    },
  };

  var t = _optionalChain([templates, 'access', _69 => _69[skill], 'optionalAccess', _70 => _70[primary]]) || templates.casual.allround;
  var now = Date.now();

  return [
    { id: `onboard-a-${now}`, name: `${label} — ${t.A.name}`, description: t.A.desc, games: t.A.games, createdAt: new Date().toISOString(), onboarded: true },
    { id: `onboard-b-${now+1}`, name: `${label} — ${t.B.name}`, description: t.B.desc, games: t.B.games, createdAt: new Date().toISOString(), onboarded: true },
    { id: `onboard-c-${now+2}`, name: `${label} — ${t.C.name}`, description: t.C.desc, games: t.C.games, createdAt: new Date().toISOString(), onboarded: true },
  ];
}

// ─── ONBOARDING COMPONENT ─────────────────────────────────────────────────────

function OnboardingFlow({ onComplete, onClose, isRedo }) {
  var [step, setStep] = useState(0);
  var [skill, setSkill] = useState(null);
  var [goals, setGoals] = useState([]);
  var [freq, setFreq] = useState(null);
  var [createdProgs, setCreatedProgs] = useState(null);

  var skillOptions = [
    { id:"beginner", label:"Just Starting Out", desc:"New to darts or practising for fun", icon:"🎯" },
    { id:"casual", label:"Casual Pub Player", desc:"I play regularly but not in leagues", icon:"🍺" },
    { id:"club", label:"Club / League Player", desc:"I play competitively in a league", icon:"🏆" },
    { id:"competitive", label:"Competitive Player", desc:"County level or higher", icon:"👑" },
  ];

  var goalOptions = [
    { id:"finishing", label:"Finishing & Doubles", desc:"Hit checkouts more consistently", icon:"✌️" },
    { id:"scoring", label:"Scoring Power", desc:"Improve my 3-dart average", icon:"📈" },
    { id:"pressure", label:"Pressure & Consistency", desc:"Perform under match pressure", icon:"💪" },
    { id:"allround", label:"All-Round Game", desc:"Improve every area evenly", icon:"🎯" },
  ];

  var freqOptions = [
    { id:"few", label:"2–3 Times a Week", desc:"Regular but not every day", icon:"📅" },
    { id:"most", label:"Most Days", desc:"5–6 times a week", icon:"🔥" },
    { id:"every", label:"Every Day", desc:"Daily training", icon:"⚡" },
  ];

  var toggleGoal = (id) => {
    setGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]);
  };

  var handleFinish = () => {
    var progs = buildOnboardingProgrammes(skill, goals.length > 0 ? goals : ["allround"], freq);
    setCreatedProgs(progs);
    setStep(4);
  };

  var skillLabel = { beginner:"Beginner", casual:"Casual Player", club:"Club Player", competitive:"Competitive Player" }[skill];
  var goalLabel = goals.map(g => ({ finishing:"Finishing", scoring:"Scoring", pressure:"Pressure", allround:"All-Round" }[g])).join(" + ");
  var freqLabel = { few:"2–3x/week", most:"Most days", every:"Daily" }[freq];

  // Step 4 — Summary screen
  if (step === 4 && createdProgs) return (
    React.createElement('div', { style: { position:"absolute", inset:0, background:"var(--bg)", zIndex:500, overflow:"auto" },}
      , React.createElement('div', { style: { maxWidth:430, margin:"0 auto", padding:"52px 16px 100px" },}
        , React.createElement('div', { style: { textAlign:"center", marginBottom:28 },}
          , React.createElement('div', { style: { fontSize:56, marginBottom:12 },}, "🎉")
          , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:34, letterSpacing:3, color:"var(--text)", marginBottom:6 },}, "You're All Set!"  )
          , React.createElement('div', { style: { fontSize:13, color:"var(--muted)", lineHeight:1.55 },}, "Based on your answers, we've created 3 training programmes tailored to your level and goals."

          )
        )

        /* Profile summary */
        , React.createElement('div', { style: { background:"var(--surface)", border:"1px solid rgba(232,118,63,.3)", borderRadius:"var(--radius)", padding:16, marginBottom:20 },}
          , React.createElement('div', { style: { fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"var(--accent)", marginBottom:10 },}, "Your Profile" )
          , React.createElement('div', { style: { display:"flex", gap:16, flexWrap:"wrap" },}
            , skillLabel && React.createElement('div', { style: { fontSize:13 },}, React.createElement('span', { style: { color:"var(--muted)" },}, "Level: " ), React.createElement('span', { style: { color:"var(--text)", fontWeight:600 },}, skillLabel))
            , goalLabel && React.createElement('div', { style: { fontSize:13 },}, React.createElement('span', { style: { color:"var(--muted)" },}, "Focus: " ), React.createElement('span', { style: { color:"var(--text)", fontWeight:600 },}, goalLabel))
            , freqLabel && React.createElement('div', { style: { fontSize:13 },}, React.createElement('span', { style: { color:"var(--muted)" },}, "Training: " ), React.createElement('span', { style: { color:"var(--text)", fontWeight:600 },}, freqLabel))
          )
        )

        , React.createElement('div', { style: { fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"var(--muted)", marginBottom:12 },}, "Your 3 Programmes"  )
        , React.createElement('div', { style: { fontSize:12, color:"var(--muted)", marginBottom:16, lineHeight:1.5 },}, "Rotate between these across the week. Use Session A to warm up, Session B for focused work, Session C for longer full sessions."

        )

        , createdProgs.map((p, i) => {
          var label = ["Session A — Warm-Up", "Session B — Focus", "Session C — Full"][i];
          var mins = p.games.reduce((a, id) => { var g = GAMES.find(g => g.id === id); return a + (g ? parseInt(g.duration) : 0); }, 0);
          return (
            React.createElement('div', { key: p.id, style: { background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius)", padding:16, marginBottom:12 },}
              , React.createElement('div', { style: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 },}
                , React.createElement('div', null
                  , React.createElement('div', { style: { fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"var(--accent)", marginBottom:3 },}, label)
                  , React.createElement('div', { style: { fontSize:15, fontWeight:600, color:"var(--text)" },}, p.name.split("— ")[1])
                  , React.createElement('div', { style: { fontSize:12, color:"var(--muted)", marginTop:2 },}, p.description)
                )
                , React.createElement('span', { style: { fontSize:11, color:"var(--muted)", background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:100, padding:"2px 8px", flexShrink:0, marginLeft:8 },}, "~", mins, " min" )
              )
              , React.createElement('div', { style: { display:"flex", gap:6, flexWrap:"wrap" },}
                , p.games.map(id => { var g = GAMES.find(g => g.id === id); return g ? React.createElement('div', { key: id, style: { fontSize:11, padding:"3px 8px", background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:100, color:"var(--muted)" },}, g.icon, " " , g.name) : null; })
              )
            )
          );
        })

        , React.createElement('div', { style: { fontSize:13, color:"var(--muted)", lineHeight:1.55, marginBottom:20, padding:"12px 14px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12 },}, "💡 These programmes are saved and ready to go. You can edit them anytime in the Plans tab, or create your own from scratch."

        )

        , React.createElement('button', { className: "btn btn-primary btn-full"  , onClick: () => onComplete(createdProgs),}, "Start Training →"

        )
      )
    )
  );

  // Steps 0–3 — survey
  var steps = [
    // Step 0 — Welcome
    React.createElement('div', { key: 0, style: { position:"absolute", inset:0, background:"var(--bg)", zIndex:500, overflow:"auto" },}
      , React.createElement('div', { style: { maxWidth:430, margin:"0 auto", padding:"52px 28px 120px", textAlign:"center", minHeight:"110vh" },}

        , onClose && (
          React.createElement('button', { onClick: onClose, style: { display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:"var(--muted)", fontFamily:"'Hanken Grotesk',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer", marginBottom:24, WebkitTapHighlightColor:"transparent" },}
            , React.createElement(Ms, { icon: "arrow_back", size: 18,} ), " Back"
          )
        )

        , React.createElement('div', { style: { marginBottom:20 },}
          , React.createElement(DartboardSVG, { size: 120,} )
        )
        , React.createElement('div', { style: { display:"flex", alignItems:"baseline", justifyContent:"center", gap:6, marginBottom:8 },}
          , React.createElement('span', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:42, fontWeight:800, letterSpacing:"-0.03em", color:"var(--text)", lineHeight:1 },}, "DARTS")
          , React.createElement('span', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:42, fontWeight:800, letterSpacing:"-0.03em", color:"var(--accent)", lineHeight:1 },}, "IQ")
        )
        , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:500, letterSpacing:".08em", textTransform:"uppercase", color:"var(--muted)", marginBottom:20 },}, "Track · Improve · Excel"    )
        , React.createElement('div', { style: { fontSize:15, color:"var(--text2)", lineHeight:1.65, maxWidth:300, margin:"0 auto", fontFamily:"'Hanken Grotesk',sans-serif", marginBottom:36 },}
          , isRedo ? "Let's update your training profile and rebuild your programmes." : "Let's set up your training profile. Takes 30 seconds."
        )

        , React.createElement('button', { className: "btn btn-primary btn-full"  , style: { fontSize:16, padding:"16px", fontWeight:700 }, onClick: () => setStep(1),}
          , React.createElement(Ms, { icon: isRedo ? "refresh" : "arrow_forward", size: 20,} )
          , isRedo ? "Update Profile" : "Get Started"
        )
      )
    ),

    // Step 1 — Skill level
    React.createElement('div', { key: 1, style: { position:"absolute", inset:0, background:"var(--bg)", zIndex:500, overflow:"auto" },}
      , React.createElement('div', { style: { maxWidth:430, margin:"0 auto", padding:"52px 16px 32px" },}
        , React.createElement('div', { style: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 },}
          , React.createElement('button', { onClick: () => setStep(0), style: { background:"none", border:"none", color:"var(--muted)", fontSize:14, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" },}, React.createElement(Ms, { icon: "arrow_back", size: 18,} ), " Back" )
          , onClose && React.createElement('button', { onClick: onClose, style: { background:"none", border:"none", color:"var(--muted)", fontSize:13, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" },}, "✕ Exit" )
        )
        , React.createElement('div', { style: { fontSize:11, color:"var(--muted)", letterSpacing:2, textTransform:"uppercase", marginBottom:6 },}, "Step 1 of 3"   )
        , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:32, letterSpacing:2, color:"var(--text)", marginBottom:6 },}, "What's your level?"  )
        , React.createElement('div', { style: { fontSize:13, color:"var(--muted)", marginBottom:24 },}, "Be honest — it helps us build the right programme."         )
        , React.createElement('div', { style: { display:"flex", flexDirection:"column", gap:10 },}
          , skillOptions.map(o => (
            React.createElement('div', { key: o.id, onClick: () => setSkill(o.id), style: { background: skill === o.id ? "linear-gradient(135deg,rgba(232,118,63,.12),rgba(168,255,120,.06))" : "var(--surface)", border:`1px solid ${skill === o.id ? "rgba(232,118,63,.4)" : "var(--border)"}`, borderRadius:"var(--radius)", padding:"16px 18px", cursor:"pointer", display:"flex", gap:14, alignItems:"center", transition:"all .15s", WebkitTapHighlightColor:"transparent" },}
              , React.createElement('div', { style: { fontSize:28, flexShrink:0 },}, o.icon)
              , React.createElement('div', null
                , React.createElement('div', { style: { fontSize:15, fontWeight:600, color:skill===o.id?"var(--accent)":"var(--text)" },}, o.label)
                , React.createElement('div', { style: { fontSize:12, color:"var(--muted)", marginTop:2 },}, o.desc)
              )
              , skill === o.id && React.createElement('div', { style: { marginLeft:"auto", color:"var(--accent)", fontSize:18 },}, "✓")
            )
          ))
        )
        , React.createElement('button', { className: "btn btn-primary btn-full"  , style: { marginTop:20 }, disabled: !skill, onClick: () => setStep(2),}, "Next →" )
      )
    ),

    // Step 2 — Goals
    React.createElement('div', { key: 2, style: { position:"absolute", inset:0, background:"var(--bg)", zIndex:500, overflow:"auto" },}
      , React.createElement('div', { style: { maxWidth:430, margin:"0 auto", padding:"52px 16px 32px" },}
        , React.createElement('div', { style: { fontSize:11, color:"var(--muted)", letterSpacing:2, textTransform:"uppercase", marginBottom:6 },}, "Step 2 of 3"   )
        , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:32, letterSpacing:2, color:"var(--text)", marginBottom:6 },}, "What do you want to improve?"     )
        , React.createElement('div', { style: { fontSize:13, color:"var(--muted)", marginBottom:24 },}, "Pick up to 2. We'll tailor your programme around these."         )
        , React.createElement('div', { style: { display:"flex", flexDirection:"column", gap:10 },}
          , goalOptions.map(o => {
            var sel = goals.includes(o.id);
            return (
              React.createElement('div', { key: o.id, onClick: () => toggleGoal(o.id), style: { background: sel ? "linear-gradient(135deg,rgba(232,118,63,.12),rgba(168,255,120,.06))" : "var(--surface)", border:`1px solid ${sel ? "rgba(232,118,63,.4)" : "var(--border)"}`, borderRadius:"var(--radius)", padding:"16px 18px", cursor:"pointer", display:"flex", gap:14, alignItems:"center", transition:"all .15s", WebkitTapHighlightColor:"transparent" },}
                , React.createElement('div', { style: { fontSize:28, flexShrink:0 },}, o.icon)
                , React.createElement('div', null
                  , React.createElement('div', { style: { fontSize:15, fontWeight:600, color:sel?"var(--accent)":"var(--text)" },}, o.label)
                  , React.createElement('div', { style: { fontSize:12, color:"var(--muted)", marginTop:2 },}, o.desc)
                )
                , React.createElement('div', { style: { marginLeft:"auto", width:22, height:22, borderRadius:7, border:`2px solid ${sel?"var(--accent)":"var(--border)"}`, background:sel?"var(--accent)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:12, color:"var(--on-accent)", fontWeight:700 },}, sel?"✓":"")
              )
            );
          })
        )
        , React.createElement('div', { style: { display:"flex", gap:10, marginTop:20 },}
          , React.createElement('button', { className: "btn btn-secondary" , style: { flex:1 }, onClick: () => setStep(1),}, React.createElement(Ms, { icon: "arrow_back", size: 18,} ), " Back" )
          , React.createElement('button', { className: "btn btn-primary" , style: { flex:2 }, disabled: goals.length === 0, onClick: () => setStep(3),}, "Next →" )
        )
        , onClose && React.createElement('button', { onClick: onClose, style: { width:"100%", marginTop:10, background:"none", border:"none", color:"var(--muted)", fontSize:13, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" },}, "✕ Exit setup"  )
      )
    ),

    // Step 3 — Frequency
    React.createElement('div', { key: 3, style: { position:"absolute", inset:0, background:"var(--bg)", zIndex:500, overflow:"auto" },}
      , React.createElement('div', { style: { maxWidth:430, margin:"0 auto", padding:"52px 16px 32px" },}
        , React.createElement('div', { style: { fontSize:11, color:"var(--muted)", letterSpacing:2, textTransform:"uppercase", marginBottom:6 },}, "Step 3 of 3"   )
        , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:32, letterSpacing:2, color:"var(--text)", marginBottom:6 },}, "How often can you train?"    )
        , React.createElement('div', { style: { fontSize:13, color:"var(--muted)", marginBottom:24 },}, "Be realistic — consistent practice beats occasional marathons."       )
        , React.createElement('div', { style: { display:"flex", flexDirection:"column", gap:10 },}
          , freqOptions.map(o => (
            React.createElement('div', { key: o.id, onClick: () => setFreq(o.id), style: { background: freq === o.id ? "linear-gradient(135deg,rgba(232,118,63,.12),rgba(168,255,120,.06))" : "var(--surface)", border:`1px solid ${freq === o.id ? "rgba(232,118,63,.4)" : "var(--border)"}`, borderRadius:"var(--radius)", padding:"16px 18px", cursor:"pointer", display:"flex", gap:14, alignItems:"center", transition:"all .15s", WebkitTapHighlightColor:"transparent" },}
              , React.createElement('div', { style: { fontSize:28, flexShrink:0 },}, o.icon)
              , React.createElement('div', null
                , React.createElement('div', { style: { fontSize:15, fontWeight:600, color:freq===o.id?"var(--accent)":"var(--text)" },}, o.label)
                , React.createElement('div', { style: { fontSize:12, color:"var(--muted)", marginTop:2 },}, o.desc)
              )
              , freq === o.id && React.createElement('div', { style: { marginLeft:"auto", color:"var(--accent)", fontSize:18 },}, "✓")
            )
          ))
        )
        , React.createElement('div', { style: { display:"flex", gap:10, marginTop:20 },}
          , React.createElement('button', { className: "btn btn-secondary" , style: { flex:1 }, onClick: () => setStep(2),}, React.createElement(Ms, { icon: "arrow_back", size: 18,} ), " Back" )
          , React.createElement('button', { className: "btn btn-primary" , style: { flex:2 }, disabled: !freq, onClick: handleFinish,}, "Build My Programme →"   )
        )
      )
    ),
  ];

  return steps[step] || null;
}

// ─── WEEKLY SUMMARY ──────────────────────────────────────────────────────────

function getWeeklySummary(history, botGames) {
  var now = new Date();
  var weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
  var lastWeekStart = new Date(now); lastWeekStart.setDate(now.getDate() - 14);

  var thisWeek = history.filter(s => new Date(s.date) >= weekAgo);
  var lastWeek = history.filter(s => new Date(s.date) >= lastWeekStart && new Date(s.date) < weekAgo);
  var thisWeekBot = botGames.filter(g => new Date(g.date) >= weekAgo);

  if (thisWeek.length === 0) return null;

  var thisGames = thisWeek.reduce((a, s) => a + (_optionalChain([s, 'access', _71 => _71.games, 'optionalAccess', _72 => _72.length]) || 0), 0);
  var lastGames = lastWeek.reduce((a, s) => a + (_optionalChain([s, 'access', _73 => _73.games, 'optionalAccess', _74 => _74.length]) || 0), 0);
  var sessionDiff = thisWeek.length - lastWeek.length;
  var botWins = thisWeekBot.filter(g => g.winner === "player").length;

  // Find most improved game this week
  var bestImprovement = null;
  var gameScoresThisWeek = {};
  var gameScoresLastWeek = {};
  thisWeek.forEach(s => _optionalChain([s, 'access', _75 => _75.games, 'optionalAccess', _76 => _76.forEach, 'call', _77 => _77(g => {
    if (!gameScoresThisWeek[g.id]) gameScoresThisWeek[g.id] = { name: g.name, icon: g.icon, scores: [] };
    gameScoresThisWeek[g.id].scores.push(g.score);
  })]));
  lastWeek.forEach(s => _optionalChain([s, 'access', _78 => _78.games, 'optionalAccess', _79 => _79.forEach, 'call', _80 => _80(g => {
    if (!gameScoresLastWeek[g.id]) gameScoresLastWeek[g.id] = { scores: [] };
    gameScoresLastWeek[g.id].scores.push(g.score);
  })]));
  Object.entries(gameScoresThisWeek).forEach(([id, data]) => {
    var thisAvg = data.scores.reduce((a,b) => a+b, 0) / data.scores.length;
    if (_optionalChain([gameScoresLastWeek, 'access', _81 => _81[id], 'optionalAccess', _82 => _82.scores, 'access', _83 => _83.length]) > 0) {
      var lastAvg = gameScoresLastWeek[id].scores.reduce((a,b) => a+b, 0) / gameScoresLastWeek[id].scores.length;
      var diff = thisAvg - lastAvg;
      if (!bestImprovement || diff > bestImprovement.diff) bestImprovement = { name: data.name, icon: data.icon, diff: Math.round(diff) };
    }
  });

  return { sessions: thisWeek.length, games: thisGames, sessionDiff, botWins, botGamesCount: thisWeekBot.length, bestImprovement };
}

// ─── FULFILLMENT HELPERS ──────────────────────────────────────────────────────

function calcStreak(history) {
  if (!history || history.length === 0) return 0;
  var days = [...new Set(history.map(s => new Date(s.date).toDateString()))].map(d => new Date(d)).sort((a,b) => b-a);
  if (days.length === 0) return 0;
  var today = new Date(); today.setHours(0,0,0,0);
  var yesterday = new Date(today); yesterday.setDate(today.getDate()-1);
  if (days[0] < yesterday) return 0;
  var streak = 1;
  for (var i = 1; i < days.length; i++) {
    var diff = (days[i-1] - days[i]) / (1000*60*60*24);
    if (diff <= 1) streak++; else break;
  }
  return streak;
}

// Derives the stats object needed by checkAchievements + calcDartsIQ
// from existing localStorage history. Call once on app load.
function deriveAchievementState(history = [], botGames = []) {
  var sessions   = history.length;
  var totalGames = history.reduce((a, s) => a + (_optionalChain([s, 'access', _84 => _84.games, 'optionalAccess', _85 => _85.length]) || 0), 0);
  var streak     = calcStreak(history);
  var bobs27Best = 0, doublesRate = 0, highScoreBest = 0, checkoutsHit = 0;
  var catch40Best = 0, jdcBest = 0, killBullBest = 0, killBullGoalReached = false;
  var priestleysBest = 0, street82Done = false, street82Best = 0;
  var pyramidBest = 0, singleMasteryDone = false;
  var penaltiesWin = false, penaltiesExpertWin = false;
  var xoWin = false, xoWinHighBot = false;

  history.forEach(s => {
    _optionalChain([s, 'access', _86 => _86.games, 'optionalAccess', _87 => _87.forEach, 'call', _88 => _88(g => {
      if (g.id === "bobs-27")             bobs27Best      = Math.max(bobs27Best, g.score);
      if (g.id === "doubles")             doublesRate     = Math.max(doublesRate, Math.round((g.score / 63) * 100));
      if (g.id === "high-score")          highScoreBest   = Math.max(highScoreBest, g.score);
      if (_optionalChain([g, 'access', _89 => _89.id, 'optionalAccess', _90 => _90.startsWith, 'call', _91 => _91("f50")]))        checkoutsHit    = Math.max(checkoutsHit, g.score);
      if (g.id === "catch-40")            catch40Best     = Math.max(catch40Best, g.score);
      if (g.id === "jdc-challenge")       jdcBest         = Math.max(jdcBest, g.score);
      if (_optionalChain([g, 'access', _92 => _92.id, 'optionalAccess', _93 => _93.startsWith, 'call', _94 => _94("kill-bull")])) { killBullBest   = Math.max(killBullBest, g.score); if (g.score > 0) killBullGoalReached = true; }
      if (g.id === "priestleys-triples")  priestleysBest  = Math.max(priestleysBest, g.score);
      if (g.id === "street-82")         { street82Done    = true; street82Best = Math.max(street82Best, g.score); }
      if (g.id === "checkout-pyramid")    pyramidBest     = Math.max(pyramidBest, g.score);
      if (g.id === "single-mastery")      singleMasteryDone = true;
      if (g.id === "darts-penalties" && g.score > 0)  penaltiesWin = true;
      if (g.id === "xo-checkout" && g.score > 0)      xoWin = true;
    })]);
  });
  var botWins    = botGames.filter(g => g.winner === "player");
  var botWin     = botWins.length > 0;
  var botMaxLevel = Math.max(0, ...botWins.map(g => g.botLevel || 0));
  var botWinRate  = botGames.length > 0 ? botWins.length / botGames.length : 0;
  var oneWeekAgo  = Date.now() - 7 * 24 * 60 * 60 * 1000;
  var weeklyAvg   = history.filter(s => new Date(s.date) >= oneWeekAgo).length / 7;
  var progCompletions = {};
  history.forEach(s => {
    if (s.programmeId) progCompletions[s.programmeId] = (progCompletions[s.programmeId] || 0) + 1;
  });
  var allCatsInSession = history.some(s => {
    var cats = new Set(_optionalChain([s, 'access', _95 => _95.games, 'optionalAccess', _96 => _96.map, 'call', _97 => _97(g => _optionalChain([GAMES, 'access', _98 => _98.find, 'call', _99 => _99(x => x.id === g.id), 'optionalAccess', _100 => _100.category])), 'access', _101 => _101.filter, 'call', _102 => _102(Boolean)]));
    return cats.size >= 4;
  });
  return {
    sessions, totalGames, streak,
    bobs27Best, doublesRate, highScoreBest, checkoutsHit,
    catch40Best, jdcBest, killBullBest, killBullGoalReached,
    priestleysBest, street82Done, street82Best,
    pyramidBest, singleMasteryDone,
    penaltiesWin, penaltiesExpertWin,
    xoWin, xoWinHighBot,
    botWin, botMaxLevel, botWinRate, weeklyAvg,
    progCompletions, allCatsInSession,
    progNoExit: false, allPBsInSession: false,
    dailyChallengesTotal: 0, dailyStreak: 0,
    dailyHardDone: false, dailyLegendaryDone: false, dailyPerfectWeek: false,
  };
}

function getSessionFeedback(session, history) {
  if (!session || !session.games || session.games.length === 0) return null;
  var messages = [];
  session.games.forEach(g => {
    var prev = history.filter(s => s.id !== session.id).flatMap(s => s.games || []).filter(x => x.id === g.id);
    if (prev.length > 0) {
      var prevBest = Math.max(...prev.map(x => x.score));
      if (g.score > prevBest) messages.push({ type: "pb", text: `🏆 New PB on ${g.name}! ${prevBest} → ${g.score}` });
    }
  });
  if (messages.length > 0) return messages;
  var totalScore = session.games.reduce((a,g) => a+g.score, 0);
  if (session.games.length >= 3) return [{ type: "solid", text: `Solid session — ${session.games.length} games completed. Keep it up.` }];
  return [{ type: "done", text: "Session logged. Every session counts." }];
}

function checkPBs(session, history) {
  var pbs = [];
  if (!_optionalChain([session, 'optionalAccess', _103 => _103.games])) return pbs;
  session.games.forEach(g => {
    var prev = history.filter(s => s.id !== session.id).flatMap(s => s.games||[]).filter(x => x.id === g.id);
    if (prev.length > 0) {
      var prevBest = Math.max(...prev.map(x => x.score));
      if (g.score > prevBest) pbs.push({ name: g.name, icon: g.icon, old: prevBest, new: g.score });
    }
  });
  return pbs;
}


// ─── PLAYER TIER SYSTEM ───────────────────────────────────────────────────────

var PLAYER_TIERS = [
  { name: "Beginner",      minSessions: 0,  minGames: 0,  color: "#6b6b88",  emoji: "🎯" },
  { name: "Club Starter",  minSessions: 3,  minGames: 8,  color: "#7ab8f5",  emoji: "🎯" },
  { name: "Club Player",   minSessions: 8,  minGames: 20, color: "#5cb85c",  emoji: "🎯" },
  { name: "Strong Club",   minSessions: 15, minGames: 40, color: "#f0ad4e",  emoji: "🎯" },
  { name: "League Player", minSessions: 25, minGames: 70, color: "#e8763f",  emoji: "🏆" },
  { name: "Advanced",      minSessions: 40, minGames: 110,color: "#ff9800",  emoji: "🏆" },
  { name: "Elite",         minSessions: 60, minGames: 160,color: "#c2483f",  emoji: "👑" },
];

function getPlayerTier(history) {
  var sessions = history.length;
  var games = history.reduce((a, s) => a + (_optionalChain([s, 'access', _104 => _104.games, 'optionalAccess', _105 => _105.length]) || 0), 0);
  var tier = PLAYER_TIERS[0];
  for (var t of PLAYER_TIERS) {
    if (sessions >= t.minSessions && games >= t.minGames) tier = t;
  }
  var currentIdx = PLAYER_TIERS.indexOf(tier);
  var nextTier = currentIdx < PLAYER_TIERS.length - 1 ? PLAYER_TIERS[currentIdx + 1] : null;
  var pctToNext = nextTier
    ? Math.min(100, Math.round(Math.max(
        (sessions - tier.minSessions) / (nextTier.minSessions - tier.minSessions),
        (games - tier.minGames) / (nextTier.minGames - tier.minGames)
      ) * 100))
    : 100;
  return { tier, nextTier, pctToNext, sessions, games };
}

// ─── INSIGHTS ENGINE ──────────────────────────────────────────────────────────

function generateInsights(history, botGames, stats) {
  var insights = [];
  if (!history || history.length < 2) return insights;

  var gameStats = stats.gameStats;

  // 1. Consistency insight — which game they play most
  var mostPlayed = Object.entries(gameStats).sort((a,b) => b[1].totalPlays - a[1].totalPlays)[0];
  if (mostPlayed) {
    insights.push({
      type: "habit",
      icon: mostPlayed[1].icon,
      title: "Your go-to game",
      body: `You've played ${mostPlayed[1].name} ${mostPlayed[1].totalPlays} times — more than any other game. That consistency is building real muscle memory.`
    });
  }

  // 2. Improvement trend insight
  var improving = Object.entries(gameStats).filter(([,g]) => {
    if (g.scores.length < 3) return false;
    var recent = g.scores.slice(-3).reduce((a,b) => a+b,0) / 3;
    var older = g.scores.slice(0,3).reduce((a,b) => a+b,0) / 3;
    return recent > older * 1.1;
  });
  if (improving.length > 0) {
    var g = improving[0][1];
    var first3avg = Math.round(g.scores.slice(0,3).reduce((a,b)=>a+b,0)/3);
    var last3avg = Math.round(g.scores.slice(-3).reduce((a,b)=>a+b,0)/3);
    insights.push({
      type: "improving",
      icon: "📈",
      title: "Clear improvement",
      body: `Your ${g.name} scores have gone from an average of ${first3avg} in your first sessions to ${last3avg} recently. That's real, measurable progress.`
    });
  }

  // 3. Plateau insight — game that hasn't improved in 5+ plays
  var plateaued = Object.entries(gameStats).filter(([,g]) => {
    if (g.scores.length < 5) return false;
    var recent = g.scores.slice(-5);
    var maxRecent = Math.max(...recent);
    var minRecent = Math.min(...recent);
    return maxRecent - minRecent < (g.bestScore * 0.08);
  });
  if (plateaued.length > 0) {
    var g = plateaued[0][1];
    insights.push({
      type: "plateau",
      icon: "⚠️",
      title: "Plateau detected",
      body: `Your ${g.name} scores have been flat for the last 5 sessions. Try doing it at the start of your session when you're freshest — fatigue might be the issue.`
    });
  }

  // 4. Neglected game insight — important game not played in a while
  var allGameIds = history.flatMap(s => _optionalChain([s, 'access', _106 => _106.games, 'optionalAccess', _107 => _107.map, 'call', _108 => _108(g => g.id)]) || []);
  var recentIds = history.slice(-3).flatMap(s => _optionalChain([s, 'access', _109 => _109.games, 'optionalAccess', _110 => _110.map, 'call', _111 => _111(g => g.id)]) || []);
  var importantGames = ["bobs-27", "doubles", "121-level1", "121-level2", "halve-it"];
  var neglected = importantGames.find(id => allGameIds.includes(id) && !recentIds.includes(id));
  if (neglected) {
    var gameInfo = { "bobs-27": { name: "Bob's 27", icon: "2️⃣7️⃣" }, "doubles": { name: "Doubles Practice", icon: "✌️" }, "121-level1": { name: "121 Level 1", icon: "🎰" }, "121-level2": { name: "121 Level 2", icon: "🎰" }, "halve-it": { name: "Halve-It", icon: "✂️" }};
    var g = gameInfo[neglected];
    insights.push({
      type: "neglected",
      icon: g.icon,
      title: "Don't forget this one",
      body: `You haven't played ${g.name} in your last 3 sessions. It's one of the best finishing drills available — add it to your next programme.`
    });
  }

  // 5. Bot performance insight
  if (botGames.length >= 3) {
    var recentBotGames = botGames.slice(-5);
    var recentWinRate = recentBotGames.filter(g => g.winner === "player").length / recentBotGames.length;
    var overallWinRate = botGames.filter(g => g.winner === "player").length / botGames.length;
    if (recentWinRate > overallWinRate + 0.2) {
      insights.push({ type: "bot-form", icon: "🤖", title: "On a good run vs the bot", body: `You're winning ${Math.round(recentWinRate*100)}% of your last 5 bot games — above your overall average. Try stepping up the difficulty level.` });
    } else if (recentWinRate < overallWinRate - 0.2) {
      insights.push({ type: "bot-form", icon: "🤖", title: "Bot games tough lately", body: `Win rate is down in recent games. Take a session focusing on doubles and finishing before your next bot match.` });
    }
  }

  // 6. Training frequency
  var streak = calcStreak(history);
  if (streak >= 5) {
    insights.push({ type: "streak", icon: "🔥", title: `${streak} day streak`, body: `You've trained ${streak} days in a row. Consistency like this is exactly what separates improving players from stagnant ones. Keep going.` });
  }

  return insights.slice(0, 4); // Max 4 insights shown
}

// ─── TIER CARD COMPONENT ──────────────────────────────────────────────────────

function TierCard({ history }) {
  var { tier, nextTier, pctToNext } = getPlayerTier(history);
  return (
    React.createElement('div', { style: { background: "var(--surface)", border: `1px solid ${tier.color}33`, borderRadius: "var(--radius)", padding: 16, marginBottom: 14 },}
      , React.createElement('div', { style: { display: "flex", alignItems: "center", gap: 12 },}
        , React.createElement('div', { style: { width: 44, height: 44, borderRadius: 12, background: `${tier.color}20`, border: `1px solid ${tier.color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 },}
          , tier.emoji
        )
        , React.createElement('div', { style: { flex: 1 },}
          , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 2 },}, "Your Level" )
          , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: 1.5, color: tier.color, lineHeight: 1 },}, tier.name)
        )
        , nextTier && (
          React.createElement('div', { style: { textAlign: "right" },}
            , React.createElement('div', { style: { fontSize: 10, color: "var(--muted)", marginBottom: 2 },}, "Next: " , nextTier.name)
            , React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: "var(--text)" },}, pctToNext, "%")
          )
        )
      )
      , nextTier && (
        React.createElement('div', { style: { marginTop: 10 },}
          , React.createElement('div', { style: { height: 6, background: "var(--surface2)", borderRadius: 100, overflow: "hidden" },}
            , React.createElement('div', { style: { width: `${pctToNext}%`, height: "100%", background: tier.color, borderRadius: 100, transition: "width .5s" },})
          )
          , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginTop: 4 },}, "Keep training to reach "    , nextTier.name)
        )
      )
    )
  );
}

// ─── INSIGHTS CARD COMPONENT ──────────────────────────────────────────────────

function InsightsSection({ history, botGames, stats }) {
  var insights = generateInsights(history, botGames, stats);
  if (insights.length === 0) return null;
  var typeColors = { improving: "var(--accent)", plateau: "var(--accent2)", habit: "var(--muted)", neglected: "#f0ad4e", "bot-form": "var(--muted)", streak: "var(--accent)" };
  return (
    React.createElement('div', null
      , React.createElement('div', { className: "section-label",}, "Coaching Insights" )
      , insights.map((ins, i) => (
        React.createElement('div', { key: i, style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, marginBottom: 10, display: "flex", gap: 12, alignItems: "flex-start" },}
          , React.createElement('div', { style: { fontSize: 22, flexShrink: 0, marginTop: 1 },}, ins.icon)
          , React.createElement('div', null
            , React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: typeColors[ins.type] || "var(--text)", marginBottom: 3 },}, ins.title)
            , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)", lineHeight: 1.55 },}, ins.body)
          )
        )
      ))
    )
  );
}

// ─── INLINE COMPONENTS FOR TRAIN TAB ─────────────────────────────────────────

// ─── LEVEL PICKER ────────────────────────────────────────────────────────────
function LevelPickerPage({ group, onSelectLevel, onBack }) {
  var diffColor = (d) => d === "Advanced" ? "var(--accent2)" : d === "Intermediate" ? "#f0ad4e" : "var(--accent)";
  return (
    React.createElement('div', { className: "scroll-area",}
      , React.createElement('div', { style: { paddingTop: 52 },}
        , React.createElement('button', { className: "back-btn", onClick: onBack,}, React.createElement(Ms, { icon: "arrow_back", size: 18,} ), " Back" )
      )
      , React.createElement('div', { style: { textAlign: "center", padding: "20px 0 24px" },}
        , React.createElement('div', { style: { fontSize: 56, marginBottom: 10 },}, group.icon)
        , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, letterSpacing: 2, color: "var(--text)", marginBottom: 6 },}, group.name)
        , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)", lineHeight: 1.55, maxWidth: 300, margin: "0 auto" },}, group.shortDesc)
      )
      , React.createElement('div', { style: { display: "flex", flexDirection: "column", gap: 10 },}
        , group.levels.map((level, i) => (
          React.createElement('button', { key: level.id, onClick: () => onSelectLevel(level.id),
            style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "16px 18px", textAlign: "left", cursor: "pointer", WebkitTapHighlightColor: "transparent", transition: "all .15s", width: "100%" },}
            , React.createElement('div', { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },}
              , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 1.5, color: "var(--text)" },}, level.label)
              , React.createElement('span', { style: { fontSize: 11, fontWeight: 700, color: diffColor(level.difficulty), background: `${diffColor(level.difficulty)}18`, padding: "2px 8px", borderRadius: 8 },}, level.difficulty)
            )
            , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)" },}, level.sublabel)
          )
        ))
      )
    )
  );
}

function LibraryInline({ onViewGame, onViewGroup }) {
  var [cat, setCat] = useState("All");
  var [diff, setDiff] = useState("All");

  // Category colours
  var CAT_COLORS = {
    Accuracy:    { color: "#6f93b5", bg: "rgba(111,147,181,.12)", border: "rgba(111,147,181,.25)" },
    Finishing:   { color: "#e8763f", bg: "rgba(232,118,63,.10)",  border: "rgba(232,118,63,.22)"  },
    Scoring:     { color: "#f0ad4e", bg: "rgba(240,173,78,.12)",  border: "rgba(240,173,78,.25)"  },
    "Match Play":{ color: "#c2483f", bg: "rgba(194,72,63,.12)",   border: "rgba(194,72,63,.25)"   },
  };
  var catStyle = (category) => CAT_COLORS[category] || { color: "var(--muted)", bg: "var(--surface2)", border: "var(--border)" };

  // Flat games (not part of a group)
  var flatGames = GAMES.filter(g =>
    !GROUPED_GAME_IDS.has(g.id) &&
    (cat === "All" || g.category === cat) &&
    (diff === "All" || g.difficulty === diff)
  );

  // Groups that match the current filter
  var visibleGroups = GAME_GROUPS.filter(group => {
    var catMatch = cat === "All" || group.category === cat;
    var diffMatch = diff === "All" || group.levels.some(l => l.difficulty === diff);
    return catMatch && diffMatch;
  });

  var totalVisible = flatGames.length + visibleGroups.length;

  return (
    React.createElement('div', null
      /* Category filter pills with colour dots */
      , React.createElement('div', { className: "filter-row", style: { marginBottom: 8 },}
        , React.createElement('button', { className: `filter-btn ${cat==="All"?"active":""}`, onClick: () => setCat("All"),}, "All (" , GAMES.filter(g=>!GROUPED_GAME_IDS.has(g.id)).length + GAME_GROUPS.length, ")")
        , Object.entries(CAT_COLORS).map(([c, s]) => (
          React.createElement('button', { key: c, className: `filter-btn ${cat===c?"active":""}`,
            onClick: () => setCat(c),
            style: cat===c ? { background: s.color, borderColor: s.color, color: "var(--on-accent)" } : { borderColor: s.border, color: s.color },}
            , c
          )
        ))
      )
      , React.createElement('div', { className: "filter-row", style: { marginBottom: 16 },}
        , DIFFICULTIES.map(d => React.createElement('button', { key: d, className: `filter-btn ${diff===d?"active":""}`, onClick: () => setDiff(d),}, d))
      )

      , totalVisible === 0 && (
        React.createElement('div', { className: "empty-state",}, React.createElement('div', { className: "empty-rings",}, React.createElement('div', { className: "empty-icon-anim", style: {fontSize:52},}, React.createElement(Ms, { icon: "search", size: 52,} ))), React.createElement('div', { className: "empty-title",}, "No games found"  ), React.createElement('div', { className: "empty-body",}, "Try a different filter."   ))
      )

      /* Grouped games */
      , visibleGroups.map(group => {
        var cs = catStyle(group.category);
        return (
          React.createElement('div', { key: group.id, onClick: () => onViewGroup(group),
            style: { background:"var(--glass-bg)", border:`1px solid var(--glass-border)`, borderLeft:`3px solid ${cs.color}`, borderRadius:"var(--radius)", padding:16, marginBottom:10, cursor:"pointer", boxShadow:"var(--shadow-card)", WebkitTapHighlightColor:"transparent", backdropFilter:"blur(12px)", transition:"transform .15s,box-shadow .15s" },
            onTouchStart: e => e.currentTarget.style.transform="scale(.98)",
            onTouchEnd: e => e.currentTarget.style.transform="scale(1)",}
            , React.createElement('div', { style: { display:"flex", alignItems:"center", gap:12 },}
              , React.createElement('div', { style: { width:44, height:44, borderRadius:12, background:`${cs.color}15`, border:`1px solid ${cs.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 },}, group.icon)
              , React.createElement('div', { style: { flex:1, minWidth:0 },}
                , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:15, fontWeight:700, color:"var(--text)", letterSpacing:"-0.01em" },}, group.name)
                , React.createElement('div', { style: { display:"flex", gap:5, marginTop:4, flexWrap:"wrap" },}
                  , React.createElement('span', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", padding:"2px 8px", borderRadius:100, background:cs.bg, color:cs.color, border:`1px solid ${cs.border}` },}, group.category)
                  , React.createElement('span', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", padding:"2px 8px", borderRadius:100, background:"var(--surface2)", color:"var(--muted)", border:"1px solid var(--border)" },}, group.levels.length, " Levels" )
                )
              )
              , React.createElement('div', { style: { color:"var(--muted)", fontSize:16, flexShrink:0 },}, "›")
            )
            , React.createElement('div', { style: { fontSize:13, color:"var(--text2)", marginTop:10, lineHeight:1.5 },}, group.shortDesc)
            , React.createElement('div', { style: { display:"flex", gap:4, marginTop:8, flexWrap:"wrap" },}
              , group.levels.map(l => (
                React.createElement('span', { key: l.id, style: { fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:500, letterSpacing:".03em", color:"var(--muted)", background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:6, padding:"2px 8px" },}
                  , l.label.split("—")[0].trim()
                )
              ))
            )
          )
        );
      })

      /* Flat single games */
      , flatGames.map(g => {
        var cs = catStyle(g.category);
        var diffColor = g.difficulty==="Advanced" ? "var(--accent2)" : g.difficulty==="Beginner" ? "#64c8ff" : "var(--muted)";
        var diffBg = g.difficulty==="Advanced" ? "rgba(194,72,63,.1)" : g.difficulty==="Beginner" ? "rgba(100,200,255,.08)" : "var(--surface2)";
        return (
          React.createElement('div', { key: g.id, onClick: () => onViewGame(g),
            style: { background:"var(--glass-bg)", border:`1px solid var(--glass-border)`, borderLeft:`3px solid ${cs.color}`, borderRadius:"var(--radius)", padding:16, marginBottom:10, cursor:"pointer", boxShadow:"var(--shadow-card)", WebkitTapHighlightColor:"transparent", backdropFilter:"blur(12px)", transition:"transform .15s" },
            onTouchStart: e => e.currentTarget.style.transform="scale(.98)",
            onTouchEnd: e => e.currentTarget.style.transform="scale(1)",}
            , React.createElement('div', { style: { display:"flex", alignItems:"center", gap:12 },}
              , React.createElement('div', { style: { width:44, height:44, borderRadius:12, background:`${cs.color}15`, border:`1px solid ${cs.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 },}, g.icon)
              , React.createElement('div', { style: { flex:1, minWidth:0 },}
                , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:15, fontWeight:700, color:"var(--text)", letterSpacing:"-0.01em" },}, g.name)
                , React.createElement('div', { style: { display:"flex", gap:5, marginTop:4, flexWrap:"wrap" },}
                  , React.createElement('span', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", padding:"2px 8px", borderRadius:100, background:cs.bg, color:cs.color, border:`1px solid ${cs.border}` },}, g.category)
                  , React.createElement('span', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", padding:"2px 8px", borderRadius:100, background:diffBg, color:diffColor, border:`1px solid ${diffColor}30` },}, g.difficulty)
                  , React.createElement('span', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:500, letterSpacing:".03em", padding:"2px 8px", borderRadius:100, background:"var(--surface2)", color:"var(--muted)", border:"1px solid var(--border)" },}, g.duration)
                )
              )
              , React.createElement('div', { style: { color:"var(--muted)", fontSize:16, flexShrink:0 },}, "›")
            )
            , React.createElement('div', { style: { fontSize:13, color:"var(--text2)", marginTop:10, lineHeight:1.5 },}, g.shortDesc)
          )
        );
      })
    )
  );
}

function ProgrammesInline({ programmes, onEdit, onDelete, onStart, onNew }) {
  return (
    React.createElement('div', null
      , PROGRAMME_TIPS.map((t, i) => (
        React.createElement('div', { key: i, className: "tip-block",}, React.createElement('span', { className: "tip-icon",}, t.icon), React.createElement('div', { className: "tip-text",}, React.createElement('strong', null, t.title), t.body))
      ))
      , programmes.length === 0 ? (
        React.createElement('div', { className: "empty-state",}, React.createElement('div', { className: "empty-icon",}, React.createElement(Ms, { icon: "calendar_today", size: 52,} )), React.createElement('div', { className: "empty-title",}, "No programmes yet"  ), React.createElement('div', { className: "empty-body",}, "Tap + to create your first training programme."       ))
      ) : (
        React.createElement(React.Fragment, null
          , React.createElement('div', { className: "section-label", style: { marginTop: 8 },}, programmes.length, " Programme" , programmes.length !== 1 ? "s" : "")
          , programmes.map(p => {
            var mins = p.games.reduce((a, id) => { var g = GAMES.find(g => g.id === id); return a + (g ? parseInt(g.duration) : 0); }, 0);
            return (
              React.createElement('div', { key: p.id, className: "prog-card",}
                , React.createElement('div', { className: "prog-name",}, p.name)
                , React.createElement('div', { className: "prog-meta",}, p.games.length, " games · ~"   , mins, " min" )
                , p.description && React.createElement('div', { className: "prog-meta", style: { fontStyle: "italic", marginTop: 2 },}, p.description)
                , React.createElement('div', { className: "chip-row",}, p.games.map(id => { var g = GAMES.find(g => g.id === id); return g ? React.createElement('div', { key: id, className: "chip",}, g.icon, " " , g.name) : null; }))
                , React.createElement('div', { className: "prog-actions",}
                  , React.createElement('button', { className: "btn btn-primary btn-sm"  , style: { flex: 1 }, onClick: () => onStart(p),}, "▶ Start" )
                  , React.createElement('button', { className: "btn btn-secondary btn-sm"  , onClick: () => onEdit(p),}, "Edit")
                  , React.createElement('button', { className: "btn btn-danger btn-sm"  , onClick: () => onDelete(p.id),}, "✕")
                )
              )
            );
          })
        )
      )
      , React.createElement('button', { className: "fab", onClick: onNew,}, "+")
    )
  );
}

// ─── SUPABASE DATA LAYER ─────────────────────────────────────────────────────

async function migrateLocalData(userId) {
  var localHistory      = loadHistory();
  var localBotGames     = loadBotGames();
  var localProgrammes   = loadProgrammes();
  var localAchievements = loadAchievements();
  var migrations = [];
  if (localHistory.length > 0) {
    var rows = localHistory.map(s => ({ id: s.id, user_id: userId, programme_id: s.programmeId || null, programme_name: s.programmeName || "", games: s.games, date: s.date }));
    migrations.push(supabase.from("sessions").upsert(rows, { onConflict: "id" }));
  }
  if (localBotGames.length > 0) {
    var rows = localBotGames.map(g => ({ id: g.id || `bot-${Date.now()}-${Math.random()}`, user_id: userId, data: g, date: g.date || new Date().toISOString() }));
    migrations.push(supabase.from("bot_games").upsert(rows, { onConflict: "id" }));
  }
  if (localProgrammes.length > 0) {
    var rows = localProgrammes.map(p => ({ id: p.id, user_id: userId, data: p }));
    migrations.push(supabase.from("programmes").upsert(rows, { onConflict: "id" }));
  }
  if (Object.keys(localAchievements).length > 0) {
    migrations.push(supabase.from("achievements").upsert({ user_id: userId, unlocked: localAchievements }, { onConflict: "user_id" }));
  }
  await Promise.all(migrations);
}

async function loadCloudData(userId) {
  var [sessionsRes, botRes, progsRes, achRes] = await Promise.all([
    supabase.from("sessions").select("*").eq("user_id", userId).order("date", { ascending: true }),
    supabase.from("bot_games").select("*").eq("user_id", userId).order("date", { ascending: true }),
    supabase.from("programmes").select("*").eq("user_id", userId),
    supabase.from("achievements").select("*").eq("user_id", userId).single(),
  ]);
  return {
    history:      (sessionsRes.data || []).map(r => ({ id: r.id, programmeId: r.programme_id, programmeName: r.programme_name, games: r.games, date: r.date })),
    botGames:     (botRes.data || []).map(r => r.data),
    programmes:   (progsRes.data || []).map(r => r.data),
    achievements: _optionalChain([achRes, 'access', _112 => _112.data, 'optionalAccess', _113 => _113.unlocked]) || {},
  };
}

async function syncSession(userId, session) {
  await supabase.from("sessions").upsert({ id: session.id, user_id: userId, programme_id: session.programmeId || null, programme_name: session.programmeName || "", games: session.games, date: session.date }, { onConflict: "id" });
}
async function syncBotGame(userId, game) {
  await supabase.from("bot_games").upsert({ id: game.id, user_id: userId, data: game, date: game.date }, { onConflict: "id" });
}
async function syncProgrammes(userId, programmes) {
  var rows = programmes.map(p => ({ id: p.id, user_id: userId, data: p }));
  if (rows.length > 0) await supabase.from("programmes").upsert(rows, { onConflict: "id" });
}
async function syncAchievements(userId, unlocked) {
  await supabase.from("achievements").upsert({ user_id: userId, unlocked, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
}

// ─── USER DATA SYNC (daily challenge, streak, missions, profile) ──────────────
// Stored as a single JSON blob in the profiles table to avoid extra tables.

async function syncUserData(userId, data) {
  try {
    await supabase.from("profiles").upsert(
      { user_id: userId, data: data, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
  } catch (e) { console.error("syncUserData failed", e); }
}

async function loadUserData(userId) {
  try {
    var { data } = await supabase.from("profiles").select("data").eq("user_id", userId).single();
    return _optionalChain([data, 'optionalAccess', _114 => _114.data]) || null;
  } catch (e6) { return null; }
}

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────

var LEADERBOARD_GAMES = [
  { id: "darts-iq",          label: "Darts IQ",         icon: "🧠", desc: "Overall IQ score",         scoreType: "higher" },
  { id: "bobs-27",           label: "Bob's 27",          icon: "🎲", desc: "Best score",               scoreType: "higher" },
  { id: "high-score",        label: "High Score",        icon: "💥", desc: "Best 9-dart score",        scoreType: "higher" },
  { id: "doubles",           label: "Doubles %",         icon: "🎯", desc: "Best hit rate %",          scoreType: "higher" },
  { id: "catch-40",          label: "Catch 40",          icon: "🎣", desc: "Best points (max 120)",    scoreType: "higher" },
  { id: "jdc-challenge",     label: "JDC Challenge",     icon: "🏆", desc: "Best total score",         scoreType: "higher" },
  { id: "priestleys-triples",label: "Priestley's Triples",icon:"3️⃣", desc: "Best points (max 99)",    scoreType: "higher" },
  { id: "checkout-pyramid",  label: "Pyramid",           icon: "🔺", desc: "Most checkouts hit (max 9)",scoreType: "higher" },
];

async function upsertLeaderboardScore(userId, username, gameId, score, weekKey) {
  await supabase.from("leaderboard_scores").upsert(
    { user_id: userId, username: username || "Player", game_id: gameId, score, week_key: weekKey },
    { onConflict: "user_id,game_id,week_key", ignoreDuplicates: false }
  );
}

async function fetchLeaderboard(gameId, weekKey, allTime = false) {
  var query = supabase.from("leaderboard_scores").select("user_id, username, score, created_at").eq("game_id", gameId).order("score", { ascending: false }).limit(50);
  if (!allTime) query = query.eq("week_key", weekKey);
  var { data, error } = await query;
  if (error) { console.error("Leaderboard fetch error:", error); return []; }
  return data || [];
}

// ─── AUTH SCREEN ─────────────────────────────────────────────────────────────

function AuthScreen({ onAuth, onGuest }) {
  var [mode, setMode]               = useState("welcome");
  var [email, setEmail]             = useState("");
  var [password, setPassword]       = useState("");
  var [showPassword, setShowPassword] = useState(false);
  var [loading, setLoading]         = useState(false);
  var [error, setError]             = useState(null);
  var [success, setSuccess]         = useState(null);

  var handleSignUp = async () => {
    if (!email.trim() || password.length < 6) { setError("Enter a valid email and password (min 6 chars)."); return; }
    setLoading(true); setError(null);
    var { data, error: err } = await supabase.auth.signUp({ email: email.trim(), password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    if (data.user) onAuth(data.user, data.session, true);
    else setError("Sign up failed — please try again.");
  };

  var handleSignIn = async () => {
    if (!email.trim() || !password) { setError("Please enter your email and password."); return; }
    setLoading(true); setError(null);
    var { data, error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    onAuth(data.user, data.session, false);
  };

  var handleForgotPassword = async () => {
    if (!email.trim()) { setError("Enter your email address first, then tap Forgot Password."); return; }
    setLoading(true); setError(null);
    var { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setError(null);
    setSuccess("Password reset email sent! Check your inbox.");
  };

  var inputStyle = {
    width: "100%", background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
    borderRadius: "var(--radius-sm)", padding: "14px 16px", color: "var(--text)",
    fontSize: 15, fontFamily: "'Hanken Grotesk',sans-serif", outline: "none",
    marginBottom: 12, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
    transition: "border-color .2s",
  };

  // ── Welcome screen ──────────────────────────────────────────────────────────
  if (mode === "welcome") return (
    React.createElement('div', { style: { position:"fixed", inset:0, background:"var(--bg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-between", padding:"0 28px 48px", overflow:"hidden" },}
      , React.createElement('style', null, `
        @keyframes auth-in { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes auth-board { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
        .auth-input:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px rgba(232,118,63,.08); }
      `)

      /* Glow blob */
      , React.createElement('div', { style: { position:"absolute", top:-80, left:"50%", transform:"translateX(-50%)", width:400, height:400, background:"radial-gradient(ellipse at center, rgba(232,118,63,.1) 0%, transparent 65%)", borderRadius:"50%", pointerEvents:"none", filter:"blur(24px)" },} )

      /* Top — logo */
      , React.createElement('div', { style: { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", animation:"auth-in .5s ease both" },}
        /* Real dartboard photo */
        , React.createElement('div', { style: { marginBottom:24, animation:"auth-board .6s .1s ease both", opacity:0, animationFillMode:"forwards" },}
          , React.createElement('div', { style: { width:160, height:160, borderRadius:"50%", overflow:"hidden", margin:"0 auto", border:"2px solid rgba(232,118,63,.25)", boxShadow:"0 0 40px rgba(232,118,63,.2)" },}
            , React.createElement('img', { src: IMG_BOARD_AUTH, alt: "Dartboard", style: { width:"100%", height:"100%", objectFit:"cover", objectPosition:"center" },} )
          )
        )

        /* Logo */
        , React.createElement('div', { style: { display:"flex", alignItems:"baseline", gap:6, marginBottom:8 },}
          , React.createElement('span', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:48, fontWeight:800, letterSpacing:"-0.03em", color:"var(--accent)", lineHeight:1 },}, "DARTS")
          , React.createElement('span', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:48, fontWeight:800, letterSpacing:"-0.03em", color:"var(--text)", lineHeight:1 },}, "IQ")
        )
        , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:500, letterSpacing:".08em", textTransform:"uppercase", color:"var(--muted)" },}, "Track · Improve · Excel"    )

        /* Feature pills */
        , React.createElement('div', { style: { display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginTop:20 },}
          , ["20+ Training Games","Darts IQ Score","AI Coaching","Bot & Friend Play"].map(f => (
            React.createElement('span', { key: f, style: { fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", padding:"4px 10px", borderRadius:100, background:"var(--glass-bg)", border:"1px solid var(--glass-border)", color:"var(--muted)" },}, f)
          ))
        )
      )

      /* Bottom — buttons */
      , React.createElement('div', { style: { width:"100%", maxWidth:360, animation:"auth-in .5s .2s ease both", opacity:0, animationFillMode:"forwards" },}
        , React.createElement('button', { onClick: () => setMode("signup"), className: "btn btn-primary btn-full"  , style: { marginBottom:10, fontSize:16, padding:"16px", fontWeight:700, letterSpacing:"-0.01em" },}
          , React.createElement(Ms, { icon: "person_add", size: 20,} ), " Create Account"
        )
        , React.createElement('button', { onClick: () => setMode("signin"), className: "btn btn-secondary btn-full"  , style: { marginBottom:16, fontSize:16, padding:"16px", fontWeight:600 },}
          , React.createElement(Ms, { icon: "login", size: 20,} ), " Sign In"
        )
        , React.createElement('div', { style: { position:"relative", textAlign:"center" },}
          , React.createElement('div', { style: { height:1, background:"var(--border)", position:"absolute", top:"50%", left:0, right:0 },} )
          , React.createElement('span', { style: { position:"relative", background:"var(--bg)", padding:"0 12px", fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", color:"var(--muted)" },}, "or")
        )
        , React.createElement('button', { onClick: onGuest, style: { width:"100%", background:"none", border:"1px solid var(--border)", borderRadius:"var(--radius-sm)", color:"var(--muted)", fontSize:14, fontFamily:"'Hanken Grotesk',sans-serif", fontWeight:600, cursor:"pointer", padding:"13px", marginTop:16, WebkitTapHighlightColor:"transparent", transition:"border-color .2s" },}, "Continue as Guest"

        )
        , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:500, letterSpacing:".04em", color:"rgba(255,255,255,.18)", textAlign:"center", marginTop:10, lineHeight:1.7 },}, "Guest progress saved on this device only"

        )
      )
    )
  );

  // ── Sign in / Sign up form ──────────────────────────────────────────────────
  return (
    React.createElement('div', { style: { position:"fixed", inset:0, background:"var(--bg)", display:"flex", flexDirection:"column", overflowY:"auto" },}
      /* Glow blob */
      , React.createElement('div', { style: { position:"fixed", top:-100, left:"50%", transform:"translateX(-50%)", width:360, height:360, background:"radial-gradient(ellipse at center, rgba(232,118,63,.08) 0%, transparent 65%)", borderRadius:"50%", pointerEvents:"none", filter:"blur(20px)", zIndex:0 },} )

      , React.createElement('div', { style: { maxWidth:400, width:"100%", margin:"auto", padding:"24px 24px 48px", position:"relative", zIndex:1 },}

        /* Back */
        , React.createElement('button', { onClick: () => { setMode("welcome"); setError(null); setSuccess(null); },
          style: { background:"none", border:"none", color:"var(--muted)", fontSize:14, fontFamily:"'Hanken Grotesk',sans-serif", fontWeight:600, cursor:"pointer", padding:"16px 0 28px", display:"flex", alignItems:"center", gap:6, WebkitTapHighlightColor:"transparent" },}
          , React.createElement(Ms, { icon: "arrow_back", size: 18,} ), " Back"
        )

        /* Heading */
        , React.createElement('div', { style: { marginBottom:28 },}
          , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:30, fontWeight:800, letterSpacing:"-0.02em", color:"var(--text)", marginBottom:6, lineHeight:1.1 },}
            , mode === "signup" ? "Create Account" : "Welcome Back"
          )
          , React.createElement('div', { style: { fontSize:14, color:"var(--muted)", fontFamily:"'Hanken Grotesk',sans-serif" },}
            , mode === "signup" ? "Your progress syncs across all devices." : "Sign in to access your progress and stats."
          )
        )

        /* Email field */
        , React.createElement('div', { style: { marginBottom:4 },}
          , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", color:"var(--muted)", marginBottom:6 },}, "Email")
          , React.createElement('input', { className: "auth-input", style: inputStyle, type: "email", placeholder: "you@example.com",
            value: email, onChange: e => { setEmail(e.target.value); setError(null); },} )
        )

        /* Password field */
        , React.createElement('div', { style: { marginBottom:4 },}
          , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", color:"var(--muted)", marginBottom:6 },}, "Password")
          , React.createElement('div', { style: { position:"relative" },}
            , React.createElement('input', { className: "auth-input", style: { ...inputStyle, paddingRight:50, marginBottom:0 },
              type: showPassword ? "text" : "password", placeholder: mode === "signup" ? "Min 6 characters" : "Your password",
              value: password, onChange: e => { setPassword(e.target.value); setError(null); },
              onKeyDown: e => e.key === "Enter" && (mode === "signup" ? handleSignUp() : handleSignIn()),} )
            , React.createElement('button', { onClick: () => setShowPassword(s => !s), type: "button",
              style: { position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--muted)", padding:4, WebkitTapHighlightColor:"transparent", display:"flex", alignItems:"center" },}
              , React.createElement(Ms, { icon: showPassword ? "visibility_off" : "visibility", size: 20,} )
            )
          )
        )

        /* Error / success */
        , error && (
          React.createElement('div', { style: { display:"flex", alignItems:"flex-start", gap:10, fontSize:13, color:"var(--accent2)", marginTop:12, marginBottom:4, padding:"11px 14px", background:"rgba(194,72,63,.08)", borderRadius:"var(--radius-sm)", border:"1px solid rgba(194,72,63,.2)" },}
            , React.createElement(Ms, { icon: "error", size: 16, style: {flexShrink:0, marginTop:1},} )
            , error
          )
        )
        , success && (
          React.createElement('div', { style: { display:"flex", alignItems:"flex-start", gap:10, fontSize:13, color:"var(--accent)", marginTop:12, marginBottom:4, padding:"11px 14px", background:"rgba(232,118,63,.06)", borderRadius:"var(--radius-sm)", border:"1px solid rgba(232,118,63,.2)" },}
            , React.createElement(Ms, { icon: "check_circle", size: 16, fill: true, style: {flexShrink:0, marginTop:1},} )
            , success
          )
        )

        /* Submit */
        , React.createElement('button', { onClick: mode === "signup" ? handleSignUp : handleSignIn, disabled: loading,
          className: "btn btn-primary btn-full"  ,
          style: { fontSize:16, padding:"16px", marginTop:20, marginBottom:12, fontWeight:700, letterSpacing:"-0.01em", opacity:loading ? 0.7 : 1 },}
          , loading
            ? React.createElement(React.Fragment, null, React.createElement(Ms, { icon: "hourglass_empty", size: 18,} ), " Please wait…"  )
            : mode === "signup"
              ? React.createElement(React.Fragment, null, React.createElement(Ms, { icon: "person_add", size: 18,} ), " Create Account"  )
              : React.createElement(React.Fragment, null, React.createElement(Ms, { icon: "login", size: 18,} ), " Sign In"  )
          
        )

        /* Forgot password */
        , mode === "signin" && (
          React.createElement('div', { style: { textAlign:"center", marginBottom:16 },}
            , React.createElement('button', { onClick: handleForgotPassword, disabled: loading,
              style: { background:"none", border:"none", color:"var(--muted)", cursor:"pointer", fontFamily:"'Hanken Grotesk',sans-serif", fontSize:13, fontWeight:600, textDecoration:"underline", WebkitTapHighlightColor:"transparent" },}, "Forgot your password?"

            )
          )
        )

        /* Switch mode */
        , React.createElement('div', { style: { textAlign:"center", fontSize:13, color:"var(--muted)", fontFamily:"'Hanken Grotesk',sans-serif" },}
          , mode === "signup" ? "Already have an account? " : "Don't have an account? "
          , React.createElement('button', { onClick: () => { setMode(mode === "signup" ? "signin" : "signup"); setError(null); setSuccess(null); },
            style: { background:"none", border:"none", color:"var(--accent)", cursor:"pointer", fontFamily:"'Hanken Grotesk',sans-serif", fontSize:13, fontWeight:700, WebkitTapHighlightColor:"transparent" },}
            , mode === "signup" ? "Sign In" : "Create one"
          )
        )
      )
    )
  );
}

// ─── ERROR BOUNDARY ──────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("Darts IQ crashed:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return React.createElement("div", {
        style: {
          position: "fixed", inset: 0, background: "var(--on-accent)",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: 32, textAlign: "center",
          fontFamily: "'DM Sans', sans-serif",
        }
      },
        React.createElement(DartboardSVG, { size: 100 }),
        React.createElement("div", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 2, color: "#e8763f", marginBottom: 8 } }, "Something went wrong"),
        React.createElement("div", { style: { fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 32, lineHeight: 1.6 } }, "Don't worry — your progress is saved. Tap below to restart."),
        React.createElement("button", {
          onClick: () => { this.setState({ hasError: false, error: null }); window.location.reload(); },
          style: {
            background: "#e8763f", color: "var(--on-accent)", border: "none",
            borderRadius: 14, padding: "14px 32px", fontSize: 15,
            fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer", letterSpacing: .1,
          }
        }, "↺ Restart App"),
        this.state.error && React.createElement("div", {
          style: { marginTop: 24, fontSize: 10, color: "rgba(255,255,255,0.2)", maxWidth: 320, wordBreak: "break-all" }
        }, this.state.error.message)
      );
    }
    return this.props.children;
  }
}

function App() {
  // ── Auth state ────────────────────────────────────────────────────────────
  var [authUser, setAuthUser]         = useState(null);
  var [authReady, setAuthReady]       = useState(false);
  var [cloudLoading, setCloudLoading] = useState(false);

  // ── App state ──────────────────────────────────────────────────────────────
  var [tab, setTab] = useState("train");
  var [trainView, setTrainView] = useState("home");
  var [programmes, setProgrammes]           = useState(loadProgrammes);
  var [history, setHistory]                 = useState(loadHistory);
  var [botGames, setBotGames]               = useState(loadBotGames);
  var [viewingGame, setViewingGame]         = useState(null);
  var [viewingGroup, setViewingGroup]       = useState(null); // group being level-picked
  var [editingProg, setEditingProg]         = useState(null);
  var [showModal, setShowModal]             = useState(false);
  var [activeSession, setActiveSession]     = useState(null);
  var [inPlayGame, setInPlayGame]           = useState(false); // true when mid bot/friend game
  var [showAI, setShowAI]                   = useState(false);
  var [showOnboarding, setShowOnboarding]   = useState(false); // start hidden, set after auth check
  var [showProfile, setShowProfile]         = useState(false);
  var [showCheckout, setShowCheckout]       = useState(false);
  var [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  var [showResetConfirm, setShowResetConfirm]   = useState(false);
  var [dailyChallenge, setDailyChallenge]   = useState(getTodayChallenge);
  var [unlockedAchievements, setUnlockedAchievements] = useState(loadAchievements);
  var [dartsIQ, setDartsIQ]                 = useState(loadDartsIQ);
  var [celebrationQueue, setCelebrationQueue] = useState([]);

  // ── Auth init ─────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (_optionalChain([session, 'optionalAccess', _115 => _115.user])) {
        setAuthUser(session.user);
        Promise.all([loadCloudData(session.user.id), loadUserData(session.user.id)]).then(([d, ud]) => {
          if (d.history.length > 0)    setHistory(d.history);
          if (d.botGames.length > 0)   setBotGames(d.botGames);
          if (d.programmes.length > 0) setProgrammes(d.programmes);
          if (Object.keys(d.achievements).length > 0) setUnlockedAchievements(d.achievements);
          if (ud) {
            if (ud.dailyChallenge)  { saveDailyChallenge(ud.dailyChallenge); setDailyChallenge(ud.dailyChallenge); }
            if (ud.challengeStreak) saveChallengeStreak(ud.challengeStreak);
            if (ud.weeklyMissions)  saveWeeklyMissions(ud.weeklyMissions);
            if (ud.profile)         saveProfile(ud.profile);
          }
          // Returning logged-in user — skip onboarding, go straight to app
          saveOnboarded();
          setShowOnboarding(false);
          setAuthReady(true);
        });
      } else {
      // No logged-in user — show onboarding only if never completed
      if (!loadOnboarded()) setShowOnboarding(true);
      setAuthReady(true);
    }
    });
    var { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setAuthUser(null);
        setHistory(loadHistory()); setBotGames(loadBotGames());
        setProgrammes(loadProgrammes()); setUnlockedAchievements(loadAchievements());
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  var handleAuth = async (user, session, isNewUser) => {
    setCloudLoading(true); setAuthUser(user);
    if (isNewUser) { await migrateLocalData(user.id); }
    else {
      var [d, ud] = await Promise.all([loadCloudData(user.id), loadUserData(user.id)]);
      if (d.history.length > 0)    setHistory(d.history);
      if (d.botGames.length > 0)   setBotGames(d.botGames);
      if (d.programmes.length > 0) setProgrammes(d.programmes);
      if (Object.keys(d.achievements).length > 0) setUnlockedAchievements(d.achievements);
      // Restore daily challenge, streak, missions, profile from cloud
      if (ud) {
        if (ud.dailyChallenge)   { saveDailyChallenge(ud.dailyChallenge);   setDailyChallenge(ud.dailyChallenge); }
        if (ud.challengeStreak)  saveChallengeStreak(ud.challengeStreak);
        if (ud.weeklyMissions)   saveWeeklyMissions(ud.weeklyMissions);
        if (ud.profile)          saveProfile(ud.profile);
      }
      // Existing user logging in — always skip onboarding
      saveOnboarded();
      setShowOnboarding(false);
    }
    setCloudLoading(false);
  };

  var handleSignOut = async () => { await supabase.auth.signOut(); setAuthUser(null); };

  // ── Persistence (localStorage always — offline cache) ────────────────────
  useEffect(() => { saveProgrammes(programmes); }, [programmes]);
  useEffect(() => { saveHistory(history); }, [history]);
  useEffect(() => { saveBotGames(botGames); }, [botGames]);
  useEffect(() => { saveAchievements(unlockedAchievements); }, [unlockedAchievements]);
  useEffect(() => { saveDartsIQ(dartsIQ); }, [dartsIQ]);

  // ── Cloud sync ────────────────────────────────────────────────────────────
  useEffect(() => { if (authUser) syncProgrammes(authUser.id, programmes).catch(console.error); }, [programmes, authUser]);
  useEffect(() => { if (authUser) syncAchievements(authUser.id, unlockedAchievements).catch(console.error); }, [unlockedAchievements, authUser]);
  // Sync daily challenge, streak, missions and profile as a single blob
  useEffect(() => {
    if (!authUser || authUser === false) return;
    var userData = {
      dailyChallenge:  loadDailyChallenge(),
      challengeStreak: loadChallengeStreak(),
      weeklyMissions:  loadWeeklyMissions(),
      profile:         loadProfile(),
    };
    syncUserData(authUser.id, userData).catch(console.error);
  }, [dailyChallenge, authUser]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  var handleSaveProg = (p) => {
    setProgrammes(prev => prev.find(x => x.id === p.id) ? prev.map(x => x.id === p.id ? p : x) : [...prev, p]);
    setShowModal(false); setEditingProg(null);
  };

  var goToGame = (game) => { setViewingGame(game); setTrainView("game-detail"); };
  var goToLibrary = () => { setViewingGame(null); setTrainView("library"); };
  var goToHome = () => { setViewingGame(null); setTrainView("home"); };
  var goToProgs = () => { setViewingGame(null); setTrainView("programmes"); };

  // ── Achievement + IQ processor ─────────────────────────────────────────────
  // Call this after any event that could trigger achievements.
  // updatedHistory / updatedBotGames should be the NEW arrays (post-update).
  var processAchievements = (updatedHistory, updatedBotGames, extraState = {}) => {
    var baseState  = deriveAchievementState(updatedHistory, updatedBotGames);
    var fullState  = { ...baseState, ...extraState };
    var newIDs     = checkAchievements(fullState, unlockedAchievements);
    if (newIDs.length > 0) {
      var now      = Date.now();
      var nextUnlocked = { ...unlockedAchievements };
      newIDs.forEach(id => { nextUnlocked[id] = now; });
      setUnlockedAchievements(nextUnlocked);
      // Queue celebrations — Step 3 will consume this queue
      var toShow = newIDs.map(id => ACHIEVEMENTS.find(a => a.id === id)).filter(Boolean);
      setCelebrationQueue(q => [...q, ...toShow]);
    }
    // Always recalculate IQ
    var newIQ = calcDartsIQ({
      ...deriveAchievementState(updatedHistory, updatedBotGames),
      achievementsUnlocked: Object.keys(unlockedAchievements).length + newIDs.length,
      totalAchievements: ACHIEVEMENTS.length,
    });
    setDartsIQ({ total: newIQ.total, pillars: newIQ.pillars });
  };

  // ── Full-screen overlays ────────────────────────────────────────────────────

  // Auth loading
  if (!authReady) return (
    React.createElement(React.Fragment, null, React.createElement('style', null, css)
    , React.createElement('div', { style: { position:"fixed", inset:0, background:"var(--bg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, fontFamily:"'DM Sans',sans-serif" },}
      , React.createElement('svg', { viewBox: "0 0 200 110"   , style: { width:100, height:55 },}
        , React.createElement('polyline', { points: "10,85 40,70 55,78 75,45 90,55 115,25 130,35"      , fill: "none", stroke: "#e8763f", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round",})
        , React.createElement('rect', { x: "123", y: "18", width: "22", height: "7", rx: "3", fill: "#e8763f",})
        , React.createElement('rect', { x: "145", y: "20", width: "12", height: "3", rx: "1.5", fill: "#c8d800",})
        , React.createElement('polygon', { points: "113,22 123,20 123,25"  , fill: "#e8763f",})
        , React.createElement('polygon', { points: "157,16 167,8 163,21"  , fill: "#e8763f", opacity: "0.9",})
        , React.createElement('polygon', { points: "157,27 167,35 163,22"  , fill: "#e8763f", opacity: "0.7",})
      )
      , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:32, letterSpacing:4, color:"var(--accent)" },}, "DARTS IQ" )
      , React.createElement('div', { style: { fontSize:13, color:"var(--muted)", letterSpacing:1 },}, "Loading...")
    ))
  );

  if (cloudLoading) return (
    React.createElement(React.Fragment, null, React.createElement('style', null, css)
    , React.createElement('div', { style: { position:"fixed", inset:0, background:"var(--bg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, fontFamily:"'DM Sans',sans-serif" },}
      , React.createElement('div', { style: { fontSize:48 },}, "☁️")
      , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:26, letterSpacing:3, color:"var(--text)" },}, "Syncing your data"  )
      , React.createElement('div', { style: { fontSize:13, color:"var(--muted)" },}, "Loading your sessions, stats and achievements…"     )
    ))
  );

  if (authUser === null && authReady) return (
    React.createElement(React.Fragment, null, React.createElement('style', null, css)
    , React.createElement(AuthScreen, { onAuth: handleAuth, onGuest: () => setAuthUser(false),} ))
  );

  // Profile screen
  if (showProfile) return (
    React.createElement(React.Fragment, null, React.createElement('style', null, css)
    , React.createElement(ProfileScreen, { history: history, botGames: botGames, onClose: () => setShowProfile(false),
      onProfileSaved: (updated) => {
        if (authUser && authUser !== false) {
          syncUserData(authUser.id, {
            dailyChallenge:  loadDailyChallenge(),
            challengeStreak: loadChallengeStreak(),
            weeklyMissions:  loadWeeklyMissions(),
            profile:         updated,
          }).catch(console.error);
        }
      },
      onResetProgress: () => setShowResetConfirm(true),}
    ))
  );

  // Checkout trainer
  if (showCheckout) return (
    React.createElement(React.Fragment, null, React.createElement('style', null, css)
    , React.createElement(CheckoutTrainer, { onClose: () => setShowCheckout(false), onChallengeProgress: (score) => {
      var dc = getTodayChallenge();
      if (!dc.completed && _optionalChain([dc, 'access', _116 => _116.challenge, 'optionalAccess', _117 => _117.type, 'optionalAccess', _118 => _118.includes, 'call', _119 => _119("checkout")]) && score >= dc.challenge.target) {
        var updated = { ...dc, completed: true, progress: score };
        saveDailyChallenge(updated);
        updateChallengeStreak(true);
        setDailyChallenge(updated);
      }
    },} ))
  );

  // Onboarding — first time or redo
  if (showOnboarding) return (
    React.createElement(React.Fragment, null, React.createElement('style', null, css)
    , React.createElement('div', { className: "app",}
    , React.createElement(OnboardingFlow, {
      isRedo: loadOnboarded(),
      onClose: loadOnboarded() ? () => setShowOnboarding(false) : null,
      onComplete: (progs) => {
        setProgrammes(prev => {
          // Remove old onboarded programmes, keep user-created ones
          var kept = prev.filter(p => !p.onboarded);
          return [...kept, ...progs];
        });
        saveOnboarded();
        setShowOnboarding(false);
        setTab("train");
        setTrainView("home");
      },}
    )
    ))
  );

  if (activeSession) return (
    React.createElement(React.Fragment, null, React.createElement('style', null, css)
    , React.createElement('div', { className: "app",}
      , React.createElement(SessionOrchestrator, {
        programme: activeSession,
        onComplete: data => {
          var updatedHistory = [...history, data];
          setHistory(updatedHistory);
          updateMissionProgress(updatedHistory, botGames);
          // Derive session flags first — used by both leaderboard push and achievement checker
          var sessionGames     = data.games || [];
          var sessionCats      = new Set(sessionGames.map(g => _optionalChain([GAMES, 'access', _120 => _120.find, 'call', _121 => _121(x => x.id === g.id), 'optionalAccess', _122 => _122.category])).filter(Boolean));
          var allCatsInSession = sessionCats.size >= 5;
          var sessionPBs       = checkPBs(data, history);

          if (authUser) syncSession(authUser.id, data).catch(console.error);
          if (authUser && authUser !== false) {
            var wk    = getWeekKey();
            var uname = _optionalChain([authUser, 'access', _123 => _123.user_metadata, 'optionalAccess', _124 => _124.username]) || _optionalChain([authUser, 'access', _125 => _125.email, 'optionalAccess', _126 => _126.split, 'call', _127 => _127("@"), 'access', _128 => _128[0]]) || "Player";
            sessionGames.forEach(g => {
              var isPB = sessionPBs.find(p => p.name === g.name);
              if (!isPB) return;
              if (g.id === "bobs-27")            upsertLeaderboardScore(authUser.id, uname, "bobs-27",            g.score, wk).catch(console.error);
              if (g.id === "high-score")         upsertLeaderboardScore(authUser.id, uname, "high-score",         g.score, wk).catch(console.error);
              if (g.id === "doubles")            upsertLeaderboardScore(authUser.id, uname, "doubles",            Math.round((g.score/63)*100), wk).catch(console.error);
              if (g.id === "catch-40")           upsertLeaderboardScore(authUser.id, uname, "catch-40",           g.score, wk).catch(console.error);
              if (g.id === "jdc-challenge")      upsertLeaderboardScore(authUser.id, uname, "jdc-challenge",      g.score, wk).catch(console.error);
              if (g.id === "priestleys-triples") upsertLeaderboardScore(authUser.id, uname, "priestleys-triples", g.score, wk).catch(console.error);
              if (g.id === "checkout-pyramid")   upsertLeaderboardScore(authUser.id, uname, "checkout-pyramid",   g.score, wk).catch(console.error);
            });
            var iqScore = calcDartsIQ({ ...deriveAchievementState(updatedHistory, botGames), achievementsUnlocked: Object.keys(unlockedAchievements).length, totalAchievements: ACHIEVEMENTS.length }).total;
            upsertLeaderboardScore(authUser.id, uname, "darts-iq", iqScore, wk).catch(console.error);
          }
          var allPBsInSession = sessionGames.length > 0 && sessionPBs.length === sessionGames.length;
          // Per-game score flags
          var bobs27Score   = _optionalChain([sessionGames, 'access', _129 => _129.find, 'call', _130 => _130(g => g.id === "bobs-27"), 'optionalAccess', _131 => _131.score]);
          var doublesScore  = _optionalChain([sessionGames, 'access', _132 => _132.find, 'call', _133 => _133(g => g.id === "doubles"), 'optionalAccess', _134 => _134.score]);
          var highScore     = _optionalChain([sessionGames, 'access', _135 => _135.find, 'call', _136 => _136(g => g.id === "high-score"), 'optionalAccess', _137 => _137.score]);
          var f50Score      = _optionalChain([sessionGames, 'access', _138 => _138.find, 'call', _139 => _139(g => _optionalChain([g, 'access', _140 => _140.id, 'optionalAccess', _141 => _141.startsWith, 'call', _142 => _142("f50")])), 'optionalAccess', _143 => _143.score]);
          processAchievements(updatedHistory, botGames, {
            allCatsInSession,
            allPBsInSession,
            progNoExit: true,
            ...(bobs27Score  !== undefined && { bobs27Best:   Math.max(deriveAchievementState(updatedHistory, botGames).bobs27Best,  bobs27Score)  }),
            ...(doublesScore !== undefined && { doublesRate:  Math.max(deriveAchievementState(updatedHistory, botGames).doublesRate,  Math.round((doublesScore / 63) * 100)) }),
            ...(highScore    !== undefined && { highScoreBest:Math.max(deriveAchievementState(updatedHistory, botGames).highScoreBest, highScore)   }),
            ...(f50Score     !== undefined && { checkoutsHit: Math.max(deriveAchievementState(updatedHistory, botGames).checkoutsHit, f50Score)    }),
          });
          // Check if daily challenge was a session challenge
          var dc = getTodayChallenge();
          if (!dc.completed && (_optionalChain([dc, 'access', _144 => _144.challenge, 'optionalAccess', _145 => _145.type]) === "session" || _optionalChain([dc, 'access', _146 => _146.challenge, 'optionalAccess', _147 => _147.type]) === "session_games" || _optionalChain([dc, 'access', _148 => _148.challenge, 'optionalAccess', _149 => _149.type]) === "session_cats")) {
            var meetsTarget =
              dc.challenge.type === "session" ? true :
              dc.challenge.type === "session_games" ? sessionGames.length >= (dc.challenge.target || 2) :
              dc.challenge.type === "session_cats" ? sessionCats.size >= 5 : false;
            if (meetsTarget) {
              var dcUpdated = { ...dc, completed: true };
              saveDailyChallenge(dcUpdated);
              var streakResult = updateChallengeStreak(true);
              setDailyChallenge(dcUpdated);
              // Feed daily completions into achievement checker
              var dailyChallengesTotal = (_optionalChain([streakResult, 'optionalAccess', _150 => _150.streak]) || 1);
              var dailyStreak = _optionalChain([streakResult, 'optionalAccess', _151 => _151.streak]) || 1;
              processAchievements(updatedHistory, botGames, {
                ...extraState,
                dailyChallengesTotal,
                dailyStreak,
                dailyHardDone: dc.challenge.difficulty === "hard",
                dailyLegendaryDone: dc.challenge.difficulty === "legendary",
              });
            }
          }
        },
        onExit: () => { setActiveSession(null); },
        savedHistory: history,}
      )
    ))
  );

  // ── Nav icons ───────────────────────────────────────────────────────────────
  var TrainIcon    = () => React.createElement(Ms, { icon: "fitness_center", size: 22,} );
  var ProgressIcon = () => React.createElement(Ms, { icon: "analytics", size: 22,} );
  var PlayIcon     = () => React.createElement(Ms, { icon: "sports_esports", size: 22,} );

  // ── Train sub-nav ───────────────────────────────────────────────────────────
  var renderTrain = () => {
    if (trainView === "game-detail" && viewingGame) return (
      React.createElement(GameDetailPage, {
        game: viewingGame,
        onBack: () => {
          setViewingGame(null);
          setTrainView(viewingGroup ? "level-picker" : "library");
        },
        onAddToProgramme: g => {
          setEditingProg({ games: [g.id], name: "", description: "" });
          setShowModal(true);
          setTrainView("programmes");
          setViewingGame(null);
          setViewingGroup(null);
        },}
      )
    );

    if (trainView === "level-picker" && viewingGroup) return (
      React.createElement(LevelPickerPage, {
        group: viewingGroup,
        onBack: () => { setViewingGroup(null); setTrainView("library"); },
        onSelectLevel: gameId => {
          var game = GAMES.find(g => g.id === gameId);
          if (game) { setViewingGame(game); setTrainView("game-detail"); }
        },}
      )
    );
    return (
      React.createElement(React.Fragment, null
        /* Spacer to push scroll-area below the fixed top bar */
        , React.createElement('div', { style: { height:68, flexShrink:0 },} )
        /* ── Top App Bar — fixed, outside scroll flow ── */
        , React.createElement('div', { className: "top-bar", style: { position:"fixed", top:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, zIndex:20 },}
          , React.createElement('div', { style: { display:"flex", alignItems:"center", gap:10 },}
            , React.createElement('svg', { viewBox: "0 0 200 110"   , style: { width:40, height:22, filter:"drop-shadow(0 0 8px rgba(232,118,63,.5))" },}
              , React.createElement('polyline', { points: "10,85 40,70 55,78 75,45 90,55 115,25 130,35"      , fill: "none", stroke: "#e8763f", strokeWidth: "5", strokeLinecap: "round", strokeLinejoin: "round",})
              , React.createElement('rect', { x: "123", y: "18", width: "22", height: "7", rx: "3", fill: "#e8763f",})
              , React.createElement('polygon', { points: "113,22 123,20 123,25"  , fill: "#e8763f",})
              , React.createElement('polygon', { points: "157,16 167,8 163,21"  , fill: "#e8763f", opacity: "0.9",})
              , React.createElement('polygon', { points: "157,27 167,35 163,22"  , fill: "#e8763f", opacity: "0.7",})
            )
            , React.createElement('span', { className: "top-bar-title",}, "DARTS IQ" )
          )
          , React.createElement('div', { className: "top-bar-actions",}
            , React.createElement('button', { onClick: () => setShowProfile(true), style: { background:"var(--glass-bg)", border:"1px solid var(--glass-border)", borderRadius:10, width:38, height:38, color:"var(--text2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", WebkitTapHighlightColor:"transparent", backdropFilter:"blur(12px)" },}, React.createElement(Ms, { icon: "person", size: 20,} ))
            , React.createElement('button', { onClick: () => setShowOnboarding(true), style: { background:"var(--glass-bg)", border:"1px solid var(--glass-border)", borderRadius:10, width:38, height:38, color:"var(--text2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", WebkitTapHighlightColor:"transparent", backdropFilter:"blur(12px)" },}, React.createElement(Ms, { icon: "settings", size: 20,} ))
            , authUser && authUser !== false && (
              React.createElement('button', { onClick: () => setShowLogoutConfirm(true), style: { background:"var(--glass-bg)", border:"1px solid var(--glass-border)", borderRadius:10, width:38, height:38, color:"var(--muted)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", WebkitTapHighlightColor:"transparent", backdropFilter:"blur(12px)" },}, React.createElement(Ms, { icon: "logout", size: 18,} ))
            )
          )
        )

        /* ── Scroll area starts here ── */
        , React.createElement('div', { className: "scroll-area", style: { position:"relative" },}
        /* Background glow blobs */
        , React.createElement('div', { className: "glow-blob",} )
        , React.createElement('div', { className: "glow-blob-sm",} )

        /* ── Sub nav pills ── */
        , React.createElement('div', { style: { display:"flex", gap:4, margin:"12px 0 16px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12, padding:4 },}
          , [["home","Home"],["library","Games"],["programmes","Plans"]].map(([v, label]) => (
            React.createElement('button', { key: v, onClick: () => setTrainView(v),
              style: { flex:1, padding:"8px 4px", borderRadius:8, fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, letterSpacing:".05em", textTransform:"uppercase", border:"none", cursor:"pointer", transition:"all .15s", WebkitTapHighlightColor:"transparent",
                background: trainView === v ? "var(--accent)" : "transparent",
                color: trainView === v ? "var(--on-accent)" : "var(--muted)",
                boxShadow: trainView === v ? "0 1px 8px rgba(232,118,63,.2)" : "none",
              },}, label)
          ))
        )

        /* HOME view */
        , trainView === "home" && (() => {
          var streak = calcStreak(history);
          var stats = deriveStats(history, botGames);
          var recentSession = history.length > 0 ? history[history.length - 1] : null;
          var feedback = recentSession ? getSessionFeedback(recentSession, history) : null;
          var pbs = recentSession ? checkPBs(recentSession, history) : [];
          var totalGames = history.reduce((a,s) => a+(_optionalChain([s, 'access', _152 => _152.games, 'optionalAccess', _153 => _153.length])||0), 0);
          var botWins = botGames.filter(g=>g.winner==="player").length;

          return React.createElement(React.Fragment, null
            /* Guest warning banner */
            , authUser === false && (
              React.createElement('div', { onClick: () => setTab("profile"), style: { background: "rgba(255,165,0,.1)", border: "1px solid rgba(255,165,0,.35)", borderRadius: 14, padding: "10px 14px", marginBottom: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, WebkitTapHighlightColor: "transparent" },}
                , React.createElement('div', { style: { fontSize: 22 },}, "⚠️")
                , React.createElement('div', { style: { flex: 1 },}
                  , React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: "#ffb347" },}, "Guest mode — progress not backed up"      )
                  , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginTop: 2 },}, "Tap to create a free account and save everything permanently."         )
                )
                , React.createElement('div', { style: { fontSize: 13, color: "#ffb347" },}, "→")
              )
            )
            /* Streak banner */
            , streak >= 2 && (
              React.createElement('div', { style: { background:"linear-gradient(135deg,rgba(232,118,63,.1),rgba(232,118,63,.05))", border:"1px solid rgba(232,118,63,.25)", borderRadius:"var(--radius)", padding:"12px 16px", marginBottom:12, display:"flex", alignItems:"center", gap:12 },}
                , React.createElement('div', null, React.createElement(Ms, { icon: "local_fire_department", size: 28, fill: true, style: {color:"#ff6b35"},} ))
                , React.createElement('div', null
                  , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontWeight:800, color:"var(--accent)", fontSize:15, letterSpacing:"-0.01em" },}, streak, " day streak!"  )
                  , React.createElement('div', { style: { fontSize:12, color:"var(--muted)", marginTop:2 },}, "Keep it going — consistency is everything."      )
                )
              )
            )

            /* PB callout from last session */
            , pbs.length > 0 && (
              React.createElement('div', { style: { background: "linear-gradient(135deg,rgba(232,118,63,.15),rgba(168,255,120,.08))", border: "1px solid rgba(232,118,63,.4)", borderRadius: "var(--radius)", padding: "12px 16px", marginBottom: 14 },}
                , React.createElement('div', { style: { fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 },}, "🏆 New Personal Best"   , pbs.length > 1 ? "s" : "", "!")
                , pbs.map((pb, i) => (
                  React.createElement('div', { key: i, style: { display: "flex", alignItems: "center", gap: 10, marginBottom: i < pbs.length - 1 ? 6 : 0 },}
                    , React.createElement('span', { style: { fontSize: 20 },}, pb.icon)
                    , React.createElement('div', null
                      , React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: "var(--text)" },}, pb.name)
                      , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)" },}, React.createElement('span', { style: { textDecoration: "line-through" },}, pb.old), " → "  , React.createElement('span', { style: { color: "var(--accent)", fontWeight: 700 },}, pb.new))
                    )
                  )
                ))
              )
            )

            /* Last session feedback */
            , feedback && pbs.length === 0 && (
              React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "12px 16px", marginBottom: 14 },}
                , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)", lineHeight: 1.5 },}, feedback[0].text)
              )
            )

            /* Weekly summary card */
            , (() => {
              var weekly = getWeeklySummary(history, botGames);
              if (!weekly) return null;
              return (
                React.createElement('div', { style: { background:"var(--glass-bg)", border:"1px solid var(--glass-border)", borderRadius:"var(--radius)", padding:16, marginBottom:12, boxShadow:"var(--shadow-card)", backdropFilter:"blur(12px)" },}
                  , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", color:"var(--muted)", marginBottom:12 },}, "This Week" )
                  , React.createElement('div', { style: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom: weekly.bestImprovement ? 12 : 0 },}
                    , React.createElement('div', { style: { textAlign:"center", padding:"12px 8px", background:"var(--surface2)", borderRadius:10, borderTop:"2px solid rgba(232,118,63,.3)" },}
                      , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:30, fontWeight:800, letterSpacing:"-0.04em", color:"var(--accent)", lineHeight:1 },}, weekly.sessions)
                      , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", color:"var(--muted)", marginTop:4 },}, "Sessions", weekly.sessionDiff > 0 ? ` +${weekly.sessionDiff}` : weekly.sessionDiff < 0 ? ` ${weekly.sessionDiff}` : "")
                    )
                    , React.createElement('div', { style: { textAlign:"center", padding:"12px 8px", background:"var(--surface2)", borderRadius:10, borderTop:"2px solid rgba(255,255,255,.08)" },}
                      , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:30, fontWeight:800, letterSpacing:"-0.04em", color:"var(--text)", lineHeight:1 },}, weekly.games)
                      , React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:500, letterSpacing:".05em", textTransform:"uppercase", color:"var(--muted)", marginTop:4 },}, "Games")
                    )
                  )
                  , weekly.bestImprovement && weekly.bestImprovement.diff > 0 && (
                    React.createElement('div', { style: { display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"rgba(232,118,63,.04)", borderRadius:10, border:"1px solid rgba(232,118,63,.12)" },}
                      , React.createElement('span', { style: { fontSize:18 },}, weekly.bestImprovement.icon)
                      , React.createElement('div', { style: { fontSize:12, color:"var(--text2)", lineHeight:1.45 },}
                        , React.createElement('span', { style: { color:"var(--text)", fontWeight:700 },}, weekly.bestImprovement.name), " up "  , React.createElement('span', { style: { color:"var(--accent)", fontWeight:700 },}, "+", weekly.bestImprovement.diff), " vs last week"
                      )
                    )
                  )
                  , weekly.botWins > 0 && (
                    React.createElement('div', { style: { fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"var(--text2)", marginTop:8, letterSpacing:".03em" },}, React.createElement(Ms, { icon: "smart_toy", size: 14,} ), " " , weekly.botWins, " bot win"  , weekly.botWins > 1 ? "s" : "", " this week"  )
                  )
                )
              );
            })()

            /* Stats row — only show if they have history */
            , history.length > 0 && (
              React.createElement(React.Fragment, null
                , React.createElement('div', { className: "section-label",}, "Your Stats" )
                , React.createElement('div', { className: "stat-row",}
                  , React.createElement('div', { className: "stat-box",}
                    , React.createElement('div', { className: "stat-val",}, history.length)
                    , React.createElement('div', { className: "stat-lbl",}, "Sessions")
                  )
                  , React.createElement('div', { className: "stat-box",}
                    , React.createElement('div', { className: "stat-val",}, totalGames)
                    , React.createElement('div', { className: "stat-lbl",}, "Games")
                  )
                  , React.createElement('div', { className: "stat-box",}
                    , React.createElement('div', { className: "stat-val",}, streak > 0 ? streak : "—")
                    , React.createElement('div', { className: "stat-lbl",}, "Day Streak" )
                  )
                )
                /* Darts IQ preview */
                , (() => {
                  var iq = calcDartsIQ({
                    ...deriveAchievementState(history, botGames),
                    achievementsUnlocked: Object.keys(unlockedAchievements).length,
                    totalAchievements: ACHIEVEMENTS.length,
                  });
                  var tier = getIQTier(iq.total);
                  var nextTier = IQ_TIERS.find(t => t.min > iq.total);
                  var pct = nextTier ? Math.round(((iq.total - tier.min) / (nextTier.min - tier.min)) * 100) : 100;
                  return (
                    React.createElement('div', { style: { background: `linear-gradient(135deg, ${tier.color}14, ${tier.color}08)`, border: `1px solid ${tier.color}40`, borderRadius: "var(--radius)", padding: "14px 16px", marginBottom: 14 },}
                      , React.createElement('div', { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },}
                        , React.createElement('div', { style: { display: "flex", alignItems: "center", gap: 8 },}
                          , React.createElement('span', { style: { fontSize: 20 },}, tier.emoji)
                          , React.createElement('div', null
                            , React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: tier.color },}, "Darts IQ" )
                            , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", marginTop: 1 },}, tier.label)
                          )
                        )
                        , React.createElement('div', { style: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 40, letterSpacing: 2, color: tier.color, lineHeight: 1 },}
                          , iq.total
                        )
                      )
                      , nextTier && (
                        React.createElement(React.Fragment, null
                          , React.createElement('div', { style: { height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 100, overflow: "hidden" },}
                            , React.createElement('div', { style: { height: "100%", width: `${pct}%`, background: tier.color, borderRadius: 100, transition: "width 0.6s ease" },} )
                          )
                          , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", marginTop: 5 },}
                            , nextTier.min - iq.total, " pts to "   , nextTier.emoji, " " , nextTier.label
                          )
                        )
                      )
                    )
                  );
                })()
                , botGames.length > 0 && (
                  React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "12px 16px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" },}
                    , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)" },}, "Bot record" )
                    , React.createElement('div', { style: { fontWeight: 700, fontSize: 14, color: "var(--text)" },}
                      , React.createElement('span', { style: { color: "var(--accent)" },}, botWins, "W")
                      , " — "
                      , React.createElement('span', { style: { color: "var(--accent2)" },}, botGames.length - botWins, "L")
                      , React.createElement('span', { style: { fontSize: 11, color: "var(--muted)", marginLeft: 8 },}, botGames.length > 0 ? `${Math.round((botWins/botGames.length)*100)}% win rate` : "")
                    )
                  )
                )
              )
            )

            /* Quick start programmes */
            , programmes.length > 0 && React.createElement(React.Fragment, null
              , React.createElement('div', { className: "section-label",}, "Jump Back In"  )
              , programmes.slice(0, 2).map(p => {
                var mins = p.games.reduce((a, id) => { var g = GAMES.find(g => g.id === id); return a + (g ? parseInt(g.duration) : 0); }, 0);
                return (
                  React.createElement('div', { key: p.id, className: "card", onClick: () => setActiveSession(p),}
                    , React.createElement('div', { className: "card-header",}
                      , React.createElement('div', { className: "card-icon",}, React.createElement(Ms, { icon: "calendar_today", size: 26,} ))
                      , React.createElement('div', { className: "card-info",}
                        , React.createElement('div', { className: "card-name",}, p.name)
                        , React.createElement('div', { className: "card-meta",}, React.createElement('span', { className: "badge accent" ,}, p.games.length, " games" ), React.createElement('span', { className: "badge",}, "~", mins, " min" ))
                        , p.description && React.createElement('div', { className: "card-desc", style: { marginTop: 4 },}, p.description)
                      )
                      , React.createElement('div', { style: { background: "var(--accent)", color: "var(--on-accent)", borderRadius: 10, padding: "8px 12px", fontSize: 13, fontWeight: 700, flexShrink: 0 },}, "▶")
                    )
                  )
                );
              })
            )

            /* Welcome state for new users */
            , programmes.length === 0 && (
              React.createElement('div', { style: { background: "linear-gradient(135deg,rgba(232,118,63,.08),rgba(168,255,120,.04))", border: "1px solid rgba(232,118,63,.25)", borderRadius: "var(--radius)", padding: 20, marginBottom: 16, textAlign: "center" },}
                , React.createElement('div', { style: { fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: 6 },}, "Welcome to Darts IQ"   )
                , React.createElement('div', { style: { fontSize: 13, color: "var(--muted)", lineHeight: 1.55, marginBottom: 14 },}, "Start by creating a training programme or browsing the game library."          )
                , React.createElement('div', { style: { display: "flex", gap: 10 },}
                  , React.createElement('button', { className: "btn btn-primary" , style: { flex: 1 }, onClick: () => setTrainView("library"),}, "Browse Games" )
                  , React.createElement('button', { className: "btn btn-secondary" , style: { flex: 1 }, onClick: () => { setEditingProg(null); setShowModal(true); },}, "+ New Plan"  )
                )
              )
            )

            /* Daily challenge card */
            , React.createElement(DailyChallengeCard, {
              onOpenCheckout: () => setShowCheckout(true),
              history: history,}
            )

            /* Weekly missions card */
            , React.createElement(WeeklyMissionsCard, { history: history, botGames: botGames,} )

            /* Checkout trainer quick access */
            , React.createElement('div', { onClick: () => setShowCheckout(true), className: "card", style: { background:"linear-gradient(135deg,rgba(232,118,63,.08),rgba(168,255,120,.04))", border:"1px solid rgba(232,118,63,.25)", marginBottom:14 },}
              , React.createElement('div', { className: "card-header",}
                , React.createElement('div', { className: "card-icon",}, "🎯")
                , React.createElement('div', { className: "card-info",}
                  , React.createElement('div', { className: "card-name",}, "Checkout Trainer" )
                  , React.createElement('div', { className: "card-meta",}, React.createElement('span', { className: "badge accent" ,}, "Daily Challenge" ), React.createElement('span', { className: "badge",}, "10 questions" ), React.createElement('span', { className: "badge",}, "Timed"))
                )
                , React.createElement('div', { style: { background:"var(--accent)", color:"#0d0d0b", borderRadius:10, padding:"8px 12px", fontSize:12, fontWeight:700, flexShrink:0 },}, "Play →" )
              )
              , React.createElement('div', { className: "card-desc",}, "Test your checkout knowledge. 15 seconds per question. Beat your best score."           )
            )

            /* Insights preview on home */
            , history.length >= 2 && (() => {
              var s = deriveStats(history, botGames);
              var insights = generateInsights(history, botGames, s);
              var topInsight = insights[0];
              if (!topInsight) return null;
              return (
                React.createElement('div', { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, marginBottom: 14, display: "flex", gap: 12, alignItems: "flex-start" },}
                  , React.createElement('div', { style: { fontSize: 20, flexShrink: 0 },}, topInsight.icon)
                  , React.createElement('div', { style: { flex: 1 },}
                    , React.createElement('div', { style: { fontSize: 12, fontWeight: 700, color: "var(--accent)", marginBottom: 2 },}, topInsight.title)
                    , React.createElement('div', { style: { fontSize: 12, color: "var(--muted)", lineHeight: 1.5 },}, topInsight.body)
                  )
                  , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)", flexShrink: 0, alignSelf: "center" },}, "💡")
                )
              );
            })()

            /* Featured games — horizontal scroll cards */
            , React.createElement('div', { style: { display:"flex", alignItems:"center", justifyContent:"space-between", margin:"22px 0 12px" },}
              , React.createElement('div', { className: "section-label", style: { margin:0 },}, "Featured Games" )
              , React.createElement('button', { onClick: () => setTrainView("library"), style: { background:"none", border:"none", fontSize:12, color:"var(--accent)", fontFamily:"'DM Sans',sans-serif", fontWeight:600, cursor:"pointer", padding:0 },}, "See all →"  )
            )
            , React.createElement('div', { style: { display:"flex", gap:10, overflowX:"auto", paddingBottom:12, marginBottom:4, scrollbarWidth:"none", WebkitOverflowScrolling:"touch" },}
              , ["darts-penalties","catch-40","bobs-27","halve-it","priestleys-triples","jdc-challenge"].map(id => {
                var g = GAMES.find(x => x.id === id);
                if (!g) return null;
                var catColor = { Accuracy:"#6f93b5", Finishing:"var(--accent)", Scoring:"#f0ad4e", "Match Play":"#c2483f" }[g.category] || "var(--accent)";
                return (
                  React.createElement('div', { key: g.id, onClick: () => goToGame(g), style: { flexShrink:0, width:160, background:"var(--surface)", border:"1px solid var(--border)", borderRadius:18, padding:16, cursor:"pointer", boxShadow:"var(--shadow-card)", WebkitTapHighlightColor:"transparent", transition:"transform .15s" },
                    onTouchStart: e => e.currentTarget.style.transform="scale(.97)",
                    onTouchEnd: e => e.currentTarget.style.transform="scale(1)",}
                    , React.createElement('div', { style: { fontSize:32, marginBottom:10 },}, g.icon)
                    , React.createElement('div', { style: { fontSize:13, fontWeight:700, color:"var(--text)", lineHeight:1.3, marginBottom:6 },}, g.name)
                    , React.createElement('div', { style: { fontSize:10, fontWeight:700, letterSpacing:.5, textTransform:"uppercase", color:catColor, background:`${catColor}18`, border:`1px solid ${catColor}30`, borderRadius:100, padding:"2px 8px", display:"inline-block" },}, g.category)
                  )
                );
              })
            )
          );
        })()

        /* LIBRARY view */
        , trainView === "library" && (
          React.createElement(LibraryInline, {
            onViewGame: goToGame,
            onViewGroup: group => { setViewingGroup(group); setTrainView("level-picker"); },}
          )
        )

        /* PROGRAMMES view */
        , trainView === "programmes" && (
          React.createElement(ProgrammesInline, {
            programmes: programmes,
            onEdit: p => { setEditingProg(p); setShowModal(true); },
            onDelete: id => setProgrammes(p => p.filter(x => x.id !== id)),
            onStart: p => setActiveSession(p),
            onNew: () => { setEditingProg(null); setShowModal(true); },}
          )
        )
      )
      )
    );
  };

  return (
    React.createElement(React.Fragment, null, React.createElement('style', null, css)
    , React.createElement('div', { className: "app",}
      /* Pages */
      , tab === "train" && renderTrain()
      , tab === "progress" && React.createElement(HistoryPage, { history: history, botGames: botGames, unlockedAchievements: unlockedAchievements, authUser: authUser, dartsIQ: dartsIQ,} )
      , tab === "play" && (
        React.createElement(PlayPage, {
          onClose: () => setTab("train"),
          onGameStart: () => setInPlayGame(true),
          onGameEnd: () => setInPlayGame(false),
          onGameComplete: res => {
            var newGame       = { ...res, date: new Date().toISOString(), id: Date.now().toString() };
            var updatedBotGames = [...botGames, newGame];
            setBotGames(updatedBotGames);
            if (authUser) syncBotGame(authUser.id, newGame).catch(console.error);

            if (res.winner === "player") {
              processAchievements(history, updatedBotGames, {
                botWin: true,
                botMaxLevel: res.botLevel || 0,
              });
            }
          },
          embedded: true,}
        )
      )

      /* Programme modal */
      , showModal && React.createElement(ProgrammeModal, { programme: editingProg, onSave: handleSaveProg, onClose: () => { setShowModal(false); setEditingProg(null); },} )

      /* Achievement celebration overlay */
      , celebrationQueue.length > 0 && (
        React.createElement(CelebrationScreen, {
          achievement: celebrationQueue[0],
          onDismiss: () => setCelebrationQueue(q => q.slice(1)),}
        )
      )

      /* Floating AI button — hidden during active games */
      , !showAI && !inPlayGame && (
        React.createElement('button', { onClick: () => setShowAI(true), style: { position: "fixed", bottom: 82, right: 16, width: 50, height: 50, borderRadius: "50%", background: "linear-gradient(135deg,var(--accent),#f0a06a)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(232,118,63,.45)", zIndex: 90, WebkitTapHighlightColor: "transparent" },}
          , React.createElement(Ms, { icon: "smart_toy", size: 22, fill: true,} )
        )
      )

      /* AI Drawer */
      , showAI && (
        React.createElement('div', { style: { position: "fixed", inset: 0, zIndex: 300, display: "flex", flexDirection: "column" },}
          , React.createElement('div', { style: { flex: 1, background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)" }, onClick: () => setShowAI(false),} )
          , React.createElement('div', { style: { height: "88vh", background: "var(--bg)", borderRadius: "24px 24px 0 0", overflow: "hidden", display: "flex", flexDirection: "column", maxWidth: 430, width: "100%", margin: "0 auto", borderTop: "1px solid var(--border)" },}
            , React.createElement('div', { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px 12px", borderBottom: "1px solid var(--border)", flexShrink: 0 },}
              , React.createElement('div', { style: { display: "flex", alignItems: "center", gap: 10 },}
                , React.createElement('div', { style: { width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,var(--accent),#f0a06a)", display: "flex", alignItems: "center", justifyContent: "center" },}, React.createElement(Ms, { icon: "smart_toy", size: 18, fill: true,} ))
                , React.createElement('div', null
                  , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:16, fontWeight:800, letterSpacing:"-0.02em", color:"var(--text)", lineHeight:1 },}, "Darts IQ Coach"  )
                  , React.createElement('div', { style: { fontSize: 11, color: "var(--muted)" },}, "AI powered coaching"  )
                )
              )
              , React.createElement('button', { onClick: () => setShowAI(false), style: { background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, width: 34, height: 34, color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },}, React.createElement(Ms, { icon: "close", size: 18,} ))
            )
            , React.createElement('div', { style: { flex: 1, overflow: "hidden" },}, React.createElement(AIPage, { compact: true,} ))
          )
        )
      )

      /* Logout confirm modal */
      /* ── Reset Progress Confirm Modal ── */
      , showResetConfirm && (
        React.createElement('div', { className: "modal-overlay", onClick: () => setShowResetConfirm(false),}
          , React.createElement('div', { className: "modal", onClick: e => e.stopPropagation(),}
            , React.createElement('div', { className: "modal-handle",} )
            , React.createElement('div', { style: { textAlign:"center", padding:"8px 0 20px" },}
              , React.createElement('div', { style: { marginBottom:12 },}, React.createElement(Ms, { icon: "delete_forever", size: 48, style: {color:"var(--accent2)"},} ))
              , React.createElement('div', { style: { fontFamily:"'Hanken Grotesk',sans-serif", fontSize:24, fontWeight:800, letterSpacing:"-0.02em", color:"var(--accent2)", marginBottom:8 },}, "Reset All Progress?"  )
              , React.createElement('div', { style: { fontSize:14, color:"var(--muted)", lineHeight:1.6, marginBottom:24 },}, "This will permanently delete your session history, bot games, achievements, programmes and Darts IQ score. This cannot be undone."

              )
              , React.createElement('div', { style: { display:"flex", gap:10 },}
                , React.createElement('button', { className: "btn btn-secondary" , style: { flex:1 }, onClick: () => setShowResetConfirm(false),}, "Cancel")
                , React.createElement('button', { className: "btn btn-danger" , style: { flex:1 }, onClick: () => {
                  // Clear all local storage
                  saveHistory([]);
                  saveBotGames([]);
                  saveProgrammes([]);
                  saveAchievements({});
                  saveChallengeStreak(0);
                  saveWeeklyMissions(null);
                  // Reset React state
                  setHistory([]);
                  setBotGames([]);
                  setProgrammes([]);
                  setUnlockedAchievements({});
                  // Also clear from Supabase if logged in
                  if (authUser && authUser !== false) {
                    syncUserData(authUser.id, {
                      dailyChallenge: null,
                      challengeStreak: 0,
                      weeklyMissions: null,
                      profile: loadProfile(),
                    }).catch(console.error);
                    // Delete sessions and bot_games from Supabase
                    supabase.from("sessions").delete().eq("user_id", authUser.id).then(() => {});
                    supabase.from("bot_games").delete().eq("user_id", authUser.id).then(() => {});
                    supabase.from("achievements").delete().eq("user_id", authUser.id).then(() => {});
                  }
                  setShowResetConfirm(false);
                  setShowProfile(false);
                },}, React.createElement(Ms, { icon: "delete_forever", size: 16,} ), " Yes, Reset Everything"   )
              )
            )
          )
        )
      )

      , showLogoutConfirm && (
        React.createElement('div', { style: { position:"fixed", inset:0, zIndex:900, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(4px)", display:"flex", alignItems:"flex-end", justifyContent:"center" },
          onClick: () => setShowLogoutConfirm(false),}
          , React.createElement('div', { onClick: e => e.stopPropagation(), style: { background:"#1a1f1a", borderRadius:"24px 24px 0 0", padding:"0 0 40px", width:"100%", maxWidth:480, boxShadow:"0 -4px 40px rgba(0,0,0,0.5)" },}
            , React.createElement('div', { style: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 24px 0" },}
              , React.createElement('button', { onClick: () => setShowLogoutConfirm(false), style: { background:"none", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"rgba(255,255,255,0.55)", WebkitTapHighlightColor:"transparent", padding:"4px 0" },}, "Close")
              , React.createElement('div', { style: { fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:3, color:"var(--text)", textAlign:"center", flex:1 },}, "Sign Out" )
              , React.createElement('div', { style: { width:48 },} )
            )
            , React.createElement('div', { style: { fontSize:15, color:"rgba(255,255,255,0.55)", textAlign:"center", padding:"16px 32px 28px", lineHeight:1.5 },}, "Are you sure you want to sign out? Your progress is saved to your account."

            )
            , React.createElement('div', { style: { display:"flex", gap:12, padding:"0 20px" },}
              , React.createElement('button', { onClick: handleSignOut, style: { flex:1, padding:"18px 0", borderRadius:100, background:"#c0392b", border:"none", fontFamily:"'DM Sans',sans-serif", fontSize:17, fontWeight:700, color:"#fff", cursor:"pointer", WebkitTapHighlightColor:"transparent" },}, "Sign Out" )
              , React.createElement('button', { onClick: () => setShowLogoutConfirm(false), style: { flex:1, padding:"18px 0", borderRadius:100, background:"#2980b9", border:"none", fontFamily:"'DM Sans',sans-serif", fontSize:17, fontWeight:700, color:"#fff", cursor:"pointer", WebkitTapHighlightColor:"transparent" },}, "Stay")
            )
          )
        )
      )

      /* 3-tab nav — hidden during active games */
      , !inPlayGame && (
        React.createElement('nav', { className: "nav",}
          , [
            { id: "train", label: "Train", Icon: TrainIcon },
            { id: "progress", label: "Progress", Icon: ProgressIcon },
            { id: "play", label: "Play", Icon: PlayIcon },
          ].map(({ id, label, Icon }) => (
            React.createElement('button', { key: id, className: `nav-btn ${tab === id ? "active" : ""}`, "aria-current": tab === id ? "page" : undefined,
              onClick: () => { setTab(id); if (id === "train") setViewingGame(null); },}
              , React.createElement(Icon, null ), label
            )
          ))
        )
      )
    ))
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(ErrorBoundary, null, React.createElement(App, null)));
