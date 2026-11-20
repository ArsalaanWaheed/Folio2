'use client';
import { Fragment as ReactFragment, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X, Mail, Linkedin, BookOpen, Brain, HeartHandshake, FileText } from 'lucide-react';

import { blockAnchor, type ContentDetails, type PortfolioContent } from '../lib/portfolio-content';

function cardIcon(name: string, size: number, className?: string) {
  const Icon = { brain: Brain, heart: HeartHandshake, book: BookOpen, document: FileText }[name];
  return Icon ? <Icon size={size} strokeWidth={1.2} className={className} aria-hidden="true" /> : null;
}

function Reveal({children,className='',delay=0}:{children:React.ReactNode,className?:string,delay?:number}){const reduced=useReducedMotion();return <motion.div initial={reduced?false:{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.7,delay,ease:[.22,1,.36,1]}} className={className}>{children}</motion.div>}
function SectionTitle({eyebrow,title}:{eyebrow:string,title:string}){return <div className="mb-12 md:mb-20"><div className="flex items-center gap-5 mb-6"><span className="eyebrow text-neutral-500">{eyebrow}</span><span className="section-rule flex-1"/></div><h2 className="serif text-5xl sm:text-6xl md:text-[6.5rem] leading-[.92] tracking-[-.035em]">{title}</h2></div>}
type Media = Pick<ContentDetails, 'imageUrl' | 'imageAlt' | 'imagePlacement' | 'imageFit' | 'surface' | 'links'>;

function ContentMedia({ media, children }: { media: Media; children?: React.ReactNode }) {
  const links = media.links.filter(link => link.label && link.href);
  const hasCopy = Boolean(children || links.length);
  if (!hasCopy && !media.imageUrl) return null;

  return <div className="content-media" data-surface={media.surface} data-image-placement={media.imagePlacement} data-image-fit={media.imageFit} data-split={hasCopy && Boolean(media.imageUrl) ? 'true' : undefined}>
    {media.imageUrl && (
      // eslint-disable-next-line @next/next/no-img-element -- Owner uploads are optimized on ingestion. Existing external images are supported too.
      <img src={media.imageUrl} alt={media.imageAlt} loading="lazy" className="content-media-image" />
    )}
    {hasCopy && <div className="content-media-copy">
      {children}
      {links.length > 0 && <ul className="content-media-links">
        {links.map((link, index) => <li key={index}>
          <a className="focus-ring" href={link.href}>{link.label}<ArrowUpRight size={14} aria-hidden="true" /></a>
        </li>)}
      </ul>}
    </div>}
  </div>;
}

function ExtraContent({ details, headingLevel = 'h3' }: { details: ContentDetails; headingLevel?: 'h3' | 'h4' }) {
  const Heading = headingLevel;
  return <ContentMedia media={details}>
    {(details.heading || details.body) && <>
      {details.heading && <Heading className="serif text-3xl">{details.heading}</Heading>}
      {details.body && <p className="whitespace-pre-line leading-relaxed">{details.body}</p>}
    </>}
  </ContentMedia>;
}

export default function Portfolio({ content }: { content: PortfolioContent }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { site, hero, about, research, education, skills, experience, contact, appearance } = content;
  const visibleSections = content.sections.filter(section => section.visible);
  const visibleAnchors = new Set(['#top', ...visibleSections.map(section => '#' + section.id), ...content.blocks.map((block, index) => '#' + blockAnchor(block, index))]);
  const nav = content.navigation.filter(item => !item.href.startsWith('#') || visibleAnchors.has(item.href));
  const contactVisible = visibleAnchors.has('#contact');
  const firstSection = visibleSections[0]?.id;
  const heroTarget = hero.buttonUrl || (visibleAnchors.has('#about') ? '#about' : firstSection ? '#' + firstSection : content.blocks.length ? '#' + blockAnchor(content.blocks[0], 0) : '');
  const headerButtonTarget = site.contactButtonUrl || (contactVisible ? '#contact' : '');
  const sections: Record<string, React.ReactNode> = {
    about: (<section id="about" className="section-space container-wide"><Reveal><SectionTitle eyebrow={about.eyebrow} title={about.title}/></Reveal><div className="grid lg:grid-cols-12 gap-10 lg:gap-20"><Reveal className="lg:col-span-7">
  <blockquote className="reflection-card">
    {about.extras.showArtwork && <div className="reflection-sketch" aria-hidden="true" />}
    <p className="serif text-3xl sm:text-4xl md:text-5xl leading-[1.16]">“{about.quote}<em>{about.quoteEmphasis}</em>”</p>
  </blockquote>
</Reveal><Reveal className="lg:col-span-5" delay={.1}><div className="space-y-6 text-neutral-600 leading-[1.9] text-sm sm:text-base"><p>{about.biography}</p><p>{about.background}</p><p className="text-xs italic">{about.note}</p></div><div className="flex flex-wrap gap-3 mt-9">{about.interests.map((interest, i) => <span key={i} className="interest-tag border border-[var(--line)] rounded-full px-4 py-2 text-xs">{interest}</span>)}</div></Reveal></div><ExtraContent details={about.extras} /></section>),
    research: (<section id="research" className="section-space bg-[var(--blush)]"><div className="container-wide"><Reveal className={research.extras.showArtwork ? "research-heading" : undefined}>{research.extras.showArtwork && <div className="research-sketch" aria-hidden="true" />}<div><SectionTitle eyebrow={research.eyebrow} title={research.title}/><p className="max-w-xl text-neutral-600 mb-12 leading-relaxed">{research.introduction}</p></div></Reveal><div className="border-t border-[var(--line)]">{research.projects.map((p,i)=><Reveal key={i} delay={Math.min(i * .07, .35)}><article className="project-card group grid md:grid-cols-12 gap-5 md:gap-10 py-9 md:py-12 px-3 border-b border-[var(--line)]"><span className="md:col-span-1 serif text-2xl text-neutral-500">{p.number}</span><div className="md:col-span-7"><p className="eyebrow text-neutral-500 mb-4">{p.category}</p><h3 className="serif text-4xl sm:text-5xl mb-5">{p.title}</h3><p className="text-neutral-600 text-sm leading-relaxed max-w-xl">{p.description}</p><div className="flex flex-wrap gap-2 mt-6">{p.tags.map((t, index)=><span key={index} className="text-[11px] interest-tag border border-[var(--line)] px-3 py-1.5 rounded-full">{t}</span>)}</div><ExtraContent details={p.extras} headingLevel="h4" /></div><div className="md:col-span-4 flex items-end md:justify-end">{research.extras.showArtwork && p.extras.showArtwork && <span className="outline-number serif text-7xl md:text-9xl leading-none">{p.number}</span>}</div></article></Reveal>)}</div><ExtraContent details={research.extras} /></div></section>),
    education: (<section id="education" className="section-space container-wide"><Reveal><SectionTitle eyebrow={education.eyebrow} title={education.title}/></Reveal><Reveal><div className="education-card grid md:grid-cols-12 gap-6">
  <div className="education-marker md:col-span-3">
    {education.extras.showArtwork && <div className="education-sketch" aria-hidden="true" />}
    <p className="eyebrow">{education.status}</p>
  </div><div className="md:col-span-7"><h3 className="serif text-4xl md:text-5xl">{education.degree}</h3><p className="mt-3 text-neutral-600">{education.institution}</p><p className="mt-5 text-sm leading-relaxed text-neutral-600">{education.description}</p></div><div className="md:col-span-2 md:text-right text-xs text-neutral-500 uppercase tracking-widest">{education.graduationLabel}<br/>{education.graduation}</div></div></Reveal><ExtraContent details={education.extras} /></section>),
    skills: (<section id="skills" className="section-space bg-[var(--berry)] text-[var(--paper)]"><div className="container-wide"><Reveal><div className="mb-14"><p className="eyebrow text-[#f3b9d0] mb-6">{skills.eyebrow}</p><h2 className="serif text-6xl md:text-8xl">{skills.title}</h2></div></Reveal><div className="grid md:grid-cols-3 gap-5">{skills.cards.map((s,i)=><Reveal key={i} delay={Math.min(i * .1, .35)}><div className="skill-card border border-[#aa758d]/50 bg-[#ffffff0d] p-7 md:p-9 min-h-[320px] flex flex-col">{skills.extras.showArtwork && s.extras.showArtwork && cardIcon(s.icon, 30, "mb-14 text-[#f3b9d0]")}<h3 className="serif text-3xl mb-6">{s.title}</h3><ul className="space-y-3 mt-auto text-sm text-[#f1c9d9]">{s.items.map((x, index)=><li key={index} className="border-t border-[#aa758d]/50 pt-3">{x}</li>)}</ul><ExtraContent details={s.extras} headingLevel="h4" /></div></Reveal>)}</div><p className="text-[#e8b6ca] text-xs mt-6">{skills.note}</p><ExtraContent details={skills.extras} /></div></section>),
    experience: (<section id="experience" className="section-space container-wide">
  <Reveal><SectionTitle eyebrow={experience.eyebrow} title={experience.title} /></Reveal>
  <div className="grid md:grid-cols-2 gap-12">
    {experience.cards.map((card, index) => <Reveal key={index} delay={Math.min(index * .1, .3)}>
      <article className="border-t border-[var(--line)] pt-7">
        <div className="flex justify-between gap-4 mb-8">
          <span className="eyebrow text-neutral-500">{card.category}</span>
          {experience.extras.showArtwork && card.extras.showArtwork && cardIcon(card.icon, 23)}
        </div>
        <h3 className="serif text-4xl mb-4">{card.title}</h3>
        <p className="text-neutral-600 leading-relaxed text-sm whitespace-pre-line">{card.description}</p>
        {card.status && <p className="mt-7 text-xs uppercase tracking-widest text-neutral-500">{card.status}</p>}
        <ExtraContent details={card.extras} headingLevel="h4" />
      </article>
    </Reveal>)}
  </div>
  <ExtraContent details={experience.extras} />
</section>),
    contact: (<section id="contact" className="relative section-space contact-surface"><div className="absolute inset-0 grain opacity-30"/><div className="container-wide relative"><Reveal>
  <div className="contact-heading">
  <div className="min-w-0 break-words"><p className="eyebrow mb-8">{contact.eyebrow}</p><h2 className="serif text-[clamp(4.7rem,12vw,11rem)] tracking-[-.06em] leading-[.84]">{contact.title}</h2></div>{contact.extras.showArtwork && <div className="contact-sketch" aria-hidden="true" />}</div><div className="flex flex-col md:flex-row justify-between md:items-end gap-10 mt-14 md:mt-20"><p className="text-neutral-600 leading-relaxed max-w-sm">{contact.description}</p><div className="contact-card flex flex-col gap-4">{contact.email && contact.emailLabel && <a href={`mailto:${contact.email}`} className="contact-link group focus-ring flex items-center gap-4 border-b border-[var(--rose)] pb-3 text-sm">{contact.emailLabel} <span className="ml-auto"><Mail size={18}/></span></a>}{contact.linkedin && contact.linkedinLabel && <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link group focus-ring flex items-center gap-4 border-b border-[var(--rose)] pb-3 text-sm">{contact.linkedinLabel} <span className="ml-auto"><Linkedin size={18}/></span></a>}<p className="text-xs text-neutral-500">{contact.note}</p></div></div></Reveal><ExtraContent details={contact.extras} /></div></section>),
  };
  const customBlocks = content.blocks.map((block, index) => ({
    anchor: blockAnchor(block, index),
    placement: visibleSections.some(section => section.id === block.placement) ? block.placement : 'end',
    block,
  }));
  function renderBlocks(placement: string) {
    return customBlocks.filter(item => item.placement === placement).map(({ block, anchor }) => (
  <section key={anchor} id={anchor} className="section-space container-wide custom-section">
    <Reveal>
      <ContentMedia media={{ ...block, links: [
        ...(block.linkLabel && block.linkUrl ? [{ label: block.linkLabel, href: block.linkUrl }] : []),
        ...block.links,
      ] }}>
        {(block.eyebrow || block.title || block.body) && <>
          {block.eyebrow && <p className="eyebrow text-[var(--rose)]">{block.eyebrow}</p>}
          {block.title && <h2 className="serif text-4xl md:text-6xl">{block.title}</h2>}
          {block.body && (block.layout === 'quote'
            ? <blockquote className="serif text-3xl md:text-5xl whitespace-pre-line">{block.body}</blockquote>
            : <p className="whitespace-pre-line leading-relaxed">{block.body}</p>)}
        </>}
      </ContentMedia>
    </Reveal>
  </section>
    ));
  }
  return <main className="overflow-hidden portfolio-page" style={{ '--rose': appearance.accent, '--berry': appearance.dark, '--paper': appearance.paper, '--ink': appearance.ink, '--blush': appearance.blush, '--line': appearance.border, '--hero-glow': appearance.heroGlow, '--contact-tint': appearance.contactTint } as React.CSSProperties}>
<header className="absolute top-0 left-0 right-0 z-50"><div className="container-wide flex items-center justify-between h-24 border-b border-[var(--line)]"><a href="#top" className="focus-ring text-xl font-semibold tracking-[-.06em]">{site.logo}</a><nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">{nav.map(item=><a key={item.href + item.label} className="focus-ring text-xs uppercase tracking-[.15em] hover:opacity-50 transition" href={item.href}>{item.label}</a>)}</nav>{headerButtonTarget && site.contactButton && <a href={headerButtonTarget} className="hidden md:flex items-center gap-2 text-xs uppercase tracking-[.15em] border-b border-[var(--rose)] pb-1">{site.contactButton} <ArrowUpRight size={15}/></a>}<button aria-label={menuOpen?'Close menu':'Open menu'} aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)} className="md:hidden focus-ring p-2">{menuOpen?<X/>:<Menu/>}</button></div>{menuOpen&&<nav aria-label="Mobile navigation" className="mobile-nav md:hidden bg-[var(--paper)] border-b border-[var(--line)] px-6 py-7 flex flex-col gap-5">{nav.map(item=><a key={item.href + item.label} onClick={()=>setMenuOpen(false)} href={item.href} className="text-xl serif">{item.label}</a>)}</nav>}</header>
<section id="top" className="relative min-h-[790px] min-h-[100svh] flex items-center pt-28 pb-16 hero-surface"><div className="absolute inset-0 grain opacity-40"/><div className={hero.portraitUrl ? 'container-wide relative z-10 hero-with-portrait' : 'container-wide relative z-10'}>
  {hero.portraitUrl && <figure className="hero-portrait">
    <img src={hero.portraitUrl} alt={hero.portraitAlt} fetchPriority="high" />
  </figure>}
  <div className="hero-copy"><div className="eyebrow mb-8 hero-eyebrow flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[var(--rose)]"/> {hero.eyebrow}</div><h1 className="serif text-[clamp(5.2rem,14.8vw,14.5rem)] leading-[.74] tracking-[-.065em] hero-name">{hero.extras.showArtwork && <span className="hero-rings" aria-hidden="true"><span className="hero-ring"/><span className="hero-ring"/><span className="hero-ring"/></span>}<span className="relative block hero-name-first">{hero.firstLine}</span><span className="relative block italic font-normal ml-[.15em] hero-name-last text-[var(--rose)]">{hero.secondLine}</span></h1>
  {hero.urduLine && <figure className="hero-verse">
    <p lang="ur" dir="rtl" className="urdu-script">{hero.urduLine}</p>
    {hero.urduTranslation && <figcaption>{hero.urduTranslation}</figcaption>}
  </figure>}
  <div className="hero-intro mt-8 md:mt-10 flex flex-col md:flex-row md:items-end justify-between gap-9"><p className="max-w-md text-base md:text-lg leading-relaxed text-neutral-700 whitespace-pre-line">{hero.introduction}</p>{heroTarget && hero.button && <a href={heroTarget} className="group focus-ring flex items-center gap-4 w-fit"><span className="eyebrow">{hero.button}</span><span className="arrow-circle"><ArrowDown size={17}/></span></a>}</div><ExtraContent details={hero.extras} /></div></div><div className="absolute bottom-5 left-0 right-0"><div className="container-wide flex justify-between text-[10px] tracking-[.2em] uppercase text-neutral-600"><span>{hero.status}</span><span className="hidden sm:block">{hero.scrollHint}</span></div></div></section>
{visibleSections.map(section => <ReactFragment key={section.id}>{renderBlocks(section.id)}{sections[section.id]}</ReactFragment>)}
{renderBlocks('end')}
<footer className="bg-[var(--berry-deep)] text-white py-9"><div className="container-wide flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"><a href="#top" className="font-semibold text-xl tracking-[-.06em]">{site.logo}</a><span className="text-xs text-[#e8b6ca]">© {new Date().getFullYear()} {site.footer}</span><a href="#top" className="text-xs uppercase tracking-widest flex items-center gap-2">{site.backToTop} <ArrowRight size={14} className="-rotate-90"/></a></div></footer>
</main>}
