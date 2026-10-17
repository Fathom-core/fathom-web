import { useEffect, useRef, useState } from 'react'
import { ArrowUp, ArrowUpRight, Check, ChevronRight, Code2, FileText, Globe2, Loader2, Play, RotateCcw, Square, Terminal, Workflow } from 'lucide-react'

const scenarios = [
  { name: 'Build something', icon: Code2, prompt: 'Build a beautiful dashboard for my next big idea.', title: 'From idea to interface.', file: 'workspace / observatory', steps: ['Understand the brief', 'Create the application', 'Run and review the result'], commands: ['apollo › mapping your idea', 'create src/Observatory.tsx', 'create src/components/Activity.tsx', 'vite build → complete', 'preview ready on localhost:3000'], kind: 'build' },
  { name: 'Explore a question', icon: Globe2, prompt: 'Explore the next frontier of open AI infrastructure.', title: 'Follow your curiosity.', file: 'workspace / research-notes.md', steps: ['Frame the question', 'Explore sources and connections', 'Organize the findings'], commands: ['apollo › outlining the research', 'browser.open → source collection', 'compare → compute / models / tools', 'create research-notes.md', 'research preview ready'], kind: 'research' },
  { name: 'Connect the dots', icon: Workflow, prompt: 'Turn my scattered project notes into a clear action plan.', title: 'Make room for the work.', file: 'workspace / project-plan.md', steps: ['Read the project context', 'Connect tasks and dependencies', 'Create the action plan'], commands: ['apollo › reading project notes', 'extract → milestones and dependencies', 'organize → three workstreams', 'create project-plan.md', 'action plan ready for review'], kind: 'plan' },
] as const

export default function Demo({ paused }: { paused: boolean }) {
  const [scenario, setScenario] = useState(0)
  const [prompt, setPrompt] = useState<string>(scenarios[0].prompt)
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle')
  const [step, setStep] = useState(0)
  const [view, setView] = useState<'preview' | 'terminal'>('preview')
  const [sentPrompt, setSentPrompt] = useState('')
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const selected = scenarios[scenario]
  const clear = () => { if (timer.current) clearInterval(timer.current); timer.current = null }
  useEffect(() => () => { if (timer.current) clearInterval(timer.current) }, [])
  useEffect(() => {
    if (status !== 'running' || paused) return
    timer.current = setInterval(() => setStep(value => Math.min(value + 1, 5)), 1050)
    return clear
  }, [status, paused])
  useEffect(() => { if (step === 5 && status === 'running') { clear(); setStatus('done') } }, [step, status])

  const choose = (index: number) => {
    clear(); setScenario(index); setPrompt(scenarios[index].prompt); setStatus('idle'); setStep(0); setSentPrompt('')
  }
  const run = () => {
    if (!prompt.trim()) return
    clear(); setSentPrompt(prompt.trim()); setStep(0); setStatus('running')
  }

  return <div className="workspace-demo" id="workspace-demo">
    <div className="demo-scenarios" aria-label="Choose a demonstration">
      {scenarios.map((item, index) => <button key={item.kind} onClick={() => choose(index)} aria-pressed={scenario === index} className={scenario === index ? 'selected' : ''}><item.icon size={15} />{item.name}<ArrowUpRight size={14} /></button>)}
    </div>
    <div className="workspace-shell">
      <div className="workspace-toolbar"><div className="window-dots"><i /><i /><i /></div><span>FATHOM / CLOUD WORKSPACE</span><span className="demo-label"><i /> INTERACTIVE PREVIEW</span></div>
      <div className="workspace-body">
        <div className="agent-panel">
          <div className="agent-header"><span className="apollo-avatar">✳</span><div>Apollo<span>Thinking. Creating. Doing.</span></div><span className="model-pill">FLAGSHIP</span></div>
          <div className="agent-conversation" aria-live="polite">
            {sentPrompt ? <div className="sent-message">{sentPrompt}</div> : <div className="demo-intro"><span className="tiny-label">A LITTLE POSSIBILITY</span><h3>{selected.title}</h3><p>Start with a thought. See how an agent could turn it into something real.</p></div>}
            {status !== 'idle' && <div className="agent-response"><span className="mini-star">✳</span><p>{status === 'done' ? 'The preview is ready. Take a look around.' : 'Let’s give that idea some shape.'}</p></div>}
            <div className={`task-steps ${status !== 'idle' ? 'is-running' : ''}`}>
              {selected.steps.map((text, i) => {
                const complete = status === 'done' || (status === 'running' && step > i * 2)
                const current = status === 'running' && !complete && step >= i * 2 - 1
                return <div key={text} className={complete ? 'complete' : current ? 'current' : ''}><span className="step-circle">{complete ? <Check size={12} /> : current ? <Loader2 size={12} className="spin" /> : <span>{i + 1}</span>}</span>{text}</div>
              })}
            </div>
          </div>
          <form className="prompt-box" onSubmit={e => { e.preventDefault(); run() }}>
            <label className="sr-only" htmlFor="demo-prompt">Your demonstration prompt</label>
            <textarea id="demo-prompt" rows={2} maxLength={500} value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Where should we begin?" onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (status !== 'running') run() } }} />
            <div><span><span className="mini-star">✳</span> Apollo <ChevronRight size={12} /></span>{status === 'running' ? <button type="button" aria-label="Stop demonstration" onClick={() => { clear(); setStatus('idle'); setStep(0) }}><Square size={13} /></button> : <button type="submit" aria-label="Run demonstration" disabled={!prompt.trim()}><ArrowUp size={17} /></button>}</div>
          </form>
          <p className="demo-disclaimer">A guided concept demo. No live AI connection.</p>
        </div>
        <div className="execution-panel">
          <div className="execution-toolbar"><div><button onClick={() => setView('preview')} className={view === 'preview' ? 'active' : ''}><Globe2 size={13} /> Preview</button><button onClick={() => setView('terminal')} className={view === 'terminal' ? 'active' : ''}><Terminal size={13} /> Terminal</button></div><span className={`execution-status ${status}`}>{status === 'running' ? paused ? 'PAUSED' : 'WORKING' : status === 'done' ? 'COMPLETE' : 'READY'}</span></div>
          <div className="file-address"><span>{view === 'terminal' ? 'apollo@fathom:~' : selected.file}</span>{status === 'done' && <button onClick={run} aria-label="Replay demonstration"><RotateCcw size={12} /></button>}</div>
          {view === 'terminal' ? <div className="terminal-output"><span className="terminal-heading">FATHOM CLOUD · SIMULATED SESSION</span>{selected.commands.slice(0, status === 'done' ? 5 : status === 'running' ? Math.max(1, step) : 0).map((line, i) => <p key={line}><span>{String(i + 1).padStart(2, '0')}</span>{line}</p>)}{status === 'idle' && <p>Awaiting your instruction<span className="terminal-caret">▌</span></p>}{status === 'running' && <span className="terminal-caret">▌</span>}</div> : <div className={`preview-stage ${status === 'running' ? 'generating' : ''}`}>
            {selected.kind === 'build' && <div className="observatory-preview"><div className="preview-nav"><span><i /> observatory</span><span>Overview <span className="preview-profile">S</span></span></div><div className="preview-greeting"><span>YOUR IDEAS, IN ORBIT.</span><h4>A little perspective.</h4><p>Everything you’re building. One beautiful view.</p></div><div className="dashboard-stats"><div><span>Active projects</span><strong>08 <small>↗ 2 this week</small></strong></div><div><span>Creative momentum</span><strong>92<span>%</span></strong></div></div><div className="chart-label"><span>Making progress</span><span>Last 7 days ↗</span></div><div className="demo-chart">{[32, 45, 38, 58, 51, 68, 61, 79, 71, 88, 80, 96, 88, 100, 92, 110, 106, 124, 115, 136, 129, 149, 139, 161, 155, 173, 168, 188].map((h, i) => <i key={i} style={{ height: `${h / 1.5}px`, animationDelay: `${i * 25}ms` }} />)}</div><div className="chart-days"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div></div>}
            {selected.kind === 'research' && <div className="document-preview"><div className="document-icon"><Globe2 size={21} /></div><span className="tiny-label">RESEARCH NOTES / EXAMPLE</span><h4>The next frontier<br />of open intelligence.</h4><p>A connected landscape of models, compute, and the tools that let intelligence act.</p><div className="research-topic"><span>01</span><div><strong>Models as a foundation</strong><p>Open weights make new forms of customization possible.</p></div></div><div className="research-topic"><span>02</span><div><strong>Environments for action</strong><p>Isolated workspaces connect reasoning to execution.</p></div></div><div className="research-topic"><span>03</span><div><strong>One continuous experience</strong><p>Shared context connects people, agents, and their work.</p></div></div></div>}
            {selected.kind === 'plan' && <div className="document-preview"><div className="document-icon"><FileText size={21} /></div><span className="tiny-label">PROJECT PLAN / EXAMPLE</span><h4>A clear path<br />from here to there.</h4><p>Your next idea, organized into three focused chapters.</p>{['Define the experience', 'Build the foundation', 'Test, refine, and share'].map((item, i) => <div className="plan-row" key={item}><span>0{i + 1}</span><div><strong>{item}</strong><p>{['Direction, scope, and a shared vision', 'Core interactions and working prototypes', 'Details that make the difference'][i]}</p></div><span className="plan-state">{i === 0 ? 'FIRST' : 'NEXT'}</span></div>)}</div>}
            {status === 'running' && <div className="build-overlay"><span><Loader2 size={16} className="spin" />{paused ? 'Motion paused' : selected.steps[Math.min(2, Math.floor(step / 2))]}</span><div style={{ width: `${(step + 1) / 6 * 100}%` }} /></div>}
            {status === 'idle' && <button className="run-preview" onClick={run}><Play size={12} fill="currentColor" /> Run this scenario</button>}
          </div>}
        </div>
      </div>
    </div>
    <div className="demo-bottom"><span><i /> Your intention. An agent’s initiative.</span><span>ILLUSTRATIVE EXPERIENCE · BUILT FOR WHAT’S NEXT</span></div>
  </div>
}
