// Survey JavaScript

// Toast notification helper
function showToast(message, variant = 'primary') {
  const alert = Object.assign(document.createElement('sl-alert'), {
    variant,
    closable: true,
    duration: 3000,
    innerHTML: `<sl-icon name="${variant === 'danger' ? 'exclamation-octagon' : variant === 'success' ? 'check2-circle' : 'info-circle'}" slot="icon"></sl-icon>${message}`
  });
  document.body.append(alert);

  // Wait for Shoelace to be ready before showing toast
  requestAnimationFrame(() => {
    alert.toast();
  });
}

let currentStep = 1;
const totalSteps = parseInt(document.getElementById('totalQuestions')?.value || 0);
const surveyForm = document.getElementById('surveyForm');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

// Update progress bar
function updateProgress() {
  const progress = (currentStep / totalSteps) * 100;
  document.getElementById('progressBar').style.width = progress + '%';
  document.getElementById('currentStep').textContent = currentStep;
}

// Show specific step
function showStep(step) {
  const steps = document.querySelectorAll('.question-step');
  steps.forEach((el, index) => {
    if (index + 1 === step) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });

  // Update button visibility
  if (step === 1) {
    prevBtn.classList.add('hidden');
  } else {
    prevBtn.classList.remove('hidden');
  }

  if (step === totalSteps) {
    nextBtn.classList.add('hidden');
    submitBtn.classList.remove('hidden');
  } else {
    nextBtn.classList.remove('hidden');
    submitBtn.classList.add('hidden');
  }

  updateProgress();
}

// Validate current step
function validateCurrentStep() {
  const currentStepEl = document.querySelector(`.question-step:not(.hidden)`);
  const questionType = currentStepEl.dataset.type;

  // Splash screens don't need validation
  if (questionType === 'splash') return true;

  const input = currentStepEl.querySelector('.survey-input');
  const isRequired = currentStepEl.dataset.required === 'true';

  if (!isRequired) return true;

  // Get value based on input type
  let value = '';
  if (questionType === 'yes_no') {
    // Check for selected radio using Shoelace's value property
    value = input.value || '';
  } else {
    value = input.value?.trim() || '';
  }

  if (isRequired && !value) {
    showToast('Please answer this question before continuing.', 'warning');
    return false;
  }

  // Additional validation for specific types
  if (value && questionType === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showToast('Please enter a valid email address.', 'warning');
      return false;
    }
  }

  if (value && questionType === 'url') {
    try {
      new URL(value);
    } catch {
      showToast('Please enter a valid URL (e.g., https://example.com)', 'warning');
      return false;
    }
  }

  return true;
}

// Next button
nextBtn?.addEventListener('click', () => {
  if (validateCurrentStep()) {
    currentStep++;
    showStep(currentStep);
  }
});

// Previous button
prevBtn?.addEventListener('click', () => {
  currentStep--;
  showStep(currentStep);
});

// Prevent Enter key from submitting form (except on last step)
surveyForm?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && currentStep < totalSteps) {
    e.preventDefault();
    if (validateCurrentStep()) {
      currentStep++;
      showStep(currentStep);
    }
  }
});

// Form submission
surveyForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateCurrentStep()) return;

  // Collect all answers
  const answers = [];
  const steps = document.querySelectorAll('.question-step');

  steps.forEach(step => {
    const questionId = step.dataset.id;
    const questionType = step.dataset.type;

    // Skip splash screens - they don't have answers
    if (questionType === 'splash') return;

    const input = step.querySelector('.survey-input');

    let answer = '';
    if (questionType === 'yes_no') {
      // Use Shoelace's value property for radio groups
      answer = input.value || '';
    } else {
      answer = input.value?.trim() || '';
    }

    if (answer) {
      answers.push({
        questionId,
        answer
      });
    }
  });

  // Submit to server
  try {
    const response = await fetch('/survey/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });

    if (response.ok) {
      surveyForm.classList.add('hidden');
      successMessage.classList.remove('hidden');
      document.querySelector('.mb-8').classList.add('hidden'); // Hide progress bar
    } else {
      const error = await response.json();
      showToast('Error submitting survey: ' + error.error, 'danger');
    }
  } catch (error) {
    showToast('Error: ' + error.message, 'danger');
  }
});

// No longer needed - Shoelace radio groups handle their own state

// Initialize
if (totalSteps > 0) {
  showStep(1);
}
