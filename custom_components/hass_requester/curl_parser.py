"""Parse a CURL command string into a structured request object."""
from __future__ import annotations

import json
import shlex
from urllib.parse import parse_qs, urlparse, urlencode


def parse_curl(curl_string: str) -> dict:
    """
    Parse a curl command string and return a request dict.

    Returns dict with keys: method, url, query_params, headers, body_type, body, slots.
    Slots are always empty - the user defines them in the UI.
    Raises ValueError if the input cannot be parsed.
    """
    curl_string = curl_string.strip()
    if curl_string.startswith("curl "):
        curl_string = curl_string[5:]

    # Normalize multiline curl (backslash continuations)
    curl_string = curl_string.replace("\\\n", " ").replace("\\\r\n", " ")

    try:
        tokens = shlex.split(curl_string)
    except ValueError as e:
        raise ValueError(f"Failed to tokenize curl command: {e}") from e

    method = "GET"
    url = ""
    headers: dict[str, str] = {}
    body_raw: str | None = None
    follow_location = False

    i = 0
    while i < len(tokens):
        token = tokens[i]

        if token in ("-X", "--request"):
            i += 1
            method = tokens[i].upper()

        elif token in ("-H", "--header"):
            i += 1
            header = tokens[i]
            if ":" in header:
                key, _, value = header.partition(":")
                headers[key.strip()] = value.strip()

        elif token in ("-d", "--data", "--data-raw", "--data-binary", "--data-ascii"):
            i += 1
            body_raw = tokens[i]
            # Presence of -d implies POST if method not explicitly set
            if method == "GET":
                method = "POST"

        elif token in ("-L", "--location"):
            follow_location = True  # noqa: F841 - kept for future use

        elif token in ("-G", "--get"):
            method = "GET"

        elif token.startswith("http://") or token.startswith("https://"):
            url = token

        elif not token.startswith("-"):
            # Bare argument - likely the URL (quoted or not)
            if token.startswith(("'", '"')):
                url = token.strip("'\"")
            else:
                url = token

        i += 1

    if not url:
        raise ValueError("No URL found in curl command")

    # Split URL into base + query params
    parsed = urlparse(url)
    query_params: dict[str, str] = {}
    if parsed.query:
        for key, values in parse_qs(parsed.query, keep_blank_values=True).items():
            query_params[key] = values[0] if values else ""

    base_url = parsed._replace(query="", fragment="").geturl()

    # Parse body
    body_type = "none"
    body = None

    content_type = headers.get("Content-Type", headers.get("content-type", "")).lower()

    if body_raw is not None:
        if "application/json" in content_type or _looks_like_json(body_raw):
            body_type = "json"
            try:
                body = json.loads(body_raw)
            except json.JSONDecodeError:
                body_type = "text"
                body = body_raw
        elif "application/x-www-form-urlencoded" in content_type:
            body_type = "form"
            body = {}
            for key, values in parse_qs(body_raw, keep_blank_values=True).items():
                body[key] = values[0] if values else ""
        else:
            body_type = "text"
            body = body_raw

    return {
        "method": method,
        "url": base_url,
        "query_params": query_params,
        "headers": headers,
        "body_type": body_type,
        "body": body,
        "slots": [],
    }


def _looks_like_json(s: str) -> bool:
    """Heuristic check if a string looks like JSON."""
    s = s.strip()
    return (s.startswith("{") and s.endswith("}")) or (
        s.startswith("[") and s.endswith("]")
    )
