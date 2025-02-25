from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from datetime import datetime
import json
from supabase import create_client, Client

from analiz_eğitim import (
    analyze_all_employees,
    generate_all_reports,
    calculate_performance_metrics,
    analyze_trends,
    generate_recommendations,
    analyze_individual_employee
)

# Supabase yapılandırması
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY environment variables must be set")

# Supabase istemcisini oluştur
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(
    title="ALMS API",
    description="Learning Management System Analysis API",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS ayarları
origins = ["*"]  # Tüm originlere izin ver

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Frontend dosyalarını servis et
if os.path.exists("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")
else:
    print("Warning: static directory not found")

# API routes
class AnalysisResponse(BaseModel):
    total_employees: int
    department_statistics: Dict[str, Dict[str, float]]
    team_statistics: Dict[str, Dict[str, float]]

class EmployeeAnalysisResponse(BaseModel):
    employee_id: str
    current_metrics: Dict[str, float]
    historical_trends: Dict[str, Dict[str, Any]]
    recommendations: List[Dict[str, str]]
    segment_info: Optional[Dict[str, Any]]
    last_updated: Optional[str]
    performance_summary: Dict[str, Any]
    report_file: str

@app.get("/analyze/all", response_model=AnalysisResponse)
async def analyze_all():
    try:
        print("Starting analyze_all endpoint...")
        results = analyze_all_employees()
        if not results:
            print("No results from analyze_all_employees")
            return {
                "total_employees": 0,
                "department_statistics": {},
                "team_statistics": {}
            }
        print(f"Successfully got results: {results}")
        return results
    except Exception as e:
        print(f"Error in analyze_all endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/reports")
async def generate_reports():
    try:
        # Reports dizini oluştur
        if not os.path.exists("reports"):
            os.makedirs("reports")
            
        # Tüm raporları oluştur
        report_paths = generate_all_reports()
        
        return {
            "status": "success",
            "message": "All reports generated successfully",
            "report_paths": report_paths
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/employee/{employee_id}", response_model=EmployeeAnalysisResponse)
async def get_employee_analysis(employee_id: str):
    try:
        results = analyze_individual_employee(employee_id)
        if not results:
            raise HTTPException(status_code=404, detail="Employee not found")
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/employee/{employee_id}/report")
async def get_employee_report(employee_id: str):
    try:
        report_path = f"reports/employee_{employee_id}_report.pdf"
        
        if not os.path.exists(report_path):
            # Rapor yoksa oluştur
            results = analyze_individual_employee(employee_id)
            if not results:
                raise HTTPException(status_code=404, detail="Employee not found")
            report_path = results["report_file"]
        
        return FileResponse(
            report_path,
            media_type="application/pdf",
            filename=f"employee_{employee_id}_report.pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
