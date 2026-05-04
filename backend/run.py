import uvicorn


def dev():
    """
    Inicia o servidor de desenvolvimento
    Execute este arquivo de dentro da pasta backend:
    cd backend
    python run.py
    """
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        reload_dirs=["."]
    )


if __name__ == "__main__":
    dev()
