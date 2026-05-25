import nmap


def scan_ports(domain):

    scanner = nmap.PortScanner()

    try:

        scanner.scan(domain, arguments="-F")

        ports = []

        for host in scanner.all_hosts():

            for proto in scanner[host].all_protocols():

                for port in scanner[host][proto]:

                    ports.append({

                        "port": port,
                        "state": scanner[host][proto][port]["state"],
                        "service": scanner[host][proto][port]["name"]

                    })

        return ports

    except Exception as e:

        return [{
            "error": str(e)
        }]
