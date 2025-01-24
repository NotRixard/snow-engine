  const canvas = document.getElementById('snowCanvas'); // Snow Script
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  /** Developer-Friendly Configuration **/
  const SNOWFLAKE_DENSITY = 5; // Adjust this number to increase or decrease snowfall density
  // Higher numbers mean more snowflakes, lower numbers mean fewer.
  
  let snowflakes = [];
  let targetSnowflakes = calculateMaxSnowflakes();
  let maxSnowflakes = targetSnowflakes;
  
  class Snowflake {
      constructor() {
          this.reset();
          this.opacity = 1; // Opacity starts fully visible
      }
  
      reset() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height - canvas.height; // Start slightly above the canvas
          this.radius = Math.random() * 2.5 + 1; // Adjusted size for variety
          this.speed = Math.random() * 1.5 + 0.5; // Adjusted speed for lighter snowfall
          this.wind = 0; // Reset wind
          this.opacity = 1; // Reset opacity when respawned
          this.stopped = false; // Tracks if the flake has stopped moving
      }
  
      update(wind) {
          if (!this.stopped) {
              // Normalize diagonal speed to keep it consistent
              const normalizedSpeed = this.speed / Math.sqrt(1 + wind ** 2);
  
              this.y += normalizedSpeed; // Fall speed
              this.x += wind * normalizedSpeed; // Wind effect
  
              // Stop movement if it reaches the bottom
              if (this.y >= canvas.height - this.radius) {
                  this.y = canvas.height - this.radius; // Pin to the bottom
                  this.stopped = true; // Snowflake has stopped falling
              }
  
              // Wrap horizontally while moving
              if (this.x > canvas.width) this.x = 0;
              else if (this.x < 0) this.x = canvas.width;
          }
  
          // Fade out at the bottom
          if (this.stopped) {
              this.opacity -= 0.01; // Gradual fade-out
          }
  
          // Respawn if fully transparent
          if (this.opacity <= 0) {
              this.reset();
          }
      }
  
      draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; // Adjust opacity
          ctx.fill();
          ctx.closePath();
      }
  }
  
  function calculateMaxSnowflakes() {
      return Math.floor((canvas.width * canvas.height) / 10000 * SNOWFLAKE_DENSITY);
  }
  
  function updateSnowflakeCountGradually() {
      if (snowflakes.length < targetSnowflakes) {
          // Add a few snowflakes per frame until reaching the target
          for (let i = 0; i < 10 && snowflakes.length < targetSnowflakes; i++) {
              snowflakes.push(new Snowflake());
          }
      } else if (snowflakes.length > targetSnowflakes) {
          // Remove a few snowflakes per frame until reaching the target
          snowflakes.splice(0, 10);
      }
  }
  
  let cursorX = canvas.width / 2; // Default cursor position is center of canvas
  
  window.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
  });
  
  window.addEventListener('resize', () => {
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;
  
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  
      // Recalculate the target number of snowflakes
      targetSnowflakes = calculateMaxSnowflakes();
  
      // Adjust existing snowflake positions proportionally
      snowflakes.forEach(flake => {
          flake.x = (flake.x / oldWidth) * canvas.width;
          flake.y = (flake.y / oldHeight) * canvas.height;
      });
  });
  
  function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Gradually adjust the snowflake count
      updateSnowflakeCountGradually();
  
      // Calculate wind direction based on cursor position
      const wind = (cursorX - canvas.width / 2) / canvas.width * 2; // Normalize to range [-1, 1]
  
      snowflakes.forEach(flake => {
          flake.update(wind);  // Pass wind value to each snowflake
          flake.draw();
      });
  
      requestAnimationFrame(animate);  // Keep the animation loop going
  }
  
  // Create initial snowflakes and start animation
  createSnowflakes();
  animate();
  
  function createSnowflakes() {
      snowflakes = [];
      for (let i = 0; i < maxSnowflakes; i++) {
          snowflakes.push(new Snowflake());
      }
  }
  
