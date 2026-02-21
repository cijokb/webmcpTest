import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { toast } from 'sonner';

export interface Order {
    id: string;
    customerEmail: string;
    status: 'pending' | 'shipped' | 'delivered' | 'refunded' | 'cancelled';
    total: number;
    date: string;
    shippingAddress: {
        street: string;
        city: string;
        zip: string;
    };
    notes?: string[];
    discountApplied?: boolean;
    carrier?: string;
    trackingNumber?: string;
    events: {
        id: string;
        timestamp: string;
        type: 'status_change' | 'note' | 'tracking' | 'refund' | 'discount' | 'creation';
        message: string;
        userType: 'agent' | 'human';
    }[];
}

interface OrderContextType {
    orders: Order[];
    filteredOrders: Order[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchOrders: (email: string) => Order[];
    updateShippingAddress: (orderId: string, address: Order['shippingAddress'], isAgent?: boolean) => void;
    issueRefund: (orderId: string, reason: string, isAgent?: boolean) => void;
    addOrderNote: (orderId: string, note: string, isAgent?: boolean) => void;
    cancelOrder: (orderId: string, reason: string, isAgent?: boolean) => void;
    applyDiscount: (orderId: string, percentage: number, isAgent?: boolean) => void;
    createOrder: (order: Omit<Order, 'status' | 'date' | 'events'>, isAgent?: boolean) => void;
    updateOrderStatus: (orderId: string, status: Order['status'], isAgent?: boolean) => void;
    addTrackingInfo: (orderId: string, carrier: string, trackingNumber: string, isAgent?: boolean) => void;
    log: { id: string, message: string }[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const INITIAL_ORDERS: Order[] = [
    {
        id: 'ORD-001',
        customerEmail: 'john@example.com',
        status: 'pending',
        total: 125.50,
        date: '2024-03-15',
        shippingAddress: { street: '123 Main St', city: 'San Francisco', zip: '94105' },
        notes: ['Customer requested discreet packaging'],
        discountApplied: false,
        events: [
            { id: 'ev-1', timestamp: '2024-03-15T10:00:00Z', type: 'creation', message: 'Order created', userType: 'human' },
            { id: 'ev-2', timestamp: '2024-03-15T10:05:00Z', type: 'note', message: 'Added note: Customer requested discreet packaging', userType: 'human' }
        ]
    },
    {
        id: 'ORD-002',
        customerEmail: 'jane@example.com',
        status: 'shipped',
        total: 89.99,
        date: '2024-03-16',
        shippingAddress: { street: '456 Oak Ave', city: 'Seattle', zip: '98101' },
        notes: [],
        discountApplied: true,
        carrier: 'FedEx',
        trackingNumber: '7890123456',
        events: [
            { id: 'ev-3', timestamp: '2024-03-16T09:00:00Z', type: 'creation', message: 'Order created', userType: 'human' },
            { id: 'ev-4', timestamp: '2024-03-16T14:30:00Z', type: 'status_change', message: 'Status updated to shipped', userType: 'human' },
            { id: 'ev-5', timestamp: '2024-03-16T14:35:00Z', type: 'tracking', message: 'Added tracking: FedEx (7890123456)', userType: 'human' }
        ]
    },
    {
        id: 'ORD-003',
        customerEmail: 'john@example.com',
        status: 'delivered',
        total: 210.00,
        date: '2024-03-10',
        shippingAddress: { street: '123 Main St', city: 'San Francisco', zip: '94105' },
        notes: ['Left at front porch'],
        events: [
            { id: 'ev-6', timestamp: '2024-03-10T11:00:00Z', type: 'creation', message: 'Order created', userType: 'human' },
            { id: 'ev-7', timestamp: '2024-03-12T16:00:00Z', type: 'status_change', message: 'Status updated to delivered', userType: 'human' }
        ]
    },
    {
        id: 'ORD-004',
        customerEmail: 'sarah@example.com',
        status: 'cancelled',
        total: 45.00,
        date: '2024-03-18',
        shippingAddress: { street: '789 Pine Rd', city: 'Portland', zip: '97201' },
        notes: ['Customer changed mind'],
        events: [
            { id: 'ev-8', timestamp: '2024-03-18T10:00:00Z', type: 'creation', message: 'Order created', userType: 'human' },
            { id: 'ev-9', timestamp: '2024-03-18T15:00:00Z', type: 'status_change', message: 'Order cancelled. Reason: Customer changed mind', userType: 'human' }
        ]
    },
    {
        id: 'ORD-005',
        customerEmail: 'mike@example.com',
        status: 'cancelled',
        total: 12.50,
        date: '2024-03-19',
        shippingAddress: { street: '321 Elm St', city: 'Austin', zip: '78701' },
        notes: ['Duplicate order'],
        events: [
            { id: 'ev-10', timestamp: '2024-03-19T10:00:00Z', type: 'creation', message: 'Order created', userType: 'human' },
            { id: 'ev-11', timestamp: '2024-03-19T11:00:00Z', type: 'status_change', message: 'Order cancelled. Reason: Duplicate order', userType: 'human' }
        ]
    },
    {
        id: 'ORD-006',
        customerEmail: 'jane@example.com',
        status: 'pending',
        total: 342.10,
        date: '2024-03-20',
        shippingAddress: { street: '456 Oak Ave', city: 'Seattle', zip: '98101' },
        events: [
            { id: 'ev-12', timestamp: '2024-03-20T10:00:00Z', type: 'creation', message: 'Order created', userType: 'human' }
        ]
    }
];

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Mimic DB by loading from localStorage or using INITIAL_ORDERS
    const [orders, setOrders] = useState<Order[]>(() => {
        const saved = localStorage.getItem('apex_orders');
        return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    });

    const [searchQuery, setSearchQuery] = useState('');

    // Start with empty log on every session
    const [log, setLog] = useState<{ id: string, message: string }[]>([]);

    // Persistent storage effects
    React.useEffect(() => {
        localStorage.setItem('apex_orders', JSON.stringify(orders));
    }, [orders]);


    const addLog = useCallback((message: string, isAgent: boolean) => {
        if (!isAgent) return; // Only log agent actions in telemetry

        const timestamp = new Date().toLocaleTimeString();
        const entry = {
            id: Math.random().toString(36).substr(2, 9),
            message: `[${timestamp}] 🤖 Agent: ${message}`
        };
        setLog(prev => [entry, ...prev].slice(0, 15));

        toast.success(message, {
            description: "Action performed by AI Agent",
            duration: 5000,
        });
    }, []);

    React.useEffect(() => {
        const handleWebMCPLog = (e: any) => {
            // WebMCP extension emits webmcp:log for agent actions
            if (e.detail?.message) {
                addLog(e.detail.message, true);
            }
        };
        window.addEventListener('webmcp:log', handleWebMCPLog as EventListener);
        return () => window.removeEventListener('webmcp:log', handleWebMCPLog as EventListener);
    }, [addLog]);

    const filteredOrders = orders.filter(o =>
        o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const addOrderEvent = useCallback((orderId: string, event: Omit<Order['events'][0], 'id' | 'timestamp'>) => {
        const newEvent = {
            ...event,
            id: `ev-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString()
        };
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, events: [newEvent, ...(o.events || [])] } : o
        ));
    }, []);

    const createOrder = useCallback((orderData: Omit<Order, 'status' | 'date' | 'events'>, isAgent = false) => {
        const timestamp = new Date().toISOString();
        const newOrder: Order = {
            ...orderData,
            total: Number(orderData.total || 0),
            status: 'pending',
            date: timestamp.split('T')[0],
            notes: orderData.notes || [],
            discountApplied: orderData.discountApplied || false,
            events: [{
                id: `ev-${Math.random().toString(36).substr(2, 9)}`,
                timestamp,
                type: 'creation',
                message: 'Order created',
                userType: isAgent ? 'agent' : 'human'
            }]
        };
        setOrders(prev => [newOrder, ...prev]);
        addLog(`Created new order ${newOrder.id} for ${newOrder.customerEmail}`, isAgent);
    }, [addLog]);

    const updateOrderStatus = useCallback((orderId: string, status: Order['status'], isAgent = false) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, status } : o
        ));
        addOrderEvent(orderId, {
            type: 'status_change',
            message: `Status updated to ${status}`,
            userType: isAgent ? 'agent' : 'human'
        });
        addLog(`Updated ${orderId} status to ${status}`, isAgent);
    }, [addLog, addOrderEvent]);

    const addTrackingInfo = useCallback((orderId: string, carrier: string, trackingNumber: string, isAgent = false) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, carrier, trackingNumber } : o
        ));
        addOrderEvent(orderId, {
            type: 'tracking',
            message: `Added tracking: ${carrier} (${trackingNumber})`,
            userType: isAgent ? 'agent' : 'human'
        });
        addLog(`Added tracking to ${orderId}: ${carrier} ${trackingNumber}`, isAgent);
    }, [addLog, addOrderEvent]);

    const searchOrders = useCallback((email: string) => {
        return orders.filter(o => o.customerEmail.toLowerCase() === email.toLowerCase());
    }, [orders]);

    const updateShippingAddress = useCallback((orderId: string, address: Order['shippingAddress'], isAgent = false) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, shippingAddress: address } : o
        ));
        addOrderEvent(orderId, {
            type: 'status_change',
            message: `Updated shipping address to ${address.city}`,
            userType: isAgent ? 'agent' : 'human'
        });
        addLog(`Updated shipping address for ${orderId} to ${address.city}`, isAgent);
    }, [addLog, addOrderEvent]);

    const issueRefund = useCallback((orderId: string, reason: string, isAgent = false) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, status: 'refunded' as const } : o
        ));
        addOrderEvent(orderId, {
            type: 'refund',
            message: `Refunded order. Reason: ${reason}`,
            userType: isAgent ? 'agent' : 'human'
        });
        addLog(`Issued refund for ${orderId}. Reason: ${reason}`, isAgent);
    }, [addLog, addOrderEvent]);

    const addOrderNote = useCallback((orderId: string, note: string, isAgent = false) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, notes: [...(o.notes || []), note] } : o
        ));
        addOrderEvent(orderId, {
            type: 'note',
            message: `Added note: ${note}`,
            userType: isAgent ? 'agent' : 'human'
        });
        addLog(`Added internal note to ${orderId}`, isAgent);
    }, [addLog, addOrderEvent]);

    const cancelOrder = useCallback((orderId: string, reason: string, isAgent = false) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, status: 'cancelled' as const } : o
        ));
        addOrderEvent(orderId, {
            type: 'status_change',
            message: `Order cancelled. Reason: ${reason}`,
            userType: isAgent ? 'agent' : 'human'
        });
        addLog(`Cancelled order ${orderId}. Reason: ${reason}`, isAgent);
    }, [addLog, addOrderEvent]);

    const applyDiscount = useCallback((orderId: string, percentage: number, isAgent = false) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId ? {
                ...o,
                total: o.total * (1 - percentage / 100),
                discountApplied: true
            } : o
        ));
        addOrderEvent(orderId, {
            type: 'discount',
            message: `Applied ${percentage}% discount`,
            userType: isAgent ? 'agent' : 'human'
        });
        addLog(`Applied ${percentage}% discount to ${orderId}`, isAgent);
    }, [addLog, addOrderEvent]);

    return (
        <OrderContext.Provider value={{
            orders,
            filteredOrders,
            searchQuery,
            setSearchQuery,
            searchOrders,
            updateShippingAddress,
            issueRefund,
            addOrderNote,
            cancelOrder,
            applyDiscount,
            createOrder,
            updateOrderStatus,
            addTrackingInfo,
            log
        }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) throw new Error('useOrders must be used within an OrderProvider');
    return context;
};
