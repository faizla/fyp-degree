from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
from django.http import HttpResponse
from django import template
from django.template.loader import get_template
 
consumer_key="XxBGGkJJpB87uwiy5iDghq7Vg"
consumer_secret="mS8JiaxIhd44LNb1QWuYthcC6rNHVC5yc7V0zX18qpCcySPgY6"
 
access_token="248714285-mJiDC9ji7ttPX5fSYG8vPHHcjtJn1gTP5nyh6JqV"
access_token_secret="9d0XEJ0ib4CZlWZ2wTWIKqPnmzHbcqqIDOelim65PFNDV"

class StdOutListener(ChatConsumer, StreamListener):

    def __init__(self,api=None):
        super(StdOutListener,self).__init__()
        self.cnt = 1
        self.end = 5
        self.list = []
        print('started')
 
    def on_status(self, status):

        print('middlefirst')
        if self.end >= self.cnt:
            print('middle')
            print(status.text)
            # tweets = {}
            # tweets['text'] = status.text
            # tweets['created_at'] = status.created_at
            # tweets['geo'] = status.geo
            # tweets['source'] = status.source
            self.list.append(status._json['text'])
            self.cnt+=1
            #self.chat_message()
        


        else:
            print('end')
            return False
 
    def on_error(self, status):
        print(status)