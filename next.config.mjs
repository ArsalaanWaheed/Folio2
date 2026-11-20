import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

export default function config(phase) {
  return phase === PHASE_DEVELOPMENT_SERVER ? { distDir: '.next-dev' } : {};
}
