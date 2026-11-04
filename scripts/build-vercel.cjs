'use strict';

const { execFileSync, spawnSync } = require('node:child_process');

// Vercel's checkout remote may require credentials unavailable during builds.
// Fetch the public source directly without changing the checkout's origin.
const sourceRepository = 'https://github.com/Monopink/jianghuwiki.git';

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function prepareGitInfo() {
  try {
    if (git('rev-parse', '--is-shallow-repository') === 'true') {
      console.log('Fetching source history for article modification dates…');
      execFileSync('git', ['fetch', '--unshallow', '--no-tags', sourceRepository], {
        stdio: 'inherit',
        timeout: 60000,
        env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
      });
    }
    if (git('rev-parse', '--is-shallow-repository') !== 'false') {
      throw new Error('Complete Git history is required for article modification dates.');
    }
    git('ls-files', '--error-unmatch', 'content.zh/_index.md');
    console.log('Source history verified. Building with article Git metadata.');
    return true;
  } catch {
    console.warn('Source history unavailable. Building without article modification dates.');
    return false;
  }
}

try {
  const enableGitInfo = prepareGitInfo();
  const result = spawnSync('hugo', ['--gc', '--minify', `--enableGitInfo=${enableGitInfo}`], { stdio: 'inherit' });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} catch (error) {
  console.error('Vercel build failed:', error.message);
  process.exitCode = 1;
}
