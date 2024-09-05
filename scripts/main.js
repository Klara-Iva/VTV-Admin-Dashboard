document.addEventListener('DOMContentLoaded', () => {
    const placesContainer = document.getElementById('places-container');

    const categories = [
        'aktualno', 'duhovnost', 'eksperimenti', 'građevine', 'interaktivno', 
        'spomenici', 'povijest', 'priroda', 'umjetnost', 'sport'
    ];

    const renderPlace = (doc) => {
        const data = doc.data();
        const card = document.createElement('div');
        card.classList.add('card');
        
        let categoryCheckboxes = categories.map(category => `
            <label>
                <input type="checkbox" name="category" value="${category}" ${data.category.includes(category) ? 'checked' : ''}>
                ${category}
            </label>
        `).join('<br>');

        card.innerHTML = `
            <img src="${data.image1}" alt="${data.name}">
            <img src="${data.image2}" alt="${data.name}">
            <h3>${data.name}</h3>
            <form data-id="${doc.id}">
                <label for="name_${doc.id}">Name:</label>
                <input type="text" id="name_${doc.id}" name="name" value="${data.name}" required>
                
                <label for="description_${doc.id}">Description:</label>
                <textarea id="description_${doc.id}" name="description" required>${data.description}</textarea>
                
                <label>Category:</label>
                <div>${categoryCheckboxes}</div>
                
                <label for="latitude_${doc.id}">Latitude:</label>
                <input type="number" id="latitude_${doc.id}" name="latitude" value="${data.latitude}" required>
                
                <label for="longitude_${doc.id}">Longitude:</label>
                <input type="number" id="longitude_${doc.id}" name="longitude" value="${data.longitude}" required>
                
                <label for="link_${doc.id}">Link:</label>
                <input type="url" id="link_${doc.id}" name="link" value="${data.link || ''}">
                
                <label for="image1_${doc.id}">Image 1 URL:</label>
                <input type="url" id="image1_${doc.id}" name="image1" value="${data.image1}" required>
                
                <label for="image2_${doc.id}">Image 2 URL:</label>
                <input type="url" id="image2_${doc.id}" name="image2" value="${data.image2}" required>
                
                <button type="submit">Update</button>
                <button type="button" onclick="deletePlace('${doc.id}')">Delete</button>
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

            await db.collection('places').doc(doc.id).update(updatedData);
            alert('Place updated successfully!');
        });
    };

    const deletePlace = async (id) => {
        await db.collection('places').doc(id).delete();
        document.querySelector(`form[data-id='${id}']`).parentElement.remove();
        alert('Place deleted successfully!');
    };

    db.collection('places').get().then((snapshot) => {
        snapshot.docs.forEach(doc => renderPlace(doc));
    });
});
