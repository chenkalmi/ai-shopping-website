import json
import redis
import os

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    db=0,
    decode_responses=True
)


def get_cache(key: str):
    data = redis_client.get(key)

    if data is None:
        return None

    return json.loads(data)


def set_cache(key: str, value, expire_seconds: int = 60):
    redis_client.setex(
        key,
        expire_seconds,
        json.dumps(value)
    )


def delete_cache(key: str):
    redis_client.delete(key)