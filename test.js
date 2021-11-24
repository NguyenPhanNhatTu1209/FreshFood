function formatDate(date) {
	var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

	if (month.length < 2) 
			month = '0' + month;
	if (day.length < 2) 
			day = '0' + day;

	return [year, month, day].join('-');
}
var day = Date.now();
var x = formatDate(day);
var quotient = Math.floor(8.1);
 console.log(x) // { 'key3.abc': 'value3', 'key2.abc': 'value3'}
 console.log(quotient)