from django.http import HttpResponse
from django.utils import timezone
from django.views.generic import View

from rest_framework.renderers import JSONRenderer

from usgs.news.models import Tweet
from usgs.news.serializers import TweetSerializer


class NewTweetView(View):

    def post(self, request):
        tweet = Tweet(
            author=request.user,
            handle=request.POST.get('handle'),
            tweet=request.POST.get('tweet'),
            hashtags=request.POST.get('hashtags'),
        )
        tweet.save()
        tweet.ups.add(request.user)
        return HttpResponse(status=200)


class TweetView(View):

    def post(self, request, pk):
        assert(request.user.is_authenticated())
        tweet = Tweet.objects.get(id=pk)
        vote = request.POST.get('vote')
        if (vote == '+'):
            tweet.ups.add(request.user)
            tweet.downs.remove(request.user)
            tweet.save()
            return HttpResponse(status=200)
        elif (vote == '-'):
            tweet.ups.remove(request.user)
            tweet.downs.add(request.user)
            tweet.save()
            return HttpResponse(status=200)


class TweetsView(View):

    def get(self, request):
        tweet_objs = Tweet.objects.all()
        tweets = JSONRenderer().render(TweetSerializer(tweet_objs, many=True).data)
        return HttpResponse(tweets, content_type='application/json')
