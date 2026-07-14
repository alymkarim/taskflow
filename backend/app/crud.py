from sqlalchemy.orm import Session
<<<<<<< Updated upstream
<<<<<<< Updated upstream
from . import models, schemas

'''create_task()  → add a task
get_alltasks()    → get all tasks
get_task()     → get one task by id
update_task()  → edit a task
delete_task()  → remove a task'''

//create

def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(**task.model_dump())
=======
=======
>>>>>>> Stashed changes

from . import models, schemas


def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(
        title=task.title,
        note=task.note,
    )
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    return db_task

<<<<<<< Updated upstream
<<<<<<< Updated upstream
//read
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

def get_tasks(db: Session):
    return db.query(models.Task).all()


def get_task(db: Session, task_id: int):
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    return db.query(models.Task).filter(models.Task.id == task_id).first()

//update

def update_task(db: Session, task_id: int, task_update: schemas.TaskUpdate):
=======
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    db_task = get_task(db, task_id)

    if db_task is None:
        return None

    update_data = task_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_task, key, value)

    db.commit()
    db.refresh(db_task)

    return db_task

<<<<<<< Updated upstream
<<<<<<< Updated upstream
//delete
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

def delete_task(db: Session, task_id: int):
    db_task = get_task(db, task_id)

    if db_task is None:
        return None

    db.delete(db_task)
    db.commit()

    return db_task