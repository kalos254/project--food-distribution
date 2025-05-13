// Chart Colors
const chartColors = {
    primary: '#2c3e50',
    secondary: '#27ae60',
    accent: '#e67e22',
    danger: '#c0392b',
    text: '#2c3e50',
    background: 'rgba(44, 62, 80, 0.1)'
};

// Initialize Charts when Analytics section is active
function initializeCharts() {
    // Sales Overview Chart
    const salesCtx = document.getElementById('salesChart');
    if (!salesCtx) return;
    
    const salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Sales (KES)',
                data: [45000, 59000, 80000, 81000, 56000, 75000],
                borderColor: chartColors.primary,
                backgroundColor: chartColors.background,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Sales',
                    color: chartColors.text
                },
                legend: {
                    labels: {
                        color: chartColors.text
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: chartColors.text
                    },
                    grid: {
                        color: chartColors.background
                    }
                },
                x: {
                    ticks: {
                        color: chartColors.text
                    },
                    grid: {
                        color: chartColors.background
                    }
                }
            }
        }
    });

    // Product Performance Chart
    const productCtx = document.getElementById('productChart');
    if (!productCtx) return;
    
    const productChart = new Chart(productCtx, {
        type: 'doughnut',
        data: {
            labels: ['Maize', 'Wheat', 'Rice', 'Beans'],
            datasets: [{
                label: 'Sales by Product',
                data: [300, 250, 200, 150],
                backgroundColor: [
                    chartColors.primary,
                    chartColors.secondary,
                    chartColors.accent,
                    chartColors.danger
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Sales by Product',
                    color: chartColors.text
                },
                legend: {
                    labels: {
                        color: chartColors.text
                    }
                }
            }
        }
    });
}

// Navigation Handling
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.dashboard-section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            
            // Update active link
            navLinks.forEach(link => link.parentElement.classList.remove('active'));
            link.parentElement.classList.add('active');
            
            // Show target section, hide others
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.remove('hidden');
                    if (section.id === 'analytics') {
                        initializeCharts();
                    }
                } else {
                    section.classList.add('hidden');
                }
            });
        }
    });
});

// Product Data
const products = [
    {
        id: 1,
        name: 'Premium Maize',
        price: 2500,
        quantity: '1000kg',
        quality: 'Excellent',
        location: 'Nakuru',
        image: 'maize.jpg',
        seller: {
            name: 'John Farmer',
            phone: '+254 700 123456',
            email: 'john@farmer.com',
            avatar: 'seller-avatar.jpg'
        }
    },
    {
        id: 2,
        name: 'Grade A Wheat',
        price: 3000,
        quantity: '800kg',
        quality: 'Very Good',
        location: 'Narok',
        image: 'wheat.jpg',
        seller: {
            name: 'Jane Doe',
            phone: '+254 700 654321',
            email: 'jane@doe.com',
            avatar: 'seller-avatar2.jpg'
        }
    },
    {
        id: 3,
        name: 'Grade A Wheat',
        price: 2000,
        quantity: '800kg',
        quality: 'Very Good',
        location: 'Kisii',
        image: 'wheat.jpg',
        seller: {
            name: 'Mark Smith',
            phone: '+254 700 987654',
            email: 'mark@smith.com',
            avatar: 'seller-avatar3.jpg'
        }
    },
    {
        id: 4,
        name: 'Grade A Wheat',
        price: 2000,
        quantity: '800kg',
        quality: 'Very Good',
        location: 'Kisii',
        image: 'wheat.jpg',
        seller: {
            name: 'Lucy Brown',
            phone: '+254 700 123789',
            email: 'lucy@brown.com',
            avatar: 'seller-avatar4.jpg'
        }
    }
];

// Populate Product Grid
function populateProductGrid() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="seller-info">
                    <img src="${product.seller.avatar}" alt="${product.seller.name}" class="seller-avatar">
                    <span>${product.seller.name}</span>
                </div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price} KES per kg</p>
                <div class="product-meta">
                    <span>${product.quantity}</span>
                    <span>${product.location}</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-view" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn btn-contact" onclick="contactSeller(${product.id})">
                        <i class="fas fa-envelope"></i> Contact
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter Functionality
const filters = {
    product: document.getElementById('productFilter'),
    quality: document.getElementById('qualityFilter'),
    location: document.getElementById('locationFilter'),
    price: document.getElementById('priceFilter')
};

// Event Listeners
if (filters.product) {
    filters.product.addEventListener('change', filterProducts);
}
if (filters.quality) {
    filters.quality.addEventListener('change', filterProducts);
}
if (filters.location) {
    filters.location.addEventListener('change', filterProducts);
}
if (filters.price) {
    filters.price.addEventListener('change', filterProducts);
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltipElement = document.createElement('div');
            tooltipElement.className = 'tooltip';
            tooltipElement.textContent = tooltipText;
            this.appendChild(tooltipElement);
        });
        
        tooltip.addEventListener('mouseleave', function() {
            const tooltipElement = this.querySelector('.tooltip');
            if (tooltipElement) {
                tooltipElement.remove();
            }
        });
    });

    // Initialize product grid
    populateProductGrid();
});

// Product Management Functions
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Show edit modal with product data
    const modal = document.getElementById('editProductModal');
    if (modal) {
        modal.style.display = 'block';
        // Populate modal fields with product data
    }
}

function removeProduct(productId) {
    if (confirm('Are you sure you want to remove this product?')) {
        products = products.filter(p => p.id !== productId);
        populateProductGrid();
        populateInventoryTable();
    }
}

function addProduct(event) {
    event.preventDefault();
    const form = document.getElementById('addProductForm');
    const formData = new FormData(form);
    
    const newProduct = {
        id: products.length + 1,
        name: formData.get('productName'),
        price: parseFloat(formData.get('price')),
        quantity: `${formData.get('quantity')}${formData.get('unit')}`,
        quality: formData.get('quality'),
        location: formData.get('location'),
        image: 'default-product.jpg', // You can handle image upload separately
        seller: {
            name: "Your Business Name", // Get from user profile
            phone: "+254 700 123456", // Get from user profile
            email: "your@email.com", // Get from user profile
            avatar: 'seller-avatar.jpg'
        }
    };

    products.push(newProduct);
    populateProductGrid();
    populateInventoryTable();
    closeModal();
    form.reset();
}

function populateInventoryTable() {
    const inventoryTable = document.querySelector('.inventory-table tbody');
    if (!inventoryTable) return;

    inventoryTable.innerHTML = products.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td><span class="status-badge in-stock">In Stock</span></td>
            <td>${new Date().toISOString().split('T')[0]}</td>
            <td>
                <button class="btn-icon" onclick="editProduct(${product.id})" data-tooltip="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" onclick="removeProduct(${product.id})" data-tooltip="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Filter Products
function filterProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    const filteredProducts = products.filter(product => {
        const matchesProduct = !filters.product || 
            filters.product.value === '' || 
            product.name.toLowerCase().includes(filters.product.value.toLowerCase());
        
        const matchesQuality = !filters.quality || 
            filters.quality.value === '' || 
            product.quality.toLowerCase() === filters.quality.value.toLowerCase();
        
        const matchesLocation = !filters.location || 
            filters.location.value === '' || 
            product.location.toLowerCase() === filters.location.value.toLowerCase();
        
        return matchesProduct && matchesQuality && matchesLocation;
    });
    
    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="seller-info">
                    <img src="${product.seller.avatar}" alt="${product.seller.name}" class="seller-avatar">
                    <span>${product.seller.name}</span>
                </div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price} KES per kg</p>
                <div class="product-meta">
                    <span>${product.quantity}</span>
                    <span>${product.location}</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-view" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn btn-contact" onclick="contactSeller(${product.id})">
                        <i class="fas fa-envelope"></i> Contact
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Navigation Functions
function showSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId)?.classList.remove('hidden');
}

// Event Listeners
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('href').substring(1);
        showSection(sectionId);
    });
});

// Show default section (marketplace)
showSection('marketplace');

// Modal handling functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Add event listeners for modal close buttons
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers for all close buttons
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', closeModal);
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
});

// Add Product button
const addProductBtn = document.getElementById('addProduct');
const addProductModal = document.getElementById('addProductModal');

if (addProductBtn && addProductModal) {
    // Only show modal when button is clicked
    addProductBtn.addEventListener('click', () => {
        addProductModal.style.display = 'block';
    });

    // Close modal when clicking the close button
    const closeButtons = addProductModal.getElementsByClassName('close');
    Array.from(closeButtons).forEach(button => {
        button.addEventListener('click', () => {
            addProductModal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === addProductModal) {
            addProductModal.style.display = 'none';
        }
    });
}

// Add Product Form Submission
const addProductForm = document.getElementById('addProductForm');
if (addProductForm) {
    addProductForm.addEventListener('submit', addProduct);
}

// Initialize both marketplace and inventory
populateProductGrid();
populateInventoryTable();

// Add new functions for viewing product and contacting seller
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.querySelector('.modal-content').innerHTML = `
            <div class="modal-header">
                <h2>${product.name}</h2>
                <button class="close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <img src="${product.image}" alt="${product.name}" class="product-detail-image">
                <div class="product-details">
                    <p class="product-price">${product.price} KES per kg</p>
                    <p>Quantity: ${product.quantity}</p>
                    <p>Quality: ${product.quality}</p>
                    <p>Location: ${product.location}</p>
                    <div class="seller-details">
                        <h3>Seller Information</h3>
                        <p>${product.seller.name}</p>
                        <p>${product.seller.email}</p>
                        <p>${product.seller.phone}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

function contactSeller(productId) {
    const modal = document.getElementById('contactModal');
    modal.classList.add('active');
}
