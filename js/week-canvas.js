// ===== CANVAS ANIMATION PARA PÁGINAS DE SEMANAS =====

class WeekCanvasAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.nodes = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;

        this.init();
    }

    init() {
        this.setupCanvas();
        this.createParticles();
        this.createNodes();
        this.bindEvents();
        this.animate();
    }

    setupCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;

        // High DPI support
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    createParticles() {
        const particleCount = 30;
        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#06b6d4'];

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 2 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: Math.random() * 0.5 + 0.3,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    createNodes() {
        const nodeCount = 8;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.6;

        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            this.nodes.push({
                x: x,
                y: y,
                baseX: x,
                baseY: y,
                radius: Math.random() * 15 + 8,
                color: `hsl(${(i * 360) / nodeCount}, 70%, 60%)`,
                angle: angle,
                orbitRadius: radius,
                orbitSpeed: 0.002 + Math.random() * 0.003,
                value: Math.random() * 100,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = -100;
            this.mouse.y = -100;
        });

        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.particles = [];
            this.nodes = [];
            this.connections = [];
            this.createParticles();
            this.createNodes();
        });
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off walls
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }

            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx -= (dx / distance) * force * 0.2;
                particle.vy -= (dy / distance) * force * 0.2;
            }

            // Damping
            particle.vx *= 0.98;
            particle.vy *= 0.98;

            // Pulse effect
            particle.radius = (Math.sin(this.time * 0.002 + particle.pulsePhase) * 0.5 + 1.5) * particle.radius;
        });

        // Create connections
        this.connections = [];
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    this.connections.push({
                        from: this.particles[i],
                        to: this.particles[j],
                        opacity: (1 - distance / 120) * 0.4
                    });
                }
            }
        }
    }

    updateNodes() {
        this.nodes.forEach((node, index) => {
            // Orbital motion
            node.angle += node.orbitSpeed;
            node.x = node.baseX + Math.cos(node.angle) * 15;
            node.y = node.baseY + Math.sin(node.angle) * 15;

            // Value oscillation
            node.value = 50 + Math.sin(this.time * 0.001 + index * 0.5) * 40;

            // Dynamic radius based on value
            node.currentRadius = node.radius * (0.8 + node.value / 200);

            // Pulse effect
            node.pulseRadius = node.currentRadius * (1 + Math.sin(this.time * 0.003 + node.pulsePhase) * 0.1);
        });

        // Create connections between nodes
        this.nodeConnections = [];
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 250) {
                    this.nodeConnections.push({
                        from: this.nodes[i],
                        to: this.nodes[j],
                        opacity: (1 - distance / 250) * 0.3
                    });
                }
            }
        }
    }

    drawBackground() {
        // Create gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.02)');
        gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.02)');
        gradient.addColorStop(1, 'rgba(236, 72, 153, 0.02)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawParticles() {
        // Draw connections
        this.connections.forEach(connection => {
            this.ctx.beginPath();
            this.ctx.moveTo(connection.from.x, connection.from.y);
            this.ctx.lineTo(connection.to.x, connection.to.y);
            this.ctx.strokeStyle = `rgba(99, 102, 241, ${connection.opacity})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });

        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();

            // Add glow effect
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });

        this.ctx.globalAlpha = 1;
    }

    drawNodes() {
        // Draw node connections
        if (this.nodeConnections) {
            this.nodeConnections.forEach(connection => {
                const gradient = this.ctx.createLinearGradient(
                    connection.from.x, connection.from.y,
                    connection.to.x, connection.to.y
                );
                gradient.addColorStop(0, connection.from.color);
                gradient.addColorStop(1, connection.to.color);

                this.ctx.beginPath();
                this.ctx.moveTo(connection.from.x, connection.from.y);
                this.ctx.lineTo(connection.to.x, connection.to.y);
                this.ctx.strokeStyle = gradient;
                this.ctx.globalAlpha = connection.opacity;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            });
        }

        // Draw nodes
        this.nodes.forEach(node => {
            const radius = node.pulseRadius || node.currentRadius || node.radius;

            // Outer glow
            const glowGradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, radius * 2.5
            );
            glowGradient.addColorStop(0, node.color);
            glowGradient.addColorStop(1, 'transparent');

            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius * 2.5, 0, Math.PI * 2);
            this.ctx.fillStyle = glowGradient;
            this.ctx.globalAlpha = 0.2;
            this.ctx.fill();

            // Main circle
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = node.color;
            this.ctx.globalAlpha = 0.9;
            this.ctx.fill();

            // Inner circle
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius * 0.6, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            this.ctx.fill();

            // Value indicator
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 10px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.globalAlpha = 1;
            this.ctx.fillText(Math.round(node.value), node.x, node.y);
        });

        this.ctx.globalAlpha = 1;
    }

    drawInfo() {
        // Draw subtle info text
        this.ctx.fillStyle = 'rgba(99, 102, 241, 0.6)';
        this.ctx.font = '12px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Interactúa con el visualization', this.canvas.width / 2, 30);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        this.time++;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackground();
        this.updateParticles();
        this.updateNodes();
        this.drawParticles();
        this.drawNodes();
        this.drawInfo();
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    const weekCanvas = document.getElementById('weekCanvas');
    if (weekCanvas) {
        window.weekCanvasAnimation = new WeekCanvasAnimation('weekCanvas');
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.weekCanvasAnimation) {
        window.weekCanvasAnimation.destroy();
    }
});