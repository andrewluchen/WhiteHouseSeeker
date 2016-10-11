import json

from django.db.models import Q
from django.http import HttpResponse
from django.utils import timezone
from django.views.generic import View

from usgs.bill.models import Bill, BillVersion
from usgs.bill_action.models import Debate, Vote
from usgs.character.models import Character

from usgs.utils import get_legislative_body, validate_character


class NewVoteView(View):

    def post(self, request):
        version_id = request.POST.get('version_id')
        chamber = request.POST.get('chamber')
        hours = request.POST.get('hours')
        billversion = BillVersion.objects.get(id=version_id)
        billversion.modified = timezone.now()
        billversion.closed = True
        billversion.save()
        newbillversion = BillVersion(
            bill=billversion.bill,
            status=BillVersion.BILL_VOTE,
            body=billversion.body,
            modified=timezone.now(),
            location=get_legislative_body(chamber),
        )
        newbillversion.save()
        vote = Vote(
            subject=newbillversion,
            starttime=timezone.now(),
            endtime=timezone.now() + timezone.timedelta(hours=int(hours)),
            location=get_legislative_body(chamber),
        )
        vote.save()
        return HttpResponse(status=200)


class VoteView(View):

    def get(self, request, pk):
        voteobj = Vote.objects.get(id=pk)
        yeas = []
        for i, c in enumerate(voteobj.yeas.all()):
            yeas.append({
                'id': c.id,
                'name': c.description,
                'party': c.party,
            })
        nays = []
        for i, c in enumerate(voteobj.nays.all()):
            nays.append({
                'id': c.id,
                'name': c.description,
                'party': c.party,
            })
        pres = []
        for i, c in enumerate(voteobj.pres.all()):
            pres.append({
                'id': c.id,
                'name': c.description,
                'party': c.party,
            })
        vote = {
            'yeas': yeas,
            'nays': nays,
            'pres': pres,
            'title': voteobj.subject.bill.description,
            'body': voteobj.subject.body,
            'location': voteobj.subject.location.name,
            'starttime': str(voteobj.starttime),
            'starttime': str(voteobj.starttime),
        }
        response = json.dumps(vote)
        return HttpResponse(response, content_type='application/json')

    def post(self, request, pk):
        voteobj = Vote.objects.get(id=pk)
        castvote = request.POST.get('vote')
        character_id = request.POST.get('character_id')
        character = Character.objects.get(id=character_id)
        validate_character(request.user, character)

        if (castvote == 'yea'):
            voteobj.yeas.add(character)
            voteobj.nays.remove(character)
            voteobj.pres.remove(character)
        if (castvote == 'nay'):
            voteobj.yeas.remove(character)
            voteobj.nays.add(character)
            voteobj.pres.remove(character)
        if (castvote == 'present'):
            voteobj.yeas.remove(character)
            voteobj.nays.remove(character)
            voteobj.pres.add(character)
        return HttpResponse(status=200)


class VotesView(View):

    def get(self, request):
        voteobjs = Vote.objects.all()
        now = timezone.now()
        if (request.GET.get('chamber')):
            chamber = get_legislative_body(request.GET.get('chamber'))
            voteobjs = voteobjs.filter(location=chamber)
        if (request.GET.get('active')):
            voteobjs = voteobjs.filter(endtime__gt=now)
        votes = list(voteobjs.values())
        for i, vote in enumerate(votes):
            vote['title'] = voteobjs[i].subject.bill.description
            vote['yeas'] = voteobjs[i].yeas.count()
            vote['nays'] = voteobjs[i].nays.count()
            vote['pres'] = voteobjs[i].pres.count()
            vote['starttime'] = str(vote['starttime'])
            vote['endtime'] = str(vote['endtime']) if vote['endtime'] else None
        response = json.dumps(votes)
        return HttpResponse(response, content_type='application/json')


class NewDebateView(View):

    def post(self, request):
        version_id = request.POST.get('version_id')
        chamber = request.POST.get('chamber')
        hours = request.POST.get('hours')
        billversion = BillVersion.objects.get(id=version_id)
        billversion.modified = timezone.now()
        billversion.closed = True
        billversion.save()
        newbillversion = BillVersion(
            bill=billversion.bill,
            status=BillVersion.BILL_DEBATE,
            body=billversion.body,
            modified=timezone.now(),
            location=get_legislative_body(chamber),
        )
        newbillversion.save()
        endtime = None
        if (hours):
            endtime = timezone.now() + timezone.timedelta(hours=int(hours))
        debate = Debate(
            subject=newbillversion,
            starttime=timezone.now(),
            endtime=endtime,
            location=get_legislative_body(chamber),
        )
        debate.save()
        return HttpResponse(status=200)


class DebateView(View):

    def get(self, request, pk):
        debateobj = Debate.objects.get(id=pk)
        debate = {
            'title': debateobj.subject.bill.description,
            'body': debateobj.subject.body,
            'location': debateobj.subject.location.name,
            'starttime': str(debateobj.starttime),
            'starttime': str(debateobj.starttime),
        }
        response = json.dumps(debate)
        return HttpResponse(response, content_type='application/json')


class DebatesView(View):

    def get(self, request):
        debateobjs = Debate.objects.all()
        now = timezone.now()
        if (request.GET.get('chamber')):
            chamber = get_legislative_body(request.GET.get('chamber'))
            debateobjs = debateobjs.filter(location=chamber)
        if (request.GET.get('active')):
            debateobjs = debateobjs.filter(Q(endtime__gt=now)|Q(endtime__isnull=True))
        debates = list(debateobjs.values())
        for i, debate in enumerate(debates):
            debate['title'] = debateobjs[i].subject.bill.description
            debate['starttime'] = str(debate['starttime'])
            debate['endtime'] = str(debate['endtime']) if debate['endtime'] else None
        response = json.dumps(debates)
        return HttpResponse(response, content_type='application/json')
