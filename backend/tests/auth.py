USER = {"full_name": "Test User", "email": "Test@Example.com", "password": "secret123"}


def register_and_login(client):
    client.post("/api/auth/register", json=USER)
    r = client.post("/api/auth/login", json={"email": USER["email"], "password": USER["password"]})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_register_ok_and_no_password_returned(client):
    r = client.post("/api/auth/register", json=USER)
    assert r.status_code == 201
    assert r.json()["email"] == "test@example.com"
    assert "password" not in r.text


def test_duplicate_email_rejected(client):
    client.post("/api/auth/register", json=USER)
    r = client.post("/api/auth/register", json=USER)
    assert r.status_code == 409


def test_short_password_rejected(client):
    r = client.post("/api/auth/register", json={**USER, "password": "short"})
    assert r.status_code == 422


def test_login_wrong_password(client):
    client.post("/api/auth/register", json=USER)
    r = client.post("/api/auth/login", json={"email": USER["email"], "password": "wrongpass1"})
    assert r.status_code == 401


def test_me_requires_token(client):
    assert client.get("/api/auth/me").status_code == 401


def test_me_with_token(client):
    headers = register_and_login(client)
    r = client.get("/api/auth/me", headers=headers)
    assert r.status_code == 200
    assert r.json()["full_name"] == "Test User"


def test_profile_empty_then_saved(client):
    headers = register_and_login(client)
    assert client.get("/api/profile", headers=headers).json()["education_level"] is None
    body = {"education_level": "Intermediate", "area_type": "Rural", "state": "Andhra Pradesh"}
    assert client.put("/api/profile", json=body, headers=headers).status_code == 200
    saved = client.get("/api/profile", headers=headers).json()
    assert saved["education_level"] == "Intermediate"
    assert saved["area_type"] == "Rural"


def test_profile_requires_login(client):
    assert client.get("/api/profile").status_code == 401