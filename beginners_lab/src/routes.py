from flask import Blueprint, request, jsonify, session
from .models import db, AdminUser, EmailTip, SopTip # Added SopTip
import functools

main_bp = Blueprint('main', __name__)

# --- Authentication Decorator ---
def login_required(f):
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            return jsonify({"message": "Authentication required. Please log in."}), 401
        return f(*args, **kwargs)
    return decorated_function

# --- Admin Authentication Routes ---
@main_bp.route('/admin/register', methods=['POST'])
def admin_register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400
    if AdminUser.query.filter_by(username=username).first():
        return jsonify({"message": "Admin user already exists"}), 400
    new_admin = AdminUser(username=username)
    new_admin.set_password(password)
    db.session.add(new_admin)
    db.session.commit()
    return jsonify({"message": f"Admin user {username} created successfully. Please login."}), 201

@main_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400
    admin = AdminUser.query.filter_by(username=username).first()
    if admin and admin.check_password(password):
        session['admin_id'] = admin.id
        session['admin_username'] = admin.username
        return jsonify({"message": "Login successful", "admin_id": admin.id, "username": admin.username}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401

@main_bp.route('/admin/logout', methods=['POST'])
def admin_logout():
    session.pop('admin_id', None)
    session.pop('admin_username', None)
    return jsonify({"message": "Logout successful"}), 200

@main_bp.route('/admin/status', methods=['GET'])
@login_required
def admin_status():
    return jsonify({
        "logged_in": True,
        "admin_id": session['admin_id'],
        "username": session.get('admin_username')
    }), 200

# --- EmailTip CRUD Routes ---
@main_bp.route('/email-tips', methods=['POST'])
@login_required
def create_email_tip():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    category = data.get('category')
    if not title or not content:
        return jsonify({"message": "Title and content are required for email tip"}), 400
    new_tip = EmailTip(title=title, content=content, category=category)
    db.session.add(new_tip)
    db.session.commit()
    return jsonify({"message": "Email tip created successfully", "id": new_tip.id, "title": new_tip.title}), 201

@main_bp.route('/email-tips', methods=['GET'])
@login_required
def get_email_tips():
    tips = EmailTip.query.order_by(EmailTip.created_at.desc()).all()
    output = []
    for tip in tips:
        tip_data = {
            'id': tip.id, 'title': tip.title, 'content': tip.content,
            'category': tip.category, 'created_at': tip.created_at.isoformat(),
            'updated_at': tip.updated_at.isoformat()
        }
        output.append(tip_data)
    return jsonify(output), 200

@main_bp.route('/email-tips/<int:tip_id>', methods=['GET'])
@login_required
def get_email_tip(tip_id):
    tip = EmailTip.query.get_or_404(tip_id)
    return jsonify({
        'id': tip.id, 'title': tip.title, 'content': tip.content,
        'category': tip.category, 'created_at': tip.created_at.isoformat(),
        'updated_at': tip.updated_at.isoformat()
    }), 200

@main_bp.route('/email-tips/<int:tip_id>', methods=['PUT'])
@login_required
def update_email_tip(tip_id):
    tip = EmailTip.query.get_or_404(tip_id)
    data = request.get_json()
    tip.title = data.get('title', tip.title)
    tip.content = data.get('content', tip.content)
    tip.category = data.get('category', tip.category)
    db.session.commit()
    return jsonify({"message": "Email tip updated successfully", "id": tip.id, "title": tip.title}), 200

@main_bp.route('/email-tips/<int:tip_id>', methods=['DELETE'])
@login_required
def delete_email_tip(tip_id):
    tip = EmailTip.query.get_or_404(tip_id)
    db.session.delete(tip)
    db.session.commit()
    return jsonify({"message": "Email tip deleted successfully", "id": tip_id}), 200

# --- SOP Tip CRUD Routes ---
@main_bp.route('/sop-tips', methods=['POST'])
@login_required
def create_sop_tip():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    category = data.get('category') # e.g., 'Internship Applications', 'Higher Education Abroad'

    if not title or not content:
        return jsonify({"message": "Title and content are required for SOP tip"}), 400

    new_tip = SopTip(title=title, content=content, category=category)
    db.session.add(new_tip)
    db.session.commit()
    return jsonify({"message": "SOP tip created successfully", "id": new_tip.id, "title": new_tip.title}), 201

@main_bp.route('/sop-tips', methods=['GET'])
@login_required # Or public if desired for frontend display without login
def get_sop_tips():
    tips = SopTip.query.order_by(SopTip.created_at.desc()).all()
    output = []
    for tip in tips:
        tip_data = {
            'id': tip.id,
            'title': tip.title,
            'content': tip.content,
            'category': tip.category,
            'created_at': tip.created_at.isoformat(),
            'updated_at': tip.updated_at.isoformat()
        }
        output.append(tip_data)
    return jsonify(output), 200

@main_bp.route('/sop-tips/<int:tip_id>', methods=['GET'])
@login_required # Or public
def get_sop_tip(tip_id):
    tip = SopTip.query.get_or_404(tip_id)
    return jsonify({
        'id': tip.id,
        'title': tip.title,
        'content': tip.content,
        'category': tip.category,
        'created_at': tip.created_at.isoformat(),
        'updated_at': tip.updated_at.isoformat()
    }), 200

@main_bp.route('/sop-tips/<int:tip_id>', methods=['PUT'])
@login_required
def update_sop_tip(tip_id):
    tip = SopTip.query.get_or_404(tip_id)
    data = request.get_json()

    tip.title = data.get('title', tip.title)
    tip.content = data.get('content', tip.content)
    tip.category = data.get('category', tip.category)
    # updated_at is handled by the model's onupdate

    db.session.commit()
    return jsonify({"message": "SOP tip updated successfully", "id": tip.id, "title": tip.title}), 200

@main_bp.route('/sop-tips/<int:tip_id>', methods=['DELETE'])
@login_required
def delete_sop_tip(tip_id):
    tip = SopTip.query.get_or_404(tip_id)
    db.session.delete(tip)
    db.session.commit()
    return jsonify({"message": "SOP tip deleted successfully", "id": tip_id}), 200

# --- Admin Dashboard Data ---
@main_bp.route('/admin/dashboard_data', methods=['GET'])
@login_required
def admin_dashboard_data():
    # In future, this could return actual data:
    # num_email_tips = EmailTip.query.count()
    # num_sop_tips = SopTip.query.count()
    # num_queries = StudentQuery.query.count()
    # return jsonify({
    #     "message": "Welcome to the admin dashboard!",
    #     "admin_id": session['admin_id'],
    #     "email_tips_count": num_email_tips,
    #     "sop_tips_count": num_sop_tips,
    #     "student_queries_count": num_queries
    # }), 200
    return jsonify({"message": "Welcome to the admin dashboard! Data will be here.", "admin_id": session['admin_id']}), 200
