# WebMCP Testing Prompts

This guide provide a series of prompts you can use to test the **WebMCP** implementation within the Nexus Apex dashboard. These prompts are designed to be used with an AI agent (such as one powered by the MCP-B extension) that has access to the registered WebMCP tools.

---

## 📦 Order Management Scenarios

Use these prompts to test the core customer support and order fulfillment tools.

| Scenario | Prompt | Tools Tested |
| :--- | :--- | :--- |
| **Search & History** | "Search for orders by `example@email.com` and show me the event history for the most recent one." | `search_orders`, `get_order_history` |
| **Refund & Note** | "I need to refund order `ORD-001` because it arrived damaged. Also, add an internal note: 'Customer reported damage on arrival, refund processed via WebMCP'." | `issue_refund`, `add_order_note` |
| **Address Update** | "The customer for order `ORD-002` moved. Update their shipping address to: 123 Maple St, Springfield, 62704." | `update_shipping_address` |
| **Full Workflow** | "Create a new order `ORD-100` for `newuser@test.com` with a total of $149.50 and shipping to 789 Pine Rd, Austin, 78701. Then, add a note 'Welcome package included'." | `create_order`, `add_order_note` |
| **Shipping & Tracking** | "Update the status of order `ORD-003` to 'shipped' and add tracking: carrier 'FedEx', tracking number 'IX-88220033'." | `update_order_status`, `add_tracking_info` |
| **Retention Tool** | "Apply a 20% discount to order `ORD-004` to compensate for a delay in shipping." | `apply_discount` |
| **Cancellation** | "Cancel order `ORD-005` because of a stock shortage and inform the user in a note." | `cancel_order`, `add_order_note` |

---

## 📊 Analytics & Charting Scenarios

Use these prompts to test the real-time chart manipulation and visualization tools (Highcharts).

| Scenario | Prompt | Tools Tested |
| :--- | :--- | :--- |
| **Live Pulse** | "Simulate a spike in traffic. Add a data point of `85` to the 'Primary Link' series." | `add_data_point` |
| **Visual Redesign** | "Transform the analytics chart: Change the type to 'area', set the title to 'Network Latency', and change the theme colors to `#7c3aed` and `#10b981`." | `update_chart_config` |
| **Thresholds** | "Add a red horizontal annotation line at value `90` labeled 'System Capacity Alert'." | `add_plot_line` |
| **Clean Up** | "Clear all annotations from the chart and hide the legend." | `clear_annotations`, `toggle_chart_legend` |
| **Dynamic Subtitle** | "Update the chart subtitle to 'Real-time monitoring active' and show the legend." | `update_chart_config`, `toggle_chart_legend` |

---

## 🧠 Complex/Mixed Workflows

These prompts test the agent's ability to reason across different toolsets.

1. **Analytical Decision**:
   > "Analyze the history of order `ORD-002`. If it hasn't been shipped yet, apply a 10% discount for the delay. If it has been shipped, add a data point of `1` to a new series called 'Delayed Shipments' in the analytics chart."

2. **Customer Reconciliation**:
   > "Find all orders for `customer@email.com`. For any order that is currently 'pending', update its status to 'shipped' and add a default tracking number 'PENDING-000'."

3. **Performance Visualization**:
   > "Get the total number of orders in the system. Then, update the chart title to show this number (e.g., 'Total Orders: [Count]') and add a data point to the 'Growth' series representing the current count."

---

## 🛠 How to Test

1. **Open the Dashboard**: Ensure you are on the Nexus Apex dashboard page.
2. **Launch your Agent**: Open your WebMCP-compatible agent (e.g., via the MCP-B extension).
3. **Paste Prompt**: Copy and paste any of the prompts above.
4. **Observe**: Watch as the agent calls the underlying React functions, updates the UI in real-time (Order Table, KPICards, Highcharts), and provides feedback.
