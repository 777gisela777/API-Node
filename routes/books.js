import { Router } from 'express';
import { readFileSync, writeFileSync } from 'node:fs';

const router = Router();

function readData() {
	const file = readFileSync('./db/db.json', 'utf8');
	return JSON.parse(file);
}

router.get('/books/new', (req, res) => {
	const { user } = req.session;
	if (!user) return res.status(403).send('No autoritzat');
	res.render('create_book', { book: { name: '', author: '', year: '' } });
});

router.get('/books/:id/edit', (req, res) => {
	const { user } = req.session;
	if (!user) return res.status(403).send('No autoritzat');
	const data = readData();
	const book = data.books.find(item => String(item.id) === req.params.id);
	if (!book) return res.status(404).send('Llibre no trobat');
	res.render('edit_book', { book });
});

router.get('/books', (req, res) => {
	const { user } = req.session;
	if (!user) return res.status(403).send('No autoritzat');

	const data = readData();
	res.render('books', { user, data });
});

router.delete('/books/:id', (req, res) => {
	const { user } = req.session;
	if (!user) return res.status(403).send('No autoritzat');

	try {
		const data = readData();
		const books = data.books.filter(book => String(book.id) !== req.params.id);
		if (books.length === data.books.length) {
			return res.status(404).send('Llibre no trobat');
		}

		data.books = books;
		writeFileSync('./db/db.json', JSON.stringify(data, null, 2));
		return res.status(204).end();
	} catch (error) {
		return res.status(400).send(error.message);
	}
});

router.put('/books/:id', (req, res) => {
	const { user } = req.session;
	if (!user) return res.status(403).send('No autoritzat');

	try {
		const data = readData();
		const bookIndex = data.books.findIndex(book => String(book.id) === req.params.id);
		if (bookIndex === -1) {
			return res.status(404).send('Llibre no trobat');
		}

		data.books[bookIndex] = { ...data.books[bookIndex], ...req.body };
		writeFileSync('./db/db.json', JSON.stringify(data, null, 2));
		if (req.accepts('html')) return res.redirect('/books');
		return res.status(200).json(data.books[bookIndex]);
	} catch (error) {
		return res.status(400).send(error.message);
	}
});

router.post('/books/new', (req, res) => {
	const { user } = req.session;
	if (!user) return res.status(403).send('No autoritzat');

	try {
		const data = readData();
		const newBook = { ...req.body, id: Date.now() };
		data.books.push(newBook);
		writeFileSync('./db/db.json', JSON.stringify(data, null, 2));
		if (req.accepts('html')) return res.redirect('/books');
		return res.status(201).json(newBook);
	} catch (error) {
		return res.status(400).send(error.message);
	}
});

export default router;
