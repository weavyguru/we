const { translateBatch } = require('../services/translation');

/**
 * Pre-translate all strings for a page
 * @param {Object} strings - Object with key-value pairs of strings to translate
 * @param {string} lang - Target language
 * @returns {Promise<Object>} - Object with translated strings
 */
async function translatePageStrings(strings, lang) {
  if (lang === 'en') return strings;

  const keys = Object.keys(strings);
  const values = Object.values(strings);

  const translations = await translateBatch(values, lang);

  const result = {};
  keys.forEach((key, index) => {
    result[key] = translations[index];
  });

  return result;
}

// Home page strings
const homePageStrings = {
  hero_title: 'Turning Ideas into Ventures',
  hero_together: 'together',
  hero_subtitle: "We partner with intrapreneurs who've identified real pain points. Together, we build micro-SaaS solutions with extreme speed, scale to $20-50k MRR, and create successful exits.",
  hero_cta: 'Start Building Together',

  feature1_title: 'Extreme Speed',
  feature1_desc: 'From idea to launch in weeks, not months',
  feature2_title: 'Proven Process',
  feature2_desc: 'Battle-tested methodology for micro-SaaS success',
  feature3_title: 'Scale & Exit',
  feature3_desc: '$20-50k MRR with clear exit strategies',

  process_title: 'Our Proven Process',
  process_subtitle: "From pain point to profitable exit, we've refined our approach to maximize speed and success rates.",

  phase1_label: 'Phase 1',
  phase1_title: 'Identify Pain Points',
  phase1_desc: 'We work with intrapreneurs who have already identified real market problems through their industry experience.',
  phase2_label: 'Phase 2',
  phase2_title: 'Rapid Ideation',
  phase2_desc: 'Together, we validate the problem and design a lean micro-SaaS solution that addresses the core pain point.',
  phase3_label: 'Phase 3',
  phase3_title: 'Build & Launch',
  phase3_desc: 'Our experienced team builds the MVP with extreme speed while you help on market validation and early customers.',
  phase4_label: 'Phase 4',
  phase4_title: 'Scale & Exit',
  phase4_desc: 'We optimize for growth, scale to $20-50k MRR, and prepare for strategic partnerships or acquisition exits.',

  partnership_title: 'End-to-End Partnership',
  partnership_subtitle: 'Together we build and scale our micro-SaaS venture.',

  service1_title: 'Technical Development',
  service1_desc: 'Full-stack development with modern technologies, optimized for speed and scalability.',
  service2_title: 'Market Validation',
  service2_desc: 'Customer discovery, MVP testing, and product-market fit validation before scaling.',
  service3_title: 'Growth Strategy',
  service3_desc: 'Data-driven growth tactics to reach $30-50k MRR with sustainable unit economics.',
  service4_title: 'Risk Mitigation',
  service4_desc: 'Lean startup methodology to minimize risk and maximize learning velocity.',
  service5_title: 'Business Operations',
  service5_desc: 'Legal structure, financial planning, and operational systems for smooth scaling.',
  service6_title: 'Exit Preparation',
  service6_desc: 'Strategic positioning and preparation for acquisitions or strategic partnerships.',

  track_title: 'Proven Track Record',
  track_subtitle: "Our results speak for themselves. We've helped dozens of intrapreneurs turn their ideas into successful ventures.",
  track1_value: '8 weeks',
  track1_label: 'Average time to launch',
  track2_value: '$35k',
  track2_label: 'Average MRR at exit',
  track3_value: '85%',
  track3_label: 'Success rate to profitability',
  track4_value: '12 months',
  track4_label: 'Average time to exit',

  cta_title: 'Ready to Turn Your Idea into a Venture?',
  cta_subtitle: "If you've identified a real pain point and are ready to build something together, let's talk.",
  cta_what_you_get: 'What You Get:',
  cta_benefit1: 'No upfront costs',
  cta_benefit2: 'Retain significant equity in your venture',
  cta_benefit3: 'Experienced team with proven track record',
  cta_benefit4: 'End-to-end support from idea to exit',
  cta_are_you_ready: 'Are You Ready?',
  cta_ready1: "You've identified a real pain point",
  cta_ready2: 'You have industry expertise',
  cta_ready3: "You're committed to building together",
  cta_ready4: 'You want to move fast',
  cta_button: 'Share your idea'
};

// FAQ page strings
const faqPageStrings = {
  hero_title: 'FAQ – For Those with an Idea',
  hero_subtitle: 'Everything you need to know about working with us to turn your idea into a venture.',

  section1_title: 'About the Process',
  q1_1_question: 'What is a venture studio and how does it differ from an incubator or accelerator?',
  q1_1_answer: 'A venture studio builds "our own companies from idea to exit." An incubator or accelerator makes you do the work and they offer business development to startup companies.',
  q1_2_question: 'How does the process work if I want to pitch an idea?',
  q1_2_answer: 'You submit through our form. We respond quickly and book a short virtual meeting if the idea feels right. The step after that is a physical meeting.',
  q1_3_question: 'What types of ideas are you looking for?',
  q1_3_answer: 'Niche digital services that can "scale" and where you have industry knowledge or good insight about a real problem.',
  q1_4_question: 'What do you mean by niche?',
  q1_4_answer: 'Smaller solutions to an annoying problem. For example, you\'re in a workflow and it takes enormous time to convert data from one format to another to move information. Or you improve an existing feature in an existing platform.',
  q1_5_question: 'Does the idea have to be completely unique or can it build on something that already exists?',
  q1_5_answer: 'It doesn\'t need to be unique – many winning companies are improvements of something that already works.',

  section2_title: 'About the Collaboration',
  q2_1_question: 'Do I need to know how to code or build the product myself?',
  q2_1_answer: 'No. That\'s our role. Your role is to be a subject matter expert and "pilot customer" where you provide initial testing – preferably in a live environment – and then give feedback for modification and further development. We build – you help us hit the mark.',
  q2_2_question: 'How does ownership and share distribution work in the project?',
  q2_2_answer: 'As the idea contributor and active participant, you receive "options" in the company formed for the idea.',
  q2_3_question: 'Can I participate as an active co-owner in the company that\'s created?',
  q2_3_answer: 'Yes.',
  q2_4_question: 'What happens if I don\'t want to or can\'t engage more than contributing the idea?',
  q2_4_answer: 'Then it\'s not interesting for us. We need an engaged counterpart with knowledge about the problem to validate the idea.',

  section3_title: 'About Ideas and Intellectual Property',
  q3_1_question: 'How is my idea protected when I share it with you?',
  q3_1_answer: 'We handle all incoming ideas professionally. Our business model is to work together with people with expertise on a subject. We don\'t realize any ideas without a person like you who is engaged with deep knowledge and commitment.',
  q3_2_question: 'Can I submit multiple ideas?',
  q3_2_answer: 'Of course! Send as many as you want.',
  q3_3_question: 'What happens if someone else submits a similar idea?',
  q3_3_answer: 'We only invest in the combination of person + knowledge + idea we believe in the most.',

  section4_title: 'About the Selection',
  q4_1_question: 'How do you choose which ideas to invest in?',
  q4_1_answer: 'We look at "scalability and market" for the product as well as "knowledge level/competence/personality" for you who submitted the idea.',
  q4_2_question: 'What\'s the most common reason an idea doesn\'t move forward?',
  q4_2_answer: 'That we don\'t believe in it.',
  q4_3_question: 'How long does it take to get a response?',
  q4_3_answer: 'Usually within two weeks.',

  section5_title: 'About the Journey Forward',
  q5_1_question: 'How long does it take from idea to finished product?',
  q5_1_answer: 'The goal is 8 weeks.',
  q5_2_question: 'What are your expectations of me to help find customers and launch?',
  q5_2_answer: 'You participate as the "first customer case" and serve as a reference.',
  q5_3_question: 'Can you bring in external investors in the next step?',
  q5_3_answer: 'Yes.',
  q5_4_question: 'What happens if the project fails?',
  q5_4_answer: 'Then the project is closed down.',

  section6_title: 'About the Idea Provider',
  q6_1_question: 'Do I need to have a company to participate?',
  q6_1_answer: 'No.',
  q6_2_question: 'Does it cost anything for me to pitch an idea?',
  q6_2_answer: 'No.',
  q6_3_question: 'Can I be anonymous when I submit an idea?',
  q6_3_answer: 'No.',
  q6_4_question: 'Can I pitch as a student, employee, or together with a team?',
  q6_4_answer: 'Absolutely – we welcome everyone.',

  section7_title: 'About Economics & Returns',
  q7_1_question: 'Do I get any compensation directly when you choose my idea?',
  q7_1_answer: 'No, the compensation lies in the "ownership."',
  q7_2_question: 'How much of the company can I expect to own?',
  q7_2_answer: 'Up for discussion depending on your engagement, but it happens through options.',
  q7_3_question: 'How and when do I make money from my idea?',
  q7_3_answer: 'When the project becomes a company that is then sold.',
  q7_4_question: 'How do you view exits or sales of companies started in the studio?',
  q7_4_answer: 'A sale of the company is always our goal, where we build for exit within 18–24 months.',

  section8_title: 'About Security & Long-term',
  q8_1_question: 'What happens if I change my mind and want to leave the project?',
  q8_1_answer: 'Then you drop out and your ownership is at risk.',
  q8_2_question: 'What happens to the code and IP if we end the collaboration?',
  q8_2_answer: 'Everything remains in the company.',

  section9_title: 'About Our Studio',
  q9_1_question: 'Why should I choose your venture studio over trying myself?',
  q9_1_answer: 'There\'s no faster way to go from idea to product.',
  q9_2_question: 'What success stories or cases have you already built?',
  q9_2_answer: 'The Gundar team has built and sold several software companies with good results.',

  cta_title: 'Still Have Questions?',
  cta_subtitle: "We're here to help. Share your idea and let's talk.",
  cta_button: 'Share your idea'
};

// Survey page strings
const surveyPageStrings = {
  page_title: 'Share Your Idea',
  page_subtitle: "We're excited to learn about your vision. Take a few moments to answer these questions.",
  progress: 'Progress',
  prev_button: 'Previous',
  next_button: 'Next',
  submit_button: 'Submit',
  success_title: 'Thank You!',
  success_message: "Your responses have been submitted successfully. We'll review your idea and get back to you soon.",
  back_home: 'Back to Home',
  yes: 'Yes',
  no: 'No',
  required: '* Required',
  placeholder_text: 'Type your answer...',
  placeholder_email: 'your@email.com',
  placeholder_url: 'https://example.com',
  placeholder_textarea: 'Type your answer here...',
  no_questions: 'No survey questions available yet.'
};

// Header navigation strings (shared across all pages)
const headerStrings = {
  nav_about: 'About',
  nav_process: 'Process',
  nav_services: 'Services',
  nav_faq: 'FAQ',
  nav_contact: 'Contact',
  nav_cta: 'Partner with Us'
};

// Footer strings (shared across all pages)
const footerStrings = {
  tagline: 'Turning ideas into ventures, together. We partner with intrapreneurs to build successful micro-SaaS ventures.',
  process_title: 'Process',
  process_approach: 'Our Approach',
  process_services: 'Services',
  process_partnership: 'Partnership',
  company_title: 'Company',
  company_about: 'About',
  company_faq: 'FAQ',
  company_contact: 'Contact',
  company_cases: 'Case Studies',
  legal_title: 'Legal',
  legal_privacy: 'Privacy Policy',
  legal_terms: 'Terms of Service',
  copyright: '2025 We Venture Studio. All rights reserved.'
};

module.exports = {
  translatePageStrings,
  homePageStrings,
  faqPageStrings,
  surveyPageStrings,
  headerStrings,
  footerStrings
};
