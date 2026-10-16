const $ = selector => document.querySelector(selector);
const newBookForm = $('#new-book-form');
const newBookSpan = $('#new-book-form span');

newBookForm?.addEventListener('submit', async event => {
    event.preventDefault();

    const name = $('#new-book-name').value.trim();
    const author = $('#new-book-author').value.trim();
    const year = $('#new-book-year').value;

    try {
        const response = await fetch('/books/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ name, author, year })
        });

        if (!response.ok) throw new Error(await response.text());
        newBookSpan.innerText = 'Llibre creat correctament';
        newBookSpan.style.color = 'green';
        setTimeout(() => {
            window.location.href = '/books';
        }, 1000);
    } catch (error) {
        newBookSpan.innerText = error.message || 'Error al crear el llibre';
        newBookSpan.style.color = 'red';
    }
});
