'use client';
import { Fragment as ReactFragment, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X, Mail, Linkedin, BookOpen, Brain, HeartHandshake, FileText } from 'lucide-react';

import { blockAnchor, type PortfolioContent } from '../lib/portfolio-content';

function cardIcon(name: string, size: number, className?: string) {
  const Icon = { brain: Brain, heart: HeartHandshake, book: BookOpen, document: FileText }[name];
  return Icon ? <Icon size={size} strokeWidth={1.2} className={className} aria-hidden="true" /> : null;
}

function Reveal({children,className='',delay=0}:{children:React.ReactNode,className?:string,delay?:number}){const reduced=useReducedMotion();return <motion.div initial={reduced?false:{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.7,delay,ease:[.22,1,.36,1]}} className={className}>{children}</motion.div>}
function SectionTitle({eyebrow,title}:{eyebrow:string,title:string}){return <div className="mb-12 md:mb-20"><div className="flex items-center gap-5 mb-6"><span className="eyebrow text-neutral-500">{eyebrow}</span><span className="section-rule flex-1"/></div><h2 className="serif text-5xl sm:text-6xl md:text-[6.5rem] leading-[.92] tracking-[-.035em]">{title}</h2></div>}
export default function Portfolio({ content }: { content: PortfolioContent }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { site, hero, about, research, education, skills, experience, contact, appearance } = content;
  const visibleSections = content.sections.filter(section => section.visible);
  const visibleAnchors = new Set(['#top', ...visibleSections.map(section => '#' + section.id), ...content.blocks.map((block, index) => '#' + blockAnchor(block, index))]);
  const nav = content.navigation.filter(item => !item.href.startsWith('#') || visibleAnchors.has(item.href));
  const contactVisible = visibleAnchors.has('#contact');
  const firstSection = visibleSections[0]?.id;
  const heroTarget = visibleAnchors.has('#about') ? '#about' : firstSection ? '#' + firstSection : content.blocks.length ? '#' + blockAnchor(content.blocks[0], 0) : '';
  const sections: Record<string, React.ReactNode> = {
    about: (<section id="about" className="section-space container-wide"><Reveal><SectionTitle eyebrow={about.eyebrow} title={about.title}/></Reveal><div className="grid lg:grid-cols-12 gap-10 lg:gap-20"><Reveal className="lg:col-span-7">
  <blockquote className="reflection-card">
    <div className="reflection-sketch" aria-hidden="true" />
    <p className="serif text-3xl sm:text-4xl md:text-5xl leading-[1.16]">“{about.quote}<em>{about.quoteEmphasis}</em>”</p>
  </blockquote>
</Reveal><Reveal className="lg:col-span-5" delay={.1}><div className="space-y-6 text-neutral-600 leading-[1.9] text-sm sm:text-base"><p>{about.biography}</p><p>{about.background}</p><p className="text-xs italic">{about.note}</p></div><div className="flex flex-wrap gap-3 mt-9">{about.interests.map((interest, i) => <span key={i} className="interest-tag border border-[var(--line)] rounded-full px-4 py-2 text-xs">{interest}</span>)}</div></Reveal></div></section>),
    research: (<section id="research" className="section-space bg-[var(--blush)]"><div className="container-wide"><Reveal className="research-heading"><div className="research-sketch" aria-hidden="true" /><div><SectionTitle eyebrow={research.eyebrow} title={research.title}/><p className="max-w-xl text-neutral-600 mb-12 leading-relaxed">{research.introduction}</p></div></Reveal><div className="border-t border-[var(--line)]">{research.projects.map((p,i)=><Reveal key={i} delay={Math.min(i * .07, .35)}><article className="project-card group grid md:grid-cols-12 gap-5 md:gap-10 py-9 md:py-12 px-3 border-b border-[var(--line)]"><span className="md:col-span-1 serif text-2xl text-neutral-500">{p.number}</span><div className="md:col-span-7"><p className="eyebrow text-neutral-500 mb-4">{p.category}</p><h3 className="serif text-4xl sm:text-5xl mb-5">{p.title}</h3><p className="text-neutral-600 text-sm leading-relaxed max-w-xl">{p.description}</p><div className="flex flex-wrap gap-2 mt-6">{p.tags.map((t, index)=><span key={index} className="text-[11px] interest-tag border border-[var(--line)] px-3 py-1.5 rounded-full">{t}</span>)}</div></div><div className="md:col-span-4 flex items-end md:justify-end"><span className="outline-number serif text-7xl md:text-9xl leading-none">{p.number}</span></div></article></Reveal>)}</div></div></section>),
    education: (<section id="education" className="section-space container-wide"><Reveal><SectionTitle eyebrow={education.eyebrow} title={education.title}/></Reveal><Reveal><div className="education-card grid md:grid-cols-12 gap-6">
  <div className="education-marker md:col-span-3">
    <svg viewBox="0 0 72 72" fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="36" cy="36" r="32" strokeDasharray="2 4" />
      <path d="M36 54V30m0 3c-6-6-13-8-21-7v21c8-1 15 1 21 7 6-6 13-8 21-7V26c-8-1-15 1-21 7Z" strokeLinejoin="round" />
      <path d="M36 12v10m-5-5h10" strokeLinecap="round" />
    </svg>
    <p className="eyebrow">{education.status}</p>
  </div><div className="md:col-span-7"><h3 className="serif text-4xl md:text-5xl">{education.degree}</h3><p className="mt-3 text-neutral-600">{education.institution}</p><p className="mt-5 text-sm leading-relaxed text-neutral-600">{education.description}</p></div><div className="md:col-span-2 md:text-right text-xs text-neutral-500 uppercase tracking-widest">{education.graduationLabel}<br/>{education.graduation}</div></div></Reveal></section>),
    skills: (<section id="skills" className="section-space bg-[var(--berry)] text-[var(--paper)]"><div className="container-wide"><Reveal><div className="mb-14"><p className="eyebrow text-[#f3b9d0] mb-6">{skills.eyebrow}</p><h2 className="serif text-6xl md:text-8xl">{skills.title}</h2></div></Reveal><div className="grid md:grid-cols-3 gap-5">{skills.cards.map((s,i)=><Reveal key={i} delay={Math.min(i * .1, .35)}><div className="skill-card border border-[#aa758d]/50 bg-[#ffffff0d] p-7 md:p-9 min-h-[320px] flex flex-col">{cardIcon(s.icon, 30, "mb-14 text-[#f3b9d0]")}<h3 className="serif text-3xl mb-6">{s.title}</h3><ul className="space-y-3 mt-auto text-sm text-[#f1c9d9]">{s.items.map((x, index)=><li key={index} className="border-t border-[#aa758d]/50 pt-3">{x}</li>)}</ul></div></Reveal>)}</div><p className="text-[#e8b6ca] text-xs mt-6">{skills.note}</p></div></section>),
    experience: (<section id="experience" className="section-space container-wide">
  <Reveal><SectionTitle eyebrow={experience.eyebrow} title={experience.title} /></Reveal>
  <div className="grid md:grid-cols-2 gap-12">
    {experience.cards.map((card, index) => <Reveal key={index} delay={Math.min(index * .1, .3)}>
      <article className="border-t border-[var(--line)] pt-7">
        <div className="flex justify-between gap-4 mb-8">
          <span className="eyebrow text-neutral-500">{card.category}</span>
          {cardIcon(card.icon, 23)}
        </div>
        <h3 className="serif text-4xl mb-4">{card.title}</h3>
        <p className="text-neutral-600 leading-relaxed text-sm whitespace-pre-line">{card.description}</p>
        {card.status && <p className="mt-7 text-xs uppercase tracking-widest text-neutral-500">{card.status}</p>}
      </article>
    </Reveal>)}
  </div>
</section>),
    contact: (<section id="contact" className="relative section-space contact-surface"><div className="absolute inset-0 grain opacity-30"/><div className="container-wide relative"><Reveal>
  <svg className="contact-art" viewBox="0 0 180 118" fill="none" stroke="currentColor" aria-hidden="true">
    <path d="M12 87c42 0 43-60 79-60 30 0 32 52 67 52" />
    <path d="M12 97c42 0 43-51 79-51 30 0 32 43 67 43" strokeDasharray="3 5" />
    <circle cx="12" cy="87" r="4" fill="currentColor" />
    <circle cx="158" cy="79" r="4" fill="currentColor" />
    <path d="M158 10v28m-14-14h28m-24-10 20 20m0-20-20 20" strokeLinecap="round" />
  </svg>
  <p className="eyebrow mb-8">{contact.eyebrow}</p><h2 className="serif text-[clamp(4.7rem,12vw,11rem)] tracking-[-.06em] leading-[.84]">{contact.title}</h2><div className="flex flex-col md:flex-row justify-between md:items-end gap-10 mt-14 md:mt-20"><p className="text-neutral-600 leading-relaxed max-w-sm">{contact.description}</p><div className="contact-card flex flex-col gap-4">{contact.email && contact.emailLabel && <a href={`mailto:${contact.email}`} className="contact-link group focus-ring flex items-center gap-4 border-b border-[var(--rose)] pb-3 text-sm">{contact.emailLabel} <span className="ml-auto"><Mail size={18}/></span></a>}{contact.linkedin && contact.linkedinLabel && <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link group focus-ring flex items-center gap-4 border-b border-[var(--rose)] pb-3 text-sm">{contact.linkedinLabel} <span className="ml-auto"><Linkedin size={18}/></span></a>}<p className="text-xs text-neutral-500">{contact.note}</p></div></div></Reveal></div></section>),
  };
  const customBlocks = content.blocks.map((block, index) => ({
    anchor: blockAnchor(block, index),
    placement: visibleSections.some(section => section.id === block.placement) ? block.placement : 'end',
    block,
  }));
  function renderBlocks(placement: string) {
    return customBlocks.filter(item => item.placement === placement).map(({ block, anchor }) => (
  <section key={anchor} id={anchor} className="section-space container-wide">
    <Reveal>
      <div className={block.layout === 'quote' ? 'reflection-card' : 'education-card'}>
        <div className={block.layout === 'image' && block.imageUrl ? 'grid md:grid-cols-2 gap-8 items-center' : ''}>
          <div>
            {block.eyebrow && <p className="eyebrow text-[var(--rose)] mb-4">{block.eyebrow}</p>}
            {block.title && <h2 className="serif text-4xl md:text-6xl mb-5">{block.title}</h2>}
            {block.layout === 'quote' ? <blockquote className="serif text-3xl md:text-5xl whitespace-pre-line">{block.body}</blockquote> : <p className="whitespace-pre-line leading-relaxed">{block.body}</p>}
            {block.linkLabel && block.linkUrl && <a className="focus-ring inline-block mt-6 underline text-[var(--rose)]" href={block.linkUrl}>{block.linkLabel}</a>}
          </div>
          {block.layout === 'image' && block.imageUrl && <img src={block.imageUrl} alt={block.imageAlt} loading="lazy" className="w-full max-h-96 object-contain rounded-lg" />}
        </div>
      </div>
    </Reveal>
  </section>
    ));
  }
  return <main className="overflow-hidden portfolio-page" style={{ '--rose': appearance.accent, '--berry': appearance.dark, '--paper': appearance.paper, '--ink': appearance.ink, '--blush': appearance.blush, '--line': appearance.border, '--hero-glow': appearance.heroGlow, '--contact-tint': appearance.contactTint } as React.CSSProperties}>
<header className="absolute top-0 left-0 right-0 z-50"><div className="container-wide flex items-center justify-between h-24 border-b border-[var(--line)]"><a href="#top" className="focus-ring text-xl font-semibold tracking-[-.06em]">{site.logo}</a><nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">{nav.map(item=><a key={item.href + item.label} className="focus-ring text-xs uppercase tracking-[.15em] hover:opacity-50 transition" href={item.href}>{item.label}</a>)}</nav>{contactVisible && site.contactButton && <a href="#contact" className="hidden md:flex items-center gap-2 text-xs uppercase tracking-[.15em] border-b border-[var(--rose)] pb-1">{site.contactButton} <ArrowUpRight size={15}/></a>}<button aria-label={menuOpen?'Close menu':'Open menu'} aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)} className="md:hidden focus-ring p-2">{menuOpen?<X/>:<Menu/>}</button></div>{menuOpen&&<nav aria-label="Mobile navigation" className="mobile-nav md:hidden bg-[var(--paper)] border-b border-[var(--line)] px-6 py-7 flex flex-col gap-5">{nav.map(item=><a key={item.href + item.label} onClick={()=>setMenuOpen(false)} href={item.href} className="text-xl serif">{item.label}</a>)}</nav>}</header>
<section id="top" className="relative min-h-[790px] min-h-[100svh] flex items-center pt-28 pb-16 hero-surface"><div className="absolute inset-0 grain opacity-40"/><div className={hero.portraitUrl ? 'container-wide relative z-10 hero-with-portrait' : 'container-wide relative z-10'}>
  {hero.portraitUrl && <figure className="hero-portrait">
    <img src={hero.portraitUrl} alt={hero.portraitAlt} fetchPriority="high" />
  </figure>}
  <div className="hero-copy"><div className="eyebrow mb-8 hero-eyebrow flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[var(--rose)]"/> {hero.eyebrow}</div><h1 className="serif text-[clamp(5.2rem,14.8vw,14.5rem)] leading-[.74] tracking-[-.065em] hero-name"><span className="hero-rings" aria-hidden="true"><span className="hero-ring"/><span className="hero-ring"/><span className="hero-ring"/></span><span className="relative block hero-name-first">{hero.firstLine}</span><span className="relative block italic font-normal ml-[.15em] hero-name-last text-[var(--rose)]">{hero.secondLine}</span></h1>
  {hero.urduLine && <figure className="hero-verse">
    <p lang="ur" dir="rtl" className="urdu-script">{hero.urduLine}</p>
    {hero.urduTranslation && <figcaption>{hero.urduTranslation}</figcaption>}
  </figure>}
  <div className="hero-intro mt-8 md:mt-10 flex flex-col md:flex-row md:items-end justify-between gap-9"><p className="max-w-md text-base md:text-lg leading-relaxed text-neutral-700 whitespace-pre-line">{hero.introduction}</p>{heroTarget && hero.button && <a href={heroTarget} className="group focus-ring flex items-center gap-4 w-fit"><span className="eyebrow">{hero.button}</span><span className="arrow-circle"><ArrowDown size={17}/></span></a>}</div></div></div><div className="absolute bottom-5 left-0 right-0"><div className="container-wide flex justify-between text-[10px] tracking-[.2em] uppercase text-neutral-600"><span>{hero.status}</span><span className="hidden sm:block">{hero.scrollHint}</span></div></div></section>
{visibleSections.map(section => <ReactFragment key={section.id}>{renderBlocks(section.id)}{sections[section.id]}</ReactFragment>)}
{renderBlocks('end')}
<footer className="bg-[var(--berry-deep)] text-white py-9"><div className="container-wide flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"><a href="#top" className="font-semibold text-xl tracking-[-.06em]">{site.logo}</a><span className="text-xs text-[#e8b6ca]">© {new Date().getFullYear()} {site.footer}</span><a href="#top" className="text-xs uppercase tracking-widest flex items-center gap-2">{site.backToTop} <ArrowRight size={14} className="-rotate-90"/></a></div></footer>
</main>}
