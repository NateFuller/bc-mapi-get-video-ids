var http = require('http');

function getItemCount(callback) {
	var options = {
		host: 'api.brightcove.com',
		path: '/services/library?command=search_videos&page_size=1&video_fields=id&sort_by=DISPLAY_NAME%3AASC&page_number=0&get_item_count=true&token=' + token
	}

	http.get(options, function(resp) {
		resp.setEncoding('utf8');
		var str = ''
		resp.on('data', function(chunk) {
			str += chunk
		});
		resp.on('end', function() {
			var resp_json = JSON.parse(str);
			var item_count = resp_json.total_count;
			var page_count = Math.ceil(item_count/ITEMS_PER_PAGE);
			callback(item_count, page_count)
		});
	}).on('error', function(e) {
		console.log('Got error: ' + e.message);
		process.exit();
	});

}

function getVideoIds() {

	getItemCount(function(item_count, page_count) {
		console.log('ITEMS RETURNED: ' + item_count);
		console.log('PAGE COUNT: ' + page_count);
		var options = {
			host: 'api.brightcove.com',
			path: '/services/library?command=search_videos&page_size=' + ITEMS_PER_PAGE + '&video_fields=id&token=' + token
		}
		var video_ids = [];

		var urls = [];
		var responses = [];
		var completed_requests = 0;

		for (var page_number = 0; page_number < page_count; page_number++) {
			urls.push({host:options.host, path:options.path + '&page_number=' + page_number});
		}

		for (url in urls) {
			var req = http.request(urls[url], function(res) {
				// console.log('STATUS: ' + res.statusCode);
				// console.log('HEADERS: ' + JSON.stringify(res.headers));
				res.setEncoding('utf8');
				var str = ''
				res.on('data', function(chunk) {
					str += chunk;
				});
				res.on('end', function() {
					for (video_id in JSON.parse(str).items)
						video_ids.push(JSON.parse(str).items[video_id].id)
					completed_requests++;
					if (completed_requests == urls.length) {
						console.log("all done!");
						console.log("Number of video IDs returned: " + video_ids.length);
						testVideoIdsAreUnique(video_ids);
					}
				});
			});

			req.on('error', function(e) {
				console.log('problem with request: ' + e.message);
			});

			req.end();
		}
	});	
}

function testVideoIdsAreUnique(video_ids) {
	var sorted_arr = video_ids.sort();
	var duplicates = [];
	for (var i = 0; i < sorted_arr.length - 1; i++) {
		if (sorted_arr[i + 1] === sorted_arr[i]) {
			duplicates.push(sorted_arr[i]);
		}
	}
	if (duplicates.length > 0) {
		console.log("Duplicates found: ", duplicates);
	} else {
		console.log("All video IDs are unique!");
	}
}

if (process.argv.length !== 4) {
	console.log('USAGE: node getVideoIds.js [publisher_id] [mapi_read_token]');
	process.exit();
}

var pub_id = process.argv[2]
var token = process.argv[3]

var ITEMS_PER_PAGE = 100;

getVideoIds();