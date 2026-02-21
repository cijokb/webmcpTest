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
        addTrackingInfo,
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

    return null;
};
