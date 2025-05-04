# app/models/exceptions/QueryException.py

class QueryException(Exception):
    """Custom exception for database query-related errors."""

    def __init__(self, message: str, original_exception: Exception = None):
        super().__init__(f"{message}: {str(original_exception)}")
        self.original_exception = original_exception
