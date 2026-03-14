// BGHQ - Core Logic

// ── Theme Toggle (shared across all pages) ──────────────────────────────────
(function () {
    const STORAGE_KEY = 'bghq_theme';
    const LIGHT_CLASS = 'light-mode';

    // Apply saved theme immediately (before first paint)
    if (localStorage.getItem(STORAGE_KEY) === 'light') {
        document.body.classList.add(LIGHT_CLASS);
    }

    function updateIcon(btn, isLight) {
        btn.textContent = isLight ? '☀️' : '🌙';
        btn.title = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    }

    document.addEventListener('DOMContentLoaded', function () {
        const btn = document.getElementById('themeToggleBtn');
        if (!btn) return;

        const isLight = document.body.classList.contains(LIGHT_CLASS);
        updateIcon(btn, isLight);

        btn.addEventListener('click', function () {
            const nowLight = document.body.classList.toggle(LIGHT_CLASS);
            localStorage.setItem(STORAGE_KEY, nowLight ? 'light' : 'dark');
            updateIcon(btn, nowLight);
        });
    });
})();
// ────────────────────────────────────────────────────────────────────────────

// Asset Import Handling
const fileInput = document.getElementById('fileInput');
const assetPreview = document.getElementById('assetPreview');

if (fileInput) {
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = document.createElement('img');
                img.src = event.target.result;
                img.className = 'asset-thumb';
                img.onclick = () => placeAssetOnCanvas(event.target.result);
                assetPreview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });
}

function placeAssetOnCanvas(src) {
    const canvasArea = document.getElementById('canvasArea');
    const img = document.createElement('img');
    img.src = src;
    img.style.position = 'absolute';
    img.style.width = '100px';
    img.style.cursor = 'move';
    img.style.zIndex = '10';
    img.className = 'draggable-asset';
    
    // Simple drag logic
    let isDragging = false;
    img.onmousedown = (e) => {
        isDragging = true;
        let shiftX = e.clientX - img.getBoundingClientRect().left;
        let shiftY = e.clientY - img.getBoundingClientRect().top;

        document.onmousemove = (e) => {
            if (!isDragging) return;
            img.style.left = e.pageX - shiftX + 'px';
            img.style.top = e.pageY - shiftY + 'px';
        };

        img.onmouseup = () => {
            isDragging = false;
            document.onmousemove = null;
        };
    };
    img.ondragstart = () => false;

    canvasArea.appendChild(img);
}

// Macro System
function saveMacro() {
    const tableData = [];
    const rows = document.querySelectorAll('#tableBody tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        tableData.push(Array.from(cells).map(c => c.innerText));
    });
    localStorage.setItem('bghq_macro', JSON.stringify(tableData));
    showToast('Macro Saved Successfully!');
}

function applyMacro() {
    const data = localStorage.getItem('bghq_macro');
    if (!data) {
        const toast = document.getElementById('toast');
        toast.style.display = 'block';
        setTimeout(() => toast.style.display = 'none', 3000);
        return;
    }
    const tableData = JSON.parse(data);
    const rows = document.querySelectorAll('#tableBody tr');
    tableData.forEach((rowData, i) => {
        if (rows[i]) {
            const cells = rows[i].querySelectorAll('td');
            rowData.forEach((val, j) => {
                if (j > 0) cells[j].innerText = val; // Don't overwrite Rank
            });
        }
    });
    showToast('Macro Applied!');
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerText = msg;
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
}

// Download Canvas
const downloadBtn = document.getElementById('downloadBtn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        // In a real app, we'd use html2canvas
        // For this demo, we'll simulate the "wipe" behavior requested
        alert('Downloading Template Image...');
        
        // Wipe all cell data instantly
        const cells = document.querySelectorAll('.point-table td[contenteditable="true"]');
        cells.forEach(cell => {
            cell.innerText = '0';
            if (cell.cellIndex === 1) cell.innerText = 'TEAM NAME';
        });
        
        const tournamentName = document.querySelector('.tournament-name');
        if (tournamentName) tournamentName.innerText = 'TOURNAMENT NAME';
    });
}

// Sidebar Dropdown handling (Mobile)
document.querySelectorAll('.tool-icon').forEach(icon => {
    icon.onclick = () => {
        document.querySelectorAll('.tool-icon').forEach(i => i.classList.remove('active'));
        icon.classList.add('active');
    };
});
