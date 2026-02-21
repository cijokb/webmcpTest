---
marp: true
title: WebMCP Documentation
description: W3C standard for making websites AI-accessible
theme: default
paginate: true
---

# WebMCP Documentation

W3C standard for making websites AI-accessible

---

## Welcome to WebMCP

> **Early Incubation**
>
> The WebMCP API is currently being incubated by the [W3C Web Machine Learning Community Group](https://www.w3.org/community/webmachinelearning/). The standard is still evolving, and not all features implemented by MCP-B may be included in the final WebMCP specification. APIs and patterns documented here are subject to change as the standard matures.

With WebMCP, your existing JavaScript functions become discoverable tools. Rather than relying on browser automation or remote APIs, agents get deterministic function calls that work reliably and securely.

---

## The Problem

AI assistants are great at conversation, but they can't reliably interact with your website. They can't click buttons, submit forms, or access your app's functionality in a structured, deterministic way.

---

## The Solution

**WebMCP** is a W3C web standard (currently being incubated by the [Web Machine Learning Community Group](https://www.w3.org/community/webmachinelearning/)) that lets websites expose structured tools to AI agents through the `navigator.modelContext` API. AI assistants can then help users by directly calling your website's functionality - all while respecting authentication and permissions.

---

## Design Philosophy

WebMCP is built on a **human-in-the-loop** philosophy:

- **The human web interface remains primary** – WebMCP doesn't replace your UI
- **AI agents augment, not replace** – Tools assist users, they don't work autonomously
- **Users maintain control** – Visibility and oversight over all agent actions
- **Collaborative workflows** – Humans and AI work together, not separately
- **Context engineering** – Like good web design guides users, good WebMCP guides AI by exposing the right tools at the right time

---

## Why WebMCP?

WebMCP is a better approach than browser automation, remote APIs, or computer use because it is standards-based, secure, and designed for collaboration.

---

## What WebMCP Is NOT

WebMCP is specifically designed for human-in-the-loop workflows. It is **not** intended for:

- **Headless browsing** – WebMCP requires an active browsing context with the user present
- **Fully autonomous agents** – Tools are designed to augment, not replace, human interaction
- **Backend service integration** – For server-to-agent communication without a UI, use the [Model Context Protocol](https://modelcontextprotocol.io)
- **UI replacement** – The human web interface remains the primary interaction method

---

## Key Terms

- **WebMCP**: W3C Web Model Context API standard for exposing website tools to AI agents
- **MCP-B**: Reference implementation that polyfills `navigator.modelContext` and bridges WebMCP with MCP
- **MCP-B Extension**: Browser extension for building, testing, and using WebMCP servers

---

## Who Is This For?

- **Website Developers**: Add AI copilot features to your React, Vue, or vanilla JS app
- **App Builders**: Let AI assistants interact with your web app's functionality
- **Extension Users**: Customize websites with AI-powered userscripts using the MCP-B Extension
- **AI Developers**: Build frontend AI agents that can use website tools

---

## Why Use WebMCP?

- **Standards-Based**: Implements the W3C Web Model Context API proposal
- **Zero Backend**: Runs entirely in the browser – no server changes needed
- **Respects Auth**: Tools inherit your user's session and permissions
- **Framework Agnostic**: Works with React, Vue, vanilla JS, or any framework
- **Developer Friendly**: Simple API with React hooks for easy integration
- **Type Safe**: Full TypeScript support with Zod validation

---

## When NOT to Use WebMCP

WebMCP is designed for specific use cases. Don’t use it when:

- You need headless automation – WebMCP requires an active browser with user present
- You want fully autonomous agents – WebMCP is for human-in-the-loop workflows
- You don’t control the website – Can’t add WebMCP to sites you don’t own (use the MCP-B Extension to add tools to any site)
- You need server-to-server communication – Use standard MCP for backend integrations
- The website has no JavaScript – WebMCP requires JavaScript execution

---
### Demo time
---