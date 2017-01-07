from rest_framework import serializers

from usgs.bill.models import Bill, BillVersion


class BillSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    title = serializers.SerializerMethodField()
    sponsor = serializers.SerializerMethodField()
    cosponsors = serializers.SerializerMethodField()
    versions = serializers.SerializerMethodField()

    def get_title(self, obj):
        return obj.description

    def get_sponsor(self, obj):
        return {
            'id': obj.sponsor.id,
            'name': obj.sponsor.name,
            'party': obj.sponsor.party,
        }

    def get_cosponsors(self, obj):
        cosponsors = []
        for cs in obj.cosponsors.all():
            cosponsors.append({
                'id': cs.id,
                'name': cs.description,
                'party': cs.party,
            })
        return cosponsors

    def get_versions(self, obj):
        billversions = sorted(obj.versions.all(), key=lambda bv:bv.id)
        return BillVersionSerializer(billversions, many=True).data

    class Meta:
        model = Bill
        fields = (
            'id',
            'title',
            'sponsor',
            'cosponsors',
            'versions',
        )


class BillVersionSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    bill_id = serializers.ReadOnlyField()
    title = serializers.SerializerMethodField()
    body = serializers.CharField()
    sponsor = serializers.SerializerMethodField()
    cosponsors = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    status = serializers.CharField()
    closed = serializers.BooleanField()
    modified = serializers.SerializerMethodField()

    def get_bill_id(self, obj):
        return obj.bill.id

    def get_title(self, obj):
        return obj.bill.description

    def get_sponsor(self, obj):
        return {
            'id': obj.bill.sponsor.id,
            'name': obj.bill.sponsor.name,
            'party': obj.bill.sponsor.party,
        }

    def get_cosponsors(self, obj):
        cosponsors = []
        for cs in obj.bill.cosponsors.all():
            cosponsors.append({
                'id': cs.id,
                'name': cs.description,
                'party': cs.party,
            })
        return cosponsors

    def get_location(self, obj):
        return obj.location.name

    def get_modified(self, obj):
        return str(obj.modified)

    class Meta:
        model = BillVersion
        fields = (
            'id',
            'bill_id',
            'title',
            'body',
            'sponsor',
            'cosponsors',
            'location',
            'status',
            'closed',
            'modified',
        )
