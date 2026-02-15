"""
Flask app: Home, Upload, Dashboard, Settings with sign-in.
When signed in, home shows: "Welcome [name], let's see how it works"
"""
import os
from flask import Flask, render_template, request, redirect, url_for, session, flash

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-change-in-production")


def get_user_name():
    """Return current user's display name from session or None."""
    return session.get("user_name")


@app.route("/")
def home():
    return render_template("home.html", user_name=get_user_name())


@app.route("/upload", methods=["GET", "POST"])
def upload():
    if request.method == "POST":
        # Placeholder: handle file upload later if needed
        flash("Upload feature ready — add your logic here.", "info")
        return redirect(url_for("upload"))
    return render_template("upload.html", user_name=get_user_name())


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html", user_name=get_user_name())


@app.route("/settings", methods=["GET", "POST"])
def settings():
    if request.method == "POST":
        new_name = (request.form.get("display_name") or "").strip()
        if new_name:
            session["user_name"] = new_name
            flash("Settings saved.", "success")
        else:
            flash("Please enter a display name.", "warning")
        return redirect(url_for("settings"))
    return render_template("settings.html", user_name=get_user_name())


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        name = (request.form.get("name") or "").strip()
        if name:
            session["user_name"] = name
            flash(f"Welcome back, {name}!", "success")
            return redirect(url_for("home"))
        flash("Please enter your name to sign in.", "warning")
        return redirect(url_for("login"))
    return render_template("login.html", user_name=get_user_name())


@app.route("/logout")
def logout():
    session.pop("user_name", None)
    flash("You have been signed out.", "info")
    return redirect(url_for("home"))


if __name__ == "__main__":
    app.run(debug=True, port=5000)
