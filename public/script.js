document.addEventListener('DOMContentLoaded', function() {
    const eventForm = document.getElementById('event-form');
    const eventList = document.getElementById('event-list');

    // Function to format date in a readable format (e.g., YYYY-MM-DD)
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Formats to YYYY-MM-DD
    }

    // Function to fetch events from the server
    function fetchEvents() {
        fetch('/events')
            .then(response => response.json())
            .then(data => {
                eventList.innerHTML = ''; // Clear current table rows
                data.forEach(event => {
                    const row = document.createElement('tr');

                    const titleCell = document.createElement('td');
                    titleCell.textContent = event.title;

                    const descriptionCell = document.createElement('td');
                    descriptionCell.textContent = event.description;

                    const dateCell = document.createElement('td');
                    dateCell.textContent = formatDate(event.date); // Format the date

                    row.appendChild(titleCell);
                    row.appendChild(descriptionCell);
                    row.appendChild(dateCell);

                    eventList.appendChild(row);
                });
            });
    }

    // Fetch events when the page loads
    fetchEvents();

    // Event listener for form submission
    eventForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;

        fetch('/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, date })
        })
        .then(response => response.json())
        .then(() => {
            eventForm.reset();
            fetchEvents(); // Refresh the event list
        });
    });
});
