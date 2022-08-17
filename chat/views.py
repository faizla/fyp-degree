from django.shortcuts import render

from django.utils.safestring import mark_safe
import json
from . import twitter,sentiment
from django.core.serializers.json import DjangoJSONEncoder
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

# Create your views here.
# chat/views.py
channel_layer=get_channel_layer()

def index(request):
	return render(request, 'chat/index.html', {})


def realtime(request, room_name):

	#To call for background worker to work on their task
	async_to_sync(channel_layer.send)('background-tasks',{'type':'task_a','room':room_name})

	
	return render(request, 'chat/room.html', {
		#Explicitly mark a string as safe for (HTML) output purposes. The returned object can be used everywhere a string is appropriate.
		'room_name_json': mark_safe(json.dumps(room_name)),
		'room_name': room_name,
	})

def summary(request,room_name):
	return render(request, 'chat/summary.html', {'room_name': mark_safe(json.dumps(room_name))})




















# sTweets = twitter.TwitterClient()
	# clean = sentiment.Cleaner()
	# file_name = room_name+".json"

	# result=sTweets.searching_tweets(room_name)
	# print(type(result))
	# listOfTweets = []
	# for tweet in result:
	# 		dict_ = {
	# 				'date': sTweets.dateFormat(tweet.created_at),
	# 				'screen_name': tweet.user.screen_name,
	# 				'name':tweet.user.name,
	# 				'text': tweet.text,
	# 				'source': tweet.source,
	# 				'user_location': tweet.user.location,
	# 				'tweet_coordinates': tweet.coordinates,
	# 				'retweet_count': tweet.retweet_count,
	# 				'favorite_count': tweet.favorite_count,
	# 				'tweet_sentiment':clean.preprocess_tweet(tweet.text)
	# 		}
	# 		listOfTweets.append(dict_)
	# 		print(dict_)
	# 		with open(file_name, 'a') as fn:
	# 			json.dump(dict_, fn, cls=DjangoJSONEncoder)
	# 			print("searching tulis")
		

	#listT = json.dumps(listOfTweets, indent=4, default=json_serial)