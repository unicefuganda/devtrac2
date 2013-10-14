class Config(object):
    pass

class ProductionConfig(Config):
    ASSETS_DEBUG = False
    SEND_FILE_MAX_AGE_DEFAULT = 100
    DATA_DIR = "db/data/prod"

class DevelopmentConfig(Config):
    ASSETS_DEBUG = True
    SEND_FILE_MAX_AGE_DEFAULT = 0
    DATA_DIR = "db/data/test"

class TestingConfig(Config):
    ASSETS_DEBUG = False
    SEND_FILE_MAX_AGE_DEFAULT = 100
    DATA_DIR = "db/data/test"

def config_from_env(env):
    if (env == "Development"):
        return DevelopmentConfig
    elif (env == "Testing"):
        return TestingConfig
    elif (env == "Production"):
        return ProductionConfig 