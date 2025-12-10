"""Tests for the API endpoints."""
import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root():
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert "version" in data
    assert "status" in data
    assert data["status"] == "running"


def test_health_check():
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_get_curriculum():
    """Test curriculum endpoint."""
    response = client.get("/api/curriculum")
    assert response.status_code == 200
    data = response.json()
    assert "sections" in data
    assert "total_modules" in data
    assert "total_estimated_minutes" in data


def test_list_modules():
    """Test list modules endpoint."""
    response = client.get("/api/modules")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_module_not_found():
    """Test getting a non-existent module."""
    response = client.get("/api/modules/nonexistent-module")
    assert response.status_code == 404


def test_validate_exercise_module_not_found():
    """Test validation with non-existent module."""
    response = client.post(
        "/api/validate",
        json={
            "module_id": "nonexistent",
            "exercise_id": "ex-1",
            "code": "x = 1",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["result"] == "error"
    assert "not found" in data["error_message"].lower()


def test_docs_cached_symbols():
    """Test cached symbols endpoint."""
    response = client.get("/api/docs/pytorch-cached")
    assert response.status_code == 200
    data = response.json()
    assert "cached_symbols" in data
    assert isinstance(data["cached_symbols"], list)
