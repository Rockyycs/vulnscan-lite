def calculate_score(headers, cves=None, ports=None):

    score = 100

    # HEADER CHECKS
    for item in headers:

        if item["status"] == "Present":
            score += 5

        else:
            score -= 4

    # CVE SEVERITY IMPACT
    if cves:

        for cve in cves:

            severity = cve.get("severity", "UNKNOWN")

            if severity == "CRITICAL":
                score -= 10

            elif severity == "HIGH":
                score -= 7

            elif severity == "MEDIUM":
                score -= 5

            elif severity == "LOW":
                score -= 2

            else:
                score -= 2

    # OPEN PORTS IMPACT
    if ports:

        open_ports = [
            port for port in ports
            if port.get("state") == "open"
        ]

        score -= len(open_ports) * 3

    # LIMITS
    if score < 0:
        score = 0

    if score > 100:
        score = 100

    return score


def calculate_grade(score):

    if score >= 90:
        return "A"

    elif score >= 80:
        return "B"

    elif score >= 70:
        return "C"

    elif score >= 60:
        return "D"

    else:
        return "F"
