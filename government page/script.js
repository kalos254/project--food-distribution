// Initialize Charts
document.addEventListener('DOMContentLoaded', async () => {
    // Region distribution data
    let regionData = {
        labels: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Others'],
        values: [120, 90, 70, 60, 50, 180]
    };

    // Monthly approvals data
    let approvalsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        values: [65, 59, 80, 81, 56, 85]
    };

    try {
        const response = await fetch('http://localhost:3001/api/government/stats');
        if (response.ok) {
            const data = await response.json();
            regionData = data.regionDistribution;
            approvalsData = data.monthlyApprovals;
        }
    } catch (error) {
        console.error('Error fetching chart data:', error);
    }

    // Common chart options
    Chart.defaults.font.family = "'Poppins', 'Helvetica', 'Arial', sans-serif";
    Chart.defaults.color = '#555';
    Chart.defaults.scale.grid.color = 'rgba(0, 0, 0, 0.05)';

    // Custom tooltip styles
    const customTooltip = {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#333',
        bodyColor: '#666',
        bodySpacing: 4,
        padding: 12,
        boxWidth: 10,
        usePointStyle: true,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1
    };

    // Region Distribution Chart
    const regionCtx = document.getElementById('regionChart').getContext('2d');
    const regionChart = new Chart(regionCtx, {
        type: 'bar',
        data: {
            labels: regionData.labels,
            datasets: [{
                label: 'Distribution Volume (tons)',
                data: regionData.values,
                backgroundColor: [
                    'rgba(241, 196, 15, 0.8)',
                    'rgba(243, 156, 18, 0.8)',
                    'rgba(230, 126, 34, 0.8)',
                    'rgba(211, 84, 0, 0.8)',
                    'rgba(192, 57, 43, 0.8)',
                    'rgba(169, 50, 38, 0.8)'
                ],
                borderColor: [
                    '#f1c40f',
                    '#f39c12',
                    '#e67e22',
                    '#d35400',
                    '#c0392b',
                    '#a93226'
                ],
                borderWidth: 1,
                borderRadius: 4,
                maxBarThickness: 35
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    ...customTooltip,
                    callbacks: {
                        label: (context) => `Volume: ${context.parsed.y.toLocaleString()} tons`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => value.toLocaleString() + ' tons'
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });

    // Monthly Approvals Chart
    const approvalsCtx = document.getElementById('approvalsChart').getContext('2d');
    const approvalsChart = new Chart(approvalsCtx, {
        type: 'line',
        data: {
            labels: approvalsData.labels,
            datasets: [{
                label: 'Approved Requests',
                data: approvalsData.values,
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#2ecc71',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#2ecc71',
                pointHoverBorderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    ...customTooltip,
                    callbacks: {
                        label: (context) => `Requests: ${context.parsed.y.toLocaleString()}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });

    // Update charts when time range changes
    const timeRange = document.getElementById('timeRange');
    timeRange.addEventListener('change', async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/government/stats?timeRange=${timeRange.value}`);
            if (response.ok) {
                const data = await response.json();
                
                // Update region chart
                regionChart.data.labels = data.regionDistribution.labels;
                regionChart.data.datasets[0].data = data.regionDistribution.values;
                regionChart.update('active');
                
                // Update approvals chart
                approvalsChart.data.labels = data.monthlyApprovals.labels;
                approvalsChart.data.datasets[0].data = data.monthlyApprovals.values;
                approvalsChart.update('active');
            }
        } catch (error) {
            console.error('Error updating chart data:', error);
        }
    });
});

// Toggle button functionality
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.toggle-btn');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }

    // Show default section
    showSection('overview');
});

// Sample Data
const sampleData = {
    // Pending Approvals
    pendingApprovals: [
        {
            id: "AP001",
            agency: "Red Cross Kenya",
            type: "Distribution Permit",
            location: "Nairobi County",
            date: "2025-03-15",
            status: "Pending",
            urgency: "High",
            details: "Emergency food distribution in informal settlements"
        },
        {
            id: "AP002",
            agency: "World Food Programme",
            type: "Storage Facility",
            location: "Mombasa County",
            date: "2025-03-16",
            status: "Under Review",
            urgency: "Medium",
            details: "New warehouse facility for grain storage"
        },
        {
            id: "AP003",
            agency: "CARE International",
            type: "Transport Permit",
            location: "Turkana County",
            date: "2025-03-17",
            status: "Pending",
            urgency: "High",
            details: "Emergency drought response transport"
        }
    ],

    // Monitoring Data
    monitoring: {
        distributions: [
            {
                id: "D001",
                agency: "Red Cross Kenya",
                location: "Kibera, Nairobi",
                date: "2025-03-18",
                beneficiaries: 2500,
                foodType: "Maize",
                quantity: "5000kg",
                status: "In Progress"
            },
            {
                id: "D002",
                agency: "World Food Programme",
                location: "Dadaab",
                date: "2025-03-17",
                beneficiaries: 5000,
                foodType: "Rice",
                quantity: "7500kg",
                status: "Completed"
            }
        ],
        qualityChecks: [
            {
                id: "QC001",
                facility: "Nairobi Central Warehouse",
                inspector: "John Kamau",
                date: "2025-03-18",
                status: "Passed",
                findings: "All standards met"
            },
            {
                id: "QC002",
                facility: "Mombasa Port Storage",
                inspector: "Sarah Ochieng",
                date: "2025-03-17",
                status: "Action Required",
                findings: "Temperature control needs adjustment"
            }
        ]
    },

    // Active Policies
    policies: [
        {
            id: "POL001",
            title: "Emergency Response Protocol",
            status: "Active",
            lastUpdated: "2025-02-01",
            category: "Emergency",
            description: "Guidelines for rapid response to food security emergencies",
            keyPoints: [
                "24-hour response timeline",
                "Simplified approval process",
                "Emergency resource allocation"
            ]
        },
        {
            id: "POL002",
            title: "Quality Control Standards",
            status: "Active",
            lastUpdated: "2025-01-15",
            category: "Quality",
            description: "Food safety and quality control requirements",
            keyPoints: [
                "Storage temperature requirements",
                "Transportation guidelines",
                "Inspection protocols"
            ]
        },
        {
            id: "POL003",
            title: "Distribution Guidelines",
            status: "Under Review",
            lastUpdated: "2025-03-10",
            category: "Distribution",
            description: "Standard operating procedures for food distribution",
            keyPoints: [
                "Beneficiary verification",
                "Fair distribution practices",
                "Record keeping requirements"
            ]
        }
    ],

    // Recent Activities
    recentActivities: [
        {
            type: "approval",
            title: "Distribution Permit Approved",
            agency: "Red Cross Kenya",
            timestamp: "2025-03-18T09:30:00",
            status: "completed"
        },
        {
            type: "inspection",
            title: "Warehouse Inspection",
            location: "Nakuru Central Store",
            timestamp: "2025-03-18T08:15:00",
            status: "in-progress"
        },
        {
            type: "policy",
            title: "New Policy Draft",
            description: "Drought Response Guidelines",
            timestamp: "2025-03-17T16:45:00",
            status: "pending"
        }
    ]
};

// Populate Pending Approvals
function populateApprovalsList() {
    const approvalsContainer = document.querySelector('#approvals .approvals-list');
    if (!approvalsContainer) return;

    approvalsContainer.innerHTML = sampleData.pendingApprovals.map(approval => `
        <div class="approval-card ${approval.urgency.toLowerCase()}">
            <div class="approval-header">
                <h4>${approval.type}</h4>
                <span class="status-badge ${approval.status.toLowerCase().replace(' ', '-')}">
                    ${approval.status}
                </span>
            </div>
            <div class="approval-body">
                <p><strong>Agency:</strong> ${approval.agency}</p>
                <p><strong>Location:</strong> ${approval.location}</p>
                <p><strong>Date:</strong> ${new Date(approval.date).toLocaleDateString()}</p>
                <p><strong>Details:</strong> ${approval.details}</p>
            </div>
            <div class="approval-actions">
                <button class="btn btn-success" onclick="approveRequest('${approval.id}')">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="btn btn-danger" onclick="rejectRequest('${approval.id}')">
                    <i class="fas fa-times"></i> Reject
                </button>
                <button class="btn btn-info" onclick="requestInfo('${approval.id}')">
                    <i class="fas fa-info-circle"></i> Request Info
                </button>
            </div>
        </div>
    `).join('');
}

// Populate Monitoring Data
function populateMonitoringData() {
    const distributionsContainer = document.querySelector('#monitoring .distributions-list');
    const qualityChecksContainer = document.querySelector('#monitoring .quality-checks-list');

    if (distributionsContainer) {
        distributionsContainer.innerHTML = sampleData.monitoring.distributions.map(dist => `
            <div class="monitoring-card">
                <div class="monitoring-header">
                    <h4>${dist.agency}</h4>
                    <span class="status-badge ${dist.status.toLowerCase().replace(' ', '-')}">
                        ${dist.status}
                    </span>
                </div>
                <div class="monitoring-body">
                    <p><strong>Location:</strong> ${dist.location}</p>
                    <p><strong>Date:</strong> ${new Date(dist.date).toLocaleDateString()}</p>
                    <p><strong>Beneficiaries:</strong> ${dist.beneficiaries.toLocaleString()}</p>
                    <p><strong>Food Type:</strong> ${dist.foodType}</p>
                    <p><strong>Quantity:</strong> ${dist.quantity}</p>
                </div>
                <div class="monitoring-actions">
                    <button class="btn btn-primary" onclick="viewDetails('${dist.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn btn-warning" onclick="flagIssue('${dist.id}')">
                        <i class="fas fa-flag"></i> Flag Issue
                    </button>
                </div>
            </div>
        `).join('');
    }

    if (qualityChecksContainer) {
        qualityChecksContainer.innerHTML = sampleData.monitoring.qualityChecks.map(check => `
            <div class="quality-check-card">
                <div class="check-header">
                    <h4>${check.facility}</h4>
                    <span class="status-badge ${check.status.toLowerCase().replace(' ', '-')}">
                        ${check.status}
                    </span>
                </div>
                <div class="check-body">
                    <p><strong>Inspector:</strong> ${check.inspector}</p>
                    <p><strong>Date:</strong> ${new Date(check.date).toLocaleDateString()}</p>
                    <p><strong>Findings:</strong> ${check.findings}</p>
                </div>
                <div class="check-actions">
                    <button class="btn btn-primary" onclick="viewReport('${check.id}')">
                        <i class="fas fa-file-alt"></i> View Report
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Populate Policies
function populatePolicies() {
    const policiesContainer = document.querySelector('#policies .policies-list');
    if (!policiesContainer) return;

    policiesContainer.innerHTML = sampleData.policies.map(policy => `
        <div class="policy-card">
            <div class="policy-header">
                <h4>${policy.title}</h4>
                <span class="status-badge ${policy.status.toLowerCase().replace(' ', '-')}">
                    ${policy.status}
                </span>
            </div>
            <div class="policy-body">
                <p><strong>Category:</strong> ${policy.category}</p>
                <p><strong>Last Updated:</strong> ${new Date(policy.lastUpdated).toLocaleDateString()}</p>
                <p><strong>Description:</strong> ${policy.description}</p>
                <div class="key-points">
                    <strong>Key Points:</strong>
                    <ul>
                        ${policy.keyPoints.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="policy-actions">
                <button class="btn btn-primary" onclick="viewPolicy('${policy.id}')">
                    <i class="fas fa-book-open"></i> View Full Policy
                </button>
                <button class="btn btn-secondary" onclick="editPolicy('${policy.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
        </div>
    `).join('');
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load map dependencies
    loadMapDependencies();
    
    // Initialize charts
    initializeCharts();
    
    // Populate all sections with sample data
    populateApprovalsList();
    populateMonitoringData();
    populatePolicies();
    
    // Add section visibility handlers
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                showSection(targetId);
                
                // Update data based on section
                switch(targetId) {
                    case 'approvals':
                        populateApprovalsList();
                        break;
                    case 'monitoring':
                        populateMonitoringData();
                        break;
                    case 'policies':
                        populatePolicies();
                        break;
                }
            }
        });
    });
});

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
                } else {
                    section.classList.add('hidden');
                }
            });
        }
    });
});

// Time Range Filter
const timeRange = document.getElementById('timeRange');
timeRange.addEventListener('change', () => {
    updateDashboardData(timeRange.value);
});

function updateDashboardData(timeRange) {
    // This function would typically fetch new data from the server
    console.log('Updating dashboard for time range:', timeRange);
}

// Recent Activities Data
const activities = [
    {
        type: 'approval',
        icon: 'fa-check-circle',
        message: 'Approved distribution request from Relief Agency A',
        time: '2 hours ago'
    },
    {
        type: 'policy',
        icon: 'fa-file-alt',
        message: 'Updated food safety guidelines',
        time: '4 hours ago'
    },
    {
        type: 'registration',
        icon: 'fa-user-plus',
        message: 'New relief agency registration pending approval',
        time: '6 hours ago'
    }
];

// Populate Activity List
function populateActivityList() {
    const activityList = document.querySelector('.activity-list');
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <p>${activity.message}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        </div>
    `).join('');
}

populateActivityList();

// Pending Approvals Data
const approvals = [
    {
        id: 1,
        type: 'distribution',
        agency: 'Relief Agency A',
        request: 'Food Distribution in Nairobi',
        date: '2025-03-17'
    },
    {
        id: 2,
        type: 'agency',
        agency: 'New Relief Organization',
        request: 'Agency Registration',
        date: '2025-03-16'
    },
    {
        id: 3,
        type: 'policy',
        agency: 'Internal',
        request: 'Update to Distribution Guidelines',
        date: '2025-03-15'
    }
];

// Populate Approvals List
function populateApprovalsList() {
    const approvalsList = document.querySelector('.approvals-list');
    if (approvalsList) {
        approvalsList.innerHTML = approvals.map(approval => `
            <div class="approval-item">
                <input type="checkbox" id="approval-${approval.id}">
                <span class="approval-type ${approval.type}">${approval.type}</span>
                <div class="approval-content">
                    <h4>${approval.request}</h4>
                    <p>Submitted by: ${approval.agency}</p>
                    <span class="approval-date">${approval.date}</span>
                </div>
                <div class="approval-actions">
                    <button class="btn btn-success btn-sm">Approve</button>
                    <button class="btn btn-danger btn-sm">Reject</button>
                </div>
            </div>
        `).join('');
    }
}

// Initialize approvals list when approvals section is shown
document.querySelector('a[href="#approvals"]').addEventListener('click', () => {
    populateApprovalsList();
});

// Handle Generate Report button
document.getElementById('generateReport').addEventListener('click', () => {
    // This would typically trigger a report generation process
    alert('Generating report... This feature will be implemented soon.');
});

// Filter Approvals
const approvalTypeFilter = document.getElementById('approvalType');
if (approvalTypeFilter) {
    approvalTypeFilter.addEventListener('change', (e) => {
        const filterValue = e.target.value;
        // This would typically filter the approvals list
        console.log('Filtering approvals by:', filterValue);
    });
}

// Mobile Navigation Toggle
const createMobileNav = () => {
    const sidebar = document.querySelector('.sidebar');
    
    // Create toggle button
    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    // Add toggle functionality
    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        toggle.querySelector('i').classList.toggle('fa-bars');
        toggle.querySelector('i').classList.toggle('fa-times');
    });
    
    // Add toggle button to header
    document.querySelector('.content-header').prepend(toggle);
};

// Initialize mobile navigation if screen is small
if (window.innerWidth <= 768) {
    createMobileNav();
}

// Handle window resize
window.addEventListener('resize', () => {
    const toggle = document.querySelector('.nav-toggle');
    if (window.innerWidth <= 768 && !toggle) {
        createMobileNav();
    } else if (window.innerWidth > 768 && toggle) {
        toggle.remove();
        document.querySelector('.sidebar').classList.remove('active');
    }
});

// Global variables
let map = null;
let heatLayer = null;

// Show active section and hide others
function showSection(sectionId) {
    // Hide all sections first
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
        section.classList.add('hidden');
    });

    // Show selected section
    const targetSection = document.getElementById(sectionId);
    targetSection.classList.remove('hidden');
    targetSection.classList.add('active');

    // Handle map initialization/cleanup
    if (sectionId === 'coverage-map') {
        if (!coverageMap) {
            initializeCoverageMap();
        } else {
            coverageMap.invalidateSize();
        }
    } else if (coverageMap) {
        // If switching away from coverage map, remove event listeners to prevent memory leaks
        document.getElementById('coverageProductFilter').removeEventListener('change', updateCoverageMap);
        document.getElementById('coverageTimeRange').removeEventListener('change', updateCoverageMap);
    }

    // Update navigation active state
    document.querySelectorAll('.nav-links li').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.nav-links a[href="#${sectionId}"]`).parentElement.classList.add('active');
}

// Initialize map
let coverageMap = null;
function initializeCoverageMap() {
    if (coverageMap) return; // Prevent multiple initializations

    // Create map centered on Kenya
    coverageMap = L.map('coverageMap').setView([-1.2921, 36.8219], 6);

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors'
    }).addTo(coverageMap);

    // Sample heat map data (latitude, longitude, intensity)
    const heatData = [
        [-1.2921, 36.8219, 0.8], // Nairobi
        [-4.0435, 39.6682, 0.6], // Mombasa
        [-0.1022, 34.7617, 0.7], // Kisumu
        [-0.3031, 36.0800, 0.5], // Nakuru
        [0.5143, 35.2698, 0.4],  // Eldoret
        [-3.3833, 38.5667, 0.3], // Voi
        [-0.7167, 37.1333, 0.4], // Embu
        [-1.5167, 37.2667, 0.6]  // Machakos
    ];

    // Create and add heat layer
    const heat = L.heatLayer(heatData, {
        radius: 35,
        blur: 25,
        maxZoom: 10,
        gradient: {
            0.2: '#7fdbda',
            0.4: '#2ecc71',
            0.6: '#27ae60',
            0.8: '#1a6d41'
        }
    }).addTo(coverageMap);

    // Add event listeners for filters
    document.getElementById('coverageProductFilter').addEventListener('change', updateCoverageMap);
    document.getElementById('coverageTimeRange').addEventListener('change', updateCoverageMap);

    // Force a resize to ensure proper rendering
    setTimeout(() => {
        coverageMap.invalidateSize();
    }, 100);
}

// Toggle map visibility
function toggleCoverageMap() {
    const mapContainer = document.getElementById('coverageMapContainer');
    const toggleButton = document.getElementById('toggleMap');
    const isHidden = mapContainer.classList.contains('hidden');

    if (isHidden) {
        mapContainer.classList.remove('hidden');
        toggleButton.innerHTML = '<i class="fas fa-times"></i> Hide Coverage Map';
        if (!coverageMap) {
            initializeCoverageMap();
        } else {
            coverageMap.invalidateSize();
        }
    } else {
        mapContainer.classList.add('hidden');
        toggleButton.innerHTML = '<i class="fas fa-map"></i> Show Coverage Map';
    }
}

// Show section and handle map initialization/cleanup
function showSection(sectionId) {
    // Hide all sections first
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
        section.classList.add('hidden');
    });

    // Show selected section
    const targetSection = document.getElementById(sectionId);
    targetSection.classList.remove('hidden');
    targetSection.classList.add('active');

    // Handle map initialization/cleanup
    if (sectionId === 'coverage-map') {
        // Add toggle button event listener
        const toggleButton = document.getElementById('toggleMap');
        if (toggleButton) {
            toggleButton.addEventListener('click', toggleCoverageMap);
        }
    } else {
        // If switching away from coverage map, cleanup
        if (coverageMap) {
            document.getElementById('coverageProductFilter').removeEventListener('change', updateCoverageMap);
            document.getElementById('coverageTimeRange').removeEventListener('change', updateCoverageMap);
            const toggleButton = document.getElementById('toggleMap');
            if (toggleButton) {
                toggleButton.removeEventListener('click', toggleCoverageMap);
            }
        }
    }

    // Update navigation active state
    document.querySelectorAll('.nav-links li').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.nav-links a[href="#${sectionId}"]`).parentElement.classList.add('active');
}

// Update coverage map based on filters
function updateCoverageMap() {
    const product = document.getElementById('coverageProductFilter').value;
    const timeRange = document.getElementById('coverageTimeRange').value;
    
    // In a real application, this would fetch new data from the server
    console.log(`Updating coverage map for ${product || 'all products'} in ${timeRange}`);
}

// Load map dependencies
function loadMapDependencies() {
    // Load Leaflet CSS
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    document.head.appendChild(leafletCSS);

    // Load Leaflet JS
    const leafletJS = document.createElement('script');
    leafletJS.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
    document.head.appendChild(leafletJS);

    // Load Heat plugin after Leaflet
    leafletJS.onload = function() {
        const heatJS = document.createElement('script');
        heatJS.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
        document.head.appendChild(heatJS);

        // Initialize map after dependencies are loaded
        heatJS.onload = function() {
            // Initialize map when coverage section is shown
            document.querySelector('.nav-links a[href="#coverage-map"]').addEventListener('click', () => {
                setTimeout(() => {
                    if (!coverageMap) {
                        initializeCoverageMap();
                    }
                    // Trigger a resize to ensure map renders correctly
                    coverageMap.invalidateSize();
                }, 100);
            });
        };
    };
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load map dependencies
    loadMapDependencies();
    
    // Initialize charts
    initializeCharts();
    
    // Populate all sections with sample data
    populateApprovalsList();
    populateMonitoringData();
    populatePolicies();
    
    // Add section visibility handlers
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                showSection(targetId);
                
                // Update data based on section
                switch(targetId) {
                    case 'approvals':
                        populateApprovalsList();
                        break;
                    case 'monitoring':
                        populateMonitoringData();
                        break;
                    case 'policies':
                        populatePolicies();
                        break;
                }
            }
        });
    });
});

// Initialize charts
function initializeCharts() {
    // Region Chart
    const regionCtx = document.getElementById('regionChart').getContext('2d');
    new Chart(regionCtx, {
        type: 'bar',
        data: {
            labels: ['Nairobi', 'Coast', 'Central', 'Eastern', 'Western', 'Nyanza', 'Rift Valley', 'North Eastern'],
            datasets: [{
                label: 'Distribution by Region (MT)',
                data: [25000, 18000, 15000, 20000, 12000, 16000, 22000, 8000],
                backgroundColor: '#2ecc71'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Approvals Chart
    const approvalsCtx = document.getElementById('approvalsChart').getContext('2d');
    new Chart(approvalsCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Approvals',
                data: [45, 52, 48, 58, 63, 68],
                borderColor: '#2ecc71',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Handle sidebar toggle
document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

// Handle clicks outside sidebar on mobile
document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

// Add resize handler
window.addEventListener('resize', () => {
    const mainContent = document.querySelector('.main-content');
    const sidebar = document.querySelector('.sidebar');
    
    if (window.innerWidth <= 1200) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    } else if (!sidebar.classList.contains('manually-collapsed')) {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
    }
});

// Update toggle click handler
document.querySelector('.toggle-btn').addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('manually-collapsed');
    sidebar.classList.toggle('collapsed');
    document.querySelector('.main-content').classList.toggle('expanded');
});

// Add tooltip cursor tracking
document.querySelectorAll('.nav-links li[data-label]').forEach(item => {
    item.addEventListener('mousemove', (e) => {
        if (!document.querySelector('.sidebar').classList.contains('collapsed')) return;
        
        const tooltip = item.querySelector('::before');
        if (tooltip) {
            const offset = 15; // Distance from cursor
            tooltip.style.left = e.clientX + offset + 'px';
            tooltip.style.top = e.clientY + offset + 'px';
        }
    });
});
