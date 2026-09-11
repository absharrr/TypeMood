import { MoodState } from '../types/typing';

export const GUILT_QUOTES: Record<MoodState, string[]> = {
  CALM: [
    "Ahhh... feeling the zen. Your plant is stretching its leaves contentedly.",
    "Your keyboard cadence is like smooth jazz right now. Keep flowing!",
    "Steady rhythm detected! A small blossom is threatening to sprout.",
    "If your typing had a smell, right now it would be freshly watered fern.",
  ],
  ERRATIC: [
    "Your fern hasn't recovered from yesterday's spreadsheet incident...",
    "Whoa there, Shakespeare! High jitter detected. Deep breaths.",
    "Backspace button getting a workout? Your plant is looking slightly concerned.",
    "Rhythm irregularity spike! Is that deadline breathing down your neck?",
  ],
  RAGE: [
    "CRITICAL: Key mashing detected! Your plant lost a leaf in protest!",
    "Step away from the mechanical keyboard! Your fern is shaking in terror.",
    "Rage typing detected. Remember: the keys didn't do anything to you!",
    "Soil cracks opening! Take a sip of water before your cactus implodes.",
  ],
  IDLE: [
    "Shhh... your plant has drifted off into a cozy nap (zZZ).",
    "Writing break? Your plant closed its leaves for a quick snooze.",
    "Quiet on set! Plant companion is officially napping.",
  ],
  RECOVERING: [
    "The storm has passed. Leaves are gently uncurling again.",
    "Cadence stabilizing! Healing animations in progress.",
    "Soil cracks are sealing back up. Good recovery!",
  ],
};
