from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash # Import hashing functions

db = SQLAlchemy()

class AdminUser(db.Model):
    __tablename__ = 'admin_users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False) # Increased length for robust hashes
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<AdminUser {self.username}>'

class EmailTip(db.Model):
    __tablename__ = 'email_tips'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<EmailTip {self.title}>'

class SopTip(db.Model):
    __tablename__ = 'sop_tips'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<SopTip {self.title}>'

class StudentQuery(db.Model):
    __tablename__ = 'student_queries'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    question = db.Column(db.Text, nullable=False)
    formatted_question = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_answered = db.Column(db.Boolean, default=False, nullable=False)

    def __repr__(self):
        return f'<StudentQuery from {self.name}>'

class SiteInfo(db.Model):
    __tablename__ = 'site_info'
    id = db.Column(db.Integer, primary_key=True)
    about_website_content = db.Column(db.Text, nullable=True)
    admin_name = db.Column(db.String(100), nullable=True, default='Admin')
    admin_email_contact = db.Column(db.String(120), nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return '<SiteInfo>'
