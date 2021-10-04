var a = "Thịt bò kobe";
var b = "thịt dê"
a= a.toLocaleLowerCase();
b= b.toLocaleLowerCase();
let re = new RegExp('bó');

console.log(b.toLocaleLowerCase())
var c = a.includes(b);
console.log(c)