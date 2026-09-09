'use strict';

const STORAGE_KEY = 'esperancaViva.voluntarios.v2';

function getStoredVolunteers() {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    if (!rawValue) return [];

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.warn('Não foi possível ler os cadastros locais.', error);
    return [];
  }
}

function saveVolunteers(volunteers) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(volunteers));
    return true;
  } catch (error) {
    console.error('Não foi possível salvar o cadastro localmente.', error);
    return false;
  }
}

function createVolunteerId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) return digits ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatRegistrationDate(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'Data indisponível';

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date);
}

function showFormMessage(message, type) {
  const messageElement = document.getElementById('formMessage');
  if (!messageElement) return;

  messageElement.textContent = message;
  messageElement.className = `form-message is-${type}`;
  messageElement.hidden = false;
  messageElement.focus?.();
}

function hideFormMessage() {
  const messageElement = document.getElementById('formMessage');
  if (!messageElement) return;

  messageElement.hidden = true;
  messageElement.textContent = '';
  messageElement.className = 'form-message';
}

function renderVolunteers() {
  const tableBody = document.getElementById('volunteersTableBody');
  const emptyState = document.getElementById('emptyState');
  const clearButton = document.getElementById('clearVolunteers');

  if (!tableBody || !emptyState || !clearButton) return;

  const volunteers = getStoredVolunteers();
  tableBody.replaceChildren();

  emptyState.hidden = volunteers.length > 0;
  clearButton.hidden = volunteers.length === 0;

  volunteers.forEach((volunteer) => {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = volunteer.nome;

    const projectCell = document.createElement('td');
    projectCell.textContent = volunteer.projeto;

    const dateCell = document.createElement('td');
    dateCell.textContent = formatRegistrationDate(volunteer.dataCadastro);

    const actionCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'table-action';
    removeButton.dataset.volunteerId = volunteer.id;
    removeButton.textContent = 'Remover';
    removeButton.setAttribute('aria-label', `Remover cadastro de ${volunteer.nome}`);
    actionCell.append(removeButton);

    row.append(nameCell, projectCell, dateCell, actionCell);
    tableBody.append(row);
  });
}

function handleVolunteerSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  form.classList.add('was-validated');
  hideFormMessage();

  if (!form.checkValidity()) {
    form.reportValidity();
    showFormMessage('Revise os campos obrigatórios antes de enviar.', 'error');
    return;
  }

  const formData = new FormData(form);
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const volunteers = getStoredVolunteers();

  if (volunteers.some((volunteer) => volunteer.email === email)) {
    showFormMessage('Já existe um cadastro com este e-mail neste navegador.', 'error');
    document.getElementById('email')?.focus();
    return;
  }

  const volunteer = {
    id: createVolunteerId(),
    nome: String(formData.get('nome') || '').trim(),
    email,
    telefone: String(formData.get('telefone') || '').trim(),
    cidade: String(formData.get('cidade') || '').trim(),
    uf: String(formData.get('uf') || ''),
    projeto: String(formData.get('projeto') || ''),
    dataCadastro: new Date().toISOString()
  };

  volunteers.push(volunteer);

  if (!saveVolunteers(volunteers)) {
    showFormMessage('Não foi possível salvar o cadastro neste navegador. Verifique as permissões de armazenamento.', 'error');
    return;
  }

  form.reset();
  form.classList.remove('was-validated');
  renderVolunteers();
  showFormMessage('Cadastro realizado com sucesso neste navegador.', 'success');
}

function handleTableClick(event) {
  const removeButton = event.target.closest('[data-volunteer-id]');
  if (!removeButton) return;

  const volunteerId = removeButton.dataset.volunteerId;
  const volunteers = getStoredVolunteers();
  const updatedVolunteers = volunteers.filter((volunteer) => volunteer.id !== volunteerId);

  if (saveVolunteers(updatedVolunteers)) {
    renderVolunteers();
  }
}

function clearVolunteers() {
  const volunteers = getStoredVolunteers();
  if (volunteers.length === 0) return;

  const confirmed = window.confirm('Deseja remover todos os cadastros salvos neste navegador?');
  if (!confirmed) return;

  if (saveVolunteers([])) {
    renderVolunteers();
    showFormMessage('Cadastros locais removidos.', 'success');
  }
}

function setupVolunteerForm() {
  const form = document.getElementById('volunteerForm');
  const phoneInput = document.getElementById('telefone');
  const tableBody = document.getElementById('volunteersTableBody');
  const clearButton = document.getElementById('clearVolunteers');

  if (!form) return;

  form.addEventListener('submit', handleVolunteerSubmit);
  form.addEventListener('reset', () => {
    window.setTimeout(() => {
      form.classList.remove('was-validated');
      hideFormMessage();
    }, 0);
  });

  phoneInput?.addEventListener('input', (event) => {
    event.target.value = formatPhone(event.target.value);
  });

  tableBody?.addEventListener('click', handleTableClick);
  clearButton?.addEventListener('click', clearVolunteers);

  renderVolunteers();
}

function setCurrentYear() {
  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setCurrentYear();
  setupVolunteerForm();
});
