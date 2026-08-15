// Yashvriddhi Thermal Shipping Label Generator - Logic Application

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const custNameInput = document.getElementById('custName');
  const custAddressInput = document.getElementById('custAddress');
  const custDistrictInput = document.getElementById('custDistrict');
  const custPincodeInput = document.getElementById('custPincode');
  const custStateInput = document.getElementById('custState');
  const custMobileInput = document.getElementById('custMobile');

  const disclaimerTextInput = document.getElementById('disclaimerText');
  const senderBrandInput = document.getElementById('senderBrand');
  const senderAddressInput = document.getElementById('senderAddress');
  const senderMobileInput = document.getElementById('senderMobile');

  const tabSingle = document.getElementById('tabSingle');
  const tabBulk = document.getElementById('tabBulk');
  const tabSheet = document.getElementById('tabSheet');
  const labelForm = document.getElementById('labelForm');
  const bulkContainer = document.getElementById('bulkContainer');
  const bulkInput = document.getElementById('bulkInput');
  const processBulkBtn = document.getElementById('processBulkBtn');

  const sheetApiContainer = document.getElementById('sheetApiContainer');
  const sheetWebhookUrlInput = document.getElementById('sheetWebhookUrl');
  const fetchSheetOrdersBtn = document.getElementById('fetchSheetOrdersBtn');
  const sheetSyncStatus = document.getElementById('sheetSyncStatus');

  const previewWrapper = document.getElementById('previewWrapper');
  const printContainer = document.getElementById('printContainer');
  const printBtn = document.getElementById('printBtn');

  let isBulkMode = false;
  let bulkParsedItems = [];

  // Load saved webhook URL
  if (sheetWebhookUrlInput) {
    sheetWebhookUrlInput.value = localStorage.getItem('yashvriddhi_shipping_webhook') || '';
  }

  init();

  function init() {
    setupEventListeners();
    renderLivePreview();
  }

  function setupEventListeners() {
    // Input listeners for real-time preview
    const inputs = [
      custNameInput, custAddressInput, custDistrictInput,
      custPincodeInput, custStateInput, custMobileInput,
      disclaimerTextInput, senderBrandInput, senderAddressInput, senderMobileInput
    ];

    inputs.forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          if (!isBulkMode) {
            renderLivePreview();
          } else if (bulkParsedItems.length > 0) {
            // Update sender/disclaimer on all bulk parsed items
            bulkParsedItems.forEach(item => {
              item.disclaimerText = disclaimerTextInput.value.trim();
              item.senderBrand = senderBrandInput.value.trim();
              item.senderAddress = senderAddressInput.value.trim();
              item.senderMobile = senderMobileInput.value.trim();
            });
            renderBulkPreview();
          }
        });
      }
    });

    // Tab Switchers
    tabSingle.addEventListener('click', () => {
      isBulkMode = false;
      tabSingle.classList.add('active');
      tabBulk.classList.remove('active');
      tabSheet.classList.remove('active');
      labelForm.style.display = 'block';
      bulkContainer.style.display = 'none';
      sheetApiContainer.style.display = 'none';
      renderLivePreview();
    });

    tabBulk.addEventListener('click', () => {
      isBulkMode = true;
      tabBulk.classList.add('active');
      tabSingle.classList.remove('active');
      tabSheet.classList.remove('active');
      labelForm.style.display = 'none';
      bulkContainer.style.display = 'block';
      sheetApiContainer.style.display = 'none';
      if (bulkParsedItems.length > 0) {
        renderBulkPreview();
      }
    });

    tabSheet.addEventListener('click', () => {
      isBulkMode = true;
      tabSheet.classList.add('active');
      tabSingle.classList.remove('active');
      tabBulk.classList.remove('active');
      labelForm.style.display = 'none';
      bulkContainer.style.display = 'none';
      sheetApiContainer.style.display = 'block';
      if (bulkParsedItems.length > 0) {
        renderBulkPreview();
      }
    });

    // Bulk Process Button
    processBulkBtn.addEventListener('click', () => {
      const text = bulkInput.value.trim();
      if (!text) {
        alert('Please paste rows from your Google Sheet or CSV');
        return;
      }
      parseBulkInput(text);
    });

    // Fetch Live Orders from Google Sheet Webhook
    fetchSheetOrdersBtn.addEventListener('click', () => {
      const url = sheetWebhookUrlInput.value.trim();
      if (!url) {
        alert('Please enter your Shipping Google Sheet Apps Script URL');
        return;
      }
      localStorage.setItem('yashvriddhi_shipping_webhook', url);
      fetchLiveSheetOrders(url);
    });

    // Print Action
    printBtn.addEventListener('click', () => {
      prepareAndPrint();
    });
  }

  // Fetch Live Orders from Google Sheet Endpoint
  function fetchLiveSheetOrders(url) {
    sheetSyncStatus.textContent = '🔄 Fetching orders from Google Sheet...';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          bulkParsedItems = data.map(row => ({
            custName: row.name || row.custName || row[0] || '',
            custAddress: row.address || row.custAddress || row[1] || '',
            custDistrict: row.district || row.custDistrict || row[2] || '',
            custPincode: row.pincode || row.custPincode || row[3] || '',
            custState: row.state || row.custState || row[4] || '',
            custMobile: row.mobile || row.custMobile || row[5] || '',
            disclaimerText: disclaimerTextInput.value.trim(),
            senderBrand: senderBrandInput.value.trim(),
            senderAddress: senderAddressInput.value.trim(),
            senderMobile: senderMobileInput.value.trim()
          }));
          sheetSyncStatus.textContent = `✅ Successfully fetched ${bulkParsedItems.length} order(s)!`;
          renderBulkPreview();
        } else if (data.orders && Array.isArray(data.orders)) {
          bulkParsedItems = data.orders.map(row => ({
            custName: row.name || row.custName || '',
            custAddress: row.address || row.custAddress || '',
            custDistrict: row.district || row.custDistrict || '',
            custPincode: row.pincode || row.custPincode || '',
            custState: row.state || row.custState || '',
            custMobile: row.mobile || row.custMobile || '',
            disclaimerText: disclaimerTextInput.value.trim(),
            senderBrand: senderBrandInput.value.trim(),
            senderAddress: senderAddressInput.value.trim(),
            senderMobile: senderMobileInput.value.trim()
          }));
          sheetSyncStatus.textContent = `✅ Successfully fetched ${bulkParsedItems.length} order(s)!`;
          renderBulkPreview();
        } else {
          sheetSyncStatus.textContent = '⚠️ Sheet returned data in unexpected format.';
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        sheetSyncStatus.textContent = '⚠️ Error fetching from Google Sheet Webhook.';
      });
  }

  // Get current single label data object
  function getSingleData() {
    return {
      custName: custNameInput.value.trim() || 'BISWAJIT JI',
      custAddress: custAddressInput.value.trim() || '',
      custDistrict: custDistrictInput.value.trim() || '',
      custPincode: custPincodeInput.value.trim() || '',
      custState: custStateInput.value.trim() || '',
      custMobile: custMobileInput.value.trim() || '',
      disclaimerText: disclaimerTextInput.value.trim() || '',
      senderBrand: senderBrandInput.value.trim() || 'YASHVRIDDHI',
      senderAddress: senderAddressInput.value.trim() || '',
      senderMobile: senderMobileInput.value.trim() || ''
    };
  }

  // Render Single Live Preview on Screen
  function renderLivePreview() {
    const d = getSingleData();
    previewWrapper.innerHTML = createScreenLabelHtml(d);
  }

  // Parse Bulk Input (Tab-separated Google Sheet copy-paste or Comma-separated)
  function parseBulkInput(text) {
    const lines = text.split('\n');
    bulkParsedItems = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      let cols = trimmed.split('\t');
      if (cols.length < 3) {
        cols = trimmed.split(',');
      }

      if (cols.length >= 1) {
        // Skip header if user copied header row
        if (cols[0].toLowerCase().includes('name') || cols[0].toLowerCase().includes('customer')) {
          return;
        }

        bulkParsedItems.push({
          custName: (cols[0] || '').trim(),
          custAddress: (cols[1] || '').trim(),
          custDistrict: (cols[2] || '').trim(),
          custPincode: (cols[3] || '').trim(),
          custState: (cols[4] || '').trim(),
          custMobile: (cols[5] || '').trim(),
          disclaimerText: disclaimerTextInput.value.trim(),
          senderBrand: senderBrandInput.value.trim(),
          senderAddress: senderAddressInput.value.trim(),
          senderMobile: senderMobileInput.value.trim()
        });
      }
    });

    if (bulkParsedItems.length === 0) {
      alert('Could not parse any valid rows. Make sure to paste columns: Name, Address, District, Pincode, State, Mobile.');
      return;
    }

    renderBulkPreview();
  }

  // Render Bulk Labels Preview on Screen
  function renderBulkPreview() {
    let html = '';
    bulkParsedItems.forEach((d, idx) => {
      html += `
        <div style="width: 100%; text-align: center; margin-bottom: -16px;">
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-amber); font-weight: 700;">
            LABEL #${idx + 1} OF ${bulkParsedItems.length}
          </span>
        </div>
        ${createScreenLabelHtml(d)}
      `;
    });
    previewWrapper.innerHTML = html;
  }

  // Create Screen Card HTML (Formatted to match thermal sample)
  function createScreenLabelHtml(d) {
    return `
      <div class="thermal-label">
        <div>
          <div class="label-top-border"></div>
          
          <div class="label-salutation">TO,</div>
          <div class="label-cust-name">${escapeHtml(d.custName)}</div>
          
          <div class="label-address-box">
            <strong>Add -</strong> ${escapeHtml(d.custAddress)}
          </div>
          
          <div class="label-dist-pin-row">
            <span><strong>District-</strong> ${escapeHtml(d.custDistrict)}</span>
            <span><strong>Pincode-</strong> ${escapeHtml(d.custPincode)}</span>
          </div>
          
          <div class="label-state-row">
            <span><strong>State -</strong> ${escapeHtml(d.custState)}</span>
          </div>
          
          <div class="label-mobile-row">
            <strong>Mob-</strong> ${escapeHtml(d.custMobile)}
          </div>
        </div>

        <div>
          <div class="label-disclaimer-box">
            ${escapeHtml(d.disclaimerText)}
          </div>
          
          <div class="label-sender-box">
            <div class="label-sender-title">${escapeHtml(d.senderBrand)}</div>
            <div class="label-sender-address"><strong>Add-</strong> ${escapeHtml(d.senderAddress)}</div>
            <div class="label-sender-mobile"><strong>Mo -</strong> ${escapeHtml(d.senderMobile)}</div>
          </div>
        </div>
      </div>
    `;
  }

  // Create Printable HTML Element (Clean 100mm x 150mm format for @media print)
  function createPrintLabelHtml(d) {
    return `
      <div class="thermal-label-print">
        <div>
          <div class="label-top-border-print"></div>
          
          <div class="label-salutation-print">TO,</div>
          <div class="label-cust-name-print">${escapeHtml(d.custName)}</div>
          
          <div class="label-address-box-print">
            <strong>Add -</strong> ${escapeHtml(d.custAddress)}
          </div>
          
          <div class="label-dist-pin-row-print">
            <span><strong>District-</strong> ${escapeHtml(d.custDistrict)}</span>
            <span><strong>Pincode-</strong> ${escapeHtml(d.custPincode)}</span>
          </div>
          
          <div class="label-state-row-print">
            <span><strong>State -</strong> ${escapeHtml(d.custState)}</span>
          </div>
          
          <div class="label-mobile-row-print">
            <strong>Mob-</strong> ${escapeHtml(d.custMobile)}
          </div>
        </div>

        <div>
          <div class="label-disclaimer-box-print">
            ${escapeHtml(d.disclaimerText)}
          </div>
          
          <div class="label-sender-box-print">
            <div class="label-sender-title-print">${escapeHtml(d.senderBrand)}</div>
            <div class="label-sender-address-print"><strong>Add-</strong> ${escapeHtml(d.senderAddress)}</div>
            <div class="label-sender-mobile-print"><strong>Mo -</strong> ${escapeHtml(d.senderMobile)}</div>
          </div>
        </div>
      </div>
    `;
  }

  // Populate Print Container and Trigger Printer Dialog
  function prepareAndPrint() {
    printContainer.innerHTML = '';
    
    let itemsToPrint = [];
    if (isBulkMode && bulkParsedItems.length > 0) {
      itemsToPrint = bulkParsedItems;
    } else {
      itemsToPrint = [getSingleData()];
    }

    let printHtml = '';
    itemsToPrint.forEach(item => {
      printHtml += createPrintLabelHtml(item);
    });

    printContainer.innerHTML = printHtml;

    // Trigger Print Dialog
    setTimeout(() => {
      window.print();
    }, 150);
  }

  function escapeHtml(str) {
    return (str || '').replace(/&/g, "&amp;")
                      .replace(/</g, "&lt;")
                      .replace(/>/g, "&gt;")
                      .replace(/"/g, "&quot;")
                      .replace(/'/g, "&#039;");
  }
});
