const editBookForm = document.querySelector('#edit-book-form');
const editBookMessage = document.querySelector('#edit-book-message');

editBookForm?.addEventListener('submit', async event => {
    event.preventDefault();

    const formData = new FormData(editBookForm);
    const book = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(editBookForm.action, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(book)
        });

        if (!response.ok) throw new Error(await response.text());
        window.location.href = '/books';
    } catch (error) {
        editBookMessage.textContent = error.message || 'No s\'han pogut desar els canvis';
        editBookMessage.style.color = 'red';
    }
});