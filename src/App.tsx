import { useEffect, useRef, useState } from 'react'
import {
  Archive,
  BarChart3,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  FolderKanban,
  ListChecks,
  MoreVertical,
  Play,
  Power,
  Settings,
  ShieldCheck,
  Sparkles,
  Tag,
  Timer,
  Users,
  X,
  Zap,
} from 'lucide-react'

type HighStatus = 'initial' | 'evidence' | 'editor' | 'complete' | 'ignored'
type LowStatus = 'initial' | 'evidence' | 'waiting' | 'client-waiting-non-billable' | 'client-waiting-billable' | 'break' | 'unrelated' | 'ignored'
type Toast = { message: string; tone?: 'default' | 'success' } | null

const taskOptions = [
  'Video evaluation batch',
  'Guideline review & calibration',
  'QA revisions',
  'Client coordination',
]

const projectOptions = [
  'Aster Labs · Multimodal Evaluation',
  'Aster Labs · Internal coordination',
  'Personal development',
  'No project',
]

const tagOptions = ['coordination', 'calibration', 'review', 'non-billable']

function App() {
  const [highStatus, setHighStatus] = useState<HighStatus>('initial')
  const [lowStatus, setLowStatus] = useState<LowStatus>('initial')
  const [editMode, setEditMode] = useState(false)
  const [estimateAccepted, setEstimateAccepted] = useState(false)
  const [payoffVisible, setPayoffVisible] = useState(false)
  const [toast, setToast] = useState<Toast>(null)
  const [overflowOpen, setOverflowOpen] = useState(false)
  const [form, setForm] = useState({
    description: 'Guideline review & calibration',
    task: 'Video evaluation batch',
    project: 'Aster Labs · Multimodal Evaluation',
    tag: 'coordination',
    duration: '35m',
    billable: true,
    remember: true,
  })
  const shellRef = useRef<HTMLDivElement>(null)

  const highResolved = highStatus === 'complete' || highStatus === 'ignored'
  const lowResolved = !['initial', 'evidence', 'waiting'].includes(lowStatus)
  const clientWaitingLogged = lowStatus === 'client-waiting-non-billable' || lowStatus === 'client-waiting-billable'
  const reviewCount = (highResolved ? 0 : 1) + (lowResolved ? 0 : 1)
  const totalMinutes = 200 + (highStatus === 'complete' ? 35 : 0) + (clientWaitingLogged ? 40 : 0)
  const billableMinutes = 200 + (highStatus === 'complete' ? 35 : 0) + (lowStatus === 'client-waiting-billable' ? 40 : 0)
  const formatDuration = (minutes: number) => `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`
  const total = formatDuration(totalMinutes)
  const billableTotal = formatDuration(billableMinutes)
  const lowOutcome = lowStatus === 'client-waiting-non-billable'
    ? { label: 'Client waiting', detail: 'Logged as non-billable', badge: 'Non-billable' }
    : lowStatus === 'client-waiting-billable'
      ? { label: 'Client waiting', detail: 'Logged as billable', badge: 'Billable' }
      : lowStatus === 'break'
        ? { label: 'Break', detail: 'Personal time', badge: 'Break' }
        : lowStatus === 'unrelated'
          ? { label: 'Excluded', detail: 'Not part of this work record', badge: 'Excluded' }
          : lowStatus === 'ignored'
            ? { label: 'Ignored', detail: 'No change to work record', badge: 'Ignored' }
            : null

  const notify = (message: string, tone: 'default' | 'success' = 'success') => {
    setToast({ message, tone })
  }

  const resetDemo = () => {
    setHighStatus('initial')
    setLowStatus('initial')
    setEditMode(false)
    setEstimateAccepted(false)
    setPayoffVisible(false)
    setOverflowOpen(false)
    setForm({
      description: 'Guideline review & calibration',
      task: 'Video evaluation batch',
      project: 'Aster Labs · Multimodal Evaluation',
      tag: 'coordination',
      duration: '35m',
      billable: true,
      remember: true,
    })
    notify('Demo reset', 'default')
  }

  useEffect(() => {
    if (toast === null) return undefined
    const timer = window.setTimeout(() => setToast(null), 3600)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setHighStatus((current) => (current === 'evidence' || current === 'editor' ? 'initial' : current))
      setLowStatus((current) => (current === 'evidence' || current === 'waiting' ? 'initial' : current))
      setOverflowOpen(false)
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [])

  useEffect(() => {
    const modalOpen = highStatus === 'editor' || lowStatus === 'evidence' || lowStatus === 'waiting'
    if (!modalOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [highStatus, lowStatus])

  const openReview = () => {
    if (payoffVisible) return
    if (!highResolved) setHighStatus('evidence')
    else if (!lowResolved) setLowStatus('evidence')
  }

  const addToRecord = () => {
    setHighStatus('complete')
    setEditMode(false)
    setPayoffVisible(true)
    notify('35m added to your work record')
  }

  const resolveLow = (choice: string) => {
    if (choice === 'Client waiting') {
      setLowStatus('waiting')
      return
    }
    const outcomes: Record<string, { status: LowStatus; message: string }> = {
      Break: { status: 'break', message: 'Marked as break' },
      Unrelated: { status: 'unrelated', message: 'Excluded from this project' },
      Ignore: { status: 'ignored', message: 'Suggestion ignored' },
    }
    const outcome = outcomes[choice]
    setLowStatus(outcome.status)
    notify(outcome.message, 'default')
  }

  const renderSelect = (label: string, value: string, options: string[], key: 'task' | 'project' | 'tag') => (
    <label className="field-control" key={key}>
      <span>{label}</span>
      <select value={value} onChange={(event) => setForm({ ...form, [key]: event.target.value })}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  )

  return (
    <div className="app" ref={shellRef}>
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark"><Power size={22} strokeWidth={2.7} /><small>2.0</small></div>
          <span>Matt's workspace</span>
          <ChevronDown size={17} />
        </div>
        <nav aria-label="Main navigation">
          <NavSection title="TRACK">
            <NavItem icon={<Timer />} label="Timer" />
            <NavItem icon={<BarChart3 />} label="My Activity" active badge={reviewCount > 0 ? String(reviewCount) : undefined} onClick={openReview} />
          </NavSection>
          <NavSection title="ANALYZE"><NavItem icon={<Archive />} label="Reports" /></NavSection>
          <NavSection title="PLAN">
            <NavItem icon={<FolderKanban />} label="Projects" />
            <NavItem icon={<ListChecks />} label="Tasks" />
            <NavItem icon={<Zap />} label="Timeline" pro />
          </NavSection>
          <NavSection title="MANAGE">
            <NavItem icon={<Users />} label="Members" />
            <NavItem icon={<ShieldCheck />} label="Approvals" />
            <NavItem icon={<CalendarDays />} label="Time off" pro />
          </NavSection>
        </nav>
        <div className="sidebar-bottom">
          <button className="utility"><Download size={18} />Download apps</button>
          <button className="utility"><Settings size={18} />Settings</button>
          <button className="utility upgrade"><span className="up-arrow">↑</span>Upgrade</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="timer-bar">
          <div className="timer-prompt"><Sparkles size={19} /> <span>What are you working on?</span></div>
          <div className="timer-controls">
            <button className="dashed-control"><ListChecks size={16} /> Task</button>
            <button className="dashed-control"><FolderKanban size={16} /> Project</button>
            <button className="dashed-control"><Tag size={16} /> Tags</button>
            <button className="icon-muted" title="Billable">$</button>
            <span className="timer-value">0:00:00</span>
            <button className="play-button" aria-label="Start timer"><Play size={22} fill="currentColor" /></button>
            <div className="overflow-wrap">
              <button className="icon-muted more" title="More options" onClick={() => setOverflowOpen(!overflowOpen)}><MoreVertical size={20} /></button>
              {overflowOpen && <div className="overflow-menu"><button onClick={resetDemo}>Reset demo</button></div>}
            </div>
          </div>
        </header>

        <section className="activity-page">
          <div className="page-toolbar">
            <div className="date-picker"><button aria-label="Previous day"><ChevronLeft /></button><CalendarDays size={20} /><strong>Mon, Jul 13, 2026</strong><button aria-label="Next day"><ChevronRight /></button></div>
            <div className="toolbar-right"><button className="icon-muted" title="Activity settings"><Settings size={20} /></button><button className="reset-link" onClick={resetDemo}>Reset demo</button></div>
          </div>

          {reviewCount > 0 && !payoffVisible && (
            <section className="review-strip" aria-label="Work record review">
              <div className="review-icon"><Sparkles size={18} /></div>
              <div>
                <strong>{!highResolved ? '2 activity gaps need review' : 'One segment still needs your input'}</strong>
                <p>{!highResolved ? '35m is a strong work match. 40m needs your input.' : 'A 40m gap needs your decision before it can be classified.'}</p>
              </div>
              <button className="review-button" onClick={openReview}>{!highResolved ? 'Review 2 segments' : 'Review remaining' }<ChevronRight size={17} /></button>
            </section>
          )}

          {highStatus === 'complete' && payoffVisible && (
            <section className="payoff-panel">
              <Sparkles size={20} />
              <div>
                <strong>Complete effort for Video evaluation batch: <b>3h 10m</b></strong>
                <p>2h 35m execution + 35m supporting work</p>
                <p>Your last 3 similar completed batches averaged 3h 12m.</p>
              </div>
              <div className="payoff-action"><span>Suggested estimate for the next batch: <b>3h 15m</b></span><button onClick={() => { setEstimateAccepted(true); setPayoffVisible(false); notify('3h 15m will be suggested for the next similar task.') }}>Use next time</button><button className="text-button" onClick={() => { setPayoffVisible(false); notify('You can update the estimate later.', 'default') }}>Not now</button></div>
            </section>
          )}

          <section className="timeline-shell" aria-label="My activity for July 13">
            <div className="day-summary">
              <div className="day-date"><span>13</span><div><strong>Mon</strong><small>{total} logged</small></div></div>
              <div className="summary-metrics"><div className="summary-total"><Clock3 size={17} /><span><small>Logged</small>{total}</span></div><div className="summary-billable"><b>$</b><span><small>Billable</small>{billableTotal}</span></div></div>
            </div>
            <div className="timeline-head"><div></div><div>ACTIVITY</div><div>LOGGED TIME</div></div>
            <div className="timeline-body">
              <TimeAxis />
              <div className="activity-column">
                <ActivityBlock className="activity-ordinary first" label="Chrome · evaluation portal" duration="21m" />
                <ActivityBlock className="activity-ordinary second" label="Slack" duration="11m" />
                <button className={`activity-block work-match ${highStatus === 'initial' ? 'reviewable' : ''} ${highStatus === 'complete' ? 'confirmed-source' : ''}`} onClick={() => highStatus === 'initial' && setHighStatus('evidence')}>
                  <div className="activity-title-row"><div className="app-icons"><span className="app-icon chrome">◉</span><span className="app-icon slack">#</span><span className="app-icon zoom">▰</span></div><strong>Guidelines & calibration</strong></div>
                  <small>Chrome · Slack · Zoom</small><div className="activity-meta"><span>11:42 AM–12:17 PM</span><time>35m</time></div>
                  {highStatus === 'initial' && <span className="review-dot">To review</span>}
                  {highStatus === 'complete' && <span className="linked-label">Linked</span>}
                </button>
                <ActivityBlock className="activity-lunch" label="Personal time" timeRange="12:17 PM–12:50 PM" duration="33m" muted />
                <button className={`activity-block low-activity ${lowResolved ? `resolved low-${lowStatus}` : ''}`} onClick={() => lowStatus === 'initial' && !payoffVisible && setLowStatus('evidence')} disabled={lowResolved}>
                  <div className="activity-title-row"><div className="app-icons"><span className="app-icon slack">#</span><span className="app-icon idle">◌</span></div><strong>{lowOutcome?.label ?? 'Low activity after client message'}</strong></div>
                  <small>{lowOutcome?.detail ?? 'Slack · awaiting QA clarification'}</small><div className="activity-meta"><span>2:20 PM–3:00 PM</span><time>40m</time></div>
                  {lowStatus === 'initial' && <span className="needs-dot">Needs input</span>}
                  {lowOutcome && <span className="resolved-label">{lowOutcome.badge}</span>}
                </button>
              </div>
              <div className="logged-column">
                <LoggedBlock className="batch-block" title="Video evaluation batch" sub="Aster Labs · Multimodal Evaluation" timeRange="9:00 AM–11:35 AM" duration="2h 35m" estimate={estimateAccepted ? 'Next estimate: 3h 15m' : 'Estimate: 2h 30m'} />
                {highStatus === 'complete' && <LoggedBlock className="supporting-block entered" title={form.description || 'Guideline review & calibration'} sub={`${form.project} · ${form.tag}`} timeRange="11:42 AM–12:17 PM" duration={form.duration} note="Linked to Video evaluation batch" />}
                <LoggedBlock className="revisions-block" title="QA revisions" sub="Aster Labs · Multimodal Evaluation" timeRange="1:15 PM–2:00 PM" duration="45m" />
                {clientWaitingLogged && <LoggedBlock className={`waiting-block ${lowStatus}`} title="Waiting for client clarification" sub="Aster Labs · Multimodal Evaluation" timeRange="2:20 PM–3:00 PM" duration={`40m · ${lowStatus === 'client-waiting-billable' ? 'Billable' : 'Non-billable'}`} />}
              </div>
            </div>
          </section>
        </section>
      </main>

      {highStatus === 'evidence' && <EvidencePopover onClose={() => setHighStatus('initial')} onReview={() => setHighStatus('editor')} />}
      {highStatus === 'editor' && <LogTimeModal form={form} setForm={setForm} editMode={editMode} setEditMode={setEditMode} renderSelect={renderSelect} onClose={() => setHighStatus('initial')} onAdd={addToRecord} onIgnore={() => { setHighStatus('ignored'); notify('Suggestion ignored.', 'default') }} />}
      {lowStatus === 'evidence' && <LowEvidenceModal onClose={() => setLowStatus('initial')} onChoose={resolveLow} />}
      {lowStatus === 'waiting' && <WaitingModal onClose={() => setLowStatus('initial')} onConfirm={(billable) => { setLowStatus(billable ? 'client-waiting-billable' : 'client-waiting-non-billable'); notify(billable ? '40m added as billable client waiting' : '40m added as non-billable client waiting') }} />}
      {toast && <div className={`toast ${toast.tone ?? 'default'}`} role="status"><Check size={18} />{toast.message}</div>}
    </div>
  )
}

function NavSection({ title, children }: { title: string; children: React.ReactNode }) { return <section className="nav-section"><h2>{title}</h2>{children}</section> }
function NavItem({ icon, label, active, badge, pro, onClick }: { icon: React.ReactNode; label: string; active?: boolean; badge?: string; pro?: boolean; onClick?: () => void }) { return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}><span>{icon}</span>{label}{badge && <b className="nav-badge">{badge}</b>}{pro && <em>Pro</em>}</button> }

function TimeAxis() {
  return <div className="time-axis">{['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'].map((hour) => <span key={hour}>{hour}</span>)}</div>
}

function ActivityBlock({ className, label, timeRange, duration, muted }: { className: string; label: string; timeRange?: string; duration: string; muted?: boolean }) { return <div className={`activity-block ${className} ${muted ? 'muted' : ''}`}><strong>{label}</strong>{timeRange && <span className="activity-range">{timeRange}</span>}<time>{duration}</time></div> }
function LoggedBlock({ className, title, sub, timeRange, duration, estimate, note }: { className: string; title: string; sub: string; timeRange: string; duration: string; estimate?: string; note?: string }) { return <div className={`logged-block ${className}`}><strong>{title}</strong><span className="entry-sub">{sub}</span><div className="card-meta"><span className="card-range">{timeRange}</span><time><Clock3 size={14} />{duration}</time></div>{(estimate || note) && <small>{note ?? estimate}</small>}</div> }

function EvidencePopover({ onClose, onReview }: { onClose: () => void; onReview: () => void }) {
  return <div className="floating-layer"><div className="popover evidence-popover" role="dialog" aria-modal="true" aria-label="Activity evidence"><div className="popover-header"><div><span className="status-pill"><Check size={13} />Strong work match</span><strong>11:42 AM–12:17 PM</strong></div><button className="close-button" onClick={onClose}><X /></button></div><p className="popover-intro">This activity resembles work you previously logged to Aster Labs.</p><div className="evidence-apps"><EvidenceRow app="Slack" time="18m" detail="#evaluation-calibration" color="slack" /><EvidenceRow app="Google Chrome" time="14m" detail="Video Evaluation Guidelines · Aster Labs" color="chrome" /><EvidenceRow app="Zoom" time="3m" detail="QA calibration" color="zoom" /></div><div className="activity-stats"><span>Total time <b>35m</b></span><span>Active time <b>34m</b></span></div><div className="popover-actions"><button className="primary-button" onClick={onReview}>Review suggestion</button></div></div></div>
}
function EvidenceRow({ app, time, detail, color }: { app: string; time: string; detail: string; color: string }) { return <div className="evidence-row"><span className={`evidence-icon ${color}`}>{app === 'Slack' ? '#' : app === 'Zoom' ? '▰' : '◉'}</span><div><strong>{app}</strong><small>{detail}</small></div><time>{time}</time></div> }

function LogTimeModal({ form, setForm, editMode, setEditMode, renderSelect, onClose, onAdd, onIgnore }: {
  form: { description: string; task: string; project: string; tag: string; duration: string; billable: boolean; remember: boolean }
  setForm: (form: { description: string; task: string; project: string; tag: string; duration: string; billable: boolean; remember: boolean }) => void
  editMode: boolean
  setEditMode: (value: boolean) => void
  renderSelect: (label: string, value: string, options: string[], key: 'task' | 'project' | 'tag') => React.ReactNode
  onClose: () => void
  onAdd: () => void
  onIgnore: () => void
}) {
  return <Modal><div className="modal-header"><div><span className="eyebrow">LOG TIME</span><h2>Review suggested time</h2></div><button className="close-button" onClick={onClose}><X /></button></div><div className="editor-grid"><label className="description-field"><span>Description</span><input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label><div className="chip-row">{editMode ? <>{renderSelect('Task', form.task, taskOptions, 'task')}{renderSelect('Project', form.project, projectOptions, 'project')}{renderSelect('Tag', form.tag, tagOptions, 'tag')}</> : <><button className="editor-chip"><ListChecks />{form.task}</button><button className="editor-chip"><FolderKanban />{form.project}</button><button className="editor-chip"><Tag />{form.tag}</button></>}</div><div className="time-row"><span><CalendarDays />Mon, Jul 13</span><span><Clock3 />11:42 AM <i>→</i> 12:17 PM</span><label className="duration-input"><Clock3 /><input value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} /></label><button className={`billable-toggle ${form.billable ? 'on' : ''}`} onClick={() => setForm({ ...form, billable: !form.billable })}>$ Billable</button></div></div><section className="why-section"><div className="why-title"><div><h3>Why this suggestion</h3><span className="status-pill"><Check size={13} />Strong match</span></div><button className="text-button" onClick={() => setEditMode(true)}>Change</button></div><ul><li><Check /> Project keyword matched in the active browser title</li><li><Check /> Slack channel matched Aster Labs</li><li><Check /> Similar activity was previously assigned here</li></ul><p>Only activity you confirm becomes part of your work record.</p></section><label className="remember-choice"><input type="checkbox" checked={form.remember} onChange={(event) => setForm({ ...form, remember: event.target.checked })} /> <span>Remember this choice for similar activity</span></label><footer className="modal-footer"><button className="text-button" onClick={onIgnore}>Ignore</button><button className="primary-button" disabled={!form.description.trim()} onClick={onAdd}>Add to work record <Check size={17} /></button></footer></Modal>
}

function LowEvidenceModal({ onClose, onChoose }: { onClose: () => void; onChoose: (choice: string) => void }) { return <Modal className="low-review-modal" onBackdropClick={onClose}><div className="modal-header"><div><span className="eyebrow">REVIEW TIME</span><h2>Needs your input</h2></div><button className="close-button" onClick={onClose}><X /></button></div><div className="low-modal-body"><span className="status-pill uncertain"><CircleHelp size={13} />Needs your input</span><strong className="low-time-range">2:20 PM–3:00 PM</strong><p className="popover-intro">We found a 40-minute gap after a client message, but there is not enough evidence to classify it.</p><div className="low-evidence"><span>Last work signal</span><b>Slack · #evaluation-calibration</b><span>Message context</span><b>Waiting for QA clarification</b><span>Activity</span><b>No sustained foreground activity detected</b></div><h3>How should this time be treated?</h3><div className="choice-grid">{['Client waiting', 'Break', 'Unrelated', 'Ignore'].map((choice) => <button key={choice} onClick={() => onChoose(choice)}>{choice}<ChevronRight size={16} /></button>)}</div></div></Modal> }

function WaitingModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: (billable: boolean) => void }) { return <Modal><div className="modal-header"><div><span className="eyebrow">REVIEW TIME</span><h2>Client waiting</h2></div><button className="close-button" onClick={onClose}><X /></button></div><p className="waiting-copy">You can add this time as a separate record. It will not affect your task estimate.</p><div className="waiting-details"><div><span>Description</span><strong>Waiting for client clarification</strong></div><div><span>Project</span><strong>Aster Labs · Multimodal Evaluation</strong></div><div><span>Time</span><strong>2:20 PM–3:00 PM · 40m</strong></div></div><footer className="modal-footer"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={() => onConfirm(false)}>Add as non-billable</button><button className="text-button" onClick={() => onConfirm(true)}>Mark billable</button></footer></Modal> }

function Modal({ children, className, onBackdropClick }: { children: React.ReactNode; className?: string; onBackdropClick?: () => void }) { return <div className="modal-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onBackdropClick?.() }}><div className={`modal ${className ?? ''}`} role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>{children}</div></div> }

export default App
