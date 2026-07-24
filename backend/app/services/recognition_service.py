from app.recognition.detector import FaceDetector
from app.repositories.user_repository import UserRepository


class RecognitionService:

    def __init__(self, db):

        self.repository = UserRepository(db)
        self.detector = FaceDetector()