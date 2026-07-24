import cv2
import os
import time


class FaceCapture:

    def __init__(self, save_path, detector):

        self.save_path = save_path
        self.detector = detector

        os.makedirs(
            self.save_path,
            exist_ok=True
        )


    def capture_faces(self, count=20):

        camera = cv2.VideoCapture(0)

        captured = 0


        while captured < count:

            success, frame = camera.read()

            if not success:
                break


            faces = self.detector.detect(frame)


            if len(faces) > 0:

                face = faces[0]

                box = face.bbox.astype(int)

                x1, y1, x2, y2 = box


                face_img = frame[
                    y1:y2,
                    x1:x2
                ]


                if face_img.size != 0:

                    filename = os.path.join(
                        self.save_path,
                        f"face_{captured}.jpg"
                    )

                    print("Saving to:", os.path.abspath(filename))

                    saved = cv2.imwrite(filename, face_img)

                    print("Saved:", saved)

                    if saved:
                        captured += 1
                        print(f"Captured {captured}/{count}")


                    time.sleep(0.3)


                cv2.rectangle(
                    frame,
                    (x1,y1),
                    (x2,y2),
                    (0,255,0),
                    2
                )


            cv2.putText(
                frame,
                f"Samples: {captured}/{count}",
                (20,40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0,255,0),
                2
            )


            cv2.imshow(
                "Face Registration",
                frame
            )


            if cv2.waitKey(1) & 0xff == ord("q"):
                break


        camera.release()
        cv2.destroyAllWindows()