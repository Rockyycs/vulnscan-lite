import requests
from bs4 import BeautifulSoup


def detect_cms(url):

    try:

        response = requests.get(
            url,
            timeout=10,
            headers={
                "User-Agent": "Mozilla/5.0"
            }
        )

        html = response.text.lower()

        soup = BeautifulSoup(
            html,
            "html.parser"
        )

        generator = soup.find(
            "meta",
            attrs={"name": "generator"}
        )

        if generator:

            content = generator.get(
                "content",
                ""
            ).lower()

            if "wordpress" in content:

                return {
                    "cms": "WordPress",
                    "risk": "Medium"
                }

            if "drupal" in content:

                return {
                    "cms": "Drupal",
                    "risk": "High"
                }

            if "joomla" in content:

                return {
                    "cms": "Joomla",
                    "risk": "Medium"
                }

        if "wp-content" in html:

            return {
                "cms": "WordPress",
                "risk": "Medium"
            }

        if "shopify" in html:

            return {
                "cms": "Shopify",
                "risk": "Low"
            }

        if "react" in html:

            return {
                "cms": "React",
                "risk": "Low"
            }

        headers = response.headers

        powered = headers.get(
            "X-Powered-By",
            ""
        ).lower()

        if "laravel" in powered:

            return {
                "cms": "Laravel",
                "risk": "Medium"
            }

        return {
            "cms": "Unknown",
            "risk": "Unknown"
        }

    except:

        return {
            "cms": "Unknown",
            "risk": "Unknown"
        }
