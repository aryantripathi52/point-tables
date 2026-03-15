// ============================================================
//  BGHQ — app.js  (Shared Core Logic — All Pages)
//  Data never leaves the browser. No server contact.
// ============================================================

// ─────────────────────────────────────────────────────────────
//  1. LOADING SPINNER — hide after page painted
// ─────────────────────────────────────────────────────────────
(function () {
    window.addEventListener('load', function () {
        const loader = document.getElementById('bghq-loader');
        if (!loader) return;
        setTimeout(() => {
            loader.classList.add('hidden');
            // Remove from DOM after fade completes
            setTimeout(() => loader.remove(), 450);
        }, 600); // brief display to show the BGHQ branding
    });
})();


// ─────────────────────────────────────────────────────────────
//  2. THEME TOGGLE — dark / light, persisted in localStorage
// ─────────────────────────────────────────────────────────────
(function () {
    const STORAGE_KEY = 'bghq_theme';
    const LIGHT_CLASS = 'light-mode';

    // Apply saved theme *before* first paint (runs synchronously)
    if (localStorage.getItem(STORAGE_KEY) === 'light') {
        document.documentElement.classList.add(LIGHT_CLASS);
        document.body.classList.add(LIGHT_CLASS);
    }

    function updateIcon(btn, isLight) {
        btn.textContent = isLight ? '☀️' : '🌙';
        btn.title       = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    }

    document.addEventListener('DOMContentLoaded', function () {
        const btn = document.getElementById('themeToggleBtn');
        if (!btn) return;

        const isLight = document.body.classList.contains(LIGHT_CLASS);
        updateIcon(btn, isLight);

        btn.addEventListener('click', function () {
            const nowLight = document.body.classList.toggle(LIGHT_CLASS);
            document.documentElement.classList.toggle(LIGHT_CLASS, nowLight);
            localStorage.setItem(STORAGE_KEY, nowLight ? 'light' : 'dark');
            updateIcon(btn, nowLight);
        });
    });
})();


// ─────────────────────────────────────────────────────────────
//  3. TOAST NOTIFICATION
//     Usage: showToast('message', 'success' | 'error' | 'info')
// ─────────────────────────────────────────────────────────────
let _toastTimer = null;

function showToast(msg, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    // Reset
    clearTimeout(_toastTimer);
    toast.className = '';
    toast.textContent = msg;

    // Force reflow so transition fires again
    void toast.offsetWidth;

    toast.classList.add('show', `toast-${type}`);

    _toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}


// ─────────────────────────────────────────────────────────────
//  4. MACRO SYSTEM  (dashboard.html only)
//     Saves / restores entire table JSON state in localStorage
//     No user data ever sent to server.
// ─────────────────────────────────────────────────────────────
function saveMacro() {
    const rows = document.querySelectorAll('#tableBody tr');
    if (!rows.length) return;

    const tableData = Array.from(rows).map(row =>
        Array.from(row.querySelectorAll('td')).map(td => td.innerText.trim())
    );

    const tournamentName = document.querySelector('.tournament-name')?.innerText.trim() || '';
    const dateField      = document.querySelector('.date-field')?.innerText.trim()      || '';

    const macro = { tableData, tournamentName, dateField, savedAt: Date.now() };
    localStorage.setItem('bghq_macro', JSON.stringify(macro));
    showToast('Macro Saved!', 'success');
}

function applyMacro() {
    const raw = localStorage.getItem('bghq_macro');
    if (!raw) {
        showToast('No Macro Found', 'error');
        return;
    }

    try {
        const macro = JSON.parse(raw);
        const rows  = document.querySelectorAll('#tableBody tr');

        if (macro.tableData) {
            macro.tableData.forEach((rowData, i) => {
                if (!rows[i]) return;
                const cells = rows[i].querySelectorAll('td');
                rowData.forEach((val, j) => {
                    if (j > 0) cells[j].innerText = val; // skip Rank cell
                });
            });
        }

        if (macro.tournamentName) {
            const tn = document.querySelector('.tournament-name');
            if (tn) tn.innerText = macro.tournamentName;
        }
        if (macro.dateField) {
            const df = document.querySelector('.date-field');
            if (df) df.innerText = macro.dateField;
        }

        showToast('Macro Applied!', 'success');
    } catch (e) {
        showToast('Macro data corrupted', 'error');
        console.error(e);
    }
}


// ─────────────────────────────────────────────────────────────
//  5. TOOLBAR ICON ACTIVE STATE
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.tool-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            document.querySelectorAll('.tool-icon').forEach(i => i.classList.remove('active'));
            icon.classList.add('active');
        });
    });
});


// ─────────────────────────────────────────────────────────────
//  6. STICKY NAV BLUR on scroll (index.html)
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            nav.style.boxShadow = '0 4px 24px rgba(0,240,255,0.1)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });
});


// ─────────────────────────────────────────────────────────────
//  FUTURE FEATURE STUBS (Version 2 & 3)
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// // VERSION 2: AI Screenshot Parser
// // Tesseract.js OCR reads a Free Fire match result screenshot
// // and auto-fills table cells with team name, kills, placement.
//
// async function parseScreenshot(file) {
//     const { createWorker } = Tesseract;
//     const worker = await createWorker('eng');
//     const { data: { text } } = await worker.recognize(file);
//     await worker.terminate();
//     // Parse text → extract team names, kills, placement
//     const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
//     // Regex-match pattern for FF scoreboard rows…
//     // lines.forEach((line, i) => fillRow(i, parseLine(line)));
// }
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// // VERSION 2: Multiple Table Templates
// // User picks from 3 BGHQ style templates before editing.
//
// const TEMPLATES = ['classic', 'neon-grid', 'dark-glass'];
//
// function showTemplatePicker() {
//     // Open a modal with 3 preview cards
//     // On pick: swapTemplate(templateId)
// }
//
// function swapTemplate(templateId) {
//     // Remove current template classes
//     // Apply new template class to #mainTableTemplate
//     // Re-render rows for new column layout if needed
// }
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// // VERSION 3: Team Collaboration — Live Shared Session
// // Shareable session code, WebSocket sync, session deletes on download.
//
// let sessionSocket = null;
// let sessionCode   = null;
//
// function createSession() {
//     sessionCode = Math.random().toString(36).substr(2, 6).toUpperCase();
//     sessionSocket = new WebSocket(`wss://bghq.io/session/${sessionCode}`);
//     sessionSocket.onmessage = (e) => applyRemoteState(JSON.parse(e.data));
//     showToast(`Session: ${sessionCode}`, 'info');
// }
//
// function joinSession(code) {
//     sessionCode = code.toUpperCase();
//     sessionSocket = new WebSocket(`wss://bghq.io/session/${sessionCode}`);
//     sessionSocket.onmessage = (e) => applyRemoteState(JSON.parse(e.data));
// }
//
// function broadcastState() {
//     if (sessionSocket?.readyState === WebSocket.OPEN) {
//         sessionSocket.send(JSON.stringify(captureCanvasState()));
//     }
// }
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// // VERSION 3: BGMI Mode
// // Separate column set for BGMI tournaments (different scoring).
//
// const BGMI_COLUMNS = ['RANK','TEAM NAME','MP','WWC','K','FP','TOTAL'];
// const FF_COLUMNS   = ['RANK','TEAM NAME','MP','PP','KP','TOTAL'];
// let currentMode = 'ff'; // 'ff' | 'bgmi'
//
// function switchMode(mode) {
//     currentMode = mode;
//     const cols = mode === 'bgmi' ? BGMI_COLUMNS : FF_COLUMNS;
//     // Re-render thead with new columns
//     // Re-render tbody rows with correct number of editable cells
// }
// ─────────────────────────────────────────────────────────────
