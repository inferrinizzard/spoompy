export const formatDate = (
	date: Date,
	resolution: "day" | "month" | "year",
): string => {
	const dateYear = date.getFullYear();
	if (resolution === "year") {
		return dateYear.toString();
	}

	const dateMonth = date.toLocaleString("default", { month: "short" });
	if (resolution === "month") {
		return `${dateMonth} ${dateYear}`;
	}

	const dateDay = date.getDate();
	return `${dateDay} ${dateMonth} ${dateYear}`;
};
