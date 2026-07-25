import numpy as np

from app.recognition.detector import FaceDetector
from app.repositories.user_repository import UserRepository
from app.utils.embedding_utils import bytes_to_embedding
from app.utils.similarity import cosine_similarity
from app.services.attendance_service import AttendanceService
from app.core.config import settings

class RecognitionService:

    def __init__(self, db):
        self.attendance_service = AttendanceService(db)
        self.repository = UserRepository(db)
        self.detector = FaceDetector()

    def recognize(self, frame):

        faces = self.detector.detect(frame)

        if len(faces) == 0:
            return None

        live_face = faces[0]
        live_embedding = live_face.embedding.astype(np.float32)

        users = self.repository.get_all()

        best_user = None
        best_score = -1.0

        for user in users:

            if not user.face_embedding:
                continue

            db_embedding = bytes_to_embedding(
                user.face_embedding
            )

            score = cosine_similarity(
                live_embedding,
                db_embedding
            )

            if score > best_score:
                best_score = score
                best_user = user


        if best_user is None or best_score < settings.RECOGNITION_THRESHOLD:
            return None

        # Attendance mark karo
        self.attendance_service.mark_attendance(
            best_user.id
        )

        return {
            "user": best_user,
            "score": best_score,
            "bbox": live_face.bbox.astype(int)
        }