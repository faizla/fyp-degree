# fyp-degree
Real Time Event Feedback Through Twitter Hashtag Keyword.

This is my final year project developed in 2019, so most of the dependencies is outdated already, however you can still run it by installing the required dependencies from requirement.txt attached in the project.

This project entitled "Event Feedback Analytic and Visualization Through Twitter Social Platform" that help event organizer or planner extract, analyze and visualize feedback from Twitter's data (tweets) in real-time.

Details of the project :
- Use Django web framework to utilize third-party python libraries.
- Utilize Twitter Streaming API to extract tweet in real-time and push the tweet using Django-channels that enables WebSocket connection between web server and client.
- Utilize Twitter Searching API to extract popular historical tweets.
- Use Tweepy python library for accessing those Twitter APIs.
- Implement a Naive Bayes algorithm to determine the sentiment of the tweets using scikit-learn python library.
- Use D3.js to create custom data visualization in the web browser (line charts, choropleth map and etc)
- Implement workers (django-channels) in order to run two subsequent API(searching and streaming) at the same time. (This approach can be improved by using websocket technology)


Example of real time analysis on #LIVMUN (Liverpool vs Manchester United 2018 16/12/2018)

<img width="1230" alt="Screen Shot 2020-01-20 at 2 26 33 AM" src="https://user-images.githubusercontent.com/55307820/216111512-16e328bb-9e3c-4559-b037-d9ba2bd94964.png">

<img width=1230 alt="gif fyp degree" src="https://user-images.githubusercontent.com/55307820/216255203-27e097f2-8d44-47f3-8721-0a601de8cd2a.gif">
<!-- ![fyp-gif](https://user-images.githubusercontent.com/55307820/216255203-27e097f2-8d44-47f3-8721-0a601de8cd2a.gif)
 -->
Example of historical analysis on #LIVMUN (Liverpool vs Manchester United 2018 16/12/2018)
