document.addEventListener("DOMContentLoaded", () => {
    // Structural DOM Node Mapping
    const nodes = {
        switchToLogin: document.getElementById("switchToLogin"),
        switchToRegister: document.getElementById("switchToRegister"),
        registerView: document.getElementById("registerView"),
        loginView: document.getElementById("loginView"),
        registerForm: document.getElementById("registerForm"),
        loginForm: document.getElementById("loginForm"),
        actionToast: document.getElementById("actionToast"),
        toastMessage: document.getElementById("toastMessage"),
        legalModal: document.getElementById("legalModal"),
        modalTitle: document.getElementById("modalTitle"),
        modalBody: document.getElementById("modalBody"),
        modalCloseBtn: document.getElementById("modalCloseBtn"),
        openTermsLink: document.getElementById("openTermsLink"),
        openPrivacyLink: document.getElementById("openPrivacyLink"),
        ssoButtons: document.querySelectorAll(".sso-trigger-btn")
    };

    // State Handler: Interface View Swapping
    function switchViewState(targetState) {
        document.querySelectorAll(".form-row").forEach(row => row.classList.remove("has-error"));
        
        if (targetState === "login") {
            nodes.registerView.classList.remove("active-view");
            setTimeout(() => { nodes.loginView.classList.add("active-view"); }, 150);
        } else {
            nodes.loginView.classList.remove("active-view");
            setTimeout(() => { nodes.registerView.classList.add("active-view"); }, 150);
        }
    }

    // Interactive Field Error Utilities
    function toggleFieldError(inputElement, show) {
        const row = inputElement.parentElement;
        if (show) {
            row.classList.add("has-error");
        } else {
            row.classList.remove("has-error");
        }
    }

    function checkEmailFormat(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // System Feedback Mechanisms
    function presentToast(messageText) {
        nodes.toastMessage.innerText = messageText;
        nodes.actionToast.classList.add("toast-visible");
        setTimeout(() => { nodes.actionToast.classList.remove("toast-visible"); }, 4000);
    }

    // Dialog Window Toggles
    function showModal(title, text) {
        nodes.modalTitle.innerText = title;
        nodes.modalBody.innerText = text;
        nodes.legalModal.classList.add("modal-open");
    }

    function hideModal() {
        nodes.legalModal.classList.remove("modal-open");
    }

    // Form Event Pipeline Handler
    async function processFormSubmission(event, mode) {
        event.preventDefault();
        let passValidation = true;

        if (mode === "register") {
            const inputs = {
                name: document.getElementById("regName"),
                email: document.getElementById("regEmail"),
                pass: document.getElementById("regPassword"),
                check: document.getElementById("regLegalCheck")
            };

            if (inputs.name.value.trim().length < 2) { toggleFieldError(inputs.name, true); passValidation = false; }
            else { toggleFieldError(inputs.name, false); }

            if (!checkEmailFormat(inputs.email.value)) { toggleFieldError(inputs.email, true); passValidation = false; }
            else { toggleFieldError(inputs.email, false); }

            if (inputs.pass.value.length < 8) { toggleFieldError(inputs.pass, true); passValidation = false; }
            else { toggleFieldError(inputs.pass, false); }

            if (!inputs.check.checked) {
                presentToast("You must accept systemic regulatory terms to continue.");
                return;
            }

            if (passValidation) {
                await dispatchNetworkTransaction(event.target, "/api/register", {
                    name: inputs.name.value,
                    email: inputs.email.value,
                    password: inputs.pass.value
                }, "Account Registered! Redirecting...");
                event.target.reset();
                setTimeout(() => switchViewState("login"), 1500);
            }

        } else if (mode === "login") {
            const inputs = {
                email: document.getElementById("loginEmail"),
                pass: document.getElementById("loginPassword")
            };

            if (!checkEmailFormat(inputs.email.value)) { toggleFieldError(inputs.email, true); passValidation = false; }
            else { toggleFieldError(inputs.email, false); }

            if (inputs.pass.value.length < 1) { toggleFieldError(inputs.pass, true); passValidation = false; }
            else { toggleFieldError(inputs.pass, false); }

            if (passValidation) {
                await dispatchNetworkTransaction(event.target, "/api/login", {
                    email: inputs.email.value,
                    password: inputs.pass.value
                }, "Access Authorized. Mounting Dashboard Console...");
                event.target.reset();
            }
        }
    }

    // API Post Transmission Interface Engine
    async function dispatchNetworkTransaction(formElement, endpoint, payload, successAlert) {
        const submitButton = formElement.querySelector(".btn-submit");
        const textualNode = submitButton.querySelector("span");
        const loaderNode = submitButton.querySelector(".spinner");

        submitButton.disabled = true;
        loaderNode.style.display = "block";
        const standardText = textualNode.innerText;
        textualNode.innerText = "Synchronizing Node Token...";

        try {
            // Simulated local network stack ping. Swap to external server location if desired.
            await new Promise(resolve => setTimeout(resolve, 1500));
            presentToast(successAlert);
        } catch (err) {
            presentToast("Gateway connectivity timeout.");
        } finally {
            submitButton.disabled = false;
            loaderNode.style.display = "none";
            textualNode.innerText = standardText;
        }
    }

    // Event Binding Instantiations
    nodes.switchToLogin.addEventListener("click", () => switchViewState("login"));
    nodes.switchToRegister.addEventListener("click", () => switchViewState("register"));
    nodes.modalCloseBtn.addEventListener("click", hideModal);

    nodes.openTermsLink.addEventListener("click", () => {
        showModal("Terms of Service Framework", "This core gateway context structure governs workspace container pipelines and legal structural resource tracking within Parmessh Corp networks.");
    });

    nodes.openPrivacyLink.addEventListener("click", () => {
        showModal("Data Tracking & Privacy Rule", "User credentials, encrypted hashes, and infrastructure tracking states remain managed exclusively inside high-availability localized container blocks.");
    });

    nodes.ssoButtons.forEach(btn => {
        btn.addEventListener("click", () => presentToast("Routing identity verification via Federated Corporate Vault SSO..."));
    });

    nodes.registerForm.addEventListener("submit", (e) => processFormSubmission(e, "register"));
    nodes.loginForm.addEventListener("submit", (e) => processFormSubmission(e, "login"));
});
