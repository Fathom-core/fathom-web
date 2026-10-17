import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronRight, Code2, Command, Github, Globe2, Menu, MessageSquare, Monitor, MousePointer2, Pause, Play, Plus, Sparkles, Terminal, X } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Demo from './Demo'

const Core = lazy(() => import('./Core'))
gsap.registerPlugin(ScrollTrigger)

function Mark({ className = '' }: { className?: string }) {
  return <svg className={`brand-mark ${className}`} viewBox="0 0 40 40" fill="none" aria-hidden="true"><ellipse cx="20" cy="20" rx="17" ry="7.5" transform="rotate(-45 20 20)" /><ellipse cx="20" cy="20" rx="17" ry="7.5" transform="rotate(45 20 20)" /><circle cx="20" cy="20" r="4.5" /></svg>
}

const modes = [
  { name: 'Think', detail: 'Follow a thought. Find a new perspective.', label: 'CURIOSITY, WITHOUT A CEILING', icon: MessageSquare },
  { name: 'Create', detail: 'Make the thing you can’t stop imagining.', label: 'IMAGINATION, MADE TANGIBLE', icon: Code2 },
  { name: 'Act', detail: 'Give an idea the tools to go somewhere.', label: 'INTENTION, MEET INITIATIVE', icon: MousePointer2 },
]

export default function App() {
  const page = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState(0)
  const [menu, setMenu] = useState(false)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [selectedNode, setSelectedNode] = useState('Web')
  const [copied, setCopied] = useState(false)
  const lenis = useRef<Lenis | null>(null)
  const motionOff = reducedMotion || paused

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setReducedMotion(media.matches)
    media.addEventListener('change', change)
    return () => media.removeEventListener('change', change)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('motion-paused', motionOff)
    if (motionOff) return
    const smooth = new Lenis({ duration: 1.05, smoothWheel: true, anchors: true })
    lenis.current = smooth
    smooth.on('scroll', ScrollTrigger.update)
    const update = (time: number) => smooth.raf(time * 1000)
    gsap.ticker.add(update)
    return () => { gsap.ticker.remove(update); smooth.destroy(); lenis.current = null }
  }, [motionOff])

  useEffect(() => {
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false) }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [])

  useEffect(() => {
    if (motionOff) return
    const context = gsap.context(() => {
      gsap.from('.hero-line > span', { yPercent: 112, rotate: 2, duration: 1.25, stagger: 0.13, ease: 'power4.out', delay: 0.15 })
      gsap.from('.hero-enter', { y: 20, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.6 })
      gsap.from('.core-stage', { opacity: 0, scale: 0.88, duration: 1.8, ease: 'power3.out', delay: 0.15 })
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
        gsap.from(el, { y: 45, opacity: 0, duration: 0.95, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 89%', once: true } })
      })
      gsap.fromTo('.statement-word', { opacity: 0.2 }, { opacity: 1, stagger: 0.15, ease: 'none', scrollTrigger: { trigger: '.statement', start: 'top 82%', end: 'bottom 54%', scrub: 0.5 } })
      gsap.to('.hero-orb-wrap', { y: 100, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
    }, page)
    return () => context.revert()
  }, [motionOff])

  const goTo = (id: string, focus = false) => {
    setMenu(false)
    const target = document.getElementById(id)
    if (!target) return
    if (lenis.current) lenis.current.scrollTo(target, { offset: -100, onComplete: () => { if (focus) document.getElementById('demo-prompt')?.focus({ preventScroll: true }) } })
    else { target.scrollIntoView({ behavior: motionOff ? 'instant' : 'smooth' }); if (focus) document.getElementById('demo-prompt')?.focus({ preventScroll: true }) }
  }
  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 2200) }
    catch { setCopied(false) }
  }

  const faq = [
    ['What is Fathom?', 'Fathom is an AI ecosystem in development, built to connect conversation, autonomous agents, and the tools to get things done. The web platform is the first gateway, with a shared foundation for cloud workspaces, desktop, CLI, and extensions.'],
    ['Is Apollo the only model?', 'Apollo is the flagship in a growing family of Fathom models. The platform is being designed for different models and capabilities, all connected to the same projects, tools, and context. The rest of the lineup is still taking shape.'],
    ['What powers the ecosystem?', 'Fathom’s direction is self-hosted, open-weight AI infrastructure. That shared foundation will power reasoning, coding, research, browser interaction, and authorized execution across the ecosystem.'],
    ['Can I use Fathom today?', 'You’re exploring the first page of Fathom. The workspace on this page is an interactive concept preview; the live AI service, account system, and cloud execution are still to come. Explore the demo to get a feel for the direction.'],
  ]
  const nodeInfo: Record<string, { heading: string; text: string; status: string }> = {
    Web: { heading: 'Your starting point. Anywhere.', text: 'A shared home for conversations, ideas, and agent workspaces. The first chapter of Fathom.', status: 'BUILDING NOW' },
    Cloud: { heading: 'Give your ideas room to run.', text: 'Isolated environments for agents to browse, build, and execute. Designed to keep working when you step away.', status: 'ON THE HORIZON' },
    Desktop: { heading: 'Intelligence, right beside you.', text: 'An agentic development environment for deep work, local projects, and collaboration with your computer.', status: 'ON THE HORIZON' },
    CLI: { heading: 'A thought away. A command away.', text: 'Bring natural language and autonomous workflows into the place developers already call home.', status: 'ON THE HORIZON' },
    Extensions: { heading: 'Meet you where you create.', text: 'Carry your models, projects, and context into the development tools you already use.', status: 'ON THE HORIZON' },
  }

  return <div ref={page} className="site-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <a className="brand" href="#" aria-label="Fathom home" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: motionOff ? 'instant' : 'smooth' }) }}><Mark /><span>fathom</span></a>
      <nav className={menu ? 'navigation is-open' : 'navigation'} id="navigation" aria-label="Main navigation">
        <a href="#experience" onClick={e => { e.preventDefault(); goTo('experience') }}>The experience</a>
        <a href="#intelligence" onClick={e => { e.preventDefault(); goTo('intelligence') }}>Intelligence</a>
        <a href="#ecosystem" onClick={e => { e.preventDefault(); goTo('ecosystem') }}>The ecosystem</a>
      </nav>
      <div className="nav-actions"><a href="https://github.com/Fathom-core" target="_blank" rel="noopener noreferrer" className="github-link" aria-label="Fathom on GitHub"><Github size={19} /></a><button className="button button-small nav-cta" onClick={() => goTo('experience', true)}>Explore Fathom <ArrowUpRight size={15} /></button><button className="menu-toggle" aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu} aria-controls="navigation" onClick={() => setMenu(!menu)}>{menu ? <X size={23} /> : <Menu size={23} />}</button></div>
    </header>

    <main id="main">
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-coordinates" aria-hidden="true"><span>EST. 2026</span><span>INDEPENDENT BY DESIGN</span></div>
        <div className="hero-copy">
          <button className="intro-label hero-enter" onClick={() => goTo('intelligence')}><span className="status-dot" /> A NEW DEPTH OF INTELLIGENCE <ArrowUpRight size={12} /></button>
          <h1 id="hero-heading"><span className="hero-line"><span>Think freely.</span></span><span className="hero-line"><span>Build boldly.</span></span><span className="hero-line serif-line"><span>Go beyond.</span></span></h1>
          <p className="hero-description hero-enter">A universe of intelligence, ready to move with you.<br className="desktop-break" /> From the spark of a thought to the things you create.</p>
          <div className="hero-actions hero-enter"><button className="button button-primary" onClick={() => goTo('experience', true)}>Explore the possibilities <span><ArrowUpRight size={18} /></span></button><button className="text-button" onClick={() => goTo('intelligence')}>Meet Apollo <ArrowRight size={16} /></button></div>
          <div className="hero-proof hero-enter"><span>OPEN WEIGHTS</span><i /><span>UNCENSORED THINKING</span><i /><span>BUILT TO ACT</span></div>
        </div>
        <div className="core-stage">
          <div className="core-grid" aria-hidden="true" />
          <div className="core-aura" aria-hidden="true" />
          <div className="orb-reticle reticle-one" aria-hidden="true" />
          <div className="orb-reticle reticle-two" aria-hidden="true" />
          <div className="hero-orb-wrap"><Suspense fallback={<div className="core-loading"><Mark /><span>AWAKENING THE CORE</span></div>}><Core mode={mode} paused={paused} reducedMotion={reducedMotion} /></Suspense></div>
          <div className="core-caption"><span className="crosshair">+</span><div>THE FATHOM CORE<span>INTELLIGENCE IN MOTION</span></div></div>
          <div className="core-marker"><span className="status-dot" /> OPEN BY NATURE</div>
          <div className="drag-hint"><MousePointer2 size={12} /><span>DRAG TO DISCOVER</span><span>↔</span></div>
          <span className="core-index" aria-hidden="true">F / 001</span>
        </div>
        <div className="hero-footer hero-enter"><button className="scroll-cue" onClick={() => goTo('experience')}><span><ArrowDown size={16} /></span>THERE’S MORE BELOW</button><div className="core-mode-caption" aria-live="polite"><span>{modes[mode].label}</span><p key={mode}>{modes[mode].detail}</p></div><div className="core-modes" aria-label="Explore the core">{modes.map((item, index) => <button key={item.name} className={mode === index ? 'active' : ''} aria-pressed={mode === index} onClick={() => setMode(index)}><span>0{index + 1}</span>{item.name}</button>)}</div></div>
      </section>

      <div className="principles-strip"><span>HUMAN CURIOSITY. MACHINE POSSIBILITY.</span><div><span><Sparkles size={14} /> Reason deeply</span><span><Code2 size={14} /> Build anything</span><span><Globe2 size={14} /> Explore further</span><span><Command size={14} /> Make it happen</span></div></div>

      <section className="experience section-container" id="experience" aria-labelledby="experience-heading">
        <div className="section-heading" data-reveal><div><span className="eyebrow"><span>01 /</span> THE EXPERIENCE</span><h2 id="experience-heading">Some ideas deserve<br />more than <em>an answer.</em></h2></div><p>Follow your curiosity all the way through.<br />Think with an AI. Create with an agent.<br />Give your next big idea a place to happen.</p></div>
        <div data-reveal><Demo paused={paused} /></div>
      </section>

      <section className="intelligence section-container" id="intelligence" aria-labelledby="intelligence-heading">
        <div className="intelligence-top" data-reveal><span className="eyebrow"><span>02 /</span> THE MINDS BEHIND IT</span><span className="fine-print">OPEN-WEIGHT MODELS. ONE SHARED UNIVERSE.</span></div>
        <div className="model-layout">
          <div className="model-copy" data-reveal><h2 id="intelligence-heading">Meet a mind<br />that goes <em>further.</em></h2><p>Introducing Apollo. Our flagship model for ambitious thoughts, complex problems, and the beautifully unexpected.</p><p>Apollo is the first name in a growing constellation of intelligence. Different minds. Shared context. A world of possibilities.</p><button className="text-button" onClick={() => goTo('experience', true)}>Explore the Apollo preview <ArrowUpRight size={17} /></button><div className="model-foundation"><span className="status-dot" /><span>SELF-HOSTED AT THE CORE.<br />INDEPENDENT IN SPIRIT.</span></div></div>
          <div className="apollo-card" data-reveal><div className="apollo-card-top"><span>FATHOM INTELLIGENCE</span><span className="model-pill">FLAGSHIP / 01</span></div><div className="apollo-art" aria-hidden="true"><div className="sun-halo" /><div className="sun"><i /><i /><i /></div><div className="sun-orbit orbit-a" /><div className="sun-orbit orbit-b" /><span className="sun-star star-one">+</span><span className="sun-star star-two">+</span></div><div className="apollo-card-bottom"><div><span className="tiny-label">A NEW PERSPECTIVE</span><h3>Apollo<span>↗</span></h3></div><p>Reasoning. Coding.<br />Research. Possibility.</p></div><div className="apollo-tags"><span>OPEN WEIGHTS</span><span>UNCENSORED</span><span>AGENTIC</span></div></div>
        </div>
      </section>

      <section className="statement section-container" aria-label="Our philosophy"><div className="statement-rule"><Mark /><span>THE FATHOM PHILOSOPHY</span></div><p>{'We believe the most interesting things happen when human curiosity meets intelligence that has room to explore.'.split(' ').map((word, i) => <span key={i} className="statement-word">{word} </span>)}<em> Let’s go there.</em></p><span className="statement-footnote">LESS FRICTION. MORE POSSIBILITY.</span></section>

      <section className="ecosystem section-container" id="ecosystem" aria-labelledby="ecosystem-heading">
        <div className="section-heading" data-reveal><div><span className="eyebrow"><span>03 /</span> A CONNECTED UNIVERSE</span><h2 id="ecosystem-heading">Many ways in.<br /><em>One Fathom.</em></h2></div><p>Your ideas shouldn’t have to start over.<br />One identity, shared context, and a<br />continuous thread across everything.</p></div>
        <div className="ecosystem-panel" data-reveal>
          <div className="orbit-map"><div className="map-orbit map-orbit-1" /><div className="map-orbit map-orbit-2" /><div className="map-orbit map-orbit-3" /><svg className="connections" viewBox="0 0 660 420" aria-hidden="true"><path d="M330 210 L150 90 M330 210 L485 95 M330 210 L540 275 M330 210 L205 335 M330 210 L105 230" /></svg><div className="map-center"><Mark /><span>fathom</span></div>{[{ name: 'Web', icon: Globe2 }, { name: 'Cloud', icon: Command }, { name: 'Desktop', icon: Monitor }, { name: 'CLI', icon: Terminal }, { name: 'Extensions', icon: Code2 }].map((item, i) => <button key={item.name} className={`map-node node-${i} ${selectedNode === item.name ? 'selected' : ''}`} onClick={() => setSelectedNode(item.name)} aria-pressed={selectedNode === item.name}><span><item.icon size={19} /></span><strong>{item.name}</strong>{item.name === 'Web' && <small>START HERE</small>}</button>)}</div>
          <div className="ecosystem-detail" key={selectedNode}><span className="ecosystem-status"><span className={selectedNode === 'Web' ? 'status-dot' : 'future-dot'} />{nodeInfo[selectedNode].status}</span><span className="ecosystem-product">FATHOM {selectedNode.toUpperCase()}</span><h3>{nodeInfo[selectedNode].heading}</h3><p>{nodeInfo[selectedNode].text}</p>{selectedNode === 'Web' ? <button className="text-button" onClick={() => goTo('experience', true)}>Experience the preview <ArrowUpRight size={16} /></button> : <span className="roadmap-note">A future chapter <ChevronRight size={13} /></span>}<div className="ecosystem-pagination">{Object.keys(nodeInfo).map(node => <button key={node} className={selectedNode === node ? 'active' : ''} onClick={() => setSelectedNode(node)} aria-label={`Explore Fathom ${node}`} aria-pressed={selectedNode === node} />)}</div></div>
        </div>
      </section>

      <section className="faq-section section-container" aria-labelledby="faq-heading"><div data-reveal><span className="eyebrow"><span>04 /</span> A LITTLE MORE CONTEXT</span><h2 id="faq-heading">Curiosity<br /><em>looks good on you.</em></h2></div><div className="faq-list" data-reveal>{faq.map(([question, answer], i) => <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={question}><h3><button aria-expanded={openFaq === i} aria-controls={`faq-${i}`} id={`faq-question-${i}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}><span>{question}</span><Plus size={18} /></button></h3><div className="faq-answer" id={`faq-${i}`} role="region" aria-labelledby={`faq-question-${i}`} inert={openFaq !== i}><div><p>{answer}</p></div></div></div>)}</div></section>

      <section className="closing" aria-labelledby="closing-heading"><div className="closing-orbits" aria-hidden="true"><i /><i /><i /><i /></div><div className="closing-content" data-reveal><span className="eyebrow">THE NEXT CHAPTER STARTS WITH A THOUGHT</span><h2 id="closing-heading">What’s on<br /><em>your horizon?</em></h2><button className="button button-dark" onClick={() => goTo('experience', true)}>Let’s find out <ArrowUpRight size={18} /></button><p>A first look at what we’re building. A world still to explore.</p></div><span className="closing-coordinate">FATHOM / POSSIBILITIES AHEAD</span></section>
    </main>

    <footer className="site-footer"><div className="footer-top"><a className="brand" href="#" aria-label="Fathom home"><Mark /><span>fathom</span></a><p>Independent intelligence.<br />Infinite possibility.</p><div><a href="https://github.com/Fathom-core" target="_blank" rel="noopener noreferrer">Follow the build <ArrowUpRight size={15} /></a><button onClick={share}>{copied ? 'Link copied' : 'Share the possibility'}{copied ? <Check size={15} /> : <ArrowUpRight size={15} />}</button></div></div><div className="footer-wordmark" aria-hidden="true">fathom<span>↗</span></div><div className="footer-bottom"><span>© {new Date().getFullYear()} FATHOM CORE</span><span>BUILT WITH CURIOSITY. DESIGNED FOR POSSIBILITY.</span><button className="motion-toggle" onClick={() => setPaused(!paused)} aria-pressed={paused} disabled={reducedMotion}>{motionOff ? <Play size={11} /> : <Pause size={11} />}{reducedMotion ? 'REDUCED MOTION' : paused ? 'RESUME MOTION' : 'PAUSE MOTION'}</button></div></footer>
  </div>
}
