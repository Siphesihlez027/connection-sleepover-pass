/**
 * Sleepover Module
 * Handles sleepover pass creation, viewing, and management
 */

// ===== CREATE SLEEPOVER REQUEST =====
async function handleSleepoverSubmit(event) {
    event.preventDefault();
    
    const roomNumber = document.getElementById('room-number').value;
    const visitorName = document.getElementById('visitor-name').value;
    const visitorId = document.getElementById('visitor-id').value;
    const phoneNumber = document.getElementById('phone-number').value;
    const date = document.getElementById('date').value;
    
    try {
        const user = getCurrentUser();
        
        const requestData = {
            studentId: user.userId,
            roomId: roomNumber,
            visitorName: visitorName,
            visitorId: visitorId,
            phoneNumber: phoneNumber,
            date: date,
            status: 'PENDING'
        };
        
        const response = await apiCall(
            API_ENDPOINTS.sleepover.create,
            HTTP_METHODS.POST,
            requestData
        );
        
        showSuccess('Sleepover request submitted successfully!');
        setTimeout(() => {
            window.location.href = 'sleep.html';
        }, 1500);
        
    } catch (error) {
        showError(error.message || 'Failed to submit sleepover request');
    }
}

// ===== LOAD SLEEPOVER REQUESTS (FOR STUDENT) =====
async function loadStudentSleepoverRequests() {
    try {
        const user = getCurrentUser();
        const response = await apiCall(
            API_ENDPOINTS.sleepover.getByStudent(user.userId),
            HTTP_METHODS.GET
        );
        
        displaySleepoverRequests(response);
        
    } catch (error) {
        console.error('Failed to load sleepover requests:', error);
        showError('Failed to load sleepover requests');
    }
}

// ===== DISPLAY SLEEPOVER REQUESTS (STUDENT VIEW) =====
function displaySleepoverRequests(requests) {
    const container = document.getElementById('sleepover-requests-container');
    
    if (!container) return;
    
    if (!requests || requests.length === 0) {
        container.innerHTML = '<p class="no-data">No sleepover requests found</p>';
        return;
    }
    
    container.innerHTML = requests.map(request => `
        <div class="request-card ${request.status.toLowerCase()}">
            <div class="request-header">
                <h3>Visitor: ${request.visitorName}</h3>
                <span class="status-badge ${request.status.toLowerCase()}">${request.status}</span>
            </div>
            <div class="request-body">
                <p><strong>Room:</strong> ${request.roomId}</p>
                <p><strong>Date:</strong> ${new Date(request.date).toLocaleDateString()}</p>
                <p><strong>Visitor ID:</strong> ${request.visitorId}</p>
            </div>
        </div>
    `).join('');
}

// ===== LOAD ALL SLEEPOVER REQUESTS (FOR ADMIN) =====
async function loadAllSleepoverRequests() {
    try {
        const response = await apiCall(
            API_ENDPOINTS.sleepover.getAll,
            HTTP_METHODS.GET
        );
        
        displayAdminSleepoverRequests(response);
        
    } catch (error) {
        console.error('Failed to load sleepover requests:', error);
        showError('Failed to load sleepover requests');
    }
}

// ===== DISPLAY SLEEPOVER REQUESTS (ADMIN VIEW) =====
function displayAdminSleepoverRequests(requests) {
    const container = document.getElementById('admin-sleepover-container');
    
    if (!container) return;
    
    if (!requests || requests.length === 0) {
        container.innerHTML = '<p class="no-data">No sleepover requests found</p>';
        return;
    }
    
    container.innerHTML = requests.map(request => `
        <div class="admin-request-card" onclick="viewSleepoverDetail('${request.id}')">
            <div class="request-info">
                <h4>Visitor: ${request.visitorName}</h4>
                <p class="student-info">Student: ${request.studentName || request.studentEmail}</p>
                <p class="room-info">Room: ${request.roomId}</p>
            </div>
            <div class="request-status">
                <span class="status-badge ${request.status.toLowerCase()}">${request.status}</span>
                <p class="date-info">${new Date(request.date).toLocaleDateString()}</p>
            </div>
        </div>
    `).join('');
}

// ===== VIEW SLEEPOVER DETAIL =====
function viewSleepoverDetail(requestId) {
    window.location.href = `sleepover_verify.html?id=${requestId}`;
}

// ===== AUTO-INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    const sleepoverForm = document.getElementById('sleepover-form');
    if (sleepoverForm) {
        sleepoverForm.addEventListener('submit', handleSleepoverSubmit);
    }
    
    if (document.getElementById('sleepover-requests-container')) {
        loadStudentSleepoverRequests();
    }
    
    if (document.getElementById('admin-sleepover-container')) {
        loadAllSleepoverRequests();
    }
});
