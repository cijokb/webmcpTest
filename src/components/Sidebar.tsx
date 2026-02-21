import React, { useState, useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import { Terminal, Cpu, LayoutDashboard, Command, PlusCircle, ChevronLeft, ChevronRight, Github, Sparkles, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

const TypingLogEntry: React.FC<{ text: string; isAgent: boolean }> = ({ text, isAgent }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(isAgent);

    useEffect(() => {
        if (!isAgent) {
            setDisplayedText(text);
            return;
        }

        let i = 0;
        setDisplayedText('');
        setIsTyping(true);

        const interval = setInterval(() => {
            // Faster character-wise typing for better feel
            setDisplayedText(text.slice(0, i));
            i++;
            if (i > text.length) {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 50); // Balanced character-wise speed

        return () => clearInterval(interval);
    }, [text, isAgent]);

    return (
        <div className="flex gap-3 text-[10px] group/log relative">
            <div className={`w-1 h-1 mt-1.5 rounded-full shrink-0 transition-all duration-500 ${isAgent ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-zinc-600'}`}></div>
            <div className="flex-1 min-w-0">
                <span className={`${isAgent ? 'text-indigo-400 font-medium' : 'text-zinc-400'} break-words whitespace-pre-wrap leading-relaxed`}>
                    {displayedText}
                </span>
                {isTyping && isAgent && (
                    <motion.span
                        animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="inline-block ml-1 align-middle"
                    >
                        <Sparkles size={10} className="text-indigo-400" />
                    </motion.span>
                )}
            </div>
        </div>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
    const { log } = useOrders();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 340 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="h-screen glass-nav border-r border-zinc-800/50 flex flex-col overflow-hidden z-20 sticky top-0"
        >
            {/* Header / Logo Section */}
            <div className={`flex items-center gap-6 ${isCollapsed ? 'p-4 justify-center' : 'p-8'} mb-4`}>
                <div className={`${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg glow-primary shrink-0 transition-all`}>
                    <Terminal size={isCollapsed ? 20 : 24} className="text-white" />
                </div>
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                    >
                        <h1 className="text-xl font-bold tracking-tight text-gradient leading-tight whitespace-nowrap uppercase tracking-widest">Nexus Apex</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active • v1.5</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Navigation Section */}
            <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} space-y-2 mt-4 overflow-y-auto no-scrollbar flex flex-col`}>
                <div className="space-y-2">
                    <Link
                        to="/"
                        title={isCollapsed ? 'Dashboard' : ''}
                        className={`flex items-center gap-4 py-3.5 rounded-xl transition-all border ${isActive('/')
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-bold shadow-[inset_0_0_12px_rgba(99,102,241,0.1)]'
                            : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                            } ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
                    >
                        <LayoutDashboard size={20} className="shrink-0" />
                        {!isCollapsed && <span className="text-sm tracking-wide whitespace-nowrap">Live Dashboard</span>}
                    </Link>
                    <Link
                        to="/create-order"
                        title={isCollapsed ? 'Create Order' : ''}
                        className={`flex items-center gap-4 py-3.5 rounded-xl transition-all border ${isActive('/create-order')
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-bold shadow-[inset_0_0_12px_rgba(99,102,241,0.1)]'
                            : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                            } ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
                    >
                        <PlusCircle size={20} className="shrink-0" />
                        {!isCollapsed && <span className="text-sm tracking-wide whitespace-nowrap">Create New Order</span>}
                    </Link>
                    <Link
                        to="/command-console"
                        title={isCollapsed ? 'Command Console' : ''}
                        className={`flex items-center gap-4 py-3.5 rounded-xl transition-all border ${isActive('/command-console')
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-bold shadow-[inset_0_0_12px_rgba(99,102,241,0.1)]'
                            : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                            } ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
                    >
                        <Command size={20} className="shrink-0" />
                        {!isCollapsed && <span className="text-sm tracking-wide whitespace-nowrap">Command Console</span>}
                    </Link>
                    <Link
                        to="/analytics"
                        title={isCollapsed ? 'Analytics Hub' : ''}
                        className={`flex items-center gap-4 py-3.5 rounded-xl transition-all border ${isActive('/analytics')
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-bold shadow-[inset_0_0_12px_rgba(99,102,241,0.1)]'
                            : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                            } ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
                    >
                        <TrendingUp size={20} className="shrink-0" />
                        {!isCollapsed && <span className="text-sm tracking-wide whitespace-nowrap">Analytics Hub</span>}
                    </Link>
                </div>

                {/* Telemetry Section - Optimized and Height Increased */}
                {!isCollapsed && (
                    <div className="pt-8 space-y-4 flex-1 flex flex-col min-h-0 pb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-3">
                                <Cpu size={14} className="text-indigo-500/60" />
                                <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">Telemetry Feed</h2>
                            </div>
                            <div className="flex gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-emerald-500/40"></span>
                                <span className="w-1 h-1 rounded-full bg-emerald-500/20"></span>
                            </div>
                        </div>
                        <div className="bg-zinc-950/20 rounded-2xl border border-zinc-500/10 overflow-hidden p-4 flex-1 flex flex-col min-h-0">
                            <div className="space-y-5 max-h-[500px] overflow-y-auto custom-scrollbar flex-1 pr-1">
                                <AnimatePresence initial={false}>
                                    {log.length === 0 ? (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-[10px] text-zinc-700 italic flex items-center gap-2"
                                        >
                                            <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
                                            Awaiting transmission pulse...
                                        </motion.p>
                                    ) : (
                                        log.map((entry) => {
                                            const isAgent = entry.message.includes('🤖 Agent');
                                            const cleanMessage = entry.message.split(': ').slice(1).join(': ');
                                            return (
                                                <motion.div
                                                    key={entry.id}
                                                    initial={{ opacity: 0, x: -4 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <TypingLogEntry text={cleanMessage} isAgent={isAgent} />
                                                </motion.div>
                                            );
                                        })
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Bottom Section */}
            <div className={`p-6 border-t border-zinc-800/50 flex flex-col gap-6 ${isCollapsed ? 'items-center' : ''}`}>
                <div className={`flex items-center ${isCollapsed ? 'flex-col gap-4' : 'justify-between'}`}>
                    <a
                        href="https://github.com/mcp-b/webmcp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-600 hover:text-zinc-300 transition-all active:scale-90"
                        title="Source Code"
                    >
                        <Github size={isCollapsed ? 20 : 18} />
                    </a>
                    {!isCollapsed && (
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-mono text-zinc-700">SHL-256</span>
                            <span className="text-[8px] font-mono text-indigo-500/40 uppercase tracking-tighter">Secure Link</span>
                        </div>
                    )}
                </div>

                {/* Bottom Toggle Button */}
                <button
                    onClick={onToggle}
                    className={`w-full h-11 bg-zinc-950/20 border border-zinc-800/50 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-indigo-500/5 hover:border-indigo-500/30 transition-all shadow-sm group relative overflow-hidden active:scale-[0.98]`}
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors"></div>
                    {isCollapsed ? (
                        <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform relative z-10" />
                    ) : (
                        <div className="flex items-center gap-3 relative z-10">
                            <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Collapse</span>
                        </div>
                    )}
                </button>
            </div>
        </motion.aside>
    );
};
