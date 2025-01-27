<template>
    <div class="container">
        <div class="canvas-container">
            <canvas 
                ref="displayCanvas" 
                id="displayCanvas" 
                :width="canvasWidth" 
                :height="canvasHeight"
                @mousedown="startDrawing"
                @mousemove="draw"
                @mouseup="stopDrawing"
                @mouseleave="stopDrawing"
                @touchstart="handleTouchStart"
                @touchmove="handleTouchMove"
                @touchend="stopDrawing"
                @touchcancel="stopDrawing"
            ></canvas>
            <canvas 
                ref="hiddenCanvas" 
                id="hiddenCanvas" 
                :width="hiddenWidth" 
                :height="hiddenHeight" 
                style="display: none"
            ></canvas>
            <div class="buttons">
                <button @click="clearCanvas">Clear</button>
                <button @click="transcribeText">Transcribe</button>
            </div>
        </div>
        <div class="result-box" v-if="result.lines && result.lines.length > 0">
            <h3>Transcription Result</h3>
            <ul>
                <li v-for="(line, index) in result.lines" :key="index">
                    {{ line }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            result: {
                lines: [],
            },
            drawing: false,
            lastX: 0,
            lastY: 0,
            canvasWidth: 560,
            canvasHeight: 280,
            hiddenWidth: 280,
            hiddenHeight: 140,
            SCALE_FACTOR: 2,
        };
    },
    methods: {
        initCanvas(canvas) {
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = this.getScaledLineWidth();
            ctx.lineCap = "round";
            ctx.strokeStyle = "black";
            return ctx;
        },
        getScaledLineWidth() {
            // Adjust line width based on device pixel ratio and screen size
            const baseWidth = 10;
            const scale = window.devicePixelRatio || 1;
            return Math.max(baseWidth / scale, 4);
        },
        clearCanvas() {
            const displayCtx = this.$refs.displayCanvas.getContext("2d");
            const hiddenCtx = this.$refs.hiddenCanvas.getContext("2d");

            displayCtx.fillStyle = "white";
            hiddenCtx.fillStyle = "white";

            displayCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            hiddenCtx.fillRect(0, 0, this.hiddenWidth, this.hiddenHeight);

            this.result = { lines: [] };
        },
        handleTouchStart(event) {
            event.preventDefault(); // Prevent scrolling
            const touch = event.touches[0];
            const rect = this.$refs.displayCanvas.getBoundingClientRect();
            this.lastX = touch.clientX - rect.left;
            this.lastY = touch.clientY - rect.top;
            this.drawing = true;
        },
        handleTouchMove(event) {
            event.preventDefault(); // Prevent scrolling
            if (!this.drawing) return;
            
            const touch = event.touches[0];
            const rect = this.$refs.displayCanvas.getBoundingClientRect();
            const currentX = touch.clientX - rect.left;
            const currentY = touch.clientY - rect.top;
            
            const displayCtx = this.$refs.displayCanvas.getContext("2d");
            displayCtx.beginPath();
            displayCtx.moveTo(this.lastX, this.lastY);
            displayCtx.lineTo(currentX, currentY);
            displayCtx.stroke();

            this.lastX = currentX;
            this.lastY = currentY;
        },
        startDrawing(event) {
            this.drawing = true;
            const rect = this.$refs.displayCanvas.getBoundingClientRect();
            this.lastX = event.clientX - rect.left;
            this.lastY = event.clientY - rect.top;
        },
        draw(event) {
            if (!this.drawing) return;

            const displayCtx = this.$refs.displayCanvas.getContext("2d");
            const rect = this.$refs.displayCanvas.getBoundingClientRect();
            const currentX = event.clientX - rect.left;
            const currentY = event.clientY - rect.top;

            displayCtx.beginPath();
            displayCtx.moveTo(this.lastX, this.lastY);
            displayCtx.lineTo(currentX, currentY);
            displayCtx.stroke();

            this.lastX = currentX;
            this.lastY = currentY;
        },
        stopDrawing() {
            if (this.drawing) {
                this.drawing = false;
                this.updateHiddenCanvas();
            }
        },
        updateHiddenCanvas() {
            const displayCanvas = this.$refs.displayCanvas;
            const hiddenCanvas = this.$refs.hiddenCanvas;
            const hiddenCtx = hiddenCanvas.getContext("2d");

            hiddenCtx.fillStyle = "white";
            hiddenCtx.fillRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);

            hiddenCtx.drawImage(
                displayCanvas,
                0, 0, displayCanvas.width, displayCanvas.height,
                0, 0, hiddenCanvas.width, hiddenCanvas.height
            );
        },
        async transcribeText() {
            const hiddenCanvas = this.$refs.hiddenCanvas;
            const imageBase64 = hiddenCanvas.toDataURL("image/png").split(",")[1];

            try {
                const response = await axios.post(
                    "/classify",
                    { image: imageBase64 },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                this.result = {
                    lines: response.data.lines || [],
                };
            } catch (error) {
                console.error("Error transcribing text:", error);
                this.result = {
                    lines: ["Error processing image."],
                };
            }
        },
        updateCanvasSize() {
            const container = this.$el.querySelector('.canvas-container');
            const maxWidth = Math.min(container.clientWidth - 20, 560); // 20px for padding
            
            // Set canvas size based on container width
            this.canvasWidth = maxWidth;
            this.canvasHeight = maxWidth / 2; // Maintain 2:1 aspect ratio
            
            // Update hidden canvas size
            this.hiddenWidth = this.canvasWidth / this.SCALE_FACTOR;
            this.hiddenHeight = this.canvasHeight / this.SCALE_FACTOR;
            
            // Reinitialize canvases with new sizes
            this.$nextTick(() => {
                this.initCanvas(this.$refs.displayCanvas);
                this.initCanvas(this.$refs.hiddenCanvas);
            });
        },
    },
    mounted() {
        this.updateCanvasSize();
        window.addEventListener('resize', this.updateCanvasSize);
        this.initCanvas(this.$refs.displayCanvas);
        this.initCanvas(this.$refs.hiddenCanvas);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.updateCanvasSize);
    },
};
</script>

<style>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 10px;
}

.canvas-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

canvas {
    border: 2px solid #3498db;
    border-radius: 5px;
    background-color: white;
    touch-action: none;
    max-width: 100%;
}

.buttons {
    margin-top: 10px;
    display: flex;
    gap: 10px;
    width: 100%;
    justify-content: center;
}

button {
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
}

button:first-of-type {
    background-color: #e74c3c;
}

button:first-of-type:hover {
    background-color: #c0392b;
}

button:last-of-type {
    background-color: #3498db;
}

button:last-of-type:hover {
    background-color: #2980b9;
}

.result-box {
    width: 100%;
    margin-top: 20px;
    padding: 15px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-align: center;
}

.result-box h3 {
    margin: 0 0 10px;
    font-size: 1.1rem;
    color: #333;
}

@media (max-width: 600px) {
    .container {
        padding: 5px;
    }
    
    button {
        padding: 10px 20px;
        font-size: 0.9rem;
    }
    
    .result-box {
        padding: 10px;
    }
}
</style>