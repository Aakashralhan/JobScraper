import argparse
import importlib.util
import os


def parse_args():
    parser = argparse.ArgumentParser(description="Wrapper to run existing scraper with runtime overrides.")
    parser.add_argument("--role", default="", help="Role keyword")
    parser.add_argument("--location", default="", help="Location query")
    parser.add_argument("--platforms", default="LinkedIn", help="Comma-separated platforms")
    parser.add_argument("--time-filter", default="Last 5 Days", help="Time filter text")
    parser.add_argument("--output-file", required=True, help="Absolute output file path")
    return parser.parse_args()


def normalize_platforms(raw):
    return {p.strip().lower() for p in raw.split(",") if p.strip()}


def split_multi_role(raw):
    normalized = (raw or "").replace("\n", ",").replace("|", ",")
    return [item.strip() for item in normalized.split(",") if item.strip()]


def split_multi_location(raw):
    normalized = (raw or "").replace("\n", "|").replace(";", "|").replace(",", "|")
    return [item.strip() for item in normalized.split("|") if item.strip()]


def map_max_days(time_filter):
    if time_filter == "Last 24 Hours":
        return 1
    if time_filter == "Last 3 Days":
        return 3
    return 5


def main():
    args = parse_args()

    script_dir = os.path.abspath(os.path.dirname(__file__))
    backend_root = os.path.abspath(os.path.join(script_dir, ".."))
    scraper_path = os.path.join(backend_root, "linkedin_scraper.py")

    spec = importlib.util.spec_from_file_location("backend_linkedin_scraper", scraper_path)
    if not spec or not spec.loader:
        raise ModuleNotFoundError(
            "Could not load backend scraper module from "
            f"'{scraper_path}'."
        )
    scraper = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(scraper)

    selected = normalize_platforms(args.platforms)
    scraper.OUTPUT_FILE = args.output_file
    scraper.MAX_JOB_AGE_DAYS = map_max_days(args.time_filter)

    roles = split_multi_role(args.role)
    scraper.HR_KEYWORDS = roles or [""]

    locations = split_multi_location(args.location)
    scraper.LOCATION_QUERIES = locations or [""]

    original_linkedin = scraper.scrape_linkedin_last24h
    original_yahoo = scraper.yahoo_site_results_last5d

    def linkedin_guard(*func_args, **func_kwargs):
        if "linkedin" not in selected:
            return []
        return original_linkedin(*func_args, **func_kwargs)

    def yahoo_guard(portal_name, *func_args, **func_kwargs):
        portal_key = str(portal_name).strip().lower()
        if portal_key not in selected:
            return []
        return original_yahoo(portal_name, *func_args, **func_kwargs)

    scraper.scrape_linkedin_last24h = linkedin_guard
    scraper.yahoo_site_results_last5d = yahoo_guard

    scraper.main()


if __name__ == "__main__":
    main()
