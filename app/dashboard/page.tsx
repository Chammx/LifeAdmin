"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CircleDollarSign,
  Clock,
  Heart,
  Lightbulb,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Target,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import AppShell from "@/components/app-shell";

type Entry = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  kind: "income" | "expense";
};

type Task = {
  id: string;
  title: string;
  done: boolean;
  priority: "High" | "Medium" | "Low";
};

type Tab = "Overview" | "Money" | "Discover" | "Tasks";

const money = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const sampleOffers = [
  {
    name: "Everyday essentials",
    category: "Shopping",
    description: "Compare prices before buying household essentials.",
    tip: "Compare the final price, delivery fee and return policy.",
    color: "#e7f5ec",
    icon: "🛍️",
  },
  {
    name: "Mobile & internet plans",
    category: "Bills",
    description: "Review your current plan against your actual usage.",
    tip: "Check coverage, data limits and renewal terms before switching.",
    color: "#e7efff",
    icon: "📱",
  },
  {
    name: "Subscriptions check",
    category: "Savings",
    description: "Find recurring services you no longer use.",
    tip: "Review your statements before cancelling anything.",
    color: "#f5eaff",
    icon: "✨",
  },
  {
    name: "Build an emergency fund",
    category: "Finance",
    description: "Set a realistic savings target for unexpected expenses.",
    tip: "Start with an amount that fits your budget.",
    color: "#fff0dc",
    icon: "🎯",
  },
];

const css = `
.smart-hub{max-width:1400px;margin:auto;padding:28px;color:var(--foreground,#17251f)}
.hub-top{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:26px}
.hub-eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#428568;font-weight:800}
.hub-title{font-size:clamp(28px,4vw,40px);letter-spacing:-1.5px;margin:8px 0}
.hub-muted{color:var(--muted,#748078);font-size:14px;line-height:1.6}
.hub-btn{border:0;border-radius:12px;padding:11px 15px;cursor:pointer;font-weight:700;display:inline-flex;align-items:center;justify-content:center;gap:8px}
.hub-primary{background:#176b4b;color:white}
.hub-secondary{background:var(--card,#fff);color:var(--foreground,#17251f);border:1px solid var(--border,#e5eae7)}
.hub-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px}
.hub-tab{padding:10px 17px;border:1px solid var(--border,#e5eae7);border-radius:12px;background:var(--card,#fff);cursor:pointer;color:var(--foreground,#17251f)}
.hub-tab.active{background:#176b4b;color:white;border-color:#176b4b}
.hub-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:15px;margin-bottom:22px}
.hub-card{background:var(--card,#fff);border:1px solid var(--border,#e6ebe8);border-radius:18px;padding:20px;min-width:0}
.hub-stat-icon{width:38px;height:38px;display:grid;place-items:center;background:#e8f5ee;color:#176b4b;border-radius:12px;margin-bottom:16px}
.hub-stat-label{font-size:13px;color:var(--muted,#748078)}
.hub-stat-value{font-size:clamp(21px,2.5vw,29px);font-weight:800;letter-spacing:-1px;margin:8px 0}
.hub-section-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:17px;flex-wrap:wrap}
.hub-section-head h2,.hub-card h2{font-size:18px;margin:0 0 6px}
.hub-main-grid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(270px,.85fr);gap:18px;margin-bottom:20px}
.hub-list{display:flex;flex-direction:column;gap:10px}
.hub-row{display:flex;align-items:center;gap:12px;padding:13px 0;border-bottom:1px solid var(--border,#edf0ee)}
.hub-row:last-child{border-bottom:0}
.hub-row-icon{width:40px;height:40px;flex-shrink:0;display:grid;place-items:center;border-radius:12px;background:var(--soft,#f3f7f4)}
.hub-row-main{flex:1;min-width:0}
.hub-row-main strong{display:block;font-size:14px;overflow-wrap:anywhere}
.hub-row-main small{display:block;color:var(--muted,#748078);margin-top:5px;font-size:12px}
.hub-amount{font-size:14px;font-weight:800;white-space:nowrap}
.hub-input,.hub-select{box-sizing:border-box;width:100%;padding:12px;border:1px solid var(--border,#dfe6e1);border-radius:11px;background:var(--card,#fff);color:var(--foreground,#17251f);font:inherit}
.hub-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:18px 0}
.hub-field{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:700}
.hub-field.full{grid-column:1/-1}
.hub-offers{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.hub-offer{border:1px solid var(--border,#e6ebe8);border-radius:16px;padding:17px}
.hub-offer-icon{width:44px;height:44px;display:grid;place-items:center;border-radius:13px;font-size:23px;margin-bottom:15px}
.hub-tag{display:inline-block;background:#e7f5ec;color:#176b4b;border-radius:30px;padding:5px 9px;font-size:11px;font-weight:800;margin-bottom:10px}
.hub-tip{background:var(--soft,#f3f7f4);border-radius:12px;padding:13px;margin-top:13px;font-size:13px;line-height:1.6}
.hub-check{width:19px;height:19px;accent-color:#176b4b;cursor:pointer}
.hub-empty{text-align:center;padding:28px 12px;color:var(--muted,#748078);font-size:14px}
.hub-progress{height:8px;border-radius:10px;background:var(--soft,#edf2ee);overflow:hidden;margin:14px 0}
.hub-progress span{height:100%;display:block;background:#21845d;border-radius:10px}
.hub-note{font-size:12px;color:var(--muted,#748078);line-height:1.6;margin-top:14px}
.hub-delete{border:0;background:transparent;color:#b45454;cursor:pointer;padding:7px}
@media(max-width:900px){.hub-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.hub-main-grid{grid-template-columns:1fr}}
@media(max-width:520px){.smart-hub{padding:17px}.hub-grid{gap:9px}.hub-card{padding:15px}.hub-offers{grid-template-columns:1fr}.hub-form{grid-template-columns:1fr}.hub-field.full{grid-column:auto}.hub-stat-value{font-size:22px}}
`;

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Shopping");
  const [kind, setKind] = useState<"income" | "expense">("expense");
  const [taskTitle, setTaskTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("Medium");
  const [offerCategory, setOfferCategory] = useState("All");

  useEffect(() => {
    try {
      const savedEntries = localStorage.getItem("lifeadmin-smart-money-v1");
      const savedTasks = localStorage.getItem("lifeadmin-smart-tasks-v1");
      if (savedEntries) setEntries(JSON.parse(savedEntries));
      if (savedTasks) setTasks(JSON.parse(savedTasks));
    } catch {
      console.warn("Could not load saved LifeAdmin data.");
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("lifeadmin-smart-money-v1", JSON.stringify(entries));
  }, [entries, loaded]);

  useEffect(() => {
    if (loaded) localStorage.setItem("lifeadmin-smart-tasks-v1", JSON.stringify(tasks));
  }, [tasks, loaded]);

  const income = useMemo(
    () => entries.filter((e) => e.kind === "income").reduce((s, e) => s + e.amount, 0),
    [entries]
  );
  const expenses = useMemo(
    () => entries.filter((e) => e.kind === "expense").reduce((s, e) => s + e.amount, 0),
    [entries]
  );
  const balance = income - expenses;
  const openTasks = tasks.filter((t) => !t.done);
  const highTasks = openTasks.filter((t) => t.priority === "High");

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!title.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) return;
    setEntries((prev) => [{
      id: crypto.randomUUID(),
      title: title.trim(),
      amount: numericAmount,
      category,
      date: new Date().toISOString(),
      kind,
    }, ...prev]);
    setTitle("");
    setAmount("");
    setShowEntryForm(false);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    setTasks((prev) => [...prev, {
      id: crypto.randomUUID(),
      title: taskTitle.trim(),
      priority,
      done: false,
    }]);
    setTaskTitle("");
    setShowTaskForm(false);
  };

  const visibleOffers = sampleOffers.filter(
    (offer) => offerCategory === "All" || offer.category === offerCategory
  );
  const visibleEntries = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(query.toLowerCase()) ||
      entry.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AppShell>
      <style>{css}</style>
      <main className="smart-hub">
        <header className="hub-top">
          <div>
            <div className="hub-eyebrow">YOUR PERSONAL SMART HUB</div>
            <h1 className="hub-title">Make life work better.</h1>
            <p className="hub-muted">
              Your money, priorities and smarter choices—all in one place.
            </p>
          </div>
          <button className="hub-btn hub-primary" onClick={() => {
            setTab("Money");
            setShowEntryForm(true);
          }}>
            <Plus size={17} /> Add transaction
          </button>
        </header>

        <nav className="hub-tabs" aria-label="Smart Hub sections">
          {(["Overview", "Money", "Discover", "Tasks"] as Tab[]).map((item) => (
            <button key={item} className={`hub-tab ${tab === item ? "active" : ""}`} onClick={() => setTab(item)}>
              {item}
            </button>
          ))}
        </nav>

        {tab === "Overview" && (
          <>
            <section className="hub-grid">
              <StatCard icon={<Wallet size={19} />} label="Money in" value={money(income)} detail="Recorded income" />
              <StatCard icon={<ArrowDownRight size={19} />} label="Money out" value={money(expenses)} detail="Recorded expenses" />
              <StatCard icon={<CircleDollarSign size={19} />} label="Net recorded" value={money(balance)} detail="Income minus expenses" />
              <StatCard icon={<Check size={19} />} label="Open tasks" value={String(openTasks.length)} detail={`${highTasks.length} high priority`} />
            </section>

            <section className="hub-main-grid">
              <div className="hub-card">
                <div className="hub-section-head">
                  <div><h2>Your recent money activity</h2><div className="hub-muted">A clear view of what you record.</div></div>
                  <button className="hub-btn hub-secondary" onClick={() => setTab("Money")}>View all <ArrowUpRight size={15} /></button>
                </div>
                {entries.length === 0 ? (
                  <div className="hub-empty">No transactions yet. Add your first income or expense to start understanding your money.</div>
                ) : (
                  <div className="hub-list">
                    {entries.slice(0, 5).map((entry) => (
                      <div className="hub-row" key={entry.id}>
                        <div className="hub-row-icon">{entry.kind === "income" ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}</div>
                        <div className="hub-row-main"><strong>{entry.title}</strong><small>{entry.category} · {new Date(entry.date).toLocaleDateString()}</small></div>
                        <span className="hub-amount">{entry.kind === "income" ? "+" : "−"}{money(entry.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="hub-card">
                <div className="hub-section-head"><div><h2><Sparkles size={17} style={{display:"inline",verticalAlign:"middle"}} /> Suggestions for you</h2><div className="hub-muted">Practical ideas, not just reminders.</div></div></div>
                <div className="hub-tip"><strong><Lightbulb size={16} style={{display:"inline",verticalAlign:"middle"}} /> Start with visibility</strong><br />Record a few days of income and spending before changing your budget. Better data leads to better decisions.</div>
                {balance < 0 && <div className="hub-tip"><strong>Spending exceeds recorded income</strong><br />Review your largest expenses and check whether any are optional. This is based only on the entries you have recorded.</div>}
                {highTasks.length > 0 && <div className="hub-tip"><strong>{highTasks.length} high-priority task{highTasks.length === 1 ? "" : "s"}</strong><br />Consider handling these before lower-priority tasks.</div>}
                <p className="hub-note">Suggestions are based on information you enter. Product offers and live AI recommendations are not connected yet.</p>
                <button className="hub-btn hub-primary" style={{width:"100%",marginTop:8}} onClick={() => setTab("Discover")}><Sparkles size={16}/> Explore smarter choices</button>
              </div>
            </section>

            <section className="hub-card">
              <div className="hub-section-head">
                <div><h2>Your next priorities</h2><div className="hub-muted">A simple list to keep moving.</div></div>
                <button className="hub-btn hub-secondary" onClick={() => { setTab("Tasks"); setShowTaskForm(true); }}><Plus size={15}/> Add task</button>
              </div>
              {openTasks.length === 0 ? <div className="hub-empty">No open tasks. Add something you want to get done.</div> : (
                <div className="hub-list">
                  {openTasks.slice(0, 4).map((task) => <TaskRow key={task.id} task={task} onToggle={() => setTasks((prev) => prev.map((t) => t.id === task.id ? {...t, done: !t.done} : t))} onDelete={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}/>)}
                </div>
              )}
            </section>
          </>
        )}

        {tab === "Money" && (
          <>
            <section className="hub-grid">
              <StatCard icon={<ArrowUpRight size={19}/>} label="Income recorded" value={money(income)} detail="All saved entries"/>
              <StatCard icon={<ArrowDownRight size={19}/>} label="Expenses recorded" value={money(expenses)} detail="All saved entries"/>
              <StatCard icon={<Wallet size={19}/>} label="Net amount" value={money(balance)} detail="Not a bank balance"/>
              <StatCard icon={<Target size={19}/>} label="Transactions" value={String(entries.length)} detail="Saved in this browser"/>
            </section>
            <section className="hub-card">
              <div className="hub-section-head"><div><h2>Money activity</h2><div className="hub-muted">Record income and expenses in one place.</div></div><button className="hub-btn hub-primary" onClick={() => setShowEntryForm(!showEntryForm)}><Plus size={16}/> Add transaction</button></div>
              {showEntryForm && (
                <form className="hub-form" onSubmit={addEntry}>
                  <label className="hub-field full">Description<input className="hub-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Groceries, salary, internet bill" required/></label>
                  <label className="hub-field">Amount (₹)<input className="hub-input" type="number" min="1" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" required/></label>
                  <label className="hub-field">Type<select className="hub-select" value={kind} onChange={(e) => setKind(e.target.value as "income" | "expense")}><option value="expense">Expense</option><option value="income">Income</option></select></label>
                  <label className="hub-field">Category<select className="hub-select" value={category} onChange={(e) => setCategory(e.target.value)}>{["Shopping","Food","Transport","Bills","Home","Health","Education","Salary","Other"].map((c) => <option key={c}>{c}</option>)}</select></label>
                  <div style={{display:"flex",gap:8,alignItems:"end"}}><button className="hub-btn hub-primary" type="submit"><Check size={16}/> Save</button><button className="hub-btn hub-secondary" type="button" onClick={() => setShowEntryForm(false)}>Cancel</button></div>
                </form>
              )}
              <label className="hub-field" style={{maxWidth:400,marginBottom:15}}><span>Search activity</span><div style={{position:"relative"}}><Search size={16} style={{position:"absolute",left:12,top:13,color:"#849087"}}/><input className="hub-input" style={{paddingLeft:36}} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search description or category"/></div></label>
              {visibleEntries.length === 0 ? <div className="hub-empty">No matching transactions. Add an entry to get started.</div> : (
                <div className="hub-list">{visibleEntries.map((entry) => <div className="hub-row" key={entry.id}><div className="hub-row-icon">{entry.kind === "income" ? <ArrowUpRight size={18}/> : <ArrowDownRight size={18}/>}</div><div className="hub-row-main"><strong>{entry.title}</strong><small>{entry.category} · {new Date(entry.date).toLocaleDateString()}</small></div><span className="hub-amount">{entry.kind === "income" ? "+" : "−"}{money(entry.amount)}</span><button className="hub-delete" aria-label="Delete transaction" onClick={() => setEntries((prev) => prev.filter((e) => e.id !== entry.id))}><Trash2 size={16}/></button></div>)}</div>
              )}
              <p className="hub-note">This is a personal record tracker, not a bank connection. Recording a bill does not pay it. No payment details or banking credentials are collected.</p>
            </section>
          </>
        )}

        {tab === "Discover" && (
          <>
            <section className="hub-card" style={{marginBottom:18,background:"linear-gradient(120deg,#eaf7ef,#f5f4ff)"}}>
              <div className="hub-eyebrow">LIFEADMIN DISCOVER</div>
              <h2 style={{fontSize:26,marginTop:10}}>Make your next choice a smarter one.</h2>
              <p style={{maxWidth:650,lineHeight:1.7,color:"#53665b"}}>Explore practical ideas for saving money, reviewing services and making more informed purchases. These are guidance cards, not verified live offers.</p>
            </section>
            <div className="hub-section-head"><div><h2>Ideas worth exploring</h2><div className="hub-muted">Choose a category to narrow the suggestions.</div></div><select className="hub-select" style={{width:"auto"}} value={offerCategory} onChange={(e) => setOfferCategory(e.target.value)}>{["All","Shopping","Bills","Savings","Finance"].map((c) => <option key={c}>{c}</option>)}</select></div>
            <section className="hub-offers">
              {visibleOffers.map((offer) => <article className="hub-card" key={offer.name}>
                <div className="hub-offer-icon" style={{background:offer.color}}>{offer.icon}</div>
                <span className="hub-tag">{offer.category}</span>
                <h2>{offer.name}</h2>
                <p className="hub-muted" style={{marginTop:8}}>{offer.description}</p>
                <div className="hub-tip"><strong>Smart tip</strong><br/>{offer.tip}</div>
                <button className="hub-btn hub-secondary" style={{marginTop:14}} onClick={() => {setTab("Tasks");setTaskTitle(`Review: ${offer.name}`);setShowTaskForm(true);}}><Heart size={15}/> Add to my tasks</button>
              </article>)}
            </section>
            <p className="hub-note">No merchant prices, discounts, stock levels or product links are fetched here. Live comparisons will require a trustworthy product/merchant data source.</p>
          </>
        )}

        {tab === "Tasks" && (
          <section className="hub-card">
            <div className="hub-section-head"><div><h2>Personal priorities</h2><div className="hub-muted">Track the things you want to get done.</div></div><button className="hub-btn hub-primary" onClick={() => setShowTaskForm(!showTaskForm)}><Plus size={16}/> Add task</button></div>
            {showTaskForm && <form className="hub-form" onSubmit={addTask}>
              <label className="hub-field full">Task title<input className="hub-input" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="e.g. Compare internet plans" required/></label>
              <label className="hub-field">Priority<select className="hub-select" value={priority} onChange={(e) => setPriority(e.target.value as Task["priority"])}><option>High</option><option>Medium</option><option>Low</option></select></label>
              <div style={{display:"flex",gap:8,alignItems:"end"}}><button className="hub-btn hub-primary" type="submit"><Check size={16}/> Save task</button><button className="hub-btn hub-secondary" type="button" onClick={() => setShowTaskForm(false)}>Cancel</button></div>
            </form>}
            <div className="hub-progress"><span style={{width:`${tasks.length ? tasks.filter((t) => t.done).length / tasks.length * 100 : 0}%`}}/></div>
            <div className="hub-muted" style={{marginBottom:12}}>{tasks.filter((t) => t.done).length} of {tasks.length} tasks completed</div>
            {tasks.length === 0 ? <div className="hub-empty">Start with one useful thing you want to accomplish today.</div> : <div className="hub-list">{tasks.map((task) => <TaskRow key={task.id} task={task} onToggle={() => setTasks((prev) => prev.map((t) => t.id === task.id ? {...t, done: !t.done} : t))} onDelete={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}/>)}</div>}
          </section>
        )}

        <footer className="hub-note" style={{textAlign:"center",marginTop:24}}>
          <Clock size={13} style={{display:"inline",verticalAlign:"middle"}}/> LifeAdmin Smart Hub · Your entries stay in this browser. Back them up before clearing browser data.
        </footer>
      </main>
    </AppShell>
  );
}

function StatCard({icon,label,value,detail}:{icon:React.ReactNode;label:string;value:string;detail:string}) {
  return <div className="hub-card"><div className="hub-stat-icon">{icon}</div><div className="hub-stat-label">{label}</div><div className="hub-stat-value">{value}</div><div className="hub-muted" style={{fontSize:12}}>{detail}</div></div>;
}

function TaskRow({task,onToggle,onDelete}:{task:Task;onToggle:()=>void;onDelete:()=>void}) {
  return <div className="hub-row"><input className="hub-check" type="checkbox" checked={task.done} onChange={onToggle} aria-label={`Mark ${task.title} ${task.done ? "incomplete" : "complete"}`}/><div className="hub-row-main"><strong style={{textDecoration:task.done?"line-through":"none",opacity:task.done?.6:1}}>{task.title}</strong><small>{task.priority} priority {task.done ? "· Completed" : "· Open"}</small></div><button className="hub-delete" onClick={onDelete} aria-label={`Delete ${task.title}`}><Trash2 size={16}/></button></div>;
}
