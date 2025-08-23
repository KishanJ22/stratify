import json
from pathlib import Path
from fastapi import FastAPI

def save_openapi_spec(app: FastAPI, docs_directory: str = "docs"):
    docs_path = Path(docs_directory)
    docs_path.mkdir(exist_ok=True)
    
    # generate openapi spec
    openapi_spec = app.openapi()

    json_path = docs_path / "openapi.json"
    with open(json_path, "w") as f:
        json.dump(openapi_spec, f, indent=2)
        
    print(f"✅ OpenAPI schema saved to:")
    print(f"   📄 JSON: {json_path}")