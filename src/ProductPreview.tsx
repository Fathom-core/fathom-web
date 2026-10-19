import { useState } from "react";
import { ArrowUp, ChevronDown, MessageSquare, MoreHorizontal, Plus } from "lucide-react";

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
export default function ProductPreview({ product }: { product: Product; paused: boolean }) {
  return <div className="preview-transition" key={product}>{<ChatPreview />}</div>;
}
