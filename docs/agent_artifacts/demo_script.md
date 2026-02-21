# 🎬 Nexus Apex: AI Agent Integration Demo Script

This document provides a **sequential script** of prompts you can use to demo the newly added WebMCP tools to management. It follows a realistic "Day in the Life" scenario of a Logistics Manager dealing with routine tasks, exceptions, and reporting.

---

### **Preparation**
Ensure the local dev server is running, the browser extension is active, and you are on the main Dashboard (`/`).

---

## **Scene 1: Morning Briefing**
*Objective: Demonstrate UI control and basic navigation early in the morning.*

**Prompt 1:**
> "Good morning! It's a bit bright in the office today. Can you switch the dashboard to dark mode and then take me to the active dispatch queue?"

*(Agent should trigger `set_theme` to "dark" and `navigate_to_view` to "/")*

---

## **Scene 2: Handling Shipping Exceptions**
*Objective: Show off real-world data mutations (ETA, Weather Flags) and context awareness.*

**Prompt 2:**
> "There's a massive blizzard hitting Seattle right now. Please find any pending orders going to Seattle, flag them for a weather exception, and update their ETA to next Thursday."

*(Agent should find ORD-006, trigger `flag_weather_exceptions`, and `update_eta` to Thursday's date)*

---

## **Scene 3: Proof of Delivery & Bulk Actions**
*Objective: Prove the agent can handle multi-step verifications and bulk dataset updates.*

**Prompt 3:**
> "Let's review the delivered items. For ORD-003, I've checked the cameras and the package is secure. Please approve the Proof of Delivery. Once that's done, go ahead and bulk update all of our 'shipped' orders to 'delivered'."

*(Agent should trigger `verify_proof_of_delivery` for ORD-003, then `bulk_update_status`)*

---

## **Scene 4: Advanced Routing & Split Shipments**
*Objective: Highlight complex logistics logic like multi-warehouse fulfillment and simulated cost calculations.*

**Prompt 4:**
> "ORD-001 is too heavy to ship from a single location. Please split it into a new sub-order so we can fulfill it from two warehouses. Then, calculate the most optimal shipping route for the original order."

*(Agent should trigger `split_order_by_warehouse` creating 'ORD-001-B' or similar, then run `optimize_shipping_route` for ORD-001)*

---

## **Scene 5: Analytics & Friday Reporting**
*Objective: Showcase financial tracking, system alerts, and automated data aggregation.*

**Prompt 5:**
> "We need to prep the weekly revenue report. Record the Cost of Goods Sold for ORD-006 as $150 so we can see the profit margin. Finally, generate the dispatch order report and push a system alert letting the team know the weekly report is completed."

*(Agent should trigger `calculate_order_margin`, followed by `generate_order_report`, and finally `push_system_alert`)*

---

### **Fallback/Reset Command**
If things get messy during the demo, you can always say:
> "Reset the demo by purging the local cache."

*(Agent will trigger `purge_local_cache` and refresh the page)*
