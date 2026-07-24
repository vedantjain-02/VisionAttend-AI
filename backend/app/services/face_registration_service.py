import os

from app.recognition.capture import FaceCapture
from app.recognition.detector import FaceDetector
from app.repositories.user_repository import UserRepository

from app.utils.embedding_utils import (
    average_embeddings,
    embedding_to_bytes
)


class FaceRegistrationService:

    def __init__(self, db):

        self.repository = UserRepository(db)

        self.detector = FaceDetector()

        self.capture = FaceCapture(
            detector=self.detector
        )

    def register_face(self, employee_id: str):

        user = self.repository.get_by_employee_id(employee_id)

        if user is None:
            raise Exception("Employee not found.")

        folder = os.path.join(
            "storage",
            "faces",
            employee_id
        )

        samples = self.capture.capture_faces(
            save_path=folder,
            count=20
        )

        embeddings = []

        for sample in samples:
            embeddings.append(sample["embedding"])

        average = average_embeddings(embeddings)

        user.face_embedding = embedding_to_bytes(average)
        user.photo_folder = folder

        self.repository.update(user)

        return {
            "message": "Face Registered Successfully"
        }