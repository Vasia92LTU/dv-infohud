let previousCash = null; // Variable to store the previous cash amount
let previousBank = null; // Variable to store the previous bank amount

window.addEventListener('message', function (event) {
    if (event.data.action === 'updateHUD') {
        // Update server ID without the word "ID"
        document.querySelector('#server-id span').textContent = event.data.serverId; // Display server ID only

        // Update job and grade combined (removing the word "Grade")
        document.querySelector('#job-info').textContent =
            event.data.jobLabel + ' | ' + event.data.jobGrade; // Display job label and grade only

        // Update cash amount with formatting and detect changes
        const currentCash = event.data.cash;
        document.querySelector('#cash-label span').textContent = '$' + currentCash.toLocaleString(); // Display cash value only

        // Show notification if cash amount changes
        if (previousCash !== null && previousCash !== currentCash) {
            const cashDifference = currentCash - previousCash;
            showNotification(
                `Cash ${(cashDifference > 0 ? `+` : `-`)}$${Math.abs(cashDifference).toLocaleString()}`, 
                document.querySelector('#cash-label'), // Wallet icon for cash change
                'Cash' // Add type as "Cash"
            );
        }
        previousCash = currentCash; // Update previous cash amount

        // Update bank amount with formatting and detect changes
        const currentBank = event.data.bank;
        document.querySelector('#bank-label span').textContent = '$' + currentBank.toLocaleString(); // Display bank value only

        // Show notification if bank amount changes
        if (previousBank !== null && previousBank !== currentBank) {
            const bankDifference = currentBank - previousBank;
            showNotification(
                `Bank ${(bankDifference > 0 ? `+` : `-`)}$${Math.abs(bankDifference).toLocaleString()}`, 
                document.querySelector('#bank-label'), // Correct reference to bank label
                'Bank' // Add type as "Bank"
            );
        }
        previousBank = currentBank; // Update previous bank amount

        // Show or hide the ammo bar based on weapon status
        const ammoBar = document.querySelector('#ammo-label');
        if (event.data.hasWeapon) {
            ammoBar.classList.remove('hidden');
            ammoBar.classList.add('show'); // Add class to trigger animation
            ammoBar.querySelector('span').textContent = event.data.ammo; // Display ammo count only
        } else {
            ammoBar.classList.remove('show');
            ammoBar.classList.add('hidden');
        }
    }
});

window.addEventListener('message', function (event) {
    if (event.data.action === 'toggleHUD') {
        const hudElement = document.getElementById('hud');
        if (event.data.visible) {
            hudElement.classList.remove('hidden');
        } else {
            hudElement.classList.add('hidden');
        }
    }
});

// Function to display a notification near the specified reference element
function showNotification(message, referenceElement) {
    // Remove any existing notifications to prevent duplication
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message; // Display the message only

    // Determine color based on positive or negative change and set bold for both
    if (message.includes('+')) {
        notification.style.color = '#28a745'; // Green for positive change
        notification.style.fontWeight = 'bold'; // Make positive text bold
    } else if (message.includes('-')) {
        notification.style.color = '#dc3545'; // Red for negative change
        notification.style.fontWeight = 'bold'; // Make negative text bold
    }

    // Position the notification at the middle of the HUD
    const hudElement = document.getElementById('hud');
    const hudRect = hudElement.getBoundingClientRect();
    notification.style.position = 'absolute';
    notification.style.top = `${hudRect.top + hudRect.height / 2}px`; // Start at the vertical center of the HUD
    notification.style.left = `${hudRect.left + hudRect.width / 2}px`; // Start at the horizontal center of the HUD
    notification.style.opacity = '0'; // Start invisible
    notification.style.transform = 'translateX(0)'; // Start from the middle
    notification.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; // Smooth fade-in and move effect
    notification.style.zIndex = '1000'; // Ensure it appears above other elements

    document.body.appendChild(notification);

    // Trigger the fade-in effect and move to the left side after appending
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-220px)'; // Move to the left side of the HUD
    }, 10); // Small delay to ensure transition works

    // Remove the notification after 6 seconds
    setTimeout(() => {
        notification.remove();
    }, 6000);
}





