import requests


def lookup_cves(product):

    try:

        url = (
            "https://services.nvd.nist.gov/rest/json/cves/2.0"
            f"?keywordSearch={product}"
        )

        response = requests.get(
            url,
            timeout=10,
            headers={
                "User-Agent": "VulnScanLite/1.0"
            }
        )

        data = response.json()

        vulnerabilities = data.get(
            "vulnerabilities",
            []
        )

        results = []

        for item in vulnerabilities[:5]:

            cve = item.get("cve", {})

            metrics = cve.get(
                "metrics",
                {}
            )

            severity = "UNKNOWN"

            score = "N/A"

            if "cvssMetricV31" in metrics:

                severity = metrics[
                    "cvssMetricV31"
                ][0]["cvssData"]["baseSeverity"]

                score = metrics[
                    "cvssMetricV31"
                ][0]["cvssData"]["baseScore"]

            elif "cvssMetricV30" in metrics:

                severity = metrics[
                    "cvssMetricV30"
                ][0]["cvssData"]["baseSeverity"]

                score = metrics[
                    "cvssMetricV30"
                ][0]["cvssData"]["baseScore"]

            descriptions = cve.get(
                "descriptions",
                []
            )

            description = ""

            if descriptions:

                description = descriptions[0].get(
                    "value",
                    ""
                )

            results.append({

                "id": cve.get("id"),

                "severity": severity,

                "score": score,

                "description": description[:220]

            })

        return results

    except Exception as e:

        return [{

            "id": "CVE Lookup Error",

            "severity": "ERROR",

            "score": "N/A",

            "description": str(e)

        }]
