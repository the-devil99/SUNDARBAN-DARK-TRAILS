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
  // DELTABOT - AI SAFARI ASSISTANT ENGINE
  // =========================================================

  const chatbotWrapper = document.getElementById('chatbotWrapper');
  const chatbotTrigger = document.getElementById('chatbotTrigger');
  const chatMinimize = document.getElementById('chatMinimize');
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatChips = document.getElementById('chatChips');

  // Toggle Chatbot Open/Close
  chatbotTrigger.addEventListener('click', () => {
    chatbotWrapper.classList.toggle('open');
    if (chatbotWrapper.classList.contains('open')) {
      chatInput.focus();
    }
  });

  chatMinimize.addEventListener('click', () => {
    chatbotWrapper.classList.remove('open');
  });

  // Knowledge Base & Intent Matching Rules
  const aiKnowledgeBase = [
    {
      keywords: ['best time', 'season', 'month', 'when to visit', 'winter', 'summer', 'weather'],
      answer: "The prime season for Sundarban is **October to March**. Temperatures stay between 15°C and 25°C, and wildlife like Royal Bengal Tigers and saltwater crocodiles frequently come out to riverbanks to sunbathe. April to June is warmer with fewer crowds, while monsoon (July–Sept) is lush but creek access is limited."
    },
    {
      keywords: ['tiger', 'sight', 'sighting', 'chance', 'probability', 'bengal tiger', 'see tiger'],
      answer: "Over 100+ Royal Bengal Tigers inhabit the Indian Sundarbans. Sighting probabilities are highest during low tide between November and February around the sweetwater ponds of **Sudhanyakhali Watchtower**, **Dobanki**, and **Pirkhali creek**. While wild sightings are never 100% guaranteed, our guides track fresh pugmarks and monkey alarm calls to maximize chances!"
    },
    {
      keywords: ['permit', 'id', 'document', 'passport', 'visa', 'aadhaar', 'entry'],
      answer: "Yes, government forest permits are mandatory. Indian citizens need any valid Government Photo ID (Aadhaar, Voter ID, or Driving License). Foreign nationals must carry their original **Passport and valid Indian Visa**. Don't worry—our team processes all licenses at Sajnekhali Range before you board!"
    },
    {
      keywords: ['houseboat', 'luxury', 'private boat', 'vip', 'charter'],
      answer: "Our **Luxury Houseboat Charter (2D/1N)** is ₹16,500/person (min 4 guests). It features private glass-panel AC staterooms, an upper sundeck lounge, an onboard master chef cooking bespoke delta delicacies, and a motorized silent dinghy for narrow creeks. Includes private Kolkata doorstep Innova transfers!",
      action: { label: "Book Luxury Charter", plan: "Luxury Houseboat Charter" }
    },
    {
      keywords: ['food', 'meal', 'lunch', 'dinner', 'fish', 'bhetki', 'veg', 'vegetarian', 'prawn', 'hilsa'],
      answer: "All meals are freshly prepared on board! Menu includes: Morning tea & luchi with alur dom; buffet lunch with steamed rice, dal, local river **Bhetki / Golda Chingri (Prawns)** or Chicken; evening tea with hot snacks; and dinner. 100% pure vegetarian or Jain meals are easily arranged on request."
    },
    {
      keywords: ['price', 'cost', 'rate', 'package', 'charges', 'how much'],
      answer: "We offer 5 curated packages:\n• **1-Day River Cruise:** ₹2,499/person\n• **2D/1N Mangrove Eco-Escape:** ₹5,999/person\n• **3D/2N Tiger Trail Expedition:** ₹9,499/person\n• **4D/3N Birding & Photo Special:** ₹14,999/person\n• **Luxury Houseboat Charter:** ₹16,500/person\nAll prices include permits, boat cruise, naturalist, and all meals!",
      action: { label: "Open Cost Estimator", scroll: "#calculator" }
    },
    {
      keywords: ['pickup', 'kolkata', 'reach', 'how to reach', 'godkhali', 'canning', 'transport'],
      answer: "You can reach via:\n1. **Our Kolkata AC Shared Coach:** Departs 6:30 AM from Science City (+₹1,200/p).\n2. **Private AC Sedan:** Doorstep pickup anywhere in Kolkata (+₹4,800 flat).\n3. **Self-Drive:** Drive 82 km (approx 3 hrs) from Kolkata to Godkhali Ferry Ghat (safe parking available)."
    },
    {
      keywords: ['safe', 'safety', 'kid', 'child', 'senior', 'elderly', 'danger'],
      answer: "Sundarban safaris are very safe! Visitors remain on certified motorized double-decker boats with high safety railings and visit high-walled, wire-fenced watchtowers. Stepping on forest ground is legally prohibited. Boats have clean western washrooms and first aid kits."
    },
    {
      keywords: ['book', 'reservation', 'contact', 'number', 'phone', 'whatsapp'],
      answer: "You can book directly through our reservation modal or speak with our Kolkata safari desk on WhatsApp at **+91 62947 92926**.",
      action: { label: "Open Booking Form", openModal: true }
    }
  ];

  // Fallback response for unmapped queries
  const defaultFallback = "That's a great question! For custom group itineraries, special permits, or specific boat charter availability, connect directly with our head naturalist on WhatsApp (+91 62947 92926).";

  // Intent resolution function
  function getAIResponse(userText) {
    const cleanText = userText.toLowerCase().trim();

    for (const item of aiKnowledgeBase) {
      const match = item.keywords.some(kw => cleanText.includes(kw));
      if (match) {
        return item;
      }
    }

    return { answer: defaultFallback, action: { label: "Chat on WhatsApp", whatsapp: true } };
  }

  // Render Bot Message with typing animation
  function appendMessage(sender, text, action = null) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}-bubble`;

    // Convert markdown bold to HTML
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
    bubble.innerHTML = `<p>${formattedText}</p><span class="msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>`;

    // Append action CTA if provided
    if (action) {
      const actionBtn = document.createElement('button');
      actionBtn.className = 'chat-action-btn';
      actionBtn.textContent = action.label;

      actionBtn.addEventListener('click', () => {
        if (action.openModal || action.plan) {
          openBookingModal(action.plan || 'Mangrove Eco-Escape', 2);
          chatbotWrapper.classList.remove('open');
        } else if (action.scroll) {
          document.querySelector(action.scroll).scrollIntoView({ behavior: 'smooth' });
          chatbotWrapper.classList.remove('open');
        } else if (action.whatsapp) {
          window.open('https://wa.me/916294792926?text=Hello%20Sundarban%20Trails,%20I%20have%20a%20question%20about%20safaris', '_blank');
        }
      });

      bubble.appendChild(actionBtn);
    }

    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Show Animated Typing Indicator
  function showTypingIndicator() {
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-bubble bot-bubble typing-indicator';
    typingEl.id = 'botTyping';
    typingEl.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    chatMessages.appendChild(typingEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const typingEl = document.getElementById('botTyping');
    if (typingEl) typingEl.remove();
  }

  // Process User Input
  function handleUserMessage(query) {
    if (!query) return;

    appendMessage('user', query);
    chatInput.value = '';

    showTypingIndicator();

    // Natural 650ms typing delay
    setTimeout(() => {
      removeTypingIndicator();
      const aiResult = getAIResponse(query);
      appendMessage('bot', aiResult.answer, aiResult.action || null);
    }, 650);
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleUserMessage(chatInput.value.trim());
  });

  // Handle Quick Suggestion Chip clicks
  chatChips.querySelectorAll('.chip-btn').forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      handleUserMessage(query);
    });
  });
