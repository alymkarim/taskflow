from sqlalchemy.orm import Session
from . import models, schemas

'''create_task()  → add a task
get_alltasks()    → get all tasks
get_task()     → get one task by id
update_task()  → edit a task
delete_task()  → remove a task'''

#create

def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(**task.model_dump())

    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    return db_task

#read

def get_tasks(db: Session):
    return db.query(models.Task).all()


def get_task(db: Session, task_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id).first()

#update

def update_task(db: Session, task_id: int, task_update: schemas.TaskUpdate):
    db_task = get_task(db, task_id)

    if db_task is None:
        return None

    update_data = task_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_task, key, value)

    db.commit()
    db.refresh(db_task)

    return db_task

#delete

def delete_task(db: Session, task_id: int):
    db_task = get_task(db, task_id)

    if db_task is None:
        return None

    db.delete(db_task)
    db.commit()

    return db_task