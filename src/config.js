/**
 * @fileoverview Becak Rush - Game Configuration and Constants
 * Jogja Malioboro themed vertical runner.
 * 
 * Defines physical dimensions, gameplay tuning (player speed, obstacle spawn rates, 
 * coin/bakpia item rates), leveling curves, font settings, color palette, and storage keys.
 */

/**
 * Field & Road Layout Configuration (Canvas coordinates in pixels)
 */
export const FIELD = {
  width: 640,
  height: 1280,
  groundY: 1150,      // Y position where the becak is grounded
  roadLeft: 100,      // Left boundary of the Malioboro street
  roadRight: 540,     // Right boundary of the Malioboro street
  roadWidth: 440      // Total drivable width of the road (roadRight - roadLeft)
};

/**
 * Player (Becak) Configuration
 */
export const PLAYER = {
  width: 90,
  height: 70,
  speed: 620,         // Horizontal movement speed in pixels per second
  invulnerable: 1.2   // Invulnerability duration in seconds after taking damage
};

/**
 * Obstacle (Block / Traffic / Barriers) Configuration
 */
export const BLOCK = {
  interval: 0.85,     // Initial base spawn interval in seconds
  minInterval: 0.35,  // Minimum spawn interval limit at high levels
  intervalScale: 0.92,// Multiplier applied to interval per level progression
  minWidth: 70,       // Minimum obstacle width
  maxWidth: 150,      // Maximum obstacle width
  height: 64,         // Obstacle height
  speed: 340,         // Base downward movement speed in pixels per second
  speedPerLevel: 35,  // Additional speed increase per level
  speedJitter: 90,    // Random speed variance added to obstacles
  dodgePoints: 1      // Score awarded for successfully dodging an obstacle
};

/**
 * Passenger / Coin Configuration
 */
export const COIN = {
  size: 44,           // Width and height of passenger coin items
  interval: 1.1,      // Base spawn interval in seconds
  intervalJitter: 0.8,// Random time jitter added to coin spawning
  speed: 320,         // Base downward movement speed
  speedPerLevel: 25,  // Additional speed increase per level
  points: 10          // Score awarded upon passenger pickup
};

/**
 * Bakpia Pathok (Health/Bonus Item) Configuration
 */
export const BAKPIA = {
  width: 46,
  height: 36,
  intervalBase: 9,    // Base interval between Bakpia spawns in seconds
  intervalJitter: 6,  // Random jitter applied to Bakpia spawn timing
  points: 5           // Bonus points awarded when collecting Bakpia
};

/**
 * Level & Difficulty Progression Configuration
 */
export const LEVEL = {
  seconds: 18,        // Duration of each level in seconds before difficulty increases
  max: 8              // Maximum attainable difficulty level
};

/**
 * Global Game Rules & Rendering Constants
 */
export const LIVES = 3;                         // Starting player lives
export const POOL_SIZE = 48;                    // Maximum pooled active/inactive entities
export const FONT = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

/**
 * Visual Color Palette (Jogja Malioboro Aesthetic)
 */
export const PALETTE = {
  backdrop: '#11141b',      // Outer letterbox backdrop
  sky: '#ffe9c4',           // Warm sunrise/sunset sky gradient start
  skyDusk: '#ffd9a0',       // Sky gradient end
  road: '#8a6d4b',          // Asphalt / paved Malioboro road surface
  sidewalk: '#a5875f',      // Sidewalk / pedestrian path
  curb: '#705437',          // Curb edge
  laneDivider: '#fff8e7',   // Road markings
  playerBody: '#1f9d55',    // Becak green body color
  playerRoof: '#fff8e7',    // Becak canopy / roof
  playerWheel: '#222222',   // Becak wheels
  obstacle: '#cc2222',      // Obstacle / hazard color
  obstacleTrim: '#222222',  // Obstacle outline/trim
  passengerCoin: '#ffcc00', // Passenger coin gold
  bakpiaCrust: '#c98a3d',   // Bakpia pastry crust
  bakpiaFilling: '#fff8e7', // Bakpia sweet bean filling
  textDark: '#222222',      // Primary UI text color
  textAccent: '#1f9d55',    // Accent / brand highlight color
  panelBg: '#fff8e7'        // UI dialog panel background
};

/** Storage key for persisting high scores in localStorage */
export const BEST_KEY = 'becak-rush-best';

/** Fixed time step for simulation update (60 updates per second) */
export const STEP = 1 / 60;
