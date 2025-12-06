// Circle class
class Circle {
    constructor(x, y, radius, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }

    update(canvasWidth, canvasHeight) {
        // Update position
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off walls
        if (this.x + this.radius > canvasWidth || this.x - this.radius < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y + this.radius > canvasHeight || this.y - this.radius < 0) {
            this.speedY = -this.speedY;
        }

        // Keep within bounds
        this.x = Math.max(this.radius, Math.min(canvasWidth - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvasHeight - this.radius, this.y));
    }
}

// Playground class
class Playground {
    constructor() {
        this.canvas = document.getElementById('playground');
        this.ctx = this.canvas.getContext('2d');
        this.circles = [];
        this.animationId = null;
        
        // Set initial size
        this.width = 800;
        this.height = 600;
        this.updateCanvasSize();
        
        // Initialize with 10 circles
        this.initCircles(10);
        
        // Setup controls
        this.setupControls();
        
        // Start animation
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    updateCanvasSize() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.updateStats();
    }

    randomColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
            '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
            '#F8B739', '#52B788'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    createCircle() {
        const radius = 20 + Math.random() * 30; // Random radius between 20-50
        const x = radius + Math.random() * (this.width - radius * 2);
        const y = radius + Math.random() * (this.height - radius * 2);
        const speedX = (Math.random() - 0.5) * 4;
        const speedY = (Math.random() - 0.5) * 4;
        const color = this.randomColor();
        
        return new Circle(x, y, radius, color, speedX, speedY);
    }

    initCircles(count) {
        this.circles = [];
        for (let i = 0; i < count; i++) {
            this.circles.push(this.createCircle());
        }
        this.updateStats();
    }

    addCircle() {
        this.circles.push(this.createCircle());
        this.updateStats();
    }

    removeCircle() {
        if (this.circles.length > 0) {
            this.circles.pop();
            this.updateStats();
        }
    }

    updateStats() {
        document.getElementById('circle-count').textContent = `Circles: ${this.circles.length}`;
        document.getElementById('playground-size').textContent = `Playground: ${this.width} x ${this.height}`;
    }

    setupControls() {
        // Add/Remove/Reset buttons
        document.getElementById('add-circle').addEventListener('click', () => {
            this.addCircle();
        });

        document.getElementById('remove-circle').addEventListener('click', () => {
            this.removeCircle();
        });

        document.getElementById('reset').addEventListener('click', () => {
            this.initCircles(10);
        });

        // Width controls
        const widthSlider = document.getElementById('width-slider');
        const widthPlus = document.getElementById('width-plus');
        const widthMinus = document.getElementById('width-minus');

        widthSlider.value = this.width;
        widthSlider.max = window.innerWidth > 2000 ? window.innerWidth : 2000;

        widthSlider.addEventListener('input', (e) => {
            this.width = parseInt(e.target.value);
            this.updateCanvasSize();
        });

        widthPlus.addEventListener('click', () => {
            this.width = Math.min(parseInt(widthSlider.max), this.width + 50);
            widthSlider.value = this.width;
            this.updateCanvasSize();
        });

        widthMinus.addEventListener('click', () => {
            this.width = Math.max(300, this.width - 50);
            widthSlider.value = this.width;
            this.updateCanvasSize();
        });

        // Height controls
        const heightSlider = document.getElementById('height-slider');
        const heightPlus = document.getElementById('height-plus');
        const heightMinus = document.getElementById('height-minus');

        heightSlider.value = this.height;
        heightSlider.max = window.innerHeight > 2000 ? window.innerHeight : 2000;

        heightSlider.addEventListener('input', (e) => {
            this.height = parseInt(e.target.value);
            this.updateCanvasSize();
        });

        heightPlus.addEventListener('click', () => {
            this.height = Math.min(parseInt(heightSlider.max), this.height + 50);
            heightSlider.value = this.height;
            this.updateCanvasSize();
        });

        heightMinus.addEventListener('click', () => {
            this.height = Math.max(300, this.height - 50);
            heightSlider.value = this.height;
            this.updateCanvasSize();
        });

        // Touch support for mobile
        let touchHandlers = {
            handleTouch: (e, action) => {
                e.preventDefault();
                action();
            }
        };

        // Add touch event listeners to buttons
        [widthPlus, widthMinus, heightPlus, heightMinus].forEach(btn => {
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                btn.click();
            });
        });
    }

    handleResize() {
        const widthSlider = document.getElementById('width-slider');
        const heightSlider = document.getElementById('height-slider');
        
        widthSlider.max = window.innerWidth > 2000 ? window.innerWidth : 2000;
        heightSlider.max = window.innerHeight > 2000 ? window.innerHeight : 2000;
    }

    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Update and draw all circles
        this.circles.forEach(circle => {
            circle.update(this.width, this.height);
            circle.draw(this.ctx);
        });

        // Continue animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Initialize playground when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Playground();
});
