export type LogoKey =
  | "docker"
  | "kubernetes"
  | "linux"
  | "bash"
  | "git"
  | "aws"
  | "terraform"
  | "github"
  | "jenkins"
  | "nginx"
  | "python"
  | "ansible";

export interface FloaterConfig {
  key: LogoKey;
  x: number;
  y: number;
  size: number;
  rot: number;
  depth: number;
  speed: number;
  delay: number;
}

export const FLOATER_CONFIG: FloaterConfig[] = [
  { key: "docker",     x:  8, y: 12, size:  92, rot: -12, depth: -120, speed: 4.0, delay: 0.0 },
  { key: "kubernetes", x: 86, y: 14, size:  88, rot:  10, depth:  -80, speed: 4.6, delay: 0.3 },
  { key: "linux",      x:  4, y: 52, size:  82, rot:   8, depth: -160, speed: 5.2, delay: 0.6 },
  { key: "bash",       x: 90, y: 58, size: 110, rot:  -6, depth:  -40, speed: 4.3, delay: 0.9 },
  { key: "git",        x: 14, y: 82, size:  72, rot:  15, depth: -100, speed: 3.8, delay: 0.2 },
  { key: "aws",        x: 82, y: 84, size:  86, rot: -10, depth:  -60, speed: 5.0, delay: 0.5 },
  { key: "terraform",  x: 20, y: 30, size:  60, rot:  18, depth: -220, speed: 4.8, delay: 1.1 },
  { key: "github",     x: 78, y: 38, size:  66, rot: -14, depth: -200, speed: 5.4, delay: 0.7 },
  { key: "jenkins",    x: 28, y: 72, size:  54, rot:   6, depth: -240, speed: 5.1, delay: 1.4 },
  { key: "nginx",      x: 72, y: 22, size:  58, rot:  -4, depth: -180, speed: 4.4, delay: 0.4 },
  { key: "python",     x: 50, y: 92, size:  70, rot:   0, depth: -140, speed: 4.7, delay: 1.0 },
  { key: "ansible",    x: 50, y:  8, size:  56, rot:   7, depth: -260, speed: 5.5, delay: 0.8 },
];

export const LOGO_SVGS: Record<LogoKey, string> = {
  docker: `<svg viewBox="0 0 256 256"><path fill="#2496ED" d="M220 92.3c-5.2-3.5-17.1-4.7-26.4-3-1.1-8.3-5.7-15.5-14-22l-4.7-3.2-3.2 4.7c-4.3 6.3-6.5 15.2-5.8 23.6.3 3 .9 8.3 4.4 12.8-3.5 1.9-10 4.4-19.1 4.2H18.4l-.5 2.9c-2.3 13.4-2.3 55.3 25 71.5 20.8 12.3 45.9 14.7 66.5 14.7 44.3 0 76.5-21 89.8-59.3 8.7.4 27.6-.1 37.2-18.4.3-.6 2.3-4.7 2.9-6.1l1.7-3.5zM92 128H72v20h20zm28 0h-20v20h20zm28 0h-20v20h20zm-56-28H72v20h20zm28 0h-20v20h20zm28 0h-20v20h20zm28 0h-20v20h20zM120 72h-20v20h20zm28 0h-20v20h20z"/></svg>`,
  kubernetes: `<svg viewBox="0 0 256 256"><path fill="#326CE5" d="M128 8L24 64v128l104 56 104-56V64L128 8z"/><g fill="#fff"><circle cx="128" cy="128" r="28"/><path d="M128 60l8 40-8 12-8-12zm0 136l-8-40 8-12 8 12zM60 96l36 20 6 14-14 4zm136 64l-36-20-6-14 14-4zm0-64l-14 4-6 14 36 20zM60 160l14-4 6-14-36 20z"/></g></svg>`,
  linux: `<svg viewBox="0 0 256 256"><circle cx="128" cy="128" r="112" fill="#1e2235"/><ellipse cx="128" cy="210" rx="60" ry="14" fill="#0a0b10" opacity=".4"/><path fill="#f5f5f5" d="M128 50c-22 0-36 19-36 46 0 15 5 25 9 37-9 12-29 24-29 48 0 19 19 33 56 33s56-14 56-33c0-24-20-36-29-48 4-12 9-22 9-37 0-27-14-46-36-46z"/><circle cx="114" cy="96" r="8" fill="#1a1a1a"/><circle cx="142" cy="96" r="8" fill="#1a1a1a"/><circle cx="116" cy="94" r="3" fill="#fff"/><circle cx="144" cy="94" r="3" fill="#fff"/><path fill="#FCC624" d="M120 112c0 5 16 5 16 0-2-4-6-5-8-5s-6 1-8 5z"/><path fill="#FCC624" d="M92 208l-16-14 16-4 6 20zm72 0l16-14-16-4-6 20z"/></svg>`,
  bash: `<svg viewBox="0 0 256 256"><rect x="20" y="40" width="216" height="176" rx="24" fill="#2e3436"/><rect x="20" y="40" width="216" height="28" rx="24" fill="#555753"/><circle cx="40" cy="54" r="4" fill="#ef2929"/><circle cx="56" cy="54" r="4" fill="#fce94f"/><circle cx="72" cy="54" r="4" fill="#8ae234"/><text x="40" y="130" font-family="monospace" font-size="26" font-weight="700" fill="#8ae234">$</text><text x="66" y="130" font-family="monospace" font-size="22" fill="#eeeeec">bash</text><rect x="40" y="152" width="10" height="22" fill="#8ae234"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></rect></svg>`,
  git: `<svg viewBox="0 0 256 256"><path fill="#F05133" d="M250 116L140 6c-7-7-18-7-25 0l-23 23 29 29c7-2 15 0 21 6 6 6 8 14 5 21l28 28c7-2 15 0 21 5 8 8 8 22 0 30-8 8-22 8-30 0-6-6-8-15-5-22l-26-26v68c2 1 4 2 6 4 8 8 8 22 0 30-8 8-22 8-30 0-8-8-8-22 0-30 3-3 6-4 9-5V95c-3-1-6-2-9-5-6-6-8-15-5-22L75 40 6 110c-7 7-7 18 0 25l110 110c7 7 18 7 25 0l109-109c7-7 7-19 0-26z"/></svg>`,
  aws: `<svg viewBox="0 0 256 256"><rect width="256" height="256" rx="40" fill="#232F3E"/><text x="128" y="125" font-family="Arial" font-size="58" font-weight="900" fill="#fff" text-anchor="middle">aws</text><path d="M60 180c40 24 96 24 136 0" stroke="#FF9900" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M180 170l20-4-4 20" stroke="#FF9900" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  terraform: `<svg viewBox="0 0 256 256"><path fill="#5C4EE5" d="M100 74l52 30v60l-52-30z"/><path fill="#4040B2" d="M156 104l52-30v60l-52 30z"/><path fill="#5C4EE5" d="M44 44l52 30v60L44 104z"/><path fill="#7B61FF" d="M100 140l52 30v60l-52-30z"/></svg>`,
  github: `<svg viewBox="0 0 256 256"><circle cx="128" cy="128" r="112" fill="#1e2235"/><path fill="#fff" d="M128 40C78 40 38 80 38 130c0 40 26 74 62 86 4 1 6-2 6-4v-16c-25 5-31-12-31-12-4-11-10-14-10-14-9-6 1-6 1-6 9 0 14 9 14 9 9 14 22 10 27 8 1-6 3-10 6-12-19-2-40-10-40-44 0-10 3-18 9-24-1-2-4-12 1-24 0 0 8-2 24 9 7-2 14-3 22-3s15 1 22 3c16-11 24-9 24-9 5 12 2 22 1 24 6 6 9 14 9 24 0 34-21 42-40 44 3 3 6 8 6 16v24c0 2 2 5 6 4 36-12 62-46 62-86 0-50-40-90-90-90z"/></svg>`,
  jenkins: `<svg viewBox="0 0 256 256"><ellipse cx="128" cy="210" rx="60" ry="18" fill="#D33833"/><path fill="#D33833" d="M80 200c0-20 10-40 10-60-18-14-28-38-22-64 8-36 40-52 68-48 28 3 48 26 50 52 2 22-8 44-28 58 2 22 12 42 10 62-2 14-88 14-88 0z"/><path fill="#F0D6B7" d="M104 110c-4 12 4 24 24 28 18 3 30-6 28-20-1-12-14-22-28-22-12 0-22 6-24 14z"/><circle cx="108" cy="116" r="4" fill="#1a1a1a"/><circle cx="136" cy="116" r="4" fill="#1a1a1a"/></svg>`,
  nginx: `<svg viewBox="0 0 256 256"><path fill="#009639" d="M128 16L22 78v100l106 62 106-62V78z"/><path fill="#fff" d="M90 180V105l70 75v-75h10v95h-12l-68-72v72z"/></svg>`,
  python: `<svg viewBox="0 0 256 256"><path fill="#3776AB" d="M127 20c-35 0-33 15-33 15v20h34v5H81s-23-3-23 36 20 38 20 38h13v-20s-1-22 22-22h35s21 0 21-20V40s3-20-42-20zm-20 12c4 0 6 3 6 6s-2 6-6 6-6-3-6-6 2-6 6-6z"/><path fill="#FFD43B" d="M129 236c35 0 33-15 33-15v-20h-34v-5h47s23 3 23-36-20-38-20-38h-13v20s1 22-22 22h-35s-21 0-21 20v40s-3 12 42 12zm20-12c-4 0-6-3-6-6s2-6 6-6 6 3 6 6-2 6-6 6z"/></svg>`,
  ansible: `<svg viewBox="0 0 256 256"><circle cx="128" cy="128" r="112" fill="#1e2235"/><circle cx="128" cy="128" r="92" fill="#000"/><path fill="#EE0000" d="M128 64l44 110-18-8-26-62-36 84-16-6z"/></svg>`,
};
