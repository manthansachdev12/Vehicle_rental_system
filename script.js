const apiUrl = 'http://localhost:5000/api/vehicles'; // Your backend API URL

// Fetch vehicles data from the backend and display them
async function loadVehicles() {
    try {
        const response = await fetch(apiUrl);
        const vehicles = await response.json();
        
        // Render vehicles in the UI
        const vehicleContainer = document.getElementById('vehicle-container');
        const vehicleSelect = document.getElementById('vehicle-select');
        vehicleContainer.innerHTML = ''; // Clear existing content
        vehicleSelect.innerHTML = '<option value="">Select a vehicle</option>'; // Clear the select options

        vehicles.forEach(vehicle => {
            const vehicleDiv = document.createElement('div');
            vehicleDiv.classList.add('vehicle');
            vehicleDiv.innerHTML = `
                <h3>${vehicle.name} (${vehicle.model})</h3>
                <p>Type: ${vehicle.type}</p>
                <p>Seats: ${vehicle.seats}</p>
                <p>Status: ${vehicle.isAvailable ? 'Available' : 'Not Available'}</p>
            `;
            vehicleContainer.appendChild(vehicleDiv);

            // Add vehicle option to the booking select dropdown
            const option = document.createElement('option');
            option.value = vehicle._id;
            option.textContent = `${vehicle.name} (${vehicle.model})`;
            vehicleSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching vehicles:', error);
    }
}

// Handle booking a vehicle
async function handleBooking() {
    const vehicleId = document.getElementById('vehicle-select').value;
    if (!vehicleId) {
        alert('Please select a vehicle');
        return;
    }

    try {
        // PATCH request to update vehicle availability
        const response = await fetch(`${apiUrl}/${vehicleId}/availability`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isAvailable: false }),
        });

        if (response.ok) {
            alert('Vehicle booked successfully!');
            loadVehicles(); // Reload vehicles to show updated availability
        } else {
            alert('Failed to book vehicle');
        }
    } catch (error) {
        console.error('Error booking vehicle:', error);
        alert('Error booking vehicle');
    }
}

// Event listener for the booking button
document.getElementById('book-vehicle').addEventListener('click', handleBooking);

// Load vehicles when the page loads
window.onload = loadVehicles;
