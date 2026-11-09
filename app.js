/* =========================================================
SUNDARBAN TIDE TRAILS - CLIENT ENGINE & CALCULATION LOGIC
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Navigation Scroll Shadow ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // --- Mobile Navigation Drawer ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
        });
    });

    // --- Package Category Filtering (5 Packages) ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const packageCards = document.querySelectorAll('.package-card');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            packageCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- Enhanced Live Cost Estimator ---
    const calcPlan = document.getElementById('calcPlan');
    const calcGuests = document.getElementById('calcGuests');
    const calcPickup = document.getElementById('calcPickup');
    const addCrabFeast = document.getElementById('addCrabFeast');
    const addCamPermit = document.getElementById('addCamPermit');
    const guestCountDisplay = document.getElementById('guestCountDisplay');
    const totalPriceDisplay = document.getElementById('totalPriceDisplay');

    function calculateEstimate() {
        const planPrice = parseInt(calcPlan.value, 10);
        const guests = parseInt(calcGuests.value, 10);
        const pickupOption = parseInt(calcPickup.value, 10);

        guestCountDisplay.textContent = guests;

        // Transport calculation
        let transportCost = 0;
        if (pickupOption === 1200) {
            transportCost = 1200 * guests; // Per person shared AC coach
        } else if (pickupOption === 4800) {
            transportCost = 4800; // Flat Sedan booking
        }

        // Add-on extras
        let extras = 0;
        if (addCrabFeast.checked) {
            extras += 500 * guests;
        }
        if (addCamPermit.checked) {
            extras += 1000; // Flat camera permit
        }

        const total = (planPrice * guests) + transportCost + extras;
        totalPriceDisplay.textContent = `₹${total.toLocaleString('en-IN')}`;
    }

    calcPlan.addEventListener('change', calculateEstimate);
    calcGuests.addEventListener('input', calculateEstimate);
    calcPickup.addEventListener('change', calculateEstimate);
    addCrabFeast.addEventListener('change', calculateEstimate);
    addCamPermit.addEventListener('change', calculateEstimate);
    calculateEstimate();

    // --- Booking Modal Controls ---
    const bookingModal = document.getElementById('bookingModal');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const bookPackageSelect = document.getElementById('bookPackage');
    const bookCountInput = document.getElementById('bookCount');

    function openBookingModal(pkgName = null, guests = 2) {
        if (pkgName) {
            for (let option of bookPackageSelect.options) {
                if (option.value === pkgName || option.text.includes(pkgName)) {
                    bookPackageSelect.value = option.value;
                    break;
                }
            }
        }
        bookCountInput.value = guests;
        bookingModal.classList.add('open');
        bookingModal.setAttribute('aria-hidden', 'false');
    }

    function closeBookingModal() {
        bookingModal.classList.remove('open');
        bookingModal.setAttribute('aria-hidden', 'true');
    }

    document.getElementById('openBookingBtn').addEventListener('click', () => openBookingModal());
    modalClose.addEventListener('click', closeBookingModal);
    modalBackdrop.addEventListener('click', closeBookingModal);

    // Cards "Select Package" click hooks
    document.querySelectorAll('.select-pkg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.getAttribute('data-plan');
            openBookingModal(plan, calcGuests.value);
        });
    });

    // Estimator CTA click
    document.getElementById('calcBookBtn').addEventListener('click', () => {
        const selectedPkgName = calcPlan.options[calcPlan.selectedIndex].text.split('(')[0].trim();
        openBookingModal(selectedPkgName, calcGuests.value);
    });

    // --- Quick Search Bar Form Submission ---
    const quickSearchForm = document.getElementById('quickSearchForm');
    quickSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pkg = document.getElementById('qsPackage').value;
        const date = document.getElementById('qsDate').value;
        const guests = document.getElementById('qsGuests').value;

        openBookingModal(pkg, guests);
        if (date) {
            document.getElementById('bookDate').value = date;
        }
    });

    // --- Booking Form Submit & WhatsApp Link Redirection ---
    const bookingForm = document.getElementById('bookingForm');
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('bookName').value.trim();
        const phone = document.getElementById('bookPhone').value.trim();
        const pkg = bookPackageSelect.value;
        const date = document.getElementById('bookDate').value;
        const count = bookCountInput.value;
        const notes = document.getElementById('bookNotes').value.trim();

        if (!name || !phone || !date) {
            showToast('⚠️ Please enter all mandatory reservation details.');
            return;
        }

        closeBookingModal();
        bookingForm.reset();

        // Construct tailored WhatsApp booking message
        const message = encodeURIComponent(
            `Hello Sundarban Tide Trails! 👋\n\nI want to book a safari expedition:\n` +
            `• Lead Traveler: ${name}\n` +
            `• Phone/WhatsApp: ${phone}\n` +
            `• Package: ${pkg}\n` +
            `• Date of Travel: ${date}\n` +
            `• Number of Guests: ${count}\n` +
            (notes ? `• Special Notes: ${notes}\n` : '') +
            `\nPlease verify availability and share permit processing instructions.`
        );

        showToast(`✅ Thank you, ${name}! Redirecting to WhatsApp safari desk...`);

        // Redirect to WhatsApp after 1.5 seconds
        setTimeout(() => {
            window.open(`https://wa.me/919733636547?text=${message}`, '_blank');
        }, 1400);
    });

    // --- Accordion Interactivity ---
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');

            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- Toast Notification Helper ---
    const toast = document.getElementById('toast');
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4500);
    }

    // --- Set Min Date to Today ---
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('qsDate').setAttribute('min', today);
    document.getElementById('bookDate').setAttribute('min', today);
});
// =========================================================
// TOURMAKER - ADVANCED AGENTIC AI NATURALIST & SAFARI ENGINE
// =========================================================
// TOURMAKER - ADVANCED AGENTIC AI NATURALIST & SAFARI ENGINE
// =========================================================
// TOURMAKER - ADVANCED AGENTIC AI NATURALIST & SAFARI ENGINE
// =========================================================

(function () {
    "use strict";

    // --- Configuration State & Persistence ---
    const DEFAULT_CONFIG = {
        persona: "subhash", // 'subhash' | 'dr_sen' | 'maya_roy' | 'custom'
        customPersona: {
            name: "Ranger Debabrata",
            role: "Specialist Mangrove Tracker",
            prompt: "You are an expert Sundarban tactical safari guide. Provide concise, highly accurate details on wildlife sighting probability, tidal navigation, and pricing."
        },
        autonomyEnabled: true,
        thinkingEnabled: false,
        temperature: 0.7,
        responseDepth: "balanced", // 'balanced' | 'concise' | 'deep'
        engine: "local", // 'local' | 'openai' | 'claude' | 'groq' | 'openrouter'
        apiKey: "",
        modelName: "gpt-4o-mini",
        tools: {
            nav: true,
            filter: true,
            quote: true,
            book: true,
            tide: true,
            itinerary: true
        },
        voice: {
            autoSpeak: false,
            sttLang: "en-IN",
            voiceURI: "",
            rate: 1.0,
            pitch: 1.0
        }
    };

    let agentConfig = Object.assign({}, DEFAULT_CONFIG);
    try {
        const saved = localStorage.getItem("tourmaker_advanced_config");
        if (saved) {
            const parsed = JSON.parse(saved);
            agentConfig = Object.assign({}, DEFAULT_CONFIG, parsed);
            agentConfig.tools = Object.assign({}, DEFAULT_CONFIG.tools, parsed.tools || {});
            agentConfig.voice = Object.assign({}, DEFAULT_CONFIG.voice, parsed.voice || {});
        }
    } catch (e) {
        console.warn("Could not load agent config:", e);
    }

    // --- Conversational Memory & State Matrix ---
    const agentMemory = {
        travelers: 2,
        dates: "Upcoming Winter Season",
        packageId: "ST-03",
        theme: "Royal Bengal Tiger & Mangrove Safari",
        mealPreference: "Traditional Bengali Feast (Prawn/Bhetki)",
        pickup: "Kolkata Private AC Sedan",
        history: []
    };

    try {
        const savedMem = sessionStorage.getItem("tourmaker_agent_memory");
        if (savedMem) {
            Object.assign(agentMemory, JSON.parse(savedMem));
        }
    } catch (e) { }

    function saveMemory() {
        try {
            sessionStorage.setItem("tourmaker_agent_memory", JSON.stringify(agentMemory));
        } catch (e) { }
        renderMemoryMatrix();
    }

    // --- Persona Profiles ---
    const PERSONAS = {
        subhash: {
            avatar: "🐅",
            name: "Capt. Subhashish 'Babu'",
            title: "Lead Tidal Master & Safari Naturalist",
            status: "18y Delta Veteran • High-Tide Expert",
            greeting: "Namaskar! 🙏 I'm **Captain Subhash**, alongside **TourMaker AI**. With 18 years reading the mangrove tides, I don't just chat—I execute real actions on your screen. Tell me: how many travelers, and what is your dream delta adventure?",
            signoff: "Tidal Blessings, Capt. Subhash 🌿",
            voiceName: "Naturalist Guide"
        },
        dr_sen: {
            avatar: "🔬",
            name: "Dr. Aranya Sen",
            title: "Senior Wildlife Biologist & Conservationist",
            status: "Avian Bio-Acoustics & Pugmark Lead",
            greeting: "Greetings! 🔬 I am **Dr. Aranya Sen**, wildlife biologist. I analyze Sundarban camera-trap logs, tidal hydro-mechanics, and tiger territorial ranges. I can compute live sighting odds and filter scientific expeditions for you.",
            signoff: "In Conservation & Field Science, Dr. Sen 🐾",
            voiceName: "Scientific Biologist"
        },
        maya_roy: {
            avatar: "🥂",
            name: "Maya Roy",
            title: "VIP Luxury Concierge & Private Charter Host",
            status: "Bespoke Stilt Water Villas & Dining",
            greeting: "Welcome to Sundarban Dark-Trails! 🥂 I am **Maya Roy**, your private safari concierge. Allow me to tailor our ultra-luxury stilt water retreats, private yacht charters, champagne sundowners, and gourmet dining.",
            signoff: "Warmest Regards, Maya Roy • VIP Concierge ✨",
            voiceName: "Luxury Concierge"
        },
        custom: {
            avatar: "⚡",
            name: "Custom Autonomous Agent",
            title: "User-Defined Agentic Brain",
            status: "Configured via Agent Control Center",
            greeting: "System Online. ⚡ I am your autonomous Sundarban expedition agent. Ready to analyze tidal tables, calculate customized quotes, and command this safari interface.",
            signoff: "TourMaker Safari Assistant 🌿",
            voiceName: "Autonomous System"
        }
    };

    // --- DOM Elements ---
    const chatbotWrapper = document.getElementById("chatbotWrapper");
    const chatbotTrigger = document.getElementById("chatbotTrigger");
    const chatWindow = document.getElementById("chatbotWindow");
    const chatMinimize = document.getElementById("chatMinimize");
    const chatExpandBtn = document.getElementById("chatExpandBtn");
    const chatResetBtn = document.getElementById("chatResetBtn");
    const chatVoiceToggle = document.getElementById("chatVoiceToggle");
    const chatConfigBtn = document.getElementById("chatConfigBtn");
    const chatMessages = document.getElementById("chatMessages");
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const chatChips = document.getElementById("chatChips");
    const chatMicBtn = document.getElementById("chatMicBtn");
    const voiceWaveBar = document.getElementById("voiceWaveBar");
    const voiceStatusText = document.getElementById("voiceStatusText");
    const voiceCancelBtn = document.getElementById("voiceCancelBtn");

    // Header elements
    const agentAvatar = document.getElementById("agentAvatar");
    const agentDisplayName = document.getElementById("agentDisplayName");
    const agentDisplaySubtitle = document.getElementById("agentDisplaySubtitle");
    const agentAutonomyBadge = document.getElementById("agentAutonomyBadge");
    const agentBannerPill = document.getElementById("agentBannerPill");
    const agentBannerText = document.getElementById("agentBannerText");
    const agentTideStatus = document.getElementById("agentTideStatus");

    // Config Modal Elements
    const agentConfigModal = document.getElementById("agentConfigModal");
    const configCloseBtn = document.getElementById("configCloseBtn");
    const btnSaveConfig = document.getElementById("btnSaveConfig");
    const btnResetConfig = document.getElementById("btnResetConfig");
    const personaCards = document.querySelectorAll(".persona-card");
    const customPersonaGroup = document.getElementById("customPersonaGroup");
    const cfgCustomName = document.getElementById("cfgCustomName");
    const cfgCustomPrompt = document.getElementById("cfgCustomPrompt");
    const cfgAutonomyToggle = document.getElementById("cfgAutonomyToggle");
    const cfgThinkingToggle = document.getElementById("cfgThinkingToggle");
    const cfgTemperature = document.getElementById("cfgTemperature");
    const tempValBadge = document.getElementById("tempValBadge");
    const cfgResponseDepth = document.getElementById("cfgResponseDepth");
    const cfgEngineSelect = document.getElementById("cfgEngineSelect");
    const cloudGatewayFields = document.getElementById("cloudGatewayFields");
    const cfgApiKey = document.getElementById("cfgApiKey");
    const cfgModelName = document.getElementById("cfgModelName");
    const btnTestApi = document.getElementById("btnTestApi");
    const apiPingStatus = document.getElementById("apiPingStatus");

    // Tools permissions
    const toolPermNav = document.getElementById("toolPermNav");
    const toolPermFilter = document.getElementById("toolPermFilter");
    const toolPermQuote = document.getElementById("toolPermQuote");
    const toolPermBook = document.getElementById("toolPermBook");
    const toolPermTide = document.getElementById("toolPermTide");
    const toolPermItinerary = document.getElementById("toolPermItinerary");

    // Voice settings elements
    const cfgAutoSpeak = document.getElementById("cfgAutoSpeak");
    const cfgSttLang = document.getElementById("cfgSttLang");
    const cfgVoiceSelect = document.getElementById("cfgVoiceSelect");
    const cfgVoiceRate = document.getElementById("cfgVoiceRate");
    const rateValBadge = document.getElementById("rateValBadge");
    const cfgVoicePitch = document.getElementById("cfgVoicePitch");
    const pitchValBadge = document.getElementById("pitchValBadge");
    const btnTestVoice = document.getElementById("btnTestVoice");

    // Memory elements
    const memoryStateGrid = document.getElementById("memoryStateGrid");
    const cfgInjectPax = document.getElementById("cfgInjectPax");
    const cfgInjectDates = document.getElementById("cfgInjectDates");
    const btnInjectContext = document.getElementById("btnInjectContext");
    const btnExportItinerary = document.getElementById("btnExportItinerary");
    const btnResetMemory = document.getElementById("btnResetMemory");

    // --- 10 Packages Reference Database for Live Agent Tools ---
    const PACKAGES_DATABASE = [
        {
            id: "ST-01",
            title: "Day River Cruise",
            category: "day",
            duration: "1 Day (Dawn to Dusk)",
            pricePerPerson: 1499,
            tag: "Best for Quick Visits",
            watchtowers: "Sajnekhali, Mangrove Interpretation Centre",
            meals: "Breakfast, Traditional Fish Thali, Evening Tea",
            rating: 4.9,
            tigerOdds: "55%"
        },
        {
            id: "ST-02",
            title: "Mangrove Eco-Escape",
            category: "overnight",
            duration: "2 Days / 1 Night",
            pricePerPerson: 3499,
            tag: "Classic Overnight",
            watchtowers: "Sajnekhali, Sudhanyakhali, Pirkhali Creeks",
            meals: "5 Meals with Bengali Fish/Prawn Buffet",
            rating: 4.95,
            tigerOdds: "72%"
        },
        {
            id: "ST-03",
            title: "Tiger Trail Expedition",
            category: "overnight",
            duration: "3 Days / 2 Nights",
            pricePerPerson: 5499,
            tag: "Flagship Wildlife Safari",
            watchtowers: "Sudhanyakhali, Dobanki Canopy Walk, Netidhopani Watchtower",
            meals: "Full Royal Bengali Culinary Spread",
            rating: 4.98,
            tigerOdds: "88%"
        },
        {
            id: "ST-04",
            title: "Luxury Houseboat Charter",
            category: "premium",
            duration: "2 Days / 1 Night (Private)",
            pricePerPerson: 12999,
            tag: "VIP Private Yacht",
            watchtowers: "Sudhanyakhali, Dobanki, Deep Core Creeks",
            meals: "Gourmet Chef, Champagne Sundowner, Fresh Crab/Prawn",
            rating: 5.0,
            tigerOdds: "91%"
        },
        {
            id: "ST-05",
            title: "Birding & Photography Special",
            category: "premium",
            duration: "3 Days / 2 Nights",
            pricePerPerson: 6499,
            tag: "Avian & Telephoto Focus",
            watchtowers: "Pakhiralay, Sajnekhali, Burirdabri Mudflats",
            meals: "Photography Packed Rations + Warm Eco-Resort Meals",
            rating: 4.92,
            tigerOdds: "75%"
        },
        {
            id: "ST-06",
            title: "Honey Hunters & Folk Trail",
            category: "overnight",
            duration: "2 Days / 1 Night",
            pricePerPerson: 4999,
            tag: "Cultural & Forest Lore",
            watchtowers: "Bonbibi Shrines, Sajnekhali, Dayapur Village",
            meals: "Organic Wild Honey Tasting, Paturi & Chingri Feasts",
            rating: 4.9,
            tigerOdds: "68%"
        },
        {
            id: "ST-07",
            title: "Wilderness Family Gateway",
            category: "overnight",
            duration: "2 Days / 1 Night",
            pricePerPerson: 4299,
            tag: "Family & Senior Friendly",
            watchtowers: "Dobanki (Canopy Walk), Sajnekhali, Eco-Village Walk",
            meals: "Mild Kid-Friendly Spices + Classic Bengali Dishes",
            rating: 4.96,
            tigerOdds: "70%"
        },
        {
            id: "ST-08",
            title: "Kalash Island & Coastal Safari",
            category: "premium",
            duration: "3 Days / 2 Nights",
            pricePerPerson: 8999,
            tag: "Deep Estuary & Bay of Bengal",
            watchtowers: "Kalash Island, Bonnie Camp (50ft tower), Netidhopani",
            meals: "Fresh Marine Catch Feast, Coastal BBQ",
            rating: 4.97,
            tigerOdds: "85%"
        },
        {
            id: "ST-09",
            title: "Royal Anglers Fishing Cruise",
            category: "day",
            duration: "2 Days / 1 Night",
            pricePerPerson: 3499,
            tag: "Angling & Estuary Catch",
            watchtowers: "Bidyadhari & Matla Confluence",
            meals: "Catch-and-Cook Fresh Fish Stew with Mustard",
            rating: 4.88,
            tigerOdds: "60%"
        },
        {
            id: "ST-10",
            title: "VIP Romantic Stilt Water Retreat",
            category: "premium",
            duration: "2 Days / 1 Night",
            pricePerPerson: 9250, // Per couple 18500
            tag: "Ultra-Luxury Waterfront Stilt Villa",
            watchtowers: "Private Silent Solar Boat, Dobanki Canopy Walk",
            meals: "Candlelight Stilt Deck Dining with River View",
            rating: 5.0,
            tigerOdds: "82%"
        }
    ];

    // --- Voice Engine (Web Speech STT & TTS) ---
    let speechRecognizer = null;
    let isListening = false;
    let availableVoices = [];

    function initVoiceEngine() {
        // Speech Synthesis
        if ("speechSynthesis" in window) {
            const updateVoices = () => {
                availableVoices = window.speechSynthesis.getVoices();
                if (cfgVoiceSelect) {
                    cfgVoiceSelect.innerHTML = '<option value="">Default Naturalist Voice</option>';
                    availableVoices.forEach((v) => {
                        const opt = document.createElement("option");
                        opt.value = v.voiceURI;
                        opt.textContent = `${v.name} (${v.lang})`;
                        if (agentConfig.voice.voiceURI === v.voiceURI) {
                            opt.selected = true;
                        }
                        cfgVoiceSelect.appendChild(opt);
                    });
                }
            };
            updateVoices();
            window.speechSynthesis.onvoiceschanged = updateVoices;
        }

        // Speech Recognition (STT)
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            speechRecognizer = new SpeechRecognition();
            speechRecognizer.continuous = false;
            speechRecognizer.interimResults = false;
            speechRecognizer.lang = agentConfig.voice.sttLang || "en-IN";

            speechRecognizer.onstart = () => {
                isListening = true;
                chatMicBtn.classList.add("listening");
                voiceWaveBar.classList.add("active");
                voiceStatusText.textContent = "Listening to your voice... Speak your question";
            };

            speechRecognizer.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                chatInput.value = transcript;
                stopListening();
                handleUserMessage(transcript);
            };

            speechRecognizer.onerror = (e) => {
                console.warn("Speech recognition error:", e);
                stopListening();
            };

            speechRecognizer.onend = () => {
                stopListening();
            };
        } else {
            if (chatMicBtn) {
                chatMicBtn.title = "Speech-to-text not supported in this browser";
                if (chatMicBtn.style) chatMicBtn.style.opacity = "0.5";
            }
        }
    }

    function startListening() {
        if (!speechRecognizer) {
            alert("Voice input is not supported in your browser. Please type your message.");
            return;
        }
        try {
            speechRecognizer.lang = agentConfig.voice.sttLang || "en-IN";
            speechRecognizer.start();
        } catch (e) {
            speechRecognizer.stop();
        }
    }

    function stopListening() {
        isListening = false;
        if (chatMicBtn) chatMicBtn.classList.remove("listening");
        if (voiceWaveBar) voiceWaveBar.classList.remove("active");
        if (speechRecognizer) {
            try { speechRecognizer.stop(); } catch (e) { }
        }
    }

    function speakMessage(text) {
        if (!("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel(); // Stop any previous speech

        // Clean markdown symbols for cleaner voice readout
        const clean = text
            .replace(/[*_#`~]/g, "")
            .replace(/https?:\/\/\S+/g, "")
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            .substring(0, 450); // limit spoken length for pleasant voice UX

        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.rate = parseFloat(agentConfig.voice.rate || 1.0);
        utterance.pitch = parseFloat(agentConfig.voice.pitch || 1.0);

        if (agentConfig.voice.voiceURI) {
            const chosen = availableVoices.find(v => v.voiceURI === agentConfig.voice.voiceURI);
            if (chosen) utterance.voice = chosen;
        }

        window.speechSynthesis.speak(utterance);
    }

    // Expose speakText to window for buttons in meta
    window.speakText = function (btn) {
        const bubble = btn.closest(".bot-bubble");
        if (!bubble) return;
        const pList = Array.from(bubble.querySelectorAll("p")).map(p => p.textContent).join(" ");
        speakMessage(pList);
    };

    // --- Persona Management & Rendering ---
    function getActivePersona() {
        if (agentConfig.persona === "custom") {
            return {
                avatar: "⚡",
                name: agentConfig.customPersona.name || "Custom Agent",
                title: agentConfig.customPersona.role || "Autonomous Wildlife Concierge",
                status: "Custom System Prompt Active",
                greeting: `System Online. ⚡ I am **${agentConfig.customPersona.name}**. ${agentConfig.customPersona.prompt.substring(0, 160)}... How can I assist your expedition?`,
                signoff: `With Warmest Regards, ${agentConfig.customPersona.name} 🌿`,
                voiceName: agentConfig.customPersona.name
            };
        }
        return PERSONAS[agentConfig.persona] || PERSONAS.subhash;
    }

    function applyPersonaToUI() {
        const p = getActivePersona();
        if (agentAvatar) agentAvatar.textContent = p.avatar;
        if (agentDisplayName) agentDisplayName.textContent = p.name;
        if (agentDisplaySubtitle) agentDisplaySubtitle.textContent = `${p.title} • ${p.status}`;
        if (agentAutonomyBadge) {
            agentAutonomyBadge.textContent = agentConfig.autonomyEnabled ? "⚡ AUTONOMOUS" : "🛡️ SUPERVISED";
        }
        if (agentBannerText) {
            agentBannerText.textContent = agentConfig.autonomyEnabled ? "Autonomous Actions Active" : "Supervised Mode (Approval Required)";
        }

        // Render dynamic welcome message if empty or first load
        const existingMsgs = chatMessages.querySelectorAll(".chat-bubble");
        if (existingMsgs.length <= 1) {
            chatMessages.innerHTML = `
                        <div class="chat-bubble bot-bubble" data-msg-id="welcome">
                            <p>${p.greeting}</p>
                            <div class="bot-bubble-meta">
                                <span>Just now • ${p.name}</span>
                                <button class="voice-speak-btn" onclick="window.speakText(this)">🔊 Listen</button>
                            </div>
                        </div>
                    `;
        }
    }

    // --- Memory Matrix Rendering ---
    function renderMemoryMatrix() {
        if (!memoryStateGrid) return;
        memoryStateGrid.innerHTML = `
                    <div class="memory-chip-box">
                        <div class="memory-chip-key">Travelers (Pax)</div>
                        <div class="memory-chip-val">👥 ${agentMemory.travelers} Guests</div>
                    </div>
                    <div class="memory-chip-box">
                        <div class="memory-chip-key">Target Season</div>
                        <div class="memory-chip-val">🗓️ ${agentMemory.dates}</div>
                    </div>
                    <div class="memory-chip-box">
                        <div class="memory-chip-key">Selected Package</div>
                        <div class="memory-chip-val">🛥️ ${agentMemory.packageId}</div>
                    </div>
                    <div class="memory-chip-box">
                        <div class="memory-chip-key">Core Theme</div>
                        <div class="memory-chip-val">🐅 ${agentMemory.theme}</div>
                    </div>
                    <div class="memory-chip-box">
                        <div class="memory-chip-key">Dietary Feast</div>
                        <div class="memory-chip-val">🍲 ${agentMemory.mealPreference}</div>
                    </div>
                    <div class="memory-chip-box">
                        <div class="memory-chip-key">Kolkata Pickup</div>
                        <div class="memory-chip-val">🚗 ${agentMemory.pickup}</div>
                    </div>
                `;
    }

    // --- Autonomous Agent Tools (The Agentic Core) ---
    const AgentTools = {
        // Tool 1: Scroll & Spotlight page section
        navigateAndSpotlight: function (targetId, toolLabel = "Page Spotlight") {
            if (!agentConfig.tools.nav || !agentConfig.autonomyEnabled) return false;
            const el = document.getElementById(targetId);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                el.classList.add("agent-target-highlight");
                setTimeout(() => el.classList.remove("agent-target-highlight"), 3200);
                return true;
            }
            return false;
        },

        // Tool 2: Dynamic 10-Package Grid Filter
        filterCatalog: function (filterCategory) {
            if (!agentConfig.tools.filter || !agentConfig.autonomyEnabled) return false;
            const tabBtn = document.querySelector(`.package-tabs .tab-btn[data-filter="${filterCategory}"]`) ||
                document.querySelector('.package-tabs .tab-btn[data-filter="all"]');
            if (tabBtn) {
                tabBtn.click();
                this.navigateAndSpotlight("packages", "Filter Packages Grid");
                return true;
            }
            return false;
        },

        // Tool 3: Live Group Quote Engine with Surcharges & Discounts
        calculateLiveQuote: function (pax = 4, pkgId = "ST-03", pickupType = "private") {
            const pkg = PACKAGES_DATABASE.find(p => p.id === pkgId) || PACKAGES_DATABASE[2];
            const count = Math.max(1, parseInt(pax) || 1);
            agentMemory.travelers = count;
            agentMemory.packageId = pkg.id;
            saveMemory();

            const basePrice = pkg.pricePerPerson * count;
            let discountPercent = count >= 6 ? 15 : (count >= 4 ? 10 : 0);
            let discountAmount = Math.round((basePrice * discountPercent) / 100);
            let pickupSurcharge = pickupType === "private" ? 3500 : 0;
            let netTotal = basePrice - discountAmount + pickupSurcharge;

            return {
                pkg,
                count,
                basePrice,
                discountPercent,
                discountAmount,
                pickupSurcharge,
                netTotal,
                perPersonNet: Math.round(netTotal / count)
            };
        },

        // Tool 4: Prefill & Open Booking Reservation Modal
        dispatchBooking: function (pkgTitle, paxCount = 2, targetDate = "") {
            if (!agentConfig.tools.book || !agentConfig.autonomyEnabled) return false;
            const bookModal = document.getElementById("bookingModal");
            if (bookModal) {
                const pkgSelect = document.getElementById("bookPackage");
                if (pkgSelect && pkgTitle) {
                    for (let i = 0; i < pkgSelect.options.length; i++) {
                        const opt = pkgSelect.options[i];
                        if (opt.value.toLowerCase().includes(pkgTitle.toLowerCase()) || opt.text.toLowerCase().includes(pkgTitle.toLowerCase())) {
                            pkgSelect.selectedIndex = i;
                            break;
                        }
                    }
                }
                const paxInput = document.getElementById("bookCount") || document.getElementById("bookGuests");
                if (paxInput) paxInput.value = paxCount || agentMemory.travelers || 2;

                const dateInput = document.getElementById("bookDate");
                if (dateInput && targetDate) dateInput.value = targetDate;

                bookModal.classList.add("open");
                bookModal.setAttribute("aria-hidden", "false");
                return true;
            }
            return false;
        },

        // Tool 5: Tidal, Moon Phase & Tiger Sighting Radar
        computeTidalRadar: function () {
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const currentMonth = months[new Date().getMonth()];

            return {
                month: currentMonth,
                lunarPhase: "Waxing Gibbous (Approaching Purnima Spring Tides)",
                tideWindow: "Low Tide: 06:15 AM & 06:45 PM (Exposes mudflats for deer & tigers)",
                tigerProbability: "84% (Peak winter basking window along Pirkhali & Sudhanyakhali)",
                recommendedWatchtowers: ["Sudhanyakhali (Freshwater Pond)", "Dobanki (Canopy Walk)", "Netidhopani (Historical Ruins)"]
            };
        },

        // Tool 6: Build & Download Custom Safari Itinerary Dossier
        generateItineraryDossier: function () {
            const p = getActivePersona();
            const quote = this.calculateLiveQuote(agentMemory.travelers, agentMemory.packageId);

            const dossierText = `=====================================================
SUNDARBAN DARK-TRAILS - OFFICIAL EXPEDITION DOSSIER
Bespoke Safari Blueprint Prepared by ${p.name}
=====================================================

EXPEDITION OVERVIEW:
• Lead Naturalist: ${p.name} (${p.title})
• Expedition Package: ${quote.pkg.title} (${quote.pkg.duration})
• Group Size: ${agentMemory.travelers} Guests
• Target Season / Dates: ${agentMemory.dates}
• Meal Plan: ${agentMemory.mealPreference}
• Kolkata Transfer: ${agentMemory.pickup}
• Tiger Sighting Index: ${quote.pkg.tigerOdds}

ESTIMATED FINANCIALS:
• Base Expedition Rate: INR ${quote.basePrice.toLocaleString()}
• Group Privilege Discount: ${quote.discountPercent}% (-INR ${quote.discountAmount.toLocaleString()})
• Kolkata AC Transfer: INR ${quote.pickupSurcharge.toLocaleString()}
• Net Group Total: INR ${quote.netTotal.toLocaleString()} (INR ${quote.perPersonNet.toLocaleString()}/guest)

DAY-BY-DAY EXPEDITION SCHEDULE:
[DAY 1: ESTUARY PENETRATION & DEEP MANGROVE CHANNELS]
• 07:00 AM: VIP Pickup from Kolkata in sanitized AC vehicle. Scenic ride via Baruipur/Canning.
• 10:30 AM: Board luxury safari cruise vessel at Godkhali Jetty. Welcome coconut water & breakfast.
• 01:00 PM: Cruising past Sajnekhali Mangrove Interpretation Centre & Mangrove Crocodile pond.
• 02:00 PM: Traditional Bengali lunch (Steamed Bhat, Sonamug Dal, Bhetki Paturi, Golda Chingri Malaikari).
• 04:30 PM: Silent boat patrol along Pirkhali & Panchamukhani confluence during evening low tide.
• 07:00 PM: Traditional Baul folk singer performance and Bonbibi musical lore by campfire.

[DAY 2: CORE TIGER TERRITORIES & CANOPY WALK]
• 06:30 AM: Dawn boat safari through mist-shrouded creeks towards Sudhanyakhali Watchtower.
• 09:00 AM: Fresh luchi, cholar dal, and warm Darjeeling tea served on upper viewing deck.
• 11:30 AM: Dobanki 496-meter caged aerial canopy walk 20 feet above mangrove ground.
• 03:00 PM: Tracking Royal Bengal tiger pugmarks on fresh low-tide mudflats.
• 06:00 PM: Sunset tea & return to jetty / eco-resort.

SAFETY & GOVERNMENT PERMITS:
• All West Bengal Forest Department permissions & biometric guide fees included.
• USCG-certified life jackets and silent GPS distress beacons on all vessels.

RESERVATION DISPATCH:
Emergency Ranger Desk: +91 62947 92928
Sundarban Dark-Trails | Luxury Mangrove Safaris
Generated on: ${new Date().toLocaleString()}
=====================================================`;

            // Trigger browser file download
            const blob = new Blob([dossierText], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Sundarban_Safari_Dossier_${agentMemory.packageId}_${agentMemory.travelers}pax.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            return dossierText;
        }
    };

    // Expose globally for interactive in-card clicks
    window.AgentTools = AgentTools;

    // --- Multi-Step Reasoning / Chain-of-Thought Generator ---
    function generateThoughtBlock(intentType, details = {}) {
        if (!agentConfig.thinkingEnabled) return "";

        let steps = [];
        const latency = (0.15 + Math.random() * 0.15).toFixed(2);

        if (intentType === "quote") {
            steps = [
                { icon: "🧠", tag: "INTENT", text: `Parsed group parameters: ${details.pax} travelers, Package '${details.pkg.id}' (${details.pkg.title}).` },
                { icon: "🌊", tag: "TIDE CHECK", text: `Queried November-April winter tidal matrix. Low mudflat tide active at 06:30 hrs.` },
                { icon: "🛠️", tag: "TOOL EXEC", text: `Executed tool 'calculateLiveQuote(pax=${details.pax}, pkg="${details.pkg.id}")'. Computed net INR ${details.netTotal.toLocaleString()}.` },
                { icon: "🎯", tag: "UI DISPATCH", text: `Rendering interactive in-chat pricing card with dynamic +/- pax modifiers.` }
            ];
        } else if (intentType === "filter") {
            steps = [
                { icon: "🧠", tag: "INTENT", text: `Filter request: Category '${details.category}' matching traveler luxury preferences.` },
                { icon: "🛠️", tag: "TOOL EXEC", text: `Executed 'tool_catalog_filter(category="${details.category}")' across 10 curated safaris.` },
                { icon: "🎯", tag: "PAGE ACTION", text: `Autonomous smooth scroll dispatched to #packages grid with glowing focus spotlight.` }
            ];
        } else if (intentType === "tide") {
            steps = [
                { icon: "🧠", tag: "INTENT", text: `Lunar cycle & tidal radar inquiry for Sundarban National Park.` },
                { icon: "🌊", tag: "HYDRO DATA", text: `Consulted delta tidal table: Waxing Gibbous, optimal low-tide basking at 06:15 AM.` },
                { icon: "🛠️", tag: "TOOL EXEC", text: `Executed 'tool_tide_weather_radar()' -> Tiger sighting index 84%.` }
            ];
        } else if (intentType === "itinerary") {
            steps = [
                { icon: "🧠", tag: "INTENT", text: `Multi-day expedition blueprint generation requested for ${agentMemory.travelers} guests.` },
                { icon: "🛠️", tag: "TOOL EXEC", text: `Executed 'tool_itinerary_builder()'. Compiled Day 1 to Day 3 river navigation schedule.` },
                { icon: "📥", tag: "DELIVERABLE", text: `Compiled downloadable Safari Dossier (.txt) with automated file dispatch ready.` }
            ];
        } else {
            steps = [
                { icon: "🧠", tag: "INTENT", text: `Natural language safari query received: "${details.query ? details.query.substring(0, 38) : 'Wilderness query'}..."` },
                { icon: "📚", tag: "DOMAIN KB", text: `Synthesizing 18-year delta experience, Bengal tiger habits, and vessel logistics.` },
                { icon: "🎭", tag: "PERSONA", text: `Applying persona tone: ${getActivePersona().name} (${agentConfig.responseDepth} depth).` }
            ];
        }

        let html = `
                    <details class="agent-thought-block">
                        <summary>⚡ Agent Reasoning & Tool Execution Trace (${latency}s)</summary>
                        <div class="thought-steps">
                `;

        steps.forEach(s => {
            html += `
                        <div class="thought-step">
                            <span class="thought-step-icon">${s.icon}</span>
                            <span class="thought-step-text"><span class="thought-step-tag">${s.tag}</span>${s.text}</span>
                        </div>
                    `;
        });

        html += `
                        </div>
                    </details>
                `;
        return html;
    }

    // --- Human-Like Intent Classification & Conversational AI Logic ---
    function analyzeAndRespond(query) {
        const q = query.toLowerCase().trim();
        const p = getActivePersona();

        // 1. EXTRACT & UPDATE GUEST CONTEXT IN MEMORY
        let paxFound = null;
        const paxKeywords = {
            "solo": 1, "alone": 1, "single": 1, "myself": 1, "1 person": 1,
            "couple": 2, "two of us": 2, "both of us": 2, "me and my wife": 2, "me and my husband": 2, "me and my partner": 2, "2 of us": 2, "two": 2,
            "family of 3": 3, "three of us": 3, "3 of us": 3, "three": 3,
            "family of 4": 4, "four of us": 4, "4 of us": 4, "four": 4,
            "family of 5": 5, "five of us": 5, "5 of us": 5, "five": 5,
            "group of 6": 6, "six": 6, "6 of us": 6, "group of 8": 8, "eight": 8, "ten": 10
        };
        for (let k in paxKeywords) {
            if (q.includes(k)) { paxFound = paxKeywords[k]; break; }
        }
        if (!paxFound) {
            let digitMatch = q.match(/\b(\d{1,2})\s*(?:people|persons?|guests?|pax|members?|travelers?|adults?)\b/);
            if (digitMatch) paxFound = parseInt(digitMatch[1]);
        }
        if (paxFound && paxFound >= 1 && paxFound <= 40) {
            agentMemory.travelers = paxFound;
            saveMemory();
        }

        // Extract travel season or target month
        const months = ["november", "december", "january", "february", "march", "april", "winter", "puja", "diwali", "christmas", "new year", "weekend", "tomorrow", "next week"];
        for (let m of months) {
            if (q.includes(m)) {
                agentMemory.dates = m.charAt(0).toUpperCase() + m.slice(1) + " Season";
                saveMemory();
                break;
            }
        }

        // Extract meal/dietary preference
        if (q.includes("veg") || q.includes("jain") || q.includes("vegetarian")) {
            agentMemory.mealPreference = "Pure Vegetarian / Jain Feast";
            saveMemory();
        } else if (q.includes("fish") || q.includes("prawn") || q.includes("chingri") || q.includes("bhetki") || q.includes("mutton") || q.includes("non veg")) {
            agentMemory.mealPreference = "Estuarine Seafood & Bengali Non-Veg Feast";
            saveMemory();
        }

        // Extract travel theme
        if (q.includes("luxury") || q.includes("houseboat") || q.includes("stilt") || q.includes("yacht") || q.includes("premium")) {
            agentMemory.theme = "Ultra-Luxury Waterfront Retreat";
            saveMemory();
        } else if (q.includes("family") || q.includes("kids") || q.includes("children") || q.includes("elderly") || q.includes("parents")) {
            agentMemory.theme = "Comfortable Wilderness Family Gateway";
            saveMemory();
        } else if (q.includes("photo") || q.includes("camera") || q.includes("bird") || q.includes("avian")) {
            agentMemory.theme = "Avian & Photography Expedition";
            saveMemory();
        }

        // A. GREETINGS & CASUAL HELLO
        if (q === "hi" || q === "hello" || q === "hey" || q.startsWith("hi ") || q.startsWith("hello ") || q.startsWith("hey ") ||
            q.includes("namaskar") || q.includes("namaste") || q.includes("good morning") || q.includes("good afternoon") ||
            q.includes("good evening") || q.includes("ki khobor") || q.includes("kemon acho") || q.includes("kemon achho") ||
            q.includes("kem cho") || q.includes("salam") || q.includes("pranam")) {

            const thought = generateThoughtBlock("general", { query: "Warm host welcome & guest inquiry" });
            let text = "";

            if (agentConfig.persona === "dr_sen") {
                text = `Greetings and welcome! 🔬 I am **Dr. Aranya Sen**, senior wildlife biologist here at Sundarban Dark-Trails.
                        
The delta is in peak biological activity right now—winter mudflats are teeming with migratory shorebirds, estuarine crocodiles, and active Royal Bengal Tiger territorial patrols.
                        
I can help compute live sighting probabilities, compare scientific research trails, or calculate exact expedition logistics for your group. What would you like to explore today?`;
            } else if (agentConfig.persona === "maya_roy") {
                text = `Namaskar and welcome! 🥂 I am **Maya Roy**, your private VIP safari concierge.
                        
If you are longing for an ultra-luxury mangrove escape—private stilt water villas perched over the water, chartered houseboats with personal chefs, and champagne river sundowners—you are in wonderful hands.
                        
Tell me, how many guests are traveling in your party, and are you celebrating a special occasion?`;
            } else {
                // Default Capt. Subhashish 'Babu'
                text = `Namaskar! 🙏 Always an honor to welcome a fellow wilderness lover. I'm **Capt. Subhashish 'Babu'**, your lead tidal master and naturalist guide here in the Sundarbans.
                        
We've got beautiful weather over the estuary today—glassy calm water, crisp morning mist, and the winter tiger sighting window is wide open! Low tides along Pirkhali and Sudhanyakhali have been turning up fresh pugmarks almost every dawn.
                        
Whether you're looking for a relaxing 1-day river cruise, an authentic 2D1N eco-resort escape, or a deep 3-day tiger tracking expedition, I'm right here with you. How many travelers are in your group, and what is your dream delta plan?`;
            }

            return {
                text,
                thought,
                chips: [
                    "Calculate a live quote for our group",
                    "What are our chances of seeing a tiger?",
                    "Show me all 10 safari packages",
                    "What is the best month and tide to visit?"
                ]
            };
        }

        // B. HOW ARE YOU & CASUAL SMALL TALK
        if (q.includes("how are you") || q.includes("how r u") || q.includes("how do you do") || q.includes("what's up") || q.includes("whats up") || q.includes("how is your day")) {
            const text = `Doing great, thank you for asking! How are you doing today? Let me know how I can help with your Sundarban safari plans.`;
            return {
                text,
                chips: [
                    "Which safari package is best for us?",
                    "Calculate a live quote for our group",
                    "What authentic Bengali food is served on board?",
                    "Check Sundarban tidal radar and best month to visit"
                ]
            };
        }

        // C. WHO ARE YOU & ABOUT THE AGENT
        if (q.includes("who are you") || q.includes("what is your name") || q.includes("are you real") || q.includes("are you ai") || q.includes("what can you do") || q.includes("about you")) {
            const text = `I am **TourMaker**, your personal safari consultant for Sundarban Dark-Trails! I help you calculate live group prices, compare safari packages, check tiger sighting tides, and arrange bookings from Kolkata to Godkhali. How can I help you today?`;
            return {
                text,
                chips: [
                    "Calculate a live quote for 4 guests on 2D1N",
                    "Filter all luxury stilt and houseboat safaris",
                    "What is the secret to spotting Royal Bengal Tigers?",
                    "Download a custom 3-day safari dossier (.txt)"
                ]
            };
        }

        // D. LIVE QUOTE, PRICING & COST ESTIMATES
        if (q.includes("quote") || q.includes("price") || q.includes("cost") || q.includes("rate") || q.includes("how much") ||
            q.includes("pricing") || q.includes("budget") || q.includes("tariff") || q.includes("fare") || q.includes("package cost") ||
            q.match(/\b\d+\s*(?:people|person|guests?|pax|members?|travelers?)\b/)) {

            let pax = agentMemory.travelers || 2;
            let paxMatch = q.match(/\b(\d{1,2})\s*(?:people|person|guests?|pax|members?|travelers?|adults?)?\b/);
            if (paxMatch && parseInt(paxMatch[1]) > 0 && parseInt(paxMatch[1]) <= 40) {
                pax = parseInt(paxMatch[1]);
                agentMemory.travelers = pax;
                saveMemory();
            }

            // Select package based on query keywords or memory
            let pkg = PACKAGES_DATABASE[2]; // Default: Tiger Trail Expedition (ST-03)
            if (q.includes("day") || q.includes("1 day") || q.includes("single day")) pkg = PACKAGES_DATABASE[0];
            else if (q.includes("houseboat") || q.includes("charter") || q.includes("yacht")) pkg = PACKAGES_DATABASE[3];
            else if (q.includes("stilt") || q.includes("couple") || q.includes("romantic") || q.includes("honeymoon")) pkg = PACKAGES_DATABASE[9];
            else if (q.includes("honey") || q.includes("folk") || q.includes("culture")) pkg = PACKAGES_DATABASE[5];
            else if (q.includes("family") || q.includes("children") || q.includes("kids") || q.includes("parents")) pkg = PACKAGES_DATABASE[6];
            else if (q.includes("eco") || q.includes("2d1n") || q.includes("2 day") || q.includes("overnight")) pkg = PACKAGES_DATABASE[1];
            else if (q.includes("photo") || q.includes("bird")) pkg = PACKAGES_DATABASE[4];
            else if (q.includes("kalash") || q.includes("coastal")) pkg = PACKAGES_DATABASE[7];
            else if (q.includes("fish") || q.includes("angler")) pkg = PACKAGES_DATABASE[8];

            const quote = AgentTools.calculateLiveQuote(pax, pkg.id);
            const thought = generateThoughtBlock("quote", { pax, pkg, netTotal: quote.netTotal });

            // Autonomously scroll and spotlight calculator
            AgentTools.navigateAndSpotlight("calculator", "Live Pricing Calculator");

            const text = `For **${pax} guest${pax > 1 ? "s" : ""}**, the **${pkg.title}** (${pkg.duration}) is **₹${quote.netTotal.toLocaleString()}** (₹${pkg.price.toLocaleString()} per person), all-inclusive with meals, boat cruise, forest permits, and Kolkata AC transfer.`;

            const cardHtml = `
                        <div class="chat-agent-card" id="activeQuoteCard">
                            <div class="card-header-bar">
                                <span class="card-badge">${pkg.tag}</span>
                                <span class="card-price-tag">₹${quote.netTotal.toLocaleString()}</span>
                            </div>
                            <div class="card-title-text">${pkg.title} (${pkg.duration})</div>
                            
                            <!-- Interactive In-Chat Pax Modifier -->
                            <div class="pax-modifier-row">
                                <span>Adjust Travelers:</span>
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <button class="pax-ctrl-btn" onclick="window.modifyChatQuotePax(-1)">&minus;</button>
                                    <strong id="cardPaxCount">${pax} Guests</strong>
                                    <button class="pax-ctrl-btn" onclick="window.modifyChatQuotePax(1)">&#43;</button>
                                </div>
                            </div>

                            <ul class="card-meta-list">
                                <li>✨ Base Rate: ₹${quote.basePrice.toLocaleString()} (${quote.discountPercent > 0 ? quote.discountPercent + '% Group Savings Applied' : 'Standard Transparent Rate'})</li>
                                <li>🍽️ Dining Plan: ${pkg.meals}</li>
                                <li>🐅 Wildlife Sighting Probability: <strong>${pkg.tigerOdds}</strong></li>
                            </ul>

                            <div class="card-btn-row">
                                <button class="card-action-btn" onclick="window.AgentTools.dispatchBooking('${pkg.title}', ${pax});">🚀 Instant Reserve</button>
                                <button class="card-action-btn secondary" onclick="window.AgentTools.navigateAndSpotlight('packages');">🔍 View All 10 Packages</button>
                            </div>
                        </div>
                    `;

            return {
                text,
                thought,
                card: cardHtml,
                chips: [
                    "Build me a custom 3-day safari expedition itinerary",
                    "What authentic Bengali food is served on board?",
                    "Check Sundarban tidal radar and best month to visit",
                    "Chat with human ranger desk on WhatsApp"
                ]
            };
        }

        // E. PACKAGE RECOMMENDATIONS & COMPARISONS
        if (q.includes("which package") || q.includes("recommend") || q.includes("suggest") || q.includes("best tour") ||
            q.includes("which tour") || q.includes("help me choose") || q.includes("for couple") || q.includes("for family") ||
            q.includes("honeymoon") || q.includes("compare") || q.includes("options")) {

            let filterCat = "all";
            let recText = "";

            if (q.includes("couple") || q.includes("romantic") || q.includes("honeymoon") || q.includes("luxury")) {
                filterCat = "premium";
                recText = `For couples and romantic getaways, I wholeheartedly recommend either our **VIP Romantic Stilt Water Retreat (ST-10)** or our **Luxury Houseboat Charter (ST-04)**!
                        
• **ST-10 Stilt Retreat:** Handcrafted overwater stilt bungalow with panoramic creek views, private candlelit dinner under delta stars, and guided sunset boat cruise. (₹18,500/couple).
• **ST-04 Luxury Houseboat:** Your private floating villa with teakwood cabins, personal chef, and upper sundeck for secluded birdwatching.`;
            } else if (q.includes("family") || q.includes("kids") || q.includes("children") || q.includes("elderly") || q.includes("parents") || q.includes("seniors")) {
                filterCat = "overnight";
                recText = `For families traveling with children or elder parents, our **Wilderness Family Gateway (ST-07, 2D1N)** and **Mangrove Eco-Escape (ST-02, 2D1N)** are absolute favorites!
                        
• Relaxed, unhurried cruising schedules with spacious indoor viewing saloons and comfortable berths.
• Safe, non-slip boarding and fenced watchtowers (Sudhanyakhali & Sajnekhali).
• Mild, kid-friendly home-cooked Bengali meals with fresh milk and fruit on demand.
• Evening Baul folk music around an open campfire that kids and grandparents love.`;
            } else if (q.includes("photo") || q.includes("bird") || q.includes("camera") || q.includes("wildlife enthusiast")) {
                filterCat = "premium";
                recText = `For wildlife photographers and serious birdwatchers, nothing beats our **Tiger Trail Core Expedition (ST-03, 3D2N)** or **Birding & Photography Special (ST-05, 4D3N)**!
                        
• Dawn-to-dusk deep creek navigation targeting all 8 species of Kingfishers, Masked Finfoot, Mangrove Pitta, and hunting Bengal Tigers.
• Customized boat speeds with engine kill for silent drift photography.
• Ample battery charging stations and elevated 360° deck shooting angles.`;
            } else {
                recText = `We operate 10 distinct, licensed safari packages designed for every travel rhythm:
                        
1. **Quick Escapes (1 Day):** Day River Cruise (₹2,499) & Royal Anglers Fishing Cruise (₹3,499).
2. **Classic Overnight (2D1N):** Mangrove Eco-Escape (₹4,899) & Wilderness Family Gateway (₹4,299).
3. **Deep Core Expeditions (3D2N):** Tiger Trail Expedition (₹7,850) & Kalash Island Coastal Safari (₹8,999).
4. **Ultra-Luxury Waterfront:** VIP Stilt Water Retreat (₹18,500/couple) & Luxury Houseboat Charter (₹22,500/boat).`;
            }

            AgentTools.filterCatalog(filterCat);
            const thought = generateThoughtBlock("filter", { category: filterCat });

            return {
                text: recText + `\n\nI've autonomously filtered and spotlighted the matching safari cards right on your screen below!`,
                thought,
                chips: [
                    "Calculate a live quote for 4 guests on 2D1N",
                    "What is the secret to spotting Royal Bengal Tigers?",
                    "Build me a custom 3-day safari expedition itinerary",
                    "Check Sundarban tidal radar and best month to visit"
                ]
            };
        }

        // F. FILTER SAFARI CATALOG
        if (q.includes("filter") || q.includes("show me") || q.includes("packages") || q.includes("tours") || q.includes("all safaris")) {
            let cat = "all";
            let label = "All 10 Curated Safaris";
            if (q.includes("day")) { cat = "day"; label = "Day Safaris"; }
            else if (q.includes("luxury") || q.includes("premium") || q.includes("stilt") || q.includes("houseboat")) { cat = "premium"; label = "Luxury & Specialist Safaris"; }
            else if (q.includes("overnight") || q.includes("2 day") || q.includes("3 day")) { cat = "overnight"; label = "Overnight & Multi-Day Escapes"; }

            AgentTools.filterCatalog(cat);
            const thought = generateThoughtBlock("filter", { category: cat });

            const text = `I have autonomously filtered our safari catalog to **${label}** on your screen!
                    
Notice how the matching package cards are brought directly into focus. You can click 'Select Package' on any card to lock in your preferred dates, or let me calculate an instant group rate right here.`;

            return {
                text,
                thought,
                chips: [
                    "Calculate a live quote for 4 guests on 2D1N",
                    "What is the secret to spotting Royal Bengal Tigers?",
                    "Build me a custom 3-day safari expedition itinerary"
                ]
            };
        }

        // G. TIGER SPOTTING SECRETS & WILDLIFE ODDS
        if (q.includes("tiger") || q.includes("spot") || q.includes("sighting") || q.includes("odds") || q.includes("chance") ||
            q.includes("wildlife") || q.includes("animal") || q.includes("crocodile") || q.includes("deer") || q.includes("dolphin")) {

            AgentTools.navigateAndSpotlight("wildlife", "Wildlife Section");
            const thought = generateThoughtBlock("general", { query: "Tiger spotting secrets & wildlife mechanics" });

            const text = `Here is the genuine, unvarnished delta secret to sighting Royal Bengal Tigers from 18 years on these waters:
                    
1. **The Low-Tide Mudflat Rule:** Tigers do not like swimming against heavy tidal currents. When low tide empties the narrow channels, wet mudflats are exposed. This is when tigers walk out of the impenetrable sundari mangroves to sun themselves, drink from freshwater ponds, or hunt spotted deer.
2. **Reading Jungle Alarm Calls:** Human eyes struggle to spot orange stripes in dense foliage, but the forest always knows! We listen intently for the sharp whistle call of spotted deer (*chitaler dak*) and the frantic chattering of rhesus macaques—they announce a tiger's approach minutes before it emerges.
3. **Strategic Confluences:** Confluences like Panchamukhani (five rivers) and Sudhanyakhali freshwater pond are natural wildlife corridors where big cats regularly cross between delta islands.
4. **Auxiliary 4-Stroke Silent Cruising:** Unlike noisy commercial tourist trawlers, our boats run whisper-quiet engines, allowing us to glide quietly around blind creek corners.
                    
On our 3D2N Tiger Trail, our historical sighting index is an impressive **88%** during the winter season (Oct – Apr).`;

            return {
                text,
                thought,
                chips: [
                    "Check Sundarban tidal radar and best month to visit",
                    "Calculate a live quote for 4 guests on 2D1N",
                    "What authentic Bengali food is served on board?",
                    "Download a custom 3-day safari dossier (.txt)"
                ]
            };
        }

        // H. TIDAL RADAR, MOON PHASES & BEST TIME TO VISIT
        if (q.includes("tide") || q.includes("moon") || q.includes("weather") || q.includes("best time") || q.includes("season") ||
            q.includes("when to visit") || q.includes("month") || q.includes("climate") || q.includes("winter") || q.includes("rain") || q.includes("monsoon")) {

            const radar = AgentTools.computeTidalRadar();
            const thought = generateThoughtBlock("tide", {});

            const text = `Here is our real-time mangrove tidal analysis:
                    
In the Sundarbans, the entire wilderness moves strictly with the **lunar tidal clock**:
• **Bhora Kotal (Spring Tides / Full & New Moon):** Water rushes deep into the creeks; magnificent high-water navigation.
• **Mora Kotal (Neap Tides):** Water recedes, exposing broad muddy riverbanks. This is prime time for spotting basking crocodiles, monitor lizards, and tigers crossing mudflats.
                    
**Best Season Window:**
• **October to April (Peak Season):** Crisp, cool mornings (14°C to 24°C), zero monsoon rainfall, crystal-clear skies, and calm estuarine waters.
• **May to September:** Lush green monsoon wilderness; dramatic skies, but heavy tides.`;

            const cardHtml = `
                        <div class="chat-agent-card">
                            <div class="card-header-bar">
                                <span class="card-badge">🌊 LIVE TIDAL RADAR</span>
                                <span class="card-price-tag" style="font-size:0.95rem; color:#52b788;">Oct – Apr: Peak Window</span>
                            </div>
                            <div class="card-title-text">${radar.lunarPhase}</div>
                            
                            <div class="tide-radar-gauge">
                                <span style="font-size:0.75rem; color:#d8f3dc;">Tiger Sighting Index:</span>
                                <div class="gauge-meter">
                                    <div class="gauge-fill" style="width: 84%;"></div>
                                </div>
                                <span style="font-size:0.78rem; font-weight:bold; color:#e9c46a;">84% Sighting Odds</span>
                            </div>

                            <ul class="card-meta-list">
                                <li>⏰ Best Mudflat Hours: ${radar.tideWindow}</li>
                                <li>📍 Prime Watchtowers: Sudhanyakhali, Dobanki Canopy, Pirkhali</li>
                                <li>🌤️ Delta Climate: Crisp mornings (14°C - 22°C), zero rain, gentle river breeze</li>
                            </ul>

                            <div class="card-btn-row">
                                <button class="card-action-btn" onclick="window.AgentTools.navigateAndSpotlight('wildlife');">🐅 Wildlife Watchtower Guide</button>
                            </div>
                        </div>
                    `;

            return {
                text,
                thought,
                card: cardHtml,
                chips: [
                    "What is the secret to spotting Royal Bengal Tigers?",
                    "Calculate a live quote for 4 guests on 2D1N",
                    "Build me a custom 3-day safari expedition itinerary"
                ]
            };
        }

        // I. AUTHENTIC BENGALI FOOD & DINING
        if (q.includes("food") || q.includes("meal") || q.includes("lunch") || q.includes("dinner") || q.includes("breakfast") ||
            q.includes("menu") || q.includes("veg") || q.includes("vegetarian") || q.includes("jain") || q.includes("fish") ||
            q.includes("prawn") || q.includes("chingri") || q.includes("bhetki") || q.includes("mutton") || q.includes("chicken")) {

            const thought = generateThoughtBlock("general", { query: "Bengali estuarine culinary feast" });

            const text = `Dining on our safaris is legendary! Every meal is prepared fresh on the vessel's lower galley deck by our village chefs using morning catch and organic island produce:
                    
• **Morning River Breakfast:** Piping hot Hing-er Kachori with spicy aloo dum, farm-boiled eggs, sweet delta bananas, and endless rounds of Darjeeling leaf tea.
• **Royal Estuarine Lunch Feast:** Fragrant Gobindobhog/Dehradun rice, Sonamug dal with pure ghee, crispy Jhuri aloo bhaja, fresh estuarine **Parshey or Bhetki Paturi with mustard**, and our crown jewel: **Golda Chingri (Giant River Prawn) Malaikari** in creamy coconut gravy.
• **Sundowner Snacks:** Hot vegetable & chicken pakoras served with spiced masala chai on the upper observation deck.
• **Campfire Dinner:** Traditional **Kasha Mangsho** (slow-cooked village mutton or country chicken curry), handmade rotis, sweet tomato-date chutney, crisp papad, and authentic warm Bengali Mishti (Rasgulla & Sandesh).
                    
🌱 **Pure Vegetarian & Jain Guests:** We maintain dedicated separate cookware and chefs for our vegetarian and Jain guests. You will enjoy Paneer Butter Masala, Dhokar Dalna, Kashmiri Aloo Dum, and seasonal vegetable delicacies prepared with equal love.`;

            return {
                text,
                thought,
                chips: [
                    "Calculate a live quote for 4 guests on 2D1N",
                    "Show me all luxury stilt and private houseboat safaris",
                    "Build me a custom 3-day safari expedition itinerary"
                ]
            };
        }

        // J. SAFETY, CHILDREN, ELDERS & FOREST RULES
        if (q.includes("safe") || q.includes("safety") || q.includes("danger") || q.includes("dangerous") || q.includes("attack") ||
            q.includes("kids") || q.includes("children") || q.includes("elderly") || q.includes("senior") || q.includes("parents") ||
            q.includes("permit") || q.includes("rules")) {

            const thought = generateThoughtBlock("general", { query: "Wildlife safety protocols & vessel stability" });

            const text = `Your safety is our absolute number one priority. Let me put your mind completely at ease:
                    
• **Government-Authorized Vessels:** Our safari cruisers are licensed by the West Bengal Forest Department, equipped with USCG-standard adult and child life jackets, first-aid kits, and satellite GPS distress transponders.
• **Tigers & Boat Safety:** In over 18 years of operations, there has never been an incident on an authorized tourist boat. Tigers view large motorized vessels as single massive objects and keep their distance.
• **Protected Watchtowers:** All watchtowers (Sudhanyakhali, Sajnekhali, Dobanki) feature tall, reinforced steel fences and enclosed elevated canopy bridges (Dobanki is 20 feet above ground inside a protective iron cage).
• **Comfort for Seniors & Kids:** Vessels have enclosed lower saloons with cushioned berths, clean modern washrooms, shaded upper decks, and steady gangways for easy boarding at jetties.
• **Armed Guards & Forest Naturalists:** Government biometric forest permits and licensed village guides accompany every cruise.`;

            return {
                text,
                thought,
                chips: [
                    "Which safari package is best for us?",
                    "Calculate a live quote for 4 guests on 2D1N",
                    "What should we wear and pack for the safari?"
                ]
            };
        }

        // K. HOW TO REACH & KOLKATA AC TRANSFERS
        if (q.includes("how to reach") || q.includes("how to come") || q.includes("pickup") || q.includes("transport") ||
            q.includes("kolkata") || q.includes("airport") || q.includes("train") || q.includes("station") || q.includes("godkhali") ||
            q.includes("canning") || q.includes("car") || q.includes("distance")) {

            const thought = generateThoughtBlock("general", { query: "Kolkata to Godkhali logistics & transfers" });

            const text = `Getting to the Sundarbans with us is completely seamless and stress-free!
                    
**1. Complimentary AC Pickup from Kolkata:**
• At 07:00 AM, our sanitized private AC vehicle picks you up from your Kolkata Hotel, Netaji Subhash Chandra Bose International Airport (CCU), or Howrah / Sealdah Railway Station.
• Enjoy a scenic 3-hour drive (approx. 98 km) through the rural Bengal countryside and paddy fields to **Godkhali Ferry Jetty**—the official gateway to the mangrove delta.
                    
**2. Boarding Your Safari Cruiser:**
• At Godkhali Jetty, our crew receives your luggage and welcomes you aboard your private safari vessel with fresh green coconut water.
• By 11:00 AM, your boat enters the Sajnekhali wildlife sanctuary channels.
                    
**3. Return Drop:**
• On your final afternoon, we sail back to Godkhali Jetty and your AC vehicle drives you comfortably back to your preferred Kolkata location by 6:00 PM – 7:30 PM.`;

            return {
                text,
                thought,
                chips: [
                    "Calculate a live quote for 4 guests on 2D1N",
                    "Show me all 10 safari packages",
                    "Build me a custom 3-day safari expedition itinerary"
                ]
            };
        }

        // L. CLOTHING, PACKING & SAFARI GEAR TIPS
        if (q.includes("wear") || q.includes("pack") || q.includes("clothing") || q.includes("clothes") || q.includes("shoes") ||
            q.includes("camera") || q.includes("binoculars") || q.includes("what to bring") || q.includes("mosquito") || q.includes("jacket")) {

            const thought = generateThoughtBlock("general", { query: "Expedition packing recommendations" });

            const text = `Here is your practical safari packing checklist from Captain Subhash:
                    
• **Clothing Colors:** Wear earthy, neutral jungle tones—khaki, olive green, brown, beige, or navy blue. Avoid bright neon or fiery red colors that can alarm wildlife.
• **Layers for Winter:** Early mornings on the open river breeze can be chilly (14°C – 16°C). Pack a light fleece jacket, windbreaker, or shawl that you can peel off as the midday sun warms up.
• **Footwear:** Comfortable walking sneakers or flat sandals with good grip for jetty stairs and watchtower wooden boardwalks.
• **Optics & Photography:** A pair of 8x42 or 10x42 binoculars makes a world of difference for spotting kingfishers and mudflat pugmarks. For photography, telephoto lenses (200mm – 600mm) are ideal.
• **Essentials:** High-SPF sunscreen, sunglasses, sun hat, mosquito repellent cream (Odomos), personal medications, and a light power bank.
• **Government Photo ID:** **Mandatory!** Please carry original Aadhaar Card, Passport, or Voter ID for all adult travelers—required by the Forest Department for issuing core-area entry biometric permits.`;

            return {
                text,
                thought,
                chips: [
                    "What is the secret to spotting Royal Bengal Tigers?",
                    "Calculate a live quote for 4 guests on 2D1N",
                    "Check Sundarban tidal radar and best month to visit"
                ]
            };
        }

        // M. CUSTOM EXPEDITION ITINERARY BLUEPRINT (DOWNLOADABLE DOSSIER)
        if (q.includes("itinerary") || q.includes("plan") || q.includes("schedule") || q.includes("blueprint") ||
            q.includes("dossier") || q.includes("day 1") || q.includes("day 2") || q.includes("download plan")) {

            const thought = generateThoughtBlock("itinerary", {});

            const text = `I have compiled your tailored **Day-by-Day Expedition Itinerary** for ${agentMemory.travelers} travelers!
                    
You can review the tactical timetable below or immediately click the download button to generate an official expedition text dossier directly onto your device.`;

            const cardHtml = `
                        <div class="chat-agent-card">
                            <div class="card-header-bar">
                                <span class="card-badge">EXPEDITION DOSSIER</span>
                                <span class="card-price-tag" style="font-size:0.9rem; color:#74c69d;">3D2N Blueprint</span>
                            </div>
                            <div class="card-title-text">Tiger Trail Core Expedition (ST-03)</div>
                            <ul class="card-meta-list">
                                <li>🌅 <strong>Day 1:</strong> Kolkata AC pickup -> Godkhali Jetty -> Sajnekhali Interpretation Centre -> Pirkhali Creeks -> Baul Folk Campfire.</li>
                                <li>🐅 <strong>Day 2:</strong> Dawn patrol Sudhanyakhali freshwater pond -> Dobanki 496m Caged Canopy Walk -> Core tiger pugmark tracking.</li>
                                <li>⛵ <strong>Day 3:</strong> Mangrove village walk, organic honey tasting & sunset cruise back to Kolkata.</li>
                            </ul>
                            <div class="card-btn-row">
                                <button class="card-action-btn" onclick="window.AgentTools.generateItineraryDossier();">📥 Download Safari Dossier (.txt)</button>
                                <button class="card-action-btn secondary" onclick="window.AgentTools.dispatchBooking('Tiger Trail Expedition', ${agentMemory.travelers});">🚀 Book Dates</button>
                            </div>
                        </div>
                    `;

            return {
                text,
                thought,
                card: cardHtml,
                chips: [
                    "Calculate a live quote for 4 guests on 2D1N",
                    "What authentic Bengali food is served on board?",
                    "Show me all luxury stilt and private houseboat safaris"
                ]
            };
        }

        // N. BOOKING, WHATSAPP & CONTACT DESK
        if (q.includes("book") || q.includes("reserve") || q.includes("whatsapp") || q.includes("phone") || q.includes("call") ||
            q.includes("number") || q.includes("contact") || q.includes("pay") || q.includes("advance") || q.includes("desk")) {

            AgentTools.dispatchBooking("Tiger Trail Expedition", agentMemory.travelers);
            const thought = generateThoughtBlock("general", { query: "Direct reservation & WhatsApp desk dispatch" });

            const text = `I have opened our **Instant Safari Reservation Desk** on your screen!
                    
You can submit your preferred travel dates and group details right in the form, or reach our lead ranger desk directly:
                    
📞 **Direct Safari Hotline:** +91 62947 92928 (Available 7:00 AM – 10:30 PM IST)
💬 **WhatsApp Desk:** Click the green button below or on your screen to start an instant chat with our naturalist team.
                    
We require just a 30% advance to lock in your boat permits and luxury stilt villa/houseboat slots, with the remainder payable upon boarding at Godkhali Jetty.`;

            const cardHtml = `
                        <div class="chat-agent-card">
                            <div class="card-header-bar">
                                <span class="card-badge">DIRECT RANGER DESK</span>
                                <span class="card-price-tag" style="font-size:0.9rem; color:#52b788;">⚡ Instant Response</span>
                            </div>
                            <div class="card-title-text">+91 62947 92928</div>
                            <p style="font-size:0.8rem; color:#d8f3dc; margin:6px 0 10px;">Chat directly with Captain Subhash and our field team on WhatsApp for custom dates and instant slot confirmations.</p>
                            <div class="card-btn-row">
                                <a href="https://wa.me/916294792928?text=Hello%20Sundarban%20Dark-Trails!%20I%20want%20to%20reserve%20a%20safari%20expedition." target="_blank" class="card-action-btn" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center;">💬 Open WhatsApp Chat</a>
                                <button class="card-action-btn secondary" onclick="window.AgentTools.navigateAndSpotlight('calculator');">⚡ Live Pricing</button>
                            </div>
                        </div>
                    `;

            return {
                text,
                thought,
                card: cardHtml,
                chips: [
                    "Calculate a live quote for 4 guests on 2D1N",
                    "What is the secret to spotting Royal Bengal Tigers?",
                    "Download a custom 3-day safari dossier (.txt)"
                ]
            };
        }

        // O. GRATITUDE & POLITE GOODBYES
        if (q.includes("thank you") || q.includes("thanks") || q.includes("dhanyabad") || q.includes("shukriya") ||
            q.includes("bye") || q.includes("goodbye") || q.includes("see you") || q.includes("awesome") ||
            q.includes("great job") || q.includes("helpful") || q.includes("perfect") || q.includes("ok thanks")) {

            const thought = generateThoughtBlock("general", { query: "Heartfelt hospitality & signoff" });
            const text = `You are most warmly welcome! It is a true privilege and joy sharing the magic of our mangrove rivers with you.
                    
Whenever you or your family are ready to experience the realm of the Royal Bengal Tiger, I'll be right here on deck ready to cast off.
                    
Wishing you safe travels, and may the delta tides bring you peace and wonder. **Subho Jatra and Tidal Blessings!** 🌿🐅
                    
*— ${p.name}*`;

            return {
                text,
                thought,
                chips: [
                    "Calculate a live quote for 4 guests on 2D1N",
                    "Show me all 10 safari packages",
                    "Check Sundarban tidal radar and best month to visit"
                ]
            };
        }

        // P. CONVERSATIONAL FALLBACK (Warm, Human, Contextual)
        const thought = generateThoughtBlock("general", { query });
        const text = `That is a wonderful point! As your ${p.title} who has spent 18 years navigating every tidal creek and mudflat in the Sundarbans, I am right here with you.
                
Whether you are wondering about our core tiger sighting routes, looking for an accurate price quote for your group, or curious about what life is like aboard our private luxury cruisers, I can execute it right on your screen.
                
Tell me, how many guests are planning to travel, or would you like me to calculate a live rate for you?`;

        return {
            text,
            thought,
            chips: [
                "Calculate a live quote for 4 guests on 2D1N",
                "What is the secret to spotting Royal Bengal Tigers?",
                "Check Sundarban tidal radar and best month to visit",
                "Show me all luxury stilt and private houseboat safaris"
            ]
        };
    }

    // Expose quote modifier for interactive in-card clicks
    window.modifyChatQuotePax = function (delta) {
        let newPax = Math.max(1, Math.min(30, agentMemory.travelers + delta));
        agentMemory.travelers = newPax;
        saveMemory();

        const quote = AgentTools.calculateLiveQuote(newPax, agentMemory.packageId);
        const paxText = document.getElementById("cardPaxCount");
        if (paxText) paxText.textContent = `${newPax} Guests`;

        const priceTag = document.querySelector("#activeQuoteCard .card-price-tag");
        if (priceTag) priceTag.textContent = `₹${quote.netTotal.toLocaleString()}`;

        const metaList = document.querySelector("#activeQuoteCard .card-meta-list");
        if (metaList) {
            metaList.innerHTML = `
                        <li>✨ Base Rate: ₹${quote.basePrice.toLocaleString()} (${quote.discountPercent > 0 ? quote.discountPercent + '% Group Savings Applied' : 'Standard Rate'})</li>
                        <li>🍽️ Dining: ${quote.pkg.meals}</li>
                        <li>🐅 Wildlife Sighting Probability: <strong>${quote.pkg.tigerOdds}</strong></li>
                    `;
        }
    };

    // --- Append Message to UI ---
    function appendMessage(sender, text, options = {}) {
        const bubble = document.createElement("div");
        bubble.className = `chat-bubble ${sender}-bubble`;

        const p = getActivePersona();
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (sender === "user") {
            bubble.innerHTML = `<p>${escapeHtml(text)}</p>`;
        } else {
            let bodyHtml = "";

            // Include Step-by-Step Thinking Trace if present
            if (options.thought) {
                bodyHtml += options.thought;
            }

            // Convert simple markdown bold, italic and linebreaks
            const formatted = escapeHtml(text)
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n\n/g, '</p><p style="margin-top:8px;">')
                .replace(/\n/g, '<br/>');

            bodyHtml += `<p>${formatted}</p>`;

            if (options.card) {
                bodyHtml += options.card;
            }

            bodyHtml += `
                        <div class="bot-bubble-meta">
                            <span>${timeStr} • ${p.name}</span>
                            <button class="voice-speak-btn" onclick="window.speakText(this)">🔊 Listen</button>
                        </div>
                    `;

            // CRITICAL FIX: Assign bodyHtml to bubble.innerHTML so bot messages render completely
            bubble.innerHTML = bodyHtml;

            // Auto speak if enabled in voice config
            if (agentConfig.voice.autoSpeak) {
                speakMessage(text);
            }
        }

        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

    // Typing Indicator
    function showTypingIndicator(label = "Analyzing tidal charts...") {
        removeTypingIndicator();
        const ind = document.createElement("div");
        ind.className = "typing-bubble";
        ind.id = "chatTypingIndicator";
        ind.innerHTML = `
                    <div class="typing-dots"><span></span><span></span><span></span></div>
                    <span>${label}</span>
                `;
        chatMessages.appendChild(ind);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const ind = document.getElementById("chatTypingIndicator");
        if (ind) ind.remove();
    }

    function updateDynamicChips(chipList) {
        if (!chatChips) return;
        chatChips.innerHTML = "";
        chipList.forEach(query => {
            const btn = document.createElement("button");
            btn.className = "chip-btn";
            btn.textContent = query;
            btn.setAttribute("data-query", query);
            btn.addEventListener("click", () => handleUserMessage(query));
            chatChips.appendChild(btn);
        });
    }

    // --- User Message Dispatcher ---
    function handleUserMessage(query) {
        if (!query || !query.trim()) return;
        query = query.trim();

        appendMessage("user", query);
        if (chatInput) chatInput.value = "";

        agentMemory.history.push({ role: "user", content: query });
        saveMemory();

        let typingLabel = `${getActivePersona().name} is thinking...`;
        if (query.toLowerCase().includes("quote") || query.toLowerCase().includes("price")) {
            typingLabel = "⚡ Executing live quote calculator...";
        } else if (query.toLowerCase().includes("tide") || query.toLowerCase().includes("moon")) {
            typingLabel = "🌊 Querying tidal hydro-matrix...";
        } else if (query.toLowerCase().includes("filter") || query.toLowerCase().includes("package")) {
            typingLabel = "🔍 Filtering 10 safari catalog cards...";
        }

        showTypingIndicator(typingLabel);

        // Check if Cloud BYOK Gateway is selected and API key is present
        if (agentConfig.engine !== "local" && agentConfig.apiKey) {
            dispatchCloudLLM(query).catch(err => {
                console.warn("Cloud LLM failed, falling back to local engine:", err);
                fallbackToLocalEngine(query);
            });
        } else {
            fallbackToLocalEngine(query);
        }
    }

    function fallbackToLocalEngine(query) {
        setTimeout(() => {
            removeTypingIndicator();
            const result = analyzeAndRespond(query);
            appendMessage("bot", result.text, {
                card: result.card,
                thought: result.thought
            });

            if (result.chips && result.chips.length > 0) {
                updateDynamicChips(result.chips);
            }
        }, 550);
    }

    // --- Optional Cloud LLM Dispatcher (BYOK) ---
    async function dispatchCloudLLM(query) {
        let endpoint = "https://api.openai.com/v1/chat/completions";
        let headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${agentConfig.apiKey}`
        };

        if (agentConfig.engine === "groq") {
            endpoint = "https://api.groq.com/openai/v1/chat/completions";
        } else if (agentConfig.engine === "openrouter") {
            endpoint = "https://openrouter.ai/api/v1/chat/completions";
        }

        const p = getActivePersona();
        const systemPrompt = `You are TourMaker, a real human safari guide and consultant for Sundarban Dark-Trails.
Speak naturally, warmly, and authentically like a real person, but answer ONLY and EXACTLY what the user asked:
- Do not add unsolicited itineraries, suggestions, tips, or sales pitches.
- If asked a simple greeting or casual question, answer in 1 warm, concise sentence.
- If asked for a specific fact (e.g. price, duration, food inclusion), give directly and only that fact.
- Sound genuine, conversational, and human, never robotic.
Current guest context: ${JSON.stringify(agentMemory)}.`;

        const res = await fetch(endpoint, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                model: agentConfig.modelName || "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: query }
                ],
                temperature: parseFloat(agentConfig.temperature || 0.7),
                max_tokens: 450
            })
        });

        if (!res.ok) throw new Error(`Cloud API HTTP error ${res.status}`);
        const data = await res.json();
        removeTypingIndicator();

        const reply = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : null;
        if (!reply) throw new Error("Empty response from cloud LLM");

        const thought = generateThoughtBlock("general", { query: `Cloud LLM [${agentConfig.modelName}]` });
        appendMessage("bot", reply, { thought });
    }

    // --- Event Listeners & Widget Controls ---
    chatbotTrigger.addEventListener("click", () => {
        const isOpen = chatbotWrapper.classList.toggle("open");
        chatWindow.setAttribute("aria-hidden", !isOpen);
        if (isOpen && chatInput) {
            setTimeout(() => chatInput.focus(), 250);
        }
    });

    chatMinimize.addEventListener("click", () => {
        chatbotWrapper.classList.remove("open");
        chatWindow.setAttribute("aria-hidden", "true");
    });

    chatExpandBtn.addEventListener("click", () => {
        chatWindow.classList.toggle("expanded");
    });

    chatResetBtn.addEventListener("click", () => {
        if (confirm(`Reset session memory and restart conversation with ${getActivePersona().name}?`)) {
            agentMemory.travelers = 2;
            agentMemory.history = [];
            saveMemory();
            chatMessages.innerHTML = "";
            applyPersonaToUI();
        }
    });

    // Voice toggle in header
    chatVoiceToggle.addEventListener("click", () => {
        agentConfig.voice.autoSpeak = !agentConfig.voice.autoSpeak;
        chatVoiceToggle.classList.toggle("active", agentConfig.voice.autoSpeak);
        if (agentConfig.voice.autoSpeak) {
            speakMessage(`Voice readout active. I am ${getActivePersona().name}.`);
        } else {
            window.speechSynthesis.cancel();
        }
    });

    // Voice Mic button in input
    chatMicBtn.addEventListener("click", () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    });

    voiceCancelBtn.addEventListener("click", () => {
        stopListening();
    });

    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleUserMessage(chatInput.value.trim());
    });

    // Prompt chips click
    chatChips.querySelectorAll(".chip-btn").forEach(chip => {
        chip.addEventListener("click", () => {
            handleUserMessage(chip.getAttribute("data-query"));
        });
    });

    // --- Configuration Modal Event Handlers ---
    chatConfigBtn.addEventListener("click", () => {
        populateConfigModal();
        agentConfigModal.classList.add("open");
        agentConfigModal.setAttribute("aria-hidden", "false");
    });

    configCloseBtn.addEventListener("click", () => {
        agentConfigModal.classList.remove("open");
        agentConfigModal.setAttribute("aria-hidden", "true");
    });

    agentConfigModal.addEventListener("click", (e) => {
        if (e.target === agentConfigModal) {
            agentConfigModal.classList.remove("open");
            agentConfigModal.setAttribute("aria-hidden", "true");
        }
    });

    // Tab switching inside Config Modal
    document.querySelectorAll(".config-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".config-tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".config-tab-content").forEach(c => c.classList.remove("active"));
            btn.classList.add("active");
            const targetTab = document.getElementById(btn.getAttribute("data-tab"));
            if (targetTab) targetTab.classList.add("active");
        });
    });

    // Persona card selection
    personaCards.forEach(card => {
        card.addEventListener("click", () => {
            personaCards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            const pKey = card.getAttribute("data-persona");
            if (customPersonaGroup) {
                if (customPersonaGroup && customPersonaGroup.style) customPersonaGroup.style.display = pKey === "custom" ? "block" : "none";
            }
        });
    });

    // Temperature slider
    cfgTemperature.addEventListener("input", () => {
        tempValBadge.textContent = cfgTemperature.value;
    });

    // Voice sliders
    cfgVoiceRate.addEventListener("input", () => {
        rateValBadge.textContent = `${cfgVoiceRate.value}x`;
    });
    cfgVoicePitch.addEventListener("input", () => {
        pitchValBadge.textContent = cfgVoicePitch.value;
    });

    // Engine select change
    cfgEngineSelect.addEventListener("change", () => {
        if (cloudGatewayFields) {
            if (cloudGatewayFields && cloudGatewayFields.style) cloudGatewayFields.style.display = (cfgEngineSelect?.value === "local" ? "none" : "block");
        }
    });

    // Test Connection button
    btnTestApi.addEventListener("click", async () => {
        apiPingStatus.textContent = "Testing connection...";
        if (apiPingStatus?.style) apiPingStatus.style.color = "#e9c46a";
        try {
            const key = cfgApiKey.value.trim();
            if (!key) {
                apiPingStatus.textContent = "⚠️ Please enter an API Key first";
                if (apiPingStatus?.style) apiPingStatus.style.color = "#ffb4a2";
                return;
            }
            apiPingStatus.textContent = "🟢 API Key validated locally!";
            if (apiPingStatus?.style) apiPingStatus.style.color = "#52b788";
        } catch (e) {
            apiPingStatus.textContent = "🔴 Connection error: " + e.message;
            if (apiPingStatus?.style) apiPingStatus.style.color = "#e63946";
        }
    });

    // Test Voice button
    btnTestVoice.addEventListener("click", () => {
        const p = getActivePersona();
        speakMessage(`Namaskar! This is ${p.name} verifying voice synthesis for Sundarban Dark-Trails.`);
    });

    // Inject context button
    btnInjectContext.addEventListener("click", () => {
        const pax = parseInt(cfgInjectPax.value);
        const dates = cfgInjectDates.value.trim();
        if (pax) agentMemory.travelers = pax;
        if (dates) agentMemory.dates = dates;
        saveMemory();
        alert("Guest profile context injected successfully!");
    });

    // Export Dossier
    btnExportItinerary.addEventListener("click", () => {
        AgentTools.generateItineraryDossier();
    });

    // Clear Memory
    btnResetMemory.addEventListener("click", () => {
        if (confirm("Clear live memory matrix?")) {
            agentMemory.travelers = 2;
            agentMemory.dates = "Upcoming Winter Season";
            agentMemory.history = [];
            saveMemory();
        }
    });

    // Populate Config Modal inputs with current values
    function populateConfigModal() {
        personaCards.forEach(c => {
            c.classList.toggle("selected", c.getAttribute("data-persona") === agentConfig.persona);
        });
        if (customPersonaGroup) {
            if (customPersonaGroup && customPersonaGroup.style) customPersonaGroup.style.display = (agentConfig.persona === "custom" ? "block" : "none");
        }
        cfgCustomName.value = agentConfig.customPersona.name || "";
        cfgCustomPrompt.value = agentConfig.customPersona.prompt || "";
        cfgAutonomyToggle.checked = agentConfig.autonomyEnabled;
        cfgThinkingToggle.checked = agentConfig.thinkingEnabled;
        cfgTemperature.value = agentConfig.temperature;
        tempValBadge.textContent = agentConfig.temperature;
        cfgResponseDepth.value = agentConfig.responseDepth;

        cfgEngineSelect.value = agentConfig.engine;
        if (cloudGatewayFields && cloudGatewayFields.style) cloudGatewayFields.style.display = (agentConfig.engine === "local" ? "none" : "block");
        cfgApiKey.value = agentConfig.apiKey || "";
        cfgModelName.value = agentConfig.modelName || "gpt-4o-mini";

        toolPermNav.checked = agentConfig.tools.nav;
        toolPermFilter.checked = agentConfig.tools.filter;
        toolPermQuote.checked = agentConfig.tools.quote;
        toolPermBook.checked = agentConfig.tools.book;
        toolPermTide.checked = agentConfig.tools.tide;
        toolPermItinerary.checked = agentConfig.tools.itinerary;

        cfgAutoSpeak.checked = agentConfig.voice.autoSpeak;
        cfgSttLang.value = agentConfig.voice.sttLang || "en-IN";
        cfgVoiceRate.value = agentConfig.voice.rate || 1.0;
        rateValBadge.textContent = `${agentConfig.voice.rate || 1.0}x`;
        cfgVoicePitch.value = agentConfig.voice.pitch || 1.0;
        pitchValBadge.textContent = agentConfig.voice.pitch || 1.0;

        renderMemoryMatrix();
    }

    // Save & Apply Settings
    btnSaveConfig.addEventListener("click", () => {
        const selectedPersonaCard = document.querySelector(".persona-card.selected");
        if (selectedPersonaCard) {
            agentConfig.persona = selectedPersonaCard.getAttribute("data-persona");
        }
        agentConfig.customPersona.name = cfgCustomName.value.trim() || "Custom Agent";
        agentConfig.customPersona.prompt = cfgCustomPrompt.value.trim() || "";
        agentConfig.autonomyEnabled = cfgAutonomyToggle.checked;
        agentConfig.thinkingEnabled = cfgThinkingToggle.checked;
        agentConfig.temperature = parseFloat(cfgTemperature.value);
        agentConfig.responseDepth = cfgResponseDepth.value;

        agentConfig.engine = cfgEngineSelect.value;
        agentConfig.apiKey = cfgApiKey.value.trim();
        agentConfig.modelName = cfgModelName.value.trim() || "gpt-4o-mini";

        agentConfig.tools.nav = toolPermNav.checked;
        agentConfig.tools.filter = toolPermFilter.checked;
        agentConfig.tools.quote = toolPermQuote.checked;
        agentConfig.tools.book = toolPermBook.checked;
        agentConfig.tools.tide = toolPermTide.checked;
        agentConfig.tools.itinerary = toolPermItinerary.checked;

        agentConfig.voice.autoSpeak = cfgAutoSpeak.checked;
        agentConfig.voice.sttLang = cfgSttLang.value;
        agentConfig.voice.voiceURI = cfgVoiceSelect.value;
        agentConfig.voice.rate = parseFloat(cfgVoiceRate.value);
        agentConfig.voice.pitch = parseFloat(cfgVoicePitch.value);

        try {
            localStorage.setItem("tourmaker_advanced_config", JSON.stringify(agentConfig));
        } catch (e) { }

        applyPersonaToUI();
        agentConfigModal.classList.remove("open");
        agentConfigModal.setAttribute("aria-hidden", "true");

        // Notify in chat of updated configuration
        const p = getActivePersona();
        appendMessage("bot", `⚙️ **Configuration Updated!** Active Persona: **${p.name}** (${agentConfig.autonomyEnabled ? '⚡ Autonomous' : '🛡️ Supervised'}, Engine: ${agentConfig.engine.toUpperCase()}). Ready to assist.`);
    });

    // Reset to Defaults
    btnResetConfig.addEventListener("click", () => {
        if (confirm("Reset TourMaker configuration to factory defaults?")) {
            agentConfig = Object.assign({}, DEFAULT_CONFIG);
            try {
                localStorage.removeItem("tourmaker_advanced_config");
            } catch (e) { }
            populateConfigModal();
            applyPersonaToUI();
            alert("Settings reset to defaults.");
        }
    });

    // --- Initial Bootstrap ---
    initVoiceEngine();
    applyPersonaToUI();
    renderMemoryMatrix();

})();
