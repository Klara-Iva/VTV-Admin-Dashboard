document.addEventListener('DOMContentLoaded', () => {
    const placesContainer = document.getElementById('places-container');
    const searchInput = document.getElementById('search-input'); // Polje za pretragu
    let placesList = []; // Čuvanje svih mjesta za filtriranje

    const categories = [
        'aktualno', 'duhovnost', 'eksperimenti', 'građevine', 'interaktivno', 
        'spomenici', 'povijest', 'priroda', 'umjetnost', 'sport'
    ];

    const renderPlace = (place) => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        let categoryCheckboxes = categories.map(category => `
            <label>
                <input type="checkbox" name="category" value="${category}" ${place.category.includes(category) ? 'checked' : ''}>
                ${category}
            </label>
        `).join('<br>');

        card.innerHTML = `
            <img src="${place.image1}" alt="${place.name}">
            <img src="${place.image2}" alt="${place.name}">
            <h3>${place.name}</h3>
            <form data-id="${place.id}">
                <label for="name_${place.id}">Name:</label>
                <input type="text" id="name_${place.id}" name="name" value="${place.name}" required>
                
                <label for="description_${place.id}">Description:</label>
                <textarea id="description_${place.id}" name="description" required>${place.description}</textarea>
                
                <label>Category:</label>
                <div>${categoryCheckboxes}</div>
                
                <label for="latitude_${place.id}">Latitude:</label>
                <input type="number" id="latitude_${place.id}" name="latitude" value="${place.latitude}" required>
                
                <label for="longitude_${place.id}">Longitude:</label>
                <input type="number" id="longitude_${place.id}" name="longitude" value="${place.longitude}" required>
                
                <label for="link_${place.id}">Link:</label>
                <input type="url" id="link_${place.id}" name="link" value="${place.link || ''}">
                
                <label for="image1_${place.id}">Image 1 URL:</label>
                <input type="url" id="image1_${place.id}" name="image1" value="${place.image1}" required>
                
                <label for="image2_${place.id}">Image 2 URL:</label>
                <input type="url" id="image2_${place.id}" name="image2" value="${place.image2}" required>
                
                <button type="submit">Update</button>
                <button type="button" onclick="deletePlace('${place.id}')">Delete</button>
            </form>
        `;
        placesContainer.appendChild(card);

        // Add event listener for update
        card.querySelector('form').addEventListener('submit', async (event) => {
            event.preventDefault();
            const form = event.target;
            const updatedData = {
                name: form.name.value,
                description: form.description.value,
                category: Array.from(form.category).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value),
                latitude: parseFloat(form.latitude.value),
                longitude: parseFloat(form.longitude.value),
                image1: form.image1.value,
                image2: form.image2.value
            };

            const link = form.link.value;
            if (link) {
                updatedData.link = link;
            }

            await db.collection('places').doc(place.id).update(updatedData);
            alert('Place updated successfully!');
        });
    };

    const deletePlace = async (id) => {
        await db.collection('places').doc(id).delete();
        document.querySelector(`form[data-id='${id}']`).parentElement.remove();
        alert('Place deleted successfully!');
    };

    const renderPlaces = (places) => {
        placesContainer.innerHTML = '';
        places.forEach(renderPlace);
    };

    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredPlaces = placesList.filter(place => 
            place.name.toLowerCase().includes(searchTerm) ||
            place.description.toLowerCase().includes(searchTerm)
        );
        renderPlaces(filteredPlaces); 
    });


    db.collection('places').get().then((snapshot) => {
        placesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); 
        renderPlaces(placesList); 
    });
});
