from sqlalchemy.orm import Session

from app import models, schemas


def create_task(
    db: Session,
    task: schemas.TaskCreate,
):
    db_task = models.Task(
        title=task.title,
        note=task.note,
    )

    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    return db_task


def get_tasks(db: Session):
    return db.query(models.Task).all()


def get_task(
    db: Session,
    task_id: int,
):
    return (
        db.query(models.Task)
        .filter(models.Task.id == task_id)
        .first()
    )


def update_task(
    db: Session,
    task_id: int,
    task_update: schemas.TaskUpdate,
):
    db_task = get_task(
        db=db,
        task_id=task_id,
    )

    if db_task is None:
        return None

    update_data = task_update.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(db_task, key, value)

    db.commit()
    db.refresh(db_task)

    return db_task


def delete_task(
    db: Session,
    task_id: int,
):
    db_task = get_task(
        db=db,
        task_id=task_id,
    )

    if db_task is None:
        return None

    db.delete(db_task)
    db.commit()

    return db_task