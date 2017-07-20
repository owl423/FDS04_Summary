let promise = new Promise(function(resolve, reject){
 // 무언가를 한다..
  if(// 그 무언가가 성공했으면){
    resolve("성공함");
    } else {
    reject(Error("실패함"));
    }
}