"""
Rate Limiting Configuration

This module initializes the `Limiter` instance using `slowapi`, a FastAPI port of 
`Flask-Limiter`. It is used to protect the API endpoints from abuse, 
brute-force attacks, and denial-of-service (DoS) attempts by restricting 
the number of requests a client can make within a specific timeframe.

- `key_func`: Uses the client's remote IP address (`get_remote_address`) as the 
  unique identifier for rate-limiting logic.
- `limiter`: The global instance to be imported and used as a dependency or 
  decorator in FastAPI route handlers.
"""

from slowapi import Limiter
from slowapi.util import get_remote_address

# Initialize limiter with a global key (remote address)
limiter = Limiter(key_func=get_remote_address)
