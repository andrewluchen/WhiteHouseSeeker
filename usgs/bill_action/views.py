from django.http import HttpResponse
from django.utils import timezone
from django.views.generic import View

from rest_framework.renderers import JSONRenderer

from usgs.bill.models import Bill, BillVersion
from usgs.bill_action.models import Debate, DebateComment, DebateMotion, Vote
from usgs.bill_action.serializers import DebateSerializer, DebateCommentSerializer, DebateMotionSerializer, VoteSerializer
from usgs.character.models import Character

from usgs.utils import get_legislative_body, validate_character


class NewVoteView(View):

    def post(self, request):
        version_id = request.POST.get('version_id')
        chamber = request.POST.get('chamber')
        hours = request.POST.get('hours')
        billversion_obj = BillVersion.objects.get(id=version_id)
        billversion_obj.modified = timezone.now()
        billversion_obj.closed = True
        billversion_obj.save()
        newbillversion = BillVersion(
            bill=billversion_obj.bill,
            status=BillVersion.BILL_VOTE,
            body=billversion_obj.body,
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
        vote_obj = Vote.objects.get(id=pk)
        vote = JSONRenderer().render(VoteSerializer(vote_obj).data)
        return HttpResponse(vote, content_type='application/json')

    def post(self, request, pk):
        character_id = request.POST.get('character_id')
        character = Character.objects.get(id=character_id)
        validate_character(request.user, character)

        vote = Vote.objects.get(id=pk)
        castvote = request.POST.get('vote')
        if (castvote == 'yea'):
            vote.yeas.add(character)
            vote.nays.remove(character)
            vote.pres.remove(character)
        if (castvote == 'nay'):
            vote.yeas.remove(character)
            vote.nays.add(character)
            vote.pres.remove(character)
        if (castvote == 'present'):
            vote.yeas.remove(character)
            vote.nays.remove(character)
            vote.pres.add(character)
        return HttpResponse(status=200)


class VoteOfficerView(View):

    def post(self, request, pk):
        character_id = request.POST.get('character_id')
        character = Character.objects.get(id=character_id)
        validate_character(request.user, character)

        vote = Vote.objects.get(id=pk)
        billversion_obj = vote.subject
        officer = request.POST.get('officer')
        if (officer == 'move_to_house'):
            billversion_obj.status = BillVersion.BILL_PASS
            billversion = BillVersion(
                bill=billversion_obj.bill,
                status=BillVersion.BILL_RECEIVE,
                body=billversion_obj.body,
                modified=timezone.now(),
                location=get_legislative_body('house')
            )
            billversion.save()
        elif (officer == 'move_to_senate'):
            billversion_obj.status = BillVersion.BILL_PASS
            billversion = BillVersion(
                bill=billversion_obj.bill,
                status=BillVersion.BILL_RECEIVE,
                body=billversion_obj.body,
                modified=timezone.now(),
                location=get_legislative_body('senate')
            )
            billversion.save()
        elif (officer == 'move_to_potus'):
            billversion_obj.status = BillVersion.BILL_PASS
            billversion = BillVersion(
                bill=billversion_obj.bill,
                status=BillVersion.BILL_POTUS,
                body=billversion_obj.body,
                modified=timezone.now(),
                location=get_legislative_body('potusdesk')
            )
            billversion.save()
        elif (officer == 'override_veto'):
            billversion_obj.status = BillVersion.BILL_OVERRIDE
            billversion_obj.location = get_legislative_body('library')
        elif (officer == 'pass_law'):
            billversion_obj.status = BillVersion.BILL_PASS
            billversion_obj.location = get_legislative_body('library')
        elif (officer == 'fail'):
            billversion_obj.status = BillVersion.BILL_FAIL
        else:
            return
        billversion_obj.modified = timezone.now()
        billversion_obj.closed = False
        billversion_obj.save()
        vote.active = False
        vote.save()
        return HttpResponse(status=200)


class VotesView(View):

    def get(self, request):
        vote_objs = Vote.objects.all()
        now = timezone.now()
        if (request.GET.get('chamber')):
            chamber = get_legislative_body(request.GET.get('chamber'))
            vote_objs = vote_objs.filter(location=chamber)
        if (request.GET.get('active')):
            vote_objs = vote_objs.filter(active=True)
        votes = JSONRenderer().render(VoteSerializer(vote_objs, many=True).data)
        return HttpResponse(votes, content_type='application/json')


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
        debate_obj = Debate.objects.get(id=pk)
        debate = JSONRenderer().render(DebateSerializer(debate_obj).data)
        return HttpResponse(debate, content_type='application/json')

    def post(self, request, pk):
        character_id = request.POST.get('character_id')
        character = Character.objects.get(id=character_id)
        validate_character(request.user, character)

        debate = Debate.objects.get(id=pk)
        motion_type = request.POST.get('motion_type')
        comment = request.POST.get('comment')
        debatecomment = DebateComment(
            debate=debate,
            actor=character,
            comment=comment,
            timestamp=timezone.now(),
        )
        debatecomment.save()
        if (motion_type == 'comment'):
            return HttpResponse(status=200)
        elif (motion_type == DebateMotion.UNANIMOUS):
            debatemotion = DebateMotion(
                debate=debate,
                actor=character,
                motion_type=DebateMotion.UNANIMOUS,
                starttime=timezone.now(),
                endtime=timezone.now() + timezone.timedelta(hours=24),
            )
            debatemotion.save()
            return HttpResponse(status=200)
        elif (motion_type == DebateMotion.AMEND):
            debatemotion = DebateMotion(
                debate=debate,
                actor=character,
                motion_type=DebateMotion.AMEND,
                amendment=request.POST.get('attachment'),
            )
            debatemotion.save()
            return HttpResponse(status=200)
        elif (motion_type == DebateMotion.CLOTURE):
            debatemotion = DebateMotion(
                debate=debate,
                actor=character,
                motion_type=DebateMotion.CLOTURE,
            )
            debatemotion.save()
            return HttpResponse(status=200)
        elif (motion_type == DebateMotion.REFER):
            debatemotion = DebateMotion(
                debate=debate,
                actor=character,
                motion_type=DebateMotion.REFER,
            )
            debatemotion.save()
            return HttpResponse(status=200)
        elif (motion_type == DebateMotion.TABLE):
            debatemotion = DebateMotion(
                debate=debate,
                actor=character,
                motion_type=DebateMotion.TABLE,
            )
            debatemotion.save()
            return HttpResponse(status=200)


class DebateMotionView(View):

    def get(self, request, pk):
        debatemotion_obj = DebateMotion.objects.get(id=pk)
        debatemotion = JSONRenderer().render(DebateMotionSerializer(debatemotion_obj).data)
        return HttpResponse(debatemotion, content_type='application/json')

    def post(self, request, pk):
        character_id = request.POST.get('character_id')
        character = Character.objects.get(id=character_id)
        validate_character(request.user, character)

        debatemotion = DebateMotion.objects.get(id=pk)
        action = request.POST.get('action')
        if (action == 'second'):
            hours = int(request.POST.get('hours'))
            debatemotion.seconded = character
            debatemotion.starttime = timezone.now()
            debatemotion.endtime = timezone.now() + timezone.timedelta(hours=hours)
            debatemotion.save()
            return HttpResponse(status=200)
        if (action == 'vote'):
            vote = request.POST.get('vote')
            if (vote == 'yea'):
                debatemotion.yeas.add(character)
                debatemotion.nays.remove(character)
                debatemotion.pres.remove(character)
            if (vote == 'nay'):
                debatemotion.yeas.remove(character)
                debatemotion.nays.add(character)
                debatemotion.pres.remove(character)
            if (vote == 'present'):
                debatemotion.yeas.remove(character)
                debatemotion.nays.remove(character)
                debatemotion.pres.add(character)
            debatemotion = DebateMotion.objects.get(id=pk)
            return HttpResponse(status=200)
        if (action == 'object'):
            debatemotion.nays.add(character)
            return HttpResponse(status=200)


class DebateOfficerView(View):

    def post(self, request, pk):
        character_id = request.POST.get('character_id')
        character = Character.objects.get(id=character_id)
        validate_character(request.user, character)

        debate = Debate.objects.get(id=pk)
        officer = request.POST.get('officer')
        if (officer == 'move_to_vote'):
            hours = int(request.POST.get('hours'))
            vote = Vote(
                subject=debate.subject,
                starttime=timezone.now(),
                endtime=timezone.now() + timezone.timedelta(hours=hours),
                location=debate.location,
            )
            vote.save()
            billversion = debate.subject
            billversion.status = BillVersion.BILL_VOTE
            billversion.save()
            debate.active = False
            debate.save()
            return HttpResponse(status=200)


class DebatesView(View):

    def get(self, request):
        debate_objs = Debate.objects.all()
        now = timezone.now()
        if (request.GET.get('chamber')):
            chamber = get_legislative_body(request.GET.get('chamber'))
            debate_objs = debate_objs.filter(location=chamber)
        if (request.GET.get('active')):
            debate_objs = debate_objs.filter(active=True)
        debates = JSONRenderer().render(DebateSerializer(debate_objs, many=True).data)
        return HttpResponse(debates, content_type='application/json')
