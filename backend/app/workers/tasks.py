from app.database import conn, cursor
from app.workers.celery_worker import celery

from app.scanner.headers import analyze_headers
from app.scanner.ssl_check import check_ssl
from app.scanner.cms_detect import detect_cms
from app.scanner.scoring import calculate_score, calculate_grade
from app.scanner.remediation import REMEDIATION
from app.scanner.cve_lookup import lookup_cves
from app.scanner.port_scan import scan_ports
from app.utils.validators import validate_target


@celery.task
def run_scan(url):

    valid, result_data = validate_target(url)

    if not valid:

        return {
            "error": result_data
        }

    domain = result_data

    headers = analyze_headers(url)

    for item in headers:

        if item["status"] == "Missing":

            item["remediation"] = REMEDIATION.get(
                item["header"],
                "No remediation available."
            )

    ssl_info = check_ssl(domain)

    cms_info = detect_cms(url)

    ports = scan_ports(domain)

    cves = []

    if cms_info["cms"] != "Unknown":

        cves = lookup_cves(cms_info["cms"])

    score = calculate_score(
        headers,
        cves,
        ports
    )

    grade = calculate_grade(score)

    cursor.execute(
        """
        SELECT * FROM scans
        WHERE url=?
        """,
        (url,)
    )

    existing = cursor.fetchone()

    if existing:

        cursor.execute(
            """
            UPDATE scans
            SET score=?
            WHERE url=?
            """,
            (score, url)
        )

    else:

        cursor.execute(
            """
            INSERT INTO scans (url, score)
            VALUES (?, ?)
            """,
            (url, score)
        )

    conn.commit()

    summary = f"""
This website has a security score of {score}
with grade {grade}.

Detected {len(headers)} security header checks,
{len(cves)} CVE matches,
and {len(ports)} open ports.

The target may be vulnerable to known exploits
and requires immediate security hardening.
"""

    return {

        "score": score,

        "grade": grade,

        "summary": summary,

        "headers": headers,

        "ssl": ssl_info,

        "cms": cms_info,

        "cves": cves,

        "ports": ports
    }
