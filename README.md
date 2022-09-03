# fyp-degree
Real Time Event Feedback Through Twitter Hashtag Keyword.

This is my final year project developed in 2019, so most of the dependencies is quite outdated already, however you can still run it by installing the required dependencies from requirement.txt attached in the project.

This project entitled "Event Feedback Analytic and Visualization Through Twitter Social Platform" that help event organizer or planner extract, analyze and visualize feedback from Twitter's data (tweets) in real-time.

Details of the project :
- Use Django web framework to utilize third-party python libraries.
- Utilize Twitter Streaming API to extract tweet in real-time and push the tweet using Django-channels that enables WebSocket connection between web server and client.
- Utilize Twitter Searching API to extract popular historical tweets.
- Use Tweepy python library for accessing those Twitter APIs.
- Implement a Naive Bayes algorithm to determine the sentiment of the tweets using scikit-learn python library.
- Use D3.js to create custom data visualization in the web browser (line charts, choropleth map and etc)
- Implement workers (django-channels) in order to run two subsequent API(searching and streaming) at the same time. (This approach can be improved by using websocket technology)


Example of real time analysis
<img width="1440" alt="Screen Shot 2020-01-20 at 2 26 33 AM" src="https://user-images.githubusercontent.com/55307820/188265522-dc9704bd-81f9-4de6-a06a-5ba8d3244b11.png">
<img width="1440" alt=" " src="https://user-images.githubusercontent.com/55307820/188265541-d6eb6830-13ef-4f3e-9f75-1c17da79f1f4.png">
