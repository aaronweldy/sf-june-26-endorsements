const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const SECTION_ORDER = [
  { id: "federal",    label: "Federal Races" },
  { id: "statewide",  label: "California Statewide Executive Offices" },
  { id: "legislature",label: "California Legislature (SF)" },
  { id: "judicial",   label: "San Francisco Superior Court — Judge, Seat 16" },
  { id: "supes",      label: "San Francisco Board of Supervisors (Special Elections)" },
  { id: "boe",        label: "Board of Education — one seat (completing term ending Jan 2027)" },
  { id: "measures",   label: "San Francisco Local Ballot Measures (Props A–D)" },
];

const VALID_COLORS = new Set(["c1","c2","c3","c4","c5","c6","c7"]);
const VALID_SECTIONS = new Set(SECTION_ORDER.map(s => s.id));
const VALID_VOTES = new Set(["yes","no","none"]);

module.exports = function () {
  const dir = path.join(__dirname, "races");
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".yml")).sort();

  const grouped = {};
  for (const file of files) {
    const race = yaml.load(fs.readFileSync(path.join(dir, file), "utf8"));

    if (!VALID_SECTIONS.has(race.section)) {
      throw new Error(`${file}: invalid section "${race.section}"`);
    }

    if (race.candidates) {
      const seenColors = new Set();
      for (const c of race.candidates) {
        if (!VALID_COLORS.has(c.color)) throw new Error(`${file}: invalid color "${c.color}" for candidate "${c.id}"`);
        if (seenColors.has(c.color)) throw new Error(`${file}: duplicate color "${c.color}"`);
        seenColors.add(c.color);
      }
      const validPicks = new Set([...seenColors, "noend", "multi"]);
      for (const e of (race.endorsements || [])) {
        if (!validPicks.has(e.pick)) throw new Error(`${file}: unknown pick "${e.pick}" (org: ${e.org})`);
      }
    }

    if (race.props) {
      const propIds = new Set(race.props.map(p => p.id));
      for (const e of (race.endorsements || [])) {
        for (const [k, v] of Object.entries(e.votes || {})) {
          if (!propIds.has(k)) throw new Error(`${file}: unknown prop id "${k}" (org: ${e.org})`);
          if (!VALID_VOTES.has(v)) throw new Error(`${file}: invalid vote "${v}" for prop ${k} (org: ${e.org})`);
        }
      }
    }

    if (!grouped[race.section]) grouped[race.section] = [];
    grouped[race.section].push(race);
  }

  return SECTION_ORDER.map(s => ({
    section: s.id,
    label: s.label,
    races: grouped[s.id] || [],
  }));
};
