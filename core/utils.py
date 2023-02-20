import random
import string
# Utils to generate string for unique slug
ALPHANUMERIC_CHARS = string.ascii_lowercase + string.digits
STRING_LENGTH = 7


def generate_random_string(chars=ALPHANUMERIC_CHARS, length=STRING_LENGTH):
    return "".join(random.choice(chars) for _ in range(length))
