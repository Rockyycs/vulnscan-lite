import socket


def scan_ports(domain):

    common_ports = {

        21: "FTP",

        22: "SSH",

        25: "SMTP",

        53: "DNS",

        80: "HTTP",

        110: "POP3",

        143: "IMAP",

        443: "HTTPS",

        3306: "MySQL",

        8080: "HTTP-ALT",

    }

    open_ports = []

    for port, service in common_ports.items():

        sock = socket.socket(
            socket.AF_INET,
            socket.SOCK_STREAM
        )

        sock.settimeout(1)

        result = sock.connect_ex(
            (domain, port)
        )

        if result == 0:

            open_ports.append({

                "port": port,

                "service": service,

            })

        sock.close()

    return open_ports
