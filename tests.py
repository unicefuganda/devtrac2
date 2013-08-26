import os
import application
import unittest
import tempfile

class ApplicationTestCase(unittest.TestCase):

    def setUp(self):
        self.db_fd, application.app.config['DATABASE'] = tempfile.mkstemp()
        application.app.config['TESTING'] = True
        self.app = application.app.test_client()
        # application.app.init_db()

    # def tearDown(self):
        # os.close(self.db_fd)
        # os.unlink(application.app.config['DATABASE'])

    def test_root(self):
        rv = self.app.get('/')
        assert 'DevTrac2' in rv.data

if __name__ == '__main__':
    unittest.main()