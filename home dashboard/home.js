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

    // Show/hide modals
    elements.loginBtn?.addEventListener('click', () => elements.loginModal.style.display = 'block');
    elements.registerBtn?.addEventListener('click', () => elements.registerModal.style.display = 'block');
    
    elements.closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.loginModal.style.display = 'none';
            elements.registerModal.style.display = 'none';
        });
    });

    // Handle role selection in registration
    elements.registerRole?.addEventListener('change', function() {
        elements.govEmployeeNumberGroup.style.display = 
            this.value === 'government' ? 'block' : 'none';
    });

    // Handle form submissions
    const handleFormSubmit = async (formElement, endpoint, formType) => {
        const formData = new FormData(formElement);
        
        if (formType === 'register' && 
            formData.get('password') !== formData.get('confirmPassword')) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch(`/api/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });
            
            if (response.ok) {
                const roleRedirects = {
                    'producer': '/producerandconsumer/index.html',
                    'government': '/government/index.html',
                    'relief': '/relief/index.html',
                    'analyst': '/analyst/index.html'
                };
                
                window.location.href = roleRedirects[formData.get('role')] || '/';
            } else {
                alert(`${formType} failed. Please try again.`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`An error occurred during ${formType}.`);
        }
    };

    // Add form submit event listeners
    elements.loginForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleFormSubmit(this, 'login', 'login');
    });

    elements.registerForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleFormSubmit(this, 'register', 'registration');
    });
});