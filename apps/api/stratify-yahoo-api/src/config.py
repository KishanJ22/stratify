import json
from pathlib import Path

def get_package_version():
    try:
        project_root = Path(__file__).parent.parent
        package_json_path = project_root / "package.json"
        
        if package_json_path.exists():
            with open(package_json_path, 'r') as file:
                package_data = json.load(file)
                return package_data.get("version")
        else:
            return "0.1.0"  # Default version if package.json is not found
    except Exception as e:
        print(f"Warning: Could not read version from package.json: {e}")
        return "0.1.0"

openapi_config = {
    "title": "Stratify Yahoo API",
    "version": get_package_version(),
    "description": "A REST API for accessing Yahoo Finance data",
}
