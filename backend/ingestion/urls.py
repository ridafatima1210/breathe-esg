from django.urls import path
from .views import DataIngestionView, EmissionDataListView, RowActionView

urlpatterns = [
    path('ingest/', DataIngestionView.as_view(), name='api-ingest'),
    path('emissions/', EmissionDataListView.as_view(), name='api-emissions'),
    path('emissions/<int:pk>/action/', RowActionView.as_view(), name='api-row-action'),
]