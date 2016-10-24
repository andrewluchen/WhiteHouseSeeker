from django.http import HttpResponse
from django.utils import timezone
from django.views.generic import View

from rest_framework.renderers import JSONRenderer

from usgs.election.models import Election
from usgs.election.serializers import ElectionSerializer

from usgs.utils import get_legislative_body, validate_character


class ElectionsView(View):

    def get(self, request):
        election_objs = Election.objects.all()
        if (request.GET.get('active')):
            election_objs = election_objs.filter(winner__isnull=True)
        elections = JSONRenderer().render(ElectionSerializer(election_objs, many=True).data)
        return HttpResponse(elections, content_type='application/json')
