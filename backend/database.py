from pymongo import MongoClient
from config import get_settings
from typing import List, Optional
from models import BlogPost
from datetime import datetime

settings = get_settings()


class Database:
    def __init__(self) -> None:
        self.client = MongoClient(settings.mongodb_url)
        self.db = self.client.get_database(settings.database_name)
        self.blogs_collection = self.db["autoblogs"]

    def inser_blog(self, blog: BlogPost) -> str:
        result = self.blogs_collection.insert_one(blog.dict())
        return str(result.inserted_id)

    def get_all_blogs(self) -> List[dict]:
        blogs = list(self.blogs_collection.find().sort("created_at", -1))
        for blog in blogs:
            blog["id"] = str(blog.pop("_id"))
        return blogs

    def get_blog_id(self, blog_id: str) -> Optional[dict]:
        from bson import ObjectId

        blog = self.blogs_collection.find_one({"_id": ObjectId(blog_id)})
        if blog:
            blog["id"] = str(blog.pop("_id"))
        return blog


db = Database()
