export const downloadFileWithToken = async (
	url: string,
	token: string,
	filename?: string,
) => {
	const res = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
			accept: "*/*",
		},
		cache: "no-store",
	});
	if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
	const [blob, contentDisposition] = await Promise.all([
		res.blob(),
		res.headers.get("content-disposition"),
	]);
	const suggestedName =
		filename ??
		contentDisposition
			?.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i)?.[1]
			?.replace(/"/g, "") ??
		"report";
	const blobUrl = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = blobUrl;
	a.download = decodeURIComponent(suggestedName);
	a.rel = "noopener noreferrer";
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(blobUrl);
};
