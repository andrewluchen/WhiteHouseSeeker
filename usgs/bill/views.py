from django.contrib.auth.models import User
from django.http import HttpResponse
from django.utils import timezone
from django.views.generic import View

from rest_framework.renderers import JSONRenderer

from usgs.bill.models import Bill, BillVersion
from usgs.bill.serializers import BillSerializer, BillVersionSerializer
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
        bill_obj = Bill.objects.get(id=pk)
        bill = JSONRenderer().render(BillSerializer(bill_obj).data)
        return HttpResponse(bill, content_type='application/json')


class BillVersionView(View):

    def get(self, request, bid, vid):
        billversion_obj = BillVersion.objects.get(id=vid)
        billversion = JSONRenderer().render(BillVersionSerializer(billversion_obj).data)
        return HttpResponse(billversion, content_type='application/json')

    def post(self, request, bid, vid):
        bill = Bill.objects.get(id=bid)
        billversion = BillVersion.objects.get(id=vid)
        validate_bill_version(bill, billversion)

        title = request.POST.get('title')
        body = request.POST.get('body')
        billversion.title = title
        billversion.body = body
        billversion.save()
        return HttpResponse(status=200)


class BillsView(View):

    def get(self, request):
        pass


class BillVersionsView(View):

    def get(self, request):
        billversion_objs = BillVersion.objects.all()
        if (request.GET.get('chamber')):
            chamber = get_legislative_body(request.GET.get('chamber'))
            billversion_objs = billversion_objs.filter(location=chamber)
        if (request.GET.get('status')):
            billversion_objs = billversion_objs.filter(status=request.GET.get('status'))
        if (request.GET.get('active')):
            billversion_objs = billversion_objs.filter(closed=False)
        billversions = JSONRenderer().render(BillVersionSerializer(billversion_objs, many=True).data)
        return HttpResponse(billversions, content_type='application/json')
