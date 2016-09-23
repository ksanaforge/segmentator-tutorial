var segmentator=require("./index");
//var out=segmentator.segmenttext("中國是一個發展中國家");//發展中國家  有意見分歧，
var out=segmentator.segmenttext("有意思，中國？");//發展中國家  有意見分歧，
//var out=segmentator.segmenttext("中國是發展中國家");//發展中國家  有意見分歧，
console.log(out);
