from sqlalchemy import Column, Integer, String, ARRAY, Date , Float , Boolean, DateTime
from database import Base

class Movie (Base):
    __tablename__  = 'Movies'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)  # תיאור הסרט
    release_date = Column(Date, nullable=False)  # תאריך יציאה
    url_image = Column(String, nullable=True)   # קישור לתמונה
    duration = Column(Integer, nullable=False)   # משך זמן (דקות)
    genre_ids = Column(ARRAY(Integer), nullable=True)  # ז'אנרים
    actors = Column(ARRAY(String), nullable=True)  # רשימת שחקנים
    director = Column(String, nullable=False)  # במאי
    language = Column(String, nullable=False)  # שפה
    rating = Column(Float, nullable=True)  # דירוג כללי (IMDB)
    star_rating = Column(Float, nullable=True)  # דירוג כוכבים (1-5)
    awards = Column(ARRAY(String), nullable=True, default=[])  # רשימת פרסים
    age_restriction = Column(Integer, nullable=True)  # מגבלת גיל
    watchurl = Column(String, nullable=True)
    deleted = Column(Boolean, default=False)  # מחיקה רכה
    deleted_on = Column(DateTime, nullable=True)
    is_favorite = Column(Boolean, default=False)
