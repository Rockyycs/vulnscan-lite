from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet


def generate_report(data, filename):

    doc = SimpleDocTemplate(filename)

    styles = getSampleStyleSheet()

    elements = []

    elements.append(
        Paragraph(
            "VulnScan Lite Security Report",
            styles["Title"]
        )
    )

    elements.append(
        Spacer(1, 20)
    )

    elements.append(
        Paragraph(
            f"Security Score: {data['score']}",
            styles["BodyText"]
        )
    )

    elements.append(
        Spacer(1, 10)
    )

    elements.append(
        Paragraph(
            f"Summary: {data['summary']}",
            styles["BodyText"]
        )
    )

    elements.append(
        Spacer(1, 20)
    )

    elements.append(
        Paragraph(
            "Detected CVEs",
            styles["Heading2"]
        )
    )

    for cve in data["cves"]:

        elements.append(
            Paragraph(
                f"{cve['id']} - {cve['severity']}",
                styles["BodyText"]
            )
        )

    doc.build(elements)
