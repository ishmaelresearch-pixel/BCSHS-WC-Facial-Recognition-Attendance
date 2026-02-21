export function initStudents(container, state) {
    container.innerHTML = `
        <div class="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold text-white tracking-tight">Student Directory</h2>
                    <p class="text-gray-400 text-sm mt-1">Total Enrolled: <span class="text-purple-400 font-bold">${state.students.length}</span></p>
                </div>
                <button id="add-student-btn" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-900/40 active:scale-95">
                    <i data-lucide="user-plus" class="w-5 h-5"></i>
                    Add Student
                </button>
            </div>

            <div class="glass-card overflow-hidden border-white/5 shadow-2xl">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-gray-800 bg-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-extrabold">
                                <th class="px-6 py-5">Full Student Name</th>
                                <th class="px-6 py-5">LRN ID (Reference)</th>
                                <th class="px-6 py-5">Assigned Section</th>
                                <th class="px-6 py-5">Biometric Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-800/50">
                            ${state.students.length === 0 ? `
                                <tr>
                                    <td colspan="4" class="px-6 py-20 text-center text-gray-500 italic">No students registered in the system.</td>
                                </tr>
                            ` : state.students.map(student => `
                                <tr class="hover:bg-white/5 transition-colors group">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-4">
                                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-600/20 flex items-center justify-center text-xs font-bold text-purple-300 border border-purple-500/20 group-hover:scale-110 transition-transform">
                                                ${student.initials}
                                            </div>
                                            <span class="text-sm font-semibold text-gray-200">${student.name}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-sm font-mono text-gray-500 tracking-tighter">${student.id}</td>
                                    <td class="px-6 py-4">
                                        <span class="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest">${student.section}</span>
                                    </td>
                                    <td class="px-6 py-4">
                                        ${student.status === 'Registered' ? 
                                            `<div class="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-tighter">
                                                <i data-lucide="shield-check" class="w-4 h-4"></i>
                                                Biometric Verified
                                            </div>` : 
                                            `<button class="bg-purple-500/10 hover:bg-purple-500 text-purple-500 hover:text-white border border-purple-500/30 px-4 py-1.5 rounded-lg text-xs font-bold transition-all">
                                                Enroll Face
                                            </button>`
                                        }
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Registration Modal -->
        <div id="register-modal" class="fixed inset-0 z-[100] bg-black/95 hidden items-center justify-center p-6 backdrop-blur-xl">
            <div class="glass-card max-w-3xl w-full p-10 relative border-purple-500/20 animate-scale-in">
                <button id="close-modal" class="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
                
                <div class="mb-10">
                    <h3 class="text-3xl font-extrabold text-white">Register New Student</h3>
                    <p class="text-gray-400 text-sm mt-2">Enter credentials and perform biometric facial capture</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div class="space-y-6">
                        <div class="space-y-2">
                            <label class="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Full Legal Name</label>
                            <input type="text" id="reg-name" placeholder="e.g. Jhon Mike S. Duderte" class="w-full bg-black/40 border border-gray-800 rounded-xl p-4 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all">
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] uppercase font-bold text-gray-500 tracking-widest">LRN ID (12 Digits)</label>
                            <input type="text" id="reg-lrn" placeholder="e.g. 106928327120" maxlength="12" class="w-full bg-black/40 border border-gray-800 rounded-xl p-4 text-white font-mono focus:border-purple-500 focus:outline-none transition-all">
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] uppercase font-bold text-gray-500 tracking-widest">STEM Section</label>
                            <div class="relative">
                                <select id="reg-section" class="w-full bg-black/40 border border-gray-800 rounded-xl p-4 text-white focus:border-purple-500 focus:outline-none appearance-none cursor-pointer">
                                    <option value="12 Venter">12 Venter</option>
                                    <option value="12 Tesla">12 Tesla</option>
                                    <option value="12 Hawking">12 Hawking</option>
                                </select>
                                <i data-lucide="chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"></i>
                            </div>
                        </div>
                        <button id="start-biometric" class="w-full bg-white text-black hover:bg-purple-500 hover:text-white font-black py-4 rounded-xl transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs">
                            Start Biometric Capture
                        </button>
                    </div>
                    
                    <div class="aspect-square bg-black/50 rounded-3xl border border-gray-800 overflow-hidden relative group">
                        <div id="reg-camera-placeholder" class="h-full flex flex-col items-center justify-center p-8 text-center transition-opacity duration-300">
                            <div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <i data-lucide="camera" class="w-10 h-10 text-gray-600"></i>
                            </div>
                            <p class="text-xs text-gray-500 leading-relaxed">System will request camera access for secure biometric registration</p>
                        </div>
                        
                        <video id="reg-video" class="absolute inset-0 w-full h-full object-cover hidden" autoplay playsinline></video>
                        <div id="reg-overlay" class="absolute inset-0 pointer-events-none border-[12px] border-black/40 hidden">
                             <div class="w-full h-full border-2 border-emerald-500/50 rounded-2xl flex items-center justify-center">
                                <div class="w-48 h-48 border border-emerald-500/30 rounded-full animate-pulse"></div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('add-student-btn').onclick = () => {
        const modal = document.getElementById('register-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        lucide.createIcons();
    };

    const closeModal = () => {
        const modal = document.getElementById('register-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        const video = document.getElementById('reg-video');
        if (video.srcObject) video.srcObject.getTracks().forEach(track => track.stop());

        const btn = document.getElementById('start-biometric');
        btn.innerText = "Start Biometric Capture";
        btn.disabled = false;
    };

    document.getElementById('close-modal').onclick = closeModal;

    document.getElementById('start-biometric').onclick = async function() {
        const nameInput = document.getElementById('reg-name');
        const lrnInput = document.getElementById('reg-lrn');
        const section = document.getElementById('reg-section').value;

        if (!nameInput.value || !lrnInput.value || lrnInput.value.length < 12) {
            window.showToast("Please provide full name and 12-digit LRN", "info");
            return;
        }

        const video = document.getElementById('reg-video');
        const placeholder = document.getElementById('reg-camera-placeholder');
        const overlay = document.getElementById('reg-overlay');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.classList.remove('hidden');
            placeholder.classList.add('opacity-0');
            overlay.classList.remove('hidden');
            
            this.innerText = "ANALYZING BIOMETRICS...";
            this.disabled = true;

            setTimeout(() => {
                const initials = nameInput.value.split(' ').map(n => n[0]).join('').toUpperCase();
                const newStudent = {
                    id: lrnInput.value,
                    name: nameInput.value,
                    section: section,
                    status: 'Registered',
                    initials: initials,
                    attendance: []
                };
                
                window.dispatchEvent(new CustomEvent('student-added', { detail: newStudent }));
                window.showToast(`${nameInput.value} Enrollment Complete!`);
                
                closeModal();
                initStudents(container, state);
            }, 4000);

        } catch (err) {
            window.showToast("Hardware not found or access denied", "info");
        }
    };
}
