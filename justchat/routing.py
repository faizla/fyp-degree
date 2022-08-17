from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter, ChannelNameRouter
import chat.routing
from chat.consumer import BackGroundTaskConsumer

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'channel': ChannelNameRouter({
    		'background-tasks': BackGroundTaskConsumer,
    }),
    'websocket': AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
    
})