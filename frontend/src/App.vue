<template>
  <div id="app">
    <header>
      <img src="./assets/digiterlogo.png" alt="Digiter Logo" class="logo" />
      <h1>DIGITER</h1>
    </header>
    <main>
      <canvasDrawing />
    </main>
  </div>
</template>

<script>
import canvasDrawing from "./components/canvasDrawing.vue";

export default {
  components: {
    canvasDrawing,
  },
};
</script>

<style>
/* General Styling */
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #333;
}

/* Header */
header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

header .logo {
  width: 80px;
  height: auto;
}

header h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  letter-spacing: 2px;
  margin-top: 5px;
}

/* Main Section */
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 25px;
}

main h2 {
  font-size: 1.5rem;
  color: white;
  margin-bottom: 10px;
}

/* Buttons */
button {
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
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

/* Canvas */
canvas {
  border: 2px solid #3498db;
  border-radius: 5px;
  background-color: white;
}
</style>
