var http = require('http');

if (process.argv.length !== 4) {
	console.log("USAGE: node getVideoIds.js [publisher_id] [mapi_read_token]");
	process.exit();
}

var pub_id = process.argv[2]
var token = process.argv[3]
var item_count = -1;
var page_count = -1;

var ITEMS_PER_PAGE = 100;

getItemCount();

function getItemCount(callback) {
	var options = {
		host: 'api.brightcove.com',
		path: '/services/library?command=search_videos&page_size=1&video_fields=id&sort_by=DISPLAY_NAME%3AASC&page_number=0&get_item_count=true&token=' + token
	}

	http.get(options, function(resp) {
		resp.setEncoding('utf8');
		var str = ""
		resp.on('data', function(chunk) {
			str += chunk
		});
		resp.on('end', function() {
			var resp_json = JSON.parse(str);
			item_count = resp_json.total_count;
			page_count = Math.ceil(item_count/ITEMS_PER_PAGE);
			console.log("ITEMS RETURNED: " + resp_json.total_count);
			console.log("PAGE COUNT: " + Math.ceil(page_count));
		});
	}).on("error", function(e) {
		console.log("Got error: " + e.message);
		process.exit();
	});

}

function getVideoIds(num_items, callback) {
	var options = {
		host: 'api.brightcove.com',
		path: '/services/library?command=search_videos&page_size=100&video_fields=id&page_number=0&token='
	}
}

