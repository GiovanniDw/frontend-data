const groupBy = (arr, key) =>
	arr.reduce(
		(acc, item) => (
			(acc[item[key]] = [...(acc[item[key]] || []), item]), acc
		),
		{}
	);
