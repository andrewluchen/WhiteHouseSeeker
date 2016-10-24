from django.http import HttpResponse
from django.utils import timezone
from django.views.generic import View

from rest_framework.renderers import JSONRenderer

from usgs.character.models import Character
from usgs.election.models import Election, Campaign
from usgs.election.serializers import ElectionSerializer, CampaignSerializer

from usgs.utils import validate_character


class NewElectionView(View):

    def post(self, request):
        election = Election(
            description=request.POST.get('description'),
            year=request.POST.get('year'),
        )
        election.save()
        return HttpResponse(status=200)


class ElectionView(View):

    def post(self, request, pk):
        action = request.POST.get('action')
        if (action == 'file-candidate'):
            character_id = request.POST.get('character_id')
            character = Character.objects.get(id=character_id)
            validate_character(request.user, character)
            election = Election.objects.get(id=pk)
            campaign = Campaign(
                election=election,
                candidate=character,
                description=request.POST.get('campaign_name')
            )
            campaign.save()
            return HttpResponse(status=200)


class ElectionsView(View):

    def get(self, request):
        election_objs = Election.objects.all()
        if (request.GET.get('active')):
            election_objs = election_objs.filter(winner__isnull=True)
        election_objs = sorted(election_objs.all(), key=lambda e:e.year)
        elections = JSONRenderer().render(ElectionSerializer(election_objs, many=True).data)
        return HttpResponse(elections, content_type='application/json')


class CampaignView(View):

    def get(self, request, pk):
        campaign_obj = Campaign.objects.get(id=pk)
        campaign = JSONRenderer().render(CampaignSerializer(campaign_obj).data)
        return HttpResponse(campaign, content_type='application/json')

    def post(self, request, pk):
        campaign = Campaign.objects.get(id=pk)
        action = request.POST.get('action')
        if (action == 'withdraw'):
            character_id = request.POST.get('character_id')
            character = Character.objects.get(id=character_id)
            validate_character(request.user, character)
            assert(campaign.candidate.id == character.id)

            campaign.withdrawn = True
            campaign.save()
            return HttpResponse(status=200)
        return HttpResponse(status=400)
