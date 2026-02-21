import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { toast } from 'sonner';
import {
    Package, MapPin, Truck,
    MessageSquare, ShieldAlert, ArrowRight,
    TrendingUp, Activity
} from 'lucide-react';

export const ManualEntryForm = () => {
    const {
        orders,
        updateOrderStatus,
        updateShippingAddress,
        addTrackingInfo,
        addOrderNote,
        issueRefund
    } = useOrders();

    const location = useLocation();
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [overrideType, setOverrideType] = useState<'status' | 'address' | 'tracking' | 'note' | 'refund'>('status');

    useEffect(() => {
        if (location.state?.orderId) {
            setSelectedOrderId(location.state.orderId);
        }
    }, [location.state]);

    // Status state
    const [newStatus, setNewStatus] = useState<'pending' | 'shipped' | 'delivered' | 'refunded' | 'cancelled'>('shipped');

    // Address state
    const [address, setAddress] = useState({ street: '', city: '', zip: '' });

    // Tracking state
    const [carrier, setCarrier] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');

    // Note state
    const [note, setNote] = useState('');

    // Refund state
    const [refundReason, setRefundReason] = useState('');

    const handleApplyOverride = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrderId) return;

        switch (overrideType) {
            case 'status':
                updateOrderStatus(selectedOrderId, newStatus, false);
                break;
            case 'address':
                updateShippingAddress(selectedOrderId, address, false);
                break;
            case 'tracking':
                addTrackingInfo(selectedOrderId, carrier, trackingNumber, false);
                break;
            case 'note':
                addOrderNote(selectedOrderId, note, false);
                break;
            case 'refund':
                issueRefund(selectedOrderId, refundReason, false);
                break;
        }

        // Reset form partially
        setNote('');
        setRefundReason('');
        toast.success(`Protocol ${overrideType.toUpperCase()} Overwrite Executed`, {
            description: `Order ${selectedOrderId} state has been modified.`,
        });
    };

    return (
        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group border border-[var(--glass-border)]">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                    <ShieldAlert size={24} className="text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-[var(--foreground)]">Administrative Priority Override</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">Direct system state modification for dispatch identifiers</p>
                </div>
            </div>

            <form onSubmit={handleApplyOverride} className="space-y-8" data-toolname="manual_override_form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Order Selection */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] pl-1">Target Dispatch Identifier</label>
                        <div className="relative">
                            <Package size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                            <select
                                value={selectedOrderId}
                                onChange={(e) => setSelectedOrderId(e.target.value)}
                                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-3.5 pl-12 pr-4 text-[var(--foreground)] focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
                                data-toolname="order_select"
                            >
                                <option value="">Select system ID...</option>
                                {orders.map(o => (
                                    <option key={o.id} value={o.id}>{o.id} ({o.customerEmail})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Override Type */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] pl-1">Operational Override Channel</label>
                        <div className="flex flex-wrap gap-1 p-1.5 bg-[var(--muted)]/50 rounded-xl border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] transition-all">
                            {[
                                { id: 'status', icon: Activity, label: 'State' },
                                { id: 'address', icon: MapPin, label: 'Trajectory' },
                                { id: 'tracking', icon: Truck, label: 'Sync' },
                                { id: 'note', icon: MessageSquare, label: 'Audit' },
                                { id: 'refund', icon: TrendingUp, label: 'Recall' }
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setOverrideType(type.id as any)}
                                    className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 py-3.5 px-3 rounded-lg transition-all ${overrideType === type.id ? 'bg-indigo-500 text-white shadow-md transform scale-[1.02]' : 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]'}`}
                                    title={type.label}
                                >
                                    <type.icon size={14} className={overrideType === type.id ? 'text-white' : 'text-indigo-400'} />
                                    <span className="text-[10px] font-black uppercase tracking-wider">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-[var(--glass-bg)] rounded-2xl border border-[var(--glass-border)] animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                    {overrideType === 'status' && (
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Modify Operational State</label>
                            <div className="flex flex-wrap gap-3">
                                {['pending', 'shipped', 'delivered', 'refunded', 'cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => setNewStatus(status as any)}
                                        className={`flex-1 min-w-[120px] py-3.5 px-4 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${newStatus === status ? 'bg-indigo-500/10 border-indigo-500 text-indigo-500 shadow-sm transform scale-[1.02]' : 'bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--muted-foreground)] hover:border-indigo-500/50 hover:text-[var(--foreground)]'}`}
                                        data-toolname={`status_btn_${status}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {overrideType === 'address' && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="col-span-1 sm:col-span-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 block mb-2">New Operational Trajectory</label>
                            </div>
                            <input
                                placeholder="Street Address"
                                className="bg-[var(--muted)]/50 border border-[var(--glass-border)] rounded-xl py-3 px-4 text-sm text-[var(--foreground)] focus:outline-none focus:border-indigo-500/50"
                                value={address.street}
                                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                data-toolname="address_street_input"
                            />
                            <input
                                placeholder="City"
                                className="bg-[var(--muted)]/50 border border-[var(--glass-border)] rounded-xl py-3 px-4 text-sm text-[var(--foreground)] focus:outline-none focus:border-indigo-500/50"
                                value={address.city}
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                data-toolname="address_city_input"
                            />
                            <input
                                placeholder="ZIP"
                                className="bg-[var(--muted)]/50 border border-[var(--glass-border)] rounded-xl py-3 px-4 text-sm text-[var(--foreground)] focus:outline-none focus:border-indigo-500/50"
                                value={address.zip}
                                onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                                data-toolname="address_zip_input"
                            />
                        </div>
                    )}

                    {overrideType === 'tracking' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="col-span-1 sm:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 block mb-2">Initialize Pulse Tracking</label>
                            </div>
                            <input
                                placeholder="Carrier (FedEx, UPS...)"
                                className="bg-[var(--muted)]/50 border border-[var(--glass-border)] rounded-xl py-3 px-4 text-sm text-[var(--foreground)] focus:outline-none focus:border-indigo-500/50"
                                value={carrier}
                                onChange={(e) => setCarrier(e.target.value)}
                                data-toolname="tracking_carrier_input"
                            />
                            <input
                                placeholder="Pulse Identifier (Tracking #)"
                                className="bg-[var(--muted)]/50 border border-[var(--glass-border)] rounded-xl py-3 px-4 text-sm text-[var(--foreground)] focus:outline-none focus:border-indigo-500/50"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                data-toolname="tracking_number_input"
                            />
                        </div>
                    )}

                    {overrideType === 'note' && (
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Audit Protocol Note</label>
                            <textarea
                                placeholder="Enter operational audit note..."
                                className="w-full bg-[var(--muted)]/50 border border-[var(--glass-border)] rounded-xl py-3 px-4 text-sm text-[var(--foreground)] focus:outline-none focus:border-indigo-500/50 min-h-[100px] resize-none"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                data-toolname="order_note_input"
                            />
                        </div>
                    )}

                    {overrideType === 'refund' && (
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-rose-400">Dispatch Recall Protocol (Refund)</label>
                            <textarea
                                placeholder="Enter recall verification reason..."
                                className="w-full bg-[var(--muted)]/50 border border-[var(--glass-border)] rounded-xl py-3 px-4 text-sm text-[var(--foreground)] focus:outline-none focus:border-rose-500/50 min-h-[100px] resize-none"
                                value={refundReason}
                                onChange={(e) => setRefundReason(e.target.value)}
                                data-toolname="refund_reason_input"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Priority Authorization Active</span>
                    </div>
                    <button
                        type="submit"
                        disabled={!selectedOrderId}
                        title={!selectedOrderId ? "Select a Target Dispatch ID to enable overwrite" : "Execute system override"}
                        className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300
                            ${selectedOrderId
                                ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 active:scale-95 cursor-pointer'
                                : 'bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed border border-[var(--glass-border)] opacity-60'}`}
                        data-toolname="apply_override_submit"
                    >
                        Execute Protocol Overwrite
                        <ArrowRight size={14} />
                    </button>
                </div>
            </form>
        </div>
    );
};
