from urllib.parse import urlparse
import socket
import ipaddress


def validate_target(url):

    parsed = urlparse(url)

    hostname = parsed.hostname

    if not hostname:
        return False, "Invalid URL"

    try:

        ip = socket.gethostbyname(hostname)

        ip_obj = ipaddress.ip_address(ip)

        if (
            ip_obj.is_private
            or ip_obj.is_loopback
            or ip_obj.is_reserved
            or ip_obj.is_multicast
        ):

            return False, "Private or restricted IPs are not allowed"

        return True, hostname

    except Exception:

        return False, "Unable to resolve hostname"
