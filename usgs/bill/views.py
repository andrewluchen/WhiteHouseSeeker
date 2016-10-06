import json

from django.contrib.auth.models import User
from django.forms.models import model_to_dict
from django.http import HttpResponse
from django.utils import timezone
from django.views import View

from usgs.bill.models import Bill, BillVersion, Debate, Vote
from usgs.character.models import Character

from usgs.utils import get_legislative_body, validate_character, validate_bill_version


class NewBillView(View):

    def post(self, request):
        title = request.POST.get('title')
        body = request.POST.get('body')
        sponsor_id = request.POST.get('sponsor_id')
        sponsor = Character.objects.get(pk=sponsor_id)
        validate_character(request.user, sponsor)

        sponsor = Character.objects.get(pk=sponsor_id)
        chamber = request.POST.get('chamber')
        bill = Bill(title=title, sponsor=sponsor)
        bill.save()
        version = BillVersion(
            bill=bill,
            status=BillVersion.BILL_CLERK,
            body=body,
            modified=timezone.now(),
            location=get_legislative_body(chamber),
        )
        version.save()
        return HttpResponse(status=201)


class BillView(View):

    def get(self, request, pk):
        billobj = Bill.objects.get(id=pk)
        bill = model_to_dict(billobj)
        bill['sponsor'] = {
            'id': billobj.sponsor.id,
            'name': billobj.sponsor.description,
        }
        cosponsors = []
        for cs in billobj.cosponsors.all():
            cosponsors.append({
                'id': cs.id,
                'name': cs.description,
            })
        bill['cosponsors'] = cosponsors
        response = json.dumps(bill)
        return HttpResponse(response, content_type='application/json')


class BillVersionView(View):

    def get(self, request, bid, vid):
        billobj = Bill.objects.get(id=bid)
        bill = model_to_dict(BillVersion.objects.get(id=vid))
        bill['title'] = billobj.title
        bill['sponsor'] = {
            'id': billobj.sponsor.id,
            'name': billobj.sponsor.description,
            'party': billobj.sponsor.party,
        }
        cosponsors = []
        for cs in billobj.cosponsors.all():
            cosponsors.append({
                'id': cs.id,
                'name': cs.description,
                'party': cs.party,
            })
        bill['cosponsors'] = cosponsors
        bill['modified'] = str(bill['modified'])
        response = json.dumps(bill)
        return HttpResponse(response, content_type='application/json')

    def post(self, request, bid, vid):
        billobj = Bill.objects.get(id=bid)
        billversionobj = BillVersion.objects.get(id=vid)
        validate_bill_version(billobj, billversionobj)

        bill = billversionobj
        title = request.POST.get('title')
        body = request.POST.get('body')
        bill.title = title
        bill.body = body
        bill.save()
        return HttpResponse(status=200)


class BillsView(View):

    def get(self, request):
        pass


class ClerkView(View):

    def get(self, request):
        billversionobjs = BillVersion.objects.all()
        if (request.GET.get('chamber')):
            chamber = get_legislative_body(request.GET.get('chamber'))
            billversionobjs = billversionobjs.filter(location=chamber)
        if (request.GET.get('status')):
            billversionobjs = billversionobjs.filter(status=request.GET.get('status'))
        bills = list(billversionobjs.values())
        for i, bill in enumerate(bills):
            bill['title'] = billversionobjs[i].bill.description
            bill['sponsor'] = billversionobjs[i].bill.sponsor.__str__()
            bill['modified'] = str(bills[i]['modified'])
        response = json.dumps(bills)
        return HttpResponse(response, content_type='application/json')


class VoteView(View):

    def get(self, request, pk):
        voteobj = Vote.objects.get(id=pk)
        vote = model_to_dict(voteobj)
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
        vote['yeas'] = yeas
        vote['nays'] = nays
        vote['pres'] = pres
        vote['starttime'] = str(vote['starttime'])
        vote['endtime'] = str(vote['endtime'])
        vote['title'] = voteobj.subject.bill.description
        vote['body'] = voteobj.subject.body
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
            vote['endtime'] = str(vote['endtime'])
        response = json.dumps(votes)
        return HttpResponse(response, content_type='application/json')


class DebatesView(View):

    def get(self, request):
        debateobjs = Debate.objects.all()
        now = timezone.now()
        if (request.GET.get('chamber')):
            chamber = get_legislative_body(request.GET.get('chamber'))
            debateobjs = debateobjs.filter(location=chamber)
        if (request.GET.get('active')):
            debateobjs = debateobjs.filter(endtime__gt=now)
        debates = list(debateobjs.values())
        for i, debate in enumerate(debates):
            debate['title'] = debateobjs[i].subject.bill.description
            debate['starttime'] = str(debate['starttime'])
            debate['endtime'] = str(debate['endtime'])
        response = json.dumps(debates)
        return HttpResponse(response, content_type='application/json')
