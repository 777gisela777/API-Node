import { Router } from 'express';
import { readFileSync, writeFileSync } from 'node:fs';

const router = Router();

function readData() {
	const file = readFileSync('./db/db.json', 'utf8');
	return JSON.parse(file);
}

router.get('/mangas/new', (req, res) => {
	const { user } = req.session;
	if (!user) return res.status(403).send('No autoritzat');
	res.render('create_manga', { manga: { name: '', author: '', year: '' } });
});

router.get('/mangas/:id/edit', (req, res) => {
	const { user } = req.session;
	if (!user) return res.status(403).send('No autoritzat');
	const data = readData();
	const manga = data.mangas.find(item => String(item.id) === req.params.id);
	if (!manga) return res.status(404).send('Manga no trobat');
	res.render('edit_manga', { manga });
});

router.get('/mangas', (req, res) => {
	const { user } = req.session;
	if (!user) return res.status(403).send('No autoritzat');

	const data = readData();
	res.render('mangas', { user, data });
});

router.delete('/mangas/:id', (req, res) => {
	const { user } = req.session;
	if (!user) return res.status(403).send('No autoritzat');

	try {
		const data = readData();
		const mangas = data.mangas.filter(manga => String(manga.id) !== req.params.id);
		if (mangas.length === data.mangas.length) {
			return res.status(404).send('Manga no trobat');
		}

		data.mangas = mangas;
		writeFileSync('./db/db.json', JSON.stringify(data, null, 2));
		return res.status(204).end();
	} catch (error) {
		return res.status(400).send(error.message);
	}
});

router.put('/mangas/:id', (req, res) => {
	const { user } = req.session;
	if (!user) return res.status(403).send('No autoritzat');

	try {
		const data = readData();
		const mangaIndex = data.mangas.findIndex(manga => String(manga.id) === req.params.id);
		if (mangaIndex === -1) {
			return res.status(404).send('Manga no trobat');
		}

		data.mangas[mangaIndex] = { ...data.mangas[mangaIndex], ...req.body };
		writeFileSync('./db/db.json', JSON.stringify(data, null, 2));
		if (req.accepts('html')) return res.redirect('/mangas');
		return res.status(200).json(data.mangas[mangaIndex]);
	} catch (error) {
		return res.status(400).send(error.message);
	}
});

router.post('/mangas/new', (req, res) => {
	const { user } = req.session;
	if (!user) return res.status(403).send('No autoritzat');

	try {
		const data = readData();
		const newManga = { ...req.body, id: Date.now() };
		data.mangas.push(newManga);
		writeFileSync('./db/db.json', JSON.stringify(data, null, 2));
		if (req.accepts('html')) return res.redirect('/mangas');
		return res.status(201).json(newManga);
	} catch (error) {
		return res.status(400).send(error.message);
	}
});

export default router;
