import { defaultPortfolio, blockAnchor, icons, imageFits, imagePlacements, layouts, placements, surfaces, newBlock, newLink, type PortfolioContent } from './portfolio-content';

function safeLink(value: string, anchors = false) {
  if (!value) return true;
  if (anchors && /^#[a-z][a-z0-9-]*$/.test(value)) return true;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password;
  } catch {
    return false;
  }
}

function validate(value: unknown, example: unknown, path = ''): unknown {
  const field = path.split('.').at(-1) ?? '';
  if (value === undefined && ['extras', 'links', 'imagePlacement', 'imageFit', 'surface', 'buttonUrl', 'contactButtonUrl'].includes(field)) return structuredClone(example);
  if (value === undefined && (path === 'hero.portraitUrl' || path === 'hero.portraitAlt' || path === 'hero.urduLine' || path === 'hero.urduTranslation')) return example;
  const invalid = () => { throw new Error('Check the value in ' + path + '.'); };

  if (typeof example === 'string') {
    if (typeof value !== 'string' || value.length > 12_000) return invalid();
    if (path.startsWith('appearance.') && !/^#[\da-f]{6}$/i.test(value)) return invalid();
    if (field === 'icon' && !icons.includes(value)) return invalid();
    if (field === 'imagePlacement' && !imagePlacements.includes(value)) return invalid();
    if (field === 'imageFit' && !imageFits.includes(value)) return invalid();
    if (field === 'surface' && !surfaces.includes(value)) return invalid();
    if (field === 'layout' && !layouts.includes(value)) return invalid();
    if (field === 'placement' && !placements.includes(value)) return invalid();
    if (field === 'anchor' && value && (!/^[a-z][a-z0-9-]{0,62}$/.test(value) || ['top', ...placements].includes(value))) return invalid();
    if (field === 'email' && value && !/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(value)) return invalid();
    if (field === 'portraitUrl' && !/^\/(?!\/)[a-z0-9_./-]+$/i.test(value) && !safeLink(value)) return invalid();
    if (field === 'imageUrl' && !/^\/portfolio-media\/[a-f0-9]{64}\.webp$/.test(value) && !safeLink(value)) return invalid();
    if (['linkUrl', 'buttonUrl', 'contactButtonUrl', 'linkedin', 'href'].includes(field) && !safeLink(value, field !== 'linkedin')) return invalid();
    return value;
  }
  if (typeof example === 'boolean') return typeof value === 'boolean' ? value : invalid();
  if (Array.isArray(example)) {
    if (!Array.isArray(value) || value.length > 60) return invalid();
    const template = path === 'blocks' ? newBlock : field === 'links' ? newLink : example[0];
    return value.map((item, index) => {
      const checked = validate(item, template, path + '.' + (index + 1));
      if (field === 'links') {
        const link = checked as typeof newLink;
        if (!link.label.trim() || !link.href) throw new Error('Give every added link a label and destination in ' + path + '.');
      }
      return checked;
    });
  }
  if (!example || typeof example !== 'object' || !value || typeof value !== 'object' || Array.isArray(value)) return invalid();
  const input = value as Record<string, unknown>;
  return Object.fromEntries(Object.entries(example).map(([key, template]) => [
    key, validate(input[key], template, path ? path + '.' + key : key),
  ]));
}

export function parsePortfolio(value: unknown): PortfolioContent {
  const content = validate(value, defaultPortfolio) as PortfolioContent;
  const sectionIds = new Set(content.sections.map(section => section.id));
  if (content.sections.length !== defaultPortfolio.sections.length || !defaultPortfolio.sections.every(section => sectionIds.has(section.id))) {
    throw new Error('The section list must include each built-in section once.');
  }
  const anchors = content.blocks.map(blockAnchor);
  if (new Set(anchors).size !== anchors.length) throw new Error('Custom blocks need unique anchors.');
  if (content.navigation.some(item => !item.href || !item.label.trim())) throw new Error('Give each navigation item a label and destination.');
  return content;
}
