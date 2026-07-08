# TaskFlow

A lightweight task management REST API built with FastAPI, SQLAlchemy, and Pydantic.

## Features

* Create, view, update, and delete tasks through a REST API.
* Store task data using SQLAlchemy with SQLite (PostgreSQL-ready).
* Validate request and response data with Pydantic.
* Interactive API documentation provided by FastAPI.

## Tech Stack

* Python 3.12+
* FastAPI
* SQLAlchemy
* Pydantic
* Uvicorn
* SQLite

## Project Structure

```text
backend/
└── app/
    ├── crud.py
    ├── database.py
    ├── main.py
    ├── models.py
    └── schemas.py
```

## Installation

Clone the repository:

```bash
git clone https://github.com/alymkarim/taskflow.git
cd taskflow
```

Create and activate a virtual environment:

```bash
python -m venv .venv
```

Linux/macOS:

```bash
source .venv/bin/activate
```

Windows (PowerShell):

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r backend/requirements.txt
```

## Run

Start the development server:

```bash
uvicorn backend.app.main:app --reload
```

The API will be available at:

* http://127.0.0.1:8000
* Swagger UI: http://127.0.0.1:8000/docs
* ReDoc: http://127.0.0.1:8000/redoc

## Roadmap

* User authentication
* PostgreSQL support
* Docker deployment
* Task categories and priorities
* Search and filtering
* Automated tests

## Contributing

See `CONTRIBUTING.md` for contribution guidelines.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
