# SUNDARBAN-DARK-TRAILS


Sundarban Dark-Trails — Luxury Mangrove Safaris & Expeditions
Sundarban Dark-Trails is a fully responsive, enterprise-grade, single-page web application engineered for luxury eco-tourism, authorized mangrove boat safaris, tiger trail expeditions, and waterfront resort bookings in the UNESCO World Heritage Sundarban Delta.

It features an integrated TourMaker AI Agentic Naturalist (DeltaBot) with autonomous DOM actions, real-time pricing calculation, live modal reservations, voice synthesis/recognition (STT/TTS), and a multi-tab Agent Control Center.

🌟 Key Features
1. Immersive E-Commerce & Safari Catalog
10 Curated Tour Packages: Spanning 1-day river cruises, 2D/1N eco-escapes, 3D/2N deep-core tiger trails, private luxury houseboats, and romantic stilt water villas.

Category Filtering: Seamless tab-based filtering (All, Day Safaris, Overnight Escapes, Luxury & Specialist).

High-Fidelity Visuals: Optimized image cards featuring Royal Bengal Tigers, estuarine crocodiles, river dolphins, and mangrove canopy walks.

2. Autonomous Agentic AI Naturalist (TourMaker / DeltaBot)
Multi-Persona Intelligence: Switch between Captain Subhash (18-year delta veteran), Dr. Aranya Sen (senior wildlife biologist), Maya Roy (VIP luxury concierge), or a custom user-defined persona.

Autonomous DOM Actions: The AI can actively scroll, highlight, and spotlight webpage sections (packages, calculator, reviews, gallery, FAQs) and filter catalog grids live.

Interactive In-Chat Cards: Renders dynamic quote cards with live traveler modifier buttons (+ / - pax) and instant booking dispatch.

Chain-of-Thought Reasoning: Optional collapsible reasoning traces displaying multi-step agentic intent parsing and tool execution.

3. Advanced Voice Studio & Multilingual Support
Voice Synthesis (TTS): Browser-native speech synthesis with pitch, rate, and voice profile configuration.

Speech Recognition (STT): Voice-to-text microphone input supporting English (IN/US), Bengali (bn-IN), and Hindi (hi-IN).

4. Interactive Tools & Calculators
Live Cost Estimator: Real-time calculation factoring in traveler counts, Kolkata AC shared/private transfers, crab feasts, and telephoto lens permits.

Tidal & Lunar Radar: Computes moon phases (Spring/Neap tides), low-tide mudflat windows, and tiger sighting probabilities.

Safari Dossier Export: Compiles and downloads a structured .txt expedition itinerary briefing directly to the user's device.

WhatsApp Booking Integration: Autofills traveler reservation forms and redirects cleanly to WhatsApp desk chats.

🛠️ Technology Stack
Markup & Structure: Semantic HTML5 (<header>, <section>, <article>, <footer>, <dialog>)

Styling & Layout: Modern CSS3 featuring CSS Custom Properties (:root), CSS Grid, Flexbox, Glassmorphism, and responsive media queries.

Scripting: Vanilla JavaScript (ES6+), Web Storage API (localStorage & sessionStorage), Web Speech API (SpeechRecognition & SpeechSynthesis).

Typography & Icons: Google Fonts (Plus Jakarta Sans & Playfair Display), SVG Iconography.


⚙️ Agent Configuration Center (BYOK & Controls)
Click the ⚙️ Settings button inside the DeltaBot chat window to access the Control Center, where you can customize:

Persona & Tone: Choose between Capt. Subhash, Dr. Sen, Maya Roy, or write a Custom System Prompt.

AI Brain Architecture: Use the built-in offline engine or connect a custom Cloud Gateway (OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, or Groq Llama 3.3 via BYOK API key).

Memory Matrix: View and inject live session context (Travelers, Target Month, Dietary Preferences).

Tool Permissions: Toggle individual autonomous capabilities (tool_page_navigator, tool_catalog_filter, tool_live_quoter, tool_tide_weather_radar).

Voice Studio: Adjust speech rate, pitch, language, and auto-read toggles.
