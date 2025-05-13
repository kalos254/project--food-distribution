document.addEventListener('DOMContentLoaded', () => {
    // Toggle button functionality
    const toggleBtn = document.querySelector('.toggle-btn');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }

    // Charts initialization
    async function initializeCharts() {
        try {
            const timeRange = document.getElementById('timeRange').value || 'month';
            const response = await fetch(`http://localhost:3002/api/relief/stats?timeRange=${timeRange}`);
            const data = await response.json();

            // Region Distribution Chart
            const regionCtx = document.getElementById('regionChart').getContext('2d');
            window.regionChart = new Chart(regionCtx, {
                type: 'doughnut',
                data: {
                    labels: data.regionData.map(item => item.region),
                    datasets: [{
                        data: data.regionData.map(item => item.total),
                        backgroundColor: [
                            '#2ecc71', '#3498db', '#9b59b6', 
                            '#f1c40f', '#e67e22', '#e74c3c'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right'
                        },
                        title: {
                            display: true,
                            text: 'Distribution by Region'
                        }
                    }
                }
            });

            // Monthly Distribution Chart
            const distributionCtx = document.getElementById('distributionChart').getContext('2d');
            window.distributionChart = new Chart(distributionCtx, {
                type: 'bar',
                data: {
                    labels: data.monthlyData.map(item => item.month),
                    datasets: [{
                        label: 'Food Distributed (kg)',
                        data: data.monthlyData.map(item => item.total),
                        backgroundColor: '#2ecc71',
                        borderColor: '#27ae60',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        },
                        x: {}
                    },
                    plugins: {
                        legend: {},
                        title: {
                            display: true,
                            text: 'Monthly Distribution'
                        }
                    }
                }
            });

        } catch (error) {
            console.error('Error loading charts:', error);
        }
    }

    // Initialize charts
    initializeCharts();

    // Time range change handler
    document.getElementById('timeRange').addEventListener('change', initializeCharts);

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);

    // Handle tooltip movement
    document.querySelectorAll('.nav-links li[data-tooltip]').forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            if (!document.querySelector('.sidebar').classList.contains('collapsed')) return;
            tooltip.textContent = item.getAttribute('data-tooltip');
            tooltip.style.display = 'block';
        });

        item.addEventListener('mousemove', (e) => {
            if (!document.querySelector('.sidebar').classList.contains('collapsed')) return;
            tooltip.style.left = e.pageX + 15 + 'px';
            tooltip.style.top = e.pageY + 'px';
        });

        item.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
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

// Recent Activities Data
const activities = [
    {
        type: 'distribution',
        icon: 'fa-truck',
        message: 'Distributed 500kg of food in Nairobi',
        time: '2 hours ago'
    },
    {
        type: 'request',
        icon: 'fa-file-alt',
        message: 'New food request submitted',
        time: '4 hours ago'
    },
    {
        type: 'inventory',
        icon: 'fa-box',
        message: 'Received 1000kg of maize',
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

// Request Data
const requests = [
    {
        id: 1,
        type: 'Maize',
        quantity: '1000kg',
        region: 'Nairobi',
        status: 'pending',
        date: '2025-03-17'
    },
    {
        id: 2,
        type: 'Beans',
        quantity: '500kg',
        region: 'Mombasa',
        status: 'approved',
        date: '2025-03-16'
    },
    {
        id: 3,
        type: 'Rice',
        quantity: '750kg',
        region: 'Kisumu',
        status: 'rejected',
        date: '2025-03-15'
    }
];

// Populate Requests List
function populateRequestsList() {
    const requestsList = document.querySelector('.requests-list');
    if (requestsList) {
        requestsList.innerHTML = requests.map(request => `
            <div class="request-item">
                <span class="request-status ${request.status}">${request.status}</span>
                <div class="request-content">
                    <h4>${request.type} - ${request.quantity}</h4>
                    <p>Region: ${request.region}</p>
                    <span class="request-date">${request.date}</span>
                </div>
                <div class="request-actions">
                    ${request.status === 'pending' ? `
                        <button class="btn btn-success btn-sm">Edit</button>
                        <button class="btn btn-danger btn-sm">Cancel</button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
}

// Initialize requests list when requests section is shown
document.querySelector('a[href="#requests"]').addEventListener('click', () => {
    populateRequestsList();
});

// New Request Button
document.getElementById('newRequest').addEventListener('click', () => {
    // This would typically open a modal or navigate to a new request form
    alert('Create new request feature will be implemented soon.');
});

// Request Status Filter
const requestStatus = document.getElementById('requestStatus');
if (requestStatus) {
    requestStatus.addEventListener('change', (e) => {
        const filterValue = e.target.value;
        // This would typically filter the requests list
        console.log('Filtering requests by status:', filterValue);
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
