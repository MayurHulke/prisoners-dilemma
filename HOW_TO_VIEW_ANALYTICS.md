# How to View Your Game Analytics

You're using **Firebase Realtime Database** to store all player data. Here's how to view and analyze it:

---

## 🎯 Option 1: On Your Website (Public Analytics)

**Hub Page Shows Live Stats:**
https://mayurhulke.github.io/game-theory-arcade/

You can see:
- **Total players** for each game
- **Average cooperation rate** (Prisoner's Dilemma)
- **Average offer** (Ultimatum Game)
- **Survival rate** (Tragedy of Commons)
- **Average contribution** (Public Goods)

These update in real-time as people play!

---

## 🔥 Option 2: Firebase Console (Full Database Access)

**See ALL the raw data:**

### Step 1: Open Firebase Console
1. Go to https://console.firebase.google.com/
2. Click your project: `prisoners-dilemma-game-97e4e`
3. Click **"Realtime Database"** in the left sidebar
4. Click the **"Data"** tab (not Rules)

### Step 2: Explore Your Data

You'll see a tree structure like this:

```
prisoners-dilemma-game-97e4e-default-rtdb
├── games/                    (Prisoner's Dilemma results)
│   ├── -AbCd1234/
│   │   ├── cooperationRate: 60
│   │   ├── totalScore: 25
│   │   ├── rounds: 10
│   │   ├── timestamp: 1699123456789
│   │   └── playerArchetype: "Strategist"
│   ├── -AbCd5678/
│   └── ...
│
├── rounds/                   (Individual round decisions)
│   ├── -XyZ1234/
│   │   ├── playerChoice: "cooperate"
│   │   ├── opponentChoice: "betray"
│   │   └── result: -1
│   └── ...
│
├── ultimatum-games/          (Ultimatum Game results)
│   ├── -DeF1234/
│   │   ├── averageOffer: 4.2
│   │   ├── playerType: "Fair-Minded"
│   │   ├── rounds: [...]
│   │   └── timestamp: 1699123456789
│   └── ...
│
├── tragedy-games/            (Tragedy of Commons results)
│   ├── -GhI1234/
│   │   ├── totalFishCaught: 87
│   │   ├── lakeDied: false
│   │   ├── playerArchetype: "Pragmatist"
│   │   └── timestamp: 1699123456789
│   └── ...
│
└── public-goods-games/       (Public Goods results)
    ├── -JkL1234/
    │   ├── avgContribution: 5.8
    │   ├── finalWealth: 123
    │   ├── playerArchetype: "Contributor"
    │   └── timestamp: 1699123456789
    └── ...
```

### What You Can Do:
- **Click any entry** to see full details
- **Export data** - Click the ⋮ menu → "Export JSON"
- **Search** - Use the filter box at the top
- **Monitor in real-time** - Watch new entries appear as people play!

---

## 📊 Option 3: Export Data for Analysis

**Want to analyze data in Excel/Google Sheets?**

### Export from Firebase:
1. In Firebase Console → Realtime Database → Data tab
2. Click on the data node you want (e.g., "games")
3. Click the **⋮ menu** (three dots)
4. Click **"Export JSON"**
5. Save the file

### Convert JSON to Spreadsheet:
You can use online tools like:
- https://www.convertcsv.com/json-to-csv.htm
- Or import JSON directly into Google Sheets

### Example Analysis You Can Do:
- **Cooperation trends over time** - Plot timestamps vs cooperation rates
- **Player archetypes distribution** - Count how many Altruists vs Defectors
- **Average offers by day** - Group by date
- **Lake survival correlation** - Do sustainable players win more?

---

## 📈 What Data Is Collected?

### Prisoner's Dilemma (`/games` + `/rounds`)
- Total games played
- Cooperation rate (% of cooperate choices)
- Total score
- Player archetype (Altruist, Strategist, Opportunist, Defector)
- Individual round decisions (cooperate/betray)
- Timestamps

### Ultimatum Game (`/ultimatum-games`)
- Total games played
- Average offer amount ($0-$10)
- Acceptance/rejection decisions
- Player personality type
- Percentile ranking
- Timestamps

### Tragedy of the Commons (`/tragedy-games`)
- Total games played
- Total fish caught
- Lake survival (did it die?)
- Player archetype
- Round-by-round fishing amounts
- Timestamps

### Public Goods Game (`/public-goods-games`)
- Total games played
- Average contribution ($0-$10)
- Final wealth
- Player archetype
- Contribution history
- Timestamps

---

## 🔍 Advanced: Firebase Analytics (Optional)

**For deeper insights**, you could add **Google Analytics** to track:
- Page views
- Time spent on each game
- Drop-off rates (where people quit)
- Geographic distribution

**To add Google Analytics:**
1. In Firebase Console → Click the gear ⚙️ → Project Settings
2. Click "Integrations" tab
3. Click "Google Analytics" → "Link"
4. Follow the setup wizard

Then add this to your HTML files:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

---

## 💡 Quick Insights You Can Get Right Now:

**In Firebase Console:**

1. **Total players across all games:**
   - Count entries in each game node

2. **Most popular game:**
   - Compare number of entries: games vs ultimatum-games vs tragedy-games vs public-goods-games

3. **Cooperation trend:**
   - Look at cooperationRate values in /games
   - Average them to see overall cooperation

4. **Lake survival rate:**
   - Count entries in /tragedy-games where lakeDied = false
   - Divide by total entries

5. **Most common player type:**
   - Look at playerArchetype across all games
   - Count frequency

---

## 🎯 Summary:

**Where to see analytics:**
1. **Your website hub** - Live public stats
2. **Firebase Console → Data tab** - Full database access
3. **Export JSON** - Download for Excel/analysis
4. **Google Analytics** (optional) - Usage patterns

**You can see:**
- How many people played
- What choices they made
- Cooperation/fairness/sustainability rates
- Player personality distributions
- Trends over time

All data is **real-time** and updates automatically!

---

**Want to see something specific? Let me know and I can show you how to query it!**
