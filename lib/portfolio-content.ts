export const newLink = { label: '', href: '' };

export const imagePlacements = ['above', 'below', 'left', 'right'];
export const imageFits = ['contain', 'cover'];
export const surfaces = ['plain', 'paper', 'blush'];

export const newDetails = {
  heading: '', body: '', imageUrl: '', imageAlt: '', imagePlacement: 'right',
  imageFit: 'contain', surface: 'plain', showArtwork: true, links: [] as (typeof newLink)[],
};

export type ContentDetails = typeof newDetails;
const defaultDetails = (): ContentDetails => ({ ...newDetails, links: [] });

export const defaultContent = {
  site: {
    title: 'Zuberia Rais | Psychology Portfolio',
    description: 'Academic portfolio of Zuberia Rais, final-year BA Psychology student interested in clinical psychology, research, and compassionate care.',
    socialTitle: 'Zuberia Rais | Psychology Portfolio',
    socialDescription: 'Exploring the human mind with curiosity and compassion.',
    logo: 'ZR.',
    contactButton: 'Let’s talk',
    contactButtonUrl: '',
    footer: 'Zuberia Rais · Made with intention.',
    backToTop: 'Back to top',
  },
  hero: {
    extras: defaultDetails(),
    urduLine: 'دل و ذہن کی جستجو',
    urduTranslation: 'In search of the heart and mind',
    portraitUrl: '/hero-portrait.webp',
    portraitAlt: 'Illustrative placeholder portrait',
    eyebrow: 'An exploration of mind & meaning',
    firstLine: 'Zuberia',
    secondLine: 'Rais.',
    introduction: 'Curious about the human mind.\nCommitted to understanding people.\nInspired by the possibility of meaningful change.',
    button: 'Discover my story',
    buttonUrl: '',
    status: 'BA Psychology · Final Year',
    scrollHint: 'Scroll to explore — 2026',
  },
  about: {
    extras: defaultDetails(),
    eyebrow: '01 / A little about me',
    title: 'The person behind the curiosity.',
    quote: 'To understand the mind is to begin understanding the ',
    quoteEmphasis: 'human experience.',
    biography: 'I’m Zuberia, a final-year BA Psychology student with a growing interest in clinical psychology, mental wellbeing, and the stories that shape how we think, feel, and connect.',
    background: 'My academic journey has encouraged me to approach people with curiosity, compassion, and respect for evidence. I hope to continue learning through research, supervised experience, and meaningful collaboration.',
    note: 'This introduction is sample copy and can be personalized.',
    interests: ['Clinical Psychology', 'Human Behavior', 'Mental Wellbeing'],
  },
  research: {
    extras: defaultDetails(),
    eyebrow: '02 / Selected explorations',
    title: 'Research & projects.',
    introduction: 'Questions worth asking, ideas worth exploring. The entries below are illustrative concepts, not claims of completed work.',
    projects: [
      { extras: defaultDetails(), number: '01', category: 'RESEARCH CONCEPT · SAMPLE', title: 'Understanding Stress & Coping', description: 'An exploratory proposal examining everyday stressors, emotional regulation, and coping strategies among university students.', tags: ['Mental Wellbeing', 'Qualitative Methods'] },
      { extras: defaultDetails(), number: '02', category: 'ACADEMIC PROJECT · SAMPLE', title: 'The Psychology of Connection', description: 'A literature-review concept exploring how interpersonal relationships and social support influence psychological wellbeing.', tags: ['Social Psychology', 'Literature Review'] },
      { extras: defaultDetails(), number: '03', category: 'CASE STUDY · SAMPLE', title: 'Perspectives on Clinical Assessment', description: 'A sample academic case-study framework focused on ethical observation, reflective practice, and evidence-based assessment.', tags: ['Clinical Psychology', 'Ethics'] },
    ],
  },
  education: {
    extras: defaultDetails(),
    eyebrow: '03 / Academic foundation',
    title: 'Learning, always.',
    status: 'Current · Fourth year',
    degree: 'Bachelor of Arts in Psychology',
    institution: 'University name to be added',
    description: 'Areas of study may include abnormal psychology, developmental psychology, psychological assessment, research methodology, and counseling foundations. Replace with confirmed coursework.',
    graduationLabel: 'Expected graduation',
    graduation: 'To be confirmed',
  },
  skills: {
    extras: defaultDetails(),
    eyebrow: '04 / What I’m developing',
    title: 'Skills & strengths.',
    cards: [
      { extras: defaultDetails(), icon: 'brain', title: 'Research & Analysis', items: ['Literature reviews', 'Research design fundamentals', 'Qualitative analysis'] },
      { extras: defaultDetails(), icon: 'heart', title: 'Human-Centered Practice', items: ['Active listening', 'Empathetic communication', 'Ethical awareness'] },
      { extras: defaultDetails(), icon: 'book', title: 'Academic Foundations', items: ['Psychological theories', 'Clinical psychology concepts', 'Academic writing'] },
    ],
    note: 'Suggested skill categories — adjust to reflect actual proficiency.',
  },
  experience: {
    extras: defaultDetails(),
    eyebrow: '05 / Beyond the classroom',
    title: 'Experience & growth.',
    cards: [
      { extras: defaultDetails(), icon: 'heart', category: 'Internships', title: 'Learning through practice.', description: 'Add supervised internships, observational placements, volunteering, or relevant field experience here. Include organization, dates, role, and responsibilities once confirmed.', status: 'Awaiting verified details' },
      { extras: defaultDetails(), icon: 'document', category: 'Certifications', title: 'A commitment to learning.', description: 'Feature relevant workshops, seminars, short courses, and certifications in psychology or research methods. Add credential links where available.', status: 'Awaiting verified details' },
    ],
  },
  contact: {
    extras: defaultDetails(),
    eyebrow: '06 / Start a conversation',
    title: 'Let’s connect.',
    description: 'Open to thoughtful conversations about psychology, research, academic opportunities, and meaningful collaborations.',
    email: 'hello@example.com',
    emailLabel: 'Email me',
    linkedin: 'https://www.linkedin.com/',
    linkedinLabel: 'LinkedIn',
    note: 'Replace placeholder contact links before publishing.',
  },
  appearance: {
    accent: '#96385f', dark: '#54263f', paper: '#fff9fc', ink: '#382332',
    blush: '#faedf3', border: '#e5bfce', heroGlow: '#f4c8db', contactTint: '#f2ccde',
  },
  navigation: [
    { label: 'About', href: '#about' },
    { label: 'Research', href: '#research' },
    { label: 'Education', href: '#education' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ],
  sections: [
    { id: 'about', visible: true }, { id: 'research', visible: true },
    { id: 'education', visible: true }, { id: 'skills', visible: true },
    { id: 'experience', visible: true }, { id: 'contact', visible: true },
  ],
};

export const newBlock = {
  title: '', eyebrow: '', body: '', layout: 'text', imageUrl: '', imageAlt: '',
  linkLabel: '', linkUrl: '', anchor: '', placement: 'end',
  links: [] as (typeof newLink)[], imagePlacement: 'right', imageFit: 'contain', surface: 'paper',
};

export const defaultPortfolio = { ...defaultContent, blocks: [] as (typeof newBlock)[] };
export type PortfolioContent = typeof defaultPortfolio;
export const icons = ['brain', 'heart', 'book', 'document'];
export const layouts = ['text', 'quote', 'image'];
export const placements = ['end', ...defaultContent.sections.map(section => section.id)];
export const blockAnchor = (block: typeof newBlock, index: number) => block.anchor || 'block-' + (index + 1);
