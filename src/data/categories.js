export const categories = [
  { id: "dd_add", name: "Addition (2 Digit)", desc: "Double digit + double digit addition", defaultCount: 5 },
  { id: "tt_add", name: "Addition (3 Digit)", desc: "Triple digit + triple digit addition", defaultCount: 0 },
  { id: "mix_add", name: "Mix Addition", desc: "Random 3 to 5 double/triple numbers", defaultCount: 0 },
  { id: "num_sum", name: "Number Sum", desc: "Sum up all single digits of a generated number", defaultCount: 0 },
  { id: "ds_mult", name: "Tables (11-30)", desc: "Multiplications of factors from 11 to 30", defaultCount: 0 },
  { id: "dd_mult", name: "Multiplication (2 Digit)", desc: "Double digit × Double digit multiplication", defaultCount: 0 },
  { id: "ts_mult", name: "T × S", desc: "Triple digit × Single digit multiplication", defaultCount: 0 },
  { id: "square", name: "Square", desc: "Find square of numbers between 11 to 99", defaultCount: 0 },
  { id: "square_root", name: "Square Root (21-100)", desc: "Find the square root of perfect squares between 21 to 100", defaultCount: 0 },
  { id: "cube_root", name: "Cube Root (11-50)", desc: "Find the cube root of perfect cubes between 11 to 50", defaultCount: 0 },
  { id: "lcm", name: "LCM", desc: "Least Common Multiple of two integers", defaultCount: 0 },
  { id: "hcf", name: "HCF", desc: "Highest Common Factor of two integers", defaultCount: 0 },
  { id: "percentage", name: "Percentage", desc: "Percent value calculations (e.g., 20% of 150)", defaultCount: 0 },
  { id: "decimal", name: "Decimal Arithmetic", desc: "Addition / subtraction with decimals", defaultCount: 0 },
  { id: "bodmas", name: "BODMAS Rules", desc: "Evaluate basic parenthetical & arithmetic equations", defaultCount: 0 }
];

export const INITIAL_DIFFICULTY = {
  "Addition (1 Digit)": 2, "Addition": 2, "Addition (2 Digit)": 2, "Addition (3 Digit)": 2,
  "Subtraction (1 Digit)": 2, "Subtraction": 2, "Subtraction (2 Digit)": 2, "Subtraction (3 Digit)": 2,
  "Multiplication (1 Digit)": 2, "Multiplication": 2, "Multiplication (2 Digit)": 2,
  "Division": 2, "Division (Perfect)": 2,
  "Square Root (1-20)": 2, "Square Root (21-100)": 2,
  "Cube Root (1-10)": 2, "Cube Root (11-50)": 2,
  "Fractions": 2, "Percentage": 2, "Decimals": 2, "Decimal Arithmetic": 2, "BODMAS Rules": 2
};
