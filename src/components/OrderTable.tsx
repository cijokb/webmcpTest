import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrders, type Order } from '../hooks/useOrders';
import {
    Package, MapPin, Mail, Calendar,
    ChevronRight, History, User, Terminal as TerminalIcon,
    CloudHail, FileCheck
} from 'lucide-react';

export const OrderTable = () => {
    const { filteredOrders } = useOrders();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'shipped': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            case 'delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'refunded': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'cancelled': return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
            default: return 'bg-zinc-500/10 text-zinc-500 border-transparent';
        }
    };

    const displayOrders = statusFilter === 'all'
        ? filteredOrders
        : filteredOrders.filter(o => o.status === statusFilter);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div>
                    <h3 className="text-xl font-bold text-[var(--foreground)] tracking-tight">Active Dispatch Queue</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">Real-time logistical synchronization across global nodes.</p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="px-4 py-2 glass-panel border border-[var(--glass-border)] rounded-xl text-[var(--muted-foreground)] text-xs font-bold uppercase tracking-wider outline-none cursor-pointer hover:border-indigo-500/30 transition-all"
                    >
                        <option value="all">All Channels</option>
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="refunded">Refunded</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="glass-panel rounded-2xl border border-[var(--glass-border)] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[var(--muted)]/50 border-b border-[var(--glass-border)]">
                            <th className="px-8 py-5 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.2em]">Identifier</th>
                            <th className="px-8 py-5 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.2em]">Consignee</th>
                            <th className="px-8 py-5 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.2em]">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.2em]">Trajectory</th>
                            <th className="px-8 py-5 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.2em]">Valuation</th>
                            <th className="px-8 py-5 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.2em] text-center">Protocol Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--glass-border)]">
                        {displayOrders.map((order) => (
                            <tr key={order.id} className="group hover:bg-indigo-500/5 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${selectedOrder?.id === order.id ? 'bg-indigo-500/20 border-indigo-500/30' : 'bg-[var(--glass-bg)] border-[var(--glass-border)] group-hover:border-indigo-500/20'}`}>
                                            <Package size={18} className={selectedOrder?.id === order.id ? 'text-indigo-400' : 'text-[var(--muted-foreground)]'} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-[var(--foreground)]">{order.id}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                                                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{order.events?.length || 0} Events</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-[var(--foreground)]">
                                            <Mail size={14} className="text-[var(--muted-foreground)]" />
                                            <span className="text-sm font-medium">{order.customerEmail}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                                            <Calendar size={14} />
                                            <span className="text-[10px]">{order.date}</span>
                                        </div>
                                        {order.eta && (
                                            <div className="flex items-center gap-2 text-indigo-400 mt-1">
                                                <Calendar size={12} />
                                                <span className="text-[9px] font-bold uppercase tracking-widest">ETA: {order.eta}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                        {order.weatherFlag && (
                                            <span className="px-2 py-1 flex items-center gap-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                                <CloudHail size={10} />
                                                Alert
                                            </span>
                                        )}
                                        {order.proofOfDelivery && order.proofOfDelivery !== 'pending' && (
                                            <span className={`px-2 py-1 flex items-center gap-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${order.proofOfDelivery === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                                <FileCheck size={10} />
                                                PoD {order.proofOfDelivery}
                                            </span>
                                        )}
                                    </div>
                                    {order.trackingNumber && (
                                        <div className="mt-2 flex flex-col gap-0.5">
                                            <p className="text-[9px] font-bold text-[var(--muted-foreground)] uppercase tracking-tighter">{order.carrier}:</p>
                                            <p className="text-[10px] font-mono text-[var(--foreground)]">{order.trackingNumber}</p>
                                        </div>
                                    )}
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-1">
                                        <MapPin size={14} />
                                        <span className="text-xs font-semibold text-[var(--foreground)]">{order.shippingAddress.city}</span>
                                    </div>
                                    <span className="text-[10px] text-[var(--muted-foreground)] line-clamp-1">{order.shippingAddress.street}</span>
                                </td>
                                <td className="px-8 py-6 text-sm font-mono font-bold text-[var(--foreground)]">
                                    ${Number(order.total || 0).toFixed(2)}
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center justify-center gap-3">
                                        <button
                                            className="p-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--muted-foreground)] hover:text-indigo-400 hover:border-indigo-500/30 transition-all active:scale-90"
                                            title="View Analysis"
                                            onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                                        >
                                            <History size={16} />
                                        </button>
                                        <Link
                                            to="/command-console"
                                            state={{ orderId: order.id }}
                                            className="p-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--muted-foreground)] hover:text-indigo-400 hover:border-indigo-500/30 transition-all active:scale-90"
                                            title="Administrative Override"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ChevronRight size={16} />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >

            {selectedOrder && (
                <div className="glass-panel p-8 rounded-2xl border border-indigo-500/20 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                <History size={24} className="text-indigo-400" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-[var(--foreground)]">Dispatch Intelligence: {selectedOrder.id}</h4>
                                <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-widest font-bold">Comprehensive Event Log</p>
                            </div>
                        </div>
                        <button onClick={() => setSelectedOrder(null)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-bold text-xs uppercase tracking-widest">Close Analysis</button>
                    </div>

                    <div className="space-y-4">
                        {(selectedOrder.events || []).map((event, i) => (
                            <div key={i} className="flex gap-4 group/item">
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-sm ${event.userType === 'agent' ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-[var(--glass-bg)] border-[var(--glass-border)]'}`}>
                                        {event.userType === 'agent' ? <TerminalIcon size={14} className="text-indigo-500" /> : <User size={14} className="text-[var(--muted-foreground)]" />}
                                    </div>
                                    {i < (selectedOrder.events || []).length - 1 && <div className="flex-1 w-px bg-[var(--glass-border)] my-1"></div>}
                                </div>
                                <div className="flex-1 pb-4">
                                    <div className="flex items-center justify-between gap-4 mb-1">
                                        <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${event.userType === 'agent' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-[var(--glass-bg)] text-[var(--muted-foreground)]'}`}>
                                            {event.userType === 'agent' ? 'Network Agent' : 'Human Operator'}
                                        </span>
                                        <span className="text-[10px] text-[var(--muted-foreground)] font-mono">{new Date(event.timestamp).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm font-medium text-[var(--foreground)] group-hover/item:text-indigo-400 transition-colors">{event.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div >
    );
};
