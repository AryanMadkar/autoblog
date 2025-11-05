from fastapi import FastAPI, HTTPException, Header, Depends
from contextlib import asynccontextmanager
from typing import List
from models import BlogResponse
from database import db
from scheduler import start_scheduler, stop_scheduler, scheduled_blog_generation
from config import get_settings
from fastapi.middleware.cors import CORSMiddleware

settings = get_settings()
origins = [
    "http://localhost:5173",  # your frontend
    "http://127.0.0.1:5173",
    "https://autoblog-1-tyoa.onrender.com",  # sometimes browsers resolve to 127.0.0.1
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start the scheduler
    start_scheduler()
    yield
    # Shutdown: Stop the scheduler
    stop_scheduler()


app = FastAPI(
    title="Automated Blog Generator API",
    description="Smart blog generation system with LangGraph and Groq",
    version="1.0.0",
    lifespan=lifespan,
)


# CORS Middleware - Must be added AFTER app creation
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def verify_admin(x_admin_key: str = Header(...)):
    """Verify admin API key"""
    if x_admin_key != settings.admin_api_key:
        raise HTTPException(status_code=403, detail="Invalid admin key")
    return True


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "message": "Automated Blog Generator API",
        "version": "1.0.0",
    }


@app.get("/blogs", response_model=List[BlogResponse])
async def get_all_blogs():
    """Get all generated blogs"""
    blogs = db.get_all_blogs()
    return blogs


@app.get("/blogs/{blog_id}", response_model=BlogResponse)
async def get_blog(blog_id: str):
    """Get a specific blog by ID"""
    blog = db.get_blog_id(blog_id)  # FIXED: was get_blog_id
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog


@app.post("/admin/generate-blog")
async def manual_blog_generation(admin_verified: bool = Depends(verify_admin)):
    """
    Manual blog generation endpoint (Admin only)
    Requires X-Admin-Key header
    """
    result = scheduled_blog_generation()

    if result["success"]:
        return {"message": "Blog generated successfully", "blog_id": result["blog_id"]}
    else:
        raise HTTPException(
            status_code=500, detail=f"Blog generation failed: {result['error']}"
        )


@app.get("/admin/scheduler-status")
async def scheduler_status(admin_verified: bool = Depends(verify_admin)):
    """Check scheduler status (Admin only)"""
    from scheduler import scheduler

    jobs = scheduler.get_jobs()
    return {
        "scheduler_running": scheduler.running,
        "scheduled_jobs": [
            {"id": job.id, "next_run_time": str(job.next_run_time)} for job in jobs
        ],
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
