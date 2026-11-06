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
