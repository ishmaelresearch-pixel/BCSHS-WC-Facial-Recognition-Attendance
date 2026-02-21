import { initDashboard, updateDashboard } from './dashboard.js';
import { initStudents } from './students.js';
import { initScanner } from './scanner.js';

const STORAGE_KEY_STUDENTS = 'attend_net_students';
const STORAGE_KEY_ATTENDANCE = 'attend_net_attendance';

const state = {
    view: 'dashboard',
    students: [],
    attendance: []
};

async function loadData() {
    const localStudents = localStorage.getItem(STORAGE_KEY_STUDENTS);
    const localAttendance = localStorage.getItem(STORAGE_KEY_ATTENDANCE);

    if (localStudents) {
        state.students = JSON.parse(localStudents);
    } else {
        const response = await fetch('data.json');
        state.students = await response.json();
        saveToStorage();
    }

    if (localAttendance) {
        state.attendance = JSON.parse(localAttendance);
    }

    renderView();
}

function saveToStorage() {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(state.students));
    localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(state.attendance));
}

function renderView() {
    const viewport = document.getElementById('app-viewport');
    viewport.innerHTML = '';
    
    switch (state.view) {
        case 'dashboard':
            initDashboard(viewport, state);
            break;
        case 'students':
            initStudents(viewport, state);
            break;
        case 'scanner':
            initScanner(viewport, state);
            break;
    }
    
    lucide.createIcons();
    updateNavUI();
}

function updateNavUI() {
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.view === state.view) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

window.showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const color = type === 'success' ? 'emerald' : 'purple';
    
    toast.className = `glass-card px-6 py-4 border-l-4 border-${color}-500 flex items-center gap-4 animate-bounce-in shadow-2xl z-[200]`;
    toast.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-${color}-500/20 flex items-center justify-center text-${color}-500">
            <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}" class="w-5 h-5"></i>
        </div>
        <div>
            <p class="text-sm font-bold text-white">${message}</p>
            <p class="text-[10px] text-gray-400 uppercase tracking-tighter">${new Date().toLocaleTimeString()}</p>
        </div>
    `;
    
    container.appendChild(toast);
    lucide.createIcons();
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
};

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const newView = link.dataset.view;
        if (state.view === newView) return;
        state.view = newView;
        renderView();
    });
});

window.addEventListener('attendance-logged', (e) => {
    state.attendance.push(e.detail);
    saveToStorage();
    if (state.view === 'dashboard') updateDashboard(state);
});

window.addEventListener('student-added', (e) => {
    state.students.unshift(e.detail);
    saveToStorage();
});

loadData();
