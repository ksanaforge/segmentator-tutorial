/*translated from Java http://www.hankcs.com/nlp/textrank-algorithm-to-extract-the-keywords-java-implementation.html
TextRank Paper http://web.eecs.umich.edu/~mihalcea/papers/mihalcea.emnlp04.pdf*/
const TermNeighbor=require("./textrankdata.js");

const maxIteration=200, //最多迭代次數
      min_diff=0.001,   //收歛閥值, 小於這個差異就不再迭代
      damping=0.85     //阻尼系數。damping factor，沿用Google PageRank
                       //此系數不能超過1，越接近1，收歛的速度越慢

var score={};           //上一次迭代每個詞的分數

for (var i=0;i<maxIteration;i++){
	max_diff=0; //此次迭代最大的差異
  var now={}; //此次迭代每個詞的分數
	for (var term in TermNeighbor) { //遍歷每一個詞
		now[term]=1-damping;           //一開始所有term的基本分是 1-d 
		for (var j=0;j<TermNeighbor[term].length;j++) { // 遍歷key的相鄰詞
			const neighbor = TermNeighbor[term][j];
			//neighbor 的相鄰詞個數
			const neighborCount = TermNeighbor[neighbor].length; 
			//不投給自己，neighbor 沒有相鄰詞也不投票
			if (term===neighbor || !neighborCount) continue; 
			//neighbor 上一回迭代的分數，neighbor投給term的票的基本效力
			const vote_to_term    = score[neighbor]||0;
			//一個詞的相鄰詞越多，票的效力越小。 
			const vote_importance =  vote_to_term / neighborCount ;
			//根據PageRank 不按超連結而離開此網頁的機率是0.15
			//因此投給相鄰詞的機率最多剩下的85%
			//累加到term的得分 （阻尼牛頓收歛法 Dmaping Newton's Method）
			now[term] += damping * vote_importance ;
		}
		//與上次迭代的差異
		const score_diff=Math.abs(now[term] - score[term]);
 		max_diff = Math.max(max_diff, score_diff);
  }
  //保存此次成果
  score=now;
  if (max_diff <= min_diff) { //沒有比 min_diff 更大的差異，無須再迭代
   	console.log('迭代次數',i);
   	break;
  }
}

var out=[];
//轉成二維陣列排序
for (var key in now) out.push([key,now[key]]);
//分數由大排到小
out.sort((a,b)=>b[1]-a[1]);

out.forEach((item)=>item[1]=item[1].toFixed(3));
console.log(JSON.stringify(out));