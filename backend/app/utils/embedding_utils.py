import numpy as np


def average_embeddings(embeddings: list[np.ndarray]) -> np.ndarray:
    """
    Calculate average embedding from multiple face embeddings.
    """

    if not embeddings:
        raise ValueError("Embeddings list is empty.")

    embeddings = np.array(embeddings)

    return np.mean(embeddings, axis=0).astype(np.float32)


def embedding_to_bytes(embedding: np.ndarray) -> bytes:
    """
    Convert numpy embedding to bytes for PostgreSQL.
    """
    return embedding.astype(np.float32).tobytes()


def bytes_to_embedding(data: bytes) -> np.ndarray:
    """
    Convert bytes back to numpy embedding.
    """
    return np.frombuffer(data, dtype=np.float32)