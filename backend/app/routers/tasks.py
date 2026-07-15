from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db


router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
)


@router.post(
    "",
    response_model=schemas.TaskOut,
    status_code=status.HTTP_201_CREATED,
)
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db),
):
    return crud.create_task(
        db=db,
        task=task,
    )


@router.get(
    "",
    response_model=list[schemas.TaskOut],
)
def get_tasks(
    db: Session = Depends(get_db),
):
    return crud.get_tasks(db=db)


@router.get(
    "/{task_id}",
    response_model=schemas.TaskOut,
)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
):
    task = crud.get_task(
        db=db,
        task_id=task_id,
    )

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return task


@router.patch(
    "/{task_id}",
    response_model=schemas.TaskOut,
)
def update_task(
    task_id: int,
    task_update: schemas.TaskUpdate,
    db: Session = Depends(get_db),
):
    task = crud.update_task(
        db=db,
        task_id=task_id,
        task_update=task_update,
    )

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return task


@router.delete(
    "/{task_id}",
    response_model=schemas.TaskOut,
)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
):
    task = crud.delete_task(
        db=db,
        task_id=task_id,
    )

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return task