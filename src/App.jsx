import React, { useState, useEffect, useCallback, useRef } from "react";

// Remplace le stockage propre à Claude par le localStorage du navigateur —
// les données restent sur cet appareil/navigateur, comme une vraie appli web.
const storage = {
  get: async (key) => {
    const value = window.localStorage.getItem(key);
    return value !== null ? { key, value } : null;
  },
  set: async (key, value) => {
    window.localStorage.setItem(key, value);
    return { key, value };
  },
};

const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&family=Roboto+Mono:wght@500;700&family=Caveat:wght@700&display=swap');

    button { transition: transform 0.12s ease, opacity 0.12s ease, filter 0.15s ease; -webkit-tap-highlight-color: transparent; }
    button:active { transform: scale(0.96); }
    button:disabled:active { transform: none; }

    @keyframes modalIn { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .modal-pop { animation: modalIn 0.18s ease-out; }

    @keyframes flamePulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    .flame-anim { display: inline-block; animation: flamePulse 1.6s ease-in-out infinite; }

    @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    @keyframes confettiFall { from { transform: translateY(0) rotate(0deg); opacity: 1; } to { transform: translateY(520px) rotate(360deg); opacity: 0; } }

    /* Sport-themed backdrop: faint running-track lanes, used behind the
       progression chart so "la semaine" doesn't sit on a flat gray card. */
    .track-bg {
      background:
        repeating-linear-gradient(
          -18deg,
          rgba(243,113,33,0.05) 0px,
          rgba(243,113,33,0.05) 2px,
          transparent 2px,
          transparent 26px
        ),
        linear-gradient(160deg, #1E2328 0%, #171A1D 100%);
      border: 1px solid rgba(243,113,33,0.12);
    }

    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-thumb { background: #333A40; border-radius: 3px; }

    @keyframes shimmer { 0% { background-position: -200px 0; } 100% { background-position: 200px 0; } }
    .skeleton {
      background: linear-gradient(90deg, #1C2024 25%, #262B30 37%, #1C2024 63%);
      background-size: 400px 100%;
      animation: shimmer 1.4s ease-in-out infinite;
    }

    @keyframes viewIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .view-transition { animation: viewIn 0.22s ease-out; }

    @keyframes ringPop { 0% { transform: scale(0.9); opacity: 0; } 60% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
    .ring-pop { animation: ringPop 0.35s ease-out; }

    @keyframes gentlePulse { 0%, 100% { box-shadow: 0 6px 18px rgba(243,113,33,0.25); } 50% { box-shadow: 0 6px 26px rgba(243,113,33,0.5); } }
    .pulse-glow { animation: gentlePulse 1.8s ease-in-out infinite; }

    /* ---- Intro : 3 curls de biceps, sortie à gauche, "Bonne séance" ---- */
    @keyframes curlForearm {
      0%   { transform: rotate(0deg); }
      8%   { transform: rotate(0deg); }
      23%  { transform: rotate(-118deg); }
      33%  { transform: rotate(-118deg); }
      48%  { transform: rotate(0deg); }
      56%  { transform: rotate(0deg); }
      71%  { transform: rotate(-118deg); }
      81%  { transform: rotate(-118deg); }
      94%  { transform: rotate(0deg); }
      100% { transform: rotate(-118deg); }
    }
    .forearm-group { animation: curlForearm 2.6s ease-in-out both; }

    @keyframes bicepGrow {
      0%   { transform: scale(0.55); }
      8%   { transform: scale(0.55); }
      23%  { transform: scale(1.18); }
      33%  { transform: scale(1.18); }
      48%  { transform: scale(0.55); }
      56%  { transform: scale(0.55); }
      71%  { transform: scale(1.18); }
      81%  { transform: scale(1.18); }
      94%  { transform: scale(0.55); }
      100% { transform: scale(1.18); }
    }
    .bicep-bulge { transform-box: fill-box; transform-origin: center; animation: bicepGrow 2.6s ease-in-out both; }

    @keyframes logoExitLeft {
      from { transform: translateX(-50%) translateX(0); opacity: 1; }
      to { transform: translateX(-50%) translateX(-170px); opacity: 0; }
    }
    .curl-logo-wrap { animation: logoExitLeft 0.6s cubic-bezier(0.5, 0, 0.85, 0.35) both; animation-delay: 2.65s; }

    @keyframes trailStreak {
      0%   { width: 0; opacity: 0; }
      20%  { width: 90px; opacity: 0.9; }
      55%  { width: 190px; opacity: 0.55; }
      100% { width: 230px; opacity: 0; }
    }
    .trail {
      position: absolute;
      top: 50%;
      left: 100%;
      transform: translateY(-50%);
      height: 7px;
      width: 0;
      border-radius: 4px;
      background: linear-gradient(90deg, var(--accent), transparent);
      opacity: 0;
      animation: trailStreak 1.9s ease-out both;
      animation-delay: 2.65s;
    }

    @keyframes bonneSeanceIn { from { opacity: 0; transform: translateX(-50%) translateY(8px) scale(0.94); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
    .bonne-seance { opacity: 0; animation: bonneSeanceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; animation-delay: 3.1s; }

    @keyframes dotBounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-6px); opacity: 1; } }
    .splash-dot {
      width: 7px; height: 7px; border-radius: 50%; background: #F37121;
      display: inline-block; animation: dotBounce 1s ease-in-out infinite;
    }
  `}</style>
);

const WEEKDAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

// ---------- Muscle-group tints + pictograms (Lyfta-style small icon per station) ----------
const GROUP_STYLE = {
  "Pecs & Triceps": { tint: "#3A2A24", icon: "bench_flat" },
  "Dos & Biceps": { tint: "#24312F", icon: "cable_high" },
  "Jambes": { tint: "#2B2A3E", icon: "squat_rack" },
  "Épaules": { tint: "#3A2E1E", icon: "dumbbell" },
  "Abdos": { tint: "#2A3324", icon: "plank" },
  "Cardio": { tint: "#3A2420", icon: "cardio" },
};

function Pictogram({ icon, size = 26 }) {
  const common = { width: size, height: size, viewBox: "0 0 40 40", fill: "none" };
  const s = "var(--accent)";
  switch (icon) {
    case "bench_flat": // développé couché — flat bench + barbell
      return (
        <svg {...common}>
          <rect x="8" y="24" width="24" height="6" rx="1.5" stroke={s} strokeWidth="2" />
          <line x1="10" y1="30" x2="10" y2="35" stroke={s} strokeWidth="2" />
          <line x1="30" y1="30" x2="30" y2="35" stroke={s} strokeWidth="2" />
          <line x1="5" y1="16" x2="35" y2="16" stroke={s} strokeWidth="2.5" />
          <circle cx="8" cy="16" r="4" stroke={s} strokeWidth="2" />
          <circle cx="32" cy="16" r="4" stroke={s} strokeWidth="2" />
        </svg>
      );
    case "bench_incline": // développé incliné — angled bench + barbell
      return (
        <svg {...common}>
          <rect x="10" y="18" width="8" height="20" rx="1.5" stroke={s} strokeWidth="2" transform="rotate(-32 10 18)" />
          <line x1="10" y1="34" x2="6" y2="37" stroke={s} strokeWidth="2" />
          <line x1="5" y1="10" x2="35" y2="10" stroke={s} strokeWidth="2.5" />
          <circle cx="8" cy="10" r="3.6" stroke={s} strokeWidth="2" />
          <circle cx="32" cy="10" r="3.6" stroke={s} strokeWidth="2" />
        </svg>
      );
    case "pec_deck": // butterfly — seat + two curved arms
      return (
        <svg {...common}>
          <rect x="16" y="14" width="8" height="18" rx="2" stroke={s} strokeWidth="2" />
          <path d="M16 18 Q6 18 5 28" stroke={s} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M24 18 Q34 18 35 28" stroke={s} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <circle cx="5" cy="28" r="2.2" stroke={s} strokeWidth="1.8" />
          <circle cx="35" cy="28" r="2.2" stroke={s} strokeWidth="1.8" />
        </svg>
      );
    case "assisted_dip": // dips assistés — parallel handles + platform
      return (
        <svg {...common}>
          <line x1="12" y1="8" x2="12" y2="26" stroke={s} strokeWidth="2.5" />
          <line x1="28" y1="8" x2="28" y2="26" stroke={s} strokeWidth="2.5" />
          <line x1="9" y1="12" x2="15" y2="12" stroke={s} strokeWidth="2.5" />
          <line x1="25" y1="12" x2="31" y2="12" stroke={s} strokeWidth="2.5" />
          <rect x="13" y="30" width="14" height="4" rx="1.5" stroke={s} strokeWidth="2" />
        </svg>
      );
    case "cable_high": // tirage/extension à la poulie haute
      return (
        <svg {...common}>
          <path d="M8 6 V30 M32 6 V30 M8 6 H32" stroke={s} strokeWidth="2" />
          <circle cx="20" cy="9" r="2.5" stroke={s} strokeWidth="2" />
          <path d="M20 11.5 V22" stroke={s} strokeWidth="2" />
          <path d="M13 22 H27" stroke={s} strokeWidth="2.5" />
          <rect x="14" y="28" width="12" height="4" rx="1" stroke={s} strokeWidth="2" />
        </svg>
      );
    case "cable_low": // rowing à la poulie basse — seated
      return (
        <svg {...common}>
          <line x1="6" y1="20" x2="34" y2="20" stroke={s} strokeWidth="2" />
          <circle cx="7" cy="20" r="2.4" stroke={s} strokeWidth="2" />
          <rect x="16" y="24" width="8" height="6" rx="1.5" stroke={s} strokeWidth="2" />
          <path d="M20 20 L30 13" stroke={s} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M20 20 L28 17" stroke={s} strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case "barbell_row": // rowing barre — bent figure over bar
      return (
        <svg {...common}>
          <line x1="6" y1="26" x2="34" y2="26" stroke={s} strokeWidth="2.5" />
          <circle cx="8" cy="26" r="3.6" stroke={s} strokeWidth="2" />
          <circle cx="32" cy="26" r="3.6" stroke={s} strokeWidth="2" />
          <circle cx="20" cy="9" r="3" stroke={s} strokeWidth="2" />
          <path d="M20 12 L18 22" stroke={s} strokeWidth="2" strokeLinecap="round" />
          <path d="M18 22 L20 26" stroke={s} strokeWidth="2" strokeLinecap="round" />
          <path d="M14 15 L26 18" stroke={s} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "squat_rack": // squat — upright rack + bar
      return (
        <svg {...common}>
          <line x1="10" y1="6" x2="10" y2="34" stroke={s} strokeWidth="2" />
          <line x1="30" y1="6" x2="30" y2="34" stroke={s} strokeWidth="2" />
          <line x1="6" y1="16" x2="34" y2="16" stroke={s} strokeWidth="2.5" />
          <circle cx="9" cy="16" r="3.4" stroke={s} strokeWidth="2" />
          <circle cx="31" cy="16" r="3.4" stroke={s} strokeWidth="2" />
        </svg>
      );
    case "leg_press": // presse à cuisses — inclined sled + feet plate
      return (
        <svg {...common}>
          <path d="M6 32 L18 12 L34 18 L28 34 Z" stroke={s} strokeWidth="2" strokeLinejoin="round" />
          <line x1="20" y1="16" x2="24" y2="30" stroke={s} strokeWidth="1.6" />
        </svg>
      );
    case "leg_extension": // leg extension — seated pad + shin roller
      return (
        <svg {...common}>
          <rect x="10" y="10" width="10" height="14" rx="2" stroke={s} strokeWidth="2" />
          <path d="M15 24 L15 30" stroke={s} strokeWidth="2" strokeLinecap="round" />
          <path d="M15 30 L28 30" stroke={s} strokeWidth="2" strokeLinecap="round" />
          <circle cx="30" cy="30" r="3" stroke={s} strokeWidth="2" />
        </svg>
      );
    case "leg_curl": // leg curl — lying pad + heel roller
      return (
        <svg {...common}>
          <rect x="6" y="20" width="18" height="6" rx="2" stroke={s} strokeWidth="2" />
          <path d="M24 23 L32 23" stroke={s} strokeWidth="2" strokeLinecap="round" />
          <path d="M32 23 Q35 23 35 18" stroke={s} strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="35" cy="15" r="2.6" stroke={s} strokeWidth="1.8" />
        </svg>
      );
    case "calf_raise": // mollets — platform + raised heel arrows
      return (
        <svg {...common}>
          <rect x="8" y="26" width="24" height="5" rx="1.5" stroke={s} strokeWidth="2" />
          <path d="M14 26 L14 14" stroke={s} strokeWidth="2" strokeLinecap="round" />
          <path d="M10 18 L14 12 L18 18" stroke={s} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case "lunge": // fentes — figure lunging
      return (
        <svg {...common}>
          <circle cx="16" cy="8" r="3" stroke={s} strokeWidth="2" />
          <path d="M16 11 L16 19" stroke={s} strokeWidth="2" strokeLinecap="round" />
          <path d="M16 19 L9 30" stroke={s} strokeWidth="2" strokeLinecap="round" />
          <path d="M16 19 L27 24 L24 32" stroke={s} strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M16 13 L24 16" stroke={s} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "leg_raise": // relevé de jambes — hanging bar
      return (
        <svg {...common}>
          <line x1="8" y1="6" x2="32" y2="6" stroke={s} strokeWidth="2.5" />
          <line x1="12" y1="6" x2="12" y2="14" stroke={s} strokeWidth="2" />
          <line x1="28" y1="6" x2="28" y2="14" stroke={s} strokeWidth="2" />
          <circle cx="20" cy="16" r="2.6" stroke={s} strokeWidth="2" />
          <path d="M20 19 L20 24" stroke={s} strokeWidth="2" strokeLinecap="round" />
          <path d="M20 24 L28 20" stroke={s} strokeWidth="2" strokeLinecap="round" />
          <path d="M20 24 L14 20" stroke={s} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "jump_rope": // corde à sauter
      return (
        <svg {...common}>
          <path d="M8 12 Q20 34 32 12" stroke={s} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <rect x="5" y="8" width="4" height="8" rx="1.5" stroke={s} strokeWidth="1.8" />
          <rect x="31" y="8" width="4" height="8" rx="1.5" stroke={s} strokeWidth="1.8" />
        </svg>
      );
    case "treadmill": // tapis de course
      return (
        <svg {...common}>
          <rect x="6" y="24" width="26" height="6" rx="2" stroke={s} strokeWidth="2" />
          <path d="M28 24 L34 12" stroke={s} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="32" y1="14" x2="34" y2="12" stroke={s} strokeWidth="2" />
        </svg>
      );
    case "elliptical": // vélo elliptique
      return (
        <svg {...common}>
          <circle cx="14" cy="20" r="8" stroke={s} strokeWidth="2" />
          <line x1="14" y1="12" x2="30" y2="10" stroke={s} strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="28" x2="30" y2="26" stroke={s} strokeWidth="2" strokeLinecap="round" />
          <line x1="30" y1="10" x2="30" y2="26" stroke={s} strokeWidth="2" />
        </svg>
      );
    case "dumbbell": // haltère — free weight
      return (
        <svg {...common}>
          <line x1="13" y1="20" x2="27" y2="20" stroke={s} strokeWidth="3" />
          <rect x="6" y="14" width="7" height="12" rx="2" stroke={s} strokeWidth="2" />
          <rect x="27" y="14" width="7" height="12" rx="2" stroke={s} strokeWidth="2" />
        </svg>
      );
    case "plank": // gainage — mat + wave
      return (
        <svg {...common}>
          <rect x="6" y="24" width="28" height="6" rx="2" stroke={s} strokeWidth="2" />
          <path d="M11 17 Q15 11 20 17 T29 17" stroke={s} strokeWidth="2" fill="none" />
        </svg>
      );
    case "bodyweight": // burpees / au sol — figure
      return (
        <svg {...common}>
          <circle cx="12" cy="10" r="3" stroke={s} strokeWidth="2" />
          <path d="M12 13 L28 20" stroke={s} strokeWidth="2" strokeLinecap="round" />
          <path d="M17 15.5 L14 26" stroke={s} strokeWidth="2" strokeLinecap="round" />
          <path d="M23 18 L27 27" stroke={s} strokeWidth="2" strokeLinecap="round" />
          <path d="M28 20 L34 15" stroke={s} strokeWidth="2" strokeLinecap="round" />
          <path d="M28 20 L33 25" stroke={s} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default: // cardio — runner
      return (
        <svg {...common}>
          <circle cx="22" cy="9" r="3.2" stroke={s} strokeWidth="2" />
          <path d="M20 13 L15 22 L20 25 L17 33" stroke={s} strokeWidth="2" strokeLinecap="round" />
          <path d="M20 13 L27 18 L24 26" stroke={s} strokeWidth="2" strokeLinecap="round" />
          <path d="M15 22 L8 25" stroke={s} strokeWidth="2" strokeLinecap="round" />
          <path d="M20 25 L28 30" stroke={s} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}

// Which pictogram represents the actual machine/equipment for each named exercise.
// Falls back to the muscle group's default icon when an exercise isn't listed
// (e.g. custom exercises the user typed themselves).
const EXERCISE_ICON_MAP = {
  "Développé couché assisté": "bench_flat",
  "Développé couché": "bench_flat",
  "Développé incliné": "bench_incline",
  "Développé incliné haltères": "bench_incline",
  "Butterfly": "pec_deck",
  "Extension triceps": "cable_high",
  "Extension triceps poulie": "cable_high",
  "Barre au front": "cable_high",
  "Dips assisté": "assisted_dip",
  "Dips": "assisted_dip",
  "Écarté haltères": "dumbbell",
  "Tirage vertical": "cable_high",
  "Rowing barre": "barbell_row",
  "Tirage horizontal": "cable_low",
  "Curl biceps haltères": "dumbbell",
  "Curl marteau": "dumbbell",
  "Rowing haltère": "dumbbell",
  "Squats": "squat_rack",
  "Presse à cuisses": "leg_press",
  "Leg extension": "leg_extension",
  "Leg curl": "leg_curl",
  "Fentes avant": "lunge",
  "Mollets debout": "calf_raise",
  "Développé militaire haltères": "dumbbell",
  "Élévations latérales": "dumbbell",
  "Élévations frontales": "dumbbell",
  "Oiseau poulie": "cable_low",
  "Gainage planche": "plank",
  "Crunch": "plank",
  "Relevé de jambes": "leg_raise",
  "Gainage latéral": "plank",
  "Corde à sauter": "jump_rope",
  "Vélo elliptique": "elliptical",
  "Course tapis": "treadmill",
  "Burpees": "bodyweight",
};

function getExerciseIcon(name, group) {
  return EXERCISE_ICON_MAP[name] || (GROUP_STYLE[group] || {}).icon || "dumbbell";
}

// ---------- Muscles sollicités par exercice (principal + secondaires) ----------
const EXERCISE_MUSCLES = {
  "Développé couché assisté": { primary: ["Grand pectoral"], secondary: ["Triceps", "Deltoïde antérieur"] },
  "Développé couché": { primary: ["Grand pectoral"], secondary: ["Triceps", "Deltoïde antérieur"] },
  "Développé incliné": { primary: ["Haut des pectoraux"], secondary: ["Deltoïde antérieur", "Triceps"] },
  "Développé incliné haltères": { primary: ["Haut des pectoraux"], secondary: ["Deltoïde antérieur", "Triceps"] },
  "Butterfly": { primary: ["Grand pectoral (fibres internes)"], secondary: ["Deltoïde antérieur"] },
  "Extension triceps": { primary: ["Triceps"], secondary: [] },
  "Extension triceps poulie": { primary: ["Triceps"], secondary: [] },
  "Barre au front": { primary: ["Triceps"], secondary: [] },
  "Dips assisté": { primary: ["Triceps", "Bas des pectoraux"], secondary: ["Deltoïde antérieur"] },
  "Dips": { primary: ["Triceps", "Bas des pectoraux"], secondary: ["Deltoïde antérieur"] },
  "Écarté haltères": { primary: ["Grand pectoral"], secondary: ["Deltoïde antérieur"] },
  "Tirage vertical": { primary: ["Grand dorsal"], secondary: ["Biceps", "Trapèzes"] },
  "Rowing barre": { primary: ["Grand dorsal", "Trapèzes"], secondary: ["Biceps"] },
  "Tirage horizontal": { primary: ["Grand dorsal", "Trapèzes moyen"], secondary: ["Biceps"] },
  "Curl biceps haltères": { primary: ["Biceps"], secondary: ["Avant-bras"] },
  "Curl marteau": { primary: ["Biceps", "Brachial"], secondary: ["Avant-bras"] },
  "Rowing haltère": { primary: ["Grand dorsal"], secondary: ["Biceps", "Trapèzes"] },
  "Squats": { primary: ["Quadriceps", "Fessiers"], secondary: ["Ischio-jambiers", "Gainage"] },
  "Presse à cuisses": { primary: ["Quadriceps"], secondary: ["Fessiers"] },
  "Leg extension": { primary: ["Quadriceps"], secondary: [] },
  "Leg curl": { primary: ["Ischio-jambiers"], secondary: [] },
  "Fentes avant": { primary: ["Quadriceps", "Fessiers"], secondary: ["Ischio-jambiers"] },
  "Mollets debout": { primary: ["Mollets"], secondary: [] },
  "Développé militaire haltères": { primary: ["Deltoïde antérieur", "Deltoïde moyen"], secondary: ["Triceps"] },
  "Élévations latérales": { primary: ["Deltoïde moyen"], secondary: [] },
  "Élévations frontales": { primary: ["Deltoïde antérieur"], secondary: [] },
  "Oiseau poulie": { primary: ["Deltoïde postérieur"], secondary: ["Trapèzes"] },
  "Gainage planche": { primary: ["Transverse", "Grand droit"], secondary: ["Lombaires"] },
  "Crunch": { primary: ["Grand droit (abdos)"], secondary: [] },
  "Relevé de jambes": { primary: ["Abdos bas"], secondary: ["Fléchisseurs de hanche"] },
  "Gainage latéral": { primary: ["Obliques"], secondary: ["Transverse"] },
  "Corde à sauter": { primary: ["Mollets"], secondary: ["Cardio"] },
  "Vélo elliptique": { primary: ["Quadriceps", "Ischio-jambiers"], secondary: ["Cardio"] },
  "Course tapis": { primary: ["Quadriceps", "Mollets"], secondary: ["Cardio"] },
  "Burpees": { primary: ["Full body"], secondary: ["Cardio"] },
};

const GROUP_FALLBACK_MUSCLES = {
  "Pecs & Triceps": { primary: ["Pectoraux"], secondary: ["Triceps"] },
  "Dos & Biceps": { primary: ["Grand dorsal"], secondary: ["Biceps"] },
  "Jambes": { primary: ["Quadriceps", "Fessiers"], secondary: ["Ischio-jambiers"] },
  "Épaules": { primary: ["Deltoïdes"], secondary: [] },
  "Abdos": { primary: ["Abdominaux"], secondary: [] },
  "Cardio": { primary: ["Cardio"], secondary: [] },
};

function getExerciseMuscles(name, group) {
  return EXERCISE_MUSCLES[name] || GROUP_FALLBACK_MUSCLES[group] || { primary: [], secondary: [] };
}

function MachineThumb({ group, name, size = 40 }) {
  const style = GROUP_STYLE[group] || { tint: "var(--surface-raised)", icon: "dumbbell" };
  const icon = name ? getExerciseIcon(name, group) : style.icon;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size >= 34 ? 10 : "50%",
        background: style.tint,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Pictogram icon={icon} size={Math.round(size * 0.6)} />
    </div>
  );
}

// ---------- Exercise library, grouped by muscle group ----------
const EXERCISE_LIBRARY = {
  "Pecs & Triceps": ["Développé couché assisté", "Développé incliné", "Butterfly", "Extension triceps", "Dips assisté", "Écarté haltères"],
  "Dos & Biceps": ["Tirage vertical", "Rowing barre", "Tirage horizontal", "Curl biceps haltères", "Curl marteau", "Rowing haltère"],
  "Jambes": ["Squats", "Presse à cuisses", "Leg extension", "Leg curl", "Fentes avant", "Mollets debout"],
  "Épaules": ["Développé militaire haltères", "Élévations latérales", "Élévations frontales", "Oiseau poulie"],
  "Abdos": ["Gainage planche", "Crunch", "Relevé de jambes", "Gainage latéral"],
  "Cardio": ["Corde à sauter", "Vélo elliptique", "Course tapis", "Burpees"],
};

// ---------- Default week, as specified ----------
const DEFAULT_PROGRAM = [
  {
    id: "p1",
    weekday: "Lundi",
    group: "Pecs & Triceps",
    exercises: [
      { id: "e1", name: "Développé couché assisté", sets: 4, reps: "10" },
      { id: "e2", name: "Développé incliné", sets: 3, reps: "10" },
      { id: "e3", name: "Butterfly", sets: 3, reps: "12" },
      { id: "e4", name: "Extension triceps", sets: 3, reps: "15" },
      { id: "e4b", name: "Dips assisté", sets: 3, reps: "12" },
    ],
  },
  {
    id: "p2",
    weekday: "Mercredi",
    group: "Dos & Biceps",
    exercises: [
      { id: "e5", name: "Tirage vertical", sets: 4, reps: "10" },
      { id: "e6", name: "Rowing barre", sets: 3, reps: "10" },
      { id: "e7", name: "Curl biceps haltères", sets: 3, reps: "12" },
      { id: "e8", name: "Curl marteau", sets: 3, reps: "12" },
    ],
  },
  {
    id: "p3",
    weekday: "Jeudi",
    group: "Jambes",
    exercises: [
      { id: "e9", name: "Squats", sets: 4, reps: "12" },
      { id: "e10", name: "Presse à cuisses", sets: 4, reps: "12" },
      { id: "e11", name: "Leg extension", sets: 3, reps: "15" },
      { id: "e12", name: "Mollets debout", sets: 4, reps: "20" },
    ],
  },
  {
    id: "p4",
    weekday: "Samedi",
    group: "Dos & Biceps",
    exercises: [
      { id: "e13", name: "Tirage horizontal", sets: 4, reps: "10" },
      { id: "e14", name: "Rowing haltère", sets: 3, reps: "12" },
      { id: "e15", name: "Curl biceps haltères", sets: 3, reps: "12" },
      { id: "e16", name: "Curl marteau", sets: 3, reps: "12" },
    ],
  },
];
// Mardi, Vendredi, Dimanche : repos (aucun bloc = jour de repos)

// ---------- Programme de Nathan — cycle de 6 semaines, 4 séances/semaine ----------
// Réparti Lundi / Mercredi / Vendredi / Dimanche pour éviter au maximum deux
// jours d'entraînement consécutifs, comme demandé dans le programme.
const NATHAN_INFO = {
  title: "Programme de NathanFourmi",
  cycle: "Cycle de 6 semaines • 4 séances par semaine",
  objectif: "Prise de masse musculaire + progression en callisthénie, avec un travail régulier du Handstand et du Muscle Up.",
  consignes: [
    { label: "Échauffement", text: "Avant chaque séance : échauffement articulaire puis cardio léger ≤ 10 min, à basse intensité." },
    { label: "Progression", text: "4 séries, objectif 8–12 reps. <8 reps → diminuer la charge. 8–12 → garder. >12 → augmenter progressivement. Se rapprocher de l'échec avec une technique propre." },
    { label: "Repos", text: "1 min 30 entre CHAQUE série." },
    { label: "Callisthénie", text: "Handstand : 15 min avant chaque séance. Muscle Up : 1–2 fois/semaine, idéalement frais." },
    { label: "Technique", text: "Pour le squat : envoyer une vidéo afin de vérifier la forme avant d'ajouter de la charge." },
    { label: "Matériel", text: "La machine à triceps reste à confirmer. Si elle n'existe pas, un autre exercice sera défini." },
  ],
};

const NATHAN_PROGRAM = [
  {
    id: "nathan-1",
    weekday: "Lundi",
    group: "Dos & Biceps",
    nathan: true,
    exercises: [
      { id: "n1", name: "Tractions", sets: 4, reps: "8-12", rest: "1 min 30", note: "Minimum 6 reps. Si trop difficile : élastique jusqu'à 30 kg d'assistance. Si insuffisant : australiennes." },
      { id: "n2", name: "Tirage vertical", sets: 4, reps: "8-12", rest: "1 min 30", note: "<8 → baisser ; 8–12 → garder ; >12 → augmenter progressivement." },
      { id: "n3", name: "Tirage horizontal", sets: 4, reps: "8-12", rest: "1 min 30", note: "Même règle de progression." },
      { id: "n4", name: "Curl supination", sets: 4, reps: "8-12", rest: "1 min 30", note: "Même règle de progression." },
      { id: "n5", name: "Curl marteau", sets: 4, reps: "8-12", rest: "1 min 30", note: "Même règle de progression." },
    ],
  },
  {
    id: "nathan-2",
    weekday: "Mercredi",
    group: "Pecs & Triceps",
    nathan: true,
    exercises: [
      { id: "n6", name: "Dips", sets: 4, reps: "8-12", rest: "1 min 30", note: "Minimum 6 reps. Si trop difficile : élastique d'assistance. Objectif : 8–12 reps." },
      { id: "n7", name: "Développé couché", sets: 4, reps: "8-12", rest: "1 min 30", note: "Même règle de progression." },
      { id: "n8", name: "Chest Press", sets: 4, reps: "8-12", rest: "1 min 30", note: "Même règle de progression." },
      { id: "n9", name: "Pec Fly", sets: 4, reps: "8-12", rest: "1 min 30", note: "Même règle de progression." },
      { id: "n10", name: "Extension triceps à la poulie", sets: 4, reps: "8-12", rest: "1 min 30", note: "Même règle de progression." },
      { id: "n11", name: "Machine à triceps", sets: 4, reps: "8-12", rest: "1 min 30", note: "À confirmer selon le matériel. Si absente : autre exercice à définir." },
    ],
  },
  {
    id: "nathan-3",
    weekday: "Vendredi",
    group: "Jambes",
    nathan: true,
    exercises: [
      { id: "n12", name: "Squat", sets: 4, reps: "8-12", rest: "1 min 30", note: "Commencer au poids du corps. Si trop facile : ajouter progressivement une kettlebell. Vidéo demandée avant d'ajouter de la charge." },
      { id: "n13", name: "Presse à cuisses", sets: 4, reps: "8-12", rest: "1 min 30", note: "Même règle de progression." },
      { id: "n14", name: "Leg Curl", sets: 4, reps: "8-12", rest: "1 min 30", note: "Même règle de progression." },
      { id: "n15", name: "Leg Extension", sets: 4, reps: "8-12", rest: "1 min 30", note: "Même règle de progression." },
    ],
  },
  {
    id: "nathan-4",
    weekday: "Dimanche",
    group: "Cardio",
    nathan: true,
    exercises: [
      { id: "n16", name: "Cardio", sets: 1, reps: "20-30 min", rest: "—", note: "Vélo, rameur, tapis, elliptique, etc. Intensité 5–6/10 — modéré pour préserver la prise de masse." },
      { id: "n17", name: "Circuit abdos", sets: 1, reps: "10-15 min", rest: "—", note: "Vidéo YouTube adaptée au niveau (ex. Tibo InShape ou autre chaîne)." },
      { id: "n18", name: "Mobilité légère", sets: 1, reps: "5-10 min", rest: "—", note: "Optionnelle. Mobilité légère, sans créer de fatigue supplémentaire." },
    ],
  },
];

// ---------- Programme de David — cycle de 6 semaines, 4 séances/semaine ----------
const DAVID_INFO = {
  title: "Programme de DavidFourmi",
  cycle: "Cycle de 6 semaines • 4 séances par semaine",
  objectif: "Perdre du poids tout en conservant un maximum de masse musculaire. La sécurité du dos et la qualité technique sont prioritaires.",
  consignes: [
    { label: "Échauffement", text: "Avant chaque séance : échauffement articulaire puis cardio léger ≤ 10 min, à basse intensité." },
    { label: "Progression", text: "4 séries, objectif 8–12 reps. <8 reps → diminuer la charge. 8–12 → garder. >12 → augmenter progressivement. Se rapprocher de l'échec avec une technique propre." },
    { label: "Repos", text: "1 min 30 entre CHAQUE série." },
    { label: "Sécurité dos", text: "Douleur = arrêt immédiat. Ne jamais forcer à travers une douleur." },
    { label: "Technique", text: "En cas de doute sur la technique, la position ou une sensation inhabituelle : envoyer une vidéo pour vérification." },
    { label: "Dos", text: "Sur les exercices sollicitant davantage le dos : contrôle et bonne technique avant la recherche de l'échec." },
    { label: "Note", text: "Le squat sur banc / box squat est retiré du programme." },
  ],
};

const DAVID_PROGRAM = [
  {
    id: "david-1",
    weekday: "Lundi",
    group: "Dos & Biceps",
    david: true,
    exercises: [
      { id: "d1", name: "Tractions assistées / australiennes", sets: 4, reps: "8-12", rest: "1 min 30", note: "Minimum 6 reps. Si trop difficile : élastique, max 30 kg d'assistance. Si insuffisant : australiennes. Australiennes : <8 → avancer les pieds ; 8–12 → garder ; >12 → reculer les pieds." },
      { id: "d2", name: "Tirage vertical", sets: 4, reps: "8-12", rest: "1 min 30", note: "<8 → baisser la charge ; 8–12 → garder ; >12 → augmenter progressivement." },
      { id: "d3", name: "Tirage horizontal", sets: 4, reps: "8-12", rest: "1 min 30", note: "<8 → baisser ; 8–12 → garder ; >12 → augmenter progressivement. Priorité au contrôle." },
      { id: "d4", name: "Curl supination", sets: 4, reps: "8-12", rest: "1 min 30", note: "<8 → baisser ; 8–12 → garder ; >12 → augmenter progressivement." },
      { id: "d5", name: "Curl marteau", sets: 4, reps: "8-12", rest: "1 min 30", note: "<8 → baisser ; 8–12 → garder ; >12 → augmenter progressivement." },
    ],
  },
  {
    id: "david-2",
    weekday: "Mercredi",
    group: "Pecs & Triceps",
    david: true,
    exercises: [
      { id: "d6", name: "Dips assistés", sets: 4, reps: "8-12", rest: "1 min 30", note: "Minimum 6 reps. Si <6 → augmenter l'assistance. Puis viser 8–12 reps avec technique propre." },
      { id: "d7", name: "Développé couché", sets: 4, reps: "8-12", rest: "1 min 30", note: "<8 → baisser ; 8–12 → garder ; >12 → augmenter progressivement." },
      { id: "d8", name: "Chest Press", sets: 4, reps: "8-12", rest: "1 min 30", note: "Même règle de progression. Contrôle du mouvement." },
      { id: "d9", name: "Pec Fly", sets: 4, reps: "8-12", rest: "1 min 30", note: "Même règle de progression. Contrôle et amplitude confortable." },
      { id: "d10", name: "Extension triceps à la poulie", sets: 4, reps: "8-12", rest: "1 min 30", note: "Même règle de progression." },
      { id: "d11", name: "Machine à triceps", sets: 4, reps: "8-12", rest: "1 min 30", note: "À confirmer selon le matériel. Si absente : autre exercice à définir." },
    ],
  },
  {
    id: "david-3",
    weekday: "Vendredi",
    group: "Jambes",
    david: true,
    exercises: [
      { id: "d12", name: "Presse à cuisses", sets: 4, reps: "8-12", rest: "1 min 30", note: "Même règle de progression. Technique contrôlée." },
      { id: "d13", name: "Leg Curl", sets: 4, reps: "8-12", rest: "1 min 30", note: "Même règle de progression." },
      { id: "d14", name: "Leg Extension", sets: 4, reps: "8-12", rest: "1 min 30", note: "Même règle de progression." },
      { id: "d15", name: "Cardio", sets: 1, reps: "15-20 min", rest: "—", note: "Après les jambes. Intensité 5–6/10. Privilégier au départ une machine confortable : vélo ou elliptique." },
    ],
  },
  {
    id: "david-4",
    weekday: "Dimanche",
    group: "Cardio",
    david: true,
    exercises: [
      { id: "d16", name: "Cardio", sets: 1, reps: "30-35 min", rest: "—", note: "Vélo, rameur, tapis, elliptique, SkiErg ou autre machine disponible. Intensité 5–6/10." },
      { id: "d17", name: "Circuit abdos", sets: 1, reps: "10-15 min", rest: "—", note: "Vidéo YouTube adaptée au niveau (ex. Tibo InShape ou autre chaîne)." },
    ],
  },
];

const STORAGE_KEY_PROGRAM = "program:v3";
const STORAGE_KEY_LOGS = "logs:v3";
const STORAGE_KEY_PROGRESS = "progress:v3";
const STORAGE_KEY_WEIGHTS = "weights:v3"; // poids actuellement affiché par exercice
const STORAGE_KEY_WEIGHTLOGS = "weightlogs:v3"; // historique { exId: [{date, weight}] }
const STORAGE_KEY_VALIDATED = "validated:v3"; // dates ["2026-08-13", ...] où la séance a été validée
const STORAGE_KEY_NOTES = "notes:v3"; // { "2026-08-13": "texte" }
const STORAGE_KEY_REMINDERS = "reminders:v3"; // { enabled: true }
const STORAGE_KEY_MILESTONE = "milestone:v3"; // plus haut palier de streak déjà célébré
const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100, 200, 365];

function parseRepsNumber(reps) {
  if (!reps) return null;
  const m = String(reps).match(/\d+/);
  return m ? Number(m[0]) : null;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function todayWeekdayFR() {
  const idx = (new Date().getDay() + 6) % 7;
  return WEEKDAYS[idx];
}

// ---------- Week helpers, for the "Semaine 1 / Semaine 2..." progression view ----------
function isoWeekKey(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getFullYear()}-W${weekNo}`;
}

// Collapses a raw {date, weight} history into one point per calendar week
// (keeping the latest weight logged that week), then labels them
// chronologically as "Semaine 1", "Semaine 2"... the way the user thinks about it.
function weeklySeries(history) {
  const byWeek = new Map();
  for (const h of [...history].sort((a, b) => (a.date < b.date ? -1 : 1))) {
    byWeek.set(isoWeekKey(h.date), { ...h });
  }
  return Array.from(byWeek.values()).map((h, i) => ({ ...h, label: `Semaine ${i + 1}` }));
}

// ---------- Logo de l'application ----------
// Un halo flamme + barre de musculation stylisée, dans le même esprit que
// les pictogrammes de l'app : trait net, teinte accent, fond sombre en badge.
// ---------- Décor de fond, présent sur tout l'écran ----------
// Un motif discret d'haltères et de flammes qui se répète, très peu opaque,
// pour que l'appli ne paraisse jamais vide — quel que soit l'écran affiché.
function DecorBackground() {
  return (
    <svg
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="decorPattern" width="140" height="140" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
          <g stroke="var(--accent)" fill="none" strokeWidth="2" opacity="0.05">
            <line x1="15" y1="30" x2="45" y2="30" strokeWidth="3" strokeLinecap="round" />
            <rect x="8" y="24" width="8" height="12" rx="2" fill="var(--accent)" stroke="none" />
            <rect x="44" y="24" width="8" height="12" rx="2" fill="var(--accent)" stroke="none" />
          </g>
          <path
            d="M100 90 C104 96 107 100 107 105 C107 110 103 114 100 114 C97 114 93 110 93 105 C93 102 95 100 97 97 C97 100 99 101 99 99 C99 96 98 94 100 90 Z"
            fill="var(--accent)"
            opacity="0.05"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#decorPattern)" />
    </svg>
  );
}

function AppLogo({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-dark)" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="92" height="92" rx="24" fill="#15181B" stroke="url(#logoGrad)" strokeWidth="3" />
      {/* barre de musculation en arc de cercle, portée par la flamme */}
      <g>
        <circle cx="27" cy="50" r="10" fill="none" stroke="url(#logoGrad)" strokeWidth="5" />
        <circle cx="73" cy="50" r="10" fill="none" stroke="url(#logoGrad)" strokeWidth="5" />
        <line x1="37" y1="50" x2="63" y2="50" stroke="url(#logoGrad)" strokeWidth="6" strokeLinecap="round" />
      </g>
      {/* flamme au centre, symbole de la série/streak */}
      <path
        d="M50 27 C56 35 60 40 60 47 C60 54 55 59 50 59 C45 59 40 54 40 47 C40 43 42 40 45 36 C45 41 48 42 48 39 C48 35 46 32 50 27 Z"
        fill="url(#logoGrad)"
      />
    </svg>
  );
}

// Variante 2 : badge hexagonal avec un biceps flexé en silhouette pleine —
// écho direct de l'animation du splash, mais simplifié pour rester lisible
// en petit format dans l'en-tête.
function AppLogoDumbbell({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="logoGrad2" x1="20" y1="30" x2="80" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFDBA3" />
          <stop offset="45%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-dark)" />
        </linearGradient>
        <linearGradient id="plateGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E8ECEF" />
          <stop offset="55%" stopColor="#AFB6BC" />
          <stop offset="100%" stopColor="#6B7278" />
        </linearGradient>
        <radialGradient id="badgeGlow" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <filter id="armShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* badge hexagonal, avec une légère lueur interne */}
      <path d="M50 3 L92 26 V74 L50 97 L8 74 V26 Z" fill="#15181B" stroke="url(#logoGrad2)" strokeWidth="3.5" />
      <path d="M50 7 L88 28 V72 L50 93 L12 72 V28 Z" fill="url(#badgeGlow)" />

      {/* haltère centré */}
      <g filter="url(#armShadow)">
        {/* barre centrale */}
        <rect x="30" y="45" width="40" height="10" rx="3" fill="url(#logoGrad2)" />
        {/* manchons */}
        <rect x="24" y="41" width="8" height="18" rx="2.5" fill="url(#logoGrad2)" />
        <rect x="68" y="41" width="8" height="18" rx="2.5" fill="url(#logoGrad2)" />
        {/* disques, dégradé chromé */}
        <rect x="12" y="28" width="14" height="44" rx="6" fill="url(#plateGrad)" stroke="#4A4F54" strokeWidth="1.5" />
        <rect x="74" y="28" width="14" height="44" rx="6" fill="url(#plateGrad)" stroke="#4A4F54" strokeWidth="1.5" />
      </g>

      {/* reliefs : reflets sur la barre et les disques */}
      <rect x="34" y="47" width="32" height="2.5" rx="1.2" fill="#FFF3DD" opacity="0.4" />
      <rect x="15" y="32" width="4" height="14" rx="2" fill="#FFFFFF" opacity="0.45" />
      <rect x="77" y="32" width="4" height="14" rx="2" fill="#FFFFFF" opacity="0.45" />
    </svg>
  );
}

// ---------- Écran de lancement ----------
// Bras stylisé qui fait un curl : avant-bras plié progressivement autour du
// coude, biceps qui gonfle en même temps — l'animation d'intro de l'app.
function CurlLogo({ size = 140 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="skinGrad" x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#E7B48A" />
          <stop offset="55%" stopColor="#D29964" />
          <stop offset="100%" stopColor="#AD7444" />
        </linearGradient>
        <radialGradient id="bicepShade" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#F0C79C" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#D29964" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dumbbellGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E4E8EB" />
          <stop offset="100%" stopColor="#6B7278" />
        </linearGradient>
      </defs>

      {/* moignon très court, juste pour ancrer le biceps — pas de corps */}
      <circle cx="60" cy="72" r="14" fill="url(#skinGrad)" />

      {/* biceps organique (pas un cercle parfait), qui gonfle */}
      <path
        className="bicep-bulge"
        d="M48 45
           C46 36 54 29 64 30
           C75 31 82 39 81 49
           C80 58 73 65 63 66
           C53 67 50 55 48 45 Z"
        fill="url(#skinGrad)"
      />
      <path className="bicep-bulge" d="M50 42 C50 35 57 30 65 31 C72 32 77 37 78 44 C71 40 60 39 50 42 Z" fill="url(#bicepShade)" />
      {/* plis de muscle, subtils */}
      <path className="bicep-bulge" d="M53 55 Q65 63 76 54" stroke="#9C6539" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.4" />
      <path className="bicep-bulge" d="M55 60 Q65 66 74 59" stroke="#9C6539" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.3" />

      {/* avant-bras + poing + haltère, pivote autour du coude */}
      <g className="forearm-group" style={{ transformOrigin: "54px 50px" }}>
        <path
          d="M47 48
             C46 48 44 50 44 54
             L41 82
             C40 89 46 95 55 95
             C64 95 70 89 69 82
             L67 54
             C67 50 65 48 63 48 Z"
          fill="url(#skinGrad)"
        />
        {/* poing */}
        <circle cx="55" cy="93" r="14" fill="url(#skinGrad)" />
        <ellipse cx="50" cy="87" rx="4.5" ry="3.5" fill="#F0C79C" opacity="0.7" />
        <path d="M43 92 Q55 100 67 92" stroke="#9C6539" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.35" />
        <path d="M47 84 L47 90 M55 82 L55 89 M63 84 L63 90" stroke="#9C6539" strokeWidth="1" opacity="0.25" strokeLinecap="round" />
        {/* haltère tenu dans le poing */}
        <rect x="27" y="86" width="10" height="15" rx="3" fill="url(#dumbbellGrad2)" />
        <rect x="73" y="86" width="10" height="15" rx="3" fill="url(#dumbbellGrad2)" />
        <rect x="33" y="90" width="44" height="6" rx="3" fill="url(#dumbbellGrad2)" />
      </g>
    </svg>
  );
}

// Plantes grises décoratives en fond de l'écran de lancement — purement
// esthétiques, en camaïeu de gris discret pour ne pas voler la vedette.
// On en met beaucoup, réparties sur tous les bords, pour un effet "feuillage dense".
function LeafCluster({ stemD, leaves, style }) {
  const leafPath = "M0 0 C 10 -18, 26 -22, 34 -40 C 24 -34, 12 -30, 0 0 Z";
  return (
    <svg width="160" height="200" viewBox="0 0 160 200" style={{ position: "absolute", ...style }}>
      <g stroke="#3A3F45" strokeWidth="2" fill="#2A2E33">
        <path d={stemD} fill="none" />
        {leaves.map((l, i) => (
          <path key={i} d={leafPath} transform={`translate(${l[0]},${l[1]}) rotate(${l[2]}) scale(${l[3]})`} />
        ))}
      </g>
    </svg>
  );
}

function GrayPlants() {
  const clusters = [
    // bas gauche, grand bouquet
    { stemD: "M20 200 C 18 150 30 110 55 82", leaves: [[30,140,-30,1.3],[45,112,20,1.5],[55,82,-60,1.1],[38,165,100,1.2],[22,120,150,0.9]], style: { bottom: -30, left: -35, opacity: 0.55 } },
    // haut droit
    { stemD: "M140 0 C 138 45 120 80 95 100", leaves: [[130,25,150,1.2],[115,55,210,1.4],[95,100,120,1.1],[120,80,260,1],[135,10,320,0.9]], style: { top: -35, right: -30, opacity: 0.45 } },
    // bas droit
    { stemD: "M140 200 C 138 155 120 120 95 95", leaves: [[130,150,140,1.1],[112,125,200,1.3],[95,95,110,1],[122,110,250,0.9]], style: { bottom: -35, right: -30, opacity: 0.4 } },
    // haut gauche
    { stemD: "M20 0 C 22 40 38 70 60 90", leaves: [[28,25,-140,1],[45,55,-190,1.2],[60,90,-110,0.9],[35,10,-250,0.8]], style: { top: -30, left: -30, opacity: 0.35 } },
    // milieu bord gauche
    { stemD: "M10 100 C 12 130 22 150 40 165", leaves: [[16,120,-20,0.8],[28,145,30,1],[40,165,-70,0.7]], style: { top: "38%", left: -55, opacity: 0.3 } },
    // milieu bord droit
    { stemD: "M150 90 C 148 120 138 140 120 155", leaves: [[144,110,160,0.8],[132,135,210,0.95],[120,155,130,0.7]], style: { top: "42%", right: -55, opacity: 0.28 } },
    // bas centre gauche, petit
    { stemD: "M60 200 C 58 175 64 155 78 140", leaves: [[64,165,-40,0.7],[74,148,10,0.8]], style: { bottom: -60, left: "18%", opacity: 0.25 } },
    // bas centre droit, petit
    { stemD: "M100 200 C 102 175 96 155 82 140", leaves: [[96,165,40,0.7],[86,148,-10,0.8]], style: { bottom: -60, right: "16%", opacity: 0.22 } },
    // haut centre, petit, discret
    { stemD: "M75 0 C 77 20 82 34 92 44", leaves: [[80,18,-160,0.6],[88,36,-100,0.65]], style: { top: -50, left: "42%", opacity: 0.18 } },
  ];
  return (
    <>
      {clusters.map((c, i) => (
        <LeafCluster key={i} stemD={c.stemD} leaves={c.leaves} style={c.style} />
      ))}
    </>
  );
}

function SplashScreen({ leaving }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "#111417",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.4s ease",
        pointerEvents: leaving ? "none" : "auto",
        overflow: "hidden",
      }}
    >
      <FontLoader />
      <GrayPlants />
      <div style={{ "--accent": "#F37121", "--accent-dark": "#C2560F", position: "relative", width: 160, height: 130, zIndex: 1 }}>
        <div className="curl-logo-wrap" style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)" }}>
          <span className="trail" />
          <CurlLogo size={112} />
        </div>
        <div className="bonne-seance" style={{ position: "absolute", top: 40, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", textAlign: "center" }}>
          <div style={{ fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: 42, color: "#F5F6F3", lineHeight: 1 }}>
            Bonne séance 💪
          </div>
        </div>
      </div>
      <div className="splash-dots" style={{ display: "flex", gap: 6, marginTop: 30, zIndex: 1 }}>
        <span className="splash-dot" style={{ animationDelay: "0s" }} />
        <span className="splash-dot" style={{ animationDelay: "0.15s" }} />
        <span className="splash-dot" style={{ animationDelay: "0.3s" }} />
      </div>
    </div>
  );
}

function TallyMarks({ done, total }) {
  const strokes = [];
  for (let i = 0; i < total; i++) {
    strokes.push(
      <span
        key={i}
        style={{
          display: "inline-block",
          width: 4,
          height: 22,
          marginRight: 4,
          borderRadius: 2,
          background: i < done ? "var(--accent)" : "rgba(244,241,234,0.15)",
          transform: i % 5 === 4 ? "rotate(28deg) translate(-6px,-2px)" : "none",
          transformOrigin: "bottom",
          transition: "background 0.25s ease",
        }}
      />
    );
  }
  return <div style={{ display: "flex", alignItems: "flex-end" }}>{strokes}</div>;
}

export default function SportApp() {
  const [view, setView] = useState("accueil"); // accueil | jour | creer
  const [openDay, setOpenDay] = useState(null);
  const [program, setProgram] = useState(DEFAULT_PROGRAM);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState({});
  const [weights, setWeights] = useState({});
  const [weightLogs, setWeightLogs] = useState({});
  const [validatedDays, setValidatedDays] = useState([]);
  const [notes, setNotes] = useState({});
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [milestoneSeen, setMilestoneSeen] = useState(0);
  const [celebrating, setCelebrating] = useState(null);
  const [pendingDetail, setPendingDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [splashLeaving, setSplashLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setSplashLeaving(true), 5000);
    const t2 = setTimeout(() => setShowSplash(false), 5400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const p = await storage.get(STORAGE_KEY_LOGS);
        if (p) setLogs(JSON.parse(p.value));
      } catch (e) {}
      try {
        const pr = await storage.get(STORAGE_KEY_PROGRESS);
        if (pr) setProgress(JSON.parse(pr.value));
      } catch (e) {}
      try {
        const prog = await storage.get(STORAGE_KEY_PROGRAM);
        if (prog) setProgram(JSON.parse(prog.value));
      } catch (e) {}
      try {
        const w = await storage.get(STORAGE_KEY_WEIGHTS);
        if (w) setWeights(JSON.parse(w.value));
      } catch (e) {}
      try {
        const wl = await storage.get(STORAGE_KEY_WEIGHTLOGS);
        if (wl) setWeightLogs(JSON.parse(wl.value));
      } catch (e) {}
      try {
        const v = await storage.get(STORAGE_KEY_VALIDATED);
        if (v) setValidatedDays(JSON.parse(v.value));
      } catch (e) {}
      try {
        const n = await storage.get(STORAGE_KEY_NOTES);
        if (n) setNotes(JSON.parse(n.value));
      } catch (e) {}
      try {
        const rem = await storage.get(STORAGE_KEY_REMINDERS);
        if (rem) setRemindersEnabled(JSON.parse(rem.value).enabled);
      } catch (e) {}
      try {
        const ms = await storage.get(STORAGE_KEY_MILESTONE);
        if (ms) setMilestoneSeen(JSON.parse(ms.value));
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(async (key, value) => {
    try {
      await storage.set(key, JSON.stringify(value));
    } catch (e) {
      console.error("Erreur de sauvegarde", e);
    }
  }, []);

  const bumpSet = (ex, weekday) => {
    const exId = ex.id;
    const key = `${todayISO()}:${exId}`;
    const current = progress[key] || 0;
    if (current >= ex.sets) return;
    const next = { ...progress, [key]: current + 1 };
    setProgress(next);
    persist(STORAGE_KEY_PROGRESS, next);
    if (current + 1 === ex.sets) {
      const entry = { id: uid(), date: todayISO(), exerciseId: exId, exerciseName: ex.name, weekday };
      const nextLogs = [entry, ...logs];
      setLogs(nextLogs);
      persist(STORAGE_KEY_LOGS, nextLogs);
    }
    // Enregistre un point de progression (poids + volume) pour cet exercice
    const w = Number(weights[exId]);
    if (w > 0) {
      const history = weightLogs[exId] || [];
      const repsNum = parseRepsNumber(ex.reps);
      const volume = repsNum ? ex.sets * repsNum * w : null;
      const withoutToday = history.filter((h) => h.date !== todayISO());
      const nextHistory = [...withoutToday, { date: todayISO(), weight: w, volume }].sort((a, b) => (a.date < b.date ? -1 : 1));
      const nextWeightLogs = { ...weightLogs, [exId]: nextHistory };
      setWeightLogs(nextWeightLogs);
      persist(STORAGE_KEY_WEIGHTLOGS, nextWeightLogs);
    }
  };

  const setWeight = (exId, value) => {
    const next = { ...weights, [exId]: value };
    setWeights(next);
    persist(STORAGE_KEY_WEIGHTS, next);
  };

  const logEvolution = (exId, weightValue, exercise) => {
    const w = Number(weightValue);
    if (!(w > 0)) return;
    setWeight(exId, String(w));
    const history = weightLogs[exId] || [];
    const repsNum = exercise ? parseRepsNumber(exercise.reps) : null;
    const volume = exercise && repsNum ? exercise.sets * repsNum * w : null;
    const withoutToday = history.filter((h) => h.date !== todayISO());
    const nextHistory = [...withoutToday, { date: todayISO(), weight: w, volume }].sort((a, b) => (a.date < b.date ? -1 : 1));
    const nextWeightLogs = { ...weightLogs, [exId]: nextHistory };
    setWeightLogs(nextWeightLogs);
    persist(STORAGE_KEY_WEIGHTLOGS, nextWeightLogs);
  };

  const resetSet = (exId) => {
    const key = `${todayISO()}:${exId}`;
    if (!(key in progress)) return;
    const next = { ...progress };
    delete next[key];
    setProgress(next);
    persist(STORAGE_KEY_PROGRESS, next);
    const nextLogs = logs.filter((l) => !(l.date === todayISO() && l.exerciseId === exId));
    setLogs(nextLogs);
    persist(STORAGE_KEY_LOGS, nextLogs);
  };

  const saveSession = (weekday, group, exercises) => {
    const withoutThatDay = program.filter((b) => b.weekday !== weekday);
    const newBlock = { id: uid(), weekday, group, exercises: exercises.map((ex) => ({ id: uid(), ...ex })), custom: true };
    const next = [...withoutThatDay, newBlock];
    setProgram(next);
    persist(STORAGE_KEY_PROGRAM, next);
    setOpenDay(weekday);
    setView("jour");
  };

  const clearDay = (weekday) => {
    const next = program.filter((b) => b.weekday !== weekday);
    setProgram(next);
    persist(STORAGE_KEY_PROGRAM, next);
  };

  const loadNathanProgram = () => {
    const withGeneratedIds = NATHAN_PROGRAM.map((block) => ({
      ...block,
      id: uid(),
      exercises: block.exercises.map((ex) => ({ ...ex, id: uid() })),
    }));
    setProgram(withGeneratedIds);
    persist(STORAGE_KEY_PROGRAM, withGeneratedIds);
    setView("accueil");
  };

  const loadDavidProgram = () => {
    const withGeneratedIds = DAVID_PROGRAM.map((block) => ({
      ...block,
      id: uid(),
      exercises: block.exercises.map((ex) => ({ ...ex, id: uid() })),
    }));
    setProgram(withGeneratedIds);
    persist(STORAGE_KEY_PROGRAM, withGeneratedIds);
    setView("accueil");
  };

  const validateSession = () => {
    if (validatedDays.includes(todayISO())) return;
    const next = [...validatedDays, todayISO()];
    setValidatedDays(next);
    persist(STORAGE_KEY_VALIDATED, next);

    // Vérifie si valider aujourd'hui fait franchir un palier de série.
    const newStreak = computeStreakFrom(next);
    const milestone = [...STREAK_MILESTONES].reverse().find((m) => newStreak >= m);
    if (milestone && milestone > milestoneSeen) {
      setMilestoneSeen(milestone);
      persist(STORAGE_KEY_MILESTONE, milestone);
      setCelebrating(milestone);
      setTimeout(() => setCelebrating(null), 3200);
    }
  };

  const computeStreakFrom = (validatedList) => {
    let count = 0;
    let cursor = new Date();
    for (;;) {
      const iso = cursor.toISOString().slice(0, 10);
      const idx = (cursor.getDay() + 6) % 7;
      const weekday = WEEKDAYS[idx];
      const hasSession = !!program.find((b) => b.weekday === weekday);
      if (hasSession) {
        if (validatedList.includes(iso)) {
          count++;
        } else if (iso === todayISO()) {
          // rien
        } else {
          break;
        }
      }
      cursor.setDate(cursor.getDate() - 1);
      if (count > 365) break;
    }
    return count;
  };

  const setNoteForToday = (text) => {
    const next = { ...notes, [todayISO()]: text };
    setNotes(next);
    persist(STORAGE_KEY_NOTES, next);
  };

  const toggleReminders = async () => {
    const next = !remindersEnabled;
    if (next && "Notification" in window) {
      try {
        const perm = await Notification.requestPermission();
        if (perm === "granted") {
          new Notification("Rappels activés 💪", { body: "On te préviendra les jours de séance." });
        }
      } catch (e) {}
    }
    setRemindersEnabled(next);
    persist(STORAGE_KEY_REMINDERS, { enabled: next });
  };

  // Rappel "best effort" à l'ouverture de l'appli : si les rappels sont
  // activés et que la séance du jour n'est pas encore validée, on tente une
  // notification. Comme tout artefact web, ça ne peut pas se déclencher en
  // arrière-plan quand l'appli est fermée — seulement quand elle est ouverte.
  useEffect(() => {
    if (!remindersEnabled || loading) return;
    const todayBlock = program.find((b) => b.weekday === todayWeekdayFR());
    if (todayBlock && !validatedDays.includes(todayISO()) && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification("Séance du jour 🏋️", { body: `${todayBlock.group} t'attend — n'oublie pas de valider !` });
      } catch (e) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // Consecutive-day streak, counted back from today. A rest day (no session
  // programmed) doesn't break the chain; a training day only keeps it alive
  // if it was explicitly validated.
  const computeStreak = () => computeStreakFrom(validatedDays);

  if (loading) {
    return (
      <div style={rootStyle}>
        <FontLoader />
        <DecorBackground />
        {showSplash && <SplashScreen leaving={splashLeaving} />}
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "28px 18px", position: "relative", zIndex: 1 }}>
          <div className="skeleton" style={{ width: 160, height: 26, borderRadius: 8, marginBottom: 24 }} />
          <div className="skeleton" style={{ width: "100%", height: 70, borderRadius: 16, marginBottom: 10 }} />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton" style={{ width: "100%", height: 60, borderRadius: 12, marginBottom: 8 }} />
          ))}
        </div>
      </div>
    );
  }

  const sessionForDay = (day) => program.find((b) => b.weekday === day);
  const today = todayWeekdayFR();
  const streak = computeStreak();
  const validatedToday = validatedDays.includes(todayISO());
  const tabViews = ["accueil", "evolution", "muscles", "chrono"];
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 5) return "Encore debout ?";
    if (h < 12) return "Bonjour";
    if (h < 18) return "Bon après-midi";
    return "Bonsoir";
  };
  const titles = {
    accueil: greeting(),
    evolution: "Ta progression",
    muscles: "Ce que tu travailles",
    chrono: "Minuteur de repos",
    nathan: "",
    david: "",
    jour: "",
    creer: "",
  };

  return (
    <div style={rootStyle}>
      <FontLoader />
      <DecorBackground />
      {showSplash && <SplashScreen leaving={splashLeaving} />}
      <div key={view} className="view-transition" style={{ maxWidth: 640, margin: "0 auto", padding: "28px 18px 100px", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AppLogoDumbbell size={38} />
            <div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 24, letterSpacing: "-0.5px", color: "var(--text)", lineHeight: 1.05 }}>
                MA SEMAINE
              </div>
              <div style={{ color: "var(--text-muted)", fontFamily: "Inter", fontSize: 12.5, marginTop: 3 }}>
                {titles[view]}
              </div>
            </div>
          </div>
          {!tabViews.includes(view) && (
            <button onClick={() => setView(tabViews.includes(view) ? view : "accueil")} style={backBtnStyle}>
              ← Retour
            </button>
          )}
        </div>

        {view === "accueil" && (
          <AccueilView
            program={program}
            today={today}
            streak={streak}
            validatedDays={validatedDays}
            remindersEnabled={remindersEnabled}
            toggleReminders={toggleReminders}
            onOpenDay={(day) => {
              setOpenDay(day);
              setView("jour");
            }}
            onOpenNathan={() => setView("nathan")}
            onOpenDavid={() => setView("david")}
          />
        )}

        {view === "evolution" && (
          <EvolutionView
            program={program}
            weightLogs={weightLogs}
            streak={streak}
            onOpenExercise={(day, exId) => {
              setOpenDay(day);
              setView("jour");
              setPendingDetail(exId);
            }}
          />
        )}

        {view === "muscles" && (
          <MusclesView program={program} validatedDays={validatedDays} today={today} />
        )}

        {view === "chrono" && <ChronoView />}

        {view === "nathan" && <NathanView onLoad={loadNathanProgram} isLoaded={program.some((b) => b.nathan)} />}

        {view === "david" && <DavidView onLoad={loadDavidProgram} isLoaded={program.some((b) => b.david)} />}

        {view === "jour" && (
          <JourView
            weekday={openDay}
            isToday={openDay === today}
            block={sessionForDay(openDay)}
            progress={progress}
            bumpSet={bumpSet}
            resetSet={resetSet}
            clearDay={clearDay}
            onCreer={() => setView("creer")}
            weights={weights}
            setWeight={setWeight}
            weightLogs={weightLogs}
            logEvolution={logEvolution}
            validateSession={validateSession}
            validatedToday={validatedToday}
            initialDetail={pendingDetail}
            onDetailOpened={() => setPendingDetail(null)}
            noteValue={notes[todayISO()] || ""}
            setNoteForToday={setNoteForToday}
          />
        )}

        {view === "creer" && <CreerView saveSession={saveSession} defaultDay={openDay} />}
      </div>

      <BottomNav active={tabViews.includes(view) ? view : null} onChange={(v) => { setPendingDetail(null); setView(v); }} />
      {celebrating && <MilestoneCelebration milestone={celebrating} onClose={() => setCelebrating(null)} />}
    </div>
  );
}

function MilestoneCelebration({ milestone, onClose }) {
  const confettiPieces = Array.from({ length: 24 });
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, overflow: "hidden" }}
    >
      {confettiPieces.map((_, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: "-5%",
            left: `${(i * 97) % 100}%`,
            fontSize: 18 + (i % 4) * 6,
            animation: `confettiFall ${1.6 + (i % 5) * 0.3}s ease-in ${(i % 6) * 0.08}s forwards`,
          }}
        >
          {["🎉", "🔥", "⭐", "🏆"][i % 4]}
        </span>
      ))}
      <div className="modal-pop" style={{ background: "var(--surface)", borderRadius: 20, padding: "34px 30px", textAlign: "center", maxWidth: 300 }}>
        <div style={{ fontSize: 46 }}>🔥</div>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 26, color: "var(--accent)", marginTop: 8 }}>{milestone} jours</div>
        <div style={{ fontFamily: "Inter", fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>
          Palier de série atteint — continue comme ça !
        </div>
      </div>
    </div>
  );
}

function BottomNav({ active, onChange }) {
  const items = [
    { key: "accueil", label: "Jours", icon: "calendar" },
    { key: "evolution", label: "Évolution", icon: "chart" },
    { key: "muscles", label: "Muscles", icon: "body" },
    { key: "chrono", label: "Chrono", icon: "timer" },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--surface)", borderTop: "1px solid var(--surface-raised)", display: "flex", justifyContent: "center", zIndex: 10 }}>
      <div style={{ maxWidth: 640, width: "100%", display: "flex" }}>
        {items.map((it) => {
          const isActive = active === it.key;
          return (
            <button
              key={it.key}
              onClick={() => onChange(it.key)}
              style={{ flex: 1, border: "none", background: "none", padding: "10px 0 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", color: isActive ? "var(--accent)" : "var(--text-muted)" }}
            >
              <NavIcon type={it.icon} active={isActive} />
              <span style={{ fontFamily: "Inter", fontSize: 10.5, fontWeight: 700 }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NavIcon({ type, active }) {
  const c = active ? "var(--accent)" : "var(--text-muted)";
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none" };
  if (type === "calendar")
    return (
      <svg {...common}>
        <rect x="4" y="5" width="16" height="15" rx="2" stroke={c} strokeWidth="2" />
        <line x1="4" y1="10" x2="20" y2="10" stroke={c} strokeWidth="2" />
        <line x1="8" y1="3" x2="8" y2="7" stroke={c} strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="3" x2="16" y2="7" stroke={c} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  if (type === "chart")
    return (
      <svg {...common}>
        <line x1="5" y1="20" x2="5" y2="12" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="12" y1="20" x2="12" y2="6" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="19" y1="20" x2="19" y2="15" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  if (type === "timer")
    return (
      <svg {...common}>
        <circle cx="12" cy="13" r="8" stroke={c} strokeWidth="2" />
        <path d="M12 13 L12 8" stroke={c} strokeWidth="2" strokeLinecap="round" />
        <path d="M12 13 L15.5 15" stroke={c} strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="2" x2="14" y2="2" stroke={c} strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="2" x2="12" y2="5" stroke={c} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg {...common}>
      <circle cx="12" cy="5" r="2.4" stroke={c} strokeWidth="2" />
      <path d="M12 8 L12 15" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <path d="M7 11 L12 9 L17 11" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M12 15 L8 21" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <path d="M12 15 L16 21" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ---------- Chrono : minuteur de repos entre les séries ----------
function ChronoView() {
  const PRESETS = [30, 60, 90, 120, 180];
  const [duration, setDuration] = useState(90);
  const [remaining, setRemaining] = useState(90);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            try {
              if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            } catch (e) {}
            playBeep();
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  // "Ding" façon clochette : deux harmoniques (fondamentale + quinte) avec
  // une attaque nette et une résonance qui s'éteint doucement, joué deux fois.
  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const ding = (delay) => {
        const startAt = ctx.currentTime + delay;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(0.28, startAt + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 1.1);
        gain.connect(ctx.destination);

        const fundamental = ctx.createOscillator();
        fundamental.type = "sine";
        fundamental.frequency.setValueAtTime(1046.5, startAt); // Do6
        fundamental.connect(gain);
        fundamental.start(startAt);
        fundamental.stop(startAt + 1.1);

        const fifth = ctx.createOscillator();
        fifth.type = "sine";
        fifth.frequency.setValueAtTime(1568, startAt); // quinte, timbre de clochette
        const fifthGain = ctx.createGain();
        fifthGain.gain.setValueAtTime(0.12, startAt);
        fifthGain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.7);
        fifth.connect(fifthGain).connect(ctx.destination);
        fifth.start(startAt);
        fifth.stop(startAt + 0.7);
      };
      ding(0);
      ding(0.35);
    } catch (e) {}
  };

  const choosePreset = (s) => {
    setDuration(s);
    setRemaining(s);
    setRunning(false);
  };

  const adjust = (delta) => {
    const next = Math.max(5, remaining + delta);
    setRemaining(next);
    setDuration(next);
  };

  const toggle = () => {
    if (remaining === 0) {
      setRemaining(duration);
      setRunning(true);
    } else {
      setRunning((r) => !r);
    }
  };

  const reset = () => {
    setRunning(false);
    setRemaining(duration);
  };

  const pct = duration > 0 ? remaining / duration : 0;
  const R = 90;
  const C = 2 * Math.PI * R;
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="track-bg" style={{ borderRadius: 20, padding: "30px 20px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden" }}>
        {/* petites touches déco pour ne pas laisser le fond trop vide */}
        <div style={{ position: "absolute", top: 14, left: 16, opacity: 0.22 }}>
          <Pictogram icon="dumbbell" size={26} />
        </div>
        <div style={{ position: "absolute", top: 14, right: 16, opacity: 0.22, transform: "scaleX(-1)" }}>
          <Pictogram icon="dumbbell" size={26} />
        </div>
        <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", opacity: 0.14, fontSize: 46, lineHeight: 1 }}>
          ⏱
        </div>

        {/* anneaux concentriques discrets derrière le cercle, pour la profondeur */}
        <svg width="260" height="260" viewBox="0 0 260 260" style={{ position: "absolute", top: 14, opacity: 0.25 }}>
          <circle cx="130" cy="130" r="118" fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="2 6" />
          <circle cx="130" cy="130" r="128" fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="1 8" />
        </svg>

        <div style={{ position: "relative", width: 220, height: 220 }}>
          <svg width="220" height="220" viewBox="0 0 220 220">
            <circle cx="110" cy="110" r={R} fill="none" stroke="var(--surface-raised)" strokeWidth="12" />
            <circle
              cx="110"
              cy="110"
              r={R}
              fill="none"
              stroke={remaining === 0 ? "var(--success)" : "var(--accent)"}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct)}
              transform="rotate(-90 110 110)"
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s ease" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 40, fontWeight: 700, color: "var(--text)" }}>{mm}:{ss}</div>
            <div style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-muted)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {remaining === 0 ? "Repos terminé" : running ? "Repos en cours" : "En pause"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 22 }}>
          <button onClick={() => adjust(-15)} style={roundBtnStyle}>−15s</button>
          <button
            onClick={toggle}
            style={{
              border: "none",
              borderRadius: "50%",
              width: 64,
              height: 64,
              fontSize: 22,
              cursor: "pointer",
              background: running ? "var(--surface-raised)" : "linear-gradient(120deg, var(--accent), var(--accent-dark))",
              color: running ? "var(--text)" : "#12161A",
              boxShadow: running ? "none" : "0 6px 18px rgba(243,113,33,0.3)",
            }}
          >
            {running ? "⏸" : "▶"}
          </button>
          <button onClick={() => adjust(15)} style={roundBtnStyle}>+15s</button>
        </div>

        <button onClick={reset} style={{ border: "none", background: "none", color: "var(--text-muted)", fontFamily: "Inter", fontSize: 11.5, marginTop: 14, cursor: "pointer", textDecoration: "underline" }}>
          Réinitialiser
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap", justifyContent: "center" }}>
        {PRESETS.map((s) => (
          <button
            key={s}
            onClick={() => choosePreset(s)}
            style={{
              border: duration === s ? "1px solid var(--accent)" : "1px solid var(--surface-raised)",
              borderRadius: 20,
              padding: "9px 16px",
              fontFamily: "Inter",
              fontWeight: 700,
              fontSize: 12.5,
              cursor: "pointer",
              background: duration === s ? "rgba(243,113,33,0.10)" : "var(--surface)",
              color: duration === s ? "var(--accent)" : "var(--text)",
            }}
          >
            {s === 180 ? "3min" : `${s}s`}
          </button>
        ))}
      </div>

      <ChronoQuote />
    </div>
  );
}

function ChronoQuote() {
  const quotes = [
    "Le repos fait aussi partie de la performance.",
    "Respire, hydrate-toi, la prochaine série t'attend.",
    "Chaque seconde de repos compte pour la suivante.",
    "La récupération, c'est où le muscle se construit.",
    "Patience — la charge suivante sera meilleure.",
  ];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const quote = quotes[dayOfYear % quotes.length];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 24, opacity: 0.7 }}>
      <span style={{ fontSize: 14 }}>🔥</span>
      <span style={{ fontFamily: "Inter", fontSize: 11.5, fontStyle: "italic", color: "var(--text-muted)" }}>{quote}</span>
    </div>
  );
}
const roundBtnStyle = {
  border: "none",
  borderRadius: 20,
  padding: "9px 14px",
  fontFamily: "Inter",
  fontWeight: 600,
  fontSize: 12.5,
  background: "var(--surface-raised)",
  color: "var(--text)",
  cursor: "pointer",
};

// ---------- Évolution : vue d'ensemble de tous les poids suivis ----------
function EvolutionView({ program, weightLogs, streak, onOpenExercise }) {
  const rows = [];
  program.forEach((block) => {
    block.exercises.forEach((ex) => {
      const history = weightLogs[ex.id] || [];
      if (history.length === 0) return;
      const weeks = weeklySeries(history);
      const first = weeks[0].weight;
      const last = weeks[weeks.length - 1].weight;
      const maxEver = Math.max(...history.map((h) => h.weight));
      const totalVolume = history.reduce((sum, h) => sum + (h.volume || 0), 0);
      rows.push({ ex, block, weeks, first, last, delta: last - first, isPR: last === maxEver && last > first, totalVolume });
    });
  });

  const grandTotalVolume = rows.reduce((sum, r) => sum + r.totalVolume, 0);
  const prCount = rows.filter((r) => r.isPR).length;

  if (rows.length === 0) {
    return (
      <div style={{ background: "var(--surface)", borderRadius: 14, padding: "34px 18px", textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>📈</div>
        <div style={{ fontFamily: "Inter", fontSize: 13.5, color: "var(--text-muted)" }}>
          Aucune charge enregistrée pour l'instant. Ouvre un exercice dans ta séance du jour et écris ton évolution.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <div style={{ flex: 1, background: "var(--surface)", borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 700, fontSize: 18, color: "var(--accent)" }}>{grandTotalVolume.toLocaleString("fr-FR")}</div>
          <div style={{ fontFamily: "Inter", fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>kg soulevés au total</div>
        </div>
        <div style={{ flex: 1, background: "var(--surface)", borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 700, fontSize: 18, color: "var(--accent)" }}>🏆 {prCount}</div>
          <div style={{ fontFamily: "Inter", fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>records en cours</div>
        </div>
      </div>

      <ShareRecapButton streak={streak} prCount={prCount} totalVolume={grandTotalVolume} />

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
        {rows.map((r, i) => (
          <button
            key={r.ex.id}
            onClick={() => onOpenExercise(r.block.weekday, r.ex.id)}
            style={{
              textAlign: "left",
              border: r.isPR ? "1px solid var(--accent)" : "none",
              borderRadius: 14,
              padding: "13px 14px",
              background: "var(--surface)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              animation: `fadeInUp 0.3s ease ${i * 0.04}s both`,
            }}
          >
            <MachineThumb group={r.block.group} name={r.ex.name} size={42} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 13.5, color: "var(--text)" }}>{r.ex.name}</div>
                {r.isPR && <span style={{ fontSize: 12 }}>🏆</span>}
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                {r.block.weekday} · {r.block.group}{r.totalVolume > 0 ? ` · ${r.totalVolume.toLocaleString("fr-FR")}kg de volume` : ""}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{r.last}kg</div>
              {r.delta !== 0 && (
                <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 10.5, fontWeight: 700, color: r.delta > 0 ? "var(--accent)" : "var(--text-muted)" }}>
                  {r.delta > 0 ? "▲" : "▼"} {Math.abs(r.delta)}kg
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Génère une image récap (canvas) et propose de la partager/télécharger.
function ShareRecapButton({ streak, prCount, totalVolume }) {
  const canvasRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const generate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = 800, H = 1000;
    canvas.width = W;
    canvas.height = H;

    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, "#181C20");
    bgGrad.addColorStop(1, "#0F1114");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#F37121";
    ctx.font = "700 34px Inter, sans-serif";
    ctx.fillText("MA SEMAINE", 50, 100);
    ctx.fillStyle = "#8B9199";
    ctx.font = "500 20px Inter, sans-serif";
    ctx.fillText("Récap d'entraînement", 50, 132);

    const stats = [
      { label: "Jours de série", value: `🔥 ${streak}` },
      { label: "Records battus", value: `🏆 ${prCount}` },
      { label: "Volume total soulevé", value: `${totalVolume.toLocaleString("fr-FR")} kg` },
    ];
    let y = 220;
    stats.forEach((s) => {
      ctx.fillStyle = "#1C2024";
      roundRect(ctx, 50, y, W - 100, 130, 18);
      ctx.fill();
      ctx.fillStyle = "#8B9199";
      ctx.font = "600 18px Inter, sans-serif";
      ctx.fillText(s.label.toUpperCase(), 78, y + 42);
      ctx.fillStyle = "#F5F6F3";
      ctx.font = "700 52px Inter, sans-serif";
      ctx.fillText(s.value, 78, y + 96);
      y += 160;
    });

    ctx.fillStyle = "#454D54";
    ctx.font = "500 16px Inter, sans-serif";
    ctx.fillText("Généré depuis mon appli sport", 50, H - 40);
  };

  const roundRect = (ctx, x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  const handleShare = async () => {
    setBusy(true);
    try {
      generate();
      const canvas = canvasRef.current;
      canvas.toBlob(async (blob) => {
        if (!blob) { setBusy(false); return; }
        const file = new File([blob], "recap-sport.png", { type: "image/png" });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: "Mon récap sport" });
          } catch (e) {}
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "recap-sport.png";
          a.click();
          URL.revokeObjectURL(url);
        }
        setBusy(false);
      }, "image/png");
    } catch (e) {
      setBusy(false);
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <button
        onClick={handleShare}
        disabled={busy}
        style={{
          width: "100%",
          border: "1px solid var(--accent)",
          borderRadius: 12,
          padding: "12px 0",
          fontFamily: "Inter",
          fontWeight: 700,
          fontSize: 13,
          cursor: busy ? "default" : "pointer",
          background: "rgba(243,113,33,0.08)",
          color: "var(--accent)",
        }}
      >
        {busy ? "Génération…" : "🔗 Partager mon récap"}
      </button>
    </div>
  );
}

// ---------- Muscles : silhouette montrant les zones travaillées ----------
const GROUP_TO_ZONE = {
  "Pecs & Triceps": ["chest", "triceps"],
  "Dos & Biceps": ["back", "arms", "forearms"],
  "Jambes": ["legs", "calves", "hamstrings", "glutes"],
  "Épaules": ["shoulders"],
  "Abdos": ["abs"],
  "Cardio": [],
};

function FrontBackToggle({ view, setView }) {
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 14, background: "var(--surface-raised)", borderRadius: 20, padding: 4 }}>
      {[
        { key: "front", label: "Face" },
        { key: "back", label: "Dos" },
      ].map((o) => (
        <button
          key={o.key}
          onClick={() => setView(o.key)}
          style={{
            border: "none",
            borderRadius: 16,
            padding: "6px 16px",
            fontFamily: "Inter",
            fontWeight: 700,
            fontSize: 11.5,
            cursor: "pointer",
            background: view === o.key ? "var(--accent)" : "transparent",
            color: view === o.key ? "#12161A" : "var(--text-muted)",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function MusclesView({ program, validatedDays, today }) {
  // Semaine en cours (lundi -> aujourd'hui), pour savoir quels groupes ont déjà été validés.
  const todayIdx = WEEKDAYS.indexOf(today);
  const weekSoFar = WEEKDAYS.slice(0, todayIdx + 1);
  const trainedGroupsThisWeek = new Set();
  const dayStatus = weekSoFar.map((day) => {
    const block = program.find((b) => b.weekday === day);
    const iso = isoOfWeekday(day, today, todayIdx);
    const done = block ? validatedDays.includes(iso) : null;
    if (block && done) trainedGroupsThisWeek.add(block.group);
    return { day, block, done };
  });

  const todayBlock = program.find((b) => b.weekday === today);
  const zonesToday = new Set(todayBlock ? GROUP_TO_ZONE[todayBlock.group] || [] : []);
  const zonesWeek = new Set(Array.from(trainedGroupsThisWeek).flatMap((g) => GROUP_TO_ZONE[g] || []));
  const [view, setView] = useState("front");

  return (
    <div>
      {todayBlock && (
        <div style={{ fontFamily: "Inter", fontSize: 12.5, color: "var(--accent)", fontWeight: 700, marginBottom: 10, textAlign: "center" }}>
          Aujourd'hui : {todayBlock.group}
        </div>
      )}
      <div className="track-bg" style={{ borderRadius: 20, padding: "22px 10px 14px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <BodySilhouette highlightToday={zonesToday} highlightWeek={zonesWeek} view={view} />
        <FrontBackToggle view={view} setView={setView} />
      </div>

      <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 12, marginBottom: 22 }}>
        <LegendDot color="var(--accent)" label="Aujourd'hui" />
        <LegendDot color="rgba(243,113,33,0.35)" label="Cette semaine" />
      </div>

      <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 12, letterSpacing: "0.4px", color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase" }}>
        Ta semaine
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {WEEKDAYS.map((day) => {
          const block = program.find((b) => b.weekday === day);
          const isPast = WEEKDAYS.indexOf(day) <= todayIdx;
          const iso = isPast ? isoOfWeekday(day, today, todayIdx) : null;
          const done = iso ? validatedDays.includes(iso) : false;
          return (
            <div key={day} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--surface)", borderRadius: 10, padding: "9px 12px" }}>
              <span style={{ fontFamily: "Inter", fontSize: 12.5, fontWeight: 600, color: "var(--text)", width: 78 }}>{day}</span>
              {block ? (
                <>
                  <MachineThumb group={block.group} size={26} />
                  <span style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-muted)", flex: 1 }}>{block.group}</span>
                  {isPast && <span style={{ fontSize: 14 }}>{done ? "✅" : "⬜"}</span>}
                </>
              ) : (
                <span style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-muted)" }}>💤 Repos</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function isoOfWeekday(day, today, todayIdx) {
  const dayIdx = WEEKDAYS.indexOf(day);
  const diff = dayIdx - todayIdx;
  const d = new Date();
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function LegendDot({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }} />
      <span style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-muted)" }}>{label}</span>
    </div>
  );
}

function BodySilhouette({ highlightToday, highlightWeek, width = 180, view = "front" }) {
  // Base "muscle non travaillé" façon planche anatomique (rouge sourd),
  // puis la couleur accent vient recouvrir la zone travaillée.
  const fillFor = (zone) => {
    if (highlightToday.has(zone)) return "var(--accent)";
    if (highlightWeek.has(zone)) return "rgba(243,113,33,0.45)";
    return "url(#muscleRed)";
  };
  const strokeBase = "#2A1414";
  const fiberColor = (zone) => (highlightToday.has(zone) ? "#8A4A12" : "#5C1414");
  const fiberOpacity = (zone) => (highlightToday.has(zone) || highlightWeek.has(zone) ? 0.35 : 0.4);
  const height = Math.round(width * (320 / 200));
  const isBack = view === "back";

  // Pose debout, bras légèrement écartés, jambes séparées — comme sur la
  // planche anatomique de référence. Les membres sont coupés au coude/genou
  // pour distinguer biceps/triceps des avant-bras, et quadriceps/ischios des
  // mollets. Chemins réutilisés pour le remplissage et le découpage des
  // lignes de fibres.
  const upperArmL = "M63 53 Q40 66 32 108 L47 124 Q52 100 69 67 Z";
  const foreArmL = "M32 108 Q28 138 29 168 Q29 178 37 180 Q46 178 44 166 Q47 142 47 124 Z";
  const upperArmR = "M137 53 Q160 66 168 108 L153 124 Q148 100 131 67 Z";
  const foreArmR = "M168 108 Q172 138 171 168 Q171 178 163 180 Q154 178 156 166 Q153 142 153 124 Z";
  const thighL = "M73 168 L63 232 L87 232 L89 168 Z";
  const calfL = "M63 232 L60 250 Q56 282 61 306 L83 306 Q87 282 82 250 L87 232 Z";
  const thighR = "M127 168 L137 232 L113 232 L111 168 Z";
  const calfR = "M137 232 L140 250 Q144 282 139 306 L117 306 Q113 282 118 250 L113 232 Z";
  const chest = "M69 63 Q100 76 131 63 L124 100 Q100 110 76 100 Z";
  const back = "M67 60 Q100 72 133 60 L128 128 Q100 140 72 128 Z";
  const glutes = "M76 130 Q100 122 124 130 L120 168 Q100 176 80 168 Z";

  // Selon la vue, le haut du bras est biceps ou triceps, et le haut de la
  // jambe est quadriceps ou ischio-jambiers — même silhouette, autre muscle.
  const upperArmZone = isBack ? "triceps" : "arms";
  const thighZone = isBack ? "hamstrings" : "legs";

  return (
    <svg width={width} height={height} viewBox="0 0 200 320">
      <defs>
        <linearGradient id="muscleRed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A2020" />
          <stop offset="100%" stopColor="#4E1414" />
        </linearGradient>
        <clipPath id="clipThighL"><path d={thighL} /></clipPath>
        <clipPath id="clipThighR"><path d={thighR} /></clipPath>
        <clipPath id="clipCalfL"><path d={calfL} /></clipPath>
        <clipPath id="clipCalfR"><path d={calfR} /></clipPath>
        <clipPath id="clipUpperArmL"><path d={upperArmL} /></clipPath>
        <clipPath id="clipUpperArmR"><path d={upperArmR} /></clipPath>
        <clipPath id="clipForeArmL"><path d={foreArmL} /></clipPath>
        <clipPath id="clipForeArmR"><path d={foreArmR} /></clipPath>
        <clipPath id="clipChest"><path d={chest} /></clipPath>
        <clipPath id="clipBack"><path d={back} /></clipPath>
        <clipPath id="clipGlutes"><path d={glutes} /></clipPath>
        <clipPath id="clipShoulderL"><ellipse cx="65" cy="57" rx="15" ry="12" /></clipPath>
        <clipPath id="clipShoulderR"><ellipse cx="135" cy="57" rx="15" ry="12" /></clipPath>
      </defs>

      {/* Tête, cou, torse — silhouette de base */}
      <circle cx="100" cy="24" r="17" fill="#C99A78" stroke={strokeBase} strokeWidth="2" />
      <rect x="92" y="37" width="16" height="12" fill="#C99A78" stroke={strokeBase} strokeWidth="1.5" />
      <path d="M62 50 Q100 40 138 50 L131 130 Q100 148 69 130 Z" fill="#C99A78" stroke={strokeBase} strokeWidth="2" />
      <path d="M69 130 Q100 145 131 130 L126 165 Q100 178 74 165 Z" fill="#C99A78" stroke={strokeBase} strokeWidth="2" />
      {/* Mains et pieds */}
      <ellipse cx="33" cy="184" rx="9" ry="12" fill="#C99A78" stroke={strokeBase} strokeWidth="1.5" />
      <ellipse cx="167" cy="184" rx="9" ry="12" fill="#C99A78" stroke={strokeBase} strokeWidth="1.5" />
      <ellipse cx="72" cy="311" rx="15" ry="7" fill="#C99A78" stroke={strokeBase} strokeWidth="1.5" />
      <ellipse cx="128" cy="311" rx="15" ry="7" fill="#C99A78" stroke={strokeBase} strokeWidth="1.5" />

      {/* Cuisses (quadriceps / ischio-jambiers) — agencement parallèle */}
      {[thighL, thighR].map((d, i) => (
        <g key={i}>
          <path d={d} fill={fillFor(thighZone)} stroke={strokeBase} strokeWidth="2" style={{ transition: "fill 0.3s ease" }} />
          <g clipPath={`url(#clipThigh${i === 0 ? "L" : "R"})`} stroke={fiberColor(thighZone)} strokeWidth="1.2" opacity={fiberOpacity(thighZone)}>
            {[0, 1, 2].map((n) => (
              <line key={n} x1={68 + i * 60 + n * 8} y1="172" x2={66 + i * 62 + n * 8} y2="230" />
            ))}
          </g>
        </g>
      ))}

      {/* Mollets — agencement penné (faisceaux courts, tendon d'Achille) */}
      {[calfL, calfR].map((d, i) => (
        <g key={i}>
          <path d={d} fill={fillFor("calves")} stroke={strokeBase} strokeWidth="2" style={{ transition: "fill 0.3s ease" }} />
          <g clipPath={`url(#clipCalf${i === 0 ? "L" : "R"})`} stroke={fiberColor("calves")} strokeWidth="1.2" opacity={fiberOpacity("calves")}>
            {[0, 1, 2].map((n) => (
              <line key={n} x1={100 - 30 + i * 60} y1={238 + n * 14} x2={100 - 22 + i * 44} y2={296} />
            ))}
          </g>
        </g>
      ))}

      {/* Haut du bras (biceps / triceps) — agencement parallèle */}
      {[upperArmL, upperArmR].map((d, i) => (
        <g key={i}>
          <path d={d} fill={fillFor(upperArmZone)} stroke={strokeBase} strokeWidth="2" style={{ transition: "fill 0.3s ease" }} />
          <g clipPath={`url(#clipUpperArm${i === 0 ? "L" : "R"})`} stroke={fiberColor(upperArmZone)} strokeWidth="1.2" opacity={fiberOpacity(upperArmZone)}>
            {[0, 1, 2].map((n) => (
              <line key={n} x1={37 + i * 126 + n * 8} y1="62" x2={41 + i * 118 + n * 8} y2="122" />
            ))}
          </g>
        </g>
      ))}

      {/* Avant-bras — agencement penné */}
      {[foreArmL, foreArmR].map((d, i) => (
        <g key={i}>
          <path d={d} fill={fillFor("forearms")} stroke={strokeBase} strokeWidth="2" style={{ transition: "fill 0.3s ease" }} />
          <g clipPath={`url(#clipForeArm${i === 0 ? "L" : "R"})`} stroke={fiberColor("forearms")} strokeWidth="1.1" opacity={fiberOpacity("forearms")}>
            {[0, 1].map((n) => (
              <line key={n} x1={34 + i * 128 + n * 8} y1="115" x2={38 + i * 122 + n * 8} y2="176" />
            ))}
          </g>
        </g>
      ))}

      {/* Épaules — agencement circulaire (deltoïde multipenné) */}
      {[
        { cx: 65, clip: "clipShoulderL" },
        { cx: 135, clip: "clipShoulderR" },
      ].map((s, i) => (
        <g key={i}>
          <ellipse cx={s.cx} cy="57" rx="15" ry="12" fill={fillFor("shoulders")} stroke={strokeBase} strokeWidth="2" style={{ transition: "fill 0.3s ease" }} />
          <g clipPath={`url(#${s.clip})`} stroke={fiberColor("shoulders")} strokeWidth="1.1" opacity={fiberOpacity("shoulders")}>
            {[4, 7, 10].map((r, n) => (
              <circle key={n} cx={s.cx} cy="57" r={r} fill="none" />
            ))}
          </g>
        </g>
      ))}

      {isBack ? (
        <>
          {/* Dos — grand dorsal + trapèzes, agencement convergent */}
          <path d={back} fill={fillFor("back")} stroke={strokeBase} strokeWidth="2" style={{ transition: "fill 0.3s ease" }} />
          <g clipPath="url(#clipBack)" stroke={fiberColor("back")} strokeWidth="1.2" opacity={fiberOpacity("back")}>
            {[74, 85, 100, 115, 126].map((x, n) => (
              <line key={n} x1={x} y1={n <= 2 ? 65 : 122} x2="100" y2="94" />
            ))}
          </g>
          {/* Fessiers */}
          <path d={glutes} fill={fillFor("glutes")} stroke={strokeBase} strokeWidth="2" style={{ transition: "fill 0.3s ease" }} />
          <g clipPath="url(#clipGlutes)" stroke={fiberColor("glutes")} strokeWidth="1.1" opacity={fiberOpacity("glutes")}>
            <circle cx="88" cy="148" r="10" fill="none" />
            <circle cx="112" cy="148" r="10" fill="none" />
          </g>
        </>
      ) : (
        <>
          {/* Pecs — agencement convergent (origine large, tendon unique) */}
          <path d={chest} fill={fillFor("chest")} stroke={strokeBase} strokeWidth="2" style={{ transition: "fill 0.3s ease" }} />
          <g clipPath="url(#clipChest)" stroke={fiberColor("chest")} strokeWidth="1.2" opacity={fiberOpacity("chest")}>
            {[76, 87, 100, 113, 124].map((x, n) => (
              <line key={n} x1={x} y1={n <= 2 ? 65 : 98} x2="100" y2="88" />
            ))}
          </g>
          {/* Abdos — segments séparés par les tendons (linea alba) */}
          <rect x="80" y="108" width="40" height="38" rx="5" fill={fillFor("abs")} stroke={strokeBase} strokeWidth="2" style={{ transition: "fill 0.3s ease" }} />
          <line x1="100" y1="108" x2="100" y2="146" stroke={strokeBase} strokeWidth="1.5" />
          <line x1="80" y1="121" x2="120" y2="121" stroke={strokeBase} strokeWidth="1.5" />
          <line x1="80" y1="134" x2="120" y2="134" stroke={strokeBase} strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}

function NathanView({ onLoad, isLoaded }) {
  return <ProgramInfoView info={NATHAN_INFO} programData={NATHAN_PROGRAM} onLoad={onLoad} isLoaded={isLoaded} />;
}

function DavidView({ onLoad, isLoaded }) {
  return <ProgramInfoView info={DAVID_INFO} programData={DAVID_PROGRAM} onLoad={onLoad} isLoaded={isLoaded} />;
}

function ProgramInfoView({ info, programData, onLoad, isLoaded }) {
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 34 }}>📋</div>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 20, color: "var(--text)", marginTop: 6 }}>{info.title}</div>
        <div style={{ fontFamily: "Inter", fontSize: 12.5, color: "var(--accent)", fontWeight: 600, marginTop: 4 }}>{info.cycle}</div>
        <div style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.5 }}>{info.objectif}</div>
      </div>

      <button
        onClick={onLoad}
        style={{
          width: "100%",
          border: "none",
          borderRadius: 14,
          padding: "15px 0",
          fontFamily: "Inter",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          background: "linear-gradient(120deg, var(--accent), var(--accent-dark))",
          color: "#12161A",
          boxShadow: "0 6px 18px rgba(243,113,33,0.25)",
          marginBottom: 22,
        }}
      >
        {isLoaded ? "✅ Déjà chargé — recharger cette semaine" : "Charger ce programme dans ma semaine"}
      </button>

      {programData.map((block) => (
        <div key={block.id} style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <MachineThumb group={block.group} size={30} />
            <div>
              <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 13.5, color: "var(--text)" }}>{block.weekday} — {block.group}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {block.exercises.map((ex) => (
              <div key={ex.id} style={{ background: "var(--surface)", borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 12.5, color: "var(--text)" }}>{ex.name}</span>
                  <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 11, color: "var(--accent)", fontWeight: 700 }}>{ex.sets > 1 ? `${ex.sets} × ${ex.reps}` : ex.reps}</span>
                </div>
                {ex.rest && ex.rest !== "—" && (
                  <div style={{ fontFamily: "Inter", fontSize: 10.5, color: "var(--text-muted)", marginTop: 2 }}>Repos : {ex.rest}</div>
                )}
                {ex.note && (
                  <div style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.4, fontStyle: "italic" }}>{ex.note}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 12, letterSpacing: "0.4px", color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase" }}>
        Consignes importantes
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {info.consignes.map((c) => (
          <div key={c.label} style={{ background: "var(--surface)", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 11.5, color: "var(--accent)" }}>{c.label}</div>
            <div style={{ fontFamily: "Inter", fontSize: 11.5, color: "var(--text-muted)", marginTop: 3, lineHeight: 1.4 }}>{c.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccueilView({ program, today, streak, validatedDays, remindersEnabled, toggleReminders, onOpenDay, onOpenNathan, onOpenDavid }) {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <button
        onClick={onOpenNathan}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          border: "1px solid rgba(243,113,33,0.3)",
          borderRadius: 14,
          padding: "12px 14px",
          marginBottom: 2,
          background: "linear-gradient(120deg, rgba(243,113,33,0.12), rgba(243,113,33,0.02))",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: 22 }}>📋</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 13, color: "var(--text)" }}>Programme de NathanFourmi</div>
          <div style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>Cycle 6 semaines · 4 séances · toutes les consignes</div>
        </div>
        <span style={{ color: "var(--accent)", fontSize: 16 }}>→</span>
      </button>

      <button
        onClick={onOpenDavid}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          border: "1px solid rgba(243,113,33,0.3)",
          borderRadius: 14,
          padding: "12px 14px",
          marginBottom: 2,
          background: "linear-gradient(120deg, rgba(243,113,33,0.12), rgba(243,113,33,0.02))",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: 22 }}>📋</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 13, color: "var(--text)" }}>Programme de DavidFourmi</div>
          <div style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>Cycle 6 semaines · 4 séances · toutes les consignes</div>
        </div>
        <span style={{ color: "var(--accent)", fontSize: 16 }}>→</span>
      </button>

      <div
        style={{
          borderRadius: 16,
          padding: "16px 18px",
          marginBottom: 6,
          background: "linear-gradient(120deg, rgba(243,113,33,0.16), rgba(243,113,33,0.03))",
          border: "1px solid rgba(243,113,33,0.25)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span className="flame-anim" style={{ fontSize: 30 }}>🔥</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22, color: "var(--text)", lineHeight: 1 }}>
              {streak} {streak > 1 ? "jours" : "jour"}
            </div>
            <div style={{ fontFamily: "Inter", fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>
              de série — valide ta séance pour la garder vivante
            </div>
          </div>
          <button
            onClick={() => setShowCalendar((s) => !s)}
            style={{ border: "none", background: "var(--surface-raised)", borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 16 }}
            aria-label="Voir le calendrier"
          >
            📅
          </button>
        </div>
        {showCalendar && (
          <div style={{ marginTop: 14 }}>
            <StreakCalendar validatedDays={validatedDays} />
          </div>
        )}
      </div>

      <button
        onClick={toggleReminders}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "none",
          borderRadius: 12,
          padding: "10px 14px",
          marginBottom: 6,
          background: "var(--surface)",
          cursor: "pointer",
        }}
      >
        <span style={{ fontFamily: "Inter", fontSize: 12.5, color: "var(--text)", display: "flex", alignItems: "center", gap: 8 }}>
          🔔 Rappels les jours de séance
        </span>
        <span
          style={{
            width: 38,
            height: 22,
            borderRadius: 12,
            background: remindersEnabled ? "var(--accent)" : "var(--surface-raised)",
            position: "relative",
            transition: "background 0.2s ease",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 2,
              left: remindersEnabled ? 18 : 2,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: remindersEnabled ? "#12161A" : "var(--text-muted)",
              transition: "left 0.2s ease",
            }}
          />
        </span>
      </button>

      {WEEKDAYS.map((day, i) => {
        const block = program.find((b) => b.weekday === day);
        const isToday = day === today;
        return (
          <button
            key={day}
            onClick={() => onOpenDay(day)}
            style={{
              textAlign: "left",
              border: isToday ? "1px solid var(--accent)" : "1px solid transparent",
              borderRadius: 12,
              padding: "14px 16px",
              background: "var(--surface)",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              animation: `fadeInUp 0.3s ease ${i * 0.05}s both`,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{day}</span>
                {isToday && (
                  <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 9.5, color: "#1A2127", background: "var(--accent)", borderRadius: 5, padding: "2px 6px", fontWeight: 700 }}>
                    AUJOURD'HUI
                  </span>
                )}
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>
                {block ? block.group : "Repos"}
              </div>
            </div>
            {block ? (
              <MachineThumb group={block.group} size={38} />
            ) : (
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--surface-raised)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 16 }}>💤</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Calendrier mensuel : un point vert sur chaque jour où une séance a été validée.
function StreakCalendar({ validatedDays }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const base = new Date();
  base.setDate(1);
  base.setMonth(base.getMonth() + monthOffset);
  const year = base.getFullYear();
  const month = base.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // lundi = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = base.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const todayIso = todayISO();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <button onClick={() => setMonthOffset((m) => m - 1)} style={{ border: "none", background: "none", color: "var(--text-muted)", fontSize: 16, cursor: "pointer" }}>‹</button>
        <span style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 12.5, color: "var(--text)", textTransform: "capitalize" }}>{monthLabel}</span>
        <button onClick={() => setMonthOffset((m) => Math.min(0, m + 1))} style={{ border: "none", background: "none", color: "var(--text-muted)", fontSize: 16, cursor: "pointer", opacity: monthOffset === 0 ? 0.3 : 1 }} disabled={monthOffset === 0}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontFamily: "Inter", fontSize: 9.5, color: "var(--text-muted)" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const done = validatedDays.includes(iso);
          const isToday = iso === todayIso;
          return (
            <div
              key={i}
              style={{
                aspectRatio: "1",
                borderRadius: 7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Roboto Mono', monospace",
                fontSize: 10,
                fontWeight: done ? 700 : 500,
                background: done ? "var(--accent)" : "var(--surface-raised)",
                color: done ? "#12161A" : "var(--text-muted)",
                border: isToday ? "1px solid var(--text)" : "1px solid transparent",
              }}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function JourView({ weekday, isToday, block, progress, bumpSet, resetSet, clearDay, onCreer, weights, setWeight, weightLogs, logEvolution, validateSession, validatedToday, initialDetail, onDetailOpened, noteValue, setNoteForToday }) {
  const [detailFor, setDetailFor] = useState(null);
  const [noteDraft, setNoteDraft] = useState(noteValue || "");

  useEffect(() => {
    setNoteDraft(noteValue || "");
  }, [noteValue, weekday]);

  useEffect(() => {
    if (initialDetail) {
      setDetailFor(initialDetail);
      if (onDetailOpened) onDetailOpened();
    }
  }, [initialDetail]);

  if (!block) {
    const quotes = [
      "Un jour de repos, c'est un jour où les muscles se construisent.",
      "Récupère bien — la prochaine séance n'en sera que meilleure.",
      "Le repos fait partie de l'entraînement, pas une pause dedans.",
      "Hydrate-toi, étire-toi, reviens plus fort.",
    ];
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const quote = quotes[dayOfYear % quotes.length];
    return (
      <div>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22, color: "var(--text)", marginBottom: 2 }}>{weekday}</div>
        {isToday && <div style={{ fontFamily: "Inter", fontSize: 12, color: "var(--accent)", fontWeight: 700, marginBottom: 10 }}>AUJOURD'HUI</div>}
        <div className="ring-pop" style={{ background: "var(--surface)", borderRadius: 12, padding: "30px 18px", textAlign: "center", color: "var(--text-muted)", fontFamily: "Inter", fontSize: 13.5, marginTop: 10 }}>
          <div style={{ fontSize: 30, marginBottom: 8 }}>😴</div>
          Jour de repos — aucune séance programmée.
          <div style={{ marginTop: 10, fontSize: 12, fontStyle: "italic", color: "var(--text-muted)" }}>"{quote}"</div>
        </div>
        <button onClick={onCreer} style={createBtnStyle}>+ Créer une séance pour {weekday}</button>
      </div>
    );
  }

  const detailExercise = detailFor ? block.exercises.find((e) => e.id === detailFor) : null;
  const totalSets = block.exercises.reduce((s, ex) => s + ex.sets, 0);
  const doneSets = block.exercises.reduce((s, ex) => s + Math.min(progress[`${todayISO()}:${ex.id}`] || 0, ex.sets), 0);
  const sessionPct = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;
  const allDone = totalSets > 0 && doneSets >= totalSets;

  const bumpWithFeedback = (ex) => {
    try { if (navigator.vibrate) navigator.vibrate(15); } catch (e) {}
    bumpSet(ex, weekday);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <MachineThumb group={block.group} size={48} />
          <div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 20, color: "var(--text)" }}>{weekday}</div>
            <div style={{ fontFamily: "Inter", fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>{block.group}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onCreer} style={{ border: "none", background: "none", color: "var(--text-muted)", fontFamily: "Inter", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>
            Modifier
          </button>
          <button onClick={() => clearDay(weekday)} style={{ border: "none", background: "none", color: "var(--text-muted)", fontFamily: "Inter", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>
            Supprimer
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-muted)" }}>{allDone ? "Séance terminée 💪" : "Progression de la séance"}</span>
          <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 11, color: "var(--accent)", fontWeight: 700 }}>{doneSets}/{totalSets} séries</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: "var(--surface-raised)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${sessionPct}%`,
              borderRadius: 4,
              background: "linear-gradient(90deg, var(--accent-dark), var(--accent))",
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {block.exercises.map((ex, idx) => {
          const key = `${todayISO()}:${ex.id}`;
          const done = progress[key] || 0;
          const complete = done >= ex.sets;
          const next = block.exercises[idx + 1];
          const prev = block.exercises[idx - 1];
          const supersetWithNext = ex.superset && next && next.superset === ex.superset;
          const supersetWithPrev = ex.superset && prev && prev.superset === ex.superset;
          return (
            <div key={ex.id}>
              {supersetWithPrev && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 20, margin: "-2px 0 2px" }}>
                  <div style={{ width: 2, height: 14, background: "var(--accent)", borderRadius: 1 }} />
                  <span style={{ fontFamily: "Inter", fontSize: 10, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                    Superset — enchaîne sans repos
                  </span>
                </div>
              )}
              <div
                style={{
                  background: "var(--surface)",
                  borderRadius: 12,
                  padding: "14px",
                  border: complete ? "1px solid var(--success)" : ex.superset ? "1px solid rgba(243,113,33,0.35)" : "1px solid transparent",
                  borderLeft: ex.superset ? "3px solid var(--accent)" : undefined,
                  transition: "border 0.2s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <button
                    onClick={() => setDetailFor(ex.id)}
                    style={{ display: "flex", gap: 12, alignItems: "flex-start", border: "none", background: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
                  >
                    <MachineThumb group={block.group} name={ex.name} size={44} />
                    <div>
                      <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 14.5, color: complete ? "var(--success)" : "var(--text)" }}>{ex.name}</div>
                      <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>{ex.sets} séries × {ex.reps}</div>
                    </div>
                  </button>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    {complete && (
                      <button onClick={() => resetSet(ex.id)} style={smallBtnStyle} aria-label="Réinitialiser">↺</button>
                    )}
                    <button
                      onClick={() => bumpWithFeedback(ex)}
                      disabled={complete}
                      style={{ ...smallBtnStyle, background: complete ? "var(--success)" : "var(--accent)", color: "#12161A", fontWeight: 700, cursor: complete ? "default" : "pointer", opacity: complete ? 0.85 : 1 }}
                    >
                      {complete ? "✓" : "Série +1"}
                    </button>
                  </div>
                </div>
                <div style={{ marginTop: 10, marginLeft: 56 }}>
                  <TallyMarks done={done} total={ex.sets} />
                </div>
                {ex.note && (
                  <div style={{ marginTop: 8, marginLeft: 56, fontFamily: "Inter", fontSize: 11, color: "var(--text-muted)", fontStyle: "italic", lineHeight: 1.4 }}>
                    💬 {ex.note}{ex.rest && ex.rest !== "—" ? ` · Repos ${ex.rest}` : ""}
                  </div>
                )}
              </div>
              {supersetWithNext && (
                <div style={{ height: 6, borderLeft: "2px dashed var(--accent)", marginLeft: 20, opacity: 0.5 }} />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 12, letterSpacing: "0.4px", color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase" }}>
          Comment tu t'es senti ?
        </div>
        <textarea
          value={noteDraft}
          onChange={(e) => setNoteDraft(e.target.value)}
          onBlur={() => setNoteForToday(noteDraft)}
          placeholder="Douleurs, forme du jour, ressenti sur les charges…"
          rows={3}
          style={{
            width: "100%",
            boxSizing: "border-box",
            border: "1px solid var(--surface-raised)",
            background: "var(--surface)",
            color: "var(--text)",
            borderRadius: 12,
            padding: "11px 13px",
            fontFamily: "Inter",
            fontSize: 13,
            outline: "none",
            resize: "vertical",
          }}
        />
      </div>

      {isToday && (
        <button
          onClick={validateSession}
          disabled={validatedToday}
          className={!validatedToday && allDone ? "pulse-glow" : ""}
          style={{
            width: "100%",
            marginTop: 14,
            border: "none",
            borderRadius: 14,
            padding: "15px 0",
            fontFamily: "Inter",
            fontWeight: 700,
            fontSize: 14.5,
            cursor: validatedToday ? "default" : "pointer",
            background: validatedToday ? "var(--surface-raised)" : "linear-gradient(120deg, var(--accent), var(--accent-dark))",
            color: validatedToday ? "var(--success)" : "#12161A",
            boxShadow: validatedToday ? "none" : "0 6px 18px rgba(243,113,33,0.25)",
          }}
        >
          {validatedToday ? "✅ Séance validée aujourd'hui" : allDone ? "🎉 Tout est fait — Valider la séance" : "✅ Valider la séance"}
        </button>
      )}

      {detailExercise && (
        <ExerciseDetailModal
          exercise={detailExercise}
          group={block.group}
          weightValue={weights[detailExercise.id] || ""}
          setWeight={(v) => setWeight(detailExercise.id, v)}
          history={weightLogs[detailExercise.id] || []}
          logEvolution={(v) => logEvolution(detailExercise.id, v, detailExercise)}
          onClose={() => setDetailFor(null)}
        />
      )}
    </div>
  );
}

// Tapping an exercise opens this: two tabs, exactly what the user asked for —
// "Voir la machine" (a big look at the station to use) and "Écrire l'évolution"
// (log this week's weight + see the progression graph), Lyfta-style.
function ExerciseDetailModal({ exercise, group, weightValue, setWeight, history, logEvolution, onClose }) {
  const [tab, setTab] = useState("machine");

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20, padding: 20 }}
    >
      <div className="modal-pop" onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface)", borderRadius: 18, padding: 20, width: "100%", maxWidth: 480, maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>{exercise.name}</div>
          <button onClick={onClose} style={{ border: "none", background: "none", color: "var(--text-muted)", fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ display: "flex", background: "var(--surface-raised)", borderRadius: 12, padding: 4, gap: 4, marginBottom: 18 }}>
          <button
            onClick={() => setTab("machine")}
            style={{ flex: 1, border: "none", borderRadius: 9, padding: "9px 0", fontFamily: "Inter", fontWeight: 700, fontSize: 11.5, cursor: "pointer", background: tab === "machine" ? "var(--accent)" : "transparent", color: tab === "machine" ? "#12161A" : "var(--text-muted)" }}
          >
            🖼 Machine
          </button>
          <button
            onClick={() => setTab("muscles")}
            style={{ flex: 1, border: "none", borderRadius: 9, padding: "9px 0", fontFamily: "Inter", fontWeight: 700, fontSize: 11.5, cursor: "pointer", background: tab === "muscles" ? "var(--accent)" : "transparent", color: tab === "muscles" ? "#12161A" : "var(--text-muted)" }}
          >
            💪 Muscles
          </button>
          <button
            onClick={() => setTab("evolution")}
            style={{ flex: 1, border: "none", borderRadius: 9, padding: "9px 0", fontFamily: "Inter", fontWeight: 700, fontSize: 11.5, cursor: "pointer", background: tab === "evolution" ? "var(--accent)" : "transparent", color: tab === "evolution" ? "#12161A" : "var(--text-muted)" }}
          >
            📈 Évolution
          </button>
        </div>

        {tab === "machine" && <MachinePanel exercise={exercise} group={group} />}
        {tab === "muscles" && <MusclesWorkedPanel exercise={exercise} group={group} />}
        {tab === "evolution" && (
          <EvolutionPanel exercise={exercise} weightValue={weightValue} setWeight={setWeight} history={history} logEvolution={logEvolution} />
        )}
      </div>
    </div>
  );
}

const BACK_ZONES = new Set(["back", "triceps", "glutes", "hamstrings"]);

function MusclesWorkedPanel({ exercise, group }) {
  const zones = GROUP_TO_ZONE[group] || ["chest"];
  const defaultView = zones.some((z) => BACK_ZONES.has(z)) ? "back" : "front";
  const [view, setView] = useState(defaultView);
  const { primary, secondary } = getExerciseMuscles(exercise.name, group);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div className="track-bg" style={{ borderRadius: 16, padding: "14px 10px", display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <BodySilhouette highlightToday={new Set(zones)} highlightWeek={new Set()} width={130} view={view} />
        <FrontBackToggle view={view} setView={setView} />
      </div>

      {primary.length > 0 && (
        <div style={{ width: "100%" }}>
          <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 11.5, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>
            Muscle principal
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {primary.map((m) => (
              <span key={m} style={{ fontFamily: "Inter", fontSize: 12.5, fontWeight: 600, color: "#12161A", background: "var(--accent)", borderRadius: 20, padding: "6px 12px" }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {secondary.length > 0 && (
        <div style={{ width: "100%" }}>
          <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 11.5, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>
            Muscles secondaires
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {secondary.map((m) => (
              <span key={m} style={{ fontFamily: "Inter", fontSize: 12.5, fontWeight: 600, color: "var(--text)", background: "var(--surface-raised)", borderRadius: 20, padding: "6px 12px" }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MachinePanel({ exercise, group }) {
  const style = GROUP_STYLE[group] || { tint: "var(--surface-raised)" };
  const icon = getExerciseIcon(exercise.name, group);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div
        style={{
          width: "100%",
          aspectRatio: "1.15",
          borderRadius: 18,
          background: `radial-gradient(ellipse at 50% 30%, ${style.tint} 0%, #14171A 78%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Faint floor tile lines for a "gym floor" feel */}
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.14 }}>
          <defs>
            <pattern id="floorTiles" width="26" height="26" patternUnits="userSpaceOnUse">
              <path d="M26 0 L0 0 0 26" fill="none" stroke="var(--text)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#floorTiles)" />
        </svg>
        <RealisticMachine icon={icon} size={148} />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{exercise.name}</div>
        <div style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{group}</div>
        <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, color: "var(--accent)", marginTop: 8, fontWeight: 700 }}>{exercise.sets} séries × {exercise.reps}</div>
      </div>
    </div>
  );
}

// A shaded, multi-tone illustration for the "Voir la machine" screen — more
// detailed than the small list pictograms, so it actually reads as "here's
// the station" rather than a generic gym-chain icon.
function RealisticMachine({ icon, size = 140 }) {
  const common = { width: size, height: size, viewBox: "0 0 120 120" };
  // Palette monochrome inspirée des illustrations "flat" de matériel de
  // musculation : structure quasi-noire, éléments chromés en dégradé gris,
  // assise/poignées gris foncé, ombre au sol.
  const frame = "url(#frameGrad)";
  const chrome = "url(#chromeGrad)";
  const seat = "#1B1E22";
  const seatHi = "#2C3136";
  const black = "#111316";
  const plateEdge = "#26292D";
  const defs = (
    <defs>
      <linearGradient id="frameGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3A3F45" />
        <stop offset="100%" stopColor="#16181B" />
      </linearGradient>
      <linearGradient id="chromeGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E8EBEE" />
        <stop offset="45%" stopColor="#AFB6BC" />
        <stop offset="100%" stopColor="#686F76" />
      </linearGradient>
      <radialGradient id="plateGrad" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#4A5057" />
        <stop offset="70%" stopColor="#202327" />
        <stop offset="100%" stopColor="#0E1013" />
      </radialGradient>
    </defs>
  );
  const shadow = <ellipse cx="60" cy="108" rx="42" ry="6" fill="rgba(0,0,0,0.4)" />;

  switch (icon) {
    // Banc de développé couché avec barre + disques — comme un vrai banc de musculation
    case "bench_flat":
      return (
        <svg {...common}>
          {defs}
          {shadow}
          {/* pieds du support de barre */}
          <path d="M22 100 L30 46 L36 46 L30 100 Z" fill={frame} />
          <path d="M98 100 L90 46 L84 46 L90 100 Z" fill={frame} />
          <rect x="18" y="98" width="20" height="5" rx="1.5" fill={black} />
          <rect x="82" y="98" width="20" height="5" rx="1.5" fill={black} />
          {/* montants verticaux + support barre */}
          <rect x="27" y="30" width="7" height="20" rx="1.5" fill={frame} />
          <rect x="86" y="30" width="7" height="20" rx="1.5" fill={frame} />
          {/* barre + disques */}
          <rect x="20" y="30" width="80" height="4.5" rx="2" fill={chrome} />
          <circle cx="18" cy="32" r="15" fill="url(#plateGrad)" stroke={plateEdge} strokeWidth="1.5" />
          <circle cx="18" cy="32" r="5" fill="#0B0C0E" />
          <circle cx="102" cy="32" r="15" fill="url(#plateGrad)" stroke={plateEdge} strokeWidth="1.5" />
          <circle cx="102" cy="32" r="5" fill="#0B0C0E" />
          {/* banc incliné avec coussin */}
          <path d="M30 82 L82 68 L86 78 L34 92 Z" fill={seat} stroke={black} strokeWidth="1" />
          <path d="M32 84 L80 71" stroke={seatHi} strokeWidth="1.5" opacity="0.5" />
          <path d="M34 92 L28 108 L20 106 L28 88 Z" fill={frame} />
          <path d="M82 68 L92 62 L96 70 L86 78 Z" fill={frame} />
          <rect x="16" y="104" width="16" height="5" rx="1.5" fill={black} />
          <rect x="86" y="60" width="14" height="5" rx="1.5" fill={black} transform="rotate(-18 93 62)" />
        </svg>
      );

    // Banc réglable/inclinable seul, pliable — sans barre
    case "bench_incline":
      return (
        <svg {...common}>
          {defs}
          {shadow}
          <path d="M28 86 L84 62 L90 74 L34 98 Z" fill={seat} stroke={black} strokeWidth="1" />
          <path d="M30 88 L82 65" stroke={seatHi} strokeWidth="1.5" opacity="0.5" />
          <line x1="46" y1="80" x2="50" y2="92" stroke={black} strokeWidth="1" opacity="0.6" />
          <line x1="60" y1="74" x2="64" y2="86" stroke={black} strokeWidth="1" opacity="0.6" />
          <path d="M34 98 L26 108 L18 106 L26 90 Z" fill={frame} />
          <path d="M84 62 L96 52 L100 60 L90 74 Z" fill={frame} />
          <path d="M90 74 L96 90 L88 92 L82 78 Z" fill={frame} />
          <rect x="14" y="104" width="16" height="5" rx="1.5" fill={black} />
          <rect x="92" y="46" width="14" height="5" rx="1.5" fill={black} transform="rotate(-30 99 48)" />
          <rect x="82" y="88" width="14" height="5" rx="1.5" fill={black} transform="rotate(70 89 90)" />
        </svg>
      );

    // Pec-deck / butterfly
    case "pec_deck":
      return (
        <svg {...common}>
          {defs}
          {shadow}
          <path d="M50 30 L70 30 L72 90 L48 90 Z" fill={seat} />
          <rect x="52" y="34" width="16" height="26" rx="4" fill={seatHi} />
          <rect x="48" y="92" width="24" height="10" rx="2" fill={black} />
          <path d="M50 44 C28 44 18 56 14 74" stroke={frame} strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M70 44 C92 44 102 56 106 74" stroke={frame} strokeWidth="9" fill="none" strokeLinecap="round" />
          <circle cx="14" cy="74" r="7" fill={seat} stroke={black} strokeWidth="1.5" />
          <circle cx="106" cy="74" r="7" fill={seat} stroke={black} strokeWidth="1.5" />
          <rect x="44" y="98" width="10" height="8" fill={frame} />
          <rect x="66" y="98" width="10" height="8" fill={frame} />
        </svg>
      );

    // Station de dips assistés
    case "assisted_dip":
      return (
        <svg {...common}>
          {defs}
          {shadow}
          <rect x="24" y="18" width="8" height="66" rx="2" fill={frame} />
          <rect x="88" y="18" width="8" height="66" rx="2" fill={frame} />
          <rect x="16" y="26" width="24" height="8" rx="3" fill={chrome} />
          <rect x="80" y="26" width="24" height="8" rx="3" fill={chrome} />
          <rect x="36" y="90" width="48" height="12" rx="4" fill={seat} />
          <rect x="54" y="80" width="12" height="12" fill={black} />
          <rect x="20" y="82" width="10" height="24" fill={frame} />
          <rect x="90" y="82" width="10" height="24" fill={frame} />
        </svg>
      );

    // Poulie haute (tirage vertical, extension triceps)
    case "cable_high":
      return (
        <svg {...common}>
          {defs}
          {shadow}
          <rect x="16" y="12" width="9" height="92" fill={frame} />
          <rect x="95" y="12" width="9" height="92" fill={frame} />
          <rect x="16" y="12" width="88" height="9" fill={frame} />
          <circle cx="60" cy="28" r="6" fill={black} stroke={chrome} strokeWidth="2.5" />
          <rect x="57" y="34" width="6" height="34" fill="#3A3F44" />
          <rect x="40" y="66" width="40" height="9" rx="3" fill={seat} />
          <path d="M40 70 L20 62" stroke="#3A3F44" strokeWidth="2.5" />
          <path d="M80 70 L100 62" stroke="#3A3F44" strokeWidth="2.5" />
          <rect x="44" y="94" width="32" height="12" rx="4" fill={frame} />
          <rect x="16" y="98" width="12" height="6" fill={black} />
          <rect x="92" y="98" width="12" height="6" fill={black} />
        </svg>
      );

    // Poulie basse (tirage horizontal, rowing)
    case "cable_low":
      return (
        <svg {...common}>
          {defs}
          {shadow}
          <rect x="30" y="88" width="52" height="10" rx="3" fill={frame} />
          <rect x="48" y="62" width="18" height="26" rx="5" fill={seat} />
          <circle cx="14" cy="72" r="7" fill={black} stroke={chrome} strokeWidth="2.5" />
          <path d="M21 72 L48 44" stroke="#3A3F44" strokeWidth="3.5" />
          <path d="M21 72 L48 56" stroke="#3A3F44" strokeWidth="3.5" />
          <rect x="44" y="38" width="24" height="9" rx="3" fill={chrome} />
          <rect x="20" y="98" width="12" height="6" fill={black} />
          <rect x="80" y="98" width="12" height="6" fill={black} />
        </svg>
      );

    // Rack à squat
    case "squat_rack":
      return (
        <svg {...common}>
          {defs}
          {shadow}
          <rect x="20" y="14" width="9" height="90" fill={frame} />
          <rect x="91" y="14" width="9" height="90" fill={frame} />
          <rect x="12" y="40" width="96" height="8" rx="3" fill={seat} />
          <circle cx="20" cy="44" r="13" fill="url(#plateGrad)" stroke={plateEdge} strokeWidth="1.5" />
          <circle cx="100" cy="44" r="13" fill="url(#plateGrad)" stroke={plateEdge} strokeWidth="1.5" />
          <circle cx="20" cy="44" r="4.5" fill={black} />
          <circle cx="100" cy="44" r="4.5" fill={black} />
          <rect x="16" y="100" width="16" height="6" fill={black} />
          <rect x="88" y="100" width="16" height="6" fill={black} />
        </svg>
      );

    // Presse à cuisses inclinée
    case "leg_press":
      return (
        <svg {...common}>
          {defs}
          {shadow}
          <path d="M14 98 L38 30 L104 48 L86 102 Z" fill={frame} stroke={black} strokeWidth="1" strokeLinejoin="round" />
          <path d="M20 92 L40 38 L98 52 L82 96 Z" fill="none" stroke={chrome} strokeWidth="1.5" opacity="0.5" />
          <rect x="46" y="36" width="40" height="11" rx="3" fill={seat} />
          <rect x="24" y="80" width="20" height="12" rx="2" fill={black} />
          <circle cx="98" cy="46" r="10" fill="url(#plateGrad)" stroke={plateEdge} strokeWidth="1.2" />
        </svg>
      );

    // Leg extension
    case "leg_extension":
      return (
        <svg {...common}>
          {defs}
          {shadow}
          <rect x="20" y="18" width="30" height="40" rx="5" fill={seat} />
          <rect x="30" y="58" width="12" height="22" fill={frame} />
          <rect x="22" y="80" width="58" height="9" rx="3" fill={frame} />
          <rect x="66" y="70" width="30" height="9" rx="3" fill={black} />
          <circle cx="102" cy="74" r="7" fill="url(#plateGrad)" stroke={plateEdge} strokeWidth="1.2" />
          <rect x="20" y="98" width="14" height="6" fill={black} />
          <rect x="72" y="98" width="14" height="6" fill={black} />
        </svg>
      );

    // Leg curl
    case "leg_curl":
      return (
        <svg {...common}>
          {defs}
          {shadow}
          <rect x="16" y="50" width="54" height="14" rx="5" fill={seat} />
          <rect x="70" y="52" width="24" height="10" rx="3" fill={frame} />
          <path d="M94 57 Q108 57 108 40" stroke={frame} strokeWidth="7" fill="none" strokeLinecap="round" />
          <circle cx="108" cy="32" r="7" fill="url(#plateGrad)" stroke={plateEdge} strokeWidth="1.2" />
          <rect x="24" y="72" width="34" height="9" rx="3" fill={frame} />
          <rect x="22" y="98" width="14" height="6" fill={black} />
        </svg>
      );

    // Mollets debout
    case "calf_raise":
      return (
        <svg {...common}>
          {defs}
          {shadow}
          <rect x="16" y="82" width="88" height="11" rx="3" fill={frame} />
          <rect x="36" y="22" width="16" height="56" rx="4" fill={seat} />
          <path d="M22 48 L36 30 L50 48" stroke={chrome} strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="70" y="18" width="9" height="66" fill={frame} />
          <rect x="66" y="14" width="18" height="8" rx="3" fill={seat} />
        </svg>
      );

    // Haltère
    case "dumbbell":
      return (
        <svg {...common}>
          {defs}
          {shadow}
          <rect x="34" y="52" width="52" height="12" rx="3" fill={black} />
          <rect x="10" y="34" width="22" height="48" rx="8" fill="url(#plateGrad)" stroke={plateEdge} strokeWidth="1.5" />
          <rect x="88" y="34" width="22" height="48" rx="8" fill="url(#plateGrad)" stroke={plateEdge} strokeWidth="1.5" />
          <rect x="14" y="40" width="14" height="8" rx="2" fill="#565C63" opacity="0.7" />
          <rect x="92" y="40" width="14" height="8" rx="2" fill="#565C63" opacity="0.7" />
        </svg>
      );

    // Tapis de course manuel (à défilement mécanique)
    case "treadmill":
      return (
        <svg {...common}>
          {defs}
          {shadow}
          <path d="M18 90 L92 72 L96 82 L22 100 Z" fill={frame} stroke={black} strokeWidth="1" />
          <path d="M22 92 L88 76" stroke={chrome} strokeWidth="1.5" opacity="0.4" />
          <rect x="14" y="96" width="14" height="6" rx="2" fill={black} />
          <path d="M78 70 L92 30" stroke={frame} strokeWidth="6" strokeLinecap="round" />
          <path d="M64 74 L76 36" stroke={frame} strokeWidth="6" strokeLinecap="round" />
          <path d="M88 32 Q94 26 100 30" stroke={chrome} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M74 38 Q80 32 86 36" stroke={chrome} strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="92" cy="26" r="4" fill={seat} />
        </svg>
      );

    default:
      return <Pictogram icon={icon} size={size} />;
  }
}

function EvolutionPanel({ exercise, weightValue, setWeight, history, logEvolution }) {
  const weeks = weeklySeries(history);
  const prevMax = history.length ? Math.max(...history.map((h) => h.weight)) : 0;
  const [justPR, setJustPR] = useState(false);
  const totalVolume = history.reduce((sum, h) => sum + (h.volume || 0), 0);
  const lastVolume = history.length ? history[history.length - 1].volume : null;

  const handleSave = () => {
    const w = Number(weightValue);
    if (!(w > 0)) return;
    if (w > prevMax) {
      setJustPR(true);
      setTimeout(() => setJustPR(false), 3200);
    }
    logEvolution(weightValue);
  };

  return (
    <div>
      {justPR && (
        <div
          className="modal-pop"
          style={{
            background: "linear-gradient(120deg, var(--accent), var(--accent-dark))",
            color: "#12161A",
            borderRadius: 12,
            padding: "12px 14px",
            fontFamily: "Inter",
            fontWeight: 700,
            fontSize: 13,
            marginBottom: 14,
            textAlign: "center",
          }}
        >
          🏆 Record battu !
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <input
          type="number"
          min={0}
          value={weightValue}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Poids"
          style={{ ...inputStyle, flex: 1 }}
        />
        <span style={{ fontFamily: "Inter", fontSize: 12.5, color: "var(--text-muted)" }}>kg</span>
        <button
          onClick={handleSave}
          disabled={!(Number(weightValue) > 0)}
          style={{ border: "none", borderRadius: 10, padding: "11px 16px", fontFamily: "Inter", fontWeight: 700, fontSize: 12.5, cursor: Number(weightValue) > 0 ? "pointer" : "default", background: Number(weightValue) > 0 ? "var(--accent)" : "var(--surface-raised)", color: Number(weightValue) > 0 ? "#12161A" : "var(--text-muted)" }}
        >
          Enregistrer
        </button>
      </div>

      {prevMax > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, fontFamily: "Inter", fontSize: 11.5, color: "var(--text-muted)" }}>
          🏆 Record actuel : <span style={{ color: "var(--accent)", fontWeight: 700 }}>{prevMax}kg</span>
        </div>
      )}

      {lastVolume != null && (
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <div style={{ flex: 1, background: "var(--surface-raised)", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontFamily: "Inter", fontSize: 10.5, color: "var(--text-muted)" }}>Volume dernière séance</div>
            <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{lastVolume.toLocaleString("fr-FR")} kg</div>
          </div>
          <div style={{ flex: 1, background: "var(--surface-raised)", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontFamily: "Inter", fontSize: 10.5, color: "var(--text-muted)" }}>Volume cumulé</div>
            <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{totalVolume.toLocaleString("fr-FR")} kg</div>
          </div>
        </div>
      )}

      <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 12, letterSpacing: "0.4px", color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase" }}>
        Progression par semaine
      </div>
      <div className="track-bg" style={{ borderRadius: 16, padding: "16px 14px 10px", position: "relative", overflow: "hidden" }}>
        <ProgressionChart weeks={weeks} />
      </div>
    </div>
  );
}

function ProgressionChart({ weeks }) {
  if (weeks.length === 0) {
    return <div style={{ fontFamily: "Inter", fontSize: 12, color: "var(--text-muted)" }}>Pas encore de données — enregistre un premier poids.</div>;
  }
  const W = 420;
  const H = 180;
  const padL = 34;
  const padR = 14;
  const padT = 14;
  const padB = 28;
  const values = weeks.map((h) => h.weight);
  const minW = Math.min(...values);
  const maxW = Math.max(...values);
  const range = maxW - minW || 1;
  const stepX = weeks.length > 1 ? (W - padL - padR) / (weeks.length - 1) : 0;

  const points = weeks.map((h, i) => {
    const x = weeks.length > 1 ? padL + i * stepX : (padL + (W - padR)) / 2;
    const y = padT + (H - padT - padB) * (1 - (h.weight - minW) / range);
    return { x, y, ...h };
  });
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="var(--surface-raised)" strokeWidth="1" />
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--surface-raised)" strokeWidth="1" />
        <text x={4} y={padT + 4} fontSize="9" fill="var(--text-muted)" fontFamily="Roboto Mono, monospace">{maxW}</text>
        <text x={4} y={H - padB} fontSize="9" fill="var(--text-muted)" fontFamily="Roboto Mono, monospace">{minW}</text>
        <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="var(--accent)" stroke="var(--surface)" strokeWidth="1.5" />
            <text x={p.x} y={H - padB + 14} fontSize="8.5" fill="var(--text-muted)" fontFamily="Inter" textAnchor="middle">
              {p.label.replace("Semaine ", "S")}
            </text>
          </g>
        ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontFamily: "Inter", fontSize: 10.5, color: "var(--text-muted)" }}>{weeks[0].label} · {weeks[0].weight}kg</span>
        <span style={{ fontFamily: "Inter", fontSize: 10.5, color: "var(--accent)", fontWeight: 700 }}>{weeks[weeks.length - 1].label} · {weeks[weeks.length - 1].weight}kg</span>
      </div>
    </div>
  );
}

function CreerView({ saveSession, defaultDay }) {
  const [weekday, setWeekday] = useState(defaultDay && WEEKDAYS.includes(defaultDay) ? defaultDay : WEEKDAYS[0]);
  const [activeGroup, setActiveGroup] = useState("Pecs & Triceps");
  const [picked, setPicked] = useState([]);
  const [customName, setCustomName] = useState("");

  const togglePick = (name) => {
    const exists = picked.find((p) => p.name === name);
    if (exists) setPicked(picked.filter((p) => p.name !== name));
    else setPicked([...picked, { name, sets: 3, reps: "12", superset: false }]);
  };

  const addCustom = () => {
    const name = customName.trim();
    if (!name || picked.find((p) => p.name === name)) return;
    setPicked([...picked, { name, sets: 3, reps: "12", superset: false }]);
    setCustomName("");
  };

  const updateField = (name, field, value) => setPicked(picked.map((p) => (p.name === name ? { ...p, [field]: value } : p)));
  const removePicked = (name) => setPicked(picked.filter((p) => p.name !== name));

  const canSave = picked.length > 0;
  const handleSave = () => {
    if (!canSave) return;
    let letterIndex = 0;
    const tags = new Array(picked.length).fill(null);
    picked.forEach((p, i) => {
      if (p.superset && i > 0) {
        if (!tags[i - 1]) {
          letterIndex++;
          tags[i - 1] = `S${letterIndex}`;
        }
        tags[i] = tags[i - 1];
      }
    });
    saveSession(
      weekday,
      activeGroup,
      picked.map((p, i) => ({ name: p.name, sets: Number(p.sets) || 1, reps: p.reps || "-", superset: tags[i] || undefined }))
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <StepLabel n={1} text="Choisis le jour" />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {WEEKDAYS.map((d) => (
            <button key={d} onClick={() => setWeekday(d)} style={{ border: "none", borderRadius: 20, padding: "7px 12px", fontFamily: "Inter", fontSize: 12, fontWeight: 600, cursor: "pointer", background: weekday === d ? "var(--accent)" : "var(--surface)", color: weekday === d ? "#1A2127" : "var(--text-muted)" }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      <div>
        <StepLabel n={2} text="Choisis le groupe musculaire" />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Object.keys(GROUP_STYLE).map((group) => (
            <button
              key={group}
              onClick={() => { setActiveGroup(group); setPicked([]); }}
              style={{
                border: activeGroup === group ? "1px solid var(--accent)" : "1px solid var(--surface-raised)",
                borderRadius: 12,
                padding: "8px 10px",
                fontFamily: "Inter",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                background: activeGroup === group ? "rgba(255,90,54,0.10)" : "var(--surface)",
                color: activeGroup === group ? "var(--accent)" : "var(--text)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <MachineThumb group={group} size={22} />
              {group}
            </button>
          ))}
        </div>
      </div>

      <div>
        <StepLabel n={3} text="Choisis tes exercices" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {EXERCISE_LIBRARY[activeGroup].map((name) => {
            const active = !!picked.find((p) => p.name === name);
            return (
              <button
                key={name}
                onClick={() => togglePick(name)}
                style={{
                  border: active ? "1px solid var(--accent)" : "1px solid var(--surface-raised)",
                  borderRadius: 12,
                  padding: 10,
                  fontFamily: "Inter",
                  cursor: "pointer",
                  background: active ? "rgba(255,90,54,0.10)" : "var(--surface)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  textAlign: "left",
                }}
              >
                <MachineThumb group={activeGroup} name={name} size={38} />
                <span style={{ fontSize: 12.5, fontWeight: 500, color: active ? "var(--accent)" : "var(--text)", lineHeight: 1.25 }}>
                  {active ? "✓ " : ""}
                  {name}
                </span>
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <input value={customName} onChange={(e) => setCustomName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCustom()} placeholder="Autre exercice…" style={{ ...inputStyle, flex: 1 }} />
          <button onClick={addCustom} style={{ ...smallBtnStyle, background: "var(--surface-raised)" }}>Ajouter</button>
        </div>
      </div>

      {picked.length > 0 && (
        <div>
          <StepLabel n={4} text="Règle séries & répétitions" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {picked.map((p, i) => (
              <div key={p.name}>
                <div style={{ background: "var(--surface)", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                  <MachineThumb group={activeGroup} name={p.name} size={30} />
                  <div style={{ flex: 1, fontFamily: "Inter", fontSize: 13, color: "var(--text)" }}>{p.name}</div>
                  <input type="number" min={1} value={p.sets} onChange={(e) => updateField(p.name, "sets", e.target.value)} style={{ ...miniInputStyle, width: 42 }} />
                  <span style={{ color: "var(--text-muted)", fontSize: 11, fontFamily: "Inter" }}>séries</span>
                  <input value={p.reps} onChange={(e) => updateField(p.name, "reps", e.target.value)} style={{ ...miniInputStyle, width: 52 }} />
                  <button onClick={() => removePicked(p.name)} style={{ border: "none", background: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 14 }} aria-label="Retirer">✕</button>
                </div>
                {i > 0 && (
                  <label style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, marginLeft: 6, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={!!p.superset}
                      onChange={(e) => updateField(p.name, "superset", e.target.checked)}
                      style={{ accentColor: "var(--accent)" }}
                    />
                    <span style={{ fontFamily: "Inter", fontSize: 11, color: "var(--text-muted)" }}>
                      🔗 Enchaîner en superset avec "{picked[i - 1].name}" (sans repos)
                    </span>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={handleSave} disabled={!canSave} style={{ border: "none", borderRadius: 12, padding: "13px 0", fontFamily: "Inter", fontWeight: 700, fontSize: 14, letterSpacing: "0.3px", cursor: canSave ? "pointer" : "default", background: canSave ? "var(--accent)" : "var(--surface)", color: canSave ? "#1A2127" : "var(--text-muted)" }}>
        Enregistrer la séance
      </button>
    </div>
  );
}

function StepLabel({ n, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--accent)", color: "#1A2127", fontFamily: "'Roboto Mono', monospace", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
      <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 13.5, color: "var(--text)" }}>{text}</div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid var(--surface-raised)",
  background: "var(--surface)",
  color: "var(--text)",
  borderRadius: 10,
  padding: "11px 13px",
  fontFamily: "Inter",
  fontSize: 13.5,
  outline: "none",
};

const miniInputStyle = {
  border: "1px solid var(--surface-raised)",
  background: "var(--surface-raised)",
  color: "var(--text)",
  borderRadius: 7,
  padding: "6px 8px",
  fontFamily: "'Roboto Mono', monospace",
  fontSize: 12,
  outline: "none",
  textAlign: "center",
};

const smallBtnStyle = {
  border: "none",
  borderRadius: 8,
  padding: "8px 12px",
  fontFamily: "Inter",
  fontSize: 12,
  background: "var(--surface-raised)",
  color: "var(--text)",
  cursor: "pointer",
};

const backBtnStyle = {
  border: "none",
  borderRadius: 8,
  padding: "8px 12px",
  fontFamily: "Inter",
  fontSize: 12,
  fontWeight: 600,
  background: "var(--surface)",
  color: "var(--text)",
  cursor: "pointer",
};

const createBtnStyle = {
  width: "100%",
  marginTop: 14,
  border: "1px dashed var(--surface-raised)",
  borderRadius: 12,
  padding: "13px 0",
  fontFamily: "Inter",
  fontWeight: 600,
  fontSize: 13,
  background: "transparent",
  color: "var(--text-muted)",
  cursor: "pointer",
};

const rootStyle = {
  "--bg": "#111417",
  "--surface": "#1C2024",
  "--surface-raised": "#262B30",
  "--accent": "#F37121",
  "--accent-dark": "#C2560F",
  "--success": "#4ADE94",
  "--text": "#F5F6F3",
  "--text-muted": "#8B9199",
  background: "var(--bg)",
  minHeight: "100%",
  width: "100%",
};
