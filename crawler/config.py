import os
from dotenv import load_dotenv

# Loads from the repo root .env (one level above crawler/)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

DATABASE_URL: str = os.environ["DATABASE_URL"]

CITIES: list[str] = ["bengaluru", "mumbai", "delhi", "pune", "hyderabad", "kolkata", "chennai", "goa"]
SOURCES: list[str] = ["townscript", "skillboxes"]