import socket

COMMON_PORTS = {
    21: "ftp",
    22: "ssh",
    23: "telnet",
    25: "smtp",
    53: "dns",
    80: "http",
    110: "pop3",
    143: "imap",
    443: "https",
    3306: "mysql",
    8080: "http-alt",
}


def scan_ports(domain):

    ports = []

    try:

        for port, service in COMMON_PORTS.items():

            sock = socket.socket(
                socket.AF_INET,
                socket.SOCK_STREAM
            )

            sock.settimeout(1)

            result = sock.connect_ex(
                (domain, port)
            )

            if result == 0:

                ports.append({
                    "port": port,
                    "state": "open",
                    "service": service
                })

            sock.close()

        return ports

    except Exception as e:

        return [{
            "error": str(e)
        }]
