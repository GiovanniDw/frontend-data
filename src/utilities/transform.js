export const groupBy = (arr, key) =>
	arr.reduce(
		(acc, item) => (
			(acc[item[key]] = [...(acc[item[key]] || []), item]), acc
		),
		{}
	);

export const removeFalsy = (arr) => arr.filter(Boolean);

export const slugify = (string) =>
	string
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^\w-]+/g, '');

export const isEqual = (...objects) =>
			objects.every(
				(obj) => JSON.stringify(obj) === JSON.stringify(objects[0])
			);

export const toObject = (arr, key) =>
	arr.reduce((a, b) => ({ ...a, [b[key]]: b }), {});