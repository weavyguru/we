// Admin Dashboard JavaScript

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

const modal = document.getElementById('questionModal');
const questionForm = document.getElementById('questionForm');
const addQuestionBtn = document.getElementById('addQuestionBtn');
const cancelBtn = document.getElementById('cancelBtn');
const questionsList = document.getElementById('questionsList');

let editingQuestionId = null;

// Open modal for adding new question
addQuestionBtn?.addEventListener('click', () => {
  modal.label = 'Add Question';
  questionForm.reset();
  editingQuestionId = null;
  document.getElementById('questionId').value = '';
  modal.show();
});

// Cancel button
cancelBtn?.addEventListener('click', () => {
  modal.hide();
});

// Handle form submission
questionForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const questionText = document.getElementById('questionText').value;
  const body = document.getElementById('questionBody').value;
  const type = document.getElementById('questionType').value;
  const required = document.getElementById('questionRequired').checked;

  const data = { questionText, body, type, required };

  try {
    let response;
    if (editingQuestionId) {
      // Update existing question
      response = await fetch(`/admin/questions/${editingQuestionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      // Create new question
      response = await fetch('/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }

    if (response.ok) {
      modal.hide();
      location.reload(); // Reload to show updated list
    } else {
      const error = await response.json();
      showToast('Error: ' + error.error, 'danger');
    }
  } catch (error) {
    showToast('Error saving question: ' + error.message, 'danger');
  }
});

// Edit button handlers
document.querySelectorAll('.edit-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const questionId = e.currentTarget.dataset.id;
    editingQuestionId = questionId;

    // Fetch question data
    try {
      const response = await fetch('/admin/questions');
      const questions = await response.json();
      const question = questions.find(q => q._id === questionId);

      if (question) {
        modal.label = 'Edit Question';
        document.getElementById('questionId').value = question._id;
        document.getElementById('questionText').value = question.questionText;
        document.getElementById('questionBody').value = question.body || '';
        document.getElementById('questionType').value = question.type;
        document.getElementById('questionRequired').checked = question.required;
        modal.show();
      }
    } catch (error) {
      showToast('Error loading question: ' + error.message, 'danger');
    }
  });
});

// Delete button handlers
document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const questionId = e.currentTarget.dataset.id;

    if (confirm('Are you sure you want to delete this question?')) {
      try {
        const response = await fetch(`/admin/questions/${questionId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          location.reload();
        } else {
          const error = await response.json();
          showToast('Error: ' + error.error, 'danger');
        }
      } catch (error) {
        showToast('Error deleting question: ' + error.message, 'danger');
      }
    }
  });
});

// Drag and Drop functionality
let draggedElement = null;

document.querySelectorAll('.question-item').forEach(item => {
  const dragHandle = item.querySelector('.drag-handle');

  dragHandle.addEventListener('mousedown', () => {
    item.setAttribute('draggable', 'true');
  });

  item.addEventListener('dragstart', (e) => {
    draggedElement = item;
    item.style.opacity = '0.5';
  });

  item.addEventListener('dragend', (e) => {
    item.style.opacity = '1';
    item.setAttribute('draggable', 'false');
  });

  item.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  item.addEventListener('drop', async (e) => {
    e.preventDefault();

    if (draggedElement !== item) {
      // Get all items
      const items = Array.from(questionsList.querySelectorAll('.question-item'));
      const draggedIndex = items.indexOf(draggedElement);
      const targetIndex = items.indexOf(item);

      // Reorder in DOM
      if (draggedIndex < targetIndex) {
        item.after(draggedElement);
      } else {
        item.before(draggedElement);
      }

      // Update order in database
      const updatedItems = Array.from(questionsList.querySelectorAll('.question-item'));
      const reorderData = updatedItems.map((el, index) => ({
        id: el.dataset.id,
        order: index
      }));

      try {
        const response = await fetch('/admin/questions/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questions: reorderData })
        });

        if (!response.ok) {
          showToast('Error reordering questions', 'danger');
          location.reload();
        }
      } catch (error) {
        showToast('Error: ' + error.message, 'danger');
        location.reload();
      }
    }
  });
});
