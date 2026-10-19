import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Cloud,
  Code2,
  Github,
  Menu,
  MessageSquare,
  Monitor,
  Pause,
  Play,
  Plus,
  Terminal,
  X,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import ProductPreview from "./ProductPreview";
import type { Product } from "./ProductPreview";

const Sculpture = lazy(() => import("./Sculpture"));
gsap.registerPlugin(ScrollTrigger);

export function Mark() {
  return (
    <svg className="mark" viewBox="0 0 32 36" fill="none" aria-hidden="true">
      <path d="M5 31V5h23M5 18h18" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M12 31V12h16M12 25h11"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity=".45"
      />
    </svg>
  );
}

const products: {
  id: Product;
  name: string;
  tag: string;
  title: string;
  copy: string;
  features: string[];
  icon: typeof Cloud;
}[] = [
  {
    id: "chat",
    name: "Chat",
    tag: "A SPACE FOR YOUR MIND",
    title: "Follow the thought.\nSee where it goes.",
    copy: "An uncensored thinking partner for the questions, ideas, and possibilities that deserve more room. Research, write, reason, and build on your own terms.",
    features: ["Deep conversations", "Research & analysis", "Writing & code"],
    icon: MessageSquare,
  },
  {
    id: "cloud",
    name: "Cloud",
    tag: "DELEGATE THE DOING",
    title: "Set the direction.\nLet it get to work.",
    copy: "Connect a repository and give an agent a task. Fathom Cloud is being built to write code, run tests, and prepare changes while you get on with your day.",
    features: [
      "Isolated workspaces",
      "Observable execution",
      "Changes for review",
    ],
    icon: Cloud,
  },
  {
    id: "desktop",
    name: "Desktop",
    tag: "YOUR NEXT DEVELOPMENT ENVIRONMENT",
    title: "A workspace that\nthinks alongside you.",
    copy: "Your editor, terminal, browser, and AI in the same place. An AI-native IDE designed for ambitious software and authorized computer automation.",
    features: [
      "Project-aware agents",
      "Editor & terminal",
      "Computer automation",
    ],
    icon: Monitor,
  },
  {
    id: "cli",
    name: "CLI",
    tag: "INTELLIGENCE AT YOUR PROMPT",
    title: "Less ceremony.\nMore command.",
    copy: "Bring Fathom into the terminal you already call home. Work through a codebase, automate a workflow, or hand an agent the next task.",
    features: [
      "Natural-language tasks",
      "Local project context",
      "Scriptable workflows",
    ],
    icon: Terminal,
  },
];

const questions = [
  [
    "What is Fathom?",
    "Fathom is an agentic AI ecosystem built around configurable, self-hosted, open-weight intelligence. It connects a conversational workspace, autonomous cloud development, a desktop IDE, and a terminal agent.",
  ],
  [
    "What does uncensored mean here?",
    "It describes our direction for the model: open-ended conversation, creative freedom, and control over your own AI. Tool execution is a separate concern. Agents work with scoped access, isolated environments, and your authorization for sensitive actions.",
  ],
  [
    "Is Fathom available yet?",
    "Fathom is at the foundation stage. This page introduces the vision and interface concepts. Live AI inference, user accounts, cloud execution, and downloadable applications are still in development.",
  ],
  [
    "How do the products connect?",
    "Chat, Cloud, Desktop, and CLI are being designed around a common identity, model registry, and agent protocol. The goal is to carry context between environments while keeping local and cloud execution separate.",
  ],
];

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const [product, setProduct] = useState<Product>("chat");
  const [node, setNode] = useState<Product>("chat");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<"login" | "signup" | null>(null);
  const [faq, setFaq] = useState<number | null>(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const dialogRef = useRef<HTMLDialogElement>(null);
  const smooth = useRef<Lenis | null>(null);
  const motionOff = paused || reduced;
  const active = products.find((p) => p.id === product)!;
  const activeNode = products.find((p) => p.id === node)!;

  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("motion-paused", motionOff);
    if (motionOff) return;
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      anchors: { offset: -90 },
    });
    smooth.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    const context = gsap.context(() => {
      gsap.from(".hero-title", {
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.15,
      });
      gsap.from(".hero-copy, .hero-aside, .hero-bottom", {
        y: 18,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        delay: 0.5,
        ease: "power3.out",
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 35,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 92%", once: true },
        });
      });
      gsap.to(".hero-title", {
        y: 85,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.fromTo(
        ".vision-word",
        { color: "#54505e" },
        {
          color: "#eee9f7",
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: ".vision-statement",
            start: "top 85%",
            end: "bottom 50%",
            scrub: 0.6,
          },
        },
      );
      gsap.to(".ecosystem-path", {
        strokeDashoffset: 0,
        duration: 2,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ".ecosystem-map",
          start: "top 70%",
          once: true,
        },
      });
    }, root);
    return () => {
      context.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
      smooth.current = null;
    };
  }, [motionOff]);

  useEffect(() => {
    if (dialog) {
      dialogRef.current?.showModal();
      smooth.current?.stop();
    } else {
      dialogRef.current?.close();
      smooth.current?.start();
    }
    return () => smooth.current?.start();
  }, [dialog]);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setDialog(null);
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);

  const explore = (id?: Product) => {
    if (id) setProduct(id);
    setMenuOpen(false);
    const target = document.getElementById("environments");
    if (target)
      smooth.current
        ? smooth.current.scrollTo(target, { offset: -85 })
        : target.scrollIntoView({ behavior: motionOff ? "instant" : "smooth" });
  };

  return (
    <div className="site" ref={root}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="header">
        <a href="#" className="brand" aria-label="Fathom home">
          <Mark />
          <span>fathom</span>
        </a>
        <nav
          id="main-nav"
          aria-label="Main navigation"
          className={menuOpen ? "nav open" : "nav"}
        >
          {products.map((p) => (
            <a
              key={p.id}
              href="#environments"
              onClick={(e) => {
                e.preventDefault();
                explore(p.id);
              }}
            >
              {p.name === "Desktop" ? "Desktop app" : p.name}
            </a>
          ))}
          <a href="#vision" onClick={() => setMenuOpen(false)}>
            Our vision
          </a>
        </nav>
        <div className="header-actions">
          <button className="login-link" onClick={() => setDialog("login")}>
            Log in
          </button>
          <button
            className="outline-button header-signup"
            onClick={() => setDialog("signup")}
          >
            Sign up <ArrowUpRight size={14} />
          </button>
          <button
            className="menu-button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-controls="main-nav"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-atmosphere" aria-hidden="true" />
          <div className="halo" aria-hidden="true">
            <i />
          </div>
          <h1 className="hero-title" id="hero-title">
            UNCENSORED
          </h1>
          <div className="sculpture-stage">
            <Suspense
              fallback={
                <img
                  className="sculpture-poster"
                  src="/models/fathom-core.webp"
                  alt="A crowned, blindfolded sculpture representing independent intelligence"
                />
              }
            >
              <Sculpture paused={motionOff} />
            </Suspense>
          </div>
          <div className="hero-copy">
            <p className="eyebrow">AI WITHOUT LIMITS</p>
            <p className="hero-description">
              Think freely.
              <br />
              Build what comes next.
            </p>
            <button
              className="outline-button hero-cta"
              onClick={() => explore()}
            >
              Explore Fathom <ArrowRight size={23} />
            </button>
          </div>
          <aside className="hero-aside">
            <span>YOUR MIND. UNRESTRICTED.</span>
            <span>YOUR IDEAS. IN MOTION.</span>
            <span>YOUR TOOLS. CONNECTED.</span>
            <span>YOUR WORLD. BUILT BY YOU.</span>
          </aside>
          <div className="hero-bottom">
            <a href="#vision" className="scroll-link">
              <span className="scroll-line" />
              SCROLL TO DISCOVER <ArrowDown size={13} />
            </a>
            <button
              className="motion-control"
              onClick={() => setPaused(!paused)}
              aria-label={paused ? "Resume animations" : "Pause animations"}
              aria-pressed={paused}
            >
              {motionOff ? <Play size={12} /> : <Pause size={12} />}
              <span>{paused ? "RESUME MOTION" : "PAUSE MOTION"}</span>
            </button>
          </div>
        </section>
        <div className="foundation-strip">
          <span>
            <i /> INDEPENDENT INTELLIGENCE
          </span>
          <span>OPEN WEIGHTS</span>
          <span>SELF-HOSTED</span>
          <span>AGENTIC BY DESIGN</span>
          <a href="#environments">
            ONE CORE. EVERY ENVIRONMENT. <ArrowDown size={12} />
          </a>
        </div>
        <section className="vision section-wrap" id="vision">
          <div className="section-index" data-reveal>
            <span>01 / THE FATHOM VISION</span>
            <span>THOUGHT → ACTION</span>
          </div>
          <div className="vision-layout">
            <h2 className="vision-statement" data-reveal>
              {"Intelligence should open doors."
                .split(" ")
                .map((word, index) => (
                  <span className="vision-word" key={index}>
                    {word}{" "}
                  </span>
                ))}
              <span className="vision-emphasis">And walk through them.</span>
            </h2>
            <div className="vision-copy" data-reveal>
              <span className="small-cross">+</span>
              <p>
                Fathom is an uncensored AI ecosystem for people who want to do
                more with their minds.
              </p>
              <p>
                Think through an idea. Build the software. Delegate the work.
                One shared intelligence, with the tools to carry your intent
                into the world.
              </p>
              <a className="text-link" href="#environments">
                Meet your environments <ArrowDown size={15} />
              </a>
            </div>
          </div>
          <div className="vision-signature" aria-hidden="true">
            <span>THINK</span>
            <i />
            <span>BUILD</span>
            <i />
            <span>DELEGATE</span>
          </div>
        </section>
        <section className="environments section-wrap" id="environments">
          <div className="section-index" data-reveal>
            <span>02 / WAYS INTO FATHOM</span>
            <span>FOUR ENVIRONMENTS. ONE INTELLIGENCE.</span>
          </div>
          <div className="section-title-row" data-reveal>
            <h2>
              Wherever you work.
              <br />
              <span>However you think.</span>
            </h2>
            <p>
              A conversation is only the beginning.
              <br />
              Take Fathom where the work happens.
            </p>
          </div>
          <div
            className="product-tabs"
            role="tablist"
            aria-label="Fathom environments"
            data-reveal
          >
            {products.map((p, i) => (
              <button
                key={p.id}
                role="tab"
                id={`tab-${p.id}`}
                aria-selected={product === p.id}
                aria-controls="product-panel"
                className={product === p.id ? "selected" : ""}
                onClick={() => setProduct(p.id)}
                onKeyDown={(e) => {
                  if (
                    ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                  ) {
                    e.preventDefault();
                    const next =
                      e.key === "Home"
                        ? 0
                        : e.key === "End"
                          ? 3
                          : (i + (e.key === "ArrowRight" ? 1 : 3)) % 4;
                    setProduct(products[next].id);
                    document
                      .getElementById(`tab-${products[next].id}`)
                      ?.focus();
                  }
                }}
                tabIndex={product === p.id ? 0 : -1}
              >
                <span>0{i + 1}</span>
                <p.icon size={18} />
                <strong>{p.name}</strong>
                <ArrowUpRight size={16} />
              </button>
            ))}
          </div>
          <div
            className="product-panel"
            id="product-panel"
            role="tabpanel"
            aria-labelledby={`tab-${product}`}
            data-reveal
          >
            <div className="product-copy" key={product}>
              <span className="eyebrow">{active.tag}</span>
              <h3>
                {active.title.split("\n").map((line, i) => (
                  <span key={line}>
                    {line}
                    {i === 0 && <br />}
                  </span>
                ))}
              </h3>
              <p>{active.copy}</p>
              <ul>
                {active.features.map((feature) => (
                  <li key={feature}>
                    <Check size={13} />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="development-label">
                <i /> IN DEVELOPMENT
              </div>
            </div>
            <div className="product-visual">
              <div className="preview-caption">
                <span>FATHOM / {product.toUpperCase()}</span>
                <span>INTERACTIVE CONCEPT</span>
              </div>
              <ProductPreview product={product} paused={motionOff} />
            </div>
          </div>
        </section>
        <section className="agency section-wrap">
          <div className="section-index" data-reveal>
            <span>03 / FROM INTENT TO IMPACT</span>
            <span>BUILT TO FOLLOW THROUGH</span>
          </div>
          <div className="agency-heading" data-reveal>
            <h2>
              Not just an answer.
              <br />
              <span>A way forward.</span>
            </h2>
            <p>
              An agent needs more than a model.
              <br />
              It needs context, tools, and room to act.
            </p>
          </div>
          <div className="agent-flow" data-reveal>
            <div className="intent-block">
              <span className="flow-number">01 — YOUR INTENT</span>
              <div className="intent-note">
                <span className="quote-mark">“</span>
                <p>
                  Take this idea
                  <br />
                  and make it real.
                </p>
                <span className="note-cursor" />
              </div>
              <p>
                You bring the direction.
                <br />
                Fathom helps find the path.
              </p>
            </div>
            <div className="reasoning-block">
              <span className="flow-number">02 — AGENTIC INTELLIGENCE</span>
              <div className="reasoning-diagram">
                <div className="reason-ring ring-outer" />
                <div className="reason-ring ring-inner" />
                <svg viewBox="0 0 300 220" aria-hidden="true">
                  <path d="M50 110 H250 M150 30 V190" />
                  <path
                    className="thought-signal"
                    d="M50 110 H150 V30 M150 190 V110 H250"
                  />
                </svg>
                <div className="reason-core">
                  <Mark />
                </div>
                <span className="reason-label reason-top">REASON</span>
                <span className="reason-label reason-right">ACT</span>
                <span className="reason-label reason-bottom">VERIFY</span>
                <span className="reason-label reason-left">REFINE</span>
              </div>
              <p>
                A continuous loop of reasoning,
                <br />
                tool use, and verification.
              </p>
            </div>
            <div className="outcome-block">
              <span className="flow-number">03 — WORK YOU CAN REVIEW</span>
              <div className="outcome-stack">
                <div className="outcome-item">
                  <Code2 size={16} />
                  <span>Implementation</span>
                  <span className="outcome-check">
                    <Check size={12} />
                  </span>
                </div>
                <div className="outcome-item">
                  <Terminal size={16} />
                  <span>Tests & execution</span>
                  <span className="outcome-check">
                    <Check size={12} />
                  </span>
                </div>
                <div className="outcome-item">
                  <Github size={16} />
                  <span>Changes for review</span>
                  <ArrowUpRight size={13} />
                </div>
              </div>
              <p>
                Visible steps. Tangible outputs.
                <br />
                You stay in the loop.
              </p>
            </div>
          </div>
          <p className="concept-note">
            THE AGENT WORKFLOW WE’RE BUILDING. ILLUSTRATIVE, NOT A LIVE
            EXECUTION.
          </p>
        </section>
        <section className="connected section-wrap" id="ecosystem">
          <div className="section-index" data-reveal>
            <span>04 / THE CONNECTED ECOSYSTEM</span>
            <span>EVERYTHING COMES BACK TO YOU</span>
          </div>
          <div className="connected-layout">
            <div className="connected-copy" data-reveal>
              <h2>
                Different doors.
                <br />
                <span>The same mind.</span>
              </h2>
              <p>
                A shared AI foundation. A common identity. Context that is
                designed to travel with your work.
              </p>
              <p>
                Start with a conversation. Take it into your editor. Give a
                cloud agent the next step. Keep your terminal in the loop.
              </p>
              <span className="eyebrow connection-hint">
                SELECT AN ENVIRONMENT TO EXPLORE <ArrowRight size={13} />
              </span>
            </div>
            <div className={`ecosystem-map active-${node}`} data-reveal>
              <svg
                className="ecosystem-lines"
                viewBox="0 0 600 380"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M300 190 C300 70 100 190 100 65 M300 190 C300 70 500 190 500 65 M300 190 C300 310 100 190 100 315 M300 190 C300 310 500 190 500 315" />
                <path
                  className="ecosystem-path"
                  d="M100 65 C100 190 300 70 300 190 C300 310 500 190 500 315 M500 65 C500 190 300 70 300 190 C300 310 100 190 100 315"
                />
              </svg>
              <div className="ecosystem-core">
                <Mark />
                <span>FATHOM</span>
                <small>SHARED INTELLIGENCE</small>
              </div>
              {products.map((p, index) => (
                <button
                  key={p.id}
                  className={`ecosystem-node ecosystem-node-${index} ${node === p.id ? "selected" : ""}`}
                  onClick={() => setNode(p.id)}
                  aria-pressed={node === p.id}
                >
                  <p.icon size={21} />
                  <span>{p.name}</span>
                  <ArrowUpRight size={12} />
                </button>
              ))}
              <div className="ecosystem-status" aria-live="polite">
                <i />
                <span>
                  {activeNode.name.toUpperCase()} ·{" "}
                  {activeNode.features[0].toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="architecture-notes" data-reveal>
            <div>
              <span>01</span>
              <strong>One identity</strong>
              <p>A consistent home for your work.</p>
            </div>
            <div>
              <span>02</span>
              <strong>Shared context</strong>
              <p>Your ideas should keep their momentum.</p>
            </div>
            <div>
              <span>03</span>
              <strong>Explicit control</strong>
              <p>Separate environments. Scoped permissions.</p>
            </div>
          </div>
        </section>
        <section className="questions section-wrap" id="questions">
          <div data-reveal>
            <span className="eyebrow">A LITTLE MORE CONTEXT</span>
            <h2>
              Good questions.
              <br />
              <span>Open answers.</span>
            </h2>
            <span className="faq-monogram" aria-hidden="true">
              <Mark />
            </span>
          </div>
          <div className="faq-list" data-reveal>
            {questions.map(([q, a], i) => (
              <div className={`faq-item ${faq === i ? "open" : ""}`} key={q}>
                <h3>
                  <button
                    aria-expanded={faq === i}
                    aria-controls={`answer-${i}`}
                    onClick={() => setFaq(faq === i ? null : i)}
                  >
                    {q}
                    <Plus size={18} />
                  </button>
                </h3>
                <div
                  className="faq-answer"
                  id={`answer-${i}`}
                  inert={faq !== i}
                >
                  <div>
                    <p>{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="closing">
          <div className="closing-light" aria-hidden="true" />
          <div className="section-wrap closing-content" data-reveal>
            <span className="eyebrow">
              INDEPENDENT BY NATURE. AGENTIC BY DESIGN.
            </span>
            <h2>
              Your imagination.
              <br />
              <span>No ceiling.</span>
            </h2>
            <div className="closing-actions">
              <button className="outline-button" onClick={() => explore()}>
                Find your environment <ArrowRight size={20} />
              </button>
              <a
                className="text-link"
                href="https://github.com/fathom-core"
                target="_blank"
                rel="noreferrer"
              >
                Follow the build <ArrowUpRight size={16} />
              </a>
            </div>
            <p>Fathom is taking shape. This is the beginning.</p>
          </div>
          <div className="closing-word" aria-hidden="true">
            FATHOM
          </div>
        </section>
      </main>
      <footer className="footer section-wrap">
        <div className="footer-top">
          <a className="brand" href="#">
            <Mark />
            <span>fathom</span>
          </a>
          <p>
            Think with AI. Build with AI.
            <br />
            Delegate real work to AI.
          </p>
          <div>
            {products.map((p) => (
              <a
                key={p.id}
                href="#environments"
                onClick={(e) => {
                  e.preventDefault();
                  explore(p.id);
                }}
              >
                {p.name}
                <ArrowUpRight size={12} />
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Fathom</span>
          <span className="build-status">
            <i /> IN DEVELOPMENT
          </span>
          <a
            href="https://github.com/fathom-core"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={14} /> Built in the open <ArrowUpRight size={13} />
          </a>
          <a href="#">Back to top ↑</a>
        </div>
      </footer>
      <dialog
        ref={dialogRef}
        className="access-dialog"
        aria-labelledby="access-title"
        aria-describedby="access-description"
        onCancel={() => setDialog(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setDialog(null);
        }}
      >
        <div className="dialog-inner">
          <button
            className="dialog-close"
            aria-label="Close dialog"
            onClick={() => setDialog(null)}
          >
            <X size={20} />
          </button>
          <Mark />
          <span className="eyebrow">FATHOM / EARLY CHAPTERS</span>
          <h2 id="access-title">
            {dialog === "login"
              ? "Your next workspace\nis taking shape."
              : "Something independent\nis coming."}
          </h2>
          <p id="access-description">
            Fathom accounts and live AI access are still in development. Explore
            the product concepts here, or follow progress on GitHub.
          </p>
          <a
            className="outline-button"
            href="https://github.com/fathom-core"
            target="_blank"
            rel="noreferrer"
          >
            Follow the build <ArrowUpRight size={17} />
          </a>
          <button
            className="text-link"
            onClick={() => {
              smooth.current?.start();
              setDialog(null);
              explore();
            }}
          >
            Explore the environments <ChevronDown size={15} />
          </button>
        </div>
      </dialog>
    </div>
  );
}
