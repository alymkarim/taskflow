from sqlalchemy.orm import Session

from app import crud, schemas


def test_create_task(db_session: Session):
    task_data = schemas.TaskCreate(
        title="Learn integration testing",
        note="Test CRUD with a database",
    )

    created_task = crud.create_task(
        db=db_session,
        task=task_data,
    )

    assert created_task.id is not None
    assert created_task.title == "Learn integration testing"
    assert created_task.note == "Test CRUD with a database"
    assert created_task.completed is False


def test_get_task(db_session: Session):
    task_data = schemas.TaskCreate(
        title="Read a task",
        note=None,
    )

    created_task = crud.create_task(
        db=db_session,
        task=task_data,
    )

    retrieved_task = crud.get_task(
        db=db_session,
        task_id=created_task.id,
    )

    assert retrieved_task is not None
    assert retrieved_task.id == created_task.id
    assert retrieved_task.title == "Read a task"


def test_get_missing_task_returns_none(db_session: Session):
    retrieved_task = crud.get_task(
        db=db_session,
        task_id=999,
    )

    assert retrieved_task is None


def test_update_task(db_session: Session):
    task_data = schemas.TaskCreate(
        title="Old title",
        note="Old note",
    )

    created_task = crud.create_task(
        db=db_session,
        task=task_data,
    )

    update_data = schemas.TaskUpdate(
        title="Updated title",
        completed=True,
    )

    updated_task = crud.update_task(
        db=db_session,
        task_id=created_task.id,
        task_update=update_data,
    )

    assert updated_task is not None
    assert updated_task.title == "Updated title"
    assert updated_task.note == "Old note"
    assert updated_task.completed is True


def test_delete_task(db_session: Session):
    task_data = schemas.TaskCreate(
        title="Delete me",
        note=None,
    )

    created_task = crud.create_task(
        db=db_session,
        task=task_data,
    )

    deleted_task = crud.delete_task(
        db=db_session,
        task_id=created_task.id,
    )

    assert deleted_task is not None
    assert deleted_task.id == created_task.id

    retrieved_task = crud.get_task(
        db=db_session,
        task_id=created_task.id,
    )

    assert retrieved_task is None