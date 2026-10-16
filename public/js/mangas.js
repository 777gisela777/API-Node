const $ = selector => document.querySelector(selector);
const newMangaForm = $('#new-manga-form');
const newMangaSpan = $('#new-manga-form span');

newMangaForm?.addEventListener('submit', async event => {
    event.preventDefault();

    const name = $('#new-manga-name').value.trim();
    const author = $('#new-manga-author').value.trim();
    const year = $('#new-manga-year').value;

    try {
        const response = await fetch('/mangas/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ name, author, year })
        });

        if (!response.ok) throw new Error(await response.text());
        newMangaSpan.innerText = 'Manga creado correctamente';
        newMangaSpan.style.color = 'green';
        setTimeout(() => {
            window.location.href = '/mangas';
        }, 1000);
    } catch (error) {
        newMangaSpan.innerText = error.message || 'Error al crear el manga';
        newMangaSpan.style.color = 'red';
    }
});
