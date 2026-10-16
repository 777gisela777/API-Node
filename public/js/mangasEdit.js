const editMangaForm = document.querySelector('#edit-manga-form');
const editMangaMessage = document.querySelector('#edit-manga-message');

editMangaForm?.addEventListener('submit', async event => {
    event.preventDefault();

    const formData = new FormData(editMangaForm);
    const manga = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(editMangaForm.action, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(manga)
        });

        if (!response.ok) throw new Error(await response.text());
        window.location.href = '/mangas';
    } catch (error) {
        editMangaMessage.textContent = error.message || 'No se pudo guardar el manga.';
        editMangaMessage.style.color = 'red';
    }
});