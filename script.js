
// Mock data for containers and items
const containers = [
  { 
    id: 'container1', 
    name: 'Main Storage', 
    location: 'Deck A',
    capacity: 1000,
    usedCapacity: 750
  },
  { 
    id: 'container2', 
    name: 'Secondary Storage', 
    location: 'Deck B',
    capacity: 800,
    usedCapacity: 400
  },
  { 
    id: 'container3', 
    name: 'Emergency Supplies', 
    location: 'Deck C',
    capacity: 500,
    usedCapacity: 475
  }
];

const items = [
  { 
    id: 'item1', 
    name: 'Water Container', 
    location: 'container1',
    priority: 'high', 
    weight: 25, 
    volume: 0.5,
    status: 'stored',
    usageCount: 0,
    lastModified: new Date(2023, 5, 15)
  },
  { 
    id: 'item2', 
    name: 'Food Package', 
    location: 'container1',
    priority: 'high', 
    weight: 15, 
    volume: 0.3,
    status: 'stored',
    usageCount: 2,
    lastModified: new Date(2023, 5, 20)
  },
  { 
    id: 'item3', 
    name: 'Medical Kit', 
    location: 'container2',
    priority: 'high', 
    weight: 5, 
    volume: 0.1,
    status: 'stored',
    usageCount: 1,
    lastModified: new Date(2023, 6, 1)
  },
  { 
    id: 'item4', 
    name: 'Tools', 
    location: 'container2',
    priority: 'medium', 
    weight: 30, 
    volume: 0.4,
    status: 'stored',
    usageCount: 5,
    lastModified: new Date(2023, 6, 5)
  },
  { 
    id: 'item5', 
    name: 'Spare Parts', 
    location: 'container3',
    priority: 'low', 
    weight: 40, 
    volume: 0.8,
    status: 'stored',
    usageCount: 0,
    lastModified: new Date(2023, 6, 10)
  }
];

// DOM Elements
const canvas = document.getElementById('cargo-canvas');
const containerSelect = document.getElementById('container-select');
const itemsCountBadge = document.getElementById('items-count');
const containersCountBadge = document.getElementById('containers-count');
const containerDetailsContent = document.getElementById('container-details-content');
const tabButtons = document.querySelectorAll('.tab-button');

// Canvas context
const ctx = canvas.getContext('2d');

// State variables
let selectedContainer = 'all';
let viewMode = '3d';

// Initialize the app
function init() {
  // Set canvas dimensions
  resizeCanvas();
  
  // Populate container select
  populateContainerSelect();
  
  // Set initial counts
  updateCountBadges();
  
  // Display initial container details
  updateContainerDetails();
  
  // Draw initial visualization
  drawVisualization();
  
  // Add event listeners
  addEventListeners();
}

// Resize canvas to fit container
function resizeCanvas() {
  const container = canvas.parentElement;
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
}

// Populate container select dropdown
function populateContainerSelect() {
  // Clear existing options except "All Containers"
  while (containerSelect.options.length > 1) {
    containerSelect.remove(1);
  }
  
  // Add container options
  containers.forEach(container => {
    const option = document.createElement('option');
    option.value = container.id;
    option.textContent = container.name;
    containerSelect.appendChild(option);
  });
}

// Update count badges
function updateCountBadges() {
  itemsCountBadge.textContent = `${items.length} Items`;
  containersCountBadge.textContent = `${containers.length} Containers`;
}

// Update container details panel
function updateContainerDetails() {
  if (selectedContainer === 'all') {
    containerDetailsContent.innerHTML = `
      <div class="all-containers-info">
        <p>All containers selected</p>
        <div class="all-containers-stats">
          <div class="stat-item">
            <p class="stat-label">Total Items</p>
            <p class="stat-value">${items.length}</p>
          </div>
          <div class="stat-item">
            <p class="stat-label">Containers</p>
            <p class="stat-value">${containers.length}</p>
          </div>
        </div>
      </div>
    `;
  } else {
    const container = containers.find(c => c.id === selectedContainer);
    if (container) {
      const percentage = (container.usedCapacity / container.capacity) * 100;
      let progressClass = 'green';
      if (percentage > 80) progressClass = 'red';
      else if (percentage > 50) progressClass = 'yellow';
      
      const containerItems = items.filter(item => item.location === container.id);
      
      containerDetailsContent.innerHTML = `
        <div class="container-detail-item">
          <div class="container-header">
            <h4 class="container-name">${container.name}</h4>
            <span class="capacity-badge">${container.usedCapacity}/${container.capacity}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill ${progressClass}" style="width: ${percentage}%"></div>
          </div>
          <div class="container-stats">
            <div class="stat-item">
              <p class="stat-label">Items</p>
              <p class="stat-value">${containerItems.length}</p>
            </div>
            <div class="stat-item">
              <p class="stat-label">Location</p>
              <p class="stat-value">${container.location}</p>
            </div>
          </div>
        </div>
      `;
    }
  }
}

// Draw visualization based on current state
function drawVisualization() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (viewMode === '3d') {
    drawSimplified3D();
  } else {
    drawSimplified2D();
  }
}

// Draw simplified 3D visualization
function drawSimplified3D() {
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const size = Math.min(width, height) * 0.4;
  
  // Draw grid
  drawGrid();
  
  // Save context state
  ctx.save();
  ctx.translate(centerX, centerY);
  
  // Simple box representation
  const faces = [
    { points: [[-size, -size], [size, -size], [size, size], [-size, size]], color: 'rgba(59, 130, 246, 0.2)', stroke: '#3B82F6' },
    { points: [[size, -size], [size * 1.3, -size * 0.7], [size * 1.3, size * 0.7], [size, size]], color: 'rgba(59, 130, 246, 0.3)', stroke: '#3B82F6' },
    { points: [[-size, -size], [size, -size], [size * 1.3, -size * 0.7], [-size * 0.7, -size * 1.3]], color: 'rgba(59, 130, 246, 0.4)', stroke: '#3B82F6' },
  ];
  
  faces.forEach(face => {
    ctx.beginPath();
    ctx.moveTo(face.points[0][0], face.points[0][1]);
    face.points.forEach((point, i) => {
      if (i > 0) ctx.lineTo(point[0], point[1]);
    });
    ctx.closePath();
    ctx.fillStyle = face.color;
    ctx.strokeStyle = face.stroke;
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
  });
  
  // Draw filtered items
  const itemsToShow = selectedContainer === 'all' ? 
    items : 
    items.filter(item => item.location === selectedContainer);
  
  const numItems = Math.min(itemsToShow.length, 8);
  
  for (let i = 0; i < numItems; i++) {
    const itemSize = size * 0.2;
    const x = (Math.random() * 1.6 - 0.8) * size * 0.8;
    const y = (Math.random() * 1.6 - 0.8) * size * 0.8;
    
    const priorityColors = {
      high: 'rgba(239, 68, 68, 0.8)',
      medium: 'rgba(245, 158, 11, 0.8)',
      low: 'rgba(16, 185, 129, 0.8)',
    };
    
    const itemPriority = itemsToShow[i]?.priority || 'medium';
    const color = priorityColors[itemPriority];
    
    ctx.fillStyle = color;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    
    ctx.fillRect(x - itemSize/2, y - itemSize/2, itemSize, itemSize);
    ctx.strokeRect(x - itemSize/2, y - itemSize/2, itemSize, itemSize);
  }
  
  // Restore context state
  ctx.restore();
}

// Draw simplified 2D visualization
function drawSimplified2D() {
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const size = Math.min(width, height) * 0.4;
  
  // Draw container outline
  ctx.beginPath();
  ctx.rect(centerX - size, centerY - size, size * 2, size * 2);
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw simple grid
  const sections = 4;
  for (let i = 1; i < sections; i++) {
    ctx.beginPath();
    ctx.moveTo(centerX - size, centerY - size + (size * 2 / sections) * i);
    ctx.lineTo(centerX + size, centerY - size + (size * 2 / sections) * i);
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.stroke();
  }
  
  // Filter items based on selected container
  const itemsToShow = selectedContainer === 'all' ? 
    items : 
    items.filter(item => item.location === selectedContainer);
  
  // Draw items as simple squares
  const numItems = Math.min(itemsToShow.length, 16);
  const itemWidth = (size * 2) / 4;
  const itemHeight = (size * 2) / 4;
  
  for (let i = 0; i < numItems; i++) {
    const col = i % 4;
    const row = Math.floor(i / 4);
    
    const x = centerX - size + col * itemWidth;
    const y = centerY - size + row * itemHeight;
    
    const priorityColors = {
      high: 'rgba(239, 68, 68, 0.8)',
      medium: 'rgba(245, 158, 11, 0.8)',
      low: 'rgba(16, 185, 129, 0.8)',
    };
    
    const itemPriority = itemsToShow[i]?.priority || 'medium';
    const color = priorityColors[itemPriority];
    
    ctx.fillStyle = color;
    ctx.fillRect(x + 4, y + 4, itemWidth - 8, itemHeight - 8);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(x + 4, y + 4, itemWidth - 8, itemHeight - 8);
  }
}

// Draw background grid
function drawGrid() {
  const width = canvas.width;
  const height = canvas.height;
  const gridSize = 30;
  
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  
  // Draw vertical lines
  for (let x = 0; x < width; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  
  // Draw horizontal lines
  for (let y = 0; y < height; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  
  ctx.stroke();
}

// Add event listeners
function addEventListeners() {
  // Container select change
  containerSelect.addEventListener('change', (e) => {
    selectedContainer = e.target.value;
    updateContainerDetails();
    drawVisualization();
  });
  
  // View mode tabs
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active tab
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update view mode
      viewMode = button.dataset.view;
      drawVisualization();
    });
  });
  
  // Window resize event
  window.addEventListener('resize', () => {
    resizeCanvas();
    drawVisualization();
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
