/*
 * Copyright (C) 2025 Eeshvar Das (Erik Douglas Ward) (https://github.com/apm-essence-groove/apm-essence-groove-ci-cd)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

document.addEventListener('DOMContentLoaded', () => {
    const appsJsonPath = 'apps.json'; // apps.json is in the same directory
    const appsListContainer = document.getElementById('app-links-container');

    // Function to safely fetch and parse JSON
    async function fetchAppsData() {
        try {
            const response = await fetch(appsJsonPath);

            if (!response.ok) {
                console.error(`Error fetching ${appsJsonPath}: ${response.status} ${response.statusText}`);
                return null; 
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                console.error(`Error: ${appsJsonPath} does not contain a valid JSON array.`, data);
                return null;
            }

            return data;
        } catch (error) {
            console.error(`An unexpected error occurred while processing ${appsJsonPath}:`, error);
            return null;
        }
    }

    // Function to generate and append the app list
    async function displayAppLinks() {
        const apps = await fetchAppsData();

        // Clear previous content (if any)
        appsListContainer.innerHTML = ''; 

        if (apps && apps.length > 0) { // Only proceed if data is valid and not empty
            const listElement = document.createElement('ul');
            listElement.className = 'app-links-list'; // For potential future styling

            apps.forEach(app => {
                if (app && typeof app === 'object' && app.name && app.url) {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = app.url;
                    link.textContent = app.name;
                    link.target = '_blank'; // Open link in a new tab
                    link.rel = 'noopener noreferrer'; // Security best practice

                    listItem.appendChild(link);
                    listElement.appendChild(listItem);
                } else {
                    console.warn('Skipping malformed app entry:', app);
                }
            });
            appsListContainer.appendChild(listElement);
        } else {
            // If apps is null or empty, no output is done to the page,
            // fulfilling the silent error handling requirement.
            console.log('No apps to display or an error occurred during fetch.');
        }
    }

    displayAppLinks(); // Call the function to display links when the DOM is loaded
});
