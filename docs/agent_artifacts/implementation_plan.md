# Expanding WebMCP Capabilities & UI Parity

We will ensure that every action an AI agent can perform via WebMCP tools is also manually accessible to the user via the dashboard UI.

## Proposed Changes

- (Implemented) Search, Update Address, Refund, Notes, Cancel, Discount.
- **New Tool**: `create_order` (Customer info, items, total).

### [UI Components]

- Add `searchQuery` state and `setSearchQuery` to the context to enable global filtering.
- Add `createOrder` method to handle new order logic and state updates.

#### [MODIFY] [App.tsx](file:///Users/cijokb/personal/webmcpdemo/src/App.tsx)
- Connect the header search bar to the `searchQuery` context.
- Ensure the "Search" input is properly tagged for agentic discovery (parity with `search_orders` tool).

#### [MODIFY] [OrderTable.tsx](file:///Users/cijokb/personal/webmcpdemo/src/components/OrderTable.tsx)
- Implement a **Row Action Menu** for each order.
- Add manual triggers for:
    - **Add Note**: Small inline input or popup.
    - **Apply Discount**: Quick toggle or percentage selector.
    - **Issue Refund**: Action button (already tracked in stats).
    - **Cancel Order**: Action button.
- Ensure these interactive elements are declarative and agent-discoverable using `data-toolname` attributes.

#### [MODIFY] [ManualEntryForm.tsx](file:///Users/cijokb/personal/webmcpdemo/src/components/ManualEntryForm.tsx)
- (Verified) Already handles `update_shipping_address` with clear tool semantics.

#### [NEW] [CreateOrderForm.tsx](file:///Users/cijokb/personal/webmcpdemo/src/components/CreateOrderForm.tsx)
- Implement a comprehensive form to create new orders.
- Fields: Customer Email, Order ID (auto-generated or manual), Total Amount, Shipping Address.
- Tag with `data-toolname="create_order_form"` and field-level attributes for agent parity.

## Verification Plan

### Manual Verification
- **Functional Search**: Type an email in the header search bar and confirm the table filters.
- **Action Parity**: 
    - Manually cancel an order and verify the stat card and table update.
    - Manually apply a discount and verify the badge appears.
    - Add a note manually and verify the note indicator updates.
    - **Create Order**: Fill out the new form and verify the order appears in the table with correct details and stats update.
- **Agent Verification**: Ask the agent to perform these actions (including creating an order) and confirm the UI reflects the changes identically to manual input.
