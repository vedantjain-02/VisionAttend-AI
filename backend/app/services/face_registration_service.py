import os
import cv2
import numpy as np

from app.repositories.user_repository import UserRepository
from app.recognition.detector import FaceDetector
from app.recognition.embedder import FaceEmbedder
from app.utils.embedding_utils import average_embeddings, embedding_to_bytes


class FaceRegistrationService:

    def __init__(self, db):
        self.repository = UserRepository(db)
        self.detector = FaceDetector()
        self.embedder = FaceEmbedder()

    def register_face(self, employee_id: str, image):

        user = self.repository.get_by_employee_id(employee_id)

        if user is None:
            raise Exception("Employee not found.")

        folder = os.path.join("storage", "faces", employee_id)
        os.makedirs(folder, exist_ok=True)

        # Read image from frontend
        image_bytes = image.file.read()

        frame = cv2.imdecode(
            np.frombuffer(image_bytes, np.uint8),
            cv2.IMREAD_COLOR
        )

        faces = self.detector.detect(frame)

        if len(faces) == 0:
            raise Exception("No face detected.")

        face = faces[0]

        embedding = self.embedder.get_embedding(face)

        user.face_embedding = embedding_to_bytes(embedding)
        user.photo_folder = folder

        self.repository.update(user)

        return {
            "message": "Face Registered Successfully"
        }