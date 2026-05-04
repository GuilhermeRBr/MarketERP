from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
):
    error = exc.errors()[0]
    loc = error["loc"]

    ignored = {"body", "query", "path"}

    field = next(
        (
            item
            for item in reversed(loc)
            if isinstance(item, str) and item not in ignored
        ),
        None,
    )

    error_type = error["type"]

    ERROR_MESSAGES = {
        "string_too_long": "excede o tamanho máximo permitido.",
        "string_too_short": "tem tamanho menor do que o permitido.",
        "missing": "é obrigatório.",
        "int_parsing": "deve ser um número inteiro válido.",
        "float_parsing": "deve ser um número válido.",
        "greater_than": "deve ser maior que zero.",
        "greater_than_equal": "deve ser maior ou igual ao valor mínimo permitido.",
        "string_pattern_mismatch": "contém caracteres inválidos.",
    }

    message = ERROR_MESSAGES.get(error_type, "é inválido.")

    if field:
        message = f"O campo '{field}' {message}"
    else:
        message = "Erro nos dados enviados."

    return JSONResponse(
        status_code=422,
        content={"detail": message},
    )
