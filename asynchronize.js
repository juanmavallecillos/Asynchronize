
// Auto extension server

http = require('http')
fs = require('fs')
url = require('url')
path = require('path')

function newType(extension, mime) {
	return { extension: extension, mime: mime }
}

var fileTypes = [
	newType('bin',  'application/octet-stream'),
	newType('bz2',  'application/x-bzip2'),
	newType('doc',  'application/msword'),
	newType('gif',  'image/gif'),
	newType('htm',  'text/html'),
	newType('html', 'text/html'),
	newType('jpeg', 'image/jpeg'),
	newType('jpg',  'image/jpeg'),
	newType('js',   'application/javascript'),
	newType('odt',  'application/vnd.oasis.opendocument.text'),
	newType('png',  'image/png'),
	newType('pdf',  'application/pdf'),
	newType('svg',  'image/svg+xml'),
	newType('txt',  'text/plain'),
	newType('ttf',  'font/ttf'),
	newType('zip',  'application/zip'),
];
/*
function serverFunction(request, response) {

	var myUrl = url.parse(request.url)
	var myPath = path.parse(myUrl.pathname)
	var basename = myPath.name

	console.log("Incoming request for file " + basename)

	for (var i = 0; i < fileTypes.length; i++) {
		var t = fileTypes[i]
		var file = basename + '.' + t.extension

		if (fs.existsSync(file)) {
			var contents = fs.readFileSync(file)
			response.writeHead(200, {'Content-Type': t.mime})
			response.write(contents)
			response.end()

			return
		}
	}

	// ! found
	response.writeHead(404, {'Content-Type': 'text/plain'})
	response.write('404 Not found')
	response.end()
}*/


// TODO: create an equivalent serverFunction with only asynchronous fs operations.
// TODO: Only try a new fs.access after the previous one has failed.
// OBLIGATORIO

function serverFunction(request, response) {
	
	var myUrl = url.parse(request.url)
	var myPath = path.parse(myUrl.pathname)
	var basename = myPath.name


	console.log("Incoming request for file " + basename)

	// ...

	function readIfPossible(basename,n){
		if(n < fileTypes.length){
			var t = fileTypes[n]
			var file = basename + '.' + t.extension
			fs.access(file, function(err) {
				if (err) {
					readIfPossible(basename,n+1)
				} 
				else {
					fs.readFile(file,function(err,res) {
					response.writeHead(200, {'Content-Type': t.mime})
					response.write(res)
					response.end()
				})
			}
		})
		}
		else {
			response.writeHead(404, {'Content-Type': 'text/plain'})
			response.write('404 Not found')
			response.end()
		}	
	}
	readIfPossible(basename,0)
}

// OPCIONAL




http.createServer(serverFunction).listen(8081);

console.log('Server running at http://localhost:8081/');
