from tweepy.streaming import StreamListener
from django.conf import settings
from datetime import datetime
from dateutil import tz

from . import sentiment
from tweepy import Stream,API,Cursor
import numpy as np
import pandas as pd
import re
import json
# get malaysia timezone
tzs = tz.gettz('Asia/Kuala_Lumpur')
import time
from django.core.serializers.json import DjangoJSONEncoder




#TWITTER CLIENT
class TwitterClient():
    def __init__(self,twitter_user=None):
        self.auth = TwitterAuthenticator().authenticate_twitter_app()
        self.twitter_client = API(self.auth, wait_on_rate_limit=True)
        self.twitter_user=twitter_user
     
    def get_twitter_client_api(self):
        return self.twitter_client
    
    def limit_handled(cursor):
        while True:
            try:
                yield cursor.next()
            except tweepy.RateLimitError:
                time.sleep(15 * 60)
                   
    def searching_tweets(self,query):
        data = Cursor(self.twitter_client.search, q='#'+query+' -filter:retweets', lang='en').items(200)
        # tweets=[]
        # for tweet in data:
        #     tweets.append(tweet._json)       
        return data

    def dateFormat(self,date):
        # To initialize the utc zone
        from_zone = tz.tzutc()
        # Convert zone become utc
        utc = date
        utc = utc.replace(tzinfo=from_zone)
        # Convert the utc zone to malaysia zone
        central = utc.astimezone(tzs)
        return central #datetime.strftime(central,'%Y-%m-%dT%H:%M:%S')

    def sourceFormat(self,source):
        if (source == "Twitter for iPhone" or source == "Twitter for iPad"):
            return "iOS"
        if (source == "Twitter for Android"):
            return "Android"
        else:
            return "Web Client"
        
            
#AUTHENTICATION
class TwitterAuthenticator():
    
    def authenticate_twitter_app(self):      
        return settings.TWEEPY_AUTH
    

        
class TwitterListener(StreamListener):
    #initialize contructor
    def __init__(self, send_room, filter_func, file_name):
        super(TwitterListener, self).__init__()
        self.send_room = send_room
        self.filter_func = filter_func
        self.file_name = file_name
        self.start = time.time()
        self.listOfTweets = []
        self.sTweets = TwitterClient()


        #self.sTweets = TwitterClient()
        #self.counter = 0

    def on_status(self, status):

        try:
            # To exclude retweet
            if (not status.retweeted) and ('RT @' not in status.text): #and ('RT @' not in status.text):
                #self.counter+=1
                clean = sentiment.Cleaner()
                print("START STREAMINGG")
                if (self.filter_func(status)):
                        dict_ = {
                                'id': status.id_str,
                                'date': datetime.strftime(status.created_at,'%Y-%m-%dT%H:%M:%SZ'),
                                #'date': self.sTweets.dateFormat(status.created_at),
                                'screen_name': status.user.screen_name,
                                'name':status.user.name,
                                'text': status.text,
                                'source': self.sTweets.sourceFormat(status.source),
                                'user_location': status.user.location,
                                'profile_pic': status.user.profile_image_url_https,
                                'tweet_coordinates': status.coordinates,
                                'tweet_geo': status.geo,
                                'follower_count':status.user.followers_count,
                                'retweet_count': status.retweet_count,
                                'favorite_count': status.favorite_count,
                                'tweet_sentiment':clean.preprocess_tweet(status.text)
                                }
                        if status.place:
                            dict_['tweet_place'] = status.place.bounding_box.coordinates[0][0]
                        self.listOfTweets.append(dict_)


                        #combine file after 50 second execution time
                        if time.time() >= self.start+50:

                            #open and read the searching file and store in the list              
                            with open('chat/static/chat/summaryStatic/data/'+self.file_name) as fn:
                                first_list = json.load(fn)

                            #combine previous searching list and streaming list
                            first_list.extend(self.listOfTweets)
                            print (first_list[-1])

                            #Insert all the data back to file once combined
                            with open('chat/static/chat/summaryStatic/data/'+self.file_name, 'w') as an:
                                json.dump(first_list, an, indent=4)

                            #reset the list and time
                            first_list = []
                            self.listOfTweets = []
                            self.start = time.time()

                        #SEND TO ROOM
                        self.send_room(dict_)
        except BaseException as e:
            print("Error on_status %s" % str(e))
        return True

    #Twitter error list : https://dev.twitter.com/overview/api/response-codes
    def on_error(self, status):
        if (status == 420):
            return False
        if (status == 403):
            print("The request is recieved but it has been refused or access is not allowed. Maybe limit is triggered")
            return False
