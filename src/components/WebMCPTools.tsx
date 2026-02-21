import { useWebMCP } from '@mcp-b/react-webmcp';
import { useOrders } from '../hooks/useOrders';
import { useChartConfig } from '../hooks/useChartConfig';
import { z } from 'zod';

export const WebMCPTools = () => {
    const {
        searchOrders,
        updateShippingAddress,
        issueRefund,
        addOrderNote,
        cancelOrder,
        applyDiscount,
        createOrder,
        updateOrderStatus,
        bulkUpdateStatus,
        addTrackingInfo,
        updateETA,
        flagWeatherException,
        reviewProofOfDelivery,
        splitOrder,
        calculateMargins,
        orders
    } = useOrders();
    const {
        updateConfig,
        addDataPoint,
        addPlotLine,
        clearPlotLines
    } = useChartConfig();

    // Registry for manual console testing
    const tools: Record<string, any> = {
        search_orders: searchOrders,
        update_shipping_address: updateShippingAddress,
        issue_refund: issueRefund,
        add_order_note: addOrderNote,
        cancel_order: cancelOrder,
        apply_discount: applyDiscount,
        create_order: createOrder,
        update_order_status: updateOrderStatus,
        add_tracking_info: addTrackingInfo,
        update_chart_config: updateConfig,
        add_data_point: addDataPoint,
        add_plot_line: addPlotLine,
        clear_annotations: clearPlotLines,
        toggle_chart_legend: (visible: boolean) => updateConfig({ showLegend: visible }),
        navigate_to_view: (path: string) => window.dispatchEvent(new CustomEvent('webmcp:navigate', { detail: { path } })),
        set_theme: (theme: string) => window.dispatchEvent(new CustomEvent('webmcp:set_theme', { detail: { theme } })),
        purge_local_cache: () => { localStorage.clear(); window.location.reload(); },
        push_system_alert: (title: string, desc: string) => window.dispatchEvent(new CustomEvent('webmcp:system_alert', { detail: { title, desc } })),
        bulk_update_status: bulkUpdateStatus,
        generate_order_report: () => 'Report Generation Triggered',
        optimize_shipping_route: (orderId: string) => { console.log(`Optimizing route for ${orderId}`); return { optimalCarrier: 'FedEx', estimatedCost: 12.50, guaranteedBy: '2 Days' }; },
        split_order_by_warehouse: splitOrder,
        flag_weather_exceptions: flagWeatherException,
        verify_proof_of_delivery: reviewProofOfDelivery,
        generate_customs_invoice: (orderId: string) => { return `COMMERCIAL INVOICE\n------------------\nOrder: ${orderId}\n` },
        update_eta: updateETA,
        calculate_order_margin: calculateMargins,
        get_carrier_performance: () => { return { 'FedEx': '98% On-Time', 'UPS': '95% On-Time' } }
    };

    if (typeof window !== 'undefined') {
        (window as any).webmcp = {
            callTool: async (name: string, args: any) => {
                const handler = tools[name];
                if (!handler) {
                    console.error(`Tool ${name} not found. Available tools:`, Object.keys(tools));
                    return;
                }
                // Call handler with isAgent = true to trigger telemetry
                try {
                    if (name === 'create_order') {
                        handler({ ...args, total: Number(args.total) }, true);
                    } else if (name === 'update_shipping_address') {
                        handler(args.orderId, args.address, true);
                    } else if (name === 'add_tracking_info') {
                        handler(args.orderId, args.carrier, args.trackingNumber, true);
                    } else if (name === 'apply_discount') {
                        handler(args.orderId, args.percentage, true);
                    } else if (name === 'search_orders') {
                        const results = handler(args.customerEmail);
                        console.table(results);
                        return results;
                    } else if (name === 'update_order_status') {
                        handler(args.orderId, args.status, true);
                    } else if (name === 'issue_refund') {
                        handler(args.orderId, args.reason, true);
                    } else if (name === 'add_order_note') {
                        handler(args.orderId, args.note, true);
                    } else if (name === 'cancel_order') {
                        handler(args.orderId, args.reason, true);
                    } else if (name === 'update_chart_config') {
                        handler(args);
                    } else if (name === 'add_data_point') {
                        handler(args.seriesName, args.value);
                    } else if (name === 'add_plot_line') {
                        handler(args.value, args.label, args.color);
                    } else if (name === 'clear_annotations') {
                        handler();
                    } else if (name === 'toggle_chart_legend') {
                        handler(args.visible);
                    } else if (name === 'navigate_to_view') {
                        handler(args.path);
                        window.dispatchEvent(new CustomEvent('webmcp:log', { detail: { message: `Navigated to ${args.path}` } }));
                    } else if (name === 'set_theme') {
                        handler(args.theme);
                        window.dispatchEvent(new CustomEvent('webmcp:log', { detail: { message: `Theme set to ${args.theme}` } }));
                    } else if (name === 'purge_local_cache') {
                        window.dispatchEvent(new CustomEvent('webmcp:log', { detail: { message: `Purged local cache and reloaded` } }));
                        handler();
                    } else if (name === 'push_system_alert') {
                        handler(args.title, args.description);
                        window.dispatchEvent(new CustomEvent('webmcp:log', { detail: { message: `Pushed system alert: ${args.title}` } }));
                    } else if (name === 'bulk_update_status') {
                        handler(args.currentStatus, args.newStatus, true);
                    } else if (name === 'generate_order_report') {
                        handler();
                        window.dispatchEvent(new CustomEvent('webmcp:log', { detail: { message: `Generated order report summary` } }));
                    } else if (name === 'optimize_shipping_route') {
                        const result = handler(args.orderId);
                        window.dispatchEvent(new CustomEvent('webmcp:log', { detail: { message: `Simulated optimized route for ${args.orderId}` } }));
                        return result;
                    } else if (name === 'split_order_by_warehouse') {
                        handler(args.originalOrderId, args.newOrderId, true);
                    } else if (name === 'flag_weather_exceptions') {
                        handler(args.orderId, args.isDelayed, true);
                    } else if (name === 'verify_proof_of_delivery') {
                        handler(args.orderId, args.reviewStatus, true);
                    } else if (name === 'generate_customs_invoice') {
                        const invoice = handler(args.orderId);
                        window.dispatchEvent(new CustomEvent('webmcp:log', { detail: { message: `Generated Customs Invoice for ${args.orderId}` } }));
                        return invoice;
                    } else if (name === 'update_eta') {
                        handler(args.orderId, args.eta, true);
                    } else if (name === 'calculate_order_margin') {
                        handler(args.orderId, args.cogs, true);
                    } else if (name === 'get_carrier_performance') {
                        const perf = handler();
                        window.dispatchEvent(new CustomEvent('webmcp:log', { detail: { message: `Accessed Carrier Performance Metrics` } }));
                        return perf;
                    } else {
                        console.warn(`Tool ${name} has no console mapping, calling with orderId/args.`);
                        handler(args.orderId, args, true);
                    }
                    console.log(`Tool ${name} executed successfully.`);
                } catch (err) {
                    console.error(`Error executing tool ${name}:`, err);
                }
            }
        };
    }

    // Tool 2: Update Shipping Address
    useWebMCP({
        name: 'update_shipping_address',
        description: 'Update the shipping address for a specific order.',
        inputSchema: {
            orderId: z.string().describe('The unique ID of the order (e.g., ORD-001)'),
            address: z.object({
                street: z.string(),
                city: z.string(),
                zip: z.string(),
            }).describe('The new shipping address'),
        },
        handler: async (input) => {
            // Manual address update via background tool is an agent action
            updateShippingAddress(
                input.orderId as string,
                input.address as any,
                true
            );
            return { success: true, message: `Address updated for ${input.orderId}` };
        },
    });

    // Tool 3: Issue Refund
    useWebMCP({
        name: 'issue_refund',
        description: 'Issue a refund for a specific order with a reason.',
        inputSchema: {
            orderId: z.string().describe('The unique ID of the order to refund'),
            reason: z.string().describe('The reason for issuing the refund'),
        },
        handler: async (input) => {
            issueRefund(input.orderId as string, input.reason as string, true);
            return { success: true, message: `Refund processed for ${input.orderId}` };
        },
    });

    // Tool 4: Add Order Note
    useWebMCP({
        name: 'add_order_note',
        description: 'Add an internal note to an order for other agents or humans to see.',
        inputSchema: {
            orderId: z.string().describe('The unique ID of the order'),
            note: z.string().describe('The text of the note to add'),
        },
        handler: async (input) => {
            addOrderNote(input.orderId as string, input.note as string, true);
            return { success: true, message: `Note added to ${input.orderId}` };
        },
    });

    // Tool 5: Cancel Order
    useWebMCP({
        name: 'cancel_order',
        description: 'Cancel an order that has not yet been delivered.',
        inputSchema: {
            orderId: z.string().describe('The unique ID of the order to cancel'),
            reason: z.string().describe('The reason for cancellation'),
        },
        handler: async (input) => {
            cancelOrder(input.orderId as string, input.reason as string, true);
            return { success: true, message: `Order ${input.orderId} cancelled` };
        },
    });

    // Tool 6: Apply Discount
    useWebMCP({
        name: 'apply_discount',
        description: 'Apply a percentage discount to an order total.',
        inputSchema: {
            orderId: z.string().describe('The unique ID of the order'),
            percentage: z.number().min(1).max(100).describe('The discount percentage (1-100)'),
        },
        handler: async (input) => {
            applyDiscount(input.orderId as string, input.percentage as number, true);
            return { success: true, message: `Applied ${input.percentage}% discount to ${input.orderId}` };
        },
    });

    // Tool 7: Create Order
    useWebMCP({
        name: 'create_order',
        description: 'Create a new customer order with shipping details.',
        inputSchema: {
            orderId: z.string().describe('The unique ID of the order (e.g., ORD-007)'),
            customerEmail: z.string().email().describe('The customer email address'),
            total: z.number().describe('The total order amount'),
            shippingAddress: z.object({
                street: z.string(),
                city: z.string(),
                zip: z.string(),
            }).describe('The shipping address'),
        },
        handler: async (input) => {
            createOrder({
                id: input.orderId as string,
                customerEmail: input.customerEmail as string,
                total: input.total as number,
                shippingAddress: input.shippingAddress as any
            }, true);
            return { success: true, message: `Created new order ${input.orderId}` };
        },
    });

    // Tool 8: Update Order Status
    useWebMCP({
        name: 'update_order_status',
        description: 'Update the status of an existing order (pending -> shipped -> delivered).',
        inputSchema: {
            orderId: z.string().describe('The unique ID of the order'),
            status: z.enum(['pending', 'shipped', 'delivered', 'refunded', 'cancelled']).describe('The new status'),
        },
        handler: async (input) => {
            updateOrderStatus(input.orderId as string, input.status as any, true);
            return { success: true, message: `Updated order ${input.orderId} status to ${input.status}` };
        },
    });

    // Tool 9: Add Tracking Info
    useWebMCP({
        name: 'add_tracking_info',
        description: 'Add carrier and tracking number to a shipped order.',
        inputSchema: {
            orderId: z.string().describe('The unique ID of the order'),
            carrier: z.string().describe('The shipping carrier (e.g., FedEx, UPS)'),
            trackingNumber: z.string().describe('The tracking identifier'),
        },
        handler: async (input) => {
            addTrackingInfo(input.orderId as string, input.carrier as string, input.trackingNumber as string, true);
            return { success: true, message: `Added tracking to ${input.orderId}` };
        },
    });

    // Tool 10: Get Order History
    useWebMCP({
        name: 'get_order_history',
        description: 'Retrieve the event timeline and history for a specific order.',
        inputSchema: {
            orderId: z.string().describe('The unique ID of the order'),
        },
        handler: async (input) => {
            const order = orders.find(o => o.id === input.orderId);
            if (!order) return { success: false, message: `Order ${input.orderId} not found` };

            // Format events as a markdown table for the agent
            const tableHeader = '| Timestamp | Type | Message | Actor |\n| :--- | :--- | :--- | :--- |\n';
            const tableRows = (order.events || []).map(ev =>
                `| ${new Date(ev.timestamp).toLocaleString()} | ${ev.type.toUpperCase()} | ${ev.message} | ${ev.userType.toUpperCase()} |`
            ).join('\n');

            const historyTable = tableHeader + tableRows;

            return {
                success: true,
                orderId: order.id,
                currentStatus: order.status,
                tracking: order.trackingNumber ? `${order.carrier}: ${order.trackingNumber}` : 'No tracking',
                history_table: historyTable,
                raw_events: order.events // Still provide raw data for flexibility
            };
        },
    });

    // Tool 11: Update Chart Configuration
    useWebMCP({
        name: 'update_chart_config',
        description: 'Update the configuration and styling of the analytics chart.',
        inputSchema: {
            title: z.string().optional().describe('The primary title of the chart'),
            subtitle: z.string().optional().describe('The chart subtitle'),
            type: z.enum(['line', 'column', 'bar', 'pie', 'area', 'spline']).optional().describe('The visualization type'),
            colors: z.array(z.string()).optional().describe('Array of hex colors for the theme'),
            showLegend: z.boolean().optional().describe('Whether to show the legend'),
            xAxisCategories: z.array(z.string()).optional().describe('Categories for the X axis'),
            yAxisTitle: z.string().optional().describe('Label for the Y axis'),
            series: z.array(z.object({
                name: z.string(),
                data: z.array(z.number()),
                type: z.enum(['line', 'column', 'bar', 'pie', 'area', 'spline']).optional(),
                color: z.string().optional(),
            })).optional().describe('Data series to display'),
        },
        handler: async (input) => {
            updateConfig(input);
            return {
                success: true,
                message: `Chart configuration updated: ${input.title || 'modified'}`
            };
        },
    });

    // Tool 12: Add Data Point (Pulsing)
    useWebMCP({
        name: 'add_data_point',
        description: 'Append a single data point to a specific series to simulate real-time pulsing.',
        inputSchema: {
            seriesName: z.string().describe('The name of the series to update (e.g., "Primary Link")'),
            value: z.number().describe('The numerical value to add'),
        },
        handler: async (input) => {
            addDataPoint(input.seriesName as string, input.value as number);
            return { success: true, message: `Added point ${input.value} to ${input.seriesName}` };
        },
    });

    // Tool 13: Add Plot Line (Annotation)
    useWebMCP({
        name: 'add_plot_line',
        description: 'Add a horizontal annotation line (threshold) to the Y-axis.',
        inputSchema: {
            value: z.number().describe('The Y-axis value for the line'),
            label: z.string().describe('Text label for the line (e.g., "Saturation")'),
            color: z.string().describe('Hex color for the line (e.g., "#ff0000")'),
        },
        handler: async (input) => {
            addPlotLine(input.value as number, input.label as string, input.color as string);
            return { success: true, message: `Added plot line "${input.label}" at ${input.value}` };
        },
    });

    // Tool 14: Clear Annotations
    useWebMCP({
        name: 'clear_annotations',
        description: 'Remove all plot lines and annotations from the chart.',
        inputSchema: {},
        handler: async () => {
            clearPlotLines();
            return { success: true, message: 'All annotations cleared' };
        },
    });

    // Tool 15: Toggle Chart Legend
    useWebMCP({
        name: 'toggle_chart_legend',
        description: 'Show or hide the chart legend.',
        inputSchema: {
            visible: z.boolean().describe('Whether the legend should be visible'),
        },
        handler: async (input) => {
            updateConfig({ showLegend: input.visible as boolean });
            return { success: true, message: `Legend visibility set to ${input.visible}` };
        },
    });

    // Tool 16: App Navigation
    useWebMCP({
        name: 'navigate_to_view',
        description: 'Navigate the user to a different view within the application.',
        inputSchema: {
            path: z.enum(['/', '/create-order', '/command-console', '/analytics']).describe('The path to navigate to'),
        },
        handler: async (input) => {
            window.dispatchEvent(new CustomEvent('webmcp:navigate', { detail: { path: input.path } }));
            window.dispatchEvent(new CustomEvent('webmcp:log', { detail: { message: `Navigated to ${input.path}` } }));
            return { success: true, message: `Navigated to ${input.path}` };
        },
    });

    // Tool 17: Set Theme
    useWebMCP({
        name: 'set_theme',
        description: 'Change the application theme to light or dark mode.',
        inputSchema: {
            theme: z.enum(['light', 'dark']).describe('The desired theme'),
        },
        handler: async (input) => {
            window.dispatchEvent(new CustomEvent('webmcp:set_theme', { detail: { theme: input.theme } }));
            window.dispatchEvent(new CustomEvent('webmcp:log', { detail: { message: `Theme set to ${input.theme}` } }));
            return { success: true, message: `Theme set to ${input.theme}` };
        },
    });

    // Tool 18: Purge Cache
    useWebMCP({
        name: 'purge_local_cache',
        description: 'Clear the local storage and reset the application state.',
        inputSchema: {},
        handler: async () => {
            window.dispatchEvent(new CustomEvent('webmcp:log', { detail: { message: `Purged local cache and scheduled reload` } }));
            // Note: We use setTimeout to allow the handler to return before the page reloads
            setTimeout(() => {
                localStorage.clear();
                window.location.reload();
            }, 1000);
            return { success: true, message: 'Local cache purged. Page will reload.' };
        },
    });

    // Tool 19: System Alert
    useWebMCP({
        name: 'push_system_alert',
        description: 'Push a notification/alert to the UI system bell for the user to see.',
        inputSchema: {
            title: z.string().describe('The title of the alert'),
            description: z.string().describe('The detailed description of the alert'),
        },
        handler: async (input) => {
            window.dispatchEvent(new CustomEvent('webmcp:system_alert', { detail: { title: input.title, desc: input.description } }));
            window.dispatchEvent(new CustomEvent('webmcp:log', { detail: { message: `Pushed system alert: ${input.title}` } }));
            return { success: true, message: `Alert pushed: ${input.title}` };
        },
    });

    // Tool 20: Bulk Update Status
    useWebMCP({
        name: 'bulk_update_status',
        description: 'Update the status of all orders currently in one state to a new state.',
        inputSchema: {
            currentStatus: z.enum(['pending', 'shipped']).describe('The status of orders to target'),
            newStatus: z.enum(['shipped', 'delivered']).describe('The new status to apply'),
        },
        handler: async (input) => {
            bulkUpdateStatus(input.currentStatus as any, input.newStatus as any, true);
            return { success: true, message: `Bulk updated all ${input.currentStatus} to ${input.newStatus}` };
        },
    });

    // Tool 21: Generate Report
    useWebMCP({
        name: 'generate_order_report',
        description: 'Generate a summary text report of the current active orders.',
        inputSchema: {},
        handler: async () => {
            const pending = orders.filter(o => o.status === 'pending').length;
            const shipped = orders.filter(o => o.status === 'shipped').length;
            const delivered = orders.filter(o => o.status === 'delivered').length;
            const value = orders.reduce((sum, o) => sum + o.total, 0).toFixed(2);

            const report = `### Dispatch Report\n- **Pending**: ${pending}\n- **In Transit**: ${shipped}\n- **Delivered**: ${delivered}\n- **Total Payload Value**: $${value}\n`;

            // Try to write to clipboard, fallback to console if not possible in this context
            try {
                if (navigator.clipboard) {
                    await navigator.clipboard.writeText(report);
                    window.dispatchEvent(new CustomEvent('webmcp:system_alert', { detail: { title: 'Report Generated', desc: 'Summary metrics copied to clipboard.' } }));
                }
            } catch (e) {
                console.log("Report generated:", report);
            }

            window.dispatchEvent(new CustomEvent('webmcp:log', { detail: { message: `Generated order report summary` } }));

            return { success: true, report: report, message: 'Report generated successfully.' };
        },
    });

    // Tool 22: Optimize Shipping Route
    useWebMCP({
        name: 'optimize_shipping_route',
        description: 'Simulate querying multiple carriers to find the best rate and transit time for an order.',
        inputSchema: {
            orderId: z.string().describe('The ID of the order to optimize'),
        },
        handler: async (input) => {
            // Simulated carrier fetch
            const carriers = [
                { carrier: 'FedEx Ground', cost: 12.50, transitDays: 3 },
                { carrier: 'UPS 2nd Day Air', cost: 24.00, transitDays: 2 },
                { carrier: 'USPS Priority', cost: 9.80, transitDays: 4 }
            ];
            const optimal = carriers.reduce((prev, curr) => prev.cost < curr.cost ? prev : curr);

            window.dispatchEvent(new CustomEvent('webmcp:log', { detail: { message: `Optimized routing for ${input.orderId}: selected ${optimal.carrier}` } }));
            return { success: true, optimalRoute: optimal, evaluatedOptions: carriers };
        },
    });

    // Tool 23: Split Order
    useWebMCP({
        name: 'split_order_by_warehouse',
        description: 'Split an existing order into a new one to fulfill from multiple warehouses.',
        inputSchema: {
            originalOrderId: z.string().describe('The ID of the order being split'),
            newOrderId: z.string().describe('The ID for the spawned order (e.g., ORD-001-B)'),
        },
        handler: async (input) => {
            splitOrder(input.originalOrderId as string, input.newOrderId as string, true);
            return { success: true, message: `Split ${input.originalOrderId} into ${input.newOrderId}` };
        },
    });

    // Tool 24: Flag Weather Exceptions
    useWebMCP({
        name: 'flag_weather_exceptions',
        description: 'Toggle the severe weather delay flag on an order.',
        inputSchema: {
            orderId: z.string().describe('The ID of the order'),
            isDelayed: z.boolean().describe('True to flag for weather delay, false to clear'),
        },
        handler: async (input) => {
            flagWeatherException(input.orderId as string, input.isDelayed as boolean, true);
            return { success: true, message: `Updated weather flag for ${input.orderId}` };
        },
    });

    // Tool 25: Verify Proof of Delivery
    useWebMCP({
        name: 'verify_proof_of_delivery',
        description: 'Review and approve or reject a pending Proof of Delivery.',
        inputSchema: {
            orderId: z.string().describe('The ID of the order'),
            reviewStatus: z.enum(['approved', 'rejected']).describe('The review decision'),
        },
        handler: async (input) => {
            reviewProofOfDelivery(input.orderId as string, input.reviewStatus as any, true);
            return { success: true, message: `Proof of Delivery marked as ${input.reviewStatus}` };
        },
    });

    // Tool 26: Generate Customs Invoice
    useWebMCP({
        name: 'generate_customs_invoice',
        description: 'Generate commercial invoice text for international shipping.',
        inputSchema: {
            orderId: z.string().describe('The ID of the order'),
        },
        handler: async (input) => {
            const order = orders.find(o => o.id === input.orderId);
            if (!order) return { success: false, message: 'Order not found' };

            const invoice = `### COMMERCIAL INVOICE\n\n**Order:** ${order.id}\n**Date:** ${new Date().toLocaleDateString()}\n**Destination:** ${order.shippingAddress.city}, ${order.shippingAddress.zip}\n\n**Total Declared Value:** $${order.total.toFixed(2)}\n**Status:** ${order.status.toUpperCase()}`;

            window.dispatchEvent(new CustomEvent('webmcp:log', { detail: { message: `Generated Customs Invoice for ${input.orderId}` } }));
            return { success: true, invoice, message: 'Invoice generated' };
        },
    });

    // Tool 27: Update ETA
    useWebMCP({
        name: 'update_eta',
        description: 'Update the estimated delivery date of an order.',
        inputSchema: {
            orderId: z.string().describe('The ID of the order'),
            eta: z.string().describe('The new estimated delivery date (YYYY-MM-DD)'),
        },
        handler: async (input) => {
            updateETA(input.orderId as string, input.eta as string, true);
            return { success: true, message: `Updated ETA for ${input.orderId} to ${input.eta}` };
        },
    });

    // Tool 28: Calculate Margin
    useWebMCP({
        name: 'calculate_order_margin',
        description: 'Record Cost of Goods Sold (COGS) to calculate order profit margin.',
        inputSchema: {
            orderId: z.string().describe('The ID of the order'),
            cogs: z.number().describe('The cost amount to record'),
        },
        handler: async (input) => {
            calculateMargins(input.orderId as string, input.cogs as number, true);
            return { success: true, message: `Recorded $${input.cogs} COGS for ${input.orderId}` };
        },
    });

    // Tool 29: Carrier Performance
    useWebMCP({
        name: 'get_carrier_performance',
        description: 'Retrieve simulated performance scoring for carriers.',
        inputSchema: {},
        handler: async () => {
            const report = `### Carrier Performance\n\n- **FedEx**: 98.4% On-time\n- **UPS**: 95.1% On-time\n- **USPS**: 89.9% On-time\n\n_Note: UPS experiencing delays in Midwest region._`;
            window.dispatchEvent(new CustomEvent('webmcp:log', { detail: { message: `Accessed Carrier Performance Report` } }));
            return { success: true, report, message: 'Carrier report retrieved' };
        },
    });

    return null;
};
