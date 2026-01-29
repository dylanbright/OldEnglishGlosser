# Hwæt! Old English Glosser

An interactive, AI-powered philological tool designed for students and scholars of Old English. This application provides instant morphological analysis, definitions, and etymological data for ancient texts.

## 📜 Overview

The **Hwæt! Glosser** allows users to paste Old English text (e.g., *Beowulf*, *The Wanderer*) and receive a word-by-word gloss. It leverages the Google Gemini API to perform deep philological analysis and provides a specialized "Deep Check" feature that cross-references scholarly sources like the Bosworth-Toller dictionary and Wiktionary using Google Search grounding.

## ✨ Features

- **Instant Analysis**: Automatically segments text into tokens and provides grammar, lemma, and translation.
- **Deep Check (AI Grounded)**: Uses Google Search grounding to verify information against authoritative Old English resources.
- **Philological Keyboard**: A custom toolbar for inserting Old English characters (æ, þ, ð, ƿ) and macrons (ā, ē, ī, etc.).
- **Study List**: Flag difficult words to create a custom study list.
- **Anki Export**: Export your flagged words to a CSV formatted specifically for flashcard software.
- **Persistence**: Save your analysis as a JSON file and reload it later to pick up where you left off.
- **Responsive Design**: A parchment-themed, high-aesthetics UI that works across desktop and mobile.

## 🛠 Requirements

### 1. Gemini API Key
This application requires a Google Gemini API Key. 
- Obtain a key from [Google AI Studio](https://aistudio.google.com/).
- The application expects the key to be provided via the environment variable `process.env.API_KEY`.

### 2. Environment
- **Runtime**: Modern web browser with ES6 module support.
- **Dependencies**: 
  - `React 19`
  - `Tailwind CSS`
  - `Lucide React`
  - `@google/genai` (SDK for Gemini API)

## 🚀 Installation & Setup

Since this project uses modern ES modules and import maps, it can be served with any simple static file server.

1. **Clone the project** to your local root directory.
2. **Environment Configuration**: Ensure `process.env.API_KEY` is set in your build or execution environment.
3. **Run a local server**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (npx)
   npx serve .
   ```
4. **Access the app**: Open `http://localhost:8000` in your browser.

## 📖 Usage Guide

1. **Input Text**: Paste your Old English text into the main textarea. Use the character toolbar if you need to type specific characters.
2. **Gloss**: Click "Gloss Text" to begin the AI analysis. For long texts, the app will automatically chunk the request to ensure high-quality output.
3. **Explore**: Click on any word in the analyzed text to see its details in the right-hand panel.
4. **Deep Check**: If a word's definition seems unclear, click "Check Again with AI" in the panel. This will trigger a grounded search of Bosworth-Toller and Wiktionary.
5. **Study**: Use the flag icon to save words. Use the "Export CSV" button in the Study List to download your data for Anki.

## ⚖️ Technical Architecture

- **Model**: Primarily uses `gemini-3-flash-preview` for its balance of speed and complex reasoning.
- **Grounding**: Implements `googleSearch` tools for real-time verification of philological data.
- **Persistence**: Implements client-side JSON serialization for "Save/Load" functionality without a backend database.
- **Aesthetics**: Custom Tailwind theme with a "Parchment" color palette and "Crimson Pro" serif typography.

## 📜 Philological Sources
While the initial gloss is provided by AI training data, the **Deep Check** feature specifically targets:
- **Bosworth-Toller**: The definitive Anglo-Saxon Dictionary.
- **Wiktionary**: For modern community-driven etymological tracking.

---
*"Swa scribende gesceap hweorfað gleomen gumena geond grund fela..."*