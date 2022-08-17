#import websocket that encode/decode data in json
from channels.generic.websocket import WebsocketConsumer

from django.http import HttpResponse
from django import template
from django.template.loader import get_template
from django.conf import settings


import json
from tweepy.streaming import StreamListener
from tweepy import Stream
from .twitter import TwitterListener, TwitterClient
from . import sentiment
from django.core.serializers.json import DjangoJSONEncoder

from datetime import datetime

from channels.consumer import SyncConsumer
from asgiref.sync import async_to_sync

import os.path

BASE = os.path.dirname(os.path.abspath(__file__))



class BackGroundTaskConsumer(SyncConsumer):
    def task_a(self,message):
        room_name = message['room']
        sTweets = TwitterClient()
        clean = sentiment.Cleaner()
        file_name = room_name+".json"

        result=sTweets.searching_tweets(room_name)
        listOfTweets = []
        for tweet in result:
                dict_ = {
                        'id': tweet.id_str,
                        'date': datetime.strftime(tweet.created_at,'%Y-%m-%dT%H:%M:%SZ'),#sTweets.dateFormat(tweet.created_at),
                        'screen_name': tweet.user.screen_name,
                        'name':tweet.user.name,
                        'text': tweet.text,
                        'source': sTweets.sourceFormat(tweet.source),
                        'user_location': tweet.user.location,
                        'profile_pic': tweet.user.profile_image_url_https,
                        'tweet_coordinates': tweet.coordinates,
                        'follower_count':tweet.user.followers_count,
                        'retweet_count': tweet.retweet_count,
                        'favorite_count': tweet.favorite_count,
                        'tweet_sentiment':clean.preprocess_tweet(tweet.text)
                }
                listOfTweets.append(dict_)
                print(dict_['date'])

        #Check if the file exist
        if os.path.exists('chat/static/chat/summaryStatic/data/'+file_name):
            print("EXIST")
            #if exist read the file    
            with open('chat/static/chat/summaryStatic/data/'+file_name) as fn:
                first_list = json.load(fn)
                #append it to the list of tweets that is streaming

                first_list.extend(listOfTweets)
                print(len(first_list))
                first_list=[i for n, i in enumerate(first_list) if i not in first_list[n + 1:]]
                print(len(first_list))


            #store it back to the file once appended
            with open('chat/static/chat/summaryStatic/data/'+file_name, 'w') as an:
                json.dump(first_list, an, indent=4)
        else:
            print("NOT EXIST")
            #if not exist create new file and store it
            with open('chat/static/chat/summaryStatic/data/'+file_name, 'w') as an:
                json.dump(listOfTweets, an, indent=4)

        print(room_name+" searching done")


class ChatConsumer(WebsocketConsumer):

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        print(self.room_name)

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()


    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

   #receive message from client
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        if message is not None:
            print("RECEIVED")
            self.start_listen(message)
        elif command == "leave":
            self.disconnect()
        
    def send_room(self, message):
        print("SEND TO GROUPS")
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
            }
        )
       

    # Receive message from room group
    def chat_message(self, event):
        print("PRINT TWEETS")
        print("================================================================================================")
        message = event['message']
        print(message)
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))


    def start_listen(self,message):
        
        print("START LISTENING")
        #to initialize file name
        file_name = message+".json"
        listener = TwitterListener(self.send_room, self.filter_data, file_name)

        print("START AUTHENTICATE")
        self.stream = Stream(settings.TWEEPY_AUTH, listener)
        print("START FILTERING")
        self.stream.filter(track=['#'+message],languages=["en"], is_async=True)
        

    def filter_data(self, data):
        """
        (mazinz): Implement to Filter out tweets not by our user 
        (tweepy doesn't do this by default)
        """

        return True

