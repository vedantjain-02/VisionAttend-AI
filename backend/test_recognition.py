import cv2

from app.database.session import SessionLocal
from app.services.recognition_service import RecognitionService


db = SessionLocal()

service = RecognitionService(db)

camera = cv2.VideoCapture(0)

while True:

    success, frame = camera.read()

    if not success:
        break

    result = service.recognize(frame)

    if result:

        user = result["user"]
        score = result["score"]

        x1, y1, x2, y2 = result["bbox"]

        cv2.rectangle(
            frame,
            (x1, y1),
            (x2, y2),
            (0, 255, 0),
            2
        )

        cv2.putText(
            frame,
            f"{user.full_name} ({score:.2f})",
            (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 0),
            2
        )

    cv2.imshow("VisionAttend AI", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

camera.release()
cv2.destroyAllWindows()
db.close()