// ===== HERO SECTION CANVAS ANIMATION =====

class HeroDataVisualization {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.dataPoints = [];
        this.animationId = null;
        this.mouse = { x: 0, y: 0 };
        this.time = 0;

        this.init();
    }

    init() {
        this.setupCanvas();
        this.createParticles();
        this.createDataPoints();
        this.bindEvents();
        this.animate();
    }

    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;

        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    createParticles() {
        const particleCount = 50;
        const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: Math.random() * 0.5 + 0.5,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    createDataPoints() {
        const pointCount = 8;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.6;

        for (let i = 0; i < pointCount; i++) {
            const angle = (i / pointCount) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            this.dataPoints.push({
                x: x,
                y: y,
                baseX: x,
                baseY: y,
                value: Math.random() * 100,
                radius: Math.random() * 20 + 10,
                color: `hsl(${(i * 360) / pointCount}, 70%, 60%)`,
                angle: angle,
                orbitRadius: radius,
                orbitSpeed: 0.001 + Math.random() * 0.002
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
            this.dataPoints = [];
            this.createParticles();
            this.createDataPoints();
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
                particle.vx -= (dx / distance) * force * 0.1;
                particle.vy -= (dy / distance) * force * 0.1;
            }

            // Damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;

            // Pulse effect
            particle.radius = (Math.sin(this.time * 0.001 + particle.pulsePhase) * 0.5 + 1.5) * particle.radius;
        });

        // Create connections between nearby particles
        this.connections = [];
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.connections.push({
                        from: this.particles[i],
                        to: this.particles[j],
                        opacity: (1 - distance / 150) * 0.5
                    });
                }
            }
        }
    }

    updateDataPoints() {
        this.dataPoints.forEach((point, index) => {
            // Orbital motion
            point.angle += point.orbitSpeed;
            point.x = point.baseX + Math.cos(point.angle) * 20;
            point.y = point.baseY + Math.sin(point.angle) * 20;

            // Value oscillation
            point.value = 50 + Math.sin(this.time * 0.001 + index) * 30;

            // Dynamic radius based on value
            point.currentRadius = point.radius * (0.8 + point.value / 250);
        });

        // Create connections between data points
        this.dataConnections = [];
        for (let i = 0; i < this.dataPoints.length; i++) {
            for (let j = i + 1; j < this.dataPoints.length; j++) {
                const dx = this.dataPoints[i].x - this.dataPoints[j].x;
                const dy = this.dataPoints[i].y - this.dataPoints[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 200) {
                    this.dataConnections.push({
                        from: this.dataPoints[i],
                        to: this.dataPoints[j],
                        opacity: (1 - distance / 200) * 0.3
                    });
                }
            }
        }
    }

    drawBackground() {
        // Create gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, 'rgba(37, 99, 235, 0.02)');
        gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.02)');
        gradient.addColorStop(1, 'rgba(245, 158, 11, 0.02)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawParticles() {
        // Draw connections
        this.connections.forEach(connection => {
            this.ctx.beginPath();
            this.ctx.moveTo(connection.from.x, connection.from.y);
            this.ctx.lineTo(connection.to.x, connection.to.y);
            this.ctx.strokeStyle = `rgba(37, 99, 235, ${connection.opacity})`;
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

    drawDataPoints() {
        // Draw data connections
        if (this.dataConnections) {
            this.dataConnections.forEach(connection => {
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

        // Draw data points
        this.dataPoints.forEach(point => {
            const radius = point.currentRadius || point.radius;

            // Outer glow
            const glowGradient = this.ctx.createRadialGradient(
                point.x, point.y, 0,
                point.x, point.y, radius * 2
            );
            glowGradient.addColorStop(0, point.color);
            glowGradient.addColorStop(1, 'transparent');

            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, radius * 2, 0, Math.PI * 2);
            this.ctx.fillStyle = glowGradient;
            this.ctx.globalAlpha = 0.3;
            this.ctx.fill();

            // Main circle
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = point.color;
            this.ctx.globalAlpha = 0.8;
            this.ctx.fill();

            // Inner circle
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, radius * 0.6, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.fill();

            // Value text
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 12px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.globalAlpha = 1;
            this.ctx.fillText(Math.round(point.value), point.x, point.y);
        });

        this.ctx.globalAlpha = 1;
    }

    drawInfo() {
        // Draw title
        this.ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
        this.ctx.font = 'bold 16px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Visualización de Datos en Tiempo Real', this.canvas.width / 2, 30);

        // Draw stats
        const stats = [
            `Partículas: ${this.particles.length}`,
            `Conexiones: ${this.connections.length}`,
            `Puntos de Datos: ${this.dataPoints.length}`
        ];

        this.ctx.font = '12px Inter';
        this.ctx.fillStyle = 'rgba(100, 116, 139, 0.8)';
        this.ctx.textAlign = 'left';
        stats.forEach((stat, index) => {
            this.ctx.fillText(stat, 20, 60 + index * 20);
        });
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        this.time++;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackground();
        this.updateParticles();
        this.updateDataPoints();
        this.drawParticles();
        this.drawDataPoints();
        this.drawInfo();
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    const heroCanvas = document.getElementById('heroCanvas');
    if (heroCanvas) {
        window.heroVisualization = new HeroDataVisualization('heroCanvas');
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.heroVisualization) {
        window.heroVisualization.destroy();
    }
});