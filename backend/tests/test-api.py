from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_create_task():
    response = client.post(
        "/tasks",
        json={
            "title": "Learn API testing",
            "note": "Create my first API test",
        },
    )

    assert response.status_code == 404

    task = response.json()

    assert task["title"] == "Learn API testing"
    assert task["note"] == "Create my first API test"
    assert task["completed"] is False
