import cv2

from app.recognition.detector import FaceDetector


detector = FaceDetector()


camera = cv2.VideoCapture(0)


while True:

    success, frame = camera.read()

    if not success:
        break


    faces = detector.detect(frame)


    for face in faces:

        box = face.bbox.astype(int)

        x1, y1, x2, y2 = box


        cv2.rectangle(
            frame,
            (x1, y1),
            (x2, y2),
            (0,255,0),
            2
        )


        cv2.putText(
            frame,
            "Face",
            (x1,y1-10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0,255,0),
            2
        )


    cv2.imshow(
        "VisionAttend AI",
        frame
    )


    if cv2.waitKey(1) & 0xff == ord("q"):
        break


camera.release()
cv2.destroyAllWindows()