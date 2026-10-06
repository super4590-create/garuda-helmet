    // ── LIGHTBOX / INSTANT IMAGE PREVIEW CONTROLLER ──
    function openLightbox(src, title) {
      const modal = document.getElementById('image-lightbox-modal');
      const img = document.getElementById('lightbox-img');
      const titleElem = document.getElementById('lightbox-title');
      if (img) {
        img.src = src;
        img.alt = title || 'Product Image Preview';
      }
      if (titleElem) {
        titleElem.textContent = title || 'Product Image';
      }
      if (modal) {
        modal.classList.add('is-open');
      }
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox(e) {
      if (e && e.target && e.target.closest && e.target.closest('.lightbox-dialog') && !e.target.classList.contains('lightbox-close-btn')) {
        return;
      }
      const modal = document.getElementById('image-lightbox-modal');
      if (modal) {
        modal.classList.remove('is-open');
      }
      document.body.style.overflow = '';
    }

    function selectAndOpenLightbox(radioId, src, title) {
      const radio = document.getElementById(radioId);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
      openLightbox(src, title);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });

    window.openLightbox = openLightbox;
    window.closeLightbox = closeLightbox;
    window.selectAndOpenLightbox = selectAndOpenLightbox;

    const FSPREE = "xlgpqobr";
    let activeStep = 1;
    const MAX_STEPS = 3;

    // Survey Answers State
    const surveyAnswers = {
      occupation: '',
      occupation_other: '',
      ride_frequency: '',
      ride_purpose: [],
      smart_devices: [],
      smart_devices_other: '',
      riding_problems: [],
      riding_problems_other: '',
      biggest_problem: '',
      dangerous_experience: '',
      dangerous_experience_details: '',

      desired_features: [],
      product_preference: '',
      smartshield_price: '',
      modsmart_price: '',
      purchase_barriers: [],
      purchase_barriers_other: '',

      trust_factors: [],
      purchase_intent: '',
      current_helmet_brand: '',
      current_helmet_price: '',
      product_feedback: '',

      name: '',
      phone: '',
      email: '',
      early_access: true
    };

    // DOM Elements
    const macWindow = document.getElementById('mac-app-window');
    const windowBadge = document.getElementById('window-step-badge');
    const winBackBtn = document.getElementById('win-back-btn');
    const winContinueBtn = document.getElementById('win-continue-btn');
    const winContinueLabel = document.getElementById('win-continue-label');
    const winFooterLabel = document.getElementById('win-footer-label');
    const winFooter = document.getElementById('mac-window-footer');
    const scrollContainer = document.getElementById('mac-window-scrollable');
    const trackProgress = document.getElementById('steps-track-progress');
    const optinBox = document.getElementById('ea_optin_box');
    const submitTxt = document.getElementById('submit-text-elem');

    // ── STEP LABELS MAP (BILINGUAL) ──
    const STEP_NAMES = {
      en: {
        1: "Step 1 of 3: Rider Profile",
        2: "Step 2 of 3: Features & Pricing",
        3: "Step 3 of 3: Trust & Launch Access"
      },
      hi: {
        1: "चरण 1 (कुल 3): राइडर प्रोफ़ाइल",
        2: "चरण 2 (कुल 3): फीचर्स और मूल्य",
        3: "चरण 3 (कुल 3): विश्वास और अर्ली एक्सेस"
      }
    };

    // ── UPDATE STEP HUD & WINDOW CHROME ──
    function updateHUD(step) {
      window.activeStep = activeStep = step;

      // Update Top Step Nodes (01, 02, 03)
      for (let i = 1; i <= 3; i++) {
        const node = document.getElementById(`node-step-${i}`);
        if (!node) continue;
        node.classList.remove('is-active', 'is-done');
        if (i < step) {
          node.classList.add('is-done');
        } else if (i === step) {
          node.classList.add('is-active');
        }
      }

      // Update connecting line progress
      if (trackProgress) {
        if (step === 1) trackProgress.style.width = '0%';
        else if (step === 2) trackProgress.style.width = '50%';
        else if (step === 3) trackProgress.style.width = '100%';
      }

      // Update Window Chrome Title Badge
      if (windowBadge) {
        windowBadge.textContent = window.currentLang === 'hi' ? `चरण ${step} (कुल 3)` : `STEP ${step} OF 3`;
      }

      // Update Window Footer Status
      if (winFooterLabel) {
        const langMap = STEP_NAMES[window.currentLang] || STEP_NAMES.en;
        if (langMap && langMap[step]) {
          winFooterLabel.textContent = langMap[step];
        }
      }

      // Back Button Visibility
      if (winBackBtn) {
        if (step > 1) {
          winBackBtn.classList.remove('is-hidden');
        } else {
          winBackBtn.classList.add('is-hidden');
        }
      }

      // Continue Button on Page 3 routes to primary submit
      if (winContinueBtn && winContinueLabel) {
        if (step === 3) {
          winContinueLabel.textContent = window.currentLang === 'hi' ? "सर्वेक्षण सबमिट करें ↗" : "SUBMIT SURVEY ↗";
          winContinueBtn.onclick = () => executeSubmission(false);
        } else {
          winContinueLabel.textContent = window.currentLang === 'hi' ? "आगे बढ़ें" : "CONTINUE";
          winContinueBtn.onclick = () => goToStep(activeStep, activeStep + 1);
        }
      }
    }

    // ── JUMP TO STEP FROM INDICATOR ──
    function jumpToStep(targetStep) {
      if (targetStep === activeStep) return;
      if (targetStep < activeStep) {
        goToStep(activeStep, targetStep);
      } else {
        // Can only jump forward if current is valid
        if (checkPageValidity(activeStep)) {
          goToStep(activeStep, targetStep);
        }
      }
    }

    // ── STEP SWITCHING WITH SMOOTH SLIDE ──
    let isTransitioning = false;
    function goToStep(fromStep, toStep) {
      if (isTransitioning) return;
      if (toStep > fromStep) {
        if (!checkPageValidity(fromStep)) {
          return;
        }
      }

      savePageAnswers();

      const currentPane = document.getElementById(`pane-step-${fromStep}`);
      const nextPane = document.getElementById(`pane-step-${toStep}`);

      if (!currentPane || !nextPane) return;

      isTransitioning = true;
      const goingForward = toStep > fromStep;

      // Clean old animation classes
      currentPane.classList.remove('slide-in-right', 'slide-in-left', 'slide-out-left', 'slide-out-right');
      nextPane.classList.remove('slide-in-right', 'slide-in-left', 'slide-out-left', 'slide-out-right');

      // Slide out current pane
      currentPane.classList.add(goingForward ? 'slide-out-left' : 'slide-out-right');

      // After exit animation, swap panes and slide in
      currentPane.addEventListener('animationend', function handler() {
        currentPane.removeEventListener('animationend', handler);
        currentPane.classList.remove('is-active', 'slide-out-left', 'slide-out-right');

        // Reset scroll position within window body
        if (scrollContainer) {
          scrollContainer.scrollTop = 0;
        }

        nextPane.classList.add('is-active', goingForward ? 'slide-in-right' : 'slide-in-left');

        nextPane.addEventListener('animationend', function handler2() {
          nextPane.removeEventListener('animationend', handler2);
          nextPane.classList.remove('slide-in-right', 'slide-in-left');
          isTransitioning = false;
        });

        // Scroll to first question
        const firstQuestion = nextPane.querySelector('.question-card') || nextPane;
        if (firstQuestion) {
          firstQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      updateHUD(toStep);
      makeWindowActive();
    }

    // ── SCROLL TO SURVEY & MAXIMIZE WINDOW INSTANTLY ──
    function startSurveyScroll() {
      const stage = document.getElementById('survey-stage');
      if (stage) {
        const header = document.querySelector('.site-header');
        const headerOffset = header ? header.getBoundingClientRect().height : 0;
        const targetTop = stage.getBoundingClientRect().top + window.scrollY - headerOffset - 16;
        window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
      }
      makeWindowActive();
    }

    function makeWindowActive() {
      if (macWindow) {
        macWindow.classList.add('is-maximized');
        macWindow.style.opacity = '1';
        macWindow.style.transform = 'none';
      }
    }

    // ── WINDOW MAXIMIZE STATE ──
    function handleScrollMaximization() {
      if (!macWindow) return;
      macWindow.classList.add('is-maximized');
    }

    window.addEventListener('scroll', handleScrollMaximization, { passive: true });
    window.addEventListener('resize', handleScrollMaximization, { passive: true });

    // ── MACOS TRAFFIC LIGHT CONTROLS ──
    function onTrafficLightClick(type) {
      if (type === 'red') {
        alert("SmartShield Survey is in progress · Angiras Industries");
      }
    }

    function toggleWindowMinimize() {
      if (!macWindow) return;
      macWindow.classList.toggle('is-maximized');
    }

    function toggleWindowFullscreen() {
      if (!macWindow) return;
      macWindow.classList.toggle('is-fullscreen');
      const isFull = macWindow.classList.contains('is-fullscreen');
      if (isFull) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }

    // ── SAVE ANSWERS TO STATE ──
    function savePageAnswers() {
      const occ = document.querySelector('input[name="occupation"]:checked');
      surveyAnswers.occupation = occ ? occ.value : '';
      surveyAnswers.occupation_other = (document.getElementById('occ_other_val')?.value || '').trim();

      const freq = document.querySelector('input[name="ride_frequency"]:checked');
      surveyAnswers.ride_frequency = freq ? freq.value : '';

      surveyAnswers.ride_purpose = [...document.querySelectorAll('input[name="ride_purpose"]:checked')].map(i => i.value);

      surveyAnswers.smart_devices = [...document.querySelectorAll('input[name="smart_devices"]:checked')].map(i => i.value);
      surveyAnswers.smart_devices_other = (document.getElementById('sd_other_val')?.value || '').trim();

      surveyAnswers.riding_problems = [...document.querySelectorAll('input[name="riding_problems"]:checked')].map(i => i.value);
      surveyAnswers.riding_problems_other = (document.getElementById('pr_other_val')?.value || '').trim();

      const bp = document.querySelector('input[name="biggest_problem"]:checked');
      surveyAnswers.biggest_problem = bp ? bp.value : '';

      const de = document.querySelector('input[name="dangerous_experience"]:checked');
      surveyAnswers.dangerous_experience = de ? de.value : '';
      surveyAnswers.dangerous_experience_details = (document.getElementById('de_details_val')?.value || '').trim();

      surveyAnswers.desired_features = [...document.querySelectorAll('input[name="desired_features"]:checked')].map(i => i.value);

      const prod = document.querySelector('input[name="product_preference"]:checked');
      surveyAnswers.product_preference = prod ? prod.value : '';

      const shp = document.querySelector('input[name="smartshield_price"]:checked');
      surveyAnswers.smartshield_price = shp ? shp.value : '';

      const msp = document.querySelector('input[name="modsmart_price"]:checked');
      surveyAnswers.modsmart_price = msp ? msp.value : '';

      surveyAnswers.purchase_barriers = [...document.querySelectorAll('input[name="purchase_barriers"]:checked')].map(i => i.value);
      surveyAnswers.purchase_barriers_other = (document.getElementById('bar_other_val')?.value || '').trim();

      surveyAnswers.trust_factors = [...document.querySelectorAll('input[name="trust_factors"]:checked')].map(i => i.value);

      const pi = document.querySelector('input[name="purchase_intent"]:checked');
      surveyAnswers.purchase_intent = pi ? pi.value : '';

      surveyAnswers.current_helmet_brand = (document.getElementById('cur_helmet_brand_val')?.value || '').trim();
      const chp = document.querySelector('input[name="current_helmet_price"]:checked');
      surveyAnswers.current_helmet_price = chp ? chp.value : '';

      surveyAnswers.product_feedback = (document.getElementById('product_wishlist_val')?.value || '').trim();

      surveyAnswers.name = (document.getElementById('ea_name_val')?.value || '').trim();
      surveyAnswers.phone = (document.getElementById('ea_phone_val')?.value || '').trim();
      surveyAnswers.email = (document.getElementById('ea_email_val')?.value || '').trim();
      surveyAnswers.early_access = document.getElementById('ea_optin_box')?.checked ?? true;
    }

    // ── FORM VALIDATION ──
    function clearErrors(stepNum) {
      document.querySelectorAll(`#pane-step-${stepNum} .question-card`).forEach(c => c.classList.remove('error-state'));
      document.querySelectorAll(`#pane-step-${stepNum} .error-text-hint`).forEach(h => h.classList.remove('visible'));
    }

    function triggerError(cardId, hintId) {
      const card = document.getElementById(cardId);
      const hint = document.getElementById(hintId);
      if (card) {
        card.classList.add('error-state');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      if (hint) hint.classList.add('visible');
    }

    function checkPageValidity(stepNum) {
      clearErrors(stepNum);
      savePageAnswers();

      if (stepNum === 1) {
        if (!surveyAnswers.occupation) { triggerError('card-q1', 'err-hint-q1'); return false; }
        if (!surveyAnswers.ride_frequency) { triggerError('card-q2', 'err-hint-q2'); return false; }
        if (!surveyAnswers.ride_purpose || surveyAnswers.ride_purpose.length === 0) { triggerError('card-q3', 'err-hint-q3'); return false; }
        if (surveyAnswers.smart_devices.length === 0) { triggerError('card-q4', 'err-hint-q4'); return false; }
        if (surveyAnswers.riding_problems.length === 0) { triggerError('card-q5', 'err-hint-q5'); return false; }
        if (!surveyAnswers.biggest_problem) { triggerError('card-q6', 'err-hint-q6'); return false; }
        if (!surveyAnswers.dangerous_experience) { triggerError('card-q7', 'err-hint-q7'); return false; }
        return true;
      }

      if (stepNum === 2) {
        if (surveyAnswers.desired_features.length === 0 || surveyAnswers.desired_features.length > 3) {
          triggerError('card-p2-q1', 'err-hint-p2-q1'); return false;
        }
        if (!surveyAnswers.product_preference) {
          triggerError('card-p2-q2', 'err-hint-p2-q2'); return false;
        }
        if (surveyAnswers.product_preference === 'SmartShield' && !surveyAnswers.smartshield_price) {
          triggerError('card-p2-q3', 'err-hint-p2-q3'); return false;
        }
        if (surveyAnswers.product_preference === 'ModSmart' && !surveyAnswers.modsmart_price) {
          triggerError('card-p2-q3', 'err-hint-p2-q3'); return false;
        }
        if ((surveyAnswers.product_preference.includes('Both') || surveyAnswers.product_preference === 'Not Sure') && (!surveyAnswers.smartshield_price && !surveyAnswers.modsmart_price)) {
          triggerError('card-p2-q3', 'err-hint-p2-q3'); return false;
        }
        if (surveyAnswers.purchase_barriers.length === 0 || surveyAnswers.purchase_barriers.length > 2) {
          triggerError('card-p2-q4', 'err-hint-p2-q4'); return false;
        }
        return true;
      }

      if (stepNum === 3) {
        if (surveyAnswers.trust_factors.length === 0 || surveyAnswers.trust_factors.length > 3) {
          triggerError('card-p3-q1', 'err-hint-p3-q1'); return false;
        }
        if (!surveyAnswers.purchase_intent) {
          triggerError('card-p3-q2', 'err-hint-p3-q2'); return false;
        }
        if (!surveyAnswers.current_helmet_price) {
          triggerError('card-p3-q3', 'err-hint-p3-q3'); return false;
        }
        return true;
      }

      return true;
    }

    // ── REAL-TIME CLEARING ON SELECTION ──
    document.querySelectorAll('.question-card input').forEach(input => {
      input.addEventListener('change', () => {
        const card = input.closest('.question-card');
        if (card && card.classList.contains('error-state')) {
          card.classList.remove('error-state');
          const hint = card.querySelector('.error-text-hint');
          if (hint) hint.classList.remove('visible');
        }
      });
    });

    // ── EVENT LISTENERS & CONSTRAINTS ──

    // 1. Occupation Other Input
    document.querySelectorAll('input[name="occupation"]').forEach(r => {
      r.addEventListener('change', () => {
        const box = document.getElementById('occ-other-box');
        if (r.id === 'occ_6') {
          box?.classList.add('visible');
          document.getElementById('occ_other_val')?.focus();
        } else {
          box?.classList.remove('visible');
        }
      });
    });

    // 2. Smart Devices 'None' Mutual Exclusivity
    const sdNone = document.getElementById('sd_6');
    const sdCheckboxes = document.querySelectorAll('input[name="smart_devices"]');
    sdCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb === sdNone && cb.checked) {
          sdCheckboxes.forEach(o => { if (o !== sdNone) o.checked = false; });
          document.getElementById('sd-other-box')?.classList.remove('visible');
        } else if (cb !== sdNone && cb.checked) {
          if (sdNone) sdNone.checked = false;
        }
        if (cb.id === 'sd_5') {
          document.getElementById('sd-other-box')?.classList.toggle('visible', cb.checked);
        }
      });
    });

    // 3. Riding Problems Other Input
    document.getElementById('pr_11')?.addEventListener('change', e => {
      document.getElementById('pr-other-box')?.classList.toggle('visible', e.target.checked);
    });

    // 4. Barriers Other Input
    document.getElementById('bar_10')?.addEventListener('change', e => {
      document.getElementById('bar-other-box')?.classList.toggle('visible', e.target.checked);
    });

    // 5. Desired Features Limit (Max 3)
    const ftBoxes = document.querySelectorAll('input[name="desired_features"]');
    const ftBadge = document.getElementById('feat-badge-counter');
    ftBoxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const selected = [...ftBoxes].filter(i => i.checked);
        if (selected.length > 5) {
          cb.checked = false;
          return;
        }
        if (ftBadge) {
          ftBadge.textContent = `${selected.length} / 3 selected`;
          ftBadge.classList.toggle('active-count', selected.length > 0);
        }

        ftBoxes.forEach(item => {
          const parent = item.closest('.choice-item');
          if (selected.length >= 5 && !item.checked) {
            parent?.classList.add('disabled-opt');
          } else {
            parent?.classList.remove('disabled-opt');
          }
        });
      });
    });

    // 6. Dynamic Pricing Display based on Product Preference
    const shBlock = document.getElementById('sh-pricing-block');
    const msBlock = document.getElementById('ms-pricing-block');
    const pricePrompt = document.getElementById('price-card-prompt');

    function adaptPricingView(pref) {
      if (!shBlock || !msBlock || !pricePrompt) return;
      const isHi = window.currentLang === 'hi';
      if (pref === 'SmartShield') {
        shBlock.style.display = 'block';
        msBlock.style.display = 'none';
        pricePrompt.textContent = isHi ? 'स्मार्टशील्ड फुल हेलमेट के लिए स्वीकार्य मूल्य वर्ग' : 'Acceptable price tier for the full SmartShield helmet';
      } else if (pref === 'ModSmart') {
        shBlock.style.display = 'none';
        msBlock.style.display = 'block';
        pricePrompt.textContent = isHi ? 'मॉडस्मार्ट अपग्रेड मॉड्यूल के लिए स्वीकार्य मूल्य वर्ग' : 'Acceptable price tier for the ModSmart retrofit kit';
      } else {
        shBlock.style.display = 'block';
        msBlock.style.display = 'block';
        pricePrompt.textContent = isHi ? 'प्रत्येक उत्पाद विकल्प के लिए स्वीकार्य मूल्य वर्ग' : 'Acceptable price tiers for each device option';
      }
    }

    document.querySelectorAll('input[name="product_preference"]').forEach(r => {
      r.addEventListener('change', () => {
        adaptPricingView(r.value);
      });
    });

    // Dynamic Counter Badges Updater
    function updateCounterBadges() {
      const isHi = window.currentLang === 'hi';
      const featBoxes = document.querySelectorAll('input[name="desired_features"]');
      const featSelected = [...featBoxes].filter(i => i.checked);
      const featBadge = document.getElementById('feat-badge-counter');
      if (featBadge) {
        featBadge.textContent = `${featSelected.length} / 5 ${isHi ? 'चयनित' : 'selected'}`;
        featBadge.classList.toggle('active-count', featSelected.length > 0);
      }

      const rpBoxes = document.querySelectorAll('input[name="ride_purpose"]');
      const rpSelected = [...rpBoxes].filter(i => i.checked);
      const rpBadge = document.getElementById('rp-badge-counter');
      if (rpBadge) {
        rpBadge.textContent = `${rpSelected.length} / 3 ${isHi ? 'चयनित' : 'selected'}`;
        rpBadge.classList.toggle('active-count', rpSelected.length > 0);
      }

      const barBoxes = document.querySelectorAll('input[name="purchase_barriers"]');
      const barSelected = [...barBoxes].filter(i => i.checked);
      const barBadge = document.getElementById('barrier-badge-counter');
      if (barBadge) {
        barBadge.textContent = `${barSelected.length} / 4 ${isHi ? 'चयनित' : 'selected'}`;
        barBadge.classList.toggle('active-count', barSelected.length > 0);
      }

      const tfBoxes = document.querySelectorAll('input[name="trust_factors"]');
      const tfSelected = [...tfBoxes].filter(i => i.checked);
      const tfBadge = document.getElementById('trust-badge-counter');
      if (tfBadge) {
        tfBadge.textContent = `${tfSelected.length} / 5 ${isHi ? 'चयनित' : 'selected'}`;
        tfBadge.classList.toggle('active-count', tfSelected.length > 0);
      }
    }

    // 7. Barriers Limit (Max 2)

    // Ride Purpose Limit (Max 3)
    const rpBoxes = document.querySelectorAll('input[name="ride_purpose"]');
    rpBoxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const selected = [...rpBoxes].filter(i => i.checked);
        if (selected.length > 3) {
          cb.checked = false;
          return;
        }
        updateCounterBadges();

        rpBoxes.forEach(item => {
          const parent = item.closest('.choice-item');
          if (selected.length >= 3 && !item.checked) {
            parent?.classList.add('disabled-opt');
          } else {
            parent?.classList.remove('disabled-opt');
          }
        });
      });
    });

    const barBoxes = document.querySelectorAll('input[name="purchase_barriers"]');
    barBoxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const selected = [...barBoxes].filter(i => i.checked);
        if (selected.length > 4) {
          cb.checked = false;
          return;
        }
        updateCounterBadges();

        barBoxes.forEach(item => {
          const parent = item.closest('.choice-item');
          if (selected.length >= 4 && !item.checked) {
            parent?.classList.add('disabled-opt');
          } else {
            parent?.classList.remove('disabled-opt');
          }
        });
      });
    });

    // 8. Trust Factors Limit (Max 3)
    const tfBoxes = document.querySelectorAll('input[name="trust_factors"]');
    tfBoxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const selected = [...tfBoxes].filter(i => i.checked);
        if (selected.length > 5) {
          cb.checked = false;
          return;
        }
        updateCounterBadges();

        tfBoxes.forEach(item => {
          const parent = item.closest('.choice-item');
          if (selected.length >= 5 && !item.checked) {
            parent?.classList.add('disabled-opt');
          } else {
            parent?.classList.remove('disabled-opt');
          }
        });
      });
    });

    // 9. Early Access Checkbox Toggle
    function updateSubmitBtnText() {
      if (submitTxt && optinBox) {
        const isHi = window.currentLang === 'hi';
        if (optinBox.checked) {
          submitTxt.textContent = isHi ? 'सबमिट करें और अर्ली एक्सेस पाएं ↗' : 'SUBMIT & JOIN EARLY ACCESS ↗';
        } else {
          submitTxt.textContent = isHi ? 'सर्वेक्षण सबमिट करें ↗' : 'SUBMIT SURVEY ↗';
        }
      }
    }

    optinBox?.addEventListener('change', updateSubmitBtnText);

    // ── SUBMISSION HANDLER ──
    async function executeSubmission(skipEA) {
      if (skipEA && optinBox) {
        optinBox.checked = false;
      }

      if (!checkPageValidity(3)) {
        return;
      }

      savePageAnswers();
      if (skipEA) {
        surveyAnswers.early_access = false;
      }

      const submitBtn = document.getElementById('main-submit-btn');
      const submitTxtSpan = submitBtn ? (submitBtn.querySelector('.btn-text') || submitBtn.querySelector('.btn-label-text') || submitBtn) : null;
      let originalText = '';

      if (submitBtn) {
        if (submitBtn.disabled) return; // Prevent double submission
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;
        submitBtn.style.pointerEvents = 'none';

        if (submitTxtSpan && submitTxtSpan !== submitBtn) {
          originalText = submitTxtSpan.textContent;
          submitTxtSpan.textContent = 'Submitting...';
        }
      }

      const payload = {
        "occupation": surveyAnswers.occupation + (surveyAnswers.occupation_other ? `, Other: ${surveyAnswers.occupation_other}` : ''),
        "ride_frequency": surveyAnswers.ride_frequency,
        "ride_purpose": surveyAnswers.ride_purpose.join(', '),
        "smart_devices": surveyAnswers.smart_devices.join(', ') + (surveyAnswers.smart_devices_other ? `, Other: ${surveyAnswers.smart_devices_other}` : ''),
        "riding_problems": surveyAnswers.riding_problems.join(', ') + (surveyAnswers.riding_problems_other ? `, Other: ${surveyAnswers.riding_problems_other}` : ''),
        "biggest_problem": surveyAnswers.biggest_problem,
        "dangerous_experience": surveyAnswers.dangerous_experience,
        "dangerous_experience_details": surveyAnswers.dangerous_experience_details || '',
        "desired_features": surveyAnswers.desired_features.join(', '),
        "product_preference": surveyAnswers.product_preference,
        "smartshield_price": surveyAnswers.smartshield_price || '',
        "modsmart_price": surveyAnswers.modsmart_price || '',
        "purchase_barriers": surveyAnswers.purchase_barriers.join(', ') + (surveyAnswers.purchase_barriers_other ? `, Other: ${surveyAnswers.purchase_barriers_other}` : ''),
        "trust_factors": surveyAnswers.trust_factors.join(', '),
        "purchase_intent": surveyAnswers.purchase_intent,
        "current_helmet_brand": surveyAnswers.current_helmet_brand || '',
        "current_helmet_price": surveyAnswers.current_helmet_price || '',
        "product_feedback": surveyAnswers.product_feedback || '',
        "name": surveyAnswers.name || '',
        "phone": surveyAnswers.phone || '',
        "email": surveyAnswers.email || '',
        "early_access": !!surveyAnswers.early_access
      };

      try {
        const res = await fetch('https://script.google.com/macros/s/AKfycbwCXzDHQC9gUY_jLHzsCVqBPbmRBCf4huykSEkBiCCShaAL68ZeHKWY-nQaDZEaAAgxbw/exec', {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });

        let data = null;
        try {
          data = await res.json();
        } catch (e) {
          console.warn("Response was not JSON", e);
        }

        if (data && data.success) {
          // Hide form and footer inside the Mac window
          document.getElementById('pmf-survey-form').style.display = 'none';
          if (winFooter) winFooter.style.display = 'none';

          // Show celebration pane inside the same Mac window
          const successView = document.getElementById('pane-success');
          if (successView) {
            successView.classList.add('is-active');
          }
          if (windowBadge) {
            windowBadge.textContent = "COMPLETED ↗";
            windowBadge.style.color = "var(--c-neon-lime)";
            windowBadge.style.borderColor = "var(--c-neon-lime)";
          }

          // Complete all indicator nodes
          for (let i = 1; i <= 3; i++) {
            const node = document.getElementById(`node-step-${i}`);
            node?.classList.remove('is-active');
            node?.classList.add('is-done');
          }
          if (trackProgress) trackProgress.style.width = '100%';

          // Scroll inside window to top
          if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } else {
          if (submitBtn) {
            submitBtn.classList.remove('is-loading');
            submitBtn.disabled = false;
            submitBtn.style.pointerEvents = 'auto';
            if (submitTxtSpan && submitTxtSpan !== submitBtn && originalText) {
              submitTxtSpan.textContent = originalText;
            }
          }
          alert('Something went wrong while submitting your response. Please try again.');
        }
      } catch (err) {
        if (submitBtn) {
          submitBtn.classList.remove('is-loading');
          submitBtn.disabled = false;
          submitBtn.style.pointerEvents = 'auto';
          if (submitTxtSpan && submitTxtSpan !== submitBtn && originalText) {
            submitTxtSpan.textContent = originalText;
          }
        }
        alert('Something went wrong while submitting your response. Please try again.');
      }
    }

    // ── INITIAL SETUP & WINDOW ATTACHMENTS ──
    window.FSPREE = FSPREE;
    window.activeStep = activeStep;
    window.surveyAnswers = surveyAnswers;
    window.goToStep = goToStep;
    window.checkPageValidity = checkPageValidity;
    window.savePageAnswers = savePageAnswers;
    window.adaptPricingView = adaptPricingView;
    window.updateHUD = updateHUD;
    window.updateCounterBadges = updateCounterBadges;
    window.executeSubmission = executeSubmission;
    window.startSurveyScroll = startSurveyScroll;

    updateHUD(1);
    adaptPricingView('Both');
    handleScrollMaximization();

    // ── COMPLETE BILINGUAL SUPPORT (ENGLISH / HINDI) ──
    const I18N_DATA = {
      en: {
        startSurvey: "START SURVEY →",
        heroPresents: "Angiras Industries Presents",
        heroInnovation: "Hardware Innovation",
        heroHeadline: '"Help us build a smarter, safer riding experience."',
        heroDesc: "Your 60–90 second answers will help shape what we build, what features matter most, and what riders are willing to pay.",
        stepsMeta: "3 STEPS",
        timeMeta: "60–90 SECONDS",
        scrollPrompt: "SCROLL TO START",
        scrollHint: "Scroll Down to Explore Innovation",
        helmetSub: "Full AI Smart Helmet",
        modsmartSub: "Upgrade Your Existing Helmet",
        cred1: "Govt. Recognised Startup",
        cred2: "I-Hub GEC Raipur Incubated",
        cred3: "Patent No. 202521123556",
        cred4: "₹61K+ Prize Winner",
        step1Label: "01 YOU",
        step1Desc: "Rider Profile",
        step2Label: "02 PRODUCT",
        step2Desc: "Features & Price",
        step3Label: "03 TRUST",
        step3Desc: "Early Access",

        // Titlebar & Window
        win_app_title: "SMARTSHIELD SURVEY",
        win_app_sub: "ANGIRAS INDUSTRIES",
        win_expand: "Expand",
        btn_back: "← BACK",
        btn_continue: "CONTINUE",

        // Pane 1
        p1Tag: "01 — YOU · STEP 1 OF 3",
        p1Title: 'TELL US ABOUT <span class="hl-blue">YOUR RIDE</span>',
        p1Subtitle: "Help us understand how you ride and what gets in your way.",
        q1Title: '1. What do you do? <span class="req-star">*</span>',
        q1Helper: "Select your primary occupation",
        occ_student: "Student",
        occ_job: "Job / Employee",
        occ_business: "Business",
        occ_gig: "Delivery / Gig Worker",
        occ_freelance: "Freelancer",
        occ_other: "Other",
        occ_ph: "Specify your occupation...",
        err_q1: "Please select what you do.",

        q2Title: '2. How often do you ride? <span class="req-star">*</span>',
        q2Helper: "Your average weekly riding routine",
        rf_daily: "Daily",
        rf_daily_sub: "5+ days every week",
        rf_3to5: "3–5 days/week",
        rf_3to5_sub: "Regular weekday commute",
        rf_1to2: "1–2 days/week",
        rf_1to2_sub: "Occasional trips or errands",
        rf_occ: "Occasionally",
        rf_occ_sub: "Once or twice a month",
        err_q2: "Please select your riding frequency.",

        q3Title: '3. What do you mainly ride for? <span class="req-star">*</span>',
        q3Helper: "Your primary destination or riding purpose",
        rp_office: "Office",
        rp_college: "College",
        rp_work: "Work / Business",
        rp_delivery: "Delivery",
        rp_touring: "Touring / Long Ride",
        rp_personal: "Personal",
        err_q3: "Please select what you mainly ride for.",

        q4Title: '4. Do you currently use any smart / connected device? <span class="req-star">*</span>',
        q4Helper: "Select all that apply.",
        sd_watch: "Smartwatch",
        sd_band: "Smart Band / Fitness Band",
        sd_earbuds: "Smart Earbuds / Bluetooth Device",
        sd_home: "Smart Home / IoT Device",
        sd_other: "Other",
        sd_none: "None",
        sd_ph: "Specify device...",
        err_q4: "Please choose at least one option (or 'None').",

        q5Title: '5. What problems do you face while riding? <span class="req-star">*</span>',
        q5Helper: "Select all that apply.",
        pr_calls: "Phone Calls",
        pr_nav: "Navigation",
        pr_roads: "Potholes / Bad Roads",
        pr_traffic: "Heavy Traffic",
        pr_rain: "Rain / Poor Visibility",
        pr_heat: "Heat Inside Helmet",
        pr_fatigue: "Fatigue / Long Rides",
        pr_sos: "Emergency / Accident Situations",
        pr_group: "Group Communication",
        pr_audio: "Difficulty Hearing Audio",
        pr_other: "Other",
        pr_ph: "Describe other problem...",
        err_q5: "Please select at least one riding problem.",

        q6Title: "6. What's your #1 biggest riding problem? <span class=\"req-star\">*</span>",
        q6Helper: "Only one selection — your single greatest frustration",
        bp_safety: "Safety",
        bp_nav: "Navigation",
        bp_comm: "Communication",
        bp_traffic: "Traffic / Roads",
        bp_heat: "Heat / Comfort",
        bp_emergency: "Emergency Situations",
        err_q6: "Please select your #1 biggest problem.",

        q7Title: '7. Have you ever experienced a difficult or dangerous riding situation? <span class="req-star">*</span>',
        q7Helper: "Critical context for our safety engineering",
        de_serious: "Serious Accident",
        de_nearmiss: "Near Miss",
        de_danger: "Dangerous Situation — No Accident",
        de_no: "No",
        de_lbl: 'If you\'re comfortable, briefly tell us what happened: <span style="color:var(--c-dark-sand);">(optional)</span>',
        de_ph: "e.g. Blind turn at night, unexpected gravel, sudden brake by vehicle ahead...",
        err_q7: "Please select an option for question 7.",

        // Pane 2
        p2Tag: "02 — PRODUCT · STEP 2 OF 3",
        p2Title: 'WHAT WOULD YOU <span class="hl-blue">ACTUALLY BUY?</span>',
        p2Subtitle: "Tell us which smart riding experience makes the most sense for you.",
        q2_1Title: '1. Which features would be most useful to you? <span class="req-star">*</span>',
        q2_1Helper: "Choose up to 3.",
        ft1: "AI Safety / Crash Detection",
        ft1_sub: "Collision sensing & alert",
        ft2: "Emergency SOS",
        ft2_sub: "One-touch emergency beacon",
        ft3: "Navigation Audio",
        ft3_sub: "In-helmet spoken turn directions",
        ft4: "Hands-Free Calls",
        ft4_sub: "Wind noise cancelling voice clarity",
        ft5: "Music / Podcasts",
        ft5_sub: "Integrated stereo audio drivers",
        ft6: "Bluetooth Group Intercom",
        ft6_sub: "Rider-to-rider direct comms",
        ft7: "Voice Assistant",
        ft7_sub: "Google Assistant & Siri support",
        ft8: "AI Speed / Safety Alerts",
        ft8_sub: "Fatigue and speed hazard cues",
        err_p2_q1: "Please select between 1 and 3 features.",

        p_sh_badge: "Full Helmet",
        p_sh_sub: "Full AI Smart Helmet",
        p_ms_badge: "Upgrade Module",
        p_ms_sub: "Upgrade Your Existing Helmet",
        q2_2Title: '2. Which product would you prefer? <span class="req-star">*</span>',
        q2_2Helper: "Select the smart riding experience that fits your setup",
        p_both: "Both / Depends on Features",
        p_unsure: "Not Sure",
        err_p2_q2: "Please select which product you would prefer.",

        q2_3Title: "3. What's an acceptable price for you? <span class=\"req-star\">*</span>",
        q2_3Helper: "Select the price tier that feels justified for you",
        err_p2_q3: "Please select an acceptable price point.",

        q2_4Title: '4. What could stop you from buying? <span class="req-star">*</span>',
        q2_4Helper: "Choose up to 2.",
        bar_price: "Price",
        bar_battery: "Battery / Charging",
        bar_weight: "Extra Weight",
        bar_install: "Installation",
        bar_safety: "Safety / Certification",
        bar_compat: "Helmet Compatibility",
        bar_water: "Waterproofing",
        bar_looks: "Design / Looks",
        bar_trust: "Brand Trust",
        bar_other: "Other",
        bar_ph: "Specify barrier...",
        err_p2_q4: "Please choose 1 or 2 purchase barriers.",

        // Pane 3
        p3Tag: "03 — TRUST & ACCESS · STEP 3 OF 3",
        p3Title: 'WOULD YOU TRUST & <span class="hl-blue">TRY IT?</span>',
        p3Subtitle: "Tell us what would give you confidence to choose SmartShield or ModSmart.",
        q3_1Title: '1. What would make you trust the product? <span class="req-star">*</span>',
        q3_1Helper: "Choose up to 3.",
        tf_isi: "ISI / BIS Certification",
        tf_crash: "Crash Testing",
        tf_warranty: "Strong Warranty",
        tf_water: "Waterproofing",
        tf_battery: "Battery Safety",
        tf_reviews: "Real Rider Reviews",
        tf_reputation: "Brand Reputation",
        tf_demo: "Product Demo / Test Ride",
        tf_india: "Made in India",
        err_p3_q1: "Please select 1 to 3 trust factors.",

        q3_2Title: '2. When would you buy it? <span class="req-star">*</span>',
        q3_2Helper: "Your genuine purchase timeline",
        pi_immediate: "I would buy immediately",
        pi_immediate_sub: "Ready to pre-order or purchase right at launch.",
        pi_consider: "I would seriously consider it",
        pi_consider_sub: "Strong intent once reviews and demo rides appear.",
        pi_info: "Need more information",
        pi_info_sub: "Want to see official crash test data and warranty.",
        pi_notyet: "Not interested right now",
        pi_notyet_sub: "Satisfied with my current helmet setup.",
        err_p3_q2: "Please select your purchase timeline.",

        q3_3Title: "3. Tell us about your current helmet",
        q3_3Helper: "Helps our engineering and pricing benchmarking",
        cur_brand_lbl: 'Current helmet brand <span style="color:var(--c-dark-sand);font-weight:400;">(optional)</span>',
        cur_brand_ph: "e.g. Steelbird, Vega, Studds, Axor, MT, SMK...",
        cur_price_lbl: 'Approximate current helmet price <span class="req-star">*</span>',
        chp1: "Under ₹1,000",
        chp2: "₹1,000–₹2,000",
        chp3: "₹2,000–₹3,500",
        chp4: "₹3,500–₹6,000",
        chp5: "₹6,000+",
        err_p3_q3: "Please select your current helmet price bracket.",

        q3_4Title: '4. What would make you want this product? <span style="font-size:12px;font-weight:400;color:var(--c-dark-sand);">(optional)</span>',
        q3_4Helper: "Share any specific feature or wow-factor you'd love to see.",
        product_wishlist_ph: "One thing you'd love to see in SmartShield or ModSmart...",

        ea_badge: "VIP Launch List",
        ea_title: "WANT EARLY ACCESS?",
        ea_desc: "Be among the first riders to test SmartShield / ModSmart and receive priority launch updates.",
        ea_name_lbl: "Name",
        ea_name_ph: "Rider name",
        ea_phone_lbl: "Phone",
        ea_phone_ph: "+91 XXXXX XXXXX",
        ea_email_lbl: "Email",
        ea_email_ph: "rider@email.com",
        ea_optin: "Join the SmartShield × ModSmart early-access list",
        submit_ea: "SUBMIT & JOIN EARLY ACCESS ↗",
        submit_no_ea: "SUBMIT SURVEY ↗",
        skip_ea: "Submit without joining"
      },
      hi: {
        startSurvey: "सर्वेक्षण शुरू करें →",
        heroPresents: "अंगिरस इंडस्ट्रीज प्रस्तुत करता है",
        heroInnovation: "हार्डवेयर नवाचार",
        heroHeadline: '"स्मार्ट और सुरक्षित राइडिंग अनुभव बनाने में हमारी मदद करें।"',
        heroDesc: "आपके 60-90 सेकंड के उत्तर यह तय करेंगे कि हम क्या बनाएं, कौन से फीचर्स सबसे महत्वपूर्ण हैं और राइडर्स क्या कीमत चुकाना चाहते हैं।",
        stepsMeta: "3 चरण",
        timeMeta: "60–90 सेकंड",
        scrollPrompt: "शुरू करने के लिए नीचे स्क्रॉल करें",
        scrollHint: "नवाचार देखने के लिए नीचे स्क्रॉल करें",
        helmetSub: "फुल एआई स्मार्ट हेलमेट",
        modsmartSub: "अपने मौजूदा हेलमेट को अपग्रेड करें",
        cred1: "सरकारी मान्यता प्राप्त स्टार्टअप",
        cred2: "आई-हब जीईसी रायपुर द्वारा इनक्यूबेटेड",
        cred3: "पेटेंट नं. 202521123556",
        cred4: "₹61K+ पुरस्कार विजेता",
        step1Label: "01 आप",
        step1Desc: "राइडर प्रोफ़ाइल",
        step2Label: "02 उत्पाद",
        step2Desc: "फीचर्स और मूल्य",
        step3Label: "03 विश्वास",
        step3Desc: "अर्ली एक्सेस",

        // Titlebar & Window
        win_app_title: "स्मार्टशील्ड सर्वेक्षण",
        win_app_sub: "अंगिरस इंडस्ट्रीज",
        win_expand: "बड़ा करें",
        btn_back: "← पीछे जाएं",
        btn_continue: "आगे बढ़ें",

        // Pane 1
        p1Tag: "01 — आप · चरण 1 (कुल 3)",
        p1Title: 'अपनी <span class="hl-blue">राइडिंग के बारे में बताएं</span>',
        p1Subtitle: "हमें समझने में मदद करें कि आप कैसे राइड करते हैं और आपको किन समस्याओं का सामना करना पड़ता है।",
        q1Title: '1. आप क्या करते हैं? <span class="req-star">*</span>',
        q1Helper: "अपना मुख्य व्यवसाय चुनें",
        occ_student: "छात्र (Student)",
        occ_job: "नौकरी / कर्मचारी",
        occ_business: "व्यापार / बिज़नेस",
        occ_gig: "डिलीवरी / गिग वर्कर",
        occ_freelance: "फ्रीलांसर",
        occ_other: "अन्य",
        occ_ph: "अपना व्यवसाय लिखें...",
        err_q1: "कृपया अपना व्यवसाय चुनें।",

        q2Title: '2. आप कितनी बार बाइक/स्कूटर चलाते हैं? <span class="req-star">*</span>',
        q2Helper: "आपकी औसत साप्ताहिक राइडिंग दिनचर्या",
        rf_daily: "रोज़ाना (Daily)",
        rf_daily_sub: "सप्ताह में 5+ दिन",
        rf_3to5: "3–5 दिन प्रति सप्ताह",
        rf_3to5_sub: "नियमित आवागमन",
        rf_1to2: "1–2 दिन प्रति सप्ताह",
        rf_1to2_sub: "कभी-कभार यात्रा या काम",
        rf_occ: "कभी-कभार",
        rf_occ_sub: "महीने में 1-2 बार",
        err_q2: "कृपया अपनी राइडिंग आवृत्ति चुनें।",

        q3Title: '3. आप मुख्य रूप से किस लिए राइड करते हैं? <span class="req-star">*</span>',
        q3Helper: "आपका प्राथमिक गंतव्य या राइडिंग उद्देश्य",
        rp_office: "कार्यालय (Office)",
        rp_college: "कॉलेज (College)",
        rp_work: "काम / व्यापार",
        rp_delivery: "डिलीवरी",
        rp_touring: "टूरिंग / लंबी राइड",
        rp_personal: "व्यक्तिगत कार्य",
        err_q3: "कृपया अपना राइडिंग उद्देश्य चुनें।",

        q4Title: '4. क्या आप अभी कोई स्मार्ट / कनेक्टेड डिवाइस इस्तेमाल करते हैं? <span class="req-star">*</span>',
        q4Helper: "लागू होने वाले सभी विकल्प चुनें।",
        sd_watch: "स्मार्टवॉच",
        sd_band: "स्मार्ट बैंड / फिटनेस बैंड",
        sd_earbuds: "स्मार्ट ईयरबड्स / ब्लूटूथ",
        sd_home: "स्मार्ट होम / IoT डिवाइस",
        sd_other: "अन्य",
        sd_none: "कोई नहीं (None)",
        sd_ph: "डिवाइस का नाम लिखें...",
        err_q4: "कृपया कम से कम एक विकल्प चुनें (या 'कोई नहीं')।",

        q5Title: '5. राइड करते समय आपको किन समस्याओं का सामना करना पड़ता है? <span class="req-star">*</span>',
        q5Helper: "लागू होने वाले सभी विकल्प चुनें।",
        pr_calls: "फोन कॉल्स उठाना",
        pr_nav: "नेविगेशन / रास्ता खोजना",
        pr_roads: "गड्ढे / खराब सड़कें",
        pr_traffic: "भारी ट्रैफिक",
        pr_rain: "बारिश / कम दृश्यता",
        pr_heat: "हेलमेट में गर्मी व पसीना",
        pr_fatigue: "थकान / लंबी राइड",
        pr_sos: "आपातकालीन / दुर्घटना स्थिति",
        pr_group: "ग्रुप में बात न हो पाना",
        pr_audio: "शोर में आवाज न सुनाई देना",
        pr_other: "अन्य",
        pr_ph: "अन्य समस्या लिखें...",
        err_q5: "कृपया कम से कम एक राइडिंग समस्या चुनें।",

        q6Title: "6. आपकी सबसे बड़ी #1 राइडिंग समस्या क्या है? <span class=\"req-star\">*</span>",
        q6Helper: "केवल एक विकल्प चुनें — आपकी सबसे बड़ी परेशानी",
        bp_safety: "सुरक्षा (Safety)",
        bp_nav: "नेविगेशन (Navigation)",
        bp_comm: "बातचीत (Communication)",
        bp_traffic: "ट्रैफिक / खराब सड़कें",
        bp_heat: "गर्मी / आराम की कमी",
        bp_emergency: "आपातकालीन स्थिति",
        err_q6: "कृपया अपनी #1 सबसे बड़ी समस्या चुनें।",

        q7Title: '7. क्या आपने कभी किसी कठिन या खतरनाक राइडिंग स्थिति का सामना किया है? <span class="req-star">*</span>',
        q7Helper: "हमारी सुरक्षा इंजीनियरिंग के लिए अत्यंत महत्वपूर्ण जानकारी",
        de_serious: "गंभीर दुर्घटना (Serious Accident)",
        de_nearmiss: "बाल-बाल बचना (Near Miss)",
        de_danger: "खतरनाक स्थिति — कोई दुर्घटना नहीं",
        de_no: "नहीं, कभी नहीं (No)",
        de_lbl: 'यदि आप चाहें तो संक्षेप में बताएं क्या हुआ था: <span style="color:var(--c-dark-sand);">(वैकल्पिक)</span>',
        de_ph: "उदा. रात में मोड़ पर अचानक फिसलन, सामने वाली गाड़ी का अचानक ब्रेक...",
        err_q7: "कृपया प्रश्न 7 के लिए एक विकल्प चुनें।",

        // Pane 2
        p2Tag: "02 — उत्पाद · चरण 2 (कुल 3)",
        p2Title: 'आप वास्तव में क्या <span class="hl-blue">खरीदना पसंद करेंगे?</span>',
        p2Subtitle: "हमें बताएं कि कौन सा स्मार्ट राइडिंग समाधान आपके लिए सबसे उपयुक्त है।",
        q2_1Title: '1. आपके लिए कौन से फीचर्स सबसे उपयोगी होंगे? <span class="req-star">*</span>',
        q2_1Helper: "अधिकतम 3 विकल्प चुनें।",
        ft1: "एआई सुरक्षा / क्रैश डिटेक्शन",
        ft1_sub: "दुर्घटना का तुरंत पता लगाना व अलर्ट",
        ft2: "इमरजेंसी एसओएस (SOS)",
        ft2_sub: "एक बटन दबाते ही आपातकालीन संदेश",
        ft3: "नेविगेशन ऑडियो",
        ft3_sub: "हेलमेट के अंदर बोलकर रास्ता बताना",
        ft4: "हैंड्स-फ्री कॉल्स",
        ft4_sub: "हवा का शोर हटाकर स्पष्ट आवाज",
        ft5: "म्यूजिक / पॉडकास्ट",
        ft5_sub: "इन-बिल्ट स्टीरियो स्पीकर",
        ft6: "ब्लूटूथ ग्रुप इंटरकॉम",
        ft6_sub: "राइडर-टू-राइडर सीधी बातचीत",
        ft7: "वॉयस असिस्टेंट",
        ft7_sub: "गूगल असिस्टेंट और सिरी सपोर्ट",
        ft8: "एआई स्पीड / सुरक्षा अलर्ट",
        ft8_sub: "थकान और गति सीमा की चेतावनी",
        err_p2_q1: "कृपया 1 से 3 फीचर्स चुनें।",

        p_sh_badge: "फुल हेलमेट",
        p_sh_sub: "फुल एआई स्मार्ट हेलमेट",
        p_ms_badge: "अपग्रेड मॉड्यूल",
        p_ms_sub: "अपने मौजूदा हेलमेट को स्मार्ट बनाएं",
        q2_2Title: '2. आप किस उत्पाद को प्राथमिकता देंगे? <span class="req-star">*</span>',
        q2_2Helper: "वह उत्पाद चुनें जो आपकी जरूरत के अनुसार सही हो",
        p_both: "दोनों / फीचर्स पर निर्भर करता है",
        p_unsure: "निश्चित नहीं",
        err_p2_q2: "कृपया अपनी पसंद का उत्पाद चुनें।",

        q2_3Title: "3. आपके अनुसार कौन सी कीमत उचित है? <span class=\"req-star\">*</span>",
        q2_3Helper: "वह मूल्य चुनें जो आपको सही और वाजिब लगे",
        err_p2_q3: "कृपया एक स्वीकार्य मूल्य बिंदु चुनें।",

        q2_4Title: '4. आपको खरीदने से क्या रोक सकता है? <span class="req-star">*</span>',
        q2_4Helper: "अधिकतम 2 विकल्प चुनें।",
        bar_price: "अधिक कीमत",
        bar_battery: "बैटरी / चार्जिंग की चिंता",
        bar_weight: "हेलमेट का भारी होना",
        bar_install: "इंस्टॉलेशन में कठिनाई",
        bar_safety: "सुरक्षा / सर्टिफिकेशन",
        bar_compat: "हेलमेट में फिटिंग",
        bar_water: "वाटरप्रूफिंग / बारिश",
        bar_looks: "डिज़ाइन / दिखावट",
        bar_trust: "ब्रांड पर भरोसा",
        bar_other: "अन्य",
        bar_ph: "कारण लिखें...",
        err_p2_q4: "कृपया 1 या 2 कारण चुनें।",

        // Pane 3
        p3Tag: "03 — विश्वास और अर्ली एक्सेस · चरण 3 (कुल 3)",
        p3Title: 'क्या आप भरोसा करेंगे और <span class="hl-blue">इसे आजमाएंगे?</span>',
        p3Subtitle: "हमें बताएं कि क्या आपको स्मार्टशील्ड या मॉडस्मार्ट चुनने का आत्मविश्वास देगा।",
        q3_1Title: '1. आपको उत्पाद पर किस बात से भरोसा होगा? <span class="req-star">*</span>',
        q3_1Helper: "अधिकतम 3 विकल्प चुनें।",
        tf_isi: "ISI / BIS सर्टिफिकेशन",
        tf_crash: "क्रैश टेस्टिंग प्रमाण",
        tf_warranty: "मजबूत वारंटी",
        tf_water: "वाटरप्रूफिंग",
        tf_battery: "बैटरी सुरक्षा",
        tf_reviews: "असली राइडर्स की समीक्षाएं",
        tf_reputation: "ब्रांड की प्रतिष्ठा",
        tf_demo: "डेमो / टेस्ट राइड",
        tf_india: "मेड इन इंडिया (स्वदेशी)",
        err_p3_q1: "कृपया 1 से 3 विश्वास कारक चुनें।",

        q3_2Title: '2. आप इसे कब खरीदेंगे? <span class="req-star">*</span>',
        q3_2Helper: "आपकी वास्तविक खरीद समयसीमा",
        pi_immediate: "मैं तुरंत खरीदूंगा",
        pi_immediate_sub: "लॉन्च होते ही प्री-ऑर्डर या खरीदने के लिए तैयार।",
        pi_consider: "मैं गंभीरता से विचार करूंगा",
        pi_consider_sub: "रिव्यू और डेमो राइड्स देखने के बाद खरीदने का इरादा।",
        pi_info: "और जानकारी चाहिए",
        pi_info_sub: "क्रैश टेस्ट डेटा और वारंटी विवरण देखना चाहते हैं।",
        pi_notyet: "अभी दिलचस्पी नहीं है",
        pi_notyet_sub: "अपने वर्तमान हेलमेट से पूरी तरह संतुष्ट हूं।",
        err_p3_q2: "कृपया अपनी खरीद समयसीमा चुनें।",

        q3_3Title: "3. अपने वर्तमान हेलमेट के बारे में बताएं",
        q3_3Helper: "हमारी इंजीनियरिंग और मूल्य निर्धारण में मदद करता है",
        cur_brand_lbl: 'वर्तमान हेलमेट ब्रांड <span style="color:var(--c-dark-sand);font-weight:400;">(वैकल्पिक)</span>',
        cur_brand_ph: "उदा. Steelbird, Vega, Studds, Axor, MT, SMK...",
        cur_price_lbl: 'वर्तमान हेलमेट की अनुमानित कीमत <span class="req-star">*</span>',
        chp1: "Under ₹1,000",
        chp2: "₹1,000–₹2,000",
        chp3: "₹2,000–₹3,500",
        chp4: "₹3,500–₹6,000",
        chp5: "₹6,000+",
        err_p3_q3: "कृपया अपने वर्तमान हेलमेट का मूल्य वर्ग चुनें।",

        q3_4Title: '4. क्या आपको यह उत्पाद खरीदने के लिए प्रेरित करेगा? <span style="font-size:12px;font-weight:400;color:var(--c-dark-sand);">(वैकल्पिक)</span>',
        q3_4Helper: "कोई खास फीचर या नया विचार जो आप इसमें देखना चाहते हैं।",
        product_wishlist_ph: "एक बात या फीचर जो आप SmartShield या ModSmart में देखना चाहते हैं...",

        ea_badge: "वीआईपी लॉन्च सूची",
        ea_title: "क्या आप सबसे पहले इस्तेमाल करना चाहते हैं?",
        ea_desc: "स्मार्टशील्ड / मॉडस्मार्ट टेस्ट करने वाले पहले राइडर्स में शामिल हों और लॉन्च अपडेट पाएं।",
        ea_name_lbl: "नाम",
        ea_name_ph: "आपका नाम",
        ea_phone_lbl: "फ़ोन नंबर",
        ea_phone_ph: "+91 XXXXX XXXXX",
        ea_email_lbl: "ईमेल",
        ea_email_ph: "rider@email.com",
        ea_optin: "SmartShield × ModSmart अर्ली-एक्सेस सूची में शामिल हों",
        submit_ea: "सबमिट करें और अर्ली एक्सेस पाएं ↗",
        submit_no_ea: "सर्वेक्षण सबमिट करें ↗",
        skip_ea: "बिना जुड़े सबमिट करें"
      }
    };

    window.currentLang = 'en';

    function setSurveyLang(lang) {
      if (!I18N_DATA[lang]) return;
      window.currentLang = lang;

      document.getElementById('lang-btn-en')?.classList.toggle('is-active', lang === 'en');
      document.getElementById('lang-btn-hi')?.classList.toggle('is-active', lang === 'hi');

      const dict = I18N_DATA[lang];

      // Update text and innerHTML
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) {
          if (typeof dict[key] === 'string' && dict[key].includes('<')) {
            el.innerHTML = dict[key];
          } else {
            el.textContent = dict[key];
          }
        }
      });

      // Update input placeholders
      document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (dict[key]) {
          el.placeholder = dict[key];
        }
      });

      // Update HUD, dynamic pricing prompts, and counter badges
      updateHUD(activeStep);
      updateCounterBadges();
      const currentPref = document.querySelector('input[name="product_preference"]:checked')?.value || 'Both';
      adaptPricingView(currentPref);
      updateSubmitBtnText();
    }

    window.setSurveyLang = setSurveyLang;

    document.addEventListener('change', function(e) {
      if(e.target.type === 'checkbox' && e.target.checked && typeof confetti === 'function') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#FF9A1F', '#3D9BFF', '#2FBF86', '#0A1220'] // Garuda colors
        });
      }
    });
