import { handleFormSubmit } from './forms.js';
import { redirectToRole } from './utils.js';

const roleRedirects = {
    'producer': '/producerandconsumer/index.html',
    'government': '/government/index.html',
    'relief': '/relief/index.html',
    'analyst': '/analyst/index.html'
};

export const redirectToRole = (role) => {
    window.location.href = roleRedirects[role] || '/';
};

export const handleFormSubmit = async (formElement, endpoint) => {
    const formData = new FormData(formElement);
    
    if (endpoint === 'register' && 
        formData.get('password') !== formData.get('confirmPassword')) {
        throw new Error('Passwords do not match!');
    }

    const response = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.fromEntries(formData))
    });
    
    if (!response.ok) {
        throw new Error(`${endpoint} failed`);
    }
    
    return formData.get('role');
};

document.addEventListener('DOMContentLoaded', function() {
    const elements = {
        loginBtn: document.getElementById('loginBtn'),
        registerBtn: document.getElementById('registerBtn'),
        loginModal: document.getElementById('loginModal'),
        registerModal: document.getElementById('registerModal'),
        closeBtns: document.querySelectorAll('.close'),
        loginForm: document.getElementById('loginForm'),
        registerForm: document.getElementById('registerForm'),
        registerRole: document.getElementById('registerRole'),
        govEmployeeNumberGroup: document.getElementById('govEmployeeNumberGroup')
    };

    // Modal handlers
    elements.loginBtn?.addEventListener('click', () => elements.loginModal.style.display = 'block');
    elements.registerBtn?.addEventListener('click', () => elements.registerModal.style.display = 'block');
    elements.closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.loginModal.style.display = 'none';
            elements.registerModal.style.display = 'none';
        });
    });

    // Role selection handler
    elements.registerRole?.addEventListener('change', function() {
        elements.govEmployeeNumberGroup.style.display = 
            this.value === 'government' ? 'block' : 'none';
    });

    // Form submission handlers
    elements.loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const role = await handleFormSubmit(e.target, 'login');
            redirectToRole(role);
        } catch (error) {
            alert(error.message);
        }
    });

    elements.registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const role = await handleFormSubmit(e.target, 'register');
            redirectToRole(role);
        } catch (error) {
            alert(error.message);
        }
    });
});