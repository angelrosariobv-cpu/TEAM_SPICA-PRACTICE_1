from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from app.schemas import TaskCreate, TaskResponse, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["Tasks"])

filler_db : dict[int, dict] = {}
next_id = 1

@router.get("/", response_model=list[TaskResponse])
def list_tasks():
    return list(filler_db.values())

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int):
    task = filler_db.get(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate):
    global next_id
    task = {
        id: next_id,
        "completed": False,
        "created_at": datetime.now(timezone.utc),
        **payload.model_dump(),
    }
    filler_db[next_id] = task
    next_id += 1
    return task

@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, payload: TaskUpdate):
    task = filler_db.get(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    task.update(payload.model_dump(exclude_unset=True))
    return task

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int):
    if task_id not in filler_db:
        raise HTTPException(status_code=404, detail="Task not found")
    del filler_db[task_id]
