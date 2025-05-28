import os
from flask import Flask
from .models import db # Import db instance from models.py
from flask_migrate import Migrate # Import Migrate

# Load environment variables, especially DATABASE_URL and FLASK_SECRET_KEY
from dotenv import load_dotenv
load_dotenv() # take environment variables from .env.

def create_app():
    app = Flask(__name__)

    # Configuration
    # Try to get DATABASE_URL from environment, otherwise default to a local sqlite DB
    database_url = os.environ.get('DATABASE_URL', 'sqlite:///../instance/beginners_lab.db')
    
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # Silence the deprecation warning

    # IMPORTANT: Set a SECRET_KEY for session management
    # This should be a complex, random string and kept secret in production.
    # For development, you can use a simple one, but change it for production.
    # It's good practice to load this from an environment variable.
    app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'dev_default_secret_key_please_change')


    # Ensure the instance folder exists if using SQLite default
    if 'sqlite:///' in database_url:
        # app.root_path is src/
        # We want the instance folder to be at the same level as src/, e.g., beginners_lab/instance/
        instance_path = os.path.join(app.root_path, '..', 'instance') 
        if not os.path.exists(instance_path):
            try:
                os.makedirs(instance_path)
                print(f"Instance folder created at {instance_path}")
            except OSError as e:
                # Handle potential race condition if another process/thread creates it
                if not os.path.exists(instance_path):
                    print(f"Error creating instance folder: {e}")


    # Initialize extensions
    db.init_app(app)
    migrate = Migrate(app, db) # Initialize Flask-Migrate

    # Register Blueprints
    from .routes import main_bp # Import the blueprint
    app.register_blueprint(main_bp, url_prefix='/api') # Prefix all routes in main_bp with /api


    # A simple test route (outside the blueprint) for basic app testing
    @app.route('/hello')
    def hello():
        return 'Hello, World from Flask!'

    return app

# The following is useful if you run `python -m src.app` (though usually a WSGI server is used)
# if __name__ == '__main__':
#     app = create_app()
#     # You might want to create the DB tables here if they don't exist,
#     # but Flask-Migrate is the preferred way for schema management.
#     # with app.app_context():
#     #     db.create_all() # Creates tables based on models.py
#     app.run(debug=True)
