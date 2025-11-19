# Colton_OS

**Colton_OS** is a bespoke, Retrieval-Augmented Generation (RAG) knowledge management system designed to serve as the centralized "second brain" for Colton Batts. 

It functions as a digital archivist, allowing natural language interaction with a structured Markdown knowledge base containing biographical data, brand guidelines, and technical skill sets.

![Project Status](https://img.shields.io/badge/status-active-black?style=flat-square)
![Version](https://img.shields.io/badge/version-3.1-black?style=flat-square)

## ⚡️ Core Architecture

Colton_OS is built on the premise of **"Zero-Hallucination, High-Context"** interaction. Unlike standard LLM interfaces, this application is grounded in a strict local dataset.

### Key Features

*   **Context-Aware Operations:** The "Operations" chat interface is pre-loaded with the entire knowledge base, allowing the AI to answer specifically as Colton or about Colton with high accuracy.
*   **Markdown Knowledge Base:** A fully functional file system (Creation, Reading, Updating, Deleting) that stores data in `localStorage`.
*   **Gemini 2.5 Integration:** Utilizes Google's latest Gemini 2.5-Flash model for high-speed, low-latency inference.
*   **Persistence Layer:** All edits to the knowledge base are persisted locally, surviving page refreshes.
*   **Monochrome UI:** A strict "Lab/Terminal" aesthetic utilizing `JetBrains Mono` and high-contrast layouts for focus.

## 🛠 Tech Stack

*   **Frontend:** React 18 (TypeScript)
*   **Styling:** Tailwind CSS + Tailwind Typography
*   **AI Model:** Google Gemini 2.5 Flash (via `@google/genai` SDK)
*   **Icons:** Lucide React
*   **Rendering:** React Markdown

## 🚀 Quick Start

### Prerequisites
*   Node.js installed
*   A Google Gemini API Key (Get one at [aistudio.google.com](https://aistudio.google.com))

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/colton-os.git
    cd colton-os
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    # .env
    API_KEY=your_gemini_api_key_here
    ```
    *Note: This project uses Parcel. If using a different bundler (like Vite), prefix with `VITE_`.*

4.  **Run the System**
    ```bash
    npm start
    ```

## 📂 File Structure

The application treats the browser's LocalStorage as a file system.

*   `/Bio/` - Biographical data and resumes.
*   `/Brand/` - Voice guidelines, positioning, and copy samples.
*   `/Projects/` - Case studies and active work.

## 🎨 Design Philosophy

The interface eschews modern "SaaS" trends (gradients, soft shadows, blur effects) in favor of a utilitarian, "Data Terminal" aesthetic.

*   **Font:** Inter (Reading) & JetBrains Mono (Data/Code)
*   **Palette:** Strict #000000 (Black) and #FFFFFF (White) with gray delimiters.
*   **Interaction:** Instant feedback, no animations unless necessary for status.

---

© 2024 Colton Batts. All Rights Reserved.
