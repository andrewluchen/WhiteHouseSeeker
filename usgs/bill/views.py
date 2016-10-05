from datetime import datetime
import json

from django.contrib.auth.models import User
from django.forms.models import model_to_dict
from django.http import HttpResponse
from django.views import View

from usgs.bill.models import Bill, BillVersion
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
            modified=datetime.now(),
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
        }
        cosponsors = []
        for cs in billobj.cosponsors.all():
            cosponsors.append({
                'id': cs.id,
                'name': cs.description,
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


class ClerkView(View):

    def get(self, request):
        billobjs = BillVersion.objects.all()
        if (request.GET.get('chamber')):
            chamber = get_legislative_body(request.GET.get('chamber'))
            billobjs = billobjs.filter(location=chamber)
        if (request.GET.get('status')):
            billobjs = billobjs.filter(status=request.GET.get('status'))
        bills = list(billobjs.values())
        for i, bill in enumerate(bills):
            bill['title'] = billobjs[i].bill.title
            bill['sponsor'] = billobjs[i].bill.sponsor.__str__()
            bill['modified'] = str(bills[i]['modified'])
        response = json.dumps(bills)
        return HttpResponse(response, content_type='application/json')


class BillsView(View):

    def get(self, request):
        billobjs = BillVersion.objects.all()
        if (request.GET.get('chamber')):
            chamber = get_legislative_body(request.GET.get('chamber'))
            billobjs = billobjs.filter(location=chamber)
        if (request.GET.get('status')):
            billobjs = billobjs.filter(status=request.GET.get('status'))
        bills = list(billobjs.values())
        for i, bill in enumerate(bills):
            bill['title'] = billobjs[i].bill.title
            bill['sponsor'] = billobjs[i].bill.sponsor.__str__()
            bill['modified'] = str(bills[i]['modified'])
        response = json.dumps(bills)
        return HttpResponse(response, content_type='application/json')
