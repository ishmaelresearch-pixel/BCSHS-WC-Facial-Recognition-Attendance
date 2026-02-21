export function initScanner(container, state) {
    container.innerHTML = `
        <div class="relative w-full h-full bg-black overflow-hidden flex flex-col">
            <!-- Camera Feed -->
            <div id="scanner-bg" class="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <video id="main-scanner" class="w-full h-full object-cover opacity-80" autoplay playsinline></video>
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80"></div>
                
                <!-- Full Screen Scanning Grid Overlay -->
                <div class="absolute inset-0 pointer-events-none opacity-20" 
                     style="background-image: radial-gradient(circle, #8B5CF6 1px, transparent 1px); background-size: 40px 40px;">
                </div>
            </div>

            <!-- UI Overlay -->
            <div class="relative z-10 flex flex-col h-full items-center justify-between py-12">
                <div class="bg-black/80 backdrop-blur-xl border border-white/10 px-6 py-2.5 rounded-full flex items-center gap-3 shadow-2xl">
                    <div class="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10B981]"></div>
                    <span class="text-white text-sm font-extrabold uppercase tracking-widest">Live Biometric Feed</span>
                </div>

                <div class="relative w-full max-w-lg aspect-square md:aspect-video flex items-center justify-center">
                    <!-- Scanning Guide Box -->
                    <div class="relative w-72 h-72">
                        <div class="absolute inset-0 border border-white/10 rounded-3xl"></div>
                        <div class="corner-border corner-tl"></div>
                        <div class="corner-border corner-tr"></div>
                        <div class="corner-border corner-bl"></div>
                        <div class="corner-border corner-br"></div>
                        
                        <div class="scan-line"></div>
                        
                        <!-- Dynamic Bounding Box -->
                        <div id="face-bounding-box" class="face-box hidden">
                            <div id="face-id-label" class="face-label">DETECTING...</div>
                        </div>
                    </div>

                    <div class="absolute inset-x-0 -bottom-16 text-center">
                        <div class="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                            <i data-lucide="info" class="w-3 h-3 text-purple-400"></i>
                            <p class="text-purple-300 text-[10px] font-bold uppercase tracking-widest">
                                Face Recognition active for 12 STEM
                            </p>
                        </div>
                    </div>
                </div>

                <div class="w-full max-w-md px-6">
                    <div id="status-card" class="glass-card bg-black/60 p-6 flex items-center gap-5 border-white/5 transition-all duration-300">
                        <div id="status-icon-bg" class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-colors">
                            <i id="status-icon" data-lucide="aperture" class="w-7 h-7 text-gray-400 animate-spin-slow"></i>
                        </div>
                        <div>
                            <p id="status-title" class="text-white font-bold text-lg">System Ready</p>
                            <p id="status-desc" class="text-gray-400 text-xs">Awaiting student identification...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const video = document.getElementById('main-scanner');
    const faceBox = document.getElementById('face-bounding-box');
    const faceLabel = document.getElementById('face-id-label');
    const statusCard = document.getElementById('status-card');
    const statusIconBg = document.getElementById('status-icon-bg');
    const statusIcon = document.getElementById('status-icon');
    const statusTitle = document.getElementById('status-title');
    const statusDesc = document.getElementById('status-desc');

    let streamRef = null;

    async function startCamera() {
        try {
            streamRef = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "user", width: 1280, height: 720 } 
            });
            video.srcObject = streamRef;
            

            setTimeout(simulateDetection, 3000);
        } catch (err) {
            container.innerHTML += `
                <div class="absolute inset-0 flex items-center justify-center bg-black/95 z-50">
                    <div class="text-center p-8 glass-card border-red-500/20">
                        <i data-lucide="camera-off" class="w-16 h-16 text-red-500 mx-auto mb-4"></i>
                        <h3 class="text-xl font-bold text-white">Camera Access Required</h3>
                        <p class="text-gray-400 text-sm mt-2 max-w-xs">Attendance scanning requires hardware camera access. Please check permissions.</p>
                        <button onclick="location.reload()" class="mt-6 px-6 py-2 bg-red-600 rounded-lg text-sm font-bold">Retry Access</button>
                    </div>
                </div>
            `;
            lucide.createIcons();
        }
    }

    function simulateDetection() {
        if (!document.getElementById('main-scanner')) return; // Check if still in view

        const registeredStudents = state.students.filter(s => s.status === 'Registered');
        if (registeredStudents.length === 0) {
            setTimeout(simulateDetection, 5000);
            return;
        }


        const student = registeredStudents[Math.floor(Math.random() * registeredStudents.length)];
        

        const top = 15 + Math.random() * 10;
        const left = 15 + Math.random() * 10;
        faceBox.style.top = `${top}%`;
        faceBox.style.left = `${left}%`;
        faceBox.style.width = `70%`;
        faceBox.style.height = `70%`;

        faceBox.classList.remove('hidden');
        faceLabel.innerText = "MATCHING...";

        setTimeout(() => {
            if (!document.getElementById('main-scanner')) return;


            faceLabel.innerText = `LRN: ${student.id}`;
            faceBox.style.borderColor = "#10B981";
            faceBox.style.boxShadow = "0 0 20px #10B981";

            statusCard.classList.replace('border-white/5', 'border-emerald-500/50');
            statusIconBg.classList.replace('bg-white/5', 'bg-emerald-500/20');
            statusIconBg.classList.replace('border-white/10', 'border-emerald-500/30');
            statusIcon.classList.replace('text-gray-400', 'text-emerald-500');
            statusIcon.innerHTML = lucide.icons['check-circle'].toSvg();
            statusTitle.innerText = "Access Granted";
            statusDesc.innerText = `${student.name} logged successfully.`;

            window.showToast("Present", "success");


            window.dispatchEvent(new CustomEvent('attendance-logged', {
                detail: {
                    name: student.name,
                    id: student.id,
                    section: student.section,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            }));


            setTimeout(() => {
                if (!document.getElementById('main-scanner')) return;
                faceBox.classList.add('hidden');
                faceBox.style.borderColor = ""; 
                faceBox.style.boxShadow = "";
                
                statusCard.classList.replace('border-emerald-500/50', 'border-white/5');
                statusIconBg.classList.replace('bg-emerald-500/20', 'bg-white/5');
                statusIconBg.classList.replace('border-emerald-500/30', 'border-white/10');
                statusIcon.classList.replace('text-emerald-500', 'text-gray-400');
                statusIcon.innerHTML = lucide.icons['aperture'].toSvg();
                statusTitle.innerText = "System Ready";
                statusDesc.innerText = "Awaiting student identification...";
                
                setTimeout(simulateDetection, 6000);
            }, 3000);
        }, 1200);
    }

    startCamera();
    lucide.createIcons();
    

    const originalRender = window.renderView;
    window.addEventListener('hashchange', () => {
        if (streamRef) streamRef.getTracks().forEach(t => t.stop());
    }, { once: true });
}
