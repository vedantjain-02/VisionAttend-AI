import cv2
import numpy as np

from app.recognition.detector import FaceDetector
from app.repositories.user_repository import UserRepository
from app.utils.embedding_utils import bytes_to_embedding


class FaceRecognizer:

    def __init__(self, db):

        self.detector = FaceDetector()
        self.repository = UserRepository(db)

    def recognize(self, frame):

        faces = self.detector.detect(frame)

        if len(faces) == 0:
            return None

        face = faces[0]

        embedding = face.embedding.astype(np.float32)

        embedding = embedding / np.linalg.norm(embedding)

        users = self.repository.get_all()

        best_user = None
        best_distance = 999

        for user in users:

            if not user.face_embedding:
                continue
            print("Employee:", user.employee_id)
            print("Embedding bytes:", len(user.face_embedding))
            stored_embedding = bytes_to_embedding(
                user.face_embedding
            )
            stored_embedding = stored_embedding / np.linalg.norm(stored_embedding)

            print("Shape:", stored_embedding.shape)

            # Skip invalid embeddings
            if stored_embedding.size != 512:
                print(f"Skipping {user.employee_id} - Invalid embedding")
                continue

            distance = np.linalg.norm(
                embedding - stored_embedding
            )
            print(
                f"{user.employee_id} -> Distance = {distance:.4f}"
            )

            if distance < best_distance:
                best_distance = distance
                best_user = user
        print("Best User:", best_user.employee_id if best_user else None)
        print("Best Distance:", best_distance)

        if best_distance < 0.8:
            return best_user

        return None