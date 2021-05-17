const action = document.getElementById('action');

var status = 0;
var raf = 0;
const imgWidth = 231;
const imgHeight = 457;

const canvas = document.getElementById('canvas');
canvas.width = 231 * 5;
canvas.height = 600;
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = 'ironman.png';

function drawImage() {
    ctx.drawImage(img, 450, 80, imgWidth, imgHeight);
}

img.addEventListener('load', () => {
    drawImage();
});

function change() {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log(pixels);

    let mappedImage = [];
    for (let y = 0; y < canvas.height; y++) {
        let row = [];
        for (let x = 0; x < canvas.width; x++) {
            const red = pixels.data[(y * 4 * pixels.width) + (x * 4)];
            const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)];
            const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)];
            const brightness = calculateRelativeBrightness(red, green, blue);
            const cell = [
                cellBrightness = brightness * 20
            ];
            row.push(cell);
        }
        mappedImage.push(row);
    }
    console.log(mappedImage);

    function calculateRelativeBrightness(red, green, blue) {
        return Math.sqrt(
            (red * red) * 0.299 +
            (green * green) * 0.587 +
            (blue * blue) * 0.114
        ) / 100;
    }

    let numberOfParticles = 2000;
    let particleArray = [];
    let rayArray = [];
    let rayArray2 = [];
    let stickyParticleArray = [];

    class StickyParticles {
        constructor() {
            this.x = 440 + Math.random() * 300;
            this.y = 0;
            this.speed = 0;
            this.velocity = Math.random() * 0.5;
            this.size = Math.random() * 5 + 1;
            this.position1 = Math.floor(this.y);
            this.position2 = Math.floor(this.x);

        }

        update() {
            this.position1 = Math.floor(this.y);
            this.position2 = Math.floor(this.x);
            this.speed = mappedImage[this.position1][this.position2][0];
            let movement = (1.2 - this.speed) + this.velocity;
            this.y += movement;
            if (this.y >= canvas.height) {
                this.y = 0;
                this.x = 440 + Math.random() * 300;
            }
            this.x -= 0.25 * Math.random();
        }
        draw() {
            ctx.beginPath();
            ctx.fillStyle = 'rgb(77,238,234)';
            ctx.fillRect(this.x, this.y, this.size, this.size);
            // ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vy = Math.random() * 4;
            this.vx = Math.random() * 1.4;
            this.size = Math.random() * 2 + 0.1;
        }

        update() {
            if (this.y < 0) {
                this.y = canvas.height;
            }
            this.y -= this.vy;
            if (this.x >= 340 && this.x < 500) {
                this.x -= this.vx * 2;
            }

            if (this.x >= 500 && this.x < 830) {
                this.x += this.vx * 2;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.fillStyle = 'rgb(77, 238, 234)';
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class Ray {
        constructor() {
            this.x = 590 + Math.random() * 6;
            this.y = Math.random() * canvas.height;
            this.velocity = Math.random() * 3;
            this.size = Math.random() * 2 + 0.1;
        }
        update() {
            if (this.y > canvas.height) {
                this.y = 0;
            }

            this.y += this.velocity;
            if (this.x >= 10 && this.x < 600) {
                this.x--;
            }
        }
        updateRay2() {
            if (this.y > canvas.height) {
                this.y = 0;
            }
            this.y += this.velocity;
            if (this.x >= 590 && this.x <= canvas.width - 12) {
                this.x++;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.fillStyle = 'rgb(77, 238, 234)';
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        for (let i = 0; i < numberOfParticles; i++) {
            particleArray.push(new Particle());
            rayArray.push(new Ray());
            rayArray2.push(new Ray());
            stickyParticleArray.push(new StickyParticles());
        }
    }

    init();

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawImage();
        for (let i = 0; i < particleArray.length; i++) {
            particleArray[i].update();
            particleArray[i].draw();
        }
        for (let i = 0; i < rayArray.length; i++) {
            rayArray[i].update();
            rayArray[i].draw();
        }
        for (let i = 0; i < rayArray2.length; i++) {
            rayArray2[i].updateRay2();
            rayArray2[i].draw();
        }
        for (let i = 0; i < stickyParticleArray.length; i++) {
            stickyParticleArray[i].update();
            stickyParticleArray[i].draw();
        }

        raf = requestAnimationFrame(animate);

    }

    animate();
}

action.addEventListener('click', () => {
    if (status == 0) {
        action.innerHTML = "Stop";
        status = 1;
        change();
        action.style.animation = "glow 800ms linear forwards";
        document.getElementById('text').style.animation = "textglow 500ms linear forwards";
        document.getElementById('text2').style.animation = "textglow 500ms linear forwards";
    } else {
        action.innerHTML = "Play";
        status = 0;
        cancelAnimationFrame(raf);
        action.style.animation = "glowoff 800ms linear forwards";
        document.getElementById('text').style.animation = "textglowoff 500ms linear forwards";
        document.getElementById('text2').style.animation = "textglowoff 500ms linear forwards";
    }
});