<template>
    <div class="container">
        <div class="canvas-container">
            <canvas ref="displayCanvas" id="displayCanvas" width="560" height="280" @mousedown="startDrawing"
                @mousemove="draw" @mouseup="stopDrawing" @mouseleave="stopDrawing"></canvas>
            <canvas ref="hiddenCanvas" id="hiddenCanvas" width="280" height="140" style="display: none"></canvas>
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
            DISPLAY_WIDTH: 560,
            DISPLAY_HEIGHT: 280,
            HIDDEN_WIDTH: 280,
            HIDDEN_HEIGHT: 140,
            SCALE_FACTOR: 2,
        };
    },
    methods: {
        initCanvas(canvas) {
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = 10;
            ctx.lineCap = "round";
            ctx.strokeStyle = "black";
            return ctx;
        },
        clearCanvas() {
            const displayCtx = this.$refs.displayCanvas.getContext("2d");
            const hiddenCtx = this.$refs.hiddenCanvas.getContext("2d");

            displayCtx.fillStyle = "white";
            hiddenCtx.fillStyle = "white";

            displayCtx.fillRect(0, 0, this.DISPLAY_WIDTH, this.DISPLAY_HEIGHT);
            hiddenCtx.fillRect(0, 0, this.HIDDEN_WIDTH, this.HIDDEN_HEIGHT);

            // Reset the drawing styles
            displayCtx.lineWidth = 10;
            displayCtx.lineCap = "round";
            displayCtx.strokeStyle = "black";

            this.result = {
                lines: [],
            };
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

            // Clear hidden canvas
            hiddenCtx.fillStyle = "white";
            hiddenCtx.fillRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);

            // Scale down the entire display canvas to hidden canvas size
            hiddenCtx.drawImage(
                displayCanvas,
                0, 0, // Source x, y
                this.DISPLAY_WIDTH, this.DISPLAY_HEIGHT, // Source width and height
                0, 0, // Destination x, y
                this.HIDDEN_WIDTH, this.HIDDEN_HEIGHT // Destination width and height
            );
        },
        async transcribeText() {
            const hiddenCanvas = this.$refs.hiddenCanvas;

            // Convert the canvas to Base64
            const imageBase64 = hiddenCanvas.toDataURL("image/png").split(",")[1];

            try {
                // Send the Base64 image to the backend
                const response = await axios.post(
                    "/classify",
                    { image: imageBase64 },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                // Update result based on the response from the backend
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
    },
    mounted() {
        this.initCanvas(this.$refs.displayCanvas);
        this.initCanvas(this.$refs.hiddenCanvas);
    },
};
</script>

<style>
.container {
    display: flex;
    align-items: flex-start;
    gap: 20px;
}

.canvas-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

canvas {
    border: 2px solid #3498db;
    border-radius: 5px;
    background-color: white;
    width: 560px;
    height: 280px;
    image-rendering: pixelated;
}

canvas#displayCanvas {
    cursor: crosshair;
}

.buttons {
    margin-top: 5px;
}

button {
    padding: 8px 16px;
    font-size: 0.9rem;
    font-weight: bold;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 5px;
    transition: background-color 0.2s ease;
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
    padding: 15px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-align: center;
    min-width: 200px;
}

.result-box h3 {
    margin: 0 0 10px;
    font-size: 1.1rem;
    color: #333;
}

.result-box ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.result-box li {
    padding: 5px 0;
    color: #2c3e50;
    font-weight: 500;
}

.result-text {
    font-weight: bold;
    color: #3498db;
}
</style>
