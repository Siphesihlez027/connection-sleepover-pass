/**
 * Sleepover Module
 * Handles sleepover pass creation, viewing, and management
 */
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

// ===== AUTO-INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    const sleepoverForm = document.getElementById('sleepover-form');
    if (sleepoverForm) {
        sleepoverForm.addEventListener('submit', handleSleepoverSubmit);
    }
});
