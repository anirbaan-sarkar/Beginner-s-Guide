document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#adminLoginForm'); // Assuming a login form will be added/is part of admin.html
    const logoutButton = document.querySelector('#adminLogoutBtn'); // Assuming a logout button
    const adminContent = document.querySelector('#adminAuthenticatedContent'); // A wrapper for content shown when logged in
    const publicContent = document.querySelector('#adminPublicContent'); // A wrapper for login form etc.
    
    const emailTipsList = document.querySelector('#emailTipsList'); // Placeholder UL/DIV for email tips
    const sopTipsList = document.querySelector('#sopTipsList');     // Placeholder UL/DIV for SOP tips

    // Function to check login status
    async function checkLoginStatus() {
        try {
            const response = await fetch('/api/admin/status');
            if (!response.ok) { // Not logged in or other error
                console.log('Not logged in or error checking status:', response.status);
                updateAdminUI(false);
                return false;
            }
            const data = await response.json();
            if (data.logged_in) {
                updateAdminUI(true, data.username);
                loadEmailTips();
                loadSopTips();
                return true;
            } else {
                updateAdminUI(false);
                return false;
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            updateAdminUI(false);
            return false;
        }
    }

    // Function to update UI based on login state
    function updateAdminUI(isLoggedIn, username = '') {
        const sections = document.querySelectorAll('.content section'); // Get all sections in admin panel
        const loginSection = document.querySelector('#admin-login-section'); // Specific login section
        const navLinks = document.querySelectorAll('.sidebar nav ul li a');


        if (isLoggedIn) {
            if (loginSection) loginSection.style.display = 'none'; // Hide login form section
            sections.forEach(section => { // Show all other sections
                 if(section.id !== 'admin-login-section') section.style.display = 'block';
            });
            navLinks.forEach(link => { // Show all nav links except potentially a "Login" link
                if (link.href.includes('login')) link.parentElement.style.display = 'none';
                else link.parentElement.style.display = 'list-item';
            });
            // Display username if an element for it exists
            const adminUsernameEl = document.querySelector('#adminUsername');
            if (adminUsernameEl) adminUsernameEl.textContent = username;
            // Show logout button, hide login button if they exist
             const logoutBtnEl = document.getElementById('adminLogoutBtnContainer'); // Assuming a container for the button
             if(logoutBtnEl) logoutBtnEl.style.display = 'block';


        } else {
            if (loginSection) loginSection.style.display = 'block'; // Show login form section
             sections.forEach(section => { // Hide all other sections
                 if(section.id !== 'admin-login-section') section.style.display = 'none';
            });
            navLinks.forEach(link => { // Hide all nav links except login
                if (link.href.includes('login')) link.parentElement.style.display = 'list-item';
                else if (!link.href.endsWith('admin.html') && !link.href.endsWith('index.html')) { // Keep basic nav like "Admin Home" or "Back to Site"
                     link.parentElement.style.display = 'none';
                }
            });
             const logoutBtnEl = document.getElementById('adminLogoutBtnContainer');
             if(logoutBtnEl) logoutBtnEl.style.display = 'none';
        }
    }

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = loginForm.username.value;
            const password = loginForm.password.value;
            try {
                const response = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await response.json();
                if (response.ok) {
                    alert(data.message);
                    updateAdminUI(true, data.username);
                    loadEmailTips();
                    loadSopTips();
                } else {
                    alert('Login failed: ' + data.message);
                    updateAdminUI(false);
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('An error occurred during login.');
                updateAdminUI(false);
            }
        });
    }

    // Handle Logout
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/admin/logout', { method: 'POST' });
                const data = await response.json();
                alert(data.message);
            } catch (error) {
                console.error('Logout error:', error);
                alert('An error occurred during logout.');
            } finally {
                updateAdminUI(false);
                 // Optionally redirect to login page or refresh
                window.location.hash = ''; // Clear hash to potentially show login form if it's default
                window.location.reload(); 
            }
        });
    }
    
    // --- SOP Tip CRUD Operations ---
    const sopTipForm = document.getElementById('sopTipForm');
    const showAddSopTipFormBtn = document.getElementById('showAddSopTipFormBtn');
    const cancelSopTipEditBtn = document.getElementById('cancelSopTipEditBtn');
    const sopTipFormTitle = document.getElementById('sopTipFormTitle');
    const sopTipIdInput = document.getElementById('sopTipId');
    const sopTipTitleInput = document.getElementById('sopTipTitle');
    const sopTipContentInput = document.getElementById('sopTipContent');
    const sopTipCategoryInput = document.getElementById('sopTipCategory');

    if (showAddSopTipFormBtn) {
        showAddSopTipFormBtn.addEventListener('click', () => {
            sopTipForm.style.display = 'block';
            sopTipFormTitle.textContent = 'Add';
            sopTipForm.reset(); // Clear form fields
            sopTipIdInput.value = ''; // Ensure ID is cleared
        });
    }

    if (cancelSopTipEditBtn) {
        cancelSopTipEditBtn.addEventListener('click', () => {
            sopTipForm.style.display = 'none';
            sopTipForm.reset();
        });
    }

    if (sopTipForm) {
        sopTipForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const id = sopTipIdInput.value;
            const title = sopTipTitleInput.value;
            const content = sopTipContentInput.value;
            const category = sopTipCategoryInput.value;

            const method = id ? 'PUT' : 'POST';
            const url = id ? `/api/sop-tips/${id}` : '/api/sop-tips';

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, content, category })
                });
                const data = await response.json();
                if (response.ok) {
                    alert(data.message || `SOP tip ${id ? 'updated' : 'created'} successfully!`);
                    sopTipForm.reset();
                    sopTipForm.style.display = 'none';
                    loadSopTips(); // Refresh the list
                } else {
                    alert(`Error: ${data.message || 'Could not save SOP tip.'}`);
                }
            } catch (error) {
                console.error('Error saving SOP tip:', error);
                alert('An error occurred while saving the SOP tip.');
            }
        });
    }

    // Event delegation for Edit and Delete buttons on SOP Tips
    if (sopTipsList) { // sopTipsList was defined earlier with Email Tips list
        sopTipsList.addEventListener('click', async (event) => {
            const target = event.target;
            const tipId = target.dataset.id;

            if (target.classList.contains('edit-sop-tip-btn')) { // New class for SOP edit buttons
                try {
                    const response = await fetch(`/api/sop-tips/${tipId}`);
                    if (!response.ok) throw new Error('Failed to fetch SOP tip details');
                    const tip = await response.json();
                    
                    sopTipFormTitle.textContent = 'Edit';
                    sopTipIdInput.value = tip.id;
                    sopTipTitleInput.value = tip.title;
                    sopTipContentInput.value = tip.content;
                    sopTipCategoryInput.value = tip.category || '';
                    sopTipForm.style.display = 'block';
                    sopTipForm.scrollIntoView({ behavior: 'smooth' });
                } catch (error) {
                    console.error('Error fetching SOP tip for edit:', error);
                    alert('Could not load SOP tip details for editing.');
                }
            } else if (target.classList.contains('delete-sop-tip-btn')) { // New class for SOP delete buttons
                if (confirm(`Are you sure you want to delete SOP tip ID ${tipId}?`)) {
                    try {
                        const response = await fetch(`/api/sop-tips/${tipId}`, { method: 'DELETE' });
                        const data = await response.json();
                        if (response.ok) {
                            alert(data.message || 'SOP tip deleted successfully!');
                            loadSopTips(); // Refresh the list
                        } else {
                            alert(`Error: ${data.message || 'Could not delete SOP tip.'}`);
                        }
                    } catch (error) {
                        console.error('Error deleting SOP tip:', error);
                        alert('An error occurred while deleting the SOP tip.');
                    }
                }
            }
        });
    }
    
    // Function to fetch and display Email Tips
    async function loadEmailTips() {
        if (!emailTipsList) return;
        try {
            const response = await fetch('/api/email-tips');
            if (!response.ok) {
                 if(response.status === 401) { // Unauthorized
                    console.log('Unauthorized to fetch email tips. Logging out UI.');
                    updateAdminUI(false); // Reflect logout state
                 } else {
                    emailTipsList.innerHTML = '<li>Error loading email tips. Status: ' + response.status + '</li>';
                 }
                return;
            }
            const tips = await response.json();
            emailTipsList.innerHTML = ''; // Clear existing
            if (tips.length === 0) {
                emailTipsList.innerHTML = '<li>No email tips found.</li>';
                return;
            }
            tips.forEach(tip => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${tip.title}</strong> (Category: ${tip.category || 'N/A'})<br>
                    <p>${tip.content.substring(0,100)}...</p>
                    <button class="edit-email-tip-btn" data-id="${tip.id}">Edit</button>
                    <button class="delete-email-tip-btn" data-id="${tip.id}">Delete</button>
                `;
                emailTipsList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching email tips:', error);
            emailTipsList.innerHTML = '<li>Error loading email tips.</li>';
        }
    }

    // Function to fetch and display SOP Tips
    async function loadSopTips() {
        if (!sopTipsList) return;
        try {
            const response = await fetch('/api/sop-tips');
             if (!response.ok) {
                 if(response.status === 401) { // Unauthorized
                    console.log('Unauthorized to fetch SOP tips. Logging out UI.');
                    updateAdminUI(false); // Reflect logout state
                 } else {
                    sopTipsList.innerHTML = '<li>Error loading SOP tips. Status: ' + response.status + '</li>';
                 }
                return;
            }
            const tips = await response.json();
            sopTipsList.innerHTML = ''; // Clear existing
            if (tips.length === 0) {
                sopTipsList.innerHTML = '<li>No SOP tips found.</li>';
                return;
            }
            tips.forEach(tip => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${tip.title}</strong> (Category: ${tip.category || 'N/A'})<br>
                    <p>${tip.content.substring(0,100)}...</p>
                    <button class="edit-sop-tip-btn" data-id="${tip.id}">Edit</button>
                    <button class="delete-sop-tip-btn" data-id="${tip.id}">Delete</button>
                `;
                sopTipsList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching SOP tips:', error);
            sopTipsList.innerHTML = '<li>Error loading SOP tips.</li>';
        }
    }

    // --- Email Tip CRUD Operations ---
    const emailTipForm = document.getElementById('emailTipForm');
    const showAddEmailTipFormBtn = document.getElementById('showAddEmailTipFormBtn');
    const cancelEmailTipEditBtn = document.getElementById('cancelEmailTipEditBtn');
    const emailTipFormTitle = document.getElementById('emailTipFormTitle');
    const emailTipIdInput = document.getElementById('emailTipId');
    const emailTipTitleInput = document.getElementById('emailTipTitle');
    const emailTipContentInput = document.getElementById('emailTipContent');
    const emailTipCategoryInput = document.getElementById('emailTipCategory');

    if (showAddEmailTipFormBtn) {
        showAddEmailTipFormBtn.addEventListener('click', () => {
            emailTipForm.style.display = 'block';
            emailTipFormTitle.textContent = 'Add';
            emailTipForm.reset(); // Clear form fields
            emailTipIdInput.value = ''; // Ensure ID is cleared
        });
    }

    if (cancelEmailTipEditBtn) {
        cancelEmailTipEditBtn.addEventListener('click', () => {
            emailTipForm.style.display = 'none';
            emailTipForm.reset();
        });
    }

    if (emailTipForm) {
        emailTipForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const id = emailTipIdInput.value;
            const title = emailTipTitleInput.value;
            const content = emailTipContentInput.value;
            const category = emailTipCategoryInput.value;

            const method = id ? 'PUT' : 'POST';
            const url = id ? `/api/email-tips/${id}` : '/api/email-tips';

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, content, category })
                });
                const data = await response.json();
                if (response.ok) {
                    alert(data.message || `Email tip ${id ? 'updated' : 'created'} successfully!`);
                    emailTipForm.reset();
                    emailTipForm.style.display = 'none';
                    loadEmailTips(); // Refresh the list
                } else {
                    alert(`Error: ${data.message || 'Could not save email tip.'}`);
                }
            } catch (error) {
                console.error('Error saving email tip:', error);
                alert('An error occurred while saving the email tip.');
            }
        });
    }

    // Event delegation for Edit and Delete buttons on Email Tips
    if (emailTipsList) {
        emailTipsList.addEventListener('click', async (event) => {
            const target = event.target;
            const tipId = target.dataset.id;

            if (target.classList.contains('edit-email-tip-btn')) {
                // Fetch the specific tip's data to populate the form
                try {
                    const response = await fetch(`/api/email-tips/${tipId}`);
                    if (!response.ok) throw new Error('Failed to fetch tip details');
                    const tip = await response.json();
                    
                    emailTipFormTitle.textContent = 'Edit';
                    emailTipIdInput.value = tip.id;
                    emailTipTitleInput.value = tip.title;
                    emailTipContentInput.value = tip.content;
                    emailTipCategoryInput.value = tip.category || '';
                    emailTipForm.style.display = 'block';
                    // Scroll to form for better UX might be good here
                    emailTipForm.scrollIntoView({ behavior: 'smooth' });

                } catch (error) {
                    console.error('Error fetching email tip for edit:', error);
                    alert('Could not load tip details for editing.');
                }
            } else if (target.classList.contains('delete-email-tip-btn')) {
                if (confirm(`Are you sure you want to delete email tip ID ${tipId}?`)) {
                    try {
                        const response = await fetch(`/api/email-tips/${tipId}`, { method: 'DELETE' });
                        const data = await response.json();
                        if (response.ok) {
                            alert(data.message || 'Email tip deleted successfully!');
                            loadEmailTips(); // Refresh the list
                        } else {
                            alert(`Error: ${data.message || 'Could not delete email tip.'}`);
                        }
                    } catch (error) {
                        console.error('Error deleting email tip:', error);
                        alert('An error occurred while deleting the email tip.');
                    }
                }
            }
        });
    }
    
    // Initial setup
    checkLoginStatus();

    // Handle SPA-like navigation if using hashes
    window.addEventListener('hashchange', () => {
        // This is a simple way to show/hide sections based on URL hash
        // More robust routing would use a library or more complex logic
        const hash = window.location.hash.replace('#', '');
        document.querySelectorAll('.content section').forEach(section => {
            section.style.display = section.id === hash ? 'block' : 'none';
        });
         // If login section is shown by hash, ensure other content is hidden if not logged in
        if (hash === 'admin-login-section' && !sessionStorage.getItem('isAdminLoggedIn')) { // Fictional session storage item
             checkLoginStatus(); // Re-verify and update UI
        }
    });
    // Trigger initial hash based display
    if (window.location.hash) {
        window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
        // Default view: if logged in, show dashboard, else show login form.
        // The checkLoginStatus() already handles showing content based on auth.
        // If no hash, and logged in, might want to default to #dashboard
        // This part is a bit tricky without a full login form in admin.html yet
    }
});
