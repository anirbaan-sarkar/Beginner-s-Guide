// JavaScript for admin panel

console.log("admin.js loaded");

document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin DOM fully loaded and parsed");

    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const adminLoginForm = document.getElementById('admin-login-form');

    // Check if user is already logged in (e.g., via a token in localStorage)
    // For now, this is a placeholder. Actual token check will be implemented later.
    const isLoggedIn = localStorage.getItem('adminToken'); 

    if (isLoggedIn) {
        if (loginSection) loginSection.style.display = 'none';
        if (dashboardSection) dashboardSection.style.display = 'block';
        console.log('Admin already logged in (placeholder token found)');
        // Potentially load dashboard data here
    } else {
        if (loginSection) loginSection.style.display = 'block';
        if (dashboardSection) dashboardSection.style.display = 'none';
        console.log('Admin not logged in');
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Admin login form submitted (placeholder)');
            // const username = e.target.username.value;
            // const password = e.target.password.value;
            
            // Placeholder: Simulate login
            // In a real app, you would send these credentials to the server
            // For now, let's assume login is successful
            console.log('Simulating successful login...');
            localStorage.setItem('adminToken', 'fake-jwt-token'); // Store a fake token

            if (loginSection) loginSection.style.display = 'none';
            if (dashboardSection) dashboardSection.style.display = 'block';
            
            alert('Login successful! (Placeholder)');
            // Potentially load dashboard data here
        });
    }

    // Placeholder for logout
    // const logoutButton = document.getElementById('logout-button'); // Assuming a logout button exists
    // if (logoutButton) {
    //     logoutButton.addEventListener('click', () => {
    //         localStorage.removeItem('adminToken');
    //         if (loginSection) loginSection.style.display = 'block';
    //         if (dashboardSection) dashboardSection.style.display = 'none';
    //         console.log('Admin logged out');
    //         alert('Logged out successfully!');
    //     });
    // }

    // Placeholder for navigation within dashboard
    // const navLinks = document.querySelectorAll('#dashboard-section nav a');
    // navLinks.forEach(link => {
    //     link.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         const section = e.target.getAttribute('href').substring(1); // e.g., #tips-management -> tips-management
    //         console.log(`Navigating to ${section}`);
    //         // Add logic here to display the content for the selected section
    //         // document.getElementById('admin-content').innerHTML = `<h2>${e.target.textContent}</h2><p>Content for ${section} goes here...</p>`;
    //     });
    // });
});
