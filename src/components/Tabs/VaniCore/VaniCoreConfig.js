// VaniCoreConfig.js — Central config for VANI pilot portal
// Update build URLs here after each release upload.

// ── Build Releases ─────────────────────────────────────────────────────────────
// Sign-in required to access download links (enforced in DownloadCard UI).
export const BUILDS = [
  {
    id: 'windows',
    platform: 'Windows',
    icon: '🪟',
    description: 'VaniCore for Windows 10 / 11 (64-bit) — Run VaniCore.exe',
    ext: '.exe',
    filename: 'VaniCore-1.1.0-pilot.exe',
    url: 'https://drive.google.com/file/d/1X2-taKYMwJHwPpmusAAeAjXSlT2vF-1n/view?usp=sharing',
    version: '1.1.0-pilot',
    releaseDate: '2026-05-19',
    size: '~48 MB',
    baseDownloads: 0,
  },
  {
    id: 'mac',
    platform: 'macOS',
    icon: '🍎',
    description: 'VaniCore for macOS 12 Monterey or later — Run the DMG installer',
    ext: '.dmg',
    filename: 'VaniCore-1.1.0-pilot.dmg',
    url: 'https://drive.google.com/file/d/1wf4jiK3kNgtQaf760FI7E7YtC0K_yAkk/view?usp=sharing',
    version: '1.1.0-pilot',
    releaseDate: '2026-05-19',
    size: '~52 MB',
    baseDownloads: 0,
  },
  {
    id: 'android',
    platform: 'Android',
    icon: '🤖',
    description: 'VaniCare for Android 8.0+ — Enable unknown sources before installing',
    ext: '.apk',
    filename: 'VaniCare-1.3.0-pilot.apk',
    url: 'https://drive.google.com/file/d/1JAPbjqHdRwT72rOAPUfRIZCJsPjcPjnH/view?usp=sharing',
    version: '1.3.0-pilot',
    buildNumber: 3,
    releaseDate: '2026-05-25',
    size: '~24 MB',
    baseDownloads: 0,
    changelog: {
      new: [
        'Settings tab — reads calibrated gesture thresholds from Firestore (Eye / Head / Mouth / Face / Meta)',
      ],
      improved: [
        'Tab order: Alerts → Dashboard → Guide → Settings → Patient',
        'App opens on Alerts by default',
        'Tab labels always visible',
      ],
      fixed: [
        'Firestore PERMISSION_DENIED on Settings screen',
      ],
    },
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
  { value: 'eager', label: 'Eager — Ready to start immediately' },
  { value: 'willing', label: 'Willing — Happy to try with caregiver support' },
  { value: 'curious', label: 'Curious — Want to learn more before deciding' },
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
// Empty by default — real feedback comes from user submissions, approved by admin.
export const SEED_FEEDBACK = [];

// ── localStorage keys ──────────────────────────────────────────────────────────
export const LS_PILOTS    = 'vanicore_pilots_v1';
export const LS_FEEDBACK  = 'vanicore_feedback_v2';
export const LS_DOWNLOADS = 'vanicore_downloads_v2';

// ── Build Changelog (newest first, max 10 entries) ─────────────────────────────
// platformId: 'android' | 'windows_mac'
// url / urlWindows / urlMac — download links for each historical build
export const CHANGELOG = [
  {
    version: '1.3.0-pilot',
    date: '2026-05-25',
    time: '00:00',
    entries: [
      {
        platform: 'Android (VaniCare)',
        platformId: 'android',
        icon: '🤖',
        url: 'https://drive.google.com/file/d/1JAPbjqHdRwT72rOAPUfRIZCJsPjcPjnH/view?usp=sharing',
        notes: 'New Settings tab — reads calibrated gesture thresholds from Firestore (Eye / Head / Mouth / Face / Meta). Tab order updated to Alerts → Dashboard → Guide → Settings → Patient. App now opens on Alerts by default. Tab labels always visible. Fixed Firestore PERMISSION_DENIED on Settings screen.',
        whatToTest: 'Open VaniCare — confirm it lands on Alerts. Navigate all 5 tabs in order. Open Settings and verify gesture thresholds load from Firestore without permission errors.',
      },
    ],
  },
  {
    version: '1.1.0-pilot',
    date: '2026-05-19',
    time: '18:00',
    entries: [
      {
        platform: 'Android (VaniCare)',
        platformId: 'android',
        icon: '🤖',
        url: 'https://drive.google.com/file/d/1GTqjviEhEorykKyoBstxto3Qo0VVuDTy/view?usp=sharing',
        notes: 'Added tab bar with Dashboard, Guide, Settings and Manual Patient Entry screens. Improved Firebase sync reliability and added manual patient entry flow.',
        whatToTest: 'Navigate all 4 tabs (Dashboard, Guide, Settings, Manual Entry). Test manual patient entry and verify data syncs with VaniCore on desktop in real time.',
      },
      {
        platform: 'Windows / macOS (VaniCore)',
        platformId: 'windows_mac',
        icon: '💻',
        urlWindows: 'https://drive.google.com/file/d/1X2-taKYMwJHwPpmusAAeAjXSlT2vF-1n/view?usp=sharing',
        urlMac: 'https://drive.google.com/file/d/1wf4jiK3kNgtQaf760FI7E7YtC0K_yAkk/view?usp=sharing',
        notes: 'Fixed UI layout issues, QR code display glitches and input box behaviour. Added informative instructional text throughout all screens.',
        whatToTest: 'Launch app — verify QR code generates cleanly. Scan from VaniCare. Check input boxes accept text correctly and all screens show informative labels.',
      },
    ],
  },
  {
    version: '1.0.0-pilot',
    date: '2026-05-11',
    time: '10:00',
    entries: [
      {
        platform: 'Android (VaniCare)',
        platformId: 'android',
        icon: '🤖',
        url: 'https://drive.google.com/file/d/1Ns6J9mGCmPWYVFopUeostKV3AUGczo7i/view?usp=sharing',
        notes: 'Initial pilot release — single-screen Android app to receive real-time gesture notifications from the patient via Firebase.',
        whatToTest: "Install APK (enable Unknown Sources first), open VaniCare, scan the QR code shown on VaniCore desktop. Verify gesture alerts (Blink, Double-Blink, Gaze) appear on the caregiver's phone in real time.",
      },
      {
        platform: 'Windows / macOS (VaniCore)',
        platformId: 'windows_mac',
        icon: '💻',
        urlWindows: 'https://drive.google.com/file/d/1kOckC8vij4O8UDYt1Qgx-C0w2DLGNc1T/view?usp=sharing',
        urlMac: 'https://drive.google.com/file/d/1O6e_aeTI-XQxTUn1SzJeA88MNMs2hssa/view?usp=sharing',
        notes: 'Initial pilot release — VaniCore desktop communication system. Enrol in the pilot program, generate a QR code and let the caregiver app scan it to sync with VaniCore.',
        whatToTest: 'Run VaniCore, enter your name on the landing screen, confirm the QR code appears. Scan from VaniCare on Android and verify the connection is established. Perform gestures and confirm they are received on the Android device.',
      },
    ],
  },
];
