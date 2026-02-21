import { useState } from 'react'
import { OrderProvider, useOrders } from './hooks/useOrders'
import { useTheme } from './hooks/useTheme'
import {
  ShoppingBag, Settings, Bell, Search,
  Sparkles, XCircle, Sun, Moon, ArrowLeft,
  ShieldCheck
} from 'lucide-react'
import { Toaster } from 'sonner'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { WebMCPTools } from './components/WebMCPTools';
import { Sidebar } from './components/Sidebar';
import { OrderTable } from './components/OrderTable';
import { ManualEntryForm } from './components/ManualEntryForm';
import { CreateOrderForm } from './components/CreateOrderForm';
import { AnalyticsView } from './components/AnalyticsView';
import { ChartProvider } from './hooks/useChartConfig';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react'

const KPICard = ({ label, value, icon: Icon, color, bg, border }: any) => {
  const prevValue = React.useRef(value);
  const [shouldAnimate, setShouldAnimate] = React.useState(false);

  React.useEffect(() => {
    const current = Number(value);
    const previous = Number(prevValue.current);

    if (current > previous) {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 10000);
      return () => clearTimeout(timer);
    }
    prevValue.current = value;
  }, [value]);

  const glowColor = color.includes('indigo') ? '#6366f1' :
    color.includes('blue') ? '#3b82f6' :
      color.includes('rose') ? '#f43f5e' :
        color.includes('warning') ? '#f59e0b' :
          color.includes('emerald') ? '#10b981' : '#ffffff';

  return (
    <div className="glass-panel py-6 px-5 rounded-2xl border flex items-center gap-5 group transition-all hover:scale-[1.02] relative overflow-hidden min-w-0">
      {/* 10-Second Border Highlight Animation - Only triggers on increment */}
      <AnimatePresence>
        {shouldAnimate && (
          <motion.div
            key={label + value + "-border"}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 10, times: [0, 0.05, 0.95, 1] }}
            className="absolute inset-0 pointer-events-none z-30"
          >
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <motion.rect
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: 4, ease: "linear" }}
                x="1" y="1" width="98" height="98"
                rx="8"
                fill="none"
                stroke={glowColor}
                strokeWidth="1.5"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Flash / Pulse - Only triggers on value change */}
      <motion.div
        key={value + "-pulse"}
        initial={{ opacity: 0.2 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className={`absolute inset-0 z-0 ${bg} pointer-events-none`}
      />

      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg} ${border} shrink-0 shadow-lg shadow-indigo-500/5 relative z-20`}>
        <Icon size={24} className={color} />
      </div>

      <div className="flex flex-col justify-center min-w-0 relative z-20">
        <p className="text-[10px] text-[var(--muted-foreground)] font-black uppercase tracking-[0.1em] truncate mb-0.5">{label}</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={value}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-black text-[var(--foreground)] leading-none"
          >
            {value}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Sweep Glow */}
      <motion.div
        key={value + "-sweep"}
        initial={{ x: '-150%', skewX: -25 }}
        animate={{ x: '250%' }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `linear-gradient(90deg, transparent, ${glowColor}22, transparent)`,
          width: '60%'
        }}
      />
    </div>
  );
};

const DashboardView = () => {
  const { orders } = useOrders();
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
  const refundRequests = orders.filter(o => o.status === 'refunded').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Pending Orders', value: pendingOrders.toString(), icon: ShoppingBag, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
          { label: 'In Transit', value: shippedOrders.toString(), icon: ShieldCheck, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Cancelled Orders', value: cancelledOrders.toString(), icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
          { label: 'Refund Requests', value: refundRequests.toString(), icon: Settings, color: 'text-warning', bg: 'bg-zinc-900', border: 'border-zinc-800' },
          { label: 'Orders Delivered', value: deliveredOrders.toString(), icon: Bell, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        ].map((stat, i) => (
          <KPICard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10">
        <OrderTable />
        <section className="glass-panel p-10 rounded-2xl border border-indigo-500/10 relative overflow-hidden group">
          <div className="absolute top-[-10px] right-[-10px] p-6 opacity-10 group-hover:opacity-15 transition-opacity pointer-events-none">
            <Sparkles size={64} className="text-indigo-400" />
          </div>
          <h4 className="text-indigo-400 font-bold mb-4 flex items-center gap-3">
            <Sparkles size={20} />
            Agent-Aware Intelligence
          </h4>
          <p className="text-base text-[var(--muted-foreground)] leading-relaxed max-w-2xl">
            This workspace is enhanced with <span className="text-[var(--foreground)] font-bold">WebMCP Protocols</span>.
            AI agents can autonomously navigate the UI, discover data entry points, and execute workflows.
            Every action is tagged and validated for seamless human-AI collaboration.
          </p>
        </section>
      </div>
    </div>
  );
};

const CreateOrderView = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-right-4 duration-700 pb-20">
      <div className="flex items-center gap-6">
        <Link to="/" className="p-3 rounded-xl glass-panel border border-[var(--glass-border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-all active:scale-90">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">New Dispatch Entry</h2>
          <p className="text-[var(--muted-foreground)]">Register a new logistical payload into the Nexus network.</p>
        </div>
      </div>
      <CreateOrderForm />
    </div>
  )
}

const CommandConsoleView = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-right-4 duration-700 pb-20">
      <div className="flex items-center gap-6">
        <Link to="/" className="p-3 rounded-xl glass-panel border border-[var(--glass-border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-all active:scale-90">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">System Authority Console</h2>
          <p className="text-[var(--muted-foreground)]">Privileged operational overrides for active dispatch cycles.</p>
        </div>
      </div>
      <ManualEntryForm />
    </div>
  )
}

const AppLayout = () => {
  const { searchQuery, setSearchQuery } = useOrders();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dispatch Queue';
      case '/create-order': return 'New Dispatch';
      case '/command-console': return 'System Authority';
      case '/analytics': return 'Strategic Intelligence';
      default: return 'Apex Command';
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-600/5 rounded-full" style={{ width: '40%', height: '40%', top: '-10%', left: '-10%', filter: 'blur(120px)' }}></div>
        <div className="absolute bottom-0 right-0 bg-purple-600/5 rounded-full" style={{ width: '30%', height: '30%', right: '-5%', bottom: '10%', filter: 'blur(100px)' }}></div>
      </div>

      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 transition-all">
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between glass-nav sticky top-0 z-20">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <ShieldCheck size={18} className="text-indigo-400" />
              </div>
              <h2 className="text-xs font-black tracking-[0.25em] text-[var(--foreground)] uppercase">
                Nexus Apex // {getPageTitle()}
              </h2>
            </div>
            {location.pathname === '/' && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full text-[var(--muted-foreground)] text-sm focus-within:border-indigo-500/50 transition-colors">
                <Search size={14} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search context..."
                  className="bg-transparent border-none outline-none text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] w-48 font-light text-xs"
                  data-toolname="search_orders"
                />
                <kbd className="px-1.5 py-0.5 bg-[var(--muted)] rounded text-[9px] text-[var(--muted-foreground)] font-mono border border-[var(--glass-border)]">⌘K</kbd>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                title="Toggle Theme"
                className="p-3 glass-panel rounded-xl transition-all border border-[var(--glass-border)] hover:border-zinc-500 text-[var(--muted-foreground)] hover:text-[var(--foreground)] active:scale-95"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowSettings(false);
                  }}
                  title="Notifications"
                  className={`p-3 glass-panel rounded-xl transition-all border border-[var(--glass-border)] hover:border-zinc-500 relative group active:scale-95 ${showNotifications ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'text-[var(--muted-foreground)]'}`}
                >
                  <Bell size={18} className="group-hover:text-[var(--foreground)]" />
                  <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-indigo-500 rounded-full border border-[var(--background)]"></span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-4 w-80 bg-[var(--background)] p-6 rounded-2xl border border-[var(--glass-border)] shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                    <h4 className="text-sm font-bold mb-4 uppercase tracking-widest text-indigo-400">Recent Alerts</h4>
                    <div className="space-y-4">
                      {[
                        { title: 'New Node Active', desc: 'Apex Signal Branch #12 active.', time: '2m ago' },
                        { title: 'Dispatch Complete', desc: 'ORD-003 has reached its trajectory.', time: '1h ago' },
                      ].map((n, i) => (
                        <div key={i} className="group/item cursor-pointer">
                          <p className="text-xs font-bold text-[var(--foreground)] group-hover/item:text-indigo-400 transition-colors">{n.title}</p>
                          <p className="text-[10px] text-[var(--muted-foreground)]">{n.desc}</p>
                          <p className="text-[9px] text-zinc-600 mt-1">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSettings(!showSettings);
                    setShowNotifications(false);
                  }}
                  title="System Settings"
                  className={`p-3 glass-panel rounded-xl transition-all border border-[var(--glass-border)] hover:border-zinc-500 active:scale-95 ${showSettings ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'text-[var(--muted-foreground)]'}`}
                >
                  <Settings size={18} className="hover:text-[var(--foreground)]" />
                </button>
                {showSettings && (
                  <div className="absolute right-0 mt-4 w-72 bg-[var(--background)] p-6 rounded-2xl border border-[var(--glass-border)] shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                    <h4 className="text-sm font-bold mb-4 uppercase tracking-widest text-indigo-400">Configuration</h4>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">HMR Shielding</span>
                        <div className="w-8 h-4 bg-indigo-500 rounded-full relative"><div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></div></div>
                      </div>
                      <div className="flex items-center justify-between opacity-50">
                        <span className="text-xs font-medium">Auto-Optimize</span>
                        <div className="w-8 h-4 bg-zinc-800 rounded-full relative"><div className="absolute left-1 top-1 w-2 h-2 bg-zinc-600 rounded-full"></div></div>
                      </div>
                      <button
                        onClick={() => {
                          localStorage.clear();
                          window.location.reload();
                        }}
                        className="w-full py-2 bg-zinc-900 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-zinc-800 hover:border-indigo-500/30 transition-all text-zinc-300"
                      >
                        Purge Local Cache
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar" onClick={() => { setShowNotifications(false); setShowSettings(false); }}>
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="/create-order" element={<CreateOrderView />} />
            <Route path="/command-console" element={<CommandConsoleView />} />
            <Route path="/analytics" element={<AnalyticsView />} />
          </Routes>
        </div>

        <footer className="h-12 border-t border-[var(--glass-border)] px-8 flex items-center justify-between text-[9px] text-[var(--muted-foreground)] glass-nav font-bold tracking-widest uppercase">
          <div className="flex items-center gap-6">
            <p className="">© Nexus Apex</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

function App() {
  return (
    <OrderProvider>
      <ChartProvider>
        <Toaster position="top-right" theme="dark" expand={false} richColors />
        <WebMCPTools />
        <AppLayout />
      </ChartProvider>
    </OrderProvider >
  )
}

export default App
