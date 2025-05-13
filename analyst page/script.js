// Global variables for map
let map = null;
let heatLayer = null;

// Sample distribution data for Kenya's major cities and regions
const baseDistributionData = {
    maize: [
        { lat: -1.2921, lng: 36.8219, value: 100 }, // Nairobi
        { lat: -4.0435, lng: 39.6682, value: 85 },  // Mombasa
        { lat: 0.5143, lng: 35.2698, value: 75 },   // Eldoret
        { lat: -0.1022, lng: 34.7617, value: 90 },  // Kisumu
        { lat: -0.3031, lng: 36.0800, value: 80 }   // Nakuru
    ],
    wheat: [
        { lat: 0.5143, lng: 35.2698, value: 95 },   // Eldoret
        { lat: -0.3031, lng: 36.0800, value: 85 },  // Nakuru
        { lat: -1.2921, lng: 36.8219, value: 70 },  // Nairobi
        { lat: 0.0500, lng: 37.6500, value: 80 },   // Meru
        { lat: 0.3333, lng: 37.5833, value: 75 }    // Nanyuki
    ],
    rice: [
        { lat: -4.0435, lng: 39.6682, value: 90 },  // Mombasa
        { lat: -3.2333, lng: 40.1000, value: 85 },  // Malindi
        { lat: -1.2921, lng: 36.8219, value: 75 },  // Nairobi
        { lat: -0.1022, lng: 34.7617, value: 70 },  // Kisumu
        { lat: -0.4547, lng: 39.6658, value: 80 }   // Garissa
    ],
    beans: [
        { lat: -0.1022, lng: 34.7617, value: 95 },  // Kisumu
        { lat: 0.2827, lng: 34.7519, value: 90 },   // Kakamega
        { lat: -0.6698, lng: 34.7675, value: 85 },  // Kisii
        { lat: -1.2921, lng: 36.8219, value: 80 },  // Nairobi
        { lat: -0.3031, lng: 36.0800, value: 75 }   // Nakuru
    ],
    sorghum: [
        { lat: -0.4547, lng: 39.6658, value: 90 },  // Garissa
        { lat: 3.1167, lng: 35.6000, value: 85 },   // Lodwar
        { lat: -3.3833, lng: 38.5667, value: 80 },  // Voi
        { lat: -1.2921, lng: 36.8219, value: 70 },  // Nairobi
        { lat: -4.0435, lng: 39.6682, value: 75 }   // Mombasa
    ],
    millet: [
        { lat: 3.1167, lng: 35.6000, value: 95 },   // Lodwar
        { lat: -0.4547, lng: 39.6658, value: 90 },  // Garissa
        { lat: -3.3833, lng: 38.5667, value: 85 },  // Voi
        { lat: -1.2921, lng: 36.8219, value: 75 },  // Nairobi
        { lat: 0.5143, lng: 35.2698, value: 80 }    // Eldoret
    ]
};

// Initialize map
function initializeMap() {
    if (map) return; // Map already initialized

    // Initialize the map centered on Kenya
    map = L.map('coverage', {
        center: [-0.0236, 37.9062],
        zoom: 7,
        minZoom: 6,
        maxZoom: 10
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors'
    }).addTo(map);

    // Create heat layer with initial data
    updateHeatMap();

    // Add event listeners for filters
    document.getElementById('productFilter').addEventListener('change', updateHeatMap);
    document.getElementById('timeRange').addEventListener('change', updateHeatMap);
}

// Update heat layer with filtered data
function updateHeatMap() {
    const productFilter = document.getElementById('productFilter').value;
    const timeRange = document.getElementById('timeRange').value;

    // Get base data based on product filter
    let data = [];
    if (productFilter && baseDistributionData[productFilter]) {
        data = baseDistributionData[productFilter];
    } else {
        // Combine all products for "All Products" view
        data = Object.values(baseDistributionData).flat();
    }

    // Apply time range multiplier
    const multiplier = {
        'today': 0.5,
        'week': 0.7,
        'month': 1.0,
        'year': 1.2
    }[timeRange];

    // Adjust data based on time range
    const adjustedData = data.map(point => ({
        lat: point.lat,
        lng: point.lng,
        value: point.value * multiplier
    }));

    // Update heat layer
    if (heatLayer && map.hasLayer(heatLayer)) {
        map.removeLayer(heatLayer);
    }

    const points = adjustedData.map(point => [
        point.lat,
        point.lng,
        point.value
    ]);

    heatLayer = L.heatLayer(points, {
        radius: 30,
        blur: 20,
        maxZoom: 10,
        max: 100,
        gradient: {
            0.4: '#7fdbda',
            0.6: '#2ecc71',
            0.8: '#27ae60',
            1.0: '#1a6d41'
        }
    }).addTo(map);
}

// Initialize all charts
function initializeCharts() {
    // Region Distribution Chart
    const regionCtx = document.getElementById('regionChart').getContext('2d');
    new Chart(regionCtx, {
        type: 'bar',
        data: {
            labels: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Others'],
            datasets: [{
                label: 'Distribution Amount (kg)',
                data: [25000, 20000, 18000, 15000, 12000, 35000],
                backgroundColor: '#3498db'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });

    // Monthly Trend Chart
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Distribution (kg)',
                data: [95000, 88000, 105000, 112000, 118000, 125000],
                borderColor: '#2ecc71',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });

    // Distribution Chart
    const distributionCtx = document.getElementById('distributionChart').getContext('2d');
    new Chart(distributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Maize', 'Wheat', 'Rice', 'Beans', 'Others'],
            datasets: [{
                data: [40, 25, 15, 12, 8],
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#e74c3c',
                    '#f1c40f',
                    '#95a5a6'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}

// Sample distribution data
const distributionData = [
    {
        id: 'D001',
        location: 'Kibera, Nairobi',
        product: 'Maize',
        quantity: '5000kg',
        beneficiaries: 2500,
        status: 'In Progress',
        progress: 65
    },
    {
        id: 'D002',
        location: 'Mombasa Central',
        product: 'Rice',
        quantity: '3000kg',
        beneficiaries: 1500,
        status: 'Scheduled',
        progress: 0
    },
    {
        id: 'D003',
        location: 'Kisumu West',
        product: 'Wheat',
        quantity: '4000kg',
        beneficiaries: 2000,
        status: 'Completed',
        progress: 100
    }
];

// Sample reports data
const reportsData = [
    {
        id: 'R001',
        title: 'Monthly Distribution Summary',
        type: 'Distribution',
        date: '2025-03-15',
        status: 'Complete'
    },
    {
        id: 'R002',
        title: 'Q1 Coverage Analysis',
        type: 'Coverage',
        date: '2025-03-10',
        status: 'Complete'
    },
    {
        id: 'R003',
        title: 'Impact Assessment Report',
        type: 'Impact',
        date: '2025-03-05',
        status: 'Complete'
    }
];

// Populate distribution items
function populateDistributions() {
    const container = document.querySelector('.distribution-items');
    if (!container) return;

    container.innerHTML = distributionData.map(dist => `
        <div class="distribution-item">
            <div class="distribution-header">
                <h4>${dist.location}</h4>
                <span class="status-badge ${dist.status.toLowerCase().replace(' ', '-')}">
                    ${dist.status}
                </span>
            </div>
            <div class="distribution-details">
                <p><strong>Product:</strong> ${dist.product}</p>
                <p><strong>Quantity:</strong> ${dist.quantity}</p>
                <p><strong>Beneficiaries:</strong> ${dist.beneficiaries.toLocaleString()}</p>
            </div>
            <div class="progress-bar">
                <div class="progress" style="width: ${dist.progress}%"></div>
            </div>
        </div>
    `).join('');
}

// Populate recent reports
function populateReports() {
    const container = document.querySelector('.report-list');
    if (!container) return;

    container.innerHTML = reportsData.map(report => `
        <div class="report-item">
            <div class="report-info">
                <h4>${report.title}</h4>
                <p>${report.type} Report • ${new Date(report.date).toLocaleDateString()}</p>
            </div>
            <div class="report-actions">
                <button class="btn-secondary" onclick="downloadReport('${report.id}')">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        </div>
    `).join('');
}

// Navigation handling
function showSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');

    document.querySelectorAll('.nav-links li').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.nav-links a[href="#${sectionId}"]`).parentElement.classList.add('active');
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize charts
    initializeCharts();
    
    // Populate data
    populateDistributions();
    populateReports();
    
    // Handle navigation
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                showSection(targetId);
            }
        });
    });

    // Show overview section by default
    showSection('overview');
    
    // Initialize map
    initializeMap();
    
    // Initialize prediction module
    initializePredictionModule();
});

// Prediction Support Module
let predictionChart = null;

// Sample data for predictions
const sampleData = {
    distribution: {
        data: [
            { month: '2024-03', value: 125000 },
            { month: '2024-04', value: 132500 },
            { month: '2024-05', value: 128000 },
            { month: '2024-06', value: 145000 },
            { month: '2024-07', value: 150000 },
            { month: '2024-08', value: 148000 },
            { month: '2024-09', value: 155000 },
            { month: '2024-10', value: 160000 },
            { month: '2024-11', value: 158000 },
            { month: '2024-12', value: 165000 },
            { month: '2025-01', value: 170000 },
            { month: '2025-02', value: 175000 }
        ],
        unit: 'kg',
        growthFactors: {
            seasonal: [1.05, 0.95, 1.02, 1.08, 1.03, 0.98, 1.05, 1.03, 0.99, 1.04, 1.03, 1.03],
            trend: 1.02 // 2% base growth per month
        }
    },
    beneficiaries: {
        data: [
            { month: '2024-03', value: 42000 },
            { month: '2024-04', value: 43500 },
            { month: '2024-05', value: 43000 },
            { month: '2024-06', value: 45000 },
            { month: '2024-07', value: 46500 },
            { month: '2024-08', value: 46000 },
            { month: '2024-09', value: 48000 },
            { month: '2024-10', value: 49500 },
            { month: '2024-11', value: 49000 },
            { month: '2024-12', value: 51000 },
            { month: '2025-01', value: 52500 },
            { month: '2025-02', value: 53000 }
        ],
        unit: 'people',
        growthFactors: {
            seasonal: [1.03, 0.99, 1.00, 1.05, 1.03, 0.99, 1.04, 1.03, 0.99, 1.04, 1.03, 1.01],
            trend: 1.015 // 1.5% base growth per month
        }
    },
    coverage: {
        data: [
            { month: '2024-03', value: 28 },
            { month: '2024-04', value: 28 },
            { month: '2024-05', value: 29 },
            { month: '2024-06', value: 29 },
            { month: '2024-07', value: 30 },
            { month: '2024-08', value: 30 },
            { month: '2024-09', value: 31 },
            { month: '2024-10', value: 31 },
            { month: '2024-11', value: 32 },
            { month: '2024-12', value: 32 },
            { month: '2025-01', value: 33 },
            { month: '2025-02', value: 33 }
        ],
        unit: 'counties',
        growthFactors: {
            seasonal: [1.00, 1.00, 1.03, 1.00, 1.03, 1.00, 1.03, 1.00, 1.03, 1.00, 1.03, 1.00],
            trend: 1.01 // 1% base growth per month
        }
    }
};

function initializePredictionModule() {
    const toggleBtn = document.getElementById('togglePrediction');
    const predictionModule = document.querySelector('.prediction-module');
    const generateBtn = document.getElementById('generatePrediction');
    const metricSelect = document.getElementById('predictionMetric');
    const periodSelect = document.getElementById('predictionPeriod');

    // Toggle module visibility
    toggleBtn.addEventListener('click', () => {
        predictionModule.classList.toggle('minimized');
        toggleBtn.classList.toggle('minimized');
    });

    // Generate prediction when button is clicked
    generateBtn.addEventListener('click', () => {
        generatePredictions(metricSelect.value, parseInt(periodSelect.value));
    });

    // Initialize prediction chart
    const ctx = document.getElementById('predictionChart').getContext('2d');
    predictionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

async function generatePredictions(metric, months) {
    // Use sample data instead of API call
    const historicalData = sampleData[metric].data.map((item, index) => [index, item.value]);
    
    // Generate regression model
    const result = regression.linear(historicalData);

    // Generate predictions with seasonal and trend adjustments
    const predictions = generateFuturePredictions(result, months, metric);

    // Update chart with formatted labels
    updatePredictionChart(historicalData, predictions, metric);

    // Generate insights
    generateInsights(historicalData, predictions, metric);
}

function generateFuturePredictions(regressionResult, months, metric) {
    const predictions = [];
    const lastDataPoint = regressionResult.points[regressionResult.points.length - 1];
    const growthFactors = sampleData[metric].growthFactors;
    
    for (let i = 1; i <= months; i++) {
        const x = lastDataPoint[0] + i;
        let baseValue = regressionResult.predict(x)[1];
        
        // Apply seasonal and trend factors
        const seasonalIndex = (x % 12);
        const seasonalFactor = growthFactors.seasonal[seasonalIndex];
        const trendFactor = Math.pow(growthFactors.trend, i);
        
        // Adjust prediction with seasonal and trend factors
        const adjustedValue = baseValue * seasonalFactor * trendFactor;
        
        predictions.push({
            x: x,
            y: adjustedValue
        });
    }
    
    return predictions;
}

function updatePredictionChart(historicalData, predictions, metric) {
    const metricData = sampleData[metric];
    const labels = [
        ...metricData.data.map(d => d.month),
        ...predictions.map((_, i) => {
            const lastDate = new Date(metricData.data[metricData.data.length - 1].month);
            lastDate.setMonth(lastDate.getMonth() + i + 1);
            return lastDate.toISOString().slice(0, 7);
        })
    ];

    const historicalValues = historicalData.map(d => d[1]);
    const predictionValues = predictions.map(p => p.y);

    predictionChart.data = {
        labels: labels,
        datasets: [
            {
                label: 'Historical Data',
                data: [...historicalValues, ...Array(predictions.length).fill(null)],
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                fill: true
            },
            {
                label: 'Predictions',
                data: [...Array(historicalValues.length).fill(null), ...predictionValues],
                borderColor: '#3498db',
                borderDash: [5, 5],
                fill: false
            }
        ]
    };

    predictionChart.options.scales.y.title = {
        display: true,
        text: metricData.unit
    };

    predictionChart.update();
}

function generateInsights(historicalData, predictions, metric) {
    const insightsList = document.getElementById('predictionInsights');
    const metricData = sampleData[metric];
    const lastHistorical = historicalData[historicalData.length - 1][1];
    const lastPrediction = predictions[predictions.length - 1].y;
    const growth = ((lastPrediction - lastHistorical) / lastHistorical) * 100;

    // Calculate seasonality impact
    const seasonalityImpact = calculateSeasonalityImpact(metricData.growthFactors.seasonal);
    
    // Calculate trend strength
    const trendStrength = calculateTrendStrength(historicalData);

    const insights = [
        `Predicted ${growth > 0 ? 'increase' : 'decrease'} of ${Math.abs(growth).toFixed(1)}% in ${metric} (${metricData.unit})`,
        `Average monthly change: ${calculateAverageChange(predictions).toFixed(1)}%`,
        `Seasonality Impact: ${seasonalityImpact}`,
        `Trend Strength: ${trendStrength}`,
        `Confidence level: ${calculateConfidenceLevel(historicalData, predictions)}%`
    ];

    insightsList.innerHTML = insights.map(insight => `<li>${insight}</li>`).join('');
}

function calculateSeasonalityImpact(seasonalFactors) {
    const variation = Math.max(...seasonalFactors) - Math.min(...seasonalFactors);
    if (variation > 0.1) return 'High seasonal variation';
    if (variation > 0.05) return 'Moderate seasonal variation';
    return 'Low seasonal variation';
}

function calculateTrendStrength(data) {
    const values = data.map(d => d[1]);
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const change = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
    
    if (Math.abs(change) > 15) return 'Strong trend';
    if (Math.abs(change) > 5) return 'Moderate trend';
    return 'Weak trend';
}

function calculateAverageChange(predictions) {
    let totalChange = 0;
    for (let i = 1; i < predictions.length; i++) {
        const change = ((predictions[i].y - predictions[i-1].y) / predictions[i-1].y) * 100;
        totalChange += change;
    }
    return totalChange / (predictions.length - 1);
}

function calculateConfidenceLevel(historicalData, predictions) {
    // Simple confidence calculation based on data consistency
    // In a real application, this would use more sophisticated statistical methods
    return Math.min(95, 70 + (historicalData.length * 2));
}

// Prediction module toggle
document.addEventListener('DOMContentLoaded', () => {
    const togglePrediction = document.getElementById('togglePrediction');
    const predictionContent = document.querySelector('.prediction-content');
    
    if (togglePrediction && predictionContent) {
        togglePrediction.addEventListener('click', () => {
            predictionContent.classList.toggle('collapsed');
            togglePrediction.classList.toggle('collapsed');
        });
    }
});
