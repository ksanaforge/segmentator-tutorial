const BM25=function(docs){
	var f=[]; //記錄每個句子中的詞以及詞頻
	var df={}; //每個詞語出現在幾個句子 document frequency
	//https://zh.wikipedia.org/wiki/TF-IDF
	var idf={}; //每個詞的逆向文件頻率 inverse document frequency
	const k1=1.5, b= 0.75; //調節因子
	const avgdl=docs.reduce((p,s)=>p+s.length,0)/docs.length ;//句子平均有幾個詞？

	const init=function(){
		var i,j,tf={},w;
		for (i=0;i<docs.length;i++) {
			tf={};//此句子詞頻統計
			for (j=0;j<docs[i].length;j++) {
				w=docs[i][j];
				if (!w)continue;
				tf[w]=(tf[w]||0)+1;
			}
			//加到df, 每個詞語出現在幾個句子?
			for (w in tf) {
				df[w]=(df[w]||0)+1;
			}
			f[i]=tf;
		}
		for (w in df){  //計算每個詞的 idf
			const freq=df[w]; //+0.5 以避免  log(0)
			idf[w]= Math.log(docs.length - freq + 0.5) - Math.log(freq+0.5);
		}
	}
	init();
	const sim=function(sentence, n){ //sentence 與 第 n 個句子的相似度
		var i,score=0;
		for (i=0;i<sentence.length;i++) {
			const w=sentence[i];
			if (!f[n][w])continue; //第n句無此詞
			const d=docs[n].length;
			const wf=f[n][w];       //詞在第n句出現的次數
			score+=(idf[w]*wf*(k1+1)/(wf+k1*(1-b+b*d/avgdl)));
		}
		return score;
	}

	const simAll=function(sentence){
		var i,scores=[];
		for (i=0;i<docs.length;i++) {
			scores[i]=sim(sentence,i);
		}
		return scores;
	}	
	return {simAll};
}
if (typeof module!=="undefined") module.exports=BM25;else window.BM25=BM25;