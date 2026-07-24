from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.recognition.capture import FaceCapture
from app.recognition.detector import FaceDetector
from app.recognition.embedder import FaceEmbedder


class RegistrationService:

    def __init__(self, db: Session):

        self.repository = UserRepository(db)

        self.detector = FaceDetector()

        self.capture = FaceCapture(
            save_path="storage/faces",
            detector=self.detector
        )

        self.embedder = FaceEmbedder()