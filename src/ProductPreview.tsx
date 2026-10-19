import { useEffect, useState } from "react";
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  Code2,
  FileCode2,
  GitBranch,
  MessageSquare,
  MoreHorizontal,
  Play,
  Plus,
  Terminal,
} from "lucide-react";

export type Product = "chat" | "cloud" | "desktop" | "cli";
const conversations = [
  {
    name: "Explore an idea",
    prompt: "What if my notes could become a second brain?",
    heading: "Let’s give your ideas a place to connect.",
    response:
      "Start with the way you actually think: fragments, questions, and unexpected connections. We could build a workspace that finds the threads between them.",
    points: [
      "Capture thoughts without a rigid structure.",
      "Connect related ideas across projects.",
      "Turn a promising thread into a plan.",
    ],
  },
  {
    name: "Build something",
    prompt: "Help me design an app for independent creators.",
    heading: "Make room for the work only you can do.",
    response:
      "Let’s define the smallest version worth using: a home for ideas, a simple publishing flow, and a direct relationship with your audience.",
    points: [
      "Map the core experience.",
      "Choose the right architecture.",
      "Move from a conversation to a codebase.",
    ],
  },
  {
    name: "Think it through",
    prompt: "Help me challenge the assumptions in my idea.",
    heading: "Let’s look at it from the other side.",
    response:
      "We can separate what you know from what you’re assuming, find the strongest opposing view, and identify an experiment that would change your mind.",
    points: [
      "Name the central assumption.",
      "Explore the strongest counterargument.",
      "Design a small, useful experiment.",
    ],
  },
];
function WindowBar({ name, right }: { name: string; right?: string }) {
  return (
    <div className="window-bar">
      <span className="window-dots">
        <i />
        <i />
        <i />
      </span>
      <span>{name}</span>
      <span>{right || "CONCEPT PREVIEW"}</span>
    </div>
  );
}
function ChatPreview() {
  const [scenario, setScenario] = useState(0);
  const content = conversations[scenario];
  return (
    <div className="app-window chat-window">
      <WindowBar name="fathom / chat" />
      <div className="chat-layout">
        <aside className="chat-sidebar">
          <div className="mini-brand">
            f<span>fathom</span>
          </div>
          <button onClick={() => setScenario((scenario + 1) % 3)}>
            <Plus size={14} /> New conversation
          </button>
          <span className="ui-label">YOUR SPACE</span>
          {conversations.map((item, i) => (
            <button
              key={item.name}
              className={i === scenario ? "active" : ""}
              onClick={() => setScenario(i)}
            >
              <MessageSquare size={12} />
              {item.name}
            </button>
          ))}
          <div className="sidebar-bottom">
            <span className="avatar">Y</span>Your workspace
            <ChevronDown size={11} />
          </div>
        </aside>
        <div className="chat-thread">
          <div className="chat-thread-top">
            Fathom <ChevronDown size={11} />
            <MoreHorizontal size={17} />
          </div>
          <div className="chat-messages" key={scenario}>
            <div className="user-bubble">{content.prompt}</div>
            <div className="assistant-answer">
              <span className="assistant-mark">f</span>
              <div>
                <h4>{content.heading}</h4>
                <p>{content.response}</p>
                <ol>
                  {content.points.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
                <span className="answer-foot">
                  A thought worth following. <span>↗</span>
                </span>
              </div>
            </div>
          </div>
          <div className="chat-composer">
            <span>Where do you want to take this?</span>
            <div>
              <Plus size={15} />
              <span>Explore a sample above</span>
              <button
                aria-label="Next sample conversation"
                onClick={() => setScenario((scenario + 1) % 3)}
              >
                <ArrowUp size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const cloudSteps = [
  {
    label: "Understand",
    time: "00:04",
    lines: [
      "$ inspecting repository",
      "src/ → 24 files",
      "package.json → React + TypeScript",
      "✓ Project context ready",
    ],
    title: "Understanding the workspace",
  },
  {
    label: "Implement",
    time: "00:38",
    lines: [
      "$ creating command palette",
      "+ src/components/CommandMenu.tsx",
      "+ src/hooks/useKeyboardShortcut.ts",
      "✓ Keyboard navigation added",
    ],
    title: "Building the implementation",
  },
  {
    label: "Verify",
    time: "01:12",
    lines: [
      "$ npm run test",
      "✓ opens with ⌘K",
      "✓ filters commands by query",
      "✓ returns focus on close",
      "3 tests passed",
    ],
    title: "Checking the result",
  },
  {
    label: "Review",
    time: "01:26",
    lines: [
      "$ preparing changes",
      "2 files changed · +142 lines",
      "✓ Implementation ready for review",
      "Waiting for your next step.",
    ],
    title: "Ready for your review",
  },
];
function CloudPreview() {
  const [step, setStep] = useState(2);
  return (
    <div className="app-window cloud-window">
      <WindowBar name="fathom / cloud" />
      <div className="cloud-content">
        <div className="cloud-breadcrumb">
          <GitBranch size={13} /> workspace / studio <ChevronDown size={12} />
          <span className="ui-pill">ISOLATED WORKSPACE</span>
        </div>
        <div className="task-heading">
          <span className="task-symbol">
            <Code2 size={20} />
          </span>
          <div>
            <span className="ui-label">DELEGATED TASK</span>
            <h4>Add a keyboard-first command palette</h4>
          </div>
          <MoreHorizontal size={17} />
        </div>
        <div className="task-meta">
          <span>
            <GitBranch size={11} /> fathom/command-palette
          </span>
          <span>Sample run · {cloudSteps[step].time}</span>
        </div>
        <div className="cloud-timeline">
          {cloudSteps.map((s, i) => (
            <button
              key={s.label}
              className={i === step ? "current" : i < step ? "done" : ""}
              onClick={() => setStep(i)}
            >
              <span>{i < step ? <Check size={12} /> : `0${i + 1}`}</span>
              {s.label}
            </button>
          ))}
        </div>
        <div className="cloud-terminal">
          <div>
            <Terminal size={13} />
            {cloudSteps[step].title}
            <span>OUTPUT</span>
          </div>
          <pre key={step}>
            {cloudSteps[step].lines.map((line, i) => (
              <span
                className={
                  line.startsWith("✓")
                    ? "terminal-success"
                    : line.startsWith("+")
                      ? "terminal-add"
                      : ""
                }
                key={i}
              >
                {line}
                {"\n"}
              </span>
            ))}
          </pre>
        </div>
        <div className="cloud-foot">
          <span>
            <Circle size={8} fill="currentColor" /> Illustrative task execution
          </span>
          <button onClick={() => setStep((step + 1) % 4)}>
            {step === 3 ? "Replay workflow" : "Next step"}
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
function DesktopPreview() {
  const [file, setFile] = useState(0);
  const [diff, setDiff] = useState(true);
  const files = ["CommandMenu.tsx", "useShortcut.ts", "App.tsx"];
  const lines =
    file === 0
      ? [
          "import { useState } from 'react'",
          "import { useShortcut } from './useShortcut'",
          "",
          "export function CommandMenu() {",
          "  const [open, setOpen] = useState(false)",
          "",
          "  useShortcut('mod+k', () => {",
          "    setOpen(current => !current)",
          "  })",
          "",
          "  return (",
          "    <Dialog open={open}>",
          "      <CommandInput autoFocus />",
          "      <CommandList />",
          "    </Dialog>",
          "  )",
          "}",
        ]
      : file === 1
        ? [
            "import { useEffect } from 'react'",
            "",
            "export function useShortcut(key, action) {",
            "  useEffect(() => {",
            "    const handleKey = (event) => {",
            "      if (matches(event, key)) {",
            "        event.preventDefault()",
            "        action()",
            "      }",
            "    }",
            "",
            "    window.addEventListener('keydown', handleKey)",
            "    return () => {",
            "      window.removeEventListener('keydown', handleKey)",
            "    }",
            "  }, [key, action])",
            "}",
          ]
        : [
            "import { CommandMenu } from './CommandMenu'",
            "import { Workspace } from './Workspace'",
            "",
            "export default function App() {",
            "  return (",
            "    <main>",
            "      <Workspace />",
            "      <CommandMenu />",
            "    </main>",
            "  )",
            "}",
          ];
  return (
    <div className="app-window desktop-window">
      <WindowBar name="studio — Fathom" />
      <div className="ide-layout">
        <aside className="ide-sidebar">
          <span className="ui-label">
            EXPLORER <MoreHorizontal size={13} />
          </span>
          <div>
            <ChevronDown size={11} /> STUDIO
          </div>
          <div className="folder-label">
            <ChevronDown size={11} /> src
          </div>
          {files.map((f, i) => (
            <button
              className={file === i ? "active" : ""}
              key={f}
              onClick={() => setFile(i)}
            >
              <FileCode2 size={11} />
              {f}
            </button>
          ))}
          <div className="folder-label">
            <ChevronRight size={11} /> public
          </div>
          <div className="folder-label">
            <FileCode2 size={11} /> package.json
          </div>
        </aside>
        <div className="ide-editor">
          <div className="editor-tab">
            <FileCode2 size={12} />
            {files[file]}
            <span>×</span>
            <button onClick={() => setDiff(!diff)} aria-pressed={diff}>
              {diff ? "Hide diff" : "Show diff"}
            </button>
          </div>
          <div className="code-lines">
            {lines.map((line, i) => (
              <div
                className={diff && i > 5 && i < 9 ? "added-line" : ""}
                key={`${file}-${i}`}
              >
                <span>{i + 1}</span>
                <code>{line}</code>
              </div>
            ))}
          </div>
          <div className="ide-terminal">
            <div>
              TERMINAL{" "}
              <span>
                PROBLEMS <b>0</b>
              </span>
            </div>
            <p>
              <span>~/studio</span> $ npm run dev
            </p>
            <p className="terminal-success">✓ Ready on localhost:5173</p>
          </div>
        </div>
        <aside className="ide-agent">
          <span className="ui-label">
            FATHOM AGENT <Plus size={12} />
          </span>
          <div className="agent-message">
            Add keyboard navigation to the command palette.
          </div>
          <div className="agent-response">
            <span className="assistant-mark">f</span>
            <p>
              The shortcut handler is connected. Focus returns to the editor
              when you close the menu.
            </p>
          </div>
          <span className="ui-label agent-changes">PROPOSED CHANGES</span>
          {files.slice(0, 2).map((f) => (
            <div className="agent-file" key={f}>
              <FileCode2 size={11} />
              {f}
              <span>+</span>
            </div>
          ))}
          <button
            className="review-button"
            onClick={() => {
              setFile(0);
              setDiff(!diff);
            }}
          >
            Inspect changes <ArrowUpRight size={12} />
          </button>
          <small>Interface concept</small>
        </aside>
      </div>
      <div className="ide-status">
        <span>
          <GitBranch size={10} /> fathom/command-palette
        </span>
        <span>
          TypeScript · UTF-8 <Check size={11} />
        </span>
      </div>
    </div>
  );
}
const terminalLines = [
  "$ fathom",
  "",
  "  FATHOM  /  YOUR TERMINAL, WITH A MIND",
  "  ~/studio · local workspace",
  "",
  "› Add a command palette and test the keyboard shortcuts.",
  "",
  "  ◇ Reading project context",
  "  ◇ Planning implementation",
  "  + CommandMenu.tsx",
  "  + useShortcut.ts",
  "  ✓ Keyboard interaction tests passed",
  "",
  "  2 files changed. Ready for your review.",
  "  Your next move › _",
];
function CliPreview({ paused }: { paused: boolean }) {
  const [line, setLine] = useState(terminalLines.length);
  useEffect(() => {
    if (paused || line >= terminalLines.length) return;
    const timer = setTimeout(() => setLine(line + 1), line < 5 ? 90 : 230);
    return () => clearTimeout(timer);
  }, [line, paused]);
  return (
    <div className="app-window cli-window">
      <WindowBar name="fathom — zsh" right="LOCAL WORKSPACE" />
      <div className="cli-body">
        <div className="cli-wordmark" aria-hidden="true">
          FATHOM<span>_</span>
        </div>
        <pre>
          {terminalLines.slice(0, paused ? undefined : line).map((text, i) => (
            <span
              className={
                text.includes("✓")
                  ? "terminal-success"
                  : text.startsWith("›")
                    ? "cli-prompt"
                    : text.includes(" + ")
                      ? "terminal-add"
                      : ""
              }
              key={i}
            >
              {text}
              {"\n"}
            </span>
          ))}
        </pre>
        <button
          className="replay-button"
          onClick={() => setLine(1)}
          disabled={paused}
        >
          <Play size={12} /> Replay sample session
        </button>
      </div>
      <div className="cli-footer">
        <span>ILLUSTRATIVE SESSION · NOT A LIVE TERMINAL</span>
        <span>YOUR TOOLS. YOUR TERMS.</span>
      </div>
    </div>
  );
}
export default function ProductPreview({
  product,
  paused,
}: {
  product: Product;
  paused: boolean;
}) {
  return (
    <div className="preview-transition" key={product}>
      {product === "chat" ? (
        <ChatPreview />
      ) : product === "cloud" ? (
        <CloudPreview />
      ) : product === "desktop" ? (
        <DesktopPreview />
      ) : (
        <CliPreview paused={paused} />
      )}
    </div>
  );
}
