onmessage= function(a){
	res = 1;
	a = a.data;postMessage({i:a.i+1});
	func = a.c;
	try {
		tmp = new Function(func)();
	} catch(e) {
		console.log(e);
		res = e.message;
	}
	postMessage({r: res, i:a.i});
};

