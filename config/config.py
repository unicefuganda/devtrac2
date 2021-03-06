class Config(object):
    PDF_FOLDER = 'tmp/pdf'
    pass

class ProductionConfig(Config):
    ASSETS_DEBUG = False
    SEND_FILE_MAX_AGE_DEFAULT = 100
    DATA_DIR = "db/data/prod"
    USE_LOCAL_GEOJSON = False

class DevelopmentConfig(Config):
    SERVER_NAME='localhost:5000'
    ASSETS_DEBUG = True
    SEND_FILE_MAX_AGE_DEFAULT = 0
    DATA_DIR = "db/data/test"
    USE_LOCAL_GEOJSON = True

class TestingConfig(Config):
    SERVER_NAME='localhost:5000'
    ASSETS_DEBUG = True
    SEND_FILE_MAX_AGE_DEFAULT = 100
    DATA_DIR = "db/data/test"
    USE_LOCAL_GEOJSON = True

def config_from_env(env):
    if (env == "Development"):
        return DevelopmentConfig
    elif (env == "Testing"):
        return TestingConfig
    elif (env == "Production"):
        return ProductionConfig 