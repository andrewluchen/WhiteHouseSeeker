import json

from django.db.models import Q
from django.http import HttpResponse
from django.utils import timezone
from django.views.generic import View

from usgs.bill.models import Bill, BillVersion
from usgs.bill_action.models import Debate, DebateComment, DebateMotion, Vote
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
        character_id = request.POST.get('character_id')
        character = Character.objects.get(id=character_id)
        validate_character(request.user, character)

        voteobj = Vote.objects.get(id=pk)
        castvote = request.POST.get('vote')
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
            voteobjs = voteobjs.filter(active=True)
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
        commentobjs = debateobj.comments.all()
        comments = []
        for c in list(commentobjs):
            comments.append({
                'id': c.id,
                'character_id': c.actor.id,
                'character_name': c.actor.description,
                'party': c.actor.party,
                'comment': c.comment,
                'timestamp': str(c.timestamp),
            })
        motionobjs = debateobj.motions.all()
        motions = []
        for m in list(motionobjs):
            yeaobjs = m.yeas
            yeas = []
            for ch in list(yeaobjs.all()):
                yeas.append({
                    'id': ch.id,
                    'name': ch.description,
                    'party': ch.party,
                })
            nayobjs = m.nays
            nays = []
            for ch in list(nayobjs.all()):
                nays.append({
                    'id': ch.id,
                    'name': ch.description,
                    'party': ch.party,
                })
            presobjs = m.pres
            pres = []
            for ch in list(presobjs.all()):
                pres.append({
                    'id': ch.id,
                    'name': ch.description,
                    'party': ch.party,
                })
            motion = {
                'id': m.id,
                'actor_id': m.actor.id,
                'actor': m.actor.description,
                'actor_party': m.actor.party,
                'motion_type': m.motion_type,
                'amendment': m.amendment,
                'active': m.active,
                'starttime': str(m.starttime),
                'endtime': str(m.endtime) if m.endtime else None,
                'yeas': yeas,
                'nays': nays,
                'pres': pres,
            }
            if m.seconded:
                motion['seconded_id'] = m.seconded.id
                motion['seconded'] = m.seconded.description
                motion['seconded_party'] = m.seconded.party
            motions.append(motion)
        debate = {
            'title': debateobj.subject.bill.description,
            'body': debateobj.subject.body,
            'location': debateobj.subject.location.name,
            'starttime': str(debateobj.starttime),
            'endtime': str(debateobj.endtime),
            'comments': comments,
            'motions': motions,
        }
        response = json.dumps(debate)
        return HttpResponse(response, content_type='application/json')

    def post(self, request, pk):
        character_id = request.POST.get('character_id')
        character = Character.objects.get(id=character_id)
        validate_character(request.user, character)

        debateobj = Debate.objects.get(id=pk)
        motion_type = request.POST.get('motion_type')
        if (motion_type == 'officer'):
            officer = request.POST.get('officer')
            hours = int(request.POST.get('hours'))
            if (officer == 'move_to_vote'):
                vote = Vote(
                    subject=debateobj.subject,
                    starttime=timezone.now(),
                    endtime=timezone.now() + timezone.timedelta(hours=hours),
                    location=debateobj.location,
                )
                vote.save()
                debateobj.active = False
                debateobj.save()
            return HttpResponse(status=200)
        comment = request.POST.get('comment')
        debatecomment = DebateComment(
            debate=debateobj,
            actor=character,
            comment=comment,
            timestamp=timezone.now(),
        )
        debatecomment.save()
        if (motion_type == 'comment'):
            return HttpResponse(status=200)
        elif (motion_type == DebateMotion.UNANIMOUS):
            debatemotion = DebateMotion(
                debate=debateobj,
                actor=character,
                motion_type=DebateMotion.UNANIMOUS,
                starttime=timezone.now(),
                endtime=timezone.now() + timezone.timedelta(hours=24),
            )
            debatemotion.save()
            return HttpResponse(status=200)
        elif (motion_type == DebateMotion.AMEND):
            debatemotion = DebateMotion(
                debate=debateobj,
                actor=character,
                motion_type=DebateMotion.AMEND,
                amendment=request.POST.get('attachment'),
            )
            debatemotion.save()
            return HttpResponse(status=200)
        elif (motion_type == DebateMotion.CLOTURE):
            debatemotion = DebateMotion(
                debate=debateobj,
                actor=character,
                motion_type=DebateMotion.CLOTURE,
            )
            debatemotion.save()
            return HttpResponse(status=200)
        elif (motion_type == DebateMotion.REFER):
            debatemotion = DebateMotion(
                debate=debateobj,
                actor=character,
                motion_type=DebateMotion.REFER,
            )
            debatemotion.save()
            return HttpResponse(status=200)
        elif (motion_type == DebateMotion.TABLE):
            debatemotion = DebateMotion(
                debate=debateobj,
                actor=character,
                motion_type=DebateMotion.TABLE,
            )
            debatemotion.save()
            return HttpResponse(status=200)


class DebateMotionView(View):

    def get(self, request, pk):
        debatemotionobj = DebateMotion.objects.get(id=pk)
        yeaobjs = debatemotionobj.yeas
        yeas = []
        for ch in list(yeaobjs.all()):
            yeas.append({
                'id': ch.id,
                'name': ch.description,
                'party': ch.party,
            })
        nayobjs = debatemotionobj.nays
        nays = []
        for ch in list(nayobjs.all()):
            nays.append({
                'id': ch.id,
                'name': ch.description,
                'party': ch.party,
            })
        presobjs = debatemotionobj.pres
        pres = []
        for ch in list(presobjs.all()):
            pres.append({
                'id': ch.id,
                'name': ch.description,
                'party': ch.party,
            })
        motion = {
            'id': debatemotionobj.id,
            'actor_id': debatemotionobj.actor.id,
            'actor': debatemotionobj.actor.description,
            'actor_party': debatemotionobj.actor.party,
            'motion_type': debatemotionobj.motion_type,
            'amendment': debatemotionobj.amendment,
            'active': debatemotionobj.active,
            'starttime': str(debatemotionobj.starttime),
            'endtime': str(debatemotionobj.endtime) if debatemotionobj.endtime else None,
            'yeas': yeas,
            'nays': nays,
            'pres': pres,
        }
        if debatemotionobj.seconded:
            motion['seconded_id'] = debatemotionobj.seconded.id
            motion['seconded'] = debatemotionobj.seconded.description
            motion['seconded_party'] = debatemotionobj.seconded.party
        response = json.dumps(motion);
        return HttpResponse(response, content_type='application/json')

    def post(self, request, pk):
        character_id = request.POST.get('character_id')
        character = Character.objects.get(id=character_id)
        validate_character(request.user, character)

        debatemotion = DebateMotion.objects.get(id=pk)
        action = request.POST.get('action')
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
            return HttpResponse(status=200)
        if (action == 'object'):
            debatemotion.nays.add(character)
            return HttpResponse(status=200)


class DebatesView(View):

    def get(self, request):
        debateobjs = Debate.objects.all()
        now = timezone.now()
        if (request.GET.get('chamber')):
            chamber = get_legislative_body(request.GET.get('chamber'))
            debateobjs = debateobjs.filter(location=chamber)
        if (request.GET.get('active')):
            debateobjs = debateobjs.filter(active=True)
        debates = list(debateobjs.values())
        for i, debate in enumerate(debates):
            debate['title'] = debateobjs[i].subject.bill.description
            debate['starttime'] = str(debate['starttime'])
            debate['endtime'] = str(debate['endtime']) if debate['endtime'] else None
        response = json.dumps(debates)
        return HttpResponse(response, content_type='application/json')
