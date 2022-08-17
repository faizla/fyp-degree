import numpy as np
import pandas as pd
import re
from nltk import TweetTokenizer
from nltk.stem import PorterStemmer
import pickle
from sklearn.metrics import accuracy_score,confusion_matrix
# load the model from disk

import os.path
BASE = os.path.dirname(os.path.abspath(__file__))



loaded_model = pickle.load(open(os.path.join(BASE,'file/cvsent_model.sav'), 'rb'))
cv_loaded = pickle.load(open(os.path.join(BASE,'file/cv_fitted.sav'), 'rb'))
tvc_loaded = pickle.load(open(os.path.join(BASE,'file/tvc_fitted.sav'), 'rb'))

class Cleaner():
	def preprocess_tweet(self,tweet):
	    '''
	    Preprocess the text in a single tweet
	    arguments: tweet = a single tweet in form of string 
	    '''
	    #convert the tweet to lower case just for convinient purpose
	    tweet = tweet.lower()
	    #convert all urls to string "URL"
	    tweet = re.sub('((www\.[^\s]+)|(https?://[^\s]+))','',tweet)
	    #convert all @username to "AT_USER"
	    tweet = re.sub('@[^\s]+','', tweet)#tweet = re.sub('@[^\s]+','AT_USER', tweet)
	    #correct all multiple white spaces to a single white space
	    tweet = re.sub('[\s]+', ' ', tweet)
	    #convert "#topic" to just "topic"
	    tweet = re.sub(r'#([^\s]+)', r'\1', tweet)

	    porter = PorterStemmer()
	    
	    tokenizer = TweetTokenizer()
	    token_tweet=tokenizer.tokenize(tweet)
	    stem_sentence=[]
	    for word in token_tweet:
	        stem_sentence.append(porter.stem(word))
	        stem_sentence.append(' ')
	    return self.get_sentiment(''.join(stem_sentence))

	def get_sentiment(self,tweet):
		# Transform the review column
		tweet = [tweet]
		cv_transformhold = cv_loaded.transform(tweet)
		y_predicted = loaded_model.predict(cv_transformhold)
		
		return str(y_predicted).strip('[]')
