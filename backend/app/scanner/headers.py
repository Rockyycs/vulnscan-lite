import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

SECURITY_HEADERS = {

    "Content-Security-Policy": -10,
    "X-Frame-Options": 10,
    "Strict-Transport-Security": -10,
    "X-Content-Type-Options": -10,
    "Referrer-Policy": -10,
    "Permissions-Policy": -10,
    "Cross-Origin-Opener-Policy": -10,
    "Cross-Origin-Resource-Policy": -10,
    "Cross-Origin-Embedder-Policy": -10

}


def analyze_headers(url):

    response = requests.get(
        url,
        verify=False,
        timeout=10
    )

    headers = response.headers

    results = []

    for header, score in SECURITY_HEADERS.items():

        if header in headers:

            results.append({

                "header": header,
                "status": "Present",
                "score": abs(score)

            })

        else:

            results.append({

                "header": header,
                "status": "Missing",
                "score": score

            })

    return results
