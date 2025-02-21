from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from datetime import datetime
import json

from analiz_eğitim import (
    analyze_all_employees,
    generate_all_reports,
    calculate_performance_metrics,
    analyze_trends,
    generate_recommendations,
    analyze_individual_employee
)

app = FastAPI(
    title="ALMS API",
    description="Learning Management System Analysis API",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS ayarları
origins = os.environ.get(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000,https://alms-last.netlify.app"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/")
async def root():
    return {"status": "ok", "message": "ALMS API is running"}

@app.get("/analyze/all", response_model=AnalysisResponse)
async def analyze_all():
    try:
        results = analyze_all_employees()
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/reports")
async def generate_reports():
    try:
        # Reports dizini oluştur
        os.makedirs("reports", exist_ok=True)
        
        # Raporları oluştur
        generate_all_reports()
        
        # Oluşturulan raporların listesini döndür
        report_files = [f for f in os.listdir("reports") if f.endswith('.pdf')]
        return {
            "status": "success",
            "message": "Raporlar başarıyla oluşturuldu",
            "reports": report_files
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/employee/{employee_id}", response_model=EmployeeAnalysisResponse)
async def get_employee_analysis(employee_id: str):
    try:
        results = analyze_individual_employee(employee_id)
        
        if "error" in results:
            raise HTTPException(status_code=404, detail=results["error"])
            
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
            if "error" in results:
                raise HTTPException(status_code=404, detail=results["error"])
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
