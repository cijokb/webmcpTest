/* eslint-disable @typescript-eslint/no-explicit-any */
if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    const nav = navigator as any;

    if (nav.modelcontext && !nav.modelContext) {
        nav.modelContext = nav.modelcontext;
    }

    if (nav.modelContext) {
        // Fallback for listTools if missing
        if (typeof nav.modelContext.listTools !== 'function') {
            nav.modelContext.listTools = () => Promise.resolve([]);
        }

        // Intercept registerTool to swallow Duplicate Tool Name errors caused by React StrictMode
        const originalRegisterTool = nav.modelContext.registerTool;
        if (typeof originalRegisterTool === 'function' && !nav.modelContext.__hasDuplicateInterceptor) {
            nav.modelContext.registerTool = function (toolParams: any) {
                try {
                    return originalRegisterTool.call(this, toolParams);
                } catch (err: any) {
                    if (err && err.message && err.message.includes('Duplicate tool name')) {
                        console.warn(`[WebMCP Polyfill] Suppressed Duplicate tool name error for: ${toolParams.name} (likely React StrictMode double-render).`);
                        return { unregister: () => { } }; // Return dummy unregister function
                    }
                    throw err;
                }
            };
            nav.modelContext.__hasDuplicateInterceptor = true;
        }
    }
}
