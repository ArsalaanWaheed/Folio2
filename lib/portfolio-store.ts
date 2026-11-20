import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { defaultPortfolio, type PortfolioContent } from './portfolio-content';
import { parsePortfolio } from './portfolio-validation';

const filename = path.resolve(process.env.PORTFOLIO_DATA_FILE || '.data/portfolio.json');
const revisionOf = (content: PortfolioContent) => createHash('sha256').update(JSON.stringify(content)).digest('hex');
let pendingWrite: Promise<unknown> = Promise.resolve();

export async function readPortfolio() {
  let content: PortfolioContent;
  try {
    content = parsePortfolio(JSON.parse(await readFile(filename, 'utf8')));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    content = defaultPortfolio;
  }
  return { content, revision: revisionOf(content) };
}

export function publishPortfolio(content: PortfolioContent, revision: string) {
  const write = pendingWrite.then(async () => {
    if ((await readPortfolio()).revision !== revision) return null;
    await mkdir(path.dirname(filename), { recursive: true });
    const temporary = filename + '.' + randomUUID() + '.tmp';
    try {
      await writeFile(temporary, JSON.stringify(content, null, 2) + '\n', { mode: 0o600, flag: 'wx' });
      await rename(temporary, filename);
    } finally {
      await unlink(temporary).catch(error => { if (error.code !== 'ENOENT') console.error(error); });
    }
    return revisionOf(content);
  });
  pendingWrite = write.catch(() => undefined);
  return write;
}
