const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname)); // Serves your local index.html, styles.css, app.js directly

// Registration API Hook
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    console.log(`[Provision Pipeline] Tracking Account Creation Request for: ${name} (${email})`);
    return res.status(201).json({ success: true, message: "Infrastructure Profile Cataloged." });
});

// Login Access API Hook
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`[Identity Pipeline] Verifying System Authentication Handshake for: ${email}`);
    return res.status(200).json({ success: true, token: "mock-jwt-token-string" });
});

app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(`🚀 Gateway Server active at: http://localhost:${PORT}`);
    console.log(`================================================================`);
});
