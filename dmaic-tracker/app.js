// Ziddi DMAIC Mastermind Input Tool - Main Logic Application

document.addEventListener('DOMContentLoaded', () => {
  // App State
  let currentQuarterKey = 'Q1';
  let currentMeetingId = 'M1';
  let currentClientName = '';
  let currentCompanyName = '';
  let webhookUrl = localStorage.getItem('ziddi_webhook_url') || '';
  
  // Storage Keys
  const STORAGE_KEY = 'ziddi_dmaic_submissions_v1';
  const SETTINGS_KEY = 'ziddi_dmaic_settings';

  // UI Elements
  const quarterTabsContainer = document.getElementById('quarterTabs');
  const meetingPillsContainer = document.getElementById('meetingPills');
  const dynamicFormContainer = document.getElementById('dynamicFormFields');
  const meetingBadge = document.getElementById('meetingBadge');
  const meetingTitle = document.getElementById('meetingTitle');
  const meetingObjective = document.getElementById('meetingObjective');
  const trainerCallout = document.getElementById('trainerCallout');
  const microtaskCallout = document.getElementById('microtaskCallout');
  
  const clientNameInput = document.getElementById('clientName');
  const companyNameInput = document.getElementById('companyName');
  
  const progressStatNum = document.getElementById('progressStatNum');
  const progressBarInner = document.getElementById('progressBarInner');
  const webhookInput = document.getElementById('webhookUrlInput');
  const webhookStatus = document.getElementById('webhookStatus');

  // Modals & Controls
  const visualCardModal = document.getElementById('visualCardModal');
  const closeCardModalBtn = document.getElementById('closeCardModalBtn');
  const downloadImgBtn = document.getElementById('downloadImgBtn');
  const previewContainer = document.getElementById('previewCardTarget');
  
  const shareLinkBtn = document.getElementById('shareLinkBtn');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const saveWebhookBtn = document.getElementById('saveWebhookBtn');

  // Initialize Application
  init();

  function init() {
    // Parse URL Parameters
    const urlParams = new URLSearchParams(window.location.search);
    const paramMeeting = urlParams.get('m') || urlParams.get('meeting');
    const paramClient = urlParams.get('client') || urlParams.get('c');
    const paramCompany = urlParams.get('company');

    if (paramClient) {
      currentClientName = decodeURIComponent(paramClient);
      clientNameInput.value = currentClientName;
    }
    if (paramCompany) {
      currentCompanyName = decodeURIComponent(paramCompany);
      companyNameInput.value = currentCompanyName;
    }

    // Set Meeting from URL if present
    if (paramMeeting) {
      const cleanM = paramMeeting.toUpperCase();
      const foundM = findMeetingById(cleanM);
      if (foundM) {
        currentMeetingId = foundM.meeting.id;
        currentQuarterKey = foundM.quarterKey;
      }
    }

    if (webhookUrl) {
      webhookInput.value = webhookUrl;
      updateWebhookStatus(true);
    }

    renderQuarterTabs();
    renderMeetingPills();
    loadMeetingForm(currentMeetingId);
    updateOverallProgress();
    renderSavedSubmissionsList();
    setupEventListeners();
  }

  function findMeetingById(meetingId) {
    for (const [qKey, qData] of Object.entries(MASTERMIND_DATA)) {
      const m = qData.meetings.find(item => item.id === meetingId || `M${item.number}` === meetingId);
      if (m) return { quarterKey: qKey, meeting: m };
    }
    return null;
  }

  // Render Quarter Tabs
  function renderQuarterTabs() {
    quarterTabsContainer.innerHTML = '';
    Object.entries(MASTERMIND_DATA).forEach(([qKey, qData]) => {
      const btn = document.createElement('button');
      btn.className = `q-tab-btn ${qKey === currentQuarterKey ? 'active' : ''}`;
      btn.style.setProperty('--q-color', qData.color);
      btn.onclick = () => selectQuarter(qKey);

      btn.innerHTML = `
        <span class="q-tab-badge">${qData.badge}</span>
        <div class="q-tab-title">${qKey}: ${qData.title.split(':')[1] || qData.title}</div>
        <div class="q-tab-sub">${qData.subtitle}</div>
      `;
      quarterTabsContainer.appendChild(btn);
    });
  }

  function selectQuarter(qKey) {
    currentQuarterKey = qKey;
    // Set default meeting to first meeting in quarter
    currentMeetingId = MASTERMIND_DATA[qKey].meetings[0].id;
    renderQuarterTabs();
    renderMeetingPills();
    loadMeetingForm(currentMeetingId);
  }

  // Render Meeting Pills for current quarter
  function renderMeetingPills() {
    meetingPillsContainer.innerHTML = '';
    const meetings = MASTERMIND_DATA[currentQuarterKey].meetings;

    meetings.forEach(m => {
      const btn = document.createElement('button');
      const isFilled = isMeetingSubmitted(m.id);
      btn.className = `m-pill-btn ${m.id === currentMeetingId ? 'active' : ''} ${isFilled ? 'filled' : ''}`;
      btn.onclick = () => selectMeeting(m.id);

      btn.innerHTML = `
        <span class="status-dot"></span>
        <span>M${m.number}: ${m.title}</span>
      `;
      meetingPillsContainer.appendChild(btn);
    });
  }

  function selectMeeting(mId) {
    currentMeetingId = mId;
    renderMeetingPills();
    loadMeetingForm(currentMeetingId);
  }

  // Load Form Data & Fields
  function loadMeetingForm(mId) {
    const meetingInfo = findMeetingById(mId);
    if (!meetingInfo) return;

    const m = meetingInfo.meeting;
    const qData = MASTERMIND_DATA[meetingInfo.quarterKey];

    // Set Header Data
    meetingBadge.textContent = `${qData.badge} // MEETING ${m.number}`;
    meetingTitle.textContent = `Meeting ${m.number}: ${m.title}`;
    meetingObjective.textContent = `🎯 Objective: ${m.objective}`;
    trainerCallout.innerHTML = `<strong>Coach Strategy:</strong> ${m.trainerAction}`;
    microtaskCallout.innerHTML = `<strong>Weekly Micro-Task:</strong> ${m.microTask}`;

    // Render Fields
    dynamicFormContainer.innerHTML = '';
    const savedData = getSavedMeetingData(currentMeetingId);

    m.fields.forEach(field => {
      const group = document.createElement('div');
      group.className = 'form-group';

      const label = document.createElement('label');
      label.setAttribute('for', field.id);
      label.innerHTML = `${field.label} <span class="required-star">*</span>`;

      let inputElem;
      if (field.type === 'textarea') {
        inputElem = document.createElement('textarea');
        inputElem.rows = 3;
      } else if (field.type === 'select') {
        inputElem = document.createElement('select');
        inputElem.innerHTML = `<option value="" disabled selected>Select an option...</option>` + 
          field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('');
      } else {
        inputElem = document.createElement('input');
        inputElem.type = field.type || 'text';
      }

      inputElem.className = 'form-control';
      inputElem.id = field.id;
      inputElem.name = field.id;
      inputElem.placeholder = field.placeholder || '';
      inputElem.required = true;

      if (savedData && savedData[field.id]) {
        inputElem.value = savedData[field.id];
      }

      const hint = document.createElement('div');
      hint.className = 'form-hint';
      hint.textContent = field.hint;

      group.appendChild(label);
      group.appendChild(inputElem);
      group.appendChild(hint);
      dynamicFormContainer.appendChild(group);
    });
  }

  // Handle Form Submission
  const mastermindForm = document.getElementById('mastermindForm');
  mastermindForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const clientName = clientNameInput.value.trim();
    const companyName = companyNameInput.value.trim();

    if (!clientName) {
      showToast('⚠️ Please enter Client Name');
      clientNameInput.focus();
      return;
    }

    currentClientName = clientName;
    currentCompanyName = companyName;

    const meetingInfo = findMeetingById(currentMeetingId);
    const fieldsData = {};
    meetingInfo.meeting.fields.forEach(f => {
      const elem = document.getElementById(f.id);
      fieldsData[f.id] = elem ? elem.value : '';
    });

    const submissionPayload = {
      timestamp: new Date().toISOString(),
      dateFormatted: new Date().toLocaleString('en-IN'),
      clientName: clientName,
      companyName: companyName,
      quarterKey: currentQuarterKey,
      meetingId: currentMeetingId,
      meetingNumber: meetingInfo.meeting.number,
      meetingTitle: meetingInfo.meeting.title,
      fields: fieldsData
    };

    saveSubmission(submissionPayload);
    showToast(`✅ Meeting ${meetingInfo.meeting.number} Saved Successfully!`);

    // Send to Google Webhook if configured
    if (webhookUrl) {
      sendToWebhook(submissionPayload);
    }

    renderMeetingPills();
    updateOverallProgress();
    renderSavedSubmissionsList();
    generateVisualPreviewCard(submissionPayload);
  });

  // LocalStorage Persistence
  function getSubmissionsObject() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveSubmission(payload) {
    const submissions = getSubmissionsObject();
    const clientKey = (payload.clientName || 'DefaultClient').toLowerCase().replace(/\s+/g, '_');
    if (!submissions[clientKey]) {
      submissions[clientKey] = {
        clientName: payload.clientName,
        companyName: payload.companyName,
        meetings: {}
      };
    }
    submissions[clientKey].companyName = payload.companyName;
    submissions[clientKey].meetings[payload.meetingId] = payload;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  }

  function getSavedMeetingData(mId) {
    const submissions = getSubmissionsObject();
    const clientKey = (currentClientName || clientNameInput.value || '').toLowerCase().replace(/\s+/g, '_');
    if (submissions[clientKey] && submissions[clientKey].meetings && submissions[clientKey].meetings[mId]) {
      return submissions[clientKey].meetings[mId].fields;
    }
    return null;
  }

  function isMeetingSubmitted(mId) {
    const submissions = getSubmissionsObject();
    const clientKey = (currentClientName || clientNameInput.value || '').toLowerCase().replace(/\s+/g, '_');
    return !!(submissions[clientKey] && submissions[clientKey].meetings && submissions[clientKey].meetings[mId]);
  }

  function updateOverallProgress() {
    const submissions = getSubmissionsObject();
    const clientKey = (currentClientName || clientNameInput.value || '').toLowerCase().replace(/\s+/g, '_');
    let filledCount = 0;

    if (submissions[clientKey] && submissions[clientKey].meetings) {
      filledCount = Object.keys(submissions[clientKey].meetings).length;
    }

    const pct = Math.round((filledCount / 18) * 100);
    progressStatNum.textContent = `${filledCount}/18`;
    progressBarInner.style.width = `${pct}%`;
  }

  // Google Sheets Webhook Integration
  function sendToWebhook(payload) {
    showToast('🚀 Sending to Google Sheet...');
    fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(() => {
      showToast('📊 Data sent to Google Sheet!');
    })
    .catch(err => {
      console.error('Webhook error:', err);
      showToast('⚠️ Webhook send error, check console');
    });
  }

  function updateWebhookStatus(isConnected) {
    if (isConnected) {
      webhookStatus.textContent = `STATUS: CONNECTED 🟢 (${webhookUrl.substring(0, 30)}...)`;
      webhookStatus.className = 'webhook-status connected';
    } else {
      webhookStatus.textContent = 'STATUS: NOT CONNECTED (LOCAL STORAGE ONLY)';
      webhookStatus.className = 'webhook-status';
    }
  }

  saveWebhookBtn.addEventListener('click', () => {
    const val = webhookInput.value.trim();
    if (val) {
      webhookUrl = val;
      localStorage.setItem('ziddi_webhook_url', val);
      updateWebhookStatus(true);
      showToast('✅ Google Sheet Webhook Saved!');
    } else {
      webhookUrl = '';
      localStorage.removeItem('ziddi_webhook_url');
      updateWebhookStatus(false);
      showToast('Webhook disconnected.');
    }
  });

  // Saved Submissions Drawer
  function renderSavedSubmissionsList() {
    const listElem = document.getElementById('submissionsList');
    if (!listElem) return;

    listElem.innerHTML = '';
    const submissions = getSubmissionsObject();
    const clients = Object.values(submissions);

    if (clients.length === 0) {
      listElem.innerHTML = '<li class="sub-item"><span class="sub-item-meta">No submissions yet</span></li>';
      return;
    }

    clients.forEach(c => {
      const count = Object.keys(c.meetings || {}).length;
      const li = document.createElement('li');
      li.className = 'sub-item';
      li.innerHTML = `
        <div>
          <div class="sub-item-name">${c.clientName} ${c.companyName ? `(${c.companyName})` : ''}</div>
          <div class="sub-item-meta">${count}/18 Meetings completed</div>
        </div>
        <button class="btn btn-ghost btn-sm">Select</button>
      `;
      li.querySelector('button').onclick = () => {
        currentClientName = c.clientName;
        currentCompanyName = c.companyName || '';
        clientNameInput.value = currentClientName;
        companyNameInput.value = currentCompanyName;
        loadMeetingForm(currentMeetingId);
        updateOverallProgress();
        renderMeetingPills();
        showToast(`Loaded data for ${c.clientName}`);
      };
      listElem.appendChild(li);
    });
  }

  // Visual Image Card Generation
  function generateVisualPreviewCard(payload) {
    const meetingInfo = findMeetingById(payload.meetingId);
    const m = meetingInfo.meeting;

    let fieldsHtml = '';
    m.fields.forEach(f => {
      const val = payload.fields[f.id] || 'N/A';
      fieldsHtml += `
        <div class="preview-field-box">
          <div class="preview-field-lbl">${f.label}</div>
          <div class="preview-field-val">${escapeHtml(val)}</div>
        </div>
      `;
    });

    previewContainer.innerHTML = `
      <div class="visual-preview-target" id="canvasTarget">
        <div class="preview-card-header">
          <div>
            <div class="preview-brand">ZIDDI FOUNDER // DMAIC MASTERMIND</div>
            <div style="font-size: 0.85rem; color: #FFB23F; font-family: 'IBM Plex Mono'; font-weight: 600;">
              CLIENT: ${escapeHtml(payload.clientName)} ${payload.companyName ? `| ${escapeHtml(payload.companyName)}` : ''}
            </div>
          </div>
          <span class="preview-meeting-num">M${m.number}</span>
        </div>
        <h2 style="font-family: 'Barlow Condensed'; font-size: 1.5rem; margin-bottom: 12px; color: #fff;">
          ${m.title}
        </h2>
        <div style="font-size: 0.8rem; color: #94A3B8; margin-bottom: 18px; font-family: 'IBM Plex Mono';">
          TIMESTAMP: ${payload.dateFormatted}
        </div>
        ${fieldsHtml}
        <div style="border-top: 1px solid #213042; padding-top: 10px; margin-top: 16px; font-size: 0.75rem; color: #94A3B8; display: flex; justify-content: space-between;">
          <span>ZIDDI DMAIC 18-MEETING FRAMEWORK</span>
          <span>WWW.ZIDDIFOUNDER.COM</span>
        </div>
      </div>
    `;

    visualCardModal.classList.add('show');
  }

  // Generate Image Download
  downloadImgBtn.addEventListener('click', () => {
    const target = document.getElementById('canvasTarget');
    if (!target) return;

    if (typeof html2canvas === 'undefined') {
      showToast('⚠️ html2canvas library loading...');
      return;
    }

    showToast('📸 Generating Image Card...');
    html2canvas(target, {
      scale: 2,
      backgroundColor: '#0B1118'
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = `Ziddi_DMAIC_${currentClientName.replace(/\s+/g, '_')}_${currentMeetingId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('💾 Image downloaded successfully!');
    }).catch(err => {
      console.error(err);
      showToast('⚠️ Failed to generate image card');
    });
  });

  closeCardModalBtn.addEventListener('click', () => {
    visualCardModal.classList.remove('show');
  });

  // Share Link Action
  shareLinkBtn.addEventListener('click', () => {
    const client = encodeURIComponent(clientNameInput.value.trim() || '');
    const company = encodeURIComponent(companyNameInput.value.trim() || '');
    let shareUrl = `${window.location.origin}${window.location.pathname}?m=${currentMeetingId}`;
    if (client) shareUrl += `&c=${client}`;
    if (company) shareUrl += `&company=${company}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast('📋 Meeting link copied to clipboard!');
    }).catch(() => {
      prompt('Copy meeting link:', shareUrl);
    });
  });

  // CSV Export Action
  exportCsvBtn.addEventListener('click', () => {
    const submissions = getSubmissionsObject();
    const rows = [];
    rows.push(['Timestamp', 'Client Name', 'Company Name', 'Quarter', 'Meeting ID', 'Meeting Title', 'Field ID', 'Value']);

    Object.values(submissions).forEach(client => {
      Object.values(client.meetings || {}).forEach(m => {
        Object.entries(m.fields || {}).forEach(([fId, val]) => {
          rows.push([
            `"${m.timestamp || ''}"`,
            `"${m.clientName || ''}"`,
            `"${m.companyName || ''}"`,
            `"${m.quarterKey || ''}"`,
            `"${m.meetingId || ''}"`,
            `"${m.meetingTitle || ''}"`,
            `"${fId}"`,
            `"${(val || '').replace(/"/g, '""')}"`
          ]);
        });
      });
    });

    if (rows.length <= 1) {
      showToast('No saved data to export');
      return;
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(r => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ziddi_Mastermind_Data_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📊 CSV Export Complete!');
  });

  function setupEventListeners() {
    clientNameInput.addEventListener('input', () => {
      currentClientName = clientNameInput.value.trim();
      updateOverallProgress();
    });
    companyNameInput.addEventListener('input', () => {
      currentCompanyName = companyNameInput.value.trim();
    });
  }

  function showToast(msg) {
    const toast = document.getElementById('toastMsg');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  function escapeHtml(str) {
    return (str || '').replace(/&/g, "&amp;")
                      .replace(/</g, "&lt;")
                      .replace(/>/g, "&gt;")
                      .replace(/"/g, "&quot;")
                      .replace(/'/g, "&#039;");
  }
});
