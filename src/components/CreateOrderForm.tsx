import React, { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { Mail, Hash, DollarSign, MapPin, Send, Plus } from 'lucide-react';

export const CreateOrderForm = () => {
    const { createOrder } = useOrders();
    const [formData, setFormData] = useState({
        id: `ORD-00${Math.floor(Math.random() * 900) + 100}`,
        customerEmail: '',
        total: '',
        street: '',
        city: '',
        zip: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        createOrder({
            id: formData.id,
            customerEmail: formData.customerEmail,
            total: parseFloat(formData.total),
            shippingAddress: {
                street: formData.street,
                city: formData.city,
                zip: formData.zip
            }
        }, false);

        setFormData({
            id: `ORD-00${Math.floor(Math.random() * 900) + 100}`,
            customerEmail: '',
            total: '',
            street: '',
            city: '',
            zip: ''
        });
    };

    return (
        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group border border-[var(--glass-border)]">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors"></div>

            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <Plus size={24} className="text-emerald-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-[var(--foreground)]">New Dispatch Log</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">Identify and initialize a new logistical payload</p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
                data-toolname="create_order_form"
                data-tooldescription="Form to manually create a new customer order with shipping details"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-widest pl-1">Network Identifier</label>
                        <div className="relative group/input">
                            <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] group-focus-within/input:text-indigo-400 transition-colors" />
                            <input
                                required
                                type="text"
                                value={formData.id}
                                onChange={e => setFormData(prev => ({ ...prev, id: e.target.value }))}
                                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-3.5 pl-12 pr-4 text-[var(--foreground)] focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-[var(--muted-foreground)]/50"
                                placeholder="ORD-XXX"
                                data-toolname="order_id_input"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-widest pl-1">Consignee Channel (Email)</label>
                        <div className="relative group/input">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] group-focus-within/input:text-indigo-400 transition-colors" />
                            <input
                                required
                                type="email"
                                value={formData.customerEmail}
                                onChange={e => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-3.5 pl-12 pr-4 text-[var(--foreground)] focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-[var(--muted-foreground)]/50"
                                placeholder="name@example.com"
                                data-toolname="customer_email_input"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-widest pl-1">Valuation ($)</label>
                        <div className="relative group/input">
                            <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] group-focus-within/input:text-indigo-400 transition-colors" />
                            <input
                                required
                                type="number"
                                step="0.01"
                                value={formData.total}
                                onChange={e => setFormData(prev => ({ ...prev, total: e.target.value }))}
                                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-3.5 pl-12 pr-4 text-[var(--foreground)] focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-[var(--muted-foreground)]/50"
                                placeholder="0.00"
                                data-toolname="total_amount_input"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-widest pl-1">Trajectory Start (Street)</label>
                        <div className="relative group/input">
                            <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] group-focus-within/input:text-indigo-400 transition-colors" />
                            <input
                                required
                                type="text"
                                value={formData.street}
                                onChange={e => setFormData(prev => ({ ...prev, street: e.target.value }))}
                                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-3.5 pl-12 pr-4 text-[var(--foreground)] focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-[var(--muted-foreground)]/50"
                                placeholder="123 Main St"
                                data-toolname="street_input"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-widest pl-1">Node Location (City)</label>
                        <input
                            required
                            type="text"
                            value={formData.city}
                            onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-3.5 px-4 text-[var(--foreground)] focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-[var(--muted-foreground)]/50"
                            placeholder="San Francisco"
                            data-toolname="city_input"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-widest pl-1">Routing Code (ZIP)</label>
                        <input
                            required
                            type="text"
                            value={formData.zip}
                            onChange={e => setFormData(prev => ({ ...prev, zip: e.target.value }))}
                            className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-3.5 px-4 text-[var(--foreground)] focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-[var(--muted-foreground)]/50"
                            placeholder="94105"
                            data-toolname="zip_input"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                    data-toolname="submit_new_order"
                >
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Commit to Network
                </button>
            </form>
        </div>
    );
};
