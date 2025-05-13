// DOM Elements
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const roleOptions = document.querySelectorAll('.role-option');
const selectedRoleInput = document.getElementById('selectedRole');
const govEmployeeNumberContainer = document.getElementById('govEmployeeNumberContainer');
const termsLink = document.getElementById('termsLink');
const termsModal = document.getElementById('termsModal');
const closeModal = document.querySelector('.close');
const acceptTerms = document.getElementById('acceptTerms');
const termsCheckbox = document.getElementById('terms');
const messageContainer = document.getElementById('messageContainer');
const regionSelect = document.getElementById('region');

// Kenya Counties
const counties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa', 'Homa Bay',
    'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii',
    'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
    'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi',
    'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita Taveta', 'Tana River',
    'Tharaka Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

// Populate counties dropdown (only on registration page)
if (regionSelect) {
    counties.sort().forEach(county => {
        const option = document.createElement('option');
        option.value = county.toLowerCase().replace(/\s+/g, '-');
        option.textContent = county;
        regionSelect.appendChild(option);
    });
}

// Role Selection (only on registration page)
roleOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove selected class from all options
        roleOptions.forEach(opt => opt.classList.remove('selected'));
        // Add selected class to clicked option
        option.classList.add('selected');
        // Update hidden input value
        selectedRoleInput.value = option.dataset.role;
        
        // Show/hide government employee number field
        const govEmployeeNumberContainer = document.getElementById('govEmployeeNumberContainer');
        if (govEmployeeNumberContainer) {
            govEmployeeNumberContainer.style.display = option.dataset.role === 'government' ? 'block' : 'none';
        }
    });
});

// Terms Modal
if (termsLink) {
    termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (termsModal) {
            termsModal.style.display = 'block';
        }
    });
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        if (termsModal) {
            termsModal.style.display = 'none';
        }
    });
}

if (acceptTerms) {
    acceptTerms.addEventListener('click', () => {
        if (termsCheckbox) {
            termsCheckbox.checked = true;
        }
        if (termsModal) {
            termsModal.style.display = 'none';
        }
    });
}

window.addEventListener('click', (e) => {
    if (e.target === termsModal) {
        termsModal.style.display = 'none';
    }
});

// Show Message
function showMessage(message, type) {
    const container = document.getElementById('messageContainer');
    container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}

// Add styles for alerts
const style = document.createElement('style');
style.textContent = `
    .alert {
        padding: 12px;
        border-radius: 4px;
        margin-bottom: 16px;
    }
    .alert-success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    .alert-danger {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
`;
document.head.appendChild(style);

// DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // Function to check if we're on the registration page
    const isRegistrationPage = document.getElementById('registerForm') !== null;
    // Function to check if we're on the login page
    const isLoginPage = document.getElementById('loginForm') !== null;

    // Password strength checker
    function checkPasswordStrength(password) {
        // Only proceed if we're on the registration page
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthBar || !strengthText) return;

        let strength = 0;
        const indicators = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };

        strength = Object.values(indicators).filter(Boolean).length;

        // Update strength bar
        switch(strength) {
            case 0:
            case 1:
                strengthBar.style.width = '20%';
                strengthBar.style.backgroundColor = 'var(--danger-color)';
                strengthText.textContent = 'Weak';
                break;
            case 2:
            case 3:
                strengthBar.style.width = '50%';
                strengthBar.style.backgroundColor = 'var(--warning-color)';
                strengthText.textContent = 'Medium';
                break;
            case 4:
            case 5:
                strengthBar.style.width = '100%';
                strengthBar.style.backgroundColor = 'var(--success-color)';
                strengthText.textContent = 'Strong';
                break;
        }
    }

    // Password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(icon => {
        if (icon) {
            icon.addEventListener('click', function() {
                const input = this.previousElementSibling;
                if (input) {
                    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                    input.setAttribute('type', type);
                    this.classList.toggle('bxs-show');
                    this.classList.toggle('bxs-hide');
                }
            });
        }
    });

    // Registration form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', function() {
                checkPasswordStrength(this.value);
            });
        }

        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Password validation
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                document.getElementById('messageContainer').innerHTML = `
                    <div class="alert alert-danger">Passwords do not match!</div>
                `;
                return;
            }
            
            try {
                // Get form data
                const formData = new FormData(this);
                const data = {
                    fullName: formData.get('fullName'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    role: formData.get('role'),
                    region: formData.get('region'),
                    govEmployeeNumber: formData.get('govEmployeeNumber') || null
                };

                // Show loading state
                const submitButton = this.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.textContent = 'Registering...';

                const response = await fetch('http://localhost:3002/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Registration failed');
                }

                // Handle successful registration
                const redirectUrls = {
                    producer: '../producerandconsumer/index.html',
                    government: '../government page/index.html',
                    relief: '../relief agencies/index.html',
                    analyst: '../analyst page/index.html'
                };

                // Show success message and redirect
                document.getElementById('messageContainer').innerHTML = `
                    <div class="alert alert-success">Registration successful! Redirecting...</div>
                `;

                setTimeout(() => {
                    window.location.href = redirectUrls[data.role] || '../index.html';
                }, 1500);

            } catch (error) {
                // Show error message
                document.getElementById('messageContainer').innerHTML = `
                    <div class="alert alert-danger">${error.message}</div>
                `;
            } finally {
                // Reset button state
                const submitButton = this.querySelector('button[type="submit"]');
                submitButton.disabled = false;
                submitButton.textContent = 'Register';
            }
        });
    }

    // Login form handler
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = document.querySelector('button[type="submit"]');
            const messageContainer = document.getElementById('messageContainer');
            
            try {
                submitButton.disabled = true;
                messageContainer.innerHTML = '<div class="alert alert-info">Logging in...</div>';

                const formData = {
                    email: document.getElementById('email').value.trim(),
                    password: document.getElementById('password').value,
                    role: document.getElementById('role').value.toLowerCase()
                };

                console.log('Sending login request:', {
                    email: formData.email,
                    role: formData.role
                });

                const response = await fetch('http://localhost:3002/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();
                console.log('Server response:', data);

                if (!response.ok) {
                    throw new Error(data.message || 'Login failed');
                }

                messageContainer.innerHTML = `
                    <div class="alert alert-success">
                        Welcome back! Redirecting to ${data.user.role} dashboard...
                    </div>
                `;

                // Store user data
                sessionStorage.setItem('user', JSON.stringify(data.user));
                sessionStorage.setItem('token', data.token);

                // Redirect after delay
                setTimeout(() => {
                    window.location.href = data.redirectUrl;
                }, 1500);

            } catch (error) {
                console.error('Login error:', error);
                messageContainer.innerHTML = `
                    <div class="alert alert-danger">${error.message}</div>
                `;
            } finally {
                submitButton.disabled = false;
            }
        });
    }
});
