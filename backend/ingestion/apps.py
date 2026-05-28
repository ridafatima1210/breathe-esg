from django.apps import AppConfig

class IngestionConfig(AppConfig):
    # Sets the implicit primary key field type for models belonging to this app
    default_auto_field = 'django.db.models.BigAutoField'
    
    # Specifies the full Python import path to the application package
    name = 'ingestion'