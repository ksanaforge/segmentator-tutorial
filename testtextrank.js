
if (process.argv.length==2) {
	const data=require("./bm25testdata");
	const bm25=BM25(data);

	for (var i=0;i<data.length;i++){
		const scores=bm25.simAll(data[i]);
		console.log(scores)
	}
}
