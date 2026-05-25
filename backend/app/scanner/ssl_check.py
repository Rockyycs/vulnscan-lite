print("NEW SSL FILE LOADED")

import ssl
import socket
from datetime import datetime

def check_ssl(domain):

    try:

        context = ssl.create_default_context()

        with socket.create_connection(
            (domain, 443),
            timeout=5
        ) as sock:

            with context.wrap_socket(
                sock,
                server_hostname=domain
            ) as ssock:

                cert = ssock.getpeercert()

                expiry = cert["notAfter"]

                issuer = dict(
                    x[0]
                    for x in cert["issuer"]
                )

                expires_date = datetime.strptime(
                    expiry,
                    "%b %d %H:%M:%S %Y %Z"
                )

                days_remaining = (
                    expires_date - datetime.utcnow()
                ).days

                cipher = ssock.cipher()[0]

                return {

                    "valid": True,

                    "expires": expiry,

                    "issuer":
                        issuer.get(
                            "organizationName",
                            "Unknown"
                        ),

                    "days_remaining": days_remaining,

                    "cipher": cipher

                }

    except Exception as e:

        print(e)

        return {

            "valid": False,

            "expires": "N/A",

            "issuer": "Unknown",

            "days_remaining": 0,

            "cipher": "Unknown"

        }
