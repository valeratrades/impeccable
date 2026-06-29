import os from 'node:os';
import path from 'node:path';

// Impeccable keeps all per-project sidecar/cache state in one central tree
// instead of dropping a `.impeccable/` dir into every project. State is keyed by
// the project's path relative to $HOME, so ~/s/btc_line maps to
// $XDG_CACHE_HOME/impeccable/s/btc_line. Projects outside $HOME nest under their
// absolute path (leading separator stripped) so the key never escapes via `..`.
// Override the root with IMPECCABLE_CACHE_ROOT.
export function centralImpeccableDir(projectRoot, env = process.env) {
  const home = os.homedir();
  const xdg = env.XDG_CACHE_HOME && env.XDG_CACHE_HOME.trim();
  const base = (env.IMPECCABLE_CACHE_ROOT && env.IMPECCABLE_CACHE_ROOT.trim())
    || path.join(xdg || path.join(home, '.cache'), 'impeccable');
  const abs = path.resolve(projectRoot);
  const rel = path.relative(home, abs);
  const key = (rel && !rel.startsWith('..') && !path.isAbsolute(rel))
    ? rel
    : abs.replace(/^[/\\]+/, '');
  return path.join(base, key);
}
