
// ========================================
// MODAL FUNCTIONALITY
// ========================================

// Modal Management
class ModalManager {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.overlay = this.modal?.querySelector('.modal-overlay');
        this.closeBtn = this.modal?.querySelector('.modal-close');

        if (this.modal) {
            this.init();
        }
    }

    init() {
        // Close on overlay click
        this.overlay?.addEventListener('click', () => this.close());

        // Close on close button click
        this.closeBtn?.addEventListener('click', () => this.close());

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    open() {
        this.modal.style.display = 'flex';
        setTimeout(() => {
            this.modal.classList.add('active');
        }, 10);
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        setTimeout(() => {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
}

// Initialize modals after DOM is loaded
let contactModal, wheelModal;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Contact Modal
    contactModal = new ModalManager('contactModal');

    // Initialize Wheel Modal
    wheelModal = new ModalManager('wheelModal');

    // Add click handlers to all consultation buttons
    const consultationButtons = document.querySelectorAll('button:not([id="spinButton"]):not(.modal-close):not([type="submit"]):not([id="floatingWheelBtn"])');

    consultationButtons.forEach(btn => {
        const text = btn.textContent.toLowerCase();
        if (text.includes('консультац') || text.includes('тариф')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                contactModal.open();
            });
        }
    });

    // Floating wheel button handler
    const floatingWheelBtn = document.getElementById('floatingWheelBtn');
    if (floatingWheelBtn) {
        floatingWheelBtn.addEventListener('click', () => {
            wheelModal.open();
            // Reset wheel if it was already spun
            const wheelOfFortune = window.wheelOfFortuneInstance;
            if (wheelOfFortune && wheelOfFortune.hasSpun) {
                document.getElementById('wheelResult').style.display = 'none';
                document.querySelector('.wheel-wrapper').style.display = 'flex';
                wheelOfFortune.hasSpun = false;
                wheelOfFortune.spinButton.disabled = false;
            }
        });
    }

    // Handle modal form submissions
    const modalContactForm = document.getElementById('modalContactForm');
    if (modalContactForm) {
        modalContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(modalContactForm);
            console.log('Contact form submitted:', Object.fromEntries(formData));
            alert('Спасибо за заявку! Наш специалист свяжется с вами в течение 15 минут.');
            modalContactForm.reset();
            contactModal.close();
        });
    }

    const wheelContactForm = document.getElementById('wheelContactForm');
    if (wheelContactForm) {
        wheelContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(wheelContactForm);
            console.log('Wheel form submitted:', Object.fromEntries(formData));
            alert('Отлично! Мы свяжемся с вами и предоставим персональное предложение со скидкой!');
            wheelContactForm.reset();
            wheelModal.close();

            // Reset wheel for next visitor
            setTimeout(() => {
                document.getElementById('wheelResult').style.display = 'none';
                document.querySelector('.wheel-wrapper').style.display = 'flex';
                wheelOfFortune.hasSpun = false;
            }, 500);
        });
    }

    // Initialize Wheel of Fortune
    window.wheelOfFortuneInstance = new WheelOfFortune();

    // Auto-open wheel modal after 10 seconds (only once)
    if (!sessionStorage.getItem('wheelShown')) {
        setTimeout(() => {
            wheelModal.open();
            sessionStorage.setItem('wheelShown', 'true');
        }, 10000);
    }
});

// ========================================
// WHEEL OF FORTUNE
// ========================================

class WheelOfFortune {
    constructor() {
        this.canvas = document.getElementById('wheelCanvas');
        this.ctx = this.canvas?.getContext('2d');
        this.spinButton = document.getElementById('spinButton');
        this.resultDiv = document.getElementById('wheelResult');
        this.discountValueSpan = document.getElementById('discountValue');
        this.discountInput = document.getElementById('discountInput');

        // Wheel configuration - чередование темно-синего и оранжевого
        this.segments = [
            { text: '5%', color: '#1a2332', value: 5 },      // темно-синий (цвет сайта)
            { text: '10%', color: '#ff8a00', value: 10 },    // оранжевый
            { text: '15%', color: '#1a2332', value: 15 },    // темно-синий
            { text: '20%', color: '#ff8a00', value: 20 },    // оранжевый
            { text: '25%', color: '#1a2332', value: 25 },    // темно-синий
            { text: '30%', color: '#ff8a00', value: 30 },    // оранжевый
            { text: '35%', color: '#1a2332', value: 35 },    // темно-синий
            { text: '40%', color: '#ff8a00', value: 40 }     // оранжевый
        ];

        this.currentAngle = 0;
        this.isSpinning = false;
        this.hasSpun = false;

        if (this.canvas && this.ctx) {
            this.init();
        }
    }

    init() {
        this.drawWheel();

        if (this.spinButton) {
            this.spinButton.addEventListener('click', () => this.spin());
        }
    }

    drawWheel() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        const segmentAngle = (2 * Math.PI) / this.segments.length;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw segments
        this.segments.forEach((segment, index) => {
            const startAngle = this.currentAngle + index * segmentAngle;
            const endAngle = startAngle + segmentAngle;

            // Draw segment
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            this.ctx.closePath();
            this.ctx.fillStyle = segment.color;
            this.ctx.fill();

            // Draw border
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();

            // Draw text
            this.ctx.save();
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate(startAngle + segmentAngle / 2);
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.fillText(segment.text, radius * 0.65, 10);
            this.ctx.restore();
        });

        // Draw center circle
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    }

    spin() {
        if (this.isSpinning || this.hasSpun) return;

        this.isSpinning = true;
        this.hasSpun = true;
        this.spinButton.disabled = true;

        // Random spin (5-10 full rotations + random segment)
        const minSpins = 5;
        const maxSpins = 10;
        const randomSpins = Math.random() * (maxSpins - minSpins) + minSpins;
        const randomSegment = Math.random();
        const totalRotation = randomSpins * 2 * Math.PI + randomSegment * 2 * Math.PI;

        const duration = 4000; // 4 seconds
        const startTime = Date.now();
        const startAngle = this.currentAngle;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease out)
            const easeOut = 1 - Math.pow(1 - progress, 3);

            this.currentAngle = startAngle + totalRotation * easeOut;
            this.drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.onSpinComplete();
            }
        };

        animate();
    }

    onSpinComplete() {
        this.isSpinning = false;

        // Calculate which segment won
        const segmentAngle = (2 * Math.PI) / this.segments.length;
        // The pointer is at the top, so we need to find which segment is at the top
        const normalizedAngle = (2 * Math.PI - (this.currentAngle % (2 * Math.PI))) % (2 * Math.PI);
        const winningIndex = Math.floor(normalizedAngle / segmentAngle);
        const winningSegment = this.segments[winningIndex];

        // Show result
        setTimeout(() => {
            this.showResult(winningSegment);
        }, 500);
    }

    showResult(segment) {
        // Hide wheel
        document.querySelector('.wheel-wrapper').style.display = 'none';

        // Show result
        this.discountValueSpan.textContent = segment.text;
        this.discountInput.value = segment.value;
        this.resultDiv.style.display = 'block';

        // Confetti effect (optional - using simple animation)
        this.createConfetti();
    }

    createConfetti() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.opacity = '1';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '99999';
            confetti.style.borderRadius = '50%';

            document.body.appendChild(confetti);

            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: 2000 + Math.random() * 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });

            animation.onfinish = () => confetti.remove();
        }
    }
}
