# Brightcove Media API
## Pull List of Video IDs for Publisher
This is a NodeJS script that pulls a list of video IDs for a publisher using the Media API

## Dependencies
### [NodeJS](https://nodejs.org/en/)
This script was written with NodeJS `v4.2.3` and npm `2.14.7.`
### [Brightcove Video Cloud](http://videocloud.brightcove.com)
You will need to have an account level of Express III, Professional, or Enterprise in
order to obtain a Media API READ token required to use this script

## How does it work?
It uses the Video Cloud Media API's `search_videos` method to iterate over the Media API response and store Video IDs
in a text file as output.

## Output options
You can switch between a comma separated list or a new-line separated list.
#### Comma Separated
In the `testVideoIdsAreUnique`, you should change the line that makes the callback to:
```
callback(video_ids, 'comma');
```
#### New-Line Separated
In the `testVideoIdsAreUnique`, you should change the line that makes the callback to:
```
callback(video_ids, 'newline');
```

## Performance
On an account with over 29 thousand active videos, this script obtained the list of video IDs in 2.174 seconds.
