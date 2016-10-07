/*sample data taken from 
http://www.hankcs.com/nlp/textrank-algorithm-java-implementation-of-automatic-abstract.html*/
const keyPhrase=function(input){
	const BM25=(typeof require!=="undefined")?require("./bm25"):window.BM25;
	const MAXITER=200,     //最多迭代次數
      MINDIFF=0.001,   //收歛閥值, 小於這個差異就不再迭代
      DAMPING=0.85     //阻尼系數。damping factor，沿用Google PageRank
                       //此系數不能超過1，越接近1，收歛的速度越慢

	const bm25=BM25(input);
	var weight=[];
	var weight_sum=[];
	var vertex =[];
	var i,j,iter=0;
	for (i=0;i<input.length;i++) {
		const scores=bm25.simAll(input[i]);
		weight[i]=scores;
		weight_sum[i]=scores.reduce((p,s)=>p+s,0) - scores[i]; //減去自己的分
		if (weight_sum[i]<0) { //防暴衝
			weight_sum[i]=0;
			weight[i]=scores.map(()=>0);
		}
		vertex[i]=1.0 ;
	}

	while (iter<MAXITER){
		var m=[];
		var max_diff=0,diff;
		for (i=0;i<input.length;i++){
			m[i]=1-DAMPING;
			for (j=0;j<input.length;j++){
				if (i===j || weight_sum[j]===0) continue;
				var w=weight[j][i]/weight_sum[j];
				var s=(DAMPING * w * vertex[j]);
				m[i] += s;
			}
			diff = Math.abs(m[i]-vertex[i]);
			if(diff>max_diff) max_diff=diff;
		}
		vertex=m;
		if (max_diff<MINDIFF) break;
		iter++;
	}
	//sort it
	var arr=vertex.map((s,idx)=>[s,input[idx].join(" "),idx]);
	arr.sort((a,b)=>b[0]-a[0]);
	return arr;
}

if (typeof module!=="undefined") module.exports=keyPhrase;
else window.textRank=keyPhrase;
if (typeof process!=="undefined"&&process.argv.length==2){
		const data=(require("./bm25testdata.js"));
		const out=keyPhrase(data);
		console.log(out.join("\n"));
}