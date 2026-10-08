/**
 * GARUDA SMART HELMET & UPGRADE KIT — PMF RIDER SURVEY
 * Angiras Industries — Full 15-Question Bilingual Engine
 */

// ── 1. SINGLE CONFIGURATION FOR SELECTION LIMITS ──
const LIMITS = {
  ride_purpose: 3,
  desired_features: 5,
  purchase_barriers: 4,
  trust_factors: 5
};

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwCXzDHQC9gUY_jLHzsCVqBPbmRBCf4huykSEkBiCCShaAL68ZeHKWY-nQaDZEaAAgxbw/exec";

let activeStep = 1;
const MAX_STEPS = 3;
let currentLang = "en";
let vantaEffect = null;
let lastConfettiTime = 0;

// ── 2. SURVEY DATA STATE (ALL 22 PAYLOAD KEYS) ──
const surveyAnswers = {
  occupation: "",
  occupation_other: "",
  ride_frequency: "",
  ride_purpose: [],
  smart_devices: [],
  smart_devices_other: "",
  riding_problems: [],
  riding_problems_other: "",
  biggest_problem: "",
  dangerous_experience: "",
  dangerous_experience_details: "",

  desired_features: [],
  product_preference: "",
  smartshield_price: "",
  modsmart_price: "",
  purchase_barriers: [],
  purchase_barriers_other: "",

  trust_factors: [],
  purchase_intent: "",
  current_helmet_brand: "",
  current_helmet_price: "",
  product_feedback: "",

  name: "",
  phone: "",
  email: "",
  early_access: true
};

// ── 3. STEP LABELS ──
const STEP_NAMES = {
  en: {
    1: "Step 1 of 3: Rider Profile",
    2: "Step 2 of 3: Features & Price",
    3: "Step 3 of 3: Trust & Launch Access"
  },
  hi: {
    1: "चरण 1 (कुल 3): राइडर प्रोफ़ाइल",
    2: "चरण 2 (कुल 3): फीचर्स और मूल्य",
    3: "चरण 3 (कुल 3): विश्वास और अर्ली एक्सेस"
  }
};

// ── 4. COMPLETE BILINGUAL DICTIONARY ──
const translations = {
  en: {
    metaTitle: "GARUDA Smart Helmet — Official Rider Survey | Angiras Industries",
    metaDesc: "Help Angiras Industries build GARUDA — the next-generation smart helmet and upgrade kit with crash detection, SOS, and connected navigation. Take our survey.",
    brandSub: "by Angiras Industries",
    startSurvey: "Start Survey →",
    heroBadge: "Official Research · Angiras Industries",
    heroTitleSuffix: "Smart Helmet",
    heroTagline: "One helmet. Crash detection. SOS. Navigation. Connected riding.",
    heroSubtext: "Take our rider survey and help shape GARUDA.",
    surveyMeta: "15 questions · about 90 seconds",
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

    btn_back: "Back",
    btn_continue: "Continue",

    // Step 1: YOU
    p1Tag: "01 — YOU · STEP 1 OF 3",
    p1Title: 'TELL US ABOUT <span class="hl-blue">YOUR RIDE</span>',
    p1Subtitle: "Help us understand how you ride and what challenges you face.",

    q1Title: "1. What do you do?",
    q1Helper: "Select your primary occupation",
    occ_student: "Student",
    occ_job: "Job / Employee",
    occ_business: "Business",
    occ_gig: "Delivery / Gig Worker",
    occ_freelance: "Freelancer",
    occ_other: "Other",
    occ_ph: "Specify your occupation...",
    err_q1: "Please select your occupation.",

    q2Title: "2. How often do you ride?",
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

    q3Title: "3. What do you mainly ride for?",
    q3Helper: `Choose up to ${LIMITS.ride_purpose}.`,
    rp_office: "Office",
    rp_college: "College",
    rp_business: "Work / Business",
    rp_delivery: "Delivery",
    rp_touring: "Touring / Long Ride",
    rp_personal: "Personal",
    err_q3: `Please select 1 to ${LIMITS.ride_purpose} ride purposes.`,

    q4Title: "4. Do you currently use any smart / connected device?",
    q4Helper: "Select all that apply.",
    sd_watch: "Smartwatch",
    sd_band: "Smart Band / Fitness Band",
    sd_earbuds: "Smart Earbuds / Bluetooth Device",
    sd_smarthome: "Smart Home / IoT Device",
    sd_other: "Other",
    sd_other_ph: "Specify device...",
    sd_none: "None",
    err_q4: "Please select at least one option.",

    q5Title: "5. What problems do you face while riding?",
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

    q6Title: "6. What's your #1 biggest riding problem?",
    q6Helper: "Only one selection — your single greatest frustration",
    bp_safety: "Safety",
    bp_nav: "Navigation",
    bp_comm: "Communication",
    bp_traffic: "Traffic / Roads",
    bp_heat: "Heat / Comfort",
    bp_emergency: "Emergency Situations",
    err_q6: "Please select your #1 biggest problem.",

    q7Title: "7. Have you ever experienced a difficult or dangerous riding situation?",
    q7Helper: "Critical context for our safety engineering",
    de_serious: "Serious Accident",
    de_nearmiss: "Near Miss",
    de_danger: "Dangerous Situation — No Accident",
    de_no: "No",
    de_lbl: "If you're comfortable, briefly tell us what happened: (optional)",
    de_ph: "e.g., Night turn skidding, sudden braking by front vehicle...",
    err_q7: "Please select an option for question 7.",

    // Step 2: PRODUCT
    p2Tag: "02 — PRODUCT · STEP 2 OF 3",
    p2Title: 'WHAT WOULD YOU <span class="hl-blue">ACTUALLY BUY?</span>',
    p2Subtitle: "Tell us which smart riding setup fits your ride and budget.",

    q2_1Title: "1. Which features would be most useful to you?",
    q2_1Helper: `Choose up to ${LIMITS.desired_features}.`,
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
    err_p2_q1: `Please select 1 to ${LIMITS.desired_features} features.`,

    q2_2Title: "2. Which product would you prefer?",
    q2_2Helper: "Select the smart riding experience that fits your setup",
    p_sh_badge: "Full Helmet",
    p_sh_title: "SMARTSHIELD",
    p_sh_sub: "Full AI Smart Helmet",
    target_sh_price: "₹2,000–₹6,000",
    sh_feat1: "Smart safety & crash detection",
    sh_feat2: "Bluetooth & Navigation audio",
    sh_feat3: "SOS & Hands-free calls",
    sh_feat4: "AI features & Complete new helmet",

    p_ms_badge: "Upgrade Kit",
    p_ms_title: "MODSMART",
    p_ms_sub: "Upgrade Your Existing Helmet",
    target_ms_price: "₹1,500–₹3,500",
    ms_feat1: "Works with existing helmet",
    ms_feat2: "Bluetooth & Navigation audio",
    ms_feat3: "Hands-free calls & Smart features",
    ms_feat4: "Easy snap-on installation",

    p_both: "Both / Depends on Features",
    p_unsure: "Not Sure",
    viewImage: "View Image",
    err_p2_q2: "Please select which product you would prefer.",

    q2_3Title: "3. What's an acceptable price for you?",
    q2_3Helper: "Select the price tier that feels justified for you",
    sh_price_header: "SMARTSHIELD (Full AI Smart Helmet)",
    ms_price_header: "MODSMART (Upgrade Your Existing Helmet)",
    tier_entry: "Entry",
    tier_value: "Value",
    tier_balanced: "Balanced",
    tier_premium: "Premium",
    tier_flagship: "Flagship",
    tier_accessible: "Accessible",
    tier_sweetspot: "Sweet Spot",
    tier_standard: "Standard",
    tier_upper: "Upper",
    tier_fullkit: "Full Kit",
    err_p2_q3: "Please select an acceptable price tier.",

    q2_4Title: "4. What could stop you from buying?",
    q2_4Helper: `Choose up to ${LIMITS.purchase_barriers}.`,
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
    err_p2_q4: `Please choose 1 to ${LIMITS.purchase_barriers} purchase barriers.`,

    // Step 3: TRUST & ACCESS
    p3Tag: "03 — TRUST & ACCESS · STEP 3 OF 3",
    p3Title: 'WOULD YOU TRUST & <span class="hl-blue">TRY IT?</span>',
    p3Subtitle: "Tell us what would give you confidence to choose SmartShield or ModSmart.",

    q3_1Title: "1. What would make you trust the product?",
    q3_1Helper: `Choose up to ${LIMITS.trust_factors}.`,
    tf_isi: "ISI / BIS Certification",
    tf_crash: "Crash Testing",
    tf_warranty: "Strong Warranty",
    tf_water: "Waterproofing",
    tf_battery: "Battery Safety",
    tf_reviews: "Real Rider Reviews",
    tf_reputation: "Brand Reputation",
    tf_demo: "Product Demo / Test Ride",
    tf_india: "Made in India",
    err_p3_q1: `Please select 1 to ${LIMITS.trust_factors} trust factors.`,

    q3_2Title: "2. When would you buy it?",
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
    cur_brand_lbl: "Current helmet brand (optional)",
    cur_brand_ph: "e.g. Steelbird, Vega, Studds, Axor, MT, SMK...",
    cur_price_lbl: "Approximate current helmet price",
    chp1: "Under ₹1,000",
    chp2: "₹1,000–₹2,000",
    chp3: "₹2,000–₹3,500",
    chp4: "₹3,500–₹6,000",
    chp5: "₹6,000+",
    err_p3_q3: "Please select your current helmet price bracket.",

    q3_4Title: "4. What would make you want this product? (optional)",
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
    submit_ea: "SUBMIT & JOIN EARLY ACCESS ↗",
    err_name: "Enter your full name.",
    err_phone: "Enter a valid 10-digit mobile number.",
    err_email: "Enter a valid email address.",

    succ_title: "YOU'RE IN!",
    succ_lead: "Thank you for helping us build the next generation of smart riding technology in India.",
    succ_sub: "Your feedback will directly influence our product features, pricing, and rider experience.",
    succ_chip1: "SMARTSHIELD × MODSMART",
    succ_chip2: "ANGIRAS INDUSTRIES",
    succ_chip3: "Patent No. 202521123556",
    succ_chip4: "I-Hub GEC Raipur Incubated",
    succ_explore: "Explore Angiras Industries",

    footerDesc: "Built for Indian riders. Advanced smart helmet technology integrating crash detection, emergency SOS, and connected navigation by Angiras Industries.",
    footerProducts: "Products",
    footerCompany: "Company"
  },
  hi: {
    metaTitle: "गरुड़ स्मार्ट हेलमेट — आधिकारिक राइडर सर्वेक्षण | अंगिरस इंडस्ट्रीज",
    metaDesc: "क्रैश डिटेक्शन, एसओएस और नेविगेशन वाले स्मार्ट हेलमेट को बनाने में अंगिरस इंडस्ट्रीज की मदद करें। सर्वेक्षण भरें।",
    brandSub: "अंगिरस इंडस्ट्रीज द्वारा",
    startSurvey: "सर्वेक्षण शुरू करें →",
    heroBadge: "आधिकारिक शोध · अंगिरस इंडस्ट्रीज",
    heroTitleSuffix: "स्मार्ट हेलमेट",
    heroTagline: "एक हेलमेट। क्रैश डिटेक्शन। एसओएस। नेविगेशन। कनेक्टेड राइडिंग।",
    heroSubtext: "हमारा राइडर सर्वेक्षण भरें और गरुड़ को आकार देने में मदद करें।",
    surveyMeta: "15 प्रश्न · लगभग 90 सेकंड",
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

    btn_back: "पीछे जाएं",
    btn_continue: "आगे बढ़ें",

    // Step 1: YOU
    p1Tag: "01 — आप · चरण 1 (कुल 3)",
    p1Title: 'अपनी <span class="hl-blue">राइडिंग के बारे में बताएं</span>',
    p1Subtitle: "हमें समझने में मदद करें कि आप कैसे राइड करते हैं और आपको किन समस्याओं का सामना करना पड़ता है।",

    q1Title: "1. आप क्या करते हैं?",
    q1Helper: "अपना मुख्य व्यवसाय चुनें",
    occ_student: "छात्र (Student)",
    occ_job: "नौकरी / कर्मचारी",
    occ_business: "व्यापार / बिज़नेस",
    occ_gig: "डिलीवरी / गिग वर्कर",
    occ_freelance: "फ्रीलांसर",
    occ_other: "अन्य",
    occ_ph: "अपना व्यवसाय लिखें...",
    err_q1: "कृपया अपना व्यवसाय चुनें।",

    q2Title: "2. आप कितनी बार राइड करते हैं?",
    q2Helper: "आपकी औसत साप्ताहिक राइडिंग दिनचर्या",
    rf_daily: "प्रतिदिन (Daily)",
    rf_daily_sub: "सप्ताह में 5 या अधिक दिन",
    rf_3to5: "3–5 दिन / सप्ताह",
    rf_3to5_sub: "नियमित दैनिक आवागमन",
    rf_1to2: "1–2 दिन / सप्ताह",
    rf_1to2_sub: "कभी-कभार यात्राएं या काम",
    rf_occ: "कभी-कभार (Occasionally)",
    rf_occ_sub: "महीने में 1-2 बार",
    err_q2: "कृपया अपनी राइडिंग आवृत्ति चुनें।",

    q3Title: "3. आप मुख्य रूप से किस लिए राइड करते हैं?",
    q3Helper: `अधिकतम ${LIMITS.ride_purpose} विकल्प चुनें।`,
    rp_office: "कार्यालय / ऑफिस",
    rp_college: "कॉलेज",
    rp_business: "काम / व्यापार",
    rp_delivery: "डिलीवरी",
    rp_touring: "टूरिंग / लंबी यात्रा",
    rp_personal: "व्यक्तिगत",
    err_q3: `कृपया 1 से ${LIMITS.ride_purpose} उद्देश्य चुनें।`,

    q4Title: "4. क्या आप वर्तमान में कोई स्मार्ट / कनेक्टेड डिवाइस उपयोग करते हैं?",
    q4Helper: "जो भी लागू हो उसे चुनें।",
    sd_watch: "स्मार्टवॉच",
    sd_band: "स्मार्ट बैंड / फिटनेस बैंड",
    sd_earbuds: "स्मार्ट ईयरबड्स / ब्लूटूथ डिवाइस",
    sd_smarthome: "स्मार्ट होम / IoT डिवाइस",
    sd_other: "अन्य",
    sd_other_ph: "डिवाइस का नाम लिखें...",
    sd_none: "कोई नहीं (None)",
    err_q4: "कृपया कम से कम एक विकल्प चुनें।",

    q5Title: "5. राइडिंग के दौरान आपको किन समस्याओं का सामना करना पड़ता है?",
    q5Helper: "जो भी लागू हो उसे चुनें।",
    pr_calls: "फ़ोन कॉल उठाना",
    pr_nav: "नेविगेशन / रास्ता देखना",
    pr_roads: "गड्ढे / खराब सड़कें",
    pr_traffic: "भारी ट्रैफ़िक",
    pr_rain: "बारिश / कम दृश्यता",
    pr_heat: "हेलमेट के अंदर गर्मी",
    pr_fatigue: "थकान / लंबी राइड",
    pr_sos: "आपातकालीन / दुर्घटना स्थितियां",
    pr_group: "ग्रुप में बात करना",
    pr_audio: "ऑडियो सुनने में कठिनाई",
    pr_other: "अन्य",
    pr_ph: "अन्य समस्या लिखें...",
    err_q5: "कृपया कम से कम एक समस्या चुनें।",

    q6Title: "6. आपकी सबसे बड़ी #1 राइडिंग समस्या क्या है?",
    q6Helper: "केवल एक विकल्प — आपकी सबसे बड़ी परेशानी",
    bp_safety: "सुरक्षा (Safety)",
    bp_nav: "नेविगेशन (Navigation)",
    bp_comm: "बातचीत / कॉल (Communication)",
    bp_traffic: "ट्रैफ़िक / सड़कें (Traffic / Roads)",
    bp_heat: "गर्मी / आराम (Heat / Comfort)",
    bp_emergency: "आपातकालीन स्थितियां (Emergency Situations)",
    err_q6: "कृपया अपनी #1 सबसे बड़ी समस्या चुनें।",

    q7Title: "7. क्या आपने कभी किसी कठिन या खतरनाक स्थिति का सामना किया है?",
    q7Helper: "हमारी सुरक्षा इंजीनियरिंग के लिए अत्यंत महत्वपूर्ण जानकारी",
    de_serious: "गंभीर दुर्घटना (Serious Accident)",
    de_nearmiss: "बाल-बाल बचना (Near Miss)",
    de_danger: "खतरनाक स्थिति — कोई दुर्घटना नहीं",
    de_no: "नहीं, कभी नहीं (No)",
    de_lbl: "यदि आप चाहें तो संक्षेप में बताएं क्या हुआ था: (वैकल्पिक)",
    de_ph: "उदा. रात में मोड़ पर अचानक फिसलन, सामने वाली गाड़ी का अचानक ब्रेक...",
    err_q7: "कृपया प्रश्न 7 के लिए एक विकल्प चुनें।",

    // Step 2: PRODUCT
    p2Tag: "02 — उत्पाद · चरण 2 (कुल 3)",
    p2Title: 'आप वास्तव में क्या <span class="hl-blue">खरीदना पसंद करेंगे?</span>',
    p2Subtitle: "हमें बताएं कि कौन सा स्मार्ट राइडिंग समाधान आपके लिए सबसे उपयुक्त है।",

    q2_1Title: "1. आपके लिए कौन से फीचर्स सबसे उपयोगी होंगे?",
    q2_1Helper: `अधिकतम ${LIMITS.desired_features} विकल्प चुनें।`,
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
    err_p2_q1: `कृपया 1 से ${LIMITS.desired_features} फीचर्स चुनें।`,

    q2_2Title: "2. आप किस उत्पाद को प्राथमिकता देंगे?",
    q2_2Helper: "वह उत्पाद चुनें जो आपकी जरूरत के अनुसार सही हो",
    p_sh_badge: "फुल हेलमेट",
    p_sh_title: "स्मार्टशील्ड",
    p_sh_sub: "फुल एआई स्मार्ट हेलमेट",
    target_sh_price: "₹2,000–₹6,000",
    sh_feat1: "स्मार्ट सुरक्षा और क्रैश डिटेक्शन",
    sh_feat2: "ब्लूटूथ और नेविगेशन ऑडियो",
    sh_feat3: "एसओएस और हैंड्स-फ्री कॉल्स",
    sh_feat4: "एआई फीचर्स और नया पूरा हेलमेट",

    p_ms_badge: "अपग्रेड किट",
    p_ms_title: "मॉडस्मार्ट",
    p_ms_sub: "अपने मौजूदा हेलमेट को अपग्रेड करें",
    target_ms_price: "₹1,500–₹3,500",
    ms_feat1: "मौजूदा हेलमेट के साथ काम करता है",
    ms_feat2: "ब्लूटूथ और नेविगेशन ऑडियो",
    ms_feat3: "हैंड्स-फ्री कॉल्स और स्मार्ट फीचर्स",
    ms_feat4: "आसान और त्वरित इंस्टॉलेशन",

    p_both: "दोनों / फीचर्स पर निर्भर करता है",
    p_unsure: "निश्चित नहीं",
    viewImage: "फोटो देखें",
    err_p2_q2: "कृपया अपनी पसंद का उत्पाद चुनें।",

    q2_3Title: "3. आपके अनुसार कौन सी कीमत उचित है?",
    q2_3Helper: "वह मूल्य चुनें जो आपको सही और वाजिब लगे",
    sh_price_header: "स्मार्टशील्ड (फुल एआई स्मार्ट हेलमेट)",
    ms_price_header: "मॉडस्मार्ट (मौजूदा हेलमेट अपग्रेड किट)",
    tier_entry: "शुरुआती",
    tier_value: "वैल्यू",
    tier_balanced: "संतुलित",
    tier_premium: "प्रीमियम",
    tier_flagship: "फ्लैगशिप",
    tier_accessible: "सुलभ",
    tier_sweetspot: "स्वीट स्पॉट",
    tier_standard: "स्टैंडर्ड",
    tier_upper: "अपर",
    tier_fullkit: "फुल किट",
    err_p2_q3: "कृपया एक स्वीकार्य मूल्य बिंदु चुनें।",

    q2_4Title: "4. आपको खरीदने से क्या रोक सकता है?",
    q2_4Helper: `अधिकतम ${LIMITS.purchase_barriers} विकल्प चुनें।`,
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
    err_p2_q4: `कृपया 1 से ${LIMITS.purchase_barriers} कारण चुनें।`,

    // Step 3: TRUST & ACCESS
    p3Tag: "03 — विश्वास और अर्ली एक्सेस · चरण 3 (कुल 3)",
    p3Title: 'क्या आप भरोसा करेंगे और <span class="hl-blue">इसे आजमाएंगे?</span>',
    p3Subtitle: "हमें बताएं कि क्या आपको स्मार्टशील्ड या मॉडस्मार्ट चुनने का आत्मविश्वास देगा।",

    q3_1Title: "1. आपको उत्पाद पर किस बात से भरोसा होगा?",
    q3_1Helper: `अधिकतम ${LIMITS.trust_factors} विकल्प चुनें।`,
    tf_isi: "ISI / BIS सर्टिफिकेशन",
    tf_crash: "क्रैश टेस्टिंग प्रमाण",
    tf_warranty: "मजबूत वारंटी",
    tf_water: "वाटरप्रूफिंग",
    tf_battery: "बैटरी सुरक्षा",
    tf_reviews: "असली राइडर्स की समीक्षाएं",
    tf_reputation: "ब्रांड की प्रतिष्ठा",
    tf_demo: "डेमो / टेस्ट राइड",
    tf_india: "मेड इन इंडिया (स्वदेशी)",
    err_p3_q1: `कृपया 1 से ${LIMITS.trust_factors} विश्वास कारक चुनें।`,

    q3_2Title: "2. आप इसे कब खरीदेंगे?",
    q3_2Helper: "आपकी वास्तविक खरीद समयसीमा",
    pi_immediate: "मैं तुरंत खरीदूंगा",
    pi_immediate_sub: "लॉन्च होते ही प्री-ऑर्डर या खरीदने के लिए तैयार।",
    pi_consider: "मैं गंभीरता से विचार करूंगा",
    pi_consider_sub: "रिव्यू और डेमो राइड्स देखने के बाद खरीदने का इरादा।",
    pi_info: "और जानकारी चाहिए",
    pi_info_sub: "क्रैश टेस्ट डेटा और वारंटी विवरण देखना चाहते हैं।",
    pi_notyet: "अभी दिलचस्पी नहीं है",
    pi_notyet_sub: "मौजूदा हेलमेट सेटअप से संतुष्ट हैं।",
    err_p3_q2: "कृपया अपनी खरीद समयसीमा चुनें।",

    q3_3Title: "3. अपने मौजूदा हेलमेट के बारे में बताएं",
    q3_3Helper: "हमारी इंजीनियरिंग और मूल्य निर्धारण में मदद करता है",
    cur_brand_lbl: "मौजूदा हेलमेट का ब्रांड (वैकल्पिक)",
    cur_brand_ph: "उदा. Steelbird, Vega, Studds, Axor, MT, SMK...",
    cur_price_lbl: "मौजूदा हेलमेट की अनुमानित कीमत",
    chp1: "₹1,000 से कम",
    chp2: "₹1,000–₹2,000",
    chp3: "₹2,000–₹3,500",
    chp4: "₹3,500–₹6,000",
    chp5: "₹6,000+",
    err_p3_q3: "कृपया अपने वर्तमान हेलमेट का मूल्य वर्ग चुनें।",

    q3_4Title: "4. क्या आपको यह उत्पाद लेने के लिए प्रेरित करेगा? (वैकल्पिक)",
    q3_4Helper: "कोई खास फीचर या नया विचार जो आप देखना चाहते हैं।",
    product_wishlist_ph: "एक चीज़ जो आप स्मार्टशील्ड या मॉडस्मार्ट में देखना चाहते हैं...",

    ea_badge: "वीआईपी लॉन्च सूची",
    ea_title: "क्या आप अर्ली एक्सेस चाहते हैं?",
    ea_desc: "स्मार्टशील्ड / मॉडस्मार्ट का परीक्षण करने वाले पहले राइडर्स में शामिल हों और प्राथमिकता अपडेट प्राप्त करें।",
    ea_name_lbl: "नाम",
    ea_name_ph: "राइडर का नाम",
    ea_phone_lbl: "फ़ोन नंबर",
    ea_phone_ph: "+91 XXXXX XXXXX",
    ea_email_lbl: "ईमेल",
    ea_email_ph: "rider@email.com",
    submit_ea: "सबमिट करें और अर्ली एक्सेस में शामिल हों ↗",
    err_name: "कृपया अपना पूरा नाम लिखें।",
    err_phone: "कृपया सही 10 अंकों का मोबाइल नंबर लिखें।",
    err_email: "कृपया सही ईमेल पता लिखें।",

    succ_title: "आप शामिल हो गए हैं!",
    succ_lead: "भारत में स्मार्ट राइडिंग तकनीक की अगली पीढ़ी बनाने में हमारी मदद करने के लिए धन्यवाद।",
    succ_sub: "आपकी प्रतिक्रिया सीधे हमारे उत्पाद फीचर्स, मूल्य और अनुभव को प्रभावित करेगी।",
    succ_chip1: "स्मार्टशील्ड × मॉडस्मार्ट",
    succ_chip2: "अंगिरस इंडस्ट्रीज",
    succ_chip3: "पेटेंट नं. 202521123556",
    succ_chip4: "आई-हब जीईसी रायपुर द्वारा इनक्यूबेटेड",
    succ_explore: "अंगिरस इंडस्ट्रीज की वेबसाइट देखें",

    footerDesc: "भारतीय राइडर्स के लिए निर्मित। अंगिरस इंडस्ट्रीज द्वारा क्रैश डिटेक्शन, आपातकालीन एसओएस और कनेक्टेड नेविगेशन तकनीक।",
    footerProducts: "उत्पाद",
    footerCompany: "कंपनी"
  }
};

// ── 5. LIGHTBOX MODAL HANDLERS ──
function openLightbox(src, title) {
  const modal = document.getElementById("image-lightbox-modal");
  const img = document.getElementById("lightbox-img");
  const titleElem = document.getElementById("lightbox-title");
  if (img) {
    img.src = src;
    img.alt = title || "Product Image Preview";
  }
  if (titleElem) {
    titleElem.textContent = title || "Product Image";
  }
  if (modal) {
    modal.classList.add("is-open");
  }
  document.body.style.overflow = "hidden";
}

function closeLightbox(e) {
  if (e && e.target && e.target.closest && e.target.closest(".lightbox-dialog") && !e.target.classList.contains("lightbox-close-btn")) {
    return;
  }
  const modal = document.getElementById("image-lightbox-modal");
  if (modal) {
    modal.classList.remove("is-open");
  }
  document.body.style.overflow = "";
}

function selectAndOpenLightbox(radioId, src, title) {
  const radio = document.getElementById(radioId);
  if (radio) {
    radio.checked = true;
    radio.dispatchEvent(new Event("change", { bubbles: true }));
  }
  openLightbox(src, title);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// ── 6. CONFETTI PARTY FLARES (SUBTLE, DEBOUNCED) ──
function triggerPartyFlare(element) {
  if (typeof confetti !== "function") return;
  const now = Date.now();
  if (now - lastConfettiTime < 150) return;
  lastConfettiTime = now;

  let originX = 0.5;
  let originY = 0.5;

  if (element && typeof element.getBoundingClientRect === "function") {
    const rect = element.getBoundingClientRect();
    originX = Math.min(Math.max((rect.left + rect.width / 2) / window.innerWidth, 0.1), 0.9);
    originY = Math.min(Math.max((rect.top + rect.height / 2) / window.innerHeight, 0.1), 0.9);
  }

  confetti({
    particleCount: 16,
    spread: 45,
    startVelocity: 16,
    origin: { x: originX, y: originY },
    colors: ["#FF9A1F", "#3D9BFF", "#FFFFFF", "#FF5459", "#2FBF86"],
    ticks: 60,
    gravity: 1.1,
    scalar: 0.75,
    disableForReducedMotion: true
  });
}

// ── 7. LANGUAGE SWITCHER ──
function setSurveyLang(lang) {
  currentLang = lang === "hi" ? "hi" : "en";
  document.documentElement.lang = currentLang;

  const btnEn = document.getElementById("lang-btn-en");
  const btnHi = document.getElementById("lang-btn-hi");
  if (btnEn && btnHi) {
    btnEn.classList.toggle("is-active", currentLang === "en");
    btnHi.classList.toggle("is-active", currentLang === "hi");
  }

  const dict = translations[currentLang];
  if (!dict) return;

  // Replace text for data-i18n elements
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  // Replace placeholders for data-i18n-ph elements
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const key = el.getAttribute("data-i18n-ph");
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });

  // Update dynamic counters and HUD status
  updateAllCounters();
  updateHUD(activeStep);
}

// ── 8. MULTI-SELECT CHECKBOX LIMITER HELPER ──
function handleMultiLimit(name, limit, counterId) {
  const container = document.getElementById("pmf-survey-form");
  if (!container) return;

  const checkedBoxes = Array.from(container.querySelectorAll(`input[type="checkbox"][name="${name}"]:checked`));
  const allBoxes = Array.from(container.querySelectorAll(`input[type="checkbox"][name="${name}"]`));

  // Update counter
  const counterEl = document.getElementById(counterId);
  if (counterEl) {
    const count = checkedBoxes.length;
    counterEl.textContent = `${count} / ${limit} selected`;
    counterEl.classList.toggle("active-count", count > 0);
  }

  // Enforce disable on remaining checkboxes if limit reached
  const isFull = checkedBoxes.length >= limit;
  allBoxes.forEach((box) => {
    const parentItem = box.closest(".choice-item");
    if (!box.checked && isFull) {
      box.disabled = true;
      if (parentItem) parentItem.classList.add("disabled-opt");
    } else {
      box.disabled = false;
      if (parentItem) parentItem.classList.remove("disabled-opt");
    }
  });
}

function updateAllCounters() {
  handleMultiLimit("ride_purpose", LIMITS.ride_purpose, "rp-badge-counter");
  handleMultiLimit("desired_features", LIMITS.desired_features, "feat-badge-counter");
  handleMultiLimit("purchase_barriers", LIMITS.purchase_barriers, "barrier-badge-counter");
  handleMultiLimit("trust_factors", LIMITS.trust_factors, "trust-badge-counter");
}

// ── 9. STEP NAVIGATION & VALIDATION ──
function updateHUD(step) {
  activeStep = step;

  // Update Nodes
  for (let i = 1; i <= MAX_STEPS; i++) {
    const node = document.getElementById(`node-step-${i}`);
    if (!node) continue;
    node.classList.remove("is-active", "is-done");
    if (i < step) {
      node.classList.add("is-done");
      node.setAttribute("aria-current", "false");
    } else if (i === step) {
      node.classList.add("is-active");
      node.setAttribute("aria-current", "step");
    } else {
      node.setAttribute("aria-current", "false");
    }
  }

  // Top Tracker Bar
  const progressPct = ((step - 1) / (MAX_STEPS - 1)) * 100;
  const trackBar = document.getElementById("steps-track-progress");
  if (trackBar) trackBar.style.width = `${progressPct}%`;

  // Mini Bar on Container
  const miniBar = document.getElementById("survey-mini-progress");
  if (miniBar) miniBar.style.width = `${(step / MAX_STEPS) * 100}%`;

  // Status Label in Sticky Nav
  const statusLabel = document.getElementById("nav-status-label");
  if (statusLabel) {
    statusLabel.textContent = STEP_NAMES[currentLang][step] || `Step ${step} of 3`;
  }

  // Back Button in Sticky Nav
  const backBtn = document.getElementById("nav-back-btn");
  if (backBtn) {
    backBtn.classList.toggle("is-hidden", step === 1);
  }

  // Continue Button in Sticky Nav (hide on step 3 since early access card has primary submits)
  const continueBtn = document.getElementById("nav-continue-btn");
  if (continueBtn) {
    continueBtn.style.display = step === MAX_STEPS ? "none" : "inline-flex";
  }
}

function showPane(step) {
  for (let i = 1; i <= MAX_STEPS; i++) {
    const pane = document.getElementById(`pane-step-${i}`);
    if (pane) {
      pane.classList.remove("is-active");
    }
  }
  const currentPane = document.getElementById(`pane-step-${step}`);
  if (currentPane) {
    currentPane.classList.add("is-active");
  }
  updateHUD(step);
}

function clearCardErrors(card) {
  if (!card) return;
  card.classList.remove("error-state");
  const errHint = card.querySelector(".error-text-hint");
  if (errHint) errHint.classList.remove("visible");
}

function setCardError(card, hintId) {
  if (!card) return;
  card.classList.add("error-state");
  const hint = document.getElementById(hintId);
  if (hint) hint.classList.add("visible");
}

function setFieldError(inputEl, hintId) {
  if (!inputEl) return;
  inputEl.classList.add("is-invalid");
  const hint = document.getElementById(hintId);
  if (hint) hint.classList.add("visible");
}

function clearFieldError(inputEl, hintId) {
  if (!inputEl) return;
  inputEl.classList.remove("is-invalid");
  const hint = document.getElementById(hintId);
  if (hint) hint.classList.remove("visible");
}

function validateName(val) {
  const trimmed = (val || "").trim();
  return trimmed.length >= 2 && /^[\p{L}\s]+$/u.test(trimmed);
}

function cleanPhone(val) {
  let cleaned = (val || "").replace(/[\s\-\(\)]/g, "");
  if (cleaned.startsWith("+91")) {
    cleaned = cleaned.slice(3);
  } else if (/^91[6-9]\d{9}$/.test(cleaned)) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  }
  return cleaned;
}

function validatePhone(val) {
  const cleaned = cleanPhone(val);
  return /^[6-9]\d{9}$/.test(cleaned);
}

function validateEmail(val) {
  const trimmed = (val || "").trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(trimmed) && !trimmed.includes("..");
}

function validateStep(step) {
  let isValid = true;
  let firstErrCard = null;
  let firstInvalidField = null;

  function markError(cardId, hintId) {
    isValid = false;
    const card = document.getElementById(cardId);
    setCardError(card, hintId);
    if (!firstErrCard && card) firstErrCard = card;
  }

  if (step === 1) {
    // Q1: Occupation
    const occChecked = document.querySelector('input[name="occupation"]:checked');
    if (!occChecked) {
      markError("card-q1", "err-hint-q1");
    }

    // Q2: Ride frequency
    const rfChecked = document.querySelector('input[name="ride_frequency"]:checked');
    if (!rfChecked) {
      markError("card-q2", "err-hint-q2");
    }

    // Q3: Ride purpose (1 to LIMITS.ride_purpose)
    const rpChecked = document.querySelectorAll('input[name="ride_purpose"]:checked');
    if (rpChecked.length < 1 || rpChecked.length > LIMITS.ride_purpose) {
      markError("card-q3", "err-hint-q3");
    }

    // Q4: Smart devices (at least 1)
    const sdChecked = document.querySelectorAll('input[name="smart_devices"]:checked');
    if (sdChecked.length < 1) {
      markError("card-q4", "err-hint-q4");
    }

    // Q5: Riding problems (at least 1)
    const prChecked = document.querySelectorAll('input[name="riding_problems"]:checked');
    if (prChecked.length < 1) {
      markError("card-q5", "err-hint-q5");
    }

    // Q6: Biggest problem
    const bpChecked = document.querySelector('input[name="biggest_problem"]:checked');
    if (!bpChecked) {
      markError("card-q6", "err-hint-q6");
    }

    // Q7: Dangerous experience
    const deChecked = document.querySelector('input[name="dangerous_experience"]:checked');
    if (!deChecked) {
      markError("card-q7", "err-hint-q7");
    }
  } else if (step === 2) {
    // Q1: Desired features (1 to LIMITS.desired_features)
    const featChecked = document.querySelectorAll('input[name="desired_features"]:checked');
    if (featChecked.length < 1 || featChecked.length > LIMITS.desired_features) {
      markError("card-p2-q1", "err-hint-p2-q1");
    }

    // Q2: Product preference
    const prefChecked = document.querySelector('input[name="product_preference"]:checked');
    if (!prefChecked) {
      markError("card-p2-q2", "err-hint-p2-q2");
    }

    // Q3: Price validation depending on preference
    const prefVal = prefChecked ? prefChecked.value : "";
    const shPrice = document.querySelector('input[name="smartshield_price"]:checked');
    const msPrice = document.querySelector('input[name="modsmart_price"]:checked');

    let priceValid = true;
    if (prefVal === "SmartShield" && !shPrice) {
      priceValid = false;
    } else if (prefVal === "ModSmart" && !msPrice) {
      priceValid = false;
    } else if ((prefVal === "Both / Depends on Features" || prefVal === "Not Sure" || !prefVal) && (!shPrice && !msPrice)) {
      priceValid = false;
    }

    if (!priceValid) {
      markError("card-p2-q3", "err-hint-p2-q3");
    }

    // Q4: Purchase barriers (1 to LIMITS.purchase_barriers)
    const barChecked = document.querySelectorAll('input[name="purchase_barriers"]:checked');
    if (barChecked.length < 1 || barChecked.length > LIMITS.purchase_barriers) {
      markError("card-p2-q4", "err-hint-p2-q4");
    }
  } else if (step === 3) {
    // Q1: Trust factors (1 to LIMITS.trust_factors)
    const tfChecked = document.querySelectorAll('input[name="trust_factors"]:checked');
    if (tfChecked.length < 1 || tfChecked.length > LIMITS.trust_factors) {
      markError("card-p3-q1", "err-hint-p3-q1");
    }

    // Q2: Purchase intent
    const piChecked = document.querySelector('input[name="purchase_intent"]:checked');
    if (!piChecked) {
      markError("card-p3-q2", "err-hint-p3-q2");
    }

    // Q3: Current helmet price
    const chpChecked = document.querySelector('input[name="current_helmet_price"]:checked');
    if (!chpChecked) {
      markError("card-p3-q3", "err-hint-p3-q3");
    }

    // Early Access / Contact Details Validation
    const nameInput = document.getElementById("ea_name_val");
    const phoneInput = document.getElementById("ea_phone_val");
    const emailInput = document.getElementById("ea_email_val");

    if (!nameInput || !validateName(nameInput.value)) {
      setFieldError(nameInput, "err-hint-name");
      isValid = false;
      if (!firstInvalidField) firstInvalidField = nameInput;
    } else {
      clearFieldError(nameInput, "err-hint-name");
    }

    if (!phoneInput || !validatePhone(phoneInput.value)) {
      setFieldError(phoneInput, "err-hint-phone");
      isValid = false;
      if (!firstInvalidField) firstInvalidField = phoneInput;
    } else {
      clearFieldError(phoneInput, "err-hint-phone");
    }

    if (!emailInput || !validateEmail(emailInput.value)) {
      setFieldError(emailInput, "err-hint-email");
      isValid = false;
      if (!firstInvalidField) firstInvalidField = emailInput;
    } else {
      clearFieldError(emailInput, "err-hint-email");
    }
  }

  if (!isValid) {
    if (firstErrCard) {
      firstErrCard.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (firstInvalidField) {
      firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalidField.focus();
    }
    showToast(currentLang === "hi" ? "कृपया सभी आवश्यक फ़ील्ड सही भरें।" : "Please complete all required fields correctly.", "error");
  }

  return isValid;
}

function checkPageValidity(step) {
  return validateStep(step);
}

function goToStep(fromStep, toStep) {
  if (toStep > fromStep) {
    if (!validateStep(fromStep)) return;
  }
  if (toStep >= 1 && toStep <= MAX_STEPS) {
    showPane(toStep);
    const stage = document.getElementById("survey-stage");
    if (stage) {
      stage.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}

function jumpToStep(targetStep) {
  if (targetStep === activeStep) return;
  if (targetStep > activeStep) {
    if (!validateStep(activeStep)) return;
  }
  goToStep(activeStep, targetStep);
}

function startSurveyScroll() {
  const stage = document.getElementById("survey-stage");
  if (stage) {
    stage.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ── 10. TOAST SYSTEM ──
function showToast(msg, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("is-visible");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("is-visible");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── 11. DYNAMIC PRICING VISIBILITY ──
function updatePricingVisibility() {
  const prefChecked = document.querySelector('input[name="product_preference"]:checked');
  const shBlock = document.getElementById("sh-pricing-block");
  const msBlock = document.getElementById("ms-pricing-block");

  if (!shBlock || !msBlock) return;

  if (!prefChecked) {
    shBlock.style.display = "block";
    msBlock.style.display = "block";
    return;
  }

  const val = prefChecked.value;
  if (val === "SmartShield") {
    shBlock.style.display = "block";
    msBlock.style.display = "none";
  } else if (val === "ModSmart") {
    shBlock.style.display = "none";
    msBlock.style.display = "block";
  } else {
    shBlock.style.display = "block";
    msBlock.style.display = "block";
  }
}

// ── 12. GATHER PAYLOAD AND SUBMIT ──
function collectSurveyPayload() {
  // Occupation
  const occ = document.querySelector('input[name="occupation"]:checked');
  surveyAnswers.occupation = occ ? occ.value : "";
  const occOther = document.getElementById("occ_other_val");
  surveyAnswers.occupation_other = (surveyAnswers.occupation === "Other" && occOther) ? occOther.value.trim() : "";

  // Ride Frequency
  const rf = document.querySelector('input[name="ride_frequency"]:checked');
  surveyAnswers.ride_frequency = rf ? rf.value : "";

  // Ride Purpose
  surveyAnswers.ride_purpose = Array.from(document.querySelectorAll('input[name="ride_purpose"]:checked')).map(el => el.value);

  // Smart Devices
  const sdChecked = Array.from(document.querySelectorAll('input[name="smart_devices"]:checked')).map(el => el.value);
  surveyAnswers.smart_devices = sdChecked;
  const sdOther = document.getElementById("sd_other_val");
  surveyAnswers.smart_devices_other = (sdChecked.includes("Other") && sdOther) ? sdOther.value.trim() : "";

  // Riding Problems
  const prChecked = Array.from(document.querySelectorAll('input[name="riding_problems"]:checked')).map(el => el.value);
  surveyAnswers.riding_problems = prChecked;
  const prOther = document.getElementById("pr_other_val");
  surveyAnswers.riding_problems_other = (prChecked.includes("Other") && prOther) ? prOther.value.trim() : "";

  // Biggest Problem
  const bp = document.querySelector('input[name="biggest_problem"]:checked');
  surveyAnswers.biggest_problem = bp ? bp.value : "";

  // Dangerous Experience
  const de = document.querySelector('input[name="dangerous_experience"]:checked');
  surveyAnswers.dangerous_experience = de ? de.value : "";
  const deDetails = document.getElementById("de_details_val");
  surveyAnswers.dangerous_experience_details = (surveyAnswers.dangerous_experience !== "No" && deDetails) ? deDetails.value.trim() : "";

  // Desired Features
  surveyAnswers.desired_features = Array.from(document.querySelectorAll('input[name="desired_features"]:checked')).map(el => el.value);

  // Product Preference
  const pref = document.querySelector('input[name="product_preference"]:checked');
  surveyAnswers.product_preference = pref ? pref.value : "";

  // Pricing
  const shp = document.querySelector('input[name="smartshield_price"]:checked');
  surveyAnswers.smartshield_price = shp ? shp.value : "";
  const msp = document.querySelector('input[name="modsmart_price"]:checked');
  surveyAnswers.modsmart_price = msp ? msp.value : "";

  // Purchase Barriers
  const barChecked = Array.from(document.querySelectorAll('input[name="purchase_barriers"]:checked')).map(el => el.value);
  surveyAnswers.purchase_barriers = barChecked;
  const barOther = document.getElementById("bar_other_val");
  surveyAnswers.purchase_barriers_other = (barChecked.includes("Other") && barOther) ? barOther.value.trim() : "";

  // Trust Factors
  surveyAnswers.trust_factors = Array.from(document.querySelectorAll('input[name="trust_factors"]:checked')).map(el => el.value);

  // Purchase Intent
  const pi = document.querySelector('input[name="purchase_intent"]:checked');
  surveyAnswers.purchase_intent = pi ? pi.value : "";

  // Current Helmet
  const curBrand = document.getElementById("cur_helmet_brand_val");
  surveyAnswers.current_helmet_brand = curBrand ? curBrand.value.trim() : "";
  const chp = document.querySelector('input[name="current_helmet_price"]:checked');
  surveyAnswers.current_helmet_price = chp ? chp.value : "";

  // Feedback
  const feed = document.getElementById("product_wishlist_val");
  surveyAnswers.product_feedback = feed ? feed.value.trim() : "";

  // Early Access / Contact (Always early_access: true, validated name, phone, email)
  const nameInput = document.getElementById("ea_name_val");
  const phoneInput = document.getElementById("ea_phone_val");
  const emailInput = document.getElementById("ea_email_val");

  surveyAnswers.early_access = true;
  surveyAnswers.name = nameInput ? nameInput.value.trim() : "";
  surveyAnswers.phone = phoneInput ? "+91" + cleanPhone(phoneInput.value) : "";
  surveyAnswers.email = emailInput ? emailInput.value.trim().toLowerCase() : "";

  // Build standard format payload with comma-joined arrays
  return {
    occupation: surveyAnswers.occupation_other ? `${surveyAnswers.occupation} (${surveyAnswers.occupation_other})` : surveyAnswers.occupation,
    ride_frequency: surveyAnswers.ride_frequency,
    ride_purpose: surveyAnswers.ride_purpose.join(", "),
    smart_devices: surveyAnswers.smart_devices_other ? surveyAnswers.smart_devices.map(d => d === "Other" ? `Other: ${surveyAnswers.smart_devices_other}` : d).join(", ") : surveyAnswers.smart_devices.join(", "),
    riding_problems: surveyAnswers.riding_problems_other ? surveyAnswers.riding_problems.map(p => p === "Other" ? `Other: ${surveyAnswers.riding_problems_other}` : p).join(", ") : surveyAnswers.riding_problems.join(", "),
    biggest_problem: surveyAnswers.biggest_problem,
    dangerous_experience: surveyAnswers.dangerous_experience,
    dangerous_experience_details: surveyAnswers.dangerous_experience_details,
    desired_features: surveyAnswers.desired_features.join(", "),
    product_preference: surveyAnswers.product_preference,
    smartshield_price: surveyAnswers.smartshield_price,
    modsmart_price: surveyAnswers.modsmart_price,
    purchase_barriers: surveyAnswers.purchase_barriers_other ? surveyAnswers.purchase_barriers.map(b => b === "Other" ? `Other: ${surveyAnswers.purchase_barriers_other}` : b).join(", ") : surveyAnswers.purchase_barriers.join(", "),
    trust_factors: surveyAnswers.trust_factors.join(", "),
    purchase_intent: surveyAnswers.purchase_intent,
    current_helmet_brand: surveyAnswers.current_helmet_brand,
    current_helmet_price: surveyAnswers.current_helmet_price,
    product_feedback: surveyAnswers.product_feedback,
    name: surveyAnswers.name,
    phone: surveyAnswers.phone,
    email: surveyAnswers.email,
    early_access: true,
    timestamp: new Date().toISOString(),
    language: currentLang
  };
}

async function executeSubmission() {
  if (!checkPageValidity(3)) return;

  const submitBtn = document.getElementById("main-submit-btn");
  if (submitBtn) {
    submitBtn.classList.add("is-loading");
    submitBtn.disabled = true;
  }

  const payload = collectSurveyPayload();

  try {
    // Send to Google Apps Script via POST
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // Hide panes & sticky nav, show success
    for (let i = 1; i <= MAX_STEPS; i++) {
      const pane = document.getElementById(`pane-step-${i}`);
      if (pane) pane.classList.remove("is-active");
    }
    const stickyNav = document.getElementById("sticky-bottom-nav");
    if (stickyNav) stickyNav.style.display = "none";

    const successPane = document.getElementById("pane-success");
    if (successPane) {
      successPane.classList.add("is-active");
      successPane.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Celebration confetti
    if (typeof confetti === "function") {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FF9A1F", "#3D9BFF", "#2FBF86", "#FFFFFF"]
      });
    }
  } catch (err) {
    console.error("Submission Error:", err);
    showToast(currentLang === "hi" ? "सबमिट करने में त्रुटि हुई। कृपया पुनः प्रयास करें।" : "Failed to submit survey. Please try again.", "error");
    if (submitBtn) {
      submitBtn.classList.remove("is-loading");
      submitBtn.disabled = false;
    }
  }
}

// ── 13. DOM EVENTS & INITIALIZATION ──
document.addEventListener("DOMContentLoaded", () => {
  // Init Vanta Waves
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion && typeof window.VANTA !== "undefined" && typeof window.VANTA.WAVES === "function") {
    try {
      vantaEffect = window.VANTA.WAVES({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x14213a,
        shininess: 103.0,
        waveHeight: 26.5,
        waveSpeed: 0.95,
        zoom: 0.99
      });
    } catch (e) {
      console.warn("Vanta.js init notice:", e);
    }
  }

  // Setup Form Change Listeners
  const form = document.getElementById("pmf-survey-form");
  if (form) {
    form.addEventListener("change", (e) => {
      const target = e.target;
      if (!target) return;

      const card = target.closest(".question-card");
      if (card) clearCardErrors(card);

      // Party flare on check
      if (target.type === "checkbox" || target.type === "radio") {
        if (target.checked) {
          triggerPartyFlare(target.closest(".choice-label") || target);
        }
      }

      // Step 1: Occupation "Other" reveal
      if (target.name === "occupation") {
        const occBox = document.getElementById("occ-other-box");
        if (occBox) {
          occBox.classList.toggle("visible", target.value === "Other");
          if (target.value === "Other") {
            const inp = document.getElementById("occ_other_val");
            if (inp) inp.focus();
          }
        }
      }

      // Step 1: Ride Purpose multi limit
      if (target.name === "ride_purpose") {
        handleMultiLimit("ride_purpose", LIMITS.ride_purpose, "rp-badge-counter");
      }

      // Step 1: Smart Devices "None" exclusivity & "Other" reveal
      if (target.name === "smart_devices") {
        if (target.value === "None" && target.checked) {
          document.querySelectorAll('input[name="smart_devices"]').forEach((cb) => {
            if (cb.value !== "None") cb.checked = false;
          });
        } else if (target.value !== "None" && target.checked) {
          const noneCb = document.getElementById("sd_6");
          if (noneCb) noneCb.checked = false;
        }

        const sdOtherChecked = !!document.querySelector('input[name="smart_devices"][value="Other"]:checked');
        const sdBox = document.getElementById("sd-other-box");
        if (sdBox) {
          sdBox.classList.toggle("visible", sdOtherChecked);
          if (sdOtherChecked) {
            const inp = document.getElementById("sd_other_val");
            if (inp) inp.focus();
          }
        }
      }

      // Step 1: Riding Problems "Other" reveal
      if (target.name === "riding_problems") {
        const prOtherChecked = !!document.querySelector('input[name="riding_problems"][value="Other"]:checked');
        const prBox = document.getElementById("pr-other-box");
        if (prBox) {
          prBox.classList.toggle("visible", prOtherChecked);
          if (prOtherChecked) {
            const inp = document.getElementById("pr_other_val");
            if (inp) inp.focus();
          }
        }
      }

      // Step 1: Dangerous Experience details reveal (if not 'No')
      if (target.name === "dangerous_experience") {
        const deBox = document.getElementById("de-details-box");
        if (deBox) {
          deBox.classList.toggle("visible", target.value !== "No");
        }
      }

      // Step 2: Desired Features multi limit
      if (target.name === "desired_features") {
        handleMultiLimit("desired_features", LIMITS.desired_features, "feat-badge-counter");
      }

      // Step 2: Product preference -> adaptive pricing
      if (target.name === "product_preference") {
        updatePricingVisibility();
      }

      // Step 2: Purchase Barriers multi limit & "Other" reveal
      if (target.name === "purchase_barriers") {
        handleMultiLimit("purchase_barriers", LIMITS.purchase_barriers, "barrier-badge-counter");
        const barOtherChecked = !!document.querySelector('input[name="purchase_barriers"][value="Other"]:checked');
        const barBox = document.getElementById("bar-other-box");
        if (barBox) {
          barBox.classList.toggle("visible", barOtherChecked);
          if (barOtherChecked) {
            const inp = document.getElementById("bar_other_val");
            if (inp) inp.focus();
          }
        }
      }

      // Step 3: Trust Factors multi limit
      if (target.name === "trust_factors") {
        handleMultiLimit("trust_factors", LIMITS.trust_factors, "trust-badge-counter");
      }
    });
  }

  // Early Access / Contact Inputs blur & realtime validation listeners
  const nameInput = document.getElementById("ea_name_val");
  const phoneInput = document.getElementById("ea_phone_val");
  const emailInput = document.getElementById("ea_email_val");

  if (nameInput) {
    nameInput.addEventListener("blur", () => {
      if (!validateName(nameInput.value)) {
        setFieldError(nameInput, "err-hint-name");
      } else {
        clearFieldError(nameInput, "err-hint-name");
      }
    });
    nameInput.addEventListener("input", () => {
      if (validateName(nameInput.value)) {
        clearFieldError(nameInput, "err-hint-name");
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener("blur", () => {
      if (!validatePhone(phoneInput.value)) {
        setFieldError(phoneInput, "err-hint-phone");
      } else {
        clearFieldError(phoneInput, "err-hint-phone");
      }
    });
    phoneInput.addEventListener("input", () => {
      if (validatePhone(phoneInput.value)) {
        clearFieldError(phoneInput, "err-hint-phone");
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener("blur", () => {
      if (!validateEmail(emailInput.value)) {
        setFieldError(emailInput, "err-hint-email");
      } else {
        clearFieldError(emailInput, "err-hint-email");
      }
    });
    emailInput.addEventListener("input", () => {
      if (validateEmail(emailInput.value)) {
        clearFieldError(emailInput, "err-hint-email");
      }
    });
  }

  // Initialize display
  updateAllCounters();
  updatePricingVisibility();
  updateHUD(1);
});

// Window resize safety for Vanta
window.addEventListener("beforeunload", () => {
  if (vantaEffect) {
    try {
      vantaEffect.destroy();
    } catch (e) {}
  }
});

// Global exports for inline HTML handlers
window.setSurveyLang = setSurveyLang;
window.startSurveyScroll = startSurveyScroll;
window.jumpToStep = jumpToStep;
window.goToStep = goToStep;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.selectAndOpenLightbox = selectAndOpenLightbox;
window.executeSubmission = executeSubmission;
window.checkPageValidity = checkPageValidity;
window.validateName = validateName;
window.validatePhone = validatePhone;
window.validateEmail = validateEmail;
