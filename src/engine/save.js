import { newMastery } from './mastery.js';

const KEY = 'pebbleton.save.v1';

export function defaultSave() {
  return { version: 1, player: null, cases: {}, mastery: {}, mapPieces: [], badges: 0, muted: false };
}

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && s.version === 1) return { ...defaultSave(), ...s };
  } catch (e) { /* ignore bad or missing save */ }
  return defaultSave();
}

export const save = load();

export function commit() {
  try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) { /* storage may be blocked */ }
}

export function resetSave() {
  const fresh = defaultSave();
  for (const k of Object.keys(save)) delete save[k];
  Object.assign(save, fresh);
  commit();
}

export function caseState(id) {
  return save.cases[id] || (save.cases[id] = { status: 'new', clues: [] });
}

export function mastery(game) {
  return save.mastery[game] || (save.mastery[game] = newMastery());
}

export function exportCode() {
  return btoa(unescape(encodeURIComponent(JSON.stringify(save))));
}

export function importCode(code) {
  const s = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
  if (!s || s.version !== 1) throw new Error('bad save code');
  for (const k of Object.keys(save)) delete save[k];
  Object.assign(save, defaultSave(), s);
  commit();
}
