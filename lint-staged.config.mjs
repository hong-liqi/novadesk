/** @type {import('lint-staged').Configuration} */
export default {
  '*.{json,md,yml,yaml}': 'prettier --write',
  '*.{ts,tsx,js,jsx}': (filenames) => {
    const prettier = `prettier --write ${filenames.map((f) => `"${f}"`).join(' ')}`;
    const eslintCommands = eslintFixByWorkspace(filenames);
    return [prettier, ...eslintCommands];
  },
};

function eslintFixByWorkspace(filenames) {
  /** @type {Map<string, string[]>} */
  const groups = new Map();

  for (const file of filenames) {
    if (file.includes('/generated/') || file.includes('/dist/')) {
      continue;
    }

    const workspace = resolveWorkspaceRoot(file);
    if (!workspace) {
      continue;
    }

    const list = groups.get(workspace) ?? [];
    list.push(file);
    groups.set(workspace, list);
  }

  return [...groups.entries()].map(([workspace, files]) => {
    const relativePaths = files.map((f) => `"${f.slice(workspace.length + 1)}"`).join(' ');
    return `cd "${workspace}" && pnpm exec eslint --fix ${relativePaths}`;
  });
}

/** @param {string} file */
function resolveWorkspaceRoot(file) {
  const parts = file.split('/');
  if (parts[0] === 'packages' || parts[0] === 'services' || parts[0] === 'apps') {
    return `${parts[0]}/${parts[1]}`;
  }
  if (parts[0] === 'website') {
    return 'website';
  }
  return null;
}
