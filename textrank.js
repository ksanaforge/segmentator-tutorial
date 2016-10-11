/*translated from Java http://www.hankcs.com/nlp/textrank-algorithm-to-extract-the-keywords-java-implementation.html
TextRank Paper http://web.eecs.umich.edu/~mihalcea/papers/mihalcea.emnlp04.pdf*/
const createTermNeighbor=function(text){
	const WINSIZE=4;
	var termlist=text.split(/ +/);
	termlist=termlist.filter(function(w){return w.trim()});//remove empty
	var i,j,w,out={};
	for (var i=0;i<termlist.length;i++) {
		w=termlist[i];
		if (!out[w]) out[w]={};
		for (j=i-WINSIZE;j<i+WINSIZE;j++) {
			if (j<0 || j>termlist.length-1) continue;
			if (i!=j) out[w][termlist[j]]=true;
		}
	}
	for (w in out) {//轉為陣列
		out[w]=Object.keys(out[w]);
	}
	return out;
}
const textRank=function(text) {
	const MAXITER=200,     //最多迭代次數
      MINDIFF=0.001,   //收歛閥值, 小於這個差異就不再迭代
      DAMPING=0.85     //阻尼系數。damping factor，沿用Google PageRank
                       //此系數不能超過1，越接近1，收歛的速度越慢

	var score={}; //上一次迭代每個詞的分數
	var iter=0;//迭代次數
	const termNeighbor=createTermNeighbor(text);
	while (iter<MAXITER){
		max_diff=0; //此次迭代最大的差異
	  var now={}; //此次迭代每個詞的分數
		for (var term in termNeighbor) { //遍歷每一個詞
			now[term]=1-DAMPING;           //一開始所有term的基本分是 1-d 
			for (var i=0;i<termNeighbor[term].length;i++) { // 遍歷key的相鄰詞
				const neighbor = termNeighbor[term][i];
				//neighbor 的相鄰詞個數
				const neighborCount = termNeighbor[neighbor].length; 
				//不投給自己，neighbor 沒有相鄰詞也不投票
				if (term===neighbor || !neighborCount) continue; 
				//neighbor 上一回迭代的分數，neighbor投給term的票的基本效力
				const vote_to_term    = score[neighbor]||0;
				//一個詞的相鄰詞越多，票的效力越小。 
				const vote_importance =  vote_to_term / neighborCount ;
				//根據PageRank 不按超連結而離開此網頁的機率是0.15
				//因此投給相鄰詞的機率最多剩下的85%
				//累加到term的得分 （阻尼牛頓收歛法 Dmaping Newton's Method）
				now[term] += DAMPING * vote_importance ;
			} 
			//與上次迭代的差異
			const score_diff=Math.abs(now[term] - score[term]);
	 		max_diff = Math.max(max_diff, score_diff);
	  }
	 	iter++;
	  score=now; //保存此次成果
	  if (max_diff <= MINDIFF) { //沒有比 MINDIFF 更大的差異，無須再迭代
	   	console.log('迭代次數',iter);
	   	break;
	  }
	}
	var out=[]; //轉成二維陣列並排序
	for (var key in now) {
		out.push([key,now[key]]);
	}
	out.sort((a,b)=>b[1]-a[1]); //分數由大排到小
	return {output:out, neighbor:termNeighbor};
}
if (typeof module!=="undefined") module.exports=textRank;
else window.textRank=textRank;
if (typeof process!=="undefined"&&process.argv.length==2){
	const data="程序員 英文 程序 開發 維護 專業 人員 程序員 分為 程序 設計 人員 程序 編碼 人員 界限 特別 中國 軟件 人員 分為 程序員 高級 程序員 系統 分析員 項目 經理"
	const out=textRank(data);
	console.log(JSON.stringify(out));
}