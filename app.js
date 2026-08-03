
***

### 2. Clear out your old JavaScript and save this entirely as `app.js`

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // View Switchers
    document.getElementById('switchToLogin').addEventListener('click', () => switchViewState('login'));
    document.getElementById('switchToRegister').addEventListener('click', () => switchViewState('register'));

    // Modal Listeners
    document.getElementById('openTermsLink').addEventListener('click', () => openLegalModal('Terms of Service'));
    document.getElementById('openPrivacyLink').addEventListener('click', () => openLegalModal('Privacy Policy'));
    document.getElementById('modalCloseBtn').addEventListener('click', closeLegalModal);
});

// State Machine for Views
function switchViewState(targetState) {
    const registerView = document.getElementById('registerView');
    const loginView = document.getElementById('loginView');
    
    // Clear prior formatting errors
    document.querySelectorAll('.form-row').forEach(row => row.classList.remove('has-error'));
    
    if (targetState === 'login') {
        registerView.classList.remove('active-view');
        setTimeout(() => { loginView.classList.add('active-view'); }, 150);
    } else {
        loginView.classList.remove('active-view');
        setTimeout(() => { registerView.classList.add('active-view'); }, 150);
    }
}

// Functional Validation Logic & API Mocking
function handleFormSubmission(event, mode) {
    event.preventDefault();
    let isFormValid = true;

    if (mode === 'register') {
        const nameInp = document.getElementById('regName');
        const emailInp = document.getElementById('regEmail');
        const passInp = document.getElementById('regPassword');
        const legalCheck = document.getElementById('regLegalCheck');

        if (nameInp.value.trim().length < 2) {
            showFieldError(nameInp);
            isFormValid = false;
        } else { clearFieldError(nameInp); }

        if (!validateEmailFormat(emailInp.value)) {
            showFieldError(emailInp);
            isFormValid = false;
        } else { clearFieldError(emailInp); }

        if (passInp.value.length < 8) {
            showFieldError(passInp);
            isFormValid = false;
        } else { clearFieldError(passInp); }

        if (!legalCheck.checked) {
            displaySystemToast("You must accept our systemic terms before registration.");
            return;
        }
    } else if (mode === 'login') {
        const emailInp = document.getElementById('loginEmail');
        const passInp = document.getElementById('loginPassword');

        if (!validateEmailFormat(emailInp.value)) {
            showFieldError(emailInp);
            isFormValid = false;
        } else { clearFieldError(emailInp); }

        if (passInp.value.length < 1) {
            showFieldError(passInp);
            isFormValid = false;
        } else { clearFieldError(passInp); }
    }

    if (isFormValid) {
        executeMockNetworkRequest(event.target, mode);
    }
}

function validateEmailFormat(email) {
    const expression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expression.test(email);
}

function showFieldError(element) {
    element.parentElement.classList.add('has-error');
}

function clearFieldError(element) {
    element.parentElement.classList.remove('has-error');
}

// Simulating Real APIs using Loading States
function executeMockNetworkRequest(formElement, mode) {
    const submitBtn = formElement.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('span');
    const spinner = submitBtn.querySelector('.spinner');

    // Set Loading States
    submitBtn.disabled = true;
    spinner.style.display = 'block';
    const preservedText = btnText.innerText;
    btnText.innerText = 'Processing Gateway Data...';

    setTimeout(() => {
        // Return Interface to Normal State
        submitBtn.disabled = false;
        spinner.style.display = 'none';
        btnText.innerText = preservedText;

        if (mode === 'register') {
            displaySystemToast("Enterprise Identity Created Successfully!");
            formElement.reset();
            setTimeout(() => switchViewState('login'), 1200);
        } else {
            displaySystemToast("Access Authenticated. Launching System Console...");
            formElement.reset();
            
            // Transform app state into portal view mode
            setTimeout(() => {
                document.body.classList.add('portal-active');
            }, 800);
        }
    }, 1800);
}

function terminateSession() {
    document.body.classList.remove('portal-active');
    displaySystemToast("Session securely closed. Identity cleared.");
    switchViewState('login');
}

function triggerFederatedSSO(providerName) {
    displaySystemToast(`Routing secure token handshake via ${providerName}...`);
}

// Global System Component Feedback Elements
function displaySystemToast(messageText) {
    const toastElement = document.getElementById('actionToast');
    document.getElementById('toastMessage').innerText = messageText;
    toastElement.classList.add('toast-visible');
    setTimeout(() => {
        toastElement.classList.remove('toast-visible');
    }, 4000);
}

// Modal Control Triggers
function openLegalModal(legalType) {
    document.getElementById('modalTitle').innerText = `${legalType} Gateway Documentation`;
    document.getElementById('modalBody').innerText = `You are accessing the explicit documentation structural parameters concerning Parmessh Corp's deployment framework for legal protection rules regarding security monitoring compliance dashboards (${legalType}).`;
    document.getElementById('legalModal').classList.add('modal-open');
}

function closeLegalModal() {
    document.getElementById('legalModal').classList.remove('modal-open');
}
