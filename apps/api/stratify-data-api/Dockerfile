FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim AS builder

# Don't install dev dependencies and don't download python as the python version in the base image will be used
ENV UV_NO_DEV=1
ENV UV_PYTHON_DOWNLOADS=0

WORKDIR /app

# Copy dependency files first
COPY apps/api/stratify-data-api/pyproject.toml apps/api/stratify-data-api/uv.lock ./

# Copy the files for the app
COPY apps/api/stratify-data-api /app

# Install the dependencies for the app
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked

FROM python:3.13-slim-bookworm
# Setup a non-root user
RUN groupadd --system --gid 999 nonroot \
 && useradd --system --gid 999 --uid 999 --create-home nonroot

# Copy the application from the builder
COPY --from=builder --chown=nonroot:nonroot /app /app

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"

# Use the non-root user to run our application
USER nonroot
WORKDIR /app

EXPOSE 3000
CMD ["python", "-m", "src.main"]