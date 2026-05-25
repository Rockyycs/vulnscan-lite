from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import letter


def generate_pdf(data, filename):

    doc = SimpleDocTemplate(
        filename,
        pagesize=letter
    )

    styles = getSampleStyleSheet()

    elements = []

    title = Paragraph(
        "VulnScan Lite Security Report",
        styles['Title']
    )

    elements.append(title)

    elements.append(Spacer(1, 20))

    score = Paragraph(
        f"Security Score: {data['score']}",
        styles['Heading2']
    )

    grade = Paragraph(
        f"Grade: {data['grade']}",
        styles['Heading2']
    )

    summary = Paragraph(
        f"Summary: {data['summary']}",
        styles['BodyText']
    )

    elements.append(score)
    elements.append(grade)
    elements.append(summary)

    elements.append(Spacer(1, 20))

    headers_title = Paragraph(
        "Security Headers",
        styles['Heading2']
    )

    elements.append(headers_title)

    for header in data["headers"]:

        text = (
            f"{header['header']} - "
            f"{header['status']}"
        )

        elements.append(
            Paragraph(text, styles['BodyText'])
        )

    elements.append(Spacer(1, 20))

    cve_title = Paragraph(
        "CVE Intelligence",
        styles['Heading2']
    )

    elements.append(cve_title)

    for cve in data["cves"]:

        text = (
            f"{cve['id']} - "
            f"{cve['severity']}"
        )

        elements.append(
            Paragraph(text, styles['BodyText'])
        )

    doc.build(elements)
