// Archior Interior Design - Interactive Application Logic

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSwatchSelector();
  initBeforeAfterSlider();
  initCostEstimator();
  initConsultationModal();
  initReviewsCarousel();
  initTurnkeyGallery();
  initQuickBookingForm();
  initSmoothScroll();
});

// 1. Mobile Menu Drawer
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('closeMobileMenuBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('mobileNavBackdrop');
  const links = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  }

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// 2. Swatch Selector (Signature Furniture Showcase)
function initSwatchSelector() {
  const swatches = document.querySelectorAll('.swatch-btn');
  const showcaseImg = document.getElementById('showcaseProductImg');
  const swatchName = document.getElementById('selectedSwatchName');
  const chairDesc = document.getElementById('chairDescriptionText');

  const swatchData = {
    olive: {
      name: 'Forest Olive Velvet',
      desc: 'Deep olive green velvet upholstery with hand-turned teakwood frame and acoustic foam cushioning.',
      img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80'
    },
    sand: {
      name: 'Sandstone Bouclé',
      desc: 'Warm organic bouclé textured fabric with white oak base, bringing subtle Mediterranean warmth to modern spaces.',
      img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80'
    },
    charcoal: {
      name: 'Espresso Walnut Leather',
      desc: 'Supple full-grain Italian leather paired with charred walnut legs for an authoritative executive or study aesthetic.',
      img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1000&q=80'
    }
  };

  swatches.forEach(btn => {
    btn.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active', 'ring-2', 'ring-offset-2', 'ring-[#27382B]'));
      btn.classList.add('active', 'ring-2', 'ring-offset-2', 'ring-[#27382B]');

      const key = btn.dataset.swatch;
      if (swatchData[key]) {
        if (showcaseImg) {
          showcaseImg.style.opacity = '0.3';
          setTimeout(() => {
            showcaseImg.src = swatchData[key].img;
            showcaseImg.style.opacity = '1';
          }, 200);
        }
        if (swatchName) swatchName.textContent = swatchData[key].name;
        if (chairDesc) chairDesc.textContent = swatchData[key].desc;
      }
    });
  });
}

// 3. Before & After Interactive Slider
function initBeforeAfterSlider() {
  const slider = document.querySelector('.ba-slider');
  if (!slider) return;

  const beforeImage = slider.querySelector('.before-image');
  const handle = slider.querySelector('.slider-handle');
  let isDragging = false;

  function setSliderPosition(x) {
    const rect = slider.getBoundingClientRect();
    let pos = ((x - rect.left) / rect.width) * 100;
    if (pos < 0) pos = 0;
    if (pos > 100) pos = 100;

    beforeImage.style.width = `${pos}%`;
    handle.style.left = `${pos}%`;
  }

  // Mouse Events
  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  // Touch Events for Mobile
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.touches[0].clientX);
  }, { passive: true });
}

// 4. Interactive Interior Cost Estimator
function initCostEstimator() {
  const bhkButtons = document.querySelectorAll('.bhk-choice');
  const tierRadios = document.querySelectorAll('input[name="tier"]');
  const addonCheckboxes = document.querySelectorAll('.addon-check');
  const totalDisplay = document.getElementById('estimatedCostDisplay');
  const timelineDisplay = document.getElementById('estimatedTimelineDisplay');
  const sqftDisplay = document.getElementById('estimatedSqftDisplay');
  const whatsappQuoteBtn = document.getElementById('estimatorWhatsappBtn');

  // Base configurations
  const bhkSpecs = {
    '1bhk': { sqft: 580, baseCost: 450000, days: '35 - 40 Days' },
    '2bhk': { sqft: 920, baseCost: 780000, days: '45 - 55 Days' },
    '3bhk': { sqft: 1350, baseCost: 1150000, days: '55 - 70 Days' },
    'villa': { sqft: 2200, baseCost: 1950000, days: '75 - 90 Days' },
    'office': { sqft: 1100, baseCost: 890000, days: '40 - 50 Days' }
  };

  const tierMultipliers = {
    'essential': 1.0,
    'premium': 1.35,
    'luxury': 1.75
  };

  let currentBhk = '2bhk';
  let currentTier = 'premium';

  function calculateEstimate() {
    const spec = bhkSpecs[currentBhk];
    const multiplier = tierMultipliers[currentTier];
    let total = spec.baseCost * multiplier;

    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        total += parseInt(cb.value, 10);
      }
    });

    // Formatting as Indian Currency (INR)
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(total);

    if (totalDisplay) totalDisplay.textContent = formatted;
    if (timelineDisplay) timelineDisplay.textContent = spec.days;
    if (sqftDisplay) sqftDisplay.textContent = `${spec.sqft} sq.ft. avg.`;

    if (whatsappQuoteBtn) {
      const bhkName = currentBhk.toUpperCase();
      const msg = encodeURIComponent(`Hi Archior Interior Design, I used your website estimator for a ${bhkName} (${currentTier} tier, approx ${formatted}). I'd like to book a free site consultation.`);
      whatsappQuoteBtn.href = `https://wa.me/919619053879?text=${msg}`;
    }
  }

  bhkButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      bhkButtons.forEach(b => {
        b.classList.remove('bg-[#27382B]', 'text-white');
        b.classList.add('bg-white', 'text-stone-700', 'border-stone-200');
      });
      btn.classList.add('bg-[#27382B]', 'text-white');
      btn.classList.remove('bg-white', 'text-stone-700', 'border-stone-200');

      currentBhk = btn.dataset.bhk;
      calculateEstimate();
    });
  });

  tierRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentTier = e.target.value;
      calculateEstimate();
    });
  });

  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', calculateEstimate);
  });

  calculateEstimate();
}

// 5. Consultation Modal & Lead Handling
function initConsultationModal() {
  const modal = document.getElementById('consultationModal');
  const openButtons = document.querySelectorAll('.open-consultation-btn');
  const closeBtn = document.getElementById('closeModalBtn');
  const form = document.getElementById('consultationForm');

  function openModal(defaultService = '') {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (defaultService) {
        const select = modal.querySelector('select[name="service"]');
        if (select) select.value = defaultService;
      }
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.dataset.service || '';
      openModal(service);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value;
      const phone = form.querySelector('[name="phone"]').value;
      const spaceType = form.querySelector('[name="space_type"]').value;
      const notes = form.querySelector('[name="notes"]').value;

      closeModal();
      showToast(`Thank you, ${name}! Your consultation request for ${spaceType} has been received. Our principal designer will call you at ${phone}.`);
      form.reset();

      // Also trigger optional WhatsApp follow-up
      setTimeout(() => {
        const prefill = encodeURIComponent(`Hi Archior Interior, I just booked a consultation via your website. Name: ${name}, Phone: ${phone}, Space: ${spaceType}, Note: ${notes}`);
        window.open(`https://wa.me/919619053879?text=${prefill}`, '_blank');
      }, 1000);
    });
  }
}

// 6. Reviews Carousel
function initReviewsCarousel() {
  const container = document.getElementById('reviewsContainer');
  const prevBtn = document.getElementById('prevReviewBtn');
  const nextBtn = document.getElementById('nextReviewBtn');

  if (!container || !prevBtn || !nextBtn) return;

  const scrollAmount = 360;

  nextBtn.addEventListener('click', () => {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', () => {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
}

// 6b. Turnkey Showcase Gallery Slider
function initTurnkeyGallery() {
  const prevBtn = document.getElementById('turnkeyPrevBtn');
  const nextBtn = document.getElementById('turnkeyNextBtn');
  const imgElement = document.getElementById('turnkeyMainPhoto');
  if (!prevBtn || !nextBtn || !imgElement) return;

  const slides = [
    {
      img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80',
      label: 'Curated Living Suite · Taloja Panchanand'
    },
    {
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      label: 'Designer Modular Kitchen & Lighting · Panvel'
    },
    {
      img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
      label: 'Luxury Master Bedroom Suite & Civil Paneling · Navi Mumbai'
    }
  ];

  let currentIndex = 0;

  function updateSlide(idx) {
    imgElement.style.opacity = '0.3';
    setTimeout(() => {
      imgElement.src = slides[idx].img;
      const labelBadge = imgElement.parentElement.querySelector('.absolute.bottom-4 span');
      if (labelBadge) labelBadge.textContent = slides[idx].label;
      imgElement.style.opacity = '1';
    }, 200);
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlide(currentIndex);
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlide(currentIndex);
  });
}

// 7. Quick Booking Form (Bottom Banner)
function initQuickBookingForm() {
  const form = document.getElementById('quickBookingForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const contactInput = form.querySelector('input[type="text"], input[type="tel"]').value;
    if (contactInput.trim().length > 5) {
      showToast(`Thank you! We have registered ${contactInput}. We will send your free 3D design catalog immediately.`);
      form.reset();
    } else {
      showToast('Please provide a valid phone number or email.');
    }
  });
}

// 8. Toast Notification Utility
function showToast(message) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg class="w-6 h-6 text-[#C29B53] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <span class="text-sm font-medium leading-snug">${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}

// 9. Smooth Scroll Helpers
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
