const express = require('express');
const path = require('path');
const randomId = require('@dark_wilk/id-generator');

const db = [
	{ id: 1, author: 'John Doe', text: 'This company is worth every coin!' },
	{
		id: 2,
		author: 'Amanda Doe',
		text: 'They really know how to make you happy.',
	},
];

const app = express();

app.use(express.urlencoded({ extended: false }));

app.get('/testimonials', (req, res) => {
	res.json(db);
});

app.get('/testimonials/random', (req, res) => {
	res.json(db[Math.floor(Math.random() * db.length)]);
});

app.get('/testimonials/:id', (req, res) => {
	const paramId = parseInt(req.params.id);
	const testimonial = db.find(item => item.id === paramId);
	res.json(testimonial);
});

app.post(`/testimonials`, (req, res) => {
	const { author, text } = req.body;
	const newTestimonial = {
		id: randomId(5),
		author,
		text,
	};
	db.push(newTestimonial);
	res.status(200).json({ message: 'OK' });
});

app.put('/testimonials/:id', (req, res) => {
	const testimonialId = req.params.id.toString();
	const { author, text } = req.body;
	const index = db.findIndex(item => item.id.toString() === testimonialId);

	if (index !== -1) {
		db[index] = { ...db[index], author, text };
		res.status(200).json({ message: 'OK' });
	} else {
		return res.status(404).json({ errorMessage: 'Testimonial not found' });
	}
});

app.delete('/testimonials/:id', (req, res) => {
	const testimonialId = req.params.id.toString();
	const index = db.findIndex(item => item.id.toString() === testimonialId);

	if (index === -1) {
		return res
			.status(404)
			.json({ errorMessage: 'Testimonial you want to delete not found' });
	}

	db.splice(index, 1);
	res
		.status(200)
		.json({ message: 'Testimonial successfully deleted ', testimonialId });
});

app.use((req, res) => {
	res.status(404).json({ message: '404 not found...' });
});

app.listen(8000, () => {
	console.log('Server is running on port: 8000');
});
