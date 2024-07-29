const statuses = [
  "ממתין למפעל",
  "בעבודה במפעל",
  "מוכן להתקנה",
  "בהתקנה",
  "תוכניות מוכנות",
];

const colors = {
  [statuses[0]]: "#FC0000",
  [statuses[1]]: "#00A5FF",
  [statuses[2]]: "#FDE720",
  [statuses[3]]: "#FFA043",
  [statuses[4]]: "#16B761",
};

module.exports = { colors };
