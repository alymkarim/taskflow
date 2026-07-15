from sqlalchemy.orm import Session

from app import crud, schemas


def test_create_task(
    db_session: Session,
):
    task_data = schemas.TaskCreate(
        title="Learn integration testing",
        note="Test CRUD and database together",
    )

    created_task = crud.create_task(
        db=db_session,
        task=task_data,
    )

    assert created_task.id is not None

    assert (
        created_task.title
        == "Learn integration testing"
    )

    assert (
        created_task.note
        == "Test CRUD and database together"
    )

    assert created_task.completed is False


def test_get_all_tasks(
    db_session: Session,
):
    first_task = schemas.TaskCreate(
        title="Task one",
        note=None,
    )

    second_task = schemas.TaskCreate(
        title="Task two",
        note="Second note",
    )

    crud.create_task(
        db=db_session,
        task=first_task,
    )

    crud.create_task(
        db=db_session,
        task=second_task,
    )

    tasks = crud.get_tasks(
        db=db_session
    )

    assert len(tasks) == 2
    assert tasks[0].title == "Task one"
    assert tasks[1].title == "Task two"


def test_get_task_by_id(
    db_session: Session,
):
    task_data = schemas.TaskCreate(
        title="Find this task",
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

    assert (
        retrieved_task.id
        == created_task.id
    )

    assert (
        retrieved_task.title
        == "Find this task"
    )


def test_get_missing_task_returns_none(
    db_session: Session,
):
    task = crud.get_task(
        db=db_session,
        task_id=999,
    )

    assert task is None


def test_update_task(
    db_session: Session,
):
    task_data = schemas.TaskCreate(
        title="Old title",
        note="Keep this note",
    )

    created_task = crud.create_task(
        db=db_session,
        task=task_data,
    )

    update_data = schemas.TaskUpdate(
        title="New title",
        completed=True,
    )

    updated_task = crud.update_task(
        db=db_session,
        task_id=created_task.id,
        task_update=update_data,
    )

    assert updated_task is not None

    assert (
        updated_task.title
        == "New title"
    )

    assert (
        updated_task.note
        == "Keep this note"
    )

    assert updated_task.completed is True


def test_update_missing_task_returns_none(
    db_session: Session,
):
    update_data = schemas.TaskUpdate(
        title="Does not exist",
    )

    updated_task = crud.update_task(
        db=db_session,
        task_id=999,
        task_update=update_data,
    )

    assert updated_task is None


def test_delete_task(
    db_session: Session,
):
    task_data = schemas.TaskCreate(
        title="Delete this task",
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

    retrieved_task = crud.get_task(
        db=db_session,
        task_id=created_task.id,
    )

    assert retrieved_task is None


def test_delete_missing_task_returns_none(
    db_session: Session,
):
    deleted_task = crud.delete_task(
        db=db_session,
        task_id=999,
    )

    assert deleted_task is None