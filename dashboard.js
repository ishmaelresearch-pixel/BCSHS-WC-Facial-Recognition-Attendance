export function initDashboard(container, state) {
    const presentToday = state.attendance.length;
    const totalStudents = state.students.length;
    const rate = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;

    const teslaCount = state.attendance.filter(a => a.section === '12 Tesla').length;
    const hawkingCount = state.attendance.filter(a => a.section === '12 Hawking').length;
    const venterCount = state.attendance.filter(a => a.section === '12 Venter').length;

    container.innerHTML = `
        <div class="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold text-white tracking-tight">System Overview</h2>
                    <p class="text-gray-500 text-xs font-medium uppercase tracking-widest mt-1">Real-time Biometric Analytics</p>
                </div>
                <p class="text-gray-400 text-sm font-medium">${new Date().toDateString()}</p>
            </div>

            <!-- Metric Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="glass-card p-6 relative overflow-hidden group">
                    <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <i data-lucide="users" class="w-12 h-12"></i>
                    </div>
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Students</p>
                    <p class="text-4xl font-extrabold text-white mt-2">${totalStudents}</p>
                </div>
                <div class="glass-card p-6 relative overflow-hidden group border-emerald-500/20">
                    <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-emerald-500">
                        <i data-lucide="user-check" class="w-12 h-12"></i>
                    </div>
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Present Today</p>
                    <p class="text-4xl font-extrabold text-emerald-500 mt-2 metric-glow-emerald" id="dash-present">${presentToday}</p>
                </div>
                <div class="glass-card p-6 relative overflow-hidden group border-purple-500/20">
                    <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-purple-500">
                        <i data-lucide="bar-chart-3" class="w-12 h-12"></i>
                    </div>
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Attendance Rate</p>
                    <div class="flex items-baseline gap-1">
                        <p class="text-4xl font-extrabold text-purple-500 mt-2 metric-glow-purple" id="dash-rate">${rate}</p>
                        <span class="text-purple-500 font-bold">%</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- STEM Sections -->
                <div class="lg:col-span-2 space-y-6">
                    <div class="glass-card p-6">
                        <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">12 STEM Section Tracking</h3>
                        <div class="space-y-6">
                            ${renderSectionProgress('12 Tesla', teslaCount, 20, 'bg-blue-500')}
                            ${renderSectionProgress('12 Hawking', hawkingCount, 18, 'bg-red-500')}
                            ${renderSectionProgress('12 Venter', venterCount, 22, 'bg-emerald-500')}
                        </div>
                    </div>
                </div>

                <!-- Live Activity -->
                <div class="glass-card p-6 flex flex-col h-[400px]">
                    <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Live Activity</h3>
                    <div id="activity-feed" class="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        ${renderActivityLogs(state.attendance)}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderActivityLogs(attendance) {
    if (attendance.length === 0) {
        return '<p class="text-gray-600 text-xs italic text-center mt-20">Scanning for activity...</p>';
    }
    return attendance.slice().reverse().map(log => `
        <div class="p-3 bg-white/5 rounded-lg border border-white/5 text-xs animate-slide-in">
            <div class="flex justify-between mb-1">
                <span class="text-emerald-500 font-bold">${log.name}</span>
                <span class="text-gray-500">${log.time}</span>
            </div>
            <p class="text-gray-400">!2 ${log.section.split(' ')[1]} - <span class="text-gray-300 font-medium">${log.name}</span></p>
        </div>
    `).join('');
}

function renderSectionProgress(name, count, capacity, colorClass) {
    const pct = Math.min((count / capacity) * 100, 100);
    return `
        <div>
            <div class="flex justify-between items-end mb-2">
                <div>
                    <p class="text-white font-bold">${name}</p>
                    <p class="text-[10px] text-gray-500 uppercase">STEM Department</p>
                </div>
                <p class="text-sm text-gray-300 font-mono">${count} / ${capacity}</p>
            </div>
            <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div class="h-full ${colorClass} transition-all duration-1000 ease-out" style="width: ${pct}%"></div>
            </div>
        </div>
    `;
}

export function updateDashboard(state) {
    const presentEl = document.getElementById('dash-present');
    const rateEl = document.getElementById('dash-rate');
    const feedEl = document.getElementById('activity-feed');
    
    if (presentEl && rateEl) {
        const presentToday = state.attendance.length;
        const totalStudents = state.students.length;
        const rate = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;
        
        presentEl.innerText = presentToday;
        rateEl.innerText = rate;
        
        if (feedEl) {
            feedEl.innerHTML = renderActivityLogs(state.attendance);
        }
    }
}
