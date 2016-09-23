/*translated from Java http://www.hankcs.com/nlp/textrank-algorithm-to-extract-the-keywords-java-implementation.html
TextRank Paper http://web.eecs.umich.edu/~mihalcea/papers/mihalcea.emnlp04.pdf
*/
var data=require("./textrankdata.js");
//載入JSON 並將相鄰詞Array轉為Set
for ( key in data) {
	data[key]=new Set(data[key]);
}
const d=0.85,         //阻尼系數。damping factor，沿用Google PageRank
      min_diff=0.001, //收歛閥值, 小於這個差異就不再迭代
      maxIter=500;    //最多迭代次數
var prev={}, //記錄上一次迭代每個詞的分數
    now={};     //此次迭代每個詞的分數
for (var i=0;i<maxIter;i++){
	max_diff=0; //此次迭代最大的差異
  now={};
	for (var key in data) { //遍歷每一個詞
		now[key]=1-d;         //重設該詞的分數為初始值
		for (other of data[key]) { // 遍歷key的相鄰詞
			if (key==other || !data[key].size)  continue; //如果沒有相鄰詞或是自己則不投票
			var o=prev[other]||0;    //取得上次迭代的分數
			//一個詞的相鄰詞越多，票的效力越小。 
			//根據PageRank 不按超連結而離開此網頁的機率是0.15
			//因此投給相鄰詞的機率不會超過是剩下的85%
			now[key]+= d * o / data[other].size;
		}
		//與上次迭代的差異
		const key_diff=Math.abs(now[key] - prev[key]);
 		max_diff = Math.max(max_diff, key_diff);
  }
  prev=now;
  if (max_diff <= min_diff) { //沒有比 min_diff 更大的差異
   	console.log('迭代次數',i);
   	break;
  }
}

var out=[]
for (var key in now) out.push([key,now[key].toFixed(3)]);
out.sort((a,b)=>b[1]-a[1]);

console.log(JSON.stringify(out));