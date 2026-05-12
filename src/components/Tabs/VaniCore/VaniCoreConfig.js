// VaniCoreConfig.js — Central config for VANI pilot portal
// Update build URLs here after each release upload.

// NOTE: Admin credentials are client-side only — suitable for internal pilot demo.
// TODO: Migrate to Firebase Authentication before any production/scale release.
// WARNING: Compiled React JS bundles are inspectable. Do not store sensitive patient
//          health records behind this auth layer — use Firebase Rules for that.
export const ADMIN_CREDENTIALS = {
  username: 'iOSDeveloper.ipa',
  password: 'Netlify@123456',
};

// Each caregiver / patient will receive their own Firebase credentials.
// These demo credentials are for caregiver onboarding / testing only.
export const DEMO_CARE_CREDENTIALS = {
  username: 'vani.care',
  password: 'VaniCare@2026',
};

// ── Build Releases ─────────────────────────────────────────────────────────────
// Sign-in required to access download links (enforced in DownloadCard UI).
export const BUILDS = [
  {
    id: 'windows',
    platform: 'Windows',
    icon: '🪟',
    description: 'VaniCore for Windows 10 / 11 (64-bit) — Run VaniCore.exe',
    ext: '.exe',
    filename: 'VaniCore-1.0.0-pilot.exe',
    url: 'https://drive.google.com/file/d/1MRxUAgwyiYrgZYJ77Or7BwiMQbkvBlAI/view?usp=drive_link',
    version: '1.0.0-pilot',
    releaseDate: '2026-05-11',
    size: '~48 MB',
    baseDownloads: 0,
  },
  {
    id: 'mac',
    platform: 'macOS',
    icon: '🍎',
    description: 'VaniCore for macOS 12 Monterey or later — Coming soon',
    ext: '.dmg',
    filename: 'VaniCore-1.0.0-pilot.dmg',
    url: '#',
    version: '1.0.0-pilot',
    releaseDate: '2026-05-11',
    size: '~52 MB',
    baseDownloads: 0,
  },
  {
    id: 'android',
    platform: 'Android',
    icon: '🤖',
    description: 'VaniCare for Android 8.0+ — Enable unknown sources before installing',
    ext: '.apk',
    filename: 'VaniCare-1.0.0-pilot.apk',
    url: 'https://drive.google.com/file/d/1rMIG2aXksin1LdRlkrJtRQBeFoC5s8oz/view?usp=sharing',
    version: '1.0.0-pilot',
    releaseDate: '2026-05-11',
    size: '~24 MB',
    baseDownloads: 0,
  },
];

// ── ALS / Neuromuscular Conditions ─────────────────────────────────────────────
export const CONDITIONS = [
  'ALS / MND (Amyotrophic Lateral Sclerosis)',
  'Locked-in Syndrome',
  'Post-Stroke Paralysis',
  'Spinal Cord Injury',
  'Cerebral Palsy',
  'Muscular Dystrophy',
  'Multiple Sclerosis',
  'Other Neuromuscular Condition',
];

// ── Motor Function Parts ───────────────────────────────────────────────────────
export const MOTOR_PARTS = [
  { id: 'eyes', label: 'Eye Movement (Left / Right)' },
  { id: 'blink', label: 'Eyelid / Blink Control' },
  { id: 'eyebrows', label: 'Eyebrow Movement' },
  { id: 'head', label: 'Head / Neck Movement' },
  { id: 'lips', label: 'Lip / Mouth Movement' },
  { id: 'jaw', label: 'Jaw Movement' },
  { id: 'tongue', label: 'Tongue Control' },
  { id: 'fingers_l', label: 'Fingers — Left Hand' },
  { id: 'fingers_r', label: 'Fingers — Right Hand' },
  { id: 'wrist_l', label: 'Wrist — Left' },
  { id: 'wrist_r', label: 'Wrist — Right' },
  { id: 'arm_l', label: 'Arm — Left' },
  { id: 'arm_r', label: 'Arm — Right' },
  { id: 'legs', label: 'Legs / Feet' },
];

// ── Gesture Capabilities ───────────────────────────────────────────────────────
export const GESTURE_CAPABILITIES = [
  'Eye gaze left / right',
  'Deliberate single blink',
  'Double blink (intentional)',
  'Head turn left / right',
  'Head nod up / down',
  'Lip press or movement',
  'Single finger tap',
  'Thumb movement',
  'Wrist rotation',
  'None currently reliable',
];

// ── Pilot Willingness ──────────────────────────────────────────────────────────
export const WILLINGNESS_OPTIONS = [
  { value: 'eager', label: '🚀  Eager — Ready to start immediately' },
  { value: 'willing', label: '🤝  Willing — Happy to try with caregiver support' },
  { value: 'curious', label: '🔍  Curious — Want to learn more before deciding' },
];

// ── Mock Gesture Data (Firebase Firestore — future read) ───────────────────────
// Production structure: /patients/{patientId}/gestureSessions/{sessionId}
export const MOCK_GESTURE_DATA = [
  {
    patientAlias: 'Pilot-001',
    condition: 'ALS / MND',
    lastSession: '2026-05-12',
    sessions: 7,
    primaryGesture: 'Deliberate single blink',
    accuracy: '94%',
    falsePositiveRate: '3%',
    avgResponseMs: 420,
    trend: 'improving',
  },
  {
    patientAlias: 'Pilot-002',
    condition: 'Post-Stroke Paralysis',
    lastSession: '2026-05-11',
    sessions: 2,
    primaryGesture: 'Eye gaze left / right',
    accuracy: '87%',
    falsePositiveRate: '8%',
    avgResponseMs: 610,
    trend: 'stable',
  },
  {
    patientAlias: 'Pilot-003',
    condition: 'Locked-in Syndrome',
    lastSession: '2026-05-10',
    sessions: 12,
    primaryGesture: 'Double blink (intentional)',
    accuracy: '91%',
    falsePositiveRate: '5%',
    avgResponseMs: 380,
    trend: 'improving',
  },
];

// ── Seed Feedback ──────────────────────────────────────────────────────────────
export const SEED_FEEDBACK = [
  {
    id: 'seed-1',
    alias: 'Pilot-002 family',
    message: 'Using VANI has given my father a way to communicate again after his ALS diagnosis. The blink detection works even in our dim living room.',
    rating: 5,
    date: '2026-05-11',
    approved: true,
  },
  {
    id: 'seed-2',
    alias: 'Caregiver at a rehab centre',
    message: 'Calibration took under 2 minutes. The patient was smiling by the end of the session — the first time they responded to something in months.',
    rating: 5,
    date: '2026-05-10',
    approved: true,
  },
  {
    id: 'seed-3',
    alias: 'Pilot-001',
    message: 'Looking forward to the IoT integration. Being able to turn off the fan without calling my caregiver would be life-changing.',
    rating: 4,
    date: '2026-05-09',
    approved: true,
  },
];

// ── localStorage keys ──────────────────────────────────────────────────────────
export const LS_PILOTS = 'vanicore_pilots_v1';
export const LS_FEEDBACK = 'vanicore_feedback_v1';
export const LS_DOWNLOADS = 'vanicore_downloads_v2';
export const LS_AUTH = 'vanicore_auth_v1'; // sessionStorage
