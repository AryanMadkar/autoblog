from apscheduler.schedulers.background import BackgroundScheduler
from blog_workflow import create_blog_post
from database import db
from models import BlogPost
from datetime import datetime

scheduler = BackgroundScheduler()


def scheduled_blog_generation():
    """Function that runs at midnight to generate blog"""
    print(f"[{datetime.now()}] Starting scheduled blog generation...")

    try:
        # Generate blog using LangGraph workflow
        blog_data = create_blog_post()

        # Create blog post model
        blog = BlogPost(
            title=blog_data["title"],
            content=blog_data["content"],
            image_url=blog_data["image_url"],
            tags=blog_data["tags"],
            category=blog_data["category"],
        )

        # Save to database
        blog_id = db.inser_blog(blog)
        print(f"[{datetime.now()}] Blog generated successfully! ID: {blog_id}")

        return {"success": True, "blog_id": blog_id}

    except Exception as e:
        print(f"[{datetime.now()}] Error generating blog: {str(e)}")
        return {"success": False, "error": str(e)}


def start_scheduler():
    """Start the scheduler"""
    # Schedule blog generation at midnight (00:00) every day
    scheduler.add_job(
        scheduled_blog_generation,
        trigger="cron",
        hour=0,
        minute=0,
        id="blog_generation_job",
    )
    scheduler.start()
    print("Scheduler started - Blog will be generated daily at midnight")


def stop_scheduler():
    """Stop the scheduler"""
    scheduler.shutdown()
    print("Scheduler stopped")
