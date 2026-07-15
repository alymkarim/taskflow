from fastapi.testclient import TestClient


def test_root(
    client: TestClient,
):
    response = client.get("/")

    assert response.status_code == 200

    assert response.json() == {
        "message": "TaskFlow API is running"
    }


def test_create_task(
    client: TestClient,
):
    response = client.post(
        "/tasks",
        json={
            "title": "Learn API testing",
            "note": "Create a task using HTTP",
        },
    )

    assert response.status_code == 201

    task = response.json()

    assert task["id"] is not None

    assert (
        task["title"]
        == "Learn API testing"
    )

    assert (
        task["note"]
        == "Create a task using HTTP"
    )

    assert task["completed"] is False


def test_get_all_tasks(
    client: TestClient,
):
    client.post(
        "/tasks",
        json={
            "title": "Task one",
            "note": None,
        },
    )

    client.post(
        "/tasks",
        json={
            "title": "Task two",
            "note": "Second note",
        },
    )

    response = client.get("/tasks")

    assert response.status_code == 200

    tasks = response.json()

    assert len(tasks) == 2

    assert (
        tasks[0]["title"]
        == "Task one"
    )

    assert (
        tasks[1]["title"]
        == "Task two"
    )


def test_get_task_by_id(
    client: TestClient,
):
    create_response = client.post(
        "/tasks",
        json={
            "title": "Find this task",
            "note": "GET by ID test",
        },
    )

    task_id = create_response.json()["id"]

    response = client.get(
        f"/tasks/{task_id}"
    )

    assert response.status_code == 200

    task = response.json()

    assert task["id"] == task_id

    assert (
        task["title"]
        == "Find this task"
    )


def test_get_missing_task_returns_404(
    client: TestClient,
):
    response = client.get(
        "/tasks/999"
    )

    assert response.status_code == 404

    assert response.json() == {
        "detail": "Task not found"
    }


def test_update_task(
    client: TestClient,
):
    create_response = client.post(
        "/tasks",
        json={
            "title": "Old title",
            "note": "Keep this note",
        },
    )

    task_id = create_response.json()["id"]

    response = client.patch(
        f"/tasks/{task_id}",
        json={
            "title": "Updated title",
            "completed": True,
        },
    )

    assert response.status_code == 200

    updated_task = response.json()

    assert (
        updated_task["title"]
        == "Updated title"
    )

    assert (
        updated_task["note"]
        == "Keep this note"
    )

    assert (
        updated_task["completed"]
        is True
    )


def test_update_only_completed_field(
    client: TestClient,
):
    create_response = client.post(
        "/tasks",
        json={
            "title": "Complete this task",
            "note": "Do not change this note",
        },
    )

    task_id = create_response.json()["id"]

    response = client.patch(
        f"/tasks/{task_id}",
        json={
            "completed": True,
        },
    )

    assert response.status_code == 200

    updated_task = response.json()

    assert (
        updated_task["title"]
        == "Complete this task"
    )

    assert (
        updated_task["note"]
        == "Do not change this note"
    )

    assert (
        updated_task["completed"]
        is True
    )


def test_update_missing_task_returns_404(
    client: TestClient,
):
    response = client.patch(
        "/tasks/999",
        json={
            "title": "Does not exist",
        },
    )

    assert response.status_code == 404

    assert response.json() == {
        "detail": "Task not found"
    }


def test_delete_task(
    client: TestClient,
):
    create_response = client.post(
        "/tasks",
        json={
            "title": "Delete me",
            "note": None,
        },
    )

    task_id = create_response.json()["id"]

    delete_response = client.delete(
        f"/tasks/{task_id}"
    )

    assert delete_response.status_code == 200

    deleted_task = delete_response.json()

    assert deleted_task["id"] == task_id

    get_response = client.get(
        f"/tasks/{task_id}"
    )

    assert get_response.status_code == 404


def test_delete_missing_task_returns_404(
    client: TestClient,
):
    response = client.delete(
        "/tasks/999"
    )

    assert response.status_code == 404

    assert response.json() == {
        "detail": "Task not found"
    }


def test_create_task_without_title_returns_422(
    client: TestClient,
):
    response = client.post(
        "/tasks",
        json={
            "note": "Title is missing",
        },
    )

    assert response.status_code == 422


def test_task_id_must_be_integer(
    client: TestClient,
):
    response = client.get(
        "/tasks/not-a-number"
    )

    assert response.status_code == 422