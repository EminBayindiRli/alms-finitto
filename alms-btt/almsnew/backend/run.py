import os
import uvicorn

# ODBC sürücü yollarını ayarla
os.environ["ODBCSYSINI"] = "/opt/homebrew/etc"
os.environ["ODBCINI"] = "/opt/homebrew/etc/odbc.ini"
os.environ["DYLD_LIBRARY_PATH"] = "/opt/homebrew/lib"

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 