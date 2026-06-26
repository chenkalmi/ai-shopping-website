import json
import redis

redis_client = redis.Redis(
    host="localhost",
    port=6379,
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